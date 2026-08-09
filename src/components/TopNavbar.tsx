import React, { useState } from 'react';
import { Coins, Gem, Plus, Search, User, X } from 'lucide-react';
import { UserAccount } from './AuthModal';

interface TopNavbarProps {
  currentTab: 'feed' | 'live' | 'wallet' | 'creator';
  onTabChange: (tab: 'feed' | 'live' | 'wallet' | 'creator') => void;
  userCoins: number;
  userDiamonds: number;
  currentUser: UserAccount;
  onOpenWallet: () => void;
  onOpenCreatorStudio: () => void;
  onOpenAuth: () => void;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentTab,
  onTabChange,
  userCoins,
  userDiamonds,
  currentUser,
  onOpenWallet,
  onOpenCreatorStudio,
  onOpenAuth,
  searchQuery = '',
  onSearchChange,
}) => {
  const [isSearching, setIsSearching] = useState(false);

  return (
    <header className="w-full max-w-md mx-auto bg-stone-950/80 backdrop-blur-xl border-b border-white/10 text-white px-3.5 py-2.5 flex items-center justify-between z-40 shadow-2xl">
      {/* Top Main Navigation Tabs or Search Bar */}
      {isSearching ? (
        <div className="flex-1 flex items-center space-x-2 mr-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              autoFocus
              value={searchQuery}
              onChange={(e) => onSearchChange?.(e.target.value)}
              placeholder="Buscar creador o perfil..."
              className="w-full bg-stone-900 border border-rose-500/50 rounded-full pl-8 pr-3 py-1.5 text-xs text-white focus:outline-none"
            />
          </div>
          <button
            onClick={() => {
              setIsSearching(false);
              onSearchChange?.('');
            }}
            className="p-1 text-stone-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <div className="flex items-center space-x-3 text-xs font-black tracking-wide">
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

          <button
            onClick={() => setIsSearching(true)}
            className="p-1 text-stone-400 hover:text-rose-400 transition-colors"
            title="Buscar creador por perfil"
          >
            <Search className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Wallet Coins, Diamonds & Email Auth Account Button */}
      <div className="flex items-center space-x-1.5">
        {/* Coins Button */}
        <button
          onClick={onOpenWallet}
          className="bg-yellow-500/15 hover:bg-yellow-500/25 border border-yellow-500/35 text-yellow-400 text-[10px] font-black px-2 py-1 rounded-full flex items-center space-x-1 transition-all duration-200 active:scale-95 shadow-sm backdrop-blur-md"
        >
          <Coins className="w-3 h-3 fill-yellow-400" />
          <span>{userCoins.toLocaleString()}</span>
          <Plus className="w-2.5 h-2.5 text-yellow-300" />
        </button>

        {/* Creator Diamonds Button */}
        <button
          onClick={onOpenCreatorStudio}
          className="bg-purple-500/15 hover:bg-purple-500/25 border border-purple-500/35 text-purple-300 text-[10px] font-black px-2 py-1 rounded-full flex items-center space-x-1 transition-all duration-200 active:scale-95 shadow-sm backdrop-blur-md"
        >
          <Gem className="w-3 h-3 fill-purple-400 text-purple-400" />
          <span>{userDiamonds.toLocaleString()}</span>
        </button>

        {/* Account / Correo Login Button */}
        <button
          onClick={onOpenAuth}
          className="p-1 rounded-full bg-stone-900 border border-white/20 hover:border-rose-500/80 transition-all active:scale-95 flex items-center space-x-1 text-[10px] font-bold text-stone-200"
          title={currentUser.email ? `Cuenta: ${currentUser.email}` : 'Entrar por correo'}
        >
          {currentUser.avatar ? (
            <img src={currentUser.avatar} alt="Perfil" className="w-5 h-5 rounded-full object-cover" />
          ) : (
            <User className="w-4 h-4 text-rose-400" />
          )}
        </button>
      </div>
    </header>
  );
};

