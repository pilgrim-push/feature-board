export interface Task {
  id: number;
  name: string;
  startDate: string;
  duration: number;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  externalLink: string;
  selected?: boolean;
  dependencies?: number[]; // IDs of tasks that must be completed before this task can start
}

export interface AppState {
  tasks: Task[];
  featureColumns: FeatureColumn[];
  featureCards: FeatureCard[];
}

export interface NewTask {
  name: string;
  startDate: string;
  duration: number;
  externalLink: string;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  dependencies?: number[];
}

export interface TaskDependency {
  id: string;
  predecessorId: number;
  successorId: number;
  type: 'finish-to-start' | 'start-to-start' | 'finish-to-finish' | 'start-to-finish';
}

export interface FeatureColumn {
  id: number;
  name: string;
  completionDate?: string; // YYYY-MM-DD format
  isHidden: boolean;
  order: number;
  isParking: boolean; // Special flag for parking column
  cards: FeatureCard[]; // Cards within this column
}

export type FeatureCardType = 'new' | 'analytics' | 'bugfix' | 'improvement' | 'development';

export type FeatureCardStatus = 'analytics' | 'development' | 'backlog' | 'postponed';

export interface UserStory {
  id: number;
  title: string;
  story: string;
  startDate?: string; // DD/MM/YY format
  duration: number;
  externalLink: string;
  additionalRequirements: string;
  invest: string;
  developmentDeadline?: string; // DD/MM/YY format
}

export interface FeatureCard {
  id: number;
  title: string;
  type: FeatureCardType;
  description: string;
  startDate?: string;
  duration: number;
  tags: string[];
  columnId: number;
  order: number;
  externalLink?: string;
  deadline?: string; // DD/MM/YY format
  status: FeatureCardStatus;
  userStories: UserStory[];
}
