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
    <div className="w-[600px] border-r border-gray-200 bg-white">
      {/* Table Header */}
      <div className="sticky top-0 bg-gray-50 border-b border-gray-200 grid grid-cols-12 h-12 text-xs font-semibold text-gray-700 uppercase tracking-wider">
        <div className="col-span-1 px-4 py-3 border-r border-gray-200 flex items-center justify-center">
          <Checkbox
            checked={allTasksSelected}
            onCheckedChange={onSelectAllTasks}
            className="w-4 h-4 text-azure-blue border-gray-300 rounded focus:ring-azure-blue focus:ring-1"
          />
        </div>
        <div className="col-span-1 px-4 py-3 border-r border-gray-200 flex items-center justify-center">#</div>
        <div className="col-span-3 px-4 py-3 border-r border-gray-200 flex items-center">Task</div>
        <div className="col-span-2 px-4 py-3 border-r border-gray-200 flex items-center">Start Date</div>
        <div className="col-span-2 px-4 py-3 border-r border-gray-200 flex items-center">Duration</div>
        <div className="col-span-2 px-4 py-3 border-r border-gray-200 flex items-center">Priority</div>
        <div className="col-span-1 px-4 py-3 flex items-center justify-center">Actions</div>
      </div>

      {/* Task Rows */}
      {tasks.map((task, index) => (
        <div 
          key={task.id} 
          className="border-b border-gray-100 grid grid-cols-12 h-14 hover:bg-blue-50 transition-colors duration-150"
        >
          <div className="col-span-1 px-4 py-3 border-r border-gray-200 flex items-center justify-center">
            <Checkbox
              checked={task.selected || false}
              onCheckedChange={(checked) => onUpdateTask(task.id, 'selected', checked)}
              className="w-4 h-4 text-azure-blue border-gray-300 rounded focus:ring-azure-blue focus:ring-1"
            />
          </div>
          <div className="col-span-1 px-4 py-3 border-r border-gray-200 flex items-center justify-center text-gray-600 font-medium">
            {index + 1}
          </div>
          <div className="col-span-3 px-4 py-3 border-r border-gray-200 flex items-center">
            <Input
              value={task.name}
              onChange={(e) => onUpdateTask(task.id, 'name', e.target.value)}
              className="w-full border-none bg-transparent hover:bg-gray-50 focus:bg-white focus:border focus:border-azure-blue rounded-md px-3 py-2 text-sm transition-colors"
            />
          </div>
          <div className="col-span-2 px-4 py-3 border-r border-gray-200 flex items-center">
            <Input
              type="date"
              value={task.startDate}
              onChange={(e) => onUpdateTask(task.id, 'startDate', e.target.value)}
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-azure-blue focus:ring-2 focus:ring-blue-100 transition-colors"
            />
          </div>
          <div className="col-span-2 px-4 py-3 border-r border-gray-200 flex items-center">
            <Input
              type="number"
              value={task.duration}
              onChange={(e) => onUpdateTask(task.id, 'duration', parseInt(e.target.value) || 1)}
              min="1"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-azure-blue focus:ring-2 focus:ring-blue-100 transition-colors"
            />
            <span className="ml-2 text-xs text-gray-500 font-medium">d</span>
          </div>
          <div className="col-span-2 px-4 py-3 border-r border-gray-200 flex items-center">
            <Select 
              value={task.priority} 
              onValueChange={(value: 'low' | 'medium' | 'high') => onUpdateTask(task.id, 'priority', value)}
            >
              <SelectTrigger className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:border-azure-blue focus:ring-2 focus:ring-blue-100 transition-colors">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-1 px-4 py-3 flex items-center justify-center">
            <Button
              onClick={() => onDeleteTask(task.id)}
              variant="ghost"
              size="sm"
              className="text-red-500 hover:bg-red-50 hover:text-red-600 p-2 rounded-md transition-colors duration-150"
            >
              <Trash2 size={14} />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
