import { useState, useRef } from 'react';
import { AppState, NewTask } from '@/types/gantt';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import TabNavigation from '@/components/TabNavigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export default function GanttChartPage() {
  const { state, saveState } = useLocalStorage();
  const { toast } = useToast();
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importData, setImportData] = useState<AppState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSaveProject = () => {
    toast({
      title: "Project Saved",
      description: "Your project has been saved successfully to local storage.",
    });
  };

  const handleExportChart = () => {
    const dataStr = JSON.stringify(state, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
    
    const exportFileDefaultName = `gantt-chart-data_${Date.now()}.json`;
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    toast({
      title: "Диаграмма экспортирована",
      description: "Данные диаграммы Гантта успешно экспортированы.",
    });
  };

  const handleImportChart = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const data = JSON.parse(content);
        
        // Validate data structure
        if (!data || typeof data !== 'object') {
          throw new Error('Неверный формат файла');
        }
        
        // Check required fields
        if (!Array.isArray(data.tasks)) {
          throw new Error('Отсутствует поле tasks или оно не является массивом');
        }
        
        if (!Array.isArray(data.featureColumns)) {
          throw new Error('Отсутствует поле featureColumns или оно не является массивом');
        }
        
        if (!Array.isArray(data.featureCards)) {
          throw new Error('Отсутствует поле featureCards или оно не является массивом');
        }
        
        // Validate feature cards structure
        for (const card of data.featureCards) {
          if (!card.id || !card.title || !card.type || !card.columnId) {
            throw new Error('Некорректная структура карточек фич');
          }
        }
        
        setImportData(data);
        setShowImportConfirm(true);
      } catch (error) {
        toast({
          title: "Ошибка импорта",
          description: error instanceof Error ? error.message : "Не удалось прочитать файл",
          variant: "destructive",
        });
      }
    };
    
    reader.readAsText(file);
    // Reset input to allow selecting the same file again
    event.target.value = '';
  };

  const confirmImport = () => {
    if (importData) {
      saveState(importData);
      toast({
        title: "Данные импортированы",
        description: "Все данные успешно импортированы и заменили текущий контент.",
      });
    }
    setShowImportConfirm(false);
    setImportData(null);
  };

  const cancelImport = () => {
    setShowImportConfirm(false);
    setImportData(null);
  };

  const handleUpdateTasks = (tasks: any[]) => {
    saveState({ ...state, tasks });
  };

  const handleUpdateFeatureColumns = (featureColumns: any[]) => {
    saveState({ ...state, featureColumns });
  };

  const handleUpdateFeatureCards = (featureCards: any[]) => {
    saveState({ ...state, featureCards });
  };

  return (
    <div className="h-screen overflow-hidden bg-background font-sans text-foreground text-sm">
      <div className="animated-gradient h-1 absolute top-0 left-0 right-0 z-50"></div>
      <Header 
        onExportChart={handleExportChart}
        onImportChart={handleImportChart}
      />
      
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json"
        onChange={handleFileSelect}
        className="hidden"
        data-testid="input-import-file"
      />
      
      {/* Import confirmation dialog */}
      <AlertDialog open={showImportConfirm} onOpenChange={setShowImportConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердите импорт</AlertDialogTitle>
            <AlertDialogDescription>
              Это действие заменит все текущие данные импортированными данными. 
              Все текущие задачи, колонки и карточки фич будут удалены и заменены данными из файла.
              
              {importData && (
                <div className="mt-4 p-3 bg-muted rounded text-sm">
                  <div>Файл содержит:</div>
                  <ul className="mt-2 space-y-1">
                    <li>• Задач: {importData.tasks.length}</li>
                    <li>• Колонок фич: {importData.featureColumns.length}</li>
                    <li>• Карточек фич: {importData.featureCards.length}</li>
                  </ul>
                </div>
              )}
              
              Продолжить?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelImport} data-testid="button-cancel-import">
              Отмена
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmImport} data-testid="button-confirm-import">
              Импортировать
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      
      <div className="h-full bg-background overflow-hidden">
        <TabNavigation
          tasks={state.tasks}
          onUpdateTasks={handleUpdateTasks}
          featureColumns={state.featureColumns || []}
          featureCards={state.featureCards || []}
          onUpdateFeatureColumns={handleUpdateFeatureColumns}
          onUpdateFeatureCards={handleUpdateFeatureCards}
        />
      </div>
    </div>
  );
}