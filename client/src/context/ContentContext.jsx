import { createContext, useContext, useState, useEffect } from 'react'

const ContentContext = createContext(null)

export function ContentProvider({ children }) {
  const [content, setContent] = useState(null)
  const [doctors, setDoctors] = useState([])
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      fetch('/api/content').then(r => r.json()),
      fetch('/api/doctors').then(r => r.json()),
      fetch('/api/services').then(r => r.json()),
    ]).then(([c, d, s]) => {
      setContent(c)
      setDoctors(d)
      setServices(s)
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
