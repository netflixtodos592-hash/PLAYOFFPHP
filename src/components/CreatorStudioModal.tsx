import React, { useState, useEffect } from 'react';
import { UserWallet, WithdrawalRecord, TopGifter } from '../types';
import { TOP_GIFTERS_LEADERBOARD } from '../data/mockStreams';
import { DollarSign, Gem, ArrowDownToLine, CheckCircle2, History, Trophy, Wallet, ShieldCheck, RefreshCw } from 'lucide-react';

interface CreatorStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  wallet: UserWallet;
  onWithdrawSuccess: (newWallet: UserWallet) => void;
}

export const CreatorStudioModal: React.FC<CreatorStudioModalProps> = ({
  isOpen,
  onClose,
  wallet,
  onWithdrawSuccess
}) => {
  const [activeTab, setActiveTab] = useState<'cashout' | 'history' | 'leaderboard'>('cashout');
  const [diamondsToWithdraw, setDiamondsToWithdraw] = useState<number>(5000);
  const [paymentMethod, setPaymentMethod] = useState<'paypal' | 'mercadopago' | 'bank_transfer'>('paypal');
  const [accountDetails, setAccountDetails] = useState<string>('mi_correo@paypal.com');
  const [withdrawHistory, setWithdrawHistory] = useState<WithdrawalRecord[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successNotice, setSuccessNotice] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      fetchWithdrawals();
    }
  }, [isOpen]);

  const fetchWithdrawals = async () => {
    try {
      const res = await fetch('/api/creator/withdrawals');
      const data = await res.json();
      if (data.success && data.history) {
        setWithdrawHistory(data.history);
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isOpen) return null;

  const usdValue = +(diamondsToWithdraw * 0.005).toFixed(2);
  const totalUsdBalance = +(wallet.diamonds * 0.005).toFixed(2);
  const minRequired = 1000;

  const handleWithdraw = async () => {
    if (diamondsToWithdraw < minRequired) {
      setErrorMessage(`El monto mínimo de retiro es ${minRequired} Diamantes ($5.00 USD).`);
      return;
    }

    if (diamondsToWithdraw > wallet.diamonds) {
      setErrorMessage('No tienes suficientes Diamantes para retirar esa cantidad.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessNotice(null);

    try {
      const res = await fetch('/api/creator/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amountDiamonds: diamondsToWithdraw,
          paymentMethod,
          accountDetails
        })
      });

      const data = await res.json();
      if (data.success) {
        setSuccessNotice(data.message);
        onWithdrawSuccess(data.wallet);
        if (data.history) setWithdrawHistory(data.history);
      } else {
        setErrorMessage(data.error || 'Error al procesar la solicitud.');
      }
    } catch (err) {
      setErrorMessage('Error de conexión con el servidor.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-xl bg-stone-900/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 text-white shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-500/20 rounded-2xl border border-purple-500/30 shadow-[0_0_15px_rgba(168,85,247,0.2)]">
              <Gem className="w-6 h-6 text-purple-400 fill-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">Panel de Creador & Monetización</h2>
              <p className="text-xs text-stone-400 font-medium">Retira tus ingresos generados en transmisiones LIVE</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white text-xl font-bold p-1 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex space-x-2 my-4 border-b border-white/10 pb-2.5">
          <button
            onClick={() => setActiveTab('cashout')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all duration-200 ${
              activeTab === 'cashout'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-stone-800/40 text-stone-400 hover:text-white hover:bg-stone-800/80 border border-white/5'
            }`}
          >
            <ArrowDownToLine className="w-4 h-4" />
            <span>Retirar Fondos</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-stone-800/40 text-stone-400 hover:text-white hover:bg-stone-800/80 border border-white/5'
            }`}
          >
            <History className="w-4 h-4" />
            <span>Historial de Pagos</span>
          </button>
          <button
            onClick={() => setActiveTab('leaderboard')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center space-x-1.5 transition-all duration-200 ${
              activeTab === 'leaderboard'
                ? 'bg-purple-600 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]'
                : 'bg-stone-800/40 text-stone-400 hover:text-white hover:bg-stone-800/80 border border-white/5'
            }`}
          >
            <Trophy className="w-4 h-4 text-yellow-400" />
            <span>Top Donadores</span>
          </button>
        </div>

        {/* Balance Card Summary */}
        <div className="bg-gradient-to-r from-purple-950/80 via-stone-900 to-indigo-950/80 border border-purple-500/30 rounded-2xl p-4 mb-4 flex items-center justify-between shadow-[0_0_20px_rgba(168,85,247,0.15)] backdrop-blur-md">
          <div>
            <div className="text-xs font-bold text-purple-300 uppercase tracking-wider">Saldo de Diamantes Acumulados</div>
            <div className="text-3xl font-black text-white flex items-center space-x-2 mt-0.5 drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]">
              <Gem className="w-7 h-7 text-purple-400 fill-purple-400 animate-pulse" />
              <span>{wallet.diamonds.toLocaleString()} 💎</span>
            </div>
            <div className="text-xs text-emerald-400 font-extrabold mt-1 flex items-center space-x-1">
              <DollarSign className="w-3.5 h-3.5" />
              <span>Valor Estimado: ${totalUsdBalance.toFixed(2)} USD</span>
            </div>
          </div>

          <div className="text-right">
            <div className="text-[11px] text-stone-400 font-semibold">Tasa de Conversión</div>
            <div className="text-xs font-bold text-stone-200 mt-0.5">100 Monedas = 50 💎</div>
            <div className="text-xs font-extrabold text-purple-400">1,000 💎 = $5.00 USD</div>
          </div>
        </div>

        {/* TAB 1: Cashout Request */}
        {activeTab === 'cashout' && (
          <div className="space-y-4 overflow-y-auto pr-1">
            {successNotice && (
              <div className="bg-emerald-900/60 border border-emerald-500 text-emerald-200 p-3 rounded-2xl text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
                <span>{successNotice}</span>
              </div>
            )}

            {errorMessage && (
              <div className="bg-rose-900/60 border border-rose-500 text-rose-200 p-3 rounded-2xl text-xs font-bold">
                ⚠️ {errorMessage}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Cantidad de Diamantes a Retirar
              </label>
              <div className="flex space-x-2">
                {[1000, 5000, 10000, wallet.diamonds].map(amount => (
                  <button
                    key={amount}
                    onClick={() => setDiamondsToWithdraw(amount)}
                    className={`flex-1 py-2 rounded-xl text-xs font-black border transition-all ${
                      diamondsToWithdraw === amount
                        ? 'border-purple-500 bg-purple-500/20 text-purple-300'
                        : 'border-stone-800 bg-stone-800/40 text-stone-400 hover:text-white'
                    }`}
                  >
                    {amount === wallet.diamonds ? 'Todo' : `${amount.toLocaleString()} 💎`}
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Input */}
            <div>
              <input
                type="number"
                value={diamondsToWithdraw}
                onChange={e => setDiamondsToWithdraw(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-2.5 text-sm font-bold text-white focus:outline-none focus:border-purple-500"
                placeholder="Cantidad exacta de diamantes"
              />
              <div className="mt-1 text-right text-xs font-extrabold text-emerald-400">
                Recibirás aprox: ${usdValue.toFixed(2)} USD
              </div>
            </div>

            {/* Method Selection */}
            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-2">
                Método de Retiro Directo
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setPaymentMethod('paypal');
                    setAccountDetails('creador_live@paypal.com');
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'paypal'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                      : 'border-stone-800 bg-stone-800/40 text-stone-400'
                  }`}
                >
                  PayPal
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod('mercadopago');
                    setAccountDetails('CVU: 0000003100098293021');
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'mercadopago'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                      : 'border-stone-800 bg-stone-800/40 text-stone-400'
                  }`}
                >
                  MercadoPago
                </button>
                <button
                  onClick={() => {
                    setPaymentMethod('bank_transfer');
                    setAccountDetails('IBAN / Cuenta Bancaria Directa');
                  }}
                  className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                    paymentMethod === 'bank_transfer'
                      ? 'border-purple-500 bg-purple-500/20 text-purple-200'
                      : 'border-stone-800 bg-stone-800/40 text-stone-400'
                  }`}
                >
                  Banco Directo
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1">
                Detalles de Cuenta para Depósito
              </label>
              <input
                type="text"
                value={accountDetails}
                onChange={e => setAccountDetails(e.target.value)}
                className="w-full bg-stone-800/80 border border-stone-700 rounded-xl px-4 py-2 text-xs font-bold text-white focus:outline-none focus:border-purple-500"
              />
            </div>

            <button
              onClick={handleWithdraw}
              disabled={isSubmitting || diamondsToWithdraw < minRequired || diamondsToWithdraw > wallet.diamonds}
              className="w-full mt-2 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 hover:from-purple-500 hover:to-rose-500 text-white font-black text-sm py-3.5 rounded-2xl shadow-xl flex items-center justify-center space-x-2 transition-all active:scale-95 disabled:opacity-50"
            >
              <ArrowDownToLine className="w-5 h-5" />
              <span>
                {isSubmitting ? 'Procesando Retiro...' : `Solicitar Retiro de $${usdValue.toFixed(2)} USD`}
              </span>
            </button>
          </div>
        )}

        {/* TAB 2: Withdrawal History */}
        {activeTab === 'history' && (
          <div className="space-y-3 overflow-y-auto max-h-80 pr-1">
            {withdrawHistory.length === 0 ? (
              <div className="text-center py-8 text-stone-500 text-xs">
                No tienes retiros registrados aún.
              </div>
            ) : (
              withdrawHistory.map(item => (
                <div
                  key={item.id}
                  className="bg-stone-800/50 border border-stone-800 rounded-2xl p-3.5 flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-black text-white flex items-center space-x-1.5">
                      <span className="uppercase text-purple-400">{item.paymentMethod}</span>
                      <span className="text-stone-500">•</span>
                      <span>{item.date}</span>
                    </div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{item.accountDetails}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-sm font-black text-emerald-400">+${item.amountUSD.toFixed(2)} USD</div>
                    <div className="text-[10px] font-extrabold text-stone-400">
                      {item.amountDiamonds.toLocaleString()} 💎
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3: Top Donators Leaderboard */}
        {activeTab === 'leaderboard' && (
          <div className="space-y-3 overflow-y-auto max-h-80 pr-1">
            <div className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-2">
              Mayores Contribuidores de Monedas
            </div>
            {TOP_GIFTERS_LEADERBOARD.map((gifter, idx) => (
              <div
                key={gifter.id}
                className="bg-stone-800/40 border border-stone-800/80 rounded-2xl p-3 flex items-center justify-between"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs ${
                      idx === 0
                        ? 'bg-yellow-400 text-black'
                        : idx === 1
                        ? 'bg-slate-300 text-black'
                        : idx === 2
                        ? 'bg-amber-700 text-white'
                        : 'bg-stone-800 text-stone-400'
                    }`}
                  >
                    #{idx + 1}
                  </div>
                  <img
                    src={gifter.avatar}
                    alt={gifter.name}
                    className="w-10 h-10 rounded-full object-cover border border-purple-500/50"
                  />
                  <div>
                    <div className="text-xs font-extrabold text-white">{gifter.name}</div>
                    <div className="text-[10px] text-purple-300 font-bold">Nivel Gifter {gifter.level}</div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-xs font-black text-yellow-400">
                    {gifter.totalGiftedCoins.toLocaleString()} 🪙
                  </div>
                  <div className="text-[10px] text-stone-400">Monedas Donadas</div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Footer Note */}
        <div className="mt-4 pt-3 border-t border-stone-800 flex items-center justify-between text-[11px] text-stone-400">
          <div className="flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-400" />
            <span>Monetización Oficial TikTok LIVE</span>
          </div>
          <span>ID Creador: #8820-LIVE</span>
        </div>
      </div>
    </div>
  );
};
