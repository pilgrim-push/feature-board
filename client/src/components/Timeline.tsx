import { Task } from '@/types/gantt';
import { generateDateRange, formatDate, getTaskPosition, getTaskBarColor } from '@/utils/dateUtils';

interface TimelineProps {
  tasks: Task[];
  startDate: string;
  numberOfDays?: number;
}

export default function Timeline({ tasks, startDate, numberOfDays = 10 }: TimelineProps) {
  const dateRange = generateDateRange(startDate, numberOfDays);
  const dayWidth = 96; // 6rem in pixels (24 * 4)

  return (
    <div className="flex-1 bg-white">
      {/* Timeline Header */}
      <div className="sticky top-0 bg-neutral-20 border-b border-neutral-30">
        {/* Date Range Header */}
        <div className="flex">
          {dateRange.map(({ date }) => (
            <div 
              key={date} 
              className="px-4 py-2 text-center text-sm font-semibold text-neutral-90 border-r border-neutral-30 min-w-24"
            >
              {formatDate(date)}
            </div>
          ))}
        </div>
        {/* Day of Week Header */}
        <div className="flex border-t border-neutral-30">
          {dateRange.map(({ date, dayOfWeek, isWeekend }) => (
            <div 
              key={date} 
              className={`px-4 py-2 text-center text-xs text-neutral-70 border-r border-neutral-30 min-w-24 ${
                isWeekend ? 'bg-neutral-10' : ''
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
          const leftOffset = position * dayWidth + 8; // 8px padding
          const width = task.duration * dayWidth - 16; // 16px for padding on both sides

          return (
            <div key={task.id} className="h-12 border-b border-neutral-30 relative">
              {position >= 0 && position < numberOfDays && (
                <div 
                  className={`absolute top-2 h-8 ${barColor} rounded-sm flex items-center px-2 text-white text-xs font-medium shadow-sm`}
                  style={{
                    left: `${leftOffset}px`,
                    width: `${Math.max(width, dayWidth - 16)}px`
                  }}
                >
                  {task.name} ({task.duration}d)
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
                className={`min-w-24 border-r border-neutral-30 h-full ${
                  isWeekend ? 'bg-neutral-10 bg-opacity-50' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
