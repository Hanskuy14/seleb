/**
 * App.jsx
 * Root component for Selebgram Simulator
 * Wraps the game in the GameProvider context and renders the PhoneFrame
 */
import { GameProvider } from './context/GameContext';
import PhoneFrame from './components/phone/PhoneFrame';

function App() {
  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-900 flex items-center justify-center overflow-hidden">
        {/* Background decorative elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-pink-500/5 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-3xl" />
        </div>

        {/* Game Title (desktop only) */}
        <div className="hidden lg:block fixed top-8 left-8">
          <h1 className="text-2xl font-bold text-white/80">📱 Selebgram</h1>
          <p className="text-sm text-white/40">Influencer Simulator</p>
        </div>

        {/* Controls hint (desktop only) */}
        <div className="hidden lg:block fixed bottom-8 left-8 text-white/30 text-xs space-y-1">
          <p>💡 Tips:</p>
          <p>• Create posts to gain followers</p>
          <p>• Go live to earn gifts</p>
          <p>• Accept brand deals for cash</p>
          <p>• Upgrade gear for better content</p>
        </div>

        {/* Phone */}
        <PhoneFrame />
      </div>
    </GameProvider>
  );
}

export default App;
