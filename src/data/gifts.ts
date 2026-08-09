import { GiftItem } from '../types';

export const GIFTS_CATALOG: GiftItem[] = [
  // Popular (1 - 99 Coins)
  {
    id: 'rose',
    name: 'Rose',
    spanishName: 'Rosa',
    icon: '🌹',
    coinPrice: 1,
    diamondValue: 1,
    category: 'popular',
    animationType: 'rose_shower',
    description: '¡El clásico regalo de afecto!'
  },
  {
    id: 'ice_cream',
    name: 'Ice Cream',
    spanishName: 'Helado',
    icon: '🍦',
    coinPrice: 1,
    diamondValue: 1,
    category: 'popular',
    animationType: 'bounce',
    description: 'Un dulce detalle para la transmisión.'
  },
  {
    id: 'finger_heart',
    name: 'Finger Heart',
    spanishName: 'Corazoncito',
    icon: '🫰',
    coinPrice: 5,
    diamondValue: 3,
    category: 'popular',
    animationType: 'sparkle',
    description: 'Envía mucho amor a tu streamer.'
  },
  {
    id: 'donut',
    name: 'Doughnut',
    spanishName: 'Dona',
    icon: '🍩',
    coinPrice: 10,
    diamondValue: 5,
    category: 'popular',
    animationType: 'bounce',
    description: 'Deliciosa donación para mantener la energía.'
  },
  {
    id: 'paper_plane',
    name: 'Paper Plane',
    spanishName: 'Avión de Papel',
    icon: '✈️',
    coinPrice: 50,
    diamondValue: 25,
    category: 'popular',
    animationType: 'sparkle',
    description: 'Un mensaje directo al corazón del creador.'
  },

  // Exclusivos (99 - 999 Coins)
  {
    id: 'crown',
    name: 'Royal Crown',
    spanishName: 'Corona Real',
    icon: '👑',
    coinPrice: 99,
    diamondValue: 50,
    category: 'exclusive',
    animationType: 'sparkle',
    description: 'Corona al streamer como rey de la noche.'
  },
  {
    id: 'disco_ball',
    name: 'Disco Ball',
    spanishName: 'Bola Disco',
    icon: '🪩',
    coinPrice: 299,
    diamondValue: 150,
    category: 'exclusive',
    animationType: 'sparkle',
    description: '¡Desata la fiesta de luces en el chat!'
  },
  {
    id: 'space_rocket',
    name: 'Space Rocket',
    spanishName: 'Cohete Espacial',
    icon: '🚀',
    coinPrice: 500,
    diamondValue: 250,
    category: 'exclusive',
    animationType: 'rocket',
    description: 'Despega la transmisión directo a la Luna.'
  },

  // Lujo (1,000 - 9,999 Coins)
  {
    id: 'sports_car',
    name: 'Sports Car',
    spanishName: 'Auto Deportivo Ferrari',
    icon: '🏎️',
    coinPrice: 1000,
    diamondValue: 500,
    category: 'luxury',
    animationType: 'ferrari',
    description: 'Acelera a toda velocidad en vivo con motor rugiendo.'
  },
  {
    id: 'private_jet',
    name: 'Private Jet',
    spanishName: 'Jet Privado',
    icon: '🛩️',
    coinPrice: 3000,
    diamondValue: 1500,
    category: 'luxury',
    animationType: 'rocket',
    description: 'Vuela alto en la clasificación de donantes.'
  },
  {
    id: 'dream_castle',
    name: 'Dream Castle',
    spanishName: 'Castillo de Sueños',
    icon: '🏰',
    coinPrice: 5000,
    diamondValue: 2500,
    category: 'luxury',
    animationType: 'castle',
    description: 'Construye un imperio de diamantes para el creador.'
  },

  // Legendarios (10,000+ Coins)
  {
    id: 'galaxy',
    name: 'TikTok Galaxy',
    spanishName: 'Galaxia TikTok',
    icon: '🪐',
    coinPrice: 10000,
    diamondValue: 5000,
    category: 'legendary',
    animationType: 'galaxy',
    description: 'Un espectáculo cósmico que ilumina toda la app.'
  },
  {
    id: 'golden_lion',
    name: 'Golden Lion',
    spanishName: 'León Dorado',
    icon: '🦁',
    coinPrice: 29999,
    diamondValue: 15000,
    category: 'legendary',
    animationType: 'lion',
    description: '¡EL REGALO MÁS LEGENDARIO! Un rugido dorado que conmociona el LIVE.'
  }
];
