import { Save, Download, ChartGantt } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSaveProject: () => void;
  onExportChart: () => void;
}

export default function Header({ onSaveProject, onExportChart }: HeaderProps) {
  return (
    <header className="bg-white border-b border-wrike-border px-6 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ChartGantt className="text-wrike-blue text-xl" size={24} />
          <h1 className="text-xl font-semibold text-wrike-text">Gantt Chart Builder</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={onSaveProject}
            className="px-4 py-2 bg-wrike-blue text-white rounded hover:bg-wrike-blue-dark transition-colors duration-200 text-sm font-medium"
          >
            <Save className="mr-2" size={16} />
            Save Project
          </Button>
          <Button 
            onClick={onExportChart}
            variant="outline"
            className="px-4 py-2 border border-wrike-border text-wrike-text rounded hover:bg-wrike-hover transition-colors duration-200 text-sm font-medium"
          >
            <Download className="mr-2" size={16} />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
}
