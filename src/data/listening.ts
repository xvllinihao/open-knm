import listeningData from './dutch-a2-listening-course.json';

export type TriText = {
  nl?: string;
  en: string;
  zh: string;
};

export type ListeningInfo = {
  type: "info";
  content: TriText;
};

export type ListeningStrategy = {
  type: "strategy";
  title: TriText;
  content: TriText;
};

export type ListeningExerciseOption = {
  id: string;
  text: string;
};

export type ListeningExercise = {
  id: string;
  text: {
    nl: string;
  };
  question: TriText;
  options: ListeningExerciseOption[];
  correctAnswer: string;
  explanation: TriText;
};

export type ListeningCategory = {
  id: string;
  title: TriText;
  exercises: ListeningExercise[];
};

export type ListeningSection = {
  id: string;
  title: TriText;
  description?: TriText;
  items?: (ListeningInfo | ListeningStrategy)[];
  categories?: ListeningCategory[];
};

export type ListeningCourseData = {
  meta: {
    title: TriText;
    description: TriText;
    version: string;
  };
  sections: ListeningSection[];
};

export const courseData = listeningData as ListeningCourseData;
