import React from 'react';
import { Coins, Gem, Radio, Plus, Wallet, Sparkles } from 'lucide-react';

interface TopNavbarProps {
  currentTab: 'feed' | 'live' | 'wallet' | 'creator';
  onTabChange: (tab: 'feed' | 'live' | 'wallet' | 'creator') => void;
  userCoins: number;
  userDiamonds: number;
  onOpenWallet: () => void;
  onOpenCreatorStudio: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onTabChange,
  userCoins,
  userDiamonds,
  onOpenWallet,
  onOpenCreatorStudio,
}) => {
  return (
    <header className="w-full max-w-md mx-auto bg-stone-950/80 backdrop-blur-xl border-b border-white/10 text-white px-3.5 py-2.5 flex items-center justify-between z-40 shadow-2xl">
      {/* Top Main Navigation Tabs */}
      <div className="flex items-center space-x-3.5 text-xs font-black tracking-wide">
        <button
          onClick={() => onTabChange('feed')}
          className={`pb-1 border-b-2 transition-all duration-200 ${
            currentTab === 'feed'
              ? 'border-rose-500 text-white font-black drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          Para Ti
        </button>

        <button
          onClick={() => onTabChange('live')}
          className={`pb-1 border-b-2 transition-all duration-200 flex items-center space-x-1.5 ${
            currentTab === 'live'
              ? 'border-rose-500 text-white font-black drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]'
              : 'border-transparent text-stone-400 hover:text-stone-200'
          }`}
        >
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
          <span>EN VIVO</span>
        </button>
      </div>

      {/* Wallet Coins & Diamonds Badges - Direct Monetization Shortcut */}
      <div className="flex items-center space-x-2">
        {/* Coins Button */}
        <button
          onClick={onOpenWallet}
          className="bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/35 text-yellow-400 text-[11px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-[0_0_12px_rgba(234,179,8,0.3)] backdrop-blur-md"
        >
          <Coins className="w-3.5 h-3.5 fill-yellow-400" />
          <span>{userCoins.toLocaleString()} 🪙</span>
          <Plus className="w-3 h-3 text-yellow-300" />
        </button>

        {/* Creator Diamonds Button */}
        <button
          onClick={onOpenCreatorStudio}
          className="bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/35 text-purple-300 text-[11px] font-black px-2.5 py-1 rounded-full flex items-center space-x-1 transition-all duration-200 active:scale-95 shadow-sm hover:shadow-[0_0_12px_rgba(168,85,247,0.3)] backdrop-blur-md"
        >
          <Gem className="w-3.5 h-3.5 fill-purple-400 text-purple-400" />
          <span>{(userDiamonds).toLocaleString()} 💎</span>
        </button>
      </div>
    </header>
  );
};
