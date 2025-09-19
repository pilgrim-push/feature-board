import { useState } from 'react';
import { AppState, NewTask, Project } from '@/types/gantt';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import GanttChart from '@/components/GanttChart';

export default function GanttChartPage() {
  const { state, saveState } = useLocalStorage();
  const { toast } = useToast();

  const handleSaveProject = () => {
    toast({
      title: "Project Saved",
      description: "Your project has been saved successfully to local storage.",
    });
  };

  const handleExportChart = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = 'gantt-chart-data.json';
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Chart Exported",
      description: "Your Gantt chart data has been exported successfully.",
    });
  };

  const handleToggleProject = (id: number) => {
    const updatedProjects = state.projects.map(project => 
      project.id === id 
        ? { ...project, active: !project.active }
        : project
    );
    saveState({ ...state, projects: updatedProjects });
  };

  const handleAddProject = () => {
    const projectName = prompt('Enter project name:');
    if (projectName?.trim()) {
      const newId = Math.max(0, ...state.projects.map(p => p.id)) + 1;
      const newProject: Project = {
        id: newId,
        name: projectName.trim(),
        active: true
      };
      const updatedProjects = [...state.projects, newProject];
      saveState({ ...state, projects: updatedProjects });
      
      toast({
        title: "Project Added",
        description: `Project "${projectName}" has been added successfully.`,
      });
    }
  };

  const handleUpdateTasks = (tasks: any[]) => {
    saveState({ ...state, tasks });
  };

  return (
    <div className="h-screen overflow-hidden bg-background font-sans text-foreground text-sm">
      <div className="animated-gradient h-1 absolute top-0 left-0 right-0 z-50"></div>
      <Header 
        onSaveProject={handleSaveProject}
        onExportChart={handleExportChart}
      />
      
      <div className="flex h-full">
        <Sidebar
          userName={state.user.name}
          projects={state.projects}
          onToggleProject={handleToggleProject}
          onAddProject={handleAddProject}
        />
        
        <div className="flex-1 bg-background overflow-hidden">
          <GanttChart
            tasks={state.tasks}
            onUpdateTasks={handleUpdateTasks}
          />
        </div>
      </div>
    </div>
  );
}
