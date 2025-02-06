"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";

export const IconScroller = ({
  icons,
  direction = "left",
  speed = "normal",
  pauseOnHover = true,
  className,
}: {
  icons: {
    src: string;
    alt: string;
  }[];
  direction?: "left" | "right";
  speed?: "fast" | "normal" | "slow";
  pauseOnHover?: boolean;
  className?: string;
}) => {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const scrollerRef = React.useRef<HTMLUListElement>(null);
  const [start, setStart] = useState(false);

  useEffect(() => {
    addAnimation();
  }, []);

  function addAnimation() {
    if (containerRef.current && scrollerRef.current) {
      const scrollerContent = Array.from(scrollerRef.current.children);

      scrollerContent.forEach((item) => {
        const duplicatedItem = item.cloneNode(true);
        if (scrollerRef.current) {
          scrollerRef.current.appendChild(duplicatedItem);
        }
      });

      getDirection();
      getSpeed();
      setStart(true);
    }
  }

  const getDirection = () => {
    if (containerRef.current) {
      if (direction === "left") {
        containerRef.current.style.setProperty("--animation-direction", "forwards");
      } else {
        containerRef.current.style.setProperty("--animation-direction", "reverse");
      }
    }
  };

  const getSpeed = () => {
    if (containerRef.current) {
      if (speed === "fast") {
        containerRef.current.style.setProperty("--animation-duration", "20s");
      } else if (speed === "normal") {
        containerRef.current.style.setProperty("--animation-duration", "40s");
      } else {
        containerRef.current.style.setProperty("--animation-duration", "80s");
      }
    }
  };

  return (
    <div
      ref={containerRef}
      className={cn(
        "scroller relative z-20 max-w-7xl overflow-hidden outline-none [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]",
        className
      )}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex min-w-full shrink-0 gap-16 py-4 w-max flex-nowrap outline-none",
          start && "animate-scroll scroll",
          pauseOnHover && "hover:[animation-play-state:paused]"
        )}
      >
        {icons.map((icon, idx) => (
          <li
            key={idx}
            className="w-36 h-36 relative flex-shrink-0 rounded-xl overflow-hidden bg-background/2 border border-border/20 backdrop-blur-sm hover:border-border/50 transition-colors outline-none focus:outline-none"
          >
            <img
              src={icon.src}
              alt={icon.alt}
              className="w-full h-full object-cover"
            />
          </li>
        ))}
      </ul>
    </div>
  );
};