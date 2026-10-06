import { useState, useLayoutEffect, useCallback } from 'react'
import LandingPage from './pages/LandingPage'
import BookingFlow from './pages/BookingFlow'

export type PageView = 'landing' | 'booking'

const THEME_KEY = 'elevated-cuts-theme'

function getInitialDark(): boolean {
  try {
    const saved = localStorage.getItem(THEME_KEY)
    if (saved) return saved === 'dark'
  } catch { /* storage unavailable */ }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export default function App() {
  const [page, setPage] = useState<PageView>('landing')
  const [dark, setDark] = useState(getInitialDark)
  const [presetStylist, setPresetStylist] = useState<string | undefined>()

  useLayoutEffect(() => {
    const root = document.documentElement
    root.classList.toggle('dark', dark)
    try { localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light') } catch { /* ignore */ }
  }, [dark])

  const toggleDark = useCallback(() => {
    const root = document.documentElement
    root.classList.add('theme-switching')
    setDark(d => !d)
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('theme-switching')))
  }, [])

  const openBooking = (stylistId?: string) => {
    setPresetStylist(stylistId)
    setPage('booking')
    window.scrollTo(0, 0)
  }

  const closeBooking = () => {
    setPage('landing')
    window.scrollTo(0, 0)
  }

  return (
    <div className="min-h-screen bg-canvas font-sans text-ink">
      {page === 'landing' ? (
        <LandingPage dark={dark} onToggleDark={toggleDark} onBook={openBooking} />
      ) : (
        <BookingFlow
          dark={dark}
          onToggleDark={toggleDark}
          onBack={closeBooking}
          initialStylistId={presetStylist}
        />
      )}
    </div>
  )
}
