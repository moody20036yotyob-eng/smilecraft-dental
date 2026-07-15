const express = require('express')
const { readData, writeData } = require('../db')
const { requireAuth } = require('../middleware/auth')
const router = express.Router()

function getData() {
  return readData('services') || require('../data/services.json')
}

// IMPORTANT: /categories must come before /:id to avoid routing conflict
router.get('/categories', (_req, res) => {
  const services = getData()
  const cats = [...new Set(services.map(s => s.category))]
  res.json(cats)
})

router.get('/', (_req, res) => res.json(getData()))

router.get('/:id', (req, res) => {
  const svc = getData().find(s => s.id === req.params.id)
  if (!svc) return res.status(404).json({ error: 'Not found' })
  res.json(svc)
})

router.post('/', requireAuth, (req, res) => {
  const services = getData()
  const newSvc = { ...req.body, id: `svc_${Date.now()}` }
  services.push(newSvc)
  writeData('services', services)
  res.status(201).json(newSvc)
})

router.put('/:id', requireAuth, (req, res) => {
  const services = getData()
  const idx = services.findIndex(s => s.id === req.params.id)
  if (idx === -1) return res.status(404).json({ error: 'Not found' })
  services[idx] = { ...services[idx], ...req.body, id: req.params.id }
  writeData('services', services)
  res.json(services[idx])
})

router.delete('/:id', requireAuth, (req, res) => {
  const services = getData().filter(s => s.id !== req.params.id)
  writeData('services', services)
  res.json({ ok: true })
})

module.exports = router
