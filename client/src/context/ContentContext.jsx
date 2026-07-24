import { createContext, useContext, useState, useEffect } from 'react'

const ContentContext = createContext(null)
const CACHE_KEY = 'smilecraft_content'
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

export function ContentProvider({ children }) {
  const [content,  setContent]  = useState(null)
  const [doctors,  setDoctors]  = useState([])
  const [services, setServices] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    // Serve from sessionStorage cache if fresh
    try {
      const raw = sessionStorage.getItem(CACHE_KEY)
      if (raw) {
        const { data, ts } = JSON.parse(raw)
        if (Date.now() - ts < CACHE_TTL) {
          setContent(data.content)
          setDoctors(data.doctors)
          setServices(data.services)
          setLoading(false)
          return
        }
      }
    } catch { /* ignore parse errors */ }

    Promise.all([
      fetch('/api/content').then(r => r.json()),
      fetch('/api/doctors').then(r => r.json()),
      fetch('/api/services').then(r => r.json()),
    ]).then(([content, doctors, services]) => {
      setContent(content)
      setDoctors(doctors)
      setServices(services)
      try {
        sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data: { content, doctors, services }, ts: Date.now() }))
      } catch { /* ignore quota errors */ }
    }).catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <ContentContext.Provider value={{ content, doctors, services, loading, setContent, setDoctors, setServices }}>
      {children}
    </ContentContext.Provider>
  )
}

export function useContent() {
  return useContext(ContentContext)
}
