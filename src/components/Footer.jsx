import { Link } from 'react-router-dom'
import { Smile, Phone, Mail, MapPin, Wallet, CreditCard, ShieldCheck, Banknote } from 'lucide-react'

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5 3.66 9.15 8.44 9.94v-7.03H7.9v-2.91h2.54V9.85c0-2.51 1.49-3.9 3.77-3.9 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56v1.89h2.78l-.44 2.91h-2.34V22c4.78-.79 8.44-4.94 8.44-9.94z" />
    </svg>
  )
}

function InstagramIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" {...props}>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
    </svg>
  )
}

function TwitterIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M18.24 2H21l-6.55 7.49L22.2 22h-6.15l-4.82-6.3L5.7 22H2.93l7.02-8.02L2 2h6.3l4.36 5.76L18.24 2zm-1.08 18.17h1.71L7.94 3.73H6.1l11.06 16.44z" />
    </svg>
  )
}

const paymentMethods = [
  { icon: Banknote, label: 'Cash' },
  { icon: Wallet, label: 'Easypaisa' },
  { icon: Wallet, label: 'JazzCash' },
  { icon: CreditCard, label: 'Card Payment' },
  { icon: ShieldCheck, label: 'Insurance Accepted' },
]

const socials = [
  { icon: FacebookIcon, label: 'Facebook', href: '#' },
  { icon: InstagramIcon, label: 'Instagram', href: '#' },
  { icon: TwitterIcon, label: 'Twitter', href: '#' },
]

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400">
      <div className="max-w-6xl mx-auto px-4 py-16 grid md:grid-cols-4 gap-10">

        {/* Brand */}
        <div>
          <div className="flex items-center gap-2.5 mb-4">
            <div className="w-9 h-9 bg-primary-600 rounded-xl flex items-center justify-center">
              <Smile size={20} className="text-white" />
            </div>
            <span className="font-bold text-xl text-white">
              Bright<span className="text-primary-400">Smile</span>
            </span>
          </div>
          <p className="text-sm leading-relaxed">
            Modern dental care you can trust — gentle treatment, honest pricing, real results.
          </p>
          <div className="flex gap-3 mt-5">
            {socials.map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} aria-label={label}
                className="w-9 h-9 rounded-xl bg-slate-800 flex items-center justify-center hover:bg-primary-600 transition-colors duration-200 text-white">
                <Icon className="w-4 h-4" />
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
              { label: 'Our Dentists', to: '/doctors' },
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
            {['Teeth Whitening', 'Braces & Aligners', 'Root Canal Treatment', 'Dental Implants', 'Kids Dentistry'].map(s => (
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
              <span>123 Main Boulevard, Lahore, Pakistan</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Phone size={15} className="text-primary-400" />
              <span>+92 300 000 0000</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Mail size={15} className="text-primary-400" />
              <span>info@brightsmile.pk</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment & Insurance strip */}
      <div className="border-t border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-6 flex flex-wrap items-center justify-center md:justify-between gap-4">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">We Accept</p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            {paymentMethods.map(({ icon: Icon, label }) => (
              <span key={label}
                className="flex items-center gap-2 bg-slate-800 text-slate-300 text-xs font-semibold px-3.5 py-2 rounded-full">
                <Icon size={14} className="text-primary-400" />
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t border-slate-800 py-5 text-center text-xs text-slate-600">
        © 2026 BrightSmile Dental Care. All rights reserved.
      </div>
    </footer>
  )
}