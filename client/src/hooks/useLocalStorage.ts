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
      // Очищаем старые данные при обновлении логики рабочих дней
      localStorage.removeItem(STORAGE_KEY);
      
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsedState = JSON.parse(saved);
        setState({ ...defaultState, ...parsedState });
      } else {
        // Создаем тестовую задачу
        const testState = {
          ...defaultState,
          tasks: [
            {
              id: 1,
              name: 'Test Task',
              startDate: '2025-08-07',
              duration: 5, // 5 рабочих дней
              priority: 'medium' as const,
              description: 'Test task for working days',
              selected: false
            }
          ]
        };
        setState(testState);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(testState));
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
