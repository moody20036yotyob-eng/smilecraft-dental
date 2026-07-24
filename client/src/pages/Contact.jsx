import { useState } from 'react'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'
import { useScrollReveal } from '../hooks/useScrollReveal'

export default function Contact() {
  const { pick } = useLang()
  const { content } = useContent()
  const ref = useScrollReveal()
  const ci = content?.contact || {}
  const [form, setForm] = useState({ name:'', email:'', phone:'', subject:'', message:'' })
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  const submit = async e => {
    e.preventDefault()
    setSending(true)
    await new Promise(r => setTimeout(r, 900))
    setSent(true)
    setSending(false)
  }

  const info = [
    { icon:'📍', label:{ en:'Address', ar:'العنوان' }, val:{ en: ci.addressEn || 'Tower 5, Healthcare City, Dubai', ar: ci.addressAr || 'برج 5، مدينة الرعاية الصحية، دبي' } },
    { icon:'📞', label:{ en:'Phone', ar:'الهاتف' }, val:{ en: ci.phone || '+971 4 123 4567', ar: ci.phone || '+971 4 123 4567' }, href:`tel:${(ci.phone||'').replace(/\s/g,'')}` },
    { icon:'✉️', label:{ en:'Email', ar:'البريد الإلكتروني' }, val:{ en: ci.email || 'hello@smilecraftdental.ae', ar: ci.email || 'hello@smilecraftdental.ae' }, href:`mailto:${ci.email||''}` },
    { icon:'🕐', label:{ en:'Hours', ar:'ساعات العمل' }, val:{ en: ci.hoursEn || 'Mon–Sat: 9 AM – 8 PM', ar: ci.hoursAr || 'الاثنين–السبت: 9ص – 8م' } },
  ]

  return (
    <div ref={ref} className="min-h-screen bg-white pt-24 pb-20">
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="section-tag">📬 {pick({ en: 'Contact Us', ar: 'تواصل معنا' })}</span>
          <h1 className="section-heading mt-2 mb-4">{pick({ en: "We're Here For You", ar: 'نحن هنا من أجلك' })}</h1>
          <p className="section-sub mx-auto text-center">{pick({ en: 'Reach out with any questions, or book directly below.', ar: 'تواصل معنا بأي استفسار، أو احجز مباشرة أدناه.' })}</p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-10">
        <div className="space-y-4">
          {info.map((item, i) => (
            <div key={i}
              className="reveal bg-white rounded-2xl border border-slate-100 p-5 flex gap-4 items-start hover:shadow-card hover:border-brand-100 transition-all duration-200"
              style={{ transitionDelay: `${i * 70}ms` }}>
              <div className="w-11 h-11 rounded-xl bg-brand-50 flex items-center justify-center text-xl flex-shrink-0">{item.icon}</div>
              <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mb-0.5">{pick(item.label)}</p>
                {item.href
                  ? <a href={item.href} className="text-slate-700 text-sm font-medium hover:text-brand-500 transition-colors">{pick(item.val)}</a>
                  : <p className="text-slate-700 text-sm font-medium">{pick(item.val)}</p>}
              </div>
            </div>
          ))}

          <div className="reveal bg-red-50 rounded-2xl border border-red-100 p-5 flex gap-4 items-center" style={{ transitionDelay: '280ms' }}>
            <div className="w-11 h-11 rounded-xl bg-red-100 flex items-center justify-center text-xl flex-shrink-0">🚨</div>
            <div>
              <p className="text-red-600 font-bold text-sm">{pick({ en: 'Dental Emergency', ar: 'طوارئ الأسنان' })}</p>
              <a href="tel:+97141234599" className="text-red-500 text-sm font-medium hover:underline">+971 4 123 4599</a>
              <p className="text-red-400 text-xs mt-0.5">{pick({ en: '24/7 Emergency Line', ar: 'خط طوارئ 24/7' })}</p>
            </div>
          </div>

          <div className="reveal rounded-2xl overflow-hidden border border-slate-100 h-48 bg-gradient-to-br from-brand-50 to-teal-50 flex items-center justify-center" style={{ transitionDelay: '350ms' }}>
            <div className="text-center">
              <span className="text-3xl block mb-2">🗺️</span>
              <p className="text-brand-600 font-semibold text-sm">{pick({ en: 'Healthcare City, Dubai', ar: 'مدينة الرعاية الصحية، دبي' })}</p>
            </div>
          </div>
        </div>

        <div className="reveal bg-white rounded-2xl border border-slate-100 p-8 shadow-card" style={{ transitionDelay: '100ms' }}>
          {sent ? (
            <div className="flex flex-col items-center justify-center h-full py-12 text-center">
              <div className="w-20 h-20 rounded-full bg-teal-100 flex items-center justify-center text-4xl mb-6 animate-fade-in-scale">✓</div>
              <h3 className="text-xl font-bold text-slate-800 mb-2">{pick({ en: 'Message Sent!', ar: 'تم الإرسال!' })}</h3>
              <p className="text-slate-400 text-sm">{pick({ en: "We'll get back to you within 2 hours.", ar: 'سنرد عليك خلال ساعتين.' })}</p>
            </div>
          ) : (
            <>
              <h2 className="text-xl font-bold text-slate-800 mb-6">{pick({ en: 'Send Us a Message', ar: 'أرسل لنا رسالة' })}</h2>
              <form onSubmit={submit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  {[
                    { k:'name',    label:{ en:'Full Name', ar:'الاسم الكامل' },          type:'text',  req:true },
                    { k:'email',   label:{ en:'Email', ar:'البريد الإلكتروني' },         type:'email', req:true },
                    { k:'phone',   label:{ en:'Phone', ar:'الهاتف' },                    type:'tel' },
                    { k:'subject', label:{ en:'Subject', ar:'الموضوع' },                 type:'text' },
                  ].map(f => (
                    <div key={f.k}>
                      <label className="block text-xs font-semibold text-slate-500 mb-1.5">{pick(f.label)}</label>
                      <input type={f.type} required={f.req} value={form[f.k]} onChange={set(f.k)}
                        className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"/>
                    </div>
                  ))}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">{pick({ en:'Message', ar:'الرسالة' })}</label>
                  <textarea rows={5} required value={form.message} onChange={set('message')}
                    className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm resize-none focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"/>
                </div>
                <button type="submit" disabled={sending}
                  className="btn-primary w-full justify-center text-sm py-3.5 disabled:opacity-60">
                  {sending ? '⏳ ' + pick({ en:'Sending…', ar:'جارٍ الإرسال…' }) : pick({ en:'Send Message', ar:'إرسال الرسالة' })}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
