/**
 * PhoneFrame.jsx
 * Smartphone container with dynamic app routing
 */
import { useGame } from '../../context/GameContext';
import StatusBar from './StatusBar';
import HomeScreen from './HomeScreen';
import InstagramApp from '../apps/InstagramApp';
import TikTokApp from '../apps/TikTokApp';
import YouTubeApp from '../apps/YouTubeApp';
import LinkedInApp from '../apps/LinkedInApp';
import BrokerageApp from '../apps/BrokerageApp';
import BankApp from '../apps/BankApp';
import BuzzNewsApp from '../apps/BuzzNewsApp';
import MessagesApp from '../apps/MessagesApp';
import ShopApp from '../apps/ShopApp';
import SleepApp from '../apps/SleepApp';
import NotificationPopup from '../ui/NotificationPopup';

export default function PhoneFrame() {
  const { state, closeApp } = useGame();

  const renderScreen = () => {
    switch (state.currentApp) {
      case 'instagram': return <InstagramApp />;
      case 'tiktok': return <TikTokApp />;
      case 'youtube': return <YouTubeApp />;
      case 'linkedin': return <LinkedInApp />;
      case 'brokerage': return <BrokerageApp />;
      case 'bank': return <BankApp />;
      case 'news': return <BuzzNewsApp />;
      case 'messages': return <MessagesApp />;
      case 'shop': return <ShopApp />;
      case 'sleep': return <SleepApp />;
      default: return <HomeScreen />;
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      {/* Phone Device */}
      <div className="relative w-[375px] h-[812px] bg-black rounded-[55px] shadow-2xl shadow-black/50 border-[3px] border-gray-700 overflow-hidden">
        {/* Inner bezel */}
        <div className="absolute inset-[2px] rounded-[52px] border border-gray-600/30 pointer-events-none z-50" />
        {/* Notch camera */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[120px] h-[28px] bg-black rounded-b-3xl z-40 flex items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-gray-800 border border-gray-700" />
        </div>

        {/* Screen */}
        <div className="absolute inset-[8px] rounded-[47px] overflow-hidden bg-black flex flex-col">
          <StatusBar />
          <div className="flex-1 overflow-hidden relative">
            <div className={`h-full ${state.currentApp ? 'animate-slide-in' : 'animate-fade-in'}`}>
              {renderScreen()}
            </div>
          </div>
          {/* Navigation */}
          <div className="bg-black/80 backdrop-blur-sm px-4 py-2 flex items-center justify-center">
            {state.currentApp ? (
              <button onClick={closeApp} className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-95 transition-all">
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

        {/* Side buttons */}
        <div className="absolute left-[-3px] top-[120px] w-[3px] h-8 bg-gray-600 rounded-l" />
        <div className="absolute left-[-3px] top-[170px] w-[3px] h-14 bg-gray-600 rounded-l" />
        <div className="absolute left-[-3px] top-[220px] w-[3px] h-14 bg-gray-600 rounded-l" />
        <div className="absolute right-[-3px] top-[180px] w-[3px] h-16 bg-gray-600 rounded-r" />
      </div>

      {/* Notification popup overlay */}
      <NotificationPopup />
    </div>
  );
}
