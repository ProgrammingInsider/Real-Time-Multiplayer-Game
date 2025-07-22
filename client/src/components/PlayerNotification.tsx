import { useEffect } from 'react'

interface PlayerNotificationProps {
  message: string
  onClose: () => void
}

const PlayerNotification = ({ message, onClose }: PlayerNotificationProps) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose()
    }, 4000)

    return () => clearTimeout(timer)
  }, [onClose])

  return (
    <div className="player-notification">
      {message}
    </div>
  )
}

export default PlayerNotification
