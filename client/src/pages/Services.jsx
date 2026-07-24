import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'

const ICONS = {
  'Cosmetic Dentistry':   '✦',
  'Orthodontics':         '◎',
  'Dental Implants':      '⬡',
  'General Dentistry':    '◈',
  'Endodontics':          '◉',
  'Periodontics':         '❋',
  'Restorative Dentistry':'◆',
  'Pediatric Dentistry':  '★',
}
const GRADIENTS = {
  'Cosmetic Dentistry':   'from-blue-500 to-cyan-400',
  'Orthodontics':         'from-violet-500 to-purple-400',
  'Dental Implants':      'from-teal-500 to-emerald-400',
  'General Dentistry':    'from-brand-500 to-blue-400',
  'Endodontics':          'from-orange-500 to-amber-400',
  'Periodontics':         'from-pink-500 to-rose-400',
  'Restorative Dentistry':'from-indigo-500 to-blue-400',
  'Pediatric Dentistry':  'from-green-500 to-teal-400',
}

function ServiceCard({ svc, pick }) {
  const gradient = GRADIENTS[svc.category] || 'from-brand-500 to-teal-400'
  const icon     = ICONS[svc.category] || '◆'

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:-translate-y-1.5 hover:shadow-hover transition-all duration-200">
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
      <div className="p-6">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl mb-4 shadow-md`}>
          {icon}
        </div>
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-1 block">
          {pick({ en: svc.category, ar: svc.categoryAr || svc.category })}
        </span>
        <h3 className="font-bold text-slate-800 text-lg leading-snug mb-2">
          {pick({ en: svc.nameEn, ar: svc.nameAr })}
        </h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">
          {pick({ en: svc.descriptionEn, ar: svc.descriptionAr })}
        </p>
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="text-brand-600 font-bold text-sm">{pick({ en: svc.priceRange, ar: svc.priceRangeAr })}</span>
          <span className="text-slate-400 text-xs flex items-center gap-1">⏱ {pick({ en: svc.duration, ar: svc.durationAr })}</span>
        </div>
      </div>
      {/* Hover overlay — pure CSS */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-4 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto`}>
        <span className="text-white text-4xl">{icon}</span>
        <h3 className="font-bold text-white text-xl text-center">{pick({ en: svc.nameEn, ar: svc.nameAr })}</h3>
        <p className="text-white/80 text-sm text-center leading-relaxed line-clamp-4">
          {pick({ en: svc.descriptionEn, ar: svc.descriptionAr })}
        </p>
        <Link to="/booking" className="mt-2 px-6 py-2.5 bg-white text-brand-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors shadow-lg">
          {pick({ en: 'Book This →', ar: '← احجز' })}
        </Link>
      </div>
    </div>
  )
}

export default function Services() {
  const { pick } = useLang()
  const { services } = useContent()
  const [active, setActive] = useState('All')

  const cats = ['All', ...Array.from(new Set((services || []).map(s => s.category)))]
  const filtered = active === 'All' ? (services || []) : (services || []).filter(s => s.category === active)

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="section-tag">🦷 {pick({ en: 'Our Treatments', ar: 'علاجاتنا' })}</span>
          <h1 className="section-heading mt-2 mb-4">{pick({ en: 'Complete Dental Services', ar: 'خدمات طب الأسنان الشاملة' })}</h1>
          <p className="section-sub mx-auto text-center">
            {pick({ en: 'From routine check-ups to full smile makeovers — everything under one roof.', ar: 'من الفحوصات الدورية إلى التجديد الكامل للابتسامة — كل شيء تحت سقف واحد.' })}
          </p>
        </div>
      </section>

      <div className="sticky top-16 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex gap-2 overflow-x-auto scrollbar-none">
          {cats.map(cat => (
            <button key={cat} onClick={() => setActive(cat)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                active === cat
                  ? 'bg-brand-500 text-white shadow-md'
                  : 'bg-slate-100 text-slate-600 hover:bg-brand-50 hover:text-brand-600'
              }`}>
              {cat === 'All' ? pick({ en: 'All Services', ar: 'جميع الخدمات' }) : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <p className="text-slate-400 text-sm mb-6">
          {filtered.length} {pick({ en: 'treatments available', ar: 'علاجات متاحة' })}
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((svc) => <ServiceCard key={svc.id} svc={svc} pick={pick} />)}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl border-2 border-brand-100 p-10 text-center shadow-card">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">
            {pick({ en: 'Not sure which treatment you need?', ar: 'لست متأكداً من العلاج المناسب لك؟' })}
          </h2>
          <p className="text-slate-500 text-sm mb-6">
            {pick({ en: 'Book a free consultation — our specialists will guide you.', ar: 'احجز استشارة مجانية — سيرشدك متخصصونا.' })}
          </p>
          <Link to="/booking" className="btn-primary">
            {pick({ en: 'Free Consultation →', ar: '← استشارة مجانية' })}
          </Link>
        </div>
      </div>
    </div>
  )
}
