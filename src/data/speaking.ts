export type TriText = {
  nl: string;
  zh: string;
  en: string;
};

export type OverviewCard = {
  id: string;
  title: TriText;
  detail: TriText;
  note?: TriText;
};

export const speakingCopy = {
  heroBadge: {
    nl: "A2 Spreekdeel",
    zh: "A2 口语",
    en: "A2 Speaking",
  },
  heroTitle: {
    nl: "Spreekvaardigheid die je laat scoren",
    zh: "稳稳拿下 A2 口语",
    en: "Build confident A2 speaking",
  },
  heroSubtitle: {
    nl: "Drie onderdelen, één vloeiende conversatie: introductie, vraaggesprek en rollenspel/fotobeschrijving.",
    zh: "三部分串联：自我介绍、问答环节与角色/图片描述，让你说得自然有节奏。",
    en: "Three connected parts—intro, Q&A, and role-play/picture description—so you keep the conversation flowing.",
  },
  heroLead: {
    nl: "Biedt tri-language voorbeelden, handige templates en examenblokken die binnen de A2-structuur vallen.",
    zh: "提供三语示例、常用句型和考试流程，让你在 A2 口语中把握节奏。",
    en: "Provides tri-language examples, reusable templates, and exam blocks tailored for A2 speaking.",
  },
  heroPrimaryAction: {
    nl: "Start de mock oefening",
    zh: "开始模拟练习",
    en: "Start mock practice",
  },
  heroSecondaryAction: {
    nl: "Bekijk de sjablonen",
    zh: "查看模板",
    en: "See templates",
  },
};

export const heroStats: { id: string; label: TriText; value: TriText }[] = [
  {
    id: "themes",
    label: {
      nl: "Thema's",
      zh: "练习主题",
      en: "Themes",
    },
    value: {
      nl: "Dagelijks, werk, wonen, zorg, administratie",
      zh: "生活/工作/住房/医疗/办事",
      en: "Daily life, work, housing, health, admin",
    },
  },
  {
    id: "questions",
    label: {
      nl: "Mockvragen",
      zh: "模拟题",
      en: "Mock prompts",
    },
    value: {
      nl: "9 voorbeeldvragen met tips",
      zh: "9 个示例问答+提示",
      en: "9 sample Q&As with tips",
    },
  },
  {
    id: "tools",
    label: {
      nl: "Templates & uttryk",
      zh: "模板＋表达",
      en: "Templates & phrases",
    },
    value: {
      nl: "5 sleutelzinnen + verbindingswoorden",
      zh: "5 条关键句+连接词",
      en: "5 anchor sentences + connectors",
    },
  },
];

export const examOverviewCards: OverviewCard[] = [
  {
    id: "structure",
    title: {
      nl: "Structuur",
      zh: "考试结构",
      en: "Structure",
    },
    detail: {
      nl: "Introductie → vraaggesprek → fotobeschrijving of rollenspel, allemaal binnen 10-15 minuten.",
      zh: "开场自我介绍→问题回答→图片/角色扮演，整体完成在 10-15 分钟。",
      en: "Intro → conversation → picture description/role-play, wrapped in 10-15 minutes.",
    },
    note: {
      nl: "Bereid één korte inleiding voor, daarna mag je gerust vragen stellen of verduidelijkingen vragen.",
      zh: "准备一个简短开场，之后可以主动提问或请求澄清。",
      en: "Have a short intro ready, then don’t hesitate to ask for clarification.",
    },
  },
  {
    id: "criteria",
    title: {
      nl: "Beoordeling",
      zh: "评分要点",
      en: "Scoring",
    },
    detail: {
      nl: "Uitspraak, woordenschat, grammatica en interactie tellen mee.",
      zh: "发音、词汇、语法、互动都在评分里。",
      en: "Pronunciation, vocabulary, grammar, and interaction all count.",
    },
    note: {
      nl: "Gebruik eenvoudige, correcte zinnen liever dan moeilijke woorden met fouten.",
      zh: "用简单正确的句子优于华丽但出错的表达。",
      en: "Simple correct sentences beat flashy mistakes any day.",
    },
  },
  {
    id: "timing",
    title: {
      nl: "Timing",
      zh: "时间节奏",
      en: "Timing",
    },
    detail: {
      nl: "Een paar minuten zelfintroductie, 4-6 vragen en 1 minuten role-play/foto.",
      zh: "几分钟自我介绍、4-6 道问答、1 次图片/角色环节。",
      en: "Minutes for intro, 4-6 Qs, and a single picture/role-play moment.",
    },
  },
];

export type SpeakingTheme = {
  id: "daily" | "work" | "housing" | "health" | "admin";
  title: TriText;
  description: TriText;
};

export const speakingThemes: SpeakingTheme[] = [
  {
    id: "daily",
    title: {
      nl: "Dagelijkse momenten",
      zh: "日常生活",
      en: "Daily life",
    },
    description: {
      nl: "Winkelen, eten, reizen en sociale gewoonten op A2-niveau oefenen.",
      zh: "覆盖购物、饮食、出行与社交等场景。",
      en: "Practice shopping, meals, travel, and social routines.",
    },
  },
  {
    id: "work",
    title: {
      nl: "Werk en studie",
      zh: "工作与学习",
      en: "Work & study",
    },
    description: {
      nl: "Vertel kort over je werkzaamheden, planning en collega’s.",
      zh: "说说你的工作、安排和同事。",
      en: "Talk about your job, shifts, and teammates.",
    },
  },
  {
    id: "housing",
    title: {
      nl: "Wonen & contract",
      zh: "住房与合同",
      en: "Housing & contract",
    },
    description: {
      nl: "Huur, buurten, en wat je nodig hebt voor een inschrijving.",
      zh: "租房、邻里与注册材料。",
      en: "Rent, neighborhood, and paperwork.",
    },
  },
  {
    id: "health",
    title: {
      nl: "Gezondheid",
      zh: "医疗与健康",
      en: "Health",
    },
    description: {
      nl: "Korte beschrijvingen van klachten, afspraken en medicijnen.",
      zh: "描述症状、预约和药物。",
      en: "Describe symptoms, appointments, and medicine.",
    },
  },
  {
    id: "admin",
    title: {
      nl: "Administratieve zaken",
      zh: "行政事务",
      en: "Admin",
    },
    description: {
      nl: "Gemeente, documenten en formulieren zonder bureaucratisch jargon.",
      zh: "市政、证件，纯粹实用表达。",
      en: "Municipalities, documents, and forms in plain language.",
    },
  },
];

export type SpeakingQuestion = {
  id: string;
  topic: SpeakingTheme["id"];
  question: TriText;
  answer: TriText;
  variations?: TriText[];
  tip: TriText;
};

export const speakingQuestions: SpeakingQuestion[] = [
  {
    id: "daily-01",
    topic: "daily",
    question: {
      nl: "Wat eet je meestal als ontbijt?",
      zh: "你早餐通常吃什么？",
      en: "What do you usually have for breakfast?",
    },
    answer: {
      nl: "Ik eet meestal een boterham met kaas en drink een kop koffie.",
      zh: "我通常吃奶酪面包，喝一杯咖啡。",
      en: "I usually have a bread slice with cheese and a cup of coffee.",
    },
    variations: [
      {
        nl: "Soms neem ik yoghurt met fruit als ik haast heb.",
        zh: "有时我匆忙的时候会吃酸奶配水果。",
        en: "Sometimes I grab yogurt with fruit when I am in a hurry.",
      },
    ],
    tip: {
      nl: "Gebruik tegenwoordige tijd en houd de zin kort met één of twee onderdelen.",
      zh: "使用现在时，简洁描述食物+饮品即可。",
      en: "Stick to present tense and keep it short—describe the food and drink.",
    },
  },
  {
    id: "daily-02",
    topic: "daily",
    question: {
      nl: "Hoe ga je naar je werk of studie?",
      zh: "你怎么去上班或上学？",
      en: "How do you get to work or school?",
    },
    answer: {
      nl: "Ik neem de tram; het is snel en goedkoop.",
      zh: "我坐有轨电车，又快又便宜。",
      en: "I take the tram; it is fast and cheap.",
    },
    variations: [
      {
        nl: "In de zomer fiets ik ook graag naar het station.",
        zh: "夏天我也喜欢骑自行车去车站。",
        en: "In summer I also like to bike to the station.",
      },
    ],
    tip: {
      nl: "Noem het vervoermiddel en voeg eventueel een reden toe.",
      zh: "说出交通方式，可加上原因。",
      en: "Mention the transport mode and add a short reason.",
    },
  },
  {
    id: "work-01",
    topic: "work",
    question: {
      nl: "Wat doe je voor werk of studie?",
      zh: "你从事什么工作或学习什么？",
      en: "What do you do for work or study?",
    },
    answer: {
      nl: "Ik werk als administratief medewerker bij een installatiebedrijf.",
      zh: "我在一家安装公司当行政助理。",
      en: "I work as an administrative assistant at an installation company.",
    },
    variations: [
      {
        nl: "Ik volg een avondcursus Nederlands en combineer dat met mijn baan.",
        zh: "我晚上上荷兰语课，白天工作。",
        en: "I take an evening Dutch course and work during the day.",
      },
    ],
    tip: {
      nl: "Koppel werk en studie, gebruik één werkwoord per zin.",
      zh: "工作/学习连着说，每句话用一个动词。",
      en: "Link work and study, keep one verb per sentence.",
    },
  },
  {
    id: "housing-01",
    topic: "housing",
    question: {
      nl: "Welke huur betaal je per maand?",
      zh: "你每月付多少房租？",
      en: "How much rent do you pay per month?",
    },
    answer: {
      nl: "Ik betaal achthonderd euro per maand, inclusief gas en licht.",
      zh: "我每月付 800 欧，含水电气。",
      en: "I pay 800 euros per month, including utilities.",
    },
    variations: [
      {
        nl: "De servicekosten zitten er niet bij; die betaal ik apart.",
        zh: "服务费不包含在内，我另付。",
        en: "Service costs are not included; I pay them separately.",
      },
    ],
    tip: {
      nl: "Noem het bedrag en vermeld wat er bij zit of niet.",
      zh: "说出金额并说明包含哪些费用。",
      en: "State the amount and clarify what is or isn’t included.",
    },
  },
  {
    id: "health-01",
    topic: "health",
    question: {
      nl: "Wat zijn je klachten?",
      zh: "你有哪些症状？",
      en: "What symptoms do you have?",
    },
    answer: {
      nl: "Ik heb al twee dagen een zere keel en wat koorts.",
      zh: "我连续两天喉咙痛，还有点发烧。",
      en: "I have had a sore throat and a bit of fever for two days.",
    },
    variations: [
      {
        nl: "De pijn is vooral ’s avonds sterker en ik hoest af en toe.",
        zh: "晚上特别厉害，还偶尔咳嗽。",
        en: "It hurts more in the evening and I cough sometimes.",
      },
    ],
    tip: {
      nl: "Gebruik tijdsaanduidingen en zeg hoeveel dagen je klachten duren.",
      zh: "说明症状持续多久，用时间词。",
      en: "Mention how long the symptoms have lasted using time cues.",
    },
  },
  {
    id: "admin-01",
    topic: "admin",
    question: {
      nl: "Welke documenten neem je mee naar de gemeente?",
      zh: "你去市政厅需要带哪些文件？",
      en: "Which documents do you bring to the municipality?",
    },
    answer: {
      nl: "Ik neem mijn paspoort, het huurcontract en het inschrijfbewijs mee.",
      zh: "我带上护照、租房合同和登记证明。",
      en: "I bring my passport, rental contract, and registration proof.",
    },
    variations: [
      {
        nl: "Ook een recente bankafschrift voor de huurbetaling ligt klaar.",
        zh: "我还准备了最近的银行账单。",
        en: "I also prepared a recent bank statement for the rent payment.",
      },
    ],
    tip: {
      nl: "Noem drie documenten en gebruik woorden als ‘ook’ of ‘en’ om ze te verbinden.",
      zh: "说出三份文件，用“还有”串联。",
      en: "Name three documents and link them with words like ‘and’ or ‘also’.",
    },
  },
];

export type SpeakingTemplate = {
  id: string;
  label: TriText;
  sentence: TriText;
  note?: TriText;
};

export const speakingTemplates: SpeakingTemplate[] = [
  {
    id: "opening",
    label: {
      nl: "开场问候",
      zh: "开场问候",
      en: "Opening",
    },
    sentence: {
      nl: "Goedemorgen, ik ben [naam] en ik woon sinds kort in Nederland.",
      zh: "早上好，我是[姓名]，刚搬到荷兰。",
      en: "Good morning, I'm [name] and I recently moved to the Netherlands.",
    },
    note: {
      nl: "Vul je naam in en houd het kort, dan bouw je vertrouwen op.",
      zh: "写上姓名，语速放慢，让考官听清。",
      en: "Insert your name and keep it short to make a calm impression.",
    },
  },
  {
    id: "intro",
    label: {
      nl: "自我介绍",
      zh: "自我介绍",
      en: "Personal intro",
    },
    sentence: {
      nl: "Ik werk bij een installatiebedrijf en ik volg een cursus Nederlands in de avond.",
      zh: "我在一家安装公司工作，晚上上荷兰语课。",
      en: "I work at an installation company and take Dutch classes in the evening.",
    },
  },
  {
    id: "clarify",
    label: {
      nl: "澄清与请求",
      zh: "请对方澄清",
      en: "Clarify / request",
    },
    sentence: {
      nl: "Kunt u dat herhalen, alstublieft? Ik wil het graag goed begrijpen.",
      zh: "请您再说一遍？我想听懂每个词。",
      en: "Could you repeat that, please? I want to understand every word.",
    },
  },
  {
    id: "rescue",
    label: {
      nl: "兜底句",
      zh: "救场",
      en: "Rescue phrase",
    },
    sentence: {
      nl: "Ik weet het niet precies, maar ik denk dat het meestal zo gaat.",
      zh: "我不太确定，但我觉得一般都是这样。",
      en: "I am not sure, but I think it usually goes like that.",
    },
  },
  {
    id: "closing",
    label: {
      nl: "结束语",
      zh: "结束语",
      en: "Closing",
    },
    sentence: {
      nl: "Dank u wel voor uw tijd. Ik hoop dat ik duidelijk was.",
      zh: "感谢您的时间，希望我说得清楚。",
      en: "Thank you for your time. I hope I was clear.",
    },
  },
];

export type ExpressionItem = {
  id: string;
  label: TriText;
  usage: TriText;
  example: TriText;
};

export const expressionToolbox: ExpressionItem[] = [
  {
    id: "connector-and",
    label: {
      nl: "en",
      zh: "和 / 并且",
      en: "and",
    },
    usage: {
      nl: "Voeg elementen samen: onderwerp + nieuw detail.",
      zh: "连接两个信息点。",
      en: "Join two facts or ideas.",
    },
    example: {
      nl: "Ik werk en ik leer Nederlands in de avond.",
      zh: "我工作，也在晚上学荷兰语。",
      en: "I work and also learn Dutch in the evening.",
    },
  },
  {
    id: "connector-but",
    label: {
      nl: "maar",
      zh: "但是",
      en: "but",
    },
    usage: {
      nl: "Laat contrast zien of beperkingen.",
      zh: "表达对比或转折。",
      en: "Show contrast or limits.",
    },
    example: {
      nl: "Ik wil graag meer oefenen, maar ik heb weinig tijd.",
      zh: "我想多练，但时间很少。",
      en: "I'd like to practice more, but I have little time.",
    },
  },
  {
    id: "connector-because",
    label: {
      nl: "want",
      zh: "因为",
      en: "because",
    },
    usage: {
      nl: "Leg een reden uit in één zin.",
      zh: "说明原因、动机。",
      en: "Explain a reason or motive.",
    },
    example: {
      nl: "Ik neem de tram, want het is snel en betrouwbaar.",
      zh: "我坐有轨电车，因为又快又稳。",
      en: "I take the tram because it is fast and reliable.",
    },
  },
  {
    id: "connector-so",
    label: {
      nl: "dus",
      zh: "所以",
      en: "so",
    },
    usage: {
      nl: "Sluit af met een conclusie of keuze.",
      zh: "总结或给出决定。",
      en: "Wrap up with a conclusion or decision.",
    },
    example: {
      nl: "Ik heb een afspraak, dus ik kan daarna niet blijven.",
      zh: "我有约，所以不能再待了。",
      en: "I have an appointment, so I can’t stay afterward.",
    },
  },
  {
    id: "politeness",
    label: {
      nl: "Alstublieft / dank u wel",
      zh: "请 / 谢谢",
      en: "Please / thank you",
    },
    usage: {
      nl: "Laat respect zien bij vragen of afsluiting.",
      zh: "礼貌提问/结束。",
      en: "Use polite phrases for questions or endings.",
    },
    example: {
      nl: "Kunt u mij helpen, alstublieft? Dank u wel.",
      zh: "请您帮我好吗？谢谢您。",
      en: "Could you help me, please? Thank you.",
    },
  },
];

export type ExamFlowStep = {
  id: string;
  title: TriText;
  detail: TriText;
};

export const examFlowSteps: ExamFlowStep[] = [
  {
    id: "prepare",
    title: {
      nl: "Voorbereiding",
      zh: "准备环节",
      en: "Preparation",
    },
    detail: {
      nl: "Korte ademhaling, naam noemen, stap uit de stress.",
      zh: "深呼吸，说出姓名，放松节奏。",
      en: "Deep breath, say your name, slow your pace.",
    },
  },
  {
    id: "intro",
    title: {
      nl: "Introductie",
      zh: "自我介绍",
      en: "Introduction",
    },
    detail: {
      nl: "Noem je naam, woonplaats en studie/werk in één zin.",
      zh: "一句话说出姓名、住址、职业/学习。",
      en: "Mention name, where you live, and work/study in one sentence.",
    },
  },
  {
    id: "questions",
    title: {
      nl: "Vraaggesprek",
      zh: "问答环节",
      en: "Q&A",
    },
    detail: {
      nl: "Beantwoord 4-6 vragen, houd drietallig (NL+ZH+EN) in gedachten voor oefenen.",
      zh: "回答 4-6 道题，练习荷中英切换。",
      en: "Answer 4-6 prompts; practice switching between NL/CN/EN during rehearsal.",
    },
  },
  {
    id: "picture",
    title: {
      nl: "Foto beschrijving",
      zh: "图片描述",
      en: "Picture",
    },
    detail: {
      nl: "Beschrijf kleur, locatie en actie in simpele zinnen.",
      zh: "用简单句描述颜色、位置、动作。",
      en: "Use simple sentences to describe colors, locations, and actions.",
    },
  },
  {
    id: "roleplay",
    title: {
      nl: "Rollenspel",
      zh: "角色扮演",
      en: "Role-play",
    },
    detail: {
      nl: "Speel een kort gesprek na, geef alternatieve antwoorden.",
      zh: "模拟对话，提供备选句。",
      en: "Rehearse a short dialogue and offer alternative responses.",
    },
  },
  {
    id: "closing",
    title: {
      nl: "Afsluiten",
      zh: "结束语",
      en: "Closing",
    },
    detail: {
      nl: "Bedank de examinator en herhaal nog even je belangrijkste zin.",
      zh: "感谢考官，再说一遍重点。",
      en: "Thank the examiner and repeat your key sentence.",
    },
  },
];

export const rescuePhrases: TriText[] = [
  {
    nl: "Ik weet het niet precies, maar ik denk dat...",
    zh: "我不太确定，但我想...",
    en: "I'm not sure, but I think...",
  },
  {
    nl: "Kunt u iets langzamer praten, alstublieft?",
    zh: "您能慢一点说吗？",
    en: "Could you speak a bit slower, please?",
  },
  {
    nl: "Mag ik even nadenken? Ik kom zo terug op die vraag.",
    zh: "我可以想一下吗？稍后再回答这题。",
    en: "May I think for a moment? I'll come back to that question.",
  },
];

export const speakingWarnings: TriText[] = [
  {
    nl: "Vertaal niet woord voor woord vanuit het Chinees of Engels.",
    zh: "别逐字翻译中文或英文。",
    en: "Avoid word-for-word translations from Chinese/English.",
  },
  {
    nl: "Let op de woordvolgorde in bijzinnen (bijvoorbeeld: 'omdat ik werk').",
    zh: "注意从句顺序，比如“因为我工作”要将 verb 放后。",
    en: "Watch subordinate clauses; verbs move to the end in sentences like 'because I work'.",
  },
  {
    nl: "Gebruik de tegenwoordige tijd in de meeste antwoorden.",
    zh: "大多数回答用现在时。",
    en: "Stick to present tense for most responses.",
  },
];

