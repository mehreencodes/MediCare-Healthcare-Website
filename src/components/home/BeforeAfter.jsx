import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MoveHorizontal, Smile } from 'lucide-react'
import whiteningBefore from "../../assets/whitening-before.jpg";
import whiteningAfter from "../../assets/whitening-after.jpg";
import bracesBefore from "../../assets/braces-before.jpg";
import bracesAfter from "../../assets/braces-after.jpg";
import veneersBefore from "../../assets/veneers-before.jpg";
import veneersAfter from "../../assets/veneers-after.jpg";


const CASES = [
  {
    id: 'whitening',
    label: 'Teeth whitening',
    before: whiteningBefore,
    after: whiteningAfter,
    note: 'One in-clinic whitening session.',
    service: 'Teeth whitening',
  },
  {
    id: 'braces',
    label: 'Braces',
    before: bracesBefore,
    after: bracesAfter,
    note: 'Metal braces, about 14 months.',
    service: 'Braces & aligners',
  },
  {
    id: 'veneers',
    label: 'Veneers',
    before: veneersBefore,
    after: veneersAfter,
    note: 'Porcelain veneers on the front teeth.',
    service: 'Veneers & smile design',
  },
]

const heading = "font-['Source_Serif_4',Georgia,serif] tracking-tight text-[#0C3B4E]"

function Compare({ c }) {
  const [pos, setPos] = useState(50)
  const [broken, setBroken] = useState(false)

  if (broken) {
    return (
      <div className="flex aspect-[4/3] w-full flex-col items-center justify-center gap-2 rounded-2xl bg-[#EAF4F7] px-6 text-center text-[#0E7C9B]">
        <Smile size={36} aria-hidden="true" />
        <p className="text-sm font-medium text-[#0C3B4E]">Photos for this case are added with the patient's consent.</p>
      </div>
    )
  }

  return (
    <div className="relative aspect-[4/3] w-full select-none overflow-hidden rounded-2xl bg-slate-200 has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-[#0E7C9B] has-[:focus-visible]:ring-offset-2">
      {/* After sits underneath */}
      <img
        src={c.after}
        alt={`${c.label}, after treatment`}
        draggable={false}
        onError={() => setBroken(true)}
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* Before is revealed from the left up to the slider */}
      <img
        src={c.before}
        alt={`${c.label}, before treatment`}
        draggable={false}
        onError={() => setBroken(true)}
        style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}
        className="absolute inset-0 h-full w-full object-cover"
      />

      <span className="absolute left-3 top-3 rounded-full bg-[#0C3B4E]/85 px-3 py-1 text-xs font-semibold text-white backdrop-blur">Before</span>
      <span className="absolute right-3 top-3 rounded-full bg-[#0E7C9B]/90 px-3 py-1 text-xs font-semibold text-white backdrop-blur">After</span>

      {/* Divider and grip */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 w-0.5 bg-white shadow-[0_0_8px_rgba(0,0,0,0.35)]" style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}>
        <span className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-[#0E7C9B] shadow-lg ring-1 ring-black/5">
          <MoveHorizontal size={20} />
        </span>
      </div>

      {/* Native range input on top: handles mouse, touch and keyboard (arrow keys) */}
      <input
        type="range"
        min={0}
        max={100}
        value={pos}
        onChange={(e) => setPos(Number(e.target.value))}
        aria-label={`Drag to compare ${c.label} before and after`}
        className="absolute inset-0 h-full w-full cursor-ew-resize opacity-0"
        style={{ touchAction: 'pan-y' }}
      />
    </div>
  )
}

export default function BeforeAfter() {
  const [active, setActive] = useState(CASES[0].id)
  const c = CASES.find((x) => x.id === active)

  return (
    <section className="border-y border-slate-200 bg-white py-16" aria-labelledby="results-title">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 sm:px-6 lg:grid-cols-5 lg:gap-14 lg:px-8">
        <div className="lg:col-span-2">
          <h2 id="results-title" className={`${heading} text-3xl font-semibold sm:text-4xl`}>
            See the difference for yourself.
          </h2>
          <p className="mt-3 text-lg leading-relaxed text-slate-600">
            Drag the slider to compare a real patient's smile before and after treatment.
          </p>

          <div className="mt-6 flex flex-wrap gap-2" role="group" aria-label="Choose a treatment result">
            {CASES.map((x) => (
              <button
                key={x.id}
                type="button"
                onClick={() => setActive(x.id)}
                aria-pressed={active === x.id}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B] ${
                  active === x.id ? 'border-[#0C3B4E] bg-[#0C3B4E] text-white' : 'border-slate-300 bg-white text-slate-700 hover:border-[#0C3B4E]'
                }`}
              >
                {x.label}
              </button>
            ))}
          </div>

          <p className="mt-5 text-sm text-slate-600" aria-live="polite">{c.note}</p>

          <Link
            to={`/contact?service=${encodeURIComponent(c.service)}`}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#0E7C9B] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#0B6782] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0E7C9B]"
          >
            Book {c.label.toLowerCase()}
          </Link>

          <p className="mt-5 max-w-sm text-xs leading-relaxed text-slate-500">
            Results vary from person to person. Photos are shared with each patient's written consent.
          </p>
        </div>

        <div className="lg:col-span-3">
          <Compare key={c.id} c={c} />
        </div>
      </div>
    </section>
  )
}