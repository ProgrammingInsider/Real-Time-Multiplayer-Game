  import { createContext, useContext } from 'react';
  import type { Player } from '../types'
  import type { Socket } from 'socket.io-client'

  export interface GlobalContextType {
    setYou: React.Dispatch<React.SetStateAction<Player[]>>;
    you: Player[];
    setPlayers: React.Dispatch<React.SetStateAction<Player[]>>;
    players: Player[];
    notification: string | null; 
    setNotification: React.Dispatch<React.SetStateAction<string | null>>;
    spinningPlayers: boolean;
    setSpinningPlayers: React.Dispatch<React.SetStateAction<boolean>>;
    socket: Socket | null;
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  }

  export const GlobalContext = createContext<GlobalContextType | undefined>(undefined);

  export const useGlobalContext = () => {
    const context = useContext(GlobalContext);
    if (!context) {
      throw new Error('useGlobalContext must be used within a ContextAPI provider');
    }
    return context;
  };
