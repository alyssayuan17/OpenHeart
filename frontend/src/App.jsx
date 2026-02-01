import { Routes, Route, Navigate } from 'react-router-dom'
import { useAccessibility } from './context/AccessibilityContext'
import TopNav from './components/TopNav'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import JourneyAnimation from './pages/JourneyAnimation'
import SwipingPage from './pages/SwipingPage'
import ChatPage from './pages/ChatPage'
import HeartCursorTrail from './components/HeartCursorTrail'

export default function App() {
  const { themeClasses } = useAccessibility()
  return (
    <div className={`app-container ${themeClasses}`}>
      <HeartCursorTrail />
      <TopNav />
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/journey" element={<JourneyAnimation />} />
        <Route path="/swipe" element={<SwipingPage />} />
        <Route path="/chat/:matchId" element={<ChatPage />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}
