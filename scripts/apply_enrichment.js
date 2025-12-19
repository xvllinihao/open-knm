
const fs = require('fs');
const path = require('path');

const VOCAB_FILE = path.join(__dirname, '../src/data/vocabulary.json');
const ENRICHMENT_DATA = require('./enrichment_data.js');

const vocab = JSON.parse(fs.readFileSync(VOCAB_FILE, 'utf8'));

let updatedCount = 0;

const updatedVocab = vocab.map(item => {
    const enrichment = ENRICHMENT_DATA[item.id] || ENRICHMENT_DATA[item.dutch]; // Try matching by ID or Dutch word if ID differs slightly
    
    if (enrichment) {
        let changed = false;
        if (!item.translations.zh) {
            item.translations.zh = enrichment.zh;
            changed = true;
        }
        // Always update example if it's empty or check if we want to overwrite
        if (!item.example || !item.example.dutch || item.example.dutch === "") {
            item.example = enrichment.example;
            changed = true;
        } else if (item.example && (!item.example.zh || item.example.zh === "")) {
             item.example.zh = enrichment.example.zh;
             item.example.en = enrichment.example.en; // Ensure EN is also there if we update ZH
             changed = true;
        }

        if (changed) {
            updatedCount++;
        }
    }
    return item;
});

console.log(`Updated ${updatedCount} items.`);

fs.writeFileSync(VOCAB_FILE, JSON.stringify(updatedVocab, null, 2), 'utf8');



