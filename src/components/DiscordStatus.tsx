import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';

interface LanyardData {
  discord_user: {
    id: string;
    username: string;
    avatar: string;
    discriminator: string;
    display_name: string;
  };
  discord_status: 'online' | 'idle' | 'dnd' | 'offline';
  activities: Array<{
    name: string;
    type: number;
    state?: string;
    details?: string;
    timestamps?: {
      start?: number;
      end?: number;
    };
    assets?: {
      large_image?: string;
      large_text?: string;
      small_image?: string;
      small_text?: string;
    };
  }>;
  listening_to_spotify: boolean;
  spotify?: {
    track_id: string;
    timestamps: {
      start: number;
      end: number;
    };
    song: string;
    artist: string;
    album_art_url: string;
    album: string;
  };
}

interface DiscordStatusProps {
  userId: string;
}

const statusColors = {
  online: 'bg-green-500',
  idle: 'bg-yellow-500',
  dnd: 'bg-red-500',
  offline: 'bg-gray-500'
};

const statusLabels = {
  online: 'Online',
  idle: 'Away',
  dnd: 'Do Not Disturb',
  offline: 'Offline'
};

export function DiscordStatus({ userId }: DiscordStatusProps) {
  const [data, setData] = useState<LanyardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscordData = async () => {
      try {
        const response = await fetch(`https://api.lanyard.rest/v1/users/${userId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch Discord data');
        }
        const result = await response.json();
        setData(result.data);
        setError(null);
      } catch (err) {
        setError('Failed to load Discord status');
        console.error('Error fetching Discord data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDiscordData();
    
    // Refresh every 30 seconds
    const interval = setInterval(fetchDiscordData, 30000);
    
    return () => clearInterval(interval);
  }, [userId]);

  if (loading) {
    return (
      <div className="bg-gradient-card border border-border/50 rounded-lg p-6 animate-pulse">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-muted rounded-full"></div>
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="h-3 bg-muted rounded w-1/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gradient-card border border-destructive/50 rounded-lg p-6">
        <p className="text-destructive text-sm">{error}</p>
      </div>
    );
  }

  if (!data) return null;

  const currentActivity = data.activities.find(activity => activity.type === 0); // Playing
  const customStatus = data.activities.find(activity => activity.type === 4); // Custom status

  return (
    <div className="bg-gradient-card border border-border/50 rounded-lg p-6 glow-accent animate-fade-in-delay-2">
      <div className="flex items-start space-x-4">
        <div className="relative">
          <img
            src={`https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=256`}
            alt={data.discord_user.display_name}
            className="w-16 h-16 rounded-full border-2 border-primary/30"
          />
          <div className={`absolute -bottom-1 -right-1 w-5 h-5 ${statusColors[data.discord_status]} rounded-full border-2 border-background`}></div>
        </div>
        
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="text-lg font-semibold text-foreground">
              {data.discord_user.display_name || data.discord_user.username}
            </h3>
            <Badge variant="secondary" className="text-xs">
              {statusLabels[data.discord_status]}
            </Badge>
          </div>
          
          {customStatus && customStatus.state && (
            <p className="text-sm text-muted-foreground">{customStatus.state}</p>
          )}
          
          {data.listening_to_spotify && data.spotify && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-neon-cyan">Listening to Spotify</span>
              </div>
              <div className="bg-secondary/50 rounded-md p-3">
                <p className="text-sm font-medium text-foreground">{data.spotify.song}</p>
                <p className="text-xs text-muted-foreground">by {data.spotify.artist}</p>
              </div>
            </div>
          )}
          
          {currentActivity && !data.listening_to_spotify && (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-neon-purple">Playing</span>
              </div>
              <div className="bg-secondary/50 rounded-md p-3">
                <p className="text-sm font-medium text-foreground">{currentActivity.name}</p>
                {currentActivity.details && (
                  <p className="text-xs text-muted-foreground">{currentActivity.details}</p>
                )}
                {currentActivity.state && (
                  <p className="text-xs text-muted-foreground">{currentActivity.state}</p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}