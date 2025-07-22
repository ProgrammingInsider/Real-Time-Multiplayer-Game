import { useGlobalContext } from '../context/GlobalContext'
import type { Player } from '../types'
import Spinner from './Spinner'

const PlayerDisplay = ({ players = [] }: { players: Player[] }) => {
  const { you, spinningPlayers } = useGlobalContext()
  
  return (
    <div className="player-list-container">
      <h3 className="player-list-heading">👾 Players</h3>
      <div className="player-cards">

        {players.map((player) => (
          <div className="player-card" key={player.playerId}>
            <div className="player-info">
              {spinningPlayers && (
                <div className="player-spinner">
                  <Spinner />
                </div>
              )}
              <span className="player-name">
                {you.length > 0 && you[0]?.playerId === player.playerId ? 'You' : player.playerName}
              </span>
            </div>
            <span className="player-score">⭐ {player.score}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PlayerDisplay
