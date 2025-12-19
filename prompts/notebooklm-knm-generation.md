# KNM (Kennis van de Nederlandse Maatschappij) 核心词汇提取 Prompt

请将此 Prompt 发送给 NotebookLM，并上传你的 KNM 学习资料（如 *Welkom in Nederland*, *Kom Verder*, 或 KNM 考试大纲 PDF）。

---

**角色**: 你是一位专业的荷兰语 KNM (荷兰社会知识) 考试辅导老师。

**任务**: 分析上传的 KNM 学习资料，提取出 **50-100 个** KNM 考试中最核心、最常考的专有名词和概念。

**过滤条件**:
1.  **排除**基础日常词汇（如 Lesson 1-20 中已有的 `fiets`, `eten`, `huis`, `moeder` 等简单词）。
2.  **专注**于 KNM 特有领域：荷兰历史、政治制度、地理水利、教育体系、医疗保险、工作法规、社会规范。

**输出格式**: 请严格按照以下 JSON 数组格式输出，不要包含 Markdown 代码块标记之外的多余文本。

```json
[
  {
    "dutch": "de polder",  // 荷兰语单词，名词请包含 de/het
    "english": "the polder",
    "chinese": "圩田 (填海造地)",
    "partOfSpeech": "noun", // noun, verb, adjective, other
    "article": "de", // 仅名词填写: de 或 het，其他词性留空或不写
    "category": "geography", // 从列表选择: history, politics, geography, education, health, work, culture, law
    "level": "A2",
    "example": {
      "dutch": "Flevoland is de grootste polder ter wereld.",
      "en": "Flevoland is the largest polder in the world.",
      "zh": "弗莱福兰是世界上最大的圩田。"
    }
  },
  {
    "dutch": "het eigen risico",
    "english": "the deductible / excess",
    "chinese": "自付额 (医疗保险)",
    "partOfSpeech": "noun",
    "article": "het",
    "category": "health",
    "level": "A2",
    "example": {
      "dutch": "Je moet eerst je eigen risico betalen voordat de verzekering betaalt.",
      "en": "You must pay your deductible first before the insurance pays.",
      "zh": "在保险赔付之前，你必须先支付自付额。"
    }
  }
]
```

**重点关注领域示例**:
-   **History**: Willem van Oranje, de Gouden Eeuw, Tweede Wereldoorlog, watersnoodramp.
-   **Politics**: democratie, grondwet, Tweede Kamer, minister-president, gemeente, verkiezingen.
-   **Geography**: Randstad, provincie, waterschap, dijk.
-   **Education**: leerplicht, basisschool, Cito-toets, mbo/hbo/wo.
-   **Health**: huisarts, zorgverzekering, consultatiebureau, apotheek.
-   **Work/Income**: uitkering (WW, bijstand), belastingdienst, toeslagen, contract.
-   **Society/Values**: gelijkheid, vrijheid van meningsuiting, discriminatie, integratie.

请生成 JSON 数据：



