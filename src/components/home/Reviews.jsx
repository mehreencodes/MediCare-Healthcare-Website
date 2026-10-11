import { Star } from 'lucide-react'

// SAMPLE reviews. Replace with real ones (Google Maps reviews, with the patient's permission).
const REVIEWS = [
  { name: 'Hina Tariq', area: 'Gulberg', treatment: 'Root canal', stars: 5, text: 'I was very nervous about my root canal, but I felt nothing and the dentist kept checking on me. The fee matched what they told me.' },
  { name: 'Muhammad Saad', area: 'Model Town', treatment: 'Kids dentistry', stars: 5, text: 'Took my son for his first visit. He walked out smiling and asking when he can come back. Very patient staff.' },
  { name: 'Rabia Nadeem', area: 'Johar Town', treatment: 'Braces', stars: 5, text: 'Appointments always start on time and they confirm everything on WhatsApp. No running around at the front desk.' },
  { name: 'Bilal Ahmed', area: 'DHA', treatment: 'Wisdom tooth', stars: 5, text: 'Doctor sahab ne pehle sab samjhaya phir kaam shuru kiya. Bilkul dard nahi hua aur aftercare ki list bhi di.' },
  { name: 'Sana Malik', area: 'Faisal Town', treatment: 'Whitening', stars: 4, text: 'Result one session mein hi nazar aa gaya. Staff friendly hai aur clinic bohat saaf suthri hai.' },
  { name: 'Usman Raza', area: 'Gulberg', treatment: 'Checkup', stars: 5, text: 'Evening slot mil gaya jab office ke baad free tha. Checkup, cleaning aur X-ray ek hi visit mein ho gaye.' },
  { name: 'Ayesha Farooq', area: 'Cantt', treatment: 'Dental implant', stars: 5, text: 'They showed me the full plan and cost on paper before starting. That honesty is why I stayed with this clinic.' },
  { name: 'Hamza Iqbal', area: 'Wapda Town', treatment: 'Toothache', stars: 5, text: 'Raat ko dard se bura haal tha, call kiya to next morning pehle slot mil gaya. Pain relief usi din ho gaya.' },
  { name: 'Mariam Khan', area: 'Johar Town', treatment: 'Veneers', stars: 5, text: 'I liked that the dentist showed a preview of the smile first. Very natural result, nothing over the top.' },
]

const heading = "font-['Source_Serif_4',Georgia,serif] tracking-tight text-[#0C3B4E]"
const initials = (name) => name.split(' ').map((w) => w[0]).join('')

function ReviewCard({ r }) {
  return (
    <figure className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex gap-0.5" aria-label={`${r.stars} out of 5 stars`}>
        {[...Array(5)].map((_, i) => (
          <Star key={i} size={15} className={i < r.stars ? 'fill-amber-400 text-amber-400' : 'text-slate-300'} />
        ))}
      </div>
      <blockquote className="mt-3 text-[15px] leading-relaxed text-slate-700">{r.text}</blockquote>
      <figcaption className="mt-4 flex items-center gap-3">
        <span aria-hidden="true" className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#0C3B4E] text-sm font-semibold text-white">
          {initials(r.name)}
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block text-sm font-semibold text-slate-900">{r.name}</span>
          <span className="block text-xs text-slate-500">{r.treatment}, {r.area}</span>
        </span>
      </figcaption>
    </figure>
  )
}

function ReviewColumn({ items, direction, seconds, className = '' }) {
  return (
    <div className={`pc-wrap overflow-hidden ${className}`}>
      <div className={`pc-col ${direction === 'down' ? 'pc-down' : 'pc-up'}`} style={{ animationDuration: `${seconds}s` }}>
        {[...items, ...items].map((r, i) => (
          <div key={i} className={`pb-5 ${i >= items.length ? 'motion-reduce:hidden' : ''}`} aria-hidden={i >= items.length || undefined}>
            <ReviewCard r={r} />
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Reviews() {
  const cols = [REVIEWS.slice(0, 3), REVIEWS.slice(3, 6), REVIEWS.slice(6, 9)]

  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8" aria-labelledby="rev-title">
      <style>{`
        @keyframes pc-up { from { transform: translateY(0) } to { transform: translateY(-50%) } }
        @keyframes pc-down { from { transform: translateY(-50%) } to { transform: translateY(0) } }
        .pc-col { animation-timing-function: linear; animation-iteration-count: infinite; will-change: transform; }
        .pc-up { animation-name: pc-up; }
        .pc-down { animation-name: pc-down; }
        .pc-wrap:hover .pc-col, .pc-wrap:focus-within .pc-col { animation-play-state: paused; }
        @media (prefers-reduced-motion: reduce) { .pc-col { animation: none; } }
      `}</style>

      <div className="max-w-xl">
        <h2 id="rev-title" className={`${heading} text-3xl font-semibold sm:text-4xl`}>What patients say</h2>
        <p className="mt-2 text-slate-600">Hover over a column to pause it and read at your own pace.</p>
      </div>

      <div className="mt-10 grid h-[520px] gap-5 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,black_12%,black_88%,transparent)] md:grid-cols-2 lg:grid-cols-3 motion-reduce:h-auto motion-reduce:[mask-image:none]">
        <ReviewColumn items={cols[0]} direction="up" seconds={34} />
        <ReviewColumn items={cols[1]} direction="down" seconds={40} className="hidden md:block" />
        <ReviewColumn items={cols[2]} direction="up" seconds={37} className="hidden lg:block" />
      </div>
    </section>
  )
}