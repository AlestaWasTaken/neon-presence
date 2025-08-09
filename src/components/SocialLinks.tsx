import { Button } from '@/components/ui/button';
import { Github, Twitter, Instagram, Linkedin, Mail, Globe, Youtube, Twitch } from 'lucide-react';

interface SocialLink {
  name: string;
  url: string;
  icon: React.ComponentType<any>;
  color: string;
}

// Configure your social links here - Leave empty for clean start
const socialLinks: SocialLink[] = [];

export function SocialLinks() {
  // Return empty div since links are now managed through database
  return null;
}