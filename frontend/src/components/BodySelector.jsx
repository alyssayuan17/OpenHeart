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

// REPLACE: change this color to match your brand / character palette
const BODY_COLOR = '#E87461'

export default function BodySelector({ headImage, onHeadImageChange }) {
  const [selectedBody, setSelectedBody] = useState('casual')
  const fileInputRef = useRef()

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onHeadImageChange(ev.target.result)
    reader.readAsDataURL(file)
  }

  const activeBody = BODIES.find((b) => b.id === selectedBody)

  return (
    <>
      {/* Main preview: head on top of body */}
      <div className="body-selector__preview">
        <div className="body-selector__head">
          {headImage ? (
            <img src={headImage} alt="Your profile" />
          ) : (
            '?'
          )}
        </div>
        <div className="body-selector__body-svg">
          {activeBody?.svg(BODY_COLOR)}
        </div>
      </div>

      {/* Body choices */}
      <div className="body-options">
        {BODIES.map((body) => (
          <button
            key={body.id}
            className={`body-option-btn ${selectedBody === body.id ? 'selected' : ''}`}
            onClick={() => setSelectedBody(body.id)}
            title={body.label}
            aria-label={`Select ${body.label} body`}
          >
            {body.svg(selectedBody === body.id ? BODY_COLOR : '#CCCCCC')}
          </button>
        ))}
      </div>

      {/* Photo upload */}
      <div className="body-selector__actions">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handleFileChange}
          hidden
        />
        <button className="btn btn-secondary" onClick={() => fileInputRef.current?.click()}>
          <Camera size={18} />
          Take Photo
        </button>
        <button
          className="btn btn-secondary"
          onClick={() => {
            fileInputRef.current?.removeAttribute('capture')
            fileInputRef.current?.click()
            setTimeout(() => fileInputRef.current?.setAttribute('capture', 'user'), 100)
          }}
        >
          <Upload size={18} />
          Upload
        </button>
      </div>
    </>
  )
}
