"use client";

import { Sparkles, RefreshCcw } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { getUserCredits } from "@/app/actions/manage-credits";
import { formatDistanceToNow } from "date-fns";
import { cn } from "@/lib/utils";

interface CreditDisplayProps {
    userId: string;
}

interface UserCredits {
    total: number;
    used: number;
    remaining: number;
    resetDate: string;
    tier: keyof typeof TIER_CONFIGS;
    monthlyCredits: number | null;
    subscription: {
        status: string;
        currentPeriodEnd: string;
    } | null;
}

const TIER_CONFIGS = {
    FREE: {
        color: 'text-gray-400',
        gradient: 'from-gray-400 to-gray-600',
        glow: 'rgba(156,163,175,0.2)'
    },
    PRO: {
        color: 'text-purple-400',
        gradient: 'from-purple-400 to-pink-600',
        glow: 'rgba(147,51,234,0.2)'
    },
    ENTERPRISE: {
        color: 'text-yellow-400',
        gradient: 'from-yellow-400 to-orange-600',
        glow: 'rgba(251,191,36,0.2)'
    }
} as const;

export function CreditDisplay({ userId }: CreditDisplayProps) {
    const [credits, setCredits] = useState<UserCredits | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchCredits = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const data = await getUserCredits(userId);
            setCredits(data);
        } catch (error) {
            console.error('Failed to fetch credits:', error);
            setError(error instanceof Error ? error.message : 'Failed to load credits');
        } finally {
            setIsLoading(false);
        }
    }, [userId]);

    useEffect(() => {
        fetchCredits();
    }, [fetchCredits]);

    if (error) {
        return (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
                <p className="text-center text-sm text-red-400">{error}</p>
            </div>
        );
    }

    const tierConfig = credits ? TIER_CONFIGS[credits.tier] : TIER_CONFIGS.FREE;

    return (
        <Card className={cn(
            "overflow-hidden relative bg-black/30",
            "border-purple-500/10 hover:border-purple-500/20",
            "transition-all duration-300"
        )}>
            <div className="absolute inset-0 bg-gradient-to-br from-black/50 to-transparent" />
            <CardContent className="relative p-4">
                <div className="flex justify-between items-start">
                    <div className="space-y-1">
                        <div className="flex items-center gap-2">
                            <h3 className="text-sm font-medium">Credits Balance</h3>
                            {credits && (
                                <span className={cn(
                                    "text-xs px-2 py-0.5 rounded-full",
                                    "bg-gradient-to-r",
                                    `bg-clip-text text-transparent bg-gradient-to-r ${tierConfig.gradient}`
                                )}>
                                    {credits.tier === 'FREE' ? 'Free Plan' :
                                        credits.tier === 'PRO' ? 'Pro Plan' : 'Enterprise Plan'}
                                </span>
                            )}
                        </div>
                        <div className="flex items-baseline gap-1">
                            <span className="text-2xl font-bold">
                                {isLoading ? '-' : credits?.remaining}
                            </span>
                            <span className="text-xs text-gray-400">credits left today</span>
                        </div>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => fetchCredits()}
                        disabled={isLoading}
                        className="h-8 w-8 text-purple-500 hover:text-purple-400"
                    >
                        <RefreshCcw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                    </Button>
                </div>

                <div className="mt-4 space-y-1">
                    <div className="h-1.5 w-full bg-purple-500/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-in-out"
                            style={{
                                width: `${isLoading || !credits ? 0 : (credits.used / credits.total * 100)}%`
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-[10px] text-gray-400">
                        <span>{isLoading ? '-' : credits?.used} used</span>
                        <span>{isLoading ? '-' : credits?.total} daily limit</span>
                    </div>
                </div>

                {credits && (
                    <div className="mt-3 pt-3 border-t border-purple-500/10 grid grid-cols-3 gap-2 text-[10px]">
                        <div>
                            <span className="block text-gray-400">Monthly</span>
                            <span className="font-medium">{credits.monthlyCredits?.toLocaleString() ?? 0}</span>
                        </div>
                        {credits.subscription && (
                            <div>
                                <span className="block text-gray-400">Renews</span>
                                <span className="font-medium">
                                    {formatDistanceToNow(new Date(credits.subscription.currentPeriodEnd), { addSuffix: true })}
                                </span>
                            </div>
                        )}
                        <div>
                            <span className="block text-gray-400">Resets</span>
                            <span className="font-medium">
                                {formatDistanceToNow(new Date(credits.resetDate), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
