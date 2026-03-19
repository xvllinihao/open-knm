#!/usr/bin/env node

/**
 * Script to integrate Contact_nieuw_3 vocabulary into the project
 * - Adds Chinese translations using AI
 * - Generates example sentences
 * - Merges into vocabulary.json
 *
 * Usage: OPENROUTER_API_KEY=your-key node scripts/integrate-contact-vocab.js
 */

const fs = require('fs');
const path = require('path');

const EXTRACTED_FILE = '/tmp/contact_vocab_extracted.json';
const VOCAB_FILE = path.join(__dirname, '../src/data/vocabulary.json');
const BATCH_SIZE = 8;
const DELAY_MS = 3000;
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

// Category mapping based on chapter topics
function getCategory(chapter) {
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
    return categoryMap[chapter] || 'daily';
}

// Part of speech mapping
function mapPartOfSpeech(pos) {
    const posMap = {
        'verb': 'verb',
        'noun': 'noun',
        'adjective': 'adjective',
        'other': 'adverb',
        'collocation': 'phrase',
        'phrase': 'phrase'
    };
    return posMap[pos] || 'other';
}

// Clean Dutch word (remove conjugation info, articles for ID)
function cleanDutchForId(dutch) {
    return dutch
        .replace(/\s*\(.*?\)/g, '')  // Remove parentheses content
        .replace(/^(de|het)\s+/i, '')  // Remove articles
        .replace(/\s+/g, '-')  // Replace spaces with hyphens
        .toLowerCase()
        .replace(/[^a-z0-9-]/g, '');  // Remove special chars
}

// Generate unique ID
function generateId(dutch, existingIds) {
    let baseId = cleanDutchForId(dutch);
    let id = baseId;
    let counter = 1;

    while (existingIds.has(id)) {
        id = `${baseId}-${counter}`;
        counter++;
    }

    return id;
}

// Batch process with AI
async function batchProcess(items, apiKey) {
    const prompt = `For each Dutch word/phrase below, provide:
1. Chinese translation (简体中文)
2. An example sentence in Dutch with English and Chinese translations

Return ONLY a valid JSON array. Each element should be:
{"zh": "中文翻译", "example": {"dutch": "Dutch sentence", "en": "English sentence", "zh": "Chinese sentence"}}

Words to process:
${JSON.stringify(items.map(item => ({
    dutch: item.dutch,
    english: item.english,
    partOfSpeech: item.partOfSpeech
})))}

Important:
- Example sentences should be natural and use the word correctly
- For nouns, use articles (de/het) in the example
- For verbs, conjugate them naturally in sentences
- Keep examples simple but meaningful (B1 level)`;

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${apiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://github.com',
                'X-Title': 'Dutch Vocabulary Integration'
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 4000
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API error ${response.status}: ${errorText}`);
        }

        const data = await response.json();
        const content = data.choices[0].message.content.trim();

        // Clean up response
        const jsonContent = content
            .replace(/^```json\s*|\s*```$/g, '')
            .replace(/^```\s*|\s*```$/g, '')
            .trim();

        // Extract JSON array
        const arrayMatch = jsonContent.match(/\[[\s\S]*\]/);
        if (arrayMatch) {
            return JSON.parse(arrayMatch[0]);
        }

        return JSON.parse(jsonContent);
    } catch (error) {
        throw new Error(`AI processing failed: ${error.message}`);
    }
}

async function main() {
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
        log('Error: OPENROUTER_API_KEY environment variable is not set.', 'red');
        log('\nGet free API key at: https://openrouter.ai/keys', 'yellow');
        process.exit(1);
    }

    log('Starting Contact_nieuw_3 vocabulary integration...', 'blue');
    log(`Using model: ${MODEL}`, 'yellow');
    log('===============================================\n', 'blue');

    // Load extracted vocabulary
    const extracted = JSON.parse(fs.readFileSync(EXTRACTED_FILE, 'utf8'));
    log(`Loaded ${extracted.length} extracted vocabulary items.`, 'blue');

    // Load existing vocabulary
    const existingVocab = JSON.parse(fs.readFileSync(VOCAB_FILE, 'utf8'));
    log(`Loaded ${existingVocab.length} existing vocabulary items.`, 'blue');

    // Create set of existing IDs and Dutch words for deduplication
    const existingIds = new Set(existingVocab.map(v => v.id));
    const existingDutch = new Set(existingVocab.map(v => v.dutch.toLowerCase()));

    // Filter out duplicates and unwanted entries
    const newItems = extracted.filter(item => {
        // Skip collocations and phrases for now (they need special handling)
        if (item.partOfSpeech === 'collocation' || item.partOfSpeech === 'phrase') {
            return false;
        }

        // Skip if Dutch word already exists
        const dutchClean = item.dutch.toLowerCase().replace(/\s*\(.*?\)/g, '').replace(/^(de|het)\s+/i, '');
        if (existingDutch.has(dutchClean) || existingDutch.has(item.dutch.toLowerCase())) {
            return false;
        }

        // Skip invalid entries
        if (!item.dutch || item.dutch.length < 2 || item.dutch.includes('.indd')) {
            return false;
        }

        return true;
    });

    log(`New items to add (excluding duplicates, collocations, phrases): ${newItems.length}`, 'yellow');

    if (newItems.length === 0) {
        log('\nNo new items to add!', 'green');
        process.exit(0);
    }

    // Show preview
    log('\nFirst 5 items to process:', 'yellow');
    newItems.slice(0, 5).forEach((item, i) => {
        log(`  ${i + 1}. ${item.dutch} (${item.partOfSpeech}) → ${item.english}`, 'blue');
    });

    log(`\nProcessing ${newItems.length} items in batches of ${BATCH_SIZE}...`, 'yellow');
    log('Progress is saved after each batch.\n', 'yellow');

    let totalAdded = 0;
    let totalFailed = 0;

    for (let batch = 0; batch < newItems.length; batch += BATCH_SIZE) {
        const batchEnd = Math.min(batch + BATCH_SIZE, newItems.length);
        const batchItems = newItems.slice(batch, batchEnd);

        log(`\n--- Batch ${Math.floor(batch / BATCH_SIZE) + 1} (${batch + 1}-${batchEnd} of ${newItems.length}) ---`, 'blue');

        try {
            const aiResults = await batchProcess(batchItems, apiKey);

            if (aiResults.length !== batchItems.length) {
                log(`  Warning: Expected ${batchItems.length} results, got ${aiResults.length}`, 'yellow');
            }

            // Process each item
            for (let i = 0; i < batchItems.length; i++) {
                const item = batchItems[i];
                const aiResult = aiResults[i];

                if (!aiResult || !aiResult.zh) {
                    totalFailed++;
                    log(`  ✗ ${item.dutch}: No AI result`, 'red');
                    continue;
                }

                // Create new vocabulary entry
                const newEntry = {
                    id: generateId(item.dutch, existingIds),
                    dutch: item.dutch,
                    category: getCategory(item.chapter),
                    level: 'B1',
                    partOfSpeech: mapPartOfSpeech(item.partOfSpeech),
                    translations: {
                        en: item.english,
                        zh: aiResult.zh
                    },
                    notes: {
                        en: item.conjugation ? `Conjugation: ${item.conjugation}` : (item.plural ? `Plural: ${item.plural}` : ''),
                        zh: ''
                    },
                    example: aiResult.example || {
                        dutch: '',
                        en: '',
                        zh: ''
                    }
                };

                // Add article for nouns
                if (item.partOfSpeech === 'noun') {
                    const articleMatch = item.dutch.match(/^(de|het)\s/i);
                    if (articleMatch) {
                        newEntry.article = articleMatch[1];
                    }
                }

                // Add to vocabulary
                existingVocab.push(newEntry);
                existingIds.add(newEntry.id);
                totalAdded++;

                log(`  ✓ ${item.dutch}: ${aiResult.zh}`, 'green');
            }

            // Save progress immediately
            fs.writeFileSync(VOCAB_FILE, JSON.stringify(existingVocab, null, 2), 'utf8');
            log(`\n💾 Progress saved! (${totalAdded} items added so far)`, 'green');

        } catch (error) {
            totalFailed += batchItems.length;
            log(`  ✗ Batch failed: ${error.message}`, 'red');
        }

        // Delay between batches
        if (batchEnd < newItems.length) {
            await new Promise(resolve => setTimeout(resolve, DELAY_MS));
        }
    }

    // Final summary
    log('\n===============================================', 'blue');
    log(`\n✓ Total items added: ${totalAdded}`, 'green');
    log(`✗ Total failed: ${totalFailed}`, totalFailed > 0 ? 'red' : 'green');
    log(`\nTotal vocabulary items: ${existingVocab.length}`, 'blue');
    log(`\nDone! Vocabulary saved to: ${VOCAB_FILE}`, 'green');
}

main().catch(error => {
    log(`\nFatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});
