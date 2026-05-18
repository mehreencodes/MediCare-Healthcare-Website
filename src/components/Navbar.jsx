import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Stethoscope, Menu, X, Phone } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', fn)
    return () => window.removeEventListener('scroll', fn)
  }, [])

  useEffect(() => setOpen(false), [location])

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl shadow-xl shadow-slate-200/50 border-b border-slate-100'
          : 'bg-white/80 backdrop-blur-md border-b border-slate-100'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <motion.div
            whileHover={{ scale: 1.05, rotate: -5 }}
            transition={{ type: 'spring', stiffness: 400 }}
            className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center shadow-lg">
            <Stethoscope size={20} className="text-white" />
          </motion.div>
          <span className="font-extrabold text-xl text-slate-900">
            Medi<span className="text-primary-600">Care</span>
          </span>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <Link key={l.to} to={l.to}
              className={`text-sm font-semibold transition-colors relative group ${
                location.pathname === l.to
                  ? 'text-primary-600'
                  : 'text-slate-600 hover:text-slate-900'
              }`}>
              {l.label}
              <motion.span
                className="absolute -bottom-1 left-0 h-0.5 bg-primary-600 rounded-full"
                initial={false}
                animate={{ width: location.pathname === l.to ? '100%' : '0%' }}
                transition={{ duration: 0.3 }}
              />
            </Link>
          ))}
        </div>

        {/* Desktop Right */}
        <div className="hidden md:flex items-center gap-4">
          <a href="tel:+92300000000"
            className="flex items-center gap-2 text-sm font-semibold text-slate-600 hover:text-primary-600 transition-colors">
            <Phone size={15} className="text-primary-600" />
            +92 300 000 0000
          </a>
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link to="/contact" className="btn-primary py-2.5 px-6">Book Now</Link>
          </motion.div>
        </div>

        {/* Mobile Toggle */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          className="md:hidden p-2 rounded-xl hover:bg-slate-100 transition-colors"
          onClick={() => setOpen(!open)}>
          <AnimatePresence mode="wait">
            {open
              ? <motion.div key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}><X size={22} /></motion.div>
              : <motion.div key="m" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}><Menu size={22} /></motion.div>
            }
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-t border-slate-100 px-4 py-5 flex flex-col gap-3 overflow-hidden">
            {links.map((l, i) => (
              <motion.div
                key={l.to}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07 }}>
                <Link to={l.to}
                  className={`text-sm font-bold py-2.5 block ${
                    location.pathname === l.to ? 'text-primary-600' : 'text-slate-700'
                  }`}>
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}>
              <Link to="/contact" className="btn-primary justify-center w-full mt-2">
                Book Appointment
              </Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}