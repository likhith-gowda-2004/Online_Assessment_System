export interface Test {
  id: number;
  title: string;
  description?: string;
  durationMinutes: number;
  questionCount: number;
  difficultyLevel: string;
  topicId: number;
  topic?: {
    id: number;
    name: string;
  };
  creatorId: number;
  createdAt?: string;
  updatedAt?: string;
  completedCount?: number;
  averageScore?: number;
  topicName: string;
}