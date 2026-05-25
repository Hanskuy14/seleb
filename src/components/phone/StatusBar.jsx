/**
 * StatusBar.jsx
 * Realistic phone status bar with dynamic time, battery, and signal indicators
 */
import { useGame } from '../../context/GameContext';

export default function StatusBar() {
  const { state } = useGame();

  const displayTime = () => {
    const h = state.hour % 24;
    const minutes = Math.floor(Math.random() * 60).toString().padStart(2, '0');
    return `${h.toString().padStart(2, '0')}:${minutes}`;
  };

  // Battery visual based on energy (meta: energy = battery)
  const batteryPercent = state.energy;

  return (
    <div className="flex items-center justify-between px-5 py-1 text-xs text-white bg-black/20 backdrop-blur-sm">
      {/* Left: Time */}
      <span className="font-semibold text-[11px]">{displayTime()}</span>

      {/* Center: Notch area */}
      <div className="w-24 h-5 bg-black rounded-b-2xl mx-auto absolute left-1/2 -translate-x-1/2 top-0" />

      {/* Right: Icons */}
      <div className="flex items-center gap-1.5">
        {/* Signal */}
        <svg className="w-4 h-3" viewBox="0 0 20 14" fill="white">
          <rect x="0" y="10" width="3" height="4" rx="0.5" opacity="0.4" />
          <rect x="4.5" y="7" width="3" height="7" rx="0.5" opacity="0.6" />
          <rect x="9" y="4" width="3" height="10" rx="0.5" opacity="0.8" />
          <rect x="13.5" y="0" width="3" height="14" rx="0.5" />
        </svg>

        {/* WiFi */}
        <svg className="w-4 h-3" viewBox="0 0 24 24" fill="white">
          <path d="M12 18c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-5.65-3.35c1.56-1.56 3.64-2.42 5.65-2.42s4.09.86 5.65 2.42l1.41-1.41C17.08 11.27 14.6 10.23 12 10.23s-5.08 1.04-7.06 3.01l1.41 1.41zM2.93 9.22C5.36 6.79 8.56 5.44 12 5.44s6.64 1.35 9.07 3.78l1.41-1.41C19.76 5.09 16.02 3.44 12 3.44S4.24 5.09 1.52 7.81l1.41 1.41z" />
        </svg>

        {/* Battery */}
        <div className="flex items-center gap-0.5">
          <div className="w-6 h-2.5 border border-white/80 rounded-sm relative">
            <div
              className={`absolute left-0.5 top-0.5 bottom-0.5 rounded-sm transition-all ${
                batteryPercent > 50 ? 'bg-green-400' : batteryPercent > 20 ? 'bg-yellow-400' : 'bg-red-400'
              }`}
              style={{ width: `${Math.max(5, batteryPercent * 0.85)}%` }}
            />
          </div>
          <div className="w-0.5 h-1.5 bg-white/80 rounded-r" />
        </div>
      </div>
    </div>
  );
}
