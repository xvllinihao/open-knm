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
      zh: "1. 回答问题。 2. 描述图片。 3. 对比选择。 4. 看图讲故事。",
      en: "1. Answer questions. 2. Describe photo. 3. Make a choice. 4. Tell a story.",
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
      nl: "Luister naar de vraag en geef antwoord.",
      zh: "听视频中的问题并回答（通常有两个问题）。",
      en: "Listen to the question and answer.",
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
        dutch: "Dat vind ik belangrijk.",
        translation: { nl: "", zh: "我觉得那很重要。", en: "I think that is important." },
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
  imagePrompts?: string[];
  images?: string[]; // Array of image paths
};

export const speakingQuestions: SpeakingQuestion[] = [
  // --- TYPE 1: Q&A ---
  {
    id: "q1-weekend",
    topic: "type1_qa",
    question: {
      nl: "Wat doe je graag in het weekend? En waarom?",
      zh: "你周末喜欢做什么？为什么？",
      en: "What do you like to do on the weekend? And why?",
    },
    answer: {
      nl: "In het weekend wandel ik graag in het park, want ik houd van de natuur.",
      zh: "周末我喜欢在公园散步，因为我热爱大自然。",
      en: "On the weekend I like to walk in the park, because I love nature.",
    },
    tip: {
      nl: "Geef een activiteit én een reden (want...).",
      zh: "给出一个活动和一个理由 (want...)。",
      en: "Give an activity AND a reason (want...).",
    },
  },
  {
    id: "q1-food",
    topic: "type1_qa",
    question: {
      nl: "Wat eet je liever: Hollandse pot of eten uit je eigen land? En waarom?",
      zh: "你更喜欢吃什么：荷兰菜还是你家乡的菜？为什么？",
      en: "What do you prefer to eat: Dutch food or food from your own country? And why?",
    },
    answer: {
      nl: "Ik eet liever eten uit mijn eigen land, want dat is kruidiger.",
      zh: "我更喜欢吃我家乡的菜，因为那个味道更丰富（更辣/更有味）。",
      en: "I prefer food from my own country, because it is spicier.",
    },
    tip: {
      nl: "Kies één optie en leg uit waarom.",
      zh: "选择一个选项并解释原因。",
      en: "Choose one option and explain why.",
    },
  },
  {
    id: "q1-travel",
    topic: "type1_qa",
    question: {
      nl: "Hoe ga je meestal naar je werk of school? En waarom?",
      zh: "你通常怎么去上班或上学？为什么？",
      en: "How do you usually go to work or school? And why?",
    },
    answer: {
      nl: "Ik ga meestal met de fiets, want dat is gratis en gezond.",
      zh: "我通常骑自行车去，因为那是免费且健康的。",
      en: "I usually go by bike, because that is free and healthy.",
    },
    tip: {
      nl: "Noem het vervoersmiddel en een voordeel.",
      zh: "提到交通工具和一个优点。",
      en: "Mention the transport mode and a benefit.",
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
      nl: "In welke school wil je les hebben? En waarom?",
      zh: "你想在哪所学校上课？为什么？",
      en: "In which school do you want to have lessons? And why?",
    },
    answer: {
      nl: "Ik wil les hebben in de nieuwe school, want die ziet er vrolijk en licht uit.",
      zh: "我想在新学校上课，因为它看起来很欢快明亮。",
      en: "I want to have lessons in the new school, because it looks cheerful and bright.",
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
      nl: "Waar wil je liever wonen? En waarom?",
      zh: "你更想住在哪里？为什么？",
      en: "Where would you prefer to live? And why?",
    },
    answer: {
      nl: "Ik woon liever in het grote huis, want ik houd van de tuin.",
      zh: "我更喜欢住在大房子里，因为我喜欢花园。",
      en: "I prefer to live in the large house, because I like the garden.",
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

