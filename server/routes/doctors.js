const express = require('express')
const { readData, writeData } = require('../db')
const { requireAuth } = require('../middleware/auth')
const router = express.Router()

const seed = () => require('../data/doctors.json')

function getData() {
  return readData('doctors') || seed()
}

router.get('/', (_req, res) => res.json(getData()))

router.get('/:id', (req, res) => {
  const doc = getData().find(d => d.id === req.params.id)
  if (!doc) return res.status(404).json({ error: 'Not found' })
  res.json(doc)
})

router.post('/', requireAuth, (req, res) => {
  const doctors = getData()
  const newDoc = { ...req.body, id: `doc_${Date.now()}` }
  doctors.push(newDoc)
  writeData('doctors', doctors)
  res.status(201).json(newDoc)
})

router.put('/:id', requireAuth, (req, res) => {
  const doctors = getData()
  const idx = doctors.findIndex(d => d.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  doctors[idx] = { ...doctors[idx], ...req.body, id: req.params.id }
  writeData('doctors', doctors)
  res.json(doctors[idx])
})

router.delete('/:id', requireAuth, (req, res) => {
  const doctors = getData().filter(d => d.id !== req.params.id)
  writeData('doctors', doctors)
  res.json({ ok: true })
})

module.exports = router
