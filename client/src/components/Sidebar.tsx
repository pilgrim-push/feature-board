import { User, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
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
    <aside className={`${isCollapsed ? 'w-12' : 'w-64'} gradient-surface border-r border-stripe-border-light flex-shrink-0 transition-all duration-300 relative backdrop-filter backdrop-blur-sm`}>
      {/* Stylish Toggle Button */}
      <Button
        onClick={() => setIsCollapsed(!isCollapsed)}
        variant="ghost"
        size="sm"
        className="absolute -right-3 top-4 z-10 w-7 h-7 glass-card border border-stripe-border-light rounded-full p-1 hover:bg-gradient-to-r hover:from-stripe-blue hover:to-stripe-purple hover:text-white shadow-lg hover-lift transition-all duration-200"
      >
        {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </Button>

      <div className={`p-6 ${isCollapsed ? 'hidden' : 'block'}`}>
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-r from-stripe-blue to-stripe-purple rounded-xl flex items-center justify-center shadow-lg hover-lift">
              <User className="text-white" size={18} />
            </div>
            <span className="text-stripe-text font-semibold text-lg">{userName}</span>
          </div>
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-stripe-text-muted uppercase tracking-wider bg-gradient-to-r from-stripe-blue to-stripe-purple bg-clip-text text-transparent">Projects</h3>
          
          {projects.map(project => (
            <div 
              key={project.id}
              className="flex items-center space-x-3 py-3 px-4 rounded-lg hover:bg-gradient-to-r hover:from-stripe-hover hover:to-stripe-blue-light/30 cursor-pointer transition-all duration-200 group hover-lift glass-card"
              onClick={() => onToggleProject(project.id)}
            >
              <Checkbox
                checked={project.active}
                onCheckedChange={() => onToggleProject(project.id)}
                className="w-4 h-4 text-stripe-blue border-stripe-border-light rounded focus:ring-stripe-blue focus:ring-2 hover-lift"
              />
              <span className="text-sm text-stripe-text group-hover:text-stripe-blue transition-colors font-medium">{project.name}</span>
            </div>
          ))}
          
          <Button
            onClick={onAddProject}
            variant="outline"
            className="w-full mt-6 px-4 py-3 border border-dashed border-stripe-border-light text-stripe-text-muted rounded-lg hover:border-stripe-blue hover:bg-gradient-to-r hover:from-stripe-blue hover:to-stripe-purple hover:text-white hover-lift transition-all duration-200 text-sm font-medium glass-surface"
          >
            <Plus className="mr-2" size={16} />
            Add Project
          </Button>
        </div>
      </div>

      {/* Enhanced Collapsed State */}
      {isCollapsed && (
        <div className="p-3 flex justify-center">
          <div className="w-8 h-8 bg-gradient-to-r from-stripe-blue to-stripe-purple rounded-xl flex items-center justify-center shadow-lg hover-lift">
            <User className="text-white" size={16} />
          </div>
        </div>
      )}
    </aside>
  );
}
