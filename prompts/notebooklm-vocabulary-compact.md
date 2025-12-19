# 生成荷兰语词汇表（紧凑版）

生成荷兰语单词JSON数组，格式如下：

```json
[{"id":"单词id","dutch":"荷兰语","category":"daily|work|housing|health|admin","level":"A2","translations":{"en":"英文","zh":"中文"},"notes":{"en":"英文注释","zh":"中文注释"}}]
```

**分类**: daily(日常), work(工作), housing(住房), health(医疗), admin(行政)

**要求**:
- 实用优先，荷兰特色词汇优先
- 假朋友需标注"FALSE FRIEND"
- notes包含使用场景/搭配/文化背景
- 避免基础词汇重复

**示例**:
```json
[{"id":"lekker","dutch":"lekker","category":"daily","level":"A2","translations":{"en":"tasty/nice/good","zh":"好吃的/舒服的/好的"},"notes":{"en":"Versatile: food, weather, sleep, feeling","zh":"万能词：食物、天气、睡眠、感觉"}},{"id":"gezellig","dutch":"gezellig","category":"daily","level":"A2","translations":{"en":"cozy/sociable","zh":"温馨/热闹"},"notes":{"en":"Quintessentially Dutch. No direct translation.","zh":"荷兰文化代表词，难直译"}}]
```

**输出**: 生成尽可能多的单词（目标100+），直接输出JSON数组，不要其他文字。


