import { useState, useRef, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import TinderCard from 'react-tinder-card'
import { ThumbsDown, ThumbsUp } from 'lucide-react'
import { useApp } from '../context/AppContext'
import { dummyProfiles } from '../data/dummyProfiles'
import SwipeCard from '../components/SwipeCard'

export default function SwipingPage() {
  const navigate = useNavigate()
  const { setCurrentMatch } = useApp()
  const [gone, setGone] = useState([])
  const [matchPopup, setMatchPopup] = useState(null)
  const [heartbreakPopup, setHeartbreakPopup] = useState(false)

  const profiles = useMemo(() => [...dummyProfiles].reverse(), [])
  const cardRefs = useRef([])

  function onSwipe(direction, profile) {
    setGone((prev) => [...prev, profile.id])

    if (direction === 'right') {
      // Send 'like' signal to Arduino
      sendToArduino('like')

      setCurrentMatch(profile)
      setMatchPopup(profile)
      setTimeout(() => {
        setMatchPopup(null)
        navigate(`/chat/${profile.id}`)
      }, 2000)
    } else if (direction === 'left') {
      // Send 'skip' signal to Arduino
      sendToArduino('skip')
      
      // Show heartbreak animation
      setHeartbreakPopup(true)
      setTimeout(() => {
        setHeartbreakPopup(false)
      }, 1000)
    }
  }

  // Send signal to Arduino LCD display
  async function sendToArduino(action) {
    try {
      const response = await fetch('/api/arduino', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      })
      const data = await response.json()
      console.log(`[Arduino] ${action}:`, data)

      // Log if Arduino is not connected (but don't block the UI)
      if (!data.hardware_connected) {
        console.warn('[Arduino] Hardware not connected. LCD display unavailable.')
      }
    } catch (error) {
      console.error('[Arduino] Failed to send signal:', error)
      // Don't block the UI - Arduino is optional
    }
  }

  function swipeManual(dir) {
    const remaining = profiles.filter((p) => !gone.includes(p.id))
    if (remaining.length === 0) return
    const topCard = remaining[remaining.length - 1]
    const idx = profiles.findIndex((p) => p.id === topCard.id)
    cardRefs.current[idx]?.swipe(dir)
  }

  const allGone = gone.length >= profiles.length

  return (
    <div className="swiping-page">
      <h2>Swipe right to match, left to pass</h2>

      {allGone ? (
        <div className="no-more-cards">
          <p>No more profiles right now. Check back later!</p>
          <button className="btn btn-primary" onClick={() => setGone([])}>
            Reset Cards
          </button>
        </div>
      ) : (
        <>
          <div className="card-stack">
            {profiles.map((profile, i) => {
              if (gone.includes(profile.id)) return null
              return (
                <TinderCard
                  key={profile.id}
                  ref={(el) => (cardRefs.current[i] = el)}
                  onSwipe={(dir) => onSwipe(dir, profile)}
                  preventSwipe={['up', 'down']}
                  swipeRequirementType="position"
                  swipeThreshold={100}
                >
                  <SwipeCard profile={profile} />
                </TinderCard>
              )
            })}
          </div>

          <div className="swipe-hint">
            <button className="btn-icon" onClick={() => swipeManual('left')} aria-label="Pass">
              <ThumbsDown size={22} />
            </button>
            <button
              className="btn-icon"
              onClick={() => swipeManual('right')}
              aria-label="Like"
              style={{ background: 'var(--color-primary-light)', color: 'var(--color-primary)' }}
            >
              <ThumbsUp size={22} />
            </button>
          </div>
        </>
      )}

      {matchPopup && (
        <div className="match-overlay">
          <img src="/logo.png" alt="OpenHeart" className="match-overlay__logo" />
          <div className="match-overlay__bubble">
            <img src="/match_text.png" alt="It's a Match!" className="match-overlay__title" />
            <p>You matched with {matchPopup.name}!</p>
          </div>
        </div>
      )}

      {heartbreakPopup && (
        <div className="heartbreak-overlay">
          <div className="heartbreak-overlay__container">
            <div className="heartbreak-overlay__half heartbreak-overlay__half--left">
              <svg viewBox="0 0 24 24" fill="#dd5358">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
            <div className="heartbreak-overlay__half heartbreak-overlay__half--right">
              <svg viewBox="0 0 24 24" fill="#dd5358">
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
