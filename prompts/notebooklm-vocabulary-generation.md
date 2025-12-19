# NotebookLM Prompt: 生成荷兰语词汇表

## 任务
请按照以下格式生成 500 个荷兰语单词，这些单词应该对在荷兰生活、工作、学习的外国人（特别是中文和英文使用者）有用。

## 输出格式要求

每个单词必须严格按照以下 JSON 格式输出：

```json
{
  "id": "单词的唯一标识符（通常是小写的荷兰语单词，如果是短语则用连字符连接）",
  "dutch": "荷兰语单词或短语",
  "category": "分类（必须是以下之一：daily, work, housing, health, admin）",
  "level": "A2",
  "translations": {
    "en": "英文翻译（如果有多个意思，用斜杠分隔）",
    "zh": "中文翻译（如果有多个意思，用斜杠分隔）"
  },
  "notes": {
    "en": "英文注释（包含使用场景、文化背景、常见搭配、假朋友警告等实用信息）",
    "zh": "中文注释（包含使用场景、文化背景、常见搭配、假朋友警告等实用信息）"
  }
}
```

## 分类说明

- **daily**: 日常生活词汇（购物、交通、天气、食物、社交等）
- **work**: 工作相关词汇（求职、办公室、会议、合同等）
- **housing**: 住房相关词汇（租房、买房、维修、家具等）
- **health**: 健康医疗词汇（看病、保险、症状、药物等）
- **admin**: 行政事务词汇（政府、证件、税务、注册等）

## 内容要求

1. **实用性优先**：选择在荷兰生活最常用、最重要的单词
2. **文化特色**：优先包含荷兰特有的概念和表达（如 gezellig, borrel, statiegeld 等）
3. **假朋友警告**：如果单词看起来像英文但意思不同，必须在 notes 中标注 "FALSE FRIEND"
4. **使用场景**：notes 中应包含实际使用场景、常见搭配、文化背景
5. **难度控制**：所有单词标注为 A2 级别（初级到中级）
6. **避免重复**：不要生成已经存在的常见单词（如基本的颜色、数字、问候语等，除非有特殊文化含义）

## 输出要求

1. 输出一个完整的 JSON 数组，包含 500 个单词对象
2. 每个单词的 id 必须唯一
3. 确保 JSON 格式完全正确，可以直接解析
4. 翻译要准确，注释要有实用价值
5. 尽量覆盖各个分类，但可以有所侧重（daily 类别可以多一些）

## 示例

```json
[
  {
    "id": "lekker",
    "dutch": "lekker",
    "category": "daily",
    "level": "A2",
    "translations": {
      "en": "tasty / nice / good",
      "zh": "好吃的 / 舒服的 / 好的"
    },
    "notes": {
      "en": "Very versatile. Used for food, weather (\"lekker weer\"), sleep (\"lekker slapen\"), or even a feeling (\"ik voel me niet lekker\").",
      "zh": "非常万能。形容食物好吃、天气好(\"lekker weer\")、睡得香(\"lekker slapen\")，或身体舒服。"
    }
  },
  {
    "id": "gezellig",
    "dutch": "gezellig",
    "category": "daily",
    "level": "A2",
    "translations": {
      "en": "cozy / sociable / fun",
      "zh": "温馨 / 热闹 / 惬意"
    },
    "notes": {
      "en": "Quintessentially Dutch. Describes a nice atmosphere with people. No direct translation.",
      "zh": "荷兰文化代表词。形容温馨、社交、愉快的氛围。很难直译。"
    }
  }
]
```

## 开始生成

请现在开始生成 500 个荷兰语单词，严格按照上述格式输出一个完整的 JSON 数组。



