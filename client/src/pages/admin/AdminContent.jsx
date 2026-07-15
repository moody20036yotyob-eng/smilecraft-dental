import { useState, useEffect } from 'react'
import { api } from '../../hooks/useApi'

const SECTIONS = ['home', 'about', 'contact']

const HOME_FIELDS = [
  { key:'heroTitleEn',        label:'Hero Title (EN)' },
  { key:'heroTitleAr',        label:'Hero Title (AR)' },
  { key:'heroSubtitleEn',     label:'Hero Subtitle (EN)' },
  { key:'heroSubtitleAr',     label:'Hero Subtitle (AR)' },
  { key:'heroCTAEn',          label:'CTA Button (EN)' },
  { key:'heroCTAAr',          label:'CTA Button (AR)' },
  { key:'trustBadge1En',      label:'Trust Badge 1 (EN)' },
  { key:'trustBadge1Ar',      label:'Trust Badge 1 (AR)' },
  { key:'trustBadge2En',      label:'Trust Badge 2 (EN)' },
  { key:'trustBadge2Ar',      label:'Trust Badge 2 (AR)' },
  { key:'trustBadge3En',      label:'Trust Badge 3 (EN)' },
  { key:'trustBadge3Ar',      label:'Trust Badge 3 (AR)' },
  { key:'trustBadge4En',      label:'Trust Badge 4 (EN)' },
  { key:'trustBadge4Ar',      label:'Trust Badge 4 (AR)' },
  { key:'servicesHeadingEn',  label:'Services Heading (EN)' },
  { key:'servicesHeadingAr',  label:'Services Heading (AR)' },
  { key:'servicesSubEn',      label:'Services Subtext (EN)' },
  { key:'servicesSubAr',      label:'Services Subtext (AR)' },
  { key:'doctorsHeadingEn',   label:'Doctors Heading (EN)' },
  { key:'doctorsHeadingAr',   label:'Doctors Heading (AR)' },
  { key:'ctaHeadingEn',       label:'Final CTA Heading (EN)' },
  { key:'ctaHeadingAr',       label:'Final CTA Heading (AR)' },
  { key:'ctaSubEn',           label:'Final CTA Subtext (EN)' },
  { key:'ctaSubAr',           label:'Final CTA Subtext (AR)' },
]

const ABOUT_FIELDS = [
  { key:'missionHeadingEn', label:'Mission Heading (EN)' },
  { key:'missionHeadingAr', label:'Mission Heading (AR)' },
  { key:'missionTextEn',    label:'Mission Text (EN)' },
  { key:'missionTextAr',    label:'Mission Text (AR)' },
  { key:'visionEn',         label:'Vision Statement (EN)' },
  { key:'visionAr',         label:'Vision Statement (AR)' },
]

const CONTACT_FIELDS = [
  { key:'addressEn', label:'Address (EN)' },
  { key:'addressAr', label:'Address (AR)' },
  { key:'phone',     label:'Phone Number' },
  { key:'email',     label:'Email Address' },
  { key:'hoursEn',   label:'Opening Hours (EN)' },
  { key:'hoursAr',   label:'Opening Hours (AR)' },
]

const SECTION_FIELDS = { home: HOME_FIELDS, about: ABOUT_FIELDS, contact: CONTACT_FIELDS }

export default function AdminContent({ content, setContent }) {
  const [activeSection, setActiveSection] = useState('home')
  const [draft, setDraft] = useState(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    if (content) setDraft(JSON.parse(JSON.stringify(content)))
  }, [content])

  if (!draft) return <div className="text-slate-400 p-8">Loading content…</div>

  const setField = (section, key, value) => {
    setDraft(d => ({ ...d, [section]: { ...d[section], [key]: value } }))
    setSaved(false)
  }

  const save = async () => {
    setSaving(true)
    try {
      const updated = await api.putContent(draft)
      setContent(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (e) {
      alert('Save failed: ' + e.message)
    } finally {
      setSaving(false)
    }
  }

  const fields = SECTION_FIELDS[activeSection] || []

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Page Content Editor</h2>
          <p className="text-slate-400 text-sm">Edit bilingual content for all pages</p>
        </div>
        <button onClick={save} disabled={saving}
          className={`btn-primary text-sm py-2.5 px-6 disabled:opacity-50 ${saved ? '!bg-teal-500' : ''}`}>
          {saving ? '⏳ Saving…' : saved ? '✓ Saved!' : 'Save All Changes'}
        </button>
      </div>

      <div className="flex gap-2 mb-6 border-b border-slate-100 pb-3">
        {SECTIONS.map(s => (
          <button key={s} onClick={() => setActiveSection(s)}
            className={`px-5 py-2 rounded-xl text-sm font-semibold capitalize transition-all ${
              activeSection === s ? 'bg-brand-50 text-brand-600 border border-brand-200' : 'text-slate-400 hover:text-slate-700 hover:bg-slate-50'
            }`}>
            {s}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {fields.map(f => {
          const value = (draft[activeSection] || {})[f.key] || ''
          const isLong = value.length > 80 || ['Text','Sub','Vision','Hours'].some(k => f.key.includes(k))
          return (
            <div key={f.key}>
              <label className="block text-xs font-semibold text-slate-500 mb-1.5">{f.label}</label>
              {/* Always textarea — vary rows, never switch to input */}
              <textarea
                rows={isLong ? 4 : 2}
                className="w-full border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-brand-400 focus:ring-2 focus:ring-brand-100 transition-all resize-none bg-white"
                value={value}
                onChange={e => setField(activeSection, f.key, e.target.value)}
              />
            </div>
          )
        })}
      </div>

      {fields.length === 0 && <p className="text-slate-300 text-sm">No editable fields for this section yet.</p>}
    </div>
  )
}
