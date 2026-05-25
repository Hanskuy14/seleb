/**
 * GameContext.jsx
 * Global state management for Influencer & Investor Simulator
 * Manages: Game phase, Character, Day/Energy, Cash, Platforms, Investments, Niche, Reputation, News, Notifications
 */
import { createContext, useContext, useReducer, useCallback } from 'react';
import { updateMarketPrices, generateDailyNews, generateTrendingHashtags, calculateOvernightGrowth, calculateTax, checkCancelEvent, checkNicheUnlock, STOCKS, CRYPTO, MUTUAL_FUNDS } from '../utils/gameLogic';

// ==================== INITIAL STATE ====================
function getInitialMarketPrices() {
  const prices = {};
  [...STOCKS, ...CRYPTO, ...MUTUAL_FUNDS].forEach(a => { prices[a.id] = a.basePrice; });
  return prices;
}


const initialState = {
  // Game Phase: 'menu' | 'character_creation' | 'playing'
  gamePhase: 'menu',

  // Character Info
  playerName: '',
  username: '',
  startingCapital: 100,
  avatar: '👤',

  // Core Resources
  cash: 100,
  energy: 100,
  day: 1,
  hour: 8,
  reputation: 70,

  // Multi-Platform Stats
  platforms: {
    instagram: { followers: 50, engagementRate: 4.0, posts: [], totalLikes: 0 },
    tiktok: { followers: 20, engagementRate: 5.0, posts: [], totalViews: 0 },
    youtube: { followers: 5, engagementRate: 3.0, videos: [], totalViews: 0, adRevenue: 0 },
    linkedin: { followers: 30, engagementRate: 6.0, posts: [], connections: 0 },
  },

  // Niche System
  contentHistory: [], // last N themes posted
  unlockedNiche: null, // null or theme id
  nicheStreak: 0,

  // Investments
  portfolio: {}, // { assetId: { shares: N, avgBuyPrice: N } }
  marketPrices: getInitialMarketPrices(),
  priceHistory: {}, // { assetId: [price1, price2, ...] }

  // Financial
  transactions: [],
  totalEarnings: 0,
  monthlyExpenses: 800, // rent + food + internet
  taxesPaid: 0,
  lastTaxDay: 0,

  // Equipment/Gear
  gear: {
    phone: { level: 1, name: 'Basic Phone', qualityBonus: 0 },
    camera: { level: 0, name: 'None', qualityBonus: 0 },
    lighting: { level: 0, name: 'None', qualityBonus: 0 },
    backdrop: { level: 0, name: 'None', qualityBonus: 0 },
  },

  // Messages/Endorsements
  messages: [],
  activeDeals: [],
  completedDeals: [],
  highRiskDealsCount: 0,

  // News & Trends
  dailyNews: [],
  trendingHashtags: [],

  // Notifications
  notifications: [],
  unreadNotifications: 0,

  // Navigation
  currentApp: null,

  // Cancel Culture
  isCanceled: false,
  cancelEvent: null,
};


// ==================== ACTION TYPES ====================
const A = {
  SET_PHASE: 'SET_PHASE',
  CREATE_CHARACTER: 'CREATE_CHARACTER',
  OPEN_APP: 'OPEN_APP',
  CLOSE_APP: 'CLOSE_APP',
  CREATE_POST: 'CREATE_POST',
  ADD_FOLLOWERS: 'ADD_FOLLOWERS',
  REMOVE_FOLLOWERS: 'REMOVE_FOLLOWERS',
  UPDATE_CASH: 'UPDATE_CASH',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_ENGAGEMENT: 'UPDATE_ENGAGEMENT',
  UPDATE_REPUTATION: 'UPDATE_REPUTATION',
  USE_ENERGY: 'USE_ENERGY',
  SLEEP: 'SLEEP',
  BUY_GEAR: 'BUY_GEAR',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  ACCEPT_DEAL: 'ACCEPT_DEAL',
  REJECT_DEAL: 'REJECT_DEAL',
  COMPLETE_DEAL: 'COMPLETE_DEAL',
  BUY_ASSET: 'BUY_ASSET',
  SELL_ASSET: 'SELL_ASSET',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  CLEAR_NOTIFICATIONS: 'CLEAR_NOTIFICATIONS',
  SET_CANCEL_EVENT: 'SET_CANCEL_EVENT',
  DISMISS_CANCEL: 'DISMISS_CANCEL',
  LOAD_GAME: 'LOAD_GAME',
};


// ==================== REDUCER ====================
function gameReducer(state, action) {
  switch (action.type) {
    case A.SET_PHASE:
      return { ...state, gamePhase: action.payload };

    case A.CREATE_CHARACTER: {
      const { playerName, username, startingCapital } = action.payload;
      return {
        ...state,
        gamePhase: 'playing',
        playerName,
        username,
        startingCapital,
        cash: startingCapital,
        dailyNews: generateDailyNews(),
        trendingHashtags: generateTrendingHashtags(),
      };
    }

    case A.OPEN_APP:
      return { ...state, currentApp: action.payload };
    case A.CLOSE_APP:
      return { ...state, currentApp: null };

    case A.CREATE_POST: {
      const { platform, post, newFollowers, lostFollowers, engagementDelta, reputationDelta, theme } = action.payload;
      const plat = { ...state.platforms[platform] };
      const postsKey = platform === 'youtube' ? 'videos' : 'posts';
      plat[postsKey] = [post, ...(plat[postsKey] || [])];
      plat.followers = Math.max(0, plat.followers + newFollowers - lostFollowers);
      plat.engagementRate = Math.max(0.5, Math.min(15, plat.engagementRate + engagementDelta));
      if (platform === 'youtube') plat.totalViews = (plat.totalViews || 0) + (post.views || 0);
      else plat.totalLikes = (plat.totalLikes || 0) + (post.likes || 0);

      const contentHistory = [...state.contentHistory, theme].slice(-10);
      const nicheCheck = checkNicheUnlock(contentHistory);

      return {
        ...state,
        platforms: { ...state.platforms, [platform]: plat },
        energy: Math.max(0, state.energy - (action.payload.energyCost || 15)),
        reputation: Math.max(0, Math.min(100, state.reputation + reputationDelta)),
        contentHistory,
        unlockedNiche: nicheCheck || state.unlockedNiche,
      };
    }


    case A.ADD_FOLLOWERS: {
      const { platform, count } = action.payload;
      const plat = { ...state.platforms[platform] };
      plat.followers += count;
      return { ...state, platforms: { ...state.platforms, [platform]: plat } };
    }

    case A.REMOVE_FOLLOWERS: {
      const { platform, count } = action.payload;
      const plat = { ...state.platforms[platform] };
      plat.followers = Math.max(0, plat.followers - count);
      return { ...state, platforms: { ...state.platforms, [platform]: plat } };
    }

    case A.UPDATE_CASH:
      return { ...state, cash: state.cash + action.payload, totalEarnings: action.payload > 0 ? state.totalEarnings + action.payload : state.totalEarnings };

    case A.ADD_TRANSACTION:
      return { ...state, transactions: [action.payload, ...state.transactions].slice(0, 50) };

    case A.UPDATE_ENGAGEMENT: {
      const { platform, rate } = action.payload;
      const plat = { ...state.platforms[platform] };
      plat.engagementRate = Math.max(0.5, Math.min(15, rate));
      return { ...state, platforms: { ...state.platforms, [platform]: plat } };
    }

    case A.UPDATE_REPUTATION:
      return { ...state, reputation: Math.max(0, Math.min(100, state.reputation + action.payload)) };

    case A.USE_ENERGY:
      return { ...state, energy: Math.max(0, state.energy - action.payload) };


    case A.SLEEP: {
      // End day: reset energy, advance day, deduct expenses, update markets, generate news
      const newDay = state.day + 1;
      const newNews = generateDailyNews();
      const newTrends = generateTrendingHashtags();
      const newPrices = updateMarketPrices(state.marketPrices, newNews);

      // Update price history
      const newHistory = { ...state.priceHistory };
      Object.keys(newPrices).forEach(id => {
        newHistory[id] = [...(newHistory[id] || []), newPrices[id]].slice(-30);
      });

      // Monthly expenses (every 30 days)
      let expenseDeduction = 0;
      if (newDay % 30 === 0) expenseDeduction = state.monthlyExpenses;

      // Tax (every 90 days)
      let taxDeduction = 0;
      if (newDay % 90 === 0 && newDay !== state.lastTaxDay) {
        taxDeduction = calculateTax(state.totalEarnings - state.taxesPaid);
      }

      // Overnight growth
      const growth = calculateOvernightGrowth(state);
      const updatedPlatforms = { ...state.platforms };
      Object.entries(growth).forEach(([key, g]) => {
        updatedPlatforms[key] = {
          ...updatedPlatforms[key],
          followers: updatedPlatforms[key].followers + g.followerGrowth,
          engagementRate: Math.max(0.5, updatedPlatforms[key].engagementRate + g.erChange),
        };
      });

      // Mutual fund yield
      const updatedPortfolio = { ...state.portfolio };
      let fundYield = 0;
      MUTUAL_FUNDS.forEach(fund => {
        if (updatedPortfolio[fund.id]) {
          const yieldAmt = updatedPortfolio[fund.id].shares * newPrices[fund.id] * fund.dailyYield;
          fundYield += yieldAmt;
        }
      });

      // Cancel culture check
      const cancelCheck = checkCancelEvent(state.reputation, state.highRiskDealsCount);

      let cancelState = {};
      if (cancelCheck.triggered && !state.isCanceled) {
        // Apply cancel effects
        Object.keys(updatedPlatforms).forEach(key => {
          updatedPlatforms[key] = {
            ...updatedPlatforms[key],
            followers: Math.floor(updatedPlatforms[key].followers * (1 - cancelCheck.followerLoss)),
          };
        });
        cancelState = { isCanceled: true, cancelEvent: cancelCheck, reputation: Math.max(0, state.reputation - cancelCheck.reputationHit) };
      }

      return {
        ...state,
        day: newDay,
        energy: 100,
        hour: 8,
        dailyNews: newNews,
        trendingHashtags: newTrends,
        marketPrices: newPrices,
        priceHistory: newHistory,
        cash: state.cash - expenseDeduction - taxDeduction + fundYield,
        taxesPaid: state.taxesPaid + taxDeduction,
        lastTaxDay: taxDeduction > 0 ? newDay : state.lastTaxDay,
        platforms: updatedPlatforms,
        ...cancelState,
      };
    }


    case A.BUY_GEAR: {
      const { category, item } = action.payload;
      return { ...state, gear: { ...state.gear, [category]: item }, cash: state.cash - item.price };
    }

    case A.RECEIVE_MESSAGE:
      return { ...state, messages: [action.payload, ...state.messages], unreadNotifications: state.unreadNotifications + 1 };

    case A.ACCEPT_DEAL: {
      const deal = action.payload;
      const riskInc = deal.risk === 'high' ? 1 : 0;
      return {
        ...state,
        activeDeals: [...state.activeDeals, deal],
        messages: state.messages.map(m => m.id === deal.messageId ? { ...m, status: 'accepted' } : m),
        highRiskDealsCount: state.highRiskDealsCount + riskInc,
      };
    }

    case A.REJECT_DEAL:
      return { ...state, messages: state.messages.map(m => m.id === action.payload ? { ...m, status: 'rejected' } : m) };

    case A.COMPLETE_DEAL: {
      const deal = action.payload;
      return { ...state, activeDeals: state.activeDeals.filter(d => d.id !== deal.id), completedDeals: [...state.completedDeals, deal] };
    }

    case A.BUY_ASSET: {
      const { assetId, shares, price } = action.payload;
      const totalCost = shares * price;
      if (totalCost > state.cash) return state;
      const existing = state.portfolio[assetId] || { shares: 0, avgBuyPrice: 0 };
      const totalShares = existing.shares + shares;
      const avgPrice = (existing.shares * existing.avgBuyPrice + totalCost) / totalShares;
      return {
        ...state,
        cash: state.cash - totalCost,
        portfolio: { ...state.portfolio, [assetId]: { shares: totalShares, avgBuyPrice: avgPrice } },
      };
    }

    case A.SELL_ASSET: {
      const { assetId, shares, price } = action.payload;
      const existing = state.portfolio[assetId];
      if (!existing || existing.shares < shares) return state;
      const revenue = shares * price;
      const remaining = existing.shares - shares;
      const newPortfolio = { ...state.portfolio };
      if (remaining <= 0) delete newPortfolio[assetId];
      else newPortfolio[assetId] = { ...existing, shares: remaining };
      return { ...state, cash: state.cash + revenue, portfolio: newPortfolio, totalEarnings: state.totalEarnings + revenue };
    }

    case A.ADD_NOTIFICATION:
      return { ...state, notifications: [action.payload, ...state.notifications].slice(0, 20), unreadNotifications: state.unreadNotifications + 1 };

    case A.CLEAR_NOTIFICATIONS:
      return { ...state, unreadNotifications: 0 };

    case A.SET_CANCEL_EVENT:
      return { ...state, isCanceled: true, cancelEvent: action.payload };

    case A.DISMISS_CANCEL:
      return { ...state, isCanceled: false, cancelEvent: null };

    case A.LOAD_GAME:
      return { ...action.payload, gamePhase: 'playing' };

    default:
      return state;
  }
}


// ==================== CONTEXT & PROVIDER ====================
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  const setPhase = useCallback((p) => dispatch({ type: A.SET_PHASE, payload: p }), []);
  const createCharacter = useCallback((data) => dispatch({ type: A.CREATE_CHARACTER, payload: data }), []);
  const openApp = useCallback((app) => dispatch({ type: A.OPEN_APP, payload: app }), []);
  const closeApp = useCallback(() => dispatch({ type: A.CLOSE_APP }), []);
  const createPost = useCallback((data) => dispatch({ type: A.CREATE_POST, payload: data }), []);
  const addFollowers = useCallback((platform, count) => dispatch({ type: A.ADD_FOLLOWERS, payload: { platform, count } }), []);
  const removeFollowers = useCallback((platform, count) => dispatch({ type: A.REMOVE_FOLLOWERS, payload: { platform, count } }), []);
  const updateCash = useCallback((amt) => dispatch({ type: A.UPDATE_CASH, payload: amt }), []);
  const addTransaction = useCallback((tx) => dispatch({ type: A.ADD_TRANSACTION, payload: tx }), []);
  const updateEngagement = useCallback((platform, rate) => dispatch({ type: A.UPDATE_ENGAGEMENT, payload: { platform, rate } }), []);
  const updateReputation = useCallback((delta) => dispatch({ type: A.UPDATE_REPUTATION, payload: delta }), []);
  const useEnergy = useCallback((amt) => dispatch({ type: A.USE_ENERGY, payload: amt }), []);
  const sleep = useCallback(() => dispatch({ type: A.SLEEP }), []);
  const buyGear = useCallback((category, item) => dispatch({ type: A.BUY_GEAR, payload: { category, item } }), []);
  const receiveMessage = useCallback((msg) => dispatch({ type: A.RECEIVE_MESSAGE, payload: msg }), []);
  const acceptDeal = useCallback((deal) => dispatch({ type: A.ACCEPT_DEAL, payload: deal }), []);
  const rejectDeal = useCallback((id) => dispatch({ type: A.REJECT_DEAL, payload: id }), []);
  const completeDeal = useCallback((deal) => dispatch({ type: A.COMPLETE_DEAL, payload: deal }), []);
  const buyAsset = useCallback((assetId, shares, price) => dispatch({ type: A.BUY_ASSET, payload: { assetId, shares, price } }), []);
  const sellAsset = useCallback((assetId, shares, price) => dispatch({ type: A.SELL_ASSET, payload: { assetId, shares, price } }), []);
  const addNotification = useCallback((n) => dispatch({ type: A.ADD_NOTIFICATION, payload: n }), []);
  const clearNotifications = useCallback(() => dispatch({ type: A.CLEAR_NOTIFICATIONS }), []);
  const dismissCancel = useCallback(() => dispatch({ type: A.DISMISS_CANCEL }), []);
  const loadGame = useCallback((data) => dispatch({ type: A.LOAD_GAME, payload: data }), []);

  const getTotalFollowers = useCallback(() => {
    return Object.values(state.platforms).reduce((s, p) => s + p.followers, 0);
  }, [state.platforms]);

  const getPortfolioValue = useCallback(() => {
    return Object.entries(state.portfolio).reduce((sum, [id, pos]) => {
      return sum + pos.shares * (state.marketPrices[id] || 0);
    }, 0);
  }, [state.portfolio, state.marketPrices]);

  const value = {
    state, dispatch, setPhase, createCharacter, openApp, closeApp, createPost,
    addFollowers, removeFollowers, updateCash, addTransaction, updateEngagement,
    updateReputation, useEnergy, sleep, buyGear, receiveMessage, acceptDeal,
    rejectDeal, completeDeal, buyAsset, sellAsset, addNotification,
    clearNotifications, dismissCancel, loadGame, getTotalFollowers, getPortfolioValue,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error('useGame must be used within GameProvider');
  return ctx;
}
export default GameContext;
