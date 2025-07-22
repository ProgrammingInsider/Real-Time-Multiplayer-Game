import { Navigate } from 'react-router-dom'
import { useGlobalContext } from '../context/GlobalContext'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { socket } = useGlobalContext()

  if (!socket) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
