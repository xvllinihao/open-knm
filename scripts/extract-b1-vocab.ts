import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const VOCAB_JSON_PATH = path.join(process.cwd(), 'src/data/vocabulary.json');
const PDF_PATH = path.join(process.cwd(), 'Contact_nieuw_3_tb_woordenlijst_Engels.pdf');

interface VocabularyItem {
  id: string;
  dutch: string;
  translations: {
    en: string;
    zh: string;
  };
  notes: {
    en: string;
    zh: string;
  };
  category: "daily" | "work" | "housing" | "health" | "admin";
  level: "A2" | "B1";
  article?: "de" | "het";
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb" | "preposition" | "conjunction" | "pronoun" | "interjection" | "article";
  example?: {
    dutch: string;
    en: string;
    zh: string;
  };
}

// Category mapping based on content
function guessCategory(dutch: string, english: string): VocabularyItem['category'] {
  const enLower = english.toLowerCase();
  const nlLower = dutch.toLowerCase();

  // Health related
  if (/health|hospital|doctor|medicine|pain|body|tooth|teeth|pharmacy|patient|dentist|therapy|treatment/.test(enLower) ||
      /ziek|arts|apotheek|tand|lichaam|pijn|gezond|therapie|behandeling/.test(nlLower)) {
    return 'health';
  }

  // Work related
  if (/work|job|office|boss|colleague|meeting|company|manager|salary|employee|career|business|profession/.test(enLower) ||
      /werk|baan|kantoor|baas|collega|vergadering|bedrijf|manager|salaris|carrière|zakelijk/.test(nlLower)) {
    return 'work';
  }

  // Housing related
  if (/house|home|room|apartment|rent|live|neighbor|furniture|kitchen|bathroom|bedroom|garden|street/.test(enLower) ||
      /huis|woning|kamer|appartement|huur|wonen|buurt|meubel|keuken|badkamer|slaapkamer|tuin|straat/.test(nlLower)) {
    return 'housing';
  }

  // Admin/Government related
  if (/government|tax|official|document|form|law|court|police|insurance|bank|money|citizen|permit|license/.test(enLower) ||
      /belasting|overheid|officieel|document|formulier|wet|rechtbank|politie|verzekering|bank|geld|burger|vergunning/.test(nlLower)) {
    return 'admin';
  }

  return 'daily';
}

// Part of speech detection
function getPartOfSpeech(dutch: string, english: string): VocabularyItem['partOfSpeech'] {
  const enLower = english.toLowerCase();

  if (/^to\s+/.test(enLower)) return 'verb';
  if (/\b(very|quite|rather|too|so|really)\b/.test(enLower)) return 'adverb';
  if (/ly$/.test(enLower)) return 'adverb';
  if (/^(in|on|at|by|for|with|from|to|of|about|between|under|over|through|behind|before|after)\b/.test(enLower)) return 'preposition';
  if (/^(and|but|or|so|because|if|when|while|although|though)\b/.test(enLower)) return 'conjunction';
  if (/^(he|she|it|they|we|you|i|this|that|these|those|who|which|what|my|your|his|her)\b/i.test(enLower)) return 'pronoun';
  if (/\b(not|don't|never|always|sometimes|often|here|there|now|then|today)\b/.test(enLower)) return 'adverb';
  if (/^(wow|oh|hey|ouch|oops|hurray)\b/i.test(enLower)) return 'interjection';

  // Adjective patterns
  if (/-ed$|-ing$|-ful$|-less$|-ous$|-ive$|-al$|-ic$/.test(enLower)) return 'adjective';
  if (/\b(good|bad|big|small|new|old|young|long|short|high|low|beautiful|nice|great|important)\b/.test(enLower)) return 'adjective';

  return 'noun';
}

// Extract article (de/het) from Dutch word
function extractArticle(dutch: string): "de" | "het" | undefined {
  const match = dutch.match(/^(de|het)\s+/i);
  if (match) {
    return match[1].toLowerCase() as "de" | "het";
  }
  return undefined;
}

// Clean Dutch word (remove article prefix and plural forms)
function cleanDutchWord(dutch: string): string {
  return dutch
    .replace(/^(de|het)\s+/i, '')
    .replace(/\s*\([^)]*\)\s*$/, '')  // Remove parenthetical notes at end
    .trim();
}

// Parse vocabulary from PDF text
function parseVocabulary(text: string): Partial<VocabularyItem>[] {
  const lines = text.split('\n');
  const items: Partial<VocabularyItem>[] = [];

  let currentSection = '';
  let inVocabularySection = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();

    if (!line || line.length < 2) continue;

    // Skip page numbers
    if (/^\d+\s+[a-z]+$/.test(line.toLowerCase())) continue;
    if (/^[ivxlc]+\s*$/i.test(line)) continue;

    // Detect section headers - these appear as "verba    verbs" on the same line
    if (/verba\s{2,}verbs/i.test(line)) {
      currentSection = 'verb';
      inVocabularySection = true;
      continue;
    }
    if (/substantieven\s{2,}nouns/i.test(line)) {
      currentSection = 'noun';
      inVocabularySection = true;
      continue;
    }
    if (/adjectieven\s{2,}adjectives/i.test(line)) {
      currentSection = 'adjective';
      inVocabularySection = true;
      continue;
    }
    if (/bijwoorden\s{2,}adverbs/i.test(line)) {
      currentSection = 'adverb';
      inVocabularySection = true;
      continue;
    }
    if (/voorzetsels\s{2,}prepositions/i.test(line)) {
      currentSection = 'preposition';
      inVocabularySection = true;
      continue;
    }
    if (/voegwoorden\s{2,}conjunctions/i.test(line)) {
      currentSection = 'conjunction';
      inVocabularySection = true;
      continue;
    }
    if (/vaste combinaties\s{2,}fixed combinations/i.test(line)) {
      currentSection = 'phrase';
      inVocabularySection = true;
      continue;
    }
    if (/andere woorden\s{2,}other words/i.test(line)) {
      currentSection = 'other';
      inVocabularySection = true;
      continue;
    }
    // Single word headers
    if (/^(verba|verbs)\s*$/i.test(line)) {
      currentSection = 'verb';
      inVocabularySection = true;
      continue;
    }
    if (/^(substantieven|nouns)\s*$/i.test(line)) {
      currentSection = 'noun';
      inVocabularySection = true;
      continue;
    }
    if (/^(adjectieven|adjectives)\s*$/i.test(line)) {
      currentSection = 'adjective';
      inVocabularySection = true;
      continue;
    }

    // Skip headers
    if (/^(Nederlands|Engels|Andere taal|Woordenlijst|Hoofdstuk|Uitleg|Toelichting)\s*$/i.test(line)) {
      continue;
    }
    if (/^Hoofdstuk\s+\d+/i.test(line)) {
      inVocabularySection = false;
      continue;
    }

    // Skip lines that don't look like vocabulary entries
    if (!inVocabularySection) continue;
    if (line.length > 200) continue;  // Too long, probably a paragraph

    // Skip obvious non-vocabulary lines
    if (/^(de|het|een|the|a|an)\s{2,}(de|het|een|the|a|an)$/i.test(line)) continue;

    // Parse vocabulary entry - look for pattern: DutchWord   EnglishTranslation
    // Multiple spaces indicate column separation
    const parts = line.split(/\s{2,}/);

    if (parts.length >= 2) {
      const dutch = parts[0].trim();
      const english = parts[1].trim();

      // Skip if either part is empty or too short
      if (dutch.length < 2 || english.length < 2) continue;

      // Skip if it looks like a header
      if (/^(de|het|een)\s*$/i.test(dutch)) continue;
      if (/^(the|a|an)\s*$/i.test(english)) continue;

      // Determine part of speech
      let partOfSpeech: VocabularyItem['partOfSpeech'] = currentSection as VocabularyItem['partOfSpeech'];
      if (!['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'pronoun', 'interjection', 'article'].includes(partOfSpeech)) {
        partOfSpeech = getPartOfSpeech(dutch, english);
      }

      const article = extractArticle(dutch);
      const cleanDutch = cleanDutchWord(dutch);

      // Generate unique ID
      const id = cleanDutch.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .slice(0, 50);

      items.push({
        id,
        dutch: cleanDutch,
        translations: {
          en: english,
          zh: ''
        },
        notes: {
          en: '',
          zh: ''
        },
        category: guessCategory(cleanDutch, english),
        level: 'B1',
        article,
        partOfSpeech
      });
    }
  }

  return items;
}

// Remove duplicates by Dutch word
function removeDuplicates(items: Partial<VocabularyItem>[]): VocabularyItem[] {
  const seen = new Map<string, VocabularyItem>();

  for (const item of items) {
    if (!item.dutch) continue;

    const key = item.dutch.toLowerCase().trim();
    if (!seen.has(key)) {
      seen.set(key, item as VocabularyItem);
    }
  }

  return Array.from(seen.values());
}

// Translate using MyMemory API
async function translateToChinese(text: string): Promise<string> {
  const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=en|zh`;

  try {
    const response = await fetch(url);
    if (!response.ok) return '';

    const data = await response.json();
    if (data.responseStatus === 200 && data.responseData?.translatedText) {
      return data.responseData.translatedText;
    }
    return '';
  } catch {
    return '';
  }
}

// Clean English text for translation
function cleanEnglishForTranslation(english: string): string {
  return english
    .replace(/\s*\(±[^)]*\)/g, '')
    .replace(/\s*\(here:\s*[^)]*\)/g, '')
    .replace(/\s*\(to\s+[^)]*\)/g, '')
    .replace(/\s*\([^)]*\)\s*$/g, '')
    .replace(/^here:\s*/i, '')
    .replace(/\s*;\s*/g, ', ')
    .trim();
}

async function main() {
  console.log('=== B1 Vocabulary Extraction Script ===\n');

  // Step 1: Extract text from PDF
  console.log('Step 1: Extracting text from PDF...');
  let pdfText: string;
  try {
    pdfText = execSync(`pdftotext -layout "${PDF_PATH}" -`, { encoding: 'utf-8', maxBuffer: 50 * 1024 * 1024 });
    console.log(`  ✓ Extracted ${pdfText.length} characters`);
  } catch (error) {
    console.error('  ✗ Failed to extract PDF text. Make sure pdftotext is installed.');
    console.error('    Install with: brew install poppler');
    process.exit(1);
  }

  // Step 2: Parse vocabulary
  console.log('\nStep 2: Parsing vocabulary...');
  const rawItems = parseVocabulary(pdfText);
  console.log(`  ✓ Parsed ${rawItems.length} raw items`);

  // Step 3: Remove duplicates
  console.log('\nStep 3: Removing duplicates...');
  const uniqueNewItems = removeDuplicates(rawItems);
  console.log(`  ✓ ${uniqueNewItems.length} unique items`);

  // Step 4: Load existing vocabulary
  console.log('\nStep 4: Loading existing vocabulary...');
  const existingVocab: VocabularyItem[] = JSON.parse(fs.readFileSync(VOCAB_JSON_PATH, 'utf-8'));
  const existingDutch = new Set(existingVocab.map(v => v.dutch.toLowerCase()));
  console.log(`  ✓ Loaded ${existingVocab.length} existing items`);

  // Step 5: Filter out items that already exist
  console.log('\nStep 5: Filtering existing items...');
  const newItems = uniqueNewItems.filter(item =>
    !existingDutch.has(item.dutch.toLowerCase())
  );
  console.log(`  ✓ ${newItems.length} truly new items (${uniqueNewItems.length - newItems.length} already exist)`);

  if (newItems.length === 0) {
    console.log('\nNo new vocabulary items to add.');
    return;
  }

  // Step 6: Translate to Chinese
  console.log('\nStep 6: Translating to Chinese...');
  let translated = 0;
  let failed = 0;

  for (let i = 0; i < newItems.length; i++) {
    const item = newItems[i];
    const english = cleanEnglishForTranslation(item.translations.en) || item.translations.en;

    const shortDutch = item.dutch.length > 25 ? item.dutch.slice(0, 25) + '...' : item.dutch;
    process.stdout.write(`\r  [${i + 1}/${newItems.length}] ${shortDutch.padEnd(30)} `);

    const translation = await translateToChinese(english);

    if (translation) {
      item.translations.zh = translation;
      translated++;
      process.stdout.write(`✓`);
    } else {
      failed++;
      process.stdout.write(`✗`);
    }

    // Rate limiting
    await new Promise(r => setTimeout(r, 300));

    // Save progress every 100 items
    if ((i + 1) % 100 === 0) {
      const combined = [...existingVocab, ...newItems.slice(0, i + 1)];
      fs.writeFileSync(VOCAB_JSON_PATH, JSON.stringify(combined, null, 2));
      console.log(`\n  [Progress saved: ${i + 1}/${newItems.length}]`);
    }
  }

  console.log(`\n  ✓ Translated: ${translated}, Failed: ${failed}`);

  // Step 7: Merge and save
  console.log('\nStep 7: Merging and saving...');
  const finalVocab = [...existingVocab, ...newItems];
  fs.writeFileSync(VOCAB_JSON_PATH, JSON.stringify(finalVocab, null, 2));
  console.log(`  ✓ Saved ${finalVocab.length} total items (${newItems.length} new B1 items)`);

  console.log('\n=== Extraction Complete ===');
  console.log(`Total A2 items: ${existingVocab.filter(v => v.level === 'A2').length}`);
  console.log(`Total B1 items: ${finalVocab.filter(v => v.level === 'B1').length}`);
  console.log(`\n⚠ Remember to commit the vocabulary changes!`);
  console.log(`   git add src/data/vocabulary.json`);
  console.log(`   git commit -m "vocab: add ${newItems.length} B1 words with Chinese translations"`);
}

main().catch(console.error);
