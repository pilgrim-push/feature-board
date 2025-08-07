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
    <div className="w-[700px] border-r border-wrike-border bg-white">
      {/* Table Header */}
      <div className="sticky top-0 bg-wrike-sidebar border-b border-wrike-border grid grid-cols-12 h-[60px] text-xs font-semibold text-wrike-text-muted uppercase tracking-wider">
        <div className="col-span-1 px-3 py-2 border-r border-wrike-border flex items-center justify-center">
          <Checkbox
            checked={allTasksSelected}
            onCheckedChange={onSelectAllTasks}
            className="w-4 h-4 text-wrike-blue border-wrike-border rounded focus:ring-wrike-blue focus:ring-1"
          />
        </div>
        <div className="col-span-1 px-3 py-2 border-r border-wrike-border flex items-center justify-center">#</div>
        <div className="col-span-4 px-3 py-2 border-r border-wrike-border flex items-center">Task</div>
        <div className="col-span-2 px-3 py-2 border-r border-wrike-border flex items-center">Start Date</div>
        <div className="col-span-2 px-3 py-2 border-r border-wrike-border flex items-center">Duration</div>
        <div className="col-span-1 px-3 py-2 border-r border-wrike-border flex items-center">Priority</div>
        <div className="col-span-1 px-3 py-2 flex items-center justify-center">Actions</div>
      </div>

      {/* Task Rows */}
      {tasks.map((task, index) => (
        <div 
          key={task.id} 
          className="border-b border-wrike-border grid grid-cols-12 h-12 hover:bg-wrike-hover transition-colors duration-200 group"
        >
          <div className="col-span-1 px-3 py-2 border-r border-wrike-border flex items-center justify-center">
            <Checkbox
              checked={task.selected || false}
              onCheckedChange={(checked) => onUpdateTask(task.id, 'selected', checked)}
              className="w-4 h-4 text-wrike-blue border-wrike-border rounded focus:ring-wrike-blue focus:ring-1"
            />
          </div>
          <div className="col-span-1 px-3 py-2 border-r border-wrike-border flex items-center justify-center text-wrike-text-muted font-medium">
            {index + 1}
          </div>
          <div className="col-span-4 px-3 py-2 border-r border-wrike-border flex items-center">
            <Input
              value={task.name}
              onChange={(e) => onUpdateTask(task.id, 'name', e.target.value)}
              className="w-full border-none bg-transparent text-wrike-text hover:bg-wrike-hover focus:bg-wrike-sidebar focus:border focus:border-wrike-blue rounded px-2 py-1 text-sm transition-all"
            />
          </div>
          <div className="col-span-2 px-3 py-2 border-r border-wrike-border flex items-center">
            <Input
              type="date"
              value={task.startDate}
              onChange={(e) => onUpdateTask(task.id, 'startDate', e.target.value)}
              className="w-full border border-wrike-border bg-white text-wrike-text rounded px-2 py-1 text-sm focus:border-wrike-blue focus:ring-1 focus:ring-wrike-blue/20 transition-colors"
            />
          </div>
          <div className="col-span-2 px-3 py-2 border-r border-wrike-border flex items-center">
            <Input
              type="number"
              value={task.duration}
              onChange={(e) => onUpdateTask(task.id, 'duration', parseInt(e.target.value) || 1)}
              min="1"
              className="w-full border border-wrike-border bg-white text-wrike-text rounded px-2 py-1 text-sm focus:border-wrike-blue focus:ring-1 focus:ring-wrike-blue/20 transition-colors"
            />
            <span className="ml-1 text-xs text-wrike-text-muted font-medium">d</span>
          </div>
          <div className="col-span-1 px-3 py-2 border-r border-wrike-border flex items-center">
            <Select 
              value={task.priority} 
              onValueChange={(value: 'low' | 'medium' | 'high') => onUpdateTask(task.id, 'priority', value)}
            >
              <SelectTrigger className="w-full border border-wrike-border bg-white text-wrike-text rounded px-2 py-1 text-sm focus:border-wrike-blue focus:ring-1 focus:ring-wrike-blue/20 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white border-wrike-border">
                <SelectItem value="high" className="text-wrike-text hover:bg-wrike-hover">High</SelectItem>
                <SelectItem value="medium" className="text-wrike-text hover:bg-wrike-hover">Medium</SelectItem>
                <SelectItem value="low" className="text-wrike-text hover:bg-wrike-hover">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1 px-3 py-2 flex items-center justify-center">
            <Button
              onClick={() => onDeleteTask(task.id)}
              variant="ghost"
              size="sm"
              className="text-wrike-error hover:bg-wrike-error/10 hover:text-wrike-error p-1 rounded transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={12} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
