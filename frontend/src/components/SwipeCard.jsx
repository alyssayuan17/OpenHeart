export default function SwipeCard({ profile }) {
  return (
    <div className="swipe-card">
      {/* REPLACE: swap this gradient placeholder with a real profile photo */}
      <div className="swipe-card__photo">
        <div className="swipe-card__photo-placeholder">
          {profile.emoji || '?'}
        </div>
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
