import React, { useState } from 'react';
import { Mail, Lock, User, CheckCircle2, LogIn, UserPlus, Sparkles, LogOut, Camera } from 'lucide-react';

export interface UserAccount {
  email: string;
  displayName: string;
  avatar: string;
  coins: number;
  diamonds: number;
  bio?: string;
}

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserAccount;
  onLogin: (user: UserAccount) => void;
  onLogout: () => void;
  canDismiss?: boolean;
}

const PRESET_AVATARS = [
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
];

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  onLogin,
  onLogout,
  canDismiss = true,
}) => {
  const [isRegistering, setIsRegistering] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState(PRESET_AVATARS[0]);
  const [customAvatarUrl, setCustomAvatarUrl] = useState('');
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    const formattedName = displayName.trim() || email.split('@')[0];
    const finalAvatar = customAvatarUrl.trim() || selectedAvatar;

    // Accounts start cleanly from 0 coins and 0 diamonds unless already populated
    const newAccount: UserAccount = {
      email: email.trim().toLowerCase(),
      displayName: formattedName,
      avatar: finalAvatar,
      coins: currentUser.email === email.trim().toLowerCase() ? currentUser.coins : 0,
      diamonds: currentUser.email === email.trim().toLowerCase() ? currentUser.diamonds : 0,
      bio: '¡Creador en vivo explorando la plataforma!',
    };

    onLogin(newAccount);
    setSuccessMsg(isRegistering ? '¡Cuenta registrada con exito! Saldo inicial: 0 Monedas' : '¡Sesion iniciada!');

    setTimeout(() => {
      setSuccessMsg(null);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in overflow-y-auto">
      <div className="relative w-full max-w-md bg-stone-900/95 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 text-white shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden my-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-rose-600/20 rounded-2xl border border-rose-500/30 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
              <Mail className="w-6 h-6 text-rose-500" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">
                {currentUser.email ? 'Perfil de Usuario' : isRegistering ? 'Registro de Usuario' : 'Iniciar Sesion'}
              </h2>
              <p className="text-xs text-stone-400 font-medium">Ingresa para transmitir y recargar monedas</p>
            </div>
          </div>
          {canDismiss && (
            <button
              onClick={onClose}
              className="text-stone-400 hover:text-white text-xl font-bold p-1 transition-all"
            >
              ✕
            </button>
          )}
        </div>

        {/* Current Active Account Card */}
        {currentUser.email && (
          <div className="my-4 bg-gradient-to-r from-stone-950 via-stone-900 to-stone-950 border border-white/10 p-4 rounded-2xl flex items-center justify-between shadow-inner">
            <div className="flex items-center space-x-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.displayName}
                className="w-12 h-12 rounded-full object-cover border-2 border-rose-500 shadow-md"
              />
              <div>
                <div className="text-sm font-black text-white">{currentUser.displayName}</div>
                <div className="text-xs text-stone-400 font-mono">{currentUser.email}</div>
                <div className="text-[10px] text-yellow-400 font-bold mt-0.5">
                  Saldo: {currentUser.coins} Monedas | {currentUser.diamonds} 💎
                </div>
              </div>
            </div>

            <button
              onClick={() => {
                onLogout();
                setSuccessMsg('Sesión cerrada correctamente.');
                setTimeout(() => setSuccessMsg(null), 1500);
              }}
              className="p-2.5 bg-rose-950/80 hover:bg-rose-900 text-rose-300 rounded-xl border border-rose-800 transition-all flex items-center space-x-1 text-xs font-bold"
              title="Cerrar Sesión"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Success / Alert */}
        {successMsg && (
          <div className="my-3 bg-emerald-950/90 border border-emerald-500/80 text-emerald-200 p-3 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Registration Form */}
        <form onSubmit={handleSubmit} className="mt-3 space-y-3.5">
          {isRegistering && (
            <>
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1">Nombre de Usuario o Perfil</label>
                <div className="relative">
                  <User className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    placeholder="Ej. Sofía Gamer 🌸"
                    className="w-full bg-stone-950 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
                  />
                </div>
              </div>

              {/* Avatar Picker */}
              <div>
                <label className="block text-xs font-bold text-stone-300 mb-1.5 flex items-center justify-between">
                  <span>Selecciona una Foto de Perfil / Avatar</span>
                  <Camera className="w-3.5 h-3.5 text-rose-400" />
                </label>
                <div className="flex space-x-2 mb-2">
                  {PRESET_AVATARS.map((avatarUrl, idx) => (
                    <button
                      type="button"
                      key={idx}
                      onClick={() => {
                        setSelectedAvatar(avatarUrl);
                        setCustomAvatarUrl('');
                      }}
                      className={`relative p-0.5 rounded-full transition-all ${
                        selectedAvatar === avatarUrl && !customAvatarUrl
                          ? 'ring-2 ring-rose-500 scale-110'
                          : 'opacity-60 hover:opacity-100'
                      }`}
                    >
                      <img src={avatarUrl} alt="Avatar" className="w-9 h-9 rounded-full object-cover" />
                    </button>
                  ))}
                </div>
                <input
                  type="url"
                  value={customAvatarUrl}
                  onChange={(e) => setCustomAvatarUrl(e.target.value)}
                  placeholder="O pega URL de imagen personalizada..."
                  className="w-full bg-stone-950 border border-white/10 rounded-xl px-3 py-1.5 text-[11px] text-stone-300 focus:outline-none focus:border-rose-500"
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">Correo Electronico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu.correo@ejemplo.com"
                className="w-full bg-stone-950 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-300 mb-1">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-stone-950 border border-white/10 rounded-xl pl-9 pr-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-rose-600 via-pink-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white font-black text-xs py-3 rounded-2xl shadow-[0_0_15px_rgba(244,63,94,0.5)] transition-all active:scale-95 flex items-center justify-center space-x-2"
          >
            {isRegistering ? <UserPlus className="w-4 h-4" /> : <LogIn className="w-4 h-4" />}
            <span>{isRegistering ? 'Registrarme e Ingresar (0 Monedas)' : 'Entrar con mi Correo'}</span>
          </button>
        </form>

        {/* Toggle Register / Login */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-xs text-rose-400 hover:underline font-bold"
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia Sesion' : '¿No tienes cuenta? Registrate gratis'}
          </button>
        </div>
      </div>
    </div>
  );
};

