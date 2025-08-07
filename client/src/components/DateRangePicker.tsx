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
        className="px-2 py-1 border-wrike-border text-wrike-text hover:bg-wrike-hover rounded"
      >
        <ChevronLeft size={16} />
      </Button>
      
      <Button
        onClick={handleToday}
        variant="outline"
        size="sm"
        className="px-3 py-1 border-wrike-border text-wrike-text hover:bg-wrike-hover rounded text-xs font-medium"
      >
        Today
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="px-3 py-1 border-wrike-border text-wrike-text hover:bg-wrike-hover rounded text-xs font-medium"
          >
            <Calendar className="mr-2" size={14} />
            {format(new Date(startDate), 'MMM dd')} - {format(addDays(new Date(startDate), numberOfDays - 1), 'MMM dd')} ({numberOfDays} days)
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-4 bg-white border border-wrike-border shadow-lg">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium text-wrike-text">Start Date</Label>
              <Input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="mt-1 bg-white border-wrike-border text-wrike-text focus:border-wrike-blue focus:ring-1 focus:ring-wrike-blue/20"
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-wrike-text">Number of Days</Label>
              <Input
                type="number"
                min="1"
                max="90"
                value={tempNumberOfDays}
                onChange={(e) => setTempNumberOfDays(parseInt(e.target.value) || 1)}
                className="mt-1 bg-white border-wrike-border text-wrike-text focus:border-wrike-blue focus:ring-1 focus:ring-wrike-blue/20"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                onClick={handleApply}
                className="px-4 py-2 bg-wrike-blue text-white rounded hover:bg-wrike-blue-dark text-sm font-medium"
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
        className="px-2 py-1 border-wrike-border text-wrike-text hover:bg-wrike-hover rounded"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}