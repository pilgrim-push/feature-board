import { format, addDays, parseISO, differenceInDays, startOfWeek, addWeeks } from 'date-fns';

export function formatDate(dateString: string): string {
  try {
    return format(parseISO(dateString), 'dd/MM/yyyy');
  } catch {
    return dateString;
  }
}

export function getDayOfWeek(dateString: string): string {
  try {
    const date = parseISO(dateString);
    return format(date, 'EEEEE'); // Single letter day
  } catch {
    return '';
  }
}

export function calculateEndDate(startDate: string, duration: number): string {
  try {
    const start = parseISO(startDate);
    const end = addDays(start, duration - 1);
    return format(end, 'yyyy-MM-dd');
  } catch {
    return startDate;
  }
}

export function generateDateRange(startDate: string, numberOfDays: number = 10): Array<{ date: string, dayOfWeek: string, isWeekend: boolean }> {
  try {
    const start = parseISO(startDate);
    const dates = [];
    
    for (let i = 0; i < numberOfDays; i++) {
      const currentDate = addDays(start, i);
      const dayOfWeek = format(currentDate, 'EEEEE');
      const isWeekend = dayOfWeek === 'S';
      
      dates.push({
        date: format(currentDate, 'yyyy-MM-dd'),
        dayOfWeek,
        isWeekend
      });
    }
    
    return dates;
  } catch {
    return [];
  }
}

export function getTaskPosition(taskStartDate: string, timelineStartDate: string): number {
  try {
    const taskStart = parseISO(taskStartDate);
    const timelineStart = parseISO(timelineStartDate);
    return Math.max(0, differenceInDays(taskStart, timelineStart));
  } catch {
    return 0;
  }
}

export function getTaskBarColor(priority: string): string {
  switch (priority) {
    case 'high':
      return 'bg-gradient-to-r from-red-500 to-red-600';
    case 'medium':
      return 'bg-gradient-to-r from-blue-500 to-blue-600';
    case 'low':
      return 'bg-gradient-to-r from-green-500 to-green-600';
    default:
      return 'bg-gradient-to-r from-blue-500 to-blue-600';
  }
}
