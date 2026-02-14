import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { User, Plus } from 'lucide-react';
import type { CharacterView } from '../../backend';

interface CharacterHubProps {
  characters: CharacterView[];
  onSlotClick: (slotIndex: number, character: CharacterView | null) => void;
}

const TOTAL_SLOTS = 150;

const CharacterHub = React.memo(({ characters, onSlotClick }: CharacterHubProps) => {
  const slots = useMemo(() => {
    const result: Array<{ index: number; character: CharacterView | null }> = [];
    
    for (let i = 0; i < TOTAL_SLOTS; i++) {
      result.push({
        index: i,
        character: characters[i] || null,
      });
    }
    
    return result;
  }, [characters]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
      {slots.map((slot) => (
        <SlotCard
          key={slot.index}
          slotIndex={slot.index}
          character={slot.character}
          onClick={() => onSlotClick(slot.index, slot.character)}
        />
      ))}
    </div>
  );
});

CharacterHub.displayName = 'CharacterHub';

interface SlotCardProps {
  slotIndex: number;
  character: CharacterView | null;
  onClick: () => void;
}

const SlotCard = React.memo(({ slotIndex, character, onClick }: SlotCardProps) => {
  if (character) {
    return (
      <Card
        className="cursor-pointer hover:shadow-md hover:border-primary/50 transition-all"
        onClick={onClick}
      >
        <CardContent className="p-4 flex flex-col items-center justify-center min-h-[100px]">
          <User className="w-6 h-6 text-primary mb-2" />
          <p className="text-sm font-medium text-center line-clamp-2">{character.name}</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      className="cursor-pointer hover:shadow-md hover:border-muted-foreground/30 transition-all border-dashed"
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center min-h-[100px]">
        <Plus className="w-6 h-6 text-muted-foreground mb-2" />
        <p className="text-xs text-muted-foreground text-center">Slot {slotIndex + 1}</p>
        <p className="text-xs text-muted-foreground text-center">Empty</p>
      </CardContent>
    </Card>
  );
});

SlotCard.displayName = 'SlotCard';

export default CharacterHub;
