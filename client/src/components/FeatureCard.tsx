import { Draggable } from 'react-beautiful-dnd';
import { Sparkles, BarChart3, Bug, ArrowUp, Code, X, Calendar, PlayCircle, PauseCircle, Archive, Users } from 'lucide-react';
import { FeatureCard as FeatureCardType, FeatureCardType as CardType, FeatureCardStatus } from '@/types/gantt';

interface FeatureCardProps {
  card: FeatureCardType;
  index: number;
  onDelete?: (cardId: number) => void;
  onEdit?: (card: FeatureCardType) => void;
  getTagColor?: (tag: string) => string;
}

// Generate consistent color for tag based on tag name (fallback)
const defaultGetTagColor = (tag: string): string => {
  const colors = [
    'bg-blue-100 text-blue-800 border-blue-200',
    'bg-green-100 text-green-800 border-green-200',
    'bg-purple-100 text-purple-800 border-purple-200',
    'bg-pink-100 text-pink-800 border-pink-200',
    'bg-yellow-100 text-yellow-800 border-yellow-200',
    'bg-indigo-100 text-indigo-800 border-indigo-200',
    'bg-red-100 text-red-800 border-red-200',
    'bg-orange-100 text-orange-800 border-orange-200',
  ];
  
  // Simple hash function to get consistent color for same tag
  let hash = 0;
  for (let i = 0; i < tag.length; i++) {
    const char = tag.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return colors[Math.abs(hash) % colors.length];
};

// Get icon and color for card status
const getStatusConfig = (status: FeatureCardStatus) => {
  switch (status) {
    case 'analytics':
      return { icon: BarChart3, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Аналитика' };
    case 'development':
      return { icon: PlayCircle, color: 'text-green-600', bgColor: 'bg-green-50', label: 'В разработке' };
    case 'backlog':
      return { icon: Archive, color: 'text-gray-600', bgColor: 'bg-gray-50', label: 'Бэклог' };
    case 'postponed':
      return { icon: PauseCircle, color: 'text-orange-600', bgColor: 'bg-orange-50', label: 'Отложена' };
    default:
      return { icon: Archive, color: 'text-gray-600', bgColor: 'bg-gray-50', label: 'Бэклог' };
  }
};

// Get icon and color for card type
const getTypeConfig = (type: CardType) => {
  switch (type) {
    case 'new':
      return { icon: Sparkles, color: 'text-green-600', bgColor: 'bg-green-50', label: 'Новая' };
    case 'analytics':
      return { icon: BarChart3, color: 'text-blue-600', bgColor: 'bg-blue-50', label: 'Аналитика' };
    case 'bugfix':
      return { icon: Bug, color: 'text-red-600', bgColor: 'bg-red-50', label: 'Баг-фикс' };
    case 'improvement':
      return { icon: ArrowUp, color: 'text-purple-600', bgColor: 'bg-purple-50', label: 'Улучшение' };
    case 'development':
      return { icon: Code, color: 'text-orange-600', bgColor: 'bg-orange-50', label: 'Разработка' };
    default:
      return { icon: Sparkles, color: 'text-gray-600', bgColor: 'bg-gray-50', label: 'Новая' };
  }
};

export default function FeatureCard({ card, index, onDelete, onEdit, getTagColor }: FeatureCardProps) {
  const typeConfig = getTypeConfig(card.type);
  const statusConfig = getStatusConfig(card.status || 'backlog');
  const Icon = typeConfig.icon;
  const StatusIcon = statusConfig.icon;
  
  // Format deadline for display
  const formatDeadline = (deadline?: string) => {
    if (!deadline) return null;
    return deadline; // Already in DD/MM/YY format
  };

  const formatStartdate = (startDate?: string) => {
    if (!startDate) return null;
    return startDate; // Already in DD/MM/YY format
  };
  
  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click and drag from starting
    if (onDelete) {
      onDelete(card.id);
    }
  };

  const handleCardClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent drag from starting
    if (onEdit) {
      onEdit(card);
    }
  };

  return (
    <Draggable draggableId={`card-${card.id}`} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          onClick={handleCardClick}
          className={`
            bg-card border border-border rounded-lg p-4 mb-3 shadow-sm group
            hover:shadow-md transition-shadow duration-200 cursor-pointer
            ${snapshot.isDragging ? 'shadow-lg rotate-2 bg-accent cursor-grab' : 'hover:bg-accent/5'}
          `}
          data-testid={`feature-card-${card.id}`}
        >
          {/* Card Header - Type, Status and Delete Button */}
          <div className="flex items-start justify-between mb-2">
            <div className="flex items-center space-x-3">
              {/* Type */}
              <div className="flex items-center space-x-1">
                <div className={`p-1.5 rounded-md ${typeConfig.bgColor}`}>
                  <Icon size={12} className={typeConfig.color} />
                </div>
                <span className={`text-xs font-medium ${typeConfig.color}`}>
                  {typeConfig.label}
                </span>
              </div>
              
              {/* Status */}
              <div className="flex items-center space-x-1">
                <div className={`p-1 rounded-md ${statusConfig.bgColor}`}>
                  <StatusIcon size={11} className={statusConfig.color} />
                </div>
                <span className={`text-xs font-medium ${statusConfig.color}`}>
                  {statusConfig.label}
                </span>
              </div>
            </div>
            
            {onDelete && (
              <button
                onClick={handleDeleteClick}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-red-100 transition-all duration-200 text-red-600 hover:text-red-700"
                data-testid={`button-delete-${card.id}`}
                title="Удалить карточку"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Title */}
          <h4 className="font-semibold text-foreground text-sm mb-2 leading-tight">
            {card.title}
          </h4>

          {/* Deadline */}
          {formatDeadline(card.deadline) && (
            <div className="flex items-center space-x-1 mb-2">
              <Calendar size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">
                Срок: {formatDeadline(card.deadline)}
              </span>
            </div>
          )}

          {/* StartDate */}
          {formatStartdate(card.startDate) && (
            <div className="flex items-center space-x-1 mb-2">
              <Calendar size={12} className="text-muted-foreground" />
              <span className="text-xs text-muted-foreground font-medium">
                Срок: {formatStartdate(card.startDate)}
              </span>
            </div>
          )}

          {/* Duration */}
          <h4 className="flex items-center space-x-1 mb-2">
            Продолжительность: {card.duration}
          </h4>

          {/* Description */}
          {card.description && (
            <p className="text-xs text-muted-foreground mb-3 leading-relaxed line-clamp-3">
              {card.description}
            </p>
          )}

          {/* User Stories */}
          {card.userStories && card.userStories.length > 0 && (
            <div className="mb-3">
              <div className="flex items-center space-x-1 mb-1">
                <Users size={12} className="text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">
                  Истории ({card.userStories.length}):
                </span>
              </div>
              <div className="space-y-1">
                {card.userStories.slice(0, 2).map((story) => (
                  <div key={story.id} className="text-xs text-muted-foreground pl-4">
                    • {story.title}
                  </div>
                ))}
                {card.userStories.length > 2 && (
                  <div className="text-xs text-muted-foreground pl-4 italic">
                    ... и еще {card.userStories.length - 2}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* External Link */}
          {card.externalLink && (
            <a
              href={card.externalLink.startsWith('http') ? card.externalLink : `https://${card.externalLink}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-foreground text-sm mb-2 leading-tight hover:underline"
            >
              {card.externalLink}
            </a>
          )}

          {/* Tags */}
          {card.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {card.tags.map((tag, tagIndex) => (
                <span
                  key={tagIndex}
                  className={`
                    px-2 py-1 rounded-full text-xs font-medium border
                    ${getTagColor ? getTagColor(tag) : defaultGetTagColor(tag)}
                  `}
                  data-testid={`tag-${tag}`}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}