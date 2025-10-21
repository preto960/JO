const express = require('express')
const cors = require('cors')
const path = require('path')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT || 3002

// Middleware
app.use(cors())
app.use(express.json())

// API Routes
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Publisher Dashboard API is running' })
})

// Proxy to backend API
app.use('/api/plugins', async (req, res) => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/plugins${req.url}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': req.headers.authorization || ''
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    })
    
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Proxy error' })
  }
})

app.use('/api/auth', async (req, res) => {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/api/auth${req.url}`, {
      method: req.method,
      headers: {
        'Content-Type': 'application/json'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    })
    
    const data = await response.json()
    res.status(response.status).json(data)
  } catch (error) {
    res.status(500).json({ error: 'Proxy error' })
  }
})

// Serve static files from Vue app
app.use(express.static(path.join(__dirname, 'dist')))

// Handle Vue routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Publisher Dashboard server running on port ${PORT}`)
})