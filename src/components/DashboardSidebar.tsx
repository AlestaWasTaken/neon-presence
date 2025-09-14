import React from 'react';
import { 
  User, 
  Palette, 
  Link as LinkIcon, 
  Crown, 
  Image as ImageIcon, 
  FileText,
  BarChart3,
  Settings,
  ChevronDown,
  Eye,
  Hash,
  Calendar
} from 'lucide-react';

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
  profile: any;
}

export function DashboardSidebar({ activeSection, onSectionChange, profile }: SidebarProps) {
  const sidebarSections = [
    { 
      id: 'account', 
      label: 'account', 
      icon: User,
      subsections: ['Overview', 'Analytics', 'Badges', 'Settings']
    },
    { 
      id: 'customize', 
      label: 'customize', 
      icon: Palette,
      active: true
    },
    { 
      id: 'links', 
      label: 'links', 
      icon: LinkIcon
    },
    { 
      id: 'premium', 
      label: 'premium', 
      icon: Crown
    },
    { 
      id: 'image-host', 
      label: 'image host', 
      icon: ImageIcon
    },
    { 
      id: 'templates', 
      label: 'templates', 
      icon: FileText
    }
  ];

  return (
    <div className="w-72 min-h-screen glass border-r border-smoke-700/30 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-smoke-700/30">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold">G</span>
          </div>
          <div>
            <span className="text-white font-bold text-lg">guns.lol</span>
            <div className="text-xs text-smoke-400">Dashboard</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-6 space-y-3">
        {sidebarSections.map((section) => (
          <div key={section.id} className="space-y-2">
            <button
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-4 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 hover-lift ${
                activeSection === section.id 
                  ? 'bg-gradient-to-r from-purple-600/20 to-purple-500/20 text-white border border-purple-500/30 shadow-lg' 
                  : 'text-smoke-300 hover:text-white hover:bg-smoke-800/50'
              }`}
            >
              <section.icon className="w-5 h-5" />
              <span className="capitalize">{section.label}</span>
              {section.subsections && (
                <ChevronDown className={`w-4 h-4 ml-auto transition-transform ${
                  activeSection === section.id ? 'rotate-180' : ''
                }`} />
              )}
            </button>
            
            {section.subsections && activeSection === section.id && (
              <div className="ml-9 space-y-1 animate-fade-in">
                {section.subsections.map((sub) => (
                  <button
                    key={sub}
                    className="w-full text-left px-3 py-2 text-sm text-smoke-400 hover:text-white rounded-lg hover:bg-smoke-800/30 transition-colors"
                  >
                    {sub}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </nav>

      {/* Footer */}
      <div className="p-6 border-t border-smoke-700/30">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-gradient-to-br from-smoke-600 to-smoke-800 rounded-full flex items-center justify-center">
            <User className="w-6 h-6 text-smoke-300" />
          </div>
          <div>
            <div className="text-sm text-white font-semibold">{profile?.username || 'alesta'}</div>
            <div className="text-xs text-smoke-400 flex items-center gap-1">
              <Crown className="w-3 h-3" />
              UID HOLDER
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}