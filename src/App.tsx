import { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import BookingFlow from './pages/BookingFlow'

export type PageView = 'landing' | 'booking'

export default function App() {
  const [page, setPage]   = useState<PageView>('landing')
  const [dark, setDark]   = useState(true)

  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark)
  }, [dark])

  const toggleDark = () => setDark(d => !d)

  return (
    <div className="min-h-screen bg-canvas text-ink font-sans">
      {page === 'landing' ? (
        <LandingPage
          dark={dark}
          onToggleDark={toggleDark}
          onBook={() => setPage('booking')}
        />
      ) : (
        <BookingFlow
          dark={dark}
          onToggleDark={toggleDark}
          onBack={() => setPage('landing')}
        />
      )}
    </div>
  )
}
