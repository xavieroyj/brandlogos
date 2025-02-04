"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Download } from "lucide-react";
import Image from 'next/image';
import { generateFaviconPackage, downloadZip } from "@/lib/download/favicon-generator";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

interface IconDisplayProps {
  icons?: Array<{
    url: string;
    id: string;
  }>;
  isLoading?: boolean;
  onSelect?: (index: number) => void;
  selectedIndex?: number;
}

export function IconDisplay({
  icons = [],
  isLoading = false,
  onSelect,
  selectedIndex,
}: IconDisplayProps) {
  const [downloadingIndex, setDownloadingIndex] = useState<number | null>(null);
  const { toast } = useToast();

  // Debug logging
  console.log('IconDisplay received icons:', icons);

  async function handleDownload(imageUrl: string, index: number) {
    try {
      setDownloadingIndex(index);
      
      // Fetch the image from S3
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const base64 = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(blob);
      });

      // Remove data URL prefix
      const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
      
      const zip = await generateFaviconPackage(base64Data);
      downloadZip(zip, 'favicon-package.zip');
      
      toast({
        title: "Success",
        description: "Favicon package downloaded successfully",
      });
    } catch (error) {
      console.error('Failed to generate favicon package:', error);
      toast({
        title: "Error",
        description: "Failed to generate favicon package",
        variant: "destructive",
      });
    } finally {
      setDownloadingIndex(null);
    }
  }

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="aspect-square p-4">
            <Skeleton className="w-full h-full" />
          </Card>
        ))}
      </div>
    );
  }

  if (icons.length === 0) {
    return (
      <Card className="aspect-square flex items-center justify-center p-8 text-center text-muted-foreground">
        Generated icons will appear here
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4">
      {icons.map((icon, index) => {
        // Debug logging for each icon
        console.log(`Processing icon ${index}:`, icon.url);
        
        return (
          <Card
            key={icon.id}
            className={`aspect-square p-4 cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${
              selectedIndex === index ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => onSelect?.(index)}
          >
            <div className="relative w-full h-full">
              <Image
                src={icon.url}
                alt={`Generated icon ${index + 1}`}
                width={1024}
                height={1024}
                className="w-full h-full object-contain rounded-lg"
                onError={(e) => {
                  console.error(`Error loading image ${index}:`, e);
                  // Fallback to a div with error message
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.parentElement?.insertAdjacentHTML(
                    'beforeend',
                    '<div class="w-full h-full flex items-center justify-center text-destructive">Failed to load image</div>'
                  );
                }}
              />
              {selectedIndex === index && (
                <div className="absolute bottom-2 right-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(icon.url, index);
                    }}
                    disabled={downloadingIndex !== null}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    {downloadingIndex === index ? "Generating..." : "Download"}
                  </Button>
                </div>
              )}
            </div>
          </Card>
        );
      })}
    </div>
  );
}