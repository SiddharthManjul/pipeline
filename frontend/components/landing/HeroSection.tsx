'use client';

import React from 'react';
import { CredynxAnim } from './CredynxAnim';
import { FuturisticButton } from '@/components/ui/futuristic-button';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
export const HeroSection = () => {
    return (
        <div className="relative h-screen w-full overflow-hidden">
            {/* Content Layer */}
            <div className="relative z-10 h-full w-full flex flex-col justify-between">
                {/* Top Half - 50% Height */}
                <div className="h-[45%] w-full relative flex flex-col">
                    {/* Content Area */}
                    <div className="flex-1 flex flex-col items-center justify-center">
                       {/* Main nav or top content could go here if needed */}
                    </div>

                    {/* Subheading Area - Bottom 10% of Top 50% */}
                    <div className="h-[20%] flex flex-col items-center justify-end pb-4 px-4 text-center">
                        <h2 className="text-4xl md:text-5xl text-muted-foreground font-medium tracking-wide uppercase">
                            The Underground Circuit of <span className="text-primary">Web3</span>
                        </h2>
                    </div>
                </div>

                {/* Bottom Half - 50% Height */}
                <div className="h-[50%] w-full relative flex flex-col justify-end items-center">
                    {/* Credynx Animation - 90% of bottom half */}
                    <div className="h-[90%] w-full flex items-center justify-center">
                         <CredynxAnim />
                    </div>
                </div>
                
                {/* CTA Buttons - Centered */}
                <div className="absolute top-[48%] left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                     <Link href="/register">
                      <FuturisticButton size="lg" variant="outline" className="w-full sm:w-auto backdrop-blur-sm bg-background/50" borderColor='rgba(255, 0, 0, 1)'>
                        Get Started
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </FuturisticButton>
                    </Link>
                    <Link href="/login">
                      <FuturisticButton size="lg" variant="outline" className="w-full sm:w-auto backdrop-blur-sm bg-background/50" borderColor='rgba(255, 0, 0, 1)'>
                        Sign In
                      </FuturisticButton>
                    </Link>
                </div>
            </div>
        </div>
    );
};
