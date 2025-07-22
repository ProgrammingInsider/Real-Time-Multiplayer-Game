import { useState } from 'react';
import PlayerDisplay from '../components/PlayerDisplay';
import CountdownTimer from '../components/CountdownTimer';
import PlayerNotification from '../components/PlayerNotification';
import OverallWinner from '../components/OverallWinner';
import { useGlobalContext } from '../context/GlobalContext';
import { useNavigate } from 'react-router-dom';
import { useGameSocket } from '../hooks/useGameSocket';

const GamePage = () => {
  const navigate = useNavigate();

  const [totalRounds, setTotalRounds] = useState<number>(5);
  const [currentRound, setCurrentRound] = useState(1);
  const [status, setStatus] = useState<React.ReactNode>('Waiting for players...');
  const [roundTime, setRoundTime] = useState<number | null>(null);
  const [roundStartTime, setRoundStartTime] = useState<number | null>(null);
  const [roundWinnerMessage, setRoundWinnerMessage] = useState<string | null>(null);
  const [isGameOver, setIsGameOver] = useState(false);

  const {
    setYou,
    setNotification,
    notification,
    players,
    setPlayers,
    setSpinningPlayers,
    socket,
    setSocket,
  } = useGlobalContext();

  useGameSocket({
    setStatus,
    setCurrentRound,
    setTotalRounds,
    setRoundTime,
    setRoundStartTime,
    setRoundWinnerMessage,
    setIsGameOver,
  });

  const handleLeaveGame = () => {
    socket?.emit('leave_game');
    setYou([]);
    setPlayers([]);
    setSocket(null);
    setRoundTime(null);
    setRoundStartTime(null);
    setCurrentRound(1);
    setTotalRounds(5);
    setSpinningPlayers(false);
    navigate('/');
  };

  return (
    <div className="game-page">
      <div className="game-container">
        <div className="game-info">
          <h2>
            Round {currentRound} / {totalRounds}
          </h2>
          {roundTime && roundStartTime && (
            <CountdownTimer
              duration={roundTime}
              startTime={roundStartTime}
              messageTemplate={roundWinnerMessage}
            />
          )}
          <p className="status-message">{status}</p>
        </div>

        <PlayerDisplay players={players} />

        <button className="leave-button" onClick={handleLeaveGame}>
          🚪 Leave Game
        </button>

        {notification && (
          <PlayerNotification
            message={notification}
            onClose={() => setNotification(null)}
          />
        )}
      </div>

      {isGameOver && (
        <div className="overlay-modal">
          <OverallWinner />
        </div>
      )}
    </div>
  );
};

export default GamePage;
