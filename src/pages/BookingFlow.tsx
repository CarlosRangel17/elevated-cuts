import { useState } from 'react'
import { STYLISTS, type Stylist } from '../data/stylists'
import { BrandLogo } from '../components/Brand'
import { IconArrowUpRight, IconMoon, IconSun } from '../components/icons'

// ─── Types ───────────────────────────────────────────────────────────────────

type Step = 1 | 2 | 3 | 4

// ─── Data ────────────────────────────────────────────────────────────────────

// Slots that are "taken" — simulating live booking occupancy from App 2
const TAKEN_SLOTS_BY_DAY: Record<number, string[]> = {
  0: ['09:00', '10:00', '13:30', '15:00'],
  1: ['09:30', '11:00', '14:00'],
  2: ['10:00', '10:30', '12:00', '16:30'],
  3: ['09:00', '11:30', '14:30', '17:00'],
  4: ['09:30', '12:30', '15:30'],
  5: ['10:00', '10:30', '11:00'],
  6: [],
}

// ─── Utility ─────────────────────────────────────────────────────────────────

function generateTimeSlots(): string[] {
  const slots: string[] = []
  for (let h = 9; h < 18; h++) {
    for (const m of [0, 30]) {
      const hStr = h.toString().padStart(2, '0')
      const mStr = m.toString().padStart(2, '0')
      slots.push(`${hStr}:${mStr}`)
    }
  }
  return slots
}

function formatTime(t: string): string {
  const [h, m] = t.split(':').map(Number)
  const ampm = h >= 12 ? 'PM' : 'AM'
  const h12  = h > 12 ? h - 12 : h === 0 ? 12 : h
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`
}

// ─── Calendar helpers ─────────────────────────────────────────────────────────

function getCalendarDays(year: number, month: number) {
  const firstDay  = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  return { firstDay, daysInMonth }
}

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December'
]

// ─── Icon atoms ───────────────────────────────────────────────────────────────

const IconBack = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

const IconChevLeft = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
)

const IconChevRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconX = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
)

const IconApple = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11"/>
  </svg>
)

const IconGoogle = () => (
  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

// ─── Step 1: Staff grid ───────────────────────────────────────────────────────

function StaffStep({
  selected, onSelect
}: { selected: Stylist | null; onSelect: (s: Stylist) => void }) {
  return (
    <div className="fade-up">
      <div className="mb-6">
        <h2 className="font-display font-extrabold text-4xl text-ink leading-none uppercase">Choose your stylist</h2>
        <p className="text-ink-dim text-sm mt-2">Pick who you want in the chair.</p>
      </div>

      <ul className="grid grid-cols-2 gap-4">
        {STYLISTS.map(s => {
          const isSelected = selected?.id === s.id
          return (
            <li key={s.id}>
              <button
                type="button"
                onClick={() => onSelect(s)}
                aria-pressed={isSelected}
                className={`relative flex h-full w-full flex-col overflow-hidden rounded-2xl border-2 text-left transition-all duration-200 active:scale-[0.98] ${
                  isSelected
                    ? 'border-accent bg-accent-dim'
                    : 'border-rim bg-surface hover:border-rim-strong'
                }`}
              >
                <div className="relative aspect-square w-full bg-bone">
                  {s.photo ? (
                    <img
                      src={s.photo}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="absolute inset-0 h-full w-full object-cover"
                      style={{ objectPosition: s.photoPosition }}
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-subtle font-display text-5xl font-extrabold text-ink-faint">
                      {s.initials}
                    </div>
                  )}
                  {isSelected && (
                    <div className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-accent text-on-accent">
                      <IconCheck />
                    </div>
                  )}
                </div>

                <div className="flex flex-1 flex-col gap-1 p-4">
                  <p className="font-display text-2xl font-extrabold uppercase leading-none text-ink">{s.name}</p>
                  <p className="font-mono text-[11px] uppercase tracking-wide text-ink-faint">{s.role}</p>
                  <p className="mt-1 text-xs font-semibold text-gold">{s.specialty}</p>
                  {s.bookingUrl && (
                    <p className="mt-2 inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase text-accent">
                      Books on Square
                      <IconArrowUpRight className="h-4 w-4" />
                    </p>
                  )}
                </div>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}

// ─── Step 2: Calendar ─────────────────────────────────────────────────────────

function CalendarStep({
  selected, onSelect
}: { selected: Date | null; onSelect: (d: Date) => void }) {
  const now   = new Date()
  const [viewYear,  setViewYear]  = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())

  const { firstDay, daysInMonth } = getCalendarDays(viewYear, viewMonth)
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1) }
    else setViewMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1) }
    else setViewMonth(m => m + 1)
  }

  const isAvailableDay = (d: number) => {
    const date = new Date(viewYear, viewMonth, d)
    return date >= today && date.getDay() !== 0 // Closed Sundays
  }

  const isSelected = (d: number) => {
    if (!selected) return false
    return selected.getFullYear() === viewYear &&
           selected.getMonth()    === viewMonth &&
           selected.getDate()     === d
  }

  const isToday = (d: number) =>
    d === now.getDate() && viewMonth === now.getMonth() && viewYear === now.getFullYear()

  const padDays = firstDay === 0 ? 6 : firstDay - 1 // Monday-first grid

  return (
    <div className="fade-up">
      <div className="mb-6">
        <h2 className="font-display font-black text-4xl text-ink leading-none">PICK A DATE</h2>
        <p className="text-ink-dim text-sm mt-2">Available days are highlighted. Sundays we're closed.</p>
      </div>

      {/* Calendar card */}
      <div className="bg-surface border border-rim rounded-2xl p-5">
        {/* Month navigation */}
        <div className="flex items-center justify-between mb-5">
          <button onClick={prevMonth} className="w-12 h-12 rounded-xl border border-rim-strong flex items-center justify-center text-ink-dim hover:text-ink transition-all">
            <IconChevLeft />
          </button>
          <h3 className="font-display font-bold text-xl text-ink">
            {MONTH_NAMES[viewMonth]} {viewYear}
          </h3>
          <button onClick={nextMonth} className="w-12 h-12 rounded-xl border border-rim-strong flex items-center justify-center text-ink-dim hover:text-ink transition-all">
            <IconChevRight />
          </button>
        </div>

        {/* Day-of-week headers */}
        <div className="grid grid-cols-7 mb-2">
          {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
            <div key={d} className="text-center text-[10px] font-mono text-ink-faint py-1">{d}</div>
          ))}
        </div>

        {/* Day grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Padding cells */}
          {Array.from({ length: padDays }, (_, i) => (
            <div key={`pad-${i}`} className="aspect-square" />
          ))}

          {/* Day cells */}
          {Array.from({ length: daysInMonth }, (_, i) => {
            const day       = i + 1
            const available = isAvailableDay(day)
            const sel       = isSelected(day)
            const tod       = isToday(day)

            return (
              <button
                key={day}
                disabled={!available}
                onClick={() => onSelect(new Date(viewYear, viewMonth, day))}
                className={`aspect-square rounded-xl text-sm font-mono font-medium flex items-center justify-center transition-all duration-150 min-h-12 ${
                  sel
                    ? 'bg-accent text-on-accent shadow-lg shadow-accent/20 scale-105'
                    : tod && available
                    ? 'border-2 border-accent text-accent hover:bg-accent-dim'
                    : available
                    ? 'text-ink hover:bg-subtle hover:text-ink'
                    : 'text-ink-faint/40 cursor-not-allowed'
                }`}
              >
                {day}
              </button>
            )
          })}
        </div>
      </div>

      {selected && (
        <div className="mt-4 flex items-center gap-2 text-sm text-ink-dim fade-up">
          <span className="font-mono text-accent font-medium">
            {selected.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </span>
          <span>selected</span>
        </div>
      )}
    </div>
  )
}

// ─── Step 3: Time slot matrix ─────────────────────────────────────────────────

function TimeSlotsStep({
  date, selected, onSelect
}: { date: Date | null; selected: string | null; onSelect: (t: string) => void }) {
  const slots  = generateTimeSlots()
  const dayIdx = date ? date.getDay() : 0
  const taken  = TAKEN_SLOTS_BY_DAY[dayIdx] ?? []

  return (
    <div className="fade-up">
      <div className="mb-6">
        <h2 className="font-display font-black text-4xl text-ink leading-none">PICK A TIME</h2>
        {date && (
          <p className="text-ink-dim text-sm mt-2">
            {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        )}
      </div>

      {/* Legend */}
      <div className="flex items-center gap-4 text-xs font-mono text-ink-faint mb-5">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full border border-rim-strong" />
          Available
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-accent" />
          Selected
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-bone" />
          Taken
        </div>
      </div>

      {/* Time slot grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
        {slots.map(slot => {
          const isTaken    = taken.includes(slot)
          const isSelected = selected === slot
          const label      = formatTime(slot)

          return (
            <button
              key={slot}
              disabled={isTaken}
              onClick={() => !isTaken && onSelect(slot)}
              className={`
                min-h-[48px] rounded-xl text-sm font-mono font-medium
                flex items-center justify-center transition-all duration-150
                ${isTaken
                  ? 'bg-bone border border-rim text-ink-faint/50 cursor-not-allowed line-through'
                  : isSelected
                  ? 'bg-accent text-on-accent border-2 border-accent shadow-lg shadow-accent/20 scale-[1.03]'
                  : 'border border-rim-strong text-ink hover:border-accent hover:text-accent hover:bg-accent-dim'
                }
              `}
            >
              {label}
            </button>
          )
        })}
      </div>
    </div>
  )
}

// ─── Step 4: Checkout bottom sheet ───────────────────────────────────────────

interface CheckoutSheetProps {
  staff: Stylist; date: Date; time: string
  notes: string; onNotesChange: (v: string) => void
  onClose: () => void; onConfirm: () => void
}

function CheckoutSheet({ staff, date, time, notes, onNotesChange, onClose, onConfirm }: CheckoutSheetProps) {
  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Sheet */}
      <div className="fixed inset-x-0 bottom-0 z-50 sheet-up max-h-[90svh] overflow-y-auto">
        <div className="bg-surface rounded-t-3xl border-t border-rim shadow-2xl">
          {/* Handle */}
          <div className="flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 bg-rim-strong rounded-full" />
          </div>

          <div className="px-5 pb-8 pt-4">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-display font-black text-3xl text-ink">CONFIRM BOOKING</h3>
              <button
                onClick={onClose}
                className="w-12 h-12 rounded-xl border border-rim-strong flex items-center justify-center text-ink-dim hover:text-ink transition-all" aria-label="Close"
              >
                <IconX />
              </button>
            </div>

            {/* Booking summary card */}
            <div className="bg-subtle rounded-2xl p-4 mb-5 flex flex-col gap-3">
              {/* Stylist row */}
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl overflow-hidden bg-bone flex-shrink-0 flex items-center justify-center font-display font-extrabold text-lg text-ink-faint">
                  {staff.photo ? (
                    <img src={staff.photo} alt="" className="w-full h-full object-cover" style={{ objectPosition: staff.photoPosition }} />
                  ) : staff.initials}
                </div>
                <div>
                  <p className="font-semibold text-ink text-sm">{staff.name}</p>
                  <p className="text-ink-faint text-xs">{staff.role}</p>
                </div>
              </div>

              <div className="border-t border-rim" />

              {/* Date + time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] font-mono text-ink-faint uppercase tracking-wider mb-1">Date</p>
                  <p className="font-mono font-medium text-ink text-sm">
                    {date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-mono text-ink-faint uppercase tracking-wider mb-1">Time</p>
                  <p className="font-mono font-medium text-gold text-sm">{formatTime(time)}</p>
                </div>
              </div>
            </div>

            {/* Notes input — App 3 client data contract */}
            <div className="mb-5">
              <label className="block text-[11px] font-mono font-medium text-ink-faint uppercase tracking-wider mb-2">
                Haircut Notes (optional)
              </label>
              <textarea
                value={notes}
                onChange={e => onNotesChange(e.target.value)}
                placeholder="e.g. Skin fade on the sides, keep length on top, line up the beard..."
                rows={3}
                className="w-full bg-subtle border border-rim rounded-xl px-4 py-3 text-sm text-ink placeholder:text-ink-faint resize-none focus:outline-none focus:border-accent transition-colors font-sans"
              />
            </div>

            {/* Payment buttons */}
            <div className="flex flex-col gap-2.5 mb-4">
              <button className="flex items-center justify-center gap-2 w-full min-h-14 bg-black text-white rounded-xl font-semibold text-sm hover:opacity-90 active:scale-[0.98] transition-all">
                <IconApple />
                Pay with Apple Pay
              </button>
              <button className="flex items-center justify-center gap-2 w-full min-h-14 bg-white border border-rim rounded-xl font-semibold text-sm text-[#444] hover:bg-subtle active:scale-[0.98] transition-all">
                <IconGoogle />
                Pay with Google Pay
              </button>
            </div>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 border-t border-rim" />
              <span className="text-ink-faint text-xs font-mono">or pay in-shop</span>
              <div className="flex-1 border-t border-rim" />
            </div>

            <button
              onClick={onConfirm}
              className="w-full min-h-14 bg-accent text-on-accent font-semibold text-base rounded-xl hover:opacity-90 active:scale-[0.98] transition-all"
            >
              Confirm Reservation
            </button>

            <p className="text-center text-xs text-ink-faint mt-3">
              No payment required now. We&apos;ll hold your slot for 15 minutes.
            </p>
          </div>
        </div>
      </div>
    </>
  )
}

// ─── Confirmation screen ─────────────────────────────────────────────────────

function ConfirmedScreen({ staff, date, time, onDone }: {
  staff: Stylist; date: Date; time: string; onDone: () => void
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-5 fade-up">
      <div className="w-20 h-20 bg-live-dim border border-live/30 rounded-full flex items-center justify-center text-live text-4xl mb-6">
        ✓
      </div>
      <h2 className="font-display font-black text-5xl text-ink mb-3">YOU&apos;RE BOOKED!</h2>
      <p className="text-ink-dim text-base mb-8 max-w-xs">
        See you {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at <span className="text-gold font-mono font-medium">{formatTime(time)}</span> with {staff.name}.
      </p>
      <div className="bg-surface border border-rim rounded-2xl p-5 w-full max-w-sm text-left mb-8">
        <p className="text-[10px] font-mono text-ink-faint uppercase tracking-wider mb-3">Details</p>
        <p className="text-sm text-ink mb-1"><span className="font-medium">Stylist:</span> {staff.name}</p>
        <p className="text-sm text-ink mb-1">
          <span className="font-medium">Date:</span>{' '}
          {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
        <p className="text-sm text-ink mb-1"><span className="font-medium">Time:</span> {formatTime(time)}</p>
        <p className="text-sm text-ink">
          <span className="font-medium">Address:</span> 1018 Slide Rd, Lubbock TX 79416
        </p>
      </div>
      <button onClick={onDone} className="w-full max-w-sm min-h-14 bg-ink text-canvas font-semibold rounded-xl hover:opacity-90 transition-all">
        Back to Home
      </button>
    </div>
  )
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

const STEP_LABELS: Record<Step, string> = { 1: 'STYLIST', 2: 'DATE', 3: 'TIME', 4: 'CONFIRM' }

function ProgressBar({ step }: { step: Step }) {
  return (
    <div className="flex items-center gap-1 mb-8">
      {([1, 2, 3, 4] as Step[]).map((s, idx) => (
        <div key={s} className="flex items-center gap-1 flex-1">
          <div className="flex flex-col items-center gap-1 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-mono font-bold transition-all ${
              step > s
                ? 'bg-accent text-on-accent'
                : step === s
                ? 'bg-accent text-on-accent ring-4 ring-accent/20'
                : 'bg-bone text-ink-faint border border-rim'
            }`}>
              {step > s ? <IconCheck /> : s}
            </div>
            <span className={`text-[9px] font-mono tracking-wider ${step >= s ? 'text-accent' : 'text-ink-faint'}`}>
              {STEP_LABELS[s]}
            </span>
          </div>
          {idx < 3 && (
            <div className={`h-px flex-1 mb-4 transition-all ${step > s ? 'bg-accent' : 'bg-rim'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

// ─── Booking flow root ────────────────────────────────────────────────────────

interface BookingFlowProps {
  dark: boolean; onToggleDark: () => void; onBack: () => void
  initialStylistId?: string
}

export default function BookingFlow({ dark, onToggleDark, onBack, initialStylistId }: BookingFlowProps) {
  const presetStylist = STYLISTS.find(s => s.id === initialStylistId && !s.bookingUrl) ?? null
  const [step,          setStep]          = useState<Step>(presetStylist ? 2 : 1)
  const [staff,         setStaff]         = useState<Stylist | null>(presetStylist)
  const [date,          setDate]          = useState<Date | null>(null)
  const [time,          setTime]          = useState<string | null>(null)
  const [notes,         setNotes]         = useState('')
  const [checkoutOpen,  setCheckoutOpen]  = useState(false)
  const [confirmed,     setConfirmed]     = useState(false)

  const canAdvance =
    (step === 1 && staff !== null) ||
    (step === 2 && date  !== null) ||
    (step === 3 && time  !== null)

  const handleNext = () => {
    if (step === 3 && time) { setCheckoutOpen(true); return }
    if (step < 4) setStep(s => (s + 1) as Step)
  }

  const handleBack = () => {
    if (step === 1) { onBack(); return }
    setStep(s => (s - 1) as Step)
  }

  const handleConfirm = () => {
    setCheckoutOpen(false)
    setConfirmed(true)
  }

  if (confirmed && staff && date && time) {
    return (
      <div className="min-h-screen bg-canvas">
        <div className="px-5 sm:px-8 py-6 max-w-lg mx-auto">
          <ConfirmedScreen staff={staff} date={date} time={time} onDone={onBack} />
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-canvas">
      {/* Booking header */}
      <header className="sticky top-0 z-30 bg-canvas border-b border-rim flex items-center justify-between px-4 sm:px-6 h-16">
        <button
          onClick={handleBack}
          className="w-12 h-12 rounded-xl border border-rim-strong flex items-center justify-center text-ink-dim hover:text-ink transition-all"
          aria-label="Back"
        >
          <IconBack />
        </button>
        <BrandLogo className="w-[124px]" />
        <button
          onClick={onToggleDark}
          className="w-12 h-12 rounded-xl border border-rim-strong flex items-center justify-center text-ink-dim hover:text-ink transition-all"
          aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
        >
          {dark ? <IconSun className="w-5 h-5" /> : <IconMoon className="w-5 h-5" />}
        </button>
      </header>

      {/* Main content */}
      <div className="px-5 sm:px-8 py-8 max-w-lg mx-auto">
        {/* Progress */}
        <ProgressBar step={step} />

        {/* Steps */}
        {step === 1 && (
          <StaffStep
            selected={staff}
            onSelect={s => {
              if (s.bookingUrl) {
                window.open(s.bookingUrl, '_blank', 'noopener,noreferrer')
                return
              }
              setStaff(s)
              setStep(2)
            }}
          />
        )}
        {step === 2 && (
          <CalendarStep selected={date} onSelect={d => { setDate(d); setStep(3) }} />
        )}
        {step === 3 && (
          <TimeSlotsStep date={date} selected={time} onSelect={t => setTime(t)} />
        )}

        {/* Continue button for steps 2 & 3 */}
        {step >= 2 && (
          <div className="mt-8">
            <button
              onClick={handleNext}
              disabled={!canAdvance}
              className={`w-full min-h-14 font-semibold text-base rounded-xl transition-all ${
                canAdvance
                  ? 'bg-accent text-on-accent hover:opacity-90 active:scale-[0.98]'
                  : 'bg-bone text-ink-faint cursor-not-allowed'
              }`}
            >
              {step === 3 ? 'Review & Confirm' : 'Continue'}
            </button>
          </div>
        )}

        {/* Booking summary strip — visible from step 2 onward */}
        {step >= 2 && (staff || date || time) && (
          <div className="mt-4 bg-subtle rounded-xl px-4 py-3 flex items-center gap-3 flex-wrap text-xs font-mono text-ink-dim fade-up">
            {staff && (
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full overflow-hidden bg-bone flex items-center justify-center text-[9px] font-display font-extrabold text-ink-faint">
                  {staff.photo ? (
                    <img src={staff.photo} alt="" className="w-full h-full object-cover" style={{ objectPosition: staff.photoPosition }} />
                  ) : staff.initials}
                </div>
                <span className="text-ink font-medium">{staff.name.split(' ')[0]}</span>
              </div>
            )}
            {date && <span className="text-ink">{date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>}
            {time && <span className="text-gold font-medium">{formatTime(time)}</span>}
          </div>
        )}
      </div>

      {/* Checkout sheet */}
      {checkoutOpen && staff && date && time && (
        <CheckoutSheet
          staff={staff}
          date={date}
          time={time}
          notes={notes}
          onNotesChange={setNotes}
          onClose={() => setCheckoutOpen(false)}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}
