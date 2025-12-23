'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code2, Users, TrendingUp, Github } from 'lucide-react';
import Link from 'next/link';
import { HeroSection } from '@/components/landing/HeroSection';
import { Background3D } from '@/components/landing/Background3D';

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  // Redirect authenticated users to dashboard
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  // Don't show landing page to authenticated users
  if (isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background relative selection:bg-primary/20">
      <Background3D />
      
      <HeroSection />

      {/* Features Section - Below the fold */}
      <div className="container mx-auto px-4 py-24 relative z-10">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-3 p-6 rounded-lg border bg-card/50 backdrop-blur-sm">
              <Code2 className="h-10 w-10 text-primary mx-auto" />
              <h3 className="text-xl font-semibold text-center">For Developers</h3>
              <p className="text-muted-foreground text-center">
                Showcase your projects, build reputation, and get discovered by top Web3 founders
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-lg border bg-card/50 backdrop-blur-sm">
              <Users className="h-10 w-10 text-primary mx-auto" />
              <h3 className="text-xl font-semibold text-center">For Founders</h3>
              <p className="text-muted-foreground text-center">
                Find vetted developers based on real contributions, not just resumes
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-lg border bg-card/50 backdrop-blur-sm">
              <TrendingUp className="h-10 w-10 text-primary mx-auto" />
              <h3 className="text-xl font-semibold text-center">Reputation-Based</h3>
              <p className="text-muted-foreground text-center">
                Merit-based matching using GitHub contributions, projects, and community vouches
              </p>
            </div>
          </div>

          {/* GitHub Login */}
          <div className="pt-24 text-center">
            <p className="text-sm text-muted-foreground mb-4">Or continue with</p>
            <Link href="/api/auth/github">
              <Button variant="outline" size="lg" className="backdrop-blur-sm bg-background/50">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
            </Link>
          </div>
      </div>
    </div>
  );
}
