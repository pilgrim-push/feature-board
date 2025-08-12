import { useState, useRef } from 'react';
import { Task } from '@/types/gantt';
import { generateDateRange, formatDate, getTaskPosition, getTaskBarColor } from '@/utils/dateUtils';
import { calculateEndDate, getDaysInRange, isWeekendDay } from '@/utils/workingDays';
import { addDays, format } from 'date-fns';
import DependencyArrow from './DependencyArrow';

interface TimelineProps {
  tasks: Task[];
  startDate: string;
  numberOfDays?: number;
  onUpdateTask?: (id: number, field: keyof Task, value: any) => void;
  onEditTask?: (task: Task) => void;
}

export default function Timeline({ tasks, startDate, numberOfDays = 10, onUpdateTask, onEditTask }: TimelineProps) {
  const dateRange = generateDateRange(startDate, numberOfDays);
  const dayWidth = 120; // Increased width for better spacing
  
  const [dragState, setDragState] = useState<{
    isDragging: boolean;
    taskId: number | null;
    startX: number;
    startPosition: number;
    originalStartDate: string;
  }>({
    isDragging: false,
    taskId: null,
    startX: 0,
    startPosition: 0,
    originalStartDate: ''
  });

  const timelineRef = useRef<HTMLDivElement>(null);

  // Функция для преобразования позиции в дату (находит ближайший рабочий день)
  const positionToDate = (position: number): string => {
    let targetDate = addDays(new Date(startDate), position);
    
    // Если попали на выходной, сдвигаем на понедельник
    while (isWeekendDay(targetDate)) {
      targetDate = addDays(targetDate, 1);
    }
    
    return format(targetDate, 'yyyy-MM-dd');
  };

  // Обработчик начала перетаскивания
  const handleMouseDown = (e: React.MouseEvent, task: Task) => {
    if (!onUpdateTask) return;
    
    e.preventDefault();
    const rect = timelineRef.current?.getBoundingClientRect();
    if (!rect) return;

    const startX = e.clientX;
    const position = getTaskPosition(task.startDate, startDate);
    
    setDragState({
      isDragging: true,
      taskId: task.id,
      startX,
      startPosition: position,
      originalStartDate: task.startDate
    });
  };

  // Обработчик движения мыши
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!dragState.isDragging || !onUpdateTask || !dragState.taskId) return;

    const deltaX = e.clientX - dragState.startX;
    const daysDelta = Math.round(deltaX / dayWidth);
    const newPosition = Math.max(0, dragState.startPosition + daysDelta);
    const newStartDate = positionToDate(newPosition);

    // Обновляем позицию задачи
    onUpdateTask(dragState.taskId, 'startDate', newStartDate);
  };

  // Обработчик окончания перетаскивания
  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      taskId: null,
      startX: 0,
      startPosition: 0,
      originalStartDate: ''
    });
  };

  return (
    <div 
      className="flex-1 bg-white select-none"
      ref={timelineRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Timeline Header */}
      <div className="sticky top-0 bg-stripe-gray-50 border-b border-stripe-border h-[60px]">
        {/* Date Range Header */}
        <div className="flex h-[30px]">
          {dateRange.map(({ date }) => (
            <div 
              key={date} 
              className="px-4 py-2 text-center text-sm font-semibold text-stripe-text border-r border-stripe-border min-w-[120px] flex items-center justify-center"
            >
              {formatDate(date)}
            </div>
          ))}
        </div>
        {/* Day of Week Header */}
        <div className="flex border-t border-stripe-border h-[30px]">
          {dateRange.map(({ date, dayOfWeek, isWeekend }) => (
            <div 
              key={date} 
              className={`px-4 py-1 text-center text-xs text-stripe-text-muted border-r border-stripe-border min-w-[120px] flex items-center justify-center ${
                isWeekend ? 'bg-stripe-blue-light' : ''
              }`}
            >
              {dayOfWeek}
            </div>
          ))}
        </div>
      </div>

      {/* Timeline Content */}
      <div className="relative">
        {/* Task Bars */}
        {tasks.map((task, index) => {
          const position = getTaskPosition(task.startDate, startDate);
          const barColor = getTaskBarColor(task.priority);
          
          // Рассчитываем конечную дату с учетом рабочих дней
          const endDate = calculateEndDate(task.startDate, task.duration);
          const taskDaysRange = getDaysInRange(new Date(task.startDate), endDate);
          
          // Проверяем, есть ли пересечение задачи с видимым диапазоном
          const taskEndPosition = getTaskPosition(endDate.toISOString().split('T')[0], startDate);
          const hasIntersection = !(position >= numberOfDays || taskEndPosition < 0);
          
          // Группируем рабочие дни в непрерывные сегменты
          const workingSegments: Array<{ start: number; end: number; days: any[] }> = [];
          let currentSegment: any[] = [];
          
          taskDaysRange.forEach((day, dayIndex) => {
            const dayPosition = getTaskPosition(day.date.toISOString().split('T')[0], startDate);
            
            // Только если день попадает в видимый диапазон
            if (dayPosition >= 0 && dayPosition < numberOfDays) {
              if (!day.isWeekend) {
                currentSegment.push({ ...day, position: dayPosition });
              } else {
                // Заканчиваем текущий сегмент при встрече выходного
                if (currentSegment.length > 0) {
                  workingSegments.push({
                    start: currentSegment[0].position,
                    end: currentSegment[currentSegment.length - 1].position,
                    days: [...currentSegment]
                  });
                  currentSegment = [];
                }
              }
            } else if (dayPosition >= numberOfDays) {
              // Если мы вышли за пределы видимого диапазона, завершаем текущий сегмент
              if (currentSegment.length > 0) {
                workingSegments.push({
                  start: currentSegment[0].position,
                  end: currentSegment[currentSegment.length - 1].position,
                  days: [...currentSegment]
                });
                currentSegment = [];
              }
              // Прерываем цикл, так как дальше дни уже не видны
              return;
            }
          });
          
          // Добавляем последний сегмент если есть
          if (currentSegment.length > 0) {
            workingSegments.push({
              start: currentSegment[0].position,
              end: currentSegment[currentSegment.length - 1].position,
              days: [...currentSegment]
            });
          }
          
          return (
            <div key={task.id} className="h-12 border-b border-stripe-border relative hover:bg-stripe-hover/30 transition-colors duration-200">
              {hasIntersection && workingSegments.length > 0 && (
                <div className="absolute top-2 bottom-2">
                  {workingSegments.map((segment, segmentIndex) => {
                    const segmentLeftOffset = segment.start * dayWidth + 12;
                    const segmentWidth = (segment.end - segment.start + 1) * dayWidth - 24;
                    
                    const isDragging = dragState.isDragging && dragState.taskId === task.id;
                    
                    return (
                      <div
                        key={segmentIndex}
                        className={`absolute h-8 ${barColor} rounded flex items-center px-3 shadow-sm hover:shadow-md transition-all duration-200 cursor-move ${
                          isDragging ? 'opacity-75 shadow-lg scale-105 z-50' : ''
                        }`}
                        style={{
                          left: `${segmentLeftOffset}px`,
                          width: `${segmentWidth}px`,
                          top: 0,
                        }}
                        onMouseDown={(e) => handleMouseDown(e, task)}
                        onDoubleClick={() => onEditTask?.(task)}
                      >
                        {segmentIndex === 0 && (
                          <span className="text-white text-xs font-medium truncate pointer-events-none">
                            {task.name} ({task.duration}d)
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}

        {/* Dependency Arrows */}
        <svg className="absolute inset-0 pointer-events-none z-10" style={{ height: tasks.length * 48 }}>
          {tasks.map((task, taskIndex) => 
            task.dependencies?.map(depId => {
              const dependentTask = tasks.find(t => t.id === depId);
              if (!dependentTask) return null;
              
              const dependentTaskIndex = tasks.findIndex(t => t.id === depId);
              if (dependentTaskIndex === -1) return null;
              
              return (
                <g key={`${task.id}-${depId}`} transform={`translate(0, ${dependentTaskIndex * 48})`}>
                  <DependencyArrow
                    fromTask={dependentTask}
                    toTask={task}
                    startDate={startDate}
                    dayWidth={dayWidth}
                  />
                </g>
              );
            })
          ).flat().filter(Boolean)}
        </svg>

        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="flex h-full">
            {dateRange.map(({ date, isWeekend }) => (
              <div 
                key={date} 
                className={`min-w-[120px] border-r border-stripe-border h-full ${
                  isWeekend ? 'bg-stripe-blue/5' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
