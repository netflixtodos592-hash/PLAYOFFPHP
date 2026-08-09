import React, { useState, useEffect, useRef } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { BottomNavbar } from './components/BottomNavbar';
import { LiveStreamViewer } from './components/LiveStreamViewer';
import { ShortsFeed } from './components/ShortsFeed';
import { GiftStoreModal } from './components/GiftStoreModal';
import { CoinWalletModal } from './components/CoinWalletModal';
import { CreatorStudioModal } from './components/CreatorStudioModal';
import { UserLiveBroadcaster } from './components/UserLiveBroadcaster';
import { GiftAnimationOverlay } from './components/GiftAnimationOverlay';
import { MOCK_STREAMERS } from './data/mockStreams';
import { Streamer, UserWallet, LiveComment, GiftEvent, GiftItem, PKBattleState } from './types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'live' | 'wallet' | 'creator'>('live');
  const [streamers, setStreamers] = useState<Streamer[]>(MOCK_STREAMERS);
  const [activeStreamIdx, setActiveStreamIdx] = useState(0);

  // User Wallet State
  const [wallet, setWallet] = useState<UserWallet>({
    coins: 1250,
    diamonds: 18400,
    totalCoinsSpent: 450,
    totalDiamondsEarned: 18400,
    usdBalance: 92.00
  });

  // Comments & WebSocket Room State
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [pkBattle, setPkBattle] = useState<PKBattleState | null>(null);
  const [latestGiftEvent, setLatestGiftEvent] = useState<GiftEvent | null>(null);

  // Modals
  const [isGiftStoreOpen, setIsGiftStoreOpen] = useState(false);
  const [isCoinWalletOpen, setIsCoinWalletOpen] = useState(false);
  const [isCreatorStudioOpen, setIsCreatorStudioOpen] = useState(false);
  const [isBroadcasterOpen, setIsBroadcasterOpen] = useState(false);

  const socketRef = useRef<WebSocket | null>(null);
  const activeStreamer = streamers[activeStreamIdx] || streamers[0];

  // Fetch Initial Server Data
  useEffect(() => {
    fetchWallet();
    fetchStreamers();
  }, []);

  const fetchWallet = async () => {
    try {
      const res = await fetch('/api/wallet');
      const data = await res.json();
      if (data.success && data.wallet) {
        setWallet(data.wallet);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchStreamers = async () => {
    try {
      const res = await fetch('/api/streamers');
      const data = await res.json();
      if (data.success && data.streamers) {
        setStreamers(data.streamers);
        if (data.pkBattle) setPkBattle(data.pkBattle);
      }
    } catch (e) {
      console.error(e);
    }
  };

  // WebSocket Connection Management for Live Stream Rooms
  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);
    socketRef.current = ws;

    ws.onopen = () => {
      // Join active room
      ws.send(JSON.stringify({
        type: 'join_room',
        roomId: activeStreamer.id
      }));
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);

        if (msg.type === 'room_history') {
          setComments(msg.comments || []);
          if (msg.pkBattle) setPkBattle(msg.pkBattle);
        }

        if (msg.type === 'new_comment') {
          setComments(prev => [...prev.slice(-40), msg.comment]);
        }

        if (msg.type === 'gift_broadcast') {
          setLatestGiftEvent(msg.giftEvent);
          if (msg.updatedWallet) setWallet(msg.updatedWallet);
          if (msg.pkBattle) setPkBattle(msg.pkBattle);

          // Add gift comment
          const giftComment: LiveComment = {
            id: `cmt-${Date.now()}`,
            userId: msg.giftEvent.senderId,
            username: msg.giftEvent.senderName,
            userAvatar: msg.giftEvent.senderAvatar,
            badge: 'Top Gifter',
            badgeLevel: 10,
            message: `Envió ${msg.giftEvent.quantity}x ${msg.giftEvent.gift.spanishName}`,
            timestamp: 'Ahora',
            giftEvent: {
              giftName: msg.giftEvent.gift.spanishName,
              giftIcon: msg.giftEvent.gift.icon,
              quantity: msg.giftEvent.quantity,
              totalCoins: msg.giftEvent.totalCoins
            }
          };

          setComments(prev => [...prev.slice(-40), giftComment]);

          // Update active streamer diamond count locally
          setStreamers(prev => prev.map(s => {
            if (s.id === msg.giftEvent.recipientStreamerId) {
              const newDiamonds = s.diamondCount + Math.floor(msg.giftEvent.totalCoins * 0.5);
              const newGoalCoins = s.giftGoal ? s.giftGoal.currentCoins + msg.giftEvent.totalCoins : 0;
              return {
                ...s,
                diamondCount: newDiamonds,
                giftGoal: s.giftGoal ? { ...s.giftGoal, currentCoins: newGoalCoins } : undefined
              };
            }
            return s;
          }));
        }
      } catch (err) {
        console.error('WS Error:', err);
      }
    };

    return () => {
      ws.close();
    };
  }, [activeStreamer.id]);

  // Handlers
  const handleSendComment = (text: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'send_comment',
        message: text,
        username: 'Tú (Usuario)',
        userId: 'user-current'
      }));
    }
  };

  const handleSendGift = async (gift: GiftItem, quantity: number) => {
    try {
      const res = await fetch('/api/gifts/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftId: gift.id,
          streamerId: activeStreamer.id,
          quantity,
          senderName: 'Tú (Usuario)'
        })
      });

      const data = await res.json();
      if (data.success) {
        setWallet(data.wallet);
      } else {
        alert(data.error || 'Saldo insuficiente de monedas');
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleSimulateFanGift = (gift: GiftItem, fanName: string, quantity: number) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'simulate_incoming_gift',
        giftId: gift.id,
        fanName,
        quantity
      }));
    }
  };

  const handleNextStream = () => {
    setActiveStreamIdx((prev) => (prev + 1) % streamers.length);
  };

  const handlePrevStream = () => {
    setActiveStreamIdx((prev) => (prev - 1 + streamers.length) % streamers.length);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white font-sans flex flex-col justify-between overflow-x-hidden">
      {/* Top Navigation */}
      <TopNavbar
        currentTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'wallet') setIsCoinWalletOpen(true);
          else if (tab === 'creator') setIsCreatorStudioOpen(true);
          else setActiveTab(tab);
        }}
        userCoins={wallet.coins}
        userDiamonds={wallet.diamonds}
        onOpenWallet={() => setIsCoinWalletOpen(true)}
        onOpenCreatorStudio={() => setIsCreatorStudioOpen(true)}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 relative flex items-center justify-center">
        {/* Full Screen Gift Animation Overlay */}
        <GiftAnimationOverlay
          giftEvent={latestGiftEvent}
          onAnimationEnd={() => setLatestGiftEvent(null)}
        />

        {activeTab === 'live' && (
          <LiveStreamViewer
            streamer={activeStreamer}
            wallet={wallet}
            pkBattle={pkBattle}
            comments={comments}
            latestGiftEvent={latestGiftEvent}
            onSendComment={handleSendComment}
            onOpenGiftStore={() => setIsGiftStoreOpen(true)}
            onNextStream={handleNextStream}
            onPrevStream={handlePrevStream}
          />
        )}

        {activeTab === 'feed' && (
          <ShortsFeed
            streamers={streamers}
            onSelectStream={(streamer) => {
              const idx = streamers.findIndex(s => s.id === streamer.id);
              if (idx !== -1) setActiveStreamIdx(idx);
              setActiveTab('live');
            }}
          />
        )}
      </main>

      {/* Bottom Navigation Bar */}
      <BottomNavbar
        activeTab={activeTab}
        onTabChange={(tab) => {
          if (tab === 'wallet') setIsCoinWalletOpen(true);
          else if (tab === 'creator') setIsCreatorStudioOpen(true);
          else setActiveTab(tab);
        }}
        onOpenBroadcasterModal={() => setIsBroadcasterOpen(true)}
      />

      {/* Modals & Drawers */}
      <GiftStoreModal
        isOpen={isGiftStoreOpen}
        onClose={() => setIsGiftStoreOpen(false)}
        userCoins={wallet.coins}
        onSendGift={handleSendGift}
        onOpenRechargeWallet={() => setIsCoinWalletOpen(true)}
      />

      <CoinWalletModal
        isOpen={isCoinWalletOpen}
        onClose={() => setIsCoinWalletOpen(false)}
        currentCoins={wallet.coins}
        onRechargeSuccess={(addedCoins) => {
          setWallet(prev => ({
            ...prev,
            coins: prev.coins + addedCoins
          }));
        }}
      />

      <CreatorStudioModal
        isOpen={isCreatorStudioOpen}
        onClose={() => setIsCreatorStudioOpen(false)}
        wallet={wallet}
        onWithdrawSuccess={(newWallet) => setWallet(newWallet)}
      />

      <UserLiveBroadcaster
        isOpen={isBroadcasterOpen}
        onClose={() => setIsBroadcasterOpen(false)}
        wallet={wallet}
        onSimulateIncomingGift={handleSimulateFanGift}
        onUpdateWallet={(newWallet) => setWallet(newWallet)}
      />
    </div>
  );
}
