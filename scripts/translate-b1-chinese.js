#!/usr/bin/env node

/**
 * Script to translate B1 vocabulary English to Chinese using OpenRouter API
 * Saves progress after each batch so it can resume from where it left off
 *
 * Usage: OPENROUTER_API_KEY=your-key node scripts/translate-b1-chinese.js
 */

const fs = require('fs');
const path = require('path');

const VOCAB_FILE = path.join(__dirname, '../src/data/vocabulary.json');
const BATCH_SIZE = 10;
const DELAY_MS = 2000;
const MODEL = 'openrouter/hunter-alpha';

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

function readVocabulary() {
    return JSON.parse(fs.readFileSync(VOCAB_FILE, 'utf8'));
}

function writeVocabulary(data) {
    fs.writeFileSync(VOCAB_FILE, JSON.stringify(data, null, 2), 'utf8');
}

function getB1ItemsWithoutChinese(vocab) {
    return vocab.filter(item =>
        item.level === 'B1' &&
        (!item.translations.zh || item.translations.zh === '') &&
        !item.dutch.includes('.indd') &&
        !item.dutch.includes(':') &&
        item.dutch.length > 1
    );
}

// Clean English text for translation
function cleanEnglishForTranslation(english) {
    return english
        .replace(/\s*\(±[^)]*\)/g, '')
        .replace(/\s*\(here:\s*[^)]*\)/g, '')
        .replace(/\s*\(to\s+[^)]*\)/g, '')
        .replace(/\s*\([^)]*\)\s*$/g, '')
        .replace(/^here:\s*/i, '')
        .replace(/\s*;\s*/g, ', ')
        .trim();
}

// Batch translate using OpenRouter
async function batchTranslate(items, apiKey) {
    const wordsToTranslate = items.map(item => ({
        dutch: item.dutch,
        english: cleanEnglishForTranslation(item.translations.en) || item.translations.en
    }));

    const prompt = `Translate the following English words/phrases to Chinese (Simplified).
Return ONLY a valid JSON array with the same order, each element should be just the Chinese translation string.

Words to translate:
${JSON.stringify(wordsToTranslate.map(w => w.english))}

Return format example: ["中文1", "中文2", "中文3"]`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://github.com',
                'X-Title': 'Dutch Vocabulary Translator'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    {
                        role: 'user',
                        content: prompt
                    }
                ],
                temperature: 0.3,
                max_tokens: 2000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();

        // Clean up response
        const jsonContent = content.replace(/^```json\s*|\s*```$/g, '').replace(/^```\s*|\s*```$/g, '').trim();

        // Try to extract JSON array
        const arrayMatch = jsonContent.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
            return JSON.parse(arrayMatch[0]);
        }

        return JSON.parse(jsonContent);
    } catch (error) {
        throw new Error(`Translation failed: ${error.message}`);
    }
}

async function main() {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        log('Error: OPENROUTER_API_KEY environment variable is not set.', 'red');
        log('\nGet free API key at: https://openrouter.ai/keys', 'yellow');
        process.exit(1);
    }

    log('Starting B1 vocabulary Chinese translation...', 'blue');
    log(`Using model: ${MODEL}`, 'yellow');
    log('===============================================\n', 'blue');

    const vocab = readVocabulary();
    log(`Loaded ${vocab.length} vocabulary items.`, 'blue');

    // Get items needing translation (filters out garbage automatically)
    const itemsNeedingTranslation = vocab.filter(item =>
        item.level === 'B1' &&
        (!item.translations.zh || item.translations.zh === '') &&
        !item.dutch.includes('.indd') &&
        !item.dutch.match(/^\d{1,2}:\d{2}/) &&
        item.dutch.length > 1 &&
        item.translations.en.length > 1
    );

    log(`B1 items still needing Chinese translation: ${itemsNeedingTranslation.length}`, 'yellow');

    if (itemsNeedingTranslation.length === 0) {
        log('\nAll B1 items have Chinese translations!', 'green');
        process.exit(0);
    }

    // Show preview
    log('\nFirst 5 items to translate:', 'yellow');
    itemsNeedingTranslation.slice(0, 5).forEach((item, i) => {
        log(`  ${i + 1}. ${item.dutch} → ${item.translations.en}`, 'blue');
    });

    log(`\nProcessing ${itemsNeedingTranslation.length} items in batches of ${BATCH_SIZE}...`, 'yellow');
    log('Progress is saved after each batch.\n', 'yellow');

    let totalTranslated = 0;
    let totalFailed = 0;

    for (let batch = 0; batch < itemsNeedingTranslation.length; batch += BATCH_SIZE) {
        const batchEnd = Math.min(batch + BATCH_SIZE, itemsNeedingTranslation.length);
        const batchItems = itemsNeedingTranslation.slice(batch, batchEnd);

        log(`\n--- Batch ${Math.floor(batch / BATCH_SIZE) + 1} (${batch + 1}-${batchEnd} of ${itemsNeedingTranslation.length}) ---`, 'blue');

        try {
            const translations = await batchTranslate(batchItems, apiKey);

            if (translations.length !== batchItems.length) {
                log(`  Warning: Expected ${batchItems.length} translations, got ${translations.length}`, 'yellow');
            }

            // Apply translations and save immediately
            for (let i = 0; i < batchItems.length; i++) {
                const item = batchItems[i];
                const translation = translations[i];

                if (translation && typeof translation === 'string') {
                    const vocabIndex = vocab.findIndex(v => v.id === item.id);
                    if (vocabIndex !== -1) {
                        vocab[vocabIndex].translations.zh = translation;
                        totalTranslated++;
                        log(`  ✓ ${item.dutch}: ${translation}`, 'green');
                    }
                } else {
                    totalFailed++;
                    log(`  ✗ ${item.dutch}: No translation`, 'red');
                }
            }

            // SAVE PROGRESS IMMEDIATELY after each batch
            writeVocabulary(vocab);
            log(`\n💾 Progress saved! (${totalTranslated} translated so far)`, 'green');

        } catch (error) {
            totalFailed += batchItems.length;
            log(`  ✗ Batch failed: ${error.message}`, 'red');
            log(`  Progress already saved. You can re-run to continue.`, 'yellow');
        }

        // Delay between batches
        if (batchEnd < itemsNeedingTranslation.length) {
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
    }

    // Final summary
    log('\n===============================================', 'blue');
    log(`\n✓ Total translated this run: ${totalTranslated}`, 'green');
    log(`✗ Total failed: ${totalFailed}`, totalFailed > 0 ? 'red' : 'green');

    // Check final status
    const finalVocab = readVocabulary();
    const remaining = finalVocab.filter(v =>
        v.level === 'B1' &&
        (!v.translations.zh || v.translations.zh === '') &&
        !v.dutch.includes('.indd')
    ).length;

    log(`\nB1 items still needing translation: ${remaining}`, remaining > 0 ? 'yellow' : 'green');
    log(`\nDone! Vocabulary saved to: ${VOCAB_FILE}`, 'green');
}

main().catch(error => {
    log(`\nFatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});
