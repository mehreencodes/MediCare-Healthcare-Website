import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import useDocumentTitle from '../hooks/useDocumentTitle'
import {
  Sparkles, Wrench, Activity, Gem,
  Baby, Stethoscope, ArrowRight, CheckCircle, Scissors
} from 'lucide-react'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.08, ease: 'easeOut' }
  })
}

const services = [
  {
    icon: Sparkles,
    title: 'Teeth Whitening',
    desc: 'Safe, fast in-clinic whitening for a brighter, more confident smile in one visit.',
    color: 'bg-amber-50 text-amber-500',
    border: 'hover:border-amber-200',
    tag: 'Cosmetic',
    features: ['In-office Whitening', 'Take-home Kits', 'Stain Removal', 'Sensitivity-safe Formula'],
  },
  {
    icon: Wrench,
    title: 'Braces & Aligners',
    desc: 'Traditional braces and clear aligners to straighten teeth for kids, teens and adults.',
    color: 'bg-violet-50 text-violet-500',
    border: 'hover:border-violet-200',
    tag: 'Orthodontics',
    features: ['Metal & Ceramic Braces', 'Clear Aligners', 'Bite Correction', 'Retainers'],
  },
  {
    icon: Activity,
    title: 'Root Canal Treatment',
    desc: 'Painless, modern root canal therapy to save infected or badly decayed teeth.',
    color: 'bg-rose-50 text-rose-500',
    border: 'hover:border-rose-200',
    tag: 'Restorative',
    features: ['Single-visit RCT', 'Pain-free Procedure', 'Crown Placement', 'Follow-up Care'],
  },
  {
    icon: Gem,
    title: 'Dental Implants',
    desc: 'Permanent, natural-looking replacement for missing teeth using titanium implants.',
    color: 'bg-blue-50 text-blue-500',
    border: 'hover:border-blue-200',
    tag: 'Surgical',
    features: ['Single Tooth Implants', 'Full Mouth Implants', 'Bone Grafting', 'Digital Planning'],
  },
  {
    icon: Scissors,
    title: 'Scaling & Polishing',
    desc: 'Professional deep cleaning to remove plaque, tartar and surface stains.',
    color: 'bg-cyan-50 text-cyan-500',
    border: 'hover:border-cyan-200',
    tag: 'Preventive',
    features: ['Plaque Removal', 'Gum Health Check', 'Polishing', 'Fluoride Treatment'],
  },
  {
    icon: Stethoscope,
    title: 'Wisdom Tooth Extraction',
    desc: 'Safe removal of impacted or problematic wisdom teeth with minimal discomfort.',
    color: 'bg-teal-50 text-teal-500',
    border: 'hover:border-teal-200',
    tag: 'Oral Surgery',
    features: ['Impacted Tooth Removal', 'Local Anesthesia', 'Same-day Procedure', 'Aftercare Guidance'],
  },
  {
    icon: Baby,
    title: 'Kids Dentistry',
    desc: 'Gentle, friendly dental care designed especially for children and first-time visits.',
    color: 'bg-green-50 text-green-500',
    border: 'hover:border-green-200',
    tag: 'Pediatric',
    features: ['First Visit Care', 'Cavity Prevention', 'Fluoride Treatment', 'Gentle Approach'],
  },
  {
    icon: CheckCircle,
    title: 'Cosmetic Dentistry',
    desc: 'Complete smile makeovers with veneers, bonding and shape correction.',
    color: 'bg-pink-50 text-pink-500',
    border: 'hover:border-pink-200',
    tag: 'Smile Makeover',
    features: ['Porcelain Veneers', 'Dental Bonding', 'Smile Design', 'Shape Correction'],
  },
]

function ToothPattern({ className = '' }) {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="toothPatternServices" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
          <path
            d="M45 18c-6 0-8 5-13 5-6 0-9-6-9 4 0 9 3 24 8 32 3 5 6 3 7-2 1-4 2-7 7-7s6 3 7 7c1 5 4 7 7 2 5-8 8-23 8-32 0-10-3-4-9-4-5 0-7-5-13-5z"
            fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#toothPatternServices)" />
    </svg>
  )
}

export default function Services() {
  useDocumentTitle(
    'Dental Services',
    'Teeth whitening, braces & aligners, root canal, dental implants, scaling & polishing, wisdom tooth extraction, kids dentistry and cosmetic dentistry — all under one roof.'
  )
  return (
    <div className="pt-16 overflow-x-hidden">

      {/* Header */}
      <section className="relative bg-gradient-to-br from-primary-50 via-white to-blue-50 pt-20 pb-16 overflow-hidden">
        <ToothPattern className="text-primary-600 opacity-[0.04]" />
        <div className="absolute -top-10 -left-10 w-64 h-64 bg-primary-100 rounded-full blur-3xl opacity-50 pointer-events-none" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-blue-100 rounded-full blur-3xl opacity-40 pointer-events-none" />
        <div className="section py-0 text-center relative">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="badge mb-5">
            What We Offer
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-extrabold text-slate-900 mt-3">
            Our Dental Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 mt-5 max-w-xl mx-auto text-lg">
            Modern, gentle dental care for every need — right here in Pakistan.
          </motion.p>
        </div>
      </section>

      {/* Services Grid */}
      <section className="section">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, desc, color, border, tag, features }, i) => (
            <motion.div
              key={title}
              variants={fadeUp}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              custom={i}>
              <div className={`card p-7 h-full flex flex-col border-2 border-transparent ${border} hover:-translate-y-1`}>

                <div className="flex items-start justify-between mb-5">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color}`}>
                    <Icon size={26} />
                  </motion.div>
                  <span className="text-xs font-bold text-slate-400 bg-slate-50 px-3 py-1.5 rounded-full">
                    {tag}
                  </span>
                </div>

                <h3 className="text-xl font-extrabold text-slate-900 mb-3">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed mb-5">{desc}</p>

                {/* Features */}
                <div className="space-y-2.5 mb-6 flex-1">
                  {features.map(f => (
                    <div key={f} className="flex items-center gap-2.5">
                      <CheckCircle size={14} className="text-primary-500 flex-shrink-0" />
                      <span className="text-sm text-slate-600 font-medium">{f}</span>
                    </div>
                  ))}
                </div>

                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link to="/contact"
                    className="btn-primary w-full justify-center py-3">
                    Book Now <ArrowRight size={15} />
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}