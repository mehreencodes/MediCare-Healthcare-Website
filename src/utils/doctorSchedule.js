import { DAYS, fmtHour } from '../config/clinic'

/*
  Pure functions, no React. Easy to test and reuse.
  A doctor's `schedule` is an object keyed by weekday index
  (0 = Sunday ... 6 = Saturday): { 1: { open: 16, close: 21 }, ... }
*/

// When is this doctor next in the clinic? Also says if they are in today.
export function getNextSlot(schedule, now = new Date()) {
  const h = now.getHours() + now.getMinutes() / 60
  for (let i = 0; i <= 7; i++) {
    const d = (now.getDay() + i) % 7
    const s = schedule[d]
    if (!s) continue
    if (i === 0) {
      if (h >= s.close) continue // today's session is already over
      if (h >= s.open) return { rank: 0, today: true, label: `In the clinic now, until ${fmtHour(s.close)}` }
      return { rank: s.open - h, today: true, label: `Today, ${fmtHour(s.open)} to ${fmtHour(s.close)}` }
    }
    const when = i === 1 ? 'Tomorrow' : DAYS[d]
    return { rank: i * 24 + s.open - h, today: false, label: `${when}, ${fmtHour(s.open)} to ${fmtHour(s.close)}` }
  }
  return { rank: 999, today: false, label: 'No schedule listed' }
}

// Applies the URL filters to the doctor list and sorts by who is available soonest
export function filterDoctors(doctors, filters, now = new Date()) {
  const needle = filters.q.trim().toLowerCase()
  const spec = filters.specialty.trim().toLowerCase()

  return doctors
    .map((d) => ({ ...d, slot: getNextSlot(d.schedule, now) }))
    .filter((d) => {
      // "specialty" matches a specialty name (Orthodontist) or a treatment (Root canal)
      if (spec && d.specialty.toLowerCase() !== spec && !d.treats.some((t) => t.toLowerCase().includes(spec))) return false
      if (filters.gender !== 'any' && d.gender !== filters.gender) return false
      if (filters.today && !d.slot.today) return false
      if (needle && ![d.name, d.specialty, ...d.treats].join(' ').toLowerCase().includes(needle)) return false
      return true
    })
    .sort((a, b) => a.slot.rank - b.slot.rank)
}