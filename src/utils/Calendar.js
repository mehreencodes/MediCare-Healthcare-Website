/*
  Builds an .ics calendar file (RFC 5545) for a booking request.
  Pure functions, no DOM, so they are easy to unit test.

  Times are worked out for Pakistan (UTC+5, no daylight saving) and written as UTC,
  so the reminder lands at the right moment whatever time zone the phone is set to.
*/

const PK_OFFSET_HOURS = 5
const SLOT_START = { Morning: 10, Afternoon: 14, Evening: 18 } // 24h, used when a time of day is chosen
const DURATION_HOURS = 0.75 // 45 minutes

const pad = (n) => String(n).padStart(2, '0')

// 20261012T130000Z
export const toIcsUtc = (d) =>
  `${d.getUTCFullYear()}${pad(d.getUTCMonth() + 1)}${pad(d.getUTCDate())}` +
  `T${pad(d.getUTCHours())}${pad(d.getUTCMinutes())}${pad(d.getUTCSeconds())}Z`

// Picks a start and end inside the clinic's opening hours for that day
export function appointmentWindow({ date, time, hours }) {
  const [y, m, d] = date.split('-').map(Number)
  const wanted = SLOT_START[time] ?? hours.open // "Any time" starts when the clinic opens
  const startHour = Math.min(Math.max(wanted, hours.open), hours.close - DURATION_HOURS)
  const at = (h) => new Date(Date.UTC(y, m - 1, d, Math.floor(h) - PK_OFFSET_HOURS, Math.round((h % 1) * 60)))
  return { start: at(startHour), end: at(startHour + DURATION_HOURS) }
}

// Commas, semicolons, backslashes and line breaks have special meaning in .ics text
export const escapeText = (s) =>
  String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

// Lines longer than 75 bytes must be folded onto the next line, starting with a space
export function fold(line) {
  const enc = new TextEncoder()
  if (enc.encode(line).length <= 75) return line
  const parts = []
  let current = ''
  let bytes = 0
  let limit = 75
  for (const ch of line) {
    const b = enc.encode(ch).length
    if (bytes + b > limit) {
      parts.push(current)
      current = ''
      bytes = 0
      limit = 74 // the leading space of a continuation line takes one byte
    }
    current += ch
    bytes += b
  }
  parts.push(current)
  return parts.join('\r\n ')
}

export function buildIcs({ start, end, summary, description, location, uid }, now = new Date()) {
  const id = uid ?? `${toIcsUtc(start)}-${summary.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 40)}@clinic-booking`
  const lines = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Dental clinic booking//EN',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${id}`,
    `DTSTAMP:${toIcsUtc(now)}`,
    `DTSTART:${toIcsUtc(start)}`,
    `DTEND:${toIcsUtc(end)}`,
    `SUMMARY:${escapeText(summary)}`,
    `DESCRIPTION:${escapeText(description)}`,
    `LOCATION:${escapeText(location)}`,
    'STATUS:TENTATIVE', // it is a request, the clinic confirms the real time
    'TRANSP:OPAQUE',
    'BEGIN:VALARM',
    'ACTION:DISPLAY',
    'DESCRIPTION:Dental appointment request',
    'TRIGGER:-PT2H',
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ]
  return lines.map(fold).join('\r\n') + '\r\n'
}

// Maps the booking form to a calendar event. The patient's problem is left out on purpose:
// calendars often sync to shared devices.
export function appointmentToEvent({ service, doctor, date, time }, clinic, hours) {
  const { start, end } = appointmentWindow({ date, time, hours })
  const description = [
    `Treatment: ${service}`,
    `Dentist: ${doctor}`,
    `Preferred time: ${time}`,
    'This is a request. The clinic confirms the exact time by WhatsApp or phone.',
    `Clinic phone: ${clinic.phoneDisplay}`,
  ].join('\n')
  return {
    start,
    end,
    summary: `Dental appointment request: ${service}`,
    description,
    location: `${clinic.name}, ${clinic.address}`,
  }
}