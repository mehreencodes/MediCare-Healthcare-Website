import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { Smile, Menu, X, Phone, MessageCircle, CalendarCheck, MapPin, Clock, Siren } from 'lucide-react'
import { CLINIC, summarizeHours, wa } from '../config/clinic'
import useOpenStatus from '../hooks/useOpenStatus'

const LINKS = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/doctors', label: 'Our Dentists' },
  { to: '/contact', label: 'Contact' },
]

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B]'
const barLink = 'rounded transition-colors hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()
  const status = useOpenStatus()
  const mainHours = summarizeHours()[0]

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close the menu when the page changes, or when Escape is pressed
  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  return (
    // Height: info bar 36px (desktop only) + main bar 72px.
    // On scroll the info bar slides away and the main bar stays at the top.
    <header className={`fixed inset-x-0 top-0 z-50 transition-transform duration-300 ${scrolled ? 'md:-translate-y-9' : ''}`}>

      {/* Info bar, desktop only */}
      <div
        className="hidden h-9 bg-[#092C3B] text-xs text-slate-300 md:block"
        inert={scrolled ? '' : undefined}
      >
        <div className="mx-auto flex h-full max-w-7xl items-center justify-between gap-6 px-4 sm:px-6 lg:px-8">
          <ul className="flex items-center gap-5">
            <li className="flex items-center gap-1.5">
              <span className={`h-1.5 w-1.5 rounded-full ${status.open ? 'bg-emerald-400' : 'bg-amber-400'}`} aria-hidden="true" />
              <span className="font-medium text-white">{status.open ? 'Open now' : 'Closed now'}</span>
            </li>
            <li className="hidden items-center gap-1.5 lg:flex">
              <Clock size={13} aria-hidden="true" /> {mainHours.days}, {mainHours.hours}
            </li>
            <li className="hidden items-center gap-1.5 xl:flex">
              <MapPin size={13} aria-hidden="true" /> {CLINIC.area}, {CLINIC.city}
            </li>
          </ul>
          <ul className="flex items-center gap-5">
            <li>
              <a href={`tel:${CLINIC.phoneTel}`} className={`flex items-center gap-1.5 font-semibold text-white ${barLink}`}>
                <Siren size={13} className="text-[#FF8A8A]" aria-hidden="true" /> Emergency 24/7: {CLINIC.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={wa('Assalam o Alaikum, I have a question.')} target="_blank" rel="noreferrer" className={`flex items-center gap-1.5 ${barLink}`}>
                <MessageCircle size={13} aria-hidden="true" /> WhatsApp
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Main bar */}
      <div className={`border-b bg-white/95 backdrop-blur transition-shadow ${scrolled ? 'border-slate-200 shadow-md shadow-slate-900/5' : 'border-slate-200/70'}`}>
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          {/* Brand */}
          <Link to="/" className={`flex items-center gap-3 rounded-lg ${focusRing}`} aria-label={`${CLINIC.name}, home`}>
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#0E7C9B] text-white">
              <Smile size={24} />
            </span>
            <span className="leading-tight">
              <span className="block font-['Source_Serif_4',Georgia,serif] text-xl font-semibold tracking-tight text-[#0C3B4E]">{CLINIC.name}</span>
              <span className="block text-xs text-slate-500">Dental care in {CLINIC.city}</span>
            </span>
          </Link>

          {/* Desktop links */}
          <nav aria-label="Main" className="hidden items-center gap-8 md:flex">
            {LINKS.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === '/'}
                className={({ isActive }) =>
                  `relative rounded py-1 text-sm font-semibold transition-colors ${focusRing} ${
                    isActive ? 'text-[#0E7C9B]' : 'text-slate-600 hover:text-[#0C3B4E]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {l.label}
                    {isActive && (
                      <motion.span
                        layoutId="nav-underline"
                        className="absolute -bottom-1.5 left-0 right-0 h-0.5 rounded-full bg-[#0E7C9B]"
                        transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                      />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Desktop actions */}
          <div className="hidden items-center gap-5 md:flex">
            <a href={`tel:${CLINIC.phoneTel}`} className={`flex items-center gap-2.5 rounded-lg ${focusRing}`}>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#EAF4F7] text-[#0E7C9B]">
                <Phone size={17} />
              </span>
              <span className="leading-tight">
                <span className="block text-xs text-slate-500">Call for appointment</span>
                <span className="block text-sm font-semibold text-slate-900">{CLINIC.phoneDisplay}</span>
              </span>
            </a>
            <Link to="/contact" className={`inline-flex items-center gap-2 rounded-lg bg-[#0E7C9B] px-5 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#0B6782] ${focusRing}`}>
              <CalendarCheck size={16} /> Book appointment
            </Link>
          </div>

          {/* Mobile: call + menu */}
          <div className="flex items-center gap-1 md:hidden">
            <a href={`tel:${CLINIC.phoneTel}`} aria-label={`Call ${CLINIC.name}`} className={`rounded-lg p-2.5 text-[#0E7C9B] hover:bg-[#EAF4F7] ${focusRing}`}>
              <Phone size={22} />
            </a>
            <button
              type="button"
              aria-label={open ? 'Close menu' : 'Open menu'}
              aria-expanded={open}
              aria-controls="mobile-menu"
              onClick={() => setOpen((v) => !v)}
              className={`rounded-lg p-2.5 text-slate-700 hover:bg-slate-100 ${focusRing}`}
            >
              {open ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {open && (
            <motion.div
              id="mobile-menu"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden border-t border-slate-200 bg-white md:hidden"
            >
              <nav aria-label="Mobile" className="flex flex-col gap-1 px-4 pb-3 pt-3">
                {LINKS.map((l) => (
                  <NavLink
                    key={l.to}
                    to={l.to}
                    end={l.to === '/'}
                    className={({ isActive }) =>
                      `rounded-lg px-3.5 py-3 text-base font-semibold ${focusRing} ${
                        isActive ? 'bg-[#EAF4F7] text-[#0E7C9B]' : 'text-slate-800 hover:bg-slate-50'
                      }`
                    }
                  >
                    {l.label}
                  </NavLink>
                ))}
              </nav>

              <div className="grid gap-2.5 border-t border-slate-200 px-4 pb-5 pt-4">
                <p className="flex items-center gap-2 text-sm text-slate-600">
                  <span className={`h-2 w-2 rounded-full ${status.open ? 'bg-emerald-500' : 'bg-amber-500'}`} aria-hidden="true" />
                  {status.text}
                </p>
                <div className="grid grid-cols-2 gap-2.5">
                  <a href={`tel:${CLINIC.phoneTel}`} className={`flex items-center justify-center gap-2 rounded-lg border border-slate-300 py-3 text-sm font-semibold text-slate-800 ${focusRing}`}>
                    <Phone size={16} /> Call
                  </a>
                  <a href={wa('Assalam o Alaikum, I would like to book an appointment.')} target="_blank" rel="noreferrer" className={`flex items-center justify-center gap-2 rounded-lg bg-[#1A8F5B] py-3 text-sm font-semibold text-white ${focusRing}`}>
                    <MessageCircle size={16} /> WhatsApp
                  </a>
                </div>
                <Link to="/contact" className={`flex items-center justify-center gap-2 rounded-lg bg-[#0E7C9B] py-3 text-sm font-semibold text-white ${focusRing}`}>
                  <CalendarCheck size={16} /> Book appointment
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </header>
  )
}