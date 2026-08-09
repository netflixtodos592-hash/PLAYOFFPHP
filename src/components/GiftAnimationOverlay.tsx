import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { GiftEvent } from '../types';

interface GiftAnimationOverlayProps {
  giftEvent: GiftEvent | null;
  onAnimationEnd?: () => void;
}

export const GiftAnimationOverlay: React.FC<GiftAnimationOverlayProps> = ({ giftEvent, onAnimationEnd }) => {
  const [activeBanner, setActiveBanner] = useState<GiftEvent | null>(null);

  useEffect(() => {
    if (!giftEvent) return;

    setActiveBanner(giftEvent);

    const animType = giftEvent.gift.animationType;

    // Trigger canvas confetti / fireworks for high tier gifts
    if (animType === 'galaxy' || animType === 'lion' || animType === 'ferrari' || animType === 'castle') {
      confetti({
        particleCount: animType === 'lion' ? 120 : 70,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#ffd700', '#ff007f', '#00f0ff', '#ffffff', '#a855f7']
      });
    }

    const timer = setTimeout(() => {
      setActiveBanner(null);
      if (onAnimationEnd) onAnimationEnd();
    }, 4500);

    return () => clearTimeout(timer);
  }, [giftEvent]);

  if (!activeBanner) return null;

  const { gift, senderName, quantity, totalCoins } = activeBanner;

  return (
    <div className="absolute inset-0 pointer-events-none z-50 overflow-hidden flex flex-col items-center justify-between p-4">
      {/* Top Banner Banner */}
      <div className="animate-bounce mt-16 bg-gradient-to-r from-amber-500/90 via-pink-600/90 to-purple-600/90 text-white px-5 py-3 rounded-full shadow-2xl flex items-center space-x-3 border-2 border-yellow-300/60 backdrop-blur-md">
        <span className="text-3xl animate-pulse">{gift.icon}</span>
        <div>
          <div className="text-xs font-bold uppercase tracking-wider text-yellow-200">
            ¡REGALO ESPECIAL DE EN VIVO!
          </div>
          <div className="text-sm font-black">
            <span className="text-yellow-300">{senderName}</span> envió{' '}
            <span className="text-white underline">{quantity}x {gift.spanishName}</span> ({totalCoins} 🪙)
          </div>
        </div>
      </div>

      {/* Center Stage Animation */}
      <div className="my-auto flex flex-col items-center justify-center">
        {gift.animationType === 'lion' && (
          <div className="animate-pulse flex flex-col items-center space-y-2">
            <div className="text-9xl drop-shadow-[0_0_50px_rgba(234,179,8,0.9)] animate-bounce">
              🦁
            </div>
            <div className="bg-yellow-500/90 text-black font-black text-xl px-6 py-2 rounded-full border-2 border-yellow-200 shadow-xl tracking-widest uppercase">
              ¡RUGIDO DE LEÓN DORADO! 👑
            </div>
          </div>
        )}

        {gift.animationType === 'ferrari' && (
          <div className="flex flex-col items-center space-y-2 animate-[spin_1.5s_ease-out]">
            <div className="text-9xl drop-shadow-[0_0_40px_rgba(239,68,68,0.9)]">
              🏎️
            </div>
            <div className="bg-red-600 text-white font-black text-lg px-6 py-1.5 rounded-full border border-red-300 shadow-lg tracking-wider">
              ¡FERRARI EN PISTA! 🔥
            </div>
          </div>
        )}

        {gift.animationType === 'rocket' && (
          <div className="flex flex-col items-center animate-[bounce_1s_infinite]">
            <div className="text-8xl drop-shadow-[0_0_40px_rgba(59,130,246,0.9)]">
              🚀
            </div>
            <div className="bg-blue-600/90 text-white font-bold text-sm px-4 py-1 rounded-full border border-blue-300">
              ¡RUMBO A LA LUNA! 🌌
            </div>
          </div>
        )}

        {gift.animationType === 'galaxy' && (
          <div className="flex flex-col items-center space-y-2">
            <div className="text-9xl animate-spin duration-3000 drop-shadow-[0_0_60px_rgba(168,85,247,0.9)]">
              🪐
            </div>
            <div className="bg-purple-600/90 text-yellow-300 font-extrabold text-lg px-6 py-2 rounded-full border border-yellow-300 shadow-2xl">
              ¡GALAXIA TIKTOK DESATADA! ✨
            </div>
          </div>
        )}

        {gift.animationType === 'castle' && (
          <div className="flex flex-col items-center space-y-2">
            <div className="text-9xl drop-shadow-[0_0_50px_rgba(236,72,153,0.9)] animate-pulse">
              🏰
            </div>
            <div className="bg-pink-600/90 text-white font-bold text-base px-5 py-1.5 rounded-full border border-pink-300 shadow-xl">
              ¡CASTILLO DE SUEÑOS CREADO! 💖
            </div>
          </div>
        )}

        {(gift.animationType === 'bounce' || gift.animationType === 'sparkle' || gift.animationType === 'rose_shower') && (
          <div className="flex flex-col items-center space-y-1 animate-bounce">
            <div className="text-7xl drop-shadow-lg">{gift.icon}</div>
            <div className="bg-black/70 text-yellow-400 text-xs font-bold px-3 py-1 rounded-full border border-yellow-500/50">
              +{quantity} {gift.spanishName}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
