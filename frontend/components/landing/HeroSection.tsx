'use client';

import React from 'react';
import { CredynxAnim } from './CredynxAnim';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export const HeroSection = () => {
    return (
        <div className="relative h-screen w-full flex flex-col justify-between overflow-hidden">
            {/* Top Half - 50% Height */}
            <div className="h-[50%] w-full relative flex flex-col">
                {/* Content Area */}
                <div className="flex-1 flex flex-col items-center justify-center z-10">
                   {/* Main nav or top content could go here if needed */}
                </div>

                {/* Subheading Area - Bottom 10% of Top 50% (approx 10-20% of this container) */}
                {/* 
                   "For the bottom 10% of top 50%, there will be subheading which will say, The Underground Circuit of Web3."
                   This implies it sits right at the bottom edge of the top half.
                */}
                <div className="h-[20%] flex flex-col items-center justify-end pb-4 z-10 px-4 text-center">
                    <h2 className="text-xl md:text-2xl text-muted-foreground font-medium tracking-wide">
                        The Underground Circuit of Web3
                    </h2>
                </div>
            </div>

            {/* Bottom Half - 50% Height */}
            <div className="h-[50%] w-full relative flex flex-col justify-end items-center">
                {/* 
                   User requested: "height to 45% of hero section window"
                   45% of 100vh = 45vh.
                   This container is 50vh (bottom half).
                   So we need 45vh out of 50vh = 90% of this container.
                */}
                <div className="h-[90%] w-full flex items-center justify-center z-10">
                     <CredynxAnim />
                </div>
            </div>
            
            {/* CTA/Buttons - Floating or integrated? 
               The prompt didn't strictly specify removing the buttons, but "Update the hero section... with the following" usually implies replacing content.
               However, a landing page needs CTAs. I should probably keep them or place them nicely.
               The prompt focused on visual layout of Title/Subheading.
               I'll place the CTAs comfortably in the middle or below the subheading.
               Given the strict percentage for subheading (bottom of top half), 
               maybe CTAs go above subheading or completely overlaying?
               Let's put CTAs in the center of the screen (top of bottom half?)
               Or maybe just below subheading.
               I'll add them in a logical place between the two visual anchors.
            */}
             <div className="absolute top-[58%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                 <Link href="/register">
                  <Button size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
                    Get Started
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/login">
                  <Button size="lg" variant="outline" className="w-full sm:w-auto backdrop-blur-sm bg-background/50">
                    Sign In
                  </Button>
                </Link>
            </div>
        </div>
    );
};
