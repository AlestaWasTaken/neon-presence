import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useProfileViews } from '@/hooks/useProfileViews';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { BarChart3, Calendar, User } from 'lucide-react';
import { format } from 'date-fns';
import { tr } from 'date-fns/locale';

const ViewAnalytics = () => {
  const { user } = useAuth();
  const { recentViews, fetchRecentViews } = useProfileViews(user?.id);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (isOpen && user) {
      fetchRecentViews();
    }
  }, [isOpen, user, fetchRecentViews]);

  if (!user) return null;

  const groupViewsByDate = () => {
    const groups: { [key: string]: number } = {};
    recentViews.forEach(view => {
      const date = format(new Date(view.created_at), 'dd MMM yyyy', { locale: tr });
      groups[date] = (groups[date] || 0) + 1;
    });
    return groups;
  };

  const viewsByDate = groupViewsByDate();

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
          <BarChart3 className="h-4 w-4 mr-2" />
          Analitik
        </Button>
      </DialogTrigger>
      
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Profil Analitikleri</DialogTitle>
          <DialogDescription>
            Profilinizi kimin görüntülediğini ve ne zaman görüntülendiğini takip edin.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Daily Views Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Günlük Görüntülenmeler
              </CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(viewsByDate).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(viewsByDate)
                    .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
                    .map(([date, count]) => (
                      <div key={date} className="flex justify-between items-center p-2 rounded bg-muted/50">
                        <span className="text-sm">{date}</span>
                        <span className="font-medium">{count} görüntüleme</span>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Henüz görüntüleme verisi yok</p>
              )}
            </CardContent>
          </Card>

          {/* Recent Views List */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Son Görüntülemeler
              </CardTitle>
            </CardHeader>
            <CardContent>
              {recentViews.length > 0 ? (
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {recentViews.map(view => (
                    <div key={view.id} className="flex justify-between items-center p-2 rounded bg-muted/50 text-sm">
                      <div>
                        <span className="font-medium">
                          {view.viewer_user_id ? 'Kayıtlı Kullanıcı' : 'Anonim Ziyaretçi'}
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        {format(new Date(view.created_at), 'dd MMM HH:mm', { locale: tr })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground text-sm">Henüz görüntüleme yok</p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ViewAnalytics;