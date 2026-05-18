import { useState, useMemo } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
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
    name: 'Dr. Sara Ahmed',
    specialty: 'Cardiologist',
    exp: '12 years',
    rating: 4.9,
    reviews: 312,
    fee: 2500,
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
    color: 'bg-rose-50',
    days: ['Mon', 'Wed', 'Fri'],
    available: true,
    about: 'Expert in heart disease prevention with 12 years of clinical experience.',
  },
  {
    id: 2,
    name: 'Dr. Ali Hassan',
    specialty: 'Neurologist',
    exp: '9 years',
    rating: 4.8,
    reviews: 247,
    fee: 3000,
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
    color: 'bg-violet-50',
    days: ['Tue', 'Thu', 'Sat'],
    available: true,
    about: 'Specializes in migraine, epilepsy and neurodegenerative disorders.',
  },
  {
    id: 3,
    name: 'Dr. Fatima Khan',
    specialty: 'Dermatologist',
    exp: '7 years',
    rating: 4.9,
    reviews: 189,
    fee: 2000,
    img: 'https://randomuser.me/api/portraits/women/68.jpg',
    color: 'bg-amber-50',
    days: ['Mon', 'Tue', 'Thu'],
    available: true,
    about: 'Skin care specialist focused on acne, eczema and cosmetic dermatology.',
  },
  {
    id: 4,
    name: 'Dr. Omar Siddiqui',
    specialty: 'Pediatrician',
    exp: '15 years',
    rating: 4.7,
    reviews: 421,
    fee: 1800,
    img: 'https://randomuser.me/api/portraits/men/75.jpg',
    color: 'bg-green-50',
    days: ['Mon', 'Wed', 'Sat'],
    available: false,
    about: 'Dedicated children\'s doctor with expertise in growth and nutrition.',
  },
  {
    id: 5,
    name: 'Dr. Zara Malik',
    specialty: 'Gynecologist',
    exp: '11 years',
    rating: 4.9,
    reviews: 538,
    fee: 2800,
    img: 'https://randomuser.me/api/portraits/women/90.jpg',
    color: 'bg-pink-50',
    days: ['Tue', 'Wed', 'Fri'],
    available: true,
    about: 'Women\'s health specialist focused on maternal and reproductive care.',
  },
  {
    id: 6,
    name: 'Dr. Bilal Raza',
    specialty: 'Orthopedist',
    exp: '10 years',
    rating: 4.6,
    reviews: 203,
    fee: 3500,
    img: 'https://randomuser.me/api/portraits/men/45.jpg',
    color: 'bg-blue-50',
    days: ['Mon', 'Thu', 'Sat'],
    available: true,
    about: 'Bone and joint specialist with expertise in sports injuries.',
  },
  {
    id: 7,
    name: 'Dr. Hira Baig',
    specialty: 'Dentist',
    exp: '6 years',
    rating: 4.8,
    reviews: 156,
    fee: 1500,
    img: 'https://randomuser.me/api/portraits/women/33.jpg',
    color: 'bg-teal-50',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    available: true,
    about: 'Dental specialist in cosmetic dentistry, braces and oral surgery.',
  },
  {
    id: 8,
    name: 'Dr. Usman Tariq',
    specialty: 'General Physician',
    exp: '8 years',
    rating: 4.7,
    reviews: 612,
    fee: 1200,
    img: 'https://randomuser.me/api/portraits/men/55.jpg',
    color: 'bg-slate-50',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    available: true,
    about: 'General practice physician for routine checkups and general health.',
  },
    {
  id: 9,
  name: 'Dr. Zunaira Imran',
  specialty: 'Dermatologist',
  exp: '8 years',
  rating: 4.9,
  reviews: 274,
  fee: 2200,
  img: 'https://randomuser.me/api/portraits/women/55.jpg',
  color: 'bg-rose-50',
  days: ['Mon', 'Wed', 'Thu', 'Sat'],
  available: true,
  about: 'Skin specialist focused on acne, anti-aging, laser treatments and cosmetic dermatology.',
},
]

const specialties = [
  'All', 'Cardiologist', 'Neurologist', 'Dermatologist',
  'Pediatrician', 'Gynecologist', 'Orthopedist', 'Dentist', 'General Physician'
]

export default function Doctors() {
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
      <section className="bg-gradient-to-br from-primary-50 via-white to-blue-50 pt-20 pb-12">
        <div className="section py-0 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="badge mb-4">
            Our Medical Team
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-extrabold text-slate-900 mt-3">
            Meet Our Doctors
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 mt-4 max-w-lg mx-auto text-lg">
            Verified specialists with years of experience, ready to help you live healthier.
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
          Showing <span className="font-extrabold text-slate-900">{filtered.length}</span> doctor{filtered.length !== 1 ? 's' : ''}
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
            <h3 className="font-extrabold text-slate-900 text-2xl">No doctors found</h3>
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