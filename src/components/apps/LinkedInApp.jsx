/**
 * LinkedInApp.jsx
 * Professional/corporate aesthetic. B2B endorsements, networking, serious persona
 */
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatNumber, calculatePostPerformance, CONTENT_THEMES, randomInt } from '../../utils/gameLogic';

const LINKEDIN_TOPICS = [
  { id: 'tech', label: 'Tech Industry', icon: '💻' },
  { id: 'finance', label: 'Finance', icon: '📊' },
  { id: 'leadership', label: 'Leadership', icon: '🎯' },
  { id: 'startup', label: 'Startups', icon: '🚀' },
  { id: 'career', label: 'Career Tips', icon: '📈' },
  { id: 'marketing', label: 'Marketing', icon: '📣' },
];

const POST_TYPES = [
  { id: 'thought', label: 'Thought Leadership', desc: 'Share insights', energyCost: 10, mult: 1.0 },
  { id: 'article', label: 'Long Article', desc: 'Deep dive content', energyCost: 20, mult: 1.8 },
  { id: 'network', label: 'Networking Post', desc: 'Connect & engage', energyCost: 8, mult: 0.7 },
];

export default function LinkedInApp() {
  const { state, createPost } = useGame();
  const [view, setView] = useState('profile');
  const [topic, setTopic] = useState('');
  const [postType, setPostType] = useState('thought');
  const [result, setResult] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const li = state.platforms.linkedin;
  const selected = POST_TYPES.find(p => p.id === postType);


  const handlePost = () => {
    if (!topic || state.energy < selected.energyCost) return;
    setIsPosting(true);
    setTimeout(() => {
      const perf = calculatePostPerformance({
        platform: 'linkedin', theme: topic, captionStyle: 'genuine', gear: state.gear,
        trends: state.trendingHashtags, followers: li.followers,
        engagementRate: li.engagementRate, reputation: state.reputation, niche: state.unlockedNiche,
      });
      perf.likes = Math.floor(perf.likes * selected.mult);
      perf.newFollowers = Math.floor(perf.newFollowers * selected.mult);
      // LinkedIn gives rep bonus
      perf.reputationDelta = Math.max(perf.reputationDelta, 2);
      const connections = randomInt(1, 5);

      const post = { id: Date.now(), topic, postType, likes: perf.likes, comments: perf.comments, connections, isViral: perf.isViral, day: state.day };
      createPost({ platform: 'linkedin', post, newFollowers: perf.newFollowers + connections, lostFollowers: 0, engagementDelta: perf.engagementDelta, reputationDelta: perf.reputationDelta, theme: topic, energyCost: selected.energyCost });
      setResult({ ...perf, connections });
      setView('result');
      setIsPosting(false);
      setTopic('');
    }, 1200);
  };

  return (
    <div className="h-full flex flex-col bg-gray-50 text-gray-900" style={{ background: 'linear-gradient(to bottom, #f3f2ef, #e8e6e0)' }}>
      {/* Header - LinkedIn blue */}
      <div className="px-4 py-2.5 bg-[#0a66c2] flex items-center justify-between">
        <h1 className="text-white font-bold text-base">💼 LinkedIn</h1>
        <span className="text-[10px] text-white/80 bg-white/20 px-2 py-0.5 rounded-full">Professional</span>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide p-4">


        {/* RESULT */}
        {view === 'result' && result && (
          <div className="animate-fade-in text-center">
            <p className="text-4xl mb-3">🤝</p>
            <h3 className="text-xl font-bold text-gray-900 mb-1">Post Published!</h3>
            <p className="text-gray-500 text-xs mb-4">Your professional network is growing</p>
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 space-y-2 text-left">
              <div className="flex justify-between"><span className="text-gray-500 text-xs">Reactions</span><span className="text-gray-900 font-bold">👍 {formatNumber(result.likes)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 text-xs">New Connections</span><span className="text-[#0a66c2] font-bold">+{result.connections}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 text-xs">Followers</span><span className="text-green-600 font-bold">+{formatNumber(result.newFollowers)}</span></div>
              <div className="flex justify-between"><span className="text-gray-500 text-xs">Reputation</span><span className="text-purple-600 font-bold">+{result.reputationDelta}</span></div>
            </div>
            <button onClick={() => setView('profile')} className="mt-4 w-full py-2.5 rounded-xl bg-[#0a66c2] text-white font-semibold text-sm">Back to Feed</button>
          </div>
        )}

        {/* PROFILE */}
        {view === 'profile' && (
          <div>
            {/* Profile Card */}
            <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-200 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-full bg-[#0a66c2] flex items-center justify-center text-xl text-white">{state.avatar}</div>
                <div>
                  <p className="text-gray-900 font-bold text-sm">{state.playerName}</p>
                  <p className="text-gray-500 text-[10px]">@{state.username} • Content Creator & Investor</p>
                </div>
              </div>
              <div className="flex items-center justify-around py-2 border-t border-gray-200">
                <div className="text-center"><p className="text-gray-900 font-bold text-sm">{formatNumber(li.followers)}</p><p className="text-gray-500 text-[9px]">Followers</p></div>
                <div className="text-center"><p className="text-gray-900 font-bold text-sm">{li.posts.length}</p><p className="text-gray-500 text-[9px]">Posts</p></div>
                <div className="text-center"><p className="text-gray-900 font-bold text-sm">{li.engagementRate.toFixed(1)}%</p><p className="text-gray-500 text-[9px]">ER</p></div>
              </div>
            </div>
            {/* Posts */}
            {li.posts.length > 0 && (
              <div className="space-y-2 mb-4">
                {li.posts.slice(0, 4).map((p, i) => (
                  <div key={i} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200">
                    <p className="text-gray-900 text-xs font-medium">{p.topic} • {p.postType}</p>
                    <p className="text-gray-500 text-[9px]">Day {p.day} • 👍{p.likes} 💬{p.comments}</p>
                  </div>
                ))}
              </div>
            )}
            <button onClick={() => setView('create')} className="w-full py-3 rounded-xl bg-[#0a66c2] text-white font-semibold text-sm">✍️ Create Post</button>
          </div>
        )}


        {/* CREATE */}
        {view === 'create' && (
          <div className="animate-fade-in">
            <h3 className="text-gray-900 font-bold text-sm mb-3">✍️ Share Insight</h3>
            {state.energy < selected.energyCost && <p className="text-red-500 text-xs mb-2">⚠️ Need {selected.energyCost} energy</p>}

            <p className="text-gray-500 text-[10px] mb-1.5">Post Type:</p>
            <div className="space-y-1.5 mb-4">
              {POST_TYPES.map(pt => (
                <button key={pt.id} onClick={() => setPostType(pt.id)} className={`w-full p-2.5 rounded-lg border text-left transition-all ${postType === pt.id ? 'border-[#0a66c2] bg-blue-50' : 'border-gray-200 bg-white'}`}>
                  <div className="flex justify-between items-center">
                    <div><p className="text-gray-900 text-xs font-medium">{pt.label}</p><p className="text-gray-500 text-[9px]">{pt.desc}</p></div>
                    <span className="text-[10px] text-gray-400">-{pt.energyCost}⚡</span>
                  </div>
                </button>
              ))}
            </div>

            <p className="text-gray-500 text-[10px] mb-1.5">Topic:</p>
            <div className="grid grid-cols-3 gap-1.5 mb-4">
              {LINKEDIN_TOPICS.map(t => (
                <button key={t.id} onClick={() => setTopic(t.id)} className={`p-2 rounded-lg text-center transition-all ${topic === t.id ? 'bg-blue-100 border-[#0a66c2] border' : 'bg-white border-gray-200 border'}`}>
                  <span className="text-lg">{t.icon}</span>
                  <p className="text-[8px] text-gray-600">{t.label}</p>
                </button>
              ))}
            </div>

            <button onClick={handlePost} disabled={!topic || isPosting || state.energy < selected.energyCost}
              className={`w-full py-3 rounded-xl font-semibold text-sm ${topic && state.energy >= selected.energyCost ? 'bg-[#0a66c2] text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}>
              {isPosting ? '⏳ Posting...' : '📤 Publish'}
            </button>
            <button onClick={() => setView('profile')} className="mt-2 w-full py-2 text-gray-400 text-xs">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}
