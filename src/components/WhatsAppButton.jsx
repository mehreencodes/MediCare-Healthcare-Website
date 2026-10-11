
import { motion, useReducedMotion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

import { wa } from '../config/clinic'

export default function WhatsAppButton() {
  const reduceMotion = useReducedMotion()

  const href = wa(
    'Assalam o Alaikum, I would like to book a dental appointment.'
  )

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with the clinic on WhatsApp"
      initial={reduceMotion ? false : { scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { delay: 0.5, type: 'spring', stiffness: 260, damping: 20 }
      }
      whileHover={reduceMotion ? undefined : { scale: 1.08 }}
      whileTap={reduceMotion ? undefined : { scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 hidden h-14 w-14 items-center justify-center rounded-full bg-[#1A8F5B] text-white shadow-lg transition-colors hover:bg-[#157A4C] md:flex"
    >
      <MessageCircle size={26} />
    </motion.a>
  )
}
