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
  onEditTask?: (task: Task) => void;
}

export default function TaskTable({ 
  tasks, 
  onUpdateTask, 
  onDeleteTask, 
  onSelectAllTasks,
  allTasksSelected,
  onEditTask 
}: TaskTableProps) {
  return (
    <div className="w-[800px] border-r border-stripe-border bg-stripe-surface">
      {/* Table Header */}
      <div className="sticky top-0 bg-stripe-gray-50 border-b border-stripe-border flex h-[60px] text-xs font-semibold text-stripe-text-muted uppercase tracking-wider">
        <div className="w-12 px-3 py-2 border-r border-stripe-border flex items-center justify-center shrink-0">
          <Checkbox
            checked={allTasksSelected}
            onCheckedChange={onSelectAllTasks}
            className="w-4 h-4 text-stripe-blue border-stripe-border rounded focus:ring-stripe-blue focus:ring-1"
          />
        </div>
        <div className="flex-1 px-3 py-2 flex items-center">Task</div>
      </div>

      {/* Task Rows */}
      {tasks.map((task, index) => {
        return (
          <div 
            key={task.id} 
            className="border-b border-stripe-border flex h-12 hover:bg-stripe-hover transition-colors duration-200 group"
          >
            <div className="w-12 px-3 py-2 border-r border-stripe-border flex items-center justify-center shrink-0">
              <Checkbox
                checked={task.selected || false}
                onCheckedChange={(checked) => onUpdateTask(task.id, 'selected', checked)}
                className="w-4 h-4 text-stripe-blue border-stripe-border rounded focus:ring-stripe-blue focus:ring-1"
              />
            </div>
            <div className="flex-1 px-3 py-2 flex items-center">
              <Input
                value={task.name}
                onChange={(e) => onUpdateTask(task.id, 'name', e.target.value)}
                onDoubleClick={() => onEditTask?.(task)}
                className="w-full border-none bg-transparent text-stripe-text hover:bg-stripe-hover focus:bg-stripe-gray-50 focus:border focus:border-stripe-blue rounded px-2 py-1 text-sm font-medium transition-all cursor-pointer"
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
