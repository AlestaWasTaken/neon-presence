import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, Check, Sparkles, Star, Zap } from 'lucide-react';

export function PremiumPage() {
  const premiumFeatures = [
    { name: 'Unlimited custom backgrounds', icon: '🎨' },
    { name: 'Advanced analytics', icon: '📊' },
    { name: 'Custom domain support', icon: '🌐' },
    { name: 'Priority support', icon: '⚡' },
    { name: 'Exclusive templates', icon: '✨' },
    { name: 'Remove branding', icon: '🚫' },
    { name: 'Advanced customization', icon: '🎯' },
    { name: 'API access', icon: '🔌' }
  ];

  const plans = [
    {
      name: 'Free',
      price: '$0',
      period: 'forever',
      description: 'Perfect for getting started',
      features: [
        'Basic profile customization',
        'Standard templates',
        'Basic analytics',
        'Community support'
      ],
      current: true
    },
    {
      name: 'Premium',
      price: '$9.99',
      period: 'per month',
      description: 'Unlock all premium features',
      features: [
        'Everything in Free',
        'Unlimited backgrounds',
        'Advanced analytics',
        'Custom domains',
        'Priority support',
        'Exclusive templates',
        'Remove branding',
        'API access'
      ],
      popular: true
    },
    {
      name: 'Lifetime',
      price: '$199',
      period: 'one-time',
      description: 'Best value - pay once, use forever',
      features: [
        'Everything in Premium',
        'Lifetime updates',
        'Early access to features',
        'VIP support'
      ],
      lifetime: true
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-4">
          <Crown className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-white text-gradient mb-3">
          Upgrade to Premium
        </h1>
        <p className="text-smoke-400 text-lg">
          Unlock exclusive features and take your profile to the next level
        </p>
      </div>

      {/* Feature Highlights */}
      <Card className="glass border-smoke-700/30 p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-purple-500 to-purple-600 rounded-full" />
          Premium Features
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {premiumFeatures.map((feature, index) => (
            <div key={index} className="bg-smoke-900/30 rounded-xl p-6 border border-smoke-700/30 hover-lift group">
              <div className="text-2xl mb-3">{feature.icon}</div>
              <h3 className="text-white font-semibold mb-2">{feature.name}</h3>
              <div className="w-full h-1 bg-gradient-to-r from-purple-500 to-purple-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      </Card>

      {/* Pricing Plans */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {plans.map((plan, index) => (
          <Card 
            key={index} 
            className={`glass border-smoke-700/30 p-8 hover-lift ${
              plan.popular ? 'border-purple-500/50 bg-gradient-to-br from-purple-900/20 to-purple-800/20' : ''
            }`}
          >
            {plan.popular && (
              <div className="text-center mb-4">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-4 py-1 rounded-full text-sm font-semibold">
                  <Star className="w-4 h-4" />
                  Most Popular
                </div>
              </div>
            )}
            
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-white text-gradient mb-1">
                {plan.price}
              </div>
              <div className="text-smoke-400 text-sm">{plan.period}</div>
              <p className="text-smoke-400 mt-2">{plan.description}</p>
            </div>

            <div className="space-y-3 mb-8">
              {plan.features.map((feature, featureIndex) => (
                <div key={featureIndex} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                  <span className="text-smoke-300 text-sm">{feature}</span>
                </div>
              ))}
            </div>

            <Button 
              className={`w-full ${
                plan.current 
                  ? 'bg-smoke-700 text-smoke-300 cursor-not-allowed' 
                  : plan.popular 
                    ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white'
                    : 'bg-gradient-to-r from-smoke-700 to-smoke-800 hover:from-smoke-600 hover:to-smoke-700 text-white'
              }`}
              disabled={plan.current}
            >
              {plan.current ? 'Current Plan' : `Upgrade to ${plan.name}`}
            </Button>
          </Card>
        ))}
      </div>

      {/* Benefits */}
      <Card className="glass border-smoke-700/30 p-8">
        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
          <div className="w-2 h-8 bg-gradient-to-b from-yellow-500 to-yellow-600 rounded-full" />
          Why Upgrade?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Stand Out</h3>
            <p className="text-smoke-400">
              Access exclusive templates and customization options that make your profile unique
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Zap className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Get Insights</h3>
            <p className="text-smoke-400">
              Advanced analytics help you understand your audience and optimize your profile
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Crown className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">Priority Support</h3>
            <p className="text-smoke-400">
              Get priority help from our support team and early access to new features
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}