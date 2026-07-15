import { useState } from 'react'
import { api } from '../../hooks/useApi'

const EMPTY = {
  nameEn:'', nameAr:'', category:'', categoryAr:'',
  descriptionEn:'', descriptionAr:'', duration:'', durationAr:'',
  priceRange:'', priceRangeAr:'', featured:false,
}

const inputCls = 'w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all resize-none bg-white'

function ServiceForm({ initial, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }))

  const fields = [
    { key:'nameEn',        label:'Service Name (EN)', rows:1 },
    { key:'nameAr',        label:'Service Name (AR)', rows:1 },
    { key:'category',      label:'Category (EN)',     rows:1 },
    { key:'categoryAr',    label:'Category (AR)',     rows:1 },
    { key:'descriptionEn', label:'Description (EN)',  rows:4 },
    { key:'descriptionAr', label:'Description (AR)',  rows:4 },
    { key:'duration',      label:'Duration (EN)',     rows:1 },
    { key:'durationAr',    label:'Duration (AR)',     rows:1 },
    { key:'priceRange',    label:'Price Range (EN)',  rows:1 },
    { key:'priceRangeAr',  label:'Price Range (AR)',  rows:1 },
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
          <input type="checkbox" id="svcFeatured" checked={!!form.featured} onChange={e => set('featured', e.target.checked)} className="accent-brand-500 w-4 h-4" />
          <label htmlFor="svcFeatured" className="text-slate-600 text-sm">Featured on homepage</label>
        </div>
      </div>
      <div className="flex gap-3 mt-5">
        <button onClick={() => onSave(form)} disabled={saving} className="btn-primary text-sm py-2.5 px-6 disabled:opacity-50">
          {saving ? '⏳ Saving…' : '✓ Save Service'}
        </button>
        <button onClick={onCancel} className="px-6 py-2.5 rounded-xl border border-slate-200 text-slate-500 text-sm hover:bg-slate-100 transition-all">Cancel</button>
      </div>
    </div>
  )
}

export default function AdminServices({ services, setServices }) {
  const [editing, setEditing] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(null)
  const [filterCat, setFilterCat] = useState('All')

  const categories = ['All', ...new Set((services || []).map(s => s.category))]
  const filtered = filterCat === 'All' ? services : (services || []).filter(s => s.category === filterCat)

  const saveService = async (form) => {
    setSaving(true)
    try {
      if (editing === 'new') {
        const svc = await api.createService(form)
        setServices(s => [...s, svc])
      } else {
        const svc = await api.updateService(editing, form)
        setServices(s => s.map(x => x.id === editing ? svc : x))
      }
      setEditing(null)
    } catch (e) {
      alert('Save failed: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const deleteService = async (id) => {
    try {
      await api.deleteService(id)
      setServices(s => s.filter(x => x.id !== id))
    } finally {
      setConfirmDelete(null)
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Manage Services</h2>
          <p className="text-slate-400 text-sm">{(services || []).length} services</p>
        </div>
        <button onClick={() => setEditing('new')} className="btn-primary text-sm py-2.5 px-5">+ Add Service</button>
      </div>

      <div className="flex gap-2 flex-wrap mb-5">
        {categories.map(c => (
          <button key={c} onClick={() => setFilterCat(c)}
            className={`px-4 py-1.5 rounded-xl text-xs font-semibold transition-all ${filterCat === c ? 'bg-brand-500 text-white shadow-sm' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'}`}>
            {c}
          </button>
        ))}
      </div>

      {editing === 'new' && <ServiceForm initial={EMPTY} onSave={saveService} onCancel={() => setEditing(null)} saving={saving} />}

      <div className="space-y-2">
        {(filtered || []).map(svc => (
          <div key={svc.id}>
            <div className="bg-white rounded-2xl border border-slate-100 p-5 flex items-start gap-4 hover:shadow-card transition-all">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-slate-800 text-sm font-bold">{svc.nameEn}</h3>
                  <span className="text-[9px] border border-brand-200 text-brand-600 px-2 py-0.5 rounded-full">{svc.category}</span>
                  {svc.featured && <span className="text-[9px] bg-teal-50 text-teal-600 border border-teal-100 px-2 py-0.5 rounded-full font-semibold">Featured</span>}
                </div>
                <p className="text-slate-400 text-xs mt-0.5">{svc.nameAr}</p>
                <p className="text-brand-500 text-xs mt-1 font-semibold">{svc.priceRange}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => setEditing(editing === svc.id ? null : svc.id)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-slate-500 text-xs hover:text-brand-600 hover:border-brand-200 transition-all">
                  Edit
                </button>
                <button onClick={() => setConfirmDelete(svc.id)}
                  className="px-3 py-1.5 rounded-lg border border-red-100 text-red-400 text-xs hover:bg-red-50 transition-all">
                  Delete
                </button>
              </div>
            </div>
            {editing === svc.id && <ServiceForm initial={svc} onSave={saveService} onCancel={() => setEditing(null)} saving={saving} />}
            {confirmDelete === svc.id && (
              <div className="mt-2 p-4 rounded-xl bg-red-50 border border-red-200 flex items-center justify-between">
                <p className="text-red-600 text-sm font-medium">Delete "{svc.nameEn}"?</p>
                <div className="flex gap-2">
                  <button onClick={() => deleteService(svc.id)} className="px-4 py-1.5 rounded-lg bg-red-500 text-white text-xs font-semibold">Confirm</button>
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
