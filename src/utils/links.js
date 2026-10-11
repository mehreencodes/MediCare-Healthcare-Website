/*
  One place that builds every deep link between pages, so the query
  parameter names (service, doctor, day, q, specialty ...) never drift.
*/

// What to search for on the Doctors page when someone picks a treatment
const DOCTOR_QUERY = {
  'Checkup & cleaning': 'checkup',
  'Fillings': 'fillings',
  'Root canal treatment': 'root canal',
  'Teeth whitening': 'whitening',
  'Veneers & smile design': 'veneers',
  'Braces & aligners': 'braces',
  'Dental implants': 'implants',
  'Wisdom tooth removal': 'wisdom',
  'Kids dentistry': 'kids',
}

const toQuery = (obj) => {
  const p = new URLSearchParams()
  Object.entries(obj).forEach(([k, v]) => v && p.set(k, v))
  const s = p.toString()
  return s ? `?${s}` : ''
}

// /contact?service=Teeth+whitening&doctor=Dr.+Hira+Baig&day=Today
export const contactLink = ({ service, doctor, day } = {}) => `/contact${toQuery({ service, doctor, day })}`

// /doctors?q=whitening&service=Teeth+whitening
export const doctorsLink = ({ q, specialty, gender, today, service } = {}) =>
  `/doctors${toQuery({
    q: q ?? DOCTOR_QUERY[service],
    specialty,
    gender,
    today: today ? 'true' : '',
    service,
  })}`