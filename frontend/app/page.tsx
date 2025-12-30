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

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [mountKey, setMountKey] = useState(0);

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

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <Background3D key={mountKey} />

      <HeroSection />

      {/* Features Section - Bento Grid */}
      <div className="container mx-auto px-4 py-24 relative z-10">
        {/* Gradient background for blur effect */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 max-w-6xl mx-auto relative">
          {/* First Row - 3 cards */}
          <div className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-primary/30 bg-black/20 backdrop-blur-2xl p-8 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent animate-pulse-slow opacity-30" />
            <div className="relative z-10">
              <Code2 className="h-14 w-14 text-primary mx-auto mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-lg" />
              <h3 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                For Developers
              </h3>
              <p className="text-muted-foreground/90 text-center text-sm leading-relaxed">
                Showcase your projects, build reputation, and get discovered by
                top Web3 founders
              </p>
            </div>
          </div>

          <div className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-primary/30 bg-black/20 backdrop-blur-2xl p-8 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent animate-pulse-slow opacity-30" />
            <div className="relative z-10">
              <Users className="h-14 w-14 text-primary mx-auto mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-lg" />
              <h3 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                For Founders
              </h3>
              <p className="text-muted-foreground/90 text-center text-sm leading-relaxed">
                Find vetted developers based on real contributions, not just
                resumes
              </p>
            </div>
          </div>

          <div className="md:col-span-2 group relative overflow-hidden rounded-3xl border border-primary/30 bg-black/20 backdrop-blur-2xl p-8 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent animate-pulse-slow opacity-30" />
            <div className="relative z-10">
              <TrendingUp className="h-14 w-14 text-primary mx-auto mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-lg" />
              <h3 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                Reputation-Based
              </h3>
              <p className="text-muted-foreground/90 text-center text-sm leading-relaxed">
                Merit-based matching using GitHub contributions, projects, and
                community vouches
              </p>
            </div>
          </div>

          {/* Second Row - 2 cards spanning equal width */}
          <div className="md:col-span-3 group relative overflow-hidden rounded-3xl border border-primary/30 bg-black/20 backdrop-blur-2xl p-8 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent animate-pulse-slow opacity-30" />
            <div className="relative z-10">
              <Lightbulb className="h-14 w-14 text-primary mx-auto mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-lg" />
              <h3 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                Ideas
              </h3>
              <p className="text-muted-foreground/90 text-center text-sm leading-relaxed">
                Share and discover innovative project ideas, get feedback from the community, and find collaborators
              </p>
            </div>
          </div>

          <div className="md:col-span-3 group relative overflow-hidden rounded-3xl border border-primary/30 bg-black/20 backdrop-blur-2xl p-8 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 animate-fade-in-up" style={{ animationDelay: '0.5s' }}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-primary/5 to-transparent animate-pulse-slow opacity-30" />
            <div className="relative z-10">
              <MessageSquare className="h-14 w-14 text-primary mx-auto mb-5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 drop-shadow-lg" />
              <h3 className="text-2xl font-bold text-center mb-4 bg-gradient-to-r from-primary via-orange-400 to-primary bg-clip-text text-transparent">
                Forum
              </h3>
              <p className="text-muted-foreground/90 text-center text-sm leading-relaxed">
                Engage in discussions about Web3, blockchain technology, and the wider tech ecosystem
              </p>
            </div>
          </div>
        </div>

        {/* GitHub Login */}
        <div className="pt-24 text-center">
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
      </div>
    </div>
  );
}
