import React, { useState, useEffect, useRef } from 'react';
import { Streamer, LiveComment, GiftEvent, PKBattleState, UserWallet } from '../types';
import { PKBattleOverlay } from './PKBattleOverlay';
import { Heart, MessageCircle, Share2, Gift, Volume2, VolumeX, Users, Gem, Sparkles, Send, Flame, ChevronUp, ChevronDown } from 'lucide-react';
import { SocialShareModal } from './SocialShareModal';

interface LiveStreamViewerProps {
  streamer: Streamer | null;
  wallet: UserWallet;
  pkBattle: PKBattleState | null;
  comments: LiveComment[];
  latestGiftEvent: GiftEvent | null;
  onSendComment: (msg: string) => void;
  onOpenGiftStore: () => void;
  onNextStream: () => void;
  onPrevStream: () => void;
  isFollowing?: boolean;
  onToggleFollow?: () => void;
  onlyMutualLive?: boolean;
  onToggleOnlyMutualLive?: () => void;
}

export const LiveStreamViewer: React.FC<LiveStreamViewerProps> = ({
  streamer,
  wallet,
  pkBattle,
  comments,
  latestGiftEvent,
  onSendComment,
  onOpenGiftStore,
  onNextStream,
  onPrevStream,
  isFollowing: isFollowingExternal = false,
  onToggleFollow,
  onlyMutualLive = true,
  onToggleOnlyMutualLive,
}) => {
  const [commentInput, setCommentInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [internalFollowing, setInternalFollowing] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  if (!streamer) {
    return (
      <div className="relative w-full h-[calc(100vh-112px)] max-w-md mx-auto bg-stone-950 text-white overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-2xl border-x border-stone-800/80">
        <div className="p-4 bg-purple-600/20 border border-purple-500/40 rounded-3xl mb-4 shadow-[0_0_30px_rgba(168,85,247,0.3)]">
          <Users className="w-12 h-12 text-purple-400 animate-pulse" />
        </div>
        <h2 className="text-xl font-black text-white">Transmisiones de Amigos Mutuos</h2>
        <p className="text-xs text-stone-400 mt-2 max-w-xs font-medium leading-relaxed">
          Solo se muestran en vivo las personas que se siguen mutuamente. Sigue a tus creadores favoritos para ver sus transmisiones exclusivas en vivo.
        </p>
        {onToggleOnlyMutualLive && (
          <button
            onClick={onToggleOnlyMutualLive}
            className="mt-6 px-6 py-3 bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black text-xs rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.4)] active:scale-95 transition-all"
          >
            Ver Todas las Transmisiones Públicas
          </button>
        )}
      </div>
    );
  }

  const isFollowing = onToggleFollow ? isFollowingExternal : internalFollowing;

  const handleFollowClick = () => {
    if (onToggleFollow) {
      onToggleFollow();
    } else {
      setInternalFollowing(!internalFollowing);
    }
  };
  const [floatingHearts, setFloatingHearts] = useState<{ id: number; x: number }[]>([]);
  const chatScrollRef = useRef<HTMLDivElement>(null);

  if (!streamer) {
    return (
      <div className="relative w-full max-w-md h-[82vh] bg-stone-950 border border-white/10 rounded-[32px] overflow-hidden flex flex-col items-center justify-center p-6 text-center shadow-2xl">
        <div className="p-4 bg-rose-600/20 rounded-full border border-rose-500/30 mb-3 shadow-[0_0_20px_rgba(244,63,94,0.4)]">
          <Flame className="w-10 h-10 text-rose-500 animate-pulse" />
        </div>
        <h3 className="text-base font-black text-white">No hay transmisión activa</h3>
        <p className="text-xs text-stone-400 mt-1 max-w-xs font-medium">
          Busca por ID o usuario en la barra superior o presiona el botón <span className="text-rose-400 font-bold">+</span> para iniciar tu propia transmisión en vivo.
        </p>
      </div>
    );
  }

  // Auto scroll chat to bottom when new comment arrives
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [comments]);

  // Handle Send Comment
  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentInput.trim()) return;
    onSendComment(commentInput.trim());
    setCommentInput('');
  };

  // Trigger floating heart particle
  const handleLikeClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const newHeart = {
      id: Date.now() + Math.random(),
      x: Math.random() * 40 - 20
    };
    setFloatingHearts(prev => [...prev.slice(-15), newHeart]);
  };

  const giftGoalPct = streamer.giftGoal
    ? Math.min(100, Math.round((streamer.giftGoal.currentCoins / streamer.giftGoal.targetCoins) * 100))
    : 0;

  return (
    <div className="relative w-full h-[calc(100vh-112px)] max-w-md mx-auto bg-stone-950 text-white overflow-hidden flex flex-col justify-between select-none shadow-2xl border-x border-stone-800/80">
      {/* Stream Video Canvas / Animated Stream Preset Background */}
      <div className={`absolute inset-0 bg-gradient-to-b ${streamer.streamBgGradient} opacity-90`}>
        {/* Dynamic Simulated Live Stream Ambient Canvas/Video Effect */}
        <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-rose-500 to-transparent animate-pulse" />
      </div>

      {/* Floating Hearts Animation Container */}
      <div className="absolute right-4 bottom-28 w-16 h-64 pointer-events-none z-30 overflow-hidden">
        {floatingHearts.map(heart => (
          <div
            key={heart.id}
            style={{ transform: `translateX(${heart.x}px)` }}
            className="absolute bottom-0 text-rose-500 text-3xl animate-[bounce_2s_infinite] fade-out transition-all duration-1000"
          >
            ❤️
          </div>
        ))}
      </div>

      {/* Top Header Bar */}
      <div className="relative z-20 pt-3 px-3 space-y-2">
        <div className="flex items-center justify-between">
          {/* Streamer Profile Pill */}
          <div className="bg-stone-900/70 backdrop-blur-xl rounded-full p-1 pr-3 flex items-center space-x-2 border border-white/10 shadow-lg">
            <img
              src={streamer.avatar}
              alt={streamer.displayName}
              className="w-9 h-9 rounded-full object-cover border-2 border-rose-500"
            />
            <div>
              <div className="text-xs font-black text-white leading-tight flex items-center space-x-1">
                <span className="line-clamp-1">{streamer.displayName}</span>
              </div>
              <div className="text-[10px] text-purple-300 font-bold flex items-center space-x-1">
                <Gem className="w-3 h-3 text-purple-400 fill-purple-400" />
                <span>{streamer.diamondCount.toLocaleString()} 💎</span>
              </div>
            </div>

            <button
              onClick={handleFollowClick}
              className={`px-3 py-1 rounded-full text-[11px] font-black transition-all duration-200 active:scale-95 ${
                isFollowing
                  ? 'bg-stone-800/80 text-stone-300 border border-white/10'
                  : 'bg-rose-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)] hover:bg-rose-500'
              }`}
            >
              {isFollowing ? 'Siguiendo' : '+ Seguir'}
            </button>
          </div>

          {/* Right Top Status Controls */}
          <div className="flex items-center space-x-1.5">
            {onToggleOnlyMutualLive && (
              <button
                onClick={onToggleOnlyMutualLive}
                title="Filtrar transmisiones solo de personas que se siguen mutuamente"
                className={`px-2.5 py-1 rounded-full text-[10px] font-black border transition-all flex items-center space-x-1 ${
                  onlyMutualLive
                    ? 'bg-purple-600/90 text-white border-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                    : 'bg-stone-900/70 text-stone-300 border-white/10 hover:text-white'
                }`}
              >
                <span>🤝 Amigos</span>
              </button>
            )}

            <div className="bg-stone-900/70 backdrop-blur-xl px-2.5 py-1 rounded-full text-xs font-bold flex items-center space-x-1 border border-white/10">
              <Users className="w-3.5 h-3.5 text-rose-400" />
              <span>{streamer.viewerCount.toLocaleString()}</span>
            </div>

            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-full bg-stone-900/70 backdrop-blur-xl border border-white/10 text-stone-300 transition-all hover:scale-105 active:scale-95"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
          </div>
        </div>

        {/* Stream Gift Goal Tracker */}
        {streamer.giftGoal && (
          <div className="bg-stone-900/75 backdrop-blur-xl rounded-2xl p-2.5 border border-white/10 shadow-lg">
            <div className="flex justify-between items-center text-[10px] font-bold text-stone-300 mb-1.5">
              <span className="text-yellow-400 font-black flex items-center space-x-1">
                <Sparkles className="w-3 h-3 text-yellow-400" />
                <span>{streamer.giftGoal.title}</span>
              </span>
              <span className="font-extrabold">{streamer.giftGoal.currentCoins} / {streamer.giftGoal.targetCoins} 🪙 ({giftGoalPct}%)</span>
            </div>
            <div className="w-full bg-stone-950/80 h-2 rounded-full overflow-hidden p-0.5 border border-white/5">
              <div
                style={{ width: `${giftGoalPct}%` }}
                className="bg-gradient-to-r from-yellow-500 via-amber-400 to-rose-500 h-full rounded-full transition-all duration-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]"
              />
            </div>
          </div>
        )}

        {/* 1v1 PK Battle Header Bar */}
        {pkBattle && <PKBattleOverlay pkBattle={pkBattle} />}
      </div>

      {/* Right Side Vertical Action Buttons */}
      <div className="absolute right-3 bottom-24 z-20 flex flex-col space-y-4 items-center">
        {/* Stream Switcher Navigation */}
        <div className="flex flex-col space-y-1 mb-2">
          <button
            onClick={onPrevStream}
            className="p-2 bg-stone-900/75 hover:bg-stone-800/80 rounded-full border border-white/10 text-stone-300 shadow-lg backdrop-blur-md transition-all active:scale-90"
          >
            <ChevronUp className="w-4 h-4" />
          </button>
          <button
            onClick={onNextStream}
            className="p-2 bg-stone-900/75 hover:bg-stone-800/80 rounded-full border border-white/10 text-stone-300 shadow-lg backdrop-blur-md transition-all active:scale-90"
          >
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        {/* Like Button */}
        <button
          onClick={handleLikeClick}
          className="group flex flex-col items-center space-y-1"
        >
          <div className="p-3 bg-stone-900/75 hover:bg-rose-950/80 rounded-full border border-rose-500/40 text-rose-500 shadow-xl backdrop-blur-md transition-all duration-200 group-active:scale-125 hover:shadow-[0_0_15px_rgba(244,63,94,0.4)]">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <span className="text-[10px] font-black text-stone-200 tracking-wide">Me gusta</span>
        </button>

        {/* GIFT STORE TRIGGER BUTTON - Monetization Anchor! */}
        <button
          onClick={onOpenGiftStore}
          className="group flex flex-col items-center space-y-1 animate-bounce"
        >
          <div className="p-3.5 bg-gradient-to-tr from-amber-500 via-rose-600 to-purple-600 rounded-full border-2 border-yellow-300 shadow-[0_0_25px_rgba(234,179,8,0.6)] text-white transition-all duration-300 group-active:scale-125 hover:scale-110">
            <Gift className="w-7 h-7 text-white fill-yellow-300" />
          </div>
          <span className="text-[10px] font-black text-yellow-300 uppercase tracking-wider drop-shadow-[0_0_6px_rgba(234,179,8,0.8)]">Regalos</span>
        </button>

        {/* Share Button */}
        <button
          onClick={() => setIsShareOpen(true)}
          className="flex flex-col items-center space-y-1 transition-all active:scale-95"
        >
          <div className="p-3 bg-stone-900/75 hover:bg-stone-800 rounded-full border border-white/10 text-stone-200 shadow-xl backdrop-blur-md">
            <Share2 className="w-5 h-5" />
          </div>
          <span className="text-[10px] font-black text-stone-300">Compartir</span>
        </button>
      </div>

      {/* Bottom Chat Overlay & Comment Input */}
      <div className="relative z-20 p-3 space-y-2.5 bg-gradient-to-t from-black via-black/90 to-transparent pt-8">
        {/* Stream Title Tag */}
        <div className="text-xs font-bold text-stone-200 line-clamp-1 bg-stone-900/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/10 inline-block max-w-[80%] shadow-md">
          {streamer.streamTitle}
        </div>

        {/* Auto Scrolling Live Comments Feed */}
        <div
          ref={chatScrollRef}
          className="max-h-40 overflow-y-auto space-y-2 pr-12 no-scrollbar text-xs"
        >
          {comments.map((comment) => (
            <div
              key={comment.id}
              className={`p-2 rounded-2xl max-w-[90%] backdrop-blur-xl transition-all duration-200 ${
                comment.giftEvent
                  ? 'bg-gradient-to-r from-amber-950/85 to-rose-950/85 border border-yellow-400/70 shadow-[0_0_15px_rgba(234,179,8,0.2)]'
                  : 'bg-stone-900/70 border border-white/10'
              }`}
            >
              <div className="flex items-center space-x-1.5 mb-0.5">
                <img
                  src={comment.userAvatar}
                  alt={comment.username}
                  className="w-4 h-4 rounded-full object-cover border border-white/20"
                />
                <span className="font-extrabold text-stone-200 text-[11px]">{comment.username}</span>

                {comment.badge && (
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase ${
                      comment.badge === 'VIP'
                        ? 'bg-yellow-500 text-stone-950 shadow-[0_0_8px_rgba(234,179,8,0.5)]'
                        : comment.badge === 'Top Gifter'
                        ? 'bg-rose-600 text-white shadow-[0_0_8px_rgba(244,63,94,0.5)]'
                        : 'bg-blue-600 text-white'
                    }`}
                  >
                    {comment.badge} {comment.badgeLevel ? `L${comment.badgeLevel}` : ''}
                  </span>
                )}
              </div>

              {comment.giftEvent ? (
                <div className="text-[11px] font-black text-yellow-300 flex items-center space-x-1 mt-0.5">
                  <span>Envió {comment.giftEvent.quantity}x</span>
                  <span className="text-base">{comment.giftEvent.giftIcon}</span>
                  <span>{comment.giftEvent.giftName} ({comment.giftEvent.totalCoins} 🪙)</span>
                </div>
              ) : (
                <div className="text-stone-300 font-medium text-[11px] leading-tight">
                  {comment.message}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Comment Input Bar */}
        <form onSubmit={handleCommentSubmit} className="flex items-center space-x-2 pt-1">
          <input
            type="text"
            value={commentInput}
            onChange={(e) => setCommentInput(e.target.value)}
            placeholder="Añadir comentario..."
            className="flex-1 bg-stone-900/80 border border-white/10 rounded-full px-4 py-2 text-xs font-medium text-white focus:outline-none focus:border-rose-500 placeholder-stone-500 backdrop-blur-md shadow-inner"
          />

          <button
            type="submit"
            className="p-2 bg-rose-600 hover:bg-rose-500 rounded-full text-white font-bold shadow-[0_0_12px_rgba(244,63,94,0.4)] transition-all duration-200 active:scale-95"
          >
            <Send className="w-4 h-4" />
          </button>

          {/* Quick Gift Trigger */}
          <button
            type="button"
            onClick={onOpenGiftStore}
            className="p-2 bg-yellow-500 hover:bg-yellow-400 rounded-full text-stone-950 font-bold shadow-[0_0_12px_rgba(234,179,8,0.4)] transition-all duration-200 active:scale-95"
          >
            <Gift className="w-4 h-4" />
          </button>
        </form>
      </div>

      <SocialShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={streamer.streamTitle}
        streamerName={streamer.displayName}
      />
    </div>
  );
};
