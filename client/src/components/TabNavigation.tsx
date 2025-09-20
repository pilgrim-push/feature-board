import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FeatureColumn, FeatureCard } from '@/types/gantt';
import GanttChart from './GanttChart';
import FeatureBoard from './FeatureBoard';

interface TabNavigationProps {
  tasks: any[];
  onUpdateTasks: (tasks: any[]) => void;
  featureColumns: FeatureColumn[];
  featureCards: FeatureCard[];
  onUpdateFeatureColumns: (columns: FeatureColumn[]) => void;
  onUpdateFeatureCards: (cards: FeatureCard[]) => void;
}

export default function TabNavigation({ tasks, onUpdateTasks, featureColumns, featureCards, onUpdateFeatureColumns, onUpdateFeatureCards }: TabNavigationProps) {
  return (
    <div className="h-full bg-background">
      <Tabs defaultValue="feature-board" className="h-full flex flex-col">
        <div className="border-b border-border bg-card px-6">
          <TabsList className="bg-transparent h-12 p-0 space-x-8">
            <TabsTrigger 
              value="gantt-project" 
              className="bg-transparent border-b-2 border-transparent data-[state=active]:border-stripe-blue data-[state=active]:bg-transparent rounded-none px-0 pb-3 text-sm font-medium data-[state=active]:shadow-none"
              data-testid="tab-gantt-project"
            >
              Диаграмма Ганта
            </TabsTrigger>
            <TabsTrigger 
              value="feature-board" 
              className="bg-transparent border-b-2 border-transparent data-[state=active]:border-stripe-blue data-[state=active]:bg-transparent rounded-none px-0 pb-3 text-sm font-medium data-[state=active]:shadow-none"
              data-testid="tab-feature-board"
            >
              Доска функций
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
          <FeatureBoard 
            columns={featureColumns}
            cards={featureCards}
            onUpdateColumns={onUpdateFeatureColumns}
            onUpdateCards={onUpdateFeatureCards}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}