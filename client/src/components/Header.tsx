import { Save, Download, ChartGantt } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSaveProject: () => void;
  onExportChart: () => void;
}

export default function Header({ onSaveProject, onExportChart }: HeaderProps) {
  return (
    <header className="bg-spotify-sidebar border-b border-spotify-border px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <ChartGantt className="text-spotify-green text-xl" size={24} />
          <h1 className="text-xl font-bold text-spotify-text">Gantt Chart Builder</h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={onSaveProject}
            className="px-4 py-2 bg-spotify-green text-black rounded-full hover:bg-spotify-dark-green transition-all duration-200 text-sm font-bold hover:scale-105"
          >
            <Save className="mr-2" size={16} />
            Save Project
          </Button>
          <Button 
            onClick={onExportChart}
            variant="outline"
            className="px-4 py-2 border border-spotify-border text-spotify-text rounded-full hover:bg-spotify-hover transition-colors duration-200 text-sm font-medium"
          >
            <Download className="mr-2" size={16} />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
}
