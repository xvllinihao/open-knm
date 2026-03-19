# Vocabulary Extraction Skill

Use this skill to extract vocabulary from PDF files and add them to the vocabulary list.

## Usage
```
/vocab-extract <pdf-path> [level]
```

Parameters:
- `pdf-path`: Path to the PDF file containing vocabulary
- `level`: Vocabulary level (default: "B1", can be "A2", "B1", etc.)

## Workflow Overview

```
PDF → pdftotext → Parse Script → OpenRouter API → vocabulary.json → Commit
```

## Step-by-Step Process

### Step 1: Extract Text from PDF

```bash
pdftotext -layout "<pdf-path>" /tmp/vocab_extracted.txt
```

### Step 2: Parse and Structure Vocabulary

Create a parsing script (e.g., `scripts/extract-contact-vocab.ts`) that:
- Identifies chapters (Hoofdstuk 1, 2, etc.)
- Detects part of speech groups (verba, substantieven, adjectieven)
- Parses Dutch words with articles and English translations
- Outputs to `/tmp/vocab_extracted.json`

Key patterns to detect:
```typescript
// Chapter detection
/^Hoofdstuk (\d+)/

// Part of speech detection
/(verba|substantieven|adjectieven|andere woorden)/

// Noun pattern: "de/het word (plural)"
/^(de|het)\s+(.+?)(?:\s+\((.+?)\))?$/

// Verb pattern: "verb (conjugation)"
/^(.+?)(?:\s+\((.+?)\))?$/
```

### Step 3: Add Chinese Translations and Examples

Create an integration script (e.g., `scripts/integrate-contact-vocab.js`) that:
- Reads extracted vocabulary from `/tmp/vocab_extracted.json`
- Uses OpenRouter API to generate Chinese translations AND example sentences
- Merges into `src/data/vocabulary.json`

**OpenRouter API Configuration:**
```javascript
const MODEL = 'openrouter/hunter-alpha';
const BATCH_SIZE = 8;
const DELAY_MS = 3000;
```

**Prompt Template:**
```
For each Dutch word/phrase below, provide:
1. Chinese translation (简体中文)
2. An example sentence in Dutch with English and Chinese translations

Return ONLY a valid JSON array. Each element should be:
{"zh": "中文翻译", "example": {"dutch": "Dutch sentence", "en": "English sentence", "zh": "Chinese sentence"}}

Words to process:
${JSON.stringify(items)}
```

**Run the script:**
```bash
OPENROUTER_API_KEY=sk-or-v1-xxx node scripts/integrate-contact-vocab.js
```

### Step 4: Verify and Commit

```bash
# Check statistics
wc -l src/data/vocabulary.json
grep -c '"level": "B1"' src/data/vocabulary.json

# Commit vocabulary changes
git add src/data/vocabulary.json
git commit -m "vocab: add XXX B1 words from [source-name]"
```

## Data Structure

Each vocabulary item follows this structure:
```typescript
{
  id: string;           // Unique ID (e.g., "word-dutch")
  dutch: string;        // Dutch word
  category: "daily" | "work" | "housing" | "health" | "admin";
  level: "A2" | "B1";
  partOfSpeech: "noun" | "verb" | "adjective" | "adverb" | "preposition" | "conjunction" | "pronoun" | "interjection" | "article" | "phrase";
  translations: {
    en: string;         // English translation
    zh: string;         // Chinese translation
  };
  notes: {
    en: string;         // English notes (conjugation, plural, etc.)
    zh: string;         // Chinese notes
  };
  example?: {
    dutch: string;
    en: string;
    zh: string;
  };
  article?: "de" | "het";  // For nouns only
}
```

## Category Mapping by Chapter

```javascript
const categoryMap = {
  1: 'work',      // Work and career
  2: 'daily',     // Daily life
  3: 'daily',     // Daily activities
  4: 'work',      // Work
  5: 'daily',     // Daily life
  6: 'health',    // Health
  7: 'housing',   // Housing
  8: 'admin',     // Administration
  9: 'daily',     // Daily life
  10: 'work',     // Work
  11: 'daily',    // Daily life
  12: 'health',   // Health
  13: 'admin',    // Administration
  14: 'daily',    // Daily life
  15: 'work',     // Work
  16: 'daily',    // Daily life
};
```

## Part of Speech Mapping

```javascript
const posMap = {
  'verba': 'verb',
  'substantieven': 'noun',
  'adjectieven': 'adjective',
  'andere woorden': 'adverb',
  'collocation': 'phrase',
  'phrase': 'phrase'
};
```

## Important Rules

1. **Always commit vocabulary changes** - Vocabulary data is precious
2. **Check for duplicates** - Skip words that already exist
3. **Skip collocations and phrases** - Handle separately if needed
4. **Rate limit API calls** - 3 second delay between batches
5. **Save progress after each batch** - Can resume if interrupted
6. **Generate examples in single API call** - More efficient than separate calls

## OpenRouter API

- **Model**: `openrouter/hunter-alpha` (free, high quality)
- **API Key**: Get at https://openrouter.ai/keys
- **Stored in**: `.claude/settings.local.json`

## Example Scripts

Reference scripts from this project:
- `scripts/extract-contact-vocab.ts` - Parse PDF text to JSON
- `scripts/integrate-contact-vocab.js` - Add Chinese + examples, merge to vocabulary.json

## Quick Reference

```bash
# 1. Extract text
pdftotext -layout "input.pdf" /tmp/vocab.txt

# 2. Parse (customize script for your PDF format)
npx ts-node scripts/extract-contact-vocab.ts

# 3. Integrate with AI
OPENROUTER_API_KEY=xxx node scripts/integrate-contact-vocab.js

# 4. Commit
git add src/data/vocabulary.json && git commit -m "vocab: add B1 words"
```
