import { useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { Phone, Mail, MapPin, Clock, Send, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i = 0) => ({
    opacity: 1, y: 0,
    transition: { duration: 0.5, delay: i * 0.1, ease: 'easeOut' }
  })
}

const info = [
  { icon: Phone, label: 'Phone', value: '+92 300 000 0000', sub: 'Mon–Sat 9am–8pm' },
  { icon: Mail, label: 'Email', value: 'info@brightsmile.pk', sub: 'Reply within 2 hours' },
  { icon: MapPin, label: 'Address', value: '123 Main Boulevard, Lahore', sub: 'Punjab, Pakistan' },
  { icon: Clock, label: 'Hours', value: 'Mon–Sat: 9AM–8PM', sub: 'Emergency: 24/7' },
]

function ToothPattern({ className = '' }) {
  return (
    <svg className={`absolute inset-0 w-full h-full pointer-events-none ${className}`} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="toothPatternContact" x="0" y="0" width="90" height="90" patternUnits="userSpaceOnUse">
          <path
            d="M45 18c-6 0-8 5-13 5-6 0-9-6-9 4 0 9 3 24 8 32 3 5 6 3 7-2 1-4 2-7 7-7s6 3 7 7c1 5 4 7 7 2 5-8 8-23 8-32 0-10-3-4-9-4-5 0-7-5-13-5z"
            fill="currentColor" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#toothPatternContact)" />
    </svg>
  )
}

export default function Contact() {
  useDocumentTitle(
    'Book an Appointment',
    'Book your dental appointment online — call, WhatsApp or fill the form and our team confirms within the hour. Visit us in Lahore or reach us 24/7 for emergencies.'
  )
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({
    name: searchParams.get('name') || '',
    email: '',
    phone: searchParams.get('phone') || '',
    service: '',
    date: searchParams.get('date') || '',
    message: ''
  })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handle = async (e) => {
    e.preventDefault()
    setLoading(true)
    await new Promise(r => setTimeout(r, 1500))
    setLoading(false)
    setSent(true)
    toast.success('Appointment request sent! We\'ll call you soon. 🎉')
  }

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
            Get In Touch
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl font-extrabold text-slate-900 mt-3">
            Book an Appointment
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-slate-500 mt-4 max-w-lg mx-auto text-lg">
            Fill the form and our team will confirm your appointment within 1 hour.
          </motion.p>
        </div>
      </section>

      <section className="section pt-10 grid md:grid-cols-5 gap-12 items-start">

        {/* Form — 3 cols */}
        <motion.div
          variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }}
          className="md:col-span-3">

          {sent ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card p-14 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300, delay: 0.2 }}
                className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle size={48} className="text-green-500" />
              </motion.div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-3">Request Sent!</h3>
              <p className="text-slate-500 mb-2">Our team will call you at <span className="font-bold text-slate-800">{form.phone}</span> within 1 hour to confirm.</p>
              <p className="text-slate-400 text-sm mb-8">Check your email at <span className="font-medium">{form.email}</span> for confirmation.</p>
              <button
                onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', service: '', date: '', message: '' }) }}
                className="btn-primary mx-auto">
                Book Another Appointment
              </button>
            </motion.div>
          ) : (
            <form onSubmit={handle} className="card p-8 space-y-5">
              <h2 className="text-2xl font-extrabold text-slate-900 mb-1">Your Details</h2>
              <p className="text-slate-400 text-sm">All fields marked * are required</p>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Full Name *</label>
                  <input required className="input"
                    placeholder="Ayesha Raza"
                    value={form.name}
                    onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Phone *</label>
                  <input required className="input"
                    placeholder="+92 300 1234567"
                    value={form.phone}
                    onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">Email</label>
                <input type="email" className="input"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={e => setForm(p => ({ ...p, email: e.target.value }))} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Service *</label>
                  <select required className="input appearance-none cursor-pointer"
                    value={form.service}
                    onChange={e => setForm(p => ({ ...p, service: e.target.value }))}>
                    <option value="">Select a service</option>
                    {['Teeth Whitening', 'Braces & Aligners', 'Root Canal Treatment', 'Dental Implants', 'Scaling & Polishing', 'Wisdom Tooth Extraction', 'Kids Dentistry', 'Cosmetic Dentistry'].map(s => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Preferred Date *</label>
                  <input required type="date" className="input cursor-pointer"
                    min={new Date().toISOString().split('T')[0]}
                    value={form.date}
                    onChange={e => setForm(p => ({ ...p, date: e.target.value }))} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">
                  Dental Concern / Message
                  <span className="text-slate-400 font-normal ml-1">(optional)</span>
                </label>
                <textarea rows={4} className="input resize-none"
                  placeholder="Briefly describe your dental concern or reason for visit..."
                  value={form.message}
                  onChange={e => setForm(p => ({ ...p, message: e.target.value }))} />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary w-full justify-center py-4 text-base">
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Sending...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Send size={16} /> Send Appointment Request
                  </span>
                )}
              </motion.button>
            </form>
          )}
        </motion.div>

        {/* Info — 2 cols */}
        <div className="md:col-span-2 space-y-4">
          {info.map(({ icon: Icon, label, value, sub }, i) => (
            <motion.div
              key={label}
              variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={i}
              className="card p-5 flex items-start gap-4 hover:-translate-y-0.5">
              <div className="w-12 h-12 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0">
                <Icon size={20} className="text-primary-600" />
              </div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</p>
                <p className="font-bold text-slate-900 mt-0.5">{value}</p>
                <p className="text-xs text-slate-500 mt-0.5">{sub}</p>
              </div>
            </motion.div>
          ))}

          {/* Emergency */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={4}
            className="card p-6 bg-gradient-to-br from-rose-500 to-rose-600 text-white border-0">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                <Phone size={18} className="text-white" />
              </div>
              <h4 className="font-extrabold text-lg">Emergency 24/7</h4>
            </div>
            <p className="text-rose-100 text-sm leading-relaxed mb-5">
              For dental emergencies — severe pain, broken teeth, injuries — call our hotline immediately.
            </p>
            <a href="tel:+92300000000"
              className="bg-white text-rose-600 font-extrabold px-5 py-3 rounded-full text-sm hover:bg-rose-50 transition-colors inline-flex items-center gap-2 w-full justify-center">
              <Phone size={15} /> Call Emergency Line
            </a>
          </motion.div>

          {/* Real Google Maps embed — no API key needed for basic embed.
              Replace the address in the src URL below with your real clinic address. */}
          <motion.div
            variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true }} custom={5}
            className="card overflow-hidden p-0">
            <iframe
              title="BrightSmile Dental Care location"
              src="https://www.google.com/maps?q=Lahore,Punjab,Pakistan&output=embed"
              width="100%"
              height="220"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="px-5 py-4 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-800 text-sm">123 Main Boulevard</p>
                <p className="text-xs text-slate-500">Lahore, Punjab, Pakistan</p>
              </div>
              <a href="https://maps.google.com" target="_blank" rel="noreferrer"
                className="text-xs font-bold text-primary-600 hover:underline whitespace-nowrap">
                Get Directions →
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}