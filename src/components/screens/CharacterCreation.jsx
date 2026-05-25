/**
 * CharacterCreation.jsx
 * Onboarding form: name, username, starting capital selection
 */
import { useState, useEffect } from 'react';
import { useGame } from '../../context/GameContext';

const CAPITAL_OPTIONS = [
  { id: 'broke', label: 'Student / Broke', amount: 100, icon: '📚', desc: 'Hard mode - hustle from scratch', color: 'from-gray-600 to-gray-700' },
  { id: 'starter', label: 'Part-Timer', amount: 500, icon: '☕', desc: 'Modest savings to start', color: 'from-blue-600 to-blue-700' },
  { id: 'comfortable', label: 'Working Class', amount: 2000, icon: '💼', desc: 'Decent starting fund', color: 'from-green-600 to-green-700' },
  { id: 'rich', label: 'Rich Kid', amount: 5000, icon: '💎', desc: 'Easy mode - privileged start', color: 'from-amber-500 to-orange-600' },
];

const TAKEN_USERNAMES = ['influencer', 'admin', 'official', 'celebrity', 'famous', 'verified'];

export default function CharacterCreation() {
  const { createCharacter, setPhase } = useGame();
  const [step, setStep] = useState(1);
  const [playerName, setPlayerName] = useState('');
  const [username, setUsername] = useState('');
  const [usernameStatus, setUsernameStatus] = useState(null); // null | 'checking' | 'available' | 'taken'
  const [capital, setCapital] = useState(null);

  // Simulate username availability check
  useEffect(() => {
    if (!username) { setUsernameStatus(null); return; }
    setUsernameStatus('checking');
    const timer = setTimeout(() => {
      const clean = username.toLowerCase().replace(/[^a-z0-9_.]/g, '');
      if (clean.length < 3) setUsernameStatus('taken');
      else if (TAKEN_USERNAMES.some(t => clean.includes(t))) setUsernameStatus('taken');
      else setUsernameStatus('available');
    }, 800);
    return () => clearTimeout(timer);
  }, [username]);

  const handleSubmit = () => {
    if (!playerName || !username || usernameStatus !== 'available' || !capital) return;
    createCharacter({ playerName, username: username.toLowerCase().replace(/[^a-z0-9_.]/g, ''), startingCapital: capital });
  };


  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-950 via-slate-900 to-gray-950 p-4 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-600/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Back button */}
        <button onClick={() => step > 1 ? setStep(step - 1) : setPhase('menu')} className="text-gray-400 text-sm mb-4 hover:text-white transition-colors">
          ← Back
        </button>

        {/* Progress */}
        <div className="flex gap-2 mb-6">
          {[1, 2, 3].map(s => (
            <div key={s} className={`h-1 flex-1 rounded-full transition-all ${s <= step ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 'bg-gray-700'}`} />
          ))}
        </div>

        {/* Step 1: Name */}
        {step === 1 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-2">What's your name?</h2>
            <p className="text-gray-400 text-sm mb-6">This is your real-world identity in the game.</p>
            <input
              type="text"
              value={playerName}
              onChange={e => setPlayerName(e.target.value)}
              placeholder="Enter your name..."
              maxLength={24}
              className="w-full px-4 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
            />
            <button
              onClick={() => playerName.length >= 2 && setStep(2)}
              disabled={playerName.length < 2}
              className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm transition-all ${playerName.length >= 2 ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
            >
              Continue
            </button>
          </div>
        )}


        {/* Step 2: Username */}
        {step === 2 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-2">Pick your username</h2>
            <p className="text-gray-400 text-sm mb-6">This will be your handle across all platforms.</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 font-medium">@</span>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value.replace(/\s/g, '').toLowerCase())}
                placeholder="your_username"
                maxLength={20}
                className="w-full pl-9 pr-10 py-3 rounded-xl bg-gray-800/80 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-all"
              />
              {/* Status indicator */}
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                {usernameStatus === 'checking' && <span className="w-5 h-5 border-2 border-gray-500 border-t-purple-400 rounded-full animate-spin inline-block" />}
                {usernameStatus === 'available' && <span className="text-green-400 text-lg">✓</span>}
                {usernameStatus === 'taken' && <span className="text-red-400 text-lg">✗</span>}
              </div>
            </div>
            {usernameStatus === 'available' && <p className="text-green-400 text-xs mt-2">@{username} is available!</p>}
            {usernameStatus === 'taken' && <p className="text-red-400 text-xs mt-2">Username unavailable. Try another.</p>}
            <button
              onClick={() => usernameStatus === 'available' && setStep(3)}
              disabled={usernameStatus !== 'available'}
              className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm transition-all ${usernameStatus === 'available' ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:opacity-90' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
            >
              Continue
            </button>
          </div>
        )}


        {/* Step 3: Capital Selection */}
        {step === 3 && (
          <div className="animate-fade-in">
            <h2 className="text-2xl font-bold text-white mb-2">Your starting capital</h2>
            <p className="text-gray-400 text-sm mb-6">Choose your financial background. This sets the difficulty.</p>
            <div className="space-y-3">
              {CAPITAL_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setCapital(opt.amount)}
                  className={`w-full p-4 rounded-xl border text-left transition-all hover:scale-[1.02] active:scale-[0.98] ${
                    capital === opt.amount
                      ? 'border-purple-500 bg-purple-500/20 ring-1 ring-purple-500'
                      : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${opt.color} flex items-center justify-center text-xl`}>
                      {opt.icon}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="text-white font-semibold text-sm">{opt.label}</p>
                        <p className="text-green-400 font-bold text-sm">${opt.amount.toLocaleString()}</p>
                      </div>
                      <p className="text-gray-400 text-xs mt-0.5">{opt.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <button
              onClick={handleSubmit}
              disabled={!capital}
              className={`w-full mt-6 py-3 rounded-xl font-semibold text-sm transition-all ${capital ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:opacity-90' : 'bg-gray-700 text-gray-500 cursor-not-allowed'}`}
            >
              🚀 Start Your Journey
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
