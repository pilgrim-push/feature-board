import { useState, useEffect } from 'react';
import { AppState } from '@/types/gantt';

const STORAGE_KEY = 'gantt_chart_data';

const defaultState: AppState = {
  projects: [
    { id: 1, name: 'Gantt 1', active: true },
    { id: 2, name: 'Gantt 2', active: false },
    { id: 3, name: 'Gantt 3', active: false }
  ],
  tasks: [],
  user: {
    name: 'Name Surname'
  }
};

export function useLocalStorage() {
  const [state, setState] = useState<AppState>(defaultState);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        setState({ ...defaultState, ...parsedState });
      }
    } catch (error) {
      console.error('Failed to load data from localStorage:', error);
    }
  }, []);

  const saveState = (newState: AppState) => {
    setState(newState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    } catch (error) {
      console.error('Failed to save data to localStorage:', error);
    }
  };

  return { state, saveState };
}
