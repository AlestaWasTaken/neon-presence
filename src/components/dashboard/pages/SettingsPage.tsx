import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { 
  Shield, 
  Bell, 
  Eye, 
  Globe, 
  Lock, 
  Database,
  Download,
  Trash2,
  AlertTriangle,
  Save
} from 'lucide-react';

interface SettingsPageProps {
  profile: any;
  onSave: (settings: any) => void;
}

export function SettingsPage({ profile, onSave }: SettingsPageProps) {
  const { toast } = useToast();
  const [settings, setSettings] = useState({
    emailNotifications: true,
    profileVisibility: 'public',
    analyticsTracking: true,
    allowComments: false,
    showLastSeen: true,
    allowDirectMessages: true,
    requireApproval: false,
    enableRealTimeViews: true,
    customDomain: '',
    password: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [hasChanges, setHasChanges] = useState(false);

  const handleSettingChange = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
    setHasChanges(true);
  };

  const handleSave = async () => {
    try {
      await onSave(settings);
      setHasChanges(false);
      toast({
        title: "Settings saved",
        description: "Your preferences have been updated successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to save settings",
        description: "Please try again later.",
      });
    }
  };

  const handleExportData = () => {
    toast({
      title: "Export initiated",
      description: "Your data will be sent to your email shortly.",
    });
  };

  const handleDeleteAccount = () => {
    toast({
      variant: "destructive",
      title: "Account deletion",
      description: "This feature will be available soon.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white text-gradient mb-3">
          Account Settings
        </h1>
        <p className="text-smoke-400 text-lg">
          Manage your privacy, security, and preferences
        </p>
      </div>

      {/* Privacy Settings */}
      <Card className="glass border-smoke-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
              <Eye className="w-4 h-4 text-white" />
            </div>
            Privacy & Visibility
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-smoke-200">Profile Visibility</Label>
                  <p className="text-sm text-smoke-400">Control who can see your profile</p>
                </div>
                <select 
                  value={settings.profileVisibility}
                  onChange={(e) => handleSettingChange('profileVisibility', e.target.value)}
                  className="bg-smoke-800 border border-smoke-600 rounded-lg px-3 py-2 text-white"
                >
                  <option value="public">Public</option>
                  <option value="unlisted">Unlisted</option>
                  <option value="private">Private</option>
                </select>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-smoke-200">Show Last Seen</Label>
                  <p className="text-sm text-smoke-400">Display when you were last active</p>
                </div>
                <Switch 
                  checked={settings.showLastSeen}
                  onCheckedChange={(checked) => handleSettingChange('showLastSeen', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-smoke-200">Analytics Tracking</Label>
                  <p className="text-sm text-smoke-400">Allow detailed analytics collection</p>
                </div>
                <Switch 
                  checked={settings.analyticsTracking}
                  onCheckedChange={(checked) => handleSettingChange('analyticsTracking', checked)}
                />
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-smoke-200">Allow Comments</Label>
                  <p className="text-sm text-smoke-400">Let visitors leave comments</p>
                </div>
                <Switch 
                  checked={settings.allowComments}
                  onCheckedChange={(checked) => handleSettingChange('allowComments', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-smoke-200">Direct Messages</Label>
                  <p className="text-sm text-smoke-400">Allow visitors to message you</p>
                </div>
                <Switch 
                  checked={settings.allowDirectMessages}
                  onCheckedChange={(checked) => handleSettingChange('allowDirectMessages', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label className="text-smoke-200">Real-time Views</Label>
                  <p className="text-sm text-smoke-400">Show live visitor count</p>
                </div>
                <Switch 
                  checked={settings.enableRealTimeViews}
                  onCheckedChange={(checked) => handleSettingChange('enableRealTimeViews', checked)}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="glass border-smoke-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
              <Bell className="w-4 h-4 text-white" />
            </div>
            Notifications
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-smoke-200">Email Notifications</Label>
              <p className="text-sm text-smoke-400">Get notified about important updates</p>
            </div>
            <Switch 
              checked={settings.emailNotifications}
              onCheckedChange={(checked) => handleSettingChange('emailNotifications', checked)}
            />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <Label className="text-smoke-200">Require Approval</Label>
              <p className="text-sm text-smoke-400">Review interactions before they appear</p>
            </div>
            <Switch 
              checked={settings.requireApproval}
              onCheckedChange={(checked) => handleSettingChange('requireApproval', checked)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Security */}
      <Card className="glass border-smoke-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center">
              <Lock className="w-4 h-4 text-white" />
            </div>
            Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label className="text-smoke-200">Current Password</Label>
                <Input 
                  type="password"
                  value={settings.password}
                  onChange={(e) => handleSettingChange('password', e.target.value)}
                  className="bg-smoke-800 border-smoke-600 text-white"
                  placeholder="Enter current password"
                />
              </div>
              <div>
                <Label className="text-smoke-200">New Password</Label>
                <Input 
                  type="password"
                  value={settings.newPassword}
                  onChange={(e) => handleSettingChange('newPassword', e.target.value)}
                  className="bg-smoke-800 border-smoke-600 text-white"
                  placeholder="Enter new password"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-smoke-200">Confirm New Password</Label>
                <Input 
                  type="password"
                  value={settings.confirmPassword}
                  onChange={(e) => handleSettingChange('confirmPassword', e.target.value)}
                  className="bg-smoke-800 border-smoke-600 text-white"
                  placeholder="Confirm new password"
                />
              </div>
              <Button 
                variant="outline" 
                className="w-full border-purple-500/50 text-purple-400 hover:bg-purple-500/10"
              >
                Update Password
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Domain Settings */}
      <Card className="glass border-smoke-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center">
              <Globe className="w-4 h-4 text-white" />
            </div>
            Custom Domain
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="text-smoke-200">Custom Domain (Premium)</Label>
            <div className="flex gap-3 mt-2">
              <Input 
                value={settings.customDomain}
                onChange={(e) => handleSettingChange('customDomain', e.target.value)}
                className="bg-smoke-800 border-smoke-600 text-white"
                placeholder="yourdomain.com"
                disabled
              />
              <Button variant="outline" disabled className="border-smoke-600 text-smoke-400">
                Connect
              </Button>
            </div>
            <p className="text-xs text-smoke-500 mt-2">
              Upgrade to Premium to use your own domain
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="glass border-smoke-700/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-3 text-white">
            <div className="w-8 h-8 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl flex items-center justify-center">
              <Database className="w-4 h-4 text-white" />
            </div>
            Data Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              variant="outline" 
              onClick={handleExportData}
              className="border-blue-500/50 text-blue-400 hover:bg-blue-500/10 justify-start"
            >
              <Download className="w-4 h-4 mr-2" />
              Export Data
            </Button>
            <Button 
              variant="outline" 
              onClick={handleDeleteAccount}
              className="border-red-500/50 text-red-400 hover:bg-red-500/10 justify-start"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete Account
            </Button>
          </div>
          <div className="p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="text-yellow-300 font-medium">Data Retention Policy</p>
              <p className="text-yellow-400/80">
                We retain your data for 90 days after account deletion. Export your data before deletion if needed.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Save Changes */}
      {hasChanges && (
        <div className="fixed bottom-8 right-8 z-50">
          <Button 
            onClick={handleSave}
            size="lg"
            className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white shadow-lg"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      )}
    </div>
  );
}