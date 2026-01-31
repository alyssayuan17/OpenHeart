import { useNavigate, useLocation } from 'react-router-dom'
import { LogOut, ArrowLeft } from 'lucide-react'
import { useApp } from '../context/AppContext'
import AccessibilityMenu from './AccessibilityMenu'

export default function TopNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { logout } = useApp()

  const showKeepSwiping = location.pathname.startsWith('/chat')

  function handleLogout() {
    logout()
    navigate('/')
  }

  return (
    <nav className="top-nav">
      <div className="top-nav__left">
        <button className="btn-ghost" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
        {showKeepSwiping && (
          <button className="btn-ghost" onClick={() => navigate('/swipe')}>
            <ArrowLeft size={18} />
            Keep Swiping
          </button>
        )}
      </div>

      {/* REPLACE: swap this text with your logo component / image */}
      <div className="top-nav__center">OpenHeart</div>

      <div className="top-nav__right">
        <AccessibilityMenu />
      </div>
    </nav>
  )
}
