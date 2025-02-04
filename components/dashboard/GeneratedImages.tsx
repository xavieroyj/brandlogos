"use client";

import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDistanceToNow } from "date-fns";

interface GeneratedImage {
  id: string;
  url: string;
  brandName: string;
  style: string;
  createdAt: string;
}

interface GeneratedImagesProps {
  userId: string;
}

export function GeneratedImages({ userId }: GeneratedImagesProps) {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchImages = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(`/api/users/${userId}/images`);
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      const data = await response.json();
      setImages(data);
    } catch (error) {
      console.error('Failed to fetch images:', error);
      setError('Failed to load images');
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

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
        ) : images.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No images generated yet. Try creating some logos!
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="group relative">
                <div className="aspect-square relative overflow-hidden rounded-lg bg-gray-900/50">
                  <Image
                    src={image.url}
                    alt={`${image.brandName} logo`}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownload(image.url, image.brandName)}
                      className="text-white hover:text-purple-400"
                    >
                      <Download className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-sm font-medium text-white truncate">{image.brandName}</p>
                  <p className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(image.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 