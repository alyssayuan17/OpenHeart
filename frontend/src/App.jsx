import { Routes, Route, Navigate } from 'react-router-dom'
import { useAccessibility } from './context/AccessibilityContext'
import LoginPage from './pages/LoginPage'
import OnboardingPage from './pages/OnboardingPage'
import JourneyAnimation from './pages/JourneyAnimation'
import SwipingPage from './pages/SwipingPage'
import ChatPage from './pages/ChatPage'

export default function App() {
  const { themeClasses } = useAccessibility()

  return (
    <div className={`app-container ${themeClasses}`}>
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
