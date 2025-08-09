import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useProfile, SocialLink } from '@/hooks/useProfile';
import { useToast } from '@/hooks/use-toast';
import { 
  X, 
  Link as LinkIcon, 
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
  Pin
} from 'lucide-react';

// Popular social platforms with their configurations
const SOCIAL_PLATFORMS = [
  { name: 'Instagram', icon: Instagram, baseUrl: 'https://instagram.com/', usernameOnly: true, color: '#E4405F' },
  { name: 'TikTok', icon: Music, baseUrl: 'https://tiktok.com/@', usernameOnly: true, color: '#000000' },
  { name: 'YouTube', icon: Youtube, baseUrl: 'https://youtube.com/c/', usernameOnly: true, color: '#FF0000' },
  { name: 'Twitter', icon: Twitter, baseUrl: 'https://twitter.com/', usernameOnly: true, color: '#1DA1F2' },
  { name: 'LinkedIn', icon: Linkedin, baseUrl: 'https://linkedin.com/in/', usernameOnly: true, color: '#0077B5' },
  { name: 'GitHub', icon: Github, baseUrl: 'https://github.com/', usernameOnly: true, color: '#333333' },
  { name: 'Spotify', icon: Music, baseUrl: 'https://open.spotify.com/user/', usernameOnly: true, color: '#1DB954' },
  { name: 'Discord', icon: MessageCircle, baseUrl: 'https://discord.gg/', usernameOnly: true, color: '#5865F2' },
  { name: 'Twitch', icon: Twitch, baseUrl: 'https://twitch.tv/', usernameOnly: true, color: '#9146FF' },
  { name: 'OnlyFans', icon: Heart, baseUrl: 'https://onlyfans.com/', usernameOnly: true, color: '#00AFF0' },
  { name: 'Reddit', icon: MessageCircle, baseUrl: 'https://reddit.com/u/', usernameOnly: true, color: '#FF4500' },
  { name: 'Snapchat', icon: Camera, baseUrl: 'https://snapchat.com/add/', usernameOnly: true, color: '#FFFC00' },
  { name: 'Pinterest', icon: Pin, baseUrl: 'https://pinterest.com/', usernameOnly: true, color: '#E60023' },
  { name: 'Telegram', icon: Send, baseUrl: 'https://t.me/', usernameOnly: true, color: '#0088CC' },
  { name: 'Email', icon: Mail, baseUrl: 'mailto:', usernameOnly: false, color: '#EA4335' },
  { name: 'Website', icon: Globe, baseUrl: '', usernameOnly: false, color: '#6366F1' },
];

interface SocialLinkDialogProps {
  platform?: typeof SOCIAL_PLATFORMS[0];
  existingLink?: SocialLink;
  isOpen: boolean;
  onClose: () => void;
}

function SocialLinkDialog({ platform, existingLink, isOpen, onClose }: SocialLinkDialogProps) {
  const [username, setUsername] = useState(existingLink?.url?.replace(platform?.baseUrl || '', '') || '');
  const [customUrl, setCustomUrl] = useState(!platform ? existingLink?.url || '' : '');
  const [isCustom, setIsCustom] = useState(!platform);
  const { addSocialLink, updateSocialLink } = useProfile();
  const { toast } = useToast();

  const handleSave = async () => {
    let finalUrl = '';
    let linkName = '';
    let linkIcon = '';

    if (isCustom || !platform) {
      if (!customUrl.trim()) {
        toast({ variant: "destructive", title: "URL gerekli", description: "Lütfen geçerli bir URL girin." });
        return;
      }
      finalUrl = customUrl;
      linkName = 'Custom Link';
      linkIcon = 'Link';
    } else {
      if (!username.trim()) {
        toast({ variant: "destructive", title: "Kullanıcı adı gerekli", description: "Lütfen kullanıcı adınızı girin." });
        return;
      }
      finalUrl = platform.baseUrl + username;
      linkName = platform.name;
      linkIcon = platform.icon.name;
    }

    try {
      if (existingLink) {
        await updateSocialLink(existingLink.id, {
          name: linkName,
          url: finalUrl,
          icon: linkIcon,
          color: platform?.color || '#6366F1'
        });
      } else {
        await addSocialLink({
          name: linkName,
          url: finalUrl,
          icon: linkIcon,
          color: platform?.color || '#6366F1',
          is_visible: true,
          order_index: 0
        });
      }
      onClose();
      setUsername('');
      setCustomUrl('');
    } catch (error) {
      console.error('Error saving social link:', error);
    }
  };

  return (
    <DialogContent className="sm:max-w-[425px] bg-background/95 backdrop-blur-sm border-white/10">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2 text-foreground">
          {platform ? (
            <>
              <platform.icon className="h-5 w-5" />
              {platform.name} {existingLink ? 'Düzenle' : 'Ekle'}
            </>
          ) : (
            <>
              <LinkIcon className="h-5 w-5" />
              {existingLink ? 'Özel Link Düzenle' : 'Özel Link Ekle'}
            </>
          )}
        </DialogTitle>
      </DialogHeader>

      <div className="grid gap-4 py-4">
        {!isCustom && platform ? (
          <div className="grid gap-2">
            <Label htmlFor="username">Kullanıcı Adı</Label>
            <div className="flex">
              <div className="flex items-center px-3 bg-muted rounded-l-md border border-r-0 text-sm text-muted-foreground">
                {platform.baseUrl}
              </div>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="kullaniciadiniz"
                className="rounded-l-none"
              />
            </div>
          </div>
        ) : (
          <div className="grid gap-2">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              value={customUrl}
              onChange={(e) => setCustomUrl(e.target.value)}
              placeholder="https://example.com"
              type="url"
            />
          </div>
        )}

        {!existingLink && platform && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsCustom(!isCustom)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {isCustom ? 'Platform seç' : 'Özel URL kullan'}
          </Button>
        )}
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onClose}>
          İptal
        </Button>
        <Button onClick={handleSave}>
          {existingLink ? 'Güncelle' : 'Ekle'}
        </Button>
      </div>
    </DialogContent>
  );
}

export function SocialLinksManager() {
  const { socialLinks, deleteSocialLink } = useProfile();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedPlatform, setSelectedPlatform] = useState<typeof SOCIAL_PLATFORMS[0] | undefined>();
  const [editingLink, setEditingLink] = useState<SocialLink | undefined>();

  const handlePlatformClick = (platform: typeof SOCIAL_PLATFORMS[0]) => {
    setSelectedPlatform(platform);
    setEditingLink(undefined);
    setDialogOpen(true);
  };

  const handleCustomLinkClick = () => {
    setSelectedPlatform(undefined);
    setEditingLink(undefined);
    setDialogOpen(true);
  };

  const handleEditLink = (link: SocialLink) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.name === link.name);
    setSelectedPlatform(platform);
    setEditingLink(link);
    setDialogOpen(true);
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      await deleteSocialLink(linkId);
    } catch (error) {
      console.error('Error deleting link:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">Sosyal Medya Linklerini Bağla</h3>
        <p className="text-sm text-muted-foreground">Profiline eklemek istediğin sosyal medya hesaplarını seç.</p>
      </div>

      {/* Social Platform Icons Grid */}
      <div className="grid grid-cols-8 gap-3">
        {SOCIAL_PLATFORMS.map((platform) => {
          const existingLink = socialLinks.find(link => link.name === platform.name);
          return (
            <button
              key={platform.name}
              onClick={() => handlePlatformClick(platform)}
              className="relative group aspect-square p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors flex items-center justify-center"
              title={platform.name}
            >
              <platform.icon className="h-5 w-5" style={{ color: platform.color }} />
              {existingLink && (
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background" />
              )}
            </button>
          );
        })}
        
        {/* Custom URL Button */}
        <button
          onClick={handleCustomLinkClick}
          className="aspect-square p-3 rounded-lg bg-muted/50 hover:bg-muted transition-colors flex items-center justify-center group border-2 border-dashed border-muted-foreground/30"
          title="Özel URL Ekle"
        >
          <LinkIcon className="h-5 w-5 text-muted-foreground group-hover:text-foreground" />
        </button>
      </div>

      {/* Added Links */}
      {socialLinks.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-foreground">Eklenen Linkler</h4>
          <div className="space-y-2">
            {socialLinks.map((link) => (
              <div
                key={link.id}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
              >
                <div className="flex items-center gap-3">
                  {(() => {
                    const IconComponent = SOCIAL_PLATFORMS.find(p => p.name === link.name)?.icon || LinkIcon;
                    return <IconComponent className="h-5 w-5" style={{ color: link.color }} />;
                  })()}
                  <div>
                    <p className="text-sm font-medium text-foreground">{link.name}</p>
                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">{link.url}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEditLink(link)}
                    className="h-8 px-2 text-xs"
                  >
                    Düzenle
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteLink(link.id)}
                    className="h-8 px-2 text-xs text-destructive hover:text-destructive"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <SocialLinkDialog
          platform={selectedPlatform}
          existingLink={editingLink}
          isOpen={dialogOpen}
          onClose={() => setDialogOpen(false)}
        />
      </Dialog>
    </div>
  );
}