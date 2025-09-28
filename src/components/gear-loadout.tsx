
"use client";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GearItem } from './gear-item';
import { Badge } from '@/components/ui/badge';
import type { GearItemData } from '@/lib/types';


export const allGearTitles = [
  'Weapon 1',
  'Weapon 2',
  'Weapon 3',
  'Weapon 4',
  'Shield',
  'Repkit',
  'Ordnance',
  'Class Mod',
  'Enhancement',
];

type GearLoadoutProps = {
  activeGear: string[];
  gearData: Record<string, GearItemData>;
  onActiveGearChange: (activeGear: string[]) => void;
  onGearChange: (title: string, data: GearItemData) => void;
};


const GearLoadout = ({ activeGear, gearData, onActiveGearChange, onGearChange }: GearLoadoutProps) => {

  const handleRemoveGear = (title: string) => {
    onActiveGearChange(activeGear.filter((item) => item !== title));
  };

  const handleAddGear = (title: string) => {
    if (!activeGear.includes(title)) {
      const newActiveGear = allGearTitles.filter(
        (gearTitle) => activeGear.includes(gearTitle) || gearTitle === title
      );
      onActiveGearChange(newActiveGear);
    }
  };

  const availableGearToAdd = allGearTitles.filter(
    (title) => !activeGear.includes(title)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Gear Loadout</CardTitle>
        {availableGearToAdd.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-4">
            {availableGearToAdd.map((title) => (
              <Badge
                key={title}
                variant="outline"
                className="cursor-pointer hover:bg-accent hover:text-accent-foreground"
                onClick={() => handleAddGear(title)}
              >
                Add {title}
              </Badge>
            ))}
          </div>
        )}
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {activeGear.map((title) => (
          <GearItem 
            key={title} 
            title={title}
            data={gearData[title]}
            onDataChange={(data) => onGearChange(title, data)}
            onRemove={() => handleRemoveGear(title)} 
          />
        ))}
      </CardContent>
    </Card>
  );
};

export default GearLoadout;
