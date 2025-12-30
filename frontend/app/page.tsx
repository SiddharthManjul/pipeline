/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/hooks";
import { FuturisticButton as Button } from "@/components/ui/futuristic-button";
import { ArrowRight, Code2, Users, TrendingUp, Github, Lightbulb, MessageSquare } from "lucide-react";
import Link from "next/link";
import { HeroSection } from "@/components/landing/HeroSection";
import { Background3D } from "@/components/landing/Background3D";
import { BentoGrid } from "@/components/landing/BentoGrid";
import { Navbar } from "@/components/layout/Navbar";
import { AuthModal } from "@/components/auth/AuthModal";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [mountKey, setMountKey] = useState(0);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<'login' | 'signup'>('login');
  const [authWarning, setAuthWarning] = useState<string>('');

  // Force remount Background3D when component mounts
  useEffect(() => {
    setMountKey((prev) => prev + 1);
  }, []);

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  // Don't show landing page to authenticated users
  if (isAuthenticated) {
    return null;
  }

  const handleAuthModalOpen = (tab: 'login' | 'signup', message?: string) => {
    setAuthTab(tab);
    setAuthWarning(message || '');
    setAuthModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <Background3D key={mountKey} />

      <Navbar onAuthModalOpen={handleAuthModalOpen} />

      <div className="-mt-16">
        <HeroSection />
      </div>

      <div className="mt-24">
        <h3 className="text-4xl md:text-5xl font-bold text-center mb-12 text-muted-foreground">
          Why It <span style={{ color: '#F97316' }}>Matters</span>
        </h3>
        <BentoGrid />
      </div>

      {/* GitHub Login */}
        <div className="py-24 text-center">
          <p className="text-sm text-muted-foreground mb-4">Or continue with</p>
          <Link href="/api/auth/github">
            <Button
              variant="outline"
              size="lg"
              className="backdrop-blur-sm bg-background/50"
              borderColor="rgba(255, 0, 0, 1)"
            >
              <Github className="mr-2 h-5 w-5" />
              GitHub
            </Button>
          </Link>
        </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setAuthWarning('');
        }}
        defaultTab={authTab}
        warningMessage={authWarning}
      />
      </div>
    );
}
