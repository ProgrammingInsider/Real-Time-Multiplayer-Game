import { useEffect } from 'react';
import type {
  Player,
  GameOverPayload,
  GamePausedPayload,
  RoundResultPayload,
  NewRoundPayload,
  GameStartPayload
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

    socket.on('game_paused', (res: GamePausedPayload) => {
      setStatus(res.message);
      setSpinningPlayers(false);
      setRoundStartTime(null);
      setRoundTime(null);
      setPlayers(res.currentPlayers);
    });

    socket.on('game_over', (res: GameOverPayload) => {
      setStatus('Game Over!');
      setIsGameOver(true);
      setPlayers(res.finalScores);
    });

    return () => {
      socket.off('player_joined');
      socket.off('player_left');
      socket.off('player_update');
      socket.off('game_start');
      socket.off('new_round');
      socket.off('round_result');
      socket.off('game_paused');
      socket.off('game_over');
    };
  }, [socket, you, setNotification, setYou, setPlayers, setSpinningPlayers, setStatus, setCurrentRound, setTotalRounds, setRoundTime, setRoundStartTime, setRoundWinnerMessage, setIsGameOver]);
};
