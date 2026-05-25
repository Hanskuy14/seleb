/**
 * NotificationPopup.jsx
 * Push notification system - random pop-ups on the phone screen
 * Shows latest notification with auto-dismiss
 */
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';
import { generateNotification } from '../../utils/gameLogic';

export default function NotificationPopup() {
  const { state, addNotification } = useGame();
  const [visible, setVisible] = useState(false);
  const [current, setCurrent] = useState(null);

  // Random notification trigger based on game activity
  useEffect(() => {
    if (state.gamePhase !== 'playing') return;
    const interval = setInterval(() => {
      // ~20% chance every 30 seconds of real time (simulates random events)
      if (Math.random() > 0.8) {
        const notif = { ...generateNotification(state), id: Date.now(), time: Date.now() };
        addNotification(notif);
        setCurrent(notif);
        setVisible(true);
        // Auto-hide after 4 seconds
        setTimeout(() => setVisible(false), 4000);
      }
    }, 30000);
    return () => clearInterval(interval);
  }, [state.gamePhase, state.day]);

  // Show cancel event notification immediately
  useEffect(() => {
    if (state.cancelEvent && state.isCanceled) {
      const notif = { id: Date.now(), icon: '⚠️', text: state.cancelEvent.headline, time: Date.now() };
      setCurrent(notif);
      setVisible(true);
      setTimeout(() => setVisible(false), 6000);
    }
  }, [state.isCanceled]);

  if (!visible || !current) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[9999] w-80 animate-fade-in">
      <div
        onClick={() => setVisible(false)}
        className="bg-gray-900/95 backdrop-blur-xl rounded-2xl p-3 border border-white/20 shadow-2xl shadow-black/50 cursor-pointer hover:bg-gray-800/95 transition-all"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-lg flex-shrink-0">
            {current.icon}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/60 text-[9px] font-medium">Influencer Sim</p>
            <p className="text-white text-xs font-medium truncate">{current.text}</p>
          </div>
          <span className="text-gray-500 text-[9px] flex-shrink-0">now</span>
        </div>
      </div>
    </div>
  );
}
