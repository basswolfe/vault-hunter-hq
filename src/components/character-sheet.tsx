"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import SkillTree from "./skill-tree";
import { Plus, Trash2, Save } from "lucide-react";
import GearLoadout from "./gear-loadout";
import { useAuth } from "@/hooks/use-auth";
import { createBuild, getBuilds, updateBuild, deleteBuild } from "@/lib/builds-db";
import type { Build, GearItemData } from "@/lib/types";
import { characters, Skill } from "@/lib/skill-tree-data";
import { allGearTitles } from "./gear-loadout";

const CharacterSheet = () => {
    const { user, loading } = useAuth();
    const { toast } = useToast();
    const [builds, setBuilds] = useState<Build[]>([]);
    const [selectedBuildId, setSelectedBuildId] = useState<string | null>(null);
    const [currentBuild, setCurrentBuild] = useState<Build | null>(null);
    const [isCreatingNew, setIsCreatingNew] = useState(false);

    const allSkillsForChar = (charId: string) => {
        const char = characters.find((c) => c.id === charId);
        if (!char) return [];
        return Object.values(char.trees).flatMap((tree) => tree.skills);
    };

    const createNewBuildTemplate = (charId = "amon"): Build => {
        const newSkills = allSkillsForChar(charId);
        return {
            id: "new",
            userId: user?.uid || "",
            name: "New Build",
            characterId: charId,
            skillPoints: newSkills.reduce((acc, skill) => ({ ...acc, [skill.id]: 0 }), {}),
            gear: {},
            activeGear: allGearTitles,
        };
    };

    useEffect(() => {
        if (user) {
            getBuilds(user.uid).then((userBuilds) => {
                setBuilds(userBuilds);
                if (userBuilds.length > 0) {
                    handleSelectBuild(userBuilds[0].id);
                } else {
                    handleCreateNew();
                }
            });
        } else {
            setBuilds([]);
            setCurrentBuild(null);
            setSelectedBuildId(null);
        }
    }, [user]);

    const handleSelectBuild = (buildId: string) => {
        const build = builds.find((b) => b.id === buildId);
        if (build) {
            setCurrentBuild(build);
            setSelectedBuildId(build.id);
            setIsCreatingNew(false);
        }
    };

    const handleCreateNew = () => {
        setCurrentBuild(createNewBuildTemplate());
        setSelectedBuildId(null);
        setIsCreatingNew(true);
    };

    const handleDeleteBuild = async () => {
        if (!selectedBuildId) return;

        try {
            await deleteBuild(selectedBuildId);
            toast({ title: "Build Deleted", description: "The build has been removed." });
            const updatedBuilds = builds.filter((b) => b.id !== selectedBuildId);
            setBuilds(updatedBuilds);
            if (updatedBuilds.length > 0) {
                handleSelectBuild(updatedBuilds[0].id);
            } else {
                handleCreateNew();
            }
        } catch (error) {
            toast({ title: "Error", description: "Failed to delete build.", variant: "destructive" });
        }
    };

    const handleSaveBuild = async () => {
        if (!currentBuild || !user) return;

        try {
            if (isCreatingNew || currentBuild.id === "new") {
                const newBuildData = {
                    name: currentBuild.name,
                    characterId: currentBuild.characterId,
                    skillPoints: currentBuild.skillPoints,
                    gear: currentBuild.gear,
                    activeGear: currentBuild.activeGear,
                };
                const savedBuild = await createBuild(user.uid, newBuildData);
                const updatedBuilds = [...builds, savedBuild];
                setBuilds(updatedBuilds);
                handleSelectBuild(savedBuild.id);
                toast({ title: "Build Saved!", description: `"${savedBuild.name}" has been created.` });
            } else {
                await updateBuild(currentBuild.id, currentBuild);
                setBuilds(builds.map((b) => (b.id === currentBuild.id ? currentBuild : b)));
                toast({ title: "Build Updated!", description: `"${currentBuild.name}" has been saved.` });
            }
        } catch (error) {
            console.error("Save error:", error);
            toast({ title: "Error", description: "Failed to save build.", variant: "destructive" });
        }
    };

    const updateBuildField = (field: keyof Build, value: any) => {
        if (currentBuild) {
            setCurrentBuild({ ...currentBuild, [field]: value });
        }
    };

    const updateGearItem = (title: string, data: GearItemData) => {
        if (currentBuild) {
            const newGear = { ...currentBuild.gear, [title]: data };
            updateBuildField("gear", newGear);
        }
    };

    const handleCharacterChange = (charId: string) => {
        if (currentBuild) {
            const newSkills = allSkillsForChar(charId);
            const newSkillPoints = newSkills.reduce((acc, skill) => ({ ...acc, [skill.id]: 0 }), {});
            setCurrentBuild({ ...currentBuild, characterId: charId, skillPoints: newSkillPoints });
        }
    };

    // Show loading state while auth is being determined
    if (loading) {
        return (
            <div className="w-full space-y-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Build Management</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">Loading...</p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="w-full space-y-4">
            <Card>
                <CardHeader>
                    <CardTitle>Build Management</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col md:flex-row gap-4">
                    {user ? (
                        <>
                            <div className="flex-1 space-y-2">
                                <Select onValueChange={handleSelectBuild} value={selectedBuildId ?? ""}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a build" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {builds.map((build) => (
                                            <SelectItem key={build.id} value={build.id}>
                                                {build.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <Button onClick={handleCreateNew}>
                                <Plus className="mr-2 h-4 w-4" />
                                New Build
                            </Button>
                            {currentBuild && (
                                <>
                                    <Input
                                        placeholder="Build Name"
                                        value={currentBuild.name}
                                        onChange={(e) => updateBuildField("name", e.target.value)}
                                        className="max-w-xs"
                                    />
                                    <Button onClick={handleSaveBuild}>
                                        <Save className="mr-2 h-4 w-4" />
                                        Save Build
                                    </Button>
                                    {!isCreatingNew && (
                                        <Button variant="destructive" onClick={handleDeleteBuild}>
                                            <Trash2 className="mr-2 h-4 w-4" />
                                            Delete
                                        </Button>
                                    )}
                                </>
                            )}
                        </>
                    ) : (
                        <p className="text-muted-foreground">Please log in to manage your builds.</p>
                    )}
                </CardContent>
            </Card>

            {currentBuild && user && (
                <>
                    <GearLoadout
                        activeGear={currentBuild.activeGear}
                        gearData={currentBuild.gear}
                        onActiveGearChange={(newActiveGear) => updateBuildField("activeGear", newActiveGear)}
                        onGearChange={updateGearItem}
                    />

                    <SkillTree
                        key={currentBuild.id}
                        characterId={currentBuild.characterId}
                        skillPoints={currentBuild.skillPoints}
                        onCharacterChange={handleCharacterChange}
                        onSkillPointsChange={(newSkillPoints) => updateBuildField("skillPoints", newSkillPoints)}
                    />
                </>
            )}
        </div>
    );
};

export default CharacterSheet;
