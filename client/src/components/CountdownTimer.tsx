import { useEffect, useState } from 'react'
import type { CountdownTimerProps } from '../types'

const CountdownTimer = ({ duration, startTime, messageTemplate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState<number>(Math.ceil((startTime + duration * 1000 - Date.now()) / 1000))

  useEffect(() => {
    const update = () => {
      const remaining = Math.ceil((startTime + duration * 1000 - Date.now()) / 1000)
      setTimeLeft(Math.max(0, remaining))
    }

    update() // initial update immediately

    const interval = setInterval(() => {
      update()
    }, 500)

    return () => clearInterval(interval)
  }, [duration, startTime])

  if (timeLeft <= 0) return null

  const displayMessage = messageTemplate
    ? messageTemplate.replace('{{time}}', `${timeLeft}`)
    : `⏳ ${timeLeft} seconds remaining`

  return <div className="countdown-timer">{displayMessage}</div>
}

export default CountdownTimer
