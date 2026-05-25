/**
 * ShopApp.jsx
 * Equipment/Gear shop to boost content quality stats
 */
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, shopItems } from '../../utils/gameLogic';

const categoryMeta = {
  phone: { icon: '📱', label: 'Phone', desc: 'Better camera quality' },
  camera: { icon: '📷', label: 'Camera', desc: 'Professional photo/video' },
  ringLight: { icon: '💡', label: 'Ring Light', desc: 'Better lighting' },
  backdrop: { icon: '🖼️', label: 'Backdrop', desc: 'Aesthetic background' },
  outfit: { icon: '👗', label: 'Outfits', desc: 'Fashion & style' },
};

export default function ShopApp() {
  const { state, buyGear, updateCash, addTransaction } = useGame();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [purchaseResult, setPurchaseResult] = useState(null);

  const handlePurchase = (category, item) => {
    if (state.cash < item.price) return;
    if (state.gear[category].level >= item.level) return;

    updateCash(-item.price);
    buyGear(category, item);
    addTransaction({
      id: Date.now(),
      timestamp: `Day ${state.day}`,
      description: `Purchased: ${item.name}`,
      category: 'Gear Purchase',
      amount: -item.price,
      balance: state.cash - item.price,
    });
    setPurchaseResult(item);
  };

  if (purchaseResult) {
    return (
      <div className="h-full flex flex-col bg-gray-900">
        <div className="px-4 py-2.5 border-b border-gray-800">
          <h1 className="text-white font-bold text-base">🛍️ Shop</h1>
        </div>
        <div className="flex-1 flex flex-col items-center justify-center p-4 animate-fade-in">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center mb-4">
            <span className="text-3xl">✅</span>
          </div>
          <h3 className="text-white font-bold text-base mb-1">Purchase Successful!</h3>
          <p className="text-gray-400 text-xs mb-2">You got: {purchaseResult.name}</p>
          <p className="text-green-400 text-xs">+{purchaseResult.qualityBonus} Quality Bonus</p>
          <button
            onClick={() => { setPurchaseResult(null); setSelectedCategory(null); }}
            className="mt-6 w-full py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm"
          >
            Continue Shopping
          </button>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    const items = shopItems[selectedCategory];
    const currentLevel = state.gear[selectedCategory].level;
    const meta = categoryMeta[selectedCategory];

    return (
      <div className="h-full flex flex-col bg-gray-900">
        <div className="px-4 py-2.5 border-b border-gray-800 flex items-center gap-2">
          <button onClick={() => setSelectedCategory(null)} className="text-blue-400 text-xs">← Back</button>
          <h1 className="text-white font-bold text-base">{meta.icon} {meta.label}</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
          {/* Current Equipment */}
          <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 mb-4">
            <p className="text-gray-400 text-[10px]">Currently Equipped:</p>
            <p className="text-white text-sm font-semibold">{state.gear[selectedCategory].name}</p>
            <p className="text-blue-400 text-[10px]">+{state.gear[selectedCategory].qualityBonus} Quality Bonus</p>
          </div>

          {/* Available Items */}
          <div className="space-y-3">
            {items.map((item, i) => {
              const isOwned = currentLevel >= item.level;
              const isNext = item.level === currentLevel + 1;
              const canAfford = state.cash >= item.price;

              return (
                <div
                  key={i}
                  className={`rounded-xl p-3 border transition-all ${
                    isOwned
                      ? 'bg-green-500/10 border-green-500/30'
                      : isNext
                      ? 'bg-gray-800/70 border-purple-500/30'
                      : 'bg-gray-800/30 border-gray-700/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="text-white text-xs font-semibold">{item.name}</p>
                        {isOwned && <span className="text-[8px] bg-green-500/30 text-green-300 px-1.5 py-0.5 rounded-full">Owned</span>}
                        {isNext && !isOwned && <span className="text-[8px] bg-purple-500/30 text-purple-300 px-1.5 py-0.5 rounded-full">Next</span>}
                      </div>
                      <p className="text-gray-400 text-[10px]">+{item.qualityBonus} Quality Bonus</p>
                    </div>
                    {!isOwned && item.price > 0 && (
                      <span className={`text-xs font-bold ${canAfford ? 'text-yellow-400' : 'text-gray-500'}`}>
                        {formatCurrency(item.price)}
                      </span>
                    )}
                  </div>

                  {/* Quality Bar */}
                  <div className="h-1.5 bg-gray-700 rounded-full overflow-hidden mb-2">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                      style={{ width: `${Math.min(100, (item.qualityBonus / 30) * 100)}%` }}
                    />
                  </div>

                  {!isOwned && isNext && (
                    <button
                      onClick={() => handlePurchase(selectedCategory, item)}
                      disabled={!canAfford}
                      className={`w-full py-2 rounded-lg text-xs font-medium transition-all ${
                        canAfford
                          ? 'bg-purple-500/30 text-purple-300 border border-purple-500/30 hover:bg-purple-500/50'
                          : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? '🛒 Purchase' : '💸 Insufficient Funds'}
                    </button>
                  )}
                  {!isOwned && !isNext && (
                    <p className="text-gray-500 text-[9px] text-center">Buy previous tier first</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Category Overview
  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="px-4 py-2.5 border-b border-gray-800">
        <h1 className="text-white font-bold text-base">🛍️ Gear Shop</h1>
        <p className="text-gray-400 text-[10px]">Upgrade your equipment to boost content quality</p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 scrollbar-hide">
        {/* Total Quality Score */}
        <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl p-3 border border-purple-500/30 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-[10px]">Total Quality Bonus</p>
              <p className="text-white text-lg font-bold">
                +{Object.values(state.gear).reduce((sum, g) => sum + g.qualityBonus, 0)}
              </p>
            </div>
            <span className="text-3xl">⚡</span>
          </div>
        </div>

        {/* Category Cards */}
        <div className="space-y-3">
          {Object.entries(categoryMeta).map(([key, meta]) => {
            const currentGear = state.gear[key];
            const maxLevel = shopItems[key][shopItems[key].length - 1].level;
            const isMaxed = currentGear.level >= maxLevel;

            return (
              <button
                key={key}
                onClick={() => setSelectedCategory(key)}
                className="w-full p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 text-left hover:bg-gray-700/50 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-700/50 flex items-center justify-center text-xl">
                    {meta.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <p className="text-white text-xs font-semibold">{meta.label}</p>
                      {isMaxed && <span className="text-[8px] bg-amber-500/30 text-amber-300 px-1.5 py-0.5 rounded-full">MAX</span>}
                    </div>
                    <p className="text-gray-400 text-[9px]">{currentGear.name}</p>
                    <p className="text-blue-400 text-[9px]">+{currentGear.qualityBonus} bonus</p>
                  </div>
                  <span className="text-gray-500 text-sm">→</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
