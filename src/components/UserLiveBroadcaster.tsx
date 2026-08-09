import React, { useState, useEffect, useRef } from 'react';
import { UserWallet, GiftItem, LiveComment } from '../types';
import { UserAccount } from './AuthModal';
import { Video, Mic, MicOff, VideoOff, Radio, Users, Gem, Gift, Send, Play, X, Maximize2, Minimize2, Share2, Globe, Coins, Lock } from 'lucide-react';
import { SocialShareModal } from './SocialShareModal';

interface UserLiveBroadcasterProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  currentUser?: UserAccount;
  onSimulateIncomingGift: (gift: GiftItem, fanName: string, quantity: number) => void;
  onUpdateWallet: (newWallet: UserWallet) => void;
  onStreamCreated?: (newStream: any) => void;
}

export const UserLiveBroadcaster: React.FC<UserLiveBroadcasterProps> = ({
  isOpen,
  onClose,
  wallet,
  currentUser,
  onSimulateIncomingGift,
  onUpdateWallet,
  onStreamCreated
}) => {
  const [streamTitle, setStreamTitle] = useState('🔥 Transmitiendo en vivo | ¡Bienvenidos a mi canal!');
  const [category, setCategory] = useState<'Gaming' | 'Música' | 'Charla' | 'ASMR' | 'Cocina'>('Charla');
  const [goalTitle, setGoalTitle] = useState('Meta: Cohete Espacial 🚀');
  const [goalTarget, setGoalTarget] = useState(1000);
  const [privacy, setPrivacy] = useState<'public' | 'followers' | 'coins'>('public');
  const [coinPrice, setCoinPrice] = useState<number>(10);
  const [isLiveActive, setIsLiveActive] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [isShareOpen, setIsShareOpen] = useState(false);

  // Live Comments Overlay State (Clean real comments)
  const [liveComments, setLiveComments] = useState<LiveComment[]>([]);
  const [inputComment, setInputComment] = useState('');

  // Camera & Mic States
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Real stats starting cleanly from 1 viewer (Host) & real wallet diamonds
  const [liveViewers, setLiveViewers] = useState(1);
  const [liveDiamonds, setLiveDiamonds] = useState(wallet.diamonds || 0);

  // Sync live diamonds with wallet
  useEffect(() => {
    setLiveDiamonds(wallet.diamonds || 0);
  }, [wallet.diamonds]);

  // Camera initialization
  useEffect(() => {
    if (isOpen && isVideoOn) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then(stream => {
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        })
        .catch(err => {
          console.log('Camera permission optional/not available:', err);
        });
    }

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, isVideoOn]);

  if (!isOpen) return null;

  const handleStartLive = async () => {
    try {
      const res = await fetch('/api/streamers/go-live', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: streamTitle,
          category,
          goalTitle,
          goalCoins: goalTarget,
          hostName: currentUser?.displayName || 'Usuario',
          hostAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
          email: currentUser?.email,
          username: currentUser?.email ? currentUser.email.split('@')[0] : 'usuario_live'
        })
      });
      const data = await res.json();
      if (data.success && data.streamer && onStreamCreated) {
        onStreamCreated(data.streamer);
      }
    } catch (e) {}

    setIsLiveActive(true);
    setIsFullScreen(true);
    setLiveComments([
      {
        id: 'sys-start',
        userId: 'system',
        username: 'Sistema',
        userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
        message: '🟢 Transmisión iniciada en vivo. Tu ID/canal ya está disponible para que todos te busquen y entren a verte.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ]);
  };

  const handleSendBroadcasterComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputComment.trim()) return;

    const myComment: LiveComment = {
      id: `c-${Date.now()}`,
      userId: currentUser?.email || 'host-current',
      username: currentUser?.displayName || 'Tú (Host)',
      userAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      badge: 'Host',
      badgeLevel: 99,
      message: inputComment.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setLiveComments(prev => [...prev, myComment]);
    setInputComment('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className={`relative w-full ${isFullScreen || isLiveActive ? 'max-w-md h-[95vh]' : 'max-w-xl max-h-[92vh]'} bg-stone-950/95 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden shadow-[0_0_60px_rgba(0,0,0,0.95)] flex flex-col justify-between transition-all duration-300`}>
        {/* Header */}
        <div className="bg-stone-900/90 backdrop-blur-md px-4 py-3 border-b border-white/10 flex items-center justify-between z-20">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 bg-rose-600/20 rounded-xl border border-rose-500/30 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
              <Radio className="w-5 h-5 text-rose-500 animate-pulse" />
            </div>
            <div>
              <h2 className="text-sm font-black text-white tracking-wide">
                {isLiveActive ? 'Transmisión EN VIVO en Directo' : 'Estudio de Transmisión'}
              </h2>
              <p className="text-[10px] text-stone-400 font-medium">Emite en vivo y recibe comentarios y regalos</p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isLiveActive && (
              <button
                onClick={() => setIsFullScreen(!isFullScreen)}
                className="p-1.5 rounded-lg bg-stone-800 text-stone-300 hover:text-white"
                title="Cambiar Pantalla Completa"
              >
                {isFullScreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </button>
            )}
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white font-bold p-1 text-xl transition-all"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Camera & Video Viewport with Live Overlays */}
        <div className={`relative w-full ${isLiveActive ? 'flex-1' : 'h-64'} bg-gradient-to-br from-purple-950 via-stone-900 to-black overflow-hidden flex flex-col justify-between border-b border-white/10`}>
          {isVideoOn ? (
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="absolute inset-0 w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center space-y-2 text-stone-500 bg-stone-950">
              <VideoOff className="w-12 h-12 text-rose-500/80" />
              <span className="text-xs font-extrabold text-stone-400">Cámara Apagada</span>
            </div>
          )}

          {/* Top Overlays: Live Badge, Viewer Count, Diamonds */}
          <div className="relative z-10 p-3 flex justify-between items-start bg-gradient-to-b from-black/80 via-black/40 to-transparent">
            <div className="flex items-center space-x-2">
              {isLiveActive ? (
                <div className="bg-rose-600 text-white font-black text-[10px] px-2.5 py-1 rounded-full flex items-center space-x-1 shadow-[0_0_15px_rgba(244,63,94,0.6)] animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-white animate-ping" />
                  <span>EN VIVO</span>
                </div>
              ) : (
                <div className="bg-stone-900/80 backdrop-blur-md text-stone-300 font-extrabold text-[10px] px-2.5 py-1 rounded-full border border-white/10">
                  Vista Previa
                </div>
              )}

              {isLiveActive && (
                <div className="bg-black/70 backdrop-blur-md text-white font-bold text-[10px] px-2.5 py-1 rounded-full flex items-center space-x-1 border border-white/10">
                  <Users className="w-3.5 h-3.5 text-rose-400" />
                  <span>{liveViewers} viendo</span>
                </div>
              )}
            </div>

            {isLiveActive && (
              <div className="bg-purple-950/90 border border-purple-500/60 text-purple-200 font-black text-xs px-3 py-1 rounded-full flex items-center space-x-1 shadow-[0_0_15px_rgba(168,85,247,0.4)] backdrop-blur-md">
                <Gem className="w-3.5 h-3.5 text-purple-400 fill-purple-400" />
                <span>+{liveDiamonds.toLocaleString()} 💎</span>
              </div>
            )}
          </div>

          {/* REAL-TIME FLOATING COMMENTS ON LIVE BROADCASTER SCREEN */}
          {isLiveActive && (
            <div className="relative z-10 p-3 flex flex-col justify-end space-y-2 mt-auto bg-gradient-to-t from-black/90 via-black/40 to-transparent max-h-56">
              <div className="space-y-1.5 overflow-y-auto max-h-40 pr-1 scrollbar-none">
                {liveComments.map((c) => (
                  <div
                    key={c.id}
                    className="inline-flex items-start space-x-1.5 bg-black/60 backdrop-blur-md border border-white/10 rounded-2xl px-3 py-1.5 text-xs max-w-[90%]"
                  >
                    <span className={`font-black ${c.badge === 'Host' ? 'text-yellow-400' : 'text-rose-400'}`}>
                      {c.username}:
                    </span>
                    <span className="text-white font-medium">{c.message}</span>
                  </div>
                ))}
              </div>

              {/* Broadcaster Quick Comment Input Bar */}
              <form onSubmit={handleSendBroadcasterComment} className="flex items-center space-x-2 pt-1">
                <input
                  type="text"
                  placeholder="Responde a tus espectadores en vivo..."
                  value={inputComment}
                  onChange={(e) => setInputComment(e.target.value)}
                  className="flex-1 bg-black/70 border border-white/20 rounded-xl px-3 py-1.5 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-rose-500"
                />
                <button
                  type="submit"
                  className="p-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl font-bold shadow-md active:scale-95"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </div>
          )}

          {/* Camera & Mic Controls Overlay */}
          <div className="relative z-10 p-2.5 flex items-center justify-between bg-black/60 backdrop-blur-md border-t border-white/10">
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setIsVideoOn(!isVideoOn)}
                className="p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white border border-white/10 transition-all active:scale-95"
                title="Cámara"
              >
                {isVideoOn ? <Video className="w-4 h-4 text-emerald-400" /> : <VideoOff className="w-4 h-4 text-rose-400" />}
              </button>
              <button
                onClick={() => setIsAudioOn(!isAudioOn)}
                className="p-2 rounded-full bg-stone-900/80 hover:bg-stone-800 text-white border border-white/10 transition-all active:scale-95"
                title="Micrófono"
              >
                {isAudioOn ? <Mic className="w-4 h-4 text-emerald-400" /> : <MicOff className="w-4 h-4 text-rose-400" />}
              </button>
              <button
                onClick={() => setIsShareOpen(true)}
                className="p-2 rounded-full bg-rose-600/30 hover:bg-rose-600/50 text-white border border-rose-500/40 transition-all active:scale-95 flex items-center space-x-1"
                title="Compartir Live en Redes"
              >
                <Share2 className="w-4 h-4 text-rose-300" />
              </button>
            </div>

            {isLiveActive && (
              <button
                onClick={() => setIsLiveActive(false)}
                className="bg-rose-600/90 hover:bg-rose-600 text-white font-black text-xs px-3.5 py-1.5 rounded-full shadow-md transition-all active:scale-95"
              >
                Finalizar Live
              </button>
            )}
          </div>
        </div>

        {/* Setup Controls (Shown before going live) */}
        {!isLiveActive && (
          <div className="p-4 space-y-3 text-xs overflow-y-auto">
            <div>
              <label className="block text-stone-400 font-bold uppercase tracking-wider mb-1">
                Título de la Transmisión
              </label>
              <input
                type="text"
                value={streamTitle}
                onChange={(e) => setStreamTitle(e.target.value)}
                placeholder="Ej. Charlando y jugando en vivo..."
                className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-stone-400 font-bold uppercase tracking-wider mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="Charla">Charla 🗣️</option>
                  <option value="Gaming">Gaming 🎮</option>
                  <option value="Música">Música 🎵</option>
                  <option value="ASMR">ASMR 🎧</option>
                  <option value="Cocina">Cocina 🍕</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-400 font-bold uppercase tracking-wider mb-1">Meta de Monedas</label>
                <input
                  type="text"
                  value={goalTitle}
                  onChange={(e) => setGoalTitle(e.target.value)}
                  placeholder="Meta: Cohete Espacial 🚀"
                  className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            <button
              onClick={handleStartLive}
              className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-sm py-3 rounded-2xl shadow-[0_0_25px_rgba(244,63,94,0.6)] transition-all duration-200 active:scale-95 flex items-center justify-center space-x-2 mt-2"
            >
              <Radio className="w-5 h-5 text-yellow-300 animate-pulse" />
              <span>TRANSMITIR EN VIVO AHORA</span>
            </button>
          </div>
        )}
      </div>

      <SocialShareModal
        isOpen={isShareOpen}
        onClose={() => setIsShareOpen(false)}
        title={streamTitle}
        streamerName={currentUser?.displayName || 'Transmisión en Vivo'}
      />
    </div>
  );
};
