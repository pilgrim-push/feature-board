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
  featureColumns: [],
  featureCards: [],
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
      } else {
        // Создаем тестовую задачу начинающуюся в пятницу для демонстрации разрывов
        const testState = {
          ...defaultState,
          tasks: [
            {
              id: 1,
              name: 'Test Task (5 working days)',
              startDate: '2025-08-08', // пятница
              duration: 5, // 5 рабочих дней: пт + пн-чт
              priority: 'medium' as const,
              description: 'Test task starting Friday, spanning weekend',
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
