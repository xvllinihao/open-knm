import { useState, useRef, useEffect, useCallback } from 'react';

type SpeechState = {
  isListening: boolean;
  transcript: string;
  isSupported: boolean;
  error: string | null;
};

export function useWebSpeech() {
  const [state, setState] = useState<SpeechState>({
    isListening: false,
    transcript: '',
    isSupported: false,
    error: null,
  });

  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // TTS Setup
      if ('speechSynthesis' in window) {
        synthesisRef.current = window.speechSynthesis;
      }

      // STT Capability Check
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

      if (SpeechRecognition) {
        setState((prev) => ({ ...prev, isSupported: true }));
      } else {
        setState((prev) => ({ ...prev, isSupported: false, error: 'Speech recognition not supported in this browser.' }));
      }
    }
  }, []);

  const speak = useCallback((text: string, rate: number = 0.85, lang: string = 'nl-NL') => {
    if (synthesisRef.current) {
      // Cancel any ongoing speech
      synthesisRef.current.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.rate = rate; // Use the provided rate
      synthesisRef.current.speak(utterance);
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
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) return;

    // Stop any existing instance
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true; 
      recognition.interimResults = true; 
      recognition.lang = 'nl-NL'; 

      recognition.onstart = () => {
        setState((prev) => ({ ...prev, isListening: true, error: null }));
      };

      recognition.onresult = (event: any) => {
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

      recognition.onerror = (event: any) => {
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
