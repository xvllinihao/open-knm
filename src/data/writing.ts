import writingData from './dutch-a2-writing-course.json';

export type TriText = {
  nl: string;
  en: string;
  zh: string;
};

export type WritingRule = {
  type: "rule";
  content: TriText;
  example?: TriText;
};

export type GrammarRule = {
  type: "grammar";
  topic: string;
  explanation: TriText;
  examples: TriText[];
};

export type Connector = {
  word: string;
  meaning: TriText;
  example?: TriText;
  note?: TriText;
};

export type EmailTemplatePart = {
  part: string;
  formal: TriText;
  informal: TriText;
};

export type ScenarioPhrase = {
  nl: string;
  en: string;
  zh: string;
};

export type Scenario = {
  scenario: string;
  title: TriText;
  phrases: ScenarioPhrase[];
};

export type PracticeExercise = {
  id: string;
  task: TriText;
  answer: {
    nl: string;
    explanation: TriText;
  };
};

export type PracticeCategory = {
  id: string;
  title: TriText;
  exercises: PracticeExercise[];
};

export type WritingSection = {
  id: string;
  title: TriText;
  description?: TriText;
  items?: (WritingRule | GrammarRule | Connector | EmailTemplatePart | Scenario)[];
  categories?: PracticeCategory[];
};

export type WritingCourseData = {
  meta: {
    title: TriText;
    description: TriText;
    version: string;
  };
  sections: WritingSection[];
};

export const courseData = writingData as WritingCourseData;
