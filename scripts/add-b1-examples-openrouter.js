#!/usr/bin/env node

/**
 * Script to generate Dutch example sentences for B1 vocabulary items
 * Uses OpenRouter API (has free models available)
 *
 * Usage: OPENROUTER_API_KEY=your-key node scripts/add-b1-examples-openrouter.js
 *
 * Get free API key at: https://openrouter.ai/keys
 * Free models available: google/gemma-3-4b-it, meta-llama/llama-3-8b-instruct, etc.
 */

const fs = require('fs');
const path = require('path');

// Configuration
const VOCAB_FILE = path.join(__dirname, '../src/data/vocabulary.json');
const BATCH_SIZE = 10;
const DELAY_MS = 1000;

// Free models on OpenRouter (choose one)
const MODELS = {
    // Google Gemma (good quality, some free tier)
    gemma: 'google/gemma-3-4b-it:free',
    // Meta Llama 3 8B (popular, good for general tasks)
    llama3_8b: 'meta-llama/llama-3-8b-instruct:free',
    // Llama 3 70B (better quality, check if free)
    llama3_70b: 'meta-llama/llama-3-70b-instruct:free',
    // Mistral 7B
    mistral: 'mistralai/mistral-7b-instruct:free',
};

// Default model (you can change this)
const DEFAULT_MODEL = MODELS.gemma;

// Colors
const colors = {
    reset: '\x1b[0m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[36m',
    red: '\x1b[31m'
};

function log(message, color = 'reset') {
    console.log(`${colors[color]}${message}${colors.reset}`);
}

// Read/write files
function readVocabulary() {
    const content = fs.readFileSync(VOCAB_FILE, 'utf8');
    return JSON.parse(content);
}

function writeVocabulary(data) {
    fs.writeFileSync(VOCAB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

// Get B1 items without examples
function getB1ItemsWithoutExamples(vocab) {
    return vocab.filter(item =>
        item.level === 'B1' &&
        (!item.example || !item.example.dutch || item.example.dutch === '')
    );
}

// Generate example using OpenRouter
async function generateExample(item, apiKey, model = DEFAULT_MODEL) {
    const prompt = `Generate a natural Dutch example sentence for this B1 vocabulary word.

Word: ${item.dutch}
Part of speech: ${item.partOfSpeech}
English meaning: ${item.translations.en}
Chinese meaning: ${item.translations.zh}

Requirements:
- Create a simple, natural sentence for B1 level Dutch learners
- The sentence must show the word in a realistic everyday context
- Dutch grammar must be 100% correct
- Keep the sentence between 8-15 words
- Make it practical and useful for daily conversation

Return ONLY valid JSON (no markdown, no explanation):
{
  "dutch": "Dutch sentence here",
  "en": "English translation",
  "zh": "Chinese translation"
}`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://github.com', // Required by OpenRouter
                'X-Title': 'Dutch Vocabulary Generator'
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    {
                        role: 'system',
                        content: 'You are an expert Dutch language teacher. Create grammatically correct, natural example sentences for vocabulary learning. Always respond with valid JSON only.'
                    },
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.7,
                max_tokens: 300
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();

        // Clean up response (remove markdown code blocks if present)
        const jsonContent = content.replace(/^```json\s*|\s*```$/g, '').replace(/^```\s*|\s*```$/g, '').trim();

        return JSON.parse(jsonContent);
    } catch (error) {
        throw new Error(`API call failed: ${error.message}`);
    }
}

// Process items in batches
async function processBatch(items, vocab, start, end, apiKey, model) {
    let updated = 0;
    let failed = [];

    for (let i = start; i < end && i < items.length; i++) {
        const item = items[i];
        try {
            log(`[${i + 1}/${items.length}] ${item.dutch} (${item.translations.en})`, 'blue');

            const example = await generateExample(item, apiKey, model);

            // Update vocabulary item
            const vocabIndex = vocab.findIndex(v => v.id === item.id);
            if (vocabIndex !== -1) {
                vocab[vocabIndex].example = example;
                updated++;
                log(`  ✓ "${example.dutch}"`, 'green');
            }
        } catch (error) {
            failed.push({ word: item.dutch, error: error.message });
            log(`  ✗ ${error.message}`, 'red');
        }

        // Delay between requests
        if (i < end - 1) {
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
    }

    return { updated, failed };
}

// Main function
async function main() {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        log('Error: OPENROUTER_API_KEY environment variable is not set.', 'red');
        log('\n=== How to get a FREE OpenRouter API key ===', 'yellow');
        log('1. Go to: https://openrouter.ai/', 'blue');
        log('2. Sign up (free)', 'blue');
        log('3. Go to: https://openrouter.ai/keys', 'blue');
        log('4. Create a new API key', 'blue');
        log('\nThen run:', 'yellow');
        log('  OPENROUTER_API_KEY=your-key-here node scripts/add-b1-examples-openrouter.js', 'blue');
        process.exit(1);
    }

    log('Starting B1 vocabulary example generation (OpenRouter)...', 'blue');
    log('===============================================\n', 'blue');
    log(`Using model: ${DEFAULT_MODEL}`, 'yellow');
    log('Free models available on OpenRouter:', 'yellow');
    log('  - google/gemma-3-4b-it:free', 'blue');
    log('  - meta-llama/llama-3-8b-instruct:free', 'blue');
    log('  - mistralai/mistral-7b-instruct:free\n', 'blue');

    // Read vocabulary
    const vocab = readVocabulary();
    log(`Loaded ${vocab.length} vocabulary items.`, 'blue');

    // Get B1 items without examples
    const itemsNeedingExamples = getB1ItemsWithoutExamples(vocab);
    log(`Found ${itemsNeedingExamples.length} B1 items without examples.\n`, 'yellow');

    if (itemsNeedingExamples.length === 0) {
        log('All B1 items already have examples!', 'green');
        process.exit(0);
    }

    // Show preview
    log('Preview of first 3 items:', 'yellow');
    itemsNeedingExamples.slice(0, 3).forEach((item, i) => {
        log(`  ${i + 1}. ${item.dutch} - ${item.translations.en}`, 'blue');
    });

    log(`\nProcessing ${itemsNeedingExamples.length} items...`, 'yellow');
    log('Press Ctrl+C to cancel, or wait 3 seconds to start...\n', 'yellow');

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Process in batches
    let totalUpdated = 0;
    const allFailed = [];

    for (let batch = 0; batch < itemsNeedingExamples.length; batch += BATCH_SIZE) {
        const end = Math.min(batch + BATCH_SIZE, itemsNeedingExamples.length);
        log(`\n--- Batch ${Math.floor(batch / BATCH_SIZE) + 1} (${batch + 1}-${end}) ---`, 'blue');

        const { updated, failed } = await processBatch(itemsNeedingExamples, vocab, batch, end, apiKey, DEFAULT_MODEL);
        totalUpdated += updated;
        allFailed.push(...failed);

        // Save after each batch
        writeVocabulary(vocab);
        log(`Saved: ${totalUpdated}/${itemsNeedingExamples.length} completed`, 'green');

        // Delay between batches
        if (end < itemsNeedingExamples.length) {
            await new Promise(resolve => setTimeout(resolve, DELAY_MS * 2));
        }
    }

    // Summary
    log('\n===============================================', 'blue');
    log(`\n✓ Successfully updated: ${totalUpdated} items`, 'green');

    if (allFailed.length > 0) {
        log(`\n✗ Failed: ${allFailed.length} items`, 'red');
        allFailed.forEach(({ word, error }) => {
            log(`  - ${word}: ${error}`, 'red');
        });
    }

    log(`\nDone! Saved to: ${VOCAB_FILE}`, 'green');
}

// Run
main().catch(error => {
    log(`\nFatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});
