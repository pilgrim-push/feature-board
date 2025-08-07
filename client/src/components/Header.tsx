import { Save, Download, ChartGantt } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSaveProject: () => void;
  onExportChart: () => void;
}

export default function Header({ onSaveProject, onExportChart }: HeaderProps) {
  return (
    <header className="bg-white border-b border-neutral-30 px-6 py-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ChartGantt className="text-azure-blue text-xl" size={24} />
          <h1 className="text-xl font-semibold text-neutral-90">Gantt Chart Builder</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={onSaveProject}
            className="px-4 py-2 bg-azure-blue text-white rounded-sm hover:bg-azure-blue-dark transition-colors duration-200 text-sm font-medium"
          >
            <Save className="mr-2" size={16} />
            Save Project
          </Button>
          <Button 
            onClick={onExportChart}
            variant="outline"
            className="px-4 py-2 border border-neutral-30 text-neutral-90 rounded-sm hover:bg-neutral-20 transition-colors duration-200 text-sm font-medium"
          >
            <Download className="mr-2" size={16} />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
}
