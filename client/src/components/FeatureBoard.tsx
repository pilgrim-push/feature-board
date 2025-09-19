import { useState } from 'react';
import { Plus, Eye, EyeOff, Calendar, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { FeatureColumn } from '@/types/gantt';

interface FeatureBoardProps {
  columns: FeatureColumn[];
  onUpdateColumns: (columns: FeatureColumn[]) => void;
}

export default function FeatureBoard({ columns = [], onUpdateColumns }: FeatureBoardProps) {
  const [showParking, setShowParking] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnDate, setNewColumnDate] = useState('');

  // Default columns if none exist
  const defaultColumns: FeatureColumn[] = [
    { id: 1, name: 'Marketplace 1.0', completionDate: '2025-01-15', isHidden: false, order: 1, isParking: false },
    { id: 2, name: 'Android 4.5 release', completionDate: '2025-02-28', isHidden: false, order: 2, isParking: false },
    { id: 3, name: 'Smart watch', completionDate: '2025-03-15', isHidden: false, order: 3, isParking: false },
    { id: 4, name: 'iOS 5.5', completionDate: '2025-04-01', isHidden: false, order: 4, isParking: false },
    { id: 999, name: 'Парковка', completionDate: undefined, isHidden: true, order: 999, isParking: true }
  ];

  const currentColumns = columns.length > 0 ? columns : defaultColumns;
  const visibleColumns = currentColumns
    .filter(col => col.isParking ? showParking : !col.isHidden)
    .sort((a, b) => a.order - b.order);

  const parkingColumn = currentColumns.find(col => col.isParking);
  const hasParkingColumn = !!parkingColumn;

  const handleCreateColumn = () => {
    if (!newColumnName.trim()) return;
    
    const newColumn: FeatureColumn = {
      id: Math.max(0, ...currentColumns.map(c => c.id)) + 1,
      name: newColumnName.trim(),
      completionDate: newColumnDate || undefined,
      isHidden: false,
      order: Math.max(0, ...currentColumns.filter(c => !c.isParking).map(c => c.order)) + 1,
      isParking: false
    };

    const updatedColumns = [...currentColumns, newColumn];
    if (columns.length === 0) {
      // If this is the first time, initialize with default columns plus new one
      onUpdateColumns([...defaultColumns, newColumn]);
    } else {
      onUpdateColumns(updatedColumns);
    }

    setNewColumnName('');
    setNewColumnDate('');
    setIsCreatingColumn(false);
  };

  const toggleParkingVisibility = () => {
    setShowParking(!showParking);
  };

  return (
    <div className="h-full bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-foreground">Features board</h2>
          
          {/* Toggle Parking Column */}
          {hasParkingColumn && (
            <Button
              variant="outline"
              size="sm"
              onClick={toggleParkingVisibility}
              className="flex items-center space-x-2"
              data-testid="button-toggle-parking"
            >
              {showParking ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>{showParking ? 'Скрыть парковку' : 'Показать парковку'}</span>
            </Button>
          )}
        </div>

        {/* Add Column Button */}
        <Dialog open={isCreatingColumn} onOpenChange={setIsCreatingColumn}>
          <DialogTrigger asChild>
            <Button 
              variant="default" 
              size="sm"
              className="flex items-center space-x-2"
              data-testid="button-add-column"
            >
              <Plus size={16} />
              <span>Add column</span>
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Создать новую колонку</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="column-name">Название колонки</Label>
                <Input
                  id="column-name"
                  value={newColumnName}
                  onChange={(e) => setNewColumnName(e.target.value)}
                  placeholder="Введите название колонки"
                  data-testid="input-column-name"
                />
              </div>
              <div>
                <Label htmlFor="column-date">Дата завершения (необязательно)</Label>
                <Input
                  id="column-date"
                  type="date"
                  value={newColumnDate}
                  onChange={(e) => setNewColumnDate(e.target.value)}
                  data-testid="input-column-date"
                />
              </div>
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setIsCreatingColumn(false)}
                  data-testid="button-cancel-column"
                >
                  Отмена
                </Button>
                <Button 
                  onClick={handleCreateColumn}
                  disabled={!newColumnName.trim()}
                  data-testid="button-create-column"
                >
                  Создать
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Columns */}
      <div className="flex space-x-4 overflow-x-auto pb-4">
        {visibleColumns.map((column) => (
          <div
            key={column.id}
            className="flex-shrink-0 w-80 bg-card border border-border rounded-lg p-4"
            data-testid={`column-${column.id}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-foreground text-lg mb-1" data-testid={`column-title-${column.id}`}>
                  {column.name}
                  {column.isParking && (
                    <span className="ml-2 text-xs bg-muted text-muted-foreground px-2 py-1 rounded">
                      Парковка
                    </span>
                  )}
                </h3>
                {column.completionDate && (
                  <div className="flex items-center text-sm text-muted-foreground">
                    <Calendar size={14} className="mr-1" />
                    <span data-testid={`column-date-${column.id}`}>
                      {new Date(column.completionDate).toLocaleDateString('ru-RU')}
                    </span>
                  </div>
                )}
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                data-testid={`column-menu-${column.id}`}
              >
                <MoreHorizontal size={16} />
              </Button>
            </div>

            {/* Column Content - Placeholder for future feature cards */}
            <div className="min-h-96 bg-muted/20 rounded-lg border-2 border-dashed border-muted-foreground/20 flex items-center justify-center">
              <p className="text-muted-foreground text-sm">
                Карточки фич будут добавлены позже
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}