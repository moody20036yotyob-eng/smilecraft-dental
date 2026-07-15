import { useState, useEffect } from 'react'
import { useNavigate, Routes, Route, NavLink } from 'react-router-dom'
import { api, apiLogout } from '../../hooks/useApi'
import AdminDoctors from './AdminDoctors'
import AdminServices from './AdminServices'
import AdminContent from './AdminContent'

function Stat({ label, value, icon }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6 flex items-start justify-between">
      <div>
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-3xl font-bold text-brand-600">{value}</p>
      </div>
      <span className="text-2xl">{icon}</span>
    </div>
  )
}

const NAV = [
  { to:'/admin',          label:'Dashboard', icon:'📊', end:true },
  { to:'/admin/doctors',  label:'Doctors',   icon:'👨‍⚕️' },
  { to:'/admin/services', label:'Services',  icon:'🦷' },
  { to:'/admin/content',  label:'Content',   icon:'📝' },
]

export default function AdminDashboard() {
  const navigate = useNavigate()
  const [doctors, setDoctors] = useState([])
  const [services, setServices] = useState([])
  const [content, setContent] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('sc_admin_token')
    if (!token) { navigate('/admin/login'); return }
    Promise.all([api.getDoctors(), api.getServices(), api.getContent()])
      .then(([d, s, c]) => { setDoctors(d); setServices(s); setContent(c) })
      .catch(() => { apiLogout(); navigate('/admin/login') })
  }, [navigate])

  const logout = () => { apiLogout(); navigate('/admin/login') }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-slate-100 flex flex-col p-5 fixed top-0 bottom-0 shadow-sm">
        <div className="flex items-center gap-2.5 mb-8 px-1">
          <div className="w-9 h-9 rounded-xl bg-brand-500 flex items-center justify-center flex-shrink-0 shadow-md">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <path d="M12 2C8.5 2 5 5 5 9c0 3 2 5.5 3.5 7L10 21h4l1.5-5C17 14.5 19 12 19 9c0-4-3.5-7-7-7z" fill="white"/>
            </svg>
          </div>
          <div>
            <span className="font-bold text-sm text-slate-800 block leading-none">SmileCraft</span>
            <span className="text-[9px] text-brand-500 tracking-wider uppercase font-semibold">Admin</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1">
          {NAV.map(n => (
            <NavLink key={n.to} to={n.to} end={n.end}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  isActive ? 'bg-brand-50 text-brand-600' : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
                }`
              }>
              <span>{n.icon}</span>{n.label}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-slate-100 pt-4 space-y-2">
          <a href="/" target="_blank" className="block px-3 py-2 text-slate-400 text-xs hover:text-slate-600 transition-colors">
            View Website ↗
          </a>
          <button onClick={logout} className="w-full text-left px-3 py-2 text-red-400 text-xs hover:text-red-600 transition-colors font-medium">
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-56 p-8">
        <Routes>
          <Route index element={
            <div>
              <h1 className="text-3xl font-bold text-slate-800 mb-1">Dashboard</h1>
              <p className="text-slate-400 text-sm mb-8">Welcome back. Here's an overview of your clinic content.</p>
              <div className="grid grid-cols-3 gap-5 mb-8">
                <Stat label="Total Doctors"    value={doctors.length}                          icon="👨‍⚕️" />
                <Stat label="Total Services"   value={services.length}                         icon="🦷" />
                <Stat label="Content Sections" value={content ? Object.keys(content).length : 0} icon="📝" />
              </div>
              <div className="grid md:grid-cols-2 gap-5">
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Quick Links</h3>
                  <div className="space-y-2">
                    {[
                      { to:'/admin/doctors',  label:'Manage Doctors' },
                      { to:'/admin/services', label:'Manage Services' },
                      { to:'/admin/content',  label:'Edit Page Content' },
                    ].map(l => (
                      <NavLink key={l.to} to={l.to}
                        className="flex items-center justify-between p-3 rounded-xl bg-slate-50 hover:bg-brand-50 hover:text-brand-600 text-slate-600 text-sm font-medium transition-all border border-transparent hover:border-brand-100">
                        {l.label} <span>→</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
                <div className="bg-white rounded-2xl border border-slate-100 shadow-card p-6">
                  <h3 className="font-bold text-slate-800 text-sm mb-4">Doctors</h3>
                  <div className="space-y-2">
                    {doctors.slice(0,4).map(d => (
                      <div key={d.id} className="flex items-center gap-3 py-2 border-b border-slate-100 last:border-0">
                        <div className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 text-xs font-bold flex-shrink-0">
                          {(d.nameEn || '').charAt(4)}
                        </div>
                        <div>
                          <p className="text-slate-700 text-xs font-medium">{d.nameEn}</p>
                          <p className="text-slate-400 text-[10px]">{(d.titleEn || '').substring(0,40)}…</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          } />
          <Route path="doctors"  element={<AdminDoctors  doctors={doctors}   setDoctors={setDoctors} />} />
          <Route path="services" element={<AdminServices services={services} setServices={setServices} />} />
          <Route path="content"  element={<AdminContent  content={content}   setContent={setContent} />} />
        </Routes>
      </main>
    </div>
  )
}
