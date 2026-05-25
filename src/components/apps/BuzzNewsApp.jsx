/**
 * BuzzNewsApp.jsx
 * Daily news feed with trending hashtags and economic headlines
 * News affects market movements and gives content trend bonuses
 */
import { useGame } from '../../context/GameContext';

const CATEGORY_ICONS = { economy: '💹', entertainment: '🎭', tech: '💻', trending: '🔥', lifestyle: '🌴', influencer: '📸' };
const EFFECT_LABELS = { tech_up: '📈 Tech+', tech_down: '📉 Tech-', crypto_up: '🚀 Crypto+', crypto_down: '💥 Crypto-', market_up: '📈 Market+', market_down: '📉 Market-', none: '' };

export default function BuzzNewsApp() {
  const { state } = useGame();

  return (
    <div className="h-full flex flex-col bg-white" style={{ background: 'linear-gradient(to bottom, #fff8f0, #ffffff)' }}>
      {/* Header */}
      <div className="px-4 py-3 border-b border-orange-200 bg-gradient-to-r from-orange-500 to-amber-500">
        <h1 className="text-white font-black text-lg">📰 BuzzNews</h1>
        <p className="text-white/80 text-[10px]">Day {state.day} Headlines</p>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        {/* Trending Hashtags */}
        <div className="mb-4">
          <h3 className="text-gray-800 text-xs font-bold mb-2">🔥 Trending Now</h3>
          <div className="flex flex-wrap gap-1.5">
            {state.trendingHashtags.map((tag, i) => (
              <span key={i} className="px-2.5 py-1 rounded-full bg-gradient-to-r from-pink-100 to-orange-100 border border-pink-200 text-pink-700 text-[10px] font-medium">
                #{tag}
              </span>
            ))}
          </div>
          <p className="text-gray-500 text-[9px] mt-1.5">💡 Post matching content for +50% reach boost!</p>
        </div>


        {/* Daily Headlines */}
        <div className="mb-4">
          <h3 className="text-gray-800 text-xs font-bold mb-2">📋 Today's Headlines</h3>
          <div className="space-y-2">
            {state.dailyNews.map((news, i) => (
              <div key={i} className="bg-white rounded-xl p-3 shadow-sm border border-gray-100">
                <div className="flex items-start gap-2">
                  <span className="text-lg mt-0.5">{CATEGORY_ICONS[news.category] || '📄'}</span>
                  <div className="flex-1">
                    <p className="text-gray-900 text-xs font-semibold leading-tight">{news.headline}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-[9px] text-gray-400 capitalize">{news.category}</span>
                      {news.effect !== 'none' && (
                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                          news.effect.includes('up') ? 'bg-green-100 text-green-700' : news.effect.includes('down') ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'
                        }`}>
                          {EFFECT_LABELS[news.effect]}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Market Impact Summary */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-3 border border-blue-200">
          <h4 className="text-blue-800 text-xs font-bold mb-1">💡 Market Impact</h4>
          <p className="text-blue-600 text-[10px] leading-relaxed">
            Economic news affects investment prices overnight. Check your Brokerage app after sleeping!
            Trending hashtags boost content reach by +50% if you post matching themes today.
          </p>
        </div>

        {/* Cancel culture warning if reputation is low */}
        {state.reputation < 40 && (
          <div className="mt-3 bg-red-50 rounded-xl p-3 border border-red-200">
            <h4 className="text-red-800 text-xs font-bold mb-1">⚠️ Reputation Warning</h4>
            <p className="text-red-600 text-[10px]">
              Your reputation is low ({state.reputation}/100). You risk being "canceled" if you keep taking high-risk deals!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
