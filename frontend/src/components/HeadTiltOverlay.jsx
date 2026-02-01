import { useCallback } from 'react'
import { useAccessibility } from '../context/AccessibilityContext'
import useHeadTilt from '../hooks/useHeadTilt'

export default function HeadTiltOverlay({ onSwipeLeft, onSwipeRight }) {
  const { activeThemes } = useAccessibility()
  const enabled = activeThemes.headTiltControl

  const handleTiltLeft = useCallback(() => {
    onSwipeLeft?.()
  }, [onSwipeLeft])

  const handleTiltRight = useCallback(() => {
    onSwipeRight?.()
  }, [onSwipeRight])

  const { videoRef, tiltDirection, tiltAngle, isLoading, error } = useHeadTilt({
    enabled,
    onTiltLeft: handleTiltLeft,
    onTiltRight: handleTiltRight,
  })

  if (!enabled) return null

  return (
    <div className="head-tilt-overlay">
      {tiltDirection === 'left' && (
        <div className="head-tilt-arrow head-tilt-arrow--left">
          <span>&#8592;</span>
          <span className="head-tilt-arrow__label">Pass</span>
        </div>
      )}

      <div className="head-tilt-cam">
        <video
          ref={videoRef}
          className="head-tilt-video"
          playsInline
          muted
        />
        <div className="head-tilt-status">
          {isLoading && 'Loading...'}
          {error && `Error: ${error}`}
          {!isLoading && !error && `${tiltAngle > 0 ? '+' : ''}${tiltAngle}\u00B0`}
        </div>
      </div>

      {tiltDirection === 'right' && (
        <div className="head-tilt-arrow head-tilt-arrow--right">
          <span className="head-tilt-arrow__label">Match</span>
          <span>&#8594;</span>
        </div>
      )}
    </div>
  )
}
