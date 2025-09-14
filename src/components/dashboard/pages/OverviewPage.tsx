import React from 'react';
import { Eye, Users, Calendar, TrendingUp, Crown, Sparkles, ExternalLink } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface OverviewPageProps {
  profile: any;
  user: any;
}

export function OverviewPage({ profile, user }: OverviewPageProps) {
  const stats = [
    {
      label: 'Total Views',
      value: profile?.view_count?.toLocaleString() || '0',
      change: '+12%',
      icon: Eye,
      color: 'from-blue-500 to-blue-600'
    },
    {
      label: 'Profile Visits',
      value: '2.4K',
      change: '+8%',
      icon: Users,
      color: 'from-green-500 to-green-600'
    },
    {
      label: 'This Month',
      value: '356',
      change: '+23%',
      icon: Calendar,
      color: 'from-purple-500 to-purple-600'
    },
    {
      label: 'Growth Rate',
      value: '15.2%',
      change: '+5%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600'
    }
  ];

  const recentActivity = [
    { action: 'Profile viewed by user', time: '2 minutes ago', type: 'view' },
    { action: 'Background video updated', time: '1 hour ago', type: 'update' },
    { action: 'New social link added', time: '3 hours ago', type: 'social' },
    { action: 'Profile customization saved', time: '5 hours ago', type: 'customize' },
    { action: 'Username changed', time: '1 day ago', type: 'profile' }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-white text-gradient mb-3">
          Welcome back, {profile?.username || 'User'}!
        </h1>
        <p className="text-smoke-400 text-lg">
          Here's what's happening with your profile today
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <Card key={index} className="glass border-smoke-700/30 p-6 hover-lift group">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <div className="text-xs text-green-400 font-medium">{stat.change}</div>
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-sm text-smoke-400">{stat.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="glass border-smoke-700/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
              Profile Overview
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-smoke-400 mb-1 block">Username</label>
                  <div className="text-lg font-semibold text-white">{profile?.username || 'Not set'}</div>
                </div>
                <div>
                  <label className="text-sm text-smoke-400 mb-1 block">Bio</label>
                  <div className="text-white">{profile?.bio || 'No bio added yet'}</div>
                </div>
                <div>
                  <label className="text-sm text-smoke-400 mb-1 block">Location</label>
                  <div className="text-white">{profile?.location || 'Not specified'}</div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="text-sm text-smoke-400 mb-1 block">Member Since</label>
                  <div className="text-lg font-semibold text-white">
                    {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'Unknown'}
                  </div>
                </div>
                <div>
                  <label className="text-sm text-smoke-400 mb-1 block">UID</label>
                  <div className="text-white font-mono">#{profile?.sequential_id || 'N/A'}</div>
                </div>
                <div className="flex gap-3">
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white"
                  >
                    View Profile
                    <ExternalLink className="w-4 h-4 ml-2" />
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    className="border-smoke-600 text-smoke-300 hover:bg-smoke-800"
                  >
                    Edit Profile
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Recent Activity */}
          <Card className="glass border-smoke-700/30 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
              <div className="w-2 h-8 bg-gradient-to-b from-green-500 to-green-600 rounded-full" />
              Recent Activity
            </h2>
            
            <div className="space-y-4">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-4 bg-smoke-900/30 rounded-xl">
                  <div className="w-2 h-2 bg-purple-500 rounded-full" />
                  <div className="flex-1">
                    <div className="text-white font-medium">{activity.action}</div>
                    <div className="text-sm text-smoke-400">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
          {/* Profile Completion */}
          <Card className="glass border-smoke-700/30 p-6">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-purple-400" />
              Profile Status
            </h3>
            
            <div className="text-center mb-4">
              <div className="text-3xl font-bold text-white text-gradient mb-1">78%</div>
              <div className="text-sm text-smoke-400">Complete</div>
            </div>
            
            <div className="w-full bg-smoke-800 rounded-full h-2 mb-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 h-2 rounded-full" style={{ width: '78%' }} />
            </div>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-smoke-400">
                <span>✓ Avatar uploaded</span>
                <span className="text-green-400">Done</span>
              </div>
              <div className="flex justify-between text-smoke-400">
                <span>✓ Bio added</span>
                <span className="text-green-400">Done</span>
              </div>
              <div className="flex justify-between text-smoke-400">
                <span>• Social links</span>
                <span className="text-purple-400">Pending</span>
              </div>
              <div className="flex justify-between text-smoke-400">
                <span>• Background video</span>
                <span className="text-purple-400">Pending</span>
              </div>
            </div>
          </Card>

          {/* Premium Upgrade */}
          <Card className="glass border-purple-500/30 p-6 bg-gradient-to-br from-purple-900/20 to-purple-800/20">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Upgrade to Premium</h3>
              <p className="text-sm text-purple-300 mb-4">
                Unlock exclusive features and customization options
              </p>
              <Button className="w-full bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white">
                Upgrade Now
              </Button>
            </div>
          </Card>

          {/* Quick Links */}
          <Card className="glass border-smoke-700/30 p-6">
            <h3 className="text-lg font-bold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <Button variant="outline" className="w-full justify-start border-smoke-600 text-smoke-300 hover:bg-smoke-800">
                Customize Profile
              </Button>
              <Button variant="outline" className="w-full justify-start border-smoke-600 text-smoke-300 hover:bg-smoke-800">
                View Analytics
              </Button>
              <Button variant="outline" className="w-full justify-start border-smoke-600 text-smoke-300 hover:bg-smoke-800">
                Manage Links
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}