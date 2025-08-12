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
