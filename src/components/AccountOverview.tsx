import React from 'react';
import { Eye, Hash, Calendar, Crown, Settings } from 'lucide-react';

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
    <div className="space-y-6">
      {/* Account Overview */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Account Overview</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat, index) => (
            <div key={index} className="bg-gray-800 rounded-lg p-4 border border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-400">{stat.label}</span>
                {stat.editable && (
                  <button className="text-gray-400 hover:text-white">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                )}
                {stat.locked && (
                  <button className="text-purple-400">
                    <Crown className="w-4 h-4" />
                  </button>
                )}
                {stat.icon && (
                  <stat.icon className="w-4 h-4 text-gray-400" />
                )}
              </div>
              <div className="text-lg font-semibold text-white">{stat.value}</div>
              <div className="text-xs text-gray-500">{stat.subtitle}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Account Statistics */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-4">Account Statistics</h2>
        
        {/* Profile Completion */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-medium text-white">Profile Completion</h3>
              <p className="text-sm text-gray-400">Complete your profile to make it more discoverable and appealing.</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{Math.round(completionPercentage)}%</div>
              <div className="text-sm text-gray-400">completed</div>
            </div>
          </div>
          
          <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
            <div 
              className="bg-purple-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${completionPercentage}%` }}
            ></div>
          </div>

          {completionPercentage < 100 && (
            <div className="bg-yellow-900/30 border border-yellow-600/30 rounded-lg p-3 mb-4">
              <div className="flex items-center gap-2 text-yellow-400">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium">Your profile isn't complete yet!</span>
              </div>
              <p className="text-sm text-yellow-300 mt-1">Complete your profile to make it more discoverable and appealing.</p>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
            {completionTasks.map((task, index) => (
              <div key={index} className="flex items-center gap-2">
                <div className={`w-4 h-4 rounded-full flex items-center justify-center ${
                  task.completed ? 'bg-green-600' : 'bg-gray-600'
                }`}>
                  {task.completed && (
                    <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                <span className={`text-sm ${task.completed ? 'text-green-400' : 'text-gray-400'}`}>
                  {task.task}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Manage your account */}
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-lg font-medium text-white mb-4">Manage your account</h3>
          <p className="text-sm text-gray-400 mb-4">Change your avatar, username, and more.</p>
          <div className="text-right text-sm text-purple-400">{Math.round(completionPercentage)}% completed</div>
          
          <div className="space-y-2 mt-4">
            <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Change Username
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded flex items-center gap-2">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Change Display Name
            </button>
            <button className="w-full text-left p-2 text-sm text-purple-400 hover:text-purple-300 hover:bg-gray-700 rounded flex items-center gap-2">
              <Crown className="w-4 h-4" />
              Want more? Unlock with Premium
            </button>
            <button className="w-full text-left p-2 text-sm text-gray-300 hover:text-white hover:bg-gray-700 rounded flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Account Settings
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}