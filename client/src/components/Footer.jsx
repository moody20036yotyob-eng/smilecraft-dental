import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'

export default function Footer() {
  const { pick } = useLang()

  return (
    <footer className="bg-slate-900 text-white pt-16 pb-8 mt-0">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-brand-500 flex items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                  <path d="M12 2C8.5 2 5 5 5 9c0 3 2 5.5 3.5 7L10 21h4l1.5-5C17 14.5 19 12 19 9c0-4-3.5-7-7-7z" fill="white" opacity=".9"/>
                  <circle cx="12" cy="9" r="2.5" fill="#00B5B0"/>
                </svg>
              </div>
              <div>
                <span className="font-bold text-white text-lg block leading-none">SmileCraft</span>
                <span className="text-[10px] text-teal-400 tracking-[0.18em] uppercase font-semibold">Dental Clinic</span>
              </div>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              {pick({ en: 'Premium dental care combining clinical precision with patient-centred compassion since 2006.', ar: 'رعاية أسنان متميزة تجمع بين الدقة السريرية والرعاية المتمحورة حول المريض منذ 2006.' })}
            </p>
            <div className="flex gap-2">
              {[{s:'ig',l:'Instagram'},{s:'fb',l:'Facebook'},{s:'tw',l:'Twitter'},{s:'li',l:'LinkedIn'}].map(({s,l}) => (
                <a key={s} href="#" aria-label={l}
                  className="w-8 h-8 rounded-lg bg-white/10 hover:bg-brand-500 flex items-center justify-center text-xs text-white/60 hover:text-white transition-all duration-200">
                  {s[0].toUpperCase()}
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{pick({ en: 'Quick Links', ar: 'روابط سريعة' })}</h4>
            <ul className="space-y-2.5">
              {[
                { en:'Home', ar:'الرئيسية', to:'/' },
                { en:'Services', ar:'خدماتنا', to:'/services' },
                { en:'Meet the Team', ar:'فريقنا', to:'/about' },
                { en:'Book Appointment', ar:'احجز موعداً', to:'/booking' },
                { en:'FAQ', ar:'الأسئلة الشائعة', to:'/faq' },
              ].map(l => (
                <li key={l.to}>
                  <Link to={l.to} className="text-slate-400 hover:text-teal-400 text-sm transition-colors">
                    {pick(l)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatments */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{pick({ en: 'Treatments', ar: 'العلاجات' })}</h4>
            <ul className="space-y-2.5">
              {[
                { en:'Cosmetic Dentistry', ar:'التجميل' },
                { en:'Dental Implants', ar:'زراعة الأسنان' },
                { en:'Invisalign', ar:'إنفيزالين' },
                { en:'Teeth Whitening', ar:'تبييض الأسنان' },
                { en:'Root Canal', ar:'علاج الجذور' },
                { en:'Pediatric Care', ar:'رعاية الأطفال' },
              ].map(s => (
                <li key={s.en}>
                  <Link to="/services" className="text-slate-400 hover:text-teal-400 text-sm transition-colors">{pick(s)}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4">{pick({ en: 'Contact', ar: 'تواصل' })}</h4>
            <ul className="space-y-3">
              {[
                { icon:'📍', en:'Tower 5, Healthcare City, Dubai', ar:'برج 5، مدينة الرعاية الصحية، دبي' },
                { icon:'📞', en:'+971 4 123 4567', ar:'+971 4 123 4567', href:'tel:+97141234567' },
                { icon:'✉️', en:'hello@smilecraftdental.ae', ar:'hello@smilecraftdental.ae', href:'mailto:hello@smilecraftdental.ae' },
                { icon:'🕐', en:'Mon–Sat: 9AM – 8PM', ar:'الاثنين–السبت: 9ص – 8م' },
              ].map(i => (
                <li key={i.en} className="flex gap-3 text-sm">
                  <span className="flex-shrink-0 mt-0.5">{i.icon}</span>
                  {i.href
                    ? <a href={i.href} className="text-slate-400 hover:text-teal-400 transition-colors">{pick(i)}</a>
                    : <span className="text-slate-400">{pick(i)}</span>
                  }
                </li>
              ))}
            </ul>
            {/* Emergency badge */}
            <div className="mt-5 flex items-center gap-2 px-4 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
              <span className="text-red-400 text-lg">🚨</span>
              <div>
                <p className="text-red-300 text-xs font-semibold">{pick({ en: 'Dental Emergency', ar: 'طوارئ الأسنان' })}</p>
                <a href="tel:+97141234599" className="text-red-400 text-xs hover:underline">+971 4 123 4599</a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 pt-6 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-slate-500 text-xs">
            © {new Date().getFullYear()} SmileCraft Dental. {pick({ en: 'All rights reserved.', ar: 'جميع الحقوق محفوظة.' })}
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{pick({ en: 'Privacy Policy', ar: 'سياسة الخصوصية' })}</a>
            <a href="#" className="text-slate-500 hover:text-slate-300 text-xs transition-colors">{pick({ en: 'Terms of Use', ar: 'شروط الاستخدام' })}</a>
            <Link to="/admin/login" className="text-slate-600 hover:text-slate-400 text-xs transition-colors">Admin</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
