import React, { useState } from 'react';
import { Plus, Edit, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { UserStory } from '@/types/gantt';

interface UserStoriesManagerProps {
  userStories: UserStory[];
  allUserStories: UserStory[]; 
  onChange: (stories: UserStory[]) => void;
}

export default function UserStoriesManager({ userStories, allUserStories, onChange }: UserStoriesManagerProps) {
  const [isCreating, setIsCreating] = useState(false);
  const [editingStory, setEditingStory] = useState<UserStory | null>(null);
  
  // Form state
  const [storyTitle, setStoryTitle] = useState('');
  const [storyText, setStoryText] = useState('');
  const [additionalRequirements, setAdditionalRequirements] = useState('');
  const [developmentDeadline, setDevelopmentDeadline] = useState<Date | undefined>(undefined);
  const [cardStartDate, setCardStartDate] = useState<Date | undefined>(undefined);
  const [cardDuration, setCardDuration] = useState<number>(0);
  const [externalLink, setExternalLink] = useState('');
  const [invest, setInvest] = useState('');
  const [dependencies, setDependencies] = useState<number[]>([]);

  // Format date to DD/MM/YY
  const formatDateToDisplay = (date: Date): string => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Reset form
  const resetForm = () => {
    setStoryTitle('');
    setStoryText('');
    setAdditionalRequirements('');
    setDevelopmentDeadline(undefined);
    setCardStartDate(undefined);
    setCardDuration(0);
    setExternalLink('');
    setInvest('');
    setDependencies([]);
  };

  // Handle create new story
  const handleCreateStory = () => {
    setIsCreating(true);
    resetForm();
  };

  // Handle edit story
  const handleEditStory = (story: UserStory) => {
    setEditingStory(story);
    setStoryTitle(story.title);
    setStoryText(story.story);
    setAdditionalRequirements(story.additionalRequirements);
    setDependencies(story.dependencies || []);
    setCardDuration(story.duration);
    setExternalLink(story.externalLink);
    setInvest(story.invest);
    
    // Parse deadline string back to Date if it exists
    if (story.developmentDeadline) {
      const [day, month, year] = story.developmentDeadline.split('/');
      const fullYear = parseInt(`20${year}`);
      setDevelopmentDeadline(new Date(fullYear, parseInt(month) - 1, parseInt(day)));
    } else {
      setDevelopmentDeadline(undefined);
    }

    // Parse start date string back to Date if it exists
    if (story.startDate) {
      const [day, month, year] = story.startDate.split('/');
      const fullYear = parseInt(`20${year}`);
      setCardStartDate(new Date(fullYear, parseInt(month) - 1, parseInt(day)));
    } else {
        setCardStartDate(undefined);
    } 
  };

  // Handle save story
  const handleSaveStory = () => {
    if (!storyTitle.trim() || !storyText.trim()) {
      return;
    }

    const storyData: Omit<UserStory, 'id'> = {
      title: storyTitle.trim(),
      story: storyText.trim(),
      additionalRequirements: additionalRequirements.trim(),
      developmentDeadline: developmentDeadline ? formatDateToDisplay(developmentDeadline) : undefined,
      startDate: cardStartDate ? formatDateToDisplay(cardStartDate) : undefined,
      duration: cardDuration,
      externalLink: externalLink,
      invest: invest,
      dependencies: dependencies.length > 0 ? dependencies : undefined
    };

    if (editingStory) {
      // Update existing story
      const updatedStories = userStories.map(story =>
        story.id === editingStory.id ? { ...storyData, id: editingStory.id } : story
      );
      onChange(updatedStories);
      setEditingStory(null);
    } else {
      // Create new story
      const newStory: UserStory = {
        ...storyData,
        id: Date.now(), // Simple ID generation
      };
      onChange([...userStories, newStory]);
      setIsCreating(false);
    }

    resetForm();
  };

  // Handle delete story
  const handleDeleteStory = (storyId: number) => {
    const updatedStories = userStories.filter(story => story.id !== storyId);
    onChange(updatedStories);
  };

  // Handle cancel
  const handleCancel = () => {
    resetForm();
    setIsCreating(false);
    setEditingStory(null);
  };

  const isModalOpen = isCreating || !!editingStory;

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Label className="text-sm font-medium">
          Пользовательские истории ({userStories.length})
        </Label>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCreateStory}
          data-testid="button-add-user-story"
        >
          <Plus size={14} className="mr-1" />
          Добавить историю
        </Button>
      </div>

      {/* Stories List */}
      {userStories.length > 0 ? (
        <div className="space-y-3 max-h-60 overflow-y-auto">
          {userStories.map((story) => (
            <div
              key={story.id}
              className="border border-border rounded-lg p-3 bg-card space-y-2"
              data-testid={`user-story-${story.id}`}
            >
              {/* Story Header */}
              <div className="flex items-start justify-between">
                <h4 className="font-medium text-sm text-foreground">
                  {story.title}
                </h4>
                <div className="flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditStory(story)}
                    data-testid={`button-edit-story-${story.id}`}
                    className="h-6 w-6 p-0"
                  >
                    <Edit size={12} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteStory(story.id)}
                    data-testid={`button-delete-story-${story.id}`}
                    className="h-6 w-6 p-0 text-red-600 hover:text-red-700"
                  >
                    <Trash2 size={12} />
                  </Button>
                </div>
              </div>

              {/* Story Text */}
              <p className="text-xs text-muted-foreground italic">
                {story.story}
              </p>

              {/* Additional Requirements */}
              {story.additionalRequirements && (
                <p className="text-xs text-muted-foreground">
                  <strong>Требования:</strong> {story.additionalRequirements}
                </p>
              )}

              {/* INVEST */}
              {story.invest && (
                <p className="text-xs text-muted-foreground">
                  <strong>INVEST:</strong> {story.invest}
                </p>
              )}

              {/* Dependencies */}
              {story.dependencies && story.dependencies.length > 0 && (
                <div className="text-xs text-muted-foreground">
                  <strong>Зависит от:</strong>{' '}
                  {story.dependencies.map((depId, index) => {
                    const dep = allUserStories.find(s => s.id === depId);
                    const content = dep ? (
                      <span key={depId} className="underline text-foreground">
                        {dep.title}
                      </span>
                    ) : (
                      <span key={depId} className="line-through text-red-500">[удалено: {depId}]</span>
                    );
                    return (
                      <React.Fragment key={depId}>
                        {content}
                        {index < story.dependencies!.length - 1 && ', '}
                      </React.Fragment>
                    );
                  })}
                </div>
              )}

              {/* Development Deadline */}
              {story.developmentDeadline && (
                <div className="flex items-center space-x-1">
                  <CalendarIcon size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Срок: {story.developmentDeadline}
                  </span>
                </div>
              )}

              {/* Start date */}
              {story.startDate && (
                <div className="flex items-center space-x-1">
                  <CalendarIcon size={12} className="text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">
                    Начало разработки: {story.startDate}
                  </span>
                </div>
              )}

              {/* Duration */}
              {story.duration && (
                <p className="text-xs text-muted-foreground">
                  <strong>Продолжительность:</strong> {story.duration}
                </p>
              )}

              {/* External link */}
              {story.externalLink && (
              <p>
                <a
                  href={story.externalLink.startsWith('http') ? story.externalLink : `https://${story.externalLink}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-foreground text-sm mb-2 leading-tight hover:underline"
                >
                  {story.externalLink}
                </a>
                </p>
              )}
              
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-4 text-muted-foreground text-sm border border-dashed border-border rounded-lg">
          Пользовательские истории не добавлены
        </div>
      )}

      {/* Create/Edit Story Dialog */}
      <Dialog open={isModalOpen} onOpenChange={(open) => !open && handleCancel()}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingStory ? 'Редактировать историю' : 'Создать пользовательскую историю'}
            </DialogTitle>
            <DialogDescription>
              {editingStory 
                ? 'Измените информацию о пользовательской истории' 
                : 'Заполните информацию о новой пользовательской истории'
              }
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Story Title */}
            <div>
              <Label htmlFor="story-title">Название *</Label>
              <Input
                id="story-title"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                placeholder="Введите название истории"
                data-testid="input-story-title"
              />
            </div>

            {/* Story Text */}
            <div>
              <Label htmlFor="story-text">История *</Label>
              <Textarea
                id="story-text"
                value={storyText}
                onChange={(e) => setStoryText(e.target.value)}
                placeholder="Я как пользователь хочу ... для того чтобы ..."
                rows={3}
                data-testid="textarea-story-text"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Используйте формат: "Я как [роль] хочу [функциональность] для того чтобы [цель]"
              </p>
            </div>

            {/* Additional Requirements */}
            <div>
              <Label htmlFor="additional-requirements">Дополнительные требования</Label>
              <Textarea
                id="additional-requirements"
                value={additionalRequirements}
                onChange={(e) => setAdditionalRequirements(e.target.value)}
                placeholder="Дополнительные требования и критерии приемки"
                rows={2}
                data-testid="textarea-additional-requirements"
              />
            </div>

            {/* INVEST */}
            <div>
              <Label htmlFor="invest">INVEST</Label>
              <Textarea
                id="invest"
                value={invest}
                onChange={(e) => setInvest(e.target.value)}
                placeholder="I - independent, независимость. Поставляем без влияния других историй;
                N - negotiable, обсуждаемость. Сами решим как ее лучше сделать;
                V - valuable, ценность. Сделав ее нанесем ценность бизнесу;
                E - estimable, оцениваемость. Сможем дать оценку по сложности/срокам;
                S - small, компактность. Сделаем за одну итерацию;
                T - testable, проверяемость. Понимаем как проверить или оттестировать."
                rows={6}
                data-testid="textarea-invest"
              />
            </div>

            {/* Dependencies */}
            <div>
              <Label>Зависимости</Label>
              <div className="space-y-1 mt-1 max-h-32 overflow-y-auto border rounded p-2">
                {allUserStories
                  .filter(story => (editingStory ? story.id !== editingStory.id : true))
                  .map(story => (
                    <div key={story.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`dep-${story.id}`}
                        checked={dependencies.includes(story.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setDependencies(prev => [...prev, story.id]);
                          } else {
                            setDependencies(prev => prev.filter(id => id !== story.id));
                          }
                        }}
                        className="mr-2"
                      />
                      <label htmlFor={`dep-${story.id}`} className="text-sm truncate">
                        {story.title} {story.id === editingStory?.id ? '(текущая)' : ''}
                      </label>
                    </div>
                  ))}
                {allUserStories.length === 0 && (
                  <p className="text-xs text-muted-foreground">Нет историй в системе</p>
                )}
              </div>
            </div>

            {/* Development Deadline */}
            <div>
              <Label htmlFor="development-deadline">Срок разработки</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !developmentDeadline && "text-muted-foreground"
                    }`}
                    data-testid="button-development-deadline"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {developmentDeadline ? formatDateToDisplay(developmentDeadline) : "Выбрать дату"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={developmentDeadline}
                    onSelect={setDevelopmentDeadline}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Start date */}
            <div>
              <Label htmlFor="development-deadline">Начало разработки</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={`w-full justify-start text-left font-normal ${
                      !cardStartDate && "text-muted-foreground"
                    }`}
                    data-testid="button-development-deadline"
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

            {/* Duration */}
            <div>
              <Label htmlFor="story-title">Продолжительность</Label>
              <Input
                id="story-title"
                value={cardDuration}
                onChange={(e) => setCardDuration(Number(e.target.value))}
                placeholder="Введите продолжительность"
                data-testid="input-story-title"
                />
              </div>

            {/* External Link */}
            <div>
              <Label htmlFor="story-external-link">Внешняя ссылка</Label>
              <Input
                id="story-external-link"
                value={externalLink}
                onChange={(e) => setExternalLink(e.target.value)}
                placeholder="Введите ссылку на внешнюю задачу"
                data-testid="input-story-external-link"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-2">
              <Button 
                variant="outline" 
                onClick={handleCancel}
                data-testid="button-cancel-story"
              >
                Отмена
              </Button>
              <Button 
                onClick={handleSaveStory}
                disabled={!storyTitle.trim() || !storyText.trim()}
                data-testid="button-save-story"
              >
                {editingStory ? 'Сохранить' : 'Создать'}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}