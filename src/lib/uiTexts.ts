export const locales = ["zh", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "zh";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && locales.includes(value as Locale);
}

export type NavTexts = {
  life: string;
  knm: string;
  assistant: string;
  vocabulary: string;
  speaking: string;
  writing: string;
  about: string;
};

export type VocabularyTexts = {
  title: string;
  description: string;
  promoTitle: string;
  promoDesc: string;
  loadMore: string;
  showing: string;
  of: string;
  categories: {
    all: string;
    daily: string;
    work: string;
    housing: string;
    health: string;
    geography: string;
    politics: string;
    history: string;
    education: string;
    culture: string;
    law: string;
  };
  partOfSpeech: {
    noun: string;
    verb: string;
    adjective: string;
    adverb: string;
    preposition: string;
    conjunction: string;
    pronoun: string;
    interjection: string;
    article: string;
  };
  bookmarkPrompt: {
    resume: string;
    continueReading: string;
    continueStudying: string;
    dismiss: string;
  };
  example: string;
};

export type UiTexts = {
  nav: NavTexts;
  footer: {
    tagline: string;
    note: string;
    discord: string;
  };
  assistant: {
    aiAssistantTitle: string;
    aiAssistantDesc: string;
    openNotebook: string;
    badgeLabel: string;
    detailLine1: string;
    detailLine2: string;
    detailLine3: string;
    highlightLine: string;
    bannerTitle: string;
    bannerSubtitle: string;
    promoTitle: string;
    promoDesc: string;
    promoAction: string;
  };
  speaking: {
    desktopBanner: string;
  };
  vocabulary: VocabularyTexts & {
    viewMode: {
      card: string;
      list: string;
    };
    hideTranslations: string;
    showTranslations: string;
  };
  disclaimer: {
    title: string;
    text: string;
  };
  ttsDisclaimer: {
    title: string;
    text: string;
  };
  articleNav: {
    prev: string;
    next: string;
    home: string;
  };
};

export const uiTexts: Record<Locale, UiTexts> = {
  zh: {
    nav: {
      life: "实用资源",
      knm: "KNM 专区",
      assistant: "AI 助教",
      vocabulary: "高频词汇",
      speaking: "口语练习",
      writing: "写作速成",
      about: "关于与贡献",
    },
    footer: {
      tagline: "© open-knm，欢迎开源共享。",
      note: "为准备在荷兰生活、学习与工作的你而写。",
      discord: "加入 Discord 社区讨论",
    },
    assistant: {
      aiAssistantTitle: "AI 助教 · NotebookLM",
      aiAssistantDesc:
        "我们把 open-knm 的内容上传到 NotebookLM，打开后就能问问题、让 AI 帮你总结和记忆，像在和真人学伴一起复习。",
      openNotebook: "立即体验 AI 助教",
      badgeLabel: "AI 助教",
      detailLine1: "NotebookLM 会读你正在浏览的 open-knm 内容，AI 直接回答笔记、考点、记忆法。",
      detailLine2: "一键打开后就能问问题，让 AI 帮你总结、出题或解释重点知识。",
      detailLine3: "内容源自开源贡献并经审核，确保回答准确可靠。",
      highlightLine: "把这个页面分享给小组，大家都能看到 AI 助教的卡点建议。",
      bannerTitle: "AI 助教已上线",
      bannerSubtitle: "立即点击按钮让 NotebookLM 还原你的复习私教。",
      promoTitle: "全新：AI 助教上线",
      promoDesc: "基于 NotebookLM，让 AI 帮你划重点、出模拟题。",
      promoAction: "去试试 →",
    },
    speaking: {
      desktopBanner: "Beta 功能：语音识别持续优化中。为获得最佳体验，建议使用桌面端访问。",
    },
    vocabulary: {
      title: "荷兰语高频词汇 (A2)",
      description:
        "精选涵盖基础生活和 KNM 考试重点的高频词汇。掌握这些核心单词，不仅能应对日常生活，更能大大降低备考 KNM 和阅读官方材料的门槛。",
      promoTitle: "A2 高频词汇表",
      promoDesc:
        "并非覆盖所有 A2 词汇，但这核心单词，足够帮你打好基础，读懂更多 KNM 与荷兰语教材。",
      loadMore: "加载更多",
      showing: "正在展示",
      of: "共",
      categories: {
        all: "全部",
        daily: "日常生活",
        work: "工作",
        housing: "住房",
    health: "医疗",
    geography: "地理",
    politics: "政治",
    history: "历史",
        education: "教育",
        culture: "文化",
        law: "法律",
      },
      partOfSpeech: {
        noun: "名词",
        verb: "动词",
        adjective: "形容词",
        adverb: "副词",
        preposition: "介词",
        conjunction: "连词",
        pronoun: "代词",
        interjection: "感叹词",
        article: "冠词",
      },
      viewMode: {
        card: "学习模式",
        list: "极速刷词",
      },
      hideTranslations: "隐藏释义",
      showTranslations: "显示释义",
      bookmarkPrompt: {
        resume: "上次看到",
        continueReading: "继续阅读该篇",
        continueStudying: "继续浏览该模式",
        dismiss: "不，谢谢",
      },
      example: "例句",
    },
    disclaimer: {
      title: "免责声明",
      text: "本站内容由 AI 基于收集资料辅助生成，仅供参考。尽管我们努力确保质量，但无法保证信息 100% 准确或最新。请务必以荷兰政府官方信息为准。",
    },
    ttsDisclaimer: {
      title: "发音说明",
      text: "本站语音由您的浏览器自带引擎生成，发音可能不标准或带有机械感，仅供备考辅助参考。如需练习地道口语，强烈建议咨询专业教师。",
    },
    articleNav: {
      prev: "上一篇",
      next: "下一篇",
      home: "回到主页",
    },
  },
  en: {
    nav: {
      life: "Useful Resources",
      knm: "KNM Zone",
      assistant: "AI Assistant",
      vocabulary: "Vocabulary",
      speaking: "Speaking",
      writing: "Writing",
      about: "About & Contribute",
    },
    footer: {
      tagline: "© open-knm — open knowledge for expats.",
      note: "Written for people living, studying, or working in the Netherlands.",
      discord: "Join our Discord Community",
    },
    assistant: {
      aiAssistantTitle: "NotebookLM AI Assistant",
      aiAssistantDesc:
        "NotebookLM already knows every open-knm note. Click through, ask it to explain a topic, or let it give you quick exam tips and memory tricks.",
      openNotebook: "Chat with the AI Assistant",
      badgeLabel: "AI Assistant",
      detailLine1: "NotebookLM reads the open-knm notes you are visiting and answers questions about the material.",
      detailLine2: "Tap the button, then ask it to summarize facts, generate mock questions, or explain tricky points.",
      detailLine3: "Content is community-sourced and reviewed, ensuring reliable answers.",
      highlightLine: "Share this page with your study group so everyone can spot the AI Assistant.",
      bannerTitle: "AI Assistant is live",
      bannerSubtitle: "Tap the button and let NotebookLM answer your KNM questions anytime.",
      promoTitle: "New: AI Assistant",
      promoDesc: "Powered by NotebookLM. Get summaries and mock questions instantly.",
      promoAction: "Try it now →",
    },
    speaking: {
      desktopBanner: "Beta Feature: Speech recognition is being optimized. For best results, use a desktop computer.",
    },
    vocabulary: {
      title: "Essential Dutch Vocabulary (A2)",
      description:
        "A curated list covering essential daily vocabulary and key KNM exam terms. Mastering these core words will not only help in daily life but also significantly lower the barrier for KNM exam preparation and reading official materials.",
      promoTitle: "A2 Essential Vocabulary",
      promoDesc:
        "This list doesn’t cover every A2 word, but these core items give you a solid base for KNM study and general Dutch learning.",
      loadMore: "Load More",
      showing: "Showing",
      of: "of",
      categories: {
        all: "All",
        daily: "Daily Life",
        work: "Work",
        housing: "Housing",
        health: "Health",
        geography: "Geography",
        politics: "Politics",
        history: "History",
        education: "Education",
        culture: "Culture",
        law: "Law",
      },
      partOfSpeech: {
        noun: "noun",
        verb: "verb",
        adjective: "adjective",
        adverb: "adverb",
        preposition: "preposition",
        conjunction: "conjunction",
        pronoun: "pronoun",
        interjection: "interjection",
        article: "article",
      },
      viewMode: {
        card: "Learning Mode",
        list: "Speed Review",
      },
      hideTranslations: "Hide translations",
      showTranslations: "Show translations",
      bookmarkPrompt: {
        resume: "Last visited",
        continueReading: "Resume this article",
        continueStudying: "Return to this mode",
        dismiss: "No thanks",
      },
      example: "Example",
    },
    disclaimer: {
      title: "Disclaimer",
      text: "Content is generated with AI assistance based on collected data. While we strive for accuracy, we cannot guarantee it is 100% correct or up-to-date. Please verify with official sources.",
    },
    ttsDisclaimer: {
      title: "Audio Note",
      text: "Pronunciation is generated by your browser and may be non-standard. It is intended for exam preparation only. For authentic pronunciation, please consult a professional teacher.",
    },
    articleNav: {
      prev: "Previous Article",
      next: "Next Article",
      home: "Back to Home",
    },
  },
};

function normalizePath(path: string) {
  if (!path || path === "/") {
    return "";
  }
  return path.startsWith("/") ? path : `/${path}`;
}

export function getLocalizedPath(locale: Locale, path = "/") {
  const normalized = normalizePath(path);
  return normalized ? `/${locale}${normalized}` : `/${locale}`;
}
