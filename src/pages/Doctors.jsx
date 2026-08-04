import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { Star, Clock, Banknote, Search, ArrowRight, Filter } from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' }
  })
}

const doctors = [
  {
    id: 1,
    name: 'Dr. Hira Baig',
    specialty: 'Orthodontist',
    exp: '9 years',
    rating: 4.9,
    reviews: 312,
    fee: 2500,
    img: 'https://randomuser.me/api/portraits/women/33.jpg',
    color: 'bg-violet-50',
    days: ['Mon', 'Wed', 'Fri'],
    available: true,
    about: 'Specialist in braces, aligners and bite correction with 9 years of clinical experience.',
  },
  {
    id: 2,
    name: 'Dr. Ali Hassan',
    specialty: 'Endodontist',
    exp: '10 years',
    rating: 4.8,
    reviews: 247,
    fee: 3000,
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    color: 'bg-rose-50',
    days: ['Tue', 'Thu', 'Sat'],
    available: true,
    about: 'Expert in painless root canal treatment and complex tooth pain diagnosis.',
  },
  {
    id: 3,
    name: 'Dr. Zunaira Imran',
    specialty: 'Cosmetic Dentist',
    exp: '8 years',
    rating: 4.9,
    reviews: 274,
    fee: 3200,
    img: 'https://randomuser.me/api/portraits/women/55.jpg',
    color: 'bg-amber-50',
    days: ['Mon', 'Wed', 'Thu', 'Sat'],
    available: true,
    about: 'Focused on smile makeovers — veneers, whitening and full cosmetic bonding.',
  },
  {
    id: 4,
    name: 'Dr. Omar Siddiqui',
    specialty: 'Pediatric Dentist',
    exp: '12 years',
    rating: 4.7,
    reviews: 421,
    fee: 1800,
    img: 'https://randomuser.me/api/portraits/men/75.jpg',
    color: 'bg-green-50',
    days: ['Mon', 'Wed', 'Sat'],
    available: false,
    about: 'Gentle, child-friendly dentist specializing in first visits and preventive care.',
  },
  {
    id: 5,
    name: 'Dr. Zara Malik',
    specialty: 'Periodontist',
    exp: '11 years',
    rating: 4.9,
    reviews: 198,
    fee: 2800,
    img: 'https://randomuser.me/api/portraits/women/90.jpg',
    color: 'bg-pink-50',
    days: ['Tue', 'Wed', 'Fri'],
    available: true,
    about: 'Gum disease and gum health specialist with a focus on long-term oral care.',
  },
  {
    id: 6,
    name: 'Dr. Bilal Raza',
    specialty: 'Oral Surgeon',
    exp: '10 years',
    rating: 4.6,
    reviews: 203,
    fee: 3500,
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
    color: 'bg-blue-50',
    days: ['Mon', 'Thu', 'Sat'],
    available: true,
    about: 'Handles wisdom tooth extraction, dental implants and minor oral surgery.',
  },
  {
    id: 7,
    name: 'Dr. Sara Ahmed',
    specialty: 'General Dentist',
    exp: '6 years',
    rating: 4.8,
    reviews: 356,
    fee: 1200,
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    color: 'bg-teal-50',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    available: true,
    about: 'Routine checkups, scaling & polishing, fillings and everyday dental care.',
  },
  {
    id: 8,
    name: 'Dr. Usman Tariq',
    specialty: 'General Dentist',
    exp: '8 years',
    rating: 4.7,
    reviews: 612,
    fee: 1200,
    img: 'https://randomuser.me/api/portraits/men/55.jpg',
    color: 'bg-slate-50',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    available: true,
    about: 'General dental practice for checkups, fillings and family dental care.',
  },
]

const specialties = [
  'All', 'General Dentist', 'Orthodontist', 'Endodontist',
  'Periodontist', 'Pediatric Dentist', 'Cosmetic Dentist', 'Oral Surgeon'
]

function ToothPattern({ className = '' }) {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="toothPatternDoctors" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
          <path
            d="M45 18c-6 0-8 5-13 5-6 0-9-6-9 4 0 9 3 24 8 32 3 5 6 3 7-2 1-4 2-7 7-7s6 3 7 7c1 5 4 7 7 2 5-8 8-23 8-32 0-10-3-4-9-4-5 0-7-5-13-5z"
            fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#toothPatternDoctors)" />
    </svg>
  )
}

export default function Doctors() {
  useDocumentTitle(
    'Our Dentists',
    'Meet our verified dentists — orthodontists, endodontists, oral surgeons and general dentists. Check ratings, fees and availability, then book online.'
  )
  const [search, setSearch] = useState('')
  const [active, setActive] = useState('All')
  const [onlyAvailable, setOnlyAvailable] = useState(false)
  const [sortBy, setSortBy] = useState('rating')

  const filtered = useMemo(() => {
    let list = doctors.filter(d => {
      const matchSearch =
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.specialty.toLowerCase().includes(search.toLowerCase())
      const matchSpec = active === 'All' || d.specialty === active
      const matchAvail = !onlyAvailable || d.available
      return matchSearch && matchSpec && matchAvail
    })
    if (sortBy === 'rating') list = [...list].sort((a, b) => b.rating - a.rating)
    if (sortBy === 'fee_low') list = [...list].sort((a, b) => a.fee - b.fee)
    if (sortBy === 'fee_high') list = [...list].sort((a, b) => b.fee - a.fee)
    if (sortBy === 'exp') list = [...list].sort((a, b) => parseInt(b.exp) - parseInt(a.exp))
    return list
  }, [search, active, onlyAvailable, sortBy])

  return (
    <div className="pt-16 overflow-x-hidden">

      {/* Header */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-blue-50 pt-20 pb-12 overflow-hidden">
        <ToothPattern className="text-primary-600 opacity-[0.04]" />
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="section py-0 text-center relative">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="badge mb-4">
            Our Dental Team
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-extrabold text-slate-900 mt-3">
            Meet Our Dentists
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 mt-4 max-w-lg mx-auto text-lg">
            Verified dental specialists with years of experience, ready to help you smile with confidence.
          </motion.p>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="relative max-w-lg mx-auto mt-10">
            <Search size={18} className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="w-full border border-slate-200 rounded-full px-5 pl-12 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-lg bg-white"
              placeholder="Search by name or specialty..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </motion.div>
        </div>
      </section>

      <section className="section pt-10">

        {/* Filters Row */}
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between mb-8">
          {/* Specialty Pills */}
          <div className="flex gap-2 flex-wrap">
            {specialties.map(s => (
              <motion.button
                key={s}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActive(s)}
                className={`px-4 py-2 rounded-full text-xs font-bold transition-all duration-200 ${
                  active === s
                    ? 'bg-primary-600 text-white shadow-lg'
                    : 'bg-white text-slate-600 border border-slate-200 hover:border-primary-300'
                }`}>
                {s}
              </motion.button>
            ))}
          </div>

          {/* Right filters */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <label className="flex items-center gap-2 cursor-pointer bg-white border border-slate-200 rounded-full px-4 py-2">
              <input
                type="checkbox"
                className="accent-primary-600 w-4 h-4"
                checked={onlyAvailable}
                onChange={e => setOnlyAvailable(e.target.checked)}
              />
              <span className="text-xs font-bold text-slate-700">Available Today</span>
            </label>
            <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-full px-4 py-2">
              <Filter size={14} className="text-slate-400" />
              <select
                className="text-xs font-bold text-slate-700 focus:outline-none bg-transparent cursor-pointer"
                value={sortBy}
                onChange={e => setSortBy(e.target.value)}>
                <option value="rating">Top Rated</option>
                <option value="fee_low">Fee: Low to High</option>
                <option value="fee_high">Fee: High to Low</option>
                <option value="exp">Most Experienced</option>
              </select>
            </div>
          </div>
        </div>

        {/* Count */}
        <p className="text-sm text-slate-500 mb-8 font-medium">
          Showing <span className="font-extrabold text-slate-900">{filtered.length}</span> dentist{filtered.length !== 1 ? 's' : ''}
          {active !== 'All' && <> in <span className="text-primary-600 font-bold">{active}</span></>}
        </p>

        {/* Grid */}
        {filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doc, i) => (
              <motion.div
                key={doc.id}
                variants={fadeUp}
                initial="hidden"
                whileInView="show"
                viewport={{ once: true }}
                custom={i}>
                <div className="card p-6 flex flex-col h-full hover:-translate-y-1">

                  {/* Top */}
                  <div className="flex items-start gap-4 mb-5">
                    <div className="relative flex-shrink-0">
                      <img
                        src={doc.img}
                        alt={doc.name}
                        className={`w-16 h-16 rounded-2xl object-cover ${doc.color}`}
                        onError={e => {
                          e.target.src = `https://ui-avatars.com/api/?name=${doc.name}&background=0284c7&color=fff&size=64`
                        }}
                      />
                      {doc.available && (
                        <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 text-base truncate">{doc.name}</h3>
                      <p className="text-primary-600 text-sm font-semibold">{doc.specialty}</p>
                      <div className="flex items-center gap-1 mt-1.5">
                        <Star size={13} className="text-amber-400 fill-amber-400" />
                        <span className="text-sm font-bold text-slate-800">{doc.rating}</span>
                        <span className="text-xs text-slate-400">({doc.reviews} reviews)</span>
                      </div>
                    </div>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0 ${
                      doc.available
                        ? 'bg-green-50 text-green-600'
                        : 'bg-slate-100 text-slate-500'
                    }`}>
                      {doc.available ? '● Available' : '○ Busy'}
                    </span>
                  </div>

                  {/* About */}
                  <p className="text-xs text-slate-500 leading-relaxed mb-4">{doc.about}</p>

                  {/* Info */}
                  <div className="flex gap-4 text-xs text-slate-500 mb-4">
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
                      <Clock size={11} className="text-primary-400" /> {doc.exp}
                    </span>
                    <span className="flex items-center gap-1.5 bg-slate-50 px-3 py-1.5 rounded-full">
                      <Banknote size={11} className="text-primary-400" /> Rs. {doc.fee.toLocaleString()}
                    </span>
                  </div>

                  {/* Days */}
                  <div className="flex gap-1.5 mb-6 flex-wrap">
                    {['Mon','Tue','Wed','Thu','Fri','Sat'].map(d => (
                      <span key={d}
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          doc.days.includes(d)
                            ? 'bg-primary-50 text-primary-600'
                            : 'bg-slate-50 text-slate-300'
                        }`}>
                        {d}
                      </span>
                    ))}
                  </div>

                  {/* Button */}
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="mt-auto">
                    <Link to="/contact"
                      className="btn-primary w-full justify-center py-3">
                      Book Appointment <ArrowRight size={15} />
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-28">
            <p className="text-6xl mb-5">🔍</p>
            <h3 className="font-extrabold text-slate-900 text-2xl">No dentists found</h3>
            <p className="text-slate-500 mt-2 mb-8">Try changing your search or filters</p>
            <button
              onClick={() => { setSearch(''); setActive('All'); setOnlyAvailable(false) }}
              className="btn-primary px-8">
              Clear All Filters
            </button>
          </motion.div>
        )}
      </section>
    </div>
  )
}