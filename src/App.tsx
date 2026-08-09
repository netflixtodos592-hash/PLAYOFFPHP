import React, { useState, useEffect, useRef } from 'react';
import { TopNavbar } from './components/TopNavbar';
import { BottomNavbar } from './components/BottomNavbar';
import { LiveStreamViewer } from './components/LiveStreamViewer';
import { ShortsFeed, ShortItem } from './components/ShortsFeed';
import { GiftStoreModal } from './components/GiftStoreModal';
import { CoinWalletModal } from './components/CoinWalletModal';
import { CreatorStudioModal } from './components/CreatorStudioModal';
import { UserLiveBroadcaster } from './components/UserLiveBroadcaster';
import { VideoUploadModal } from './components/VideoUploadModal';
import { AuthModal, UserAccount } from './components/AuthModal';
import { UserProfileModal } from './components/UserProfileModal';
import { AdminCommissionModal, CommissionTransaction } from './components/AdminCommissionModal';
import { GiftAnimationOverlay } from './components/GiftAnimationOverlay';
import { MOCK_STREAMERS } from './data/mockStreams';
import { Streamer, UserWallet, LiveComment, GiftEvent, GiftItem, PKBattleState } from './types';
import { Search, Radio, CheckCircle2, User, UserCheck, UserPlus } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'feed' | 'live' | 'wallet' | 'creator'>('live');
  const [streamers, setStreamers] = useState<Streamer[]>(MOCK_STREAMERS);
  const [activeStreamIdx, setActiveStreamIdx] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  // Profile Modal State
  const [selectedProfileData, setSelectedProfileData] = useState<{
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
  } | null>(null);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  // App Owner Platform Commission State
  const [commissionPercent, setCommissionPercent] = useState<number>(20);
  const [isAdminCommissionOpen, setIsAdminCommissionOpen] = useState(false);
  const [commissionTransactions, setCommissionTransactions] = useState<CommissionTransaction[]>([
    {
      id: 'tx-1',
      type: 'COIN_RECHARGE',
      grossAmountUSD: 14.99,
      grossCoins: 1000,
      commissionFeePercent: 20,
      commissionUSD: 2.99,
      commissionCoins: 200,
      userEmail: 'fan.sofi@gmail.com',
      timestamp: 'Hoy, 10:30 AM'
    },
    {
      id: 'tx-2',
      type: 'GIFT_TRANSACTION',
      grossAmountUSD: 50.00,
      grossCoins: 5000,
      commissionFeePercent: 20,
      commissionUSD: 10.00,
      commissionCoins: 1000,
      userEmail: 'alex.gamer@gmail.com',
      timestamp: 'Hoy, 11:15 AM'
    }
  ]);

  // User Account & Email Authentication (Starts from 0 coins and 0 diamonds)
  const [currentUser, setCurrentUser] = useState<UserAccount>(() => {
    const saved = localStorage.getItem('user_account');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      email: '',
      displayName: '',
      avatar: '',
      coins: 0,
      diamonds: 0,
    };
  });

  // Custom Uploaded Shorts
  const [customShorts, setCustomShorts] = useState<ShortItem[]>([]);

  // User Wallet State (Starts cleanly from 0 coins and 0 diamonds)
  const [wallet, setWallet] = useState<UserWallet>(() => ({
    coins: currentUser.coins || 0,
    diamonds: currentUser.diamonds || 0,
    totalCoinsSpent: 0,
    totalDiamondsEarned: currentUser.diamonds || 0,
    usdBalance: (currentUser.diamonds || 0) * 0.005
  }));

  // Comments & WebSocket Room State
  const [comments, setComments] = useState<LiveComment[]>([]);
  const [pkBattle, setPkBattle] = useState<PKBattleState | null>(null);
  const [latestGiftEvent, setLatestGiftEvent] = useState<GiftEvent | null>(null);

  // Followed Usernames State
  const [followedUsernames, setFollowedUsernames] = useState<string[]>([]);
  const [unlockedVideoIds, setUnlockedVideoIds] = useState<string[]>([]);
  const [onlyMutualLive, setOnlyMutualLive] = useState<boolean>(true);

  const handleToggleFollow = (username: string) => {
    setFollowedUsernames(prev =>
      prev.some(u => u.toLowerCase() === username.toLowerCase())
        ? prev.filter(u => u.toLowerCase() !== username.toLowerCase())
        : [...prev, username]
    );
  };

  const handleUnlockVideo = (videoId: string, coinPrice: number) => {
    if (wallet.coins >= coinPrice) {
      setWallet(prev => ({
        ...prev,
        coins: prev.coins - coinPrice,
        totalCoinsSpent: prev.totalCoinsSpent + coinPrice
      }));
      setUnlockedVideoIds(prev => [...prev, videoId]);
    } else {
      setIsCoinWalletOpen(true);
    }
  };

  // Modals
  const [isGiftStoreOpen, setIsGiftStoreOpen] = useState(false);
  const [isCoinWalletOpen, setIsCoinWalletOpen] = useState(false);
  const [isCreatorStudioOpen, setIsCreatorStudioOpen] = useState(false);
  const [isBroadcasterOpen, setIsBroadcasterOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(() => !currentUser.email);

  const socketRef = useRef<WebSocket | null>(null);

  // Filtered streamers based on search query (ID, username, displayName)
  const filteredStreamers = streamers.filter(s =>
    s.displayName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter live streamers by mutual follow when onlyMutualLive is active
  const liveStreamers = streamers.filter(s => {
    if (!onlyMutualLive) return true;
    return s.isMutual || followedUsernames.some(u => u.toLowerCase() === s.username.toLowerCase());
  });

  const activeStreamer = liveStreamers[activeStreamIdx] || liveStreamers[0] || null;

  // Open login/registration automatically if no email saved
  useEffect(() => {
    if (!currentUser.email) {
      setIsAuthModalOpen(true);
    }
  }, [currentUser.email]);

  // Sync wallet changes to currentUser & localStorage
  useEffect(() => {
    if (currentUser.email) {
      const updatedUser = {
        ...currentUser,
        coins: wallet.coins,
        diamonds: wallet.diamonds
      };
      setCurrentUser(updatedUser);
      localStorage.setItem('user_account', JSON.stringify(updatedUser));
    }
  }, [wallet.coins, wallet.diamonds]);

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
    if (!activeStreamer?.id) return;
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
  }, [activeStreamer?.id]);

  // Handlers
  const handleSendComment = (text: string) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({
        type: 'send_comment',
        message: text,
        username: currentUser.displayName || 'Usuario',
        userId: currentUser.email || 'user-current',
        userAvatar: currentUser.avatar
      }));
    }
  };

  const handleSendGift = async (gift: GiftItem, quantity: number) => {
    if (!activeStreamer?.id) return;
    try {
      const res = await fetch('/api/gifts/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          giftId: gift.id,
          streamerId: activeStreamer.id,
          quantity,
          senderName: currentUser.displayName || 'Tú (Usuario)'
        })
      });

      const data = await res.json();
      if (data.success) {
        setWallet(data.wallet);

        // Record Owner Platform Commission for Gift
        const grossCoins = gift.coinPrice * quantity;
        const grossUSD = grossCoins * 0.01;
        const commCoins = Math.floor(grossCoins * (commissionPercent / 100));
        const commUSD = grossUSD * (commissionPercent / 100);

        const newTx: CommissionTransaction = {
          id: `tx-${Date.now()}`,
          type: 'GIFT_TRANSACTION',
          grossAmountUSD: grossUSD,
          grossCoins: grossCoins,
          commissionFeePercent: commissionPercent,
          commissionUSD: commUSD,
          commissionCoins: commCoins,
          userEmail: currentUser.email || 'usuario@anonimo.com',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setCommissionTransactions(prev => [newTx, ...prev]);
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
    if (liveStreamers.length === 0) return;
    setActiveStreamIdx((prev) => (prev + 1) % liveStreamers.length);
  };

  const handlePrevStream = () => {
    if (liveStreamers.length === 0) return;
    setActiveStreamIdx((prev) => (prev - 1 + liveStreamers.length) % liveStreamers.length);
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
        currentUser={currentUser}
        onOpenWallet={() => setIsCoinWalletOpen(true)}
        onOpenCreatorStudio={() => setIsCreatorStudioOpen(true)}
        onOpenAuth={() => {
          if (currentUser.email) {
            setSelectedProfileData({
              username: currentUser.email.split('@')[0],
              displayName: currentUser.displayName || 'Mi Perfil',
              avatar: currentUser.avatar,
              email: currentUser.email,
              followers: 120,
              following: 15,
              isVerified: true
            });
            setIsProfileModalOpen(true);
          } else {
            setIsAuthModalOpen(true);
          }
        }}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Viewport Container */}
      <main className="flex-1 relative flex items-center justify-center">
        {/* Full Screen Gift Animation Overlay */}
        <GiftAnimationOverlay
          giftEvent={latestGiftEvent}
          onAnimationEnd={() => setLatestGiftEvent(null)}
        />

        {/* Profile Search Overlay */}
        {searchQuery.trim() !== '' && (
          <div className="absolute inset-0 z-30 bg-stone-950/95 backdrop-blur-2xl p-4 overflow-y-auto animate-fade-in max-w-md mx-auto border-x border-stone-800">
            <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-3">
              <h3 className="text-sm font-black text-white flex items-center space-x-2">
                <Search className="w-4 h-4 text-rose-500" />
                <span>Resultados para "{searchQuery}"</span>
              </h3>
              <button
                onClick={() => setSearchQuery('')}
                className="text-stone-400 hover:text-white text-xs font-bold"
              >
                Cerrar ✕
              </button>
            </div>

            {filteredStreamers.length === 0 ? (
              <div className="py-12 text-center text-stone-500 text-xs font-bold">
                No se encontraron perfiles con "{searchQuery}"
              </div>
            ) : (
              <div className="space-y-3">
                {filteredStreamers.map((s) => {
                  const isFollowed = followedUsernames.some(u => u.toLowerCase() === s.username.toLowerCase());
                  return (
                    <div
                      key={s.id}
                      className="p-3 bg-stone-900 border border-white/10 rounded-2xl flex items-center justify-between hover:border-rose-500/50 transition-all"
                    >
                      <div
                        onClick={() => {
                          setSelectedProfileData({
                            username: s.username,
                            displayName: s.displayName,
                            avatar: s.avatar,
                            bio: s.bio,
                            followers: s.followers,
                            isVerified: true,
                            isLive: s.isLive,
                            streamerId: s.id
                          });
                          setIsProfileModalOpen(true);
                          setSearchQuery('');
                        }}
                        className="flex items-center space-x-3 cursor-pointer group flex-1 mr-2"
                      >
                        <div className="relative">
                          <img src={s.avatar} alt={s.displayName} className="w-12 h-12 rounded-full object-cover border-2 border-rose-500 group-hover:scale-105 transition-transform" />
                          {s.isLive && (
                            <span className="absolute -bottom-1 -right-1 bg-rose-600 text-[8px] font-black px-1.5 py-0.5 rounded-full text-white animate-pulse">
                              LIVE
                            </span>
                          )}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white flex items-center space-x-1 group-hover:text-rose-400 transition-colors">
                            <span>{s.displayName}</span>
                            <CheckCircle2 className="w-3.5 h-3.5 text-blue-400 fill-blue-400" />
                          </div>
                          <div className="text-[10px] text-stone-400 font-medium">@{s.username} • {s.category}</div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-1.5">
                        {/* Follow Button */}
                        <button
                          onClick={() => handleToggleFollow(s.username)}
                          className={`px-3 py-1.5 font-black text-[10px] rounded-xl flex items-center space-x-1 transition-all ${
                            isFollowed
                              ? 'bg-stone-800 text-stone-300 border border-white/10'
                              : 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-md active:scale-95'
                          }`}
                        >
                          {isFollowed ? <UserCheck className="w-3 h-3 text-emerald-400" /> : <UserPlus className="w-3 h-3" />}
                          <span>{isFollowed ? 'Siguiendo' : 'Seguir'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setSelectedProfileData({
                              username: s.username,
                              displayName: s.displayName,
                              avatar: s.avatar,
                              bio: s.bio,
                              followers: s.followers,
                              isVerified: true,
                              isLive: s.isLive,
                              streamerId: s.id
                            });
                            setIsProfileModalOpen(true);
                            setSearchQuery('');
                          }}
                          className="px-2.5 py-1.5 bg-stone-800 hover:bg-stone-700 text-stone-200 font-bold text-[10px] rounded-xl border border-white/10 transition-all"
                        >
                          Perfil
                        </button>

                        {s.isLive && (
                          <button
                            onClick={() => {
                              const idx = streamers.findIndex(st => st.id === s.id);
                              if (idx !== -1) setActiveStreamIdx(idx);
                              setActiveTab('live');
                              setSearchQuery('');
                            }}
                            className="px-2.5 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-[10px] rounded-xl shadow-lg hover:scale-105 active:scale-95 transition-all flex items-center space-x-1"
                          >
                            <Radio className="w-3 h-3 text-yellow-300 animate-pulse" />
                            <span>Ver Vivo</span>
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

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
            isFollowing={activeStreamer ? followedUsernames.some(u => u.toLowerCase() === activeStreamer.username.toLowerCase()) : false}
            onToggleFollow={() => activeStreamer && handleToggleFollow(activeStreamer.username)}
            onlyMutualLive={onlyMutualLive}
            onToggleOnlyMutualLive={() => setOnlyMutualLive(!onlyMutualLive)}
          />
        )}

        {activeTab === 'feed' && (
          <ShortsFeed
            streamers={filteredStreamers}
            customShorts={customShorts}
            followedUsernames={followedUsernames}
            onToggleFollow={handleToggleFollow}
            userCoins={wallet.coins}
            unlockedVideoIds={unlockedVideoIds}
            onUnlockVideo={handleUnlockVideo}
            onOpenCoinWallet={() => setIsCoinWalletOpen(true)}
            onOpenUploadModal={() => setIsUploadModalOpen(true)}
            onOpenProfile={(profile) => {
              setSelectedProfileData({
                username: profile.username,
                displayName: profile.displayName,
                avatar: profile.avatar,
                streamerId: profile.streamerId,
                followers: 0,
                isVerified: true
              });
              setIsProfileModalOpen(true);
            }}
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
      <VideoUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        currentUser={currentUser}
        onUploadSuccess={(newVideo) => {
          const newShort: ShortItem = {
            id: `short-${Date.now()}`,
            title: newVideo.title,
            likes: '1',
            comments: '0',
            videoUrl: newVideo.videoUrl,
            category: newVideo.category,
            privacy: newVideo.privacy,
            coinPrice: newVideo.coinPrice,
            streamer: {
              username: currentUser.email ? currentUser.email.split('@')[0] : 'mi_perfil',
              displayName: newVideo.authorName,
              avatar: newVideo.authorAvatar,
              streamBgGradient: 'from-rose-950 via-purple-900 to-black'
            }
          };
          setCustomShorts(prev => [newShort, ...prev]);
          setActiveTab('feed');
        }}
      />

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

          // Record Owner Commission for Coin Recharge
          const grossUSD = (addedCoins * 0.015);
          const commUSD = grossUSD * (commissionPercent / 100);
          const commCoins = Math.floor(addedCoins * (commissionPercent / 100));

          const newTx: CommissionTransaction = {
            id: `tx-${Date.now()}`,
            type: 'COIN_RECHARGE',
            grossAmountUSD: grossUSD,
            grossCoins: addedCoins,
            commissionFeePercent: commissionPercent,
            commissionUSD: commUSD,
            commissionCoins: commCoins,
            userEmail: currentUser.email || 'usuario@anonimo.com',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          };
          setCommissionTransactions(prev => [newTx, ...prev]);
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
        currentUser={currentUser}
        onSimulateIncomingGift={handleSimulateFanGift}
        onUpdateWallet={(newWallet) => setWallet(newWallet)}
        onStreamCreated={(newStream) => {
          setStreamers(prev => [newStream, ...prev.filter(s => s.username !== newStream.username)]);
          setActiveStreamIdx(0);
          setActiveTab('live');
        }}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        canDismiss={!!currentUser.email}
        currentUser={currentUser}
        onLogin={(acc) => {
          setCurrentUser(acc);
          localStorage.setItem('user_account', JSON.stringify(acc));
          setWallet(prev => ({
            ...prev,
            coins: acc.coins,
            diamonds: acc.diamonds
          }));
        }}
        onLogout={() => {
          const emptyAcc: UserAccount = {
            email: '',
            displayName: 'Invitado',
            avatar: '',
            coins: 0,
            diamonds: 0
          };
          setCurrentUser(emptyAcc);
          localStorage.removeItem('user_account');
        }}
      />

      <AdminCommissionModal
        isOpen={isAdminCommissionOpen}
        onClose={() => setIsAdminCommissionOpen(false)}
        transactions={commissionTransactions}
        commissionPercent={commissionPercent}
        onUpdateCommissionPercent={(newPercent) => setCommissionPercent(newPercent)}
      />

      <UserProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
        profileData={selectedProfileData}
        currentUser={currentUser}
        userVideos={customShorts}
        isFollowingExternal={selectedProfileData ? followedUsernames.some(u => u.toLowerCase() === selectedProfileData.username.toLowerCase()) : false}
        onToggleFollowExternal={handleToggleFollow}
        followingCount={followedUsernames.length}
        onOpenUploadModal={() => setIsUploadModalOpen(true)}
        onOpenLiveBroadcaster={() => setIsBroadcasterOpen(true)}
        onSelectStreamer={(streamerId) => {
          const idx = streamers.findIndex(s => s.id === streamerId);
          if (idx !== -1) setActiveStreamIdx(idx);
          setActiveTab('live');
        }}
        onPlayVideo={() => {
          setActiveTab('feed');
        }}
      />
    </div>
  );
}
