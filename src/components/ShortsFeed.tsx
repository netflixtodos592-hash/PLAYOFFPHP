import React, { useState } from 'react';
import { Streamer } from '../types';
import { Play, Heart, MessageCircle, Share2, Radio, Sparkles } from 'lucide-react';

interface ShortsFeedProps {
  streamers: Streamer[];
  onSelectStream: (streamer: Streamer) => void;
}

export const ShortsFeed: React.FC<ShortsFeedProps> = ({ streamers, onSelectStream }) => {
  const [activeVideoIdx, setActiveVideoIdx] = useState(0);

  const sampleShorts = [
    {
      id: 'short-1',
      title: '¡Mira los regalos mas locos del LIVE de ayer! 🚀🔥 #TikTokLive #Gifts',
      likes: '142.5k',
      comments: '1,240',
      streamer: streamers[0]
    },
    {
      id: 'short-2',
      title: 'Acústico improvisado de medianoche 🎸 Envíame tu canción favorita en vivo!',
      likes: '89.2k',
      comments: '840',
      streamer: streamers[1]
    },
    {
      id: 'short-3',
      title: 'Triturando cosas relajantes para dormir 🎧 ASMR binaural',
      likes: '210.1k',
      comments: '3,100',
      streamer: streamers[2]
    }
  ];

  const currentShort = sampleShorts[activeVideoIdx] || sampleShorts[0];

  return (
    <div className="relative w-full h-[calc(100vh-112px)] max-w-md mx-auto bg-stone-950 text-white overflow-hidden flex flex-col justify-between select-none shadow-2xl border-x border-stone-800/80">
      {/* Background Simulated Short Video */}
      <div className={`absolute inset-0 bg-gradient-to-tr ${currentShort.streamer.streamBgGradient} opacity-80`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="w-20 h-20 text-white/30 animate-pulse drop-shadow-[0_0_25px_rgba(255,255,255,0.4)]" />
        </div>
      </div>

      {/* Top Banner overlay */}
      <div className="relative z-10 p-4 flex justify-between items-center bg-gradient-to-b from-black/80 via-black/40 to-transparent">
        <div className="text-xs font-black uppercase tracking-wider text-rose-500 flex items-center space-x-1 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Para Ti - Recomendados</span>
        </div>

        {/* Live Stream Fast Launcher */}
        <button
          onClick={() => onSelectStream(currentShort.streamer)}
          className="bg-rose-600 hover:bg-rose-500 text-white font-black text-xs px-3.5 py-1.5 rounded-full flex items-center space-x-1.5 shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all duration-200 active:scale-95 animate-pulse"
        >
          <Radio className="w-4 h-4" />
          <span>VER EN VIVO AHORA</span>
        </button>
      </div>

      {/* Right Action Column */}
      <div className="absolute right-4 bottom-24 z-20 flex flex-col space-y-5 items-center">
        <button
          onClick={() => onSelectStream(currentShort.streamer)}
          className="relative group transition-transform duration-200 hover:scale-105 active:scale-95"
        >
          <img
            src={currentShort.streamer.avatar}
            alt={currentShort.streamer.displayName}
            className="w-12 h-12 rounded-full object-cover border-2 border-rose-500 shadow-[0_0_15px_rgba(244,63,94,0.5)]"
          />
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 bg-rose-600 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full uppercase shadow">
            LIVE
          </div>
        </button>

        <div className="flex flex-col items-center space-y-1">
          <div className="p-3 bg-stone-900/75 rounded-full border border-white/10 text-rose-500 shadow-xl backdrop-blur-md">
            <Heart className="w-6 h-6 fill-rose-500" />
          </div>
          <span className="text-[10px] font-black text-stone-200">{currentShort.likes}</span>
        </div>

        <div className="flex flex-col items-center space-y-1">
          <div className="p-3 bg-stone-900/75 rounded-full border border-white/10 text-white shadow-xl backdrop-blur-md">
            <MessageCircle className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black text-stone-200">{currentShort.comments}</span>
        </div>

        <div className="flex flex-col items-center space-y-1">
          <div className="p-3 bg-stone-900/75 rounded-full border border-white/10 text-white shadow-xl backdrop-blur-md">
            <Share2 className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-black text-stone-200">Compartir</span>
        </div>
      </div>

      {/* Bottom Creator Info Card & Stream Call-To-Action */}
      <div className="relative z-10 p-4 bg-gradient-to-t from-black via-black/90 to-transparent space-y-3 pt-8">
        <div>
          <div className="text-sm font-black text-white flex items-center space-x-2">
            <span>@{currentShort.streamer.username}</span>
            <span className="bg-purple-600/90 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase border border-purple-400/30 shadow-[0_0_10px_rgba(168,85,247,0.4)]">
              Creador Verificado
            </span>
          </div>
          <p className="text-xs text-stone-300 mt-1 line-clamp-2 font-medium">{currentShort.title}</p>
        </div>

        <button
          onClick={() => onSelectStream(currentShort.streamer)}
          className="w-full bg-gradient-to-r from-amber-500 via-rose-600 to-purple-600 text-white font-black text-xs py-3 rounded-2xl shadow-[0_0_20px_rgba(244,63,94,0.5)] flex items-center justify-center space-x-2 transition-all duration-200 hover:scale-[1.02] active:scale-95"
        >
          <Radio className="w-4 h-4 text-yellow-300 animate-pulse" />
          <span>Unirse a la Transmisión EN VIVO de {currentShort.streamer.displayName}</span>
        </button>

        {/* Video switcher dots */}
        <div className="flex justify-center space-x-2 pt-1">
          {sampleShorts.map((_, idx) => (
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
