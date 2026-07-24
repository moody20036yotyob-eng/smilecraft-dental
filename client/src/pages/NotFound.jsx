import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function NotFound() {
  const { pick } = useLang()
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <div className="text-8xl mb-6 animate-fade-in-scale inline-block">🦷</div>
        <h1 className="text-7xl font-extrabold text-brand-500 mb-2 animate-fade-up">404</h1>
        <h2 className="text-2xl font-bold text-slate-800 mb-3 animate-fade-up-d1">
          {pick({ en: 'Page Not Found', ar: 'الصفحة غير موجودة' })}
        </h2>
        <p className="text-slate-400 text-sm mb-8 animate-fade-up-d2">
          {pick({ en: "Looks like this page went missing — just like a forgotten dental appointment!", ar: 'يبدو أن هذه الصفحة اختفت — تماماً مثل موعد الأسنان المنسي!' })}
        </p>
        <div className="flex flex-wrap gap-3 justify-center animate-fade-up-d3">
          <Link to="/" className="btn-primary">{pick({ en: 'Back to Home', ar: 'العودة للرئيسية' })}</Link>
          <Link to="/booking" className="btn-outline">{pick({ en: 'Book Appointment', ar: 'احجز موعداً' })}</Link>
        </div>
      </div>
    </div>
  )
}
