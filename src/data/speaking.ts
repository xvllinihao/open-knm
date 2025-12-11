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
        dutch: "Het rechterplaatje is mooier.",
        translation: { nl: "", zh: "右边的图片更漂亮。", en: "The right picture is prettier." },
      },
      {
        dutch: "Het linkerplaatje is drukker.",
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
    id: "q1-family",
    topic: "type1_qa",
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
    id: "q1-duration",
    topic: "type1_qa",
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
    id: "q1-opinion-nl",
    topic: "type1_qa",
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
  {
    id: "q1-weather-opinion",
    topic: "type1_qa",
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
    id: "q1-supermarket-transport",
    topic: "type1_qa",
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
    id: "q1-dutch-food",
    topic: "type1_qa",
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
    id: "q1-holiday",
    topic: "type1_qa",
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
  {
    id: "q1-work-desire",
    topic: "type1_qa",
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
    id: "q1-work-time",
    topic: "type1_qa",
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
      nl: "In welke school heb je liever les? En waarom?",
      zh: "你更喜欢在哪所学校上课？为什么？",
      en: "In which school would you rather have lessons? And why?",
    },
    answer: {
      nl: "Ik heb liever les in de rechterschool, want die vind ik mooier.",
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
      nl: "Ik woon liever in het rechterhuis, want dat vind ik mooier.",
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
