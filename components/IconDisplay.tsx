"use client";

import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import Image from 'next/image'

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
      {icons.map((icon, index) => (
        <Card
          key={index}
          className={`aspect-square p-4 cursor-pointer transition-all hover:ring-2 hover:ring-primary/50 ${
            selectedIndex === index ? "ring-2 ring-primary" : ""
          }`}
          onClick={() => onSelect?.(index)}
        >
          <Image
            src={`data:image/png;base64,${icon}`}
            alt={`Generated icon ${index + 1}`}
            className="w-full h-full object-contain rounded-lg"
          />
        </Card>
      ))}
    </div>
  );
}