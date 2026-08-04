import { motion } from 'framer-motion'
import { MessageCircle } from 'lucide-react'

// Replace this number with the clinic's real WhatsApp Business number
// (country code, no + or spaces, e.g. 923001234567)
const WHATSAPP_NUMBER = '923000000000'
const DEFAULT_MESSAGE = "Hi! I'd like to book a dental appointment."

export default function WhatsAppButton() {
  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(DEFAULT_MESSAGE)}`

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.08 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 shadow-2xl shadow-green-500/30 flex items-center justify-center hover:bg-green-600 transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-40" />
      <MessageCircle size={26} className="text-white relative z-10" fill="white" strokeWidth={0} />
    </motion.a>
  )
}