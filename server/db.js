const fs = require('fs')
const path = require('path')

const DATA_DIR = path.join(__dirname, 'data')

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true })

function readData(name) {
  const file = path.join(DATA_DIR, `${name}.json`)
  if (!fs.existsSync(file)) return null
  return JSON.parse(fs.readFileSync(file, 'utf8'))
}

function writeData(name, data) {
  const file = path.join(DATA_DIR, `${name}.json`)
  fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8')
}

module.exports = { readData, writeData }
