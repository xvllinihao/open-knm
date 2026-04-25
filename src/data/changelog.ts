export type ChangelogItem = {
  version: string;
  date: string;
  title: Record<string, string>; // locale -> title
  description: Record<string, string>; // locale -> description
};

export const changelogData: ChangelogItem[] = [
  {
    version: "2.4.0",
    date: "2026-04-25",
    title: {
      zh: "闪卡模式精简：移除乱序模式，新增专注生词与复习模式",
      en: "Flashcard Modes Refined: Removed Random Mode, Added Focus & Review Modes",
    },
    description: {
      zh: "🎯 模式简化：移除乱序模式，保留三种核心模式——顺序背词、只背生词、复习模式。\n📝 顺序背词：按顺序学习新单词，自动保存学习进度，下次打开继续。\n📝 只背生词：专注未掌握的单词，随机抽取生词进行强化练习。\n📝 复习模式：混合复习已学单词（未知+已掌握），巩固记忆。\n💡 进度追踪：顺序背词模式保存进度，其他模式不保存（每次重新开始）。\n✨ 按钮说明：每个模式按钮现在带有简短说明，方便用户理解。",
      en: "🎯 Mode Refinement: Removed random mode, keeping three core modes—Sequential, New Words Only, and Review. \n📝 Sequential: Learn new words in order with auto-saved progress, resume where you left off.\n📝 New Words Only: Focus on unlearned words, randomly抽取未掌握的单词 for intensive practice.\n📝 Review Mode: Mixed review of learned words (unknown + known), strengthen memory retention.\n💡 Progress Tracking: Only Sequential mode preserves progress; other modes reset each session.\n✨ Mode Descriptions: Each mode button now includes a brief description for better user understanding.",
    },
  },
  {
    version: "2.3.0",
    date: "2026-04-07",
    title: {
      zh: "听力练习升级：男女声区分、句间停顿与更多练习题",
      en: "Listening Practice Upgrade: Gendered Voices, Sentence Pauses & More Exercises",
    },
    description: {
      zh: "🎧 男女声区分：公告题使用男声（Xander），留言题使用女声（Ellen），对话题自动按说话人切换声音与音调，听感更接近真实考试。\n⏸️ 自然停顿：每句话结束后自动停顿约 0.5 秒，跟读和理解更轻松；口语练习的题目朗读也同步优化。\n📋 显示原文：听力题新增「显示原文」切换按钮，随时可查看听力文本，对话题原文按说话人分色显示。\n📝 新增练习题：公告和对话各新增一道练习题（超市公告、问路对话），练习题总数从 3 道增加到 5 道。",
      en: "🎧 Gendered Voices: Announcements use male voice (Xander), messages use female voice (Ellen), and conversations automatically switch voice and pitch per speaker for a more realistic exam feel.\n⏸️ Natural Pauses: A ~0.5s pause is added between sentences for easier shadowing and comprehension; speaking practice playback is also improved.\n📋 Show Transcript: New toggle button to reveal the listening transcript at any time; dialogue transcripts are color-coded by speaker.\n📝 More Exercises: One new announcement (supermarket PA) and one new conversation (asking for directions) added — total exercises increased from 3 to 5.",
    },
  },
  {
    version: "2.2.0",
    date: "2026-04-02",
    title: {
      zh: "新增 A2 阅读与听力模拟，导航栏全面升级",
      en: "Added A2 Reading & Listening Practice, Navigation Upgrade",
    },
    description: {
      zh: "📖 阅读与听力模块：全新上线 A2 阅读和听力指南，包含考试技巧科普与各题型模拟练习。\n🎧 TTS 语音支持：听力练习现已支持浏览器原生 Text-to-Speech (TTS) 朗读功能。\n🎨 导航栏焕新：为所有导航项添加了精致的图标，并引入了“A2 备考”下拉菜单，将听、说、读、写四大模块整合，界面更清爽。\n✨ 首页 UI 优化：整合了考试技能卡片，优化了各功能入口的色彩搭配，并全局集成了官方模拟题入口。",
      en: "📖 Reading & Listening: Launched new A2 Reading and Listening guides, featuring exam strategies and practice exercises for all question types.\n🎧 TTS Audio Support: Listening exercises now support native browser Text-to-Speech (TTS) playback.\n🎨 Navigation Upgrade: Added elegant icons to all navigation items and introduced an 'A2 Exams' dropdown menu, unifying the four skill modules for a cleaner look.\n✨ Homepage UI: Consolidated exam skill cards, optimized feature card colors, and integrated the official practice exam banner site-wide.",
    },
  },
  {
    version: "2.1.1",
    date: "2026-03-19",
    title: {
      zh: "词汇表优化：B1 词汇界面简化",
      en: "Vocabulary List Update: Simplified B1 Interface",
    },
    description: {
      zh: "🎨 界面优化：B1 词汇表不再显示种类筛选器，因为 B1 词汇暂无分类，提供更简洁的浏览体验。",
      en: "🎨 UI Improvement: B1 vocabulary no longer shows category filter since B1 words don't have categories yet, providing a cleaner browsing experience.",
    },
  },
  {
    version: "2.1.0",
    date: "2026-03-18",
    title: {
      zh: "新增 B1 词汇表：免费开放 870+ 个进阶词汇",
      en: "Added B1 Vocabulary: 870+ Advanced Words Now Free",
    },
    description: {
      zh: "📚 B1 词汇免费开放：新增 743 个 B1 级别词汇，完全免费向所有用户开放。\n🎯 完整覆盖：从 A2 基础到 B1 进阶，总计 1191 个核心词汇（A2: 448 + B1: 743），助力荷兰语能力全面提升。\n📖 来源权威：词汇来源于官方 B1 教材 Contact nieuw 3，确保内容准确可靠。\n⚠️ 注意：B1 词汇暂无分类标签，种类筛选器仅对 A2 词汇有效。",
      en: "📚 B1 Vocabulary Now Free: Added 743 B1-level words, all completely free for all users.\n🎯 Complete Coverage: From A2 foundation to B1 advanced, 1191 core vocabulary words (A2: 448 + B1: 743) for comprehensive Dutch language improvement.\n📖 Authoritative Source: Vocabulary from official B1 textbook Contact nieuw 3, ensuring accurate and reliable content.\n⚠️ Note: B1 words don't have category labels yet. Category filter only applies to A2 vocabulary.",
    },
  },
  {
    version: "2.0.0",
    date: "2026-02-07",
    title: {
      zh: "口语练习全面升级：真实考试格式 + 学习资源",
      en: "Speaking Practice Major Update: Real Exam Format + Learning Resources",
    },
    description: {
      zh: "🎯 真实考试格式：问答题现在采用真实考试格式，先播放情景陈述（Context），然后提出双重问题（必须回答两个部分）。\n📚 学习资源：添加了 YouTube 推荐视频系列，帮助用户更好地准备口语考试。\n🎧 听力练习模式：新增「隐藏题目文本」选项，模拟真实考试中只能听题、不能看题的情况。\n⚡ 播放速度控制：为问题播放添加了独立的速度控制（0.5x/0.75x/1.0x），方便不同水平的用户练习。\n📝 题目优化：更新了所有问答题，涵盖日常生活、业余爱好、交通出行、社交邻里等真实场景。",
      en: "🎯 Real Exam Format: Q&A questions now follow the real exam format with context statements followed by two-part questions.\n📚 Learning Resources: Added recommended YouTube video series to help users prepare for the speaking exam.\n🎧 Listening Practice Mode: Added 'Hide question text' option to simulate real exam conditions where you can only listen, not read.\n⚡ Playback Speed Control: Added independent speed control (0.5x/0.75x/1.0x) for question playback to accommodate different skill levels.\n📝 Question Updates: Updated all Q&A questions covering real-life scenarios: daily life, hobbies, transportation, and social interactions.",
    },
  },
  {
    version: "1.9.0",
    date: "2025-12-31",
    title: {
      zh: "2025 KNM 考点更新",
      en: "2025 KNM Syllabus Update",
    },
    description: {
      zh: "根据 2025 年考试重点，补充了大量 KNM 细节知识。涵盖：工作合同 (ZZP/税务)、医疗 (转诊/自付额)、教育 (家长责任/特殊教育)、住房 (急诊/能源)、政治 (选举权/公投) 及社交礼仪等多个板块。",
      en: "Updated KNM content with 2025 exam focus points. Covers detailed additions in Work (ZZP/Tax), Healthcare (Referrals/Deductibles), Education (Parental Liability/Special Ed), Housing (Urgency/Energy), Politics (Voting Rights/Referendums), and Social Etiquette.",
    },
  },
  {
    version: "1.8.0",
    date: "2025-12-25",
    title: {
      zh: "闪卡词包功能上线",
      en: "Flashcard Pack Feature Released",
    },
    description: {
      zh: "新增了闪卡词包功能，可以无限刷词，支持乱序/顺序背词模式，复习模式 (随机抽题)，自动同步生词与学习进度。",
      en: "Added flashcard pack feature, allowing unlimited word practice with shuffle/sequential modes, review mode (random questions), and automatic sync of learned words.",
    },
  },
  {
    version: "1.7.0",
    date: "2025-12-19",
    title: {
      zh: "云端同步与闪卡升级",
      en: "Cloud Sync & Flashcards Update",
    },
    description: {
      zh: "✨ 重磅更新：支持登录账号，实现多端进度自动同步（KNM 阅读历史 + 词汇表 + 闪卡进度）。\n🔒 安全升级：引入 Turnstile 人机验证，加强账号与心愿单安全性。\n🃏 闪卡优化：免费版新增「每日随机」算法，每天 20 个新词不重样。",
      en: "✨ Major Update: User login is now supported with auto-sync across devices (Read history, Vocabulary & Flashcards progress).\n🔒 Security: Implemented Turnstile captcha for enhanced account & waitlist security.\n🃏 Flashcards: Added 'Daily Random' algorithm for free users, ensuring 20 fresh words every day.",
    },
  },
  {
    version: "1.6.0",
    date: "2025-12-16",
    title: {
      zh: "KNM 核心词汇与卡片升级",
      en: "KNM Vocabulary & Card UI Update",
    },
    description: {
      zh: "新增了 60+ KNM 核心词汇（覆盖历史、政治、医疗等），并优化了词汇卡片结构，支持显示词性、例句和分类。",
      en: "Added 60+ essential KNM vocabulary words (covering history, politics, health, etc.) and updated the vocabulary card structure to show part of speech, examples, and categories.",
    },
  },
  {
    version: "1.5.0",
    date: "2025-12-15",
    title: {
      zh: "KNM 进度追踪与体验优化",
      en: "KNM Progress Tracking & UX Improvements",
    },
    description: {
      zh: "新增了阅读进度记忆功能，现在 KNM 文章和词汇表会自动记住你的阅读位置。我们在文章卡片上添加了“已读”标记，方便你快速区分已学内容。",
      en: "Added reading progress memory. KNM articles and vocabulary lists now automatically remember your last position. We also added a 'Read' badge to article cards to help you track your learning.",
    },
  },
  {
    version: "1.4.0",
    date: "2025-12-13",
    title: {
      zh: "添加A2写作速成指南",
      en: "Added A2 Writing Crash Course",
    },
    description: {
      zh: "添加了 A2 写作速成指南，包含写作三大黄金法则。",
      en: "Added A2 writing crash course containing the 3 golden rules.",
    },
  },
  {
    version: "1.3.0",
    date: "2025-12-13",
    title: {
      zh: "添加A2口语速成指南",
      en: "Added A2 Speaking Crash Course",
    },
    description: {
      zh: "添加了 A2 口语速成指南，包含口语三大黄金法则。",
      en: "Added A2 speaking crash course containing the 3 go-to phrases.",
    },
  },
  {
    version: "1.2.0",
    date: "2025-12-03",
    title: {
      zh: "添加A2单词表",
      en: "Added A2 Vocabulary List",
    },
    description: {
      zh: "添加了 A2 单词表，包含 500 个常用单词。",
      en: "Added A2 vocabulary list containing 500 common words.",
    },
  },
  {
    version: "1.1.0",
    date: "2025-11-29",
    title: {
      zh: "AI 助教 (Beta) 上线",
      en: "AI Assistant (Beta) Launched",
    },
    description: {
      zh: "集成了 Google NotebookLM，现在的 AI 助教可以根据当前浏览的页面内容回答问题，并支持生成模拟考题。",
      en: "Integrated with Google NotebookLM. The AI Assistant can now answer questions based on the page content and generate mock exam questions.",
    },
  },
  {
    version: "1.0.0",
    date: "2025-11-28",
    title: {
      zh: "Open KNM 正式发布",
      en: "Open KNM Official Launch",
    },
    description: {
      zh: "第一版正式上线，包含完整的 KNM 核心考点双语文章和基础词汇表。支持中英双语切换。",
      en: "First official release containing comprehensive bilingual KNM core topic articles and basic vocabulary lists. Supports English/Chinese switching.",
    },
  },
];

