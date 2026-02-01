import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import BodySelector from '../components/BodySelector'

const GENDER_OPTIONS = [
  'Man', 'Woman', 'Non-binary', 'Genderfluid', 'Genderqueer',
  'Agender', 'Two-Spirit', 'Prefer not to say', 'Other',
]

const PRONOUN_OPTIONS = [
  'he/him', 'she/her', 'they/them', 'he/they', 'she/they',
  'ze/zir', 'xe/xem', 'Custom',
]

const ORIENTATION_OPTIONS = [
  'Straight', 'Gay', 'Lesbian', 'Bisexual', 'Pansexual',
  'Asexual', 'Demisexual', 'Queer', 'Questioning',
  'Prefer not to say', 'Other',
]

const ZODIAC_OPTIONS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
]

const LOVE_LANGUAGES = [
  'Words of Affirmation', 'Quality Time', 'Acts of Service',
  'Physical Touch', 'Receiving Gifts',
]

const COMM_STYLES = ['Text', 'Voice', 'Sign Language']
const RECEIVE_STYLES = ['Text', 'Audio', 'Captions']

function MultiSelect({ options, selected, onChange }) {
  function toggle(opt) {
    if (selected.includes(opt)) {
      onChange(selected.filter((s) => s !== opt))
    } else {
      onChange([...selected, opt])
    }
  }
  return (
    <div className="chip-group">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`chip ${selected.includes(opt) ? 'selected' : ''}`}
          onClick={() => toggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

export default function OnboardingPage() {
  const navigate = useNavigate()
  const { login, updateProfile } = useApp()

  const [headImage, setHeadImage] = useState(null)
  const [form, setForm] = useState({
    name: '',
    age: '',
    funFact: '',
    gender: '',
    pronouns: '',
    orientation: '',
    chronotype: '',
    zodiac: '',
    education: '',
    loveLanguage: '',
    bio: '',
    communicationStyle: [],
    receivesInfo: [],
    interests: '',
    lookingFor: '',
  })

  function update(key, value) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const profile = {
      ...form,
      headImage,
      interests: form.interests.split(',').map((s) => s.trim()).filter(Boolean),
    }
    login(profile)
    updateProfile(profile)
    navigate('/journey')
  }

  return (
    <div className="onboarding-page">
      <img src="/Build Your Own Profile.png" alt="Build Your Profile" className="onboarding-page__title-image" />

      <form onSubmit={handleSubmit}>
        <div className="onboarding-layout">
          {/* LEFT — Body selector */}
          <div className="onboarding-left">
            <BodySelector headImage={headImage} onHeadImageChange={setHeadImage} />
          </div>

          {/* RIGHT — Form fields */}
          <div className="onboarding-right">
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input id="name" value={form.name} onChange={(e) => update('name', e.target.value)} required />
            </div>

            <div className="form-group">
              <label htmlFor="age">Age</label>
              <input id="age" type="number" min="18" max="120" value={form.age} onChange={(e) => update('age', e.target.value)} required />
            </div>

            <div className="form-group full-width">
              <label htmlFor="funFact">Fun Fact About Me</label>
              <input id="funFact" placeholder="e.g. I can juggle 5 balls" value={form.funFact} onChange={(e) => update('funFact', e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="gender">Gender Identity</label>
              <select id="gender" value={form.gender} onChange={(e) => update('gender', e.target.value)} required>
                <option value="">Select...</option>
                {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="pronouns">Pronouns</label>
              <select id="pronouns" value={form.pronouns} onChange={(e) => update('pronouns', e.target.value)}>
                <option value="">Select...</option>
                {PRONOUN_OPTIONS.map((p) => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="orientation">Sexual Orientation</label>
              <select id="orientation" value={form.orientation} onChange={(e) => update('orientation', e.target.value)}>
                <option value="">Select...</option>
                {ORIENTATION_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="chronotype">Early Bird or Night Owl?</label>
              <select id="chronotype" value={form.chronotype} onChange={(e) => update('chronotype', e.target.value)}>
                <option value="">Select...</option>
                <option value="Early Bird">Early Bird</option>
                <option value="Night Owl">Night Owl</option>
                <option value="Both">Depends on the day</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="zodiac">Zodiac Sign</label>
              <select id="zodiac" value={form.zodiac} onChange={(e) => update('zodiac', e.target.value)}>
                <option value="">Select...</option>
                {ZODIAC_OPTIONS.map((z) => <option key={z} value={z}>{z}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="education">Education</label>
              <input id="education" placeholder="e.g. B.Sc. in CS" value={form.education} onChange={(e) => update('education', e.target.value)} />
            </div>

            <div className="form-group">
              <label htmlFor="loveLanguage">Love Language</label>
              <select id="loveLanguage" value={form.loveLanguage} onChange={(e) => update('loveLanguage', e.target.value)}>
                <option value="">Select...</option>
                {LOVE_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label>How I Express Myself</label>
              <MultiSelect options={COMM_STYLES} selected={form.communicationStyle} onChange={(v) => update('communicationStyle', v)} />
            </div>

            <div className="form-group">
              <label>How I Receive Info</label>
              <MultiSelect options={RECEIVE_STYLES} selected={form.receivesInfo} onChange={(v) => update('receivesInfo', v)} />
            </div>

            <div className="form-group full-width">
              <label htmlFor="interests">Interests (comma-separated)</label>
              <input id="interests" placeholder="e.g. Hiking, Music, Cooking" value={form.interests} onChange={(e) => update('interests', e.target.value)} />
            </div>

            <div className="form-group full-width">
              <label htmlFor="bio">About Me</label>
              <textarea id="bio" placeholder="Tell people about yourself..." value={form.bio} onChange={(e) => update('bio', e.target.value)} />
            </div>

            <div className="form-group full-width">
              <label htmlFor="lookingFor">What I&apos;m Looking For</label>
              <input id="lookingFor" placeholder="e.g. Something serious, new friends..." value={form.lookingFor} onChange={(e) => update('lookingFor', e.target.value)} />
            </div>

            <button type="submit" className="btn btn-primary">
              Create Profile
            </button>
          </div>
        </div>
      </form>
    </div>
  )
}
