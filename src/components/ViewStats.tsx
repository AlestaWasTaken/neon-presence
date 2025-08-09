import { Eye, Users } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useProfileViews } from '@/hooks/useProfileViews';
import { useAuth } from '@/hooks/useAuth';

interface ViewStatsProps {
  profileUserId?: string;
}

const ViewStats = ({ profileUserId }: ViewStatsProps) => {
  const { user } = useAuth();
  const { viewCount, activeViewers } = useProfileViews(profileUserId);

  // Only show to profile owner
  if (!user || !profileUserId || user.id !== profileUserId) {
    return null;
  }

  return (
    <div className="flex justify-center gap-4 animate-fade-in">
      <Card className="bg-card/50 backdrop-blur border-primary/20">
        <CardContent className="flex items-center gap-2 p-3">
          <Eye className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium">
            {viewCount} görüntüleme
          </span>
        </CardContent>
      </Card>
      
      <Card className="bg-card/50 backdrop-blur border-primary/20">
        <CardContent className="flex items-center gap-2 p-3">
          <Users className="h-4 w-4 text-neon-pink" />
          <span className="text-sm font-medium">
            {activeViewers} aktif ziyaretçi
          </span>
        </CardContent>
      </Card>
    </div>
  );
};

export default ViewStats;