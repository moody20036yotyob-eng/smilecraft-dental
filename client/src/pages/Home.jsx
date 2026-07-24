import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

const SERVICE_ICONS = {
  'Cosmetic Dentistry':   '✦', 'Orthodontics':         '◎',
  'Dental Implants':      '⬡', 'General Dentistry':    '◈',
  'Endodontics':          '◉', 'Periodontics':         '❋',
  'Restorative Dentistry':'◆', 'Pediatric Dentistry':  '★',
}
const SERVICE_COLORS = {
  'Cosmetic Dentistry':   'from-blue-500 to-cyan-400',
  'Orthodontics':         'from-violet-500 to-purple-400',
  'Dental Implants':      'from-teal-500 to-emerald-400',
  'General Dentistry':    'from-brand-500 to-blue-400',
  'Endodontics':          'from-orange-500 to-amber-400',
  'Periodontics':         'from-pink-500 to-rose-400',
  'Restorative Dentistry':'from-indigo-500 to-blue-400',
  'Pediatric Dentistry':  'from-green-500 to-teal-400',
}

function StatCard({ num, label, icon, delay }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref}
      className={`stat-pill gap-1 transition-all duration-700 ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      style={{ transitionDelay: `${delay}ms` }}>
      <span className="text-2xl mb-1">{icon}</span>
      <span className="text-2xl font-extrabold text-brand-600">{num}</span>
      <span className="text-slate-500 text-xs text-center leading-snug">{label}</span>
    </div>
  )
}

function ServiceCard({ svc, pick, index }) {
  const gradient = SERVICE_COLORS[svc.category] || 'from-brand-500 to-teal-400'
  const icon     = SERVICE_ICONS[svc.category]  || '◆'
  return (
    <div className="group relative bg-white rounded-2xl border border-slate-100 overflow-hidden hover:-translate-y-1.5 hover:shadow-hover transition-all duration-200 reveal"
      style={{ transitionDelay: `${index * 60}ms` }}>
      <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
      <div className="p-6">
        <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl mb-4 shadow-md`}>
          {icon}
        </div>
        <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-slate-400 mb-2 block">
          {pick({ en: svc.category, ar: svc.categoryAr })}
        </span>
        <h3 className="font-bold text-slate-800 text-lg leading-snug mb-2">{pick({ en: svc.nameEn, ar: svc.nameAr })}</h3>
        <p className="text-slate-500 text-sm leading-relaxed line-clamp-2 mb-4">{pick({ en: svc.descriptionEn, ar: svc.descriptionAr })}</p>
        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
          <span className="text-brand-600 font-bold text-sm">{pick({ en: svc.priceRange, ar: svc.priceRangeAr })}</span>
          <span className="text-slate-400 text-xs">⏱ {pick({ en: svc.duration, ar: svc.durationAr })}</span>
        </div>
      </div>
      {/* CSS hover overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradient} flex flex-col items-center justify-center gap-4 p-6 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none group-hover:pointer-events-auto`}>
        <span className="text-white text-4xl">{icon}</span>
        <h3 className="font-bold text-white text-xl text-center">{pick({ en: svc.nameEn, ar: svc.nameAr })}</h3>
        <p className="text-white/80 text-sm text-center leading-relaxed line-clamp-4">{pick({ en: svc.descriptionEn, ar: svc.descriptionAr })}</p>
        <Link to="/booking" className="mt-2 px-6 py-2.5 bg-white text-brand-600 font-bold rounded-xl text-sm hover:bg-slate-50 transition-colors shadow-lg">
          {pick({ en: 'Book This →', ar: '← احجز' })}
        </Link>
      </div>
    </div>
  )
}

function DoctorCard({ doc, pick, index }) {
  return (
    <div className="group bg-white rounded-2xl border border-slate-100 overflow-hidden hover:-translate-y-1.5 hover:shadow-hover transition-all duration-200 reveal"
      style={{ transitionDelay: `${index * 80}ms` }}>
      <div className="relative aspect-[4/3] bg-gradient-to-br from-brand-50 to-teal-50 overflow-hidden">
        <img src={doc.photo} alt={doc.nameEn}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={e => { e.target.style.display='none' }}/>
        <div className="absolute inset-0 bg-white/90 backdrop-blur-sm p-5 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex flex-wrap gap-1 mb-2">
            {(pick({ en: doc.specialtiesEn, ar: doc.specialtiesAr }) || '').split(',').slice(0,3).map(s => (
              <span key={s} className="text-[9px] bg-brand-100 text-brand-600 px-2 py-0.5 rounded-full border border-brand-200">{s.trim()}</span>
            ))}
          </div>
          <p className="text-slate-600 text-xs leading-relaxed line-clamp-5">{pick({ en: doc.bioEn, ar: doc.bioAr })}</p>
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-brand-600 shadow-sm">
          {doc.yearsExp}yr exp
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-slate-800 text-sm">{pick({ en: doc.nameEn, ar: doc.nameAr })}</h3>
        <p className="text-slate-400 text-xs mt-0.5 line-clamp-2">{pick({ en: doc.titleEn, ar: doc.titleAr })}</p>
      </div>
    </div>
  )
}

function TestimonialCard({ t, pick }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 p-6 flex flex-col gap-4 min-w-[300px] max-w-[340px] flex-shrink-0 hover:-translate-y-1 hover:shadow-hover transition-all duration-200">
      <div className="flex gap-0.5">
        {Array.from({ length: t.rating }).map((_, i) => <span key={i} className="text-amber-400 text-sm">★</span>)}
      </div>
      <p className="text-slate-600 text-sm leading-relaxed flex-1 italic">"{pick({ en: t.textEn, ar: t.textAr })}"</p>
      <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-brand-400 to-teal-400 flex items-center justify-center text-white font-bold text-sm">
          {(pick({ en: t.nameEn, ar: t.nameAr }) || '').charAt(0)}
        </div>
        <div>
          <p className="font-semibold text-slate-800 text-sm">{pick({ en: t.nameEn, ar: t.nameAr })}</p>
          <p className="text-teal-600 text-xs">{t.service}</p>
        </div>
      </div>
    </div>
  )
}

function TrustBadge({ icon, label }) {
  return (
    <div className="flex items-center gap-3 bg-white rounded-2xl px-5 py-3.5 shadow-card border border-slate-100 hover:scale-105 transition-transform duration-150">
      <span className="text-brand-500 text-xl">{icon}</span>
      <span className="text-slate-700 text-sm font-semibold whitespace-nowrap">{label}</span>
    </div>
  )
}

export default function Home() {
  const { pick }                       = useLang()
  const { content, doctors, services } = useContent()
  const revealRef                      = useScrollReveal()
  const [heroY, setHeroY]              = useState(0)

  useEffect(() => {
    const fn = () => setHeroY(window.scrollY * 0.3)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  const h                = content?.home || {}
  const testimonials     = content?.testimonials || []
  const featuredServices = (services || []).filter(s => s.featured).slice(0, 6)
  const featuredDoctors  = (doctors  || []).filter(d => d.featured).slice(0, 4)

  return (
    <div ref={revealRef} className="overflow-x-hidden">

      {/* HERO */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
        <div className="absolute inset-0 pointer-events-none" style={{ transform: `translateY(${heroY}px)` }}>
          <div className="absolute top-20 right-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-br from-brand-200/30 to-teal-200/20 blur-3xl" />
          <div className="absolute bottom-10 left-[-8%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-teal-200/25 to-brand-200/15 blur-3xl" />
        </div>

        {/* Floating decorative teeth — pure CSS animation */}
        <div className="absolute top-28 right-[8%] hidden xl:block opacity-20 animate-float">
          <svg width="70" height="70" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.5 2 5 5 5 9c0 3 2 5.5 3.5 7L10 21h4l1.5-5C17 14.5 19 12 19 9c0-4-3.5-7-7-7z" fill="#0066CC"/>
          </svg>
        </div>
        <div className="absolute bottom-32 left-[6%] hidden xl:block opacity-15 animate-float-alt">
          <svg width="50" height="50" viewBox="0 0 24 24" fill="none">
            <path d="M12 2C8.5 2 5 5 5 9c0 3 2 5.5 3.5 7L10 21h4l1.5-5C17 14.5 19 12 19 9c0-4-3.5-7-7-7z" fill="#00B5B0"/>
          </svg>
        </div>

        <div className="relative max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-14 items-center py-16">
          {/* Left copy */}
          <div className="animate-fade-up">
            <span className="section-tag">
              🦷 {pick({ en: 'Dubai\'s Premier Dental Clinic', ar: 'عيادة الأسنان الأولى في دبي' })}
            </span>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-slate-900 leading-[1.06] mt-3 mb-5">
              {pick({ en: h.heroTitleEn || 'Crafting Smiles That Last a Lifetime', ar: h.heroTitleAr || 'نصنع ابتسامات تدوم مدى الحياة' })}
            </h1>
            <p className="text-slate-500 text-lg leading-relaxed mb-8 max-w-lg">
              {pick({ en: h.heroSubtitleEn || 'Where dental science meets artistic vision.', ar: h.heroSubtitleAr || 'حيث يلتقي علم الأسنان بالرؤية الفنية.' })}
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/booking" className="btn-primary text-base px-8 py-4">
                {pick({ en: h.heroCTAEn || 'Book Free Consultation', ar: h.heroCTAAr || 'احجز استشارة مجانية' })}
              </Link>
              <Link to="/services" className="btn-outline text-base px-8 py-4">
                {pick({ en: 'Explore Treatments', ar: 'استكشف العلاجات' })}
              </Link>
            </div>
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { icon:'✓', en:'JCI Accredited', ar:'معتمدة JCI' },
                { icon:'✓', en:'Pain-Free Protocols', ar:'بدون ألم' },
                { icon:'✓', en:'Same-Day Crowns', ar:'تيجان في يوم' },
              ].map(b => (
                <span key={b.en} className="flex items-center gap-1.5 text-sm text-slate-600 font-medium">
                  <span className="w-5 h-5 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center text-xs font-bold">{b.icon}</span>
                  {pick(b)}
                </span>
              ))}
            </div>
          </div>

          {/* Right — card cluster */}
          <div className="relative hidden lg:block animate-fade-up-d1">
            <div className="bg-white rounded-3xl shadow-hover overflow-hidden border border-slate-100">
              <div className="h-72 bg-gradient-to-br from-brand-100 to-teal-50 flex items-center justify-center">
                <svg width="140" height="160" viewBox="0 0 140 160" fill="none">
                  <ellipse cx="70" cy="80" rx="55" ry="65" fill="#EBF5FF"/>
                  <path d="M70 20C50 20 30 38 30 58c0 18 12 34 20 44l8 30h24l8-30c8-10 20-26 20-44 0-20-20-38-40-38z" fill="#0066CC" opacity=".15"/>
                  <path d="M70 25C52 25 35 41 35 58c0 16 10 30 18 40l7 27h20l7-27c8-10 18-24 18-40 0-17-17-33-35-33z" fill="#0066CC" opacity=".25"/>
                  <path d="M70 30C54 30 40 44 40 58c0 14 8 26 16 36l6 24h16l6-24c8-10 16-22 16-36 0-14-14-28-30-28z" fill="#0066CC" opacity=".5"/>
                  <circle cx="70" cy="55" r="10" fill="#00B5B0" opacity=".8"/>
                  <rect x="58" y="75" width="24" height="3" rx="1.5" fill="white" opacity=".7"/>
                  <rect x="62" y="81" width="16" height="3" rx="1.5" fill="white" opacity=".5"/>
                </svg>
              </div>
              <div className="p-5">
                <p className="font-bold text-slate-800">{pick({ en: 'Digital Smile Design', ar: 'تصميم الابتسامة الرقمي' })}</p>
                <p className="text-slate-400 text-sm mt-1">{pick({ en: 'See your new smile before treatment begins', ar: 'شاهد ابتسامتك الجديدة قبل بدء العلاج' })}</p>
              </div>
            </div>
            {/* Floating stat chips */}
            {[
              { icon:'🏅', label:{ en:'98.7% Implant Success', ar:'98.7% نجاح الزراعة' }, pos:'top-4 -left-16' },
              { icon:'⭐', label:{ en:'5-Star Patient Rating', ar:'تقييم 5 نجوم' }, pos:'bottom-16 -left-14' },
              { icon:'🚀', label:{ en:'Same-Day Results', ar:'نتائج فورية' }, pos:'-top-2 right-4' },
            ].map((chip, i) => (
              <div key={i}
                className={`absolute ${chip.pos} bg-white rounded-2xl shadow-hover border border-slate-100 px-4 py-2.5 flex items-center gap-2.5 animate-fade-up-d2`}
                style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                <span className="text-lg">{chip.icon}</span>
                <span className="text-xs font-bold text-slate-700 whitespace-nowrap">{pick(chip.label)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust badges */}
        <div className="absolute bottom-6 left-0 right-0 overflow-x-auto scrollbar-none px-6">
          <div className="flex gap-3 justify-center min-w-max mx-auto">
            <TrustBadge icon="🏆" label={pick({ en: h.trustBadge1En || '18+ Years of Excellence', ar: h.trustBadge1Ar || '+18 عاماً' })} />
            <TrustBadge icon="😁" label={pick({ en: h.trustBadge2En || '10,000+ Smiles', ar: h.trustBadge2Ar || '+10,000 ابتسامة' })} />
            <TrustBadge icon="👨‍⚕️" label={pick({ en: h.trustBadge3En || '6 Specialists', ar: h.trustBadge3Ar || '6 متخصصين' })} />
            <TrustBadge icon="🌍" label={pick({ en: h.trustBadge4En || 'International Accreditation', ar: h.trustBadge4Ar || 'اعتماد دولي' })} />
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num:'18+',   label:{ en:'Years of Experience', ar:'سنوات الخبرة' },        icon:'🎯', delay:0 },
              { num:'10K+',  label:{ en:'Patients Treated', ar:'مريض تمت معالجتهم' },     icon:'😁', delay:100 },
              { num:'98.7%', label:{ en:'Implant Success Rate', ar:'معدل نجاح الزراعة' }, icon:'✅', delay:200 },
              { num:'6',     label:{ en:'Dental Specialties', ar:'تخصصات طب أسنان' },     icon:'🏅', delay:300 },
            ].map(s => <StatCard key={s.num} {...s} label={pick(s.label)} />)}
          </div>
        </div>
      </section>

      {/* SERVICES */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <span className="section-tag">🦷 {pick({ en: 'What We Offer', ar: 'ما نقدمه' })}</span>
            <h2 className="section-heading">{pick({ en: h.servicesHeadingEn || 'Our Signature Services', ar: h.servicesHeadingAr || 'خدماتنا المميزة' })}</h2>
            <p className="section-sub mx-auto text-center">{pick({ en: h.servicesSubEn, ar: h.servicesSubAr })}</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featuredServices.map((svc, i) => <ServiceCard key={svc.id} svc={svc} pick={pick} index={i} />)}
          </div>
          <div className="text-center mt-10 reveal">
            <Link to="/services" className="btn-outline">{pick({ en: 'View All 16 Services →', ar: '← عرض جميع الخدمات الـ 16' })}</Link>
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="section-tag reveal">⚕️ {pick({ en: 'Why Choose Us', ar: 'لماذا تختارنا' })}</span>
              <h2 className="section-heading mt-1 mb-5 reveal">{pick({ en: 'Dental Care Elevated to an Art Form', ar: 'رعاية الأسنان ترقى إلى مستوى الفن' })}</h2>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 reveal">
                {pick({ en: 'SmileCraft combines state-of-the-art technology with a deeply human touch.', ar: 'تجمع سمايل كرافت بين أحدث التقنيات واللمسة الإنسانية العميقة.' })}
              </p>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { en:'Digital Smile Design', ar:'تصميم الابتسامة الرقمي', icon:'🖥️' },
                  { en:'3D Implant Planning', ar:'تخطيط الزراعة ثلاثي الأبعاد', icon:'🔬' },
                  { en:'Pain-Free Protocols', ar:'بروتوكولات بلا ألم', icon:'💊' },
                  { en:'Same-Day Crowns', ar:'تيجان في يوم واحد', icon:'⚡' },
                  { en:'JCI Accredited Clinic', ar:'عيادة معتمدة JCI', icon:'🏅' },
                  { en:'All Insurance Accepted', ar:'جميع التأمينات مقبولة', icon:'🛡️' },
                ].map((f, i) => (
                  <div key={f.en}
                    className="reveal flex items-center gap-3 p-3.5 rounded-xl bg-slate-50 hover:bg-brand-50 border border-slate-100 hover:border-brand-200 transition-all duration-200"
                    style={{ transitionDelay: `${i * 60}ms` }}>
                    <span className="text-xl">{f.icon}</span>
                    <span className="text-slate-700 text-sm font-medium">{pick(f)}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              {[
                { step:'01', en:'Book a Free Consultation', ar:'احجز استشارة مجانية', sub:{ en:'Same-day appointments available', ar:'مواعيد في نفس اليوم متاحة' }, icon:'📅' },
                { step:'02', en:'Digital Treatment Planning', ar:'تخطيط العلاج الرقمي', sub:{ en:'3D imaging & smile preview', ar:'تصوير ثلاثي الأبعاد وعرض الابتسامة' }, icon:'🖥️' },
                { step:'03', en:'Expert Clinical Care', ar:'رعاية سريرية متخصصة', sub:{ en:'Painless, precision procedures', ar:'إجراءات دقيقة بلا ألم' }, icon:'🦷' },
                { step:'04', en:'Long-Term Follow-Up', ar:'متابعة طويلة الأمد', sub:{ en:'We stay with you after treatment', ar:'نظل معك بعد العلاج' }, icon:'💙' },
              ].map((s, i) => (
                <div key={s.step}
                  className="reveal flex gap-4 p-5 bg-white rounded-2xl border border-slate-100 hover:border-brand-200 hover:shadow-card transition-all duration-200 group"
                  style={{ transitionDelay: `${i * 100}ms` }}>
                  <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-50 group-hover:bg-brand-500 flex items-center justify-center text-2xl transition-colors duration-200">
                    {s.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-bold text-brand-400">{s.step}</span>
                      <h4 className="font-bold text-slate-800 text-sm">{pick({ en: s.en, ar: s.ar })}</h4>
                    </div>
                    <p className="text-slate-400 text-xs">{pick(s.sub)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* DOCTORS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <span className="section-tag">👨‍⚕️ {pick({ en: 'Our Team', ar: 'فريقنا' })}</span>
            <h2 className="section-heading">{pick({ en: h.doctorsHeadingEn || 'Meet Our Expert Team', ar: h.doctorsHeadingAr || 'تعرف على فريقنا الخبير' })}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {featuredDoctors.map((doc, i) => <DoctorCard key={doc.id} doc={doc} pick={pick} index={i} />)}
          </div>
          <div className="text-center mt-10 reveal">
            <Link to="/about" className="btn-outline">{pick({ en: 'Meet All 6 Doctors →', ar: '← تعرف على جميع الأطباء الـ 6' })}</Link>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-20 bg-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12 reveal">
            <span className="section-tag">💬 {pick({ en: 'Patient Stories', ar: 'قصص المرضى' })}</span>
            <h2 className="section-heading">{pick({ en: h.testimonialsHeadingEn || 'What Our Patients Say', ar: h.testimonialsHeadingAr || 'ماذا يقول مرضانا' })}</h2>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-none pb-4">
            {testimonials.map((t, i) => <TestimonialCard key={i} t={t} pick={pick} />)}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="py-24 bg-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #0066CC 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
        <div className="relative max-w-3xl mx-auto text-center px-6 reveal">
          <span className="inline-block text-4xl mb-4 animate-tooth">🦷</span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 leading-tight">
            {pick({ en: h.ctaHeadingEn || 'Ready to Transform Your Smile?', ar: h.ctaHeadingAr || 'هل أنت مستعد لتحويل ابتسامتك؟' })}
          </h2>
          <p className="text-slate-500 text-base mb-10 leading-relaxed max-w-xl mx-auto">
            {pick({ en: h.ctaSubEn, ar: h.ctaSubAr })}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/booking" className="btn-primary text-base px-10 py-4">
              {pick({ en: 'Book Free Consultation', ar: 'احجز استشارة مجانية' })}
            </Link>
            <Link to="/contact"
              className="inline-flex items-center justify-center gap-2 px-10 py-4 bg-white hover:bg-slate-50 text-brand-600 font-semibold rounded-2xl border-2 border-brand-200 transition-all text-base">
              {pick({ en: 'Contact Us', ar: 'تواصل معنا' })}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
