import { Link } from 'react-router-dom'
import { Smile, Phone, Mail, MapPin, Clock, MessageCircle, CalendarCheck, Siren, ArrowUp } from 'lucide-react'
import { CLINIC, SERVICE_NAMES, summarizeHours, wa } from '../config/clinic'
import useOpenStatus from '../hooks/useOpenStatus'

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

// Edit to match what the clinic really accepts. Remove anything it does not.
const PAYMENTS = ['Cash', 'Easypaisa', 'JazzCash', 'Debit and credit cards']

const PAGES = [
  { label: 'Home', to: '/' },
  { label: 'Services and fees', to: '/services' },
  { label: 'Our dentists', to: '/doctors' },
  { label: 'Book appointment', to: '/contact' },
]

const linkCls = 'rounded text-slate-300 transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'
const headCls = 'text-sm font-semibold tracking-wide text-white'
const serif = "font-['Source_Serif_4',Georgia,serif]"

export default function Footer() {
  const hours = summarizeHours()
  const status = useOpenStatus()
  const socials = [
    { icon: FacebookIcon, label: 'Facebook', href: CLINIC.social?.facebook },
    { icon: InstagramIcon, label: 'Instagram', href: CLINIC.social?.instagram },
  ].filter((s) => s.href) // no dead "#" links: only profiles set in clinic.js are shown

  const toTop = () =>
    window.scrollTo({ top: 0, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })

  return (
    <footer className="relative overflow-hidden bg-[#092C3B] text-sm text-slate-300">
      {/* Subtle tooth pattern, same motif as the page headers */}
      <svg aria-hidden="true" className="pointer-events-none absolute inset-0 h-full w-full text-white opacity-[0.035]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="tooth-footer" width="96" height="96" patternUnits="userSpaceOnUse" patternTransform="rotate(-12)">
            <path d="M45 18c-6 0-8 5-13 5-6 0-9-6-9 4 0 9 3 24 8 32 3 5 6 3 7-2 1-4 2-7 7-7s6 3 7 7c1 5 4 7 7 2 5-8 8-23 8-32 0-10-3-4-9-4-5 0-7-5-13-5z" fill="currentColor" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#tooth-footer)" />
      </svg>

      <div className="relative">
        {/* Emergency strip */}
        <div className="border-b border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5 px-4 py-8 sm:px-6 lg:px-8">
            <div className="flex items-start gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#C93535]/20 text-[#FF9A9A]">
                <Siren size={22} />
              </span>
              <div>
                <p className={`${serif} text-2xl font-semibold text-white`}>Toothache or a dental emergency?</p>
                <p className="mt-1 text-slate-300">Our line is open 24 hours. For a regular visit, book online.</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-3">
              <a href={`tel:${CLINIC.phoneTel}`} className="inline-flex items-center gap-2 rounded-lg bg-[#C93535] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#B02A2A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <Phone size={17} /> Call {CLINIC.phoneDisplay}
              </a>
              <Link to="/contact" className="inline-flex items-center gap-2 rounded-lg border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">
                <CalendarCheck size={17} /> Book appointment
              </Link>
            </div>
          </div>
        </div>

        {/* Columns */}
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:px-8">

          {/* Brand */}
          <div>
            <Link to="/" className={`inline-flex items-center gap-3 ${linkCls}`}>
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0E7C9B] text-white">
                <Smile size={24} />
              </span>
              <span className="leading-tight">
                <span className={`${serif} block text-xl font-semibold text-white`}>{CLINIC.name}</span>
                <span className="block text-xs text-slate-400">Dental care in {CLINIC.city}</span>
              </span>
            </Link>
            <p className="mt-4 max-w-xs leading-relaxed text-slate-300">
              Gentle dental care, with the price explained before treatment starts.
            </p>
            {socials.length > 0 && (
              <ul className="mt-5 flex gap-2.5">
                {socials.map(({ icon: Icon, label, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${CLINIC.name} on ${label}`}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/20 text-slate-200 transition-colors hover:bg-white hover:text-[#0C3B4E] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <Icon className="h-4 w-4" />
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Pages */}
          <nav aria-label="Footer pages">
            <h2 className={headCls}>Explore</h2>
            <ul className="mt-4 space-y-2.5">
              {PAGES.map((l) => (
                <li key={l.to}><Link to={l.to} className={linkCls}>{l.label}</Link></li>
              ))}
            </ul>
          </nav>

          {/* Treatments */}
          <nav aria-label="Footer treatments">
            <h2 className={headCls}>Book a treatment</h2>
            <ul className="mt-4 space-y-2.5">
              {SERVICE_NAMES.slice(0, 6).map((s) => (
                <li key={s}>
                  <Link to={`/contact?service=${encodeURIComponent(s)}`} className={linkCls}>{s}</Link>
                </li>
              ))}
              <li><Link to="/services" className={`${linkCls} font-semibold text-[#8FD6EA]`}>All treatments and fees</Link></li>
            </ul>
          </nav>

          {/* Visit */}
          <div>
            <h2 className={headCls}>Visit us</h2>
            <p className="mt-4 flex items-center gap-2 text-xs font-medium text-white">
              <span className={`h-2 w-2 rounded-full ${status.open ? 'bg-emerald-400' : 'bg-amber-400'}`} aria-hidden="true" />
              {status.text}
            </p>
            <ul className="mt-4 space-y-3.5">
              <li className="flex items-start gap-3">
                <MapPin size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <span className="leading-relaxed">{CLINIC.address}</span>
              </li>
              <li className="flex items-start gap-3">
                <Clock size={16} className="mt-0.5 shrink-0 text-slate-400" />
                <span>
                  {hours.map((h) => (
                    <span key={h.days} className="block">{h.days}: {h.hours}</span>
                  ))}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={16} className="shrink-0 text-slate-400" />
                <a href={`tel:${CLINIC.phoneTel}`} className={linkCls}>{CLINIC.phoneDisplay}</a>
              </li>
              <li className="flex items-center gap-3">
                <MessageCircle size={16} className="shrink-0 text-slate-400" />
                <a href={wa('Assalam o Alaikum, I have a question.')} target="_blank" rel="noreferrer" className={linkCls}>WhatsApp us</a>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={16} className="shrink-0 text-slate-400" />
                <a href={`mailto:${CLINIC.email}`} className={linkCls}>{CLINIC.email}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-x-6 gap-y-3 px-4 py-5 text-xs sm:px-6 lg:px-8">
            <p className="text-slate-400">
              © {new Date().getFullYear()} {CLINIC.name}, {CLINIC.city}. All rights reserved.
            </p>
            <p className="text-slate-300">
              <span className="font-semibold text-slate-200">We accept</span> {PAYMENTS.join(', ')}
            </p>
            <button
              type="button"
              onClick={toTop}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/20 px-3 py-1.5 font-semibold text-slate-200 transition-colors hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <ArrowUp size={14} /> Back to top
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}