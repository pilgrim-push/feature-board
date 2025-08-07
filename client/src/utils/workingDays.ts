import { addDays, format, isWeekend } from 'date-fns';

/**
 * Проверяет, является ли день выходным (суббота или воскресенье)
 */
export function isWeekendDay(date: Date): boolean {
  return isWeekend(date);
}

/**
 * Рассчитывает конечную дату задачи с учетом рабочих дней
 * @param startDate - дата начала
 * @param workingDays - количество рабочих дней
 * @returns конечная дата
 */
export function calculateEndDate(startDate: string | Date, workingDays: number): Date {
  let currentDate = new Date(startDate);
  let remainingDays = workingDays;

  // Если начальная дата - выходной, переносим на следующий рабочий день
  while (isWeekendDay(currentDate)) {
    currentDate = addDays(currentDate, 1);
  }

  // Добавляем рабочие дни
  while (remainingDays > 0) {
    if (!isWeekendDay(currentDate)) {
      remainingDays--;
    }
    if (remainingDays > 0) {
      currentDate = addDays(currentDate, 1);
    }
  }

  return currentDate;
}

/**
 * Получает массив дат в диапазоне с отметкой о выходных днях
 * @param startDate - начальная дата
 * @param endDate - конечная дата
 * @returns массив объектов с датой и флагом выходного дня
 */
export function getDaysInRange(startDate: Date, endDate: Date): Array<{ date: Date; isWeekend: boolean }> {
  const days: Array<{ date: Date; isWeekend: boolean }> = [];
  let currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    days.push({
      date: new Date(currentDate),
      isWeekend: isWeekendDay(currentDate)
    });
    currentDate = addDays(currentDate, 1);
  }

  return days;
}

/**
 * Рассчитывает количество рабочих дней между двумя датами
 * @param startDate - начальная дата
 * @param endDate - конечная дата
 * @returns количество рабочих дней
 */
export function getWorkingDaysBetween(startDate: Date, endDate: Date): number {
  const days = getDaysInRange(startDate, endDate);
  return days.filter(day => !day.isWeekend).length;
}

/**
 * Форматирует дату в строку для input[type="date"]
 */
export function formatDateForInput(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}