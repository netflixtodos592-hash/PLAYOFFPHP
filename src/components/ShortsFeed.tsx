import React, { useState, useEffect, useRef } from 'react';
import { Streamer } from '../types';
import {
  Play,
  Heart,
  MessageCircle,
  Share2,
  Radio,
  Sparkles,
  Plus,
  Film,
  Shuffle,
  Volume2,
  VolumeX,
  ChevronUp,
  ChevronDown,
  Music,
  Flame,
  UserCheck,
  UserPlus,
  Lock,
  Coins,
  Users,
  Unlock,
  ShieldCheck
} from 'lucide-react';
import { getAlgorithmicShortsFeed, AlgorithmicShort } from '../data/shortsData';

export interface ShortItem {
  id: string;
  title: string;
  likes: string;
  comments: string;
  videoUrl?: string;
  category?: string;
  audioTrack?: string;
  privacy?: 'public' | 'friends' | 'coins';
  coinPrice?: number;
  streamer: {
    username: string;
    displayName: string;
    avatar: string;
    streamBgGradient?: string;
    id?: string;
  };
}

interface ShortsFeedProps {
  streamers: Streamer[];
  customShorts?: ShortItem[];
  followedUsernames?: string[];
  onToggleFollow?: (username: string) => void;
  userCoins?: number;
  unlockedVideoIds?: string[];
  onUnlockVideo?: (videoId: string, coinPrice: number) => void;
  onOpenCoinWallet?: () => void;
  onSelectStream: (streamer: Streamer) => void;
  onOpenUploadModal: () => void;
  onOpenProfile?: (profile: { username: string; displayName: string; avatar: string; streamerId?: string }) => void;
}

const CATEGORY_CHIPS = [
  'Todos',
  'Gaming',
  'Música',
  'Deportes',
  'Cocina',
  'Humor',
  'Tecnología',
  'Arte',
  'Viajes',
  'Mascotas',
  'Fitness'
];

export const ShortsFeed: React.FC<ShortsFeedProps> = ({
  streamers,
  customShorts = [],
  followedUsernames = [],
  onToggleFollow,
  userCoins = 0,
  unlockedVideoIds = [],
  onUnlockVideo,
  onOpenCoinWallet,
  onSelectStream,
  onOpenUploadModal,
  onOpenProfile,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Todos');
  const [tabMode, setTabMode] = useState<'para_ti' | 'tendencias' | 'siguiendo'>('para_ti');
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  const [isMuted, setIsMuted] = useState(true);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [copiedShare, setCopiedShare] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);

  // Compute feed array using algorithmic engine
  const [feedItems, setFeedItems] = useState<AlgorithmicShort[]>(() =>
    getAlgorithmicShortsFeed('Todos', 'para_ti', customShorts)
  );

  // Re-generate feed when category, tab, customShorts, or followedUsernames change
  useEffect(() => {
    let updated = getAlgorithmicShortsFeed(selectedCategory, tabMode, customShorts);

    if (tabMode === 'siguiendo') {
      const followedShorts = updated.filter(item =>
        followedUsernames.some(u => u.toLowerCase() === item.streamer.username.toLowerCase())
      );
      if (followedShorts.length > 0) {
        updated = followedShorts;
      }
    }

    setFeedItems(updated);
    setActiveVideoIdx(0);
  }, [selectedCategory, tabMode, customShorts.length, followedUsernames.length]);

  const handleShuffleAlgorithm = () => {
    const shuffled = getAlgorithmicShortsFeed(selectedCategory, tabMode, customShorts);
    setFeedItems(shuffled);
    setActiveVideoIdx(0);
  };

  const currentShort = feedItems[activeVideoIdx] || feedItems[0];

  const isCreatorFollowed = currentShort
    ? followedUsernames.some(u => u.toLowerCase() === currentShort.streamer.username.toLowerCase())
    : false;

  const targetStreamer = currentShort
    ? streamers.find(
        s => s.id === currentShort.streamer.id || s.username.toLowerCase() === currentShort.streamer.username.toLowerCase()
      )
    : null;

  const isCreatorLive = targetStreamer ? targetStreamer.isLive : false;

  const isVideoUnlocked = currentShort
    ? !currentShort.privacy ||
      currentShort.privacy === 'public' ||
      unlockedVideoIds.includes(currentShort.id) ||
      (currentShort.privacy === 'friends' && isCreatorFollowed)
    : true;

  const isCoinsLocked = currentShort?.privacy === 'coins' && !isVideoUnlocked;
  const isFriendsLocked = currentShort?.privacy === 'friends' && !isCreatorFollowed && !isVideoUnlocked;
  const isPermissionLocked = currentShort?.privacy === 'permission' && !isVideoUnlocked;

  const handleNextVideo = () => {
    if (activeVideoIdx < feedItems.length - 1) {
      setActiveVideoIdx(prev => prev + 1);
    } else {
      handleShuffleAlgorithm();
    }
  };

  const handlePrevVideo = () => {
    if (activeVideoIdx > 0) {
      setActiveVideoIdx(prev => prev - 1);
    }
  };

  const isLiked = currentShort ? !!likedMap[currentShort.id] : false;

  const toggleLike = () => {
    if (!currentShort) return;
    setLikedMap(prev => ({ ...prev, [currentShort.id]: !prev[currentShort.id] }));
  };

  const handleShare = () => {
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 1800);
  };

  return (
    <div className="relative w-full h-[calc(100vh-112px)] max-w-md mx-auto bg-stone-950 text-white overflow-hidden flex flex-col justify-between select-none shadow-2xl border-x border-stone-800/80">
      {/* Video element or gradient background */}
      {currentShort?.videoUrl && !isCoinsLocked && !isFriendsLocked && !isPermissionLocked ? (
        <video
          ref={videoRef}
          src={currentShort.videoUrl}
          className="absolute inset-0 w-full h-full object-cover"
          autoPlay
          loop
          muted={isMuted}
          playsInline
        />
      ) : (
        <div className={`absolute inset-0 bg-gradient-to-tr ${currentShort?.streamer.streamBgGradient || 'from-purple-950 to-black'} opacity-90`}>
          <div className="absolute inset-0 flex items-center justify-center">
            <Play className="w-20 h-20 text-white/30 drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" />
          </div>
        </div>
      )}

      {/* Video Privacy Lock Overlay */}
      {(isCoinsLocked || isFriendsLocked || isPermissionLocked) && (
        <div className="absolute inset-0 z-20 bg-black/85 backdrop-blur-xl flex flex-col items-center justify-center p-6 text-center space-y-4">
          {isCoinsLocked ? (
            <>
              <div className="p-4 bg-amber-500/20 border border-amber-500/40 rounded-3xl shadow-[0_0_30px_rgba(245,158,11,0.4)] animate-bounce">
                <Lock className="w-10 h-10 text-yellow-400" />
              </div>

              <div>
                <span className="bg-amber-500/20 text-yellow-300 border border-amber-500/40 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Video Exclusivo Privado
                </span>
                <h3 className="text-lg font-black text-white mt-2">Contenido de Creador</h3>
                <p className="text-xs text-stone-300 mt-1 max-w-xs font-medium">
                  El creador ha privatizado este video. Desbloquéalo por <strong className="text-yellow-400">{currentShort?.coinPrice || 10} Monedas</strong>.
                </p>
              </div>

              <div className="w-full max-w-xs space-y-2 pt-2">
                <button
                  onClick={() => {
                    const price = currentShort?.coinPrice || 10;
                    if (userCoins >= price) {
                      if (onUnlockVideo && currentShort) {
                        onUnlockVideo(currentShort.id, price);
                      }
                    } else if (onOpenCoinWallet) {
                      onOpenCoinWallet();
                    }
                  }}
                  className="w-full bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-black text-xs py-3 rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.5)] flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <Coins className="w-4 h-4 fill-stone-950" />
                  <span>
                    {userCoins >= (currentShort?.coinPrice || 10)
                      ? `Desbloquear con ${currentShort?.coinPrice || 10} Monedas`
                      : `Recargar Monedas (Tienes ${userCoins})`}
                  </span>
                </button>
              </div>
            </>
          ) : isFriendsLocked ? (
            <>
              <div className="p-4 bg-purple-600/20 border border-purple-500/40 rounded-3xl shadow-[0_0_30px_rgba(168,85,247,0.4)]">
                <Users className="w-10 h-10 text-purple-300" />
              </div>

              <div>
                <span className="bg-purple-600/20 text-purple-300 border border-purple-500/40 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Solo para Seguidores
                </span>
                <h3 className="text-lg font-black text-white mt-2">Video Exclusivo Seguidores</h3>
                <p className="text-xs text-stone-300 mt-1 max-w-xs font-medium">
                  Sigue a @{currentShort?.streamer.username} para ver sus publicaciones exclusivas.
                </p>
              </div>

              {onToggleFollow && currentShort && (
                <button
                  onClick={() => onToggleFollow(currentShort.streamer.username)}
                  className="w-full max-w-xs bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs py-3 rounded-2xl shadow-[0_0_20px_rgba(168,85,247,0.5)] flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <UserPlus className="w-4 h-4" />
                  <span>Seguir Creador para Ver Video</span>
                </button>
              )}
            </>
          ) : (
            <>
              <div className="p-4 bg-blue-600/20 border border-blue-500/40 rounded-3xl shadow-[0_0_30px_rgba(59,130,246,0.4)]">
                <ShieldCheck className="w-10 h-10 text-blue-400" />
              </div>

              <div>
                <span className="bg-blue-600/20 text-blue-300 border border-blue-500/40 text-[10px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Solo con Permiso Directo
                </span>
                <h3 className="text-lg font-black text-white mt-2">Video Privado del Creador</h3>
                <p className="text-xs text-stone-300 mt-1 max-w-xs font-medium">
                  El usuario autor de este video requiere otorgarte permiso directo para poder visualizarlo.
                </p>
              </div>

              {currentShort && onUnlockVideo && (
                <button
                  onClick={() => onUnlockVideo(currentShort.id, 0)}
                  className="w-full max-w-xs bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-black text-xs py-3 rounded-2xl shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Solicitar / Usar Permiso del Creador</span>
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Top Header & Feed Mode Tabs */}
      <div className="relative z-10 p-3 flex flex-col space-y-2 bg-gradient-to-b from-black/90 via-black/60 to-transparent">
        <div className="flex items-center justify-between">
          {/* Feed Tabs: Para Ti, Top, Siguiendo */}
          <div className="flex items-center space-x-1.5 bg-black/40 backdrop-blur-md p-1 rounded-full border border-white/10">
            <button
              onClick={() => setTabMode('para_ti')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all flex items-center space-x-1 ${
                tabMode === 'para_ti'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3 text-yellow-300" />
              <span>Para Ti</span>
            </button>
            <button
              onClick={() => setTabMode('tendencias')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all flex items-center space-x-1 ${
                tabMode === 'tendencias'
                  ? 'bg-gradient-to-r from-amber-500 to-rose-600 text-white shadow-[0_0_10px_rgba(245,158,11,0.5)]'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <Flame className="w-3 h-3 text-orange-400" />
              <span>Top</span>
            </button>
            <button
              onClick={() => setTabMode('siguiendo')}
              className={`px-2.5 py-1 rounded-full text-[10px] font-black transition-all flex items-center space-x-1 ${
                tabMode === 'siguiendo'
                  ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-[0_0_10px_rgba(168,85,247,0.5)]'
                  : 'text-stone-300 hover:text-white'
              }`}
            >
              <UserCheck className="w-3 h-3 text-purple-300" />
              <span>Siguiendo</span>
            </button>
          </div>

          {/* Action Tools: Shuffle & Mute Toggle & Upload */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={handleShuffleAlgorithm}
              title="Mezclar Algoritmo Aleatorio"
              className="p-1.5 bg-stone-900/80 hover:bg-stone-800 border border-white/15 rounded-full text-rose-400 active:scale-95 transition-all shadow-lg"
            >
              <Shuffle className="w-3.5 h-3.5" />
            </button>

            {currentShort?.videoUrl && (
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 bg-stone-900/80 hover:bg-stone-800 border border-white/15 rounded-full text-white active:scale-95 transition-all shadow-lg"
                title={isMuted ? 'Activar Sonido' : 'Silenciar'}
              >
                {isMuted ? <VolumeX className="w-3.5 h-3.5 text-stone-400" /> : <Volume2 className="w-3.5 h-3.5 text-rose-400" />}
              </button>
            )}

            <button
              onClick={onOpenUploadModal}
              className="bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-[10px] px-2.5 py-1.5 rounded-full flex items-center space-x-1 shadow-md transition-all active:scale-95"
            >
              <Plus className="w-3 h-3" />
              <span>Subir</span>
            </button>
          </div>
        </div>

        {/* Scrollable Category Filter Chips */}
        <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar py-0.5">
          {CATEGORY_CHIPS.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold whitespace-nowrap transition-all border ${
                selectedCategory === cat
                  ? 'bg-stone-100 text-stone-950 border-white shadow'
                  : 'bg-stone-900/70 text-stone-300 border-white/10 hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Side Controls: Next & Previous Video Arrow Navigation */}
      <div className="absolute left-3 bottom-28 z-20 flex flex-col space-y-2">
        <button
          onClick={handlePrevVideo}
          disabled={activeVideoIdx === 0}
          className={`p-2 rounded-full border backdrop-blur-md transition-all ${
            activeVideoIdx === 0
              ? 'bg-black/30 text-stone-600 border-white/5 cursor-not-allowed'
              : 'bg-stone-900/80 text-white border-white/20 hover:scale-110 active:scale-90 shadow-xl'
          }`}
          title="Video Anterior"
        >
          <ChevronUp className="w-5 h-5" />
        </button>
        <button
          onClick={handleNextVideo}
          className="p-2 bg-stone-900/80 hover:bg-rose-600 text-white border border-white/20 rounded-full backdrop-blur-md transition-all hover:scale-110 active:scale-90 shadow-xl"
          title="Siguiente Video"
        >
          <ChevronDown className="w-5 h-5" />
        </button>
      </div>

      {/* Right Action Column */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col space-y-4 items-center">
        {/* Avatar Profile Button */}
        <button
          onClick={() => {
            if (currentShort && onOpenProfile) {
              onOpenProfile({
                username: currentShort.streamer.username,
                displayName: currentShort.streamer.displayName,
                avatar: currentShort.streamer.avatar,
                streamerId: currentShort.streamer.id
              });
            } else if (currentShort?.streamer.id) {
              const targetStreamer = streamers.find(s => s.id === currentShort.streamer.id);
              if (targetStreamer) onSelectStream(targetStreamer);
            }
          }}
          className="relative group transition-transform duration-200 hover:scale-105 active:scale-95"
          title={`Ver Perfil de ${currentShort?.streamer.displayName}`}
        >
          <img
            src={currentShort?.streamer.avatar}
            alt={currentShort?.streamer.displayName}
            className="w-12 h-12 rounded-full object-cover border-2 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
          />
          {currentShort?.streamer.id && (
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full uppercase shadow">
              LIVE
            </div>
          )}
        </button>

        {/* Like Button */}
        <div className="flex flex-col items-center space-y-1">
          <button
            onClick={toggleLike}
            className={`p-3 rounded-full border shadow-xl backdrop-blur-md active:scale-90 transition-all ${
              isLiked
                ? 'bg-rose-600 text-white border-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.6)]'
                : 'bg-stone-900/80 text-rose-500 border-white/10 hover:border-rose-500/40'
            }`}
          >
            <Heart className={`w-6 h-6 ${isLiked ? 'fill-white' : 'fill-rose-500'}`} />
          </button>
          <span className="text-[10px] font-black text-stone-200">{currentShort?.likes}</span>
        </div>

        {/* Comments Button */}
        <div className="flex flex-col items-center space-y-1">
          <div className="p-3 bg-stone-900/80 rounded-full border border-white/10 text-white shadow-xl backdrop-blur-md">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black text-stone-200">{currentShort?.comments}</span>
        </div>

        {/* Share Button */}
        <div className="flex flex-col items-center space-y-1 relative">
          <button
            onClick={handleShare}
            className="p-3 bg-stone-900/80 hover:bg-stone-800 rounded-full border border-white/10 text-white shadow-xl backdrop-blur-md active:scale-95 transition-all"
          >
            <Share2 className="w-6 h-6 text-indigo-400" />
          </button>
          <span className="text-[10px] font-black text-stone-200">
            {copiedShare ? '¡Copiado!' : currentShort?.shares || 'Compartir'}
          </span>
        </div>
      </div>

      {/* Bottom Creator Info Card */}
      <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/90 to-transparent space-y-2 pt-8">
        <div>
          <div className="text-sm font-black text-white flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  if (currentShort && onOpenProfile) {
                    onOpenProfile({
                      username: currentShort.streamer.username,
                      displayName: currentShort.streamer.displayName,
                      avatar: currentShort.streamer.avatar,
                      streamerId: currentShort.streamer.id
                    });
                  }
                }}
                className="hover:text-rose-400 transition-colors text-left"
              >
                @{currentShort?.streamer.username}
              </button>

              <span className="bg-purple-600/90 text-white text-[9px] font-black px-2 py-0.5 rounded-full uppercase border border-purple-400/30">
                {currentShort?.category || 'Creador'}
              </span>
            </div>

            {/* Direct Follow Toggle Button */}
            {onToggleFollow && currentShort && (
              <button
                onClick={() => onToggleFollow(currentShort.streamer.username)}
                className={`px-3 py-1 rounded-full text-[10px] font-black flex items-center space-x-1.5 transition-all ${
                  isCreatorFollowed
                    ? 'bg-stone-800 text-stone-300 border border-white/15'
                    : 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_12px_rgba(244,63,94,0.5)] active:scale-95'
                }`}
              >
                {isCreatorFollowed ? <UserCheck className="w-3 h-3 text-emerald-400" /> : <UserPlus className="w-3 h-3" />}
                <span>{isCreatorFollowed ? 'Siguiendo' : 'Seguir'}</span>
              </button>
            )}
          </div>

          <p className="text-xs text-stone-300 mt-1 line-clamp-2 font-medium">{currentShort?.title}</p>

          {/* Audio Track Badge */}
          <div className="flex items-center space-x-1.5 mt-1 text-[10px] text-stone-400">
            <Music className="w-3 h-3 text-rose-400 animate-spin" style={{ animationDuration: '4s' }} />
            <span className="truncate">{currentShort?.audioTrack || 'Audio Original - Tendencia Creadores 🎵'}</span>
          </div>
        </div>

        {/* EN VIVO button shown ONLY if the creator is actually live */}
        {isCreatorLive && targetStreamer && (
          <button
            onClick={() => onSelectStream(targetStreamer)}
            className="w-full bg-gradient-to-r from-rose-600 via-purple-600 to-indigo-600 text-white font-black text-xs py-2 rounded-xl shadow-[0_0_20px_rgba(244,63,94,0.5)] flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-[1.01] active:scale-95 animate-pulse mt-1"
          >
            <Radio className="w-4 h-4 text-yellow-300 animate-spin" style={{ animationDuration: '3s' }} />
            <span>Unirse al EN VIVO de @{currentShort?.streamer.username}</span>
          </button>
        )}

        {/* Video Switcher Dots */}
        <div className="flex justify-center space-x-1.5 pt-1">
          {feedItems.slice(0, 10).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveVideoIdx(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeVideoIdx === idx ? 'w-6 bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]' : 'w-1.5 bg-stone-700'
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};


