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

      <BentoGrid />

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
    );
}
