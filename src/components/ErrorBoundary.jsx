import { Component } from 'react'
import { Phone, RefreshCw } from 'lucide-react'
import { CLINIC } from '../config/clinic'

/*
  Catches render errors (and failed lazy page loads, for example right after a
  new deploy) so one broken page does not leave a blank screen. Pass a changing
  `resetKey` (the current path) so the error clears when the visitor navigates.
*/
export default class ErrorBoundary extends Component {
  state = { hasError: false }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('A page crashed:', error, info?.componentStack)
  }

  componentDidUpdate(prevProps) {
    if (this.state.hasError && prevProps.resetKey !== this.props.resetKey) {
      this.setState({ hasError: false })
    }
  }

  render() {
    if (!this.state.hasError) return this.props.children

    return (
      <section role="alert" className="bg-[#F7FBFC] px-4 pb-24 pt-36 text-center">
        <div className="mx-auto max-w-md">
          <h1 className="font-['Source_Serif_4',Georgia,serif] text-3xl font-semibold tracking-tight text-[#0C3B4E]">
            Something went wrong on our side.
          </h1>
          <p className="mt-3 leading-relaxed text-slate-600">
            Please reload the page. If you need help right now, you can still call the clinic.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="inline-flex items-center gap-2 rounded-lg bg-[#0E7C9B] px-6 py-3 text-sm font-semibold text-white hover:bg-[#0B6782] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B]"
            >
              <RefreshCw size={16} /> Reload page
            </button>
            <a
              href={`tel:${CLINIC.phoneTel}`}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 hover:border-slate-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B]"
            >
              <Phone size={16} /> Call {CLINIC.phoneDisplay}
            </a>
          </div>
        </div>
      </section>
    )
  }
}