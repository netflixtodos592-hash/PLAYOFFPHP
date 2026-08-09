import React, { useState } from 'react';
import { User, CheckCircle2, Radio, Video, Plus, Heart, Eye, Film, Share2, Award, Sparkles, UserPlus, UserCheck } from 'lucide-react';
import { ShortItem } from './ShortsFeed';
import { Streamer } from '../types';
import { DIVERSE_ALGORITHM_SHORTS } from '../data/shortsData';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: {
    username: string;
    displayName: string;
    avatar: string;
    bio?: string;
    followers?: number;
    following?: number;
    isVerified?: boolean;
    isLive?: boolean;
    streamerId?: string;
    email?: string;
  } | null;
  currentUser: {
    email: string;
    displayName: string;
    avatar: string;
  };
  userVideos: ShortItem[];
  isFollowingExternal?: boolean;
  onToggleFollowExternal?: (username: string) => void;
  followingCount?: number;
  onOpenUploadModal: () => void;
  onOpenLiveBroadcaster: () => void;
  onSelectStreamer?: (streamerId: string) => void;
  onPlayVideo?: (video: ShortItem) => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  isOpen,
  onClose,
  profileData,
  currentUser,
  userVideos,
  isFollowingExternal = false,
  onToggleFollowExternal,
  followingCount = 0,
  onOpenUploadModal,
  onOpenLiveBroadcaster,
  onSelectStreamer,
  onPlayVideo,
}) => {
  const [internalFollowing, setInternalFollowing] = useState(false);
  const [activeTab, setActiveTab] = useState<'videos' | 'about'>('videos');

  if (!isOpen || !profileData) return null;

  const isFollowing = onToggleFollowExternal ? isFollowingExternal : internalFollowing;

  const handleFollowClick = () => {
    if (onToggleFollowExternal) {
      onToggleFollowExternal(profileData.username);
    } else {
      setInternalFollowing(!internalFollowing);
    }
  };

  const isOwnProfile =
    (profileData.email && profileData.email === currentUser.email) ||
    profileData.username.toLowerCase() === currentUser.email.split('@')[0].toLowerCase() ||
    profileData.displayName.toLowerCase() === currentUser.displayName.toLowerCase();

  // Combine user custom videos and algorithm dataset videos
  const allAvailableVideos = [...userVideos, ...DIVERSE_ALGORITHM_SHORTS];

  // Filter videos belonging strictly to this profile
  let profileVideos = allAvailableVideos.filter(
    (v) =>
      v.streamer.username.toLowerCase() === profileData.username.toLowerCase() ||
      v.streamer.displayName.toLowerCase() === profileData.displayName.toLowerCase()
  );

  // Fallback: If profile has no explicit videos, generate sample channel clips so every profile displays uploaded content!
  if (profileVideos.length === 0 && !isOwnProfile) {
    profileVideos = [
      {
        id: `profile-clip-1-${profileData.username}`,
        title: `🔥 ¡Bienvenidos a mi canal oficial! clip destacado de ${profileData.displayName} #Viral #LiveStream`,
        likes: '45.2k',
        comments: '890',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-vertical-shot-of-a-gamer-playing-video-games-51642-large.mp4',
        streamer: {
          username: profileData.username,
          displayName: profileData.displayName,
          avatar: profileData.avatar,
          id: profileData.streamerId
        }
      },
      {
        id: `profile-clip-2-${profileData.username}`,
        title: `Lo mejor de mis mejores momentos en vivo ✨ ¡Gracias por el apoyo! ❤️`,
        likes: '28.9k',
        comments: '412',
        videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-man-dancing-under-the-lights-of-a-club-42398-large.mp4',
        streamer: {
          username: profileData.username,
          displayName: profileData.displayName,
          avatar: profileData.avatar,
          id: profileData.streamerId
        }
      }
    ];
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-stone-900/95 backdrop-blur-2xl border border-white/10 rounded-[32px] overflow-hidden text-white shadow-[0_0_50px_rgba(0,0,0,0.9)] my-auto max-h-[90vh] flex flex-col">
        {/* Profile Banner */}
        <div className="relative h-28 bg-gradient-to-r from-rose-900 via-purple-900 to-indigo-950 p-4">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 bg-black/50 hover:bg-black/80 text-white rounded-full p-1.5 text-xs font-bold transition-all z-10"
          >
            ✕
          </button>
        </div>

        {/* Profile Avatar & Header */}
        <div className="px-6 pb-4 pt-0 relative flex flex-col items-center -mt-12">
          <div className="relative">
            <img
              src={profileData.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80'}
              alt={profileData.displayName}
              className="w-24 h-24 rounded-full object-cover border-4 border-stone-900 shadow-2xl"
            />
            {profileData.isLive && (
              <span className="absolute bottom-1 right-0 bg-rose-600 text-[10px] font-black px-2 py-0.5 rounded-full text-white border border-stone-900 animate-pulse flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-white" />
                <span>LIVE</span>
              </span>
            )}
          </div>

          <div className="text-center mt-2.5">
            <h2 className="text-lg font-black text-white flex items-center justify-center space-x-1.5">
              <span>{profileData.displayName}</span>
              {(profileData.isVerified || isOwnProfile) && (
                <CheckCircle2 className="w-4 h-4 text-blue-400 fill-blue-400" />
              )}
            </h2>
            <p className="text-xs text-rose-400 font-bold">@{profileData.username}</p>
            <p className="text-xs text-stone-300 mt-1 max-w-xs mx-auto font-medium">
              {profileData.bio || '¡Creador activo compartiendo contenido y transmisiones en vivo! 🚀'}
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-around w-full mt-4 py-2.5 bg-stone-950/80 rounded-2xl border border-white/5 text-center">
            <div>
              <div className="text-sm font-black text-white">
                {isOwnProfile ? followingCount : (profileData.following || 0)}
              </div>
              <div className="text-[10px] text-stone-400 font-bold uppercase">Siguiendo</div>
            </div>
            <div className="h-6 w-px bg-white/10" />
            <div>
              <div className="text-sm font-black text-rose-400">{profileVideos.length}</div>
              <div className="text-[10px] text-stone-400 font-bold uppercase">Publicaciones</div>
            </div>
          </div>

          {/* Profile Action Buttons */}
          <div className="flex items-center space-x-2 w-full mt-4">
            {isOwnProfile ? (
              <>
                <button
                  onClick={() => {
                    onClose();
                    onOpenLiveBroadcaster();
                  }}
                  className="flex-1 bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-black text-xs py-2.5 rounded-xl shadow-[0_0_15px_rgba(244,63,94,0.4)] flex items-center justify-center space-x-1.5 active:scale-95 transition-all"
                >
                  <Radio className="w-4 h-4" />
                  <span>Transmitir en Vivo</span>
                </button>
                <button
                  onClick={() => {
                    onClose();
                    onOpenUploadModal();
                  }}
                  className="bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs px-3 py-2.5 rounded-xl border border-white/10 flex items-center space-x-1 active:scale-95 transition-all"
                >
                  <Plus className="w-4 h-4 text-rose-400" />
                  <span>Subir Video</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={handleFollowClick}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all ${
                    isFollowing
                      ? 'bg-stone-800 text-stone-300 border border-white/10'
                      : 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-[0_0_15px_rgba(244,63,94,0.4)]'
                  }`}
                >
                  {isFollowing ? <UserCheck className="w-4 h-4" /> : <UserPlus className="w-4 h-4" />}
                  <span>{isFollowing ? 'Siguiendo' : 'Seguir Perfil'}</span>
                </button>

                {profileData.streamerId && (
                  <button
                    onClick={() => {
                      if (onSelectStreamer && profileData.streamerId) {
                        onSelectStreamer(profileData.streamerId);
                        onClose();
                      }
                    }}
                    className="bg-purple-600 hover:bg-purple-500 text-white font-black text-xs px-3.5 py-2.5 rounded-xl flex items-center space-x-1 shadow-[0_0_15px_rgba(168,85,247,0.4)] active:scale-95 transition-all"
                  >
                    <Radio className="w-4 h-4" />
                    <span>Ver Vivo</span>
                  </button>
                )}
              </>
            )}
          </div>
        </div>

        {/* Profile Content Tabs */}
        <div className="flex border-b border-white/10 px-6">
          <button
            onClick={() => setActiveTab('videos')}
            className={`flex-1 py-2.5 text-xs font-black border-b-2 flex items-center justify-center space-x-1 transition-all ${
              activeTab === 'videos'
                ? 'border-rose-500 text-white'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <Film className="w-3.5 h-3.5" />
            <span>Videos ({profileVideos.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('about')}
            className={`flex-1 py-2.5 text-xs font-black border-b-2 flex items-center justify-center space-x-1 transition-all ${
              activeTab === 'about'
                ? 'border-rose-500 text-white'
                : 'border-transparent text-stone-400 hover:text-stone-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>Información</span>
          </button>
        </div>

        {/* Videos Grid */}
        <div className="p-4 overflow-y-auto flex-1 max-h-64">
          {activeTab === 'videos' ? (
            profileVideos.length === 0 ? (
              <div className="py-8 text-center text-stone-400">
                <Film className="w-8 h-8 mx-auto text-stone-600 mb-2" />
                <p className="text-xs font-bold text-stone-300">Este perfil aún no ha subido videos.</p>
                {isOwnProfile && (
                  <button
                    onClick={() => {
                      onClose();
                      onOpenUploadModal();
                    }}
                    className="mt-3 px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs rounded-xl shadow transition-all"
                  >
                    ¡Subir mi primer video!
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2.5">
                {profileVideos.map((video) => (
                  <div
                    key={video.id}
                    onClick={() => {
                      if (onPlayVideo) {
                        onPlayVideo(video);
                        onClose();
                      }
                    }}
                    className="group relative bg-stone-950 border border-white/10 rounded-2xl overflow-hidden aspect-[3/4] cursor-pointer hover:border-rose-500/50 transition-all"
                  >
                    {video.videoUrl ? (
                      <video src={video.videoUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-purple-950 to-stone-900 flex items-center justify-center">
                        <Film className="w-8 h-8 text-rose-500/50" />
                      </div>
                    )}

                    {/* Privacy Badge */}
                    {video.privacy === 'coins' && (
                      <div className="absolute top-2 right-2 bg-amber-500/90 text-stone-950 font-black text-[9px] px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-lg">
                        <span>🔒 {video.coinPrice || 10} 🪙</span>
                      </div>
                    )}
                    {video.privacy === 'friends' && (
                      <div className="absolute top-2 right-2 bg-purple-600/90 text-white font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-lg">
                        <span>👥 Seguidores</span>
                      </div>
                    )}
                    {video.privacy === 'permission' && (
                      <div className="absolute top-2 right-2 bg-blue-600/90 text-white font-bold text-[9px] px-2 py-0.5 rounded-full flex items-center space-x-1 shadow-lg">
                        <span>🛡️ Con Permiso</span>
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent p-2.5 flex flex-col justify-end">
                      <p className="text-[11px] font-bold text-white line-clamp-2 leading-tight">{video.title}</p>
                      <div className="flex items-center justify-between text-[10px] text-stone-300 mt-1">
                        <span className="flex items-center space-x-0.5">
                          <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
                          <span>{video.likes}</span>
                        </span>
                        <span>{video.comments} 💬</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          ) : (
            <div className="space-y-3 text-xs text-stone-300 p-2">
              <div className="bg-stone-950 p-3 rounded-2xl border border-white/5">
                <div className="font-bold text-white mb-1">Acerca del Canal</div>
                <p className="text-stone-400 leading-relaxed">
                  {profileData.bio || 'Canal oficial verificado. Transmisiones en vivo todos los días.'}
                </p>
              </div>
              <div className="bg-stone-950 p-3 rounded-2xl border border-white/5 flex items-center justify-between">
                <span>Estado de Verificación</span>
                <span className="text-blue-400 font-bold flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5 fill-blue-400" />
                  <span>Verificado</span>
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
