import { describe, it, expect } from 'vitest'
import { getNextSlot, filterDoctors } from './doctorSchedule'
import { contactLink, doctorsLink } from './links'
import { DOCTORS } from '../data/doctors'

const monday = (h) => new Date(2026, 9, 12, h) // Monday 12 Oct 2026
const none = { q: '', specialty: '', gender: 'any', today: false }

describe('getNextSlot', () => {
  const sch = { 1: { open: 16, close: 21 } }
  it('before the session', () => expect(getNextSlot(sch, monday(10))).toMatchObject({ today: true }))
  it('during the session', () => expect(getNextSlot(sch, monday(18)).label).toMatch(/in the clinic now/i))
  it('after the session', () => expect(getNextSlot(sch, monday(22)).today).toBe(false))
})

describe('filterDoctors', () => {
  it('today filter only returns doctors who are in today', () => {
    const res = filterDoctors(DOCTORS, { ...none, today: true }, monday(18))
    expect(res.every((d) => d.slot.today)).toBe(true)
  })
  it('gender filter', () => {
    const res = filterDoctors(DOCTORS, { ...none, gender: 'female' }, monday(10))
    expect(res.length).toBeGreaterThan(0)
    expect(res.every((d) => d.gender === 'female')).toBe(true)
  })
  it('specialty can match a treatment', () => {
    const res = filterDoctors(DOCTORS, { ...none, specialty: 'root canal' }, monday(10))
    expect(res.map((d) => d.name)).toContain('Dr. Ali Hassan')
  })
  it('sorts by who is available soonest', () => {
    const res = filterDoctors(DOCTORS, none, monday(10))
    expect(res[0].slot.rank).toBeLessThanOrEqual(res[1].slot.rank)
  })
})

describe('deep links', () => {
  it('contactLink encodes values', () =>
    expect(contactLink({ service: 'Teeth whitening', doctor: 'Dr. Hira Baig' })).toBe('/contact?service=Teeth+whitening&doctor=Dr.+Hira+Baig'))
  it('doctorsLink turns a service into a search', () =>
    expect(doctorsLink({ service: 'Root canal treatment' })).toContain('q=root+canal'))
})