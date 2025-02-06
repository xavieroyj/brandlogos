"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download, Loader2 } from "lucide-react";
import Image from 'next/image';
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface IconDisplayProps {
  icons?: Array<{
    url: string;
    id: string;
  }>;
  isLoading?: boolean;
  onSelect?: (index: number) => void;
  selectedIndex?: number;
  size?: 'compact' | 'default';
}

export function IconDisplay({
  icons = [],
  isLoading = false,
  onSelect,
  selectedIndex,
  size = 'default'
}: IconDisplayProps) {
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  async function handleDownload(imageUrl: string, index: number) {
    try {
      setDownloadingIndex(index);
      
      const response = await fetch('/api/generate-favicon', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ imageUrl }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate favicon package');
      }

      const data = await response.json();
      
      const binaryStr = atob(data.base64Zip);
      const len = binaryStr.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryStr.charCodeAt(i);
      }
      
      const blob = new Blob([bytes], { type: 'application/zip' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'favicon-package.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Success",
        description: "Favicon package downloaded successfully",
      });
    } catch (error) {
      console.error('Failed to generate favicon package:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to generate favicon package",
        variant: "destructive",
      });
    } finally {
      setDownloadingIndex(null);
    }
  }

  const isCompact = size === 'compact';

  if (isLoading) {
    return (
      <div className={cn("grid gap-2", isCompact ? "grid-cols-4" : "grid-cols-2")}>
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className={cn(
            "aspect-square bg-black/30 border-purple-500/10",
            isCompact ? "p-1" : "p-4"
          )}>
            <Skeleton className="w-full h-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (icons.length === 0) {
    return (
      <Card className={cn(
        "aspect-square flex items-center justify-center text-center text-muted-foreground bg-black/30 border-purple-500/10",
        isCompact ? "p-2 text-xs" : "p-8"
      )}>
        Generated icons will appear here
      </Card>
    );
  }

  return (
    <div className={cn("grid gap-2", isCompact ? "grid-cols-4" : "grid-cols-2")}>
      {icons.map((icon, index) => (
        <Card
          key={icon.id}
          className={cn(
            "aspect-square cursor-pointer transition-all hover:border-purple-500/30 bg-black/30",
            "group relative overflow-hidden",
            selectedIndex === index ? [
              "ring-2 ring-purple-500",
              "shadow-[0_0_20px_rgba(147,51,234,0.3)]",
              "hover:shadow-[0_0_30px_rgba(147,51,234,0.4)]"
            ] : "border-purple-500/10",
            isCompact ? "p-1" : "p-4"
          )}
          onClick={() => onSelect?.(index)}
        >
          <Image
            src={icon.url}
            alt={`Generated icon ${index + 1}`}
            width={512}
            height={512}
            className="w-full h-full object-contain rounded-md"
            onError={(e) => {
              console.error(`Error loading image ${index}:`, e);
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              target.parentElement?.insertAdjacentHTML(
                'beforeend',
                '<div class="w-full h-full flex items-center justify-center text-destructive text-xs">Failed to load</div>'
              );
            }}
          />
          <div className={cn(
            "absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity",
            "flex items-center justify-center"
          )}>
            {selectedIndex === index && (
              <Button
                size="sm"
                variant="ghost"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(icon.url, index);
                }}
                disabled={downloadingIndex !== null}
                className={cn(
                  "text-white hover:text-purple-400",
                  isCompact && "h-6 px-2 text-xs"
                )}
              >
                {downloadingIndex === index ? (
                  <>
                    <Loader2 className={cn("mr-1 animate-spin", isCompact ? "h-3 w-3" : "h-4 w-4")} />
                    <span className="sr-only">Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className={cn("h-4 w-4")} />
                    <span className="sr-only">Download</span>
                  </>
                )}
              </Button>
            )}
          </div>
        </Card>
      ))}
    </div>
  );
}