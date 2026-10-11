import { useEffect, useState } from 'react'
import { getOpenStatus } from '../config/clinic'

// Live "Open now / Closed" text, refreshed every minute
export default function useOpenStatus() {
  const [status, setStatus] = useState(getOpenStatus)
  useEffect(() => {
    const id = setInterval(() => setStatus(getOpenStatus()), 60000)
    return () => clearInterval(id)
  }, [])
  return status
}