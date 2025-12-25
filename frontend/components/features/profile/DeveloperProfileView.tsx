'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Edit, Loader2, Github, ExternalLink, MapPin, Twitter, Linkedin, Plus } from 'lucide-react';
import { updateDeveloperProfileSchema, type UpdateDeveloperProfileFormData } from '@/lib/validations';
import { useUpdateProfile, useMyReputationScore, useCalculateMyReputation } from '@/lib/hooks';
import type { Developer, Project } from '@/types';
import { Availability } from '@/types';
import { ProjectCard } from './ProjectCard';
import { ProjectFormDialog } from './ProjectFormDialog';
import { ReputationScore, ReputationBreakdown, TierBadge } from '@/components/features/reputation';
import { GitHubStatsCard } from '@/components/features/github';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
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
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DeveloperProfileViewProps {
  developer: Developer;
}

export function DeveloperProfileView({ developer }: DeveloperProfileViewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const updateProfile = useUpdateProfile();
  const { data: reputationScore, isLoading: reputationLoading } = useMyReputationScore();
  const calculateReputation = useCalculateMyReputation();

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<UpdateDeveloperProfileFormData>({
    resolver: zodResolver(updateDeveloperProfileSchema),
    defaultValues: {
      fullName: developer.fullName,
      contactNumber: developer.contactNumber,
      twitter: developer.twitter || '',
      linkedin: developer.linkedin || '',
      bio: developer.bio || '',
      location: developer.location || '',
      availability: developer.availability,
    },
  });

  const onSubmit = async (data: UpdateDeveloperProfileFormData) => {
    try {
      await updateProfile.mutateAsync(data);
      setIsEditing(false);
    } catch (error) {
      // Error handled by mutation
    }
  };

  const handleEditProject = (project: Project) => {
    setEditingProject(project);
    setProjectDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setProjectDialogOpen(false);
    setEditingProject(undefined);
  };

  const availabilityColors = {
    AVAILABLE: 'bg-green-500',
    BUSY: 'bg-yellow-500',
    NOT_LOOKING: 'bg-gray-500',
  };

  const availabilityLabels = {
    AVAILABLE: 'Available',
    BUSY: 'Busy',
    NOT_LOOKING: 'Not Looking',
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>Update your profile information</CardDescription>
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
              {/* Full Name */}
              <div className="space-y-2">
                <Label htmlFor="fullName">Full Name</Label>
                <Input
                  id="fullName"
                  {...register('fullName')}
                  disabled={updateProfile.isPending}
                />
                {errors.fullName && (
                  <p className="text-sm text-destructive">{errors.fullName.message}</p>
                )}
              </div>

              {/* Contact Number */}
              <div className="space-y-2">
                <Label htmlFor="contactNumber">Contact Number</Label>
                <Input
                  id="contactNumber"
                  {...register('contactNumber')}
                  disabled={updateProfile.isPending}
                />
                {errors.contactNumber && (
                  <p className="text-sm text-destructive">{errors.contactNumber.message}</p>
                )}
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Availability */}
              <div className="space-y-2">
                <Label htmlFor="availability">Availability</Label>
                <Select
                  onValueChange={(value) => setValue('availability', value as Availability)}
                  defaultValue={developer.availability}
                  disabled={updateProfile.isPending}
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

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  placeholder="San Francisco, CA"
                  {...register('location')}
                  disabled={updateProfile.isPending}
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Twitter */}
              <div className="space-y-2">
                <Label htmlFor="twitter">Twitter URL</Label>
                <Input
                  id="twitter"
                  placeholder="https://twitter.com/username"
                  {...register('twitter')}
                  disabled={updateProfile.isPending}
                />
                {errors.twitter && (
                  <p className="text-sm text-destructive">{errors.twitter.message}</p>
                )}
              </div>

              {/* LinkedIn */}
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn URL</Label>
                <Input
                  id="linkedin"
                  placeholder="https://linkedin.com/in/username"
                  {...register('linkedin')}
                  disabled={updateProfile.isPending}
                />
                {errors.linkedin && (
                  <p className="text-sm text-destructive">{errors.linkedin.message}</p>
                )}
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
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
                <CardTitle className="text-2xl">{developer.fullName}</CardTitle>
                <Badge className={availabilityColors[developer.availability]}>
                  {availabilityLabels[developer.availability]}
                </Badge>
              </div>
              <CardDescription className="text-base">@{developer.username}</CardDescription>
            </div>
            <Button variant="outline" onClick={() => setIsEditing(true)}>
              <Edit className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Bio */}
          {developer.bio && (
            <div>
              <p className="text-muted-foreground">{developer.bio}</p>
            </div>
          )}

          <Separator />

          {/* Contact & Social */}
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <h3 className="font-semibold">Contact</h3>
              <div className="space-y-2 text-sm">
                <p className="text-muted-foreground">{developer.contactNumber}</p>
                {developer.location && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {developer.location}
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold">Social Links</h3>
              <div className="space-y-2">
                <a
                  href={developer.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm text-primary hover:underline"
                >
                  <Github className="h-4 w-4" />
                  GitHub
                  <ExternalLink className="h-3 w-3" />
                </a>
                {developer.twitter && (
                  <a
                    href={developer.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Twitter className="h-4 w-4" />
                    Twitter
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
                {developer.linkedin && (
                  <a
                    href={developer.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Linkedin className="h-4 w-4" />
                    LinkedIn
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>
            </div>
          </div>

          <Separator />

          {/* Reputation & Tier */}
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <p className="text-sm text-muted-foreground">Reputation Score</p>
              <p className="text-2xl font-bold">{developer.reputationScore.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tier</p>
              <TierBadge tier={developer.tier} size="lg" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reputation Details */}
      {!reputationLoading && reputationScore && (
        <div className="grid gap-6 md:grid-cols-2">
          <ReputationScore
            score={reputationScore.totalScore}
            tier={reputationScore.tier}
          />
          <ReputationBreakdown breakdown={reputationScore} />
        </div>
      )}

      {/* GitHub Statistics */}
      {developer.github && (
        <GitHubStatsCard
          username={developer.github.split('/').pop() || ''}
        />
      )}

      {/* Projects Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Showcase your work and contributions
              </CardDescription>
            </div>
            <Button onClick={() => setProjectDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Project
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {developer.projects?.length === 0 || !developer.projects ? (
            <p className="text-muted-foreground text-center py-8">
              No projects yet. Start adding your work to increase your reputation!
            </p>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {developer.projects.map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                  onEdit={handleEditProject}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Project Form Dialog */}
      <ProjectFormDialog
        open={projectDialogOpen}
        onOpenChange={handleCloseDialog}
        project={editingProject}
      />
    </div>
  );
}
