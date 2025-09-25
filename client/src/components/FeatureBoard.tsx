import React, { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, DropResult } from 'react-beautiful-dnd';
import { Plus, Eye, EyeOff, Calendar as CalendarIcon, MoreHorizontal, ChevronLeft, ChevronRight, Edit, Trash2, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { FeatureColumn, FeatureCard, FeatureCardType, FeatureCardStatus, UserStory } from '@/types/gantt';
import FeatureCardComponent from './FeatureCard';
import UserStoriesManager from './UserStoriesManager';

interface FeatureBoardProps {
  columns: FeatureColumn[];
  cards: FeatureCard[];
  onUpdateColumns: (columns: FeatureColumn[]) => void;
  onUpdateCards: (cards: FeatureCard[]) => void;
}

export default function FeatureBoard({ columns = [], cards = [], onUpdateColumns, onUpdateCards }: FeatureBoardProps) {
  const [showParking, setShowParking] = useState(false);
  const [isCreatingColumn, setIsCreatingColumn] = useState(false);
  const [newColumnName, setNewColumnName] = useState('');
  const [newColumnDate, setNewColumnDate] = useState('');
  const [editingColumn, setEditingColumn] = useState<FeatureColumn | null>(null);
  const [editColumnName, setEditColumnName] = useState('');
  const [editColumnDate, setEditColumnDate] = useState('');
  const [deletingColumn, setDeletingColumn] = useState<FeatureColumn | null>(null);
  const [creatingCardForColumn, setCreatingCardForColumn] = useState<number | null>(null);
  const [editingCard, setEditingCard] = useState<FeatureCard | null>(null);
  const [cardTitle, setCardTitle] = useState('');
  const [cardType, setCardType] = useState<'new' | 'analytics' | 'bugfix' | 'improvement' | 'development' | ''>('');
  const [cardDescription, setCardDescription] = useState('');
  const [cardTags, setCardTags] = useState('');
  const [externalLink, setExternalLink] = useState('');
  const [cardColumnId, setCardColumnId] = useState<number | null>(null);
  const [cardDeadline, setCardDeadline] = useState<Date | undefined>(undefined);
  const [cardStartDate, setCardStartDate] = useState<Date | undefined>(undefined);
  const [cardDuration, setCardDuration] = useState<number>(0);
  const [cardStatus, setCardStatus] = useState<FeatureCardStatus>('backlog');
  const [cardUserStories, setCardUserStories] = useState<UserStory[]>([]);
  const { toast } = useToast();
  const deletedCardsRef = useRef<Map<number, FeatureCard>>(new Map());

  // Tag colors management
  const [tagColors, setTagColors] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('feature-board-tag-colors');
    return saved ? JSON.parse(saved) : {};
  });

  // Update localStorage when tag colors change
  useEffect(() => {
    localStorage.setItem('feature-board-tag-colors', JSON.stringify(tagColors));
  }, [tagColors]);

  // Generate color for a tag (will be saved to localStorage via useEffect)
  const getOrCreateTagColor = (tag: string): string => {
    if (tagColors[tag]) {
      return tagColors[tag];
    }
    
    // Generate a consistent color based on tag name
    const colors = [
      'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-blue-200',
      'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300 border-green-200', 
      'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300 border-yellow-200',
      'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300 border-purple-200',
      'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-300 border-pink-200',
      'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300 border-indigo-200',
      'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300 border-red-200',
      'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300 border-orange-200',
    ];
    
    // Use tag name hash to consistently pick a color
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
      hash = ((hash << 5) - hash + tag.charCodeAt(i)) & 0xffffffff;
    }
    const color = colors[Math.abs(hash) % colors.length];
    
    return color;
  };

  // Format date to DD/MM/YY
  const formatDateToDisplay = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Reset form when modal closes
  const resetCardForm = () => {
    setCardTitle('');
    setCardType('');
    setCardDescription('');
    setCardTags('');
    setCardColumnId(null);
    setCardDeadline(undefined);
    setCardStartDate(undefined);
    setCardDuration(0);
    setCardStatus('backlog');
    setCardUserStories([]);
  };

  // Handle edit card
  const handleEditCard = (card: FeatureCard) => {
    setEditingCard(card);
    setCardTitle(card.title);
    setCardType(card.type);
    setCardDescription(card.description);
    setExternalLink(card.externalLink || '')
    setCardTags(card.tags.join(', '));
    setCardColumnId(card.columnId);
    setCardStatus(card.status || 'backlog');
    setCardUserStories(card.userStories || []);
    setCardDuration(card.duration || 0);
    // Parse deadline string back to Date if it exists
    if (card.deadline) {
      const [day, month, year] = card.deadline.split('/');
      const fullYear = parseInt(`20${year}`);
      setCardDeadline(new Date(fullYear, parseInt(month) - 1, parseInt(day)));
    } else {
      setCardDeadline(undefined);
    }
     // Parse startdate string back to Date if it exists
      if (card.startDate) {
        const [day, month, year] = card.startDate.split('/');
        const fullYear = parseInt(`20${year}`);
        setCardStartDate(new Date(fullYear, parseInt(month) - 1, parseInt(day)));
      } else {
        setCardStartDate(undefined);
      }
  };

  // Handle save card changes
  const handleSaveCardChanges = () => {
    if (!editingCard || !cardTitle.trim() || !cardType || cardColumnId === null) {
      return;
    }

    // Parse tags from comma-separated string
    const parsedTags = cardTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // Generate and save colors for new tags
    const newTagColors = { ...tagColors };
    let hasNewColors = false;
    parsedTags.forEach(tag => {
      if (!newTagColors[tag]) {
        newTagColors[tag] = getOrCreateTagColor(tag);
        hasNewColors = true;
      }
    });
    if (hasNewColors) {
      setTagColors(newTagColors);
    }

    // Update the card
    const updatedCard: FeatureCard = {
      ...editingCard,
      title: cardTitle.trim(),
      type: cardType as FeatureCardType,
      description: cardDescription.trim(),
      tags: parsedTags,
      columnId: cardColumnId,
      // Keep original order if staying in same column, otherwise put at end
      order: cardColumnId === editingCard.columnId ? editingCard.order : currentCards.filter(c => c.columnId === cardColumnId).length,
      deadline: cardDeadline ? formatDateToDisplay(cardDeadline) : undefined,
      startDate: cardStartDate ? formatDateToDisplay(cardStartDate) : undefined,
      externalLink: externalLink,
      duration: cardDuration,
      status: cardStatus,
      userStories: cardUserStories
    };

    // Update cards list and normalize
    const updatedCards = currentCards.map(card => 
      card.id === editingCard.id ? updatedCard : card
    );
    const normalizedCards = normalizeCards(updatedCards);
    onUpdateCards(normalizedCards);

    // Reset form and close modal
    resetCardForm();
    setEditingCard(null);

    toast({
      title: "Карточка обновлена",
      description: `"${updatedCard.title}" успешно изменена`,
    });
  };

  // Handle create card
  const handleCreateCard = () => {
    if (!cardTitle.trim() || !cardType || creatingCardForColumn === null) {
      return;
    }

    // Parse tags from comma-separated string
    const parsedTags = cardTags
      .split(',')
      .map(tag => tag.trim())
      .filter(tag => tag.length > 0);

    // Generate and save colors for new tags
    const newTagColors = { ...tagColors };
    let hasNewColors = false;
    parsedTags.forEach(tag => {
      if (!newTagColors[tag]) {
        newTagColors[tag] = getOrCreateTagColor(tag);
        hasNewColors = true;
      }
    });
    if (hasNewColors) {
      setTagColors(newTagColors);
    }

    // Get current cards in the target column for ordering
    const columnCards = currentCards.filter(card => card.columnId === creatingCardForColumn);
    const newOrder = columnCards.length;

    // Create new card
    const newCard: FeatureCard = {
      id: Date.now(), // Simple ID generation
      title: cardTitle.trim(),
      type: cardType as FeatureCardType,
      description: cardDescription.trim(),
      tags: parsedTags,
      columnId: creatingCardForColumn,
      order: newOrder, 
      externalLink: externalLink,
      startDate: cardStartDate ? formatDateToDisplay(cardStartDate) : undefined,
      deadline: cardDeadline ? formatDateToDisplay(cardDeadline) : undefined,
      duration: cardDuration,
      status: cardStatus,
      userStories: []
    };

    // Add card to the list and normalize
    const updatedCards = [...currentCards, newCard];
    const normalizedCards = normalizeCards(updatedCards);
    onUpdateCards(normalizedCards);

    // Reset form and close modal
    resetCardForm();
    setCreatingCardForColumn(null);

    toast({
      title: "Карточка создана",
      description: `"${newCard.title}" добавлена в колонку`,
    });
  };

  // Normalize cards to remove duplicates and fix ordering
  const normalizeCards = (cards: FeatureCard[]): FeatureCard[] => {
    // Remove duplicates, keeping last occurrence
    const uniqueCards = cards.reduce((acc, card) => {
      acc.set(card.id, card);
      return acc;
    }, new Map<number, FeatureCard>());
    
    // Group by column and normalize order within each column
    const cardsByColumn = new Map<number, FeatureCard[]>();
    Array.from(uniqueCards.values()).forEach(card => {
      if (!cardsByColumn.has(card.columnId)) {
        cardsByColumn.set(card.columnId, []);
      }
      cardsByColumn.get(card.columnId)!.push(card);
    });
    
    // Normalize order within each column
    const normalizedCards: FeatureCard[] = [];
    cardsByColumn.forEach((columnCards, columnId) => {
      columnCards
        .sort((a, b) => a.order - b.order)
        .forEach((card, index) => {
          normalizedCards.push({ ...card, order: index });
        });
    });
    
    return normalizedCards;
  };

  // Default columns if none exist
  const defaultColumns: FeatureColumn[] = [
    { id: 1, name: 'Marketplace 1.0', completionDate: '2025-01-15', isHidden: false, order: 1, isParking: false, cards: [] },
    { id: 2, name: 'Android 4.5 release', completionDate: '2025-02-28', isHidden: false, order: 2, isParking: false, cards: [] },
    { id: 3, name: 'Smart watch', completionDate: '2025-03-15', isHidden: false, order: 3, isParking: false, cards: [] },
    { id: 4, name: 'iOS 5.5', completionDate: '2025-04-01', isHidden: false, order: 4, isParking: false, cards: [] },
    { id: 999, name: 'Парковка', completionDate: undefined, isHidden: true, order: 999, isParking: true, cards: [] }
  ];

  // Default cards if none exist
  const defaultCards: FeatureCard[] = [
    {
      id: 1,
      title: 'Пользовательская аутентификация',
      type: 'new',
      description: 'Реализация системы входа и регистрации пользователей с поддержкой OAuth',
      tags: ['frontend', 'backend', 'security'],
      duration: 5,
      columnId: 1,
      externalLink: 'https://example.com',
      order: 1,
      status: 'analytics',
      userStories: []
    },
    {
      id: 2,
      title: 'Аналитика клиентского поведения',
      type: 'analytics',
      description: 'Внедрение трекинга пользовательских действий для улучшения UX',
      tags: ['analytics', 'ux'],
      duration: 5,
      columnId: 1,
      externalLink: 'https://example.com',
      order: 2,
      status: 'development',
      userStories: []
    },
    {
      id: 3,
      title: 'Исправление багов корзины',
      type: 'bugfix',
      description: 'Устранение проблем с калькуляцией общей стоимости товаров',
      tags: ['bugfix', 'critical'],
      duration: 5,
      columnId: 2,
      externalLink: 'https://example.com',
      order: 1,
      status: 'backlog',
      userStories: []
    },
    {
      id: 4,
      title: 'Оптимизация производительности',
      type: 'improvement',
      description: 'Ускорение загрузки страниц и оптимизация запросов к базе данных',
      tags: ['performance', 'backend'],
      duration: 5,
      columnId: 3,
      externalLink: 'https://example.com',
      order: 1,
      status: 'postponed',
      userStories: []
    },
    {
      id: 5,
      title: 'Мобильная адаптация',
      type: 'development',
      description: 'Разработка адаптивного дизайна для мобильных устройств',
      tags: ['mobile', 'responsive', 'css'],
      duration: 5,
      columnId: 4,
      externalLink: 'https://example.com',
      order: 1,
      status: 'analytics',
      userStories: []
    }
  ];

  const currentColumns = columns.length > 0 ? columns : defaultColumns;
  const currentCards = cards.length > 0 ? cards : defaultCards;
  
  // Initialize with default data if none exists
  useEffect(() => {
    if (columns.length === 0) {
      onUpdateColumns(defaultColumns);
    }
    if (cards.length === 0) {
      onUpdateCards(defaultCards);
    }
  }, [columns.length, cards.length, onUpdateColumns, onUpdateCards]);
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
      isParking: false,
      cards: []
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

  // Handle drag and drop
  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;
    
    if (!destination) return;
    
    // If dropped in same position
    if (destination.droppableId === source.droppableId && destination.index === source.index) {
      return;
    }
    
    const cardId = parseInt(draggableId.replace('card-', ''));
    const sourceColumnId = parseInt(source.droppableId.replace('column-', ''));
    const destColumnId = parseInt(destination.droppableId.replace('column-', ''));
    
    // Remove all occurrences of the dragged card to prevent duplicates
    let updatedCards = currentCards.filter(card => card.id !== cardId);
    
    // Find the original card data
    const originalCard = currentCards.find(card => card.id === cardId);
    if (!originalCard) return;
    
    // Create updated card with new column
    const movedCard = { ...originalCard, columnId: destColumnId, order: destination.index };
    
    // Add the moved card back
    updatedCards.push(movedCard);
    
    // Normalize all cards to fix duplicates and ordering
    const normalizedCards = normalizeCards(updatedCards);
    onUpdateCards(normalizedCards);
  };

  // Handle card deletion with undo functionality
  const handleDeleteCard = (cardId: number) => {
    const cardToDelete = currentCards.find(card => card.id === cardId);
    if (!cardToDelete) return;

    // Store deleted card for potential undo
    deletedCardsRef.current.set(cardId, cardToDelete);

    // Remove the card from the list and normalize
    const updatedCards = currentCards.filter(card => card.id !== cardId);
    const normalizedCards = normalizeCards(updatedCards);
    onUpdateCards(normalizedCards);
    
    // Show toast with undo functionality
    toast({
      title: "Карточка удалена",
      description: `"${cardToDelete.title}" была удалена`,
      duration: 10000, // 10 seconds to allow undo
      action: (
        <Button
          variant="outline" 
          size="sm"
          onClick={() => handleUndoDeleteCard(cardId)}
          data-testid="button-undo-delete"
        >
          Отменить
        </Button>
      ),
    });
    
    // Clean up after toast duration
    setTimeout(() => {
      deletedCardsRef.current.delete(cardId);
    }, 11000);
  };

  // Handle undo card deletion
  const handleUndoDeleteCard = (cardId: number) => {
    const cardToRestore = deletedCardsRef.current.get(cardId);
    if (!cardToRestore) {
      console.warn('Deleted card not found:', cardId);
      return;
    }
    
    // Remove any existing duplicates and add restored card
    const cleanedCards = currentCards.filter(card => card.id !== cardId);
    const updatedCards = [...cleanedCards, cardToRestore];
    
    // Normalize cards to fix ordering and any remaining duplicates
    const normalizedCards = normalizeCards(updatedCards);
    onUpdateCards(normalizedCards);
    
    // Remove from deleted cards tracking
    deletedCardsRef.current.delete(cardId);
    
    toast({
      title: "Удаление отменено",
      description: `"${cardToRestore.title}" восстановлена`,
    });
  };

  // Get cards for a specific column
  const getColumnCards = (columnId: number): FeatureCard[] => {
    return currentCards
      .filter(card => card.columnId === columnId)
      .sort((a, b) => a.order - b.order);
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
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className="h-full bg-background p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h2 className="text-2xl font-semibold text-foreground">Доска функций</h2>
          
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
              <span>Добавить колонку</span>
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
                    <CalendarIcon size={14} className="mr-1" />
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

            {/* Column Content - Feature Cards */}
            <Droppable droppableId={`column-${column.id}`}>
              {(provided, snapshot) => {
                const columnCards = getColumnCards(column.id);
                return (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`
                      min-h-96 rounded-lg p-2 transition-colors duration-200
                      ${snapshot.isDraggingOver ? 'bg-accent/50' : 'bg-muted/10'}
                    `}
                  >
                    {columnCards.length > 0 ? (
                      columnCards.map((card, index) => (
                        <FeatureCardComponent 
                          key={card.id} 
                          card={card} 
                          index={index}
                          onDelete={handleDeleteCard}
                          onEdit={handleEditCard}
                          getTagColor={getOrCreateTagColor}
                        />
                      ))
                    ) : (
                      <div className="flex items-center justify-center h-32 border-2 border-dashed border-muted-foreground/20 rounded-lg">
                        <p className="text-muted-foreground text-sm">
                          Перетащите карточки сюда
                        </p>
                      </div>
                    )}
                    {provided.placeholder}
                  </div>
                );
              }}
            </Droppable>
            
            {/* Add Card Button */}
            <Button
              variant="outline"
              className="w-full mt-2 border-dashed border-2 hover:bg-accent/50 transition-colors"
              onClick={() => setCreatingCardForColumn(column.id)}
              data-testid={`button-add-card-${column.id}`}
            >
              <Plus size={16} className="mr-2" />
              Добавить карточку
            </Button>
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

      {/* Create Card Dialog */}
      <Dialog 
        open={!!creatingCardForColumn} 
        onOpenChange={(open) => {
          if (!open) {
            resetCardForm();
            setCreatingCardForColumn(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Создать новую карточку</DialogTitle>
            <DialogDescription>
              Заполните информацию о новой карточке функции
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Card Title */}
            <div>
              <Label htmlFor="card-title">Название *</Label>
              <Input
                id="card-title"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="Введите название карточки"
                data-testid="input-card-title"
              />
            </div>

            {/* Card Type */}
            <div>
              <Label htmlFor="card-type">Тип *</Label>
              <Select value={cardType} onValueChange={(value) => setCardType(value as FeatureCardType | '')}>
                <SelectTrigger data-testid="select-card-type">
                  <SelectValue placeholder="Выберите тип карточки" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Новая</SelectItem>
                  <SelectItem value="analytics">Аналитика</SelectItem>
                  <SelectItem value="bugfix">Баг-фикс</SelectItem>
                  <SelectItem value="improvement">Улучшение</SelectItem>
                  <SelectItem value="development">Разработка</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Card Description */}
            <div>
              <Label htmlFor="card-description">Описание</Label>
              <Textarea
                id="card-description"
                value={cardDescription}
                onChange={(e) => setCardDescription(e.target.value)}
                placeholder="Введите описание карточки"
                rows={3}
                data-testid="textarea-card-description"
              />
            </div>

            {/* Card Status */}
            <div>
              <Label htmlFor="card-status">Статус *</Label>
              <Select value={cardStatus} onValueChange={(value) => setCardStatus(value as FeatureCardStatus)}>
                <SelectTrigger data-testid="select-card-status">
                  <SelectValue placeholder="Выберите статус карточки" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analytics">Аналитика</SelectItem>
                  <SelectItem value="development">В разработке</SelectItem>
                  <SelectItem value="backlog">Бэклог</SelectItem>
                  <SelectItem value="postponed">Отложена</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Card Deadline */}
            <div>
              <Label htmlFor="card-deadline">Срок</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !cardDeadline && "text-muted-foreground"
                    }`}
                    data-testid="button-card-deadline"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {cardDeadline ? formatDateToDisplay(cardDeadline) : "Выбрать дату"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={cardDeadline}
                    onSelect={setCardDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Card StartDate */}
            <div>
              <Label htmlFor="card-startdate">Дата начала</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !cardStartDate && "text-muted-foreground"
                    }`}
                    data-testid="button-card-deadline"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {cardStartDate ? formatDateToDisplay(cardStartDate) : "Выбрать дату"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={cardStartDate}
                    onSelect={setCardStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Card Duration */}
            <div>
              <Label htmlFor="card-duration">Продолжительность</Label>
              <Input
                id="card-duration"
                type="number" // ← важно!
                value={cardDuration ?? ''} // ← null → пустая строка для input
                onChange={(e) => {
                  const val = e.target.value;
                  if (val === '') {
                    setCardDuration(0);
                  } else {
                    setCardDuration(Number(val));
                  }
                }}
                placeholder="Введите продолжительность работ"
                data-testid="input-card-duration"
              />
            </div>

            {/* Card Tags */}
            <div>
              <Label htmlFor="card-tags">Теги</Label>
              <Input
                id="card-tags"
                value={cardTags}
                onChange={(e) => setCardTags(e.target.value)}
                placeholder="Введите теги через запятую: фронт, бэк, дизайн"
                data-testid="input-card-tags"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Одинаковые теги будут иметь одинаковые цвета
              </p>
            </div>

            {/* Card External Link */}
            <div>
              <Label htmlFor="card-description">Ссылка</Label>
              <Textarea
                id="card-description"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                placeholder="Введите ссылку на задачу"
                rows={1}
                data-testid="textarea-card-description"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  resetCardForm();
                  setCreatingCardForColumn(null);
                }}
                data-testid="button-cancel-create-card"
              >
                Отмена
              </Button>
              <Button 
                onClick={handleCreateCard}
                disabled={!cardTitle.trim() || !cardType}
                data-testid="button-create-card"
              >
                Создать
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Card Dialog */}
      <Dialog 
        open={!!editingCard} 
        onOpenChange={(open) => {
          if (!open) {
            resetCardForm();
            setEditingCard(null);
          }
        }}
      >
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать карточку</DialogTitle>
            <DialogDescription>
              Измените информацию о карточке функции
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Card Title */}
            <div>
              <Label htmlFor="edit-card-title">Название *</Label>
              <Input
                id="edit-card-title"
                value={cardTitle}
                onChange={(e) => setCardTitle(e.target.value)}
                placeholder="Введите название карточки"
                data-testid="input-edit-card-title"
              />
            </div>

            {/* Card Type */}
            <div>
              <Label htmlFor="edit-card-type">Тип *</Label>
              <Select value={cardType} onValueChange={(value) => setCardType(value as FeatureCardType | '')}>
                <SelectTrigger data-testid="select-edit-card-type">
                  <SelectValue placeholder="Выберите тип карточки" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">Новая</SelectItem>
                  <SelectItem value="analytics">Аналитика</SelectItem>
                  <SelectItem value="bugfix">Баг-фикс</SelectItem>
                  <SelectItem value="improvement">Улучшение</SelectItem>
                  <SelectItem value="development">Разработка</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Card Column */}
            <div>
              <Label htmlFor="edit-card-column">Колонка *</Label>
              <Select 
                value={cardColumnId?.toString() || ''} 
                onValueChange={(value) => setCardColumnId(parseInt(value))}
              >
                <SelectTrigger data-testid="select-edit-card-column">
                  <SelectValue placeholder="Выберите колонку" />
                </SelectTrigger>
                <SelectContent>
                  {currentColumns.filter(col => !col.isParking).map(column => (
                    <SelectItem key={column.id} value={column.id.toString()}>
                      {column.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Card Status */}
            <div>
              <Label htmlFor="edit-card-status">Статус *</Label>
              <Select value={cardStatus} onValueChange={(value) => setCardStatus(value as FeatureCardStatus)}>
                <SelectTrigger data-testid="select-edit-card-status">
                  <SelectValue placeholder="Выберите статус карточки" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="analytics">Аналитика</SelectItem>
                  <SelectItem value="development">В разработке</SelectItem>
                  <SelectItem value="backlog">Бэклог</SelectItem>
                  <SelectItem value="postponed">Отложена</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Card Deadline */}
            <div>
              <Label htmlFor="edit-card-deadline">Срок</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !cardDeadline && "text-muted-foreground"
                    }`}
                    data-testid="button-edit-card-deadline"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {cardDeadline ? formatDateToDisplay(cardDeadline) : "Выбрать дату"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={cardDeadline}
                    onSelect={setCardDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

             {/* Card StartDate */}
              <div>
                <Label htmlFor="card-startdate">Дата начала</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={`w-full justify-start text-left font-normal ${
                        !cardStartDate && "text-muted-foreground"
                      }`}
                      data-testid="button-card-deadline"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {cardStartDate ? formatDateToDisplay(cardStartDate) : "Выбрать дату"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={cardStartDate}
                      onSelect={setCardStartDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Card Duration */}
              <div>
                <Label htmlFor="card-duration">Продолжительность</Label>
                <Input
                  id="card-duration"
                  type="number" // ← важно!
                  value={cardDuration ?? ''} // ← null → пустая строка для input
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val === '') {
                      setCardDuration(0);
                    } else {
                      setCardDuration(Number(val));
                    }
                  }}
                  placeholder="Введите продолжительность работ"
                  data-testid="input-card-duration"
                />
              </div>

            {/* Card Description */}
            <div>
              <Label htmlFor="edit-card-description">Описание</Label>
              <Textarea
                id="edit-card-description"
                value={cardDescription}
                onChange={(e) => setCardDescription(e.target.value)}
                placeholder="Введите описание карточки"
                rows={3}
                data-testid="textarea-edit-card-description"
              />
            </div>
            
            {/* Card Tags */}
            <div>
              <Label htmlFor="edit-card-tags">Теги</Label>
              <Input
                id="edit-card-tags"
                value={cardTags}
                onChange={(e) => setCardTags(e.target.value)}
                placeholder="Введите теги через запятую: фронт, бэк, дизайн"
                data-testid="input-edit-card-tags"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Одинаковые теги будут иметь одинаковые цвета
              </p>
            </div>

            {/* Card External Link */}
            <div>
              <Label htmlFor="card-description">Ссылка</Label>
              <Textarea
                id="card-description"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                placeholder="Введите ссылку на задачу"
                rows={1}
                data-testid="textarea-card-description"
              />
            </div>

            {/* User Stories Management */}
            <div>
              <UserStoriesManager
                userStories={cardUserStories}
                onChange={setCardUserStories}
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={() => {
                  resetCardForm();
                  setEditingCard(null);
                }}
                data-testid="button-cancel-edit-card"
              >
                Отмена
              </Button>
              <Button 
                onClick={handleSaveCardChanges}
                disabled={!cardTitle.trim() || !cardType || !cardColumnId}
                data-testid="button-save-card"
              >
                Сохранить
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      </div>
    </DragDropContext>
  );
}