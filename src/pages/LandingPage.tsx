import { useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import { STYLISTS, type Stylist } from '../data/stylists'
import { BrandLogo, CroppedImage } from '../components/Brand'
import {
  IconArrowRight, IconArrowUpRight, IconClock, IconDoor, IconMail, IconMoon,
  IconPhone, IconPin, IconScissors, IconSparkle, IconSun, IconUser,
} from '../components/icons'

const FLYER_SRC = '/assets/elevated-cuts-flyer.webp'
const STOREFRONT_SRC = '/assets/elevated-cuts-store-front.webp'

// ─── Data contracts ──────────────────────────────────────────────────────────

type IconComponent = (props: { className?: string }) => ReactNode

interface Service {
  id: number
  name: string
  duration: number
  price: number
  tag?: string
}

interface Metric {
  id: string
  title: string
  detail: string
  Icon: IconComponent
}

interface Promo {
  id: string
  title: string
  detail: string
  Icon: IconComponent
}

interface DayHours {
  day: string
  short: string
  /** [open, close] in minutes after midnight, Lubbock time. null = closed. */
  range: [number, number] | null
}

// ─── Content ─────────────────────────────────────────────────────────────────

const SHOP = {
  address1: '1018 Slide Rd',
  address2: 'Lubbock, TX 79416',
  phoneDisplay: '(806) 407-3129',
  phoneHref: 'tel:8064073129',
  email: 'elevatedcuts2024@gmail.com',
  mapsHref: 'https://www.google.com/maps/search/?api=1&query=1018+Slide+Rd+Lubbock+TX+79416',
}

const METRICS: Metric[] = [
  { id: 'fades',   title: 'Premium Fades & Tailoring', detail: "Men's precision cuts",    Icon: IconScissors },
  { id: 'facials', title: 'Facials & Skin Therapy',    detail: 'Licensed esthetician',    Icon: IconSparkle },
  { id: 'walkins', title: 'Walk-Ins Welcome',          detail: 'No appointment needed',   Icon: IconDoor },
  { id: 'where',   title: 'Located off Slide Rd',      detail: '1018 Slide Rd, Lubbock',  Icon: IconPin },
]

const SERVICES: Service[] = [
  { id: 1,  name: 'Classic Haircut', duration: 30, price: 25 },
  { id: 2,  name: 'Skin Fade',       duration: 45, price: 30, tag: 'Popular' },
  { id: 3,  name: 'Beard Trim',      duration: 20, price: 15 },
  { id: 4,  name: 'Cut + Beard',     duration: 60, price: 40, tag: 'Best Value' },
  { id: 5,  name: "Men's Facial",    duration: 45, price: 55, tag: 'New' },
  { id: 6,  name: 'Shampoo & Style', duration: 30, price: 20 },
  { id: 7,  name: "Kids' Cut",       duration: 25, price: 20 },
  { id: 8,  name: 'Buzz Cut',        duration: 15, price: 18 },
  { id: 9,  name: 'Eyebrow Trim',    duration: 15, price: 12 },
  { id: 10, name: 'Groom Package',   duration: 90, price: 65, tag: 'Deal' },
]

const PROMOS: Promo[] = [
  { id: 'facials', title: "Men's Facials",       detail: 'Now offered by appointment with licensed esthetician Alexis.', Icon: IconSparkle },
  { id: 'laura',   title: 'Laura Joins the Team', detail: 'Another stylist is now available for appointments.',          Icon: IconUser },
  { id: 'late',    title: 'Open Late',            detail: 'Evening appointments available by request.',                  Icon: IconClock },
]

const HOURS: DayHours[] = [
  { day: 'Monday',    short: 'Mon', range: [9 * 60, 18 * 60] },
  { day: 'Tuesday',   short: 'Tue', range: [9 * 60, 18 * 60] },
  { day: 'Wednesday', short: 'Wed', range: [9 * 60, 18 * 60] },
  { day: 'Thursday',  short: 'Thu', range: [9 * 60, 18 * 60] },
  { day: 'Friday',    short: 'Fri', range: [9 * 60, 18 * 60] },
  { day: 'Saturday',  short: 'Sat', range: [9 * 60, 14 * 60] },
  { day: 'Sunday',    short: 'Sun', range: null },
]

const PAYMENT_METHODS = ['Apple Pay', 'Google Pay', 'CashApp', 'Visa', 'Mastercard', 'Amex']

const NAV_LINKS = [
  { href: '#services', label: 'Services' },
  { href: '#team',     label: 'Stylists' },
  { href: '#new',      label: "What's New" },
  { href: '#visit',    label: 'Visit' },
]

// ─── Shop clock ──────────────────────────────────────────────────────────────

function formatMinutes(total: number): string {
  const h = Math.floor(total / 60)
  const m = total % 60
  const suffix = h >= 12 ? 'PM' : 'AM'
  const h12 = h % 12 === 0 ? 12 : h % 12
  return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`
}

function getShopClock(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Chicago', weekday: 'short', hour: 'numeric', minute: 'numeric', hourCycle: 'h23',
  }).formatToParts(date)
  const pick = (type: string) => parts.find(p => p.type === type)?.value ?? ''
  const dayIdx = Math.max(0, HOURS.findIndex(h => h.short === pick('weekday')))
  return { dayIdx, minutes: Number(pick('hour')) * 60 + Number(pick('minute')) }
}

function getOpenStatus(date: Date): { open: boolean; label: string; dayIdx: number } {
  const { dayIdx, minutes } = getShopClock(date)
  const today = HOURS[dayIdx].range
  if (today && minutes >= today[0] && minutes < today[1]) {
    return { open: true, label: `Open now · until ${formatMinutes(today[1])}`, dayIdx }
  }
  for (let i = 0; i < 7; i++) {
    const idx = (dayIdx + i) % 7
    const range = HOURS[idx].range
    if (!range || (i === 0 && minutes >= range[1])) continue
    const when = i === 0 ? '' : i === 1 ? 'tomorrow ' : `${HOURS[idx].short} `
    return { open: false, label: `Closed · opens ${when}${formatMinutes(range[0])}`, dayIdx }
  }
  return { open: false, label: 'Closed', dayIdx }
}

function useOpenStatus() {
  const [status, setStatus] = useState(() => getOpenStatus(new Date()))
  useEffect(() => {
    const id = window.setInterval(() => setStatus(getOpenStatus(new Date())), 60_000)
    return () => window.clearInterval(id)
  }, [])
  return status
}

// ─── Shared UI atoms ─────────────────────────────────────────────────────────

const CONTAINER = 'mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8'

const BTN_BASE =
  'inline-flex min-h-12 items-center justify-center gap-2 rounded-xl px-6 font-display text-lg font-bold uppercase tracking-wider transition active:scale-[0.98]'
const BTN_PRIMARY = `${BTN_BASE} bg-accent text-on-accent hover:brightness-110`
const BTN_OUTLINE = `${BTN_BASE} border-2 border-panel-rim text-panel-ink hover:bg-white/10`
const BTN_GHOST = `${BTN_BASE} border-2 border-rim-strong text-ink hover:bg-subtle`

function SectionHeading({ eyebrow, children }: { eyebrow: string; children: ReactNode }) {
  return (
    <div className="mb-6 sm:mb-8">
      <p className="mb-2 font-mono text-xs font-semibold uppercase tracking-[0.18em] text-gold">{eyebrow}</p>
      <h2 className="font-display text-4xl font-extrabold uppercase leading-[0.95] text-ink sm:text-5xl">
        {children}
      </h2>
    </div>
  )
}

function StatusPill({ open, label }: { open: boolean; label: string }) {
  return (
    <span
      className={`inline-flex min-h-8 items-center gap-2 whitespace-nowrap rounded-full border px-3 font-mono text-xs font-semibold uppercase tracking-wide ${
        open ? 'border-live/40 bg-live-dim text-live' : 'border-rim-strong bg-bone text-ink-dim'
      }`}
    >
      <span className={`block h-2 w-2 rounded-full ${open ? 'live-pulse bg-live' : 'bg-ink-faint'}`} />
      {label}
    </span>
  )
}

// ─── Header ──────────────────────────────────────────────────────────────────

interface HeaderProps {
  dark: boolean
  onToggleDark: () => void
  onBook: () => void
}

function SiteHeader({ dark, onToggleDark, onBook }: HeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b border-rim bg-canvas">
      <div className={`${CONTAINER} flex h-16 items-center justify-between gap-4`}>
        <a href="#top" aria-label="Elevated Cuts — back to top" className="flex min-h-12 items-center rounded-lg">
          <BrandLogo className="w-[124px] sm:w-[148px]" />
        </a>

        <nav aria-label="Primary" className="hidden items-center md:flex">
          {NAV_LINKS.map(link => (
            <a
              key={link.href}
              href={link.href}
              className="inline-flex min-h-12 items-center rounded-lg px-4 font-display text-lg font-semibold uppercase tracking-wider text-ink-dim transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleDark}
            aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex h-12 w-12 items-center justify-center rounded-xl border border-rim-strong text-ink-dim transition-colors hover:text-ink"
          >
            {dark ? <IconSun className="h-5 w-5" /> : <IconMoon className="h-5 w-5" />}
          </button>
          <button type="button" onClick={onBook} className={`${BTN_PRIMARY} hidden sm:inline-flex`}>
            Book Now
          </button>
        </div>
      </div>
    </header>
  )
}

// ─── Tagline strip ───────────────────────────────────────────────────────────

function TaglineStrip() {
  return (
    <div className={`${CONTAINER} pt-6 sm:pt-8`}>
      <p className="font-display text-xl font-bold uppercase leading-tight tracking-wide text-ink sm:text-2xl">
        Clean <span className="text-accent">Cut.</span> Clean <span className="text-gold">Face.</span> Elevated{' '}
        <span className="text-accent">Look.</span>
      </p>
    </div>
  )
}

// ─── Hero ────────────────────────────────────────────────────────────────────

function HeroSection({ onBook }: { onBook: () => void }) {
  const status = useOpenStatus()
  return (
    <section className={`${CONTAINER} pt-4 sm:pt-6`}>
      <div className="grid overflow-hidden rounded-2xl border border-rim lg:grid-cols-[1.15fr_1fr]">
        <div className="panel flex flex-col justify-center bg-panel p-6 text-panel-ink sm:p-10 lg:p-12">
          <p className="mb-4 font-mono text-xs font-semibold uppercase tracking-[0.2em] text-panel-dim">
            Lubbock, TX · Est. 2024
          </p>
          <h1 className="font-display text-[clamp(3.25rem,14vw,5.5rem)] font-extrabold uppercase leading-[0.88] lg:text-[clamp(3.5rem,6vw,5.5rem)]">
            Sharpen your
            <span className="block pt-1">
              <span className="text-gradient font-bold normal-case italic">Look</span>
            </span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-panel-dim sm:text-lg">
            Precision fades, men&apos;s facials, and real craft at {SHOP.address1}. Walk-ins always welcome.
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button type="button" onClick={onBook} className={BTN_PRIMARY}>
              Book Now
              <IconArrowRight className="h-5 w-5" />
            </button>
            <a href="#team" className={BTN_OUTLINE}>Meet the Stylists</a>
          </div>
        </div>

        <div className="relative flex flex-col bg-surface">
          <div className="flex flex-1 items-center justify-center p-6 sm:p-10">
            <BrandLogo surface="surface" className="w-full max-w-sm" />
          </div>
          <div className="flex flex-col items-start gap-2 border-t border-rim p-4 sm:px-6">
            <StatusPill open={status.open} label={status.label} />
            <p className="font-mono text-xs text-ink-dim">{SHOP.address1} · {SHOP.address2}</p>
          </div>
          <div className="barber-band h-2" aria-hidden="true" />
        </div>
      </div>
    </section>
  )
}

// ─── Value metrics (4-card highlight panel) ──────────────────────────────────

function MetricsGrid() {
  return (
    <section aria-label="Shop highlights" className={`${CONTAINER} pt-px`}>
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-b-2xl border border-t-0 border-rim bg-rim lg:grid-cols-4">
        {METRICS.map(({ id, title, detail, Icon }) => (
          <li key={id} className="flex flex-col gap-2 bg-surface p-4 sm:p-6">
            <Icon className="h-6 w-6 text-gold" />
            <h3 className="font-display text-xl font-bold uppercase leading-tight text-ink sm:text-2xl">{title}</h3>
            <p className="text-sm text-ink-dim">{detail}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ─── Promo banner ────────────────────────────────────────────────────────────

function PromoBanner() {
  return (
    <section aria-label="Announcement" className="mt-8 bg-amber text-on-amber sm:mt-12">
      <div className={`${CONTAINER} flex flex-col items-start justify-between gap-4 py-6 sm:flex-row sm:items-center`}>
        <p className="font-display text-2xl font-extrabold uppercase leading-tight sm:text-3xl">
          Now booking men&apos;s facials with Alexis
        </p>
        <span className="-rotate-2 bg-panel px-4 py-2 font-display text-xl font-bold italic text-panel-ink">
          Clean cut, clean face!
        </span>
      </div>
    </section>
  )
}

// ─── Services menu ───────────────────────────────────────────────────────────

function ServicesSection({ onBook }: { onBook: () => void }) {
  return (
    <section id="services" className={`${CONTAINER} py-12 sm:py-16`}>
      <SectionHeading eyebrow="The Menu">
        Services <span className="text-gradient">&amp; Pricing</span>
      </SectionHeading>
      <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-rim bg-rim lg:grid-cols-5">
        {SERVICES.map(service => (
          <li key={service.id} className="bg-surface">
            <button
              type="button"
              onClick={onBook}
              className="group flex h-full min-h-32 w-full flex-col items-start gap-2 p-4 text-left transition-colors hover:bg-accent-dim sm:p-6"
            >
              <span className="min-h-5">
                {service.tag && (
                  <span className="rounded-full border border-gold/30 bg-gold-dim px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-wider text-gold">
                    {service.tag}
                  </span>
                )}
              </span>
              <span className="font-display text-xl font-bold uppercase leading-tight text-ink">{service.name}</span>
              <span className="mt-auto flex w-full items-end justify-between gap-2">
                <span className="font-mono text-xs text-ink-faint">{service.duration} min</span>
                <span className="font-display text-2xl font-extrabold text-gold">${service.price}</span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

// ─── Stylist roster ──────────────────────────────────────────────────────────

function StylistCard({ stylist, onBook }: { stylist: Stylist; onBook: (id: string) => void }) {
  const { name, initials, role, badge, specialty, bio, photo, photoPosition, bookingUrl } = stylist
  const ctaLabel = 'View Services & Book'

  return (
    <li className="flex flex-col overflow-hidden rounded-2xl border border-rim bg-surface">
      <div className="relative aspect-[5/4] bg-bone sm:aspect-[4/5]">
        {photo ? (
          <img
            src={photo}
            alt={`${name}, ${role}`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: photoPosition }}
          />
        ) : (
          <div
            className="absolute inset-0 flex flex-col items-center justify-center gap-2 border-2 border-dashed border-rim-strong bg-subtle"
            role="img"
            aria-label={`${name} — photo coming soon`}
          >
            <span className="font-display text-7xl font-extrabold text-ink-faint">{initials}</span>
            <span className="font-mono text-xs font-semibold uppercase tracking-widest text-ink-faint">
              Photo coming soon
            </span>
          </div>
        )}
        <span className="absolute left-4 top-4 rounded-lg bg-amber px-3 py-1 font-mono text-xs font-bold uppercase tracking-wide text-on-amber shadow-md">
          {badge}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4 p-4 sm:p-6">
        <div>
          <h3 className="font-display text-3xl font-extrabold uppercase leading-none text-ink">{name}</h3>
          <p className="mt-1 font-mono text-xs uppercase tracking-wider text-ink-faint">{role}</p>
        </div>
        <p className="text-sm font-semibold text-gold">{specialty}</p>
        <p className="text-sm leading-relaxed text-ink-dim">{bio}</p>

        {bookingUrl ? (
          <a
            href={bookingUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`${BTN_PRIMARY} mt-auto w-full`}
          >
            {ctaLabel}
            <IconArrowUpRight className="h-5 w-5" />
            <span className="sr-only">(opens in a new tab)</span>
          </a>
        ) : (
          <button type="button" onClick={() => onBook(stylist.id)} className={`${BTN_PRIMARY} mt-auto w-full`}>
            {ctaLabel}
            <IconArrowRight className="h-5 w-5" />
          </button>
        )}
      </div>
    </li>
  )
}

function TeamSection({ onBook }: { onBook: (id: string) => void }) {
  return (
    <section id="team" className="border-y border-rim bg-subtle py-12 sm:py-16">
      <div className={CONTAINER}>
        <SectionHeading eyebrow="The Crew">
          Our <span className="text-gradient">Stylists</span>
        </SectionHeading>
        <ul className="grid gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {STYLISTS.map(stylist => (
            <StylistCard key={stylist.id} stylist={stylist} onBook={onBook} />
          ))}
        </ul>
      </div>
    </section>
  )
}

// ─── What's new (flyer) ──────────────────────────────────────────────────────

function NewAtShopSection({ onBook }: { onBook: () => void }) {
  return (
    <section id="new" className={`${CONTAINER} py-12 sm:py-16`}>
      <SectionHeading eyebrow="At the Shop">
        Fresh <span className="text-gradient">at the shop</span>
      </SectionHeading>

      <div className="grid items-start gap-6 md:grid-cols-2 md:gap-8">
        <div className="mx-auto w-full max-w-sm overflow-hidden rounded-2xl border border-rim md:max-w-none">
          <CroppedImage
            src={FLYER_SRC}
            alt="Elevated Cuts flyer: Laura is now available for appointments and men's facials are offered with licensed esthetician Alexis."
            srcWidth={1640}
            srcHeight={2059}
            crop={{ x: 0.1005, y: 0.1953, w: 0.7304, h: 0.7549 }}
            className="w-full"
          />
        </div>

        <div className="flex flex-col gap-6">
          <ul className="grid gap-px overflow-hidden rounded-2xl border border-rim bg-rim">
            {PROMOS.map(({ id, title, detail, Icon }) => (
              <li key={id} className="flex items-start gap-4 bg-surface p-4 sm:p-6">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gold-dim text-gold">
                  <Icon className="h-6 w-6" />
                </span>
                <div>
                  <h3 className="font-display text-2xl font-bold uppercase leading-tight text-ink">{title}</h3>
                  <p className="mt-1 text-sm leading-relaxed text-ink-dim">{detail}</p>
                </div>
              </li>
            ))}
          </ul>
          <div className="flex flex-col gap-4 sm:flex-row">
            <button type="button" onClick={onBook} className={BTN_PRIMARY}>Book an Appointment</button>
            <a href={SHOP.phoneHref} className={BTN_GHOST}>
              <IconPhone className="h-5 w-5" />
              Call the Shop
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Visit (storefront, hours, contact) ──────────────────────────────────────

function VisitSection() {
  const status = useOpenStatus()
  return (
    <section id="visit" className="border-t border-rim bg-subtle py-12 sm:py-16">
      <div className={CONTAINER}>
        <SectionHeading eyebrow="Find Us">
          Visit the <span className="text-gradient">Shop</span>
        </SectionHeading>

        <div className="grid gap-6 md:grid-cols-2 md:gap-8">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl border border-rim bg-bone md:aspect-auto md:min-h-[520px]">
            <img
              src={STOREFRONT_SRC}
              alt="Elevated Cuts storefront on Slide Rd with the lit sign, green awning and walk-ins welcome chalkboard."
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover object-top"
            />
          </div>

          <div className="flex flex-col gap-4 sm:gap-6">
            <div className="rounded-2xl border border-rim bg-surface">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-rim p-4 sm:px-6">
                <h3 className="font-display text-2xl font-bold uppercase text-ink">Hours</h3>
                <StatusPill open={status.open} label={status.label} />
              </div>
              <ul className="p-2 sm:px-4">
                {HOURS.map((h, i) => {
                  const isToday = i === status.dayIdx
                  return (
                    <li
                      key={h.day}
                      className={`flex min-h-10 items-center justify-between rounded-lg px-2 text-sm sm:px-4 ${
                        isToday ? 'bg-accent-dim font-semibold text-ink' : 'text-ink-dim'
                      }`}
                    >
                      <span>
                        {h.day}
                        {isToday && <span className="ml-2 font-mono text-[10px] uppercase text-accent">Today</span>}
                      </span>
                      <span className="font-mono text-xs">
                        {h.range ? `${formatMinutes(h.range[0])} – ${formatMinutes(h.range[1])}` : 'Closed'}
                      </span>
                    </li>
                  )
                })}
              </ul>
            </div>

            <div className="overflow-hidden rounded-2xl border border-rim bg-surface">
              <a
                href={SHOP.mapsHref}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-14 items-center gap-4 border-b border-rim px-4 py-2 text-ink transition-colors hover:bg-accent-dim sm:px-6"
              >
                <IconPin className="h-5 w-5 shrink-0 text-gold" />
                <span className="text-sm">
                  {SHOP.address1}, {SHOP.address2}
                  <span className="sr-only"> (opens directions in a new tab)</span>
                </span>
              </a>
              <a
                href={SHOP.phoneHref}
                className="flex min-h-14 items-center gap-4 border-b border-rim px-4 py-2 text-ink transition-colors hover:bg-accent-dim sm:px-6"
              >
                <IconPhone className="h-5 w-5 shrink-0 text-gold" />
                <span className="text-sm">{SHOP.phoneDisplay}</span>
              </a>
              <a
                href={`mailto:${SHOP.email}`}
                className="flex min-h-14 items-center gap-4 px-4 py-2 text-ink transition-colors hover:bg-accent-dim sm:px-6"
              >
                <IconMail className="h-5 w-5 shrink-0 text-gold" />
                <span className="break-all text-sm">{SHOP.email}</span>
              </a>
            </div>

            <div className="rounded-2xl border border-rim bg-surface p-4 sm:p-6">
              <p className="mb-2 font-mono text-[10px] font-semibold uppercase tracking-widest text-ink-faint">
                We accept
              </p>
              <ul className="flex flex-wrap gap-2">
                {PAYMENT_METHODS.map(m => (
                  <li key={m} className="rounded-lg border border-rim bg-bone px-3 py-1 font-mono text-xs text-ink-dim">
                    {m}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer + mobile action bar ──────────────────────────────────────────────

function SiteFooter() {
  return (
    <footer className="border-t border-rim bg-canvas pb-28 pt-10 md:pb-10">
      <div className={`${CONTAINER} flex flex-col gap-8`}>
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <BrandLogo className="w-[148px]" />
          <nav aria-label="Footer" className="flex flex-wrap gap-x-2">
            {NAV_LINKS.map(link => (
              <a
                key={link.href}
                href={link.href}
                className="inline-flex min-h-12 items-center px-2 font-display text-lg font-semibold uppercase tracking-wider text-ink-dim hover:text-ink"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <p className="border-t border-rim pt-6 font-mono text-xs text-ink-faint">
          © {new Date().getFullYear()} Elevated Cuts · {SHOP.address1} · Lubbock, TX
        </p>
      </div>
    </footer>
  )
}

function MobileActionBar({ onBook }: { onBook: () => void }) {
  return (
    <div className="fixed inset-x-0 bottom-0 z-30 border-t border-rim bg-canvas/95 p-2 pb-[max(8px,env(safe-area-inset-bottom))] backdrop-blur-xl md:hidden">
      <div className="mx-auto grid max-w-md grid-cols-2 gap-2">
        <a href={SHOP.phoneHref} className={BTN_GHOST}>
          <IconPhone className="h-5 w-5" />
          Call
        </a>
        <button type="button" onClick={onBook} className={BTN_PRIMARY}>Book Now</button>
      </div>
    </div>
  )
}

// ─── Page root ───────────────────────────────────────────────────────────────

interface LandingPageProps {
  dark: boolean
  onToggleDark: () => void
  onBook: (stylistId?: string) => void
}

export default function LandingPage({ dark, onToggleDark, onBook }: LandingPageProps) {
  return (
    <div id="top">
      <SiteHeader dark={dark} onToggleDark={onToggleDark} onBook={() => onBook()} />
      <main>
        <TaglineStrip />
        <HeroSection onBook={() => onBook()} />
        <MetricsGrid />
        <PromoBanner />
        <ServicesSection onBook={() => onBook()} />
        <TeamSection onBook={onBook} />
        <NewAtShopSection onBook={() => onBook()} />
        <VisitSection />
      </main>
      <SiteFooter />
      <MobileActionBar onBook={() => onBook()} />
    </div>
  )
}
