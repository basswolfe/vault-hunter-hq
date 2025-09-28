"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from './ui/button';
import { Plus, Minus, CheckSquare, Circle, Square } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { characters, Skill } from '@/lib/skill-tree-data';

const SkillNode = ({ skill, points, onAdd, onRemove }: { skill: Skill, points: number, onAdd: () => void, onRemove: () => void }) => {
  const isMaxed = points >= skill.maxPoints;

  let Icon;
  let iconClass = 'w-full h-full';
  let buttonClass = 'relative h-20 w-20 rounded-md border-2 bg-card p-2 transition-all duration-200';

  switch (skill.type) {
    case 'augment':
      Icon = CheckSquare;
      buttonClass += ' rounded-lg border-4';
      iconClass += points > 0 ? ' text-accent' : ' text-muted-foreground';
      break;
    case 'capstone':
      Icon = Circle;
      buttonClass += ' h-24 w-24 rounded-full border-4 border-primary';
      iconClass += points > 0 ? ' text-rarity-legendary' : ' text-muted-foreground';
      break;
    default: // passive
      Icon = Square;
      buttonClass += ' rounded-md';
      iconClass += points > 0 ? ' text-accent' : ' text-muted-foreground';
  }

  return (
    <div className="flex flex-col items-center gap-1">
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="relative flex flex-col items-center gap-2">
            <button
              className={cn(
                buttonClass,
                points > 0 ? 'border-accent shadow-lg shadow-accent/20' : 'border-border',
                'hover:border-primary'
              )}
              onClick={skill.maxPoints === 1 ? (points > 0 ? onRemove : onAdd) : onAdd}
              disabled={isMaxed && skill.maxPoints > 1}
            >
              <Icon className={cn(iconClass)} />
              {points > 0 && (
                <div className="absolute -bottom-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground font-bold text-sm">
                  {points}
                </div>
              )}
            </button>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="font-bold">{skill.name} ({skill.type})</p>
          <p>{skill.description}</p>
          <p className="text-muted-foreground text-xs">Points: {points}/{skill.maxPoints}</p>
        </TooltipContent>
      </Tooltip>
      <p className="text-xs font-semibold text-center h-8">{skill.name}</p>
      {skill.maxPoints > 1 && (
        <div className="flex items-center gap-2">
          <Button size="icon" variant="outline" className="h-6 w-6" onClick={onRemove} disabled={points <= 0}>
            <Minus className="h-4 w-4" />
            <span className="sr-only">Remove point</span>
          </Button>
          <span className="text-sm font-bold w-4 text-center">{points}</span>
          <Button size="icon" variant="outline" className="h-6 w-6" onClick={onAdd} disabled={isMaxed}>
            <Plus className="h-4 w-4" />
            <span className="sr-only">Add point</span>
          </Button>
        </div>
      )}
    </div>
  );
};

type SkillTreeProps = {
    characterId: string;
    skillPoints: Record<string, number>;
    onCharacterChange: (characterId: string) => void;
    onSkillPointsChange: (skillPoints: Record<string, number>) => void;
};


const SkillTree = ({ characterId, skillPoints, onCharacterChange, onSkillPointsChange }: SkillTreeProps) => {
  const [selectedTree, setSelectedTree] = useState<'green' | 'red' | 'blue'>('green');
  
  const characterData = characters.find(c => c.id === characterId) || characters[0];
  const treeData = characterData.trees[selectedTree];
  
  const totalPoints = Object.values(skillPoints).reduce((sum, points) => sum + points, 0);

  const addPoint = (skill: Skill) => {
    const currentPoints = skillPoints[skill.id] || 0;
    if (currentPoints < skill.maxPoints) {
        onSkillPointsChange({ ...skillPoints, [skill.id]: currentPoints + 1 });
    }
  };

  const removePoint = (skillId: string) => {
    const currentPoints = skillPoints[skillId] || 0;
    if (currentPoints > 0) {
        onSkillPointsChange({ ...skillPoints, [skillId]: currentPoints - 1 });
    }
  };

  const handleCharChange = (charId: string) => {
    setSelectedTree('green'); // Reset to green tree on char change
    onCharacterChange(charId);
  }

  // Reset tree selection if character changes from outside
  useEffect(() => {
    setSelectedTree('green');
  }, [characterId]);


  const renderRow = (row: number) => {
    const skillsInRow = treeData.skills.filter(s => s.row === row);
    return (
      <div
        key={row}
        className="grid grid-flow-col auto-cols-max gap-x-8 gap-y-4 items-start justify-center"
      >
        {skillsInRow.map(skill => (
          <SkillNode
            key={skill.id}
            skill={skill}
            points={skillPoints[skill.id] || 0}
            onAdd={() => addPoint(skill)}
            onRemove={() => removePoint(skill.id)}
          />
        ))}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill Tree - Total Points: {totalPoints}</CardTitle>
        <div className="flex flex-col md:flex-row gap-4 pt-4">
          <div className="flex-1">
            <Select onValueChange={handleCharChange} value={characterId}>
              <SelectTrigger>
                <SelectValue placeholder="Select a character" />
              </SelectTrigger>
              <SelectContent>
                {characters.map(char => (
                  <SelectItem key={char.id} value={char.id}>{char.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button 
              onClick={() => setSelectedTree('green')} 
              variant={selectedTree === 'green' ? 'default' : 'outline'}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {characterData.trees.green.name}
            </Button>
            <Button 
              onClick={() => setSelectedTree('red')} 
              variant={selectedTree === 'red' ? 'default' : 'outline'}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {characterData.trees.red.name}
            </Button>
            <Button 
              onClick={() => setSelectedTree('blue')} 
              variant={selectedTree === 'blue' ? 'default' : 'outline'}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              {characterData.trees.blue.name}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-y-12 p-4 bg-background rounded-lg">
          {[1, 2, 3, 4, 5, 6].map(row => renderRow(row))}
        </div>
      </CardContent>
    </Card>
  );
};

export default SkillTree;
