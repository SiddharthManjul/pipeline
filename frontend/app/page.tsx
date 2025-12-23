'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/hooks';
import { Button } from '@/components/ui/button';
import { ArrowRight, Code2, Users, TrendingUp, Github } from 'lucide-react';
import Link from 'next/link';

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
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Logo/Title */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-bold bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Web3 Talent Connect
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground">
              Where Web3 developers meet visionary founders
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
            <Link href="/register">
              <Button size="lg" className="w-full sm:w-auto">
                Get Started
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link href="/login">
              <Button size="lg" variant="outline" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
          </div>

          {/* Features */}
          <div className="grid md:grid-cols-3 gap-8 pt-16">
            <div className="space-y-3 p-6 rounded-lg border bg-card">
              <Code2 className="h-10 w-10 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">For Developers</h3>
              <p className="text-muted-foreground">
                Showcase your projects, build reputation, and get discovered by top Web3 founders
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-lg border bg-card">
              <Users className="h-10 w-10 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">For Founders</h3>
              <p className="text-muted-foreground">
                Find vetted developers based on real contributions, not just resumes
              </p>
            </div>

            <div className="space-y-3 p-6 rounded-lg border bg-card">
              <TrendingUp className="h-10 w-10 text-primary mx-auto" />
              <h3 className="text-xl font-semibold">Reputation-Based</h3>
              <p className="text-muted-foreground">
                Merit-based matching using GitHub contributions, projects, and community vouches
              </p>
            </div>
          </div>

          {/* GitHub Login */}
          <div className="pt-8">
            <p className="text-sm text-muted-foreground mb-4">Or continue with</p>
            <Link href="/api/auth/github">
              <Button variant="outline" size="lg">
                <Github className="mr-2 h-5 w-5" />
                GitHub
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
