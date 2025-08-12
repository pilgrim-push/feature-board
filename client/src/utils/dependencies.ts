import { Task } from '@/types/gantt';
import { addDays, parseISO, isAfter, isBefore } from 'date-fns';
import { calculateEndDate } from './workingDays';

/**
 * Проверяет наличие циклических зависимостей в графе задач
 */
export function hasCyclicDependency(tasks: Task[], newDependency: { successorId: number, predecessorId: number }): boolean {
  const { successorId, predecessorId } = newDependency;
  
  // Создаем граф зависимостей
  const dependencies = new Map<number, Set<number>>();
  
  // Добавляем существующие зависимости
  tasks.forEach(task => {
    if (task.dependencies && task.dependencies.length > 0) {
      dependencies.set(task.id, new Set(task.dependencies));
    }
  });
  
  // Добавляем новую зависимость
  if (!dependencies.has(successorId)) {
    dependencies.set(successorId, new Set());
  }
  dependencies.get(successorId)!.add(predecessorId);
  
  // Проверяем циклы с помощью DFS
  const visited = new Set<number>();
  const recursionStack = new Set<number>();
  
  function dfs(nodeId: number): boolean {
    if (recursionStack.has(nodeId)) {
      return true; // Цикл найден
    }
    
    if (visited.has(nodeId)) {
      return false;
    }
    
    visited.add(nodeId);
    recursionStack.add(nodeId);
    
    const deps = dependencies.get(nodeId);
    if (deps) {
      for (const depId of Array.from(deps)) {
        if (dfs(depId)) {
          return true;
        }
      }
    }
    
    recursionStack.delete(nodeId);
    return false;
  }
  
  // Проверяем все узлы
  for (const nodeId of Array.from(dependencies.keys())) {
    if (!visited.has(nodeId)) {
      if (dfs(nodeId)) {
        return true;
      }
    }
  }
  
  return false;
}

/**
 * Автоматически пересчитывает даты начала задач на основе их зависимостей
 */
export function recalculateTaskDates(tasks: Task[]): Task[] {
  const updatedTasks = [...tasks];
  const taskMap = new Map(updatedTasks.map(task => [task.id, task]));
  const processed = new Set<number>();
  
  function calculateTaskStartDate(task: Task): string {
    if (processed.has(task.id)) {
      return task.startDate;
    }
    
    if (!task.dependencies || task.dependencies.length === 0) {
      processed.add(task.id);
      return task.startDate;
    }
    
    let latestEndDate = new Date(task.startDate);
    
    for (const depId of task.dependencies) {
      const depTask = taskMap.get(depId);
      if (depTask) {
        // Рекурсивно вычисляем дату начала зависимой задачи
        const depStartDate = calculateTaskStartDate(depTask);
        depTask.startDate = depStartDate;
        
        // Вычисляем дату окончания зависимой задачи
        const depEndDate = calculateEndDate(depStartDate, depTask.duration);
        
        // Обновляем самую позднюю дату окончания
        if (isAfter(depEndDate, latestEndDate)) {
          latestEndDate = depEndDate;
        }
      }
    }
    
    // Дата начала текущей задачи = следующий рабочий день после окончания последней зависимости
    const newStartDate = addDays(latestEndDate, 1);
    processed.add(task.id);
    
    return newStartDate.toISOString().split('T')[0];
  }
  
  // Пересчитываем даты для всех задач
  updatedTasks.forEach(task => {
    task.startDate = calculateTaskStartDate(task);
  });
  
  return updatedTasks;
}

/**
 * Получает список задач, которые могут быть зависимостями для данной задачи
 */
export function getAvailablePredecessors(tasks: Task[], currentTaskId: number): Task[] {
  return tasks.filter(task => {
    // Исключаем саму задачу
    if (task.id === currentTaskId) {
      return false;
    }
    
    // Исключаем задачи, которые уже зависят от текущей задачи (прямо или косвенно)
    return !wouldCreateCycle(tasks, currentTaskId, task.id);
  });
}

/**
 * Проверяет, создаст ли добавление зависимости цикл
 */
function wouldCreateCycle(tasks: Task[], successorId: number, predecessorId: number): boolean {
  const visited = new Set<number>();
  
  function hasPath(fromId: number, toId: number): boolean {
    if (fromId === toId) {
      return true;
    }
    
    if (visited.has(fromId)) {
      return false;
    }
    
    visited.add(fromId);
    
    const task = tasks.find(t => t.id === fromId);
    if (task && task.dependencies) {
      for (const depId of task.dependencies) {
        if (hasPath(depId, toId)) {
          return true;
        }
      }
    }
    
    return false;
  }
  
  // Проверяем, есть ли путь от predecessorId к successorId
  return hasPath(predecessorId, successorId);
}

/**
 * Получает все задачи, которые зависят от данной задачи
 */
export function getDependentTasks(tasks: Task[], taskId: number): Task[] {
  return tasks.filter(task => 
    task.dependencies && task.dependencies.includes(taskId)
  );
}

/**
 * Получает критический путь проекта
 */
export function getCriticalPath(tasks: Task[]): number[] {
  const taskMap = new Map(tasks.map(task => [task.id, task]));
  const criticalPath: number[] = [];
  
  // Находим задачи без последователей (конечные задачи)
  const hasSuccessors = new Set<number>();
  tasks.forEach(task => {
    if (task.dependencies) {
      task.dependencies.forEach(depId => hasSuccessors.add(depId));
    }
  });
  
  const endTasks = tasks.filter(task => !hasSuccessors.has(task.id));
  
  // Для каждой конечной задачи находим самый длинный путь к началу
  let longestPath: number[] = [];
  let longestDuration = 0;
  
  function findLongestPath(taskId: number, currentPath: number[], currentDuration: number): void {
    const task = taskMap.get(taskId);
    if (!task) return;
    
    const newPath = [taskId, ...currentPath];
    const newDuration = currentDuration + task.duration;
    
    if (!task.dependencies || task.dependencies.length === 0) {
      // Достигли начала пути
      if (newDuration > longestDuration) {
        longestDuration = newDuration;
        longestPath = newPath;
      }
      return;
    }
    
    // Рекурсивно исследуем все зависимости
    task.dependencies.forEach(depId => {
      findLongestPath(depId, newPath, newDuration);
    });
  }
  
  endTasks.forEach(task => {
    findLongestPath(task.id, [], 0);
  });
  
  return longestPath;
}

/**
 * Проверяет валидность зависимостей (нет циклов, все ID существуют)
 */
export function validateDependencies(tasks: Task[]): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  const taskIds = new Set(tasks.map(task => task.id));
  
  // Проверяем существование всех зависимых задач
  tasks.forEach(task => {
    if (task.dependencies) {
      task.dependencies.forEach(depId => {
        if (!taskIds.has(depId)) {
          errors.push(`Task "${task.name}" depends on non-existent task with ID ${depId}`);
        }
      });
    }
  });
  
  // Проверяем циклические зависимости
  tasks.forEach(task => {
    if (task.dependencies) {
      task.dependencies.forEach(depId => {
        if (hasCyclicDependency(tasks, { successorId: task.id, predecessorId: depId })) {
          errors.push(`Cyclic dependency detected involving task "${task.name}"`);
        }
      });
    }
  });
  
  return {
    isValid: errors.length === 0,
    errors
  };
}