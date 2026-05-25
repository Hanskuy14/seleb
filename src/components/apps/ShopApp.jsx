/**
 * ShopApp.jsx
 * Equipment shop to boost content quality
 */
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, shopItems } from '../../utils/gameLogic';

const CATEGORIES = [
  { key: 'phone', icon: '📱', label: 'Phone' },
  { key: 'camera', icon: '📷', label: 'Camera' },
  { key: 'lighting', icon: '💡', label: 'Lighting' },
  { key: 'backdrop', icon: '🖼️', label: 'Backdrop' },
];

export default function ShopApp() {
  const { state, buyGear, addTransaction } = useGame();
  const [selectedCat, setSelectedCat] = useState(null);
  const totalBonus = Object.values(state.gear).reduce((s, g) => s + g.qualityBonus, 0);

  const handleBuy = (category, item) => {
    if (state.cash < item.price || state.gear[category].level >= item.level) return;
    buyGear(category, item);
    addTransaction({ id: Date.now(), day: state.day, description: `Bought: ${item.name}`, category: 'Gear', amount: -item.price });
  };

  if (selectedCat) {
    const items = shopItems[selectedCat];
    const current = state.gear[selectedCat];
    return (
      <div className="h-full flex flex-col bg-gray-900">
        <div className="px-4 py-2.5 border-b border-gray-800 flex items-center gap-2">
          <button onClick={() => setSelectedCat(null)} className="text-blue-400 text-xs">← Back</button>
          <h1 className="text-white font-bold text-base">🛍️ {CATEGORIES.find(c => c.key === selectedCat)?.label}</h1>
        </div>
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 mb-4">
            <p className="text-gray-400 text-[10px]">Current:</p>
            <p className="text-white text-sm font-semibold">{current.name}</p>
            <p className="text-blue-400 text-[10px]">+{current.qualityBonus} Quality</p>
          </div>
          <div className="space-y-2">
            {items.map((item, i) => {
              const owned = current.level >= item.level;
              const isNext = item.level === current.level + 1;
              const canAfford = state.cash >= item.price;
              return (
                <div key={i} className={`rounded-xl p-3 border ${owned ? 'bg-green-500/10 border-green-500/30' : isNext ? 'bg-gray-800/70 border-purple-500/30' : 'bg-gray-800/30 border-gray-700/30'}`}>
                  <div className="flex justify-between items-center mb-1">
                    <div>
                      <p className="text-white text-xs font-semibold">{item.name}</p>
                      <p className="text-gray-400 text-[9px]">+{item.qualityBonus} Quality</p>
                    </div>
                    {owned && <span className="text-[8px] bg-green-500/30 text-green-300 px-1.5 py-0.5 rounded-full">Owned</span>}
                    {!owned && item.price > 0 && <span className={`text-xs font-bold ${canAfford ? 'text-yellow-400' : 'text-gray-500'}`}>{formatCurrency(item.price)}</span>}
                  </div>
                  {!owned && isNext && (
                    <button onClick={() => handleBuy(selectedCat, item)} disabled={!canAfford}
                      className={`w-full mt-2 py-1.5 rounded-lg text-xs font-medium ${canAfford ? 'bg-purple-500/30 text-purple-300 border border-purple-500/30' : 'bg-gray-700/50 text-gray-500 cursor-not-allowed'}`}>
                      {canAfford ? '🛒 Purchase' : '💸 Need more cash'}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="px-4 py-2.5 border-b border-gray-800">
        <h1 className="text-white font-bold text-base">🛍️ Gear Shop</h1>
        <p className="text-gray-400 text-[10px]">Upgrade equipment to boost content quality</p>
      </div>
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        {/* Total quality */}
        <div className="bg-gradient-to-br from-purple-600/30 to-pink-600/30 rounded-xl p-3 border border-purple-500/30 mb-4">
          <div className="flex items-center justify-between">
            <div><p className="text-purple-200 text-[10px]">Total Quality Bonus</p><p className="text-white text-lg font-bold">+{totalBonus}</p></div>
            <span className="text-3xl">⚡</span>
          </div>
        </div>
        {/* Categories */}
        <div className="space-y-2">
          {CATEGORIES.map(cat => {
            const gear = state.gear[cat.key];
            return (
              <button key={cat.key} onClick={() => setSelectedCat(cat.key)} className="w-full p-3 bg-gray-800/50 rounded-xl border border-gray-700/50 text-left hover:bg-gray-700/50 transition-all">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-gray-700/50 flex items-center justify-center text-xl">{cat.icon}</div>
                  <div className="flex-1">
                    <p className="text-white text-xs font-semibold">{cat.label}</p>
                    <p className="text-gray-400 text-[9px]">{gear.name}</p>
                    <p className="text-blue-400 text-[9px]">+{gear.qualityBonus} bonus</p>
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
