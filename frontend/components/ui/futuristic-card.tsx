"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";

interface FuturisticCardProps {
  children: React.ReactNode;
  className?: string;
  chamferSize?: number;
  strokeColor?: string;
  strokeWidth?: number;
  showSpotlight?: boolean;
  hoverEffect?: boolean;
}

export const FuturisticCard = ({
  children,
  className,
  chamferSize = 24,
  strokeColor = "#F97316",
  strokeWidth = 2,
  showSpotlight = true,
  hoverEffect = true,
}: FuturisticCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    
    const resizeObserver = new ResizeObserver(() => {
      if (cardRef.current) {
        setDimensions({
          width: cardRef.current.offsetWidth,
          height: cardRef.current.offsetHeight,
        });
      }
    });

    resizeObserver.observe(cardRef.current);
    return () => resizeObserver.disconnect();
  }, []);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    if (!hoverEffect) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  // SVG path for chamfered border
  const getPath = (w: number, h: number, c: number) => {
    const o = strokeWidth / 2;
    return `M ${o} ${o} 
            L ${w - c - o} ${o} 
            L ${w - o} ${c + o} 
            L ${w - o} ${h - o} 
            L ${c + o} ${h - o} 
            L ${o} ${h - c - o} Z`;
  };

  const spotlightBackground = useMotionTemplate`
    radial-gradient(
      600px circle at ${mouseX}px ${mouseY}px,
      rgba(249, 115, 22, 0.15),
      transparent 80%
    )
  `;

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className={cn(
        "group relative overflow-hidden bg-black/50 backdrop-blur-md transition-all duration-500",
        hoverEffect && "hover:bg-white/5",
        className
      )}
      style={{
        clipPath: `polygon(0 0, calc(100% - ${chamferSize}px) 0, 100% ${chamferSize}px, 100% 100%, ${chamferSize}px 100%, 0 calc(100% - ${chamferSize}px))`,
      }}
    >
      {/* Animated Border */}
      <svg
        className="absolute inset-0 pointer-events-none z-20"
        width="100%"
        height="100%"
      >
        <path
          d={getPath(dimensions.width, dimensions.height, chamferSize)}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* Spotlight Effect */}
      {showSpotlight && hoverEffect && (
        <motion.div
          className="pointer-events-none absolute -inset-px opacity-0 transition duration-300 group-hover:opacity-100 z-10"
          style={{
            background: spotlightBackground,
          }}
        />
      )}

      <div className="relative z-30 h-full">
        {children}
      </div>
    </div>
  );
};
