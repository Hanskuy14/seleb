/**
 * MainMenu.jsx
 * Splash screen with New Game, Load Game, and Settings
 */
import { useGame } from '../../context/GameContext';

export default function MainMenu() {
  const { setPhase, loadGame } = useGame();

  const handleLoadGame = () => {
    const saved = localStorage.getItem('influencer_save');
    if (saved) {
      try {
        loadGame(JSON.parse(saved));
      } catch {
        alert('No valid save found!');
      }
    } else {
      alert('No saved game found!');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-purple-950 to-gray-950 relative overflow-hidden">
      {/* Animated background orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-purple-600/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-32 right-1/4 w-80 h-80 bg-pink-600/15 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Logo & Title */}
      <div className="relative text-center mb-12 animate-fade-in">
        <div className="text-6xl mb-4">📱💰</div>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-pink-400 to-orange-400">
          Influencer &
        </h1>
        <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-green-400 mt-1">
          Investor Simulator
        </h1>
        <p className="text-gray-400 text-sm mt-3 max-w-xs mx-auto">
          Build your empire across social media & financial markets
        </p>
      </div>


      {/* Menu Buttons */}
      <div className="relative flex flex-col gap-3 w-72">
        <button
          onClick={() => setPhase('character_creation')}
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          🎮 New Game
        </button>

        <button
          onClick={handleLoadGame}
          className="w-full py-4 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold text-lg hover:bg-white/20 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          💾 Load Game
        </button>

        <button
          className="w-full py-4 rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 text-gray-400 font-semibold text-lg hover:bg-white/10 hover:scale-105 active:scale-95 transition-all duration-200"
        >
          ⚙️ Settings
        </button>
      </div>

      {/* Version */}
      <p className="relative mt-10 text-gray-600 text-xs">v2.0 • Multi-Platform Edition</p>
    </div>
  );
}
