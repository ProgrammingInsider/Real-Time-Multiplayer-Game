import { io } from 'socket.io-client'

const socketURL = import.meta.env.VITE_SOCKET_URL
export const socket = io(socketURL ?? 'http://localhost:3002', { autoConnect: false })
