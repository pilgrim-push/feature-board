import { useState } from 'react';
import { Plus, Eye, EyeOff, Calendar, MoreHorizontal, ChevronLeft, ChevronRight, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
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
  const [editingColumn, setEditingColumn] = useState<FeatureColumn | null>(null);
  const [editColumnName, setEditColumnName] = useState('');
  const [editColumnDate, setEditColumnDate] = useState('');
  const [deletingColumn, setDeletingColumn] = useState<FeatureColumn | null>(null);

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

  const handleEditColumn = (column: FeatureColumn) => {
    setEditingColumn(column);
    setEditColumnName(column.name);
    setEditColumnDate(column.completionDate || '');
  };

  const handleSaveEdit = () => {
    if (!editingColumn || !editColumnName.trim()) return;
    
    const updatedColumns = currentColumns.map(col => 
      col.id === editingColumn.id 
        ? { ...col, name: editColumnName.trim(), completionDate: editColumnDate || undefined }
        : col
    );
    
    onUpdateColumns(updatedColumns);
    setEditingColumn(null);
    setEditColumnName('');
    setEditColumnDate('');
  };

  const handleDeleteColumn = (column: FeatureColumn) => {
    setDeletingColumn(column);
  };

  const confirmDeleteColumn = () => {
    if (!deletingColumn) return;
    
    const updatedColumns = currentColumns.filter(col => col.id !== deletingColumn.id);
    onUpdateColumns(updatedColumns);
    setDeletingColumn(null);
  };

  const moveColumnLeft = (columnId: number) => {
    const nonParkingColumns = currentColumns
      .filter(col => !col.isParking)
      .sort((a, b) => a.order - b.order);
    
    const currentIndex = nonParkingColumns.findIndex(col => col.id === columnId);
    if (currentIndex <= 0) return; // Can't move leftmost column further left
    
    const currentColumn = nonParkingColumns[currentIndex];
    const leftColumn = nonParkingColumns[currentIndex - 1];
    
    // Swap order values
    const updatedColumns = currentColumns.map(col => {
      if (col.id === currentColumn.id) {
        return { ...col, order: leftColumn.order };
      }
      if (col.id === leftColumn.id) {
        return { ...col, order: currentColumn.order };
      }
      return col;
    });
    
    onUpdateColumns(updatedColumns);
  };

  const moveColumnRight = (columnId: number) => {
    const nonParkingColumns = currentColumns
      .filter(col => !col.isParking)
      .sort((a, b) => a.order - b.order);
    
    const currentIndex = nonParkingColumns.findIndex(col => col.id === columnId);
    if (currentIndex >= nonParkingColumns.length - 1) return; // Can't move rightmost column further right
    
    const currentColumn = nonParkingColumns[currentIndex];
    const rightColumn = nonParkingColumns[currentIndex + 1];
    
    // Swap order values
    const updatedColumns = currentColumns.map(col => {
      if (col.id === currentColumn.id) {
        return { ...col, order: rightColumn.order };
      }
      if (col.id === rightColumn.id) {
        return { ...col, order: currentColumn.order };
      }
      return col;
    });
    
    onUpdateColumns(updatedColumns);
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
              
              <div className="flex items-center space-x-1">
                {/* Reordering Arrows - Only show for non-parking columns */}
                {!column.isParking && (
                  <>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => moveColumnLeft(column.id)}
                      disabled={(() => {
                        const nonParkingColumns = currentColumns
                          .filter(col => !col.isParking)
                          .sort((a, b) => a.order - b.order);
                        return nonParkingColumns.findIndex(col => col.id === column.id) === 0;
                      })()}
                      data-testid={`button-move-left-${column.id}`}
                    >
                      <ChevronLeft size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                      onClick={() => moveColumnRight(column.id)}
                      disabled={(() => {
                        const nonParkingColumns = currentColumns
                          .filter(col => !col.isParking)
                          .sort((a, b) => a.order - b.order);
                        return nonParkingColumns.findIndex(col => col.id === column.id) === nonParkingColumns.length - 1;
                      })()}
                      data-testid={`button-move-right-${column.id}`}
                    >
                      <ChevronRight size={16} />
                    </Button>
                  </>
                )}
                
                {/* Menu Button - Only show for non-parking columns */}
                {!column.isParking && (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        data-testid={`column-menu-${column.id}`}
                      >
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleEditColumn(column)}
                        className="flex items-center space-x-2"
                        data-testid={`menu-edit-${column.id}`}
                      >
                        <Edit size={16} />
                        <span>Редактировать</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleDeleteColumn(column)}
                        className="flex items-center space-x-2 text-destructive focus:text-destructive"
                        data-testid={`menu-delete-${column.id}`}
                      >
                        <Trash2 size={16} />
                        <span>Удалить</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </div>
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

      {/* Edit Column Dialog */}
      <Dialog open={!!editingColumn} onOpenChange={(open) => !open && setEditingColumn(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Редактировать колонку</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="edit-column-name">Название колонки</Label>
              <Input
                id="edit-column-name"
                value={editColumnName}
                onChange={(e) => setEditColumnName(e.target.value)}
                placeholder="Введите название колонки"
                data-testid="input-edit-column-name"
              />
            </div>
            <div>
              <Label htmlFor="edit-column-date">Дата завершения (необязательно)</Label>
              <Input
                id="edit-column-date"
                type="date"
                value={editColumnDate}
                onChange={(e) => setEditColumnDate(e.target.value)}
                data-testid="input-edit-column-date"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => setEditingColumn(null)}
                data-testid="button-cancel-edit"
              >
                Отмена
              </Button>
              <Button 
                onClick={handleSaveEdit}
                disabled={!editColumnName.trim()}
                data-testid="button-save-edit"
              >
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deletingColumn} onOpenChange={(open) => !open && setDeletingColumn(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Подтвердите удаление</AlertDialogTitle>
            <AlertDialogDescription>
              Вы уверены, что хотите удалить колонку "{deletingColumn?.name}"?
              Это действие нельзя отменить.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Отмена</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteColumn}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}