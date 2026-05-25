/**
 * BrokerageApp.jsx
 * Investment app with Stocks, Crypto, Mutual Funds
 * Portfolio dashboard, buy/sell, mini line chart, profit/loss
 */
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, STOCKS, CRYPTO, MUTUAL_FUNDS } from '../../utils/gameLogic';

function MiniChart({ data, color }) {
  if (!data || data.length < 2) return <div className="h-8 w-full bg-gray-800/30 rounded" />;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const points = data.map((v, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - ((v - min) / range) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="h-8 w-full" preserveAspectRatio="none">
      <polyline points={points} fill="none" stroke={color} strokeWidth="2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function AssetCard({ asset, price, history, onBuy, onSell, holding }) {
  const change = history && history.length >= 2 ? ((price - history[history.length - 2]) / history[history.length - 2]) * 100 : 0;
  const isUp = change >= 0;
  const pnl = holding ? (price - holding.avgBuyPrice) * holding.shares : 0;

  return (
    <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 mb-2">
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="text-white text-xs font-bold">{asset.id}</p>
          <p className="text-gray-400 text-[9px]">{asset.name}</p>
        </div>
        <div className="text-right">
          <p className="text-white text-xs font-bold">${price < 1 ? price.toFixed(5) : price.toFixed(2)}</p>
          <p className={`text-[9px] font-medium ${isUp ? 'text-green-400' : 'text-red-400'}`}>{isUp ? '▲' : '▼'} {Math.abs(change).toFixed(2)}%</p>
        </div>
      </div>
      <MiniChart data={history} color={isUp ? '#4ade80' : '#f87171'} />
      {holding && (
        <div className="mt-2 flex items-center justify-between px-1 py-1 bg-gray-900/50 rounded-lg">
          <span className="text-[9px] text-gray-400">Holding: {holding.shares.toFixed(asset.basePrice < 1 ? 0 : 2)}</span>
          <span className={`text-[9px] font-bold ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}</span>
        </div>
      )}
      <div className="flex gap-2 mt-2">
        <button onClick={() => onBuy(asset)} className="flex-1 py-1.5 rounded-lg bg-green-500/20 border border-green-500/30 text-green-300 text-[10px] font-medium hover:bg-green-500/30 transition-all">Buy</button>
        <button onClick={() => onSell(asset)} disabled={!holding} className={`flex-1 py-1.5 rounded-lg border text-[10px] font-medium transition-all ${holding ? 'bg-red-500/20 border-red-500/30 text-red-300 hover:bg-red-500/30' : 'bg-gray-700/30 border-gray-700/30 text-gray-600 cursor-not-allowed'}`}>Sell</button>
      </div>
    </div>
  );
}


export default function BrokerageApp() {
  const { state, buyAsset, sellAsset, addTransaction } = useGame();
  const [tab, setTab] = useState('stocks'); // stocks | crypto | funds | portfolio
  const [tradeModal, setTradeModal] = useState(null); // { asset, action: 'buy'|'sell' }
  const [shares, setShares] = useState('');

  const totalPortfolioValue = Object.entries(state.portfolio).reduce((sum, [id, pos]) => sum + pos.shares * (state.marketPrices[id] || 0), 0);
  const totalInvested = Object.entries(state.portfolio).reduce((sum, [id, pos]) => sum + pos.shares * pos.avgBuyPrice, 0);
  const totalPnL = totalPortfolioValue - totalInvested;

  const executeTrade = () => {
    if (!tradeModal || !shares || parseFloat(shares) <= 0) return;
    const { asset, action } = tradeModal;
    const qty = parseFloat(shares);
    const price = state.marketPrices[asset.id];

    if (action === 'buy') {
      const cost = qty * price;
      if (cost > state.cash) return;
      buyAsset(asset.id, qty, price);
      addTransaction({ id: Date.now(), day: state.day, description: `Buy ${qty} ${asset.id}`, category: 'Investment', amount: -cost });
    } else {
      const holding = state.portfolio[asset.id];
      if (!holding || holding.shares < qty) return;
      sellAsset(asset.id, qty, price);
      addTransaction({ id: Date.now(), day: state.day, description: `Sell ${qty} ${asset.id}`, category: 'Investment', amount: qty * price });
    }
    setTradeModal(null); setShares('');
  };

  const getAssets = () => {
    if (tab === 'stocks') return STOCKS;
    if (tab === 'crypto') return CRYPTO;
    if (tab === 'funds') return MUTUAL_FUNDS;
    return [];
  };


  return (
    <div className="h-full flex flex-col bg-gray-950">
      {/* Header */}
      <div className="px-4 py-2.5 border-b border-gray-800">
        <div className="flex items-center justify-between">
          <h1 className="text-white font-bold text-base">📈 Brokerage</h1>
          <span className="text-[10px] text-green-400">Cash: {formatCurrency(state.cash)}</span>
        </div>
        {/* Portfolio Summary */}
        <div className="flex items-center gap-3 mt-1.5">
          <div><p className="text-[9px] text-gray-400">Portfolio</p><p className="text-white text-xs font-bold">{formatCurrency(totalPortfolioValue)}</p></div>
          <div><p className="text-[9px] text-gray-400">P&L</p><p className={`text-xs font-bold ${totalPnL >= 0 ? 'text-green-400' : 'text-red-400'}`}>{totalPnL >= 0 ? '+' : ''}{formatCurrency(totalPnL)}</p></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-800">
        {[{ id: 'stocks', label: '📊 Stocks' }, { id: 'crypto', label: '₿ Crypto' }, { id: 'funds', label: '🏦 Funds' }, { id: 'portfolio', label: '💼 My' }].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} className={`flex-1 py-2 text-[10px] font-medium transition-all ${tab === t.id ? 'text-green-400 border-b-2 border-green-400' : 'text-gray-500'}`}>{t.label}</button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide p-3">
        {tab === 'portfolio' ? (
          <div>
            <h3 className="text-white text-xs font-semibold mb-2">Your Holdings</h3>
            {Object.keys(state.portfolio).length === 0 ? (
              <p className="text-gray-500 text-xs text-center py-8">No investments yet. Start trading!</p>
            ) : (
              Object.entries(state.portfolio).map(([id, pos]) => {
                const allAssets = [...STOCKS, ...CRYPTO, ...MUTUAL_FUNDS];
                const asset = allAssets.find(a => a.id === id);
                if (!asset) return null;
                const price = state.marketPrices[id] || 0;
                const value = pos.shares * price;
                const pnl = (price - pos.avgBuyPrice) * pos.shares;
                return (
                  <div key={id} className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 mb-2">
                    <div className="flex justify-between items-center">
                      <div><p className="text-white text-xs font-bold">{id}</p><p className="text-gray-400 text-[9px]">{pos.shares.toFixed(2)} shares @ ${pos.avgBuyPrice.toFixed(2)}</p></div>
                      <div className="text-right"><p className="text-white text-xs">{formatCurrency(value)}</p><p className={`text-[9px] ${pnl >= 0 ? 'text-green-400' : 'text-red-400'}`}>{pnl >= 0 ? '+' : ''}{formatCurrency(pnl)}</p></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        ) : (
          getAssets().map(asset => (
            <AssetCard key={asset.id} asset={asset} price={state.marketPrices[asset.id]} history={state.priceHistory[asset.id]} holding={state.portfolio[asset.id]} onBuy={(a) => setTradeModal({ asset: a, action: 'buy' })} onSell={(a) => setTradeModal({ asset: a, action: 'sell' })} />
          ))
        )}
      </div>


      {/* Trade Modal */}
      {tradeModal && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm flex items-end z-50 rounded-[47px]">
          <div className="w-full bg-gray-900 rounded-t-3xl p-4 border-t border-gray-700">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-white font-bold text-sm">{tradeModal.action === 'buy' ? '🟢 Buy' : '🔴 Sell'} {tradeModal.asset.id}</h3>
              <button onClick={() => setTradeModal(null)} className="text-gray-400 text-lg">✕</button>
            </div>
            <p className="text-gray-400 text-[10px] mb-1">Price: ${state.marketPrices[tradeModal.asset.id]?.toFixed(tradeModal.asset.basePrice < 1 ? 5 : 2)}</p>
            {tradeModal.action === 'buy' && <p className="text-gray-400 text-[10px] mb-2">Available: {formatCurrency(state.cash)}</p>}
            {tradeModal.action === 'sell' && <p className="text-gray-400 text-[10px] mb-2">Holding: {state.portfolio[tradeModal.asset.id]?.shares.toFixed(2) || 0}</p>}
            <input type="number" value={shares} onChange={e => setShares(e.target.value)} placeholder="Quantity..."
              className="w-full px-3 py-2.5 rounded-xl bg-gray-800 border border-gray-700 text-white text-sm mb-3 focus:outline-none focus:border-green-500" />
            {shares && parseFloat(shares) > 0 && (
              <p className="text-gray-300 text-xs mb-3">Total: {formatCurrency(parseFloat(shares) * (state.marketPrices[tradeModal.asset.id] || 0))}</p>
            )}
            <button onClick={executeTrade} className={`w-full py-3 rounded-xl font-semibold text-sm ${tradeModal.action === 'buy' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
              Confirm {tradeModal.action === 'buy' ? 'Buy' : 'Sell'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
