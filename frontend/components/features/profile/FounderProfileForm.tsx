'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2 } from 'lucide-react';
import { founderProfileSchema, type FounderProfileFormData } from '@/lib/validations';
import { useCreateFounderProfile } from '@/lib/hooks';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function FounderProfileForm() {
  const createProfile = useCreateFounderProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FounderProfileFormData>({
    resolver: zodResolver(founderProfileSchema),
  });

  const onSubmit = async (data: FounderProfileFormData) => {
    try {
      await createProfile.mutateAsync(data);
    } catch (error) {
      // Error handled by mutation
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create Your Founder Profile</CardTitle>
        <CardDescription>
          Set up your company profile to start discovering talented Web3 developers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {createProfile.error && (
            <Alert variant="destructive">
              <AlertDescription>{createProfile.error.message}</AlertDescription>
            </Alert>
          )}

          <div className="grid gap-6 md:grid-cols-2">
            {/* Company Name */}
            <div className="space-y-2">
              <Label htmlFor="companyName">
                Company Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="companyName"
                placeholder="Acme Corp"
                {...register('companyName')}
                disabled={createProfile.isPending}
              />
              {errors.companyName && (
                <p className="text-sm text-destructive">{errors.companyName.message}</p>
              )}
            </div>

            {/* Position */}
            <div className="space-y-2">
              <Label htmlFor="position">
                Your Position <span className="text-destructive">*</span>
              </Label>
              <Input
                id="position"
                placeholder="CEO, CTO, Founder"
                {...register('position')}
                disabled={createProfile.isPending}
              />
              {errors.position && (
                <p className="text-sm text-destructive">{errors.position.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Company Website */}
            <div className="space-y-2">
              <Label htmlFor="companyWebsite">Company Website</Label>
              <Input
                id="companyWebsite"
                type="url"
                placeholder="https://example.com"
                {...register('companyWebsite')}
                disabled={createProfile.isPending}
              />
              {errors.companyWebsite && (
                <p className="text-sm text-destructive">{errors.companyWebsite.message}</p>
              )}
            </div>

            {/* LinkedIn */}
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
              <Input
                id="linkedinUrl"
                type="url"
                placeholder="https://linkedin.com/in/username"
                {...register('linkedinUrl')}
                disabled={createProfile.isPending}
              />
              {errors.linkedinUrl && (
                <p className="text-sm text-destructive">{errors.linkedinUrl.message}</p>
              )}
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Company Bio</Label>
            <Textarea
              id="bio"
              rows={4}
              placeholder="Tell us about your company, your mission, and what you're building..."
              {...register('bio')}
              disabled={createProfile.isPending}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Optional. Max 500 characters.
            </p>
          </div>

          <div className="flex gap-4">
            <Button type="submit" disabled={createProfile.isPending}>
              {createProfile.isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Profile...
                </>
              ) : (
                'Create Profile'
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
