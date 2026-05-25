/**
 * MessagesApp.jsx
 * Brand endorsement deals with risk system
 */
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, generateEndorsement, randomInt } from '../../utils/gameLogic';

export default function MessagesApp() {
  const { state, receiveMessage, acceptDeal, rejectDeal, completeDeal, updateCash, addTransaction, updateReputation, removeFollowers, getTotalFollowers } = useGame();
  const [selected, setSelected] = useState(null);
  const totalFollowers = getTotalFollowers();

  // Generate endorsement offers
  useEffect(() => {
    if (totalFollowers >= 500 && state.messages.filter(m => m.status === 'pending').length < 3) {
      if (Math.random() > 0.5) {
        const e = generateEndorsement(totalFollowers, state.reputation);
        receiveMessage({ id: e.id, type: 'endorsement', brand: e.brand, brandIcon: e.brandIcon, status: 'pending', endorsement: e, day: state.day });
      }
    }
  }, [state.day]);

  const handleAccept = (msg) => {
    const e = msg.endorsement;
    acceptDeal({ ...e, messageId: msg.id });
    // Process deal immediately (simplified)
    setTimeout(() => {
      updateCash(e.payout);
      addTransaction({ id: Date.now(), day: state.day, description: `Endorsement: ${e.brand}`, category: 'Endorsement', amount: e.payout });
      // Risk effects
      if (e.risk === 'high' && Math.random() > 0.4) {
        const loss = e.riskEffects.followerLoss;
        ['instagram', 'tiktok', 'youtube', 'linkedin'].forEach(p => removeFollowers(p, Math.floor(loss / 4)));
        updateReputation(-e.riskEffects.reputationHit);
      } else if (e.risk === 'medium' && Math.random() > 0.7) {
        updateReputation(-Math.floor(e.riskEffects.reputationHit / 2));
      } else {
        updateReputation(2);
      }
      completeDeal({ ...e, messageId: msg.id });
    }, 500);
    setSelected(null);
  };

  const handleReject = (msg) => {
    rejectDeal(msg.id);
    updateReputation(1);
    setSelected(null);
  };

  const pending = state.messages.filter(m => m.status === 'pending');
  const history = state.messages.filter(m => m.status !== 'pending');


  if (selected) {
    const e = selected.endorsement;
    return (
      <div className="h-full flex flex-col bg-gray-900">
        <div className="px-4 py-2.5 border-b border-gray-800"><h1 className="text-white font-bold text-base">💬 Deal Details</h1></div>
        <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
          <button onClick={() => setSelected(null)} className="text-blue-400 text-xs mb-4">← Back</button>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-2xl border border-gray-700">{e.brandIcon}</div>
            <div><h3 className="text-white font-bold text-sm">{e.brand}</h3><p className="text-gray-400 text-[10px]">{e.productType} • {e.category}</p></div>
          </div>
          <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 mb-4 space-y-2">
            <div className="flex justify-between"><span className="text-gray-400 text-[10px]">Payout</span><span className="text-green-400 text-xs font-bold">{formatCurrency(e.payout)}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 text-[10px]">Requirement</span><span className="text-white text-xs">{e.requirements}</span></div>
            <div className="flex justify-between"><span className="text-gray-400 text-[10px]">Deadline</span><span className="text-white text-xs">{e.deadline} days</span></div>
            <div className="flex justify-between"><span className="text-gray-400 text-[10px]">Risk</span>
              <span className={`text-xs font-bold ${e.risk === 'high' ? 'text-red-400' : e.risk === 'medium' ? 'text-yellow-400' : 'text-green-400'}`}>{e.risk}</span>
            </div>
          </div>
          {e.risk !== 'low' && (
            <div className={`p-3 rounded-xl border mb-4 ${e.risk === 'high' ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'}`}>
              <p className={`text-xs font-semibold ${e.risk === 'high' ? 'text-red-300' : 'text-yellow-300'}`}>⚠️ Risk Warning</p>
              <p className="text-[10px] text-gray-400 mt-1">May lose ~{e.riskEffects.followerLoss} followers & {e.riskEffects.reputationHit} reputation</p>
            </div>
          )}
          <div className="flex gap-2">
            <button onClick={() => handleReject(selected)} className="flex-1 py-2.5 rounded-xl bg-gray-700 text-gray-300 font-semibold text-xs">❌ Decline</button>
            <button onClick={() => handleAccept(selected)} className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-xs">✅ Accept</button>
          </div>
        </div>
      </div>
    );
  }


  return (
    <div className="h-full flex flex-col bg-gray-900">
      <div className="px-4 py-2.5 border-b border-gray-800"><h1 className="text-white font-bold text-base">💬 Brand Deals</h1></div>
      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">
        {totalFollowers < 500 && (
          <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <p className="text-yellow-300 text-xs font-semibold">🔒 Unlock at 500 total followers</p>
            <div className="mt-1.5 h-1.5 bg-gray-700 rounded-full overflow-hidden">
              <div className="h-full bg-yellow-500 rounded-full" style={{ width: `${Math.min(100, (totalFollowers / 500) * 100)}%` }} />
            </div>
          </div>
        )}

        {pending.length > 0 && (
          <div className="mb-4">
            <p className="text-white text-xs font-semibold mb-2">📩 New Offers ({pending.length})</p>
            <div className="space-y-2">
              {pending.map(msg => (
                <button key={msg.id} onClick={() => setSelected(msg)} className="w-full p-3 bg-gray-800/70 rounded-xl border border-purple-500/30 text-left hover:bg-gray-700/70 transition-all">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{msg.brandIcon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <p className="text-white text-xs font-semibold truncate">{msg.brand}</p>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${msg.endorsement.risk === 'high' ? 'bg-red-500/20 text-red-300' : msg.endorsement.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-300' : 'bg-green-500/20 text-green-300'}`}>{msg.endorsement.risk}</span>
                      </div>
                      <p className="text-gray-400 text-[9px]">{msg.endorsement.productType}</p>
                    </div>
                    <span className="text-green-400 text-[10px] font-bold">{formatCurrency(msg.endorsement.payout)}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {history.length > 0 && (
          <div>
            <p className="text-gray-400 text-xs font-semibold mb-2">📋 History</p>
            <div className="space-y-1.5">
              {history.slice(0, 8).map(msg => (
                <div key={msg.id} className="p-2.5 bg-gray-800/30 rounded-xl border border-gray-700/30 flex items-center gap-2">
                  <span className="text-lg">{msg.brandIcon}</span>
                  <div className="flex-1"><p className="text-gray-300 text-xs">{msg.brand}</p></div>
                  <span className={`text-[9px] ${msg.status === 'accepted' ? 'text-green-400' : 'text-red-400'}`}>{msg.status === 'accepted' ? '✅' : '❌'}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {state.messages.length === 0 && totalFollowers >= 500 && (
          <div className="text-center py-10"><p className="text-3xl mb-2">📪</p><p className="text-gray-400 text-sm">No messages yet</p></div>
        )}
      </div>
    </div>
  );
}
