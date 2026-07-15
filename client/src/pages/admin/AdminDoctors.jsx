import { useState } from 'react'
import { api } from '../../hooks/useApi'

const EMPTY = {
  nameEn:'', nameAr:'', titleEn:'', titleAr:'',
  bioEn:'', bioAr:'', specialtiesEn:'', specialtiesAr:'',
  credentialsEn:'', credentialsAr:'', yearsExp:'', photo:'', featured:false,
}

const inputCls = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all resize-none bg-white'

function DoctorForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const fields = [
    { key:'nameEn',         label:'Name (EN)',                   rows:1 },
    { key:'nameAr',         label:'Name (AR)',                   rows:1 },
    { key:'titleEn',        label:'Title (EN)',                  rows:2 },
    { key:'titleAr',        label:'Title (AR)',                  rows:2 },
    { key:'bioEn',          label:'Bio (EN)',                    rows:5 },
    { key:'bioAr',          label:'Bio (AR)',                    rows:5 },
    { key:'specialtiesEn',  label:'Specialties EN (comma-sep)',  rows:2 },
    { key:'specialtiesAr',  label:'Specialties AR (comma-sep)',  rows:2 },
    { key:'credentialsEn',  label:'Credentials (EN)',            rows:2 },
    { key:'credentialsAr',  label:'Credentials (AR)',            rows:2 },
    { key:'yearsExp',       label:'Years of Experience',         rows:1 },
    { key:'photo',          label:'Photo URL',                   rows:1 },
  ]

  return (
    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mt-3">
      <div className="grid md:grid-cols-2 gap-4">
        {fields.map(f => (
          <div key={f.key} className={f.rows > 2 ? 'md:col-span-2' : ''}>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">{f.label}</label>
            <textarea rows={f.rows} className={inputCls}
              value={form[f.key] || ''} onChange={e => set(f.key, e.target.value)} />
          </div>
        ))}
        <div className="flex items-center gap-3">
          <input type="checkbox" id="featured" checked={!!form.featured} onChange={e => set('featured', e.target.checked)} className="accent-brand-500 w-4 h-4" />
          <label htmlFor="featured" className="text-slate-600 text-sm">Featured on homepage</label>
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button onClick={() => onSave(form)} disabled={saving} className="btn-primary text-sm py-2.5 px-6 disabled:opacity-50">
          {saving ? '⏳ Saving…' : '✓ Save Doctor'}
        </button>
        <button onClick={onCancel} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-100 transition-all">Cancel</button>
      </div>
    </div>
  )
}

export default function AdminDoctors({ doctors, setDoctors }) {
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)

  const saveDoctor = async (form) => {
    setSaving(true)
    try {
      if (editing === 'new') {
        const doc = await api.createDoctor(form)
        setDoctors(d => [...d, doc])
      } else {
        const doc = await api.updateDoctor(editing, form)
        setDoctors(d => d.map(x => x.id === editing ? doc : x))
      }
      setEditing(null)
    } catch (e) {
      alert('Save failed: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteDoctor = async (id) => {
    try {
      await api.deleteDoctor(id)
      setDoctors(d => d.filter(x => x.id !== id))
    } catch (e) {
      alert('Delete failed: ' + e.message)
    } finally {
      setConfirmDelete(null)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manage Doctors</h2>
          <p className="text-slate-400 text-sm">{doctors.length} doctors on record</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary text-sm py-2.5 px-5">+ Add Doctor</button>
      </div>

      {editing === 'new' && <DoctorForm initial={EMPTY} onSave={saveDoctor} onCancel={() => setEditing(null)} saving={saving} />}

      <div className="space-y-3 mt-4">
        {doctors.map(doc => (
          <div key={doc.id}>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4 hover:shadow-card transition-all">
              <img src={doc.photo} alt="" className="w-14 h-14 rounded-xl object-cover bg-slate-100 flex-shrink-0"
                onError={e => e.target.style.display='none'} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-slate-800 font-bold text-sm">{doc.nameEn}</h3>
                  {doc.featured && <span className="text-[9px] bg-teal-50 text-teal-600 border border-teal-100 px-2 py-0.5 rounded-full font-semibold">Featured</span>}
                </div>
                <p className="text-slate-400 text-xs mt-0.5">{doc.nameAr} · {doc.titleEn}</p>
                <p className="text-slate-300 text-xs mt-1 line-clamp-1">{doc.specialtiesEn}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing(editing === doc.id ? null : doc.id)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs hover:text-brand-600 hover:border-brand-200 transition-all">
                  Edit
                </button>
                <button onClick={() => setConfirmDelete(doc.id)}
                  className="px-3 py-1.5 rounded-lg border border-red-100 text-red-400 text-xs hover:bg-red-50 transition-all">
                  Delete
                </button>
              </div>
            </div>
            {editing === doc.id && <DoctorForm initial={doc} onSave={saveDoctor} onCancel={() => setEditing(null)} saving={saving} />}
            {confirmDelete === doc.id && (
              <div className="mt-2 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
                <p className="text-red-600 text-sm font-medium">Delete {doc.nameEn}?</p>
                <div className="flex gap-2">
                  <button onClick={() => deleteDoctor(doc.id)} className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold">Confirm</button>
                  <button onClick={() => setConfirmDelete(null)} className="px-4 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs">Cancel</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
