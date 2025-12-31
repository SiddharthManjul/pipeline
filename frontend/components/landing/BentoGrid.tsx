"use client";

import React, { useRef, useState, useEffect } from "react";
import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { cn } from "@/lib/utils";
import { Code2, Users, TrendingUp, Lightbulb, MessageSquare, LucideIcon } from "lucide-react";

interface BentoCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  className?: string;
  index: number;
}

const BentoCard = ({ title, description, icon: Icon, className, index }: BentoCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;
    const updateDimensions = () => {
      if (cardRef.current) {
        setDimensions({
          width: cardRef.current.offsetWidth,
          height: cardRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  function handleMouseMove({ currentTarget, clientX, clientY }: React.MouseEvent) {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const chamferSize = 24;
  const strokeWidth = 2;

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

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      viewport={{ once: true }}
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden  bg-transparent transition-all duration-500 hover:bg-white/5",
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
          stroke="#F97316"
          strokeWidth={strokeWidth}
        />
      </svg>

      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px opacity-10 transition duration-300 group-hover:opacity-100 z-10"
        style={{
          background: useMotionTemplate`
            radial-gradient(
              800px circle at ${mouseX}px ${mouseY}px,
              rgba(249, 115, 22, 0.15),
              transparent 80%
            )
          `,
        }}
      />

      <div className="relative z-30 p-8 flex flex-col h-full">
        <div className="mb-6 inline-flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 text-primary transition-all duration-500 group-hover:scale-110 group-hover:bg-primary/20">
          <Icon className="h-8 w-8" />
        </div>

        <div className="mt-auto">
          <h3 className="text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-primary transition-colors duration-300">
            {title}
          </h3>
          <p className="text-base text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>

      {/* Background patterns/effects */}
      <div className="absolute bottom-0 right-0 p-4 opacity-5 transition-transform duration-500 group-hover:scale-[2] group-hover:opacity-10">
        <Icon className="h-32 w-32 text-primary" />
      </div>
    </motion.div>
  );
};

export const BentoGrid = () => {
  const globalRef = useRef<HTMLDivElement>(null);
  const [globalDimensions, setGlobalDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (!globalRef.current) return;
    const updateDimensions = () => {
      if (globalRef.current) {
        setGlobalDimensions({
          width: globalRef.current.offsetWidth,
          height: globalRef.current.offsetHeight,
        });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  const features = [
    {
      title: "For Developers",
      description: "Showcase your projects, build reputation, and get discovered by top Web3 founders",
      icon: Code2,
      className: "md:col-span-2 md:row-span-1",
    },
    {
      title: "For Founders",
      description: "Find vetted developers based on real contributions, not just resumes",
      icon: Users,
      className: "md:col-span-2 md:row-span-1",
    },
    {
      title: "Reputation-Based",
      description: "Merit-based matching using GitHub contributions, projects, and community vouches",
      icon: TrendingUp,
      className: "md:col-span-2 md:row-span-1",
    },
    {
      title: "Ideas",
      description: "Share and discover innovative project ideas, get feedback from the community, and find collaborators",
      icon: Lightbulb,
      className: "md:col-span-3 md:row-span-1",
    },
    {
      title: "Forum",
      description: "Engage in discussions about Web3, blockchain technology, and the wider tech ecosystem",
      icon: MessageSquare,
      className: "md:col-span-3 md:row-span-1",
    },
  ];

  const globalChamferSize = 48;
  const globalStrokeWidth = 2;

  const getGlobalPath = (w: number, h: number, c: number) => {
    const o = globalStrokeWidth / 2;
    return `M ${o} ${o} 
            L ${w - c - o} ${o} 
            L ${w - o} ${c + o} 
            L ${w - o} ${h - o} 
            L ${c + o} ${h - o} 
            L ${o} ${h - c - o} Z`;
  };

  return (
    <div
      ref={globalRef}
      className="relative py-12 px-12 overflow-hidden mx-4 md:mx-16 lg:mx-32 bg-black/50 backdrop-blur-md"
      style={{
        clipPath: `polygon(0 0, calc(100% - ${globalChamferSize}px) 0, 100% ${globalChamferSize}px, 100% 100%, ${globalChamferSize}px 100%, 0 calc(100% - ${globalChamferSize}px))`,
      }}
    >

      {/* Global SVG Border */}
      <svg
        className="absolute inset-0 pointer-events-none z-20"
        width="100%"
        height="100%"
      >
        <path
          d={getGlobalPath(globalDimensions.width, globalDimensions.height, globalChamferSize)}
          fill="none"
          stroke="#F97316"
          strokeWidth={globalStrokeWidth}
        />
      </svg>

      <div className="container mx-auto relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 mx-auto auto-rows-[280px]">
          {features.map((feature, i) => (
            <BentoCard key={feature.title} {...feature} index={i} />
          ))}
        </div>
      </div>
    </div>
  );
};
