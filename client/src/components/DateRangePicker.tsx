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
    <div className="flex items-center space-x-3">
      <Button
        onClick={handlePreviousWeek}
        variant="outline"
        size="sm"
        className="px-3 py-2 border border-stripe-border-light text-stripe-text hover:bg-gradient-to-r hover:from-stripe-blue hover:to-stripe-purple hover:text-white rounded-lg hover-lift transition-all duration-200 glass-surface"
      >
        <ChevronLeft size={16} />
      </Button>
      
      <Button
        onClick={handleToday}
        variant="outline"
        size="sm"
        className="px-4 py-2 border border-stripe-border-light text-stripe-text hover:bg-gradient-to-r hover:from-green-500 hover:to-emerald-500 hover:text-white rounded-lg text-sm font-medium hover-lift transition-all duration-200 glass-surface"
      >
        Today
      </Button>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className="px-4 py-2 border border-stripe-border-light text-stripe-text hover:bg-gradient-to-r hover:from-stripe-blue hover:to-stripe-purple hover:text-white rounded-lg text-sm font-medium hover-lift transition-all duration-200 glass-surface"
          >
            <Calendar className="mr-2" size={16} />
            {format(new Date(startDate), 'MMM dd')} - {format(addDays(new Date(startDate), numberOfDays - 1), 'MMM dd')} ({numberOfDays} days)
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-6 glass-card border border-stripe-border-light shadow-2xl rounded-2xl backdrop-filter backdrop-blur-sm">
          <div className="animated-gradient h-1 rounded-t-2xl absolute -top-px left-0 right-0"></div>
          <div className="space-y-6">
            <div>
              <Label className="text-sm font-semibold text-stripe-text mb-2 block">Start Date</Label>
              <Input
                type="date"
                value={tempStartDate}
                onChange={(e) => setTempStartDate(e.target.value)}
                className="mt-1 glass-surface border-stripe-border-light text-stripe-text focus:border-stripe-blue focus:ring-2 focus:ring-stripe-blue/20 rounded-lg hover-lift transition-all duration-200"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-stripe-text mb-2 block">Number of Days</Label>
              <Input
                type="number"
                min="1"
                max="90"
                value={tempNumberOfDays}
                onChange={(e) => setTempNumberOfDays(parseInt(e.target.value) || 1)}
                className="mt-1 glass-surface border-stripe-border-light text-stripe-text focus:border-stripe-blue focus:ring-2 focus:ring-stripe-blue/20 rounded-lg hover-lift transition-all duration-200"
              />
            </div>
            <div className="flex justify-end space-x-3 pt-4">
              <Button
                onClick={handleApply}
                className="px-6 py-2.5 bg-gradient-to-r from-stripe-blue to-stripe-purple text-white rounded-lg hover:from-stripe-blue-hover hover:to-stripe-purple shadow-lg hover-lift transition-all duration-200 text-sm font-medium"
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
        className="px-3 py-2 border border-stripe-border-light text-stripe-text hover:bg-gradient-to-r hover:from-stripe-blue hover:to-stripe-purple hover:text-white rounded-lg hover-lift transition-all duration-200 glass-surface"
      >
        <ChevronRight size={16} />
      </Button>
    </div>
  );
}