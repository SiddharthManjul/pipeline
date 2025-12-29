'use client';

import React, { useEffect, useRef } from 'react';
import { animate, svg, stagger } from 'animejs';

export const CredynxAnim = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const lines = containerRef.current.querySelectorAll('.line');
    const drawable = svg.createDrawable(lines);

    const animation = animate(drawable, {
      draw: ['0 0', '0 1', '1 1'],
      ease: 'inOutQuad', 
      duration: 2000,
      delay: stagger(100),
      loop: true
    });

    return () => {
      animation.pause();
    };
  }, []);

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 1100 350"
        className="w-full h-full text-primary"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <style>
            {`
              .credynx-text {
                font-family: 'Oxanium', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
                font-weight: 700;
                font-size: 360px;
                letter-spacing: -0.02em;
              }
            `}
          </style>
        </defs>
        <text
          x="50%"
          y="50%"
          textAnchor="middle"
          dominantBaseline="middle"
          className="line credynx-text"
          stroke="currentColor"
          fill="none"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          Credynx
        </text>
      </svg>
    </div>
  );
};
