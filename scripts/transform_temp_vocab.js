
const fs = require('fs');
const path = require('path');

const SOURCE_FILE = path.join(__dirname, '../src/data/temp-vocabulary2.json');
const TARGET_FILE = path.join(__dirname, '../src/data/vocabulary.json');

const CATEGORY_MAP = {
    'Lesson 11': 'daily',
    'Lesson 12': 'daily',
    'Lesson 13': 'daily',
    'Lesson 14': 'daily',
    'Lesson 15': 'housing',
    'Lesson 16': 'health',
    'Lesson 17': 'daily',
    'Lesson 18': 'daily',
    'Lesson 19': 'work',
    'Lesson 20': 'daily'
};

function generateId(dutch) {
    return dutch.toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^a-z0-9-]/g, '')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '');
}

function determinePartOfSpeech(dutch, english) {
    if (dutch.startsWith('de ') || dutch.startsWith('het ')) return 'noun';
    if (english.startsWith('to ')) return 'verb';
    return 'other'; // default
}

function extractArticle(dutch) {
    if (dutch.startsWith('de ')) return 'de';
    if (dutch.startsWith('het ')) return 'het';
    return undefined;
}

function cleanDutch(dutch) {
    // Remove article for the main word field if it's a noun?
    // Looking at vocabulary.json:
    // "dutch": "man", "article": "de"
    // "dutch": "huis", "article": "het"
    // So yes, we should strip the article from the 'dutch' field if we extract it.
    if (dutch.startsWith('de ')) return dutch.substring(3);
    if (dutch.startsWith('het ')) return dutch.substring(4);
    return dutch;
}

function transform() {
    const rawData = fs.readFileSync(SOURCE_FILE, 'utf8');
    const sourceData = JSON.parse(rawData);
    
    const targetDataRaw = fs.readFileSync(TARGET_FILE, 'utf8');
    const targetData = JSON.parse(targetDataRaw);
    
    const existingIds = new Set(targetData.map(item => item.id));
    const newItems = [];

    sourceData.forEach(lesson => {
        const category = CATEGORY_MAP[lesson.lesson] || 'daily';
        
        lesson.words.forEach(word => {
            const article = extractArticle(word.dutch);
            const cleanWord = cleanDutch(word.dutch);
            const id = generateId(cleanWord);
            
            // Avoid duplicates
            if (existingIds.has(id)) {
                console.log(`Skipping duplicate: ${word.dutch} (${id})`);
                return;
            }
            
            const partOfSpeech = determinePartOfSpeech(word.dutch, word.english);

            const newItem = {
                id: id,
                dutch: cleanWord,
                category: category,
                level: 'A2',
                partOfSpeech: partOfSpeech,
                translations: {
                    en: word.english,
                    zh: "" // Placeholder
                },
                notes: {
                    en: "",
                    zh: ""
                },
                example: {
                    dutch: "",
                    en: "",
                    zh: ""
                }
            };

            if (article) {
                newItem.article = article;
            }

            newItems.push(newItem);
            existingIds.add(id);
        });
    });

    console.log(`Adding ${newItems.length} new words.`);
    
    const finalData = [...targetData, ...newItems];
    
    fs.writeFileSync(TARGET_FILE, JSON.stringify(finalData, null, 2), 'utf8');
    console.log('Done.');
}

transform();



