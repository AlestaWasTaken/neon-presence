import React from 'react';
import { 
  LayoutDashboard,
  User, 
  Palette, 
  BarChart3,
  Link as LinkIcon, 
  Crown, 
  Image as ImageIcon, 
  FileText,
  Settings,
  LogOut
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  profile: any;
}

export function DashboardSidebar({ activeSection, onSectionChange, profile }: SidebarProps) {
  const menuItems = [
    { 
      id: 'overview', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      description: 'Main overview'
    },
    { 
      id: 'account', 
      label: 'Account', 
      icon: User,
      description: 'Profile settings'
    },
    { 
      id: 'customize', 
      label: 'Customize', 
      icon: Palette,
      description: 'Personalize profile'
    },
    { 
      id: 'analytics', 
      label: 'Analytics', 
      icon: BarChart3,
      description: 'View statistics'
    },
    { 
      id: 'social-links', 
      label: 'Social Links', 
      icon: LinkIcon,
      description: 'Manage links'
    },
    { 
      id: 'premium', 
      label: 'Premium', 
      icon: Crown,
      description: 'Upgrade features',
      premium: true
    },
    { 
      id: 'media', 
      label: 'Media Host', 
      icon: ImageIcon,
      description: 'File management'
    },
    { 
      id: 'templates', 
      label: 'Templates', 
      icon: FileText,
      description: 'Profile themes'
    }
  ];

  return (
    <div className="w-80 min-h-screen glass border-r border-smoke-700/30 flex flex-col">
      {/* Header */}
      <div className="p-8 border-b border-smoke-700/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-700 rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-white font-bold text-lg">G</span>
          </div>
          <div>
            <h1 className="text-white font-bold text-xl">devious</h1>
            <p className="text-smoke-400 text-sm">Dashboard Panel</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-2">
        <div className="mb-6">
          <h2 className="text-smoke-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Main Menu
          </h2>
          <div className="space-y-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSectionChange(item.id)}
                className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover-lift ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-r from-purple-600/30 to-purple-500/30 text-white border border-purple-500/30 shadow-lg' 
                    : 'text-smoke-300 hover:text-white hover:bg-smoke-800/50'
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                  activeSection === item.id 
                    ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg' 
                    : 'bg-smoke-800/50 text-smoke-400 group-hover:bg-smoke-700 group-hover:text-white'
                }`}>
                  <item.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 text-left">
                  <div className="flex items-center gap-2">
                    <span className="capitalize">{item.label}</span>
                    {item.premium && (
                      <Crown className="w-3 h-3 text-purple-400" />
                    )}
                  </div>
                  <p className="text-xs text-smoke-500 group-hover:text-smoke-400">
                    {item.description}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-smoke-700/30">
          <h2 className="text-smoke-400 text-xs font-semibold uppercase tracking-wider mb-3">
            Account
          </h2>
          <div className="space-y-1">
            <button 
              onClick={() => onSectionChange('settings')}
              className={`w-full group flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                activeSection === 'settings' 
                  ? 'bg-gradient-to-r from-purple-600/30 to-purple-500/30 text-white border border-purple-500/30 shadow-lg' 
                  : 'text-smoke-300 hover:text-white hover:bg-smoke-800/50'
              }`}
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all ${
                activeSection === 'settings' 
                  ? 'bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg' 
                  : 'bg-smoke-800/50 text-smoke-400 group-hover:bg-smoke-700 group-hover:text-white'
              }`}>
                <Settings className="w-5 h-5" />
              </div>
              <div className="flex-1 text-left">
                <span>Settings</span>
                <p className="text-xs text-smoke-500 group-hover:text-smoke-400">
                  Preferences
                </p>
              </div>
            </button>
            <button className="w-full group flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium text-smoke-300 hover:text-red-400 hover:bg-red-900/20 transition-all">
              <div className="w-10 h-10 rounded-lg bg-smoke-800/50 group-hover:bg-red-900/30 flex items-center justify-center transition-all">
                <LogOut className="w-5 h-5 text-smoke-400 group-hover:text-red-400" />
              </div>
              <div className="flex-1 text-left">
                <span>Logout</span>
                <p className="text-xs text-smoke-500 group-hover:text-red-300">
                  Sign out
                </p>
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-smoke-700/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-smoke-600 to-smoke-800 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-smoke-300" />
          </div>
          <div className="flex-1">
            <div className="text-sm text-white font-semibold">{profile?.username || 'alesta'}</div>
            <div className="text-xs text-smoke-400 flex items-center gap-1">
              <Crown className="w-3 h-3" />
              UID #{profile?.sequential_id || '143308'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}