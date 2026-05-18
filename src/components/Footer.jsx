import { Link } from 'react-router-dom'
import { Stethoscope, Phone, Mail, MapPin } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Stethoscope size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white">
              Medi<span className="text-primary-400">Care</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Pakistan's most trusted healthcare platform. Quality care, trusted doctors.
          </p>
          <div className="flex gap-3 mt-5">
            {['FB', 'IG', 'TW'].map((s, i) => (
              <a key={i} href="#"
                className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors duration-200 text-xs font-bold text-white">
                {s}
              </a>
            ))}
          </div>
        </div>

        {/* Links */}
        <div>
          <h4 className="font-bold text-white mb-4">Quick Links</h4>
          <div className="flex flex-col gap-3">
            {[
              { label: 'Home', to: '/' },
              { label: 'Services', to: '/services' },
              { label: 'Doctors', to: '/doctors' },
              { label: 'Contact', to: '/contact' },
            ].map(l => (
              <Link key={l.label} to={l.to}
                className="text-sm hover:text-primary-400 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Services */}
        <div>
          <h4 className="font-bold text-white mb-4">Services</h4>
          <div className="flex flex-col gap-3 text-sm">
            {['General Checkup', 'Cardiology', 'Pediatrics', 'Dermatology', 'Neurology'].map(s => (
              <span key={s} className="hover:text-primary-400 transition-colors cursor-pointer">{s}</span>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-white mb-4">Contact</h4>
          <div className="flex flex-col gap-3 text-sm">
            <div className="flex items-start gap-2.5">
              <MapPin size={15} className="text-primary-400 flex-shrink-0 mt-0.5" />
              <span>123 Medical Center, Lahore, Pakistan</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-primary-400" />
              <span>+92 300 000 0000</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={15} className="text-primary-400" />
              <span>info@medicare.pk</span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-600">
        © 2026 MediCare. All rights reserved.
      </div>
    </footer>
  )
}