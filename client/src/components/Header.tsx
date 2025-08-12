import { Save, Download, ChartGantt } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onSaveProject: () => void;
  onExportChart: () => void;
}

export default function Header({ onSaveProject, onExportChart }: HeaderProps) {
  return (
    <header className="gradient-surface border-b border-stripe-border-light px-6 py-4 shadow-lg backdrop-filter backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-r from-stripe-blue to-stripe-purple rounded-xl flex items-center justify-center shadow-lg hover-lift">
            <ChartGantt className="text-white" size={20} />
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-stripe-blue to-stripe-purple bg-clip-text text-transparent">
            Gantt Chart Builder
          </h1>
        </div>
        <div className="flex items-center space-x-3">
          <Button 
            onClick={onSaveProject}
            className="px-6 py-2.5 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600 text-white rounded-lg shadow-lg hover-lift transition-all duration-200 text-sm font-medium"
          >
            <Save className="mr-2" size={16} />
            Save Project
          </Button>
          <Button 
            onClick={onExportChart}
            variant="outline"
            className="px-6 py-2.5 border border-stripe-border-light text-stripe-text rounded-lg hover:bg-gradient-to-r hover:from-stripe-blue hover:to-stripe-purple hover:text-white hover-lift transition-all duration-200 text-sm font-medium glass-surface"
          >
            <Download className="mr-2" size={16} />
            Export
          </Button>
        </div>
      </div>
    </header>
  );
}
