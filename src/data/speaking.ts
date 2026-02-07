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
    nl: "Oefen met de vier soorten opdrachten: Vragen, Foto's, Vergelijken en Verhalen.",
    zh: "练习四种考试题型：问答、看图说话、对比选择、看图讲故事。",
    en: "Practice the four task types: Questions, Pictures, Comparison, and Storytelling.",
  },
  heroLead: {
    nl: "Bereid je voor op het examen met realistische oefeningen.",
    zh: "通过逼真的练习为考试做好准备。",
    en: "Prepare for the exam with realistic exercises.",
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
    nl: "Kies een opdracht om te beginnen.",
    zh: "选择一个题型开始模拟，请保持表达清晰简洁。",
    en: "Select a task below to start. Speak clearly, keep it simple.",
  },
};

export const heroStats: { id: string; label: TriText; value: TriText }[] = [
  {
    id: "parts",
    label: {
      nl: "Onderdelen",
      zh: "考试题型",
      en: "Parts",
    },
    value: {
      nl: "4 Soorten Opdrachten",
      zh: "四种题型 (问答/描述/对比/故事)",
      en: "4 Task Types",
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
      nl: "Het examen gebeurt op de computer. Je ziet video's of plaatjes en spreekt antwoorden in.",
      zh: "全程机考。根据视频或图片回答问题，通过麦克风录音。",
      en: "Computer-based. You watch videos or look at pictures and record your answers.",
    },
    note: {
      nl: "Er is geen examinator aanwezig.",
      zh: "没有真人考官在场。",
      en: "There is no human examiner present.",
    },
  },
  {
    id: "tasks",
    title: {
      nl: "De Opdrachten",
      zh: "考试内容",
      en: "The Tasks",
    },
    detail: {
      nl: "1. Vragen beantwoorden. 2. Foto beschrijven. 3. Keuze maken (vergelijken). 4. Verhaal vertellen.",
      zh: "1. 回答问题。 2. 描述图片。 3. 对比选择。 4. 看图讲故事。 每种题型4题，共16题，总计35分钟。",
      en: "1. Answer questions. 2. Describe photo. 3. Make a choice. 4. Tell a story. Each task type has 4 questions, totaling 16 questions and 35 minutes.",
    },
    note: {
      nl: "Gebruik eenvoudige zinnen.",
      zh: "使用简单、完整的句子。",
      en: "Use simple, complete sentences.",
    },
  },
  {
    id: "tips",
    title: {
      nl: "Tips",
      zh: "技巧",
      en: "Tips",
    },
    detail: {
      nl: "Luister goed. Praat rustig en duidelijk. Corrigeer jezelf als het moet.",
      zh: "仔细听题。说话沉稳清晰。如果说错了可以纠正自己。",
      en: "Listen carefully. Speak slowly and clearly. Correct yourself if needed.",
    },
  },
];

export type SpeakingTheme = {
  id: "type1_qa" | "type2_photo" | "type3_comparison" | "type4_story";
  title: TriText;
  description: TriText;
};

export const speakingThemes: SpeakingTheme[] = [
  {
    id: "type1_qa",
    title: {
      nl: "1. Vraag & Antwoord",
      zh: "1. 问答题",
      en: "1. Question & Answer",
    },
    description: {
      nl: "Luister naar de situatie en beantwoord de vragen.",
      zh: "先听一段情景描述，然后回答问题（模拟真实考试）。",
      en: "Listen to the scenario and answer the questions.",
    },
  },
  {
    id: "type2_photo",
    title: {
      nl: "2. Foto Beschrijven",
      zh: "2. 描述图片",
      en: "2. Photo Description",
    },
    description: {
      nl: "Vertel wat je ziet op de foto.",
      zh: "描述图片中的人以及他在做什么。",
      en: "Describe what you see in the photo.",
    },
  },
  {
    id: "type3_comparison",
    title: {
      nl: "3. Vergelijken",
      zh: "3. 对比选择",
      en: "3. Comparison",
    },
    description: {
      nl: "Kies een foto en vertel waarom.",
      zh: "在两张图片中选择一个，并解释原因。",
      en: "Choose a photo and explain why.",
    },
  },
  {
    id: "type4_story",
    title: {
      nl: "4. Verhaal Vertellen",
      zh: "4. 看图讲故事",
      en: "4. Storytelling",
    },
    description: {
      nl: "Vertel een verhaal bij de plaatjes.",
      zh: "根据三张图片描述一个完整的故事。",
      en: "Tell a story based on the pictures.",
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
    id: "qa-phrases",
    title: {
      nl: "Vraag & Antwoord",
      zh: "问答常用句",
      en: "Q&A Phrases",
    },
    phrases: [
      {
        dutch: "Ik vind ... leuk, want ...",
        translation: { nl: "", zh: "我喜欢...，因为...", en: "I like ..., because ..." },
      },
      {
        dutch: "Ik vind ... leuk, daarom ...",
        translation: { nl: "", zh: "我喜欢...，所以...", en: "I like ..., therefore ..." },
      },
      {
        dutch: "Ik doe dat vaak / nooit.",
        translation: { nl: "", zh: "我经常/从不那样做。", en: "I do that often / never." },
      },
      {
        dutch: "Mijn favoriete ... is ...",
        translation: { nl: "", zh: "我最喜欢的...是...", en: "My favorite ... is ..." },
      },
      {
        dutch: "In het weekend ga ik ...",
        translation: { nl: "", zh: "周末我去...", en: "In the weekend I go ..." },
      },
      {
        dutch: "Ik ga liever met de auto / trein.",
        translation: { nl: "", zh: "我更喜欢坐车/坐火车。", en: "I prefer going by car / train." },
      },
      {
        dutch: "Dat doe ik elke dag / week.",
        translation: { nl: "", zh: "我每天/每周都那样做。", en: "I do that every day / week." },
      },
      {
        dutch: "Omdat ik dat gezellig vind.",
        translation: { nl: "", zh: "因为我觉得那很惬意/愉快。", en: "Because I find that cozy/pleasant." },
      },
      {
        dutch: "Ik vind koken / sporten leuk.",
        translation: { nl: "", zh: "我喜欢做饭/运动。", en: "I like cooking / sports." },
      },
      {
        dutch: "Ik ga vaak naar de markt.",
        translation: { nl: "", zh: "我经常去市场。", en: "I often go to the market." },
      },
      {
        dutch: "Dat vind ik te duur.",
        translation: { nl: "", zh: "我觉得那个太贵了。", en: "I think that is too expensive." },
      },
    ],
  },
  {
    id: "photo-phrases",
    title: {
      nl: "Foto Beschrijven",
      zh: "描述图片常用句",
      en: "Photo Description Phrases",
    },
    phrases: [
      {
        dutch: "Ik zie een man / vrouw.",
        translation: { nl: "", zh: "我看到一个男人/女人。", en: "I see a man / woman." },
      },
      {
        dutch: "Hij / Zij is in de ... (winkel/keuken).",
        translation: { nl: "", zh: "他/她在...（商店/厨房）。", en: "He/She is in the ... (shop/kitchen)." },
      },
      {
        dutch: "Hij / Zij is aan het ... (koken/werken).",
        translation: { nl: "", zh: "他/她正在...（做饭/工作）。", en: "He/She is ... (cooking/working)." },
      },
      {
        dutch: "Het is mooi / slecht weer.",
        translation: { nl: "", zh: "天气很好/不好。", en: "The weather is nice/bad." },
      },
      {
        dutch: "Er zijn twee / drie mensen.",
        translation: { nl: "", zh: "有两/三个人。", en: "There are two / three people." },
      },
      {
        dutch: "Ze zien er blij / boos uit.",
        translation: { nl: "", zh: "他们看起来很高兴/生气。", en: "They look happy / angry." },
      },
      {
        dutch: "Op de achtergrond zie ik ...",
        translation: { nl: "", zh: "在背景中我看到...", en: "In the background I see ..." },
      },
      {
        dutch: "Hij / Zij draagt een jas / bril.",
        translation: { nl: "", zh: "他/她穿着外套/戴着眼镜。", en: "He/She is wearing a coat / glasses." },
      },
      {
        dutch: "Ze staan bij de bushalte.",
        translation: { nl: "", zh: "他们在公交车站。", en: "They are at the bus stop." },
      },
      {
        dutch: "Hij heeft een fiets.",
        translation: { nl: "", zh: "他有一辆自行车。", en: "He has a bicycle." },
      },
    ],
  },
  {
    id: "comparison-phrases",
    title: {
      nl: "Vergelijken",
      zh: "对比选择常用句",
      en: "Comparison Phrases",
    },
    phrases: [
      {
        dutch: "Ik kies plaatje 1 / 2.",
        translation: { nl: "", zh: "我选择图片 1 / 2。", en: "I choose picture 1 / 2." },
      },
      {
        dutch: "Ik vind ... mooier / beter.",
        translation: { nl: "", zh: "我觉得...更漂亮/更好。", en: "I think ... is prettier / better." },
      },
      {
        dutch: "Ik houd meer van ...",
        translation: { nl: "", zh: "我更喜欢...", en: "I prefer ..." },
      },
      {
        dutch: "Daarom vindt ik het beter.",
        translation: { nl: "", zh: "所以我更喜欢它。", en: "So I prefer it. " },
      },
      {
        dutch: "Dat vind ik belangrijk.",
        translation: { nl: "", zh: "我觉得那很重要。", en: "I think that is important." },
      },
      {
        dutch: "Ik doe dat liever.",
        translation: { nl: "", zh: "我更喜欢那样做。", en: "I prefer doing that." },
      },
      {
        dutch: "... is gezelliger dan ...",
        translation: { nl: "", zh: "...比...更惬意。", en: "... is cozier than ..." },
      },
      {
        dutch: "Ik vind ... niet leuk.",
        translation: { nl: "", zh: "我不喜欢...", en: "I don't like ..." },
      },
      {
        dutch: "Het rechter plaatje is mooier.",
        translation: { nl: "", zh: "右边的图片更漂亮。", en: "The right picture is prettier." },
      },
      {
        dutch: "Het linker plaatje is drukker.",
        translation: { nl: "", zh: "左边的图片更拥挤/忙碌。", en: "The left picture is busier." },
      },
      {
        dutch: "Ik houd niet van ...",
        translation: { nl: "", zh: "我不喜欢...", en: "I do not like ..." },
      },
    ],
  },
  {
    id: "story-phrases",
    title: {
      nl: "Verhaal Vertellen",
      zh: "讲故事常用句",
      en: "Storytelling Phrases",
    },
    phrases: [
      {
        dutch: "Op het eerste plaatje ...",
        translation: { nl: "", zh: "在第一张图片上...", en: "In the first picture ..." },
      },
      {
        dutch: "Op het tweede plaatje ...",
        translation: { nl: "", zh: "在第二张图片上...", en: "In the second picture ..." },
      },
      {
        dutch: "Op het derde plaatje ...",
        translation: { nl: "", zh: "在第三张图片上...", en: "In the third picture ..." },
      },
      {
        dutch: "Op het laatste plaatje ...",
        translation: { nl: "", zh: "在最后一张图片上...", en: "In the last picture ..." },
      },
      {
        dutch: "Eerst ... (gaat hij naar buiten).",
        translation: { nl: "", zh: "首先...（他出去了）。", en: "First ... (he goes outside)." },
      },
      {
        dutch: "Daarna ... (pakt hij zijn fiets).",
        translation: { nl: "", zh: "然后...（他拿了他的自行车）。", en: "Then ... (he takes his bike)." },
      },
      {
        dutch: "Ten slotte ... (fietst hij weg).",
        translation: { nl: "", zh: "最后...（他骑走了）。", en: "Finally ... (he cycles away)." },
      },
      {
        dutch: "Hij is blij / moe.",
        translation: { nl: "", zh: "他很高兴/累了。", en: "He is happy / tired." },
      },
      {
        dutch: "Hij / Zij wil ...",
        translation: { nl: "", zh: "他/她想...", en: "He / She wants to ..." },
      },
      {
        dutch: "Dan gaat hij / zij naar ...",
        translation: { nl: "", zh: "然后他/她去了...", en: "Then he / she goes to ..." },
      },
      {
        dutch: "Het is vroeg / laat.",
        translation: { nl: "", zh: "现在很早/很晚。", en: "It is early / late." },
      },
      {
        dutch: "Ze gaan samen ...",
        translation: { nl: "", zh: "他们一起去...", en: "They go together ..." },
      },
      {
        dutch: "Hij praat met de vrouw.",
        translation: { nl: "", zh: "他和那位女士说话。", en: "He is talking to the woman." },
      },
      {
        dutch: "Ze gaan naar huis.",
        translation: { nl: "", zh: "他们回家了。", en: "They are going home." },
      },
    ],
  },
];

export type SpeakingQuestion = {
  id: string;
  topic: SpeakingTheme["id"];
  scenario?: TriText; // Optional scenario/context description (for type1_qa)
  question: TriText;
  answer: TriText;
  variations?: TriText[];
  tip: TriText;
  imagePrompts?: string[];
  images?: string[]; // Array of image paths
};

export const speakingQuestions: SpeakingQuestion[] = [
  // --- TYPE 1: Q&A (真实考试格式：Context + 双重问题) ---
  
  // 1. 关于日常生活 (Dagelijks leven)
  {
    id: "q1-cleaning-house",
    topic: "type1_qa",
    scenario: {
      nl: "Ik maak mijn huis meestal schoon in het weekend.",
      zh: "我通常在周末打扫房子。",
      en: "I usually clean my house on the weekend.",
    },
    question: {
      nl: "Wanneer maakt u uw huis meestal schoon? Vertel ook waarom u dat doet.",
      zh: "您通常什么时候打扫房子？也请说明您为什么这样做。",
      en: "When do you usually clean your house? Also tell why you do that.",
    },
    answer: {
      nl: "Ik maak mijn huis op maandag schoon, want dan heb ik een vrije dag.",
      zh: "我在周一打扫房子，因为那天我有空。",
      en: "I clean my house on Monday, because then I have a free day.",
    },
    tip: {
      nl: "Beantwoord beide delen: wanneer EN waarom. Gebruik 'want' of 'omdat'.",
      zh: "回答两个部分：什么时候和为什么。使用 'want' 或 'omdat'。",
      en: "Answer both parts: when AND why. Use 'want' or 'omdat'.",
    },
  },
  {
    id: "q1-breakfast-drink",
    topic: "type1_qa",
    scenario: {
      nl: "Ik drink elke ochtend koffie.",
      zh: "我每天早上喝咖啡。",
      en: "I drink coffee every morning.",
    },
    question: {
      nl: "Wat drinkt u bij uw ontbijt? Vertel ook hoe laat u ontbijt.",
      zh: "您早餐喝什么？也请说明您几点吃早餐。",
      en: "What do you drink with your breakfast? Also tell what time you have breakfast.",
    },
    answer: {
      nl: "Ik drink thee bij mijn ontbijt. Ik ontbijt meestal om acht uur.",
      zh: "我早餐喝茶。我通常在八点吃早餐。",
      en: "I drink tea with my breakfast. I usually have breakfast at eight o'clock.",
    },
    tip: {
      nl: "Beantwoord beide vragen: wat drink je EN hoe laat ontbijt je.",
      zh: "回答两个问题：你喝什么和你几点吃早餐。",
      en: "Answer both questions: what do you drink AND what time do you have breakfast.",
    },
  },
  
  // 2. 关于业余爱好与空闲时间 (Vrije tijd)
  {
    id: "q1-homework-location",
    topic: "type1_qa",
    scenario: {
      nl: "Ik maak graag huiswerk op mijn slaapkamer.",
      zh: "我喜欢在卧室做作业。",
      en: "I like to do homework in my bedroom.",
    },
    question: {
      nl: "Waar maakt u graag huiswerk? Vertel ook waarom.",
      zh: "您喜欢在哪里做作业？也请说明原因。",
      en: "Where do you like to do homework? Also tell why.",
    },
    answer: {
      nl: "Ik maak graag huiswerk in de bibliotheek, omdat het daar lekker rustig is.",
      zh: "我喜欢在图书馆做作业，因为那里很安静。",
      en: "I like to do homework in the library, because it's nice and quiet there.",
    },
    tip: {
      nl: "Geef een plaats EN een reden met 'omdat' of 'want'.",
      zh: "给出一个地点和一个理由，使用 'omdat' 或 'want'。",
      en: "Give a place AND a reason with 'omdat' or 'want'.",
    },
  },
  {
    id: "q1-reading-books",
    topic: "type1_qa",
    scenario: {
      nl: "Ik lees graag boeken in het weekend.",
      zh: "我喜欢在周末读书。",
      en: "I like to read books on the weekend.",
    },
    question: {
      nl: "Wat leest u graag? Vertel ook hoe vaak u leest.",
      zh: "您喜欢读什么？也请说明您多久读一次。",
      en: "What do you like to read? Also tell how often you read.",
    },
    answer: {
      nl: "Ik lees graag de krant. Ik lees elke dag.",
      zh: "我喜欢读报纸。我每天都读。",
      en: "I like to read the newspaper. I read every day.",
    },
    tip: {
      nl: "Beantwoord beide delen: wat lees je EN hoe vaak.",
      zh: "回答两个部分：你读什么和你多久读一次。",
      en: "Answer both parts: what do you read AND how often.",
    },
  },
  
  // 3. 关于交通与出行 (Vervoer)
  {
    id: "q1-bicycles",
    topic: "type1_qa",
    scenario: {
      nl: "Ik heb twee fietsen: één om mee naar het werk te gaan en één om te sporten.",
      zh: "我有两辆自行车：一辆用来上班，一辆用来运动。",
      en: "I have two bicycles: one to go to work and one for sports.",
    },
    question: {
      nl: "Hoeveel fietsen heeft u? Vertel ook wanneer u een fiets gebruikt.",
      zh: "您有多少辆自行车？也请说明您什么时候使用自行车。",
      en: "How many bicycles do you have? Also tell when you use a bicycle.",
    },
    answer: {
      nl: "Ik heb één fiets. Ik gebruik mijn fiets om naar de supermarkt te gaan.",
      zh: "我有一辆自行车。我用我的自行车去超市。",
      en: "I have one bicycle. I use my bicycle to go to the supermarket.",
    },
    tip: {
      nl: "Beantwoord beide delen: hoeveel EN wanneer gebruik je een fiets.",
      zh: "回答两个部分：多少辆和什么时候使用。",
      en: "Answer both parts: how many AND when do you use a bicycle.",
    },
  },
  {
    id: "q1-bus-travel",
    topic: "type1_qa",
    scenario: {
      nl: "Ik reis vaak met de bus.",
      zh: "我经常坐公交车。",
      en: "I often travel by bus.",
    },
    question: {
      nl: "Reist u vaak met de bus? Vertel ook waarom wel of waarom niet.",
      zh: "您经常坐公交车吗？也请说明为什么或为什么不。",
      en: "Do you often travel by bus? Also tell why or why not.",
    },
    answer: {
      nl: "Nee, ik reis niet vaak met de bus, want ik ga liever met de auto.",
      zh: "不，我不经常坐公交车，因为我更喜欢开车。",
      en: "No, I don't often travel by bus, because I prefer to go by car.",
    },
    tip: {
      nl: "Geef een antwoord (ja/nee) EN leg uit waarom met 'want' of 'omdat'.",
      zh: "给出答案（是/否）并用 'want' 或 'omdat' 解释原因。",
      en: "Give an answer (yes/no) AND explain why with 'want' or 'omdat'.",
    },
  },
  
  // 4. 关于社交与邻里 (Sociaal & Buren)
  {
    id: "q1-neighbors-talk",
    topic: "type1_qa",
    scenario: {
      nl: "Ik praat elke dag met mijn buren.",
      zh: "我每天都和邻居聊天。",
      en: "I talk to my neighbors every day.",
    },
    question: {
      nl: "Hoe vaak praat u met uw buren? Vertel ook wat u van uw buren vindt.",
      zh: "您多久和邻居聊一次天？也请说明您对邻居的看法。",
      en: "How often do you talk to your neighbors? Also tell what you think of your neighbors.",
    },
    answer: {
      nl: "Ik praat twee keer per week met mijn buren. Ik vind ze heel aardig.",
      zh: "我每周和邻居聊两次天。我觉得他们很友善。",
      en: "I talk to my neighbors twice a week. I think they are very nice.",
    },
    tip: {
      nl: "Beantwoord beide delen: hoe vaak EN wat vind je van je buren.",
      zh: "回答两个部分：多久一次和你对邻居的看法。",
      en: "Answer both parts: how often AND what do you think of your neighbors.",
    },
  },
  {
    id: "q1-dutch-haste",
    topic: "type1_qa",
    scenario: {
      nl: "Nederlanders hebben vaak haast.",
      zh: "荷兰人经常很匆忙。",
      en: "Dutch people are often in a hurry.",
    },
    question: {
      nl: "Wat vindt u daarvan? Vertel ook wanneer u zelf haast heeft.",
      zh: "您对此有什么看法？也请说明您自己什么时候会匆忙。",
      en: "What do you think of that? Also tell when you yourself are in a hurry.",
    },
    answer: {
      nl: "Ik vind dat niet fijn. Ik heb haast als ik te laat ben voor mijn werk.",
      zh: "我觉得这不太好。当我上班迟到时我会匆忙。",
      en: "I don't like that. I'm in a hurry when I'm late for work.",
    },
    tip: {
      nl: "Geef je mening met 'Ik vind...' EN vertel wanneer je zelf haast hebt.",
      zh: "用 'Ik vind...' 给出你的观点，并说明你自己什么时候会匆忙。",
      en: "Give your opinion with 'Ik vind...' AND tell when you yourself are in a hurry.",
    },
  },

  // --- TYPE 2: PHOTO DESCRIPTION ---
  {
    id: "q2-supermarket",
    topic: "type2_photo",
    imagePrompts: [
      "nano banana: A photo of a woman in a Dutch supermarket choosing fresh apples from a crate, holding a vegetable, realistic style"
    ],
    images: ["/images/speaking/supermarket.png"],
    question: {
      nl: "Beschrijf de vrouw en wat ze doet.",
      zh: "请描述这位女士以及她在做什么。",
      en: "Describe the woman and what she is doing.",
    },
    answer: {
      nl: "De vrouw is in de supermarkt. Ze heeft lang haar en draagt een trui. Ze pakt appels.",
      zh: "这位女士在超市。她留着长发，穿着毛衣。她正在拿苹果。",
      en: "The woman is in the supermarket. She has long hair and wears a sweater. She is taking apples.",
    },
    tip: {
      nl: "Zeg hoe ze eruitziet (kleding/haar) en de actie.",
      zh: "描述她的外貌（衣服/头发）和动作。",
      en: "Say what she looks like (clothes/hair) and the action.",
    },
  },
  {
    id: "q2-office",
    topic: "type2_photo",
    imagePrompts: [
      "nano banana: A man sitting at a desk in a modern office typing on a computer keyboard, bright office background, realistic"
    ],
    images: ["/images/speaking/office.png"],
    question: {
      nl: "Beschrijf de man en wat hij doet.",
      zh: "请描述这位男士以及他在做什么。",
      en: "Describe the man and what he is doing.",
    },
    answer: {
      nl: "De man zit op een kantoor. Hij draagt een overhemd. Hij typt op de computer.",
      zh: "这位男士在办公室。他穿着衬衫。他正在电脑上打字。",
      en: "The man is sitting in an office. He is wearing a shirt. He is typing on the computer.",
    },
    tip: {
      nl: "Beschrijf de persoon (kleding) en de actie (werken).",
      zh: "描述人物（衣服）和动作（工作）。",
      en: "Describe the person (clothes) and the action (working).",
    },
  },
  {
    id: "q2-park",
    topic: "type2_photo",
    imagePrompts: [
      "nano banana: A sunny day in a green park in the Netherlands, happy children playing soccer on the grass, trees in the background, realistic style"
    ],
    images: ["/images/speaking/park.png"],
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
    id: "q2-busstop",
    topic: "type2_photo",
    imagePrompts: [
      "nano banana: A group of people waiting at a bus stop in a Dutch city, a bus is approaching in the background, street scene, realistic style"
    ],
    images: ["/images/speaking/bus stop.png"],
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

  // --- TYPE 3: COMPARISON ---
  {
    id: "q3-school",
    topic: "type3_comparison",
    imagePrompts: [
      "nano banana: An old traditional brick school building in the Netherlands, cloudy sky",
      "nano banana: A modern colorful school building with large windows and a playground, sunny"
    ],
    images: [
      "/images/speaking/school_old.png",
      "/images/speaking/school_new.png"
    ],
    question: {
      nl: "In welke school heb je liever les? En waarom?",
      zh: "你更喜欢在哪所学校上课？为什么？",
      en: "In which school would you rather have lessons? And why?",
    },
    answer: {
      nl: "Ik heb liever les in de rechter school, want dat is mooier.",
      zh: "我更喜欢在右边的学校上课，因为我觉得它更漂亮。",
      en: "I prefer having lessons in the school on the right, because I think it is prettier.",
    },
    tip: {
      nl: "Kies plaatje 1 of 2 en geef een reden.",
      zh: "选择图片1或2并给出理由。",
      en: "Choose picture 1 or 2 and give a reason.",
    },
  },
  {
    id: "q3-living",
    topic: "type3_comparison",
    imagePrompts: [
      "nano banana: A small cozy city apartment living room with a view of the street",
      "nano banana: A large detached house with a green garden in a village"
    ],
    images: [
      "/images/speaking/apartment.png",
      "/images/speaking/house.png"
    ],
    question: {
      nl: "Waar woon je liever? En waarom?",
      zh: "你更喜欢住在哪里？为什么？",
      en: "Where do you prefer to live? And why?",
    },
    answer: {
      nl: "Ik woon liever in het rechter huis, want dat vind ik mooier.",
      zh: "我更喜欢住在右边的房子里，因为我觉得它更漂亮。",
      en: "I prefer living in the house on the right, because I think it is prettier.",
    },
    tip: {
      nl: "Kies wat jij leuk vindt en zeg waarom.",
      zh: "选择你喜欢的并说明原因。",
      en: "Choose what you like and say why.",
    },
  },

  // --- TYPE 4: STORYTELLING ---
  {
    id: "q4-bike-commute",
    topic: "type4_story",
    imagePrompts: [
      "nano banana: A woman riding a bicycle on a Dutch cycle path, happy expression",
      "nano banana: The woman parking her bicycle in a rack and locking it",
      "nano banana: The woman walking towards an office building, holding a bag"
    ],
    images: [
      "/images/speaking/story_bike_1.png",
      "/images/speaking/story_bike_2.png",
      "/images/speaking/story_bike_3.png"
    ],
    question: {
      nl: "Vertel het verhaal.",
      zh: "请讲述这个故事。",
      en: "Tell the story.",
    },
    answer: {
      nl: "Eerst fietst de vrouw naar haar werk. Daarna parkeert ze haar fiets. Ten slotte loopt ze naar het kantoor.",
      zh: "首先，这位女士骑车去上班。然后，她停好自行车。最后，她走向办公室。",
      en: "First, the woman cycles to work. Then she parks her bike. Finally, she walks to the office.",
    },
    tip: {
      nl: "Gebruik 'Eerst', 'Daarna' en 'Ten slotte'.",
      zh: "使用 '首先'、'然后'、'最后' 来连接句子。",
      en: "Use 'First', 'Then' and 'Finally'.",
    },
  },
];
