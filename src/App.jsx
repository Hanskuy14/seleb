/**
 * App.jsx
 * Root component for Influencer & Investor Simulator
 * Routes between game phases: Menu → Character Creation → Playing (Phone)
 */
import { GameProvider, useGame } from './context/GameContext';
import MainMenu from './components/screens/MainMenu';
import CharacterCreation from './components/screens/CharacterCreation';
import PhoneFrame from './components/phone/PhoneFrame';

function GameRouter() {
  const { state } = useGame();

  if (state.gamePhase === 'menu') return <MainMenu />;
  if (state.gamePhase === 'character_creation') return <CharacterCreation />;

  // Playing phase - render phone with background
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center overflow-hidden relative">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
      </div>

      {/* Desktop sidebar info */}
      <div className="hidden lg:block fixed top-8 left-8">
        <h1 className="text-xl font-bold text-white/80">📱💰 Influencer & Investor</h1>
        <p className="text-sm text-white/40">Simulator v2.0</p>
        <div className="mt-4 space-y-1 text-white/30 text-xs">
          <p>💡 Tips:</p>
          <p>• Post on trending topics for +50% reach</p>
          <p>• Invest in markets between posts</p>
          <p>• Sleep to reset energy & advance day</p>
          <p>• Consistent niche = +20% algorithm boost</p>
          <p>• High-risk deals = cancel culture risk!</p>
        </div>
      </div>

      {/* Cancel culture overlay */}
      {state.isCanceled && state.cancelEvent && <CancelOverlay />}

      <PhoneFrame />
    </div>
  );
}


function CancelOverlay() {
  const { state, dismissCancel } = useGame();
  const ev = state.cancelEvent;

  return (
    <div className="fixed inset-0 z-[9998] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-3xl p-6 max-w-sm w-full border border-red-500/50 shadow-2xl shadow-red-500/20 animate-fade-in">
        <div className="text-center">
          <p className="text-5xl mb-4">💥</p>
          <h2 className="text-xl font-black text-red-400 mb-2">CANCELED!</h2>
          <p className="text-white font-semibold text-sm mb-1">{ev.headline}</p>
          <p className="text-gray-400 text-xs mb-4">Your reputation has taken a massive hit.</p>
          <div className="bg-red-500/10 rounded-xl p-3 border border-red-500/30 space-y-1 text-left mb-4">
            <p className="text-red-300 text-xs">📉 Follower loss: ~{Math.floor(ev.followerLoss * 100)}% across all platforms</p>
            <p className="text-red-300 text-xs">💔 Reputation: -{ev.reputationHit}</p>
          </div>
          <button onClick={dismissCancel} className="w-full py-3 rounded-xl bg-red-600 text-white font-bold text-sm hover:bg-red-500 transition-all">
            😔 Accept & Move On
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <GameProvider>
      <GameRouter />
    </GameProvider>
  );
}

export default App;
