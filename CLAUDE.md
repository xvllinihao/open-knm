# Open KNM Archive - Project Guidelines

## Project Overview

This is a Dutch vocabulary learning application for Chinese speakers preparing for the KNM (Kennis van de Nederlandse Maatschappij) exam and civic integration (Inburgering).

### Tech Stack
- Next.js 14 with App Router
- TypeScript
- Tailwind CSS
- Supabase for authentication and data storage

### Key Files
- `src/data/vocabulary.json` - Core vocabulary data (MOST IMPORTANT)
- `src/data/vocabulary.ts` - Vocabulary type definitions and exports
- `src/components/VocabularyList.tsx` - Main vocabulary display component
- `src/components/FlashcardGame.tsx` - Flashcard practice component

## Vocabulary Data Guidelines

### ⚠️ CRITICAL: Vocabulary Data Protection

**Vocabulary data is the most valuable asset of this repository.**

When making ANY changes to vocabulary data:

1. **ALWAYS commit immediately after changes**
   ```bash
   git add src/data/vocabulary.json
   git commit -m "vocab: [description of changes]"
   ```

2. **Never force push or reset commits that contain vocabulary changes**

3. **Always backup before major vocabulary operations**

4. **Validate data integrity after changes**

### Vocabulary Data Structure

Each vocabulary item must have:
- `id`: Unique identifier (format: `word-dutch`)
- `dutch`: The Dutch word
- `translations.en`: English translation
- `translations.zh`: Chinese translation
- `notes.en` and `notes.zh`: Optional notes
- `category`: One of: daily, work, housing, health, admin
- `level`: A2 or B1
- `article`: Optional (de/het for nouns)
- `partOfSpeech`: noun, verb, adjective, adverb, preposition, conjunction, pronoun, interjection, article
- `example`: Optional example sentence object with dutch, en, zh

## Available Skills

### /vocab-extract
Extract vocabulary from PDF files and add them to the vocabulary list with:
- Chinese translations (auto-generated)
- Example sentences (AI-generated)
- Proper categorization

Usage: `/vocab-extract <pdf-path> [level]`

## Code Style

- Use TypeScript for all new code
- Follow existing component patterns
- Keep components modular and reusable
- Use Tailwind CSS for styling

## Localization

The app supports:
- Chinese (zh) - default
- English (en)

Text content is defined in `src/lib/uiTexts.ts`

## Git Commit Guidelines

### ⚠️ CRITICAL: Always Check Before Commit

**Before EVERY commit, you MUST run lint and build checks:**

```bash
npm run lint && npm run build
```

- If lint or build fails, FIX the issues BEFORE committing
- NEVER commit code that fails lint or build
- Exception: vocabulary.json changes only need lint check (no build needed if only data changed)

### Commit Format

- Use conventional commit format
- Vocabulary changes: `vocab: [description]`
- Feature changes: `feat: [description]`
- Bug fixes: `fix: [description]`
- Documentation: `docs: [description]`

### Commit Messages for Vocabulary
- `vocab: add 870 B1 words from Contact_nieuw_3`
- `vocab: add Chinese translations to B1 words`
- `vocab: add example sentences for B1 vocabulary`
- `vocab: fix duplicate entries`
- `vocab: update category assignments`
