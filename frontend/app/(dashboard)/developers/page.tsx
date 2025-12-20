'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

export default function DevelopersPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Developer Directory</h1>
        <p className="text-muted-foreground mt-2">
          Browse and filter developers by reputation, tier, and skills
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            <CardTitle>Coming Soon</CardTitle>
          </div>
          <CardDescription>
            The developer directory with advanced filtering and search is under development
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            This page will feature a searchable directory of all developers with filters for:
          </p>
          <ul className="list-disc list-inside mt-4 space-y-2 text-sm text-muted-foreground">
            <li>Reputation tier (Tier 1-4)</li>
            <li>Skills and technologies</li>
            <li>Availability status</li>
            <li>Location</li>
            <li>Project count and complexity</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
