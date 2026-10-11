import { Link } from 'react-router-dom'
import { motion, useReducedMotion } from 'framer-motion'
import { ShieldCheck } from 'lucide-react'

// Keep these prices in sync with src/pages/Services.jsx
const PRICES = [
  { title: 'Checkup & cleaning', price: 1200, unit: 'per checkup', note: 'Exam, scaling and polishing' },
  { title: 'Teeth whitening', price: 18000, unit: 'per session', note: 'In-clinic, about one hour' },
  { title: 'Braces & aligners', price: 90000, unit: 'full treatment', note: 'Plan, adjustments and retainers' },
]

const heading = "font-['Source_Serif_4',Georgia,serif] tracking-tight text-[#0C3B4E]"

export default function Pricing() {
  const reduce = useReducedMotion()

  return (
    <section className="border-y border-slate-200 bg-[#F1F7F9] py-16" aria-labelledby="price-title">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 id="price-title" className={`${heading} text-3xl font-semibold sm:text-4xl`}>
            Know the cost before you sit down.
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">
            Starting prices for our most common treatments. The dentist confirms your exact fee after the exam.
          </p>
          <p className="mt-6 inline-flex items-center gap-2.5 rounded-full bg-[#0C3B4E] py-2 pl-3 pr-5 text-sm font-semibold text-white">
            <ShieldCheck size={18} className="text-[#8FD6EA]" />
            100% upfront pricing. No surprise charges after treatment.
          </p>
        </div>

        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {PRICES.map((p, i) => (
            <motion.li
              key={p.title}
              {...(reduce
                ? {}
                : {
                    initial: { opacity: 0, y: 16 },
                    whileInView: { opacity: 1, y: 0 },
                    viewport: { once: true, margin: '-60px' },
                    transition: { duration: 0.45, delay: i * 0.08, ease: 'easeOut' },
                  })}
              className="flex flex-col rounded-2xl border border-slate-200 bg-white p-7"
            >
              <h3 className="font-semibold text-slate-900">{p.title}</h3>
              <p className="mt-6 text-sm text-slate-500">Starting from</p>
              <p className="mt-1 font-['Source_Serif_4',Georgia,serif] text-4xl font-semibold tracking-tight text-[#0C3B4E]">
                Rs. {p.price.toLocaleString('en-PK')}
              </p>
              <p className="mt-1 text-sm text-slate-500">{p.unit}</p>
              <p className="mt-5 border-t border-slate-200 pt-5 text-sm text-slate-600">{p.note}</p>
              <Link
                to={`/contact?service=${encodeURIComponent(p.title)}`}
                className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg bg-[#0E7C9B] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0B6782] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B]"
              >
                Get cost estimate
              </Link>
            </motion.li>
          ))}
        </ul>

        <p className="mt-6 text-sm">
          <Link to="/services" className="font-semibold text-[#0E7C9B] hover:underline">
            See all treatments and fees
          </Link>
        </p>
      </div>
    </section>
  )
}