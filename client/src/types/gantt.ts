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
}
