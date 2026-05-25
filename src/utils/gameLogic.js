/**
 * gameLogic.js
 * Core game algorithms: content scoring, follower growth, endorsement generation, trends
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

// ==================== CONTENT SCORING ====================
/**
 * Calculate post performance based on theme, caption style, gear, trends, and randomness
 */
export function calculatePostPerformance({
  theme,
  captionStyle,
  gear,
  currentTrends,
  followers,
  engagementRate,
  reputation,
}) {
  // Base quality from gear
  const gearBonus = Object.values(gear).reduce((sum, g) => sum + (g.qualityBonus || 0), 0);
  const baseQuality = 30 + gearBonus;

  // Theme trend bonus (if theme matches current trend)
  const trendBonus = currentTrends.includes(theme) ? randomInt(15, 30) : randomInt(-5, 10);

  // Caption style modifiers
  const captionModifiers = {
    'Clickbait': { likes: 1.3, engagement: 0.8, reputation: -2 },
    'Genuine': { likes: 1.0, engagement: 1.2, reputation: 3 },
    'Aesthetic': { likes: 1.1, engagement: 1.1, reputation: 1 },
    'Humorous': { likes: 1.4, engagement: 1.3, reputation: 2 },
  };

  const modifier = captionModifiers[captionStyle] || captionModifiers['Genuine'];

  // Calculate likes (percentage of followers that engage)
  const baseReach = followers * (engagementRate / 100);
  const qualityMultiplier = (baseQuality + trendBonus) / 100;
  const likes = Math.floor(baseReach * qualityMultiplier * modifier.likes * randomFloat(0.7, 1.4));
  const comments = Math.floor(likes * randomFloat(0.03, 0.12));

  // Follower growth calculation
  const viralChance = Math.random();
  let newFollowers = 0;
  if (viralChance > 0.95) {
    // Viral post! (5% chance)
    newFollowers = randomInt(followers * 0.1, followers * 0.3);
  } else if (viralChance > 0.7) {
    // Good performance (25% chance)
    newFollowers = randomInt(10, Math.floor(followers * 0.05));
  } else {
    // Normal performance
    newFollowers = randomInt(2, Math.floor(followers * 0.02));
  }

  // Can lose followers on bad posts
  let lostFollowers = 0;
  if (qualityMultiplier < 0.4 && Math.random() > 0.6) {
    lostFollowers = randomInt(1, Math.floor(followers * 0.01));
  }

  // Engagement rate shift
  const engagementDelta = (modifier.engagement - 1) * randomFloat(0.1, 0.5);

  return {
    likes,
    comments,
    newFollowers,
    lostFollowers,
    engagementDelta,
    reputationDelta: modifier.reputation,
    isViral: viralChance > 0.95,
    quality: Math.min(100, baseQuality + trendBonus),
  };
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
    { text: 'Where did you get that?', type: 'question' },
    { text: 'Fake followers lol', type: 'troll' },
    { text: 'Sending gifts! 🎁', type: 'gift' },
    { text: 'Can you promote my page?', type: 'spam' },
    { text: 'Tutorial please! 🙏', type: 'question' },
    { text: 'Youre the best!!!', type: 'positive' },
    { text: 'Mid content tbh', type: 'negative' },
    { text: '💰💰💰 Here\'s a super gift!', type: 'supergift' },
  ];
  return randomChoice(comments);
}

export function getLiveResponseOptions(commentType) {
  const responses = {
    positive: [
      { text: '❤️ Thank you!', effect: 'good' },
      { text: '🙏 Appreciate it!', effect: 'good' },
      { text: 'You\'re amazing!', effect: 'great' },
    ],
    question: [
      { text: 'Great question! Let me explain...', effect: 'great' },
      { text: 'I\'ll cover that next!', effect: 'good' },
      { text: 'Check my bio!', effect: 'neutral' },
    ],
    negative: [
      { text: 'Thanks for the feedback!', effect: 'great' },
      { text: '🤷 Can\'t please everyone', effect: 'neutral' },
      { text: 'Then leave?', effect: 'bad' },
    ],
    troll: [
      { text: 'Moving on...', effect: 'good' },
      { text: '😂 Good one', effect: 'neutral' },
      { text: 'Block & report', effect: 'good' },
    ],
    gift: [
      { text: '🙏 OMG THANK YOU!', effect: 'great' },
      { text: 'You\'re the best!', effect: 'good' },
      { text: 'Appreciate the support!', effect: 'good' },
    ],
    supergift: [
      { text: '😱 NO WAY! Thank you SO much!!', effect: 'great' },
      { text: '🙏🙏🙏 You\'re incredible!', effect: 'great' },
      { text: 'Wow! Thank you!', effect: 'good' },
    ],
    spam: [
      { text: 'Sorry, I don\'t do S4S', effect: 'good' },
      { text: 'Focus on your own content!', effect: 'neutral' },
      { text: 'DM me!', effect: 'bad' },
    ],
  };
  return responses[commentType] || responses.positive;
}

// ==================== ENDORSEMENT GENERATION ====================
const brands = [
  { name: 'FitTea Co.', type: 'Slimming Tea', risk: 'high', category: 'Health', icon: '🍵' },
  { name: 'TechGear Pro', type: 'Tech Accessories', risk: 'low', category: 'Tech', icon: '📱' },
  { name: 'GlowSkin', type: 'Skincare', risk: 'medium', category: 'Beauty', icon: '✨' },
  { name: 'QuickCash App', type: 'Finance App', risk: 'high', category: 'Finance', icon: '💸' },
  { name: 'StyleHub', type: 'Fashion Brand', risk: 'low', category: 'Fashion', icon: '👗' },
  { name: 'FoodieBox', type: 'Meal Kit', risk: 'low', category: 'Food', icon: '🍱' },
  { name: 'CryptoMoon', type: 'Crypto Exchange', risk: 'high', category: 'Finance', icon: '🌙' },
  { name: 'ZenFit', type: 'Fitness App', risk: 'low', category: 'Health', icon: '💪' },
  { name: 'LuxWatch', type: 'Luxury Watches', risk: 'low', category: 'Fashion', icon: '⌚' },
  { name: 'MagicDiet', type: 'Diet Pills', risk: 'high', category: 'Health', icon: '💊' },
  { name: 'EcoWear', type: 'Sustainable Fashion', risk: 'low', category: 'Fashion', icon: '🌿' },
  { name: 'GameZone', type: 'Mobile Game', risk: 'medium', category: 'Gaming', icon: '🎮' },
];

export function generateEndorsement(followers, tier) {
  const brand = randomChoice(brands);

  // Payout based on tier and risk
  const tierMultipliers = {
    Nano: 0.3,
    Micro: 1,
    Mid: 3,
    Macro: 8,
    Mega: 20,
  };

  const riskPayouts = {
    low: randomInt(500000, 2000000),
    medium: randomInt(1500000, 4000000),
    high: randomInt(3000000, 8000000),
  };

  const basePayout = riskPayouts[brand.risk];
  const payout = Math.floor(basePayout * (tierMultipliers[tier] || 1));

  // Requirements
  const requirements = randomChoice([
    '1 Feed Post + 1 Story',
    '2 Feed Posts + 3 Stories',
    '1 Feed Post',
    '1 Reel + 2 Stories',
    '3 Stories over 3 days',
  ]);

  // Risk effects
  const riskEffects = {
    low: { followerLoss: 0, engagementHit: 0, reputationHit: 0 },
    medium: { followerLoss: randomInt(0, 50), engagementHit: randomFloat(0, 0.3), reputationHit: randomInt(0, 5) },
    high: { followerLoss: randomInt(50, 500), engagementHit: randomFloat(0.3, 1.0), reputationHit: randomInt(5, 15) },
  };

  return {
    id: Date.now() + Math.random(),
    brand: brand.name,
    brandIcon: brand.icon,
    productType: brand.type,
    category: brand.category,
    risk: brand.risk,
    payout,
    requirements,
    riskEffects: riskEffects[brand.risk],
    deadline: randomInt(2, 7), // days to complete
    status: 'pending',
  };
}

// ==================== TREND ROTATION ====================
const allTrends = [
  'Fashion', 'Tech Review', 'OOTD', 'Mukbang', 'Comedy Skit',
  'Fitness', 'Travel', 'Skincare Routine', 'Unboxing', 'Day in My Life',
  'Room Tour', 'Get Ready With Me', 'Haul', 'Challenge', 'Storytime',
];

export function rotateTrends() {
  const shuffled = [...allTrends].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, 3);
}

// ==================== SHOP ITEMS ====================
export const shopItems = {
  phone: [
    { level: 1, name: 'Basic Phone', price: 0, qualityBonus: 0 },
    { level: 2, name: 'Mid-Range Phone', price: 3000000, qualityBonus: 5 },
    { level: 3, name: 'Flagship Phone', price: 8000000, qualityBonus: 12 },
    { level: 4, name: 'Pro Max Ultra', price: 18000000, qualityBonus: 20 },
  ],
  camera: [
    { level: 0, name: 'None', price: 0, qualityBonus: 0 },
    { level: 1, name: 'Compact Camera', price: 4000000, qualityBonus: 8 },
    { level: 2, name: 'Mirrorless Camera', price: 12000000, qualityBonus: 18 },
    { level: 3, name: 'Pro DSLR Setup', price: 25000000, qualityBonus: 30 },
  ],
  ringLight: [
    { level: 0, name: 'None', price: 0, qualityBonus: 0 },
    { level: 1, name: 'Small Ring Light', price: 200000, qualityBonus: 3 },
    { level: 2, name: 'Pro Ring Light', price: 800000, qualityBonus: 7 },
    { level: 3, name: 'Studio Lighting Kit', price: 3000000, qualityBonus: 15 },
  ],
  backdrop: [
    { level: 0, name: 'None', price: 0, qualityBonus: 0 },
    { level: 1, name: 'Plain Backdrop', price: 150000, qualityBonus: 2 },
    { level: 2, name: 'Aesthetic Room Setup', price: 2000000, qualityBonus: 8 },
    { level: 3, name: 'Professional Studio', price: 10000000, qualityBonus: 18 },
  ],
  outfit: [
    { level: 1, name: 'Casual Wear', price: 0, qualityBonus: 0 },
    { level: 2, name: 'Trendy Outfits', price: 1000000, qualityBonus: 4 },
    { level: 3, name: 'Designer Collection', price: 5000000, qualityBonus: 10 },
    { level: 4, name: 'Luxury Wardrobe', price: 15000000, qualityBonus: 18 },
  ],
};

// ==================== FORMAT HELPERS ====================
export function formatCurrency(amount) {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(num) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
  return num.toString();
}

export function formatTime(hour) {
  const h = hour % 24;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const displayH = h % 12 || 12;
  return `${displayH}:00 ${ampm}`;
}
