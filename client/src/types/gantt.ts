export interface Task {
  id: number;
  name: string;
  startDate: string;
  duration: number;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  selected?: boolean;
  dependencies?: number[]; // IDs of tasks that must be completed before this task can start
}

export interface Project {
  id: number;
  name: string;
  active: boolean;
}

export interface AppState {
  projects: Project[];
  tasks: Task[];
  featureColumns: FeatureColumn[];
  featureCards: FeatureCard[];
  user: {
    name: string;
  };
}

export interface NewTask {
  name: string;
  startDate: string;
  duration: number;
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

export interface FeatureCard {
  id: number;
  title: string;
  type: FeatureCardType;
  description: string;
  tags: string[];
  columnId: number;
  order: number;
}
