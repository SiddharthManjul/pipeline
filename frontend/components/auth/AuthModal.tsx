/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { Github, Mail, Lock, User, Building2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { authApi } from '@/lib/api/auth';
import { UserRole } from '@/types';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['DEVELOPER', 'FOUNDER']),
});

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'login' | 'signup';
}

export function AuthModal({ isOpen, onClose, defaultTab = 'login' }: AuthModalProps) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState(defaultTab);
  const [selectedRole, setSelectedRole] = useState<'DEVELOPER' | 'FOUNDER'>('DEVELOPER');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      password: '',
      role: 'DEVELOPER',
    },
  });

  const handleLogin = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError('');
      await authApi.login(data);
      router.push('/dashboard');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Login failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError('');
      await authApi.register({
        email: data.email,
        password: data.password,
        role: selectedRole === 'DEVELOPER' ? UserRole.DEVELOPER : UserRole.FOUNDER,
      });
      router.push('/dashboard');
      onClose();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-125 bg-transparent border-none shadow-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            Welcome to Credynx
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(val) => setActiveTab(val as 'login' | 'signup')} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 bg-black/40 border border-primary/20 p-1">
            <TabsTrigger
              value="login"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium transition-all"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger
              value="signup"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground font-medium transition-all"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          {/* Login Tab */}
          <TabsContent value="login" className="space-y-4">
            <form onSubmit={loginForm.handleSubmit(handleLogin)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="login-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    {...loginForm.register('email')}
                  />
                </div>
                {loginForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{loginForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="login-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="login-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    {...loginForm.register('password')}
                  />
                </div>
                {loginForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{loginForm.formState.errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                variant="outline"
                className="w-full backdrop-blur-sm bg-background/50"
                disabled={isLoading}
                borderColor="rgba(255, 0, 0, 1)"
              >
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Link href="/api/auth/github" className="block">
              <Button size="lg" variant="outline" className="w-full backdrop-blur-sm bg-background/50" borderColor="rgba(255, 0, 0, 1)">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </Link>
          </TabsContent>

          {/* Signup Tab */}
          <TabsContent value="signup" className="space-y-4">
            <div className="space-y-3">
              <Label>I am a</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedRole('DEVELOPER')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === 'DEVELOPER'
                      ? 'border-primary bg-primary/10'
                      : 'border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <User className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Developer</p>
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedRole('FOUNDER')}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    selectedRole === 'FOUNDER'
                      ? 'border-primary bg-primary/10'
                      : 'border-primary/20 hover:border-primary/40'
                  }`}
                >
                  <Building2 className="h-6 w-6 mx-auto mb-2 text-primary" />
                  <p className="font-medium">Founder</p>
                </button>
              </div>
            </div>

            <form onSubmit={registerForm.handleSubmit(handleRegister)} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="you@example.com"
                    className="pl-10"
                    {...registerForm.register('email')}
                  />
                </div>
                {registerForm.formState.errors.email && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.email.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="signup-password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-10"
                    {...registerForm.register('password')}
                  />
                </div>
                {registerForm.formState.errors.password && (
                  <p className="text-sm text-destructive">{registerForm.formState.errors.password.message}</p>
                )}
              </div>

              {error && (
                <div className="p-3 rounded-md bg-destructive/10 border border-destructive/20">
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <Button
                type="submit"
                size="lg"
                variant="outline"
                className="w-full backdrop-blur-sm bg-background/50"
                disabled={isLoading}
                borderColor="rgba(255, 0, 0, 1)"
              >
                {isLoading ? 'Creating account...' : 'Create Account'}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-primary/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-black px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <Link href="/api/auth/github" className="block">
              <Button size="lg" variant="outline" className="w-full backdrop-blur-sm bg-background/50" borderColor="rgba(255, 0, 0, 1)">
                <Github className="mr-2 h-4 w-4" />
                GitHub
              </Button>
            </Link>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
