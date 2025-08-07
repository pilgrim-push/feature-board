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
    <div className="flex-1 bg-white">
      {/* Timeline Header */}
      <div className="sticky top-0 bg-gray-50 border-b border-gray-200">
        {/* Date Range Header */}
        <div className="flex">
          {dateRange.map(({ date }) => (
            <div 
              key={date} 
              className="px-4 py-3 text-center text-sm font-semibold text-gray-800 border-r border-gray-200 min-w-[120px] h-8 flex items-center justify-center"
            >
              {formatDate(date)}
            </div>
          ))}
        </div>
        {/* Day of Week Header */}
        <div className="flex border-t border-gray-200">
          {dateRange.map(({ date, dayOfWeek, isWeekend }) => (
            <div 
              key={date} 
              className={`px-4 py-2 text-center text-xs text-gray-600 border-r border-gray-200 min-w-[120px] h-8 flex items-center justify-center ${
                isWeekend ? 'bg-blue-50' : ''
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
            <div key={task.id} className="h-14 border-b border-gray-100 relative hover:bg-blue-50 transition-colors">
              {position >= 0 && position < numberOfDays && (
                <div 
                  className={`absolute top-3 h-8 ${barColor} rounded-lg flex items-center px-3 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer`}
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
                className={`min-w-[120px] border-r border-gray-200 h-full ${
                  isWeekend ? 'bg-blue-50 bg-opacity-30' : ''
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
