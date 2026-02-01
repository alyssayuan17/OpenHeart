import { useState, useRef } from 'react'
import { Camera, Upload } from 'lucide-react'

/*
  PLACEHOLDER BODIES
  These are simple SVG silhouettes. Michelle can replace them
  with her illustrated character bodies. Each body is a function
  returning an SVG — swap the paths to change the art.
*/

const BODIES = [
  {
    id: 'casual',
    label: 'Casual',
    svg: (color) => (
      <svg viewBox="0 0 100 150" fill={color}>
        <rect x="35" y="10" width="30" height="35" rx="4" />
        <rect x="30" y="45" width="40" height="50" rx="6" />
        <rect x="15" y="50" width="18" height="8" rx="4" />
        <rect x="67" y="50" width="18" height="8" rx="4" />
        <rect x="34" y="95" width="14" height="50" rx="5" />
        <rect x="52" y="95" width="14" height="50" rx="5" />
      </svg>
    ),
  },
  {
    id: 'active',
    label: 'Active',
    svg: (color) => (
      <svg viewBox="0 0 100 150" fill={color}>
        <rect x="35" y="10" width="30" height="35" rx="4" />
        <rect x="30" y="45" width="40" height="45" rx="6" />
        <rect x="12" y="30" width="8" height="30" rx="4" transform="rotate(-20 16 45)" />
        <rect x="80" y="30" width="8" height="30" rx="4" transform="rotate(20 84 45)" />
        <rect x="34" y="90" width="14" height="50" rx="5" />
        <rect x="52" y="90" width="14" height="50" rx="5" />
      </svg>
    ),
  },
  {
    id: 'relaxed',
    label: 'Relaxed',
    svg: (color) => (
      <svg viewBox="0 0 100 150" fill={color}>
        <rect x="35" y="10" width="30" height="35" rx="4" />
        <rect x="30" y="45" width="40" height="45" rx="6" />
        <rect x="18" y="55" width="15" height="8" rx="4" />
        <rect x="67" y="55" width="15" height="8" rx="4" />
        <rect x="30" y="90" width="14" height="20" rx="5" />
        <rect x="56" y="90" width="14" height="20" rx="5" />
        <rect x="25" y="108" width="20" height="12" rx="4" />
        <rect x="55" y="108" width="20" height="12" rx="4" />
      </svg>
    ),
  },
  {
    id: 'wheelchair',
    label: 'Wheelchair',
    svg: (color) => (
      <svg viewBox="0 0 100 150" fill={color}>
        <rect x="35" y="5" width="30" height="35" rx="4" />
        <rect x="30" y="40" width="40" height="40" rx="6" />
        <rect x="18" y="48" width="15" height="8" rx="4" />
        <rect x="67" y="48" width="15" height="8" rx="4" />
        <rect x="34" y="80" width="14" height="18" rx="4" />
        <rect x="52" y="80" width="14" height="18" rx="4" />
        <circle cx="30" cy="115" r="18" fill="none" stroke={color} strokeWidth="5" />
        <circle cx="70" cy="115" r="18" fill="none" stroke={color} strokeWidth="5" />
        <rect x="25" y="95" width="50" height="8" rx="3" />
      </svg>
    ),
  },
  {
    id: 'cane',
    label: 'With Cane',
    svg: (color) => (
      <svg viewBox="0 0 100 150" fill={color}>
        <rect x="30" y="10" width="30" height="35" rx="4" />
        <rect x="25" y="45" width="40" height="50" rx="6" />
        <rect x="10" y="50" width="18" height="8" rx="4" />
        <rect x="62" y="50" width="15" height="8" rx="4" />
        <rect x="29" y="95" width="14" height="50" rx="5" />
        <rect x="47" y="95" width="14" height="50" rx="5" />
        <rect x="76" y="45" width="4" height="100" rx="2" />
        <rect x="72" y="42" width="12" height="6" rx="3" />
      </svg>
    ),
  },
]

/*
  OUTFIT ITEMS
  Each item has a category, id, label, and an image path.
  The image should be a transparent PNG/SVG that overlays the body.

  REPLACE: Drop your actual outfit images into /public/outfits/
  and update the `image` paths below. Each image should be
  transparent and sized to 160x220 to align with the body SVG.

  To add new items: just add objects to the arrays below.
  To add new categories: add a new entry to OUTFIT_CATEGORIES
  and a new array to OUTFIT_ITEMS.
*/

const OUTFIT_CATEGORIES = [
  { id: 'tops', label: 'Tops' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'hands', label: 'Hands' },
]

/*
  OUTFIT DATA
  Each item needs:
    - id: unique string
    - label: display name
    - image: path to transparent PNG in /public/outfits/
    - color: fallback color shown while image loads

  To add more categories later (hats, bottoms, accessories),
  add PNGs to /public/outfits/<category>/ and add entries here.
*/
const OUTFIT_ITEMS = {
  tops: [
    { id: 'blue_top', label: 'Blue Top', image: '/outfits/tops/blue_top.PNG', color: '#5B8CFF' },
    { id: 'pink_top', label: 'Pink Top', image: '/outfits/tops/pink_top.PNG', color: '#FF69B4' },
    { id: 'yellow_top', label: 'Yellow Top', image: '/outfits/tops/yellow_top.PNG', color: '#F5A623' },
  ],
  shoes: [
    { id: 'green_shoes', label: 'Green Shoes', image: '/outfits/shoes/green_shoes.PNG', color: '#66BB6A' },
    { id: 'purple_shoes', label: 'Purple Shoes', image: '/outfits/shoes/purple_shoes.PNG', color: '#AB47BC' },
    { id: 'yellow_shoes', label: 'Yellow Shoes', image: '/outfits/shoes/yellow_shoes.PNG', color: '#F5A623' },
  ],
  hands: [
    { id: 'black_skin', label: 'Dark', image: '/outfits/hands/black_skin.png', color: '#3B2219', square: true },
    { id: 'brown_skin', label: 'Brown', image: '/outfits/hands/brown_skin.png', color: '#8D5524', square: true },
    { id: 'white_skin', label: 'Light', image: '/outfits/hands/white_skin.png', color: '#FFDBAC', square: true },
  ],
}

/*
  The outfit PNGs are full-body-sized illustrations drawn to match
  the body silhouettes. Each layer covers the full body container
  and relies on the PNG transparency to only show the relevant part.
  REPLACE: if your images only cover part of the body, switch back
  to per-category position offsets.
*/
function OutfitImage({ item }) {
  if (!item) return null

  /*
    Square hand PNGs (2048x2048) have hands at ~35% from top.
    Portrait PNGs (1668x2388) have hands at ~60% from top.
    For square images, we scale them up and shift down so the hands
    align with the same position as the portrait ones.
  */
  const style = item.square
    ? {
        position: 'absolute',
        top: '20%',
        left: '-18%',
        width: '138%',
        height: 'auto',
        aspectRatio: '1 / 1',
        objectFit: 'contain',
        pointerEvents: 'none',
      }
    : {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        objectFit: 'contain',
        pointerEvents: 'none',
      }

  return <img src={item.image} alt={item.label} style={style} />
}

export default function BodySelector({ headImage, onHeadImageChange, outfit, onOutfitChange }) {
  const [activeCategory, setActiveCategory] = useState('tops')
  const [cameraOpen, setCameraOpen] = useState(false)
  const fileInputRef = useRef()
  const videoRef = useRef()
  const streamRef = useRef(null)

  // If parent doesn't manage outfit state, manage it locally
  const [localOutfit, setLocalOutfit] = useState({
    tops: null,
    shoes: null,
    hands: null,
  })

  const currentOutfit = outfit || localOutfit
  const setOutfit = onOutfitChange || setLocalOutfit

  async function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return

    const imageBitmap = await createImageBitmap(file)
    const croppedDataUrl = await cropFace(imageBitmap)
    onHeadImageChange(croppedDataUrl)
  }

  async function cropFace(imageBitmap) {
    const { width, height } = imageBitmap

    // Try browser FaceDetector API (Chrome)
    if (typeof FaceDetector !== 'undefined') {
      try {
        const detector = new FaceDetector()
        const faces = await detector.detect(imageBitmap)
        if (faces.length > 0) {
          const face = faces[0].boundingBox
          // Add padding around the detected face
          const pad = Math.max(face.width, face.height) * 0.35
          const x = Math.max(0, face.x - pad)
          const y = Math.max(0, face.y - pad)
          const w = Math.min(width - x, face.width + pad * 2)
          const h = Math.min(height - y, face.height + pad * 2)
          // Make it square (use the larger dimension)
          const size = Math.max(w, h)
          const cx = x + w / 2
          const cy = y + h / 2
          const sx = Math.max(0, cx - size / 2)
          const sy = Math.max(0, cy - size / 2)
          const sSize = Math.min(size, width - sx, height - sy)

          return cropToCanvas(imageBitmap, sx, sy, sSize, sSize)
        }
      } catch (err) {
        console.warn('[FaceDetector error]', err)
      }
    }

    // Fallback: center-crop to a square
    const size = Math.min(width, height)
    const sx = (width - size) / 2
    const sy = (height - size) * 0.3 // bias toward top where faces usually are
    return cropToCanvas(imageBitmap, sx, Math.max(0, sy), size, size)
  }

  function cropToCanvas(imageBitmap, sx, sy, sw, sh) {
    const canvas = document.createElement('canvas')
    const outputSize = 256
    canvas.width = outputSize
    canvas.height = outputSize
    const ctx = canvas.getContext('2d')
    ctx.drawImage(imageBitmap, sx, sy, sw, sh, 0, 0, outputSize, outputSize)
    return canvas.toDataURL('image/jpeg', 0.9)
  }

  async function openCamera() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } })
      streamRef.current = stream
      setCameraOpen(true)
      // Wait for video element to mount, then attach stream
      setTimeout(() => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream
        }
      }, 50)
    } catch (err) {
      alert('Could not access camera. Please check permissions.')
      console.error('[Camera error]', err)
    }
  }

  function closeCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setCameraOpen(false)
  }

  async function capturePhoto() {
    if (!videoRef.current) return
    const video = videoRef.current
    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    const ctx = canvas.getContext('2d')
    // Mirror the image so it looks natural (selfie mode)
    ctx.translate(canvas.width, 0)
    ctx.scale(-1, 1)
    ctx.drawImage(video, 0, 0)
    closeCamera()

    const imageBitmap = await createImageBitmap(canvas)
    const croppedDataUrl = await cropFace(imageBitmap)
    onHeadImageChange(croppedDataUrl)
  }

  function selectItem(category, item) {
    setOutfit((prev) => ({
      ...prev,
      // Toggle off if already selected
      [category]: prev[category]?.id === item.id ? null : item,
    }))
  }

  const categoryItems = OUTFIT_ITEMS[activeCategory] || []

  return (
    <>
      {/* Character preview: head + body (tops/hands) + shoes */}
      <div className="body-selector__preview">
        {/* Head circle — positioned to overlap the top of the body area */}
        <div className="body-selector__head">
          {headImage ? (
            <img src={headImage} alt="Your profile" />
          ) : (
            '?'
          )}
        </div>

        {/* Body area — tops and hands share the same canvas (1668x2388) */}
        <div className="body-selector__body-area">
          <OutfitImage item={currentOutfit.hands} />
          <OutfitImage item={currentOutfit.tops} />
        </div>

        {/* Shoes — separate square image below the body */}
        {currentOutfit.shoes && (
          <div className="body-selector__shoes">
            <img
              src={currentOutfit.shoes.image}
              alt={currentOutfit.shoes.label}
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
          </div>
        )}
      </div>


      {/* Camera modal */}
      {cameraOpen && (
        <div className="camera-modal">
          <div className="camera-modal__content">
            <video ref={videoRef} autoPlay playsInline muted className="camera-modal__video" />
            <div className="camera-modal__actions">
              <button className="btn btn-primary" onClick={capturePhoto}>
                Snap
              </button>
              <button className="btn btn-secondary" onClick={closeCamera}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Photo upload */}
      <div className="body-selector__actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          hidden
        />
        <button type="button" className="btn btn-secondary" onClick={openCamera}>
          <Camera size={18} />
          Take Photo
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
          <Upload size={18} />
          Upload
        </button>
      </div>

      {/* Outfit picker */}
      <div className="outfit-picker">
        <div className="outfit-categories">
          {OUTFIT_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              className={`outfit-cat-btn ${activeCategory === cat.id ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat.id)}
              title={cat.label}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="outfit-items">
          {categoryItems.map((item) => (
            <button
              key={item.id}
              className={`outfit-item-btn ${currentOutfit[activeCategory]?.id === item.id ? 'selected' : ''}`}
              onClick={() => selectItem(activeCategory, item)}
              title={item.label}
              aria-label={`Equip ${item.label}`}
            >
              <div
                className="outfit-item-preview"
                style={{ background: item.color }}
              >
                <img
                  src={item.image}
                  alt={item.label}
                  onError={(e) => { e.target.style.display = 'none' }}
                />
              </div>
              <span className="outfit-item-label">{item.label}</span>
            </button>
          ))}
          {/* Clear button for this category */}
          {currentOutfit[activeCategory] && (
            <button
              className="outfit-item-btn outfit-item-clear"
              onClick={() => selectItem(activeCategory, currentOutfit[activeCategory])}
              title="Remove"
            >
              <div className="outfit-item-preview outfit-item-preview--clear">✕</div>
              <span className="outfit-item-label">None</span>
            </button>
          )}
        </div>
      </div>
    </>
  )
}
