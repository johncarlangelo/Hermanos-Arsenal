import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  defaultDropAnimationSideEffects,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable';
import { useState } from 'react';
import Category from './Category';
import DragOverlayItem from './DragOverlayItem';
import { playSfx } from '../utils/sounds';

export default function GridLayout({ categories, setCategories, onRename, onDelete, onAddLink, onDeleteLink, children }) {
  const [activeId, setActiveId] = useState(null);
  const [activeType, setActiveType] = useState(null);
  const [activeItem, setActiveItem] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    playSfx('swoosh');
    const { active } = event;
    setActiveId(active.id);
    setActiveType(active.data.current?.type);
    
    if (active.data.current?.type === 'Link') {
      setActiveItem(active.data.current.link);
    }
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    if (!over) return;

    const activeType = active.data.current?.type;
    const overType = over.data.current?.type;

    if (activeType === 'Category') {
      const activeId = active.id;
      const overId = over.data.current?.category?.id || over.id;

      if (activeId !== overId) {
        setCategories((prev) => {
          const oldIndex = prev.findIndex((cat) => cat.id === activeId);
          const newIndex = prev.findIndex((cat) => cat.id === overId);

          if (oldIndex !== -1 && newIndex !== -1 && oldIndex !== newIndex) {
            return arrayMove(prev, oldIndex, newIndex);
          }
          return prev;
        });
      }
      return;
    }

    if (activeType === 'Link') {
      const activeContainerId = active.data.current.link.categoryId;
      // Over another link or over a category
      const overContainerId = overType === 'Link' ? over.data.current.link.categoryId : (over.data.current?.category?.id || over.id);

      if (!overContainerId || activeContainerId === overContainerId) {
        return;
      }

      setCategories((prev) => {
        const activeCatIndex = prev.findIndex(cat => cat.id === activeContainerId);
        const overCatIndex = prev.findIndex(cat => cat.id === overContainerId);
        
        if (activeCatIndex === -1 || overCatIndex === -1) return prev;

        const newCategories = [...prev];
        const activeLinks = [...newCategories[activeCatIndex].links];
        const overLinks = [...newCategories[overCatIndex].links];
        
        const activeLinkIndex = activeLinks.findIndex(l => l.id === active.id);
        const [movedLink] = activeLinks.splice(activeLinkIndex, 1);
        movedLink.categoryId = overContainerId; // update reference

        if (overType === 'Link') {
          const overLinkIndex = overLinks.findIndex(l => l.id === over.id);
          const isBelowOverItem =
            over &&
            active.rect.current.translated &&
            active.rect.current.translated.top > over.rect.top + over.rect.height;
          const modifier = isBelowOverItem ? 1 : 0;
          const newIndex = overLinkIndex >= 0 ? overLinkIndex + modifier : overLinks.length;
          overLinks.splice(newIndex, 0, movedLink);
        } else {
          overLinks.push(movedLink);
        }

        newCategories[activeCatIndex] = { ...newCategories[activeCatIndex], links: activeLinks };
        newCategories[overCatIndex] = { ...newCategories[overCatIndex], links: overLinks };
        
        // Mutate the active data so subsequent drag events have the updated categoryId
        active.data.current.link.categoryId = overContainerId;
        
        return newCategories;
      });
    }
  };

  const handleDragEnd = (event) => {
    playSfx('snap');
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const activeType = active.data.current?.type;
      
      if (activeType === 'Link') {
        const activeContainerId = active.data.current.link.categoryId;
        const overContainerId = over.data.current?.type === 'Link' ? over.data.current.link.categoryId : (over.data.current?.category?.id || over.id);
        
        if (activeContainerId === overContainerId) {
          // Reorder within same category
          setCategories(prev => {
            const catIndex = prev.findIndex(cat => cat.id === activeContainerId);
            if (catIndex === -1) return prev;
            
            const links = [...prev[catIndex].links];
            const oldIndex = links.findIndex(l => l.id === active.id);
            const newIndex = links.findIndex(l => l.id === over.id);
            
            if (oldIndex !== newIndex) {
              const newCategories = [...prev];
              newCategories[catIndex] = {
                ...newCategories[catIndex],
                links: arrayMove(links, oldIndex, newIndex)
              };
              return newCategories;
            }
            return prev;
          });
        }
      }
    }

    setActiveId(null);
    setActiveType(null);
    setActiveItem(null);
  };

  const handleDragCancel = () => {
    setActiveId(null);
    setActiveType(null);
    setActiveItem(null);
  };

  const activeCategory = activeType === 'Category' ? categories.find((cat) => cat.id === activeId) : null;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <SortableContext
        items={categories.map((cat) => cat.id)}
        strategy={rectSortingStrategy}
      >
        <div className="flex flex-wrap gap-6 items-start">
          {children}
        </div>
      </SortableContext>

      <DragOverlay
        dropAnimation={{
          duration: 250,
          easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)',
          sideEffects: defaultDropAnimationSideEffects({
            styles: { active: { opacity: '0.4' } }
          })
        }}
      >
        {activeId && activeType === 'Category' && activeCategory ? (
          <div style={{ 
            transform: 'rotate(-4deg)',
            cursor: 'grabbing',
            width: activeCategory.size?.width || 400,
            height: activeCategory.size?.height || 400,
            opacity: 0.9,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}>
            <Category
              id={activeCategory.id}
              name={activeCategory.name}
              color={activeCategory.color}
              size={activeCategory.size}
              viewType={activeCategory.viewType}
              iconSize={activeCategory.iconSize}
              links={activeCategory.links || []}
              onRename={onRename}
              onDelete={onDelete}
              onAddLink={onAddLink}
              onDeleteLink={onDeleteLink}
              dragHandleProps={{}}
              isLocked={true}
            />
          </div>
        ) : null}
        {activeId && activeType === 'Link' && activeItem ? (
          <DragOverlayItem 
            link={activeItem} 
            viewType={categories.find(c => c.id === activeItem.categoryId)?.viewType}
            iconSize={categories.find(c => c.id === activeItem.categoryId)?.iconSize}
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
