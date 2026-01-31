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

  const profiles = useMemo(() => [...dummyProfiles].reverse(), [])
  const cardRefs = useRef([])

  function onSwipe(direction, profile) {
    setGone((prev) => [...prev, profile.id])

    if (direction === 'right') {
      setCurrentMatch(profile)
      setMatchPopup(profile)
      setTimeout(() => {
        setMatchPopup(null)
        navigate(`/chat/${profile.id}`)
      }, 2000)
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
            {profiles.map((profile, i) => (
              <TinderCard
                key={profile.id}
                ref={(el) => (cardRefs.current[i] = el)}
                onSwipe={(dir) => onSwipe(dir, profile)}
                preventSwipe={['up', 'down']}
              >
                <SwipeCard profile={profile} />
              </TinderCard>
            ))}
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
