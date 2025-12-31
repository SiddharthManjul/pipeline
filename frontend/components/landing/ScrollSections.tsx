/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowBigDownDash, ArrowBigRightIcon, ArrowRight, ArrowRightCircle, ArrowRightCircleIcon } from 'lucide-react';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { ReputationDiagram } from './diagrams/ReputationDiagram';
import { MatchingDiagram } from './diagrams/MatchingDiagram';
import { CommunityDiagram } from './diagrams/CommunityDiagram';

interface Section {
  id: string;
  headline: string;
  text: string;
  linkText: string;
  linkHref: string;
  diagram: React.ReactNode;
}

const sections: Section[] = [
  {
    id: 'reputation',
    headline: 'Build Your Reputation',
    text: 'Showcase your GitHub contributions, projects, and achievements. Our reputation system evaluates your real work, not just your resume.',
    linkText: 'Learn More',
    linkHref: '#reputation',
    diagram: <ReputationDiagram />,
  },
  {
    id: 'matching',
    headline: 'Smart Job Matching',
    text: 'Get matched with opportunities that align with your skills and experience. Our algorithm connects you with the right founders and projects.',
    linkText: 'Explore Jobs',
    linkHref: '#matching',
    diagram: <MatchingDiagram />,
  },
  {
    id: 'community',
    headline: 'Join the Community',
    text: 'Connect with other Web3 developers and founders. Share ideas, get vouched by peers, and participate in hackathons.',
    linkText: 'Get Started',
    linkHref: '#community',
    diagram: <CommunityDiagram />,
  },
];

export const ScrollSections = () => {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      if (!containerRef.current) return;

      const containerTop = containerRef.current.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;

      sectionRefs.current.forEach((ref, index) => {
        if (!ref) return;

        const rect = ref.getBoundingClientRect();
        const sectionBottom = rect.bottom;

        // When section bottom crosses 50% of screen, activate it
        if (sectionBottom > windowHeight * 0.5 && sectionBottom < windowHeight * 1.5) {
          setActiveSection(index);
        }
      });
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (index: number) => {
    sectionRefs.current[index]?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className="relative py-24">
      {/* Main Content */}
      <div ref={containerRef} className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Side - Sticky Content */}
          <div className="lg:sticky lg:top-24 lg:self-start max-h-[85vh] flex flex-col justify-between py-8">
            {/* Main Content */}
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-4 mb-8"
            >
              <h2 className="text-4xl font-bold">
                {sections[activeSection].headline}
              </h2>
              <p className="text-lg leading-relaxed">
                {sections[activeSection].text}
              </p>
              <div>
                <Button
                  size="lg"
                  variant="outline"
                  className="backdrop-blur-sm bg-background/50"
                  borderColor="rgba(255, 0, 0, 1)"
                  onClick={() => window.location.href = sections[activeSection].linkHref}
                >
                  {sections[activeSection].linkText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </motion.div>

            {/* Navigation Links - Bottom of sticky side */}
            <div className="space-y-2 mt-102">
              {sections.map((section, index) => (
                <button
                  key={section.id}
                  onClick={() => scrollToSection(index)}
                  className={`w-full p-3 transition-all duration-300 text-left flex items-center justify-between group ${
                    activeSection === index
                      ? 'text-[#F97316]'
                      : 'text-muted-foreground hover:text-primary'
                  }`}
                >
                  <h3 className="text-2xl font-bold flex items-center gap-3">
                    <span>{index + 1}.</span>
                    <span>{section.headline}</span>
                  </h3>
                  <div className="flex items-center flex-1 mx-4">
                    <div className={`h-0.5 w-full transition-all duration-300 ${
                      activeSection === index
                        ? 'bg-[#F97316]'
                        : 'bg-muted-foreground group-hover:bg-primary'
                    }`} />
                    <ArrowRightCircleIcon className="h-6 w-6 -ml-2 shrink-0" />
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Right Side - Scrolling Diagrams */}
          <div className="space-y-12">
            {sections.map((section, index) => (
              <div
                key={section.id}
                ref={(el) => { sectionRefs.current[index] = el; }}
                className="h-screen flex items-center"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6 }}
                  viewport={{ once: false, margin: "-20%" }}
                  className="w-full"
                >
                  {section.diagram}
                </motion.div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
