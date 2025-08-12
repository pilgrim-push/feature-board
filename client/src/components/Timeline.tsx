import { Task } from '@/types/gantt';
import { generateDateRange, formatDate, getTaskPosition, getTaskBarColor } from '@/utils/dateUtils';
import { calculateEndDate, getDaysInRange, isWeekendDay } from '@/utils/workingDays';

interface TimelineProps {
  tasks: Task[];
  startDate: string;
  numberOfDays?: number;
}

export default function Timeline({ tasks, startDate, numberOfDays = 10 }: TimelineProps) {
  const dateRange = generateDateRange(startDate, numberOfDays);
  const dayWidth = 120; // Increased width for better spacing

  return (
    <div className="flex-1 bg-white">
      {/* Timeline Header */}
      <div className="sticky top-0 bg-wrike-sidebar border-b border-wrike-border h-[60px]">
        {/* Date Range Header */}
        <div className="flex h-[30px]">
          {dateRange.map(({ date }) => (
            <div 
              key={date} 
              className="px-4 py-2 text-center text-sm font-semibold text-wrike-text border-r border-wrike-border min-w-[120px] flex items-center justify-center"
            >
              {formatDate(date)}
            </div>
          ))}
        </div>
        {/* Day of Week Header */}
        <div className="flex border-t border-wrike-border h-[30px]">
          {dateRange.map(({ date, dayOfWeek, isWeekend }) => (
            <div 
              key={date} 
              className={`px-4 py-1 text-center text-xs text-wrike-text-muted border-r border-wrike-border min-w-[120px] flex items-center justify-center ${
                isWeekend ? 'bg-wrike-blue/10' : ''
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
            <div key={task.id} className="h-12 border-b border-wrike-border relative hover:bg-wrike-hover/30 transition-colors duration-200">
              {hasIntersection && workingSegments.length > 0 && (
                <div className="absolute top-2 bottom-2">
                  {workingSegments.map((segment, segmentIndex) => {
                    const segmentLeftOffset = segment.start * dayWidth + 12;
                    const segmentWidth = (segment.end - segment.start + 1) * dayWidth - 24;
                    
                    return (
                      <div
                        key={segmentIndex}
                        className={`absolute h-8 ${barColor} rounded flex items-center px-3 shadow-sm hover:shadow-md transition-shadow duration-200`}
                        style={{
                          left: `${segmentLeftOffset}px`,
                          width: `${segmentWidth}px`,
                          top: 0,
                        }}
                      >
                        {segmentIndex === 0 && (
                          <span className="text-white text-xs font-medium truncate">
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

        {/* Grid Lines */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="flex h-full">
            {dateRange.map(({ date, isWeekend }) => (
              <div 
                key={date} 
                className={`min-w-[120px] border-r border-wrike-border h-full ${
                  isWeekend ? 'bg-wrike-blue/5' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
