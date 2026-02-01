import { useRef, useState, useEffect, useCallback } from 'react'
import { FaceLandmarker, FilesetResolver } from '@mediapipe/tasks-vision'

const TILT_THRESHOLD = 22 // degrees
const COOLDOWN_MS = 2000
const EMA_FACTOR = 0.7
const VIDEO_WIDTH = 320
const VIDEO_HEIGHT = 240

export default function useHeadTilt({ enabled, onTiltLeft, onTiltRight }) {
  const videoRef = useRef(null)
  const landmarkerRef = useRef(null)
  const rafRef = useRef(null)
  const streamRef = useRef(null)
  const smoothedAngleRef = useRef(0)
  const lastSwipeTimeRef = useRef(0)

  const [tiltDirection, setTiltDirection] = useState(null) // 'left' | 'right' | null
  const [tiltAngle, setTiltAngle] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  const cleanup = useCallback(() => {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop())
      streamRef.current = null
    }
    if (landmarkerRef.current) {
      landmarkerRef.current.close()
      landmarkerRef.current = null
    }
    smoothedAngleRef.current = 0
    setTiltDirection(null)
    setTiltAngle(0)
    setError(null)
  }, [])

  useEffect(() => {
    if (!enabled) {
      cleanup()
      return
    }

    let cancelled = false

    async function init() {
      setIsLoading(true)
      setError(null)

      try {
        // Acquire webcam
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: VIDEO_WIDTH, height: VIDEO_HEIGHT, facingMode: 'user' },
        })
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop())
          return
        }
        streamRef.current = stream

        const video = videoRef.current
        if (!video) return
        video.srcObject = stream
        await video.play()

        // Initialize FaceLandmarker
        const filesetResolver = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        )
        if (cancelled) return

        const landmarker = await FaceLandmarker.createFromOptions(filesetResolver, {
          baseOptions: {
            modelAssetPath:
              'https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task',
            delegate: 'GPU',
          },
          runningMode: 'VIDEO',
          numFaces: 1,
        })
        if (cancelled) {
          landmarker.close()
          return
        }
        landmarkerRef.current = landmarker
        setIsLoading(false)

        // Detection loop
        function detect() {
          if (cancelled || !landmarkerRef.current || !videoRef.current) return
          const v = videoRef.current
          if (v.readyState < 2) {
            rafRef.current = requestAnimationFrame(detect)
            return
          }

          const results = landmarkerRef.current.detectForVideo(v, performance.now())

          if (results.faceLandmarks && results.faceLandmarks.length > 0) {
            const landmarks = results.faceLandmarks[0]
            // Eye landmarks: 33 (right eye outer) and 263 (left eye outer)
            const rightEye = landmarks[33]
            const leftEye = landmarks[263]
            const deltaY = leftEye.y - rightEye.y
            const deltaX = leftEye.x - rightEye.x
            const rawAngle = Math.atan2(deltaY, deltaX) * (180 / Math.PI)

            // Exponential moving average smoothing
            smoothedAngleRef.current =
              EMA_FACTOR * smoothedAngleRef.current + (1 - EMA_FACTOR) * rawAngle

            const angle = smoothedAngleRef.current
            setTiltAngle(Math.round(angle))

            const now = Date.now()
            const inCooldown = now - lastSwipeTimeRef.current < COOLDOWN_MS

            if (Math.abs(angle) > TILT_THRESHOLD && !inCooldown) {
              if (angle < -TILT_THRESHOLD) {
                // Head tilted right (positive roll in mirrored view)
                setTiltDirection('right')
                lastSwipeTimeRef.current = now
                onTiltRight?.()
              } else if (angle > TILT_THRESHOLD) {
                // Head tilted left (negative roll in mirrored view)
                setTiltDirection('left')
                lastSwipeTimeRef.current = now
                onTiltLeft?.()
              }
              // Clear direction indicator after a moment
              setTimeout(() => setTiltDirection(null), 800)
            } else if (Math.abs(angle) <= TILT_THRESHOLD) {
              setTiltDirection(null)
            }
          }

          rafRef.current = requestAnimationFrame(detect)
        }

        rafRef.current = requestAnimationFrame(detect)
      } catch (err) {
        if (!cancelled) {
          setError(err.message || 'Failed to initialize head tilt detection')
          setIsLoading(false)
        }
      }
    }

    init()

    return () => {
      cancelled = true
      cleanup()
    }
  }, [enabled, onTiltLeft, onTiltRight, cleanup])

  return { videoRef, tiltDirection, tiltAngle, isLoading, error }
}
