import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Task, NewTask } from '@/types/gantt';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { recalculateTaskDates, validateDependencies } from '@/utils/dependencies';
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
  const [editingTask, setEditingTask] = useState<Task | null>(null);
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
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = (newTask: NewTask) => {
    const id = Math.max(0, ...tasks.map(t => t.id)) + 1;
    const taskToAdd: Task = { ...newTask, id, selected: false };
    let updatedTasks = [...tasks, taskToAdd];
    
    // Validate dependencies
    const validation = validateDependencies(updatedTasks);
    if (!validation.isValid) {
      toast({
        title: "Invalid Dependencies",
        description: validation.errors[0],
        variant: "destructive"
      });
      return;
    }
    
    // Recalculate dates based on dependencies
    updatedTasks = recalculateTaskDates(updatedTasks);
    onUpdateTasks(updatedTasks);
    setIsModalOpen(false);
    
    toast({
      title: "Task Added",
      description: `Task "${newTask.name}" has been added successfully.`,
    });
  };

  const handleUpdateTaskFromModal = (updatedTask: Task) => {
    let updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    
    // Validate dependencies
    const validation = validateDependencies(updatedTasks);
    if (!validation.isValid) {
      toast({
        title: "Invalid Dependencies",
        description: validation.errors[0],
        variant: "destructive"
      });
      return;
    }
    
    // Recalculate dates based on dependencies
    updatedTasks = recalculateTaskDates(updatedTasks);
    onUpdateTasks(updatedTasks);
    setIsModalOpen(false);
    
    toast({
      title: "Task Updated",
      description: `Task "${updatedTask.name}" has been updated successfully.`,
    });
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
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
      {/* Modern Task Management Toolbar */}
      <div className="gradient-surface border-b border-stripe-border-light px-6 py-4 backdrop-filter backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="glass-card px-4 py-2 rounded-lg">
              <DateRangePicker
                startDate={getTimelineStartDate()}
                numberOfDays={timelineDays}
                onDateRangeChange={handleDateRangeChange}
              />
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button 
              onClick={handleAddTask}
              className="px-6 py-3 bg-stripe-blue hover:bg-stripe-blue-hover text-white rounded-lg shadow-lg transition-colors duration-200 text-sm font-medium flex items-center"
              style={{ minHeight: '44px' }}
            >
              <Plus className="mr-2" size={16} />
              Add Task
            </Button>
            <Button 
              onClick={handleDeleteSelected}
              variant="outline"
              className="px-4 py-3 border border-stripe-border-light text-stripe-text rounded-lg hover:bg-stripe-danger hover:text-white transition-colors duration-200 text-sm font-medium"
              style={{ minHeight: '44px' }}
            >
              <Trash2 className="mr-2" size={16} />
              Delete Selected
            </Button>
          </div>
        </div>
      </div>

      {/* Enhanced Gantt Chart Container */}
      <div className="flex-1 overflow-auto gradient-bg">
        <div className="flex min-w-max shadow-lg border border-stripe-border-light bg-gradient-to-br from-stripe-surface/80 to-stripe-gray-50/60 backdrop-filter backdrop-blur-sm">
          <TaskTable
            tasks={tasks}
            onUpdateTask={handleUpdateTask}
            onDeleteTask={handleDeleteTask}
            onSelectAllTasks={handleSelectAllTasks}
            allTasksSelected={allTasksSelected}
            onEditTask={handleEditTask}
          />
          <Timeline
            tasks={tasks}
            startDate={getTimelineStartDate()}
            numberOfDays={timelineDays}
            onUpdateTask={handleUpdateTask}
            onEditTask={handleEditTask}
          />
        </div>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveTask}
        onUpdate={handleUpdateTaskFromModal}
        editingTask={editingTask}
        allTasks={tasks}
      />
    </main>
  );
}
