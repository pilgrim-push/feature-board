import { ChartGantt, HelpCircle, Star, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  onExportChart: () => void;
  onImportChart: () => void;
}

export default function Header({ onExportChart, onImportChart }: HeaderProps) {
  return (
    <header className="bg-sidebar border-b border-stripe-border px-6 py-3 shadow-lg">
      <div className="flex items-center justify-between">
        {/* Left side - Project name/workspace */}
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 text-sidebar-foreground">
            <ChartGantt className="text-stripe-blue" size={20} />
            <span className="text-sm font-medium">
              <span className="text-sidebar-foreground">Планер</span> 
              <span className="text-muted-foreground ml-1">Продуктов</span>
            </span>
          </div>
        </div>


        {/* Right side - Actions and Help */}
        <div className="flex items-center space-x-3">
          <Button 
            onClick={onImportChart}
            variant="outline"
            size="sm" 
            className="border-border text-sidebar-foreground hover:bg-accent text-xs font-medium px-3 py-1.5 h-7"
            data-testid="button-import"
          >
            <Upload className="w-3 h-3 mr-1" />
            ИМПОРТ
          </Button>
          <Button 
            onClick={onExportChart}
            variant="outline"
            size="sm" 
            className="border-border text-sidebar-foreground hover:bg-accent text-xs font-medium px-3 py-1.5 h-7"
            data-testid="button-export"
          >
            ЭКСПОРТ
          </Button>
        </div>
      </div>
    </header>
  );
}
