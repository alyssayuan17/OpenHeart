import { useEffect, useRef } from 'react'

export default function HeartCursorTrail() {
  const lastTimeRef = useRef(0)

  useEffect(() => {
    function createHeart(x, y) {
      const heart = document.createElement('div')
      heart.className = 'heart-trail'
      heart.innerHTML = '<svg viewBox="0 0 24 24" width="20" height="20" fill="#dd5358"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>'
      heart.style.left = x + 'px'
      heart.style.top = y + 'px'
      document.body.appendChild(heart)

      setTimeout(() => {
        heart.remove()
      }, 1000)
    }

    function handleMouseMove(e) {
      const now = Date.now()
      // Create a heart every 50ms when moving
      if (now - lastTimeRef.current > 50) {
        createHeart(e.clientX, e.clientY)
        lastTimeRef.current = now
      }
    }

    document.addEventListener('mousemove', handleMouseMove)

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
    }
  }, [])

  return null
}
