/**
 * StatusBar.jsx
 * Phone status bar with time, day counter, energy, battery, signal
 */
import { useGame } from '../../context/GameContext';

export default function StatusBar() {
  const { state } = useGame();
  const h = state.hour % 24;
  const time = `${h.toString().padStart(2, '0')}:${String(Math.floor(state.day * 7) % 60).padStart(2, '0')}`;
  const bat = state.energy;

  return (
    <div className="flex items-center justify-between px-5 py-1 text-xs text-white bg-black/20 backdrop-blur-sm relative z-30">
      <span className="font-semibold text-[11px]">{time}</span>
      {/* Notch */}
      <div className="w-24 h-5 bg-black rounded-b-2xl mx-auto absolute left-1/2 -translate-x-1/2 top-0" />
      {/* Right icons */}
      <div className="flex items-center gap-1.5">
        <span className="text-[9px] text-yellow-300 font-bold">Day {state.day}</span>
        <div className="w-px h-3 bg-white/30" />
        {/* Battery = Energy */}
        <div className="flex items-center gap-0.5">
          <div className="w-6 h-2.5 border border-white/80 rounded-sm relative">
            <div
              className={`absolute left-0.5 top-0.5 bottom-0.5 rounded-sm transition-all ${bat > 50 ? 'bg-green-400' : bat > 20 ? 'bg-yellow-400' : 'bg-red-400'}`}
              style={{ width: `${Math.max(5, bat * 0.85)}%` }}
            />
          </div>
          <div className="w-0.5 h-1.5 bg-white/80 rounded-r" />
        </div>
      </div>
    </div>
  );
}
