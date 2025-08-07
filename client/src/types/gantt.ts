export interface Task {
  id: number;
  name: string;
  startDate: string;
  duration: number;
  priority: 'low' | 'medium' | 'high';
  description?: string;
  selected?: boolean;
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
}
