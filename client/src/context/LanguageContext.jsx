import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('sc_lang') || 'en')

  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    localStorage.setItem('sc_lang', lang)
  }, [lang])

  const toggle = useCallback(() => setLang(l => (l === 'en' ? 'ar' : 'en')), [])

  const pick = useCallback(
    (obj) => {
      if (obj == null) return ''
      if (typeof obj === 'string') return obj
      if (lang === 'ar' && obj.ar != null) return obj.ar
      if (obj.en != null) return obj.en
      return ''
    },
    [lang]
  )

  return (
    <LanguageContext.Provider value={{ lang, toggle, pick, isRtl: lang === 'ar' }}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLang must be used within LanguageProvider')
  return ctx
}
