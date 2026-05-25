/**
 * MessagesApp.jsx
 * Message inbox with brand deals, endorsement negotiations, and contract system
 */
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { formatCurrency, generateEndorsement, randomChoice } from '../../utils/gameLogic';

function MessageInbox({ onSelectMessage }) {
  const { state, receiveMessage, setNotifications } = useGame();

  // Generate new endorsement offers based on follower milestones
  useEffect(() => {
    const shouldGenerate = state.followers >= 1000 && state.messages.filter(m => m.status === 'pending').length < 3;
    if (shouldGenerate && Math.random() > 0.5) {
      const endorsement = generateEndorsement(state.followers, state.tier);
      const message = {
        id: Date.now() + Math.random(),
        type: 'endorsement',
        brand: endorsement.brand,
        brandIcon: endorsement.brandIcon,
        preview: `Hi @${state.username}! We'd love to collaborate...`,
        timestamp: `Day ${state.day}`,
        status: 'pending',
        endorsement,
        read: false,
      };
      receiveMessage(message);
    }
  }, [state.day]); // Generate on new days

  const clearNotifications = () => {
    setNotifications({ messages: 0 });
  };

  useEffect(() => {
    clearNotifications();
  }, []);

  const pendingMessages = state.messages.filter(m => m.status === 'pending');
  const otherMessages = state.messages.filter(m => m.status !== 'pending');

  return (
    <div className="p-4 overflow-y-auto h-full scrollbar-hide">
      {/* Unlock Notice */}
      {state.followers < 1000 && (
        <div className="mb-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
          <div className="flex items-center gap-2">
            <span className="text-lg">🔒</span>
            <div>
              <p className="text-yellow-300 text-xs font-semibold">Endorsements Locked</p>
              <p className="text-yellow-400/70 text-[10px]">
                Reach 1,000 followers to unlock brand deals! ({state.followers}/1,000)
              </p>
            </div>
          </div>
          <div className="mt-2 h-1.5 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-yellow-500 to-amber-400 rounded-full transition-all"
              style={{ width: `${Math.min(100, (state.followers / 1000) * 100)}%` }}
            />
          </div>
        </div>
      )}

      {/* Tier Milestones */}
      <div className="mb-4 flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
        {[
          { name: 'Micro', req: '1K', unlocked: state.followers >= 1000 },
          { name: 'Mid', req: '10K', unlocked: state.followers >= 10000 },
          { name: 'Macro', req: '50K', unlocked: state.followers >= 50000 },
          { name: 'Mega', req: '500K', unlocked: state.followers >= 500000 },
        ].map((tier) => (
          <div
            key={tier.name}
            className={`flex-shrink-0 px-2.5 py-1.5 rounded-lg border text-[9px] ${
              tier.unlocked
                ? 'bg-green-500/20 border-green-500/30 text-green-300'
                : 'bg-gray-800/50 border-gray-700/50 text-gray-500'
            }`}
          >
            {tier.unlocked ? '✅' : '🔒'} {tier.name} ({tier.req})
          </div>
        ))}
      </div>

      {/* Pending Deals */}
      {pendingMessages.length > 0 && (
        <div className="mb-4">
          <p className="text-white text-xs font-semibold mb-2">📩 New Offers ({pendingMessages.length})</p>
          <div className="space-y-2">
            {pendingMessages.map((msg) => (
              <button
                key={msg.id}
                onClick={() => onSelectMessage(msg)}
                className="w-full p-3 bg-gray-800/70 rounded-xl border border-purple-500/30 text-left hover:bg-gray-700/70 active:scale-98 transition-all"
              >
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{msg.brandIcon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="text-white text-xs font-semibold truncate">{msg.brand}</p>
                      <span className={`text-[8px] px-1.5 py-0.5 rounded-full ${
                        msg.endorsement.risk === 'high' ? 'bg-red-500/20 text-red-300' :
                        msg.endorsement.risk === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                        'bg-green-500/20 text-green-300'
                      }`}>
                        {msg.endorsement.risk} risk
                      </span>
                    </div>
                    <p className="text-gray-400 text-[10px] truncate mt-0.5">{msg.preview}</p>
                  </div>
                  <span className="text-green-400 text-[10px] font-bold">{formatCurrency(msg.endorsement.payout)}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* History */}
      {otherMessages.length > 0 && (
        <div>
          <p className="text-gray-400 text-xs font-semibold mb-2">📋 History</p>
          <div className="space-y-2">
            {otherMessages.slice(0, 10).map((msg) => (
              <div key={msg.id} className="p-2.5 bg-gray-800/30 rounded-xl border border-gray-700/30">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{msg.brandIcon}</span>
                  <div className="flex-1">
                    <p className="text-gray-300 text-xs">{msg.brand}</p>
                    <span className={`text-[9px] ${msg.status === 'accepted' ? 'text-green-400' : 'text-red-400'}`}>
                      {msg.status === 'accepted' ? '✅ Accepted' : '❌ Rejected'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {state.messages.length === 0 && state.followers >= 1000 && (
        <div className="text-center py-10">
          <p className="text-3xl mb-2">📪</p>
          <p className="text-gray-400 text-sm">No messages yet</p>
          <p className="text-gray-500 text-xs mt-1">Keep growing and brands will reach out!</p>
        </div>
      )}
    </div>
  );
}

function MessageDetail({ message, onBack }) {
  const { state, acceptDeal, rejectDeal, updateCash, addTransaction, updateReputation, removeFollowers, updateEngagement, advanceTime, completeDeal, addFollowers } = useGame();
  const [dealAccepted, setDealAccepted] = useState(message.status === 'accepted');

  const endorsement = message.endorsement;

  const handleAccept = () => {
    acceptDeal({
      ...endorsement,
      messageId: message.id,
      acceptedDay: state.day,
    });
    setDealAccepted(true);

    // Simulate completing the deal (simplified - in full game would require creating specific posts)
    setTimeout(() => {
      // Payout
      updateCash(endorsement.payout);
      addTransaction({
        id: Date.now(),
        timestamp: `Day ${state.day}`,
        description: `Endorsement: ${endorsement.brand}`,
        category: 'Endorsement',
        amount: endorsement.payout,
        balance: state.cash + endorsement.payout,
      });

      // Risk effects (chance of backlash for risky deals)
      if (endorsement.risk === 'high' && Math.random() > 0.4) {
        removeFollowers(endorsement.riskEffects.followerLoss);
        updateEngagement(state.engagementRate - endorsement.riskEffects.engagementHit);
        updateReputation(-endorsement.riskEffects.reputationHit);
      } else if (endorsement.risk === 'medium' && Math.random() > 0.7) {
        removeFollowers(Math.floor(endorsement.riskEffects.followerLoss * 0.5));
        updateReputation(-Math.floor(endorsement.riskEffects.reputationHit * 0.5));
      } else {
        // Good deals can boost reputation
        updateReputation(3);
        addFollowers(Math.floor(state.followers * 0.005));
      }

      advanceTime(4);
      completeDeal({ ...endorsement, messageId: message.id });
    }, 1000);
  };

  const handleReject = () => {
    rejectDeal(message.id);
    updateReputation(1); // Slight rep gain for integrity
    onBack();
  };

  return (
    <div className="p-4 overflow-y-auto h-full scrollbar-hide">
      {/* Back Button */}
      <button onClick={onBack} className="flex items-center gap-1 text-blue-400 text-xs mb-4 hover:text-blue-300">
        ← Back to Inbox
      </button>

      {/* Brand Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-2xl border border-gray-700">
          {endorsement.brandIcon}
        </div>
        <div>
          <h3 className="text-white font-bold text-sm">{endorsement.brand}</h3>
          <p className="text-gray-400 text-[10px]">{endorsement.productType} • {endorsement.category}</p>
        </div>
      </div>

      {/* Message Content */}
      <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 mb-4">
        <p className="text-gray-300 text-xs leading-relaxed">
          Hi @{state.username}! 👋
          <br /><br />
          We love your content and think you'd be a perfect fit for our brand. We'd like to offer you a partnership deal!
          <br /><br />
          Let us know if you're interested. 💼
        </p>
      </div>

      {/* Contract Details */}
      <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 mb-4">
        <h4 className="text-white text-xs font-semibold mb-2">📋 Contract Details</h4>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-[10px]">Product</span>
            <span className="text-white text-xs">{endorsement.productType}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-[10px]">Requirement</span>
            <span className="text-white text-xs">{endorsement.requirements}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-[10px]">Payout</span>
            <span className="text-green-400 text-xs font-bold">{formatCurrency(endorsement.payout)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-[10px]">Deadline</span>
            <span className="text-white text-xs">{endorsement.deadline} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-400 text-[10px]">Risk Level</span>
            <span className={`text-xs font-semibold ${
              endorsement.risk === 'high' ? 'text-red-400' :
              endorsement.risk === 'medium' ? 'text-yellow-400' :
              'text-green-400'
            }`}>
              {endorsement.risk.charAt(0).toUpperCase() + endorsement.risk.slice(1)} ⚠️
            </span>
          </div>
        </div>
      </div>

      {/* Risk Warning */}
      {endorsement.risk !== 'low' && (
        <div className={`p-3 rounded-xl border mb-4 ${
          endorsement.risk === 'high' ? 'bg-red-500/10 border-red-500/30' : 'bg-yellow-500/10 border-yellow-500/30'
        }`}>
          <p className={`text-xs font-semibold ${endorsement.risk === 'high' ? 'text-red-300' : 'text-yellow-300'}`}>
            ⚠️ Risk Warning
          </p>
          <p className={`text-[10px] mt-1 ${endorsement.risk === 'high' ? 'text-red-400/70' : 'text-yellow-400/70'}`}>
            {endorsement.risk === 'high'
              ? 'This brand has questionable reputation. Accepting may cause follower loss and damage your engagement rate if exposed.'
              : 'Moderate risk. Some followers may not appreciate this promotion.'}
          </p>
          <div className="mt-2 space-y-1">
            <p className="text-[9px] text-gray-400">Potential follower loss: -{endorsement.riskEffects.followerLoss}</p>
            <p className="text-[9px] text-gray-400">Engagement hit: -{endorsement.riskEffects.engagementHit.toFixed(2)}%</p>
            <p className="text-[9px] text-gray-400">Reputation hit: -{endorsement.riskEffects.reputationHit}</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {!dealAccepted && message.status === 'pending' ? (
        <div className="flex gap-2">
          <button
            onClick={handleReject}
            className="flex-1 py-2.5 rounded-xl bg-gray-700 text-gray-300 font-semibold text-xs hover:bg-gray-600 active:scale-98 transition-all"
          >
            ❌ Decline
          </button>
          <button
            onClick={handleAccept}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold text-xs hover:opacity-90 active:scale-98 transition-all"
          >
            ✅ Accept Deal
          </button>
        </div>
      ) : (
        <div className="text-center py-3 bg-green-500/10 border border-green-500/30 rounded-xl">
          <p className="text-green-400 text-xs font-semibold">✅ Deal Completed!</p>
          <p className="text-green-400/70 text-[10px] mt-0.5">Payment has been processed.</p>
        </div>
      )}
    </div>
  );
}

// ==================== MAIN MESSAGES APP ====================
export default function MessagesApp() {
  const [selectedMessage, setSelectedMessage] = useState(null);

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* App Header */}
      <div className="px-4 py-2.5 border-b border-gray-800">
        <h1 className="text-white font-bold text-base">💬 Messages</h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-hidden">
        {selectedMessage ? (
          <MessageDetail message={selectedMessage} onBack={() => setSelectedMessage(null)} />
        ) : (
          <MessageInbox onSelectMessage={setSelectedMessage} />
        )}
      </div>
    </div>
  );
}
