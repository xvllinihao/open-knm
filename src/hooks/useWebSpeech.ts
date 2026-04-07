import { useState, useRef, useEffect, useCallback } from 'react';

type SpeechState = {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
};

// Define minimal types for Web Speech API
interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onstart: ((this: SpeechRecognition, ev: Event) => void) | null;
  onresult: ((this: SpeechRecognition, ev: SpeechRecognitionEvent) => void) | null;
  onerror: ((this: SpeechRecognition, ev: SpeechRecognitionErrorEvent) => void) | null;
  onend: ((this: SpeechRecognition, ev: Event) => void) | null;
}

interface SpeechRecognitionEvent {
  resultIndex: number;
  results: {
    length: number;
    [index: number]: {
      isFinal: boolean;
      [index: number]: {
        transcript: string;
      };
    };
  };
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

// Extend window to include SpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: {
      new (): SpeechRecognition;
    };
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export function useWebSpeech() {
  const [state, setState] = useState<SpeechState>({
    isListening: false,
    transcript: '',
    isSupported: false,
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const voicesHandlerRef = useRef<(() => void) | null>(null);
  const voiceTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sentencePauseRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // TTS Setup
      if ('speechSynthesis' in window) {
        synthesisRef.current = window.speechSynthesis;
      }

      // STT Capability Check
      const SpeechRecognitionCtor =
        window.SpeechRecognition || window.webkitSpeechRecognition;

      if (SpeechRecognitionCtor) {
        // Use a timeout to avoid synchronous state update warning
        setTimeout(() => {
            setState((prev) => ({ ...prev, isSupported: true }));
        }, 0);
      } else {
        setTimeout(() => {
            setState((prev) => ({ ...prev, isSupported: false, error: 'Speech recognition not supported in this browser.' }));
        }, 0);
      }
    }
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        if (voicesHandlerRef.current) {
          window.speechSynthesis.removeEventListener('voiceschanged', voicesHandlerRef.current);
        }
        if (voiceTimeoutRef.current) {
          clearTimeout(voiceTimeoutRef.current);
        }
        window.speechSynthesis.cancel();
      }
      if (sentencePauseRef.current) clearTimeout(sentencePauseRef.current);
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const speak = useCallback((text: string, rate: number = 0.85, lang: string = 'nl-NL') => {
    if (!synthesisRef.current) return;

    synthesisRef.current.cancel();
    if (sentencePauseRef.current) { clearTimeout(sentencePauseRef.current); sentencePauseRef.current = null; }
    if (voicesHandlerRef.current) {
      synthesisRef.current.removeEventListener('voiceschanged', voicesHandlerRef.current);
      voicesHandlerRef.current = null;
    }
    if (voiceTimeoutRef.current) { clearTimeout(voiceTimeoutRef.current); voiceTimeoutRef.current = null; }

    // Split into sentences so we can add natural pauses between them
    const sentences = text.match(/[^.!?]+[.!?]*/g)?.map(s => s.trim()).filter(Boolean) ?? [text];

    const speakWithVoices = (voices: SpeechSynthesisVoice[]) => {
      const targetVoice =
        voices.find(v => v.lang === lang) ||
        voices.find(v => v.lang.startsWith(lang.split('-')[0]));

      let idx = 0;
      const next = () => {
        if (idx >= sentences.length) return;
        const utt = new SpeechSynthesisUtterance(sentences[idx]);
        utt.lang = lang;
        utt.rate = rate;
        if (targetVoice) utt.voice = targetVoice;
        utt.onend = () => { idx++; sentencePauseRef.current = setTimeout(next, 550); };
        synthesisRef.current?.speak(utt);
      };
      next();
    };

    const voices = synthesisRef.current.getVoices();
    if (voices.length > 0) {
      speakWithVoices(voices);
    } else {
      const handleVoicesChanged = () => {
        const updatedVoices = synthesisRef.current?.getVoices() || [];
        if (updatedVoices.length > 0) {
          if (voiceTimeoutRef.current) { clearTimeout(voiceTimeoutRef.current); voiceTimeoutRef.current = null; }
          synthesisRef.current?.removeEventListener('voiceschanged', handleVoicesChanged);
          voicesHandlerRef.current = null;
          speakWithVoices(updatedVoices);
        }
      };
      voicesHandlerRef.current = handleVoicesChanged;
      synthesisRef.current.addEventListener('voiceschanged', handleVoicesChanged);
      voiceTimeoutRef.current = setTimeout(() => {
        if (voicesHandlerRef.current) {
          synthesisRef.current?.removeEventListener('voiceschanged', voicesHandlerRef.current);
          voicesHandlerRef.current = null;
          speakWithVoices([]);
        }
      }, 3000);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null; // Cleanup
    }
    setState((prev) => ({ ...prev, isListening: false }));
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognitionCtor =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognitionCtor) return;

    // Stop any existing instance
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    try {
      const recognition = new SpeechRecognitionCtor();
      recognition.continuous = true; 
      recognition.interimResults = true; 
      recognition.lang = 'nl-NL'; 

      recognition.onstart = () => {
        setState((prev) => ({ ...prev, isListening: true, error: null }));
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let finalTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            finalTranscript += event.results[i][0].transcript;
          }
        }
        setState((prev) => ({ ...prev, transcript: finalTranscript }));
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error', event.error);
        // Ignore 'no-speech' errors as they just mean silence
        if (event.error === 'no-speech') {
            return;
        }
        setState((prev) => ({ 
          ...prev, 
          isListening: false, 
          error: event.error === 'not-allowed' ? 'Microphone access denied' : event.error 
        }));
      };

      recognition.onend = () => {
        setState((prev) => ({ ...prev, isListening: false }));
        recognitionRef.current = null;
      };

      recognitionRef.current = recognition;
      recognition.start();
    } catch (e) {
      console.error("Failed to start recognition:", e);
      setState((prev) => ({ ...prev, error: "Failed to start recording" }));
    }
  }, []);

  return {
    ...state,
    speak,
    startListening,
    stopListening,
  };
}
