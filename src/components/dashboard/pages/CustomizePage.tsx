import React from 'react';
import { CustomizePage as CustomizeComponent } from '@/components/CustomizePage';

interface CustomizePageProps {
  formData: any;
  setFormData: (data: any) => void;
  customizationSettings: any;
  handleCustomizationChange: (key: string, value: any) => void;
  onSave: () => void;
  isSaving: boolean;
}

export function CustomizePage({ 
  formData, 
  setFormData, 
  customizationSettings, 
  handleCustomizationChange,
  onSave,
  isSaving 
}: CustomizePageProps) {
  return (
    <CustomizeComponent
      formData={formData}
      setFormData={setFormData}
      customizationSettings={customizationSettings}
      handleCustomizationChange={handleCustomizationChange}
      onSave={onSave}
      isSaving={isSaving}
    />
  );
}