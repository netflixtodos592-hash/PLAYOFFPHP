import React, { useState } from 'react';
import { Upload, Video, X, Sparkles, Film, CheckCircle2, Lock, Users, Coins, Globe, ShieldCheck } from 'lucide-react';

interface VideoUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser?: { displayName: string; avatar: string };
  onUploadSuccess: (newVideo: {
    title: string;
    videoUrl?: string;
    category: string;
    authorName: string;
    authorAvatar: string;
    privacy?: 'public' | 'friends' | 'coins' | 'permission';
    coinPrice?: number;
  }) => void;
}

export const VideoUploadModal: React.FC<VideoUploadModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onUploadSuccess,
}) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('General');
  const [hashtags, setHashtags] = useState('#EnVivo #Viral #Creadores');
  const [privacy, setPrivacy] = useState<'public' | 'friends' | 'coins' | 'permission'>('public');
  const [coinPrice, setCoinPrice] = useState<number>(10);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsUploading(true);

    setTimeout(() => {
      onUploadSuccess({
        title: `${title} ${hashtags}`,
        videoUrl: previewUrl || undefined,
        category,
        authorName: currentUser?.displayName || 'Tú (Creador)',
        authorAvatar: currentUser?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        privacy,
        coinPrice: privacy === 'coins' ? coinPrice : undefined,
      });

      setIsUploading(false);
      setSuccess(true);

      setTimeout(() => {
        setSuccess(false);
        setTitle('');
        setSelectedFile(null);
        setPreviewUrl(null);
        setPrivacy('public');
        setCoinPrice(10);
        onClose();
      }, 1500);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 text-white shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-rose-600/20 rounded-2xl border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <Upload className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">Subir Video Corto</h2>
              <p className="text-xs text-stone-400 font-medium">Publica tu contenido en el feed principal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white text-xl font-bold p-1 transition-all"
          >
            ✕
          </button>
        </div>

        {success ? (
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-3">
            <div className="p-4 bg-emerald-500/20 border border-emerald-500/40 rounded-full text-emerald-400 animate-bounce">
              <CheckCircle2 className="w-12 h-12" />
            </div>
            <h3 className="text-xl font-black text-white">¡Video Publicado con Éxito!</h3>
            <p className="text-xs text-stone-400">Tu video ya está disponible en el feed Para Ti.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            {/* File Upload Box */}
            <div className="border-2 border-dashed border-stone-700 hover:border-rose-500/80 rounded-2xl p-4 transition-all text-center bg-stone-950/50">
              {previewUrl ? (
                <div className="relative flex flex-col items-center">
                  <video src={previewUrl} className="max-h-40 rounded-xl mb-2 border border-white/10" controls />
                  <button
                    type="button"
                    onClick={() => { setSelectedFile(null); setPreviewUrl(null); }}
                    className="text-xs text-rose-400 hover:underline flex items-center space-x-1"
                  >
                    <X className="w-3.5 h-3.5" />
                    <span>Eliminar video seleccionado</span>
                  </button>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center justify-center space-y-2 py-4">
                  <div className="p-3 bg-stone-800 rounded-full text-stone-300">
                    <Film className="w-8 h-8 text-rose-500" />
                  </div>
                  <span className="text-xs font-bold text-stone-200">
                    Haz clic para seleccionar o arrastra tu archivo de video
                  </span>
                  <span className="text-[10px] text-stone-500">MP4, MOV o WebM (Máx. 100MB)</span>
                  <input
                    type="file"
                    accept="video/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Video Title */}
            <div>
              <label className="block text-xs font-bold text-stone-300 mb-1">Título / Descripción del Video</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Ej. Reacción en vivo a la batalla de regalos 🔥"
                className="w-full bg-stone-950 border border-white/10 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>

            {/* Category & Hashtags */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Categoría</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                >
                  <option value="General">General</option>
                  <option value="Gaming">Gaming 🎮</option>
                  <option value="Música">Música 🎵</option>
                  <option value="Humor">Humor 😂</option>
                  <option value="Cocina">Cocina 🍕</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Hashtags</label>
                <input
                  type="text"
                  value={hashtags}
                  onChange={(e) => setHashtags(e.target.value)}
                  placeholder="#EnVivo #Viral"
                  className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                />
              </div>
            </div>

            {/* Privacidad & Monetización del Video */}
            <div className="bg-stone-950/80 p-3.5 border border-white/10 rounded-2xl space-y-2.5">
              <label className="block text-xs font-black text-white flex items-center space-x-1.5">
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span>Privacidad y Acceso del Video</span>
              </label>

              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                <button
                  type="button"
                  onClick={() => setPrivacy('public')}
                  className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                    privacy === 'public'
                      ? 'bg-rose-600/20 border-rose-500 text-white'
                      : 'bg-stone-900 border-white/10 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Globe className="w-4 h-4 text-emerald-400" />
                  <span>Público</span>
                  <span className="text-[9px] text-stone-400 font-normal">Gratis</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrivacy('friends')}
                  className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                    privacy === 'friends'
                      ? 'bg-purple-600/20 border-purple-500 text-white'
                      : 'bg-stone-900 border-white/10 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Users className="w-4 h-4 text-purple-400" />
                  <span>Seguidores</span>
                  <span className="text-[9px] text-stone-400 font-normal">Gratis</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrivacy('coins')}
                  className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                    privacy === 'coins'
                      ? 'bg-amber-500/20 border-amber-500 text-white'
                      : 'bg-stone-900 border-white/10 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <Coins className="w-4 h-4 text-yellow-400" />
                  <span>Monedas</span>
                  <span className="text-[9px] text-stone-400 font-normal">De Pago</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPrivacy('permission')}
                  className={`p-2 rounded-xl border text-[11px] font-bold flex flex-col items-center justify-center space-y-1 transition-all ${
                    privacy === 'permission'
                      ? 'bg-blue-600/20 border-blue-500 text-white'
                      : 'bg-stone-900 border-white/10 text-stone-400 hover:text-stone-200'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-blue-400" />
                  <span>Con Permiso</span>
                  <span className="text-[9px] text-stone-400 font-normal">Privado</span>
                </button>
              </div>

              {privacy === 'coins' && (
                <div className="pt-1.5 flex items-center justify-between bg-amber-950/30 p-2.5 rounded-xl border border-amber-500/30">
                  <span className="text-xs font-bold text-amber-200 flex items-center space-x-1">
                    <Coins className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Precio para Desbloquear:</span>
                  </span>
                  <div className="flex items-center space-x-1.5">
                    <input
                      type="number"
                      min={1}
                      max={500}
                      value={coinPrice}
                      onChange={(e) => setCoinPrice(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-16 bg-stone-900 border border-amber-500/50 rounded-lg px-2 py-1 text-xs text-center font-black text-yellow-300 focus:outline-none"
                    />
                    <span className="text-[10px] text-amber-300 font-black">Monedas</span>
                  </div>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold hover:bg-stone-700"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isUploading || !title.trim()}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white text-xs font-black shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all active:scale-95 disabled:opacity-50"
              >
                {isUploading ? 'Publicando...' : 'Publicar Video'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
