"use client";

import { useState, useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

interface VideoBackgroundProps {
    src: string;
    poster?: string;
    className?: string;
    overlay?: boolean;
    overlayOpacity?: number;
}

export function VideoBackground({
    src,
    poster,
    className,
    overlay = true,
    overlayOpacity = 0.4,
}: VideoBackgroundProps) {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isMounted, setIsMounted] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Ensure component only renders on client side
    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (!isMounted) return;

        const video = videoRef.current;
        if (!video) return;

        const handleLoadedData = () => {
            console.log("Video loaded successfully");
            setIsLoaded(true);
            setIsLoading(false);
        };

        const handleError = (e: any) => {
            console.error("Video failed to load:", e);
            setHasError(true);
            setIsLoading(false);
        };

        const handleLoadStart = () => {
            console.log("Video started loading");
            setIsLoading(true);
        };

        video.addEventListener("loadstart", handleLoadStart);
        video.addEventListener("loadeddata", handleLoadedData);
        video.addEventListener("error", handleError);

        return () => {
            video.removeEventListener("loadstart", handleLoadStart);
            video.removeEventListener("loadeddata", handleLoadedData);
            video.removeEventListener("error", handleError);
        };
    }, [isMounted]);

    // Show loading state during SSR and initial client render
    if (!isMounted) {
        return (
            <div className={cn("fixed inset-0 bg-background z-0", className)}>
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <div className="animate-pulse">Loading...</div>
                </div>
            </div>
        );
    }

    if (hasError) {
        return (
            <div className={cn("fixed inset-0 bg-background z-0", className)}>
                <div className="flex items-center justify-center h-full text-muted-foreground">
                    <p>Video failed to load</p>
                </div>
            </div>
        );
    }

    return (
        <div className={cn("fixed inset-0 overflow-hidden z-0", className)}>
            <video
                ref={videoRef}
                autoPlay
                muted
                loop
                playsInline
                poster={poster}
                className={cn(
                    "absolute inset-0 w-full h-full object-cover transition-opacity duration-500",
                    isLoaded ? "opacity-100" : "opacity-0",
                )}
                style={{ objectPosition: "center center" }}>
                <source src={src} type="video/mp4" />
                Your browser does not support the video tag.
            </video>

            {overlay && <div className="absolute inset-0 bg-background" style={{ opacity: overlayOpacity }} />}

            {isLoading && !hasError && (
                <div className="absolute inset-0 bg-background animate-pulse flex items-center justify-center">
                    <div className="text-muted-foreground">Loading video...</div>
                </div>
            )}
        </div>
    );
}
