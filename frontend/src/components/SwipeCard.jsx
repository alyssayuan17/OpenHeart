import { Palette, Music, Dribbble, Leaf, Gamepad2, Drama, User } from 'lucide-react'

const EMOJI_TO_ICON = {
  '🎨': Palette,
  '🎵': Music,
  '🏀': Dribbble,
  '🌿': Leaf,
  '🎮': Gamepad2,
  '🎭': Drama,
}

// Unique gradient per card so you can tell them apart
const GRADIENTS = [
  'linear-gradient(135deg, #FDE8E4 0%, #4ECDC4 100%)',
  'linear-gradient(135deg, #E0F0FF 0%, #5B8CFF 100%)',
  'linear-gradient(135deg, #FFF3E0 0%, #F5A623 100%)',
  'linear-gradient(135deg, #E8F5E9 0%, #66BB6A 100%)',
  'linear-gradient(135deg, #F3E5F5 0%, #AB47BC 100%)',
  'linear-gradient(135deg, #FCE4EC 0%, #EF5350 100%)',
]

export default function SwipeCard({ profile }) {
  const gradient = GRADIENTS[(profile.id - 1) % GRADIENTS.length]

  return (
    <div className="swipe-card">
      {/* REPLACE: swap this gradient placeholder with a real profile photo */}
      <div className="swipe-card__photo" style={{ background: profile.photo ? 'transparent' : gradient }}>
        {profile.photo ? (
          <>
            <div className="swipe-card__photo-bg"></div>
            <img src={profile.photo} alt={profile.name} className="swipe-card__photo-img" />
          </>
        ) : (
          <div className="swipe-card__photo-placeholder">
            {(() => {
              const IconComponent = EMOJI_TO_ICON[profile.emoji] || User
              return <IconComponent size={48} />
            })()}
          </div>
        )}
      </div>

      <div className="swipe-card__info">
        <div>
          <span className="swipe-card__name">{profile.name}</span>
          <span className="swipe-card__age">, {profile.age}</span>
        </div>

        <div className="swipe-card__detail">
          {profile.pronouns} &middot; {profile.orientation} &middot; {profile.zodiac}
        </div>

        <div className="swipe-card__detail">
          {profile.chronotype} &middot; {profile.education}
        </div>

        <div className="swipe-card__tags">
          {profile.interests.map((tag) => (
            <span key={tag} className="swipe-card__tag">{tag}</span>
          ))}
          <span className="swipe-card__tag">{profile.loveLanguage}</span>
        </div>

        <div className="swipe-card__bio">{profile.bio}</div>

        <div className="swipe-card__detail" style={{ marginTop: 8 }}>
          Fun fact: {profile.funFact}
        </div>
      </div>
    </div>
  )
}
