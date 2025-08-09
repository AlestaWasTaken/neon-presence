import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { ExternalLink, X } from 'lucide-react';

interface EmbeddedViewProps {
  url: string;
  name: string;
  color: string;
}

const EmbeddedView = ({ url, name, color }: EmbeddedViewProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [showIframe, setShowIframe] = useState(false);

  const handleViewClick = () => {
    setIsOpen(true);
    setShowIframe(true);
  };

  const handleExternalLink = () => {
    const fullUrl = url.startsWith('http') ? url : `https://${url}`;
    window.open(fullUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <>
      <Button
        variant="outline"
        size="lg"
        className="group transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-primary/25"
        onClick={handleViewClick}
      >
        <span className="flex items-center gap-3 px-6 py-3" style={{ color: color }}>
          <span className="text-lg font-medium">{name}</span>
        </span>
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl h-[80vh] p-0">
          <DialogHeader className="px-6 py-4 border-b">
            <DialogTitle className="flex items-center justify-between">
              <span style={{ color: color }}>{name}</span>
              <div className="flex gap-2">
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleExternalLink}
                  className="flex items-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Yeni sekmede aç
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </DialogTitle>
            <DialogDescription>
              {url}
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-1 w-full h-full">
            {showIframe ? (
              <iframe
                src={url.startsWith('http') ? url : `https://${url}`}
                className="w-full h-full border-0"
                title={name}
                onError={() => {
                  console.error('Failed to load iframe content');
                }}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center space-y-4">
                  <p className="text-muted-foreground">İçerik yükleniyor...</p>
                  <Button onClick={() => setShowIframe(true)}>
                    İçeriği Yükle
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EmbeddedView;