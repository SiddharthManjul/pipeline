'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { FuturisticButton as Button } from '@/components/ui/futuristic-button';
import { Badge } from '@/components/ui/badge';
import { X, Plus, Award } from 'lucide-react';
import { useCreateVouch } from '@/lib/hooks';
import type { Developer } from '@/types';

const vouchSchema = z.object({
  message: z.string().max(500, 'Message must be less than 500 characters').optional(),
});

type VouchFormData = z.infer<typeof vouchSchema>;

interface VouchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  developer: Developer;
}

export function VouchDialog({ open, onOpenChange, developer }: VouchDialogProps) {
  const createVouch = useCreateVouch();
  const [skills, setSkills] = useState<string[]>([]);
  const [skillInput, setSkillInput] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<VouchFormData>({
    resolver: zodResolver(vouchSchema),
  });

  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput('');
    }
  };

  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const onSubmit = async (data: VouchFormData) => {
    if (skills.length === 0) {
      return;
    }

    await createVouch.mutateAsync({
      vouchedUserId: developer.id,
      skillsEndorsed: skills,
      message: data.message,
    });

    reset();
    setSkills([]);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl bg-transparent border-none shadow-none">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-linear-to-r from-primary to-orange-600 bg-clip-text text-transparent">
            Vouch for {developer.fullName}
          </DialogTitle>
          <DialogDescription className="text-center text-muted-foreground mt-2">
            Endorse this developer's skills and add your vouch to boost their reputation
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          {/* Skills Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-primary" />
              <Label>Skills to Endorse <span className="text-destructive">*</span></Label>
            </div>
            <div className="flex gap-2">
              <Input
                placeholder="e.g., React, Solidity, Smart Contracts"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addSkill();
                  }
                }}
              />
              <Button type="button" onClick={addSkill} variant="outline" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Skills Tags */}
            <div className="flex flex-wrap gap-2 min-h-[2rem]">
              {skills.map((skill) => (
                <Badge
                  key={skill}
                  variant="secondary"
                  className="bg-primary/10 border-primary/20 text-primary px-3 py-1 flex items-center gap-1"
                >
                  {skill}
                  <button
                    type="button"
                    onClick={() => removeSkill(skill)}
                    className="hover:text-destructive transition-colors"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            {skills.length === 0 && (
              <p className="text-sm text-muted-foreground">
                Add at least one skill to vouch for
              </p>
            )}
          </div>

          {/* Message Section */}
          <div className="space-y-2">
            <Label htmlFor="message">Message (Optional)</Label>
            <Textarea
              id="message"
              rows={4}
              placeholder="Add a personal message about why you're vouching for this developer..."
              {...register('message')}
              disabled={createVouch.isPending}
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
            <p className="text-xs text-muted-foreground">
              Maximum 500 characters
            </p>
          </div>

          {/* Submit Button */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={createVouch.isPending}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createVouch.isPending || skills.length === 0}
              borderColor="rgba(255, 0, 0, 1)"
            >
              {createVouch.isPending ? 'Creating Vouch...' : 'Vouch for Developer'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
