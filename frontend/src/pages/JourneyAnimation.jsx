import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

export default function JourneyAnimation() {
  const navigate = useNavigate()

  useEffect(() => {
    const timer = setTimeout(() => navigate('/swipe'), 3500)
    return () => clearTimeout(timer)
  }, [navigate])

  return (
    <div className="journey-page">
      <h1>Let&apos;s start your journey</h1>
      <div className="journey-hearts">
        {/* REPLACE: swap these with your custom heart / logo animation */}
        <span className="journey-heart" role="img" aria-label="heart">&#x2764;&#xFE0F;</span>
        <span className="journey-heart" role="img" aria-label="heart">&#x2764;&#xFE0F;</span>
        <span className="journey-heart" role="img" aria-label="heart">&#x2764;&#xFE0F;</span>
      </div>
    </div>
  )
}
