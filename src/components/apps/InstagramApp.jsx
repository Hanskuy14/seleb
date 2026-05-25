/**
 * InstagramApp.jsx
 * Main gameplay hub: Profile, Content Creation, Feed, Live Streaming
 */
import { useState } from 'react';
import { useGame } from '../../context/GameContext';
import { formatNumber, calculatePostPerformance, randomInt, randomChoice, generateLiveComment, getLiveResponseOptions } from '../../utils/gameLogic';

// ==================== SUB-COMPONENTS ====================

function ProfileTab() {
  const { state } = useGame();

  return (
    <div className="p-4 overflow-y-auto h-full scrollbar-hide">
      {/* Profile Header */}
      <div className="flex items-center gap-4 mb-4">
        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-orange-400 p-[2px]">
          <div className="w-full h-full rounded-full bg-gray-900 flex items-center justify-center text-2xl">
            {state.avatar}
          </div>
        </div>
        <div className="flex-1">
          <h2 className="text-white font-bold text-sm">@{state.username}</h2>
          <p className="text-gray-400 text-xs mt-0.5">{state.bio}</p>
          <span className="inline-block mt-1 text-[9px] px-2 py-0.5 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/30 text-purple-300 border border-purple-500/30">
            {state.tier} Influencer
          </span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="flex items-center justify-around py-3 border-y border-gray-700/50 mb-4">
        <div className="text-center">
          <p className="text-white font-bold text-sm">{state.posts.length}</p>
          <p className="text-gray-400 text-[10px]">Posts</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-sm">{formatNumber(state.followers)}</p>
          <p className="text-gray-400 text-[10px]">Followers</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-sm">{state.engagementRate.toFixed(1)}%</p>
          <p className="text-gray-400 text-[10px]">Eng. Rate</p>
        </div>
        <div className="text-center">
          <p className="text-white font-bold text-sm">{state.reputation}</p>
          <p className="text-gray-400 text-[10px]">Reputation</p>
        </div>
      </div>

      {/* Trending Topics */}
      <div className="mb-4">
        <p className="text-gray-400 text-[10px] mb-1.5">🔥 Trending Now:</p>
        <div className="flex flex-wrap gap-1.5">
          {state.currentTrends.map((trend, i) => (
            <span key={i} className="text-[10px] px-2 py-0.5 rounded-full bg-pink-500/20 text-pink-300 border border-pink-500/30">
              #{trend}
            </span>
          ))}
        </div>
      </div>

      {/* Post Grid */}
      <div className="grid grid-cols-3 gap-1">
        {state.posts.length === 0 ? (
          <div className="col-span-3 text-center py-8">
            <p className="text-gray-500 text-sm">No posts yet</p>
            <p className="text-gray-600 text-xs mt-1">Create your first post!</p>
          </div>
        ) : (
          state.posts.map((post, i) => (
            <div key={i} className="aspect-square bg-gradient-to-br from-gray-700 to-gray-800 rounded-sm relative overflow-hidden group">
              <div className="absolute inset-0 flex items-center justify-center text-3xl">
                {post.thumbnail}
              </div>
              {post.isViral && (
                <div className="absolute top-1 right-1 text-[8px] bg-red-500 px-1 rounded">🔥</div>
              )}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <span className="text-white text-[10px]">❤️ {formatNumber(post.likes)}</span>
                <span className="text-white text-[10px]">💬 {post.comments}</span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function CreatePostTab() {
  const { state, createPost, addFollowers, removeFollowers, updateEngagement, updateReputation, advanceTime, addTransaction, updateCash } = useGame();
  const [theme, setTheme] = useState('');
  const [caption, setCaption] = useState('');
  const [result, setResult] = useState(null);
  const [isCreating, setIsCreating] = useState(false);

  const themes = [
    { id: 'Fashion', icon: '👗', label: 'Fashion/OOTD' },
    { id: 'Tech Review', icon: '📱', label: 'Tech Review' },
    { id: 'Lifestyle', icon: '✨', label: 'Lifestyle' },
    { id: 'Comedy', icon: '😂', label: 'Comedy' },
    { id: 'Fitness', icon: '💪', label: 'Fitness' },
    { id: 'Food', icon: '🍜', label: 'Food/Mukbang' },
  ];

  const captions = [
    { id: 'Clickbait', icon: '🎣', label: 'Clickbait', desc: 'More likes, less trust' },
    { id: 'Genuine', icon: '💚', label: 'Genuine', desc: 'Builds reputation' },
    { id: 'Aesthetic', icon: '🎨', label: 'Aesthetic', desc: 'Balanced approach' },
    { id: 'Humorous', icon: '😜', label: 'Humorous', desc: 'High engagement' },
  ];

  const thumbnails = ['📸', '🎬', '🖼️', '🌟', '💫', '🎭', '🎪', '🌈'];

  const handleCreatePost = () => {
    if (!theme || !caption) return;
    if (state.energy < 15) {
      setResult({ error: 'Not enough energy! Rest to recover.' });
      return;
    }

    setIsCreating(true);
    setTimeout(() => {
      const performance = calculatePostPerformance({
        theme,
        captionStyle: caption,
        gear: state.gear,
        currentTrends: state.currentTrends,
        followers: state.followers,
        engagementRate: state.engagementRate,
        reputation: state.reputation,
      });

      const post = {
        id: Date.now(),
        theme,
        caption,
        likes: performance.likes,
        comments: performance.comments,
        isViral: performance.isViral,
        thumbnail: randomChoice(thumbnails),
        timestamp: `Day ${state.day}`,
        quality: performance.quality,
      };

      createPost(post);
      addFollowers(performance.newFollowers);
      if (performance.lostFollowers > 0) removeFollowers(performance.lostFollowers);
      updateEngagement(state.engagementRate + performance.engagementDelta);
      updateReputation(performance.reputationDelta);
      advanceTime(2);

      setResult(performance);
      setIsCreating(false);
      setTheme('');
      setCaption('');
    }, 1500);
  };

  return (
    <div className="p-4 overflow-y-auto h-full scrollbar-hide">
      {result && !result.error ? (
        // Results Screen
        <div className="animate-fade-in">
          <div className="text-center mb-4">
            {result.isViral ? (
              <div>
                <p className="text-3xl mb-2">🔥</p>
                <h3 className="text-lg font-bold text-pink-400">VIRAL POST!</h3>
              </div>
            ) : (
              <div>
                <p className="text-3xl mb-2">📸</p>
                <h3 className="text-lg font-bold text-white">Post Published!</h3>
              </div>
            )}
          </div>

          <div className="space-y-2 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Likes</span>
              <span className="text-white font-bold text-sm">❤️ {formatNumber(result.likes)}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Comments</span>
              <span className="text-white font-bold text-sm">💬 {result.comments}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">New Followers</span>
              <span className="text-green-400 font-bold text-sm">+{formatNumber(result.newFollowers)}</span>
            </div>
            {result.lostFollowers > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">Lost Followers</span>
                <span className="text-red-400 font-bold text-sm">-{result.lostFollowers}</span>
              </div>
            )}
            <div className="flex justify-between items-center">
              <span className="text-gray-400 text-xs">Content Quality</span>
              <span className="text-blue-400 font-bold text-sm">{result.quality}/100</span>
            </div>
          </div>

          <button
            onClick={() => setResult(null)}
            className="w-full mt-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold text-sm hover:opacity-90 active:scale-98 transition-all"
          >
            Create Another Post
          </button>
        </div>
      ) : (
        // Creation Form
        <div>
          <h3 className="text-white font-bold text-sm mb-3">📝 Create New Post</h3>

          {result?.error && (
            <div className="mb-3 p-2 bg-red-500/20 border border-red-500/30 rounded-lg text-red-300 text-xs">
              ⚠️ {result.error}
            </div>
          )}

          {/* Theme Selection */}
          <p className="text-gray-400 text-xs mb-2">Choose Theme:</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {themes.map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id)}
                className={`p-2 rounded-xl text-center transition-all ${
                  theme === t.id
                    ? 'bg-purple-500/30 border-purple-500 border scale-105'
                    : 'bg-gray-800/50 border-gray-700/50 border hover:bg-gray-700/50'
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                <p className="text-[9px] text-gray-300 mt-0.5">{t.label}</p>
                {state.currentTrends.includes(t.id) && (
                  <span className="text-[8px] text-pink-400">🔥 Trending</span>
                )}
              </button>
            ))}
          </div>

          {/* Caption Style */}
          <p className="text-gray-400 text-xs mb-2">Caption Style:</p>
          <div className="space-y-2 mb-4">
            {captions.map((c) => (
              <button
                key={c.id}
                onClick={() => setCaption(c.id)}
                className={`w-full p-2.5 rounded-xl flex items-center gap-3 transition-all ${
                  caption === c.id
                    ? 'bg-pink-500/30 border-pink-500 border'
                    : 'bg-gray-800/50 border-gray-700/50 border hover:bg-gray-700/50'
                }`}
              >
                <span className="text-lg">{c.icon}</span>
                <div className="text-left">
                  <p className="text-xs text-white font-medium">{c.label}</p>
                  <p className="text-[9px] text-gray-400">{c.desc}</p>
                </div>
              </button>
            ))}
          </div>

          {/* Create Button */}
          <button
            onClick={handleCreatePost}
            disabled={!theme || !caption || isCreating}
            className={`w-full py-3 rounded-xl font-semibold text-sm transition-all ${
              theme && caption && !isCreating
                ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:opacity-90 active:scale-98'
                : 'bg-gray-700 text-gray-500 cursor-not-allowed'
            }`}
          >
            {isCreating ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Creating...
              </span>
            ) : (
              '📤 Publish Post (-15 ⚡)'
            )}
          </button>
        </div>
      )}
    </div>
  );
}

function LiveStreamTab() {
  const { state, startLive, endLive, addFollowers, updateCash, addTransaction, advanceTime, updateEnergy } = useGame();
  const [isLive, setIsLive] = useState(false);
  const [viewers, setViewers] = useState(0);
  const [comments, setComments] = useState([]);
  const [currentComment, setCurrentComment] = useState(null);
  const [earnings, setEarnings] = useState(0);
  const [totalGifts, setTotalGifts] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [liveTimer, setLiveTimer] = useState(0);

  const startStream = () => {
    if (state.energy < 25) return;
    setIsLive(true);
    setViewers(Math.floor(state.followers * 0.02));
    setComments([]);
    setEarnings(0);
    setTotalGifts(0);
    setLiveTimer(0);
    startLive();
    spawnComment();
  };

  const spawnComment = () => {
    const comment = generateLiveComment();
    setCurrentComment({ ...comment, id: Date.now() });
  };

  const handleResponse = (response) => {
    let viewerDelta = 0;
    let earningsDelta = 0;

    switch (response.effect) {
      case 'great':
        viewerDelta = randomInt(5, 20);
        earningsDelta = currentComment.type === 'supergift' ? randomInt(50000, 200000) : randomInt(5000, 20000);
        break;
      case 'good':
        viewerDelta = randomInt(1, 10);
        earningsDelta = currentComment.type === 'gift' ? randomInt(10000, 50000) : randomInt(1000, 5000);
        break;
      case 'neutral':
        viewerDelta = randomInt(-5, 5);
        break;
      case 'bad':
        viewerDelta = randomInt(-20, -5);
        break;
    }

    setViewers((v) => Math.max(0, v + viewerDelta));
    setEarnings((e) => e + earningsDelta);
    if (earningsDelta > 0) setTotalGifts((g) => g + 1);
    setComments((prev) => [...prev, { ...currentComment, response: response.text }].slice(-5));
    setLiveTimer((t) => t + 1);

    // End after 8 interactions
    if (liveTimer >= 7) {
      endStream();
      return;
    }

    setTimeout(spawnComment, 800);
  };

  const endStream = () => {
    setIsLive(false);
    setShowResults(true);
    endLive();
    const newFollowersFromLive = Math.floor(viewers * 0.1);
    addFollowers(newFollowersFromLive);
    if (earnings > 0) {
      updateCash(earnings);
      addTransaction({
        id: Date.now(),
        timestamp: `Day ${state.day}`,
        description: 'Live Stream Gifts',
        category: 'Live Stream',
        amount: earnings,
        balance: state.cash + earnings,
      });
    }
    updateEnergy(state.energy - 25);
    advanceTime(1);
  };

  if (showResults) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center animate-fade-in">
        <p className="text-3xl mb-2">🎬</p>
        <h3 className="text-lg font-bold text-white mb-4">Stream Ended!</h3>
        <div className="w-full space-y-2 bg-gray-800/50 rounded-xl p-4 border border-gray-700/50">
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Peak Viewers</span>
            <span className="text-white text-sm font-bold">{viewers}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Gifts Received</span>
            <span className="text-yellow-400 text-sm font-bold">🎁 {totalGifts}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">Earnings</span>
            <span className="text-green-400 text-sm font-bold">+Rp {earnings.toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400 text-xs">New Followers</span>
            <span className="text-blue-400 text-sm font-bold">+{Math.floor(viewers * 0.1)}</span>
          </div>
        </div>
        <button
          onClick={() => setShowResults(false)}
          className="mt-4 w-full py-2.5 rounded-xl bg-gradient-to-r from-red-500 to-pink-500 text-white font-semibold text-sm"
        >
          Done
        </button>
      </div>
    );
  }

  if (!isLive) {
    return (
      <div className="p-4 h-full flex flex-col items-center justify-center">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center mb-4">
          <span className="text-3xl">📡</span>
        </div>
        <h3 className="text-white font-bold text-base mb-1">Go Live!</h3>
        <p className="text-gray-400 text-xs text-center mb-6">
          Interact with viewers, earn gifts, and grow your following!
        </p>
        <div className="w-full bg-gray-800/50 rounded-xl p-3 border border-gray-700/50 mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">Estimated Viewers:</span>
            <span className="text-white">{Math.floor(state.followers * 0.02)}</span>
          </div>
          <div className="flex justify-between text-xs">
            <span className="text-gray-400">Energy Cost:</span>
            <span className="text-yellow-400">-25 ⚡</span>
          </div>
        </div>
        <button
          onClick={startStream}
          disabled={state.energy < 25}
          className={`w-full py-3 rounded-xl font-semibold text-sm ${
            state.energy >= 25
              ? 'bg-gradient-to-r from-red-500 to-pink-500 text-white hover:opacity-90'
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {state.energy < 25 ? 'Not Enough Energy' : '🔴 Start Live Stream'}
        </button>
      </div>
    );
  }

  // Live Stream Active
  return (
    <div className="h-full flex flex-col bg-gradient-to-b from-gray-900 to-black relative">
      {/* Live Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-black/50">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-1 px-2 py-0.5 bg-red-500 rounded-full">
            <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
            <span className="text-white text-[9px] font-bold">LIVE</span>
          </span>
          <span className="text-white text-xs">👁️ {viewers}</span>
        </div>
        <button onClick={endStream} className="text-xs text-red-400 px-2 py-1 border border-red-400/30 rounded-full">
          End
        </button>
      </div>

      {/* Comments Feed */}
      <div className="flex-1 px-3 py-2 overflow-hidden flex flex-col justify-end">
        {comments.map((c, i) => (
          <div key={i} className="mb-1.5 opacity-70">
            <span className="text-[10px] text-gray-300 bg-black/40 px-2 py-0.5 rounded-full">
              {c.text}
            </span>
          </div>
        ))}
      </div>

      {/* Current Comment & Response Options */}
      {currentComment && (
        <div className="px-3 pb-3 animate-fade-in">
          <div className="mb-2 p-2 bg-white/10 backdrop-blur rounded-xl border border-white/20">
            <p className="text-white text-xs font-medium">💬 {currentComment.text}</p>
            <p className="text-gray-400 text-[9px] mt-0.5">Type: {currentComment.type}</p>
          </div>
          <div className="space-y-1.5">
            {getLiveResponseOptions(currentComment.type).map((resp, i) => (
              <button
                key={i}
                onClick={() => handleResponse(resp)}
                className="w-full p-2 rounded-lg bg-gray-800/80 border border-gray-700/50 text-left hover:bg-gray-700/80 active:scale-98 transition-all"
              >
                <span className="text-white text-xs">{resp.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ==================== MAIN INSTAGRAM APP ====================
export default function InstagramApp() {
  const [activeTab, setActiveTab] = useState('profile');

  const tabs = [
    { id: 'profile', icon: '👤', label: 'Profile' },
    { id: 'create', icon: '➕', label: 'Create' },
    { id: 'live', icon: '📡', label: 'Live' },
  ];

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* App Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-gray-800">
        <h1 className="text-white font-bold text-base italic">InstaGram</h1>
        <div className="flex items-center gap-3">
          <span className="text-lg">❤️</span>
          <span className="text-lg">✉️</span>
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-hidden">
        {activeTab === 'profile' && <ProfileTab />}
        {activeTab === 'create' && <CreatePostTab />}
        {activeTab === 'live' && <LiveStreamTab />}
      </div>

      {/* Bottom Navigation */}
      <div className="flex items-center justify-around py-2 border-t border-gray-800 bg-gray-900">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center gap-0.5 px-3 py-1 rounded-lg transition-all ${
              activeTab === tab.id ? 'text-white' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            <span className="text-lg">{tab.icon}</span>
            <span className="text-[9px]">{tab.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
