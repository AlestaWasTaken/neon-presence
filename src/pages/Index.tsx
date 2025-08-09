import { DiscordStatus } from '@/components/DiscordStatus';
import { SocialLinks } from '@/components/SocialLinks';

// Configure your personal information here
const DISCORD_USER_ID = "YOUR_DISCORD_ID"; // Replace with your Discord ID
const USERNAME = "username"; // Replace with your username
const BIO = "digital nomad / hacker / dreamer"; // Replace with your bio

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Background gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      
      <div className="relative z-10 container mx-auto px-4 py-12 sm:py-20">
        <div className="max-w-2xl mx-auto space-y-8">
          
          {/* Header Section */}
          <div className="text-center space-y-6 animate-fade-in">
            <div className="space-y-2">
              <h1 className="text-5xl sm:text-7xl font-black tracking-tight">
                <span className="text-neon animate-pulse-neon">{USERNAME}</span>
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground font-light tracking-wide">
                {BIO}
              </p>
            </div>
            
            {/* Decorative line */}
            <div className="w-24 h-0.5 bg-gradient-primary mx-auto rounded-full" />
          </div>

          {/* Discord Status */}
          <DiscordStatus userId={DISCORD_USER_ID} />

          {/* Social Links */}
          <SocialLinks />

          {/* Footer */}
          <div className="text-center pt-8 animate-fade-in-delay-2">
            <p className="text-sm text-muted-foreground">
              Built with <span className="text-neon-pink">♥</span> and inspired by{' '}
              <a 
                href="https://guns.lol" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:text-primary-glow transition-colors duration-300 underline underline-offset-4"
              >
                guns.lol
              </a>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Index;
