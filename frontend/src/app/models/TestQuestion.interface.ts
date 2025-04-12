export interface TestQuestion {
    id: number;
    questionText: string;
    options: string[];
    correctAnswer?: number;
    testId: number;
    type: 'mcq' | 'coding';
    points?: number;
    marks?: number;
    userAnswer?: number;
    userCode?: string;
    testCases?: {
      input: string;
      expectedOutput: string;
    }[];
  }