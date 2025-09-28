"use client";

import { useState, useEffect } from "react";
import { getBuilds, getAllUsers } from "@/lib/builds-db";
import type { Build, PublicUser } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { characters } from "@/lib/skill-tree-data";
import { Separator } from "./ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

const BuildViewer = () => {
    const [users, setUsers] = useState<PublicUser[]>([]);
    const [selectedUser, setSelectedUser] = useState<PublicUser | null>(null);
    const [builds, setBuilds] = useState<Build[]>([]);
    const [selectedBuild, setSelectedBuild] = useState<Build | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getAllUsers().then((users) => {
            setUsers(users);
            setIsLoading(false);
        });
    }, []);

    useEffect(() => {
        if (selectedUser) {
            getBuilds(selectedUser.uid).then((userBuilds) => {
                setBuilds(userBuilds);
                if (userBuilds.length > 0) {
                    setSelectedBuild(userBuilds[0]);
                } else {
                    setSelectedBuild(null);
                }
            });
        } else {
            setBuilds([]);
            setSelectedBuild(null);
        }
    }, [selectedUser]);

    const handleSelectUser = (userId: string) => {
        const user = users.find((u) => u.uid === userId);
        setSelectedUser(user || null);
        setSelectedBuild(null);
        setBuilds([]);
    };

    const handleSelectBuild = (buildId: string) => {
        const build = builds.find((b) => b.id === buildId);
        setSelectedBuild(build || null);
    };

    const getSkillNameById = (skillId: string) => {
        for (const char of characters) {
            for (const tree of Object.values(char.trees)) {
                const skill = tree.skills.find((s) => s.id === skillId);
                if (skill) return skill.name;
            }
        }
        return skillId;
    };

    if (isLoading) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Build Viewer</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">Loading...</p>
                </CardContent>
            </Card>
        );
    }

    if (users.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Build Viewer</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">No builds have been created yet. Be the first!</p>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Build Viewer</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl">
                    <div>
                        <label className="text-sm font-medium mb-2 block">Vault Hunter</label>
                        <Select onValueChange={handleSelectUser} value={selectedUser?.uid}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a user" />
                            </SelectTrigger>
                            <SelectContent>
                                {users.map((user) => (
                                    <SelectItem key={user.uid} value={user.uid}>
                                        <div className="flex items-center gap-2">
                                            <Avatar className="h-6 w-6">
                                                <AvatarImage src={user.photoURL ?? ""} />
                                                <AvatarFallback>{user.displayName?.charAt(0) ?? "V"}</AvatarFallback>
                                            </Avatar>
                                            <span>{user.displayName}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    {selectedUser && (
                        <div>
                            <label className="text-sm font-medium mb-2 block">Build</label>
                            <Select
                                onValueChange={handleSelectBuild}
                                value={selectedBuild?.id}
                                disabled={builds.length === 0}>
                                <SelectTrigger>
                                    <SelectValue placeholder={builds.length > 0 ? "Select a build" : "No builds yet"} />
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
                    )}
                </div>

                {selectedBuild && (
                    <div className="p-4 border rounded-lg bg-muted/50 space-y-4">
                        <h3 className="text-xl font-bold">{selectedBuild.name}</h3>

                        <div>
                            <h4 className="font-semibold text-lg mb-2">Gear</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                {selectedBuild.activeGear.map((gearSlot) => {
                                    const gearItem = selectedBuild.gear[gearSlot];
                                    if (gearItem && gearItem.name) {
                                        return (
                                            <li key={gearSlot}>
                                                <strong>{gearSlot}:</strong> {gearItem.name} ({gearItem.rarity})
                                            </li>
                                        );
                                    }
                                    return null;
                                })}
                            </ul>
                        </div>

                        <Separator />

                        <div>
                            <h4 className="font-semibold text-lg mb-2">Skills</h4>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                                {Object.entries(selectedBuild.skillPoints)
                                    .filter(([, points]) => points > 0)
                                    .map(([skillId, points]) => (
                                        <li key={skillId}>
                                            <strong>{getSkillNameById(skillId)}:</strong> {points} point(s)
                                        </li>
                                    ))}
                            </ul>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default BuildViewer;
