import React from 'react';
import { PKBattleState } from '../types';
import { Swords, Flame, Trophy } from 'lucide-react';

interface PKBattleOverlayProps {
  pkBattle: PKBattleState;
}

export const PKBattleOverlay: React.FC<PKBattleOverlayProps> = ({ pkBattle }) => {
  if (!pkBattle || !pkBattle.isActive) return null;

  const { streamer1, streamer2, streamer1Points, streamer2Points, timeRemainingSec } = pkBattle;
  const total = (streamer1Points + streamer2Points) || 1;
  const pct1 = Math.round((streamer1Points / total) * 100);
  const pct2 = 100 - pct1;

  const mins = Math.floor(timeRemainingSec / 60);
  const secs = timeRemainingSec % 60;
  const formattedTime = `${mins}:${secs < 10 ? '0' : ''}${secs}`;

  return (
    <div className="w-full bg-stone-900/80 border border-white/10 rounded-2xl p-2.5 backdrop-blur-xl z-30 flex flex-col space-y-2 shadow-xl">
      {/* PK Battle Title Bar */}
      <div className="flex items-center justify-between text-xs px-1">
        <div className="flex items-center space-x-1.5 font-black text-rose-500 drop-shadow-[0_0_8px_rgba(244,63,94,0.6)]">
          <Swords className="w-4 h-4 animate-bounce" />
          <span className="uppercase tracking-wider">BATALLA PK 1v1 EN VIVO</span>
        </div>

        <div className="bg-rose-950/90 border border-rose-500/50 text-rose-300 font-black px-3 py-0.5 rounded-full text-[11px] flex items-center space-x-1 shadow-[0_0_10px_rgba(244,63,94,0.4)]">
          <Flame className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
          <span>{formattedTime}</span>
        </div>

        <div className="text-[11px] font-extrabold text-yellow-400 flex items-center space-x-1">
          <Trophy className="w-3.5 h-3.5" />
          <span>Batalla por Regalos</span>
        </div>
      </div>

      {/* Streamers Head-to-Head */}
      <div className="flex items-center justify-between px-2 text-xs">
        {/* Streamer 1 */}
        <div className="flex items-center space-x-2">
          <img
            src={streamer1.avatar}
            alt={streamer1.displayName}
            className="w-8 h-8 rounded-full border-2 border-cyan-400 object-cover shadow-[0_0_10px_rgba(34,211,238,0.5)]"
          />
          <div>
            <div className="font-extrabold text-white line-clamp-1">{streamer1.displayName}</div>
            <div className="text-cyan-400 font-black">{streamer1Points.toLocaleString()} Pts</div>
          </div>
        </div>

        <div className="font-black text-rose-500 text-base italic px-2 drop-shadow-[0_0_8px_rgba(244,63,94,0.8)]">VS</div>

        {/* Streamer 2 */}
        <div className="flex items-center space-x-2 text-right">
          <div>
            <div className="font-extrabold text-white line-clamp-1">{streamer2.displayName}</div>
            <div className="text-pink-400 font-black">{streamer2Points.toLocaleString()} Pts</div>
          </div>
          <img
            src={streamer2.avatar}
            alt={streamer2.displayName}
            className="w-8 h-8 rounded-full border-2 border-pink-500 object-cover shadow-[0_0_10px_rgba(236,72,153,0.5)]"
          />
        </div>
      </div>

      {/* Dynamic Progress Tug-of-War Bar */}
      <div className="w-full h-3 bg-stone-950 rounded-full overflow-hidden flex shadow-inner border border-white/10 p-0.5">
        <div
          style={{ width: `${pct1}%` }}
          className="bg-gradient-to-r from-blue-600 via-cyan-500 to-cyan-400 h-full rounded-l-full transition-all duration-500 flex items-center justify-end pr-1 text-[9px] font-black text-white shadow-[0_0_10px_rgba(34,211,238,0.5)]"
        >
          {pct1 > 15 && `${pct1}%`}
        </div>
        <div
          style={{ width: `${pct2}%` }}
          className="bg-gradient-to-r from-pink-500 via-rose-500 to-rose-600 h-full rounded-r-full transition-all duration-500 flex items-center justify-start pl-1 text-[9px] font-black text-white shadow-[0_0_10px_rgba(244,63,94,0.5)]"
        >
          {pct2 > 15 && `${pct2}%`}
        </div>
      </div>
    </div>
  );
};
