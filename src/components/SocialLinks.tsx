import { Button } from '@/components/ui/button';
import { Github, Twitter, Instagram, Linkedin, Mail, Globe, Youtube, Twitch } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<any>;
  color: string;
}

// Configure your social links here
const socialLinks: SocialLink[] = [
  {
    name: 'GitHub',
    url: 'https://github.com/yourusername',
    icon: Github,
    color: 'hover:text-neon-purple'
  },
  {
    name: 'Twitter',
    url: 'https://twitter.com/yourusername',
    icon: Twitter,
    color: 'hover:text-neon-cyan'
  },
  {
    name: 'Instagram',
    url: 'https://instagram.com/yourusername',
    icon: Instagram,
    color: 'hover:text-neon-pink'
  },
  {
    name: 'LinkedIn',
    url: 'https://linkedin.com/in/yourusername',
    icon: Linkedin,
    color: 'hover:text-blue-400'
  },
  {
    name: 'Email',
    url: 'mailto:your@email.com',
    icon: Mail,
    color: 'hover:text-green-400'
  },
  {
    name: 'Website',
    url: 'https://yourwebsite.com',
    icon: Globe,
    color: 'hover:text-neon-purple'
  }
];

export function SocialLinks() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in-delay">
      {socialLinks.map((link) => {
        const Icon = link.icon;
        return (
          <Button
            key={link.name}
            variant="outline"
            size="lg"
            asChild
            className="h-14 border-border/50 bg-gradient-card hover:bg-secondary/20 hover:border-primary/50 transition-all duration-300 group hover:glow-primary"
          >
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-3"
            >
              <Icon className={`w-5 h-5 text-muted-foreground group-hover:scale-110 transition-all duration-300 ${link.color}`} />
              <span className="font-medium text-foreground group-hover:text-primary transition-colors duration-300">
                {link.name}
              </span>
            </a>
          </Button>
        );
      })}
    </div>
  );
}