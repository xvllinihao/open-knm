#!/usr/bin/env node

/* eslint-disable @typescript-eslint/no-require-imports */

/**
 * 脚本：合并新生成的词汇到现有词汇表
 */

import fs from 'fs';
import path from 'path';

const EXISTING_VOCAB_PATH = path.join(__dirname, '../src/data/vocabulary.json');
const NEW_VOCAB_PATH = path.join(__dirname, '../new-vocabulary.json');
const BACKUP_PATH = path.join(__dirname, '../src/data/vocabulary.backup.json');

function loadJSON(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    console.error(`❌ 无法读取文件 ${filePath}:`, error.message);
    process.exit(1);
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
    throw new Error(`无效的 category: ${item.category}，必须是 ${validCategories.join(', ')} 之一`);
  }
  
  if (item.level !== 'A2') {
    throw new Error(`level 必须是 'A2'`);
  }
}

function main() {
  console.log('📚 开始合并词汇表...\n');
  
  // 检查新词汇文件是否存在
  if (!fs.existsSync(NEW_VOCAB_PATH)) {
    console.error(`❌ 找不到新词汇文件: ${NEW_VOCAB_PATH}`);
    console.log('\n💡 提示：请将 NotebookLM 生成的 JSON 保存为 new-vocabulary.json 并放在项目根目录');
    process.exit(1);
  }
  
  // 读取现有词汇
  console.log('📖 读取现有词汇表...');
  const existingVocab = loadJSON(EXISTING_VOCAB_PATH);
  console.log(`   现有词汇数量: ${existingVocab.length}\n`);
  
  // 读取新词汇
  console.log('📖 读取新生成的词汇...');
  const newVocab = loadJSON(NEW_VOCAB_PATH);
  console.log(`   新词汇数量: ${newVocab.length}\n`);
  
  // 创建现有词汇的索引（基于 id 和 dutch）
  const existingIds = new Set(existingVocab.map(item => item.id));
  const existingDutch = new Set(existingVocab.map(item => item.dutch.toLowerCase().trim()));
  
  // 找出新词汇中不存在的单词
  const toAdd = [];
  const duplicates = [];
  const invalid = [];
  
  console.log('🔍 检查新词汇...\n');
  
  for (let i = 0; i < newVocab.length; i++) {
    const item = newVocab[i];
    
    try {
      // 清理 dutch 字段（移除多余的括号和空格）
      if (item.dutch) {
        item.dutch = item.dutch.replace(/\s*\([^)]*\)\s*/g, '').trim();
      }
      
      // 验证格式
      validateVocabularyItem(item);
      
      // 检查是否已存在
      const idExists = existingIds.has(item.id);
      const dutchLower = item.dutch.toLowerCase().trim();
      const dutchExists = existingDutch.has(dutchLower);
      
      if (idExists || dutchExists) {
        duplicates.push({
          index: i + 1,
          id: item.id,
          dutch: item.dutch,
          reason: idExists ? 'id 已存在' : 'dutch 单词已存在'
        });
      } else {
        toAdd.push(item);
        existingIds.add(item.id);
        existingDutch.add(dutchLower);
      }
    } catch (error) {
      invalid.push({
        index: i + 1,
        id: item.id || '未知',
        dutch: item.dutch || '未知',
        error: error.message
      });
    }
  }
  
  // 输出统计信息
  console.log('📊 检查结果：\n');
  console.log(`   ✅ 可添加的新单词: ${toAdd.length}`);
  console.log(`   ⚠️  重复的单词: ${duplicates.length}`);
  console.log(`   ❌ 格式错误的单词: ${invalid.length}\n`);
  
  // 显示重复的单词
  if (duplicates.length > 0) {
    console.log('⚠️  重复的单词（将被跳过）：');
    duplicates.slice(0, 10).forEach(dup => {
      console.log(`   - [${dup.index}] ${dup.dutch} (${dup.id}) - ${dup.reason}`);
    });
    if (duplicates.length > 10) {
      console.log(`   ... 还有 ${duplicates.length - 10} 个重复单词`);
    }
    console.log('');
  }
  
  // 显示格式错误的单词
  if (invalid.length > 0) {
    console.log('❌ 格式错误的单词（将被跳过）：');
    invalid.forEach(inv => {
      console.log(`   - [${inv.index}] ${inv.dutch} (${inv.id}): ${inv.error}`);
    });
    console.log('');
  }
  
  // 如果没有新单词可添加
  if (toAdd.length === 0) {
    console.log('ℹ️  没有新单词需要添加。');
    return;
  }
  
  // 按分类统计
  const byCategory = {};
  toAdd.forEach(item => {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
  });
  
  console.log('📋 新单词分类统计：');
  Object.entries(byCategory).forEach(([cat, count]) => {
    console.log(`   ${cat}: ${count} 个`);
  });
  console.log('');
  
  // 确认是否继续
  console.log(`\n💾 准备将 ${toAdd.length} 个新单词添加到词汇表...`);
  console.log(`   合并后总词汇数: ${existingVocab.length + toAdd.length}\n`);
  
  // 备份现有文件
  console.log('💾 备份现有词汇表...');
  saveJSON(BACKUP_PATH, existingVocab);
  
  // 合并词汇
  const mergedVocab = [...existingVocab, ...toAdd];
  
  // 按分类和 id 排序（可选）
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
  console.log(`   - 新增词汇: ${toAdd.length} 个`);
  console.log(`   - 总词汇数: ${mergedVocab.length} 个`);
  console.log(`   - 跳过重复: ${duplicates.length} 个`);
  console.log(`   - 格式错误: ${invalid.length} 个`);
  console.log(`\n💡 备份文件已保存到: ${BACKUP_PATH}`);
}

main();
