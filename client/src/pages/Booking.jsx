import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'

const STEPS = [
  { en: 'Personal Info', ar: 'بياناتك' },
  { en: 'Service', ar: 'الخدمة' },
  { en: 'Date & Time', ar: 'الموعد' },
  { en: 'Confirm', ar: 'التأكيد' },
]

const TIMES = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM']

const INSURANCE = ['Daman','AXA Gulf','Bupa Arabia','MetLife','Cigna','Allianz Care','Oman Insurance','Self-Pay']

const ICONS = { 'Cosmetic Dentistry':'✦','Orthodontics':'◎','Dental Implants':'⬡','General Dentistry':'◈','Endodontics':'◉','Periodontics':'❋','Restorative Dentistry':'◆','Pediatric Dentistry':'★' }

function StepIndicator({ current, pick }) {
  return (
    <div className="flex items-center justify-center gap-2 mb-10">
      {STEPS.map((s, i) => (
        <div key={i} className="flex items-center gap-2">
          <div className="flex items-center gap-2">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all ${
              i < current ? 'bg-brand-500 border-brand-500 text-white' :
              i === current ? 'border-brand-500 text-brand-500 bg-white' :
              'border-slate-200 text-slate-300 bg-white'
            }`}>
              {i < current ? '✓' : i + 1}
            </div>
            <span className={`hidden sm:block text-xs font-semibold transition-colors ${i === current ? 'text-brand-600' : i < current ? 'text-teal-600' : 'text-slate-300'}`}>
              {pick(s)}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`w-8 h-0.5 transition-all mx-1 ${i < current ? 'bg-brand-400' : 'bg-slate-200'}`} />
          )}
        </div>
      ))}
    </div>
  )
}

export default function Booking() {
  const { pick } = useLang()
  const { services, content } = useContent()
  const [step, setStep] = useState(0)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    firstName:'', lastName:'', phone:'', email:'', insurance:'',
    serviceId:'', date:'', time:'', notes:'',
  })

  const contact = content?.contact || {}
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))
  const selectedService = (services || []).find(s => s.id === form.serviceId)

  const next = () => setStep(s => Math.min(s+1, 3))
  const prev = () => setStep(s => Math.max(s-1, 0))

  const canNext = () => {
    if (step === 0) return form.firstName && form.lastName && form.phone && form.email
    if (step === 1) return !!form.serviceId
    if (step === 2) return form.date && form.time
    return true
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-6 pt-20">
        <motion.div initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
          className="bg-white rounded-3xl border border-slate-100 shadow-hover p-12 max-w-md w-full text-center">
          <motion.div initial={{ scale:0 }} animate={{ scale:1 }} transition={{ type:'spring', stiffness:260, damping:18 }}
            className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center mx-auto mb-6 text-4xl">✓</motion.div>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{pick({ en:'Booking Confirmed!', ar:'تم تأكيد الحجز!' })}</h2>
          <p className="text-slate-400 text-sm leading-relaxed mb-2">
            {pick({ en:`Thank you, ${form.firstName}. We'll send a confirmation to ${form.email} shortly.`, ar:`شكراً لك، ${form.firstName}. سنرسل تأكيداً إلى ${form.email} قريباً.` })}
          </p>
          <p className="text-brand-500 font-semibold text-sm mb-8">{form.date} · {form.time}</p>
          <button onClick={() => { setSubmitted(false); setStep(0); setForm({ firstName:'',lastName:'',phone:'',email:'',insurance:'',serviceId:'',date:'',time:'',notes:'' }) }}
            className="btn-outline w-full justify-center">
            {pick({ en:'Book Another Appointment', ar:'احجز موعداً آخر' })}
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="pt-28 pb-20 min-h-screen bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="section-tag">📅 {pick({ en:'Reserve Your Visit', ar:'احجز زيارتك' })}</span>
          <h1 className="section-heading mt-2 mb-3">{pick({ en:'Book an Appointment', ar:'احجز موعداً' })}</h1>
          <p className="text-slate-400 text-sm">{pick({ en:"Complete the steps below. We'll confirm within 2 hours.", ar:'أكمل الخطوات أدناه. سنؤكد خلال ساعتين.' })}</p>
        </div>

        <StepIndicator current={step} pick={pick} />

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form card */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-8">
              <AnimatePresence mode="wait">
                <motion.div key={step} initial={{ opacity:0, x:20 }} animate={{ opacity:1, x:0 }} exit={{ opacity:0, x:-20 }} transition={{ duration:0.2 }}>

                  {/* Step 0 */}
                  {step === 0 && (
                    <div className="space-y-4">
                      <h2 className="text-xl font-bold text-slate-800 mb-5">{pick({ en:'Personal Information', ar:'المعلومات الشخصية' })}</h2>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { k:'firstName', label:{ en:'First Name', ar:'الاسم الأول' } },
                          { k:'lastName',  label:{ en:'Last Name',  ar:'اسم العائلة' } },
                        ].map(f => (
                          <div key={f.k}>
                            <label className="block text-xs font-semibold text-slate-500 mb-1.5">{pick(f.label)} *</label>
                            <input className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                              value={form[f.k]} onChange={e => set(f.k, e.target.value)} />
                          </div>
                        ))}
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">{pick({ en:'Phone Number', ar:'رقم الهاتف' })} *</label>
                        <input type="tel" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                          value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="+971 50 000 0000" />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">{pick({ en:'Email Address', ar:'البريد الإلكتروني' })} *</label>
                        <input type="email" className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                          value={form.email} onChange={e => set('email', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">{pick({ en:'Insurance Provider', ar:'شركة التأمين' })}</label>
                        <select className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all bg-white"
                          value={form.insurance} onChange={e => set('insurance', e.target.value)}>
                          <option value="">{pick({ en:'Select insurance…', ar:'اختر التأمين…' })}</option>
                          {INSURANCE.map(ins => <option key={ins} value={ins}>{ins}</option>)}
                        </select>
                      </div>
                    </div>
                  )}

                  {/* Step 1 */}
                  {step === 1 && (
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 mb-5">{pick({ en:'Select a Service', ar:'اختر الخدمة' })}</h2>
                      <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
                        {(services || []).map(svc => (
                          <button key={svc.id} onClick={() => set('serviceId', svc.id)}
                            className={`w-full text-left p-4 rounded-xl border transition-all duration-200 ${
                              form.serviceId === svc.id
                                ? 'border-brand-400 bg-brand-50 shadow-sm'
                                : 'border-slate-100 hover:border-slate-200 bg-white hover:bg-slate-50'
                            }`}>
                            <div className="flex justify-between items-start gap-3">
                              <div className="flex items-center gap-3">
                                <span className={`w-8 h-8 rounded-lg flex-shrink-0 flex items-center justify-center text-sm ${form.serviceId === svc.id ? 'bg-brand-500 text-white' : 'bg-slate-100 text-slate-500'}`}>
                                  {ICONS[svc.category] || '◆'}
                                </span>
                                <div>
                                  <p className="text-slate-800 text-sm font-semibold">{pick({ en:svc.nameEn, ar:svc.nameAr })}</p>
                                  <p className="text-slate-400 text-xs">{pick({ en:svc.category, ar:svc.categoryAr })}</p>
                                </div>
                              </div>
                              <div className="text-right flex-shrink-0">
                                <p className="text-brand-600 text-sm font-bold">{pick({ en:svc.priceRange, ar:svc.priceRangeAr })}</p>
                                <p className="text-slate-400 text-xs">{pick({ en:svc.duration, ar:svc.durationAr })}</p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Step 2 */}
                  {step === 2 && (
                    <div className="space-y-6">
                      <h2 className="text-xl font-bold text-slate-800 mb-5">{pick({ en:'Choose Date & Time', ar:'اختر التاريخ والوقت' })}</h2>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">{pick({ en:'Preferred Date', ar:'التاريخ المفضل' })} *</label>
                        <input type="date" min={new Date().toISOString().split('T')[0]}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
                          value={form.date} onChange={e => set('date', e.target.value)} />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-2">{pick({ en:'Available Times', ar:'الأوقات المتاحة' })} *</label>
                        <div className="grid grid-cols-3 gap-2">
                          {TIMES.map(t => (
                            <button key={t} onClick={() => set('time', t)}
                              className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                                form.time === t
                                  ? 'bg-brand-500 text-white shadow-md'
                                  : 'bg-slate-50 text-slate-600 hover:bg-brand-50 hover:text-brand-600 border border-slate-200'
                              }`}>
                              {t}
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 mb-1.5">{pick({ en:'Additional Notes', ar:'ملاحظات إضافية' })}</label>
                        <textarea rows={3}
                          className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all resize-none"
                          value={form.notes} onChange={e => set('notes', e.target.value)}
                          placeholder={pick({ en:'Any concerns for your doctor…', ar:'أي مخاوف لطبيبك…' })} />
                      </div>
                    </div>
                  )}

                  {/* Step 3 */}
                  {step === 3 && (
                    <div>
                      <h2 className="text-xl font-bold text-slate-800 mb-5">{pick({ en:'Confirm Your Booking', ar:'تأكيد حجزك' })}</h2>
                      <div className="bg-brand-50 rounded-2xl p-6 space-y-3 mb-6">
                        {[
                          { label:{ en:'Name', ar:'الاسم' }, value:`${form.firstName} ${form.lastName}` },
                          { label:{ en:'Phone', ar:'الهاتف' }, value:form.phone },
                          { label:{ en:'Email', ar:'البريد' }, value:form.email },
                          { label:{ en:'Insurance', ar:'التأمين' }, value:form.insurance || pick({ en:'Not provided', ar:'غير محدد' }) },
                          { label:{ en:'Service', ar:'الخدمة' }, value:selectedService ? pick({ en:selectedService.nameEn, ar:selectedService.nameAr }) : '-' },
                          { label:{ en:'Date', ar:'التاريخ' }, value:form.date },
                          { label:{ en:'Time', ar:'الوقت' }, value:form.time },
                        ].map(row => (
                          <div key={row.label.en} className="flex justify-between items-center text-sm border-b border-brand-100 pb-2 last:border-0 last:pb-0">
                            <span className="text-slate-500">{pick(row.label)}</span>
                            <span className="text-slate-800 font-semibold">{row.value}</span>
                          </div>
                        ))}
                        {selectedService && (
                          <div className="flex justify-between items-center text-sm pt-2">
                            <span className="text-slate-500">{pick({ en:'Estimated Cost', ar:'التكلفة التقديرية' })}</span>
                            <span className="text-brand-600 font-bold">{pick({ en:selectedService.priceRange, ar:selectedService.priceRangeAr })}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation */}
              <div className="flex justify-between mt-8 pt-6 border-t border-slate-100">
                <button onClick={prev} disabled={step===0}
                  className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 text-sm disabled:opacity-30 hover:bg-slate-50 transition-all font-medium">
                  {pick({ en:'← Back', ar:'رجوع →' })}
                </button>
                {step < 3 ? (
                  <button onClick={next} disabled={!canNext()} className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed">
                    {pick({ en:'Continue →', ar:'← متابعة' })}
                  </button>
                ) : (
                  <button onClick={() => setSubmitted(true)} className="btn-primary px-10">
                    {pick({ en:'Confirm Booking ✓', ar:'تأكيد الحجز ✓' })}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
              <h3 className="font-bold text-slate-800 text-sm mb-3">🕐 {pick({ en:'Clinic Hours', ar:'ساعات العمل' })}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">
                {pick({ en:contact.hoursEn, ar:contact.hoursAr }) ||
                  pick({ en:'Mon–Thu: 9AM–8PM | Fri: 9AM–6PM | Sat: 10AM–5PM', ar:'الاثنين–الخميس: 9ص–8م | الجمعة: 9ص–6م | السبت: 10ص–5م' })}
              </p>
            </div>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
              <h3 className="font-bold text-slate-800 text-sm mb-3">🛡️ {pick({ en:'Insurance Partners', ar:'شركاء التأمين' })}</h3>
              <div className="flex flex-wrap gap-1.5">
                {INSURANCE.slice(0,-1).map(ins => (
                  <span key={ins} className="text-[10px] bg-slate-100 text-slate-600 px-2.5 py-1 rounded-full font-medium">{ins}</span>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border-2 border-red-100 p-6">
              <h3 className="font-bold text-sm mb-2 text-red-600">🚨 {pick({ en:'Dental Emergency?', ar:'طوارئ أسنان؟' })}</h3>
              <p className="text-slate-400 text-xs mb-3">{pick({ en:'Call our 24/7 emergency line:', ar:'اتصل بخط الطوارئ 24/7:' })}</p>
              <a href="tel:+97141234599" className="text-red-500 font-bold hover:underline">+971 4 123 4599</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
