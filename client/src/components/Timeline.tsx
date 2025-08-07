import { Task } from '@/types/gantt';
import { generateDateRange, formatDate, getTaskPosition, getTaskBarColor } from '@/utils/dateUtils';

interface TimelineProps {
  tasks: Task[];
  startDate: string;
  numberOfDays?: number;
}

export default function Timeline({ tasks, startDate, numberOfDays = 10 }: TimelineProps) {
  const dateRange = generateDateRange(startDate, numberOfDays);
  const dayWidth = 120; // Increased width for better spacing

  return (
    <div className="flex-1 bg-spotify-card">
      {/* Timeline Header */}
      <div className="sticky top-0 bg-spotify-sidebar border-b border-spotify-border">
        {/* Date Range Header */}
        <div className="flex">
          {dateRange.map(({ date }) => (
            <div 
              key={date} 
              className="px-4 py-3 text-center text-sm font-bold text-spotify-text border-r border-spotify-border min-w-[120px] h-10 flex items-center justify-center"
            >
              {formatDate(date)}
            </div>
          ))}
        </div>
        {/* Day of Week Header */}
        <div className="flex border-t border-spotify-border">
          {dateRange.map(({ date, dayOfWeek, isWeekend }) => (
            <div 
              key={date} 
              className={`px-4 py-2 text-center text-xs text-spotify-text-muted border-r border-spotify-border min-w-[120px] h-8 flex items-center justify-center ${
                isWeekend ? 'bg-spotify-green/10' : ''
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
          const leftOffset = position * dayWidth + 12; // 12px padding
          const width = task.duration * dayWidth - 24; // 24px for padding on both sides

          return (
            <div key={task.id} className="h-16 border-b border-spotify-border relative hover:bg-spotify-hover/30 transition-all duration-200">
              {position >= 0 && position < numberOfDays && (
                <div 
                  className={`absolute top-4 h-8 ${barColor} rounded-full flex items-center px-4 text-white text-sm font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer`}
                  style={{
                    left: `${leftOffset}px`,
                    width: `${Math.max(width, dayWidth - 24)}px`
                  }}
                >
                  <span className="truncate">
                    {task.name} ({task.duration}d)
                  </span>
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
                className={`min-w-[120px] border-r border-spotify-border h-full ${
                  isWeekend ? 'bg-spotify-green/5' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
