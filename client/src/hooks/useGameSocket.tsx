import { useEffect } from 'react';
import type {
  Player,
  GameOverPayload,
  // GamePausedPayload,
  RoundResultPayload,
  NewRoundPayload,
  GameStartPayload,
  LatePlayer
} from '../types';
import { useGlobalContext } from '../context/GlobalContext';

interface UseGameSocketProps {
  setStatus: React.Dispatch<React.SetStateAction<React.ReactNode>>;
  setCurrentRound: React.Dispatch<React.SetStateAction<number>>;
  setTotalRounds: React.Dispatch<React.SetStateAction<number>>;
  setRoundTime: React.Dispatch<React.SetStateAction<number | null>>;
  setRoundStartTime: React.Dispatch<React.SetStateAction<number | null>>;
  setRoundWinnerMessage: React.Dispatch<React.SetStateAction<string | null>>;
  setIsGameOver: React.Dispatch<React.SetStateAction<boolean>>;
}

export const useGameSocket = ({
  setStatus,
  setCurrentRound,
  setTotalRounds,
  setRoundTime,
  setRoundStartTime,
  setRoundWinnerMessage,
  setIsGameOver,
}: UseGameSocketProps) => {

  const { you, setYou, setNotification, setPlayers, setSpinningPlayers, socket } = useGlobalContext();

  useEffect(() => {
    if (!socket) return;

    socket.on('player_joined', (player: Player) => {
      setNotification(`${player.playerName} joined the game`);
      setYou((prev) => [...prev, player]);
    });

    socket.on('joined_game', (player: Player) => {
      setNotification(`${player.playerName} joined the game`);
      setYou((prev) => [...prev, player]);
    });

    socket.on('late_joined', (latePlayer: LatePlayer) => {
      if (latePlayer.gameStarted) {
        const startTime = latePlayer.currentRoundStartTime || Date.now();
        const duration = latePlayer.duration || 10;
        const remaining = Math.ceil((startTime + duration * 1000 - Date.now()) / 1000);
        
        if (remaining > 0) {
          setStatus(`All players spinning`);
          setRoundStartTime(latePlayer.currentRoundStartTime || null);
          setRoundTime(latePlayer.duration || null);
          setCurrentRound(latePlayer.currentRound);
          setSpinningPlayers(true);
        } else {
          setStatus('Waiting for next round...');
          setRoundStartTime(null);
          setRoundTime(null); 
          setCurrentRound(1);
          setCurrentRound(latePlayer.currentRound);
          setSpinningPlayers(false);
        }
      }
    });

    socket.on('player_left', (player: Player) => {
      setNotification(`${player.playerName} left the game`);
    });

    socket.on('player_update', (playersList: Player[]) => {
      setPlayers(playersList);
    });

    socket.on('game_start', (res: GameStartPayload) => {
      setStatus(null);
      setRoundWinnerMessage(`${res.message} in {{time}}s`);
      setRoundTime(res.duration);
      setRoundStartTime(res.countdownStart);
      setTotalRounds(res.totalRounds);
    });

    socket.on('new_round', (res: NewRoundPayload) => {
      setStatus('All players spinning!');
      setCurrentRound(res.round);
      setRoundWinnerMessage('');
      setRoundTime(res.duration);
      setRoundStartTime(res.countdownStart);
      setTotalRounds(res.totalRounds);
      setSpinningPlayers(true);
    });

    socket.on('round_result', (res: RoundResultPayload) => {
      setSpinningPlayers(false);
      const msg = (
        <span className="winner">
          🎉 Round {res.round} Winner:{' '}
          {you.length > 0 && you[0]?.playerId === res.winnerId
            ? 'You'
            : res.winnerName}{' '}
          (+1pt)
        </span>
      );
      setStatus(msg);
      setRoundWinnerMessage('Next round Starts In {{time}}s');
      setRoundTime(res.duration);
      setRoundStartTime(res.countdownStart);
    });

    socket.on('game_over', (res: GameOverPayload) => {
      setStatus('Game Over!');
      setIsGameOver(true);
      setPlayers(res.finalScores);
    });

    socket.on('game_reset', () => {
      setStatus('Waiting for players...');
      setYou([]);
      setPlayers([]);
      setSpinningPlayers(false);
      setRoundTime(null);
      setRoundStartTime(null);
      setCurrentRound(1);
      setTotalRounds(5);
      setIsGameOver(false);
    });

    return () => {
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('player_update');
      socket.off('game_start');
      socket.off('new_round');
      socket.off('round_result');
      socket.off('game_over');
    };
  }, [socket, you, setNotification, setYou, setPlayers, setSpinningPlayers, setStatus, setCurrentRound, setTotalRounds, setRoundTime, setRoundStartTime, setRoundWinnerMessage, setIsGameOver]);
};
