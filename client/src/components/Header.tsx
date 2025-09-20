import { Search, ChartGantt, HelpCircle, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface HeaderProps {
  onSaveProject: () => void;
  onExportChart: () => void;
}

export default function Header({ onSaveProject, onExportChart }: HeaderProps) {
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

        {/* Center - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            <Input
              placeholder="Поиск проекта..."
              className="pl-10 bg-input border-border text-foreground placeholder:text-muted-foreground text-sm h-9"
            />
          </div>
        </div>

        {/* Right side - Actions and Help */}
        <div className="flex items-center space-x-3">
          <Button 
            onClick={onSaveProject}
            variant="outline"
            size="sm"
            className="border-stripe-orange text-stripe-orange hover:bg-stripe-orange hover:text-white text-xs font-bold uppercase tracking-wide px-3 py-1.5 h-7"
            data-testid="button-save"
          >
            СОХРАНИТЬ
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
          <Button 
            variant="ghost"
            size="sm"
            className="text-sidebar-foreground hover:bg-accent text-xs font-medium px-3 py-1.5 h-7"
            data-testid="button-help"
          >
            <HelpCircle className="mr-1" size={14} />
            ПОМОЩЬ
          </Button>
        </div>
      </div>
    </header>
  );
}
