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
    <div className="w-64 min-h-screen bg-black/20 backdrop-blur-md border-r border-white/10 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">G</span>
          </div>
          <span className="text-white font-semibold">guns.lol</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {sidebarSections.map((section) => (
          <div key={section.id} className="space-y-1">
            <button
              onClick={() => onSectionChange(section.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeSection === section.id 
                  ? 'bg-white/20 text-white backdrop-blur-sm' 
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              <section.icon className="w-4 h-4" />
              <span>{section.label}</span>
              {section.subsections && (
                <ChevronDown className="w-4 h-4 ml-auto" />
              )}
            </button>
            
            {section.subsections && activeSection === section.id && (
              <div className="ml-7 space-y-1">
                {section.subsections.map((sub) => (
                  <button
                    key={sub}
                    className="w-full text-left px-3 py-1.5 text-sm text-gray-400 hover:text-white rounded-md hover:bg-gray-800"
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
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-white/20 rounded-full"></div>
          <div>
            <div className="text-sm text-white font-medium">{profile?.username || 'alesta'}</div>
            <div className="text-xs text-white/60">UID HOLDER</div>
          </div>
        </div>
      </div>
    </div>
  );
}