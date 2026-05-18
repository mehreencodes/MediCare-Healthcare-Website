import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Heart, Brain, Baby, Bone,
  Star, CheckCircle, Clock, Users, Award,
  ChevronLeft, ChevronRight, Quote, Phone,
  Activity, Shield, Zap
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.6, delay: i * 0.1, ease: 'easeOut' }
  })
}

const stats = [
  { icon: Users, value: '10,000+', label: 'Happy Patients', color: 'text-primary-600 bg-primary-50' },
  { icon: Award, value: '50+', label: 'Expert Doctors', color: 'text-violet-600 bg-violet-50' },
  { icon: Clock, value: '24/7', label: 'Always Available', color: 'text-rose-600 bg-rose-50' },
  { icon: Star, value: '4.9★', label: 'Average Rating', color: 'text-amber-600 bg-amber-50' },
]

const specialties = [
  { icon: Heart, label: 'Cardiology', desc: 'Heart & vascular care', color: 'bg-rose-50 text-rose-500', hoverBorder: 'hover:border-rose-300' },
  { icon: Brain, label: 'Neurology', desc: 'Brain & nerve disorders', color: 'bg-violet-50 text-violet-500', hoverBorder: 'hover:border-violet-300' },
  { icon: Baby, label: 'Pediatrics', desc: 'Child health & growth', color: 'bg-green-50 text-green-500', hoverBorder: 'hover:border-green-300' },
  { icon: Bone, label: 'Orthopedics', desc: 'Bone & joint treatment', color: 'bg-blue-50 text-blue-500', hoverBorder: 'hover:border-blue-300' },
]

const testimonials = [
  {
    name: 'Ayesha Raza',
    city: 'Lahore',
    rating: 5,
    review: 'MediCare ne meri zindagi badal di. Dr. Sara Ahmed ne mere dil ki takleef ko bilkul sahi diagnose kiya. Booking process itni easy thi — sirf 2 minute mein appointment mil gayi!',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    treatment: 'Cardiology',
  },
  {
    name: 'Usman Tariq',
    city: 'Karachi',
    rating: 5,
    review: 'Mere bete ka pediatric checkup tha. Dr. Omar ne itne pyaar se treat kiya, bachcha bilkul nahi roya. Service phenomenal thi aur fee bhi reasonable.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    treatment: 'Pediatrics',
  },
  {
    name: 'Sana Malik',
    city: 'Islamabad',
    rating: 5,
    review: 'Skin problem ke liye Dr. Fatima se mila. Unhone ek hi session mein problem identify kar li. Ab skin bilkul clear hai. Highly recommended!',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    treatment: 'Dermatology',
  },
  {
    name: 'Bilal Ahmed',
    city: 'Faisalabad',
    rating: 5,
    review: 'Knee injury ke baad Dr. Bilal Raza ne surgical se pehle physiotherapy recommend ki. 3 hafte mein 80% better ho gaya. Zabardast doctor!',
    avatar: 'https://randomuser.me/api/portraits/men/75.jpg',
    treatment: 'Orthopedics',
  },
  {
    name: 'Mariam Khan',
    city: 'Multan',
    rating: 5,
    review: 'Neurologist se migraine ka ilaaj karwaya. Dr. Ali ne bilkul sahi dawai di. 2 mahine mein migraine attacks band ho gaye. Shukriya MediCare!',
    avatar: 'https://randomuser.me/api/portraits/women/90.jpg',
    treatment: 'Neurology',
  },
]

const whyUs = [
  { icon: Shield, text: 'Board-certified & verified doctors' },
  { icon: Zap, text: 'Instant appointment confirmation' },
  { icon: CheckCircle, text: 'Affordable consultation fees' },
  { icon: Activity, text: 'Follow-up care included' },
  { icon: Clock, text: 'Online & in-clinic options' },
  { icon: Star, text: 'Transparent pricing always' },
]

const recentPatients = [
  { name: 'Ayesha R.', avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { name: 'Usman T.', avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { name: 'Sana M.', avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { name: 'Bilal A.', avatar: 'https://randomuser.me/api/portraits/men/75.jpg' },
  { name: 'Mariam K.', avatar: 'https://randomuser.me/api/portraits/women/90.jpg' },
]

export default function Home() {
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

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
        Loading MediCare...
      </motion.p>
    </div>
  )

  return (
    <div className="pt-16 overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center bg-gradient-to-br from-primary-50 via-white to-blue-50 overflow-hidden">
        <div className="absolute top-20 right-0 w-96 h-96 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />

        <div className="section relative z-10 grid md:grid-cols-2 gap-16 items-center py-16">
          <div>
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={0}>
              <span className="badge mb-6">🏥 Pakistan's #1 Healthcare Platform</span>
            </motion.div>
            <motion.h1 variants={fadeUp} initial="hidden" animate="show" custom={1}
              className="text-5xl md:text-6xl font-extrabold text-slate-900 leading-tight">
              Your Health,<br />
              <span className="text-primary-600">Our Priority</span>
            </motion.h1>
            <motion.p variants={fadeUp} initial="hidden" animate="show" custom={2}
              className="mt-6 text-lg text-slate-500 leading-relaxed max-w-lg">
              Book appointments with Pakistan's top verified specialists instantly. No waiting, no hassle — just quality care when you need it.
            </motion.p>

            {/* Social proof */}
            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={3}
              className="flex items-center gap-4 mt-8 bg-white rounded-2xl px-5 py-4 shadow-lg border border-slate-100 w-fit">
              <div className="flex -space-x-3">
                {recentPatients.map((p, i) => (
                  <img key={i} src={p.avatar} alt={p.name}
                    className="w-9 h-9 rounded-full border-2 border-white object-cover"
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${p.name}&background=0284c7&color=fff` }}
                  />
                ))}
              </div>
              <div>
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={12} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-600 font-semibold mt-0.5">
                  10,000+ patients trust us
                </p>
              </div>
            </motion.div>

            <motion.div variants={fadeUp} initial="hidden" animate="show" custom={4}
              className="flex gap-4 mt-8 flex-wrap">
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/doctors" className="btn-primary text-base px-8 py-4">
                  Find a Doctor <ArrowRight size={18} />
                </Link>
              </motion.div>
              <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                <Link to="/services" className="btn-outline text-base px-8 py-4">
                  Our Services
                </Link>
              </motion.div>
            </motion.div>
          </div>

          {/* Hero Card */}
          <motion.div
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
            className="relative hidden md:block">

            <div className="card p-7 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-slate-900">Next Available</h3>
                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-3 py-1.5 rounded-full">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                  Live
                </span>
              </div>

              {[
                { name: 'Dr. Sara Ahmed', spec: 'Cardiologist', time: 'Today 9:00 AM', img: 'https://randomuser.me/api/portraits/women/44.jpg' },
                { name: 'Dr. Ali Hassan', spec: 'Neurologist', time: 'Today 11:00 AM', img: 'https://randomuser.me/api/portraits/men/32.jpg' },
                { name: 'Dr. Fatima Khan', spec: 'Dermatologist', time: 'Today 2:30 PM', img: 'https://randomuser.me/api/portraits/women/68.jpg' },
              ].map((doc, i) => (
                <motion.div key={i}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + i * 0.15 }}
                  className="flex items-center gap-3 bg-slate-50 rounded-2xl px-4 py-3 mb-3 hover:bg-primary-50 transition-colors cursor-pointer group">
                  <img src={doc.img} alt={doc.name}
                    className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${doc.name}&background=0284c7&color=fff` }}
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{doc.name}</p>
                    <p className="text-xs text-primary-600 font-medium">{doc.spec}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-semibold text-slate-600">{doc.time}</p>
                    <p className="text-xs text-green-500 font-bold group-hover:text-primary-600 transition-colors">Book →</p>
                  </div>
                </motion.div>
              ))}

              <Link to="/doctors" className="btn-primary w-full justify-center mt-4">
                See All Doctors <ArrowRight size={16} />
              </Link>
            </div>

            {/* Floating badges */}
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute -top-5 -right-5 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-2 z-20 border border-slate-100">
              <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm">✅</div>
              <div>
                <p className="text-xs font-bold text-slate-900">Confirmed!</p>
                <p className="text-xs text-slate-500">Appointment booked</p>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
              className="absolute -bottom-5 -left-5 bg-white rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3 z-20 border border-slate-100">
              <div className="flex -space-x-2">
                {recentPatients.slice(0, 3).map((p, i) => (
                  <img key={i} src={p.avatar} alt={p.name}
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                    onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${p.name}&background=0284c7&color=fff` }}
                  />
                ))}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">+10,000 patients</p>
                <p className="text-xs text-slate-500">joined this month</p>
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
          <span className="badge mb-4">Our Specialties</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-3">World-Class Medical Care</h2>
          <p className="text-slate-500 mt-3 max-w-xl mx-auto">
            Expert specialists across all major medical fields, ready to help you live healthier.
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
              <span className="text-xs font-bold text-primary-600">+9k</span>
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
              Healthcare You Can<br />Actually Trust
            </h2>
            <p className="text-primary-100 mt-5 leading-relaxed text-lg">
              We combine world-class doctors with seamless booking technology to deliver care that puts you first — always.
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

      {/* ── EMERGENCY BANNER ── */}
      <section className="bg-rose-600 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Phone size={22} className="text-white" />
            </div>
            <div>
              <p className="font-extrabold text-lg">Emergency? Call Now!</p>
              <p className="text-rose-100 text-sm">We're available 24/7 for medical emergencies</p>
            </div>
          </div>
          <a href="tel:+92300000000"
            className="bg-white text-rose-600 font-extrabold px-8 py-3.5 rounded-full hover:bg-rose-50 transition-all text-base whitespace-nowrap shadow-xl hover:-translate-y-0.5">
            +92 300 000 0000
          </a>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="section text-center bg-slate-50">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}>
          <span className="badge mb-5">Get Started Today</span>
          <h2 className="text-4xl font-extrabold text-slate-900 mt-2">Ready to Feel Better?</h2>
          <p className="text-slate-500 mt-4 max-w-lg mx-auto text-lg">
            Join 10,000+ patients who trust MediCare for their health needs across Pakistan.
          </p>
          <div className="flex gap-4 justify-center mt-10 flex-wrap">
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
              <Link to="/doctors" className="btn-primary text-base px-10 py-4">
                Find a Doctor <ArrowRight size={18} />
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