import { User, Plus, ChevronLeft, ChevronRight, Folder, Calendar } from 'lucide-react';
import { Project } from '@/types/gantt';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { useState } from 'react';

interface SidebarProps {
  userName: string;
  projects: Project[];
  onToggleProject: (id: number) => void;
  onAddProject: () => void;
}

export default function Sidebar({ userName, projects, onToggleProject, onAddProject }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <aside className={`${isCollapsed ? 'w-12' : 'w-64'} bg-sidebar border-r border-border flex-shrink-0 transition-all duration-300 relative`}>
      {/* Toggle Button */}
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-4 z-10 w-6 h-6 bg-sidebar border border-border rounded-full p-1 hover:bg-accent transition-all duration-200"
        data-testid="button-toggle-sidebar"
      >
        {isCollapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
      </Button>

      <div className={`h-full ${isCollapsed ? 'hidden' : 'block'}`}>
        {/* User Section */}
        <div className="p-4 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
              <User className="text-sidebar-foreground" size={16} />
            </div>
            <span className="text-sm font-medium text-sidebar-foreground">{userName}</span>
          </div>
        </div>

        {/* Navigation Menu */}
        <div className="p-4 space-y-1">
          <div className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Workspace
          </div>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:bg-accent hover:text-accent-foreground text-sm font-normal"
            data-testid="nav-dashboard"
          >
            <Calendar className="mr-3" size={16} />
            Dashboard
          </Button>
          
          <Button 
            variant="ghost" 
            className="w-full justify-start text-sidebar-foreground hover:bg-accent hover:text-accent-foreground text-sm font-normal"
            data-testid="nav-projects"
          >
            <Folder className="mr-3" size={16} />
            Projects
          </Button>
        </div>

        {/* Projects Section */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Active Projects
            </h3>
            <Button
              onClick={onAddProject}
              variant="ghost"
              size="sm"
              className="h-6 w-6 p-0 hover:bg-accent"
              data-testid="button-add-project"
            >
              <Plus size={14} />
            </Button>
          </div>
          
          <div className="space-y-1">
            {projects.map(project => (
              <div 
                key={project.id}
                className="flex items-center space-x-2 py-1.5 px-2 rounded-md hover:bg-accent cursor-pointer transition-colors group"
                onClick={() => onToggleProject(project.id)}
                data-testid={`project-item-${project.id}`}
              >
                <Checkbox
                  checked={project.active}
                  onCheckedChange={() => onToggleProject(project.id)}
                  className="w-4 h-4"
                  data-testid={`checkbox-project-${project.id}`}
                />
                <span className="text-sm text-sidebar-foreground group-hover:text-accent-foreground font-normal flex-1">
                  {project.name}
                </span>
              </div>
            ))}
            
            {projects.length === 0 && (
              <div className="text-xs text-muted-foreground py-2">
                No projects yet
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Collapsed State */}
      {isCollapsed && (
        <div className="p-3 flex flex-col items-center space-y-3">
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center">
            <User className="text-sidebar-foreground" size={16} />
          </div>
          <Button
            onClick={onAddProject}
            variant="ghost"
            size="sm"
            className="w-8 h-8 p-0 hover:bg-accent"
            data-testid="button-add-project-collapsed"
          >
            <Plus size={16} />
          </Button>
        </div>
      )}
    </aside>
  );
}
