import { useState } from 'react';
import { AppState, NewTask, Project } from '@/types/gantt';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';

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


  const handleUpdateTasks = (tasks: any[]) => {
    saveState({ ...state, tasks });
  };

  const handleUpdateFeatureColumns = (featureColumns: any[]) => {
    saveState({ ...state, featureColumns });
  };

  return (
    <div className="h-screen overflow-hidden bg-background font-sans text-foreground text-sm">
      <div className="animated-gradient h-1 absolute top-0 left-0 right-0 z-50"></div>
      <Header 
        onSaveProject={handleSaveProject}
        onExportChart={handleExportChart}
      />
      
      <div className="h-full bg-background overflow-hidden">
        <TabNavigation
          tasks={state.tasks}
          onUpdateTasks={handleUpdateTasks}
          featureColumns={state.featureColumns || []}
          onUpdateFeatureColumns={handleUpdateFeatureColumns}
        />
      </div>
    </div>
  );
}
