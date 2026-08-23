import { useState, useEffect } from 'react'

// ─── Data contracts (App 2 + App 3 API shapes) ──────────────────────────────

interface Service {
  id: number; name: string; duration: number; price: number; tag?: string
}
interface Stylist {
  id: number; name: string; role: string; years: number; initials: string
  color: string; next: string; available: boolean; services: string[]
}
interface ShopEvent {
  date: string; day: string; title: string; description: string; cta: string
}

// ─── Seed data (replaces CMS/scheduling API payloads) ───────────────────────

const SERVICES: Service[] = [
  { id: 1,  name: 'Classic Haircut',  duration: 30, price: 25 },
  { id: 2,  name: 'Skin Fade',        duration: 45, price: 30, tag: 'POPULAR' },
  { id: 3,  name: 'Beard Trim',       duration: 20, price: 15 },
  { id: 4,  name: 'Cut + Beard',      duration: 60, price: 40, tag: 'BEST VALUE' },
  { id: 5,  name: "Men's Facial",     duration: 45, price: 55, tag: 'NEW' },
  { id: 6,  name: 'Shampoo & Style',  duration: 30, price: 20 },
  { id: 7,  name: "Kids' Cut",        duration: 25, price: 20 },
  { id: 8,  name: 'Buzz Cut',         duration: 15, price: 18 },
  { id: 9,  name: 'Eyebrow Trim',     duration: 15, price: 12 },
  { id: 10, name: 'Groom Package',    duration: 90, price: 65, tag: 'DEAL' },
]

const TEAM: Stylist[] = [
  { id: 1, name: 'Evelyn Rodriguez', role: 'Owner · Operator',      years: 18, initials: 'ER', color: '#1A63EE', next: 'Today · 10:00 AM', available: true,  services: ["Men's Cuts", 'Fades', 'Beard'] },
  { id: 2, name: 'Angela',           role: 'Senior Stylist',         years: 29, initials: 'AN', color: '#D9920E', next: 'Today · 11:30 AM', available: true,  services: ["Men's Cuts", 'Kids', 'Shampoo'] },
  { id: 3, name: 'Melinda',          role: 'Shop Veteran',           years: 35, initials: 'ME', color: '#7C3AED', next: 'Today · 2:00 PM',  available: true,  services: ["Men's Cuts", 'Buzz Cut', 'Fades'] },
  { id: 4, name: 'Alexis',           role: 'Licensed Esthetician',   years: 8,  initials: 'AL', color: '#EC4899', next: 'Tomorrow · 9:30 AM', available: false, services: ["Men's Facial", 'Skin Care', 'Eyebrow'] },
  { id: 5, name: 'Laura',            role: 'Stylist · Sat Only',     years: 5,  initials: 'LA', color: '#0D9488', next: 'Sat · 10:00 AM',  available: false, services: ['Haircuts', 'Beard Trim', 'Wax'] },
  { id: 6, name: 'Princess',         role: 'Senior Stylist',         years: 20, initials: 'PR', color: '#EA580C', next: 'Today · 1:00 PM',  available: true,  services: ['Fades', "Men's Cuts", 'Beard'] },
]

const EVENTS: ShopEvent[] = [
  { date: 'Sep 6',  day: 'SAT', title: 'Back-to-School Cut Day',       description: "Kids cuts $15 all day. Walk-ins welcome. Bring the whole crew in.",            cta: 'RSVP Free'   },
  { date: 'Sep 14', day: 'SUN', title: 'Community Appreciation Day',   description: 'Veterans and first responders receive 20% off all services. No appointment needed.', cta: 'Learn More'  },
  { date: 'Oct 1',  day: 'THU', title: "2nd Anniversary Celebration",  description: 'Free drinks, giveaways, and live cutting demonstrations at the shop on Slide Rd.', cta: 'Reserve Seat' },
]

const GALLERY = [
  { id: 1, url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&h=720&fit=crop&auto=format', alt: 'Client in leather barber chair', span: 'row-span-2' },
  { id: 2, url: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?w=600&h=480&fit=crop&auto=format', alt: 'Barber styling with blow dryer' },
  { id: 3, url: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&h=480&fit=crop&auto=format', alt: 'Straight razor beard shave' },
  { id: 4, url: 'https://images.unsplash.com/photo-1647140655214-e4a2d914971f?w=600&h=480&fit=crop&auto=format', alt: 'Precision scissors cut' },
  { id: 5, url: 'https://images.unsplash.com/photo-1576168056582-0a851a87ab8e?w=600&h=380&fit=crop&auto=format', alt: 'Premium leather barber chairs' },
]

// ─── Icon atoms ──────────────────────────────────────────────────────────────

const IconScissors = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/><line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
)

const IconSun = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
)

const IconMoon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
)

const IconPin = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
)

const IconPhone = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.63 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.6a16 16 0 0 0 6 6l.94-.94a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
  </svg>
)

const IconClock = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)

const IconStar = ({ filled = true }: { filled?: boolean }) => (
  <svg viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
)

const IconCheck = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)

const IconChevronRight = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)

const IconMail = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
    <polyline points="22,6 12,13 2,6"/>
  </svg>
)

// ─── Skeleton atoms ──────────────────────────────────────────────────────────

const SkeletonLine = ({ w = 'w-full', h = 'h-4' }: { w?: string; h?: string }) => (
  <div className={`shimmer ${w} ${h}`} />
)

const SkeletonServiceCard = () => (
  <div className="flex items-center justify-between py-4 border-b border-rim gap-4">
    <div className="flex flex-col gap-2 flex-1">
      <SkeletonLine w="w-2/3" h="h-4" />
      <SkeletonLine w="w-1/3" h="h-3" />
    </div>
    <SkeletonLine w="w-16" h="h-5" />
  </div>
)

const SkeletonStaffCard = () => (
  <div className="flex-shrink-0 w-[160px] bg-surface rounded-2xl p-4 flex flex-col items-center gap-3">
    <div className="shimmer w-16 h-16 rounded-full" />
    <div className="w-full flex flex-col items-center gap-2">
      <SkeletonLine w="w-20" h="h-4" />
      <SkeletonLine w="w-24" h="h-3" />
    </div>
    <div className="shimmer w-full h-8 rounded-full" />
  </div>
)

const SkeletonEventCard = () => (
  <div className="bg-surface rounded-2xl p-5 flex flex-col gap-3">
    <div className="flex gap-3 items-center">
      <div className="shimmer w-14 h-14 rounded-xl" />
      <div className="flex flex-col gap-2 flex-1">
        <SkeletonLine w="w-3/4" h="h-4" />
        <SkeletonLine w="w-1/2" h="h-3" />
      </div>
    </div>
    <SkeletonLine w="w-full" h="h-3" />
    <SkeletonLine w="w-5/6" h="h-3" />
    <div className="shimmer w-28 h-9 rounded-full" />
  </div>
)

// ─── Header ──────────────────────────────────────────────────────────────────

interface HeaderProps {
  dark: boolean; onToggleDark: () => void; onBook: () => void; scrolled: boolean
}

function SiteHeader({ dark, onToggleDark, onBook, scrolled }: HeaderProps) {
  return (
    <header
      className={`sticky top-0 z-50 flex items-center justify-between px-4 sm:px-6 h-16 transition-all duration-300 ${
        scrolled
          ? 'bg-surface/90 backdrop-blur-xl border-b border-rim shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}
    >
      {/* Logo group */}
      <div className="flex items-center gap-3 min-w-0">
        <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center text-white flex-shrink-0">
          <IconScissors />
        </div>
        <div className="flex flex-col leading-none">
          <span className="font-display font-black text-xl tracking-tight text-ink">ELEVATED CUTS</span>
          <span className="flex items-center gap-1 text-[10px] font-mono text-ink-faint mt-0.5">
            <IconPin /> LUBBOCK, TX
          </span>
        </div>
      </div>

      {/* Desktop nav */}
      <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-ink-dim">
        <a href="#services" className="hover:text-ink transition-colors">Services</a>
        <a href="#team"     className="hover:text-ink transition-colors">Our Stylists</a>
        <a href="#gallery"  className="hover:text-ink transition-colors">The Shop</a>
        <a href="#info"     className="hover:text-ink transition-colors">Find Us</a>
      </nav>

      {/* Actions */}
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleDark}
          className="w-10 h-10 rounded-full border border-rim flex items-center justify-center text-ink-dim hover:text-ink hover:border-rim-strong transition-all"
          aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <IconSun /> : <IconMoon />}
        </button>
        <button
          onClick={onBook}
          className="h-10 bg-accent text-white font-semibold text-sm px-5 rounded-xl hover:opacity-90 active:scale-[0.97] transition-all"
        >
          Book Now
        </button>
      </div>
    </header>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────

function HeroSection({ onBook }: { onBook: () => void }) {
  return (
    <section className="relative min-h-[100svh] flex flex-col justify-end overflow-hidden">
      {/* Backdrop image */}
      <img
        src="https://images.unsplash.com/photo-1604349779630-1a87d7c571cb?w=1400&h=900&fit=crop&auto=format"
        alt="Elevated Cuts barbershop interior"
        className="absolute inset-0 w-full h-full object-cover"
      />
      {/* Gradient overlay — always dark for cinematic effect */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#080910] via-[#080910]/75 to-[#080910]/20" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#080910]/60 to-transparent" />

      {/* Open status pill — top-right */}
      <div className="absolute top-20 right-4 flex items-center gap-2 bg-live-dim border border-live/30 rounded-full px-3 py-1.5">
        <span className="live-pulse w-2 h-2 bg-live rounded-full block" />
        <span className="text-live text-[11px] font-mono font-semibold tracking-wide">OPEN NOW</span>
      </div>

      {/* Hero content */}
      <div className="relative z-10 px-5 sm:px-8 pb-16 max-w-2xl fade-up">
        <p className="text-[11px] font-mono font-medium text-accent uppercase tracking-[0.2em] mb-4">
          Lubbock&apos;s Premier Barber Shop · Est. 2024
        </p>

        <h1 className="font-display font-black leading-none text-white mb-6" style={{ fontSize: 'clamp(3.5rem, 14vw, 7rem)' }}>
          SHARPEN<br />YOUR LOOK
        </h1>

        <p className="text-white/70 text-base sm:text-lg font-light leading-relaxed mb-8 max-w-sm">
          Precision cuts, expert fades, and real craft at 1018 Slide Rd. Walk-ins always welcome.
        </p>

        {/* Rating row */}
        <div className="flex items-center gap-3 mb-8">
          <div className="flex gap-0.5 text-gold">
            {[1,2,3,4,5].map(i => <IconStar key={i} />)}
          </div>
          <span className="text-white/60 text-sm font-mono">4.8 · 120 reviews</span>
        </div>

        {/* CTA row — 48px min touch targets */}
        <div className="flex gap-3 flex-wrap">
          <button
            onClick={onBook}
            className="min-h-[48px] flex-1 sm:flex-none sm:min-w-[180px] bg-accent text-white font-semibold text-base rounded-xl px-6 hover:opacity-90 active:scale-[0.98] transition-all"
          >
            Book Appointment
          </button>
          <a
            href="#services"
            className="min-h-[48px] flex items-center justify-center border border-white/30 text-white font-medium rounded-xl px-6 hover:bg-white/10 transition-all"
          >
            View Services
          </a>
        </div>
      </div>

      {/* Address badge — bottom-right */}
      <div className="absolute bottom-5 right-4 text-right hidden sm:block">
        <p className="text-white/40 text-xs font-mono">1018 Slide Rd · Lubbock, TX 79416</p>
        <p className="text-white/40 text-xs font-mono">(806) 407-3129</p>
      </div>
    </section>
  )
}

// ─── Services Section ─────────────────────────────────────────────────────────

function ServicesSection({ loaded }: { loaded: boolean }) {
  return (
    <section id="services" className="py-16 px-5 sm:px-8 max-w-2xl mx-auto">
      {/* Section header */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <p className="text-[11px] font-mono font-medium text-accent uppercase tracking-[0.18em] mb-2">
            App 3 · CMS Menu Feed
          </p>
          <h2 className="font-display font-black text-5xl text-ink leading-none">THE MENU</h2>
        </div>
        <span className="text-ink-faint text-sm font-mono hidden sm:block">Prices from</span>
      </div>

      {/* Service list */}
      <div className="divide-y divide-rim">
        {!loaded
          ? Array.from({ length: 6 }, (_, i) => <SkeletonServiceCard key={i} />)
          : SERVICES.map(s => (
            <div key={s.id} className="group flex items-center justify-between py-4 gap-4 hover:bg-subtle/50 -mx-2 px-2 rounded-lg transition-colors cursor-pointer fade-up">
              <div className="flex flex-col gap-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-semibold text-ink truncate">{s.name}</span>
                  {s.tag && (
                    <span className="text-[9px] font-mono font-bold tracking-wider bg-gold-dim text-gold rounded-full px-2 py-0.5 border border-gold/20">
                      {s.tag}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-ink-faint text-xs font-mono">
                  <IconClock /> {s.duration} min
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-mono font-semibold text-lg text-gold">${s.price}</span>
                <div className="w-7 h-7 rounded-full border border-rim flex items-center justify-center text-ink-faint group-hover:border-accent group-hover:text-accent transition-all">
                  <IconChevronRight />
                </div>
              </div>
            </div>
          ))}
      </div>

      {/* Book CTA strip */}
      {loaded && (
        <div className="mt-10 bg-accent-dim border border-accent/20 rounded-2xl p-5 flex items-center justify-between gap-4 fade-up">
          <div>
            <p className="font-semibold text-ink text-sm">Walk-ins welcome</p>
            <p className="text-ink-dim text-xs mt-0.5">Or reserve your seat online — takes under 60 seconds.</p>
          </div>
          <a href="#team" className="flex-shrink-0 bg-accent text-white font-semibold text-sm px-4 py-2.5 rounded-xl hover:opacity-90 transition-opacity whitespace-nowrap">
            Pick a Stylist
          </a>
        </div>
      )}
    </section>
  )
}

// ─── Team Section ─────────────────────────────────────────────────────────────

function TeamSection({ loaded, onBook }: { loaded: boolean; onBook: () => void }) {
  return (
    <section id="team" className="py-16 bg-subtle">
      <div className="px-5 sm:px-8 max-w-2xl mx-auto mb-8">
        <p className="text-[11px] font-mono font-medium text-accent uppercase tracking-[0.18em] mb-2">
          App 2 · Live Scheduling Feed
        </p>
        <h2 className="font-display font-black text-5xl text-ink leading-none">YOUR STYLISTS</h2>
        <p className="text-ink-dim text-sm mt-2">Real-time availability pulled from the scheduling engine.</p>
      </div>

      {/* Horizontal scroll row */}
      <div className="flex gap-4 overflow-x-auto hide-scrollbar px-5 sm:px-8 pb-4">
        {!loaded
          ? Array.from({ length: 4 }, (_, i) => <SkeletonStaffCard key={i} />)
          : TEAM.map(s => (
            <div
              key={s.id}
              className="flex-shrink-0 w-[168px] bg-surface rounded-2xl p-4 flex flex-col items-center gap-3 border border-rim hover:border-rim-strong hover:-translate-y-1 transition-all duration-200 cursor-pointer fade-up"
              onClick={onBook}
            >
              {/* Avatar */}
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center text-white font-display font-black text-xl flex-shrink-0"
                style={{ backgroundColor: s.color }}
              >
                {s.initials}
              </div>

              {/* Info */}
              <div className="text-center w-full">
                <p className="font-semibold text-ink text-sm leading-tight">{s.name}</p>
                <p className="text-ink-faint text-[11px] mt-0.5 leading-tight">{s.role}</p>
                <p className="text-ink-faint text-[10px] font-mono mt-1">{s.years} yrs exp.</p>
              </div>

              {/* Services chips */}
              <div className="flex flex-wrap gap-1 justify-center">
                {s.services.slice(0, 2).map(sv => (
                  <span key={sv} className="text-[9px] font-mono bg-bone text-ink-faint rounded-full px-1.5 py-0.5">{sv}</span>
                ))}
              </div>

              {/* Availability status */}
              <div className={`w-full rounded-xl px-2 py-2 text-center ${s.available ? 'bg-live-dim border border-live/20' : 'bg-bone border border-rim'}`}>
                {s.available && (
                  <p className="text-live text-[9px] font-mono font-semibold uppercase tracking-wider mb-0.5">Next Available</p>
                )}
                <p className={`text-[10px] font-mono font-medium leading-tight ${s.available ? 'text-ink' : 'text-ink-faint'}`}>
                  {s.next}
                </p>
              </div>
            </div>
          ))}
      </div>

      {/* Book CTA */}
      {loaded && (
        <div className="px-5 sm:px-8 max-w-2xl mx-auto mt-6 fade-up">
          <button
            onClick={onBook}
            className="w-full min-h-[52px] bg-ink text-canvas font-semibold text-base rounded-xl hover:opacity-90 active:scale-[0.99] transition-all"
          >
            Book Your Appointment
          </button>
        </div>
      )}
    </section>
  )
}

// ─── Gallery + Events ─────────────────────────────────────────────────────────

function GallerySection() {
  return (
    <section id="gallery" className="py-16">
      <div className="px-5 sm:px-8 max-w-2xl mx-auto mb-8">
        <p className="text-[11px] font-mono font-medium text-gold uppercase tracking-[0.18em] mb-2">
          App 3 · CMS Lifestyle Feed
        </p>
        <h2 className="font-display font-black text-5xl text-ink leading-none">THE SHOP</h2>
      </div>

      {/* Mosaic grid */}
      <div className="px-5 sm:px-8 max-w-2xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 auto-rows-[180px]">
          {GALLERY.map((img, i) => (
            <div
              key={img.id}
              className={`relative overflow-hidden rounded-2xl bg-bone ${i === 0 ? 'row-span-2' : ''}`}
            >
              <img
                src={img.url}
                alt={img.alt}
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Events ───────────────────────────────────────────────────────────────────

function EventsSection({ loaded }: { loaded: boolean }) {
  return (
    <section className="py-16 bg-subtle">
      <div className="px-5 sm:px-8 max-w-2xl mx-auto">
        <div className="mb-8">
          <p className="text-[11px] font-mono font-medium text-gold uppercase tracking-[0.18em] mb-2">
            App 3 · CMS Events Feed
          </p>
          <h2 className="font-display font-black text-5xl text-ink leading-none">WHAT&apos;S GOOD</h2>
        </div>

        <div className="flex flex-col gap-4">
          {!loaded
            ? Array.from({ length: 2 }, (_, i) => <SkeletonEventCard key={i} />)
            : EVENTS.map(ev => (
              <div key={ev.title} className="bg-surface rounded-2xl p-5 border border-rim fade-up">
                <div className="flex gap-4 items-start mb-3">
                  {/* Date block */}
                  <div className="flex-shrink-0 w-14 h-14 bg-gold-dim border border-gold/20 rounded-xl flex flex-col items-center justify-center">
                    <span className="text-[9px] font-mono font-bold text-gold uppercase">{ev.day}</span>
                    <span className="font-display font-black text-lg text-gold leading-tight">{ev.date.split(' ')[1]}</span>
                    <span className="text-[9px] font-mono text-gold/70">{ev.date.split(' ')[0]}</span>
                  </div>
                  {/* Title + desc */}
                  <div className="min-w-0">
                    <p className="font-semibold text-ink leading-snug">{ev.title}</p>
                    <p className="text-ink-dim text-sm mt-1 leading-relaxed">{ev.description}</p>
                  </div>
                </div>
                <button className="mt-1 min-h-[40px] px-5 border border-accent/30 text-accent text-sm font-semibold rounded-full hover:bg-accent-dim transition-colors">
                  {ev.cta}
                </button>
              </div>
            ))}
        </div>
      </div>
    </section>
  )
}

// ─── Info / Hours ─────────────────────────────────────────────────────────────

const HOURS = [
  { day: 'Monday',    open: '9:00 AM', close: '6:00 PM' },
  { day: 'Tuesday',   open: '9:00 AM', close: '6:00 PM' },
  { day: 'Wednesday', open: '9:00 AM', close: '6:00 PM' },
  { day: 'Thursday',  open: '9:00 AM', close: '6:00 PM' },
  { day: 'Friday',    open: '9:00 AM', close: '6:00 PM' },
  { day: 'Saturday',  open: '9:00 AM', close: '2:00 PM' },
  { day: 'Sunday',    open: null,       close: null       },
]

const TODAY_IDX = new Date().getDay() // 0=Sun
const REORDERED_HOURS = [...HOURS.slice(1), HOURS[0]] // Mon-Sun display

function InfoSection() {
  return (
    <section id="info" className="py-16 px-5 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <h2 className="font-display font-black text-5xl text-ink leading-none mb-10">FIND US</h2>

        <div className="grid sm:grid-cols-2 gap-6">
          {/* Contact card */}
          <div className="bg-surface border border-rim rounded-2xl p-6 flex flex-col gap-4">
            <h3 className="font-display font-bold text-2xl text-ink">Elevated Cuts</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex items-start gap-3 text-ink-dim">
                <IconPin />
                <div>
                  <p>1018 Slide Rd</p>
                  <p>Lubbock, TX 79416</p>
                </div>
              </div>
              <a href="tel:8064073129" className="flex items-center gap-3 text-ink-dim hover:text-accent transition-colors">
                <IconPhone /> (806) 407-3129
              </a>
              <a href="mailto:elevatedcuts2024@gmail.com" className="flex items-center gap-3 text-ink-dim hover:text-accent transition-colors">
                <IconMail /> elevatedcuts2024@gmail.com
              </a>
            </div>

            {/* Payment methods */}
            <div className="pt-3 border-t border-rim">
              <p className="text-[10px] font-mono text-ink-faint uppercase tracking-wider mb-2">We Accept</p>
              <div className="flex flex-wrap gap-1.5">
                {['Apple Pay', 'Google Pay', 'CashApp', 'Visa', 'MC', 'Amex'].map(m => (
                  <span key={m} className="text-[10px] font-mono bg-bone text-ink-faint rounded-md px-2 py-1 border border-rim">
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Hours card */}
          <div className="bg-surface border border-rim rounded-2xl p-6">
            <h3 className="font-display font-bold text-2xl text-ink mb-4">Hours</h3>
            <div className="flex flex-col gap-2">
              {REORDERED_HOURS.map((h, i) => {
                const isToday = ((i + 1) % 7) === TODAY_IDX
                return (
                  <div
                    key={h.day}
                    className={`flex items-center justify-between text-sm py-1.5 px-2 rounded-lg -mx-2 ${isToday ? 'bg-accent-dim' : ''}`}
                  >
                    <span className={`font-medium ${isToday ? 'text-accent' : 'text-ink-dim'}`}>
                      {h.day} {isToday && <span className="text-[9px] font-mono ml-1 text-accent/70">TODAY</span>}
                    </span>
                    <span className={`font-mono text-xs ${h.open ? (isToday ? 'text-ink' : 'text-ink-dim') : 'text-dead'}`}>
                      {h.open ? `${h.open} – ${h.close}` : 'Closed'}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────

function SiteFooter() {
  return (
    <footer className="bg-subtle border-t border-rim py-10 px-5 sm:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center text-white">
              <IconScissors />
            </div>
            <div>
              <p className="font-display font-black text-lg text-ink">ELEVATED CUTS</p>
              <p className="text-[10px] font-mono text-ink-faint">LUBBOCK, TX · EST. 2024</p>
            </div>
          </div>

          <div className="flex gap-4 text-sm font-medium text-ink-dim">
            <a href="#services" className="hover:text-ink transition-colors">Services</a>
            <a href="#team"     className="hover:text-ink transition-colors">Stylists</a>
            <a href="#info"     className="hover:text-ink transition-colors">Hours</a>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-6 border-t border-rim">
          <p className="text-xs text-ink-faint font-mono">© 2026 Elevated Cuts · 1018 Slide Rd · Lubbock TX</p>
          <p className="text-xs text-ink-faint">
            <span className="font-mono">Avg wait · </span>
            <span className="text-live font-mono font-medium">~12 min today</span>
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Page root ────────────────────────────────────────────────────────────────

interface LandingPageProps {
  dark: boolean; onToggleDark: () => void; onBook: () => void
}

export default function LandingPage({ dark, onToggleDark, onBook }: LandingPageProps) {
  const [scrolled,       setScrolled]       = useState(false)
  const [servicesLoaded, setServicesLoaded] = useState(false)
  const [teamLoaded,     setTeamLoaded]     = useState(false)
  const [eventsLoaded,   setEventsLoaded]   = useState(false)

  useEffect(() => {
    // Simulate asynchronous data hydration from App 2 + App 3
    const t1 = setTimeout(() => setServicesLoaded(true), 1100)
    const t2 = setTimeout(() => setTeamLoaded(true),     1700)
    const t3 = setTimeout(() => setEventsLoaded(true),   2300)

    const onScroll = () => setScrolled(window.scrollY > 48)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      clearTimeout(t1); clearTimeout(t2); clearTimeout(t3)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  return (
    <div>
      <SiteHeader dark={dark} onToggleDark={onToggleDark} onBook={onBook} scrolled={scrolled} />
      <main>
        <HeroSection onBook={onBook} />
        <ServicesSection loaded={servicesLoaded} />
        <TeamSection     loaded={teamLoaded}     onBook={onBook} />
        <GallerySection />
        <EventsSection   loaded={eventsLoaded} />
        <InfoSection />
      </main>
      <SiteFooter />
    </div>
  )
}
