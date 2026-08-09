import express from 'express';
import path from 'path';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import { GIFTS_CATALOG } from './src/data/gifts';
import { MOCK_STREAMERS } from './src/data/mockStreams';
import { UserWallet, Streamer, LiveComment, GiftEvent, WithdrawalRecord, PKBattleState } from './src/types';

const app = express();
app.use(express.json());

const PORT = 3000;
const httpServer = createServer(app);

// Global In-Memory Database State (Starts cleanly from 0 coins & 0 diamonds until users recharge/earn)
let userWallet: UserWallet = {
  coins: 0,
  diamonds: 0,
  totalCoinsSpent: 0,
  totalDiamondsEarned: 0,
  usdBalance: 0.00
};

let streamersList: Streamer[] = [...MOCK_STREAMERS];

let withdrawalHistory: WithdrawalRecord[] = [];

let activePKBattle: PKBattleState = {
  id: 'pk-99',
  isActive: true,
  streamer1: MOCK_STREAMERS[0],
  streamer2: MOCK_STREAMERS[1],
  streamer1Points: 4800,
  streamer2Points: 3200,
  timeRemainingSec: 180
};

// Store room connections for WebSockets
const roomConnections = new Map<string, Set<WebSocket>>();
// Store room chat history
const roomChats = new Map<string, LiveComment[]>();

// Initialize default room chats
streamersList.forEach(s => {
  roomChats.set(s.id, [
    {
      id: `init-1-${s.id}`,
      userId: 'user-vip',
      username: 'Camila_Gamer',
      userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      badge: 'VIP',
      badgeLevel: 12,
      message: '¡Hola a todos en el en vivo! 🔥',
      timestamp: 'Ahora'
    },
    {
      id: `init-2-${s.id}`,
      userId: 'user-mod',
      username: 'Moderador_Pro',
      userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
      badge: 'Mod',
      badgeLevel: 25,
      message: 'Recuerden respetar las normas de la comunidad y enviar sus regalos para la meta 🙌',
      timestamp: 'Hace 1m'
    }
  ]);
});

// WebSocket Setup
const wss = new WebSocketServer({ server: httpServer });

function broadcastToRoom(roomId: string, data: any) {
  const clients = roomConnections.get(roomId);
  if (clients) {
    const payload = JSON.stringify(data);
    clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(payload);
      }
    });
  }
}

wss.on('connection', (ws) => {
  let currentRoom = '';

  ws.on('message', (messageRaw) => {
    try {
      const data = JSON.parse(messageRaw.toString());

      if (data.type === 'join_room') {
        const roomId = data.roomId || 'streamer-1';
        if (currentRoom && roomConnections.has(currentRoom)) {
          roomConnections.get(currentRoom)?.delete(ws);
        }

        currentRoom = roomId;
        if (!roomConnections.has(roomId)) {
          roomConnections.set(roomId, new Set());
        }
        roomConnections.get(roomId)?.add(ws);

        // Send current room chat history
        const history = roomChats.get(roomId) || [];
        ws.send(JSON.stringify({
          type: 'room_history',
          comments: history,
          pkBattle: activePKBattle
        }));

        // Broadcast viewer join
        broadcastToRoom(roomId, {
          type: 'viewer_joined',
          countChange: 1
        });
      }

      if (data.type === 'send_comment') {
        const comment: LiveComment = {
          id: `comment-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`,
          userId: data.userId || 'user-current',
          username: data.username || 'Tú (Usuario)',
          userAvatar: data.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
          badge: data.badge || 'Top Gifter',
          badgeLevel: 5,
          message: data.message,
          timestamp: 'Ahora'
        };

        const chats = roomChats.get(currentRoom) || [];
        chats.push(comment);
        if (chats.length > 50) chats.shift();
        roomChats.set(currentRoom, chats);

        broadcastToRoom(currentRoom, {
          type: 'new_comment',
          comment
        });
      }

      if (data.type === 'like_stream') {
        broadcastToRoom(currentRoom, {
          type: 'stream_like',
          x: data.x || 50,
          y: data.y || 80
        });
      }

      // Simulation tool: trigger fan gift in live stream
      if (data.type === 'simulate_incoming_gift') {
        const gift = GIFTS_CATALOG.find(g => g.id === data.giftId) || GIFTS_CATALOG[0];
        const qty = data.quantity || 1;
        const totalCoins = gift.coinPrice * qty;
        const diamonds = Math.floor(totalCoins * 0.5);

        // Update user's creator earnings if user is host or active streamer
        userWallet.diamonds += diamonds;
        userWallet.totalDiamondsEarned += diamonds;
        userWallet.usdBalance = +(userWallet.diamonds * 0.005).toFixed(2);

        const giftEvent: GiftEvent = {
          id: `gift-${Date.now()}`,
          senderId: 'sim-fan',
          senderName: data.fanName || 'Fan_Entusiasta_🔥',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
          recipientStreamerId: currentRoom,
          gift,
          quantity: qty,
          totalCoins,
          timestamp: 'Ahora'
        };

        // Add gift comment
        const giftComment: LiveComment = {
          id: `cmt-gift-${Date.now()}`,
          userId: 'sim-fan',
          username: giftEvent.senderName,
          userAvatar: giftEvent.senderAvatar,
          badge: 'Top Gifter',
          badgeLevel: 15,
          message: `Envió ${qty}x ${gift.spanishName} (${totalCoins} Monedas)`,
          timestamp: 'Ahora',
          giftEvent: {
            giftName: gift.spanishName,
            giftIcon: gift.icon,
            quantity: qty,
            totalCoins
          }
        };

        const chats = roomChats.get(currentRoom) || [];
        chats.push(giftComment);
        roomChats.set(currentRoom, chats);

        // Update PK points if active
        if (activePKBattle.isActive) {
          if (currentRoom === activePKBattle.streamer1.id) {
            activePKBattle.streamer1Points += totalCoins;
          } else if (currentRoom === activePKBattle.streamer2.id) {
            activePKBattle.streamer2Points += totalCoins;
          }
        }

        broadcastToRoom(currentRoom, {
          type: 'gift_broadcast',
          giftEvent,
          updatedWallet: userWallet,
          pkBattle: activePKBattle
        });
      }

    } catch (err) {
      console.error('WebSocket Error:', err);
    }
  });

  ws.on('close', () => {
    if (currentRoom && roomConnections.has(currentRoom)) {
      roomConnections.get(currentRoom)?.delete(ws);
    }
  });
});

// REST API Endpoints

// 1. Get Wallet Balance
app.get('/api/wallet', (req, res) => {
  res.json({
    success: true,
    wallet: userWallet
  });
});

// 2. Buy Coins
app.post('/api/wallet/buy', (req, res) => {
  const { coinPackageId, coins, priceUSD } = req.body;
  if (!coins || coins <= 0) {
    return res.status(400).json({ success: false, error: 'Cantidad inválida' });
  }

  userWallet.coins += coins;
  res.json({
    success: true,
    message: `¡Has recargado ${coins} Monedas con éxito!`,
    wallet: userWallet
  });
});

// 3. Send Gift
app.post('/api/gifts/send', (req, res) => {
  const { giftId, streamerId, quantity = 1, senderName = 'Tú (Usuario)' } = req.body;
  
  const gift = GIFTS_CATALOG.find(g => g.id === giftId);
  if (!gift) {
    return res.status(404).json({ success: false, error: 'Regalo no encontrado' });
  }

  const totalCostCoins = gift.coinPrice * quantity;
  if (userWallet.coins < totalCostCoins) {
    return res.status(400).json({ 
      success: false, 
      error: 'Saldo insuficiente de monedas. ¡Recarga más monedas para enviar este regalo!' 
    });
  }

  // Deduct coins
  userWallet.coins -= totalCostCoins;
  userWallet.totalCoinsSpent += totalCostCoins;

  // Add diamonds to target streamer
  const earnedDiamonds = gift.diamondValue * quantity;
  const targetStreamer = streamersList.find(s => s.id === streamerId);
  if (targetStreamer) {
    targetStreamer.diamondCount += earnedDiamonds;
    if (targetStreamer.giftGoal) {
      targetStreamer.giftGoal.currentCoins += totalCostCoins;
    }
  }

  // If sending gift to oneself or host channel
  if (streamerId === 'user-my-stream' || streamerId === targetStreamer?.id) {
    // If PK Battle is active, update points
    if (activePKBattle.isActive) {
      if (streamerId === activePKBattle.streamer1.id) {
        activePKBattle.streamer1Points += totalCostCoins;
      } else {
        activePKBattle.streamer2Points += totalCostCoins;
      }
    }
  }

  const giftEvent: GiftEvent = {
    id: `gift-${Date.now()}`,
    senderId: 'user-current',
    senderName,
    senderAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
    recipientStreamerId: streamerId,
    gift,
    quantity,
    totalCoins: totalCostCoins,
    timestamp: 'Ahora'
  };

  // Broadcast event
  broadcastToRoom(streamerId, {
    type: 'gift_broadcast',
    giftEvent,
    pkBattle: activePKBattle
  });

  res.json({
    success: true,
    giftEvent,
    wallet: userWallet,
    streamerDiamonds: targetStreamer?.diamondCount || 0
  });
});

// 4. Creator Cashout / Withdraw
app.post('/api/creator/withdraw', (req, res) => {
  const { amountDiamonds, paymentMethod, accountDetails } = req.body;

  if (!amountDiamonds || amountDiamonds < 1000) {
    return res.status(400).json({ 
      success: false, 
      error: 'Mínimo de retiro es 1,000 Diamantes ($5.00 USD).' 
    });
  }

  if (userWallet.diamonds < amountDiamonds) {
    return res.status(400).json({ 
      success: false, 
      error: 'Saldo insuficiente de Diamantes para retirar.' 
    });
  }

  const amountUSD = +(amountDiamonds * 0.005).toFixed(2);
  userWallet.diamonds -= amountDiamonds;
  userWallet.usdBalance = +(userWallet.diamonds * 0.005).toFixed(2);

  const newRecord: WithdrawalRecord = {
    id: `wd-${Date.now().toString().slice(-4)}`,
    amountDiamonds,
    amountUSD,
    paymentMethod,
    accountDetails: accountDetails || 'Cuenta vinculada',
    status: 'completado',
    date: new Date().toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' })
  };

  withdrawalHistory.unshift(newRecord);

  res.json({
    success: true,
    message: `¡Retiro exitoso de $${amountUSD} USD enviado a ${paymentMethod.toUpperCase()}!`,
    withdrawal: newRecord,
    wallet: userWallet,
    history: withdrawalHistory
  });
});

// 5. Get Streamers
app.get('/api/streamers', (req, res) => {
  res.json({
    success: true,
    streamers: streamersList,
    pkBattle: activePKBattle
  });
});

// 6. User Start LIVE Stream
app.post('/api/streamers/go-live', (req, res) => {
  const { title, category, goalTitle, goalCoins, hostName, hostAvatar, username, email } = req.body;

  const uname = username || (email ? email.split('@')[0] : 'usuario_live');
  const dname = hostName || 'Usuario en Vivo';
  const uavatar = hostAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80';

  const newStream: Streamer = {
    id: `stream-${uname}-${Date.now()}`,
    username: uname,
    displayName: `${dname} 🔴`,
    avatar: uavatar,
    bio: `Canal oficial de ${dname}. Transmisión en vivo iniciada por ID/usuario.`,
    followers: 1250,
    isLive: true,
    category: category || 'Charla',
    streamTitle: title || `🔥 En Vivo de ${dname} - ¡Saluda y envía regalos!`,
    viewerCount: 1,
    diamondCount: userWallet.diamonds,
    streamBgGradient: 'from-fuchsia-950 via-purple-900 to-black',
    giftGoal: {
      title: goalTitle || 'Meta del LIVE: Cohete Espacial 🚀',
      currentCoins: 0,
      targetCoins: goalCoins || 1000,
      rewardGift: 'Cohete Espacial'
    }
  };

  // Remove previous stream from same user if existed
  streamersList = streamersList.filter(s => s.username !== uname);
  streamersList.unshift(newStream);

  res.json({
    success: true,
    streamer: newStream,
    allStreamers: streamersList
  });
});

// 7. Get Withdrawals
app.get('/api/creator/withdrawals', (req, res) => {
  res.json({
    success: true,
    history: withdrawalHistory,
    wallet: userWallet
  });
});

// Vite Middleware for Development / Static serving in production
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`TikTok LIVE Monetization server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
