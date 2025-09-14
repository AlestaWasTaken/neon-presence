import React from 'react';
import { Eye, Hash, Calendar, Crown, Settings, Sparkles, User } from 'lucide-react';

interface AccountOverviewProps {
  profile: any;
}

export function AccountOverview({ profile }: AccountOverviewProps) {
  const stats = [
    {
      label: 'Username',
      value: profile?.username || 'alesta',
      subtitle: 'Change available now',
      editable: true
    },
    {
      label: 'Alias',
      value: 'Unavailable',
      subtitle: 'Premium Only',
      locked: true
    },
    {
      label: 'UID',
      value: profile?.sequential_id?.toString() || '143,308',
      subtitle: 'Among the first 1%',
      icon: Hash
    },
    {
      label: 'Profile Views',
      value: profile?.view_count?.toString() || '128',
      subtitle: '+5 views since last 7 days',
      icon: Eye
    }
  ];

  const completionTasks = [
    { task: 'Upload An Avatar', completed: !!profile?.avatar_url },
    { task: 'Add A Description', completed: !!profile?.bio },
    { task: 'Link Discord Account', completed: false },
    { task: 'Add Socials', completed: true },
    { task: 'Enable 2FA', completed: false }
  ];

  const completedCount = completionTasks.filter(t => t.completed).length;
  const completionPercentage = (completedCount / completionTasks.length) * 100;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-white text-gradient mb-2">Account Overview</h1>
        <p className="text-smoke-400">Manage your profile and track your performance</p>
      </div>

      {/* Account Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="glass rounded-xl p-6 hover-lift group">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium text-smoke-300">{stat.label}</span>
              {stat.editable && (
                <button className="text-smoke-400 hover:text-purple-400 transition-colors p-1 rounded">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </button>
              )}
              {stat.locked && (
                <button className="text-purple-400 hover:text-purple-300 transition-colors">
                  <Crown className="w-4 h-4" />
                </button>
              )}
              {stat.icon && (
                <stat.icon className="w-5 h-5 text-purple-400" />
              )}
            </div>
            <div className="text-2xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-xs text-smoke-400">{stat.subtitle}</div>
          </div>
        ))}
      </div>

      {/* Profile Completion */}
      <div className="glass rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Profile Completion</h3>
            <p className="text-smoke-400">Complete your profile to unlock more features</p>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-white text-gradient mb-1">{Math.round(completionPercentage)}%</div>
            <div className="text-sm text-smoke-400">completed</div>
          </div>
        </div>
        
        <div className="relative mb-6">
          <div className="w-full bg-smoke-800 rounded-full h-3">
            <div 
              className="bg-gradient-to-r from-purple-500 to-purple-600 h-3 rounded-full transition-all duration-500 shadow-lg"
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
          <div className="absolute top-0 left-0 w-full h-3 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 animate-pulse" />
        </div>

        {completionPercentage < 100 && (
          <div className="bg-gradient-to-r from-yellow-900/20 to-orange-900/20 border border-yellow-500/30 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3 text-yellow-400 mb-2">
              <Sparkles className="w-5 h-5" />
              <span className="font-semibold">Almost there!</span>
            </div>
            <p className="text-sm text-yellow-300">Complete your profile to unlock premium features and increase visibility.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {completionTasks.map((task, index) => (
            <div key={index} className="flex items-center gap-3 p-3 rounded-lg bg-smoke-900/30">
              <div className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                task.completed 
                  ? 'bg-gradient-to-r from-green-500 to-green-600 shadow-lg' 
                  : 'bg-smoke-700 border-2 border-smoke-600'
              }`}>
                {task.completed && (
                  <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              <span className={`text-sm font-medium ${task.completed ? 'text-green-400' : 'text-smoke-400'}`}>
                {task.task}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Account Management */}
      <div className="glass rounded-xl p-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-white mb-2">Account Management</h3>
            <p className="text-smoke-400">Customize your profile and settings</p>
          </div>
          <div className="text-sm text-purple-400 bg-purple-500/10 px-3 py-1 rounded-full">
            {Math.round(completionPercentage)}% complete
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button className="group flex items-center gap-4 p-4 text-left bg-smoke-900/30 hover:bg-smoke-800/50 rounded-xl transition-all hover-lift">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
            </div>
            <div>
              <div className="font-medium text-white group-hover:text-blue-400 transition-colors">Change Username</div>
              <div className="text-sm text-smoke-400">Update your display name</div>
            </div>
          </button>

          <button className="group flex items-center gap-4 p-4 text-left bg-smoke-900/30 hover:bg-smoke-800/50 rounded-xl transition-all hover-lift">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-white group-hover:text-green-400 transition-colors">Profile Settings</div>
              <div className="text-sm text-smoke-400">Manage your profile data</div>
            </div>
          </button>

          <button className="group flex items-center gap-4 p-4 text-left bg-gradient-to-r from-purple-900/30 to-purple-800/30 hover:from-purple-800/50 hover:to-purple-700/50 rounded-xl transition-all hover-lift border border-purple-500/20">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Crown className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-purple-400 group-hover:text-purple-300 transition-colors">Upgrade to Premium</div>
              <div className="text-sm text-purple-300/70">Unlock exclusive features</div>
            </div>
          </button>

          <button className="group flex items-center gap-4 p-4 text-left bg-smoke-900/30 hover:bg-smoke-800/50 rounded-xl transition-all hover-lift">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Settings className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="font-medium text-white group-hover:text-orange-400 transition-colors">Account Settings</div>
              <div className="text-sm text-smoke-400">Security and preferences</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}