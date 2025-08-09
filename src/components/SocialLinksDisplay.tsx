import { 
  Instagram, 
  Youtube, 
  Twitter, 
  Linkedin, 
  Github, 
  Music,
  MessageCircle,
  Twitch,
  Heart,
  Send,
  Mail,
  Globe,
  Camera,
  Pin,
  Link as LinkIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SocialLink {
  id: string;
  name: string;
  url: string;
  icon: string;
  color: string;
  is_visible: boolean;
  order_index: number;
}

interface SocialLinksDisplayProps {
  socialLinks: SocialLink[];
}

const getIconComponent = (iconName: string, platformName: string) => {
  // Map icon names to components
  const iconMap: { [key: string]: any } = {
    'Instagram': Instagram,
    'Youtube': Youtube, 
    'Twitter': Twitter,
    'Linkedin': Linkedin,
    'Github': Github,
    'Music': Music,
    'MessageCircle': MessageCircle,
    'Twitch': Twitch,
    'Heart': Heart,
    'Send': Send,
    'Mail': Mail,
    'Globe': Globe,
    'Camera': Camera,
    'Pin': Pin,
    'Link': LinkIcon
  };

  // Try to get icon by name first, then by platform name
  return iconMap[iconName] || iconMap[platformName] || LinkIcon;
};

export function SocialLinksDisplay({ socialLinks }: SocialLinksDisplayProps) {
  if (!socialLinks || socialLinks.length === 0) {
    return (
      <div className="text-center">
        <p className="text-xs text-smoke-500 font-mono">
          no connections yet
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center gap-2">
      {socialLinks
        .filter(link => link.is_visible)
        .sort((a, b) => a.order_index - b.order_index)
        .map((link) => {
          const IconComponent = getIconComponent(link.icon, link.name);
          
          return (
            <Button
              key={link.id}
              variant="ghost"
              size="sm"
              asChild
              className="glass hover-lift text-smoke-300 hover:text-smoke-100 border-smoke-700/20 transition-all duration-200 hover:scale-105"
            >
              <a
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-2 flex items-center gap-2"
                style={{ borderColor: `${link.color}20` }}
              >
                <IconComponent 
                  className="h-4 w-4" 
                  style={{ color: link.color }} 
                />
                <span className="text-sm">{link.name}</span>
              </a>
            </Button>
          );
        })}
    </div>
  );
}