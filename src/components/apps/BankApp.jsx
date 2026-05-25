/**
 * BankApp.jsx
 * Financial dashboard with balance, expenses, transaction ledger, and ad campaigns
 */
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, randomInt, randomFloat } from '../../utils/gameLogic';

function DashboardTab() {
  const { state } = useGame();
  const totalExpenses = Object.values(state.monthlyExpenses).reduce((a, b) => a + b, 0);
  const totalIncome = state.transactions
    .filter((t) => t.amount > 0)
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="p-4 overflow-y-auto h-full scrollbar-hide">
      {/* Balance Card */}
      <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl p-4 mb-4 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -mr-10 -mt-10" />
        <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/5 rounded-full -ml-8 -mb-8" />
        <p className="text-blue-200 text-xs mb-1">Current Balance</p>
        <p className="text-white text-2xl font-bold">{formatCurrency(state.cash)}</p>
        <div className="mt-3 flex items-center gap-3">
          <div>
            <p className="text-green-300 text-[10px]">↑ Income</p>
            <p className="text-white text-xs font-semibold">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="w-px h-6 bg-white/20" />
          <div>
            <p className="text-red-300 text-[10px]">↓ Monthly Bills</p>
            <p className="text-white text-xs font-semibold">{formatCurrency(totalExpenses)}</p>
          </div>
        </div>
      </div>

      {/* Monthly Expenses Breakdown */}
      <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 mb-4">
        <h3 className="text-white text-xs font-semibold mb-2">📋 Monthly Expenses</h3>
        <div className="space-y-2">
          {Object.entries(state.monthlyExpenses).map(([key, value]) => (
            <div key={key} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs">{key === 'rent' ? '🏠' : key === 'internet' ? '📶' : '🍽️'}</span>
                <span className="text-gray-300 text-xs capitalize">{key}</span>
              </div>
              <span className="text-red-400 text-xs font-medium">{formatCurrency(value)}</span>
            </div>
          ))}
          <div className="border-t border-gray-700/50 pt-2 flex items-center justify-between">
            <span className="text-gray-300 text-xs font-semibold">Total</span>
            <span className="text-red-400 text-xs font-bold">{formatCurrency(totalExpenses)}/month</span>
          </div>
        </div>
      </div>

      {/* Net Worth Overview */}
      <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
        <h3 className="text-white text-xs font-semibold mb-2">📊 Quick Stats</h3>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gray-900/50 rounded-lg p-2 text-center">
            <p className="text-gray-400 text-[9px]">Total Deals</p>
            <p className="text-white text-sm font-bold">{state.completedDeals.length}</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-2 text-center">
            <p className="text-gray-400 text-[9px]">Active Deals</p>
            <p className="text-yellow-400 text-sm font-bold">{state.activeDeals.length}</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-2 text-center">
            <p className="text-gray-400 text-[9px]">Days Played</p>
            <p className="text-blue-400 text-sm font-bold">{state.day}</p>
          </div>
          <div className="bg-gray-900/50 rounded-lg p-2 text-center">
            <p className="text-gray-400 text-[9px]">Transactions</p>
            <p className="text-purple-400 text-sm font-bold">{state.transactions.length}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function LedgerTab() {
  const { state } = useGame();

  const categoryColors = {
    'Endorsement': 'text-green-400',
    'Gear Purchase': 'text-orange-400',
    'Ad Campaign': 'text-blue-400',
    'Bills': 'text-red-400',
    'Live Stream': 'text-purple-400',
    'Ad Boost': 'text-cyan-400',
  };

  const categoryIcons = {
    'Endorsement': '🤝',
    'Gear Purchase': '🛒',
    'Ad Campaign': '📢',
    'Bills': '📄',
    'Live Stream': '📡',
    'Ad Boost': '🚀',
  };

  return (
    <div className="p-4 overflow-y-auto h-full scrollbar-hide">
      <h3 className="text-white text-sm font-semibold mb-3">📜 Transaction History</h3>

      {state.transactions.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-4xl mb-2">📭</p>
          <p className="text-gray-400 text-sm">No transactions yet</p>
          <p className="text-gray-500 text-xs mt-1">Start creating content and earning!</p>
        </div>
      ) : (
        <div className="space-y-2">
          {state.transactions.map((tx, i) => (
            <div key={i} className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-2">
                  <span className="text-lg mt-0.5">{categoryIcons[tx.category] || '💳'}</span>
                  <div>
                    <p className="text-white text-xs font-medium">{tx.description}</p>
                    <p className="text-gray-500 text-[9px] mt-0.5">{tx.timestamp} • {tx.category}</p>
                  </div>
                </div>
                <span className={`text-sm font-bold ${tx.amount >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                  {tx.amount >= 0 ? '+' : ''}{formatCurrency(tx.amount)}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function AdBoostTab() {
  const { state, updateCash, addFollowers, addTransaction, advanceTime } = useGame();
  const [boostResult, setBoostResult] = useState(null);
  const [isBoosting, setIsBoosting] = useState(false);

  const boostOptions = [
    { id: 'small', name: 'Small Boost', cost: 200000, minFollowers: 20, maxFollowers: 100, successRate: 0.8 },
    { id: 'medium', name: 'Medium Boost', cost: 500000, minFollowers: 80, maxFollowers: 400, successRate: 0.65 },
    { id: 'large', name: 'Large Boost', cost: 1500000, minFollowers: 200, maxFollowers: 1200, successRate: 0.5 },
    { id: 'mega', name: 'Mega Boost', cost: 5000000, minFollowers: 500, maxFollowers: 5000, successRate: 0.35 },
  ];

  const handleBoost = (option) => {
    if (state.cash < option.cost) return;

    setIsBoosting(true);
    setTimeout(() => {
      const success = Math.random() < option.successRate;
      const followers = success
        ? randomInt(option.minFollowers, option.maxFollowers)
        : randomInt(0, Math.floor(option.minFollowers * 0.3));

      updateCash(-option.cost);
      addFollowers(followers);
      addTransaction({
        id: Date.now(),
        timestamp: `Day ${state.day}`,
        description: `Ad Boost: ${option.name}`,
        category: 'Ad Boost',
        amount: -option.cost,
        balance: state.cash - option.cost,
      });
      advanceTime(3);

      setBoostResult({ success, followers, cost: option.cost });
      setIsBoosting(false);
    }, 2000);
  };

  return (
    <div className="p-4 overflow-y-auto h-full scrollbar-hide">
      <h3 className="text-white text-sm font-semibold mb-1">🚀 Ad Campaigns</h3>
      <p className="text-gray-400 text-[10px] mb-4">Invest in ads to boost follower growth. Results vary!</p>

      {boostResult ? (
        <div className="animate-fade-in text-center">
          <p className="text-3xl mb-2">{boostResult.success ? '🎉' : '😅'}</p>
          <h4 className="text-white font-bold text-base mb-2">
            {boostResult.success ? 'Campaign Successful!' : 'Meh Results...'}
          </h4>
          <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex justify-between mb-2">
              <span className="text-gray-400 text-xs">Spent</span>
              <span className="text-red-400 text-sm font-bold">-{formatCurrency(boostResult.cost)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400 text-xs">New Followers</span>
              <span className="text-green-400 text-sm font-bold">+{boostResult.followers}</span>
            </div>
          </div>
          <button
            onClick={() => setBoostResult(null)}
            className="mt-4 w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm"
          >
            Back to Campaigns
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {boostOptions.map((option) => (
            <div key={option.id} className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50">
              <div className="flex items-center justify-between mb-2">
                <div>
                  <p className="text-white text-xs font-semibold">{option.name}</p>
                  <p className="text-gray-400 text-[9px]">
                    +{option.minFollowers}-{option.maxFollowers} followers • {Math.round(option.successRate * 100)}% success
                  </p>
                </div>
                <span className="text-yellow-400 text-xs font-bold">{formatCurrency(option.cost)}</span>
              </div>
              <button
                onClick={() => handleBoost(option)}
                disabled={state.cash < option.cost || isBoosting}
                className={`w-full py-1.5 rounded-lg text-xs font-medium transition-all ${
                  state.cash >= option.cost && !isBoosting
                    ? 'bg-blue-500/30 text-blue-300 border border-blue-500/30 hover:bg-blue-500/50'
                    : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                }`}
              >
                {isBoosting ? 'Running Campaign...' : state.cash < option.cost ? 'Insufficient Funds' : 'Launch Campaign'}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ==================== MAIN BANK APP ====================
export default function BankApp() {
  const [activeTab, setActiveTab] = useState('dashboard');

  const tabs = [
    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
    { id: 'ledger', icon: '📜', label: 'Ledger' },
    { id: 'boost', icon: '🚀', label: 'Ads' },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* App Header */}
      <div className="px-4 py-2.5 border-b border-gray-800">
        <h1 className="text-white font-bold text-base">🏦 Bank & Wallet</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'dashboard' && <DashboardTab />}
        {activeTab === 'ledger' && <LedgerTab />}
        {activeTab === 'boost' && <AdBoostTab />}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-around py-2 border-t border-gray-800 bg-gray-900">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
              activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[9px]">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
