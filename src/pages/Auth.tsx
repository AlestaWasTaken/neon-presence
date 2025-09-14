import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';
import { useNavigate } from 'react-router-dom';
import VideoBackground from '@/components/VideoBackground';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { user, signIn, signUp } = useAuth();
  const navigate = useNavigate();

  // Redirect if already logged in
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn(email, password);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signUp(email, password, username);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-smoke-950 to-background flex items-center justify-center p-6">
      <VideoBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8 space-y-4">
          <h1 className="text-2xl font-black">
            <span className="text-gradient bg-gradient-to-r from-smoke-100 to-smoke-300 bg-clip-text text-transparent">
              Welcome to the hideout
            </span>
          </h1>
          <p className="text-smoke-400 text-sm">
            Enter your credentials to access the darkroom
          </p>
        </div>

        <Card className="glass border-smoke-700/30 shadow-deep">
          <CardHeader className="pb-4">
            <CardTitle className="text-smoke-100 text-center text-lg">Access Control</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin" className="w-full">
              <TabsList className="grid w-full grid-cols-2 glass border-smoke-700/30 mb-6">
                <TabsTrigger value="signin" className="text-smoke-400 data-[state=active]:text-smoke-100">
                  Sign In
                </TabsTrigger>
                <TabsTrigger value="signup" className="text-smoke-400 data-[state=active]:text-smoke-100">
                  Sign Up
                </TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-smoke-300 text-xs uppercase tracking-wider">
                      Email
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="glass border-smoke-700/30 text-smoke-100 placeholder:text-smoke-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-smoke-300 text-xs uppercase tracking-wider">
                      Password
                    </Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="glass border-smoke-700/30 text-smoke-100 placeholder:text-smoke-500"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full glass hover-lift bg-smoke-800/50 text-smoke-100 border-smoke-600/30 hover:bg-smoke-700/50"
                    disabled={loading}
                  >
                    {loading ? 'Accessing...' : 'Enter'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="signup-email" className="text-smoke-300 text-xs uppercase tracking-wider">
                      Email
                    </Label>
                    <Input
                      id="signup-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="glass border-smoke-700/30 text-smoke-100 placeholder:text-smoke-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="username" className="text-smoke-300 text-xs uppercase tracking-wider">
                      Username
                    </Label>
                    <Input
                      id="username"
                      type="text"
                      placeholder="Choose a username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="glass border-smoke-700/30 text-smoke-100 placeholder:text-smoke-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="signup-password" className="text-smoke-300 text-xs uppercase tracking-wider">
                      Password
                    </Label>
                    <Input
                      id="signup-password"
                      type="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="glass border-smoke-700/30 text-smoke-100 placeholder:text-smoke-500"
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full glass hover-lift bg-smoke-800/50 text-smoke-100 border-smoke-600/30 hover:bg-smoke-700/50"
                    disabled={loading}
                  >
                    {loading ? 'Creating...' : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        <div className="text-center mt-6">
          <Button 
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-smoke-400 hover:text-smoke-200 text-xs"
          >
            ← Back to main
          </Button>
        </div>
      </div>
    </div>
  );
}