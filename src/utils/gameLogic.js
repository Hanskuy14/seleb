/**
 * gameLogic.js
 * Core game algorithms for Influencer & Investor Simulator
 * Covers: content scoring, market simulation, news generation, niche tracking, reputation
 */

// ==================== RANDOM HELPERS ====================
export function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}
export function randomChoice(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// ==================== FORMAT HELPERS ====================
export function formatCurrency(amount) {
  if (Math.abs(amount) >= 1e9) return '$' + (amount / 1e9).toFixed(2) + 'B';
  if (Math.abs(amount) >= 1e6) return '$' + (amount / 1e6).toFixed(2) + 'M';
  if (Math.abs(amount) >= 1e3) return '$' + (amount / 1e3).toFixed(1) + 'K';
  return '$' + amount.toFixed(0);
}
export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}


// ==================== CONTENT THEMES ====================
export const CONTENT_THEMES = [
  { id: 'tech', label: 'Tech', icon: '📱' },
  { id: 'fashion', label: 'Fashion/Beauty', icon: '👗' },
  { id: 'finance', label: 'Finance', icon: '💰' },
  { id: 'lifestyle', label: 'Lifestyle', icon: '✨' },
  { id: 'fitness', label: 'Fitness', icon: '💪' },
  { id: 'food', label: 'Food', icon: '🍜' },
  { id: 'comedy', label: 'Comedy', icon: '😂' },
  { id: 'gaming', label: 'Gaming', icon: '🎮' },
];

export const CAPTION_STYLES = [
  { id: 'clickbait', label: 'Clickbait', icon: '🎣', desc: 'More views, less trust' },
  { id: 'genuine', label: 'Genuine', icon: '💚', desc: 'Builds reputation' },
  { id: 'aesthetic', label: 'Aesthetic', icon: '🎨', desc: 'Balanced approach' },
  { id: 'humorous', label: 'Humorous', icon: '😜', desc: 'High engagement' },
];


// ==================== POST PERFORMANCE CALCULATOR ====================
export function calculatePostPerformance({ platform, theme, captionStyle, gear, trends, followers, engagementRate, reputation, niche }) {
  const gearBonus = Object.values(gear).reduce((s, g) => s + (g.qualityBonus || 0), 0);
  let baseQuality = 30 + gearBonus;

  // Trend bonus
  const isTrending = trends.some(t => t.toLowerCase().includes(theme));
  const trendBonus = isTrending ? 50 : 0;

  // Niche bonus
  const nicheBonus = (niche && niche === theme) ? 20 : 0;

  // Caption modifiers
  const mods = { clickbait: { l: 1.3, e: 0.8, r: -2 }, genuine: { l: 1.0, e: 1.2, r: 3 }, aesthetic: { l: 1.1, e: 1.1, r: 1 }, humorous: { l: 1.4, e: 1.3, r: 2 } };
  const mod = mods[captionStyle] || mods.genuine;

  // Platform multipliers
  const platMult = { instagram: 1.0, tiktok: 1.2, youtube: 0.8, linkedin: 0.7 };
  const pMult = platMult[platform] || 1.0;

  const quality = Math.min(100, baseQuality + trendBonus + nicheBonus);
  const reach = followers * (engagementRate / 100) * (quality / 100) * pMult;
  const likes = Math.floor(reach * mod.l * randomFloat(0.7, 1.4));
  const comments = Math.floor(likes * randomFloat(0.03, 0.12));

  // Viral check - TikTok has higher viral chance
  const viralThreshold = platform === 'tiktok' ? 0.88 : 0.95;
  const viralRoll = Math.random();
  const isViral = viralRoll > viralThreshold;

  let newFollowers;
  if (isViral) newFollowers = randomInt(Math.floor(followers * 0.15), Math.floor(followers * 0.5) + 100);
  else if (viralRoll > 0.7) newFollowers = randomInt(10, Math.floor(followers * 0.05) + 20);
  else newFollowers = randomInt(2, Math.floor(followers * 0.02) + 5);

  let lostFollowers = 0;
  if (quality < 30 && Math.random() > 0.6) lostFollowers = randomInt(1, Math.floor(followers * 0.01));

  const engagementDelta = (mod.e - 1) * randomFloat(0.1, 0.5);
  return { likes, comments, newFollowers, lostFollowers, engagementDelta, reputationDelta: mod.r, isViral, quality };
}


// ==================== YOUTUBE REVENUE CALCULATOR ====================
export function calculateYouTubeRevenue(views) {
  // ~$2-5 CPM (cost per 1000 views)
  const cpm = randomFloat(2, 5);
  return Math.floor((views / 1000) * cpm);
}

// ==================== MARKET / INVESTMENT SIMULATION ====================
export const STOCKS = [
  { id: 'TECH', name: 'TechCorp', type: 'stock', basePrice: 150, volatility: 0.03 },
  { id: 'BANK', name: 'MegaBank', type: 'stock', basePrice: 85, volatility: 0.02 },
  { id: 'FOOD', name: 'FoodChain Inc', type: 'stock', basePrice: 45, volatility: 0.025 },
  { id: 'PENNY', name: 'SmallCap Co', type: 'stock', basePrice: 3, volatility: 0.08 },
];
export const CRYPTO = [
  { id: 'BTC', name: 'Bitcoin', type: 'crypto', basePrice: 42000, volatility: 0.05 },
  { id: 'ETH', name: 'Ethereum', type: 'crypto', basePrice: 2800, volatility: 0.06 },
  { id: 'DOGE', name: 'DogeMoon', type: 'crypto', basePrice: 0.08, volatility: 0.15 },
  { id: 'MEME', name: 'MemeCoin', type: 'crypto', basePrice: 0.001, volatility: 0.25 },
];
export const MUTUAL_FUNDS = [
  { id: 'SAFE', name: 'SafeGrow Fund', type: 'fund', basePrice: 100, volatility: 0.005, dailyYield: 0.0003 },
  { id: 'BALANCED', name: 'Balanced Fund', type: 'fund', basePrice: 100, volatility: 0.01, dailyYield: 0.0005 },
  { id: 'AGGRESSIVE', name: 'Growth Fund', type: 'fund', basePrice: 100, volatility: 0.02, dailyYield: 0.001 },
];


// Price update based on news sentiment and volatility
export function updateMarketPrices(currentPrices, newsHeadlines) {
  const updated = { ...currentPrices };
  // Determine sentiment from news
  let techSentiment = 0, cryptoSentiment = 0, generalSentiment = 0;
  newsHeadlines.forEach(h => {
    if (h.effect === 'tech_down') techSentiment -= 0.05;
    if (h.effect === 'tech_up') techSentiment += 0.04;
    if (h.effect === 'crypto_up') cryptoSentiment += 0.08;
    if (h.effect === 'crypto_down') cryptoSentiment -= 0.06;
    if (h.effect === 'market_up') generalSentiment += 0.03;
    if (h.effect === 'market_down') generalSentiment -= 0.03;
  });

  const allAssets = [...STOCKS, ...CRYPTO, ...MUTUAL_FUNDS];
  allAssets.forEach(asset => {
    const prev = updated[asset.id] || asset.basePrice;
    let sentiment = generalSentiment;
    if (asset.type === 'crypto') sentiment += cryptoSentiment;
    if (asset.id === 'TECH') sentiment += techSentiment;

    const change = (randomFloat(-1, 1) * asset.volatility) + sentiment;
    const newPrice = Math.max(asset.basePrice * 0.1, prev * (1 + change));
    updated[asset.id] = parseFloat(newPrice.toFixed(asset.basePrice < 1 ? 6 : 2));
  });
  return updated;
}


// ==================== NEWS GENERATION ====================
const NEWS_POOL = [
  { headline: 'Tech Giant Reports Record Earnings', effect: 'tech_up', category: 'economy' },
  { headline: 'Government Announces New Tech Regulations', effect: 'tech_down', category: 'economy' },
  { headline: 'Crypto Tax Framework Legalized', effect: 'crypto_up', category: 'economy' },
  { headline: 'Major Exchange Hacked - Millions Lost', effect: 'crypto_down', category: 'economy' },
  { headline: 'Federal Reserve Cuts Interest Rates', effect: 'market_up', category: 'economy' },
  { headline: 'Inflation Hits 5-Year High', effect: 'market_down', category: 'economy' },
  { headline: 'Celebrity Influencer Caught in Scandal', effect: 'none', category: 'entertainment' },
  { headline: 'New Social Media Platform Launches', effect: 'none', category: 'tech' },
  { headline: 'Viral Dance Challenge Takes Over TikTok', effect: 'none', category: 'trending' },
  { headline: 'Fashion Week Highlights Sustainable Brands', effect: 'none', category: 'lifestyle' },
  { headline: 'AI Company IPO Skyrockets 200%', effect: 'tech_up', category: 'economy' },
  { headline: 'Bitcoin ETF Approved by Regulators', effect: 'crypto_up', category: 'economy' },
  { headline: 'Global Supply Chain Crisis Deepens', effect: 'market_down', category: 'economy' },
  { headline: 'Elon Posts Meme - MemeCoin Pumps', effect: 'crypto_up', category: 'trending' },
  { headline: 'FTC Bans Undisclosed Paid Promotions', effect: 'none', category: 'influencer' },
  { headline: 'Fitness Influencer Exposed for Fake Results', effect: 'none', category: 'entertainment' },
];

export function generateDailyNews() {
  const shuffled = [...NEWS_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3).map(n => ({ ...n, id: Date.now() + Math.random() }));
}


// ==================== TRENDING HASHTAGS ====================
const TREND_POOL = [
  'Tech', 'Fashion', 'Fitness', 'Cooking', 'Travel', 'Finance', 'Comedy',
  'OOTD', 'Skincare', 'Unboxing', 'Gaming', 'DanceChallenge', 'DIY',
  'Motivation', 'DayInMyLife', 'Mukbang', 'Review', 'Vlog', 'AI', 'Crypto',
];
export function generateTrendingHashtags() {
  const shuffled = [...TREND_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 4);
}

// ==================== ENDORSEMENT GENERATION ====================
const BRANDS = [
  { name: 'FitTea Co.', type: 'Slimming Tea', risk: 'high', category: 'health', icon: '🍵' },
  { name: 'TechGear Pro', type: 'Tech Accessories', risk: 'low', category: 'tech', icon: '📱' },
  { name: 'GlowSkin', type: 'Skincare', risk: 'medium', category: 'fashion', icon: '✨' },
  { name: 'QuickCash App', type: 'Gambling App', risk: 'high', category: 'finance', icon: '💸' },
  { name: 'StyleHub', type: 'Fashion Brand', risk: 'low', category: 'fashion', icon: '👗' },
  { name: 'FoodieBox', type: 'Meal Kit', risk: 'low', category: 'food', icon: '🍱' },
  { name: 'CryptoMoon', type: 'Crypto Exchange', risk: 'high', category: 'finance', icon: '🌙' },
  { name: 'ZenFit', type: 'Fitness App', risk: 'low', category: 'fitness', icon: '💪' },
  { name: 'LuxWatch', type: 'Luxury Watches', risk: 'low', category: 'fashion', icon: '⌚' },
  { name: 'MagicDiet', type: 'Diet Pills', risk: 'high', category: 'health', icon: '💊' },
  { name: 'EcoWear', type: 'Sustainable Fashion', risk: 'low', category: 'fashion', icon: '🌿' },
  { name: 'GameZone', type: 'Mobile Game', risk: 'medium', category: 'gaming', icon: '🎮' },
  { name: 'CloudAI', type: 'SaaS Tool', risk: 'low', category: 'tech', icon: '☁️' },
  { name: 'FinBro', type: 'Trading Platform', risk: 'medium', category: 'finance', icon: '📊' },
];


export function generateEndorsement(totalFollowers, reputation) {
  const brand = randomChoice(BRANDS);
  const tier = totalFollowers >= 500000 ? 'mega' : totalFollowers >= 50000 ? 'macro' : totalFollowers >= 10000 ? 'mid' : totalFollowers >= 1000 ? 'micro' : 'nano';
  const tierMult = { nano: 0.3, micro: 1, mid: 3, macro: 8, mega: 20 };
  const riskPay = { low: randomInt(200, 800), medium: randomInt(600, 1500), high: randomInt(1200, 3000) };
  const payout = Math.floor(riskPay[brand.risk] * (tierMult[tier] || 1));
  const riskEffects = {
    low: { followerLoss: 0, engagementHit: 0, reputationHit: 0 },
    medium: { followerLoss: randomInt(10, 50), engagementHit: randomFloat(0, 0.3), reputationHit: randomInt(2, 5) },
    high: { followerLoss: randomInt(50, 300), engagementHit: randomFloat(0.3, 1.0), reputationHit: randomInt(8, 20) },
  };
  return {
    id: Date.now() + Math.random(), brand: brand.name, brandIcon: brand.icon,
    productType: brand.type, category: brand.category, risk: brand.risk,
    payout, requirements: randomChoice(['1 Feed Post + 1 Story', '2 Posts + 3 Stories', '1 Reel', '3 Stories']),
    riskEffects: riskEffects[brand.risk], deadline: randomInt(2, 7), status: 'pending',
  };
}

// ==================== NICHE SYSTEM ====================
export function checkNicheUnlock(contentHistory) {
  // Check last 5 posts for consistent theme
  if (contentHistory.length < 5) return null;
  const last5 = contentHistory.slice(-5);
  const theme = last5[0];
  if (last5.every(t => t === theme)) return theme;
  return null;
}


// ==================== OVERNIGHT CALCULATIONS ====================
export function calculateOvernightGrowth(state) {
  const { platforms, reputation } = state;
  const results = {};
  // Each platform has organic growth/decay
  Object.entries(platforms).forEach(([key, plat]) => {
    const repMult = reputation / 100;
    const erDecay = plat.engagementRate > 3 ? -randomFloat(0.01, 0.05) : randomFloat(0, 0.02);
    const organicGrowth = Math.floor(plat.followers * randomFloat(0.001, 0.005) * repMult);
    results[key] = { followerGrowth: organicGrowth, erChange: erDecay };
  });
  return results;
}

// ==================== TAX CALCULATION ====================
export function calculateTax(totalEarnings) {
  // Progressive tax: 10% on first $5000, 20% above
  if (totalEarnings <= 5000) return Math.floor(totalEarnings * 0.1);
  return Math.floor(5000 * 0.1 + (totalEarnings - 5000) * 0.2);
}

// ==================== CANCEL CULTURE CHECK ====================
export function checkCancelEvent(reputation, highRiskDealsCount) {
  // Higher chance of cancel event with low rep and many risky deals
  const cancelChance = (100 - reputation) / 500 + highRiskDealsCount * 0.02;
  if (Math.random() < cancelChance) {
    return {
      triggered: true,
      followerLoss: randomFloat(0.05, 0.15), // percentage
      reputationHit: randomInt(10, 25),
      headline: randomChoice([
        'Influencer Exposed for Promoting Scam!',
        'Followers Call Out Fake Endorsement',
        'Cancel Culture Strikes Again',
        'Audience Trust Betrayed - Mass Unfollow',
      ]),
    };
  }
  return { triggered: false };
}


// ==================== LIVE STREAM LOGIC ====================
export function generateLiveComment() {
  const comments = [
    { text: '🔥🔥🔥 You look amazing!', type: 'positive' },
    { text: 'Love your content!', type: 'positive' },
    { text: 'Can you do a giveaway?', type: 'question' },
    { text: 'First time here, hi!', type: 'positive' },
    { text: 'This is boring...', type: 'negative' },
    { text: 'Show us your setup!', type: 'question' },
    { text: '❤️❤️❤️', type: 'positive' },
    { text: 'Fake followers lol', type: 'troll' },
    { text: 'Sending gifts! 🎁', type: 'gift' },
    { text: 'Tutorial please! 🙏', type: 'question' },
    { text: '💰💰💰 Super gift!', type: 'supergift' },
    { text: 'Mid content tbh', type: 'negative' },
  ];
  return randomChoice(comments);
}

export function getLiveResponseOptions(type) {
  const map = {
    positive: [{ text: '❤️ Thank you!', effect: 'good' }, { text: "You're amazing!", effect: 'great' }, { text: '🙏 Appreciate it!', effect: 'good' }],
    question: [{ text: 'Great question!', effect: 'great' }, { text: "I'll cover that next!", effect: 'good' }, { text: 'Check my bio!', effect: 'neutral' }],
    negative: [{ text: 'Thanks for feedback!', effect: 'great' }, { text: "Can't please everyone", effect: 'neutral' }, { text: 'Then leave?', effect: 'bad' }],
    troll: [{ text: 'Moving on...', effect: 'good' }, { text: '😂 Good one', effect: 'neutral' }, { text: 'Block & report', effect: 'good' }],
    gift: [{ text: '🙏 THANK YOU!', effect: 'great' }, { text: "You're the best!", effect: 'good' }],
    supergift: [{ text: '😱 NO WAY! Thanks!!', effect: 'great' }, { text: '🙏🙏🙏 Incredible!', effect: 'great' }],
  };
  return map[type] || map.positive;
}

// ==================== SHOP ITEMS ====================
export const shopItems = {
  phone: [
    { level: 1, name: 'Basic Phone', price: 0, qualityBonus: 0 },
    { level: 2, name: 'Mid-Range Phone', price: 800, qualityBonus: 5 },
    { level: 3, name: 'Flagship Phone', price: 1500, qualityBonus: 12 },
    { level: 4, name: 'Pro Max Ultra', price: 3000, qualityBonus: 20 },
  ],
  camera: [
    { level: 0, name: 'None', price: 0, qualityBonus: 0 },
    { level: 1, name: 'Compact Camera', price: 600, qualityBonus: 8 },
    { level: 2, name: 'Mirrorless', price: 2000, qualityBonus: 18 },
    { level: 3, name: 'Pro DSLR', price: 5000, qualityBonus: 30 },
  ],
  lighting: [
    { level: 0, name: 'None', price: 0, qualityBonus: 0 },
    { level: 1, name: 'Ring Light', price: 50, qualityBonus: 3 },
    { level: 2, name: 'Pro Ring Light', price: 200, qualityBonus: 7 },
    { level: 3, name: 'Studio Kit', price: 800, qualityBonus: 15 },
  ],
  backdrop: [
    { level: 0, name: 'None', price: 0, qualityBonus: 0 },
    { level: 1, name: 'Plain Backdrop', price: 30, qualityBonus: 2 },
    { level: 2, name: 'Aesthetic Setup', price: 500, qualityBonus: 8 },
    { level: 3, name: 'Pro Studio', price: 2000, qualityBonus: 18 },
  ],
};

// ==================== NOTIFICATION GENERATION ====================
export function generateNotification(state) {
  const pool = [
    { text: `Brand X commented on your post`, icon: '💬' },
    { text: `Crypto market is crashing!`, icon: '📉' },
    { text: `You gained ${randomInt(5, 50)} new followers!`, icon: '👥' },
    { text: `New trending hashtag: #${randomChoice(TREND_POOL)}`, icon: '🔥' },
    { text: `Your post is going viral!`, icon: '🚀' },
    { text: `New brand deal available!`, icon: '💼' },
    { text: `Stock market rallying today`, icon: '📈' },
  ];
  return randomChoice(pool);
}
