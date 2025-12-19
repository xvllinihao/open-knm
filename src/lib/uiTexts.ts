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
  pricing: string;
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
  pricing: {
    title: string;
    description: string;
    free: {
      title: string;
      price: string;
      features: string[];
      action: string;
    };
    pro: {
      title: string;
      price: string;
      features: string[];
      action: string;
    };
  };
  auth: {
    login: string;
    logout: string;
    myProfile: string;
  };
  wishlist: {
    title: string;
    description: string;
    placeholder: string;
    action: string;
    success: string;
    error: string;
    exists: string;
    heroBadge: string;
    heroTitle: string;
    heroTitleHighlight: string;
    heroSubtitle: string;
    offer: string;
    socialProof: string;
    features: {
      aiCompanion: string;
      cloudSync: string;
      realPronunciation: string;
      smartCards: string;
      aiTutor: string;
    };
  };
    membershipPromo: {
      title: string;
      description: string;
      action: string;
    };
    loginNudge: {
      title: string;
      description: string;
      action: string;
      dismiss: string;
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
      pricing: "会员计划",
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
    pricing: {
      title: "选择适合您的计划",
      description: "词汇表完全免费。升级会员解锁无限闪卡刷词与专属功能。",
      free: {
        title: "免费账户",
        price: "€0",
        features: ["完整词汇表浏览", "每日 20 次闪卡刷词", "云端同步学习进度", "全站 KNM 文章", "加入 Discord 社区"],
        action: "免费注册",
      },
      pro: {
        title: "Pro 会员",
        price: "€9.9/月",
        features: ["无限量闪卡刷词", "乱序背词模式", "错题本（即将上线）", "未来权益：AI 语音包折扣", "未来权益：AI 作文批改折扣", "支持开源项目发展"],
        action: "加入心愿单",
      },
    },
    auth: {
      login: "登录",
      logout: "退出登录",
      myProfile: "我的账户",
    },
    wishlist: {
      title: "加入 Pro 心愿单",
      description: "支付系统正在最后调试中。留下邮箱，我们将第一时间通知您并提供早鸟优惠。",
      placeholder: "输入你的邮箱地址",
      action: "加入心愿单",
      success: "🎉 你已成功加入心愿单！上线时我们会第一时间通知你。",
      error: "出错了，请稍后再试。",
      exists: "你已经在心愿单里了！",
      heroBadge: "COMING SOON",
      heroTitle: "Open KNM",
      heroTitleHighlight: "Pro",
      heroSubtitle: "解锁云端同步、真人发音与 AI 私教，让备考效率翻倍。",
      offer: "加入心愿单，上线即享 5 折优惠",
      socialProof: "人已加入",
      features: {
        aiCompanion: "AI 伴读",
        cloudSync: "云端同步",
        realPronunciation: "真人发音",
        smartCards: "智能卡片",
        aiTutor: "AI 私教",
      },
    },
    membershipPromo: {
      title: "解锁 Pro 会员",
      description: "无限闪卡刷词、乱序背词、错题本。加入心愿单，享受早鸟优惠。",
      action: "查看详情",
    },
    loginNudge: {
      title: "不错过任何进度 ☁️",
      description: "当前为访客模式，进度仅保存在本地。登录账户以永久保存并同步。",
      action: "免费注册/登录",
      dismiss: "稍后再说",
    },
  },
  en: {
    nav: {
      life: "Resources",
      knm: "KNM Zone",
      assistant: "AI Assistant",
      vocabulary: "Vocabulary",
      speaking: "Speaking",
      writing: "Writing",
      about: "About",
      pricing: "Membership",
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
    pricing: {
      title: "Choose the right plan",
      description: "Vocabulary list is free for everyone. Upgrade for unlimited flash cards.",
      free: {
        title: "Free Account",
        price: "€0",
        features: ["Full vocabulary access", "20 daily flash card reviews", "Cloud sync progress", "All KNM articles", "Join Discord Community"],
        action: "Sign Up Free",
      },
      pro: {
        title: "Pro Member",
        price: "€9.9/mo",
        features: ["Unlimited flash cards", "Shuffle mode", "Wrong answer tracking (soon)", "Future: AI Voice Pack Discount", "Future: AI Correction Discount", "Support open source"],
        action: "Join Wishlist",
      },
    },
    auth: {
      login: "Login",
      logout: "Logout",
      myProfile: "My Profile",
    },
    wishlist: {
      title: "Join Pro Wishlist",
      description: "Payment system is in final testing. Enter your email to get notified and receive early bird pricing.",
      placeholder: "Enter your email address",
      action: "Join Wishlist",
      success: "🎉 You're on the wishlist! We'll notify you when Pro launches.",
      error: "Something went wrong. Please try again.",
      exists: "You're already on the wishlist!",
      heroBadge: "COMING SOON",
      heroTitle: "Open KNM",
      heroTitleHighlight: "Pro",
      heroSubtitle: "Unlock cloud sync, real pronunciation & AI tutor. Double your study efficiency.",
      offer: "Join wishlist, get 50% off upon launch",
      socialProof: "people joined",
      features: {
        aiCompanion: "AI Companion",
        cloudSync: "Cloud Sync",
        realPronunciation: "Real Audio",
        smartCards: "Smart Cards",
        aiTutor: "AI Tutor",
      },
    },
    membershipPromo: {
      title: "Unlock Pro Membership",
      description: "Unlimited flash cards, shuffle mode, and wrong answer tracking. Join the wishlist.",
      action: "Learn More",
    },
    loginNudge: {
      title: "Save Your Progress ☁️",
      description: "You are in guest mode. Log in to sync your progress across devices.",
      action: "Sign Up / Login",
      dismiss: "Later",
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
