import { useState, useEffect } from 'react';
import { NewTask, Task } from '@/types/gantt';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { calculateEndDate, formatDateForInput } from '@/utils/workingDays';
import { getAvailablePredecessors } from '@/utils/dependencies';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: NewTask) => void;
  onUpdate?: (task: Task) => void;
  editingTask?: Task | null;
  allTasks: Task[];
}

export default function TaskModal({ isOpen, onClose, onSave, onUpdate, editingTask, allTasks }: TaskModalProps) {
  const [task, setTask] = useState<NewTask>({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    duration: 1,
    priority: 'medium',
    description: '',
    dependencies: []
  });

  const isEditing = !!editingTask;

  // Заполняем форму данными при редактировании
  useEffect(() => {
    if (editingTask) {
      setTask({
        name: editingTask.name,
        startDate: editingTask.startDate,
        duration: editingTask.duration,
        priority: editingTask.priority,
        description: editingTask.description || '',
        dependencies: editingTask.dependencies || []
      });
    } else {
      setTask({
        name: '',
        startDate: new Date().toISOString().split('T')[0],
        duration: 1,
        priority: 'medium',
        description: '',
        dependencies: []
      });
    }
  }, [editingTask, isOpen]);

  const handleSave = () => {
    if (task.name.trim()) {
      if (isEditing && onUpdate && editingTask) {
        // Обновляем существующую задачу
        onUpdate({
          ...editingTask,
          ...task
        });
      } else {
        // Создаем новую задачу
        onSave(task);
      }
      
      // Сбрасываем форму
      setTask({
        name: '',
        startDate: new Date().toISOString().split('T')[0],
        duration: 1,
        priority: 'medium',
        description: '',
        dependencies: []
      });
      onClose();
    }
  };

  const handleClose = () => {
    setTask({
      name: '',
      startDate: new Date().toISOString().split('T')[0],
      duration: 1,
      priority: 'medium',
      description: '',
      dependencies: []
    });
    onClose();
  };

  const availablePredecessors = getAvailablePredecessors(allTasks, editingTask?.id || -1);

  const handleDependencyChange = (taskId: number, checked: boolean) => {
    const currentDeps = task.dependencies || [];
    if (checked) {
      setTask({ ...task, dependencies: [...currentDeps, taskId] });
    } else {
      setTask({ ...task, dependencies: currentDeps.filter(id => id !== taskId) });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="glass-card rounded-2xl shadow-2xl w-96 max-w-full mx-4 border border-stripe-border-light" aria-describedby="task-modal-description">
        <div className="animated-gradient h-1 rounded-t-2xl"></div>
        <DialogHeader className="p-6 border-b border-stripe-border-light">
          <DialogTitle className="text-lg font-semibold text-stripe-text flex items-center space-x-2">
            <div className="w-2 h-2 rounded-full bg-gradient-to-r from-stripe-blue to-stripe-purple"></div>
            <span>{isEditing ? 'Edit Task' : 'Add New Task'}</span>
          </DialogTitle>
        </DialogHeader>
        <div id="task-modal-description" className="sr-only">
          {isEditing ? 'Edit task details including name, dates, priority and dependencies' : 'Create a new task with name, dates, priority and dependencies'}
        </div>
        
        <div className="p-6 space-y-6">
          <div>
            <Label className="block text-sm font-medium text-stripe-text mb-2">Task Name</Label>
            <Input
              type="text"
              value={task.name}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
              placeholder="Enter task name"
              className="w-full border border-stripe-border-light rounded-lg px-4 py-3 text-sm focus:border-stripe-blue focus:ring-2 focus:ring-stripe-blue/20 glass-surface hover-lift transition-all duration-200"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-stripe-text mb-1">Start Date</Label>
              <Input
                type="date"
                value={task.startDate}
                onChange={(e) => setTask({ ...task, startDate: e.target.value })}
                className="w-full border border-stripe-border rounded-md px-3 py-2 text-sm focus:border-stripe-blue focus:ring-1 focus:ring-stripe-blue/20"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-stripe-text mb-1">Duration (days)</Label>
              <Input
                type="number"
                min="1"
                value={task.duration}
                onChange={(e) => setTask({ ...task, duration: parseInt(e.target.value) || 1 })}
                placeholder="1"
                className="w-full border border-stripe-border rounded-md px-3 py-2 text-sm focus:border-stripe-blue focus:ring-1 focus:ring-stripe-blue/20"
              />
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-stripe-text mb-1">Priority</Label>
            <Select value={task.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setTask({ ...task, priority: value })}>
              <SelectTrigger className="w-full border border-stripe-border rounded-md px-3 py-2 text-sm focus:border-stripe-blue focus:ring-1 focus:ring-stripe-blue/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-stripe-surface border-stripe-border">
                <SelectItem value="low" className="text-stripe-text hover:bg-stripe-hover">Low</SelectItem>
                <SelectItem value="medium" className="text-stripe-text hover:bg-stripe-hover">Medium</SelectItem>
                <SelectItem value="high" className="text-stripe-text hover:bg-stripe-hover">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-stripe-text mb-1">Description</Label>
            <Textarea
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              rows={3}
              placeholder="Optional task description"
              className="w-full border border-stripe-border rounded-md px-3 py-2 text-sm focus:border-stripe-blue focus:ring-1 focus:ring-stripe-blue/20"
            />
          </div>

          {availablePredecessors.length > 0 && (
            <div>
              <Label className="block text-sm font-medium text-stripe-text mb-2">Dependencies</Label>
              <div className="space-y-2 max-h-32 overflow-y-auto border border-stripe-border rounded-md p-3">
                {availablePredecessors.map((predecessor) => (
                  <div key={predecessor.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dep-${predecessor.id}`}
                      checked={task.dependencies?.includes(predecessor.id) || false}
                      onCheckedChange={(checked) => handleDependencyChange(predecessor.id, !!checked)}
                      className="w-4 h-4 text-stripe-blue border-stripe-border rounded focus:ring-stripe-blue focus:ring-1"
                    />
                    <Label
                      htmlFor={`dep-${predecessor.id}`}
                      className="text-sm text-stripe-text cursor-pointer flex-1"
                    >
                      {predecessor.name}
                    </Label>
                  </div>
                ))}
              </div>
              <p className="text-xs text-stripe-text-muted mt-1">
                Selected tasks must be completed before this task can start
              </p>
            </div>
          )}
        </div>
        
        <div className="p-6 border-t border-stripe-border-light flex justify-end space-x-3 gradient-surface">
          <Button
            onClick={handleClose}
            variant="outline"
            className="px-6 py-2.5 border border-stripe-border-light text-stripe-text rounded-lg hover:bg-stripe-hover hover-lift transition-all duration-200 text-sm font-medium glass-surface"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 py-2.5 bg-gradient-to-r from-stripe-blue to-stripe-purple hover:from-stripe-blue-hover hover:to-stripe-purple text-white rounded-lg shadow-lg hover-lift transition-all duration-200 text-sm font-medium"
          >
            {isEditing ? 'Save Changes' : 'Add Task'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
