import { useState, useEffect } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

const NAV_LINKS = [
  { en: 'Home',     ar: 'الرئيسية',        to: '/' },
  { en: 'Services', ar: 'خدماتنا',          to: '/services' },
  { en: 'About',    ar: 'من نحن',           to: '/about' },
  { en: 'FAQ',      ar: 'الأسئلة الشائعة', to: '/faq' },
  { en: 'Contact',  ar: 'اتصل بنا',        to: '/contact' },
]

export default function Navbar() {
  const { lang, toggle, pick } = useLang()
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <header className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
      scrolled
        ? 'bg-white/95 backdrop-blur-xl shadow-sm border-b border-slate-100 py-2'
        : 'bg-white/80 backdrop-blur-md py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between gap-4">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 flex-shrink-0 group">
          <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center shadow-md group-hover:scale-105 transition-transform">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.5 2 5 5 5 9c0 3 2 5.5 3.5 7L10 21h4l1.5-5C17 14.5 19 12 19 9c0-4-3.5-7-7-7z" fill="white" opacity=".9"/>
              <circle cx="12" cy="9" r="2.5" fill="#00B5B0"/>
            </svg>
          </div>
          <div className="leading-none">
            <span className="font-bold text-slate-900 text-lg block">SmileCraft</span>
            <span className="text-[10px] text-brand-500 tracking-[0.18em] uppercase font-semibold">Dental Clinic</span>
          </div>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-0.5">
          {NAV_LINKS.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              className={({ isActive }) =>
                `px-4 py-2 rounded-xl text-sm font-medium transition-all duration-150 ${
                  isActive
                    ? 'text-brand-600 bg-brand-50 font-semibold'
                    : 'text-slate-600 hover:text-brand-600 hover:bg-slate-50'
                }`
              }
            >
              {pick({ en: link.en, ar: link.ar })}
            </NavLink>
          ))}
        </nav>

        {/* Right controls */}
        <div className="flex items-center gap-2">
          <button onClick={toggle}
            className="hidden sm:flex px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-500 hover:border-brand-300 hover:text-brand-600 transition-all">
            {lang === 'en' ? 'عربي' : 'EN'}
          </button>
          <Link to="/booking"
            className="hidden md:inline-flex btn-primary text-xs py-2.5 px-5">
            {pick({ en: 'Book Now', ar: 'احجز الآن' })}
          </Link>
          {/* Emergency */}
          <a href="tel:+97141234567"
            className="hidden lg:flex items-center gap-1.5 px-3 py-2 rounded-xl bg-teal-50 border border-teal-100 text-teal-700 text-xs font-semibold hover:bg-teal-100 transition-colors">
            <span>📞</span>
            <span>Emergency</span>
          </a>
          {/* Hamburger */}
          <button onClick={() => setMenuOpen(o => !o)}
            className="md:hidden w-9 h-9 flex flex-col items-center justify-center gap-1.5 rounded-xl hover:bg-slate-50 border border-slate-200">
            <span className={`w-5 h-0.5 bg-slate-700 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}/>
            <span className={`w-5 h-0.5 bg-slate-700 transition-all ${menuOpen ? 'opacity-0' : ''}`}/>
            <span className={`w-5 h-0.5 bg-slate-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}/>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 px-6 py-4 flex flex-col gap-1 shadow-lg">
          {NAV_LINKS.map(link => (
            <NavLink key={link.to} to={link.to} end={link.to === '/'}
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `block px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-brand-50 text-brand-600 font-semibold' : 'text-slate-600 hover:bg-slate-50'
                }`
              }
            >
              {pick({ en: link.en, ar: link.ar })}
            </NavLink>
          ))}
          <div className="flex gap-2 mt-3 pt-3 border-t border-slate-100">
            <Link to="/booking" onClick={() => setMenuOpen(false)} className="btn-primary flex-1 text-center justify-center text-sm">
              {pick({ en: 'Book Appointment', ar: 'احجز موعداً' })}
            </Link>
            <button onClick={toggle}
              className="px-4 py-2 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600">
              {lang === 'en' ? 'عربي' : 'EN'}
            </button>
          </div>
        </div>
      )}
    </header>
  )
}
