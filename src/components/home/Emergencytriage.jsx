import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { Phone, MessageCircle, ArrowRight } from 'lucide-react'
// import { CLINIC, wa } from '../../config/clinic'
import { CLINIC, waBooking } from '../../config/clinic'

const URGENT = [
  { id: 'pain', label: 'Severe tooth pain', msg: 'I have severe tooth pain and need an urgent appointment today.' },
  { id: 'broken', label: 'Broken or chipped tooth', msg: 'I have a broken or chipped tooth and need an urgent appointment today.' },
  { id: 'gums', label: 'Bleeding gums', msg: 'My gums are bleeding and I need an urgent appointment.' },
]

const focusWhite = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

// status comes from useOpenStatus() in the parent page
export default function EmergencyTriage({ status }) {
  const [picked, setPicked] = useState(null)
  const reduce = useReducedMotion()
  const issue = URGENT.find((u) => u.id === picked)

  return (
    <section className="bg-[#F1F7F9] px-4 pb-16 sm:px-6 lg:px-8" aria-labelledby="urgent-title">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl bg-[#0C3B4E] text-white">
        <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[#C93535]/25 blur-3xl" />

        <div className="relative grid gap-10 p-8 sm:p-12 lg:grid-cols-2 lg:items-center lg:gap-16">
          <div>
            <p className="flex items-center gap-2 text-sm font-medium text-[#FF9A9A]">
              <span className="relative flex h-2.5 w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#FF6B6B] opacity-70 motion-reduce:hidden" />
                <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-[#FF6B6B]" />
              </span>
              Dental emergency
            </p>
            <h2 id="urgent-title" className="mt-4 font-['Source_Serif_4',Georgia,serif] text-3xl font-semibold leading-[1.15] tracking-tight sm:text-4xl">
              In pain right now? Tell us what is wrong.
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-slate-200">
              {status.open
                ? 'We keep same-day slots open for urgent cases.'
                : 'The clinic is closed now, but our emergency line still answers.'}
            </p>
            <p className="mt-6 text-sm text-slate-300">
              Or call straight away:{' '}
              <a href={`tel:${CLINIC.phoneTel}`} className="font-semibold text-white underline-offset-4 hover:underline">
                {CLINIC.phoneDisplay}
              </a>
            </p>
            <p className="mt-6 max-w-sm text-xs leading-relaxed text-slate-400">
              Swelling that makes breathing or swallowing hard needs a hospital emergency room, not a dental visit.
            </p>
          </div>

          <div>
            <div role="group" aria-label="What is happening?" className="grid gap-3">
              {URGENT.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => setPicked(u.id)}
                  aria-pressed={picked === u.id}
                  className={`flex items-center justify-between gap-4 rounded-xl border px-5 py-4 text-left text-base font-semibold transition ${focusWhite} ${
                    picked === u.id ? 'border-white bg-white text-[#0C3B4E]' : 'border-white/25 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  {u.label}
                  <ArrowRight size={18} className="shrink-0" aria-hidden="true" />
                </button>
              ))}
            </div>

            <div aria-live="polite" className="mt-5">
              {issue && (
                <motion.div
                  key={issue.id}
                  {...(reduce ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.25 } })}
                  className="flex flex-col gap-3 sm:flex-row"
                >
                  <a href={`tel:${CLINIC.phoneTel}`} className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#C93535] px-6 py-3.5 text-sm font-semibold text-white hover:bg-[#B02A2A] ${focusWhite}`}>
                    <Phone size={17} /> Call emergency line
                  </a>
                  <a
                  href={waBooking({ issue: issue.msg })}
                    target="_blank"
                    rel="noreferrer"
                    className={`inline-flex flex-1 items-center justify-center gap-2 rounded-lg border border-white/40 px-6 py-3.5 text-sm font-semibold text-white hover:bg-white/10 ${focusWhite}`}
                  >
                    <MessageCircle size={17} /> WhatsApp us
                  </a>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}