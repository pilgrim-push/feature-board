import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Task, NewTask } from '@/types/gantt';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import TaskTable from './TaskTable';
import Timeline from './Timeline';
import TaskModal from './TaskModal';
import DateRangePicker from './DateRangePicker';

interface GanttChartProps {
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
}

export default function GanttChart({ tasks, onUpdateTasks }: GanttChartProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [timelineStartDate, setTimelineStartDate] = useState(() => {
    if (tasks.length === 0) {
      return new Date().toISOString().split('T')[0];
    }
    const dates = tasks.map(task => task.startDate).sort();
    return dates[0];
  });
  const [timelineDays, setTimelineDays] = useState(15);
  const { toast } = useToast();

  // Get the timeline start date - use user-selected date, not constrained by tasks
  const getTimelineStartDate = () => {
    return timelineStartDate;
  };

  const handleAddTask = () => {
    setIsModalOpen(true);
  };

  const handleSaveTask = (newTask: NewTask) => {
    const id = Math.max(0, ...tasks.map(t => t.id)) + 1;
    const task: Task = { ...newTask, id, selected: false };
    onUpdateTasks([...tasks, task]);
    toast({
      title: "Task Added",
      description: `Task "${newTask.name}" has been added successfully.`,
    });
  };

  const handleUpdateTask = (id: number, field: keyof Task, value: any) => {
    const updatedTasks = tasks.map(task => 
      task.id === id ? { ...task, [field]: value } : task
    );
    onUpdateTasks(updatedTasks);
  };

  const handleDeleteTask = (id: number) => {
    const taskToDelete = tasks.find(t => t.id === id);
    const updatedTasks = tasks.filter(task => task.id !== id);
    onUpdateTasks(updatedTasks);
    toast({
      title: "Task Deleted",
      description: `Task "${taskToDelete?.name}" has been deleted.`,
      variant: "destructive",
    });
  };

  const handleDeleteSelected = () => {
    const selectedTasks = tasks.filter(task => task.selected);
    if (selectedTasks.length === 0) {
      toast({
        title: "No Tasks Selected",
        description: "Please select tasks to delete.",
        variant: "destructive",
      });
      return;
    }

    const updatedTasks = tasks.filter(task => !task.selected);
    onUpdateTasks(updatedTasks);
    toast({
      title: "Tasks Deleted",
      description: `${selectedTasks.length} task(s) have been deleted.`,
      variant: "destructive",
    });
  };

  const handleSelectAllTasks = (selected: boolean) => {
    const updatedTasks = tasks.map(task => ({ ...task, selected }));
    onUpdateTasks(updatedTasks);
  };

  const handleDateRangeChange = (startDate: string, numberOfDays: number) => {
    setTimelineStartDate(startDate);
    setTimelineDays(numberOfDays);
  };

  const allTasksSelected = tasks.length > 0 && tasks.every(task => task.selected);

  return (
    <main className="flex-1 flex flex-col overflow-hidden">
      {/* Task Management Toolbar */}
      <div className="bg-white border-b border-wrike-border px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <DateRangePicker
              startDate={getTimelineStartDate()}
              numberOfDays={timelineDays}
              onDateRangeChange={handleDateRangeChange}
            />
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleAddTask}
              className="px-4 py-2 bg-wrike-blue text-white rounded hover:bg-wrike-blue-dark transition-colors duration-200 text-sm font-medium"
            >
              <Plus className="mr-2" size={16} />
              Add Task
            </Button>
            <Button 
              onClick={handleDeleteSelected}
              variant="outline"
              className="px-4 py-2 border border-wrike-border text-wrike-text rounded hover:bg-wrike-error/10 hover:border-wrike-error hover:text-wrike-error transition-colors duration-200 text-sm font-medium"
            >
              <Trash2 className="mr-2" size={16} />
              Delete Selected
            </Button>
          </div>
        </div>
      </div>

      {/* Gantt Chart Container */}
      <div className="flex-1 overflow-auto bg-wrike-bg">
        <div className="min-w-max">
          <div className="flex">
            <TaskTable
              tasks={tasks}
              onUpdateTask={handleUpdateTask}
              onDeleteTask={handleDeleteTask}
              onSelectAllTasks={handleSelectAllTasks}
              allTasksSelected={allTasksSelected}
            />
            <Timeline
              tasks={tasks}
              startDate={getTimelineStartDate()}
              numberOfDays={timelineDays}
              onUpdateTask={handleUpdateTask}
            />
          </div>
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
      />
    </main>
  );
}
