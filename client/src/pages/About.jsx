import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'

function DoctorCard({ doc, pick, index }) {
  const [hovered, setHovered] = useState(false)
  return (
    <motion.div
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden"
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      whileHover={{ y: -5, boxShadow: '0 16px 40px rgba(0,102,204,0.14)' }}
    >
      <div className="relative aspect-square bg-gradient-to-br from-brand-50 to-teal-50 overflow-hidden">
        <img src={doc.photo} alt={doc.nameEn || ''}
          className={`w-full h-full object-cover transition-transform duration-500 ${hovered ? 'scale-105' : 'scale-100'}`}
          onError={e => { e.target.style.display='none' }}/>
        {hovered && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="absolute inset-0 bg-white/90 backdrop-blur-sm p-5 flex flex-col justify-end">
            <p className="text-slate-600 text-xs leading-relaxed line-clamp-6">
              {pick({ en: doc.bioEn, ar: doc.bioAr })}
            </p>
          </motion.div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2.5 py-1 rounded-full text-xs font-bold text-brand-600 shadow-sm">
          {doc.yearsExp}yr
        </div>
      </div>
      <div className="p-5">
        <h3 className="font-bold text-slate-800">{pick({ en: doc.nameEn, ar: doc.nameAr })}</h3>
        <p className="text-brand-500 text-xs font-semibold mt-0.5 mb-3">{pick({ en: doc.titleEn, ar: doc.titleAr })}</p>
        <div className="flex flex-wrap gap-1.5">
          {(pick({ en: doc.specialtiesEn, ar: doc.specialtiesAr }) || '').split(',').slice(0,3).map(s => (
            <span key={s} className="text-[10px] bg-brand-50 text-brand-600 px-2 py-0.5 rounded-full font-medium">
              {s.trim()}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function About() {
  const { pick } = useLang()
  const { content, doctors } = useContent()
  const ab = content?.about || {}

  const timeline = [
    { year:'2006', en:'SmileCraft founded by Dr. Sarah Al-Rashid', ar:'تأسيس سمايل كرافت على يد د. سارة الراشد' },
    { year:'2010', en:'Opened second branch in Healthcare City', ar:'افتتاح الفرع الثاني في مدينة الرعاية الصحية' },
    { year:'2015', en:'Achieved JCI Accreditation', ar:'حصل على اعتماد JCI' },
    { year:'2018', en:'Launched Digital Smile Design studio', ar:'إطلاق استوديو تصميم الابتسامة الرقمي' },
    { year:'2022', en:'10,000th patient milestone', ar:'الوصول للمريض العاشر ألف' },
    { year:'2024', en:'Expanded to full specialist centre', ar:'التوسع إلى مركز متخصصين كامل' },
  ]

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      {/* Hero */}
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <span className="section-tag">🏥 {pick({ en: 'About Us', ar: 'من نحن' })}</span>
          <h1 className="section-heading mt-2 mb-4">{pick({ en: ab.missionTitleEn || 'Our Story', ar: ab.missionTitleAr || 'قصتنا' })}</h1>
          <p className="section-sub mx-auto text-center">{pick({ en: ab.missionTextEn, ar: ab.missionTextAr })}</p>
        </div>
      </section>

      {/* Stats row */}
      <section className="py-12 bg-white">
        <div className="max-w-5xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { num:'18+', label:{ en:'Years of Excellence', ar:'سنوات التميز' }, icon:'🎯' },
            { num:'10K+', label:{ en:'Patients Treated', ar:'مريض' }, icon:'😁' },
            { num:'98.7%', label:{ en:'Success Rate', ar:'معدل النجاح' }, icon:'✅' },
            { num:'6', label:{ en:'Specialists', ar:'متخصصون' }, icon:'👨‍⚕️' },
          ].map((s, i) => (
            <motion.div key={s.num}
              initial={{ opacity:0, y:20 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
              className="stat-pill">
              <span className="text-2xl mb-1">{s.icon}</span>
              <span className="text-2xl font-extrabold text-brand-600">{s.num}</span>
              <span className="text-slate-500 text-xs text-center">{pick(s.label)}</span>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="section-tag">💙 {pick({ en: 'Our Values', ar: 'قيمنا' })}</span>
            <h2 className="section-heading">{pick({ en: 'What Drives Us', ar: 'ما يحركنا' })}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { icon:'🎯', en:'Clinical Precision', ar:'الدقة السريرية', sub:{ en:'Every procedure planned meticulously', ar:'كل إجراء مخطط بدقة' } },
              { icon:'💙', en:'Patient Compassion', ar:'الرعاية بالمريض', sub:{ en:'Your comfort is our first priority', ar:'راحتك أولويتنا' } },
              { icon:'🔬', en:'Innovation', ar:'الابتكار', sub:{ en:'Cutting-edge technology in every visit', ar:'أحدث التقنيات في كل زيارة' } },
              { icon:'🌍', en:'Inclusivity', ar:'الشمولية', sub:{ en:'Welcoming patients from 50+ nationalities', ar:'نستقبل مرضى من أكثر من 50 جنسية' } },
              { icon:'🏅', en:'Accredited Excellence', ar:'التميز المعتمد', sub:{ en:'JCI-certified standards of care', ar:'معايير رعاية معتمدة JCI' } },
              { icon:'♻️', en:'Sustainability', ar:'الاستدامة', sub:{ en:'Eco-conscious clinic operations', ar:'عمليات عيادة صديقة للبيئة' } },
            ].map((v, i) => (
              <motion.div key={v.en}
                className="bg-white rounded-2xl border border-slate-100 p-6 hover:shadow-hover hover:-translate-y-1 transition-all duration-250"
                initial={{ opacity:0, y:24 }} whileInView={{ opacity:1, y:0 }} viewport={{ once:true }} transition={{ delay:i*0.07 }}>
                <span className="text-3xl mb-4 block">{v.icon}</span>
                <h3 className="font-bold text-slate-800 mb-1">{pick(v)}</h3>
                <p className="text-slate-400 text-sm">{pick(v.sub)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="section-tag">📅 {pick({ en: 'Our Journey', ar: 'رحلتنا' })}</span>
            <h2 className="section-heading">{pick({ en: '18 Years of Growth', ar: '18 عاماً من النمو' })}</h2>
          </div>
          <div className="relative">
            <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-200 to-teal-200" />
            <div className="space-y-6">
              {timeline.map((t, i) => (
                <motion.div key={t.year}
                  initial={{ opacity:0, x:-30 }} whileInView={{ opacity:1, x:0 }} viewport={{ once:true }} transition={{ delay:i*0.1 }}
                  className="relative flex gap-8 items-start ps-14">
                  <div className="absolute left-0 w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-xs shadow-md">
                    {t.year.slice(2)}
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-5 flex-1 hover:bg-brand-50 hover:border-brand-100 border border-transparent transition-all">
                    <span className="text-brand-500 font-bold text-sm">{t.year}</span>
                    <p className="text-slate-700 text-sm mt-1">{pick(t)}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Doctors */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <span className="section-tag">👨‍⚕️ {pick({ en: 'Meet the Team', ar: 'تعرف على الفريق' })}</span>
            <h2 className="section-heading">{pick({ en: 'Our Specialist Doctors', ar: 'أطباؤنا المتخصصون' })}</h2>
            <p className="text-slate-400 text-sm mt-2">{pick({ en: 'Hover any card to read their bio', ar: 'مرر فوق أي بطاقة لقراءة السيرة الذاتية' })}</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
            {(doctors || []).map((doc, i) => <DoctorCard key={doc.id} doc={doc} pick={pick} index={i} />)}
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-3xl border-2 border-brand-100 p-10 text-center shadow-card">
          <h2 className="text-2xl font-bold text-slate-800 mb-3">{pick({ en: 'Ready to meet your dentist?', ar: 'هل أنت مستعد لمقابلة طبيبك؟' })}</h2>
          <p className="text-slate-500 text-sm mb-6">{pick({ en: 'Book a free consultation today.', ar: 'احجز استشارة مجانية اليوم.' })}</p>
          <Link to="/booking" className="btn-primary">
            {pick({ en: 'Book Free Consultation →', ar: '← احجز استشارة مجانية' })}
          </Link>
        </div>
      </div>
    </div>
  )
}
