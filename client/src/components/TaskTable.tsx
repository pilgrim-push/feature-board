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
    <div className="w-[800px] border-r border-stripe-border-light bg-gradient-to-b from-stripe-surface to-stripe-gray-50/30">
      {/* Enhanced Table Header */}
      <div className="sticky top-0 gradient-surface border-b border-stripe-border-light flex h-[60px] text-xs font-semibold text-stripe-text-muted uppercase tracking-wider backdrop-filter backdrop-blur-sm">
        <div className="w-12 px-3 py-2 border-r border-stripe-border-light flex items-center justify-center shrink-0">
          <Checkbox
            checked={allTasksSelected}
            onCheckedChange={onSelectAllTasks}
            className="w-4 h-4 text-stripe-blue border-stripe-border-light rounded focus:ring-stripe-blue focus:ring-1 hover-lift"
          />
        </div>
        <div className="flex-1 px-3 py-2 flex items-center">Tasks & Dependencies</div>
      </div>

      {/* Task Rows */}
      {tasks.map((task, index) => {
        return (
          <div 
            key={task.id} 
            className="border-b border-stripe-border-light flex h-12 hover:bg-gradient-to-r hover:from-stripe-hover hover:to-stripe-blue-light/30 transition-all duration-200 group hover-lift"
          >
            <div className="w-12 px-3 py-2 border-r border-stripe-border-light flex items-center justify-center shrink-0">
              <Checkbox
                checked={task.selected || false}
                onCheckedChange={(checked) => onUpdateTask(task.id, 'selected', checked)}
                className="w-4 h-4 text-stripe-blue border-stripe-border-light rounded focus:ring-stripe-blue focus:ring-1 hover-lift"
              />
            </div>
            <div className="flex-1 px-3 py-2 flex items-center">
              <Input
                value={task.name}
                onChange={(e) => onUpdateTask(task.id, 'name', e.target.value)}
                onDoubleClick={() => onEditTask?.(task)}
                className="w-full border-none bg-transparent text-stripe-text hover:bg-stripe-hover focus:bg-stripe-gray-50 focus:border focus:border-stripe-blue rounded px-2 py-1 text-sm font-medium transition-all cursor-pointer"
              />
              {task.dependencies && task.dependencies.length > 0 && (
                <div className="ml-2 flex gap-1 flex-wrap">
                  {task.dependencies.map(depId => {
                    const depTask = tasks.find(t => t.id === depId);
                    return depTask ? (
                      <span
                        key={depId}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-stripe-blue-light text-stripe-blue"
                        title={`Depends on: ${depTask.name}`}
                      >
                        {depTask.name}
                      </span>
                    ) : null;
                  })}
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
