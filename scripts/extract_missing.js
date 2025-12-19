
const fs = require('fs');
const path = require('path');

const VOCAB_FILE = path.join(__dirname, '../src/data/vocabulary.json');
const OUTPUT_FILE = path.join(__dirname, '../src/data/missing_vocab.json');

const vocab = JSON.parse(fs.readFileSync(VOCAB_FILE, 'utf8'));

const missing = vocab.filter(item => item.translations.zh === "" || !item.translations.zh);

console.log(`Found ${missing.length} items with missing zh translation.`);

fs.writeFileSync(OUTPUT_FILE, JSON.stringify(missing, null, 2), 'utf8');



