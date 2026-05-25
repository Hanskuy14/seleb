/**
 * PhoneFrame.jsx
 * The main smartphone container with bezel, notch, and navigation
 */
import { useGame } from '../../context/GameContext';
import StatusBar from './StatusBar';
import HomeScreen from './HomeScreen';
import InstagramApp from '../apps/InstagramApp';
import BankApp from '../apps/BankApp';
import MessagesApp from '../apps/MessagesApp';
import ShopApp from '../apps/ShopApp';

export default function PhoneFrame() {
  const { state, closeApp } = useGame();

  // Render the active app or home screen
  const renderScreen = () => {
    switch (state.currentApp) {
      case 'instagram':
        return <InstagramApp />;
      case 'bank':
        return <BankApp />;
      case 'messages':
        return <MessagesApp />;
      case 'shop':
        return <ShopApp />;
      default:
        return <HomeScreen />;
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      {/* Phone Device */}
      <div className="relative w-[375px] h-[812px] bg-black rounded-[55px] shadow-2xl shadow-black/50 border-[3px] border-gray-700 overflow-hidden">
        {/* Inner bezel glow */}
        <div className="absolute inset-[2px] rounded-[52px] border border-gray-600/30 pointer-events-none z-50" />

        {/* Notch */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-black rounded-b-3xl z-40 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gray-800 border border-gray-700" /> {/* Camera */}
        </div>

        {/* Screen Area */}
        <div className="absolute inset-[8px] rounded-[47px] overflow-hidden bg-black flex flex-col">
          {/* Status Bar */}
          <StatusBar />

          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden relative">
            <div className={`h-full ${state.currentApp ? 'animate-slide-in' : 'animate-fade-in'}`}>
              {renderScreen()}
            </div>
          </div>

          {/* Home Indicator / Navigation Bar */}
          <div className="bg-black/80 backdrop-blur-sm px-4 py-2 flex items-center justify-center">
            {state.currentApp ? (
              <button
                onClick={closeApp}
                className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all"
              >
                <svg className="w-4 h-4 text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
                <span className="text-xs text-white/80">Home</span>
              </button>
            ) : (
              <div className="w-32 h-1 bg-white/30 rounded-full" />
            )}
          </div>
        </div>

        {/* Side buttons (visual only) */}
        <div className="absolute left-[-3px] top-[120px] w-[3px] h-8 bg-gray-600 rounded-l" /> {/* Silent */}
        <div className="absolute left-[-3px] top-[170px] w-[3px] h-14 bg-gray-600 rounded-l" /> {/* Vol Up */}
        <div className="absolute left-[-3px] top-[220px] w-[3px] h-14 bg-gray-600 rounded-l" /> {/* Vol Down */}
        <div className="absolute right-[-3px] top-[180px] w-[3px] h-16 bg-gray-600 rounded-r" /> {/* Power */}
      </div>
    </div>
  );
}
