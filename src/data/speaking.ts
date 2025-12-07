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
  icon?: string;
};

export const speakingCopy = {
  heroBadge: {
    nl: "A2 Spreekvaardigheid",
    zh: "A2 口语",
    en: "A2 Speaking",
  },
  heroTitle: {
    nl: "Spreken voor het Inburgeringsexamen",
    zh: "融入考试口语",
    en: "Civic Integration Speaking",
  },
  heroSubtitle: {
    nl: "Oefen met de computer-indeling: antwoord geven op vragen en reageren op situaties.",
    zh: "熟悉机考模式：回答问题与情景反应，完全模拟真实考试。",
    en: "Practice the computer-based format: answering questions and reacting to situations.",
  },
  heroLead: {
    nl: "Bereid je voor op beide onderdelen van het examen met realistische oefeningen.",
    zh: "针对考试的两个部分进行针对性练习。",
    en: "Prepare for both parts of the exam with realistic exercises.",
  },
  heroPrimaryAction: {
    nl: "Start de oefening",
    zh: "开始练习",
    en: "Start practice",
  },
  examOverviewTitle: {
    nl: "Examenoverzicht",
    zh: "考试概览",
    en: "Exam Overview",
  },
  practiceArenaLabel: {
    nl: "Oefenarena",
    zh: "练习场",
    en: "Practice Arena",
  },
  practiceArenaTitle: {
    nl: "Echte Examensimulatie",
    zh: "全真模拟",
    en: "Real Exam Simulation",
  },
  practiceArenaSubtitle: {
    nl: "Kies een onderwerp om te beginnen.",
    zh: "选择主题开始模拟，请保持表达清晰简洁。",
    en: "Select a topic below to start your mock oral exam. Speak clearly, keep it simple.",
  },
};

export const heroStats: { id: string; label: TriText; value: TriText }[] = [
  {
    id: "parts",
    label: {
      nl: "Onderdelen",
      zh: "考试部分",
      en: "Parts",
    },
    value: {
      nl: "Deel 1 (Vragen) & Deel 2 (Plaatjes)",
      zh: "第一部分（问答）& 第二部分（看图说话）",
      en: "Part 1 (Q&A) & Part 2 (Pictures)",
    },
  },
  {
    id: "questions",
    label: {
      nl: "Vragen",
      zh: "题目数量",
      en: "Questions",
    },
    value: {
      nl: "~24 vragen in totaal (35 min)",
      zh: "共约 24 题 (35 分钟)",
      en: "~24 questions total (35 min)",
    },
  },
  {
    id: "format",
    label: {
      nl: "Format",
      zh: "形式",
      en: "Format",
    },
    value: {
      nl: "Computer & Microfoon",
      zh: "机考录音",
      en: "Computer & Microphone",
    },
  },
];

export const examOverviewCards: OverviewCard[] = [
  {
    id: "structure",
    title: {
      nl: "Examenstructuur",
      zh: "考试结构",
      en: "Structure",
    },
    detail: {
      nl: "Het examen gebeurt op de computer. Je ziet filmpjes of plaatjes en spreekt antwoorden in.",
      zh: "全程机考。观看视频提问或看图说话，通过麦克风录制回答。",
      en: "Computer-based. You watch videos or look at pictures and record your answers.",
    },
    note: {
      nl: "Er is geen examinator aanwezig.",
      zh: "没有真人考官在场。",
      en: "There is no human examiner present.",
    },
  },
  {
    id: "part1",
    title: {
      nl: "Deel 1: Spreken",
      zh: "第一部分：问答",
      en: "Part 1: Speaking",
    },
    detail: {
      nl: "Je ziet een persoon die een vraag stelt. Jij geeft antwoord.",
      zh: "视频中的人向你提问（关于你的生活/工作等），你回答。",
      en: "A person in the video asks a question. You respond.",
    },
    note: {
      nl: "Vragen over jezelf, je huis, je werk, etc.",
      zh: "涉及个人生活、居住、工作等话题。",
      en: "Topics: yourself, home, work, etc.",
    },
  },
  {
    id: "part2",
    title: {
      nl: "Deel 2: Plaatjes",
      zh: "第二部分：看图说话",
      en: "Part 2: Pictures",
    },
    detail: {
      nl: "Je ziet een plaatje. Vertel wat je ziet of wat er gebeurt.",
      zh: "看一张图片。描述你看到的或发生的事情。",
      en: "Look at a picture. Describe what you see or what is happening.",
    },
    note: {
      nl: "Gebruik eenvoudige zinnen.",
      zh: "使用简单的句子。",
      en: "Use simple sentences.",
    },
  },
];

export type SpeakingTheme = {
  id: "p1_personal" | "p1_daily" | "p1_work" | "part2";
  title: TriText;
  description: TriText;
};

export const speakingThemes: SpeakingTheme[] = [
  {
    id: "p1_personal",
    title: {
      nl: "Intro & Familie",
      zh: "个人与家庭",
      en: "Intro & Family",
    },
    description: {
      nl: "Vragen over wie je bent en je familie.",
      zh: "关于你的身份和家庭的问题。",
      en: "Questions about who you are and your family.",
    },
  },
  {
    id: "p1_daily",
    title: {
      nl: "Dagelijks Leven",
      zh: "日常生活",
      en: "Daily Life",
    },
    description: {
      nl: "Vragen over eten, vrije tijd en vervoer.",
      zh: "关于饮食、空闲时间和交通的问题。",
      en: "Questions about food, free time, and transport.",
    },
  },
  {
    id: "p1_work",
    title: {
      nl: "Werk & Opleiding",
      zh: "工作与教育",
      en: "Work & Education",
    },
    description: {
      nl: "Vragen over je werk of school.",
      zh: "关于你的工作或学校的问题。",
      en: "Questions about your work or school.",
    },
  },
  {
    id: "part2",
    title: {
      nl: "Deel 2: Plaatjes",
      zh: "看图说话",
      en: "Picture Description",
    },
    description: {
      nl: "Beschrijf wat je ziet op het plaatje.",
      zh: "描述图片中的内容。",
      en: "Describe what you see in the picture.",
    },
  },
];

export type UniversalPhraseGroup = {
  id: string;
  title: TriText;
  phrases: {
    dutch: string;
    translation: TriText; 
  }[];
};

export const universalPhrases: UniversalPhraseGroup[] = [
  {
    id: "p1-personal",
    title: {
      nl: "Deel 1: Persoon & Familie",
      zh: "个人与家庭 (Intro & Family)",
      en: "Personal & Family",
    },
    phrases: [
      {
        dutch: "Ik heet ... en ik kom uit ...",
        translation: { nl: "", zh: "我叫...，我来自...", en: "My name is ... and I come from ..." },
      },
      {
        dutch: "Ik woon al ... jaar in Nederland.",
        translation: { nl: "", zh: "我在荷兰住了...年了。", en: "I have lived in NL for ... years." },
      },
      {
        dutch: "Ik ben getrouwd en heb ... kinderen.",
        translation: { nl: "", zh: "我已婚，有...个孩子。", en: "I am married and have ... children." },
      },
      {
        dutch: "Mijn familie woont in mijn land.",
        translation: { nl: "", zh: "我的家人住在我的祖国。", en: "My family lives in my country." },
      },
      {
        dutch: "Ik woon in ..., dat is een mooie stad.",
        translation: { nl: "", zh: "我住在...，那是个漂亮的城市。", en: "I live in ..., that is a nice city." },
      },
      {
        dutch: "Ik spreek Engels en een beetje Nederlands.",
        translation: { nl: "", zh: "我会说英语和一点荷兰语。", en: "I speak English and a little Dutch." },
      },
    ],
  },
  {
    id: "p1-work",
    title: {
      nl: "Deel 1: Werk & Opleiding",
      zh: "工作与教育 (Work & Education)",
      en: "Work & Education",
    },
    phrases: [
      {
        dutch: "Ik werk als ... / Ik ben huisvrouw.",
        translation: { nl: "", zh: "我是做...的 / 我是家庭主妇。", en: "I work as ... / I am a housewife." },
      },
      {
        dutch: "Ik wil graag in een winkel werken.",
        translation: { nl: "", zh: "我想在商店工作。", en: "I would like to work in a shop." },
      },
      {
        dutch: "Ik ga met de fiets / bus naar school.",
        translation: { nl: "", zh: "我骑车/坐公交去上学。", en: "I go to school by bike / bus." },
      },
      {
        dutch: "Mijn werk begint om ... uur.",
        translation: { nl: "", zh: "我的工作...点开始。", en: "My work starts at ... o'clock." },
      },
      {
        dutch: "Ik heb in mijn land gestudeerd.",
        translation: { nl: "", zh: "我在我的国家上过学。", en: "I studied in my country." },
      },
      {
        dutch: "Ik vind mijn werk erg leuk.",
        translation: { nl: "", zh: "我很喜欢我的工作。", en: "I like my work very much." },
      },
    ],
  },
  {
    id: "p1-daily",
    title: {
      nl: "Deel 1: Dagelijks Leven",
      zh: "日常生活 (Daily Life)",
      en: "Daily Life",
    },
    phrases: [
      {
        dutch: "In mijn vrije tijd wandel ik graag.",
        translation: { nl: "", zh: "空闲时间我喜欢散步。", en: "I like to walk in my free time." },
      },
      {
        dutch: "Ik doe boodschappen bij de Jumbo.",
        translation: { nl: "", zh: "我在 Jumbo 买菜。", en: "I do groceries at Jumbo." },
      },
      {
        dutch: "Ik vind het weer (niet) leuk.",
        translation: { nl: "", zh: "我（不）喜欢这个天气。", en: "I (don't) like the weather." },
      },
      {
        dutch: "Ik eet liever thuis, want dat is lekker.",
        translation: { nl: "", zh: "我更爱在家吃，因为很好吃。", en: "I prefer eating at home, because it's tasty." },
      },
      {
        dutch: "Ik kijk vaak televisie.",
        translation: { nl: "", zh: "我经常看电视。", en: "I often watch TV." },
      },
      {
        dutch: "Ik ga elk weekend naar het park.",
        translation: { nl: "", zh: "我每个周末都去公园。", en: "I go to the park every weekend." },
      },
    ],
  },
  {
    id: "p2-description",
    title: {
      nl: "Deel 2: Beschrijven",
      zh: "看图说话 (Picture Description)",
      en: "Picture Description",
    },
    phrases: [
      {
        dutch: "Op de foto zie ik ...",
        translation: { nl: "", zh: "在照片上我看到...", en: "In the photo I see ..." },
      },
      {
        dutch: "De man / vrouw is aan het ...",
        translation: { nl: "", zh: "这一男/女正在...", en: "The man/woman is ...-ing" },
      },
      {
        dutch: "Ze zijn in de winkel / het park.",
        translation: { nl: "", zh: "他们在商店/公园里。", en: "They are in the shop/park." },
      },
      {
        dutch: "Het is mooi / slecht weer.",
        translation: { nl: "", zh: "天气很好/不好。", en: "The weather is nice/bad." },
      },
      {
        dutch: "De kinderen spelen met een bal.",
        translation: { nl: "", zh: "孩子们在玩球。", en: "The children are playing with a ball." },
      },
      {
        dutch: "Hij / Zij koopt groenten en fruit.",
        translation: { nl: "", zh: "他/她正在买蔬菜和水果。", en: "He/She is buying vegetables and fruit." },
      },
    ],
  },
];

export type SpeakingQuestion = {
  id: string;
  topic: SpeakingTheme["id"];
  question: TriText;
  answer: TriText;
  variations?: TriText[];
  tip: TriText;
  imagePrompt?: string;
  image?: string; // Path to the image
};

export const speakingQuestions: SpeakingQuestion[] = [
  // --- THEME: INTRO & PERSONAL (p1_personal) ---
  {
    id: "p1-08",
    topic: "p1_personal",
    question: {
      nl: "Heb je familie in Nederland?",
      zh: "你在荷兰有家人吗？",
      en: "Do you have family in the Netherlands?",
    },
    answer: {
      nl: "Ja, mijn man en mijn kinderen wonen hier. De rest van mijn familie woont in mijn land.",
      zh: "是的，我的丈夫和孩子住在这里。我其他的家人们住在我的祖国。",
      en: "Yes, my husband and children live here. The rest of my family lives in my country.",
    },
    tip: {
      nl: "Antwoord met 'Ja' of 'Nee' en leg uit.",
      zh: "用“是”或“否”回答并解释。",
      en: "Answer with 'Yes' or 'No' and explain.",
    },
  },
  {
    id: "p1-09",
    topic: "p1_personal",
    question: {
      nl: "Hoelang woon je al in Nederland?",
      zh: "你在荷兰住多久了？",
      en: "How long have you lived in the Netherlands?",
    },
    answer: {
      nl: "Ik woon nu twee jaar in Nederland.",
      zh: "我在荷兰住了两年了。",
      en: "I have lived in the Netherlands for two years now.",
    },
    tip: {
      nl: "Gebruik 'al' (tijdsduur) of een aantal jaar.",
      zh: "提到具体的年数。",
      en: "Mention the number of years.",
    },
  },
  {
    id: "p1-10",
    topic: "p1_personal",
    question: {
      nl: "Wat vind je leuk aan Nederland?",
      zh: "你喜欢荷兰的什么？",
      en: "What do you like about the Netherlands?",
    },
    answer: {
      nl: "Ik vind de vrijheid fijn en de mensen zijn aardig.",
      zh: "我喜欢这里的自由，而且人们很友善。",
      en: "I like the freedom and the people are nice.",
    },
    tip: {
      nl: "Noem één of twee positieve dingen.",
      zh: "列举一两个积极的方面。",
      en: "Mention one or two positive things.",
    },
  },

  // --- THEME: DAILY LIFE (p1_daily) ---
  {
    id: "p1-01",
    topic: "p1_daily",
    question: {
      nl: "Wat doe je liever: thuis eten of in een restaurant eten? En waarom?",
      zh: "你更喜欢在家吃还是在餐馆吃？为什么？",
      en: "Do you prefer eating at home or in a restaurant? And why?",
    },
    answer: {
      nl: "Ik eet liever thuis, want ik vind koken leuk en het is goedkoper.",
      zh: "我更喜欢在家吃，因为我喜欢做饭，而且更便宜。",
      en: "I prefer eating at home, because I like cooking and it is cheaper.",
    },
    variations: [
      {
        nl: "Ik ga liever naar een restaurant, want ik houd niet van koken.",
        zh: "我更喜欢去餐馆，因为我不喜欢做饭。",
        en: "I prefer going to a restaurant, because I don't like cooking.",
      },
    ],
    tip: {
      nl: "Geef antwoord én een reden (want...).",
      zh: "回答选择并给出理由（使用 want...）。",
      en: "Give an answer AND a reason (using 'want'...).",
    },
  },
  {
    id: "p1-02",
    topic: "p1_daily",
    question: {
      nl: "Wat vind je van het weer in Nederland?",
      zh: "你觉得荷兰的天气怎么样？",
      en: "What do you think of the weather in the Netherlands?",
    },
    answer: {
      nl: "Ik vind het weer niet zo leuk, want het regent vaak.",
      zh: "我不太喜欢这里的气候，因为经常下雨。",
      en: "I don't like the weather much, because it rains often.",
    },
    tip: {
      nl: "Gebruik 'Ik vind...' om je mening te geven.",
      zh: "使用 'Ik vind...' 来表达观点。",
      en: "Use 'Ik vind...' to express your opinion.",
    },
  },
  {
    id: "p1-03",
    topic: "p1_daily",
    question: {
      nl: "Hoe ga je meestal naar de supermarkt?",
      zh: "你通常怎么去超市？",
      en: "How do you usually go to the supermarket?",
    },
    answer: {
      nl: "Ik ga meestal met de fiets, want de supermarkt is dichtbij.",
      zh: "我通常骑自行车去，因为超市很近。",
      en: "I usually go by bike, because the supermarket is close.",
    },
    tip: {
      nl: "Vertel hoe (vervoersmiddel) en waarom.",
      zh: "说明交通方式和原因。",
      en: "State the transport mode and why.",
    },
  },
  {
    id: "p1-04",
    topic: "p1_daily",
    question: {
      nl: "Wat doe je in je vrije tijd?",
      zh: "你空闲时间做什么？",
      en: "What do you do in your free time?",
    },
    answer: {
      nl: "In mijn vrije tijd kijk ik graag televisie en wandel ik in het park.",
      zh: "空闲时间我喜欢看电视和在公园散步。",
      en: "In my free time I like to watch TV and walk in the park.",
    },
    tip: {
      nl: "Noem twee activiteiten.",
      zh: "列举两个活动。",
      en: "Mention two activities.",
    },
  },
  {
    id: "p1-05",
    topic: "p1_daily",
    question: {
      nl: "Wat vind je van het Nederlandse eten?",
      zh: "你觉得荷兰食物怎么样？",
      en: "What do you think of Dutch food?",
    },
    answer: {
      nl: "Ik vind het Nederlandse eten lekker, vooral de stamppot en de kaas.",
      zh: "我觉得荷兰食物很好吃，特别是捣碎的土豆泥蔬菜和奶酪。",
      en: "I think Dutch food is tasty, especially the 'stamppot' and the cheese.",
    },
    tip: {
      nl: "Wees positief of beleefd. Noem een specifiek gerecht.",
      zh: "保持积极或礼貌。提到一个具体的菜。",
      en: "Be positive or polite. Mention a specific dish.",
    },
  },
  {
    id: "p1-11",
    topic: "p1_daily",
    question: {
      nl: "Wat is je favoriete feestdag?",
      zh: "你最喜欢的节日是什么？",
      en: "What is your favorite holiday?",
    },
    answer: {
      nl: "Mijn favoriete feestdag is Kerstmis, want dan ben ik samen met familie.",
      zh: "我最喜欢的节日是圣诞节，因为那时候我和家人在一起。",
      en: "My favorite holiday is Christmas, because then I am together with family.",
    },
    tip: {
      nl: "Noem een dag (Kerst, Koningsdag) en waarom.",
      zh: "提一个节日（圣诞节、国王节）并说明原因。",
      en: "Name a day (Christmas, King's Day) and why.",
    },
  },

  // --- THEME: WORK & EDUCATION (p1_work) ---
  {
    id: "p1-06",
    topic: "p1_work",
    question: {
      nl: "Hoe ga je naar je werk of naar school?",
      zh: "你怎么去上班或上学？",
      en: "How do you go to work or school?",
    },
    answer: {
      nl: "Ik ga met de bus naar mijn werk, want dat is makkelijk.",
      zh: "我坐公交车去上班，因为那样很方便。",
      en: "I go to work by bus, because that is easy.",
    },
    tip: {
      nl: "Gebruik 'met de...' (bus/trein/fiets).",
      zh: "使用 'met de...' (公交/火车/自行车)。",
      en: "Use 'met de...' (bus/train/bike).",
    },
  },
  {
    id: "p1-07",
    topic: "p1_work",
    question: {
      nl: "Wat voor werk doe je nu, of wat voor werk wil je doen?",
      zh: "你现在做什么工作，或者你想做什么工作？",
      en: "What kind of work do you do now, or what do you want to do?",
    },
    answer: {
      nl: "Ik werk nu niet, maar ik wil graag in een winkel werken.",
      zh: "我现在没工作，但我很想在商店工作。",
      en: "I am not working now, but I would like to work in a shop.",
    },
    tip: {
      nl: "Vertel wat je wilt ('Ik wil graag...').",
      zh: "说出你的意愿 ('Ik wil graag...')。",
      en: "Say what you want ('Ik wil graag...').",
    },
  },
  {
    id: "p1-12",
    topic: "p1_work",
    question: {
      nl: "Hoe laat begint je werk of school meestal?",
      zh: "你通常几点开始工作或上学？",
      en: "What time do your work or school usually start?",
    },
    answer: {
      nl: "Ik begin meestal om half negen 's ochtends.",
      zh: "我通常早上八点半开始。",
      en: "I usually start at half past eight in the morning.",
    },
    tip: {
      nl: "Noem een tijdstip (bijv. 9 uur, half 9).",
      zh: "提到一个时间点（如9点，8点半）。",
      en: "Mention a time (e.g., 9 o'clock, half past 8).",
    },
  },

  // --- THEME: PART 2 PICTURES (part2) ---
  {
    id: "p2-01",
    topic: "part2",
    imagePrompt: "A photo of a friendly woman standing in a bright Dutch supermarket, choosing fresh apples from a crate, holding a vegetable in her hand, realistic style, 4k",
    image: "/images/speaking/supermarket.png",
    question: {
      nl: "Wat doet de vrouw?",
      zh: "这个女人在做什么？",
      en: "What is the woman doing?",
    },
    answer: {
      nl: "De vrouw is in de supermarkt. Ze koopt appels en groenten.",
      zh: "这个女人在超市。她在买苹果和蔬菜。",
      en: "The woman is in the supermarket. She is buying apples and vegetables.",
    },
    tip: {
      nl: "Beschrijf wie je ziet en wat ze doen.",
      zh: "描述你看到了谁以及他们在做什么。",
      en: "Describe who you see and what they are doing.",
    },
  },
  {
    id: "p2-02",
    topic: "part2",
    imagePrompt: "A sunny day in a green park in the Netherlands, happy children playing soccer on the grass, trees in the background, realistic style, 4k",
    image: "/images/speaking/park.png",
    question: {
      nl: "Beschrijf wat je ziet.",
      zh: "描述你看到的。",
      en: "Describe what you see.",
    },
    answer: {
      nl: "Ik zie kinderen in het park. Ze spelen met een bal. Het is mooi weer.",
      zh: "我看到孩子们在公园里。他们在玩球。天气很好。",
      en: "I see children in the park. They are playing with a ball. The weather is nice.",
    },
    tip: {
      nl: "Vertel waar ze zijn en wat ze doen.",
      zh: "说出他们在哪里以及在做什么。",
      en: "Say where they are and what they are doing.",
    },
  },
  {
    id: "p2-03",
    topic: "part2",
    imagePrompt: "A group of people waiting at a bus stop in a Dutch city, a bus is approaching in the background, street scene, realistic style, 4k",
    image: "/images/speaking/office.png",
    question: {
      nl: "Wat gebeurt er op het plaatje?",
      zh: "图片上发生了什么？",
      en: "What is happening in the picture?",
    },
    answer: {
      nl: "Er staan mensen bij de bushalte. Ze wachten op de bus. De bus komt eraan.",
      zh: "有人在公交车站。他们在等公交车。公交车来了。",
      en: "There are people at the bus stop. They are waiting for the bus. The bus is arriving.",
    },
    tip: {
      nl: "Gebruik eenvoudige zinnen: 'Ik zie...'.",
      zh: "使用简单的句子：'Ik zie...' (我看到...)",
      en: "Use simple sentences: 'Ik zie...'.",
    },
  },
  {
    id: "p2-04",
    topic: "part2",
    imagePrompt: "A professional man sitting at a desk in a modern office, typing on a computer keyboard, focused expression, bright office background, realistic style, 4k",
    image: "/images/speaking/bus stop.png",
    question: {
      nl: "Wat doet de man?",
      zh: "这个男人在做什么？",
      en: "What is the man doing?",
    },
    answer: {
      nl: "De man werkt op kantoor. Hij zit achter de computer en hij typt een e-mail.",
      zh: "这个男人在办公室工作。他坐在电脑后面，正在写邮件。",
      en: "The man is working at the office. He is sitting at the computer and typing an email.",
    },
    tip: {
      nl: "Beschrijf de actie (werken, typen).",
      zh: "描述动作（工作，打字）。",
      en: "Describe the action (working, typing).",
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
    id: "login",
    title: {
      nl: "Inloggen",
      zh: "登录系统",
      en: "Log in",
    },
    detail: {
      nl: "Log in met je DigiD of examencode op de computer.",
      zh: "在电脑上登录。",
      en: "Log in on the computer.",
    },
  },
  {
    id: "check",
    title: {
      nl: "Microfoon check",
      zh: "麦克风测试",
      en: "Mic Check",
    },
    detail: {
      nl: "Spreek je naam in om te testen of het werkt.",
      zh: "录制你的名字，测试设备。",
      en: "Record your name to test if it works.",
    },
  },
  {
    id: "part1",
    title: {
      nl: "Deel 1: Vragen",
      zh: "第一部分：问答",
      en: "Part 1: Questions",
    },
    detail: {
      nl: "Kijk naar de video. Luister naar de vraag. Geef antwoord.",
      zh: "看视频听问题，然后作答。",
      en: "Watch video. Listen to question. Answer.",
    },
  },
  {
    id: "part2",
    title: {
      nl: "Deel 2: Plaatjes",
      zh: "第二部分：看图说话",
      en: "Part 2: Pictures",
    },
    detail: {
      nl: "Wat zie je op het plaatje? Beschrijf het.",
      zh: "你在图片上看到了什么？请描述。",
      en: "What do you see in the picture? Describe it.",
    },
  },
];
