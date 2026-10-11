import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import { filterDoctors } from '../utils/doctorSchedule'

/*
  URL-driven filter state for the Doctors page.
  The URL is the single source of truth: there is no separate useState.
    /doctors?q=braces&specialty=Orthodontist&gender=female&today=true
  Opening that link restores the exact same filters, and Back/Forward work.
  Needs react-router-dom 6.4 or newer (functional setSearchParams).
*/

const FILTER_KEYS = ['q', 'specialty', 'gender', 'today']
const GENDERS = ['female', 'male']

// URL -> filter object
function parse(params) {
  const gender = params.get('gender')
  const specialty = params.get('specialty') ?? ''
  return {
    q: params.get('q') ?? '',
    specialty: specialty === 'All' ? '' : specialty, // '' means every specialty
    gender: GENDERS.includes(gender) ? gender : 'any',
    today: ['1', 'true'].includes(params.get('today')), // accepts ?today=1 and ?today=true
  }
}

// Filter value -> URL text, or null to remove the parameter (keeps URLs short)
function encode(key, value) {
  switch (key) {
    case 'q': return value || null
    case 'specialty': return value && value !== 'All' ? value : null
    case 'gender': return GENDERS.includes(value) ? value : null
    case 'today': return value ? 'true' : null
    default: return null
  }
}

export default function useDoctorFilters(doctors, now) {
  const [params, setParams] = useSearchParams()

  const filters = useMemo(() => parse(params), [params])
  const specialties = useMemo(() => [...new Set(doctors.map((d) => d.specialty))], [doctors])
  const results = useMemo(() => filterDoctors(doctors, filters, now), [doctors, filters, now])

  const setFilter = useCallback(
    (key, value) =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev) // other params, like ?service=, are kept
          const out = encode(key, value)
          if (out === null) next.delete(key)
          else next.set(key, out)
          return next
        },
        { replace: true }
      ),
    [setParams]
  )

  const reset = useCallback(
    () =>
      setParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          FILTER_KEYS.forEach((k) => next.delete(k))
          return next
        },
        { replace: true }
      ),
    [setParams]
  )

  const hasFilters = Boolean(filters.q || filters.specialty || filters.gender !== 'any' || filters.today)

  return {
    filters,
    results,
    specialties,
    hasFilters,
    service: params.get('service') ?? '', // carried through to the booking form
    setFilter,
    reset,
  }
}