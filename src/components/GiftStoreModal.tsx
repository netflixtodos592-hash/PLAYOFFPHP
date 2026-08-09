import React, { useState } from 'react';
import { GIFTS_CATALOG } from '../data/gifts';
import { GiftCategory, GiftItem } from '../types';
import { Coins, Plus, Send, Sparkles, Zap } from 'lucide-react';

interface GiftStoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  userCoins: number;
  onSendGift: (gift: GiftItem, quantity: number) => void;
  onOpenRechargeWallet: () => void;
}

export const GiftStoreModal: React.FC<GiftStoreModalProps> = ({
  isOpen,
  onClose,
  userCoins,
  onSendGift,
  onOpenRechargeWallet,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<GiftCategory>('popular');
  const [selectedGift, setSelectedGift] = useState<GiftItem>(GIFTS_CATALOG[0]);
  const [quantityMultiplier, setQuantityMultiplier] = useState<number>(1);
  const [isSending, setIsSending] = useState(false);

  if (!isOpen) return null;

  const filteredGifts = GIFTS_CATALOG.filter(g => g.category === selectedCategory);
  const totalCost = selectedGift ? selectedGift.coinPrice * quantityMultiplier : 0;
  const canAfford = userCoins >= totalCost;

  const handleSend = () => {
    if (!selectedGift || !canAfford || isSending) return;
    setIsSending(true);
    onSendGift(selectedGift, quantityMultiplier);
    setTimeout(() => {
      setIsSending(false);
    }, 300);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/75 backdrop-blur-md animate-fade-in">
      {/* Backdrop Click */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Drawer */}
      <div className="relative w-full max-w-md bg-stone-900/90 backdrop-blur-2xl border-t border-white/10 rounded-t-[32px] p-5 text-white shadow-[0_-15px_40px_rgba(0,0,0,0.8)] flex flex-col max-h-[85vh] overflow-hidden">
        {/* Top Header & Tabs */}
        <div className="flex items-center justify-between pb-3.5 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-yellow-500/20 rounded-xl border border-yellow-500/30">
              <Sparkles className="w-5 h-5 text-yellow-400" />
            </div>
            <h3 className="text-base font-black text-white tracking-wide">Regalos en Vivo</h3>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white text-xl font-bold p-1 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Category Tabs */}
        <div className="flex space-x-2 py-3 overflow-x-auto no-scrollbar border-b border-white/5">
          <button
            onClick={() => setSelectedCategory('popular')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'popular'
                ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800 border border-white/5'
            }`}
          >
            🔥 Populares
          </button>
          <button
            onClick={() => setSelectedCategory('exclusive')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'exclusive'
                ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800 border border-white/5'
            }`}
          >
            ✨ Exclusivos
          </button>
          <button
            onClick={() => setSelectedCategory('luxury')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'luxury'
                ? 'bg-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)]'
                : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800 border border-white/5'
            }`}
          >
            💎 Lujo
          </button>
          <button
            onClick={() => setSelectedCategory('legendary')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'legendary'
                ? 'bg-gradient-to-r from-amber-500 via-rose-500 to-purple-600 text-white shadow-[0_0_15px_rgba(234,179,8,0.5)]'
                : 'bg-stone-800/60 text-stone-300 hover:bg-stone-800 border border-white/5'
            }`}
          >
            👑 Legendarios
          </button>
        </div>

        {/* Gifts Grid */}
        <div className="grid grid-cols-4 gap-2.5 py-4 overflow-y-auto max-h-[42vh] pr-1">
          {filteredGifts.map(gift => {
            const isSelected = selectedGift?.id === gift.id;
            return (
              <button
                key={gift.id}
                onClick={() => setSelectedGift(gift)}
                className={`relative flex flex-col items-center justify-between p-2.5 rounded-2xl border transition-all duration-200 ${
                  isSelected
                    ? 'border-rose-500 bg-rose-950/50 shadow-[0_0_15px_rgba(244,63,94,0.4)] scale-105 ring-2 ring-rose-500/50'
                    : 'border-white/5 bg-stone-800/40 hover:bg-stone-800/80 hover:border-white/20'
                }`}
              >
                <div className="text-3xl my-1 drop-shadow-md">{gift.icon}</div>
                <div className="text-[11px] font-extrabold text-stone-200 line-clamp-1">
                  {gift.spanishName}
                </div>
                <div className="flex items-center space-x-1 mt-1 text-[11px] font-black text-yellow-400">
                  <Coins className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                  <span>{gift.coinPrice}</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Gift Description Banner */}
        {selectedGift && (
          <div className="bg-stone-800/60 backdrop-blur-md rounded-2xl p-2.5 mb-3 text-xs text-stone-300 flex items-center space-x-2 border border-white/10 shadow-inner">
            <Zap className="w-4 h-4 text-yellow-400 flex-shrink-0" />
            <span className="line-clamp-1 font-medium">{selectedGift.description}</span>
          </div>
        )}

        {/* Bottom Bar: Wallet Balance & Send Button */}
        <div className="pt-3 border-t border-white/10 flex items-center justify-between">
          {/* Wallet Balance Info */}
          <div className="flex items-center space-x-2">
            <div className="bg-stone-800/80 border border-white/10 rounded-full px-3 py-1.5 flex items-center space-x-1.5 shadow-sm">
              <Coins className="w-4 h-4 text-yellow-400 fill-yellow-400 animate-pulse" />
              <span className="text-xs font-black text-white">{userCoins}</span>
            </div>
            <button
              onClick={() => {
                onClose();
                onOpenRechargeWallet();
              }}
              className="bg-yellow-500 hover:bg-yellow-400 text-stone-950 font-black text-xs px-2.5 py-1.5 rounded-full flex items-center space-x-1 shadow-[0_0_10px_rgba(234,179,8,0.4)] transition-all active:scale-95"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Recargar</span>
            </button>
          </div>

          {/* Quantity Multiplier & Send */}
          <div className="flex items-center space-x-2">
            {/* Multiplier Selector */}
            <div className="flex items-center bg-stone-800/80 rounded-xl p-0.5 border border-white/10">
              {[1, 10, 99].map(num => (
                <button
                  key={num}
                  onClick={() => setQuantityMultiplier(num)}
                  className={`px-2 py-1 text-[11px] font-black rounded-lg transition-all ${
                    quantityMultiplier === num
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {num}x
                </button>
              ))}
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={!canAfford || isSending}
              className={`px-4 py-2.5 rounded-full font-black text-xs flex items-center space-x-1.5 shadow-lg transition-all duration-200 ${
                canAfford
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white shadow-[0_0_15px_rgba(244,63,94,0.5)] active:scale-95'
                  : 'bg-stone-800 text-stone-500 border border-white/5 cursor-not-allowed'
              }`}
            >
              <Send className="w-3.5 h-3.5" />
              <span>{canAfford ? `Enviar (${totalCost} 🪙)` : 'Sin Saldo'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
