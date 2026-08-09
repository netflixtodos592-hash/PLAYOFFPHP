import { Streamer, TopGifter } from '../types';

export const MOCK_STREAMERS: Streamer[] = [
  {
    id: 'streamer-2',
    username: 'carlos_music',
    displayName: 'Carlos Guitarras 🎸',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    bio: 'Cantando tus canciones favoritas en vivo. Envíame un regalo y te dedico un tema 🎵',
    followers: 0,
    isLive: true,
    category: 'Música',
    streamTitle: '🎤 Noche de Acústico & Peticiones en Vivo | ¿Qué canción quieres escuchar?',
    viewerCount: 3890,
    diamondCount: 42800,
    streamBgGradient: 'from-rose-950 via-pink-900 to-slate-950',
    giftGoal: {
      title: 'Meta: Nueva Micrófono Estudio 🎙️',
      currentCoins: 8900,
      targetCoins: 10000,
      rewardGift: 'Jet Privado'
    }
  },
  {
    id: 'streamer-3',
    username: 'valen_asmr',
    displayName: 'Valen ASMR & Chill 💤',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    bio: 'Relájate después de un largo día. Tapping, whisper, binaural 🎧',
    followers: 0,
    isLive: true,
    category: 'ASMR',
    streamTitle: '🎧 ASMR Suave para Dormir Profundo | Sonidos con Micrófono de Cristal ✨',
    viewerCount: 2150,
    diamondCount: 29100,
    streamBgGradient: 'from-cyan-950 via-teal-900 to-slate-950',
    giftGoal: {
      title: 'Meta: Micrófono 3D Binaural 🎙️',
      currentCoins: 6500,
      targetCoins: 8000,
      rewardGift: 'Castillo de Sueños'
    }
  },
  {
    id: 'streamer-4',
    username: 'mateo_cooks',
    displayName: 'Chef Mateo 👨‍🍳',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    bio: 'Recetas rápidas de cocina italiana y postres deliciosos en tiempo real 🍕',
    followers: 0,
    isLive: true,
    category: 'Cocina',
    streamTitle: '🍕 HACIENDO PIZZA ARTESANAL DESDE CERO | Respondiendo preguntas de cocina',
    viewerCount: 870,
    diamondCount: 9200,
    streamBgGradient: 'from-amber-950 via-orange-900 to-stone-950',
    giftGoal: {
      title: 'Meta: Horno de Piedra Pro 🍕',
      currentCoins: 1200,
      targetCoins: 3000,
      rewardGift: 'Auto Deportivo'
    }
  }
];

export const TOP_GIFTERS_LEADERBOARD: TopGifter[] = [
  {
    id: 'user-king',
    name: 'ElPatron_VIP 👑',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    level: 48,
    totalGiftedCoins: 145000
  },
  {
    id: 'user-star',
    name: 'Estrella_Gamer ✨',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    level: 42,
    totalGiftedCoins: 98200
  },
  {
    id: 'user-whale',
    name: 'Donante_Misterio 🐋',
    avatar: 'https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100&auto=format&fit=crop&q=80',
    level: 39,
    totalGiftedCoins: 76400
  },
  {
    id: 'user-fan',
    name: 'Matias_Pro 🚀',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    level: 28,
    totalGiftedCoins: 34100
  }
];
