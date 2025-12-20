'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { developerProfileSchema, type DeveloperProfileFormData } from '@/lib/validations';
import { useCreateDeveloperProfile } from '@/lib/hooks';
import { Availability } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

export function DeveloperProfileForm() {
  const router = useRouter();
  const createProfile = useCreateDeveloperProfile();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<DeveloperProfileFormData>({
    resolver: zodResolver(developerProfileSchema),
    defaultValues: {
      availability: Availability.AVAILABLE,
    },
  });

  const onSubmit = async (data: DeveloperProfileFormData) => {
    try {
      await createProfile.mutateAsync(data);
      router.push('/dashboard');
    } catch (error) {
      // Error is handled by the mutation
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Developer Profile</CardTitle>
        <CardDescription>
          Tell us about yourself and your work. This information will be visible to founders.
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
            {/* Username */}
            <div className="space-y-2">
              <Label htmlFor="username">
                Username <span className="text-destructive">*</span>
              </Label>
              <Input
                id="username"
                placeholder="johndoe"
                {...register('username')}
                disabled={createProfile.isPending}
              />
              {errors.username && (
                <p className="text-sm text-destructive">{errors.username.message}</p>
              )}
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <Label htmlFor="fullName">
                Full Name <span className="text-destructive">*</span>
              </Label>
              <Input
                id="fullName"
                placeholder="John Doe"
                {...register('fullName')}
                disabled={createProfile.isPending}
              />
              {errors.fullName && (
                <p className="text-sm text-destructive">{errors.fullName.message}</p>
              )}
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Contact Number */}
            <div className="space-y-2">
              <Label htmlFor="contactNumber">
                Contact Number <span className="text-destructive">*</span>
              </Label>
              <Input
                id="contactNumber"
                placeholder="+1234567890"
                {...register('contactNumber')}
                disabled={createProfile.isPending}
              />
              {errors.contactNumber && (
                <p className="text-sm text-destructive">{errors.contactNumber.message}</p>
              )}
            </div>

            {/* Availability */}
            <div className="space-y-2">
              <Label htmlFor="availability">Availability</Label>
              <Select
                onValueChange={(value) => setValue('availability', value as Availability)}
                defaultValue={Availability.AVAILABLE}
                disabled={createProfile.isPending}
              >
                <SelectTrigger id="availability">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={Availability.AVAILABLE}>Available</SelectItem>
                  <SelectItem value={Availability.BUSY}>Busy</SelectItem>
                  <SelectItem value={Availability.NOT_LOOKING}>Not Looking</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* GitHub URL */}
          <div className="space-y-2">
            <Label htmlFor="github">
              GitHub URL <span className="text-destructive">*</span>
            </Label>
            <Input
              id="github"
              placeholder="https://github.com/johndoe"
              {...register('github')}
              disabled={createProfile.isPending}
            />
            {errors.github && (
              <p className="text-sm text-destructive">{errors.github.message}</p>
            )}
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* Twitter URL */}
            <div className="space-y-2">
              <Label htmlFor="twitter">Twitter URL (Optional)</Label>
              <Input
                id="twitter"
                placeholder="https://twitter.com/johndoe"
                {...register('twitter')}
                disabled={createProfile.isPending}
              />
              {errors.twitter && (
                <p className="text-sm text-destructive">{errors.twitter.message}</p>
              )}
            </div>

            {/* LinkedIn URL */}
            <div className="space-y-2">
              <Label htmlFor="linkedin">LinkedIn URL (Optional)</Label>
              <Input
                id="linkedin"
                placeholder="https://linkedin.com/in/johndoe"
                {...register('linkedin')}
                disabled={createProfile.isPending}
              />
              {errors.linkedin && (
                <p className="text-sm text-destructive">{errors.linkedin.message}</p>
              )}
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              placeholder="San Francisco, CA"
              {...register('location')}
              disabled={createProfile.isPending}
            />
            {errors.location && (
              <p className="text-sm text-destructive">{errors.location.message}</p>
            )}
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <Label htmlFor="bio">Bio (Optional)</Label>
            <Textarea
              id="bio"
              placeholder="Tell us about your experience, skills, and what you're looking for..."
              rows={4}
              {...register('bio')}
              disabled={createProfile.isPending}
            />
            {errors.bio && (
              <p className="text-sm text-destructive">{errors.bio.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Maximum 500 characters
            </p>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={createProfile.isPending}
              className="flex-1"
            >
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
