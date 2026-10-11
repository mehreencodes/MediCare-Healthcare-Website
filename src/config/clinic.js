export const CLINIC = {
  name: 'Noor Family Clinic',
  city: 'Lahore',
  area: 'Gulberg',
  address: 'Office 12, Main Boulevard, Gulberg III, Lahore',
  phoneDisplay: '+92 345 3467812',
  phoneTel: '+92323789465',
  whatsapp: '923234576849', // international format, no +
  email: 'info@noorclinic.pk',
  // Add full profile URLs. Empty ones are hidden in the footer.
  social: { facebook: '', instagram: '' },
  mapsQuery: 'Main Boulevard Gulberg III, Lahore',
  // 0 = Sunday ... 6 = Saturday. open/close in 24h decimal. null = closed.
  hours: {
    0: { open: 10, close: 14 },
    1: { open: 9, close: 21 },
    2: { open: 9, close: 21 },
    3: { open: 9, close: 21 },
    4: { open: 9, close: 21 },
    5: { open: 9, close: 21 },
    6: { open: 9, close: 21 },
  },
}

export const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export const wa = (msg) =>
  `https://wa.me/${CLINIC.whatsapp}?text=${encodeURIComponent(msg)}`

export const fmtHour = (h) => {
  const hh = Math.floor(h)
  const mm = Math.round((h - hh) * 60)
  return `${((hh + 11) % 12) + 1}:${String(mm).padStart(2, '0')} ${hh >= 12 ? 'PM' : 'AM'}`
}

export function getOpenStatus(now = new Date()) {
  const h = now.getHours() + now.getMinutes() / 60
  const today = CLINIC.hours[now.getDay()]
  if (today && h >= today.open && h < today.close) {
    return { open: true, text: `Open now, until ${fmtHour(today.close)}` }
  }
  for (let i = 0; i <= 7; i++) {
    const d = (now.getDay() + i) % 7
    const slot = CLINIC.hours[d]
    if (!slot) continue
    if (i === 0 && h >= slot.open) continue // already closed for today
    const when = i === 0 ? 'today' : i === 1 ? 'tomorrow' : DAYS[d]
    return { open: false, text: `Closed, opens ${when} at ${fmtHour(slot.open)}` }
  }
  return { open: false, text: 'Closed' }
}

// Names used by the booking form dropdowns. Keep these in sync with
export const SERVICE_NAMES = [
  'Checkup & cleaning',
  'Fillings',
  'Root canal treatment',
  'Teeth whitening',
  'Veneers & smile design',
  'Braces & aligners',
  'Dental implants',
  'Wisdom tooth removal',
  'Kids dentistry',
]

export const DOCTOR_NAMES = [
  'Dr. Hira Baig',
  'Dr. Ali Hassan',
  'Dr. Zunaira Imran',
  'Dr. Omar Siddiqui',
  'Dr. Zara Malik',
  'Dr. Bilal Raza',
  'Dr. Sara Ahmed',
  'Dr. Usman Tariq',
]

// Groups the weekly hours into short lines,
export function summarizeHours() {
  const order = [1, 2, 3, 4, 5, 6, 0]
  const label = (a, b) => (a === b ? DAYS[a].slice(0, 3) : `${DAYS[a].slice(0, 3)} to ${DAYS[b].slice(0, 3)}`)
  const same = (x, y) => (!x && !y) || (x && y && x.open === y.open && x.close === y.close)
  const out = []
  let start = 0
  for (let i = 1; i <= order.length; i++) {
    if (i === order.length || !same(CLINIC.hours[order[i]], CLINIC.hours[order[start]])) {
      const h = CLINIC.hours[order[start]]
      out.push({
        days: label(order[start], order[i - 1]),
        hours: h ? `${fmtHour(h.open)} to ${fmtHour(h.close)}` : 'Closed',
      })
      start = i
    }
  }
  return out
}
// Builds the WhatsApp message from whatever we know about the patient's request
export function bookingMessage({ issue, service, doctor } = {}) {
  if (issue) return `Assalam o Alaikum, ${issue}`
  let msg = 'Assalam o Alaikum, I would like to book an appointment'
  if (service) msg += ` for ${service}`
  if (doctor) msg += ` with ${doctor}`
  return `${msg}. Please share the available timings.`
}

export const waBooking = (opts) => wa(bookingMessage(opts))