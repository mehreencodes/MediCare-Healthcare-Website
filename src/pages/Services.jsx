import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { CLINIC, wa, waBooking } from '../config/clinic'
import { contactLink, doctorsLink } from '../utils/links'
import {
  Stethoscope, ShieldCheck, Sparkles, Gem, Wrench, Syringe, Pin, Scissors, Baby,
  Check, CalendarCheck, Phone, MessageCircle, ChevronDown, Siren,
} from 'lucide-react'

/* Services data.  */
const CATEGORIES = ['All', 'Preventive', 'Restorative', 'Cosmetic', 'Orthodontics', 'Surgery', 'Kids']

const SERVICES = [
  {
    slug: 'checkup', icon: Stethoscope, remote: '', title: 'Checkup & cleaning', category: 'Preventive',
    desc: 'A full exam, scaling and polishing for healthy teeth and gums.',
    includes: ['Oral exam and X-ray if needed', 'Plaque and tartar removal', 'Brushing advice'],
    from: 1200, unit: 'checkup', time: '30 to 45 min', visits: '1 visit',
  },
  {
    slug: 'fillings', icon: ShieldCheck, remote: '', title: 'Fillings', category: 'Restorative',
    desc: 'Tooth-coloured fillings that repair cavities and look natural.',
    includes: ['Numbing before treatment', 'Tooth-coloured material', 'Bite check before you leave'],
    from: 3000, unit: 'per tooth', time: '30 to 60 min', visits: '1 visit',
  },
  {
    slug: 'root-canal', icon: Syringe, remote: '', title: 'Root canal treatment', category: 'Restorative',
    desc: 'Clears the infection inside a painful tooth so you can keep it.',
    includes: ['Pain control before we start', 'Cleaning and sealing of the canals', 'Crown planning if needed'],
    from: 12000, unit: 'per tooth', time: '60 to 90 min', visits: '1 to 2 visits',
  },
  {
    slug: 'whitening', icon: Sparkles, remote: '', title: 'Teeth whitening', category: 'Cosmetic',
    desc: 'Lifts tea, coffee and everyday stains in a single visit.',
    includes: ['Gum protection during treatment', 'Several shades lighter', 'Aftercare guide'],
    from: 18000, unit: 'per session', time: '60 min', visits: '1 visit',
  },
  {
    slug: 'veneers', icon: Gem, remote: '', title: 'Veneers & smile design', category: 'Cosmetic',
    desc: 'Thin porcelain shells that fix chips, gaps and uneven shape.',
    includes: ['Smile plan with preview', 'Custom-made porcelain', 'Fitting and final polish'],
    from: 25000, unit: 'per tooth', time: '2 visits', visits: '2 visits',
  },
  {
    slug: 'braces', icon: Wrench, remote: '', title: 'Braces & aligners', category: 'Orthodontics',
    desc: 'Metal, ceramic or clear options to straighten teeth at any age.',
    includes: ['Scan, photos and treatment plan', 'Monthly adjustment visits', 'Retainers at the end'],
    from: 90000, unit: 'full treatment', time: '12 to 24 months', visits: 'Monthly visits',
  },
  {
    slug: 'implants', icon: Pin, remote: '', title: 'Dental implants', category: 'Surgery',
    desc: 'A fixed, natural-looking replacement for a missing tooth.',
    includes: ['3D scan and surgical plan', 'Titanium implant placement', 'Crown fitted after healing'],
    from: 120000, unit: 'per tooth', time: '3 to 6 months', visits: '3 to 4 visits',
  },
  {
    slug: 'wisdom-tooth', icon: Scissors, remote: '', title: 'Wisdom tooth removal', category: 'Surgery',
    desc: 'Safe removal of impacted or painful wisdom teeth.',
    includes: ['X-ray to plan the removal', 'Local anaesthesia', 'Written aftercare instructions'],
    from: 8000, unit: 'per tooth', time: '30 to 60 min', visits: '1 visit',
  },
  {
    slug: 'kids', icon: Baby, remote: '', title: 'Kids dentistry', category: 'Kids',
    desc: 'Short, gentle visits that help children feel safe at the dentist.',
    includes: ['Checkup and fluoride', 'Sealants for back teeth', 'Tips for parents'],
    from: 1200, unit: 'checkup', time: '20 to 30 min', visits: '1 visit',
  },
]

const FAQS = [
  { q: 'Will the treatment hurt?', a: 'We numb the area before any procedure that could be uncomfortable, and we stop whenever you ask.' },
  { q: 'Do I get the exact cost before treatment?', a: 'Yes. Fees here are starting prices. After your exam we give you the full cost in writing, and nothing starts until you agree.' },
  { q: 'How do I know which treatment I need?', a: 'You do not need to decide. Book a checkup and the dentist will explain your options and costs.' },
]

const heading = "font-['Source_Serif_4',Georgia,serif] tracking-tight text-[#0C3B4E]"
const rs = (n) => `Rs. ${n.toLocaleString('en-PK')}`


const thumb = (url) =>
  url.includes('images.unsplash.com') ? `${url.split('?')[0]}?auto=format&fit=crop&w=200&h=200&q=75` : url

// Round DP-style image
function Thumb({ s }) {
  const sources = [`/images/services/${s.slug}.jpg`, s.remote && thumb(s.remote)].filter(Boolean)
  const [i, setI] = useState(0)
  const Icon = s.icon

  if (i >= sources.length) {
    return (
      <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-[#EAF4F7] text-[#0E7C9B]" aria-hidden="true">
        <Icon size={26} />
      </span>
    )
  }
  return (
    <img
      key={sources[i]}
      src={sources[i]}
      alt=""
      width={64}
      height={64}
      loading="lazy"
      decoding="async"
      onError={() => setI(i + 1)}
      className="h-16 w-16 shrink-0 rounded-full object-cover ring-2 ring-[#EAF4F7]"
    />
  )
}

function FAQItem({ q, a }) {
  return (
    <details className="border-b border-slate-200 py-1">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 text-left font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0E7C9B] [&::-webkit-details-marker]:hidden">
        {q}
        <ChevronDown size={18} className="shrink-0 text-slate-500 transition-transform [details[open]_&]:rotate-180" />
      </summary>
      <p className="pb-5 pr-8 text-[15px] leading-relaxed text-slate-600">{a}</p>
    </details>
  )
}
{/* <Link to={doctorsLink({ service: s.title })} className="mt-3 inline-block text-sm font-semibold text-[#0E7C9B] hover:underline">
  See dentists for this
</Link> */}
export default function Services() {
  useDocumentTitle(
    'Dental Treatments & Fees',
    `Checkups, fillings, root canal, whitening, braces, implants and kids dentistry at ${CLINIC.name}, ${CLINIC.city}. Starting fees shown for every treatment.`
  )
  const [category, setCategory] = useState('All')
  const reduce = useReducedMotion()
  const rise = reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: 'easeOut' } }
  const visible = category === 'All' ? SERVICES : SERVICES.filter((s) => s.category === category)

  return (
    <div className="bg-[#F7FBFC] text-slate-800">
      <section className="relative overflow-hidden bg-[#0C3B4E] pt-[72px] text-center text-white">
  {/* Tooth pattern */}
  <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="tooth-services" width="96" height="96" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
        <path d="M45 18c-6 0-8 5-13 5-6 0-9-6-9 4 0 9 3 24 8 32 3 5 6 3 7-2 1-4 2-7 7-7s6 3 7 7c1 5 4 7 7 2 5-8 8-23 8-32 0-10-3-4-9-4-5 0-7-5-13-5z" fill="currentColor" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#tooth-services)" />
  </svg>
  <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[#0E7C9B]/40 blur-3xl" />

  <motion.div {...rise} className="relative mx-auto max-w-3xl px-4 pb-24 pt-14 sm:px-6 sm:pb-28 sm:pt-16">
    <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
      <svg viewBox="20 14 50 60" className="h-7 w-7 text-white" fill="currentColor" aria-hidden="true">
        <path d="M45 18c-6 0-8 5-13 5-6 0-9-6-9 4 0 9 3 24 8 32 3 5 6 3 7-2 1-4 2-7 7-7s6 3 7 7c1 5 4 7 7 2 5-8 8-23 8-32 0-10-3-4-9-4-5 0-7-5-13-5z" />
      </svg>
    </span>

    <h1 className="mt-6 font-['Source_Serif_4',Georgia,serif] text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
      Treatments, with the <span className="italic text-[#8FD6EA]">price up front.</span>
    </h1>
    <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
      Tap any treatment to see what is included. The dentist confirms your exact cost after the exam.
    </p>

    <ul className="mt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm text-slate-200">
      {['Fees shown before treatment', 'Painless, modern techniques', 'Same-day urgent slots'].map((t) => (
        <li key={t} className="flex items-center gap-2">
          <Check size={16} className="text-[#8FD6EA]" /> {t}
        </li>
      ))}
    </ul>
  </motion.div>

  {/* Curved edge into the page */}
  <svg aria-hidden="true" viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute bottom-[-1px] left-0 h-10 w-full text-[#F7FBFC] sm:h-14">
    <path d="M0 60V35C240 5 480 5 720 25S1200 55 1440 25V60H0Z" fill="currentColor" />
  </svg>
</section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="list-title">
        <h2 id="list-title" className="sr-only">All treatments</h2>

        <div className="flex gap-2 overflow-x-auto pb-1" role="group" aria-label="Filter by treatment type">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              aria-pressed={category === c}
              className={`whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B] ${
                category === c ? 'border-[#0C3B4E] bg-[#0C3B4E] text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-[#0C3B4E]'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <p className="sr-only" aria-live="polite">Showing {visible.length} treatments</p>

        <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {visible.map((s) => (
            <article key={s.slug} className="flex flex-col rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-[#0E7C9B]">
              <div className="flex items-center gap-4">
                <Thumb s={s} />
                <div className="min-w-0">
                  <h3 className="font-semibold leading-snug text-slate-900">{s.title}</h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    From <span className="font-semibold text-slate-900">{rs(s.from)}</span> {s.unit}
                  </p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-600">{s.desc}</p>

              <details className="mt-3">
                <summary className="flex cursor-pointer list-none items-center gap-1 text-sm font-semibold text-[#0E7C9B] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#0E7C9B] [&::-webkit-details-marker]:hidden">
                  What is included
                  <ChevronDown size={16} className="transition-transform [details[open]_&]:rotate-180" />
                </summary>
                <ul className="mt-3 space-y-2">
                  {s.includes.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-slate-700">
                      <Check size={16} className="mt-0.5 shrink-0 text-[#0E7C9B]" /> {item}
                    </li>
                  ))}
                </ul>
                <p className="mt-3 text-xs text-slate-500">{s.time} · {s.visits}</p>
              </details>
 <Link to={doctorsLink({ service: s.title })} className="mt-3 inline-block text-sm font-semibold text-[#0E7C9B] hover:underline">
                See dentists for this
              </Link>
             
              <div className="mt-5 flex gap-2">
  <Link
    to={contactLink({ service: s.title })}
    className="inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#0E7C9B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0B6782] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B]"
  >
    <CalendarCheck size={16} /> Book this treatment
  </Link>
  <a
    href={waBooking({ service: s.title })}
    target="_blank"
    rel="noreferrer"
    aria-label={`Ask about ${s.title} on WhatsApp`}
    title="Ask on WhatsApp"
    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-[#1A8F5B] transition hover:border-[#1A8F5B] hover:bg-[#E6F6EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F5B]"
  >
    <MessageCircle size={18} />
  </a>
</div>
            </article>
          ))}
        </div>
      </section>

      {/* Emergency */}
      <section className="mx-auto max-w-6xl px-4 pb-12 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#FBEAEA] px-6 py-5">
          <div className="flex items-start gap-3">
            <Siren size={22} className="mt-0.5 shrink-0 text-[#C93535]" />
            <div>
              <p className="font-semibold text-[#7F1D1D]">Severe toothache, broken tooth or swelling?</p>
              <p className="text-sm text-[#7F1D1D]/80">We keep same-day slots for urgent cases.</p>
            </div>
          </div>
          <a href={`tel:${CLINIC.phoneTel}`} className="inline-flex items-center gap-2 rounded-lg bg-[#C93535] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#B02A2A]">
            <Phone size={16} /> Call {CLINIC.phoneDisplay}
          </a>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-y border-slate-200 bg-white py-14" aria-labelledby="faq-title">
        <div className="mx-auto max-w-3xl px-4 sm:px-6">
          <h2 id="faq-title" className={`${heading} text-3xl font-semibold`}>Before you book</h2>
          <div className="mt-5 border-t border-slate-200">
            {FAQS.map((f) => <FAQItem key={f.q} {...f} />)}
          </div>
        </div>
      </section>

      {/* Closing action */}
      <section className="bg-[#0C3B4E] py-12 text-white">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <div>
            <h2 className="font-['Source_Serif_4',Georgia,serif] text-2xl font-semibold">Not sure what you need?</h2>
            <p className="mt-1 text-slate-200">Start with a checkup. The dentist explains your options.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link to="/contact?service=Checkup%20%26%20cleaning" className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0C3B4E] hover:bg-slate-100">
              <CalendarCheck size={18} /> Book a checkup
            </Link>
            <a href={wa('Assalam o Alaikum, I have a question about a dental treatment.')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg border border-white/40 px-6 py-3 text-sm font-semibold hover:bg-white/10">
              <MessageCircle size={18} /> Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
