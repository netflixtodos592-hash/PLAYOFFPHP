import React from 'react';
import { Home, Radio, Plus, Wallet, UserCheck } from 'lucide-react';

interface BottomNavbarProps {
  activeTab: 'feed' | 'live' | 'wallet' | 'creator';
  onTabChange: (tab: 'feed' | 'live' | 'wallet' | 'creator') => void;
  onOpenBroadcasterModal: () => void;
}

export const BottomNavbar: React.FC<BottomNavbarProps> = ({
  activeTab,
  onTabChange,
  onOpenBroadcasterModal,
}) => {
  return (
    <nav className="w-full max-w-md mx-auto bg-stone-950/85 backdrop-blur-xl border-t border-white/10 text-white px-3 py-2 flex items-center justify-around z-40 shadow-[0_-10px_25px_rgba(0,0,0,0.5)]">
      {/* Feed Button */}
      <button
        onClick={() => onTabChange('feed')}
        className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
          activeTab === 'feed'
            ? 'text-white font-black drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]'
            : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <Home className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-tight">Inicio</span>
      </button>

      {/* Live Stream View Button */}
      <button
        onClick={() => onTabChange('live')}
        className={`flex flex-col items-center space-y-1 relative transition-all duration-200 ${
          activeTab === 'live'
            ? 'text-rose-500 font-black drop-shadow-[0_0_10px_rgba(244,63,94,0.7)]'
            : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <Radio className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-tight">EN VIVO</span>
      </button>

      {/* Center "Transmitir en Vivo / Go Live +" Button */}
      <button
        onClick={onOpenBroadcasterModal}
        className="group relative -mt-3 p-3 bg-gradient-to-r from-rose-600 via-pink-600 to-amber-500 rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.5)] border-2 border-stone-950 transition-all duration-300 active:scale-95 hover:scale-105 hover:shadow-[0_0_25px_rgba(244,63,94,0.8)]"
      >
        <div className="flex items-center space-x-1 text-white font-black text-xs">
          <Plus className="w-5 h-5 text-white" />
        </div>
      </button>

      {/* Coins Wallet Button */}
      <button
        onClick={() => onTabChange('wallet')}
        className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
          activeTab === 'wallet'
            ? 'text-yellow-400 font-black drop-shadow-[0_0_8px_rgba(234,179,8,0.6)]'
            : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <Wallet className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-tight">Monedas</span>
      </button>

      {/* Creator Studio Monetization Button */}
      <button
        onClick={() => onTabChange('creator')}
        className={`flex flex-col items-center space-y-1 transition-all duration-200 ${
          activeTab === 'creator'
            ? 'text-purple-400 font-black drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]'
            : 'text-stone-400 hover:text-stone-200'
        }`}
      >
        <UserCheck className="w-5 h-5" />
        <span className="text-[10px] font-bold tracking-tight">Creador</span>
      </button>
    </nav>
  );
};
