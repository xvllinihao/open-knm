import readingData from './dutch-a2-reading-course.json';

export type TriText = {
  nl?: string;
  en: string;
  zh: string;
};

export type ReadingInfo = {
  type: "info";
  content: TriText;
};

export type ReadingStrategy = {
  type: "strategy";
  title: TriText;
  content: TriText;
};

export type ReadingExerciseOption = {
  id: string;
  text: string;
};

export type ReadingExercise = {
  id: string;
  text: {
    nl: string;
  };
  question: TriText;
  options: ReadingExerciseOption[];
  correctAnswer: string;
  explanation: TriText;
};

export type ReadingCategory = {
  id: string;
  title: TriText;
  exercises: ReadingExercise[];
};

export type ReadingSection = {
  id: string;
  title: TriText;
  description?: TriText;
  items?: (ReadingInfo | ReadingStrategy)[];
  categories?: ReadingCategory[];
};

export type ReadingCourseData = {
  meta: {
    title: TriText;
    description: TriText;
    version: string;
  };
  sections: ReadingSection[];
};

export const courseData = readingData as ReadingCourseData;
