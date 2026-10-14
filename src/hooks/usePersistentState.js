import { useCallback, useEffect, useRef, useState } from 'react'

/*
  useState that survives a refresh, stored in localStorage on this device only.
  - drafts expire (default 24 hours) because they can hold a name and phone number
  - `shouldSave(value)` decides when a draft is worth keeping, so an empty form saves nothing
  - `exclude` lists fields that must never be stored (like a spam trap field)
  - `overrides` win over a saved draft on first load (values that come from the URL)
  - every storage call is wrapped in try/catch: private mode or a full disk must not break the page
  Returns [value, setValue, { restored, clear, reset }]
*/

const read = (key, version, maxAgeMs) => {
  try {
    const raw = window.localStorage.getItem(key)
    if (!raw) return null
    const saved = JSON.parse(raw)
    if (saved?.v !== version || Date.now() - saved.t > maxAgeMs) {
      window.localStorage.removeItem(key)
      return null
    }
    return saved.data
  } catch {
    return null
  }
}
const write = (key, version, data) => {
  try { window.localStorage.setItem(key, JSON.stringify({ v: version, t: Date.now(), data })) } catch { /* ignore */ }
}
const remove = (key) => {
  try { window.localStorage.removeItem(key) } catch { /* ignore */ }
}

const DAY = 24 * 60 * 60 * 1000

export default function usePersistentState(key, initialValue, options = {}) {
  const optsRef = useRef(options)
  optsRef.current = options
  const initialRef = useRef(initialValue)
  initialRef.current = initialValue

  // Work out the starting value once
  const startRef = useRef(null)
  if (startRef.current === null) {
    const { version = 1, maxAgeMs = DAY, sanitize, overrides } = options
    let saved = read(key, version, maxAgeMs)
    if (saved && sanitize) saved = sanitize(saved)
    startRef.current = {
      value: saved ? { ...initialValue, ...saved, ...overrides } : initialValue,
      restored: Boolean(saved),
    }
  }

  const [value, setValue] = useState(startRef.current.value)
  const [restored, setRestored] = useState(startRef.current.restored)

  useEffect(() => {
    const { version = 1, shouldSave, exclude = [] } = optsRef.current
    if (shouldSave && !shouldSave(value)) {
      remove(key)
      return
    }
    const data = { ...value }
    exclude.forEach((k) => delete data[k])
    write(key, version, data)
  }, [key, value])

  const clear = useCallback(() => remove(key), [key])
  const reset = useCallback(() => {
    remove(key)
    setRestored(false)
    setValue(initialRef.current)
  }, [key])

  return [value, setValue, { restored, clear, reset }]
}