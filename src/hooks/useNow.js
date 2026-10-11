import { useEffect, useState } from 'react'

// Current time, refreshed every minute, so "available today" stays correct on a page left open
export default function useNow() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(id)
  }, [])
  return now
}