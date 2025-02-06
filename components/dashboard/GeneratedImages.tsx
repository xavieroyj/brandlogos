"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Clock, Tag } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { getUserImages } from "@/app/actions/get-user-images";
import { useInView } from "react-intersection-observer";
import { IconDisplay } from "@/components/IconDisplay";
import { cn } from "@/lib/utils";

interface GeneratedImage {
  id: string;
  url: string;
  createdAt: string;
}

interface GenerationSession {
  id: string;
  brandName: string;
  style: string;
  prompt: string;
  tags: string[];
  createdAt: string;
  images: GeneratedImage[];
}

interface GeneratedImagesProps {
  userId: string;
}

export function GeneratedImages({ userId }: GeneratedImagesProps) {
  const [sessions, setSessions] = useState<GenerationSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [nextCursor, setNextCursor] = useState<string | undefined>();
  const [hasMore, setHasMore] = useState(true);
  const [selectedImageIndices, setSelectedImageIndices] = useState<Record<string, number>>({});
  const { ref: loadMoreRef, inView } = useInView();

  const loadImages = useCallback(async (cursor?: string) => {
    try {
      setError(null);
      const data = await getUserImages(userId, { cursor, limit: 12 });

      if (cursor) {
        setSessions(prev => [...prev, ...data.sessions]);
      } else {
        setSessions(data.sessions);
      }

      setNextCursor(data.pagination.nextCursor);
      setHasMore(!!data.pagination.nextCursor);
    } catch (error) {
      console.error('Failed to fetch images:', error);
      setError('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    setIsLoading(true);
    loadImages();
  }, [loadImages]);

  useEffect(() => {
    if (inView && hasMore && !isLoading) {
      loadImages(nextCursor);
    }
  }, [inView, hasMore, isLoading, nextCursor, loadImages]);

  if (error) {
    return (
      <div className="rounded-lg bg-red-500/10 border border-red-500/20 p-4">
        <p className="text-center text-sm text-red-400">{error}</p>
      </div>
    );
  }

  if (isLoading && sessions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <Loader2 className="h-6 w-6 animate-spin text-purple-500" />
      </div>
    );
  }

  if (sessions.length === 0) {
    return (
      <div className="min-h-[200px] rounded-lg bg-black/30 border border-purple-500/20 flex items-center justify-center">
        <p className="text-center text-sm text-gray-400">
          No images generated yet. Try creating some logos!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sessions.map((session) => (
          <Card 
            key={session.id} 
            className={cn(
              "group relative overflow-hidden",
              "bg-black/30 border-purple-500/10",
              "hover:shadow-[0_0_30px_rgba(147,51,234,0.2)]",
              "transition-all duration-300"
            )}
          >
            <CardContent className="p-3">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-medium text-sm bg-gradient-to-r from-purple-400 to-pink-600 bg-clip-text text-transparent">
                    {session.brandName}
                  </h3>
                  <div className="flex items-center gap-1 mt-0.5">
                    <Clock className="h-3 w-3 text-gray-400" />
                    <span className="text-[10px] text-gray-400">
                      {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <Tag className="h-3 w-3 text-purple-400/60" />
                  <div className="flex flex-wrap gap-1">
                    {session.tags.slice(0, 3).map((tag) => (
                      <span 
                        key={tag} 
                        className="text-[10px] bg-purple-500/10 text-purple-300/60 px-1.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                    {session.tags.length > 3 && (
                      <span className="text-[10px] text-purple-300/60">
                        +{session.tags.length - 3}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <IconDisplay 
                size="compact"
                icons={session.images.map(img => ({
                  url: img.url,
                  id: img.id
                }))}
                selectedIndex={selectedImageIndices[session.id]}
                onSelect={(index) => setSelectedImageIndices(prev => ({
                  ...prev,
                  [session.id]: index
                }))}
              />
            </CardContent>
          </Card>
        ))}
      </div>

      {hasMore && (
        <div ref={loadMoreRef} className="flex justify-center py-2">
          <Loader2 className="h-4 w-4 animate-spin text-purple-500" />
        </div>
      )}
    </div>
  );
}
