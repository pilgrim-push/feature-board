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
        <DialogHeader className="p-6 border-b border-neutral-30">
          <DialogTitle className="text-lg font-semibold text-neutral-90">Add New Task</DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-4">
          <div>
            <Label className="block text-sm font-medium text-neutral-90 mb-1">Task Name</Label>
            <Input
              type="text"
              value={task.name}
              onChange={(e) => setTask({ ...task, name: e.target.value })}
              placeholder="Enter task name"
              className="w-full border border-neutral-30 rounded-sm px-3 py-2 text-sm focus:border-azure-blue focus:ring-1 focus:ring-azure-blue"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="block text-sm font-medium text-neutral-90 mb-1">Start Date</Label>
              <Input
                type="date"
                value={task.startDate}
                onChange={(e) => setTask({ ...task, startDate: e.target.value })}
                className="w-full border border-neutral-30 rounded-sm px-3 py-2 text-sm focus:border-azure-blue focus:ring-1 focus:ring-azure-blue"
              />
            </div>
            <div>
              <Label className="block text-sm font-medium text-neutral-90 mb-1">Duration (days)</Label>
              <Input
                type="number"
                min="1"
                value={task.duration}
                onChange={(e) => setTask({ ...task, duration: parseInt(e.target.value) || 1 })}
                placeholder="1"
                className="w-full border border-neutral-30 rounded-sm px-3 py-2 text-sm focus:border-azure-blue focus:ring-1 focus:ring-azure-blue"
              />
            </div>
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-neutral-90 mb-1">Priority</Label>
            <Select value={task.priority} onValueChange={(value: 'low' | 'medium' | 'high') => setTask({ ...task, priority: value })}>
              <SelectTrigger className="w-full border border-neutral-30 rounded-sm px-3 py-2 text-sm focus:border-azure-blue focus:ring-1 focus:ring-azure-blue">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="block text-sm font-medium text-neutral-90 mb-1">Description</Label>
            <Textarea
              value={task.description}
              onChange={(e) => setTask({ ...task, description: e.target.value })}
              rows={3}
              placeholder="Optional task description"
              className="w-full border border-neutral-30 rounded-sm px-3 py-2 text-sm focus:border-azure-blue focus:ring-1 focus:ring-azure-blue"
            />
          </div>
        </div>
        
        <div className="p-6 border-t border-neutral-30 flex justify-end space-x-3">
          <Button
            onClick={handleClose}
            variant="outline"
            className="px-4 py-2 border border-neutral-30 text-neutral-90 rounded-sm hover:bg-neutral-20 transition-colors duration-200 text-sm font-medium"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-4 py-2 bg-azure-blue text-white rounded-sm hover:bg-azure-blue-dark transition-colors duration-200 text-sm font-medium"
          >
            Add Task
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
