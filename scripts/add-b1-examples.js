#!/usr/bin/env node

/**
 * Script to generate Dutch example sentences for B1 vocabulary items
 * Usage: node scripts/add-b1-examples.js
 *
 * Required environment variables:
 * - OPENAI_API_KEY: Your OpenAI API key
 */

const fs = require('fs');
const path = require('path');

// Configuration
const VOCAB_FILE = path.join(__dirname, '../src/data/vocabulary.json');
const BATCH_SIZE = 10; // Process 10 items at a time
const DELAY_MS = 1000; // Delay between batches to avoid rate limits

// Colors for console output
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

// Read vocabulary file
function readVocabulary() {
    const content = fs.readFileSync(VOCAB_FILE, 'utf8');
    return JSON.parse(content);
}

// Write vocabulary file
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

// Generate example using OpenAI API
async function generateExample(OpenAI, item) {
    const prompt = `Generate a natural Dutch example sentence for the B1 level vocabulary word below.

Word: ${item.dutch}
Part of speech: ${item.partOfSpeech}
English meaning: ${item.translations.en}
Chinese meaning: ${item.translations.zh}
Category: ${item.category}

Return ONLY a JSON object in this exact format (no markdown, no explanation):
{
  "dutch": "Dutch sentence using the word in context",
  "en": "English translation of the sentence",
  "zh": "Chinese translation of the sentence"
}

Requirements:
- The sentence should be appropriate for B1 level learners
- Show the word in a natural, everyday context
- The Dutch sentence must be grammatically correct
- Keep sentences simple but natural (10-15 words)`;

    try {
        const response = await OpenAI.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'system',
                    content: 'You are a Dutch language teacher. Generate natural, grammatically correct example sentences for vocabulary learning. Always respond with valid JSON only.'
                },
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 300
        });

        const content = response.choices[0].message.content.trim();
        // Remove markdown code blocks if present
        const jsonContent = content.replace(/^```json\s*|\s*```$/g, '').trim();
        return JSON.parse(jsonContent);
    } catch (error) {
        throw new Error(`API call failed for ${item.dutch}: ${error.message}`);
    }
}

// Process items in batches
async function processBatch(OpenAI, items, vocab, start, end) {
    let updated = 0;
    let failed = [];

    for (let i = start; i < end && i < items.length; i++) {
        const item = items[i];
        try {
            log(`[${i + 1}/${items.length}] Generating example for: ${item.dutch}`, 'blue');
            const example = await generateExample(OpenAI, item);

            // Update the vocabulary item
            const vocabIndex = vocab.findIndex(v => v.id === item.id);
            if (vocabIndex !== -1) {
                vocab[vocabIndex].example = example;
                updated++;
                log(`  ✓ Generated: "${example.dutch}"`, 'green');
            }
        } catch (error) {
            failed.push({ word: item.dutch, error: error.message });
            log(`  ✗ Failed: ${error.message}`, 'red');
        }

        // Small delay between requests
        if (i < end - 1) {
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
    }

    return { updated, failed };
}

// Main function
async function main() {
    // Check for API key
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
        log('Error: OPENAI_API_KEY environment variable is not set.', 'red');
        log('Please set it with: export OPENAI_API_KEY=your-key-here', 'yellow');
        log('Or add it to your .env.local file', 'yellow');
        process.exit(1);
    }

    // Dynamic import for OpenAI
    let OpenAI;
    try {
        const openaiModule = await import('openai');
        OpenAI = openaiModule.default;
    } catch (error) {
        log('Error: OpenAI package not found. Install it with: npm install openai', 'red');
        process.exit(1);
    }

    const openai = new OpenAI({ apiKey });

    log('Starting B1 vocabulary example generation...', 'blue');
    log('===============================================\n', 'blue');

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

    // Confirm before proceeding
    log(`This will generate examples for ${itemsNeedingExamples.length} items.`, 'yellow');
    log('Press Ctrl+C to cancel, or wait 3 seconds to start...', 'yellow');

    await new Promise(resolve => setTimeout(resolve, 3000));

    // Process in batches
    let totalUpdated = 0;
    const allFailed = [];

    for (let batch = 0; batch < itemsNeedingExamples.length; batch += BATCH_SIZE) {
        const end = Math.min(batch + BATCH_SIZE, itemsNeedingExamples.length);
        log(`\n--- Batch ${Math.floor(batch / BATCH_SIZE) + 1} (${batch + 1}-${end}) ---`, 'blue');

        const { updated, failed } = await processBatch(openai, itemsNeedingExamples, vocab, batch, end);
        totalUpdated += updated;
        allFailed.push(...failed);

        // Save after each batch
        writeVocabulary(vocab);
        log(`Saved progress. Total updated: ${totalUpdated}/${itemsNeedingExamples.length}`, 'green');

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

    log(`\nDone! Updated vocabulary saved to: ${VOCAB_FILE}`, 'green');
}

// Run
main().catch(error => {
    log(`\nFatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});
