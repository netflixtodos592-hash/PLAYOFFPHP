import React, { useState } from 'react';
import { Coins, CreditCard, ShieldCheck, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface CoinPackage {
  id: string;
  coins: number;
  priceUSD: number;
  bonusCoins?: number;
  isPopular?: boolean;
}

const COIN_PACKAGES: CoinPackage[] = [
  { id: 'pack-1', coins: 70, priceUSD: 0.99 },
  { id: 'pack-2', coins: 350, priceUSD: 4.99, bonusCoins: 15, isPopular: true },
  { id: 'pack-3', coins: 1400, priceUSD: 19.99, bonusCoins: 70 },
  { id: 'pack-4', coins: 3500, priceUSD: 49.99, bonusCoins: 200 },
  { id: 'pack-5', coins: 7000, priceUSD: 99.99, bonusCoins: 500 },
  { id: 'pack-6', coins: 17500, priceUSD: 249.99, bonusCoins: 1500 }
];

interface CoinWalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCoins: number;
  onRechargeSuccess: (addedCoins: number, priceUSD: number) => void;
}

export const CoinWalletModal: React.FC<CoinWalletModalProps> = ({
  isOpen,
  onClose,
  currentCoins,
  onRechargeSuccess
}) => {
  const [selectedPack, setSelectedPack] = useState<CoinPackage>(COIN_PACKAGES[1]);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'paypal' | 'googlepay'>('card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleBuy = async () => {
    setIsProcessing(true);
    setSuccessMessage(null);

    try {
      const totalCoinsToReceive = selectedPack.coins + (selectedPack.bonusCoins || 0);
      const res = await fetch('/api/wallet/buy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          coinPackageId: selectedPack.id,
          coins: totalCoinsToReceive,
          priceUSD: selectedPack.priceUSD
        })
      });

      const data = await res.json();
      if (data.success) {
        onRechargeSuccess(totalCoinsToReceive, selectedPack.priceUSD);
        setSuccessMessage(`¡Compra exitosa! Se añadieron ${totalCoinsToReceive} Monedas a tu billetera.`);
        setTimeout(() => {
          setSuccessMessage(null);
          onClose();
        }, 1800);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-lg animate-fade-in">
      <div className="relative w-full max-w-lg bg-stone-900/90 backdrop-blur-2xl border border-white/10 rounded-[32px] p-6 text-white shadow-[0_0_50px_rgba(0,0,0,0.9)] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-500/20 rounded-2xl border border-yellow-500/30 shadow-[0_0_15px_rgba(234,179,8,0.2)]">
              <Coins className="w-6 h-6 text-yellow-400 fill-yellow-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-wide">Billetera de Monedas TikTok</h2>
              <p className="text-xs text-stone-400 font-medium">Recarga monedas para enviar regalos en vivo</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-stone-400 hover:text-white text-xl font-bold p-1 transition-all"
          >
            ✕
          </button>
        </div>

        {/* Current Balance Banner */}
        <div className="my-4 bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-2xl p-4 border border-white/10 flex items-center justify-between shadow-inner">
          <div>
            <div className="text-xs text-stone-400 font-semibold uppercase tracking-wider">Saldo Actual de Monedas</div>
            <div className="text-2xl font-black text-yellow-400 flex items-center space-x-2 mt-0.5 drop-shadow-[0_0_8px_rgba(234,179,8,0.5)]">
              <Coins className="w-6 h-6 fill-yellow-400" />
              <span>{currentCoins.toLocaleString()} Monedas</span>
            </div>
          </div>
          <div className="bg-yellow-400/10 border border-yellow-400/30 px-3 py-1.5 rounded-full text-[11px] font-black text-yellow-300 flex items-center space-x-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Recarga Instantánea</span>
          </div>
        </div>

        {/* Success Alert */}
        {successMessage && (
          <div className="mb-4 bg-emerald-950/80 border border-emerald-500/80 text-emerald-200 p-3.5 rounded-2xl text-xs font-bold flex items-center space-x-2 animate-bounce shadow-lg">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Coin Packages Selection */}
        <div className="text-xs font-black text-stone-300 uppercase tracking-wider mb-2.5">
          Selecciona un Paquete de Monedas
        </div>
        <div className="grid grid-cols-2 gap-3 mb-5 max-h-56 overflow-y-auto pr-1">
          {COIN_PACKAGES.map(pack => {
            const isSelected = selectedPack.id === pack.id;
            const totalCoins = pack.coins + (pack.bonusCoins || 0);

            return (
              <button
                key={pack.id}
                onClick={() => setSelectedPack(pack)}
                className={`relative p-3.5 rounded-2xl border text-left transition-all duration-200 flex flex-col justify-between ${
                  isSelected
                    ? 'border-yellow-400 bg-yellow-500/15 ring-2 ring-yellow-400/40 shadow-[0_0_20px_rgba(234,179,8,0.3)] scale-[1.02]'
                    : 'border-white/5 bg-stone-800/40 hover:bg-stone-800/80 hover:border-white/20'
                }`}
              >
                {pack.isPopular && (
                  <div className="absolute -top-2.5 right-3 bg-rose-600 text-white text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider shadow-[0_0_10px_rgba(244,63,94,0.6)]">
                    Más Popular 🔥
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <Coins className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                  <div>
                    <div className="text-base font-black text-white">{pack.coins}</div>
                    {pack.bonusCoins && (
                      <div className="text-[10px] font-black text-emerald-400">
                        +{pack.bonusCoins} Bonus
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-3 text-sm font-black text-yellow-300 text-right">
                  ${pack.priceUSD.toFixed(2)} USD
                </div>
              </button>
            );
          })}
        </div>

        {/* Payment Methods */}
        <div className="text-xs font-black text-stone-300 uppercase tracking-wider mb-2">
          Método de Pago Seguro
        </div>
        <div className="grid grid-cols-3 gap-2 mb-5">
          <button
            onClick={() => setPaymentMethod('card')}
            className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all duration-200 ${
              paymentMethod === 'card'
                ? 'border-yellow-400 bg-yellow-400/15 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                : 'border-white/5 bg-stone-800/40 text-stone-400 hover:text-stone-200'
            }`}
          >
            <CreditCard className="w-4 h-4" />
            <span>Tarjeta</span>
          </button>
          <button
            onClick={() => setPaymentMethod('paypal')}
            className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all duration-200 ${
              paymentMethod === 'paypal'
                ? 'border-yellow-400 bg-yellow-400/15 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                : 'border-white/5 bg-stone-800/40 text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>PayPal</span>
          </button>
          <button
            onClick={() => setPaymentMethod('googlepay')}
            className={`p-2.5 rounded-xl border text-xs font-extrabold flex items-center justify-center space-x-1.5 transition-all duration-200 ${
              paymentMethod === 'googlepay'
                ? 'border-yellow-400 bg-yellow-400/15 text-yellow-300 shadow-[0_0_10px_rgba(234,179,8,0.2)]'
                : 'border-white/5 bg-stone-800/40 text-stone-400 hover:text-stone-200'
            }`}
          >
            <span>Google Pay</span>
          </button>
        </div>

        {/* Checkout Footer Button */}
        <div className="pt-3.5 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center space-x-1.5 text-stone-400 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-medium">Pago encriptado SSL 256-bit</span>
          </div>

          <button
            onClick={handleBuy}
            disabled={isProcessing}
            className="bg-gradient-to-r from-yellow-500 via-amber-500 to-yellow-400 hover:from-yellow-400 hover:to-amber-300 text-stone-950 font-black text-sm px-6 py-3 rounded-2xl shadow-[0_0_20px_rgba(234,179,8,0.5)] flex items-center space-x-2 transition-all duration-200 active:scale-95 disabled:opacity-50"
          >
            <span>
              {isProcessing ? 'Procesando...' : `Pagar $${selectedPack.priceUSD.toFixed(2)} USD`}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
