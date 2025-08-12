import { Task } from '@/types/gantt';
import { calculateEndDate } from '@/utils/workingDays';
import { differenceInDays, parseISO } from 'date-fns';

interface DependencyArrowProps {
  fromTask: Task;
  toTask: Task;
  startDate: string;
  dayWidth: number;
}

export default function DependencyArrow({ fromTask, toTask, startDate, dayWidth }: DependencyArrowProps) {
  // Вычисляем позиции задач на временной шкале
  const timelineStart = parseISO(startDate);
  
  // Позиция окончания предшествующей задачи
  const fromEndDate = calculateEndDate(fromTask.startDate, fromTask.duration);
  const fromX = differenceInDays(fromEndDate, timelineStart) * dayWidth + dayWidth; // Конец задачи
  
  // Позиция начала следующей задачи
  const toStartDate = parseISO(toTask.startDate);
  const toX = differenceInDays(toStartDate, timelineStart) * dayWidth; // Начало задачи
  
  // Вертикальные позиции (на основе индекса задач в списке)
  const taskHeight = 56; // Высота строки задачи
  const fromY = 28; // Центр строки предшествующей задачи
  const toY = 28; // Центр строки следующей задачи
  
  // Если стрелка не видна в текущем окне временной шкалы, не отрисовываем её
  if (fromX < 0 && toX < 0) return null;
  if (fromX > dayWidth * 20 && toX > dayWidth * 20) return null;
  
  // Создаем путь для стрелки (с изгибом для лучшей читаемости)
  const createArrowPath = () => {
    const arrowSize = 6;
    const curveOffset = Math.min(Math.abs(toX - fromX) / 3, 20);
    
    // Начальная точка (конец предшествующей задачи)
    const startX = fromX;
    const startY = fromY;
    
    // Конечная точка (начало следующей задачи)
    const endX = toX - arrowSize;
    const endY = toY;
    
    // Контрольные точки для кривой Безье
    const controlX1 = startX + curveOffset;
    const controlY1 = startY;
    const controlX2 = endX - curveOffset;
    const controlY2 = endY;
    
    return {
      path: `M ${startX} ${startY} C ${controlX1} ${controlY1}, ${controlX2} ${controlY2}, ${endX} ${endY}`,
      arrowHead: {
        x: endX,
        y: endY,
        points: `${endX},${endY} ${endX - arrowSize},${endY - arrowSize/2} ${endX - arrowSize},${endY + arrowSize/2}`
      }
    };
  };
  
  const { path, arrowHead } = createArrowPath();
  
  return (
    <g className="dependency-arrow">
      {/* Линия зависимости */}
      <path
        d={path}
        stroke="#6b7280"
        strokeWidth="1.5"
        fill="none"
        strokeDasharray="4 4"
        className="opacity-70 hover:opacity-100 transition-opacity"
      />
      
      {/* Стрелка */}
      <polygon
        points={arrowHead.points}
        fill="#6b7280"
        className="opacity-70 hover:opacity-100 transition-opacity"
      />
    </g>
  );
}