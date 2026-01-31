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
  { id: 'hats', label: 'Hats' },
  { id: 'tops', label: 'Tops' },
  { id: 'bottoms', label: 'Bottoms' },
  { id: 'shoes', label: 'Shoes' },
  { id: 'accessories', label: 'Accessories' },
]

/*
  PLACEHOLDER OUTFIT DATA
  Each item needs:
    - id: unique string
    - label: display name
    - image: path to transparent PNG/SVG in /public/outfits/
    - color: fallback color for the placeholder rectangle

  When you have real images, just update the `image` field.
  The component renders the image if it exists, otherwise
  shows a colored placeholder block.
*/
const OUTFIT_ITEMS = {
  hats: [
    { id: 'beanie', label: 'Beanie', image: '/outfits/hats/beanie.png', color: '#5B8CFF' },
    { id: 'cap', label: 'Cap', image: '/outfits/hats/cap.png', color: '#FF6B6B' },
    { id: 'headband', label: 'Headband', image: '/outfits/hats/headband.png', color: '#4ECDC4' },
    { id: 'beret', label: 'Beret', image: '/outfits/hats/beret.png', color: '#F5A623' },
  ],
  tops: [
    { id: 'tshirt', label: 'T-Shirt', image: '/outfits/tops/tshirt.png', color: '#5B8CFF' },
    { id: 'hoodie', label: 'Hoodie', image: '/outfits/tops/hoodie.png', color: '#8B5CF6' },
    { id: 'jacket', label: 'Jacket', image: '/outfits/tops/jacket.png', color: '#2D2D2D' },
    { id: 'tank', label: 'Tank Top', image: '/outfits/tops/tank.png', color: '#FF6B6B' },
  ],
  bottoms: [
    { id: 'jeans', label: 'Jeans', image: '/outfits/bottoms/jeans.png', color: '#3B5998' },
    { id: 'shorts', label: 'Shorts', image: '/outfits/bottoms/shorts.png', color: '#8B6F47' },
    { id: 'skirt', label: 'Skirt', image: '/outfits/bottoms/skirt.png', color: '#E87461' },
    { id: 'sweats', label: 'Sweatpants', image: '/outfits/bottoms/sweats.png', color: '#777777' },
  ],
  shoes: [
    { id: 'sneakers', label: 'Sneakers', image: '/outfits/shoes/sneakers.png', color: '#FFFFFF' },
    { id: 'boots', label: 'Boots', image: '/outfits/shoes/boots.png', color: '#5C3A1E' },
    { id: 'sandals', label: 'Sandals', image: '/outfits/shoes/sandals.png', color: '#D4A574' },
  ],
  accessories: [
    { id: 'glasses', label: 'Glasses', image: '/outfits/accessories/glasses.png', color: '#2D2D2D' },
    { id: 'necklace', label: 'Necklace', image: '/outfits/accessories/necklace.png', color: '#FFD700' },
    { id: 'scarf', label: 'Scarf', image: '/outfits/accessories/scarf.png', color: '#E87461' },
    { id: 'watch', label: 'Watch', image: '/outfits/accessories/watch.png', color: '#C0C0C0' },
  ],
}

/*
  Layer order — controls which items render on top.
  Items later in the array render on top of earlier ones.
*/
const LAYER_ORDER = ['bottoms', 'shoes', 'tops', 'accessories', 'hats']

/*
  Position offsets for each category layer on the body preview.
  These align the outfit images with the placeholder body SVGs.
  REPLACE: adjust these when you have real illustrations to get
  pixel-perfect alignment.
*/
const LAYER_POSITIONS = {
  hats:        { top: -10, left: 22, width: 56, height: 40 },
  tops:        { top: 55,  left: 10, width: 80, height: 55 },
  bottoms:     { top: 100, left: 18, width: 64, height: 55 },
  shoes:       { top: 148, left: 18, width: 64, height: 30 },
  accessories: { top: 40,  left: 20, width: 60, height: 40 },
}

function OutfitLayer({ item, category }) {
  const pos = LAYER_POSITIONS[category]
  if (!item || !pos) return null

  return (
    <div
      className="outfit-layer"
      style={{
        position: 'absolute',
        top: pos.top,
        left: pos.left,
        width: pos.width,
        height: pos.height,
        pointerEvents: 'none',
      }}
    >
      {/* Try to load the real image; show colored placeholder on error */}
      <img
        src={item.image}
        alt={item.label}
        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
        onError={(e) => {
          // Hide broken image, show placeholder
          e.target.style.display = 'none'
          e.target.nextSibling.style.display = 'flex'
        }}
      />
      <div
        className="outfit-placeholder"
        style={{
          display: 'none',
          width: '100%',
          height: '100%',
          background: item.color,
          borderRadius: 6,
          opacity: 0.8,
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 10,
          color: '#fff',
          fontWeight: 600,
          textAlign: 'center',
        }}
      >
        {item.label}
      </div>
    </div>
  )
}

export default function BodySelector({ headImage, onHeadImageChange, outfit, onOutfitChange }) {
  const [selectedBody, setSelectedBody] = useState('casual')
  const [activeCategory, setActiveCategory] = useState('hats')
  const fileInputRef = useRef()

  // If parent doesn't manage outfit state, manage it locally
  const [localOutfit, setLocalOutfit] = useState({
    hats: null,
    tops: null,
    bottoms: null,
    shoes: null,
    accessories: null,
  })

  const currentOutfit = outfit || localOutfit
  const setOutfit = onOutfitChange || setLocalOutfit

  function handleFileChange(e) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onHeadImageChange(ev.target.result)
    reader.readAsDataURL(file)
  }

  function selectItem(category, item) {
    setOutfit((prev) => ({
      ...prev,
      // Toggle off if already selected
      [category]: prev[category]?.id === item.id ? null : item,
    }))
  }

  const activeBody = BODIES.find((b) => b.id === selectedBody)
  const categoryItems = OUTFIT_ITEMS[activeCategory] || []

  return (
    <>
      {/* Main preview: head + body + outfit layers */}
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
          {/* Outfit layers rendered in order */}
          {LAYER_ORDER.map((cat) => (
            <OutfitLayer key={cat} item={currentOutfit[cat]} category={cat} />
          ))}
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
