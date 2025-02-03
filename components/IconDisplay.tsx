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
  icons?: string[];
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

  async function handleDownload(base64Image: string, index: number) {
    try {
      setDownloadingIndex(index);
      const zip = await generateFaviconPackage(base64Image);
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
          <Card  key={i} className="aspect-square p-4">
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
      {icons.map((icon, index) => (
        <Card
          key={index}
          className={`aspect-square p-4 cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${
            selectedIndex === index ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelect?.(index)}
        >
          <div className="relative w-full h-full">
            <Image
              src={`data:image/png;base64,${icon}`}
              alt={`Generated icon ${index + 1}`}
              width={1024}
              height={1024}
              className="w-full h-full object-contain rounded-lg"
            />
            {selectedIndex === index && (
              <div className="absolute bottom-2 right-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDownload(icon, index);
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
      ))}
    </div>
  );
}