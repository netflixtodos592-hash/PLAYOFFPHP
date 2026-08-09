export type GiftCategory = 'popular' | 'exclusive' | 'luxury' | 'legendary';

export type GiftAnimationType = 'bounce' | 'sparkle' | 'rocket' | 'ferrari' | 'lion' | 'galaxy' | 'castle' | 'rose_shower';

export interface GiftItem {
  id: string;
  name: string;
  spanishName: string;
  icon: string;
  coinPrice: number;
  diamondValue: number; // usually 50% of coin price in USD cents/points
  category: GiftCategory;
  animationType: GiftAnimationType;
  description: string;
}

export interface UserWallet {
  coins: number;
  diamonds: number; // creator earnings from received gifts
  totalCoinsSpent: number;
  totalDiamondsEarned: number;
  usdBalance: number; // derived from diamonds (e.g. 100 diamonds = $0.50 USD)
}

export interface LiveComment {
  id: string;
  userId: string;
  username: string;
  userAvatar: string;
  badge?: 'VIP' | 'Top Gifter' | 'Mod' | 'Subscriber' | 'Host';
  badgeLevel?: number;
  message: string;
  timestamp: string;
  giftEvent?: {
    giftName: string;
    giftIcon: string;
    quantity: number;
    totalCoins: number;
  };
}

export interface GiftEvent {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  recipientStreamerId: string;
  gift: GiftItem;
  quantity: number;
  totalCoins: number;
  timestamp: string;
}

export interface Streamer {
  id: string;
  username: string;
  displayName: string;
  avatar: string;
  bio: string;
  followers: number;
  isLive: boolean;
  category: 'Gaming' | 'Música' | 'Charla' | 'Arte & Belleza' | 'ASMR' | 'Cocina';
  streamTitle: string;
  viewerCount: number;
  diamondCount: number;
  streamBgGradient: string;
  videoPlaceholderUrl?: string;
  giftGoal?: {
    title: string;
    currentCoins: number;
    targetCoins: number;
    rewardGift: string;
  };
}

export interface PKBattleState {
  id: string;
  isActive: boolean;
  streamer1: Streamer;
  streamer2: Streamer;
  streamer1Points: number;
  streamer2Points: number;
  timeRemainingSec: number;
}

export interface WithdrawalRecord {
  id: string;
  amountDiamonds: number;
  amountUSD: number;
  paymentMethod: 'paypal' | 'bank_transfer' | 'mercadopago';
  accountDetails: string;
  status: 'completado' | 'pendiente' | 'procesando';
  date: string;
}

export interface TopGifter {
  id: string;
  name: string;
  avatar: string;
  level: number;
  totalGiftedCoins: number;
}
