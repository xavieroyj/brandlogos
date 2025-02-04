"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";
import { getUserImages } from "@/app/actions/get-user-images";

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

  useEffect(() => {
    async function loadImages() {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getUserImages(userId);
        setSessions(data);
      } catch (error) {
        console.error('Failed to fetch images:', error);
        setError('Failed to load images');
      } finally {
        setIsLoading(false);
      }
    }

    loadImages();
  }, [userId]);

  const handleDownload = async (url: string, brandName: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${brandName}-logo.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Failed to download image:', error);
    }
  };

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
      <CardHeader>
        <CardTitle className="text-lg font-medium">Generated Images</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-purple-500" />
          </div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No images generated yet. Try creating some logos!
          </div>
        ) : (
          <div className="space-y-8">
            {sessions.map((session) => (
              <Card key={session.id} className="bg-black/30 border-purple-500/10">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <div>
                      <span className="text-lg font-medium">{session.brandName}</span>
                      <span className="ml-2 text-sm text-gray-400">
                        {formatDistanceToNow(new Date(session.createdAt), { addSuffix: true })}
                      </span>
                    </div>
                  </CardTitle>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-400">{session.prompt}</p>
                    <div className="flex flex-wrap gap-2">
                      {session.tags.map((tag) => (
                        <span key={tag} className="text-xs bg-purple-500/10 text-purple-300 px-2 py-1 rounded">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {session.images.map((image) => (
                      <div key={image.id} className="group relative">
                        <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-900/50">
                          <Image
                            src={image.url}
                            alt={`${session.brandName} logo`}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDownload(image.url, session.brandName)}
                              className="text-white hover:text-purple-400"
                            >
                              <Download className="h-5 w-5" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
