import React from 'react';
import { OverviewPage } from './pages/OverviewPage';
import { AccountPage } from './pages/AccountPage';
import { CustomizePage } from './pages/CustomizePage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { SocialLinksPage } from './pages/SocialLinksPage';
import { PremiumPage } from './pages/PremiumPage';
import { MediaPage } from './pages/MediaPage';
import { TemplatesPage } from './pages/TemplatesPage';

interface DashboardContentProps {
  activeSection: string;
  profile: any;
  formData: any;
  setFormData: (data: any) => void;
  customizationSettings: any;
  handleCustomizationChange: (key: string, value: any) => void;
  onSave: () => void;
  isSaving: boolean;
  user: any;
}

export function DashboardContent({
  activeSection,
  profile,
  formData,
  setFormData,
  customizationSettings,
  handleCustomizationChange,
  onSave,
  isSaving,
  user
}: DashboardContentProps) {
  const renderContent = () => {
    switch (activeSection) {
      case 'overview':
        return <OverviewPage profile={profile} user={user} />;
      case 'account':
        return <AccountPage profile={profile} />;
      case 'customize':
        return (
          <CustomizePage
            formData={formData}
            setFormData={setFormData}
            customizationSettings={customizationSettings}
            handleCustomizationChange={handleCustomizationChange}
            onSave={onSave}
            isSaving={isSaving}
          />
        );
      case 'analytics':
        return <AnalyticsPage profileUserId={user?.id} />;
      case 'social-links':
        return <SocialLinksPage profile={profile} />;
      case 'premium':
        return <PremiumPage />;
      case 'media':
        return <MediaPage />;
      case 'templates':
        return <TemplatesPage />;
      default:
        return <OverviewPage profile={profile} user={user} />;
    }
  };

  return (
    <div className="p-6 lg:p-8">
      <div className="glass rounded-2xl p-6 lg:p-8 min-h-[calc(100vh-3rem)]">
        {renderContent()}
      </div>
    </div>
  );
}