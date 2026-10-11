import { useState } from 'react'
import { Link } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import useDocumentTitle from '../hooks/useDocumentTitle'
import useDoctorFilters from '../hooks/useDoctorFilters'
import useNow from '../hooks/useNow'
import { CLINIC, DAYS, wa, waBooking } from '../config/clinic'
import { DOCTORS } from '../data/doctors'
import { contactLink } from '../utils/links'
import { Search, CalendarCheck, MessageCircle, Clock, ChevronDown, SearchX, X } from 'lucide-react'

/* This file is UI only. Filtering, URL state and schedule maths live in:
   hooks/useDoctorFilters.js, utils/doctorSchedule.js, utils/links.js */

const WEEK = [1, 2, 3, 4, 5, 6, 0]
const heading = "font-['Source_Serif_4',Georgia,serif] tracking-tight text-[#0C3B4E]"
const rs = (n) => `Rs. ${n.toLocaleString('en-PK')}`
const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B]'
const selectCls = `rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-800 focus:border-[#0E7C9B] focus:outline-none focus:ring-2 focus:ring-[#0E7C9B]/25`

// Round DP: local file first, then the link in doctors.js, then initials
function Avatar({ doc }) {
  const sources = [`/images/doctors/${doc.slug}.jpg`, doc.photo].filter(Boolean)
  const [i, setI] = useState(0)
  const initials = doc.name.replace('Dr. ', '').split(' ').map((w) => w[0]).join('')

  if (i >= sources.length) {
    return (
      <div aria-hidden="true" className="flex h-[72px] w-[72px] shrink-0 items-center justify-center rounded-full bg-[#0C3B4E] text-xl font-semibold text-white">
        {initials}
      </div>
    )
  }
  return (
    <img
      key={sources[i]}
      src={sources[i]}
      alt={doc.name}
      width={72}
      height={72}
      loading="lazy"
      decoding="async"
      onError={() => setI(i + 1)}
      className="h-[72px] w-[72px] shrink-0 rounded-full object-cover object-top ring-2 ring-[#EAF4F7]"
    />
  )
}

function DoctorCard({ d, service }) {
  return (
    <article className="flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-center gap-4">
        <Avatar doc={d} />
        <div className="min-w-0">
          <h3 className="text-lg font-semibold leading-snug text-slate-900">{d.name}</h3>
          <p className="text-sm font-medium text-[#0E7C9B]">{d.specialty}</p>
          <p className="text-sm text-slate-500">{d.quals}</p>
        </div>
      </div>

      <p className={`mt-4 flex items-center gap-2 text-sm font-medium ${d.slot.today ? 'text-emerald-700' : 'text-slate-700'}`}>
        <Clock size={15} className="shrink-0" /> {d.slot.label}
      </p>

      <details className="mt-3">
        <summary className={`flex cursor-pointer list-none items-center gap-1 rounded text-sm font-semibold text-[#0E7C9B] ${focusRing} [&::-webkit-details-marker]:hidden`}>
          More details
          <ChevronDown size={16} className="transition-transform [details[open]_&]:rotate-180" />
        </summary>
        <div className="mt-3 space-y-3 text-sm text-slate-600">
          <p>{d.exp} years experience · PMDC {d.pmdc} · {d.languages.join(', ')}</p>
          <ul className="flex flex-wrap gap-1.5">
            {d.treats.map((t) => (
              <li key={t} className="rounded-md bg-[#EAF4F7] px-2.5 py-1 text-xs font-medium text-[#0C3B4E]">{t}</li>
            ))}
          </ul>
          <div className="flex gap-1" aria-label="Days in the clinic">
            {WEEK.map((w) => (
              <span key={w} title={DAYS[w]} className={`flex h-6 w-9 items-center justify-center rounded text-[11px] font-medium ${d.schedule[w] ? 'bg-[#0E7C9B]/10 text-[#0B6782]' : 'bg-slate-50 text-slate-300'}`}>
                {DAYS[w].slice(0, 3)}
              </span>
            ))}
          </div>
        </div>
      </details>

      <div className="mt-auto flex items-center justify-between gap-3 border-t border-slate-200 pt-4">
        <p className="text-sm text-slate-500">Fee <span className="font-semibold text-slate-900">{rs(d.fee)}</span></p>
        <div className="flex items-center gap-2">
          <a
            href={waBooking({ doctor: d.name, service })}
            target="_blank"
            rel="noreferrer"
            aria-label={`WhatsApp about an appointment with ${d.name}`}
            title="Ask on WhatsApp"
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-300 text-[#1A8F5B] transition hover:border-[#1A8F5B] hover:bg-[#E6F6EE] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1A8F5B]"
          >
            <MessageCircle size={18} />
          </a>
          <Link to={contactLink({ doctor: d.name, service })} className={`inline-flex items-center gap-2 rounded-lg bg-[#0E7C9B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#0B6782] ${focusRing}`}>
            <CalendarCheck size={16} /> Book
          </Link>
        </div>
      </div>
    </article>
  )
}

export default function Doctors() {
  useDocumentTitle(
    'Our Dentists',
    `Meet the dentists at ${CLINIC.name}, ${CLINIC.city}. See who is in the clinic today, their fees and languages, then book.`
  )
  const now = useNow()
  const reduce = useReducedMotion()
  const { filters, results, specialties, hasFilters, service, setFilter, reset } = useDoctorFilters(DOCTORS, now)

  const rise = reduce ? {} : { initial: { opacity: 0, y: 14 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.5, ease: 'easeOut' } }
  const itemMotion = reduce
    ? {}
    : {
        layout: 'position',
        initial: { opacity: 0, scale: 0.96 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.96 },
        transition: { duration: 0.22, ease: 'easeOut' },
      }

  // A link like ?specialty=Root%20canal is not one of the chips, so show it as its own removable chip
  const customSpecialty = filters.specialty && !specialties.includes(filters.specialty) ? filters.specialty : ''
  const chip = (active) =>
    `whitespace-nowrap rounded-full border px-4 py-2 text-sm font-medium transition ${focusRing} ${
      active ? 'border-[#0C3B4E] bg-[#0C3B4E] text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-[#0C3B4E]'
    }`

  return (
    <div className="bg-[#F7FBFC] text-slate-800">

      {/* Header. The top padding clears the fixed navbar. */}
      <section className="relative overflow-hidden bg-[#0C3B4E] pt-[72px] text-center text-white">
        <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="tooth-doctors" width="96" height="96" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
              <path d="M45 18c-6 0-8 5-13 5-6 0-9-6-9 4 0 9 3 24 8 32 3 5 6 3 7-2 1-4 2-7 7-7s6 3 7 7c1 5 4 7 7 2 5-8 8-23 8-32 0-10-3-4-9-4-5 0-7-5-13-5z" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tooth-doctors)" />
        </svg>
        <div aria-hidden="true" className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-[#0E7C9B]/40 blur-3xl" />

        <motion.div {...rise} className="relative mx-auto max-w-3xl px-4 pb-24 pt-14 sm:px-6 sm:pb-28 sm:pt-16">
          <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 ring-1 ring-white/20 backdrop-blur">
            <svg viewBox="20 14 50 60" className="h-7 w-7 text-white" fill="currentColor" aria-hidden="true">
              <path d="M45 18c-6 0-8 5-13 5-6 0-9-6-9 4 0 9 3 24 8 32 3 5 6 3 7-2 1-4 2-7 7-7s6 3 7 7c1 5 4 7 7 2 5-8 8-23 8-32 0-10-3-4-9-4-5 0-7-5-13-5z" />
            </svg>
          </span>
          <h1 className="mt-6 font-['Source_Serif_4',Georgia,serif] text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">
            The dentists of <span className="italic text-[#8FD6EA]">{CLINIC.name}.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg leading-relaxed text-slate-200">
            Search by your problem, and see who is in the clinic today.
          </p>

          <div className="relative mx-auto mt-8 max-w-xl text-left">
            <label htmlFor="doc-search" className="sr-only">Search by dentist name or treatment</label>
            <Search size={18} className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              id="doc-search"
              type="search"
              value={filters.q}
              onChange={(e) => setFilter('q', e.target.value)}
              placeholder="Try: braces, root canal, bleeding gums"
              className="w-full rounded-xl border border-slate-300 bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 shadow-sm focus:border-[#0E7C9B] focus:outline-none focus:ring-2 focus:ring-[#0E7C9B]/25"
            />
          </div>
        </motion.div>

        <svg aria-hidden="true" viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute bottom-[-1px] left-0 h-10 w-full text-[#F7FBFC] sm:h-14">
          <path d="M0 60V35C240 5 480 5 720 25S1200 55 1440 25V60H0Z" fill="currentColor" />
        </svg>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8" aria-labelledby="results-title">
        <h2 id="results-title" className="sr-only">Dentists</h2>

        {service && (
          <p className="mb-5 rounded-lg bg-[#EAF4F7] px-4 py-3 text-sm text-slate-700">
            Booking for <span className="font-semibold">{service}</span>. Pick a dentist and we will carry this to the booking form.
          </p>
        )}

        {/* Specialty chips */}
        <div className="flex gap-2 overflow-x-auto pb-2" role="group" aria-label="Filter by specialty">
          <button type="button" onClick={() => setFilter('specialty', '')} aria-pressed={!filters.specialty} className={chip(!filters.specialty)}>All</button>
          {specialties.map((s) => (
            <button key={s} type="button" onClick={() => setFilter('specialty', s)} aria-pressed={filters.specialty === s} className={chip(filters.specialty === s)}>
              {s}
            </button>
          ))}
          {customSpecialty && (
            <button type="button" onClick={() => setFilter('specialty', '')} aria-label={`Remove filter ${customSpecialty}`} className={`${chip(true)} inline-flex items-center gap-1.5`}>
              {customSpecialty} <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        {/* Practical filters */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <select value={filters.gender} onChange={(e) => setFilter('gender', e.target.value)} className={selectCls} aria-label="Dentist gender">
            <option value="any">Any dentist</option>
            <option value="female">Female dentist</option>
            <option value="male">Male dentist</option>
          </select>

          <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-[#0E7C9B]">
            <input type="checkbox" checked={filters.today} onChange={(e) => setFilter('today', e.target.checked)} className="h-4 w-4 accent-[#0E7C9B]" />
            In the clinic today
          </label>

          <p className="ml-auto text-sm text-slate-500" aria-live="polite">
            {results.length} {results.length === 1 ? 'dentist' : 'dentists'}
            {hasFilters && <> · <button type="button" onClick={reset} className={`rounded font-semibold text-[#0E7C9B] hover:underline ${focusRing}`}>Clear</button></>}
          </p>
        </div>

        {/* Results: cards animate in and out as filters change */}
        <ul className="mt-6 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence mode="popLayout" initial={false}>
            {results.map((d) => (
              <motion.li key={d.id} className="h-full" {...itemMotion}>
                <DoctorCard d={d} service={service} />
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        {results.length === 0 && (
          <div className="mx-auto mt-8 max-w-lg rounded-2xl border border-slate-200 bg-white p-8 text-center">
            <SearchX size={32} className="mx-auto text-slate-400" />
            <h3 className="mt-3 text-lg font-semibold text-slate-900">No dentist matches these filters</h3>
            <p className="mt-1.5 text-sm text-slate-600">Remove a filter, or tell us your problem and our front desk will suggest the right dentist.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={reset} className={`rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-500 ${focusRing}`}>Clear filters</button>
              <a href={wa('Assalam o Alaikum, I need help choosing the right dentist.')} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-lg bg-[#1A8F5B] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#157A4C]">
                <MessageCircle size={16} /> Ask on WhatsApp
              </a>
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#0C3B4E] px-6 py-6 text-white sm:px-8">
          <div>
            <h2 className="font-['Source_Serif_4',Georgia,serif] text-xl font-semibold">Not sure who to pick?</h2>
            <p className="mt-1 text-slate-200">Start with a checkup. We will tell you if you need a specialist.</p>
          </div>
          <Link to={contactLink({ service: 'Checkup & cleaning' })} className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[#0C3B4E] hover:bg-slate-100">
            <CalendarCheck size={18} /> Book a checkup
          </Link>
        </div>
      </section>
    </div>
  )
}