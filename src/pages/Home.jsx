import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useOpenStatus from '../hooks/useOpenStatus'
import { CLINIC, DAYS, SERVICE_NAMES, wa, fmtHour } from '../config/clinic'
import { DOCTORS } from '../data/doctors'
import Pricing from '../components/home/Pricing'
import Reviews from '../components/home/Reviews'
import BeforeAfter from '../components/home/BeforeAfter'
import EmergencyTriage from '../components/home/EmergencyTriage'
import heroDoc from '../assets/hero-doc.png'
import { contactLink, doctorsLink } from '../utils/links'
import {
  Phone, MessageCircle, CalendarCheck, Smile, Wrench, Pin, Sparkles, Baby, Syringe,
  HeartPulse, ShieldCheck, BadgeCheck, Clock, MapPin, ChevronDown,
} from 'lucide-react'

/* ---------- Images ---------- */
const HERO_IMG = heroDoc
const u = (id, w = 900) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=75`

const A = 'https://i.pinimg.com/736x/a9/6e/f3/a96ef3a5ee342c29c9fd1483f91b8f35.jpg'
const B = 'https://i.pinimg.com/736x/7b/6c/bf/7b6cbf01d703800620349d8f2c3b7749.jpg'
const C = 'https://i.pinimg.com/736x/3e/25/87/3e2587412d2dd62ed106452a421354b9.jpg'
const D = 'https://i.pinimg.com/1200x/45/88/38/458838828a0132fd9ed28e57f0bf70db.jpg'
const E = 'https://i.pinimg.com/736x/78/f5/ae/78f5ae4ac38f6a494df669eacb47dce9.jpg'
const F = 'https://i.pinimg.com/736x/2a/1f/5b/2a1f5be1de7ffbc23a225986fbfe0b38.jpg'

const CLINIC_IMG = u('photo-1629909613654-28e377c37b09', 1000)

const SERVICES = [
  { icon: Smile, title: 'General dentistry', desc: 'Checkups, cleaning and fillings.', img: A },
  { icon: Wrench, title: 'Braces & aligners', desc: 'Straighter teeth at any age.', img: B },
  { icon: Pin, title: 'Dental implants', desc: 'A permanent fix for missing teeth.', img: C },
  { icon: Sparkles, title: 'Teeth whitening', desc: 'A brighter smile in one visit.', img: D },
  { icon: Baby, title: 'Kids dentistry', desc: 'Gentle care for growing smiles.', img: E },
  { icon: Syringe, title: 'Root canal', desc: 'Pain relief that saves your tooth.', img: F },
]

const TRUST = [
  { icon: BadgeCheck, title: 'PMDC registered', sub: 'All our dentists' },
  { icon: ShieldCheck, title: 'Sterilised tools', sub: 'For every patient' },
  { icon: HeartPulse, title: 'Painless care', sub: 'Modern techniques' },
  { icon: Clock, title: 'Evening slots', sub: 'Sundays too' },
]

const ABOUT_POINTS = [
  { icon: HeartPulse, title: 'Gentle, patient-first care', text: 'We explain each step before we start.' },
  { icon: ShieldCheck, title: 'Sterilised instruments', text: 'Every tool is sterilised between patients.' },
  { icon: CalendarCheck, title: 'Evening and Sunday slots', text: 'Appointments that fit around work and school.' },
  { icon: BadgeCheck, title: 'Fees explained first', text: 'You hear the full cost before treatment begins.' },
]

// Dentists shown on Home (ids from src/data/doctors.js)
const FEATURED_DOCTOR_IDS = [7, 1, 4, 3]

const WEEK = [1, 2, 3, 4, 5, 6, 0]
const heading = "font-['Source_Serif_4',Georgia,serif] tracking-tight text-[#0C3B4E]"
const initials = (name) => name.replace('Dr. ', '').split(' ').map((w) => w[0]).join('')

/* ------------------------------------------------------------------
   Small helpers and components
------------------------------------------------------------------- */
// Lets Google show hours, phone and address for the clinic
function useClinicSchema() {
  useEffect(() => {
    const el = document.createElement('script')
    el.type = 'application/ld+json'
    el.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Dentist',
      name: CLINIC.name,
      telephone: CLINIC.phoneTel,
      address: { '@type': 'PostalAddress', streetAddress: CLINIC.address, addressLocality: CLINIC.city, addressCountry: 'PK' },
      openingHoursSpecification: Object.entries(CLINIC.hours)
        .filter(([, v]) => v)
        .map(([d, v]) => ({
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: DAYS[d],
          opens: `${String(Math.floor(v.open)).padStart(2, '0')}:00`,
          closes: `${String(Math.floor(v.close)).padStart(2, '0')}:00`,
        })),
    })
    document.head.appendChild(el)
    return () => el.remove()
  }, [])
}

// Image with a clean fallback so a broken link never leaves a hole
function Photo({ src, alt = '', className = '' }) {
  const [failed, setFailed] = useState(false)
  if (failed) {
    return (
      <div role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}
        className={`${className} flex items-center justify-center bg-[#EAF4F7] text-[#0E7C9B]`}>
        <Smile size={40} />
      </div>
    )
  }
  return <img src={src} alt={alt} loading="lazy" decoding="async" onError={() => setFailed(true)} className={className} />
}

// Round doctor DP: your local file first, then the link in doctors.js, then initials
function DoctorDP({ doc, size = 88 }) {
  const sources = [`/images/doctors/${doc.slug}.jpg`, doc.photo].filter(Boolean)
  const [i, setI] = useState(0)
  const box = { width: size, height: size }
  if (i >= sources.length) {
    return (
      <span style={box} aria-hidden="true" className="flex items-center justify-center rounded-full bg-[#0C3B4E] text-xl font-semibold text-white">
        {initials(doc.name)}
      </span>
    )
  }
  return (
    <img key={sources[i]} src={sources[i]} alt="" width={size} height={size} loading="lazy" decoding="async"
      onError={() => setI(i + 1)} style={box} className="rounded-full object-cover object-top ring-4 ring-[#EAF4F7]" />
  )
}

/* ---------- Hero: booking bar that feeds the Contact form ---------- */
function HeroBooking() {
  const navigate = useNavigate()
  const [service, setService] = useState('')
  const [day, setDay] = useState('')

  // const go = (e) => {
  //   e.preventDefault()
  //   const p = new URLSearchParams()
  //   if (service) p.set('service', service)
  //   if (day) p.set('day', day)
  //   navigate(`/contact${p.toString() ? `?${p}` : ''}`)
  // }
  const go = (e) => {
  e.preventDefault()
  navigate(contactLink({ service, day }))
}

  const sel = 'w-full cursor-pointer appearance-none bg-transparent px-4 py-3 text-sm font-medium text-slate-800 focus:outline-none'

  return (
    <form onSubmit={go} aria-label="Start your appointment request"
      className="mt-7 flex flex-col overflow-hidden rounded-2xl bg-white shadow-[0_14px_36px_-14px_rgba(12,59,78,0.45)] ring-1 ring-[#0C3B4E]/10 sm:flex-row sm:items-stretch">
      <div className="relative min-w-0 flex-[1.4] border-b border-slate-200 focus-within:bg-[#F7FBFC] sm:border-b-0 sm:border-r">
        <label htmlFor="hero-service" className="sr-only">Treatment</label>
        <select id="hero-service" value={service} onChange={(e) => setService(e.target.value)} className={sel}>
          <option value="">What do you need?</option>
          {SERVICE_NAMES.map((s) => <option key={s}>{s}</option>)}
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
      <div className="relative min-w-0 flex-1 border-b border-slate-200 focus-within:bg-[#F7FBFC] sm:border-b-0 sm:border-r">
        <label htmlFor="hero-day" className="sr-only">Preferred day</label>
        <select id="hero-day" value={day} onChange={(e) => setDay(e.target.value)} className={sel}>
          <option value="">Any day</option>
          <option value="Today">Today</option>
          <option value="Tomorrow">Tomorrow</option>
        </select>
        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
      </div>
      <button type="submit"
        className="inline-flex items-center justify-center gap-2 bg-[#0E7C9B] px-6 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-[#0B6782] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B]">
        <CalendarCheck size={17} /> Book appointment
      </button>
    </form>
  )
}

/* ---------- Hero: doctor cut-out ---------- */
function HeroVisual({ status }) {
  const [failed, setFailed] = useState(false)
  return (
    <div className="relative mx-auto aspect-[4/5] w-full max-w-md lg:max-w-lg">
      <div aria-hidden="true" className="absolute inset-x-4 bottom-0 top-12 rounded-[2.5rem] bg-gradient-to-b from-[#D3E8EF] to-[#B5D8E4]" />
      <div aria-hidden="true" className="absolute right-1 top-4 h-24 w-24 rounded-full border-[12px] border-[#0E7C9B]/15" />
      <div aria-hidden="true" className="absolute -left-2 bottom-24 h-14 w-14 rounded-full bg-[#0E7C9B]/15" />

      {failed ? (
        <div className="absolute inset-x-4 bottom-0 top-12 flex items-center justify-center rounded-[2.5rem] text-[#0E7C9B]">
          <Smile size={72} aria-hidden="true" />
        </div>
      ) : (
        <img
          src={HERO_IMG}
          alt="A dentist at the clinic"
             fetchPriority="high"
          onError={() => setFailed(true)}
          className="absolute bottom-0 left-1/2 h-full w-auto max-w-full -translate-x-1/2 object-contain object-bottom"
        />
      )}

      <div className="absolute bottom-5 left-0 flex items-center gap-3 rounded-2xl bg-white/95 px-4 py-3 shadow-xl ring-1 ring-black/5 backdrop-blur sm:-left-4">
        <span className="relative flex h-2.5 w-2.5">
          {status.open && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70 motion-reduce:hidden" />}
          <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${status.open ? 'bg-emerald-500' : 'bg-amber-500'}`} />
        </span>
        <div>
          <p className="text-sm font-semibold text-slate-900">{status.text}</p>
          <p className="text-xs text-slate-500">{CLINIC.area}, {CLINIC.city}</p>
        </div>
      </div>
    </div>
  )
}

/* ------------------------------------------------------------------
   Page
------------------------------------------------------------------- */
export default function Home() {
  useDocumentTitle(
    'Dentist in Gulberg, Lahore',
    `${CLINIC.name} in ${CLINIC.area}, ${CLINIC.city}. Checkups, braces, implants, whitening and root canal. Call ${CLINIC.phoneDisplay}.`
  )
  useClinicSchema()
  const status = useOpenStatus()
  const reduce = useReducedMotion()
  const rise = reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: 'easeOut' } }
  const featured = FEATURED_DOCTOR_IDS.map((id) => DOCTORS.find((d) => d.id === id)).filter(Boolean)
  const todayIdx = new Date().getDay()

  return (
    <div className="bg-[#F7FBFC] pb-20 text-slate-800 md:pb-0">

      {/* HERO. The top padding clears the fixed navbar (72px, plus the 36px info bar on desktop). */}
      <section className="bg-[#EAF4F7] pt-[72px] md:pt-[108px]">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-4 pb-10 pt-6 sm:px-6 lg:grid-cols-2 lg:gap-10 lg:px-8 lg:pb-12 lg:pt-8">
          <motion.div {...rise} className="order-2 lg:order-1">
            <h1 className={`${heading} text-4xl font-semibold leading-[1.1] sm:text-5xl lg:text-6xl`}>
              Dental care that feels calm, from the first visit.
            </h1>
            <p className="mt-5 max-w-md text-lg leading-relaxed text-slate-600">
              Gentle treatment, clear fees and appointments that start on time, here in {CLINIC.area}.
            </p>

            <HeroBooking />

            <a href={`tel:${CLINIC.phoneTel}`}
              className="mt-5 inline-flex items-center gap-3 rounded-full border border-[#C93535]/20 bg-white py-1.5 pl-1.5 pr-5 text-sm shadow-sm transition hover:border-[#C93535]/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#C93535]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#C93535] text-white"><Phone size={15} /></span>
              <span className="text-slate-600">Toothache right now? <span className="font-semibold text-[#C93535]">Call {CLINIC.phoneDisplay}</span></span>
            </a>

            <ul className="mt-7 grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-[#0C3B4E]/10 ring-1 ring-[#0C3B4E]/10 sm:grid-cols-4">
              {TRUST.map(({ icon: Icon, title, sub }) => (
                <li key={title} className="bg-white/80 p-3.5">
                  <Icon size={19} className="text-[#0E7C9B]" />
                  <p className="mt-2 text-[13px] font-semibold leading-tight text-slate-900">{title}</p>
                  <p className="text-xs text-slate-500">{sub}</p>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className="order-1 lg:order-2"
            {...(reduce ? {} : { ...rise, transition: { ...rise.transition, delay: 0.12 } })}
          >
            <HeroVisual status={status} />
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="svc-title">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="svc-title" className={`${heading} text-3xl font-semibold sm:text-4xl`}>Treatments for every smile</h2>
          <Link to="/services" className="text-sm font-semibold text-[#0E7C9B] hover:underline">View all services</Link>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map(({ icon: Icon, title, desc, img }) => (
            <Link key={title} to="/services" className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-[#0E7C9B]">
              <div className="relative">
                <Photo src={img} className="h-36 w-full object-cover" />
                <span className="absolute -bottom-5 left-5 flex h-11 w-11 items-center justify-center rounded-full bg-white text-[#0E7C9B] shadow-md">
                  <Icon size={20} />
                </span>
              </div>
              <div className="px-5 pb-5 pt-8">
                <h3 className="font-semibold text-slate-900">{title}</h3>
                <p className="mt-1 text-sm text-slate-600">{desc}</p>
                <span className="mt-3 inline-block text-sm font-semibold text-[#0E7C9B] group-hover:underline">Learn more</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* BEFORE / AFTER */}
      <BeforeAfter />

      {/* PRICING */}
      <Pricing />

      {/* MEET THE DENTISTS: people want to know who will treat them */}
      <section className="border-b border-slate-200 bg-white py-16" aria-labelledby="doc-title">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h2 id="doc-title" className={`${heading} text-3xl font-semibold sm:text-4xl`}>Meet your dentists</h2>
            <Link to="/doctors" className="text-sm font-semibold text-[#0E7C9B] hover:underline">All dentists</Link>
          </div>
       <ul className="mt-10 grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-4">
  {featured.map((d) => (
    <li key={d.id}>
      <Link to={doctorsLink({ q: d.name })} className="group flex flex-col items-center text-center focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#0E7C9B]">
        <DoctorDP doc={d} size={104} />
        <span className="mt-4 font-semibold text-slate-900 group-hover:text-[#0E7C9B]">{d.name}</span>
        <span className="text-sm text-slate-500">{d.specialty}</span>
      </Link>
    </li>
  ))}
</ul>
        </div>
      </section>

      {/* ABOUT */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-14 lg:px-8">
        <Photo src={CLINIC_IMG} alt="The clinic reception and waiting area" className="aspect-[4/3] w-full rounded-2xl object-cover" />
        <div>
          <h2 className={`${heading} text-3xl font-semibold sm:text-4xl`}>More than a quick fix</h2>
          <p className="mt-3 max-w-lg text-[15px] leading-relaxed text-slate-600">
            We plan treatment around your teeth, your budget and your schedule. You get a clear explanation, an honest price and follow-up when you need it.
          </p>
          <ul className="mt-7 grid gap-5 sm:grid-cols-2">
            {ABOUT_POINTS.map(({ icon: Icon, title, text }) => (
              <li key={title} className="flex gap-3">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#EAF4F7] text-[#0E7C9B]"><Icon size={19} /></span>
                <div>
                  <p className="font-semibold text-slate-900">{title}</p>
                  <p className="text-sm text-slate-600">{text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* REVIEWS */}
      <div className="border-t border-slate-200 bg-[#F1F7F9]">
        <Reviews />
      </div>

      {/* EMERGENCY */}
      <EmergencyTriage status={status} />

      {/* VISIT US: where, when, and how to get there */}
      <section className="border-b border-white/25 bg-[#0C3B4E] py-16 text-white" aria-labelledby="visit-title">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <h2 id="visit-title" className="font-['Source_Serif_4',Georgia,serif] text-3xl font-semibold sm:text-4xl">Visit us in {CLINIC.area}</h2>
            <p className="mt-4 flex items-start gap-2.5 text-slate-200">
              <MapPin size={18} className="mt-1 shrink-0" /> {CLINIC.address}
            </p>
            <p className="mt-2 flex items-center gap-2.5 text-sm text-slate-200">
              <span className={`h-2 w-2 rounded-full ${status.open ? 'bg-emerald-400' : 'bg-amber-400'}`} aria-hidden="true" /> {status.text}
            </p>

            <table className="mt-6 w-full max-w-sm text-[15px]">
              <caption className="sr-only">Clinic hours</caption>
              <tbody>
                {WEEK.map((d) => {
                  const h = CLINIC.hours[d]
                  const isToday = d === todayIdx
                  return (
                    <tr key={d} className={isToday ? 'rounded bg-white/10 font-semibold text-white' : 'text-slate-300'}>
                      <th scope="row" className="px-3 py-1.5 text-left font-[inherit]">{DAYS[d]}{isToday && ' (today)'}</th>
                      <td className="px-3 py-1.5 text-right">{h ? `${fmtHour(h.open)} to ${fmtHour(h.close)}` : 'Closed'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0C3B4E] hover:bg-slate-100">
                <CalendarCheck size={18} /> Book appointment
              </Link>
              <a href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(CLINIC.mapsQuery)}`} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold hover:bg-white/10">
                Get directions
              </a>
            </div>
          </div>

          <iframe
            title={`${CLINIC.name} location map`}
            src={`https://www.google.com/maps?q=${encodeURIComponent(CLINIC.mapsQuery)}&output=embed`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="h-80 w-full rounded-2xl border-0 lg:h-full lg:min-h-[380px]"
          />
        </div>
      </section>

      {/* Mobile action bar */}
      <nav aria-label="Quick contact" className="fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-slate-200 bg-white shadow-[0_-4px_16px_rgba(0,0,0,0.08)] md:hidden">
        <a href={`tel:${CLINIC.phoneTel}`} className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold text-slate-800"><Phone size={20} /> Call</a>
        <a href={wa('Assalam o Alaikum, I would like to book a dental appointment.')} target="_blank" rel="noreferrer" className="flex flex-col items-center gap-0.5 py-2.5 text-xs font-semibold text-[#157A4C]"><MessageCircle size={20} /> WhatsApp</a>
        <Link to="/contact" className="flex flex-col items-center gap-0.5 bg-[#0E7C9B] py-2.5 text-xs font-semibold text-white"><CalendarCheck size={20} /> Book</Link>
      </nav>
    </div>
  )
}