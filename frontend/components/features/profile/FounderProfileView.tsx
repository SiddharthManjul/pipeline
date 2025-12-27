'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, ExternalLink, Linkedin, Building2 } from 'lucide-react';
import { updateFounderProfileSchema, type UpdateFounderProfileFormData } from '@/lib/validations';
import { useUpdateProfile } from '@/lib/hooks';
import type { Founder } from '@/types';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FounderProfileViewProps {
  founder: Founder;
}

export function FounderProfileView({ founder }: FounderProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const updateProfile = useUpdateProfile();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateFounderProfileFormData>({
    resolver: zodResolver(updateFounderProfileSchema),
    defaultValues: {
      companyName: founder.companyName,
      position: founder.position,
      companyWebsite: founder.companyWebsite || '',
      bio: founder.bio || '',
      linkedinUrl: founder.linkedinUrl || '',
    },
  });

  const onSubmit = async (data: UpdateFounderProfileFormData) => {
    try {
      await updateProfile.mutateAsync(data);
      setIsEditing(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your company information</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {updateProfile.error && (
              <Alert variant="destructive">
                <AlertDescription>{updateProfile.error.message}</AlertDescription>
              </Alert>
            )}

            <div className="grid gap-6 md:grid-cols-2">
              {/* Company Name */}
              <div className="space-y-2">
                <Label htmlFor="companyName">Company Name</Label>
                <Input
                  id="companyName"
                  {...register('companyName')}
                  disabled={updateProfile.isPending}
                />
                {errors.companyName && (
                  <p className="text-sm text-destructive">{errors.companyName.message}</p>
                )}
              </div>

              {/* Position */}
              <div className="space-y-2">
                <Label htmlFor="position">Position</Label>
                <Input
                  id="position"
                  {...register('position')}
                  disabled={updateProfile.isPending}
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
                  disabled={updateProfile.isPending}
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
                  disabled={updateProfile.isPending}
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
                {...register('bio')}
                disabled={updateProfile.isPending}
              />
              {errors.bio && (
                <p className="text-sm text-destructive">{errors.bio.message}</p>
              )}
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={updateProfile.isPending}>
                {updateProfile.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Building2 className="h-6 w-6 text-primary" />
                <CardTitle className="text-2xl">{founder.companyName}</CardTitle>
              </div>
              <CardDescription className="text-base">{founder.position}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bio */}
          {founder.bio && (
            <div>
              <p className="text-muted-foreground">{founder.bio}</p>
            </div>
          )}

          <Separator />

          {/* Company Info & Links */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-semibold">Company Information</h3>
              <div className="space-y-2 text-sm">
                {founder.companyWebsite && (
                  <a
                    href={founder.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Company Website
                  </a>
                )}
                <p className="text-muted-foreground">
                  Member since {new Date(founder.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Social Links</h3>
              <div className="space-y-2">
                {founder.linkedinUrl && (
                  <a
                    href={founder.linkedinUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {!founder.linkedinUrl && (
                  <p className="text-sm text-muted-foreground">No social links added</p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional sections can be added here for jobs posted, etc */}
      <Card>
        <CardHeader>
          <CardTitle>Posted Jobs</CardTitle>
          <CardDescription>
            Job postings feature coming soon
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-8">
            You haven't posted any jobs yet. Job posting feature will be available soon!
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
