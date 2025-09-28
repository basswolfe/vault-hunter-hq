
"use client";
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from './ui/button';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { GearItemData } from '@/lib/types';

type GearItemProps = {
  title: string;
  data: GearItemData;
  onDataChange: (data: GearItemData) => void;
  onRemove: () => void;
};

const rarities = ['Common', 'Uncommon', 'Rare', 'Epic', 'Legendary', 'Mythic'];

export function GearItem({ title, data, onDataChange, onRemove }: GearItemProps) {
  const [rarity, setRarity] = useState(data?.rarity?.toLowerCase() || 'common');
  
  useEffect(() => {
    // When the build is changed from the outside, update the local rarity
    setRarity(data?.rarity?.toLowerCase() || 'common');
  }, [data?.rarity]);


  const handleChange = (field: keyof GearItemData, value: string) => {
    const newData = { ... (data || { name: '', rarity: 'common', type: '', augments: '', locations: '', notes: '' }), [field]: value };
    if (field === 'rarity') {
        setRarity(value.toLowerCase());
    }
    onDataChange(newData);
  };


  const rarityColorClasses = {
    common: 'border-rarity-common bg-rarity-common/10',
    uncommon: 'border-rarity-uncommon bg-rarity-uncommon/10',
    rare: 'border-rarity-rare bg-rarity-rare/10',
    epic: 'border-rarity-epic bg-rarity-epic/10',
    legendary: 'border-rarity-legendary bg-rarity-legendary/10',
    mythic: 'border-rarity-mythic bg-rarity-mythic/10',
  };

  return (
    <Card className={cn(rarityColorClasses[rarity as keyof typeof rarityColorClasses], 'transition-colors duration-300')}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>{title}</CardTitle>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onRemove}>
          <X className="h-4 w-4" />
          <span className="sr-only">Remove {title}</span>
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor={`${title}-name`}>Name</Label>
            <Input id={`${title}-name`} placeholder="Enter name" value={data?.name || ''} onChange={e => handleChange('name', e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor={`${title}-rarity`}>Rarity</Label>
            <Select onValueChange={value => handleChange('rarity', value)} value={rarity}>
              <SelectTrigger id={`${title}-rarity`}>
                <SelectValue placeholder="Select rarity" />
              </SelectTrigger>
              <SelectContent>
                {rarities.map((r) => (
                  <SelectItem key={r} value={r.toLowerCase()}>
                    {r}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-type`}>Type</Label>
          <Input id={`${title}-type`} placeholder="e.g., Pistol, Assault Rifle" value={data?.type || ''} onChange={e => handleChange('type', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-augments`}>Augments</Label>
          <Textarea id={`${title}-augments`} placeholder="List augments" value={data?.augments || ''} onChange={e => handleChange('augments', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-locations`}>Locations</Label>
          <Input id={`${title}-locations`} placeholder="Where to find it" value={data?.locations || ''} onChange={e => handleChange('locations', e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label htmlFor={`${title}-notes`}>Notes</Label>
          <Textarea id={`${title}-notes`} placeholder="Additional notes" value={data?.notes || ''} onChange={e => handleChange('notes', e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
}
