'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FolderGit2 } from 'lucide-react';

export default function ProjectsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Project Directory</h1>
        <p className="text-muted-foreground mt-2">
          Explore all projects submitted by developers on the platform
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <FolderGit2 className="h-5 w-5" />
            <CardTitle>Coming Soon</CardTitle>
          </div>
          <CardDescription>
            The project directory with filtering and technology search is under development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page will feature a comprehensive directory of all projects with:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Technology and framework filters</li>
            <li>Team vs solo project filtering</li>
            <li>Live demo and repository links</li>
            <li>GitHub stats (stars, forks)</li>
            <li>Verification status</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
