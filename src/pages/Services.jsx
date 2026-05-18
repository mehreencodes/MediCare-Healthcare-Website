import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Heart, Brain, Baby, Bone, Eye,
  Smile, Activity, Stethoscope, ArrowRight, CheckCircle
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
    icon: Heart,
    title: 'Cardiology',
    desc: 'Complete heart health — ECG, echo, stress tests and treatment for all cardiac conditions.',
    color: 'bg-rose-50 text-rose-500',
    border: 'hover:border-rose-200',
    tag: 'Heart & Vascular',
    features: ['ECG & Echo', 'Stress Testing', 'Heart Surgery Referral', 'Preventive Care'],
  },
  {
    icon: Brain,
    title: 'Neurology',
    desc: 'Expert diagnosis for migraines, epilepsy, stroke and all neurological disorders.',
    color: 'bg-violet-50 text-violet-500',
    border: 'hover:border-violet-200',
    tag: 'Brain & Nerves',
    features: ['MRI Analysis', 'Epilepsy Treatment', 'Stroke Care', 'Migraine Management'],
  },
  {
    icon: Baby,
    title: 'Pediatrics',
    desc: 'Specialized care for children — from newborns to teens. Growth, nutrition and vaccinations.',
    color: 'bg-green-50 text-green-500',
    border: 'hover:border-green-200',
    tag: 'Child Health',
    features: ['Vaccinations', 'Growth Tracking', 'Nutrition Plans', 'Child Psychology'],
  },
  {
    icon: Bone,
    title: 'Orthopedics',
    desc: 'Bone, joint and muscle treatment. Sports injuries, fractures and joint replacement.',
    color: 'bg-blue-50 text-blue-500',
    border: 'hover:border-blue-200',
    tag: 'Bone & Joints',
    features: ['Fracture Treatment', 'Sports Injury', 'Joint Replacement', 'Physiotherapy'],
  },
  {
    icon: Eye,
    title: 'Ophthalmology',
    desc: 'Complete eye care — vision testing, cataract surgery, and treatment for eye diseases.',
    color: 'bg-cyan-50 text-cyan-500',
    border: 'hover:border-cyan-200',
    tag: 'Eye Care',
    features: ['Vision Testing', 'Cataract Surgery', 'LASIK Referral', 'Glaucoma Care'],
  },
  {
    icon: Smile,
    title: 'Dentistry',
    desc: 'Modern dental care — cleanings, fillings, braces, implants and cosmetic dentistry.',
    color: 'bg-amber-50 text-amber-500',
    border: 'hover:border-amber-200',
    tag: 'Dental',
    features: ['Teeth Cleaning', 'Braces & Aligners', 'Implants', 'Cosmetic Dentistry'],
  },
  {
    icon: Activity,
    title: 'General Medicine',
    desc: 'Routine checkups, fever, infections and all general health concerns handled expertly.',
    color: 'bg-slate-50 text-slate-500',
    border: 'hover:border-slate-300',
    tag: 'Primary Care',
    features: ['Routine Checkups', 'Blood Tests', 'Vaccinations', 'Health Screening'],
  },
  {
    icon: Stethoscope,
    title: 'Dermatology',
    desc: 'Skin, hair and nail treatment. Acne, eczema, psoriasis and cosmetic skin care.',
    color: 'bg-pink-50 text-pink-500',
    border: 'hover:border-pink-200',
    tag: 'Skin Care',
    features: ['Acne Treatment', 'Hair Loss', 'Skin Cancer Screening', 'Cosmetic Procedures'],
  },
]

export default function Services() {
  return (
    <div className="pt-16 overflow-x-hidden">

      {/* Header */}
      <section className="bg-gradient-to-br from-primary-50 via-white to-blue-50 pt-20 pb-16">
        <div className="section py-0 text-center">
          <motion.span
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="badge mb-5">
            What We Offer
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-extrabold text-slate-900 mt-3">
            Our Medical Services
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 mt-5 max-w-xl mx-auto text-lg">
            World-class healthcare across all specialties — right here in Pakistan.
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