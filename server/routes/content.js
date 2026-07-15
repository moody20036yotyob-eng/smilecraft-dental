const express = require('express')
const { readData, writeData } = require('../db')
const { requireAuth } = require('../middleware/auth')
const router = express.Router()

function getData() {
  return readData('content') || require('../data/content.json')
}

router.get('/', (_req, res) => res.json(getData()))

router.put('/', requireAuth, (req, res) => {
  writeData('content', req.body)
  res.json(req.body)
})

module.exports = router
