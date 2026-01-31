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
  const [leftScreen, setLeftScreen] = useState([])
  const [matchPopup, setMatchPopup] = useState(null)

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
    }
  }

  // Send signal to Arduino LCD display
  async function sendToArduino(action) {
    try {
      const response = await fetch('http://localhost:5000/api/arduino', {
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
          <button className="btn btn-primary" onClick={() => { setGone([]); setLeftScreen([]) }}>
            Reset Cards
          </button>
        </div>
      ) : (
        <>
          <div className="card-stack">
            {profiles.map((profile, i) => {
              if (leftScreen.includes(profile.id)) return null
              return (
                <TinderCard
                  key={profile.id}
                  ref={(el) => (cardRefs.current[i] = el)}
                  onSwipe={(dir) => onSwipe(dir, profile)}
                  onCardLeftScreen={() => setLeftScreen((prev) => [...prev, profile.id])}
                  preventSwipe={['up', 'down']}
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
          <h1>It&apos;s a Match!</h1>
          <p>You matched with {matchPopup.name}!</p>
          <span style={{ fontSize: 64 }}>{matchPopup.emoji}</span>
        </div>
      )}
    </div>
  )
}
