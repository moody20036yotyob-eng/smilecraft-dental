import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLang } from '../context/LanguageContext'

export default function NotFound() {
  const { pick } = useLang()
  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-6">
      <div className="text-center max-w-lg">
        <motion.div initial={{ scale:0.5, opacity:0 }} animate={{ scale:1, opacity:1 }} transition={{ type:'spring', stiffness:260, damping:20 }}
          className="text-8xl mb-6">🦷</motion.div>
        <motion.h1 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.2 }}
          className="text-7xl font-extrabold text-brand-500 mb-2">404</motion.h1>
        <motion.h2 initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.3 }}
          className="text-2xl font-bold text-slate-800 mb-3">
          {pick({ en: 'Page Not Found', ar: 'الصفحة غير موجودة' })}
        </motion.h2>
        <motion.p initial={{ opacity:0 }} animate={{ opacity:1 }} transition={{ delay:0.4 }}
          className="text-slate-400 text-sm mb-8">
          {pick({ en: "Looks like this page went missing — just like a forgotten dental appointment!", ar: 'يبدو أن هذه الصفحة اختفت — تماماً مثل موعد الأسنان المنسي!' })}
        </motion.p>
        <motion.div initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
          className="flex flex-wrap gap-3 justify-center">
          <Link to="/" className="btn-primary">{pick({ en: 'Back to Home', ar: 'العودة للرئيسية' })}</Link>
          <Link to="/booking" className="btn-outline">{pick({ en: 'Book Appointment', ar: 'احجز موعداً' })}</Link>
        </motion.div>
      </div>
    </div>
  )
}
