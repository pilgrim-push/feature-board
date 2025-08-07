import { useState } from 'react';
import { NewTask } from '@/types/gantt';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: NewTask) => void;
}

export default function TaskModal({ isOpen, onClose, onSave }: TaskModalProps) {
  const [task, setTask] = useState<NewTask>({
    name: '',
    startDate: new Date().toISOString().split('T')[0],
    duration: 1,
    priority: 'medium',
    description: ''
  });

  const handleSave = () => {
    if (task.name.trim()) {
      onSave(task);
      setTask({
        name: '',
        startDate: new Date().toISOString().split('T')[0],
        duration: 1,
        priority: 'medium',
        description: ''
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
      description: ''
    });
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="bg-white rounded-lg shadow-xl w-96 max-w-full mx-4">
        <DialogHeader className="p-6 border-b border-wrike-border">
          <DialogTitle className="text-lg font-semibold text-wrike-text">Add New Task</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          <div>
            <Label className="block text-sm font-medium text-wrike-text mb-1">Task Name</Label>
            <Input
              type="text"
              value={task.name}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
              placeholder="Enter task name"
              className="w-full border border-wrike-border rounded px-3 py-2 text-sm focus:border-wrike-blue focus:ring-1 focus:ring-wrike-blue/20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-wrike-text mb-1">Start Date</Label>
              <Input
                type="date"
                value={task.startDate}
                onChange={(e) => setTask({ ...task, startDate: e.target.value })}
                className="w-full border border-wrike-border rounded px-3 py-2 text-sm focus:border-wrike-blue focus:ring-1 focus:ring-wrike-blue/20"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-wrike-text mb-1">Duration (days)</Label>
              <Input
                type="number"
                min="1"
                value={task.duration}
                onChange={(e) => setTask({ ...task, duration: parseInt(e.target.value) || 1 })}
                placeholder="1"
                className="w-full border border-wrike-border rounded px-3 py-2 text-sm focus:border-wrike-blue focus:ring-1 focus:ring-wrike-blue/20"
              />
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-wrike-text mb-1">Priority</Label>
            <Select value={task.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setTask({ ...task, priority: value })}>
              <SelectTrigger className="w-full border border-wrike-border rounded px-3 py-2 text-sm focus:border-wrike-blue focus:ring-1 focus:ring-wrike-blue/20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-wrike-border">
                <SelectItem value="low" className="text-wrike-text hover:bg-wrike-hover">Low</SelectItem>
                <SelectItem value="medium" className="text-wrike-text hover:bg-wrike-hover">Medium</SelectItem>
                <SelectItem value="high" className="text-wrike-text hover:bg-wrike-hover">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-wrike-text mb-1">Description</Label>
            <Textarea
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              rows={3}
              placeholder="Optional task description"
              className="w-full border border-wrike-border rounded px-3 py-2 text-sm focus:border-wrike-blue focus:ring-1 focus:ring-wrike-blue/20"
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-wrike-border flex justify-end space-x-3">
          <Button
            onClick={handleClose}
            variant="outline"
            className="px-4 py-2 border border-wrike-border text-wrike-text rounded hover:bg-wrike-hover transition-colors duration-200 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-4 py-2 bg-wrike-blue text-white rounded hover:bg-wrike-blue-dark transition-colors duration-200 text-sm font-medium"
          >
            Add Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
