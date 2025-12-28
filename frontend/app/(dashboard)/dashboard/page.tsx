'use client';

import { useAuth, useMyProfile, useMyReputationScore } from '@/lib/hooks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { Skeleton } from '@/components/ui/skeleton';
import { Separator } from '@/components/ui/separator';
import { useRouter } from 'next/navigation';
import { ReputationScore, ReputationBreakdown, TierBadge } from '@/components/features/reputation';
import { GitHubSyncButton, GitHubStatsCard } from '@/components/features/github';
import { ProjectCard } from '@/components/features/profile/ProjectCard';
import { ProjectFormDialog } from '@/components/features/profile/ProjectFormDialog';
import {
  FolderGit2,
  Users,
  TrendingUp,
  Plus,
  User as UserIcon,
  Github,
  Twitter,
  Linkedin,
  ExternalLink,
  MapPin,
  Edit,
  Building2
} from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updateDeveloperProfileSchema, updateFounderProfileSchema, type UpdateDeveloperProfileFormData, type UpdateFounderProfileFormData } from '@/lib/validations';
import { useUpdateProfile } from '@/lib/hooks/useProfile';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Availability } from '@/types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { Project } from '@/types';

export default function UnifiedDashboardPage() {
  const { user, isDeveloper, isFounder } = useAuth();
  const router = useRouter();
  const { data: profile, isLoading: profileLoading } = useMyProfile();
  const { data: reputationScore, isLoading: reputationLoading } = useMyReputationScore();

  if (!user) return null;

  if (profileLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-12 w-64" />
        <div className="grid gap-6 md:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-32 w-full" />
          ))}
        </div>
      </div>
    );
  }

  const developer = profile?.developer;
  const founder = profile?.founder;
  const hasProfile = isDeveloper ? !!developer : !!founder;

  // If no profile, show onboarding
  if (!hasProfile) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Welcome to Web3 Talent Connect! 👋</h1>
          <p className="text-muted-foreground mt-2">
            Complete your profile to get started
          </p>
        </div>

        <Card className="border-primary">
          <CardHeader>
            <CardTitle>Complete Your Profile</CardTitle>
            <CardDescription>
              {isDeveloper && 'Create your developer profile to showcase your work and connect with founders'}
              {isFounder && 'Create your founder profile to discover talented developers'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button size="lg" onClick={() => router.push('/profile')}>
              <UserIcon className="mr-2 h-4 w-4" />
              Create Profile Now
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Developer Unified Dashboard
  if (isDeveloper && developer) {
    return <DeveloperUnifiedDashboard developer={developer} reputationScore={reputationScore} reputationLoading={reputationLoading} />;
  }

  // Founder Unified Dashboard
  if (isFounder && founder) {
    return <FounderUnifiedDashboard founder={founder} />;
  }

  return null;
}

// Developer Unified Dashboard Component
function DeveloperUnifiedDashboard({ developer, reputationScore, reputationLoading }: any) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [projectDialogOpen, setProjectDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | undefined>();
  const updateProfile = useUpdateProfile();

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
      <div className="space-y-6">
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
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input id="fullName" {...register('fullName')} disabled={updateProfile.isPending} />
                  {errors.fullName && <p className="text-sm text-destructive">{errors.fullName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number</Label>
                  <Input id="contactNumber" {...register('contactNumber')} disabled={updateProfile.isPending} />
                  {errors.contactNumber && <p className="text-sm text-destructive">{errors.contactNumber.message}</p>}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
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

                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" placeholder="San Francisco, CA" {...register('location')} disabled={updateProfile.isPending} />
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="twitter">Twitter URL</Label>
                  <Input id="twitter" placeholder="https://twitter.com/username" {...register('twitter')} disabled={updateProfile.isPending} />
                  {errors.twitter && <p className="text-sm text-destructive">{errors.twitter.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedin">LinkedIn URL</Label>
                  <Input id="linkedin" placeholder="https://linkedin.com/in/username" {...register('linkedin')} disabled={updateProfile.isPending} />
                  {errors.linkedin && <p className="text-sm text-destructive">{errors.linkedin.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea id="bio" rows={4} {...register('bio')} disabled={updateProfile.isPending} />
                {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-3xl font-bold">Welcome back, {developer.fullName}! 👋</h1>
            <TierBadge tier={developer.tier} size="lg" />
          </div>
          <p className="text-muted-foreground">@{developer.username}</p>
        </div>
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-6 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Reputation Score</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1">
              <p className="text-3xl font-bold">{developer.reputationScore.toFixed(1)}</p>
              <p className="text-muted-foreground pb-1">/ 100</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>
              <div className="flex items-center gap-2">
                <FolderGit2 className="h-4 w-4" />
                Projects
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{developer.projects?.length || 0}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Vouches
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">0</p>
            <p className="text-xs text-muted-foreground">Coming soon</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Tier Ranking
              </div>
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">
              {developer.tier.replace('TIER_', 'Tier ')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Profile Info & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Profile Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Profile Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bio */}
            {developer.bio && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">About</h3>
                <p className="text-sm">{developer.bio}</p>
              </div>
            )}

            <Separator />

            {/* Contact & Location */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Contact</h3>
                <p className="text-sm">{developer.contactNumber}</p>
                {developer.location && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                    <MapPin className="h-4 w-4" />
                    {developer.location}
                  </div>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Availability</h3>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary">
                  <div className={`h-2 w-2 rounded-full ${availabilityColors[developer.availability]}`} />
                  <span className="text-sm font-medium">{availabilityLabels[developer.availability]}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">Social Links</h3>
              <div className="flex flex-wrap gap-3">
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
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Manage your profile</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => setProjectDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" />
              Add New Project
            </Button>
            <div className="pt-2">
              <GitHubSyncButton variant="outline" size="default" showText />
            </div>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push('/developers')}
            >
              <Users className="mr-2 h-4 w-4" />
              Browse Developers
            </Button>
          </CardContent>
        </Card>
      </div>

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
              {developer.projects.map((project: Project) => (
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

      {/* Getting Started Tips */}
      {developer.reputationScore < 10 && (
        <Card className="border-yellow-500/50 bg-yellow-500/5">
          <CardHeader>
            <CardTitle>💡 Tips to Improve Your Reputation</CardTitle>
            <CardDescription>Complete these actions to increase your visibility</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Add at least 2-3 projects with live demos and GitHub repositories</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Sync your GitHub profile to showcase your contributions</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Complete your profile with bio, location, and social links</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-500">•</span>
                <span>Submit hackathon wins and grant achievements for verification</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Project Form Dialog */}
      <ProjectFormDialog
        open={projectDialogOpen}
        onOpenChange={handleCloseDialog}
        project={editingProject}
      />
    </div>
  );
}

// Founder Unified Dashboard Component
function FounderUnifiedDashboard({ founder }: any) {
  const router = useRouter();
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
      <div className="space-y-6">
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
                <div className="space-y-2">
                  <Label htmlFor="companyName">Company Name</Label>
                  <Input id="companyName" {...register('companyName')} disabled={updateProfile.isPending} />
                  {errors.companyName && <p className="text-sm text-destructive">{errors.companyName.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">Position</Label>
                  <Input id="position" {...register('position')} disabled={updateProfile.isPending} />
                  {errors.position && <p className="text-sm text-destructive">{errors.position.message}</p>}
                </div>
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="companyWebsite">Company Website</Label>
                  <Input id="companyWebsite" type="url" placeholder="https://example.com" {...register('companyWebsite')} disabled={updateProfile.isPending} />
                  {errors.companyWebsite && <p className="text-sm text-destructive">{errors.companyWebsite.message}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="linkedinUrl">LinkedIn Profile</Label>
                  <Input id="linkedinUrl" type="url" placeholder="https://linkedin.com/in/username" {...register('linkedinUrl')} disabled={updateProfile.isPending} />
                  {errors.linkedinUrl && <p className="text-sm text-destructive">{errors.linkedinUrl.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Company Bio</Label>
                <Textarea id="bio" rows={4} {...register('bio')} disabled={updateProfile.isPending} />
                {errors.bio && <p className="text-sm text-destructive">{errors.bio.message}</p>}
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={updateProfile.isPending}>
                  {updateProfile.isPending ? 'Saving...' : 'Save Changes'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with Edit Button */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">{founder.companyName}</h1>
          </div>
          <p className="text-muted-foreground">{founder.position}</p>
        </div>
        <Button variant="outline" onClick={() => setIsEditing(true)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit Profile
        </Button>
      </div>

      {/* Company Information & Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Company Profile */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Company Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Bio */}
            {founder.bio && (
              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">About</h3>
                <p className="text-sm">{founder.bio}</p>
              </div>
            )}

            <Separator />

            {/* Company Details */}
            <div className="grid gap-4 md:grid-cols-2">
              {founder.companyWebsite && (
                <div>
                  <h3 className="font-semibold text-sm text-muted-foreground mb-2">Website</h3>
                  <a
                    href={founder.companyWebsite}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {founder.companyWebsite.replace(/^https?:\/\//, '')}
                  </a>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-sm text-muted-foreground mb-2">Member Since</h3>
                <p className="text-sm">{new Date(founder.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <Separator />

            {/* Social Links */}
            <div>
              <h3 className="font-semibold text-sm text-muted-foreground mb-3">Social Links</h3>
              {founder.linkedinUrl ? (
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
              ) : (
                <p className="text-sm text-muted-foreground">No social links added</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Discover developers</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push('/developers')}
            >
              <Users className="mr-2 h-4 w-4" />
              Browse Developers
            </Button>
            <Button
              className="w-full justify-start"
              variant="outline"
              onClick={() => router.push('/projects')}
            >
              <FolderGit2 className="mr-2 h-4 w-4" />
              Browse Projects
            </Button>
            <div className="pt-2 border-t">
              <p className="text-xs text-muted-foreground mb-2">Coming Soon:</p>
              <Button
                className="w-full justify-start"
                variant="outline"
                disabled
              >
                <Plus className="mr-2 h-4 w-4" />
                Post a Job
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Features */}
      <Card>
        <CardHeader>
          <CardTitle>Platform Features</CardTitle>
          <CardDescription>Available tools for hiring</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <p className="font-medium">Browse Verified Developers</p>
                <p className="text-muted-foreground">Access tier-ranked developer profiles with reputation scores</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 text-xl">✓</span>
              <div>
                <p className="font-medium">View Developer Projects</p>
                <p className="text-muted-foreground">See live demos and GitHub repositories</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 text-xl">⏳</span>
              <div>
                <p className="font-medium">Post Job Openings</p>
                <p className="text-muted-foreground">Coming soon - AI-powered developer matching</p>
              </div>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500 text-xl">⏳</span>
              <div>
                <p className="font-medium">Schedule Sessions</p>
                <p className="text-muted-foreground">Coming soon - Direct developer meetings</p>
              </div>
            </li>
          </ul>
        </CardContent>
      </Card>

      {/* Getting Started Tips */}
      <Card className="border-blue-500/50 bg-blue-500/5">
        <CardHeader>
          <CardTitle>💡 Getting Started</CardTitle>
          <CardDescription>Make the most of the platform</CardDescription>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Browse the developer directory to discover talented Web3 developers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Check developer reputation scores and tier rankings for quality assurance</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Review developer projects to see their work in action</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-blue-500">•</span>
              <span>Complete your company profile to increase credibility</span>
            </li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
