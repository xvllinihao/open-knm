#!/usr/bin/env node

/**
 * Script to generate Dutch example sentences for B1 vocabulary items
 * Uses FREE translation APIs - no API key required!
 *
 * Usage: node scripts/add-b1-examples-free.js
 */

const fs = require('fs');
const path = require('path');

// Configuration
const VOCAB_FILE = path.join(__dirname, '../src/data/vocabulary.json');
const BATCH_SIZE = 5;
const DELAY_MS = 500;

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

// Template-based example generator
// This creates contextually appropriate examples based on word type
function generateTemplateExample(item) {
    const { dutch, translations, partOfSpeech, category } = item;

    // Templates by part of speech
    const templates = {
        noun: [
            { en: `The ${translations.en} is important.`, zh: `${translations.zh}很重要。` },
            { en: `I need a ${translations.en}.`, zh: `我需要一个${translations.zh}。` },
            { en: `This ${translations.en} is very good.`, zh: `这个${translations.zh}非常好。` },
            { en: `Where is the ${translations.en}?`, zh: `${translations.zh}在哪里？` },
            { en: `The ${translations.en} helps me.`, zh: `${translations.zh}帮助我。` }
        ],
        verb: [
            { en: `I want to ${translations.en} today.`, zh: `我今天想${translations.zh}。` },
            { en: `Can you ${translations.en}?`, zh: `你能${translations.zh}吗？` },
            { en: `She likes to ${translations.en}.`, zh: `她喜欢${translations.zh}。` },
            { en: `We should ${translations.en} more often.`, zh: `我们应该更经常${translations.zh}。` },
            { en: `Don't ${translations.en} that.`, zh: `不要${translations.zh}那个。` }
        ],
        adjective: [
            { en: `It is very ${translations.en}.`, zh: `它非常${translations.zh}。` },
            { en: `That looks ${translations.en}.`, zh: `那个看起来${translations.zh}。` },
            { en: `She is ${translations.en} and friendly.`, zh: `她既${translations.zh}又友好。` },
            { en: `Is it ${translations.en} enough?`, zh: `它足够${translations.zh}吗？` },
            { en: `This is the most ${translations.en} one.`, zh: `这是最${translations.zh}的一个。` }
        ],
        adverb: [
            { en: `She speaks ${translations.en}.`, zh: `她${translations.zh}说话。` },
            { en: `He works ${translations.en}.`, zh: `他${translations.zh}工作。` },
            { en: `They arrived ${translations.en}.`, zh: `他们${translations.zh}到达。` }
        ],
        preposition: [
            { en: `The book is ${translations.en} the table.`, zh: `书在桌子${translations.zh}。` },
            { en: `I go ${translations.en} work.`, zh: `我${translations.zh}去上班。` }
        ]
    };

    // Category-specific templates
    const categoryTemplates = {
        work: [
            { en: `At work, I often ${translations.en || 'use ' + translations.en}.`, zh: `在工作中，我经常${translations.zh || '使用' + translations.zh}。` },
            { en: `The ${translations.en} is useful for work.`, zh: `${translations.zh}对工作很有用。` }
        ],
        health: [
            { en: `My ${translations.en} is important.`, zh: `我的${translations.zh}很重要。` },
            { en: `How is your ${translations.en}?`, zh: `你的${translations.zh}怎么样？` }
        ],
        housing: [
            { en: `The ${translations.en} is in my house.`, zh: `${translations.zh}在我的房子里。` },
            { en: `I need a ${translations.en} for my home.`, zh: `我需要一个${translations.zh}放在家里。` }
        ]
    };

    // Select appropriate template
    let selectedTemplate;
    const templatesToUse = categoryTemplates[category] || templates[partOfSpeech] || templates.noun;

    // Use word-specific hash for consistent selection
    const hash = dutch.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    selectedTemplate = templatesToUse[hash % templatesToUse.length];

    return selectedTemplate;
}

// Free MyMemory Translation API
async function translateWithMyMemory(text, fromLang, toLang) {
    const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.responseStatus === 200 && data.responseData) {
            return data.responseData.translatedText;
        }

        // Fallback: return original if API fails
        return text;
    } catch (error) {
        log(`  Translation API error: ${error.message}. Using fallback.`, 'yellow');
        return text;
    }
}

// Simple Dutch sentence builder (rule-based fallback)
function buildDutchSentence(item, enSentence, zhSentence) {
    const { dutch, partOfSpeech, article } = item;

    // Simple word replacement patterns
    let dutchSentence = enSentence;

    // Common replacements
    const replacements = [
        { en: 'I ', nl: 'Ik ' },
        { en: 'you ', nl: 'jij ' },
        { en: 'he ', nl: 'hij ' },
        { en: 'she ', nl: 'zij ' },
        { en: 'we ', nl: 'wij ' },
        { en: 'they ', nl: 'zij ' },
        { en: 'the ', nl: 'de ' },
        { en: 'a ', nl: 'een ' },
        { en: 'an ', nl: 'een ' },
        { en: 'is ', nl: 'is ' },
        { en: 'are ', nl: 'zijn ' },
        { en: 'have ', nl: 'heb ' },
        { en: 'has ', nl: 'heeft ' },
        { en: 'want to ', nl: 'wil ' },
        { en: 'can ', nl: 'kan ' },
        { en: 'will ', nl: 'zal ' },
        { en: 'very ', nl: 'heel ' },
        { en: 'good', nl: 'goed' },
        { en: 'bad', nl: 'slecht' },
        { en: 'important', nl: 'belangrijk' },
        { en: 'need', nl: 'nodig' },
        { en: 'like', nl: 'hou van' },
        { en: 'love', nl: 'lief' },
        { en: 'work', nl: 'werk' },
        { en: 'home', nl: 'thuis' },
        { en: 'house', nl: 'huis' },
        { en: 'today', nl: 'vandaag' },
        { en: 'now', nl: 'nu' },
        { en: 'please', nl: 'alsjeblieft' },
        { en: 'thank', nl: 'dank' },
        { en: 'yes', nl: 'ja' },
        { en: 'no', nl: 'nee' },
    ];

    // Apply basic replacements
    replacements.forEach(({ en, nl }) => {
        const regex = new RegExp(en, 'gi');
        dutchSentence = dutchSentence.replace(regex, nl);
    });

    // Insert the Dutch word based on part of speech
    if (partOfSpeech === 'verb') {
        // For verbs, replace the first occurrence of "wil", "kan", etc. with the verb
        dutchSentence = dutchSentence.replace(/wil |kan |zal /, `${dutch} `);
    } else if (partOfSpeech === 'noun') {
        // For nouns, add article if available
        const withArticle = article ? `${article} ${dutch}` : dutch;
        dutchSentence = dutchSentence.replace(/de |een /, withArticle + ' ');
    } else {
        // For adjectives, adverbs, etc.
        const regex = new RegExp(`\\b${dutch.substring(0, 5)}.*?\\b`, 'i');
        // Just append the word in a simple way
        if (!dutchSentence.includes(dutch)) {
            dutchSentence = dutchSentence.replace(/very /, `${dutch} `);
        }
    }

    // Clean up
    dutchSentence = dutchSentence.replace(/\s+/g, ' ').trim();
    dutchSentence = dutchSentence.charAt(0).toUpperCase() + dutchSentence.slice(1);

    return dutchSentence;
}

// Generate example for a single item
async function generateExample(item) {
    // First, generate English template
    const template = generateTemplateExample(item);

    // Build Dutch sentence using translation
    const dutchSentence = await translateWithMyMemory(template.en, 'en', 'nl');

    return {
        dutch: dutchSentence,
        en: template.en,
        zh: template.zh
    };
}

// Process items in batches
async function processBatch(items, vocab, start, end) {
    let updated = 0;
    let failed = [];

    for (let i = start; i < end && i < items.length; i++) {
        const item = items[i];
        try {
            log(`[${i + 1}/${items.length}] Processing: ${item.dutch} (${item.translations.en})`, 'blue');
            const example = await generateExample(item);

            // Update the vocabulary item
            const vocabIndex = vocab.findIndex(v => v.id === item.id);
            if (vocabIndex !== -1) {
                vocab[vocabIndex].example = example;
                updated++;
                log(`  ✓ EN: "${example.en}"`, 'green');
                log(`  ✓ NL: "${example.dutch}"`, 'green');
                log(`  ✓ ZH: "${example.zh}"`, 'green');
            }
        } catch (error) {
            failed.push({ word: item.dutch, error: error.message });
            log(`  ✗ Failed: ${error.message}`, 'red');
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
    log('Starting B1 vocabulary example generation (FREE VERSION)...', 'blue');
    log('===============================================\n', 'blue');
    log('Using free MyMemory Translation API', 'yellow');
    log('Note: Quality may vary. Consider manual review.\n', 'yellow');

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
    log('Preview of first 3 items to process:', 'yellow');
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

        const { updated, failed } = await processBatch(itemsNeedingExamples, vocab, batch, end);
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
    log('\n⚠️  Please review the generated examples for quality.', 'yellow');
}

// Run
main().catch(error => {
    log(`\nFatal error: ${error.message}`, 'red');
    console.error(error);
    process.exit(1);
});
