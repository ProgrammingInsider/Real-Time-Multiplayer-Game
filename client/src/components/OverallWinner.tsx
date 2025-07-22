// import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/GlobalContext';
const medalEmoji = ['🥇', '🥈', '🥉'];


export default function OverallWinner() {
  const navigate = useNavigate();
  const { players, setPlayers, setYou, you, socket } = useGlobalContext();

  const sortedPlayers = [...players].sort((a, b) => b.score - a.score);

  const onRestart = () => {
    if (!socket) return;
    // Reset game state logic here
    socket.emit('restart_game');
    setPlayers([]); 
    setYou([]); 
    navigate('/');
  };

  // Logic to assign medals by rank (considering ties)
  let lastScore: number | null = null;
  let medalIndex = -1;

  const rankedPlayers = sortedPlayers.map((player) => {
    if (player.score !== lastScore) {
      medalIndex++;
      lastScore = player.score;
    }
    return { ...player, medal: medalEmoji[medalIndex] || '🎖️' };
  });

  return (
    <div className="game-over-container">
      <h1 className="game-over-title">🏁 Game Over!</h1>
      <h2 className="game-over-subtitle">Final Standings</h2>
      <ul className="scoreboard">
        {rankedPlayers.map((player) => (
          <li key={player.playerId} className="scoreboard-item">
            <span className="medal">{player.medal}</span>
            <span className="name">{
              you.length > 0 && you[0]?.playerId === player.playerId 
              ? 'You' 
              : player.playerName}
            </span>
            <span className="score">{player.score} pts</span>
          </li>
        ))}
      </ul>
      <button className="play-again-button" onClick={onRestart}>
        🔄 Play Again
      </button>
    </div>
  );
}
