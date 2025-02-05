"use client";

import { Sparkles, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCallback, useEffect, useState } from "react";
import { getUserCredits } from "@/app/actions/manage-credits";
import { formatDistanceToNow } from "date-fns";

interface CreditDisplayProps {
    userId: string;
}

interface UserCredits {
    total: number;
    used: number;
    remaining: number;
    resetDate: string;
    tier: keyof typeof TIER_COLORS;
    monthlyCredits: number | null;
    subscription: {
        status: string;
        currentPeriodEnd: string;
    } | null;
}

const TIER_COLORS = {
    FREE: 'text-gray-400',
    PRO: 'text-purple-400',
    ENTERPRISE: 'text-yellow-400'
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
            <Card className="bg-black/50 border-red-500/20">
                <CardContent className="pt-6">
                    <div className="text-center text-red-400">{error}</div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="bg-black/50 border-purple-500/20">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div className="flex items-center space-x-2">
                    <CardTitle className="text-lg font-medium">Credits Balance</CardTitle>
                    {credits && (
                        <span className={`text-sm ${TIER_COLORS[credits.tier]}`}>
                            {credits.tier === 'FREE' ? 'Free Plan' :
                                credits.tier === 'PRO' ? 'Pro Plan' : 'Enterprise Plan'}
                        </span>
                    )}
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
            </CardHeader>
            <CardContent>
                <div className="flex items-center space-x-4">
                    <div className="p-2 bg-purple-500/10 rounded-full">
                        <Sparkles className="h-8 w-8 text-purple-500" />
                    </div>
                    <div className="space-y-1">
                        <p className="text-3xl font-bold text-white">
                            {isLoading ? '-' : credits?.remaining}
                        </p>
                        <p className="text-xs text-gray-400">
                            credits remaining today
                        </p>
                    </div>
                </div>

                {/* Progress bar */}
                <div className="mt-4 space-y-2">
                    <div className="h-2 w-full bg-purple-500/10 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-purple-500 transition-all duration-500 ease-in-out"
                            style={{
                                width: `${isLoading || !credits ? 0 : (credits.used / credits.total * 100)}%`
                            }}
                        />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                        <span>{isLoading ? '-' : credits?.used} used</span>
                        <span>{isLoading ? '-' : credits?.total} daily limit</span>
                    </div>
                </div>

                {/* Monthly credits info */}
                {credits && (
                    <div className="mt-4 pt-4 border-t border-white/10">
                        <div className="flex justify-between items-center text-sm">
                            <span className="text-gray-400">Monthly credits:</span>
                            <span className="text-white font-medium">
                                {credits.monthlyCredits?.toLocaleString() ?? 0}
                            </span>
                        </div>
                        {credits.subscription && (
                            <div className="flex justify-between items-center text-sm mt-2">
                                <span className="text-gray-400">Plan renews:</span>
                                <span className="text-white font-medium">
                                    {formatDistanceToNow(new Date(credits.subscription.currentPeriodEnd), { addSuffix: true })}
                                </span>
                            </div>
                        )}
                        <div className="flex justify-between items-center text-sm mt-2">
                            <span className="text-gray-400">Credits reset:</span>
                            <span className="text-white font-medium">
                                {formatDistanceToNow(new Date(credits.resetDate), { addSuffix: true })}
                            </span>
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
