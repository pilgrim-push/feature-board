import { Edit, Trash2 } from 'lucide-react';
import { Task } from '@/types/gantt';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface TaskTableProps {
  tasks: Task[];
  onUpdateTask: (id: number, field: keyof Task, value: any) => void;
  onDeleteTask: (id: number) => void;
  onSelectAllTasks: (selected: boolean) => void;
  allTasksSelected: boolean;
}

export default function TaskTable({ 
  tasks, 
  onUpdateTask, 
  onDeleteTask, 
  onSelectAllTasks,
  allTasksSelected 
}: TaskTableProps) {
  return (
    <div className="w-88 border-r border-neutral-30 bg-neutral-10">
      {/* Table Header */}
      <div className="sticky top-0 bg-neutral-20 border-b border-neutral-30 grid grid-cols-12 text-xs font-semibold text-neutral-70 uppercase tracking-wide">
        <div className="col-span-1 p-3 border-r border-neutral-30 flex items-center justify-center">
          <Checkbox
            checked={allTasksSelected}
            onCheckedChange={onSelectAllTasks}
            className="w-4 h-4 text-azure-blue border-neutral-30 rounded focus:ring-azure-blue focus:ring-1"
          />
        </div>
        <div className="col-span-1 p-3 border-r border-neutral-30">#</div>
        <div className="col-span-3 p-3 border-r border-neutral-30">Task</div>
        <div className="col-span-2 p-3 border-r border-neutral-30">Start Date</div>
        <div className="col-span-2 p-3 border-r border-neutral-30">Duration</div>
        <div className="col-span-2 p-3 border-r border-neutral-30">Priority</div>
        <div className="col-span-1 p-3">Actions</div>
      </div>

      {/* Task Rows */}
      {tasks.map((task, index) => (
        <div 
          key={task.id} 
          className="border-b border-neutral-30 grid grid-cols-12 hover:bg-neutral-20 transition-colors duration-150"
        >
          <div className="col-span-1 p-3 border-r border-neutral-30 flex items-center justify-center">
            <Checkbox
              checked={task.selected || false}
              onCheckedChange={(checked) => onUpdateTask(task.id, 'selected', checked)}
              className="w-4 h-4 text-azure-blue border-neutral-30 rounded focus:ring-azure-blue focus:ring-1"
            />
          </div>
          <div className="col-span-1 p-3 border-r border-neutral-30 flex items-center text-neutral-70">
            {index + 1}
          </div>
          <div className="col-span-3 p-3 border-r border-neutral-30 flex items-center">
            <Input
              value={task.name}
              onChange={(e) => onUpdateTask(task.id, 'name', e.target.value)}
              className="w-full border-none bg-transparent focus:bg-white focus:border focus:border-azure-blue rounded-sm px-2 py-1 text-sm"
            />
          </div>
          <div className="col-span-2 p-3 border-r border-neutral-30 flex items-center">
            <Input
              type="date"
              value={task.startDate}
              onChange={(e) => onUpdateTask(task.id, 'startDate', e.target.value)}
              className="w-full border border-neutral-30 rounded-sm px-2 py-1 text-sm focus:border-azure-blue focus:ring-1 focus:ring-azure-blue"
            />
          </div>
          <div className="col-span-2 p-3 border-r border-neutral-30 flex items-center">
            <Input
              type="number"
              value={task.duration}
              onChange={(e) => onUpdateTask(task.id, 'duration', parseInt(e.target.value) || 1)}
              min="1"
              className="w-full border border-neutral-30 rounded-sm px-2 py-1 text-sm focus:border-azure-blue focus:ring-1 focus:ring-azure-blue"
            />
            <span className="ml-1 text-xs text-neutral-70">d</span>
          </div>
          <div className="col-span-2 p-3 border-r border-neutral-30 flex items-center">
            <Select 
              value={task.priority} 
              onValueChange={(value: 'low' | 'medium' | 'high') => onUpdateTask(task.id, 'priority', value)}
            >
              <SelectTrigger className="w-full border border-neutral-30 rounded-sm px-2 py-1 text-sm focus:border-azure-blue focus:ring-1 focus:ring-azure-blue">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1 p-3 flex items-center justify-center">
            <Button
              onClick={() => onDeleteTask(task.id)}
              variant="ghost"
              size="sm"
              className="text-error hover:bg-red-50 p-1 rounded-sm transition-colors duration-150"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
