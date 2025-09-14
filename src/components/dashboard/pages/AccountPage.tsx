import React from 'react';
import { AccountOverview } from '@/components/AccountOverview';

interface AccountPageProps {
  profile: any;
}

export function AccountPage({ profile }: AccountPageProps) {
  return <AccountOverview profile={profile} />;
}