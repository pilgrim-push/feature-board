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
    <aside className="w-64 bg-spotify-sidebar border-r border-spotify-border flex-shrink-0">
      <div className="p-6">
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
              <User className="text-black" size={16} />
            </div>
            <span className="text-spotify-text font-medium">{userName}</span>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xs font-bold text-spotify-text-muted uppercase tracking-wide">Projects</h3>
          
          {projects.map(project => (
            <div 
              key={project.id}
              className="flex items-center space-x-3 py-3 px-3 rounded-lg hover:bg-spotify-hover cursor-pointer transition-all duration-200 group"
              onClick={() => onToggleProject(project.id)}
            >
              <Checkbox
                checked={project.active}
                onCheckedChange={() => onToggleProject(project.id)}
                className="w-4 h-4 text-spotify-green border-spotify-border rounded focus:ring-spotify-green focus:ring-1"
              />
              <span className="text-sm text-spotify-text group-hover:text-spotify-green transition-colors">{project.name}</span>
            </div>
          ))}
          
          <Button
            onClick={onAddProject}
            variant="outline"
            className="w-full mt-4 px-3 py-3 border border-dashed border-spotify-border text-spotify-text-muted rounded-lg hover:border-spotify-green hover:text-spotify-green transition-colors duration-200 text-sm font-medium"
          >
            <Plus className="mr-2" size={16} />
            Add Project
          </Button>
        </div>
      </div>
    </aside>
  );
}
