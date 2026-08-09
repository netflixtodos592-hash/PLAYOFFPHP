import { ShortItem } from '../components/ShortsFeed';

export interface AlgorithmicShort extends ShortItem {
  category: 'Gaming' | 'Música' | 'Deportes' | 'Cocina' | 'Humor' | 'Tecnología' | 'Arte' | 'Viajes' | 'Mascotas' | 'Fitness';
  audioTrack: string;
  shares: string;
  isTrending?: boolean;
}

export const DIVERSE_ALGORITHM_SHORTS: AlgorithmicShort[] = [
  {
    id: 'vid-gaming-1',
    title: '¡Jugada épica en el último segundo del torneo! 🎮🔥 ¿Cómo sobreviví a esto? #Gaming #Clips #Esports #ProPlayer',
    likes: '184.2k',
    comments: '3,820',
    shares: '12.4k',
    category: 'Gaming',
    audioTrack: 'Audio Original - ProGamer_99 🎵',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-gamer-playing-video-games-51642-large.mp4',
    isTrending: true,
    streamer: {
      username: 'gamer_pro_99',
      displayName: 'Alex Esports 🎮',
      avatar: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?w=150&auto=format&fit=crop&q=80',
      streamBgGradient: 'from-purple-950 via-indigo-900 to-black',
      id: 'streamer-gaming-1'
    }
  },
  {
    id: 'vid-music-1',
    title: 'Mezclando ritmos latinos con electrónica en vivo en el festival 🎧🔥 #DJ #LiveMusic #EDM #Party',
    likes: '245.9k',
    comments: '4,150',
    shares: '19.8k',
    category: 'Música',
    privacy: 'coins',
    coinPrice: 15,
    audioTrack: 'Mix Latino Electro 2026 - DJ Beat 🎶',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-close-up-of-a-dj-adjusting-knobs-41527-large.mp4',
    isTrending: true,
    streamer: {
      username: 'dj_beat_official',
      displayName: 'DJ Beat Master 🎧',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      streamBgGradient: 'from-rose-950 via-pink-900 to-slate-950',
      id: 'streamer-2'
    }
  },
  {
    id: 'vid-sports-1',
    title: 'Truco extremo de skate en las calles de Barcelona 🛹🔥 ¡Casi pierdo la tabla! #Skate #Extreme #StreetStyle',
    likes: '98.4k',
    comments: '1,420',
    shares: '5.2k',
    category: 'Deportes',
    audioTrack: 'Rock Urbano Instrumental - SkateBeat 🎸',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-skater-performing-a-trick-42898-large.mp4',
    isTrending: false,
    streamer: {
      username: 'skate_king_bcn',
      displayName: 'Leo Skate 🛹',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
      streamBgGradient: 'from-amber-950 via-orange-900 to-black'
    }
  },
  {
    id: 'vid-cooking-1',
    title: 'Receta secreta de Pizza Napolitana artesanal con masa madre 🍕👨‍🍳 ¡Miren ese queso! #Cocina #Pizza #Recetas',
    likes: '312.1k',
    comments: '5,890',
    shares: '34.1k',
    category: 'Cocina',
    audioTrack: 'Italian Chef Beats - MasterChef 🍝',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-cooking-a-pizza-41584-large.mp4',
    isTrending: true,
    streamer: {
      username: 'chef_mario',
      displayName: 'Chef Mario 🍕',
      avatar: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=150&auto=format&fit=crop&q=80',
      streamBgGradient: 'from-emerald-950 via-teal-900 to-black'
    }
  },
  {
    id: 'vid-dance-1',
    title: 'Coreografía urbana bajo luces neón 💃✨ ¿Quién se suma al trend? #Dance #Trend #UrbanStyle #Neon',
    likes: '410.8k',
    comments: '9,120',
    shares: '48.2k',
    category: 'Arte',
    privacy: 'friends',
    audioTrack: 'Urban Dance Trend 2026 🎵',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-the-lights-of-a-club-42398-large.mp4',
    isTrending: true,
    streamer: {
      username: 'valen_dance',
      displayName: 'Valen Dencer 💃',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      streamBgGradient: 'from-fuchsia-950 via-purple-900 to-black'
    }
  },
  {
    id: 'vid-sports-2',
    title: 'Ruta de montaña en bicicleta a máxima velocidad 🚵‍♂️ Cuidado con las curvas #MTB #Ciclismo #Aventura',
    likes: '67.3k',
    comments: '890',
    shares: '3.1k',
    category: 'Deportes',
    audioTrack: 'Adventure Energy Beat 🔊',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-cyclist-riding-on-a-mountain-road-42981-large.mp4',
    isTrending: false,
    streamer: {
      username: 'mtb_extreme',
      displayName: 'Dani MTB 🚵',
      avatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
      streamBgGradient: 'from-cyan-950 via-blue-900 to-black'
    }
  },
  {
    id: 'vid-pets-1',
    title: 'Mi perro Pug cuando le digo que vamos al parque 🐶❤️ ¡Miren su carita! #Mascotas #Pug #DogLovers #Humor',
    likes: '520.4k',
    comments: '11,300',
    shares: '62.0k',
    category: 'Mascotas',
    audioTrack: 'Funny Dog Song - PetVibes 🎵',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-a-pug-dog-looking-at-the-camera-42921-large.mp4',
    isTrending: true,
    streamer: {
      username: 'pug_rocky',
      displayName: 'Rocky the Pug 🐶',
      avatar: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&auto=format&fit=crop&q=80',
      streamBgGradient: 'from-amber-950 via-yellow-900 to-black'
    }
  },
  {
    id: 'vid-fitness-1',
    title: 'Rutina de Yoga al amanecer frente al mar 🧘‍♀️🌅 Conecta con tu respiración #Yoga #Wellness #Mindfulness',
    likes: '128.9k',
    comments: '2,100',
    shares: '9.4k',
    category: 'Fitness',
    audioTrack: 'Ambient Relaxation Piano 🎹',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-doing-yoga-on-the-beach-42998-large.mp4',
    isTrending: false,
    streamer: {
      username: 'valen_asmr',
      displayName: 'Valen ASMR & Chill 💤',
      avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
      streamBgGradient: 'from-cyan-950 via-teal-900 to-slate-950',
      id: 'streamer-3'
    }
  },
  {
    id: 'vid-tech-1',
    title: 'Probando la nueva tecnología de pantallas holográficas 📱⚡️ ¡El futuro ya está aquí! #Tech #Innovation #Gadgets',
    likes: '290.5k',
    comments: '4,890',
    shares: '21.3k',
    category: 'Tecnología',
    audioTrack: 'Cyberpunk Synthwave ⚡️',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-green-screen-41221-large.mp4',
    isTrending: true,
    streamer: {
      username: 'tech_future_lab',
      displayName: 'Future Tech 🤖',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
      streamBgGradient: 'from-blue-950 via-indigo-950 to-black'
    }
  },
  {
    id: 'vid-travel-1',
    title: 'Atardecer inolvidable en el océano Pacífico 🌅🌊 Mencioná a esa persona especial #Viajes #Sunset #Ocean',
    likes: '380.1k',
    comments: '6,400',
    shares: '29.7k',
    category: 'Viajes',
    audioTrack: 'Chill Waves Acoustic - TravelBeats 🏖️',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-sunset-over-the-ocean-51680-large.mp4',
    isTrending: true,
    streamer: {
      username: 'travel_nomad',
      displayName: 'Sofia Viajes ✈️',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150&auto=format&fit=crop&q=80',
      streamBgGradient: 'from-orange-950 via-amber-950 to-black'
    }
  }
];

// Algorithmic Feed Generator based on selection & weighted shuffle
export function getAlgorithmicShortsFeed(
  categoryFilter: string = 'Todos',
  tabMode: 'para_ti' | 'tendencias' | 'siguiendo' = 'para_ti',
  customShorts: ShortItem[] = []
): AlgorithmicShort[] {
  let baseList: AlgorithmicShort[] = [...customShorts.map(c => ({
    ...c,
    category: 'Gaming' as const,
    audioTrack: 'Sonido Original del Creador 🎤',
    shares: '1.2k'
  })), ...DIVERSE_ALGORITHM_SHORTS];

  // Category filter
  if (categoryFilter !== 'Todos') {
    baseList = baseList.filter(item => item.category === categoryFilter);
  }

  // Tab Mode Filter / Sort
  if (tabMode === 'tendencias') {
    baseList.sort((a, b) => (b.isTrending ? 1 : 0) - (a.isTrending ? 1 : 0));
  } else if (tabMode === 'siguiendo') {
    // Prioritize user created / custom shorts or specific followed streamers
    baseList.sort((a, b) => (a.id.startsWith('custom-') ? -1 : 1));
  } else {
    // Algorithmic smart shuffle ("Para Ti")
    baseList = [...baseList].sort(() => Math.random() - 0.5);
  }

  return baseList;
}
