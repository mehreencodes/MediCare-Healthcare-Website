import { useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import toast from 'react-hot-toast'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useOpenStatus from '../hooks/useOpenStatus'
import { CLINIC, DAYS, DOCTOR_NAMES, SERVICE_NAMES, fmtHour, wa } from '../config/clinic'
import { Phone, MessageCircle, Mail, MapPin, Clock, CalendarCheck, CheckCircle2, Siren, Send } from 'lucide-react'

/* How a request is delivered
   1. If the three EmailJS variables below are set, the request is
      emailed to the clinic (no backend needed).
   2. If they are not set, the form opens WhatsApp with the request
      already written, so no request is ever silently lost. */
const EMAILJS = {
  service: import.meta.env.VITE_EMAILJS_SERVICE_ID,
  template: import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
  key: import.meta.env.VITE_EMAILJS_PUBLIC_KEY,
}
const EMAIL_READY = Boolean(EMAILJS.service && EMAILJS.template && EMAILJS.key)

const TIMES = ['Any time', 'Morning', 'Afternoon', 'Evening']
const DOCTOR_ANY = 'Any available dentist'
const WEEK = [1, 2, 3, 4, 5, 6, 0]

/* ---------- helpers ---------- */
const heading = "font-['Source_Serif_4',Georgia,serif] tracking-tight text-[#0C3B4E]"

// Local date as YYYY-MM-DD (toISOString shifts the day for Pakistan mornings)
const toLocalISO = (d) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
const addDays = (n) => { const d = new Date(); d.setDate(d.getDate() + n); return d }
const fromISO = (s) => new Date(`${s}T00:00:00`)
const prettyDate = (s) => fromISO(s).toLocaleDateString('en-PK', { weekday: 'long', day: 'numeric', month: 'long' })

// Accepts 0300 1234567, 0300-1234567, +92 300 1234567, 923001234567
function normalizePhone(raw) {
  const digits = raw.replace(/[^\d+]/g, '').replace(/^\+/, '').replace(/^00/, '')
  const m = digits.match(/^(?:92|0)?(3\d{9})$/)
  return m ? `+92${m[1]}` : null
}
// Case-insensitive, partial match: ?doctor=Dr.%20Hira and ?service=Teeth%20Whitening both work
const matchName = (list, value) => {
  if (!value) return ''
  const v = value.trim().toLowerCase()
  return list.find((n) => n.toLowerCase() === v) ?? list.find((n) => n.toLowerCase().includes(v)) ?? ''
}

function buildMessage(f) {
  const lines = [
    `Assalam o Alaikum, I would like to book an appointment at ${CLINIC.name}.`,
    '',
    `Name: ${f.name.trim()}`,
    `Phone: ${f.phone.trim()}`,
    `Treatment: ${f.service}`,
    `Dentist: ${f.doctor}`,
    `Preferred day: ${prettyDate(f.date)}, ${f.time.toLowerCase()}`,
  ]
  if (f.urgent) lines.push('URGENT: severe pain or swelling right now')
  if (f.message.trim()) lines.push(`Problem: ${f.message.trim()}`)
  return lines.join('\n')
}

async function sendViaEmailJS(f) {
  const res = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      service_id: EMAILJS.service,
      template_id: EMAILJS.template,
      user_id: EMAILJS.key,
      template_params: {
        name: f.name.trim(),
        phone: f.phone.trim(),
        email: f.email.trim() || 'Not given',
        service: f.service,
        doctor: f.doctor,
        date: prettyDate(f.date),
        time: f.time,
        urgent: f.urgent ? 'YES, call immediately' : 'No',
        message: f.message.trim() || 'None',
      },
    }),
  })
  if (!res.ok) throw new Error(await res.text())
}

const inputCls = (bad) =>
  `w-full rounded-lg border bg-white px-3.5 py-3 text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 ${
    bad ? 'border-[#C93535] focus:ring-[#C93535]/25' : 'border-slate-300 focus:border-[#0E7C9B] focus:ring-[#0E7C9B]/25'
  }`

function Field({ id, label, optional, error, children }) {
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-slate-800">
        {label} {optional && <span className="font-normal text-slate-500">(optional)</span>}
      </label>
      {children}
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm text-[#B02A2A]">{error}</p>}
    </div>
  )
}

/* ---------- page ---------- */
export default function Contact() {
  useDocumentTitle(
    'Book an Appointment',
    `Book a dental appointment at ${CLINIC.name}, ${CLINIC.city}. Choose your treatment, dentist and day. We confirm by WhatsApp or phone. Emergency line open 24 hours.`
  )
  const reduce = useReducedMotion()
  const openStatus = useOpenStatus()
  const rise = reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: 'easeOut' } }
  const [params] = useSearchParams()

  // Other pages link here with ?service=, ?doctor= and ?day=Today|Tomorrow or ?date=YYYY-MM-DD
  const initial = useMemo(() => {
    const svc = params.get('service')
    const doc = params.get('doctor')
    const day = params.get('day')
    const date = params.get('date')
    return {
      name: '', phone: '', email: '', message: '', urgent: false, website: '',
     service: matchName(SERVICE_NAMES, svc),
doctor: matchName(DOCTOR_NAMES, doc) || DOCTOR_ANY,
      time: 'Any time',
      date: /^\d{4}-\d{2}-\d{2}$/.test(date || '') ? date : day === 'Today' ? toLocalISO(new Date()) : day === 'Tomorrow' ? toLocalISO(addDays(1)) : '',
    }
  }, [params])

  const [form, setForm] = useState(initial)
  const [errors, setErrors] = useState({})
  const [status, setStatus] = useState('idle') // idle | sending | sent | failed
  const [sentVia, setSentVia] = useState('')
  useEffect(() => { setForm(initial) }, [initial])

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((p) => ({ ...p, [key]: value }))
    if (errors[key]) setErrors((p) => ({ ...p, [key]: undefined }))
  }

  const todayISO = toLocalISO(new Date())
  const dayHours = form.date ? CLINIC.hours[fromISO(form.date).getDay()] : undefined

  function validate() {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Please enter your full name.'
    if (!normalizePhone(form.phone)) e.phone = 'Enter a Pakistani mobile number, like 0300 1234567.'
    if (form.email.trim() && !/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'This email address does not look right.'
    if (!form.service) e.service = 'Choose a treatment, or pick "Checkup & cleaning" if you are not sure.'
    if (!form.date) e.date = 'Choose the day you would like to visit.'
    else if (form.date < todayISO) e.date = 'Please choose today or a later date.'
    else if (dayHours === null) e.date = `The clinic is closed on ${DAYS[fromISO(form.date).getDay()]}s. Please pick another day.`
    return e
  }

  const openWhatsApp = () => window.open(wa(buildMessage(form)), '_blank', 'noopener')

  async function submit(ev) {
    ev.preventDefault()
    if (form.website) return // honeypot: real people never fill this field
    const e = validate()
    setErrors(e)
    if (Object.keys(e).length) {
      toast.error('Please fix the highlighted fields.')
      document.getElementById(Object.keys(e).map((k) => `f-${k}`).find((id) => document.getElementById(id)))?.focus()
      return
    }
    if (!EMAIL_READY) {
      openWhatsApp()
      setSentVia('whatsapp')
      setStatus('sent')
      return
    }
    setStatus('sending')
    try {
      await sendViaEmailJS(form)
      setSentVia('email')
      setStatus('sent')
      toast.success('Request sent to the clinic.')
    } catch {
      setStatus('failed')
      toast.error('Could not send the request. You can send it on WhatsApp instead.')
    }
  }

  const reset = () => { setForm(initial); setErrors({}); setStatus('idle') }

  return (
    <div className="bg-[#F7FBFC] text-slate-800">

      <section className="relative overflow-hidden bg-[#0C3B4E] pt-[72px] text-white">
  {/* Diagonal line texture (different from the tooth pattern on other pages) */}
  <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-[0.07]"
    style={{ backgroundImage: 'repeating-linear-gradient(135deg, #fff 0, #fff 1px, transparent 1px, transparent 14px)' }} />
  <div aria-hidden="true" className="pointer-events-none absolute -right-20 top-10 h-80 w-80 rounded-full bg-[#0E7C9B]/40 blur-3xl" />

  <motion.div {...rise} className="relative mx-auto max-w-6xl px-4 pb-28 pt-14 sm:px-6 lg:px-8 lg:pb-32">
   <p className="flex items-center gap-2 text-sm font-medium text-[#8FD6EA]">
  <span className={`h-2 w-2 rounded-full ${openStatus.open ? 'bg-emerald-400' : 'bg-amber-400'}`} aria-hidden="true" />
  {openStatus.text}
</p>
    <h1 className="mt-4 max-w-2xl font-['Source_Serif_4',Georgia,serif] text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
      Book a visit, or just <span className="italic text-[#8FD6EA]">ask us anything.</span>
    </h1>
    <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
      Send a request below and we confirm the time by WhatsApp or phone. For severe pain, call, the emergency line never closes.
    </p>
  </motion.div>
</section>

{/* Quick contact cards overlapping the banner */}
<section className="relative z-10 mx-auto -mt-16 max-w-6xl px-4 sm:px-6 lg:px-8">
  <ul className="grid gap-4 md:grid-cols-3">
    <li>
      <a href={`tel:${CLINIC.phoneTel}`} className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_18px_40px_-18px_rgba(12,59,78,0.5)] ring-1 ring-slate-200 transition hover:ring-[#0E7C9B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF4F7] text-[#0E7C9B]"><Phone size={21} /></span>
        <span className="min-w-0">
          <span className="block text-xs text-slate-500">Call us</span>
          <span className="block font-semibold text-slate-900">{CLINIC.phoneDisplay}</span>
          <span className="block text-xs text-slate-500">Emergency line, 24 hours</span>
        </span>
      </a>
    </li>
    <li>
      <a href={wa('Assalam o Alaikum, I have a question.')} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_18px_40px_-18px_rgba(12,59,78,0.5)] ring-1 ring-slate-200 transition hover:ring-[#1A8F5B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F5B]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#E6F6EE] text-[#1A8F5B]"><MessageCircle size={21} /></span>
        <span className="min-w-0">
          <span className="block text-xs text-slate-500">Message us</span>
          <span className="block font-semibold text-slate-900">WhatsApp</span>
          <span className="block text-xs text-slate-500">Quickest way to ask a question</span>
        </span>
      </a>
    </li>
    <li>
      <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CLINIC.mapsQuery)}`} target="_blank" rel="noreferrer" className="flex items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_18px_40px_-18px_rgba(12,59,78,0.5)] ring-1 ring-slate-200 transition hover:ring-[#0E7C9B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B]">
        <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#EAF4F7] text-[#0E7C9B]"><MapPin size={21} /></span>
        <span className="min-w-0">
          <span className="block text-xs text-slate-500">Visit us</span>
          <span className="block font-semibold text-slate-900">{CLINIC.area}, {CLINIC.city}</span>
          <span className="block text-xs text-slate-500">Tap for directions</span>
        </span>
      </a>
    </li>
  </ul>
</section>

      <section className="mx-auto grid max-w-6xl items-start gap-10 px-4 py-10 sm:px-6 lg:grid-cols-5 lg:gap-12 lg:px-8">

        {/* FORM / SUCCESS */}
        <div className="lg:col-span-3">
          {status === 'sent' ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-8" role="status">
              <CheckCircle2 size={40} className="text-emerald-600" />
              <h2 className={`${heading} mt-4 text-2xl font-semibold`}>
                {sentVia === 'email' ? 'Request received.' : 'One last step: press Send in WhatsApp.'}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-slate-600">
                {sentVia === 'email'
                  ? `We will confirm your visit on ${form.phone.trim()} during clinic hours. For anything urgent, call us.`
                  : 'We opened WhatsApp with your request already written. Your appointment is only requested once you press Send there.'}
              </p>

              <dl className="mt-6 grid gap-3 rounded-xl bg-[#F7FBFC] p-5 text-sm sm:grid-cols-2">
                <div><dt className="text-xs text-slate-500">Treatment</dt><dd className="font-medium">{form.service}</dd></div>
                <div><dt className="text-xs text-slate-500">Dentist</dt><dd className="font-medium">{form.doctor}</dd></div>
                <div><dt className="text-xs text-slate-500">Preferred day</dt><dd className="font-medium">{prettyDate(form.date)}</dd></div>
                <div><dt className="text-xs text-slate-500">Time</dt><dd className="font-medium">{form.time}</dd></div>
              </dl>

              <div className="mt-6 flex flex-wrap gap-3">
                <button onClick={openWhatsApp} className="inline-flex items-center gap-2 rounded-lg bg-[#1A8F5B] px-5 py-3 text-sm font-semibold text-white hover:bg-[#157A4C]">
                  <MessageCircle size={17} /> {sentVia === 'email' ? 'Also message us on WhatsApp' : 'Open WhatsApp again'}
                </button>
                <button onClick={reset} className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-800 hover:border-slate-500">
                  Book another appointment
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 sm:p-8">
              <div>
                <h2 className={`${heading} text-2xl font-semibold`}>Your details</h2>
                <p className="mt-1 text-sm text-slate-500">Fields marked optional can be left empty.</p>
              </div>

              {/* Honeypot, hidden from people */}
              <div className="hidden" aria-hidden="true">
                <label>Website<input tabIndex={-1} autoComplete="off" value={form.website} onChange={set('website')} /></label>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="f-name" label="Full name" error={errors.name}>
                  <input id="f-name" autoComplete="name" value={form.name} onChange={set('name')} placeholder="Ayesha Raza"
                    aria-invalid={!!errors.name} aria-describedby={errors.name ? 'f-name-error' : undefined} className={inputCls(errors.name)} />
                </Field>
                <Field id="f-phone" label="Mobile number" error={errors.phone}>
                  <input id="f-phone" type="tel" inputMode="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} placeholder="0300 1234567"
                    aria-invalid={!!errors.phone} aria-describedby={errors.phone ? 'f-phone-error' : undefined} className={inputCls(errors.phone)} />
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="f-service" label="Treatment" error={errors.service}>
                  <select id="f-service" value={form.service} onChange={set('service')}
                    aria-invalid={!!errors.service} aria-describedby={errors.service ? 'f-service-error' : undefined} className={inputCls(errors.service)}>
                    <option value="">Select a treatment</option>
                    {SERVICE_NAMES.map((s) => <option key={s}>{s}</option>)}
                  </select>
                </Field>
                <Field id="f-doctor" label="Dentist">
                  <select id="f-doctor" value={form.doctor} onChange={set('doctor')} className={inputCls(false)}>
                    <option>{DOCTOR_ANY}</option>
                    {DOCTOR_NAMES.map((d) => <option key={d}>{d}</option>)}
                  </select>
                </Field>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Field id="f-date" label="Preferred day" error={errors.date}>
                  <input id="f-date" type="date" min={todayISO} value={form.date} onChange={set('date')}
                    aria-invalid={!!errors.date} aria-describedby={errors.date ? 'f-date-error' : undefined} className={inputCls(errors.date)} />
                  {form.date && dayHours && !errors.date && (
                    <p className="mt-1.5 text-xs text-slate-500">Clinic is open {fmtHour(dayHours.open)} to {fmtHour(dayHours.close)} that day.</p>
                  )}
                </Field>
                <fieldset>
                  <legend className="mb-1.5 text-sm font-medium text-slate-800">Preferred time</legend>
                  <div className="grid grid-cols-2 gap-2">
                    {TIMES.map((t) => (
                      <label key={t} className={`cursor-pointer rounded-lg border px-3 py-2.5 text-center text-sm font-medium transition has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#0E7C9B] ${
                        form.time === t ? 'border-[#0C3B4E] bg-[#0C3B4E] text-white' : 'border-slate-300 text-slate-700 hover:border-slate-500'
                      }`}>
                        <input type="radio" name="time" value={t} checked={form.time === t} onChange={set('time')} className="sr-only" />
                        {t}
                      </label>
                    ))}
                  </div>
                </fieldset>
              </div>

              <Field id="f-email" label="Email" optional error={errors.email}>
                <input id="f-email" type="email" autoComplete="email" value={form.email} onChange={set('email')} placeholder="you@example.com"
                  aria-invalid={!!errors.email} aria-describedby={errors.email ? 'f-email-error' : undefined} className={inputCls(errors.email)} />
              </Field>

              <Field id="f-message" label="What is the problem?" optional>
                <textarea id="f-message" rows={3} value={form.message} onChange={set('message')}
                  placeholder="For example: pain in the lower right tooth for three days" className={`${inputCls(false)} resize-none`} />
              </Field>

              <label className="flex cursor-pointer items-start gap-3 rounded-lg bg-[#FBEAEA] p-4 text-sm text-[#7F1D1D]">
                <input type="checkbox" checked={form.urgent} onChange={set('urgent')} className="mt-0.5 h-4 w-4 accent-[#C93535]" />
                <span><span className="font-semibold">I have severe pain or swelling right now.</span> A form can wait, a phone call cannot.</span>
              </label>

              {form.urgent && (
                <div className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[#C93535]/30 p-4" role="alert">
                  <p className="text-sm font-medium text-[#7F1D1D]">Please call us now so we can fit you in today.</p>
                  <a href={`tel:${CLINIC.phoneTel}`} className="inline-flex items-center gap-2 rounded-lg bg-[#C93535] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#B02A2A]">
                    <Phone size={16} /> Call {CLINIC.phoneDisplay}
                  </a>
                </div>
              )}

              <button type="submit" disabled={status === 'sending'}
                className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#0E7C9B] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#0B6782] disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B]">
                {status === 'sending'
                  ? <><span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> Sending request</>
                  : EMAIL_READY ? <><Send size={16} /> Send appointment request</> : <><MessageCircle size={16} /> Send request on WhatsApp</>}
              </button>

              {status === 'failed' && (
                <div className="rounded-lg border border-slate-300 p-4 text-sm text-slate-700" role="alert">
                  The request did not go through. Your details are still here.
                  <div className="mt-3 flex flex-wrap gap-3">
                    <button type="button" onClick={openWhatsApp} className="inline-flex items-center gap-2 rounded-lg bg-[#1A8F5B] px-4 py-2 font-semibold text-white hover:bg-[#157A4C]">
                      <MessageCircle size={16} /> Send on WhatsApp instead
                    </button>
                    <a href={`tel:${CLINIC.phoneTel}`} className="inline-flex items-center gap-2 rounded-lg border border-slate-300 px-4 py-2 font-semibold hover:border-slate-500">
                      <Phone size={16} /> Call us
                    </a>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>

        {/* SIDEBAR */}
        <aside className="space-y-5 lg:col-span-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className={`${heading} text-xl font-semibold`}>Reach us directly</h2>
            <ul className="mt-4 space-y-4 text-sm">
              <li><a href={`tel:${CLINIC.phoneTel}`} className="flex items-start gap-3 hover:text-[#0E7C9B]"><Phone size={18} className="mt-0.5 shrink-0 text-[#0E7C9B]" /><span><span className="block font-semibold text-slate-900">{CLINIC.phoneDisplay}</span><span className="text-slate-500">Call for urgent cases</span></span></a></li>
              <li><a href={wa('Assalam o Alaikum, I have a question.')} target="_blank" rel="noreferrer" className="flex items-start gap-3 hover:text-[#0E7C9B]"><MessageCircle size={18} className="mt-0.5 shrink-0 text-[#0E7C9B]" /><span><span className="block font-semibold text-slate-900">WhatsApp</span><span className="text-slate-500">Quickest way to ask a question</span></span></a></li>
              <li><a href={`mailto:${CLINIC.email}`} className="flex items-start gap-3 hover:text-[#0E7C9B]"><Mail size={18} className="mt-0.5 shrink-0 text-[#0E7C9B]" /><span><span className="block font-semibold text-slate-900">{CLINIC.email}</span><span className="text-slate-500">For reports and non-urgent mail</span></span></a></li>
              <li className="flex items-start gap-3"><MapPin size={18} className="mt-0.5 shrink-0 text-[#0E7C9B]" /><span className="font-medium text-slate-900">{CLINIC.address}</span></li>
            </ul>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6">
            <h2 className="flex items-center gap-2 font-semibold text-slate-900"><Clock size={18} className="text-[#0E7C9B]" /> Clinic hours</h2>
            <table className="mt-3 w-full text-sm">
              <caption className="sr-only">Clinic hours</caption>
              <tbody>
                {WEEK.map((d) => {
                  const h = CLINIC.hours[d]
                  const isToday = d === new Date().getDay()
                  return (
                    <tr key={d} className={isToday ? 'bg-[#EAF4F7] font-semibold text-[#0C3B4E]' : 'text-slate-700'}>
                      <th scope="row" className="px-2 py-1.5 text-left font-[inherit]">{DAYS[d]}{isToday && ' (today)'}</th>
                      <td className="px-2 py-1.5 text-right">{h ? `${fmtHour(h.open)} to ${fmtHour(h.close)}` : 'Closed'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          <div className="rounded-2xl bg-[#C93535] p-6 text-white">
            <h2 className="flex items-center gap-2 text-lg font-semibold"><Siren size={20} /> Dental emergency, 24 hours</h2>
            <p className="mt-2 text-sm text-white/90">Severe pain, swelling or a broken tooth? Call, do not wait for a form.</p>
            <a href={`tel:${CLINIC.phoneTel}`} className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-[#9B1C1C] hover:bg-[#FBEAEA]">
              <Phone size={16} /> {CLINIC.phoneDisplay}
            </a>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
            <iframe
              title={`${CLINIC.name} location map`}
              src={`https://www.google.com/maps?q=${encodeURIComponent(CLINIC.mapsQuery)}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="h-48 w-full border-0"
            />
            <div className="flex items-center justify-between gap-3 p-4">
              <p className="text-sm font-medium text-slate-900">{CLINIC.area}, {CLINIC.city}</p>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CLINIC.mapsQuery)}`} target="_blank" rel="noreferrer" className="text-sm font-semibold text-[#0E7C9B] hover:underline">
                Get directions
              </a>
            </div>
          </div>
        </aside>
      </section>
    </div>
  )
}