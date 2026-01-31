import { createContext, useContext, useState, useCallback } from 'react'

const AppContext = createContext()

export function AppProvider({ children }) {
  const [user, setUser] = useState(null)
  const [currentMatch, setCurrentMatch] = useState(null)
  const [confirmedMatches, setConfirmedMatches] = useState([])

  const login = useCallback((profile) => {
    setUser(profile || { name: 'Guest', email: 'guest@openheart.app' })
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setCurrentMatch(null)
  }, [])

  const updateProfile = useCallback((profileData) => {
    setUser((prev) => ({ ...prev, ...profileData }))
  }, [])

  const confirmMatch = useCallback((profile) => {
    setConfirmedMatches((prev) => [...prev, profile])
  }, [])

  return (
    <AppContext.Provider
      value={{
        user,
        login,
        logout,
        updateProfile,
        currentMatch,
        setCurrentMatch,
        confirmedMatches,
        confirmMatch,
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  return useContext(AppContext)
}
