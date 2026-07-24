import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { useContent } from '../context/ContentContext'

function FAQItem({ faq, pick, index }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      style={{ animationDelay: `${index * 40}ms` }}
      className={`reveal bg-white rounded-2xl border transition-all duration-250 overflow-hidden ${open ? 'border-brand-200 shadow-card' : 'border-slate-100 hover:border-slate-200 hover:shadow-sm'}`}>
      <button onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between gap-4 p-6 text-left">
        <span className={`font-semibold text-sm leading-snug ${open ? 'text-brand-600' : 'text-slate-800'}`}>
          {pick({ en: faq.questionEn, ar: faq.questionAr })}
        </span>
        <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-250 ${
          open ? 'bg-brand-500 text-white rotate-45' : 'bg-slate-100 text-slate-500'
        }`}>+</span>
      </button>
      <div className={`accordion-body ${open ? 'open' : ''}`}>
        <div>
          <div className="px-6 pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-100 pt-4">
            {pick({ en: faq.answerEn, ar: faq.answerAr })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function FAQ() {
  const { pick } = useLang()
  const { content } = useContent()
  const faqs = content?.faq || []
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? faqs.filter(f =>
        (f.questionEn || '').toLowerCase().includes(search.toLowerCase()) ||
        (f.answerEn   || '').toLowerCase().includes(search.toLowerCase()))
    : faqs

  return (
    <div className="min-h-screen bg-white pt-24 pb-20">
      <section className="bg-gradient-to-b from-slate-50 to-white py-16">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <span className="section-tag">❓ {pick({ en: 'FAQ', ar: 'الأسئلة الشائعة' })}</span>
          <h1 className="section-heading mt-2 mb-4">{pick({ en: 'Frequently Asked Questions', ar: 'الأسئلة الشائعة' })}</h1>
          <p className="section-sub mx-auto text-center mb-8">{pick({ en: 'Everything you need to know about your dental care.', ar: 'كل ما تحتاج معرفته عن رعاية أسنانك.' })}</p>
          <div className="relative max-w-md mx-auto">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm">🔍</span>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={pick({ en: 'Search questions…', ar: 'ابحث عن سؤال…' })}
              className="w-full pl-10 pr-4 py-3.5 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all"
            />
          </div>
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-6 py-12 space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <span className="text-4xl block mb-4">🔍</span>
            <p className="text-slate-500">{pick({ en: 'No results found. Try a different keyword.', ar: 'لا توجد نتائج. جرب كلمة مختلفة.' })}</p>
          </div>
        ) : (
          filtered.map((faq, i) => <FAQItem key={i} faq={faq} pick={pick} index={i} />)
        )}
      </div>

      <div className="max-w-3xl mx-auto px-6">
        <div className="bg-white rounded-3xl border-2 border-brand-100 p-10 text-center shadow-card">
          <span className="text-4xl block mb-4">💬</span>
          <h2 className="text-2xl font-bold text-slate-800 mb-2">{pick({ en: 'Still have questions?', ar: 'لا تزال لديك أسئلة؟' })}</h2>
          <p className="text-slate-500 text-sm mb-6">{pick({ en: 'Our team is happy to help — reach out anytime.', ar: 'فريقنا سعيد بمساعدتك — تواصل في أي وقت.' })}</p>
          <div className="flex flex-wrap gap-3 justify-center">
            <Link to="/contact" className="btn-primary">{pick({ en: 'Contact Us', ar: 'تواصل معنا' })}</Link>
            <Link to="/booking" className="btn-outline">{pick({ en: 'Book Appointment', ar: 'احجز موعداً' })}</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
