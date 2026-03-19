#!/usr/bin/env npx ts-node
/**
 * Extract vocabulary from Contact_nieuw_3 PDF
 *
 * Usage: npx ts-node scripts/extract-contact-vocab.ts
 */

import * as fs from 'fs';

interface VocabularyEntry {
  dutch: string;
  english: string;
  partOfSpeech: string;
  chapter: number;
  article?: string; // de/het for nouns
  plural?: string;
  conjugation?: string; // for verbs
}

// Read the extracted text
const text = fs.readFileSync('/tmp/contact_vocab.txt', 'utf-8');
const lines = text.split('\n');

const entries: VocabularyEntry[] = [];
let currentChapter = 0;
let currentPartOfSpeech = '';

// Part of speech mapping
const posMapping: Record<string, string> = {
  'verba': 'verb',
  'substantieven': 'noun',
  'adjectieven': 'adjective',
  'andere woorden': 'other',
  'vaste combinaties': 'collocation',
  'zinnen, vragen en uitdrukkingen': 'phrase',
};

// Patterns
const chapterPattern = /^Hoofdstuk (\d+)/;
const posPattern = /^(verba|substantieven|adjectieven|andere woorden|vaste combinaties|zinnen, vragen en uitdrukkingen)\s+(verbs|nouns|adjectives|other words|collocations|sentences, questions and idioms)/;

function parseNounLine(dutch: string, english: string): Partial<VocabularyEntry> {
  // Pattern: "de/het word (plural)" or "de/het word (-)" or "word (pl.)"
  const nounPattern = /^(de|het)\s+(.+?)(?:\s+\((.+?)\))?$/;
  const match = dutch.match(nounPattern);

  if (match) {
    const article = match[1];
    const word = match[2].trim();
    const pluralInfo = match[3];

    return {
      dutch: word,
      article,
      plural: pluralInfo && pluralInfo !== '-' ? pluralInfo : undefined,
    };
  }

  // Handle plural-only words like "werkzaamheden (pl.)"
  const pluralOnlyPattern = /^(.+?)\s+\(pl\.\)$/;
  const pluralMatch = dutch.match(pluralOnlyPattern);
  if (pluralMatch) {
    return {
      dutch: pluralMatch[1],
      plural: '(plural only)',
    };
  }

  return { dutch };
}

function parseVerbLine(dutch: string, english: string): Partial<VocabularyEntry> {
  // Pattern: "verb (ik ...)" or "verb (het ...)"
  const verbPattern = /^(.+?)(?:\s+\((.+?)\))?$/;
  const match = dutch.match(verbPattern);

  if (match) {
    const word = match[1].trim();
    const conjugation = match[2];

    return {
      dutch: word,
      conjugation,
    };
  }

  return { dutch };
}

function parseAdjectiveLine(dutch: string, english: string): Partial<VocabularyEntry> {
  // Pattern: "adj (adj-e)"
  const adjPattern = /^(.+?)\s+\((.+?)\)?$/;
  const match = dutch.match(adjPattern);

  if (match) {
    return {
      dutch: match[1].trim(),
    };
  }

  return { dutch };
}

// Process lines
let i = 0;
while (i < lines.length) {
  const line = lines[i].trim();

  // Skip empty lines
  if (!line) {
    i++;
    continue;
  }

  // Check for chapter
  const chapterMatch = line.match(chapterPattern);
  if (chapterMatch) {
    currentChapter = parseInt(chapterMatch[1]);
    console.log(`Found Chapter ${currentChapter}`);
    i++;
    continue;
  }

  // Check for part of speech header
  const posMatch = line.match(posPattern);
  if (posMatch) {
    currentPartOfSpeech = posMapping[posMatch[1]] || posMatch[1];
    console.log(`  Part of speech: ${currentPartOfSpeech}`);
    i++;
    continue;
  }

  // Skip header lines and page numbers
  if (line.includes('Nederlands') && line.includes('Engels')) {
    i++;
    continue;
  }
  if (line.match(/^honderd/) || line.match(/^\d+$/)) {
    i++;
    continue;
  }
  if (line.includes('Contact_nieuw_3')) {
    i++;
    continue;
  }
  if (line === 'Woordenlijst per hoofdstuk') {
    i++;
    continue;
  }

  // Try to parse vocabulary entry
  // The layout is: Dutch column | English column
  // We need to detect the separation between columns

  // Skip if we haven't found a chapter or POS yet
  if (currentChapter === 0 || !currentPartOfSpeech) {
    i++;
    continue;
  }

  // For vocabulary entries, we need to look at the full line structure
  // In the extracted text, columns are separated by multiple spaces
  const columns = line.split(/\s{2,}/).filter(c => c.trim());

  if (columns.length >= 2 && currentPartOfSpeech !== 'collocation' && currentPartOfSpeech !== 'phrase') {
    const dutchPart = columns[0].trim();
    const englishPart = columns.slice(1).join(' ').trim();

    // Skip if it looks like a header or invalid
    if (dutchPart.toLowerCase() === 'nederlands' || englishPart.toLowerCase() === 'engels') {
      i++;
      continue;
    }

    let entry: Partial<VocabularyEntry> = { dutch: dutchPart, english: englishPart };

    // Parse based on part of speech
    if (currentPartOfSpeech === 'noun') {
      entry = { ...entry, ...parseNounLine(dutchPart, englishPart) };
    } else if (currentPartOfSpeech === 'verb') {
      entry = { ...entry, ...parseVerbLine(dutchPart, englishPart) };
    } else if (currentPartOfSpeech === 'adjective') {
      entry = { ...entry, ...parseAdjectiveLine(dutchPart, englishPart) };
    }

    entries.push({
      dutch: entry.dutch || dutchPart,
      english: entry.english || englishPart,
      partOfSpeech: currentPartOfSpeech,
      chapter: currentChapter,
      article: entry.article,
      plural: entry.plural,
      conjugation: entry.conjugation,
    });
  } else if (columns.length >= 1 && (currentPartOfSpeech === 'collocation' || currentPartOfSpeech === 'phrase')) {
    // Collocations and phrases may span multiple lines
    const fullLine = columns.join(' ').trim();

    // Try to split by common patterns
    // For collocations: "Dutch phrase  English translation"
    // For phrases: "Dutch phrase  English translation"

    // Look for the transition from Dutch to English
    // This is tricky - we'll use a heuristic based on common Dutch words

    entries.push({
      dutch: fullLine,
      english: '', // Will need manual review
      partOfSpeech: currentPartOfSpeech,
      chapter: currentChapter,
    });
  }

  i++;
}

console.log(`\nExtracted ${entries.length} entries`);

// Group by chapter for summary
const byChapter: Record<number, number> = {};
entries.forEach(e => {
  byChapter[e.chapter] = (byChapter[e.chapter] || 0) + 1;
});

console.log('\nEntries by chapter:');
Object.keys(byChapter).sort((a, b) => parseInt(a) - parseInt(b)).forEach(ch => {
  console.log(`  Chapter ${ch}: ${byChapter[parseInt(ch)]} entries`);
});

// Group by part of speech
const byPos: Record<string, number> = {};
entries.forEach(e => {
  byPos[e.partOfSpeech] = (byPos[e.partOfSpeech] || 0) + 1;
});

console.log('\nEntries by part of speech:');
Object.keys(byPos).forEach(pos => {
  console.log(`  ${pos}: ${byPos[pos]} entries`);
});

// Write to file
fs.writeFileSync('/tmp/contact_vocab_extracted.json', JSON.stringify(entries, null, 2));
console.log('\nWritten to /tmp/contact_vocab_extracted.json');

// Also write a simple CSV for review
const csv = entries.map(e =>
  `"${e.chapter}","${e.partOfSpeech}","${e.dutch}","${e.english}","${e.article || ''}","${e.plural || ''}","${e.conjugation || ''}"`
).join('\n');

const csvHeader = '"Chapter","Part of Speech","Dutch","English","Article","Plural","Conjugation"\n';
fs.writeFileSync('/tmp/contact_vocab_extracted.csv', csvHeader + csv);
console.log('Written to /tmp/contact_vocab_extracted.csv');
