import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import {
  ArrowRight, Sparkles, Baby, Smile as SmileIcon,
  Star, CheckCircle, Clock, Users, Award,
  ChevronLeft, ChevronRight, Quote, Phone,
  ShieldCheck, Zap, Wrench, Search, CalendarCheck, PartyPopper,
  MoveHorizontal, MessageCircle, BadgeCheck, ChevronDown
} from 'lucide-react'

const faqs = [
  {
    q: 'Does treatment hurt?',
    a: 'Most treatments — cleanings, fillings, whitening — are painless. For procedures like root canals or extractions we use local anesthesia, so you stay comfortable throughout.',
  },
  {
    q: 'How much does a typical visit cost?',
    a: 'A routine checkup starts around Rs. 1,200. Treatment costs vary by procedure — we always share the exact fee before starting any work, no surprises.',
  },
  {
    q: 'Do you accept insurance?',
    a: 'We accept most major health insurance panels. Bring your insurance card to your visit and our front desk will confirm your coverage before treatment.',
  },
  {
    q: 'How long does an appointment take?',
    a: 'A routine checkup or cleaning takes about 30–45 minutes. More involved treatments like implants or braces fittings may take longer — we\'ll let you know when you book.',
  },
  {
    q: 'Can I book same-day for a dental emergency?',
    a: 'Yes. Call our emergency line any time — we keep same-day slots open for urgent pain, broken teeth and injuries.',
  },
]

function FAQItem({ item, isOpen, onClick }) {
  return (
    <div className="card overflow-hidden">
      <button
        onClick={onClick}
        className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left">
        <span className="font-bold text-slate-900">{item.q}</span>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.25 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-primary-50 text-primary-600 flex items-center justify-center">
          <ChevronDown size={16} />
        </motion.span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden">
            <p className="px-6 pb-5 text-sm text-slate-500 leading-relaxed">{item.a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ToothPattern({ className = '' }) {
  return (
    <svg
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="toothPattern" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
          <path
            d="M45 18c-6 0-8 5-13 5-6 0-9-6-9 4 0 9 3 24 8 32 3 5 6 3 7-2 1-4 2-7 7-7s6 3 7 7c1 5 4 7 7 2 5-8 8-23 8-32 0-10-3-4-9-4-5 0-7-5-13-5z"
            fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#toothPattern)" />
    </svg>
  )
}

function BeforeAfterSlider() {
  const [pos, setPos] = useState(50)
  const trackRef = useRef(null)
  const dragging = useRef(false)

  const updateFromClientX = (clientX) => {
    if (!trackRef.current) return
    const rect = trackRef.current.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(100, Math.max(0, pct)))
  }

  return (
    <div
      ref={trackRef}
      className="relative w-full max-w-sm mx-auto aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl select-none cursor-ew-resize"
      onMouseDown={e => { dragging.current = true; updateFromClientX(e.clientX) }}
      onMouseMove={e => { if (dragging.current) updateFromClientX(e.clientX) }}
      onMouseUp={() => (dragging.current = false)}
      onMouseLeave={() => (dragging.current = false)}
      onTouchStart={e => updateFromClientX(e.touches[0].clientX)}
      onTouchMove={e => updateFromClientX(e.touches[0].clientX)}
    >
      {/* "After" layer — right half of yellow.jpg (already-whitened side) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/yellow.jpg)',
          backgroundSize: '200% 100%',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat',
        }}
      >
        <span className="absolute top-5 right-5 badge bg-primary-600 text-white border-none">After</span>
      </div>

      {/* "Before" layer — left half of yellow.jpg (stained side), clipped by slider position */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: 'url(/yellow.jpg)',
          backgroundSize: '200% 100%',
          backgroundPosition: 'left center',
          backgroundRepeat: 'no-repeat',
          clipPath: `inset(0 ${100 - pos}% 0 0)`,
        }}
      >
        <span className="absolute top-5 left-5 badge bg-slate-700 text-white border-none">Before</span>
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 bottom-0 w-1 bg-white shadow-lg"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 left-1/2 w-11 h-11 rounded-full bg-white shadow-xl flex items-center justify-center text-primary-600">
          <MoveHorizontal size={18} />
        </div>
      </div>
    </div>
  )
}

const steps = [
  { icon: Search, title: 'Pick a treatment', desc: 'Browse services and choose what you need — whitening, braces, implants and more.' },
  { icon: CalendarCheck, title: 'Choose your dentist & time', desc: 'Filter by availability, rating or fee and pick a slot that works for you.' },
  { icon: PartyPopper, title: 'Get confirmed instantly', desc: 'Receive confirmation right away — no phone tag, no waiting on hold.' },
]


const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
  })
}

const stats = [
  { icon: Users, value: '5,000+', label: 'Happy Patients', color: 'text-primary-600 bg-primary-50' },
  { icon: Award, value: '15+', label: 'Dental Experts', color: 'text-violet-600 bg-violet-50' },
  { icon: Clock, value: '24/7', label: 'Emergency Care', color: 'text-rose-600 bg-rose-50' },
  { icon: Star, value: '4.9★', label: 'Average Rating', color: 'text-amber-600 bg-amber-50' },
]

const specialties = [
  { icon: Sparkles, label: 'Teeth Whitening', desc: 'Brighter smile in one visit', color: 'bg-amber-50 text-amber-500', hoverBorder: 'hover:border-amber-300' },
  { icon: Wrench, label: 'Braces & Aligners', desc: 'Straighter teeth, any age', color: 'bg-violet-50 text-violet-500', hoverBorder: 'hover:border-violet-300' },
  { icon: Baby, label: 'Kids Dentistry', desc: 'Gentle care for little ones', color: 'bg-green-50 text-green-500', hoverBorder: 'hover:border-green-300' },
  { icon: SmileIcon, label: 'Dental Implants', desc: 'Permanent tooth replacement', color: 'bg-blue-50 text-blue-500', hoverBorder: 'hover:border-blue-300' },
]

const testimonials = [
  {
    name: 'Ayesha Raza',
    city: 'Lahore',
    rating: 5,
    review: 'BrightSmile ne meri smile bilkul badal di. Dr. Hira ne braces lagane se pehle har detail explain ki. Booking process itni easy thi — sirf 2 minute mein appointment mil gayi!',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    treatment: 'Braces & Aligners',
  },
  {
    name: 'Usman Tariq',
    city: 'Karachi',
    rating: 5,
    review: 'Mere bete ka pehla dental checkup tha, bohat dartaa tha. Dr. Omar ne itne pyaar se treat kiya, bachcha bilkul nahi roya. Service phenomenal thi aur fee bhi reasonable.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    treatment: 'Kids Dentistry',
  },
  {
    name: 'Sana Malik',
    city: 'Islamabad',
    rating: 5,
    review: 'Teeth whitening ke liye gayi thi, result ek hi session mein amazing tha. Staff bhi bohat professional aur friendly hai. Highly recommended!',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    treatment: 'Teeth Whitening',
  },
  {
    name: 'Bilal Ahmed',
    city: 'Faisalabad',
    rating: 5,
    review: 'Root canal ka naam sun kar dar gaya tha, lekin Dr. Ali ne itna painless kiya ke pata hi nahi chala. Zabardast dentist, bilkul professional setup.',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    treatment: 'Root Canal',
  },
  {
    name: 'Mariam Khan',
    city: 'Multan',
    rating: 5,
    review: 'Dental implant karwaya tha do dant ki jagah. Dr. Zunaira ne itni saaf tarah se sab explain kiya, ab bilkul natural feel hota hai. Shukriya BrightSmile!',
    avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
    treatment: 'Dental Implants',
  },
]

const whyUs = [
  { icon: ShieldCheck, text: 'Certified & experienced dentists' },
  { icon: Zap, text: 'Instant appointment confirmation' },
  { icon: CheckCircle, text: 'Affordable, transparent pricing' },
  { icon: Sparkles, text: 'Modern, painless techniques' },
  { icon: Clock, text: 'Evening & weekend slots' },
  { icon: Star, text: 'Free follow-up consultation' },
]

const recentPatients = [
  { name: 'Ayesha R.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Usman T.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Sana M.', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Bilal A.', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { name: 'Mariam K.', avatar: 'https://randomuser.me/api/portraits/women/90.jpg' },
]

export default function Home() {
  useDocumentTitle(
    'Home',
    'BrightSmile Dental Care — trusted dentists in Lahore for whitening, braces, implants, root canal and family dental care. Book your appointment online today.'
  )
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent(p => (p + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-6">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-14 h-14 border-4 border-primary-100 border-t-primary-600 rounded-full"
      />
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-slate-500 font-semibold text-sm tracking-wide"
      >
        Loading BrightSmile...
      </motion.p>
    </div>
  )

  return (
    <div className="pt-16 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-50 via-white to-blue-50 overflow-hidden">
        <ToothPattern className="text-primary-600 opacity-[0.04]" />
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

        <div className="section relative z-10 grid md:grid-cols-2 gap-16 items-center py-16">
          <div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={0}
              className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Bring the Bright<br />
              Smile with<br />
              <span className="text-primary-600">Healthy Dental</span>
            </motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="mt-6 text-lg text-slate-500 leading-relaxed max-w-lg">
              We provide comprehensive and personalized dental care, using modern techniques
              and gentle expertise to keep your smile bright, healthy and confident.
            </motion.p>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="flex items-center gap-4 mt-9 flex-wrap">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/contact" className="btn-primary text-base px-8 py-4">
                  Make an Appointment
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/contact" className="btn-outline text-base px-8 py-4">
                  Free Consultation
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <a
                  href="https://wa.me/923000000000"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-1.5 bg-green-500 hover:bg-green-600 text-white font-semibold px-5 py-2.5 rounded-full shadow-md shadow-green-500/20 transition-colors text-sm">
                  <MessageCircle size={15} fill="white" strokeWidth={0} /> WhatsApp
                </a>
              </motion.div>
            </motion.div>

            {/* Trust line */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="flex items-center gap-4 mt-10">
              <div className="w-12 h-12 rounded-xl border border-slate-200 bg-white flex items-center justify-center flex-shrink-0">
                <ShieldCheck size={22} className="text-primary-600" />
              </div>
              <div>
                <p className="font-bold text-slate-900 text-sm">Certified Dental Team</p>
                <p className="text-xs text-slate-500 mt-0.5 max-w-xs">
                  Every dentist is licensed and regularly assessed for safe, modern treatment.
                </p>
              </div>
            </motion.div>
          </div>

          {/* Hero Photo */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="relative flex items-center justify-center mt-4 md:mt-0">

            {/* Blob backdrop */}
            <div
              className="absolute w-[280px] h-[320px] md:w-[420px] md:h-[480px] bg-primary-100"
              style={{ borderRadius: '42% 58% 65% 35% / 45% 40% 60% 55%' }}
            />

            <Sparkles size={24} className="absolute top-2 left-4 md:top-6 md:left-10 text-primary-400 z-10" />

            <img
              src="/hero.jpg"
              alt="Smiling dental patient at BrightSmile Dental Care"
              className="relative z-10 w-[220px] sm:w-[260px] md:w-[340px] rounded-[2.5rem] object-cover shadow-2xl aspect-[3/4]"
            />

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute bottom-16 md:bottom-24 -right-1 md:-right-2 w-11 h-11 md:w-16 md:h-16 rounded-full bg-primary-600 shadow-xl flex items-center justify-center z-20">
              <SmileIcon size={18} className="text-white md:hidden" />
              <SmileIcon size={26} className="text-white hidden md:block" />
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }}
              className="absolute bottom-1 right-10 md:right-16 w-10 h-10 md:w-14 md:h-14 rounded-full bg-white shadow-xl border border-slate-100 flex items-center justify-center z-20">
              <Star size={14} className="text-amber-400 fill-amber-400 md:hidden" />
              <Star size={20} className="text-amber-400 fill-amber-400 hidden md:block" />
            </motion.div>

            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }}
              className="absolute top-6 md:top-10 -left-1 md:-left-2 bg-white rounded-2xl shadow-xl px-3 py-2 md:px-4 md:py-3 flex items-center gap-2 z-20 border border-slate-100">
              <div className="w-7 h-7 md:w-8 md:h-8 bg-amber-100 rounded-full flex items-center justify-center text-xs md:text-sm">⭐</div>
              <div>
                <p className="text-[10px] md:text-xs font-bold text-slate-900">4.9 / 5.0 Rating</p>
                <p className="text-[10px] md:text-xs text-slate-500">312+ reviews</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-white border-y border-slate-100">
        <div className="section py-14">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map(({ icon: Icon, value, label, color }, i) => (
              <motion.div key={label}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
                className="flex items-center gap-4">
                <div className={`w-13 h-13 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${color}`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">{label}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SPECIALTIES ── */}
      <section className="section bg-slate-50">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-14">
          <span className="badge mb-4">Our Treatments</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-3">World-Class Dental Care</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Expert dentists across every treatment area, ready to help you smile with confidence.
          </p>
        </motion.div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {specialties.map(({ icon: Icon, label, desc, color, hoverBorder }, i) => (
            <motion.div key={label}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}>
              <Link to="/services"
                className={`card p-7 flex flex-col items-center text-center gap-4 border-2 border-transparent ${hoverBorder} hover:-translate-y-2 block`}>
                <motion.div
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
                  <Icon size={26} />
                </motion.div>
                <div>
                  <h3 className="font-bold text-slate-900">{label}</h3>
                  <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">{desc}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section bg-white">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-14">
          <span className="badge mb-4">Simple Process</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-3">Book in 3 Easy Steps</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            No calls, no waiting rooms full of uncertainty — just a clear path from search to smile.
          </p>
        </motion.div>
        <div className="grid md:grid-cols-3 gap-6 relative">
          <div className="hidden md:block absolute top-9 left-[16.5%] right-[16.5%] h-0.5 bg-slate-100" />
          {steps.map(({ icon: Icon, title, desc }, i) => (
            <motion.div key={title}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
              className="relative text-center">
              <div className="w-[72px] h-[72px] mx-auto rounded-full bg-primary-600 text-white flex items-center justify-center shadow-lg shadow-primary-200 relative z-10">
                <Icon size={28} />
              </div>
              <span className="block text-xs font-extrabold text-primary-400 mt-4 tracking-widest">STEP 0{i + 1}</span>
              <h3 className="font-bold text-slate-900 text-lg mt-1">{title}</h3>
              <p className="text-sm text-slate-500 mt-2 leading-relaxed max-w-xs mx-auto">{desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── BEFORE / AFTER ── */}
      <section className="section bg-slate-50">
        <div className="grid md:grid-cols-2 gap-14 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="badge mb-5">Real Results</span>
            <h2 className="text-4xl font-extrabold text-slate-900 leading-tight mt-2">
              See the Difference<br />For Yourself
            </h2>
            <p className="text-slate-500 mt-5 leading-relaxed text-lg">
              Drag the slider to preview a typical whitening transformation. Every treatment plan
              is tailored to your teeth, your goals and your budget.
            </p>
            <div className="flex gap-4 mt-8 flex-wrap">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/services" className="btn-primary text-base px-8 py-4">
                  See Treatments <ArrowRight size={18} />
                </Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={1}>
            <BeforeAfterSlider />
            <p className="text-xs text-slate-400 text-center mt-3">← Drag to compare →</p>
          </motion.div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section bg-white">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-14">
          <span className="badge mb-4">Patient Stories</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-3">What Our Patients Say</h2>
          <p className="text-slate-500 mt-3">Real experiences from real patients across Pakistan</p>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 60 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -60 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="card p-10 text-center relative">
              <Quote size={40} className="text-primary-100 mx-auto mb-6" />

              <div className="flex justify-center mb-4">
                {[...Array(testimonials[current].rating)].map((_, i) => (
                  <Star key={i} size={18} className="text-amber-400 fill-amber-400" />
                ))}
              </div>

              <p className="text-slate-600 text-lg leading-relaxed italic mb-8">
                "{testimonials[current].review}"
              </p>

              <div className="flex items-center justify-center gap-4">
                <img
                  src={testimonials[current].avatar}
                  alt={testimonials[current].name}
                  className="w-14 h-14 rounded-full object-cover border-4 border-primary-100"
                  onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${testimonials[current].name}&background=0284c7&color=fff` }}
                />
                <div className="text-left">
                  <p className="font-bold text-slate-900">{testimonials[current].name}</p>
                  <p className="text-sm text-slate-500">{testimonials[current].city}</p>
                  <span className="badge text-xs mt-1">{testimonials[current].treatment}</span>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setCurrent(p => (p - 1 + testimonials.length) % testimonials.length)}
              className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-primary-400 hover:text-primary-600 transition-all shadow-sm">
              <ChevronLeft size={18} />
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === current ? 'bg-primary-600 w-6' : 'bg-slate-200 w-2 hover:bg-slate-300'
                  }`} />
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
              onClick={() => setCurrent(p => (p + 1) % testimonials.length)}
              className="w-11 h-11 rounded-full bg-white border border-slate-200 flex items-center justify-center hover:border-primary-400 hover:text-primary-600 transition-all shadow-sm">
              <ChevronRight size={18} />
            </motion.button>
          </div>
        </div>

        {/* All patient avatars */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="flex items-center justify-center gap-3 mt-14 flex-wrap">
          <p className="text-sm font-semibold text-slate-500 mr-2">Recently treated:</p>
          {[
            { name: 'Ayesha', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
            { name: 'Usman', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
            { name: 'Sana', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
            { name: 'Bilal', img: 'https://randomuser.me/api/portraits/men/75.jpg' },
            { name: 'Mariam', img: 'https://randomuser.me/api/portraits/women/90.jpg' },
            { name: 'Zara', img: 'https://randomuser.me/api/portraits/women/55.jpg' },
            { name: 'Omar', img: 'https://randomuser.me/api/portraits/men/45.jpg' },
            { name: 'Hira', img: 'https://randomuser.me/api/portraits/women/33.jpg' },
          ].map((p, i) => (
            <motion.div key={i}
              whileHover={{ scale: 1.15, y: -4 }}
              className="flex flex-col items-center gap-1 cursor-pointer">
              <img src={p.img} alt={p.name}
                className="w-11 h-11 rounded-full border-2 border-white shadow-md object-cover"
                onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${p.name}&background=0284c7&color=fff` }}
              />
              <span className="text-xs text-slate-500 font-medium">{p.name}</span>
            </motion.div>
          ))}
          <div className="flex flex-col items-center gap-1">
            <div className="w-11 h-11 rounded-full bg-primary-100 border-2 border-white shadow-md flex items-center justify-center">
              <span className="text-xs font-bold text-primary-600">+4k</span>
            </div>
            <span className="text-xs text-slate-500 font-medium">More</span>
          </div>
        </motion.div>
      </section>

      {/* ── WHY US ── */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-700 text-white">
        <div className="section grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <span className="inline-flex items-center gap-1.5 bg-white/20 text-white text-xs font-bold px-4 py-2 rounded-full border border-white/30 mb-6">
              Why Choose Us
            </span>
            <h2 className="text-4xl font-extrabold leading-tight mt-2">
              Dental Care You Can<br />Actually Trust
            </h2>
            <p className="text-primary-100 mt-5 leading-relaxed text-lg">
              We combine skilled dentists with modern, gentle techniques and seamless booking to deliver care that puts your comfort first — always.
            </p>
            <div className="flex gap-4 mt-8 flex-wrap">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/contact" className="btn-white px-8 py-4 text-base">
                  Book Appointment <ArrowRight size={18} />
                </Link>
              </motion.div>
              <a href="tel:+92300000000"
                className="flex items-center gap-2 border-2 border-white/40 text-white font-bold px-8 py-4 rounded-full hover:bg-white/10 transition-all text-base">
                <Phone size={18} /> Call Now
              </a>
            </div>
          </motion.div>

          <div className="grid grid-cols-1 gap-3">
            {whyUs.map(({ icon: Icon, text }, i) => (
              <motion.div key={text}
                variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i * 0.5}
                whileHover={{ x: 8 }}
                className="flex items-center gap-4 bg-white/10 backdrop-blur-sm rounded-2xl px-6 py-4 border border-white/10 cursor-default">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center flex-shrink-0">
                  <Icon size={18} className="text-white" />
                </div>
                <span className="font-semibold">{text}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section bg-white">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="text-center mb-12">
          <span className="badge mb-4">Got Questions?</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-3">Frequently Asked Questions</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Everything patients usually want to know before their first visit.
          </p>
        </motion.div>
        <div className="max-w-2xl mx-auto space-y-3">
          {faqs.map((item, i) => (
            <motion.div key={item.q}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}>
              <FAQItem
                item={item}
                isOpen={openFaq === i}
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
              />
            </motion.div>
          ))}
        </div>
        <motion.p
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={faqs.length}
          className="text-center text-sm text-slate-500 mt-8">
          Still have a question?{' '}
          <Link to="/contact" className="text-primary-600 font-bold hover:underline">Ask us directly</Link>
        </motion.p>
      </section>

      {/* ── EMERGENCY BANNER ── */}
      <section className="bg-rose-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Phone size={22} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-lg">Dental Emergency? Call Now!</p>
              <p className="text-rose-100 text-sm">We're available 24/7 for urgent dental pain & injuries</p>
            </div>
          </div>
          <a href="tel:+92300000000"
            className="bg-white text-rose-600 font-extrabold px-8 py-3.5 rounded-full hover:bg-rose-50 transition-all text-base whitespace-nowrap shadow-xl hover:-translate-y-0.5">
            +92 300 000 0000
          </a>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative section text-center bg-slate-50 overflow-hidden">
        <ToothPattern className="text-primary-600 opacity-[0.03]" />
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative">
          <span className="badge mb-5">Get Started Today</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-2">Ready for a Brighter Smile?</h2>
          <p className="text-slate-500 mt-4 max-w-lg mx-auto text-lg">
            Join 5,000+ patients who trust BrightSmile for their dental care across Pakistan.
          </p>
          <div className="flex gap-4 justify-center mt-10 flex-wrap">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/doctors" className="btn-primary text-base px-10 py-4">
                Find a Dentist <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/contact" className="btn-outline text-base px-10 py-4">
                Contact Us
              </Link>
            </motion.div>
          </div>
        </motion.div>
      </section>

    </div>
  )
}