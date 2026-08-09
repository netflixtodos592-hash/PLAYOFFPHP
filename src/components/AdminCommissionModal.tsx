import React, { useState } from 'react';
import { DollarSign, ShieldCheck, Lock, TrendingUp, Coins, Gem, Sparkles, PieChart, Settings, Eye, EyeOff } from 'lucide-react';

export interface CommissionTransaction {
  id: string;
  type: 'COIN_RECHARGE' | 'GIFT_TRANSACTION';
  grossAmountUSD: number;
  grossCoins: number;
  commissionFeePercent: number;
  commissionUSD: number;
  commissionCoins: number;
  userEmail: string;
  timestamp: string;
}

interface AdminCommissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transactions: CommissionTransaction[];
  commissionPercent: number;
  onUpdateCommissionPercent: (newPercent: number) => void;
}

export const AdminCommissionModal: React.FC<AdminCommissionModalProps> = ({
  isOpen,
  onClose,
  transactions,
  commissionPercent,
  onUpdateCommissionPercent,
}) => {
  const [pinInput, setPinInput] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinError, setPinError] = useState(false);
  const [showPin, setShowPin] = useState(false);

  if (!isOpen) return null;

  const handleAuthenticate = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // Metrics Calculations
  const totalGrossUSD = transactions.reduce((acc, t) => acc + t.grossAmountUSD, 0);
  const totalCommissionUSD = transactions.reduce((acc, t) => acc + t.commissionUSD, 0);
  const totalGrossCoins = transactions.reduce((acc, t) => acc + t.grossCoins, 0);
  const totalCommissionCoins = transactions.reduce((acc, t) => acc + t.commissionCoins, 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900/95 backdrop-blur-2xl border border-amber-500/30 rounded-[32px] p-6 text-white shadow-[0_0_60px_rgba(245,158,11,0.2)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500/40 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide flex items-center space-x-1.5">
                <span>Panel Privado de Comisiones</span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-full font-mono">
                  SOLO DUENO
                </span>
              </h2>
              <p className="text-xs text-stone-400 font-medium">Ganancias de la app por cada recarga y regalo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white text-xl font-bold p-1 transition-all"
          >
            ✕
          </button>
        </div>

        {!isAuthenticated ? (
          /* Secret PIN Authorization Step */
          <div className="py-8 space-y-4">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 bg-amber-500/10 border border-amber-500/30 rounded-full flex items-center justify-center mx-auto text-amber-400">
                <Lock className="w-7 h-7" />
              </div>
              <h3 className="text-base font-black text-white">Acceso Restringido al Creador</h3>
              <p className="text-xs text-stone-400 max-w-xs mx-auto">
                Ingresa tu clave de administrador para consultar las comisiones globales de pagos y regalos.
              </p>
            </div>

            <form onSubmit={handleAuthenticate} className="max-w-xs mx-auto space-y-3">
              <div className="relative">
                <input
                  type={showPin ? 'text' : 'password'}
                  placeholder="Clave PIN (Predeterminada: 1234)"
                  value={pinInput}
                  onChange={(e) => setPinInput(e.target.value)}
                  className="w-full bg-stone-950 border border-amber-500/40 rounded-xl px-4 py-3 text-sm text-center font-mono tracking-widest text-white focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPin(!showPin)}
                  className="absolute right-3 top-3.5 text-stone-500 hover:text-stone-300"
                >
                  {showPin ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {pinError && (
                <p className="text-rose-400 text-xs text-center font-bold">
                  ⚠️ Clave incorrecta. Usa <code className="bg-rose-950 px-1 py-0.5 rounded">1234</code>
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 hover:from-amber-400 hover:to-yellow-400 text-stone-950 font-black text-xs py-3 rounded-xl shadow-[0_0_20px_rgba(245,158,11,0.4)] transition-all active:scale-95"
              >
                Desbloquear Panel de Ganancias
              </button>
            </form>
          </div>
        ) : (
          /* Authenticated Owner Commission Dashboard */
          <div className="mt-4 space-y-4 max-h-[75vh] overflow-y-auto pr-1">
            {/* Revenue Summary Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-gradient-to-br from-amber-950/60 to-stone-950 border border-amber-500/30 p-3.5 rounded-2xl">
                <div className="flex items-center space-x-1.5 text-amber-400 text-[10px] font-black uppercase tracking-wider">
                  <DollarSign className="w-4 h-4" />
                  <span>Tu Comisión USD</span>
                </div>
                <div className="text-2xl font-black text-white mt-1">
                  ${totalCommissionUSD.toFixed(2)} USD
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  De ${totalGrossUSD.toFixed(2)} USD ingresos totales
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-950/60 to-stone-950 border border-purple-500/30 p-3.5 rounded-2xl">
                <div className="flex items-center space-x-1.5 text-purple-400 text-[10px] font-black uppercase tracking-wider">
                  <Coins className="w-4 h-4" />
                  <span>Comisiones de Monedas</span>
                </div>
                <div className="text-2xl font-black text-yellow-400 mt-1">
                  +{totalCommissionCoins.toLocaleString()} 🪙
                </div>
                <div className="text-[10px] text-stone-400 mt-0.5">
                  {commissionPercent}% de tarifa por transacción
                </div>
              </div>
            </div>

            {/* Commission Rate Settings */}
            <div className="bg-stone-950 border border-white/10 rounded-2xl p-3.5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-stone-300">
                <span className="flex items-center space-x-1.5">
                  <Settings className="w-4 h-4 text-amber-400" />
                  <span>Tasa de Comisión de la Plataforma</span>
                </span>
                <span className="text-amber-400 font-mono font-black">{commissionPercent}%</span>
              </div>

              <div className="flex items-center space-x-2 pt-1">
                {[10, 15, 20, 25, 30].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => onUpdateCommissionPercent(rate)}
                    className={`flex-1 py-1.5 rounded-xl text-xs font-black transition-all ${
                      commissionPercent === rate
                        ? 'bg-amber-500 text-stone-950 shadow-[0_0_12px_rgba(245,158,11,0.5)]'
                        : 'bg-stone-900 text-stone-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {rate}%
                  </button>
                ))}
              </div>
            </div>

            {/* Transactions Audit Ledger */}
            <div>
              <div className="text-xs font-black text-stone-300 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Historial de Transacciones & Tarifas</span>
                <span className="text-[10px] text-stone-500 font-mono">{transactions.length} Registros</span>
              </div>

              {transactions.length === 0 ? (
                <div className="bg-stone-950 border border-white/5 rounded-2xl p-6 text-center text-stone-500 text-xs">
                  Aún no hay transacciones registradas. Compra monedas o envía regalos para ver tus comisiones reflejadas aquí.
                </div>
              ) : (
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {transactions.map((tx) => (
                    <div
                      key={tx.id}
                      className="bg-stone-950 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 border border-amber-500/20">
                          <TrendingUp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-white">
                            {tx.type === 'COIN_RECHARGE' ? 'Recarga de Monedas' : 'Regalo Virtual'}
                          </div>
                          <div className="text-[10px] text-stone-400 font-mono">
                            {tx.userEmail} • {tx.timestamp}
                          </div>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-amber-400 font-black">
                          +${tx.commissionUSD.toFixed(2)} USD
                        </div>
                        <div className="text-[10px] text-stone-500">
                          (${tx.grossAmountUSD.toFixed(2)} total • {tx.commissionFeePercent}%)
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-end">
              <button
                onClick={onClose}
                className="px-5 py-2 rounded-xl bg-stone-800 text-stone-300 text-xs font-bold hover:bg-stone-700"
              >
                Cerrar Panel Privado
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
