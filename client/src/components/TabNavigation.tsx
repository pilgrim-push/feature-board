import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GanttChart from './GanttChart';
import FeatureBoard from './FeatureBoard';

interface TabNavigationProps {
  tasks: any[];
  onUpdateTasks: (tasks: any[]) => void;
}

export default function TabNavigation({ tasks, onUpdateTasks }: TabNavigationProps) {
  return (
    <div className="h-full bg-background">
      <Tabs defaultValue="gantt-project" className="h-full flex flex-col">
        <div className="border-b border-border bg-card px-6">
          <TabsList className="bg-transparent h-12 p-0 space-x-8">
            <TabsTrigger 
              value="gantt-project" 
              className="bg-transparent border-b-2 border-transparent data-[state=active]:border-stripe-blue data-[state=active]:bg-transparent rounded-none px-0 pb-3 text-sm font-medium data-[state=active]:shadow-none"
              data-testid="tab-gantt-project"
            >
              Gantt Project
            </TabsTrigger>
            <TabsTrigger 
              value="feature-board" 
              className="bg-transparent border-b-2 border-transparent data-[state=active]:border-stripe-blue data-[state=active]:bg-transparent rounded-none px-0 pb-3 text-sm font-medium data-[state=active]:shadow-none"
              data-testid="tab-feature-board"
            >
              Feature board
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="gantt-project" className="flex-1 overflow-hidden m-0">
          <GanttChart
            tasks={tasks}
            onUpdateTasks={onUpdateTasks}
          />
        </TabsContent>
        
        <TabsContent value="feature-board" className="flex-1 overflow-hidden m-0">
          <FeatureBoard />
        </TabsContent>
      </Tabs>
    </div>
  );
}