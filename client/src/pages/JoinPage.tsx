import { useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { useGlobalContext } from '../context/GlobalContext'
import type { Player } from '../types'
import { socket } from '../utils/socket'

const JoinPage = () => {
  const [name, setName] = useState('')
  const navigate = useNavigate()

  const { setYou, setNotification, setSocket } = useGlobalContext()

  const handleJoin = () => {
    if (name.trim()) {

      socket.connect();
      socket.emit('join_game', name);
      socket.on('joined_game', (player: Player) => {
        setNotification(`${player.playerName} joined the game`)
        setYou((prev: Player[]) => [...prev, { playerId: player.playerId, playerName: player.playerName, score: player.score }])
      })
      setSocket(socket)
      navigate('/game')
      
    }
  }

  return (
    <div className='join-page'>
      <div className="page">
        <h2>Join Game</h2>
        <input
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button onClick={handleJoin}>Join</button>
      </div>
    </div>
  )
}

export default JoinPage
