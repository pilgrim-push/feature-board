import { User, Plus } from 'lucide-react';
import { Project } from '@/types/gantt';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

interface SidebarProps {
  userName: string;
  projects: Project[];
  onToggleProject: (id: number) => void;
  onAddProject: () => void;
}

export default function Sidebar({ userName, projects, onToggleProject, onAddProject }: SidebarProps) {
  return (
    <aside className="w-64 bg-white border-r border-neutral-30 flex-shrink-0">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-azure-blue rounded-full flex items-center justify-center">
              <User className="text-white" size={16} />
            </div>
            <span className="text-neutral-90 font-medium">{userName}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-semibold text-neutral-70 uppercase tracking-wide">Projects</h3>
          
          {projects.map(project => (
            <div 
              key={project.id}
              className="flex items-center space-x-3 py-2 px-3 rounded-sm hover:bg-neutral-20 cursor-pointer transition-colors duration-150"
              onClick={() => onToggleProject(project.id)}
            >
              <Checkbox
                checked={project.active}
                onCheckedChange={() => onToggleProject(project.id)}
                className="w-4 h-4 text-azure-blue border-neutral-30 rounded focus:ring-azure-blue focus:ring-1"
              />
              <span className="text-sm text-neutral-90">{project.name}</span>
            </div>
          ))}
          
          <Button
            onClick={onAddProject}
            variant="outline"
            className="w-full mt-4 px-3 py-2 border border-dashed border-neutral-30 text-neutral-70 rounded-sm hover:border-azure-blue hover:text-azure-blue transition-colors duration-200 text-sm"
          >
            <Plus className="mr-2" size={16} />
            Add Project
          </Button>
        </div>
      </div>
    </aside>
  );
}
