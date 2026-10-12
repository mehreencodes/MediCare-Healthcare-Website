import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import WhatsAppButton from './components/WhatsAppButton'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'

// Home stays in the main bundle so the first paint is fast.
// The other pages are separate files that load when they are needed.
const loadServices = () => import('./pages/Services')
const loadDoctors = () => import('./pages/Doctors')
const loadContact = () => import('./pages/Contact')

const Services = lazy(loadServices)
const Doctors = lazy(loadDoctors)
const Contact = lazy(loadContact)
const NotFound = lazy(() => import('./pages/NotFound'))

const pageVariants = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' } },
  exit: { opacity: 0, y: -12, transition: { duration: 0.25 } },
}

// Fade only, for visitors who asked for less motion
const calmVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit: { opacity: 0, transition: { duration: 0.1 } },
}

function PageLoader() {
  return (
    <div role="status" aria-label="Loading page" className="flex min-h-[60vh] items-center justify-center">
      <span className="h-10 w-10 animate-spin rounded-full border-4 border-[#EAF4F7] border-t-[#0E7C9B] motion-reduce:animate-none" />
    </div>
  )
}

// After the first paint, quietly fetch the other pages so moving around feels instant
function usePrefetchPages() {
  useEffect(() => {
    const load = () => {
      loadServices()
      loadDoctors()
      loadContact()
    }
    if ('requestIdleCallback' in window) {
      const id = window.requestIdleCallback(load)
      return () => window.cancelIdleCallback(id)
    }
    const t = setTimeout(load, 2000)
    return () => clearTimeout(t)
  }, [])
}

function AnimatedRoutes() {
  const location = useLocation()
  const reduce = useReducedMotion()
  usePrefetchPages()

  return (
    // Scroll to the top once the old page has left, not while it is still fading out
    <AnimatePresence mode="wait" onExitComplete={() => window.scrollTo(0, 0)}>
      <motion.div
        key={location.pathname}
        variants={reduce ? calmVariants : pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        {/* resetKey clears a crash as soon as the visitor goes to another page */}
        <ErrorBoundary resetKey={location.pathname}>
          <Suspense fallback={<PageLoader />}>
            <Routes location={location}>
              <Route path="/" element={<Home />} />
              <Route path="/services" element={<Services />} />
              <Route path="/doctors" element={<Doctors />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1">
        <AnimatedRoutes />
      </main>
      <Footer />
      <WhatsAppButton />
    </div>
  )
}