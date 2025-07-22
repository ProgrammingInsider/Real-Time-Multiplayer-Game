import { useState } from 'react'
import type { Player } from '../types'
import { GlobalContext } from './GlobalContext'
import type { Socket } from 'socket.io-client'

const ContextAPI = ({ children }: { children: React.ReactNode }) => {
  const [you, setYou] = useState<Player[]>([])
  const [players, setPlayers] = useState<Player[]>([])
  const [notification, setNotification] = useState<string | null>(null)
  const [spinningPlayers, setSpinningPlayers] = useState<boolean>(false)
  const [socket, setSocket] = useState<Socket | null>(null)

  return (
    <GlobalContext.Provider value={{ 
      you, 
      setYou, 
      players, 
      setPlayers, 
      notification, 
      setNotification,
      spinningPlayers,
      setSpinningPlayers,
      socket,
      setSocket
      }}>
        {children}
    </GlobalContext.Provider>
  )
}

export default ContextAPI
