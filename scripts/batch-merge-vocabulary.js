#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * 脚本：分批合并词汇表
 * 
 * 使用方法：
 * 1. 将 NotebookLM 分批生成的 JSON 保存为 new-vocabulary-1.json, new-vocabulary-2.json 等
 * 2. 运行: node scripts/batch-merge-vocabulary.js
 * 
 * 或者：
 * 1. 将所有批次的 JSON 合并到一个文件 new-vocabulary-all.json
 * 2. 运行: node scripts/merge-vocabulary.js
 */

import fs from 'fs';
import path from 'path';

const EXISTING_VOCAB_PATH = path.join(__dirname, '../src/data/vocabulary.json');
const NEW_VOCAB_DIR = path.join(__dirname, '..');
const BACKUP_PATH = path.join(__dirname, '../src/data/vocabulary.backup.json');

function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ 无法读取文件 ${filePath}:`, error.message);
    return null;
  }
}

function saveJSON(filePath, data) {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + '\n', 'utf-8');
    console.log(`✅ 已保存到 ${filePath}`);
  } catch (error) {
    console.error(`❌ 无法保存文件 ${filePath}:`, error.message);
    process.exit(1);
  }
}

function validateVocabularyItem(item) {
  const required = ['id', 'dutch', 'category', 'level', 'translations', 'notes'];
  const missing = required.filter(field => !item[field]);
  
  if (missing.length > 0) {
    throw new Error(`缺少必需字段: ${missing.join(', ')}`);
  }
  
  if (!item.translations.en || !item.translations.zh) {
    throw new Error('translations 必须包含 en 和 zh');
  }
  
  if (!item.notes.en || !item.notes.zh) {
    throw new Error('notes 必须包含 en 和 zh');
  }
  
  const validCategories = ['daily', 'work', 'housing', 'health', 'admin'];
  if (!validCategories.includes(item.category)) {
    throw new Error(`无效的 category: ${item.category}`);
  }
  
  if (item.level !== 'A2') {
    throw new Error(`level 必须是 'A2'`);
  }
}

function findNewVocabFiles() {
  const files = fs.readdirSync(NEW_VOCAB_DIR);
  const vocabFiles = files
    .filter(f => f.startsWith('new-vocabulary') && f.endsWith('.json'))
    .map(f => path.join(NEW_VOCAB_DIR, f))
    .sort();
  
  return vocabFiles;
}

function main() {
  console.log('📚 开始分批合并词汇表...\n');
  
  // 查找所有新词汇文件
  const newVocabFiles = findNewVocabFiles();
  
  if (newVocabFiles.length === 0) {
    console.error('❌ 找不到新词汇文件！');
    console.log('\n💡 提示：请将 NotebookLM 生成的 JSON 保存为以下格式之一：');
    console.log('   - new-vocabulary-1.json, new-vocabulary-2.json, ...');
    console.log('   - new-vocabulary.json');
    console.log('   放在项目根目录');
    process.exit(1);
  }
  
  console.log(`📁 找到 ${newVocabFiles.length} 个新词汇文件：`);
  newVocabFiles.forEach((f, i) => {
    console.log(`   ${i + 1}. ${path.basename(f)}`);
  });
  console.log('');
  
  // 读取现有词汇
  console.log('📖 读取现有词汇表...');
  const existingVocab = loadJSON(EXISTING_VOCAB_PATH);
  console.log(`   现有词汇数量: ${existingVocab.length}\n`);
  
  // 创建现有词汇的索引
  const existingIds = new Set(existingVocab.map(item => item.id));
  const existingDutch = new Set(existingVocab.map(item => item.dutch.toLowerCase()));
  
  // 读取并处理所有新词汇文件
  let totalNew = 0;
  let totalDuplicates = 0;
  let totalInvalid = 0;
  const allToAdd = [];
  const allDuplicates = [];
  const allInvalid = [];
  
  for (const filePath of newVocabFiles) {
    console.log(`📖 处理文件: ${path.basename(filePath)}`);
    const newVocab = loadJSON(filePath);
    
    if (!newVocab || !Array.isArray(newVocab)) {
      console.error(`   ⚠️  跳过：不是有效的 JSON 数组\n`);
      continue;
    }
    
    console.log(`   包含 ${newVocab.length} 个单词`);
    
    for (let i = 0; i < newVocab.length; i++) {
      const item = newVocab[i];
      
      try {
        validateVocabularyItem(item);
        
        const idExists = existingIds.has(item.id);
        const dutchExists = existingDutch.has(item.dutch.toLowerCase());
        
        if (idExists || dutchExists) {
          allDuplicates.push({
            file: path.basename(filePath),
            index: i + 1,
            id: item.id,
            dutch: item.dutch,
            reason: idExists ? 'id 已存在' : 'dutch 单词已存在'
          });
          totalDuplicates++;
        } else {
          allToAdd.push(item);
          existingIds.add(item.id);
          existingDutch.add(item.dutch.toLowerCase());
          totalNew++;
        }
      } catch (error) {
        allInvalid.push({
          file: path.basename(filePath),
          index: i + 1,
          id: item.id || '未知',
          dutch: item.dutch || '未知',
          error: error.message
        });
        totalInvalid++;
      }
    }
    
    console.log(`   ✅ 可添加: ${allToAdd.length - (totalNew - newVocab.length + allDuplicates.filter(d => d.file === path.basename(filePath)).length)}`);
    console.log(`   ⚠️  重复: ${allDuplicates.filter(d => d.file === path.basename(filePath)).length}`);
    console.log(`   ❌ 错误: ${allInvalid.filter(d => d.file === path.basename(filePath)).length}\n`);
  }
  
  // 输出统计信息
  console.log('📊 总体统计：\n');
  console.log(`   ✅ 可添加的新单词: ${totalNew}`);
  console.log(`   ⚠️  重复的单词: ${totalDuplicates}`);
  console.log(`   ❌ 格式错误的单词: ${totalInvalid}\n`);
  
  // 显示重复的单词（前10个）
  if (allDuplicates.length > 0) {
    console.log('⚠️  重复的单词（前10个）：');
    allDuplicates.slice(0, 10).forEach(dup => {
      console.log(`   - [${dup.file}:${dup.index}] ${dup.dutch} (${dup.id}) - ${dup.reason}`);
    });
    if (allDuplicates.length > 10) {
      console.log(`   ... 还有 ${allDuplicates.length - 10} 个重复单词`);
    }
    console.log('');
  }
  
  // 显示格式错误的单词
  if (allInvalid.length > 0) {
    console.log('❌ 格式错误的单词：');
    allInvalid.forEach(inv => {
      console.log(`   - [${inv.file}:${inv.index}] ${inv.dutch} (${inv.id}): ${inv.error}`);
    });
    console.log('');
  }
  
  // 如果没有新单词可添加
  if (totalNew === 0) {
    console.log('ℹ️  没有新单词需要添加。');
    return;
  }
  
  // 按分类统计
  const byCategory = {};
  allToAdd.forEach(item => {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
  });
  
  console.log('📋 新单词分类统计：');
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} 个`);
  });
  console.log('');
  
  // 确认是否继续
  console.log(`\n💾 准备将 ${totalNew} 个新单词添加到词汇表...`);
  console.log(`   合并后总词汇数: ${existingVocab.length + totalNew}\n`);
  
  // 备份现有文件
  console.log('💾 备份现有词汇表...');
  saveJSON(BACKUP_PATH, existingVocab);
  
  // 合并词汇
  const mergedVocab = [...existingVocab, ...allToAdd];
  
  // 按分类和 id 排序
  mergedVocab.sort((a, b) => {
    if (a.category !== b.category) {
      const categoryOrder = ['daily', 'work', 'housing', 'health', 'admin'];
      return categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category);
    }
    return a.id.localeCompare(b.id);
  });
  
  // 保存合并后的词汇表
  console.log('💾 保存合并后的词汇表...');
  saveJSON(EXISTING_VOCAB_PATH, mergedVocab);
  
  console.log('\n✅ 合并完成！');
  console.log(`\n📝 总结：`);
  console.log(`   - 原有词汇: ${existingVocab.length} 个`);
  console.log(`   - 新增词汇: ${totalNew} 个`);
  console.log(`   - 总词汇数: ${mergedVocab.length} 个`);
  console.log(`   - 跳过重复: ${totalDuplicates} 个`);
  console.log(`   - 格式错误: ${totalInvalid} 个`);
  console.log(`\n💡 备份文件已保存到: ${BACKUP_PATH}`);
}

main();

