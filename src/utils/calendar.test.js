import { describe, it, expect } from 'vitest'
import { appointmentWindow, buildIcs, escapeText, fold, toIcsUtc } from './calendar'

const weekday = { open: 9, close: 21 }
const sunday = { open: 10, close: 14 }

describe('appointmentWindow (Pakistan time, written as UTC)', () => {
  it('evening starts at 6 PM, which is 13:00 UTC', () => {
    const { start, end } = appointmentWindow({ date: '2026-10-12', time: 'Evening', hours: weekday })
    expect(toIcsUtc(start)).toBe('20261012T130000Z')
    expect(toIcsUtc(end)).toBe('20261012T134500Z')
  })
  it('"Any time" starts when the clinic opens', () => {
    const { start } = appointmentWindow({ date: '2026-10-12', time: 'Any time', hours: weekday })
    expect(toIcsUtc(start)).toBe('20261012T040000Z')
  })
  it('keeps the visit inside short opening hours', () => {
    const { start, end } = appointmentWindow({ date: '2026-10-11', time: 'Evening', hours: sunday })
    expect(toIcsUtc(start)).toBe('20261011T081500Z') // 1:15 PM
    expect(toIcsUtc(end)).toBe('20261011T090000Z') // 2:00 PM, the closing time
  })
})

describe('ics text rules', () => {
  it('escapes commas, semicolons and line breaks', () => {
    expect(escapeText('a, b; c\nd')).toBe('a\\, b\\; c\\nd')
  })
  it('folds long lines to 75 bytes or less', () => {
    const folded = fold('DESCRIPTION:' + 'word '.repeat(60))
    folded.split('\r\n').forEach((line) => expect(new TextEncoder().encode(line).length).toBeLessThanOrEqual(75))
    expect(folded.replace(/\r\n /g, '')).toBe('DESCRIPTION:' + 'word '.repeat(60))
  })
})

describe('buildIcs', () => {
  const { start, end } = appointmentWindow({ date: '2026-10-12', time: 'Evening', hours: weekday })
  const ics = buildIcs(
    { start, end, summary: 'Dental appointment request: Braces, aligners', description: 'Line one\nLine two', location: 'Clinic, Lahore' },
    new Date(Date.UTC(2026, 9, 11, 12, 0, 0))
  )
  it('is a complete calendar with CRLF line endings', () => {
    expect(ics.startsWith('BEGIN:VCALENDAR\r\n')).toBe(true)
    expect(ics.endsWith('END:VCALENDAR\r\n')).toBe(true)
    expect(ics).toContain('DTSTART:20261012T130000Z')
  })
  it('marks the visit as tentative because the clinic still has to confirm it', () => {
    expect(ics).toContain('STATUS:TENTATIVE')
  })
  it('escapes the summary', () => {
    expect(ics).toContain('SUMMARY:Dental appointment request: Braces\\, aligners')
  })
})