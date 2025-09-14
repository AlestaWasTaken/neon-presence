import React from 'react';
import ViewAnalytics from '@/components/ViewAnalytics';

interface AnalyticsPageProps {
  profileUserId?: string;
}

export function AnalyticsPage({ profileUserId }: AnalyticsPageProps) {
  return <ViewAnalytics profileUserId={profileUserId} />;
}