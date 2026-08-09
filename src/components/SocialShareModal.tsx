import React, { useState } from 'react';
import { X, Copy, Check, Share2, Send, MessageCircle } from 'lucide-react';

interface SocialShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  shareUrl?: string;
  shareText?: string;
  streamerName?: string;
}

export const SocialShareModal: React.FC<SocialShareModalProps> = ({
  isOpen,
  onClose,
  title,
  shareUrl = window.location.href,
  shareText = '🔴 ¡Mira esta transmisión en vivo ahora!',
  streamerName,
}) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const fullText = streamerName 
    ? `🔴 ¡${streamerName} está transmitiendo EN VIVO! Entra a ver el directo:`
    : shareText;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${fullText} ${shareUrl}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: fullText,
          url: shareUrl,
        });
      } catch (err) {
        console.log('Share canceled or not supported:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  const encodedText = encodeURIComponent(`${fullText} ${shareUrl}`);
  const encodedUrl = encodeURIComponent(shareUrl);

  const socialPlatforms = [
    {
      name: 'WhatsApp',
      icon: '💬',
      bgColor: 'bg-emerald-600 hover:bg-emerald-500',
      url: `https://api.whatsapp.com/send?text=${encodedText}`,
    },
    {
      name: 'Facebook',
      icon: '📘',
      bgColor: 'bg-blue-600 hover:bg-blue-500',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'X (Twitter)',
      icon: '🐦',
      bgColor: 'bg-stone-800 hover:bg-stone-700',
      url: `https://twitter.com/intent/tweet?text=${encodedText}`,
    },
    {
      name: 'Telegram',
      icon: '✈️',
      bgColor: 'bg-sky-500 hover:bg-sky-400',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(fullText)}`,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-sm bg-stone-900 border border-white/10 rounded-3xl p-5 shadow-2xl text-white space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center space-x-2">
            <div className="p-2 bg-rose-600/20 border border-rose-500/30 rounded-xl">
              <Share2 className="w-5 h-5 text-rose-500" />
            </div>
            <div>
              <h3 className="text-sm font-black text-white">Compartir Live a Redes</h3>
              <p className="text-[10px] text-stone-400 font-medium">Atrae espectadores a tu transmisión</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white p-1 rounded-full bg-stone-800/60"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Live Title Banner */}
        <div className="bg-stone-950 p-3 rounded-2xl border border-white/5 space-y-1">
          <div className="text-[10px] font-black text-rose-400 uppercase tracking-wider flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            <span>Transmisión en Vivo</span>
          </div>
          <p className="text-xs font-bold text-stone-200 line-clamp-2">{title}</p>
        </div>

        {/* Social Platforms Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {socialPlatforms.map((platform) => (
            <a
              key={platform.name}
              href={platform.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`${platform.bgColor} p-3 rounded-2xl font-bold text-xs flex items-center justify-center space-x-2 transition-all active:scale-95 text-white shadow-lg`}
            >
              <span className="text-base">{platform.icon}</span>
              <span>{platform.name}</span>
            </a>
          ))}
        </div>

        {/* Copy Link & Native Share Actions */}
        <div className="pt-1 space-y-2">
          <div className="flex items-center space-x-2 bg-stone-950 p-1.5 rounded-2xl border border-white/10">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-transparent px-2 text-[11px] text-stone-300 focus:outline-none font-mono truncate"
            />
            <button
              onClick={handleCopyLink}
              className="px-3 py-1.5 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs rounded-xl flex items-center space-x-1 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-300" />
                  <span>¡Copiado!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>Copiar</span>
                </>
              )}
            </button>
          </div>

          {'share' in navigator && (
            <button
              onClick={handleNativeShare}
              className="w-full bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-xs py-2.5 rounded-2xl border border-white/10 flex items-center justify-center space-x-2 transition-all active:scale-95"
            >
              <Share2 className="w-4 h-4 text-purple-400" />
              <span>Más Opciones de Compartir</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
