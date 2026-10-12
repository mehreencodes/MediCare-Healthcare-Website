import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, CalendarCheck, Phone } from 'lucide-react'
import useDocumentTitle from '../hooks/useDocumentTitle'
import { CLINIC } from '../config/clinic'
import { contactLink } from '../utils/links'

const focusRing = 'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B]'

export default function NotFound() {
  useDocumentTitle('Page not found', `The page you asked for does not exist at ${CLINIC.name}.`)

  // The server answers 200 for every route (single page app), so tell search engines not to index this
  useEffect(() => {
    const meta = document.createElement('meta')
    meta.name = 'robots'
    meta.content = 'noindex'
    document.head.appendChild(meta)
    return () => meta.remove()
  }, [])

  return (
    <section className="bg-[#F7FBFC] px-4 pb-24 pt-[72px] md:pt-[108px]">
      <div className="mx-auto max-w-xl pt-16 text-center sm:pt-24">
        <p aria-hidden="true" className="font-['Source_Serif_4',Georgia,serif] text-8xl font-semibold tracking-tight text-[#0E7C9B]/25">404</p>
        <h1 className="mt-2 font-['Source_Serif_4',Georgia,serif] text-3xl font-semibold tracking-tight text-[#0C3B4E] sm:text-4xl">
          We could not find that page.
        </h1>
        <p className="mt-3 text-lg leading-relaxed text-slate-600">
          The link may be old or mistyped. Here is where most people are headed.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link to="/" className={`inline-flex items-center gap-2 rounded-lg bg-[#0E7C9B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0B6782] ${focusRing}`}>
            <ArrowLeft size={16} /> Back to home
          </Link>
          <Link to={contactLink()} className={`inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-slate-500 ${focusRing}`}>
            <CalendarCheck size={16} /> Book appointment
          </Link>
        </div>

        <p className="mt-8 text-sm text-slate-600">
          <Link to="/services" className="font-semibold text-[#0E7C9B] hover:underline">Treatments and fees</Link>
          <span className="mx-2 text-slate-300" aria-hidden="true">|</span>
          <Link to="/doctors" className="font-semibold text-[#0E7C9B] hover:underline">Our dentists</Link>
          <span className="mx-2 text-slate-300" aria-hidden="true">|</span>
          <a href={`tel:${CLINIC.phoneTel}`} className="inline-flex items-center gap-1 font-semibold text-[#0E7C9B] hover:underline">
            <Phone size={14} /> {CLINIC.phoneDisplay}
          </a>
        </p>
      </div>
    </section>
  )
}