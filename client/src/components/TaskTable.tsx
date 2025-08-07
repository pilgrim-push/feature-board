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
    <div className="w-[600px] border-r border-spotify-border bg-spotify-card">
      {/* Table Header */}
      <div className="sticky top-0 bg-spotify-sidebar border-b border-spotify-border grid grid-cols-12 h-14 text-xs font-bold text-spotify-text-muted uppercase tracking-wider">
        <div className="col-span-1 px-4 py-3 border-r border-spotify-border flex items-center justify-center">
          <Checkbox
            checked={allTasksSelected}
            onCheckedChange={onSelectAllTasks}
            className="w-4 h-4 text-spotify-green border-spotify-border rounded focus:ring-spotify-green focus:ring-1"
          />
        </div>
        <div className="col-span-1 px-4 py-3 border-r border-spotify-border flex items-center justify-center">#</div>
        <div className="col-span-3 px-4 py-3 border-r border-spotify-border flex items-center">Task</div>
        <div className="col-span-2 px-4 py-3 border-r border-spotify-border flex items-center">Start Date</div>
        <div className="col-span-2 px-4 py-3 border-r border-spotify-border flex items-center">Duration</div>
        <div className="col-span-2 px-4 py-3 border-r border-spotify-border flex items-center">Priority</div>
        <div className="col-span-1 px-4 py-3 flex items-center justify-center">Actions</div>
      </div>

      {/* Task Rows */}
      {tasks.map((task, index) => (
        <div 
          key={task.id} 
          className="border-b border-spotify-border grid grid-cols-12 h-16 hover:bg-spotify-hover transition-all duration-200 group"
        >
          <div className="col-span-1 px-4 py-3 border-r border-spotify-border flex items-center justify-center">
            <Checkbox
              checked={task.selected || false}
              onCheckedChange={(checked) => onUpdateTask(task.id, 'selected', checked)}
              className="w-4 h-4 text-spotify-green border-spotify-border rounded focus:ring-spotify-green focus:ring-1"
            />
          </div>
          <div className="col-span-1 px-4 py-3 border-r border-spotify-border flex items-center justify-center text-spotify-text-muted font-medium">
            {index + 1}
          </div>
          <div className="col-span-3 px-4 py-3 border-r border-spotify-border flex items-center">
            <Input
              value={task.name}
              onChange={(e) => onUpdateTask(task.id, 'name', e.target.value)}
              className="w-full border-none bg-transparent text-spotify-text hover:bg-spotify-hover focus:bg-spotify-sidebar focus:border focus:border-spotify-green rounded-lg px-3 py-2 text-sm transition-all"
            />
          </div>
          <div className="col-span-2 px-4 py-3 border-r border-spotify-border flex items-center">
            <Input
              type="date"
              value={task.startDate}
              onChange={(e) => onUpdateTask(task.id, 'startDate', e.target.value)}
              className="w-full border border-spotify-border bg-spotify-sidebar text-spotify-text rounded-lg px-3 py-2 text-sm focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-colors"
            />
          </div>
          <div className="col-span-2 px-4 py-3 border-r border-spotify-border flex items-center">
            <Input
              type="number"
              value={task.duration}
              onChange={(e) => onUpdateTask(task.id, 'duration', parseInt(e.target.value) || 1)}
              min="1"
              className="w-full border border-spotify-border bg-spotify-sidebar text-spotify-text rounded-lg px-3 py-2 text-sm focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-colors"
            />
            <span className="ml-2 text-xs text-spotify-text-muted font-medium">d</span>
          </div>
          <div className="col-span-2 px-4 py-3 border-r border-spotify-border flex items-center">
            <Select 
              value={task.priority} 
              onValueChange={(value: 'low' | 'medium' | 'high') => onUpdateTask(task.id, 'priority', value)}
            >
              <SelectTrigger className="w-full border border-spotify-border bg-spotify-sidebar text-spotify-text rounded-lg px-3 py-2 text-sm focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-spotify-sidebar border-spotify-border">
                <SelectItem value="high" className="text-spotify-text hover:bg-spotify-hover">High</SelectItem>
                <SelectItem value="medium" className="text-spotify-text hover:bg-spotify-hover">Medium</SelectItem>
                <SelectItem value="low" className="text-spotify-text hover:bg-spotify-hover">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1 px-4 py-3 flex items-center justify-center">
            <Button
              onClick={() => onDeleteTask(task.id)}
              variant="ghost"
              size="sm"
              className="text-red-400 hover:bg-red-500/10 hover:text-red-300 p-2 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
