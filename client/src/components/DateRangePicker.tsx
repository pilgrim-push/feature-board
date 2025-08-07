import { useState } from 'react';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import { format, addDays, subDays } from 'date-fns';

interface DateRangePickerProps {
  startDate: string;
  numberOfDays: number;
  onDateRangeChange: (startDate: string, numberOfDays: number) => void;
}

export default function DateRangePicker({ startDate, numberOfDays, onDateRangeChange }: DateRangePickerProps) {
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempNumberOfDays, setTempNumberOfDays] = useState(numberOfDays);

  const handlePreviousWeek = () => {
    const newStartDate = format(subDays(new Date(startDate), 7), 'yyyy-MM-dd');
    onDateRangeChange(newStartDate, numberOfDays);
  };

  const handleNextWeek = () => {
    const newStartDate = format(addDays(new Date(startDate), 7), 'yyyy-MM-dd');
    onDateRangeChange(newStartDate, numberOfDays);
  };

  const handleApply = () => {
    onDateRangeChange(tempStartDate, tempNumberOfDays);
  };

  const handleToday = () => {
    const today = format(new Date(), 'yyyy-MM-dd');
    onDateRangeChange(today, numberOfDays);
  };

  return (
    <div className="flex items-center space-x-2">
      <Button
        onClick={handlePreviousWeek}
        variant="outline"
        size="sm"
        className="px-2 py-1 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-md"
      >
        <ChevronLeft size={16} />
      </Button>
      
      <Button
        onClick={handleToday}
        variant="outline"
        size="sm"
        className="px-3 py-1 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-md text-xs"
      >
        Today
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="px-3 py-1 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-md text-xs"
          >
            <Calendar className="mr-2" size={14} />
            {format(new Date(startDate), 'MMM dd')} - {format(addDays(new Date(startDate), numberOfDays - 1), 'MMM dd')} ({numberOfDays} days)
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-gray-700">Start Date</Label>
              <Input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">Number of Days</Label>
              <Input
                type="number"
                min="1"
                max="90"
                value={tempNumberOfDays}
                onChange={(e) => setTempNumberOfDays(parseInt(e.target.value) || 1)}
                className="mt-1"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={handleApply}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Apply
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      <Button
        onClick={handleNextWeek}
        variant="outline"
        size="sm"
        className="px-2 py-1 border-gray-300 text-gray-600 hover:bg-gray-50 rounded-md"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}