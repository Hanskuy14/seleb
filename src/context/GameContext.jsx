/**
 * GameContext.jsx
 * Global state management for the Selebgram Simulator.
 * Manages: Followers, Cash, Engagement Rate, Reputation, Time, Transactions, Posts, Messages
 */
import { createContext, useContext, useReducer, useCallback } from 'react';

// ==================== INITIAL STATE ====================
const initialState = {
  // Player Stats
  followers: 247,
  cash: 500000, // IDR (Indonesian Rupiah)
  engagementRate: 4.2, // percentage
  reputation: 70, // 0-100
  energy: 100, // 0-100

  // Time System
  day: 1,
  hour: 8,
  totalDaysPlayed: 0,

  // Profile
  username: 'player_official',
  bio: '✨ Living my best life | Content Creator',
  avatar: '👤',
  tier: 'Nano', // Nano < 1k, Micro 1k-10k, Mid 10k-50k, Macro 50k-500k, Mega 500k+

  // Posts & Content
  posts: [],
  stories: [],

  // Financial
  transactions: [],
  monthlyExpenses: {
    rent: 2000000,
    internet: 500000,
    food: 1500000,
  },

  // Equipment/Gear
  gear: {
    phone: { level: 1, name: 'Basic Phone', qualityBonus: 0 },
    camera: { level: 0, name: 'None', qualityBonus: 0 },
    ringLight: { level: 0, name: 'None', qualityBonus: 0 },
    backdrop: { level: 0, name: 'None', qualityBonus: 0 },
    outfit: { level: 1, name: 'Casual Wear', qualityBonus: 0 },
  },

  // Messages/Endorsements
  messages: [],
  activeDeals: [],
  completedDeals: [],

  // Trending Topics
  currentTrends: ['Fashion', 'Tech Review', 'OOTD'],

  // Notifications
  notifications: {
    instagram: 0,
    messages: 0,
    bank: 0,
    shop: 0,
  },

  // Game State
  currentApp: null, // null = home screen
  isLiveStreaming: false,
  gameOver: false,
};

// ==================== ACTION TYPES ====================
const ACTIONS = {
  OPEN_APP: 'OPEN_APP',
  CLOSE_APP: 'CLOSE_APP',
  CREATE_POST: 'CREATE_POST',
  ADD_FOLLOWERS: 'ADD_FOLLOWERS',
  REMOVE_FOLLOWERS: 'REMOVE_FOLLOWERS',
  UPDATE_CASH: 'UPDATE_CASH',
  ADD_TRANSACTION: 'ADD_TRANSACTION',
  UPDATE_ENGAGEMENT: 'UPDATE_ENGAGEMENT',
  UPDATE_REPUTATION: 'UPDATE_REPUTATION',
  ADVANCE_TIME: 'ADVANCE_TIME',
  BUY_GEAR: 'BUY_GEAR',
  RECEIVE_MESSAGE: 'RECEIVE_MESSAGE',
  ACCEPT_DEAL: 'ACCEPT_DEAL',
  COMPLETE_DEAL: 'COMPLETE_DEAL',
  REJECT_DEAL: 'REJECT_DEAL',
  START_LIVE: 'START_LIVE',
  END_LIVE: 'END_LIVE',
  UPDATE_ENERGY: 'UPDATE_ENERGY',
  PAY_BILLS: 'PAY_BILLS',
  BOOST_POST: 'BOOST_POST',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  UPDATE_TRENDS: 'UPDATE_TRENDS',
  SET_TIER: 'SET_TIER',
};

// ==================== HELPER: Calculate Tier ====================
function calculateTier(followers) {
  if (followers >= 500000) return 'Mega';
  if (followers >= 50000) return 'Macro';
  if (followers >= 10000) return 'Mid';
  if (followers >= 1000) return 'Micro';
  return 'Nano';
}

// ==================== REDUCER ====================
function gameReducer(state, action) {
  switch (action.type) {
    case ACTIONS.OPEN_APP:
      return { ...state, currentApp: action.payload };

    case ACTIONS.CLOSE_APP:
      return { ...state, currentApp: null };

    case ACTIONS.CREATE_POST: {
      const newPost = action.payload;
      return {
        ...state,
        posts: [newPost, ...state.posts],
        energy: Math.max(0, state.energy - 15),
      };
    }

    case ACTIONS.ADD_FOLLOWERS: {
      const newFollowers = state.followers + action.payload;
      return {
        ...state,
        followers: newFollowers,
        tier: calculateTier(newFollowers),
      };
    }

    case ACTIONS.REMOVE_FOLLOWERS: {
      const newFollowers = Math.max(0, state.followers - action.payload);
      return {
        ...state,
        followers: newFollowers,
        tier: calculateTier(newFollowers),
      };
    }

    case ACTIONS.UPDATE_CASH:
      return { ...state, cash: state.cash + action.payload };

    case ACTIONS.ADD_TRANSACTION:
      return {
        ...state,
        transactions: [action.payload, ...state.transactions],
      };

    case ACTIONS.UPDATE_ENGAGEMENT:
      return {
        ...state,
        engagementRate: Math.max(0, Math.min(15, action.payload)),
      };

    case ACTIONS.UPDATE_REPUTATION:
      return {
        ...state,
        reputation: Math.max(0, Math.min(100, state.reputation + action.payload)),
      };

    case ACTIONS.ADVANCE_TIME: {
      const newHour = state.hour + action.payload;
      const daysAdvanced = Math.floor(newHour / 24);
      return {
        ...state,
        hour: newHour % 24,
        day: state.day + daysAdvanced,
        totalDaysPlayed: state.totalDaysPlayed + daysAdvanced,
        energy: daysAdvanced > 0 ? Math.min(100, state.energy + 40) : state.energy,
      };
    }

    case ACTIONS.BUY_GEAR:
      return {
        ...state,
        gear: {
          ...state.gear,
          [action.payload.type]: action.payload.item,
        },
      };

    case ACTIONS.RECEIVE_MESSAGE:
      return {
        ...state,
        messages: [action.payload, ...state.messages],
        notifications: {
          ...state.notifications,
          messages: state.notifications.messages + 1,
        },
      };

    case ACTIONS.ACCEPT_DEAL:
      return {
        ...state,
        activeDeals: [...state.activeDeals, action.payload],
        messages: state.messages.map((m) =>
          m.id === action.payload.messageId ? { ...m, status: 'accepted' } : m
        ),
      };

    case ACTIONS.COMPLETE_DEAL: {
      const deal = action.payload;
      return {
        ...state,
        activeDeals: state.activeDeals.filter((d) => d.id !== deal.id),
        completedDeals: [...state.completedDeals, deal],
      };
    }

    case ACTIONS.REJECT_DEAL:
      return {
        ...state,
        messages: state.messages.map((m) =>
          m.id === action.payload ? { ...m, status: 'rejected' } : m
        ),
      };

    case ACTIONS.START_LIVE:
      return { ...state, isLiveStreaming: true };

    case ACTIONS.END_LIVE:
      return { ...state, isLiveStreaming: false };

    case ACTIONS.UPDATE_ENERGY:
      return { ...state, energy: Math.max(0, Math.min(100, action.payload)) };

    case ACTIONS.PAY_BILLS: {
      const totalBills = Object.values(state.monthlyExpenses).reduce((a, b) => a + b, 0);
      return { ...state, cash: state.cash - totalBills };
    }

    case ACTIONS.BOOST_POST:
      return state;

    case ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: { ...state.notifications, ...action.payload },
      };

    case ACTIONS.UPDATE_TRENDS:
      return { ...state, currentTrends: action.payload };

    case ACTIONS.SET_TIER:
      return { ...state, tier: action.payload };

    default:
      return state;
  }
}

// ==================== CONTEXT ====================
const GameContext = createContext(null);

export function GameProvider({ children }) {
  const [state, dispatch] = useReducer(gameReducer, initialState);

  // Action creators
  const openApp = useCallback((app) => dispatch({ type: ACTIONS.OPEN_APP, payload: app }), []);
  const closeApp = useCallback(() => dispatch({ type: ACTIONS.CLOSE_APP }), []);

  const createPost = useCallback((post) => dispatch({ type: ACTIONS.CREATE_POST, payload: post }), []);
  const addFollowers = useCallback((count) => dispatch({ type: ACTIONS.ADD_FOLLOWERS, payload: count }), []);
  const removeFollowers = useCallback((count) => dispatch({ type: ACTIONS.REMOVE_FOLLOWERS, payload: count }), []);

  const updateCash = useCallback((amount) => dispatch({ type: ACTIONS.UPDATE_CASH, payload: amount }), []);
  const addTransaction = useCallback((tx) => dispatch({ type: ACTIONS.ADD_TRANSACTION, payload: tx }), []);
  const updateEngagement = useCallback((rate) => dispatch({ type: ACTIONS.UPDATE_ENGAGEMENT, payload: rate }), []);
  const updateReputation = useCallback((delta) => dispatch({ type: ACTIONS.UPDATE_REPUTATION, payload: delta }), []);

  const advanceTime = useCallback((hours) => dispatch({ type: ACTIONS.ADVANCE_TIME, payload: hours }), []);
  const buyGear = useCallback((type, item) => dispatch({ type: ACTIONS.BUY_GEAR, payload: { type, item } }), []);

  const receiveMessage = useCallback((msg) => dispatch({ type: ACTIONS.RECEIVE_MESSAGE, payload: msg }), []);
  const acceptDeal = useCallback((deal) => dispatch({ type: ACTIONS.ACCEPT_DEAL, payload: deal }), []);
  const completeDeal = useCallback((deal) => dispatch({ type: ACTIONS.COMPLETE_DEAL, payload: deal }), []);
  const rejectDeal = useCallback((id) => dispatch({ type: ACTIONS.REJECT_DEAL, payload: id }), []);

  const startLive = useCallback(() => dispatch({ type: ACTIONS.START_LIVE }), []);
  const endLive = useCallback(() => dispatch({ type: ACTIONS.END_LIVE }), []);
  const updateEnergy = useCallback((val) => dispatch({ type: ACTIONS.UPDATE_ENERGY, payload: val }), []);
  const payBills = useCallback(() => dispatch({ type: ACTIONS.PAY_BILLS }), []);
  const setNotifications = useCallback((n) => dispatch({ type: ACTIONS.SET_NOTIFICATIONS, payload: n }), []);
  const updateTrends = useCallback((trends) => dispatch({ type: ACTIONS.UPDATE_TRENDS, payload: trends }), []);

  const value = {
    state,
    dispatch,
    openApp,
    closeApp,
    createPost,
    addFollowers,
    removeFollowers,
    updateCash,
    addTransaction,
    updateEngagement,
    updateReputation,
    advanceTime,
    buyGear,
    receiveMessage,
    acceptDeal,
    completeDeal,
    rejectDeal,
    startLive,
    endLive,
    updateEnergy,
    payBills,
    setNotifications,
    updateTrends,
  };

  return <GameContext.Provider value={value}>{children}</GameContext.Provider>;
}

export function useGame() {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
}

export { ACTIONS };
export default GameContext;
