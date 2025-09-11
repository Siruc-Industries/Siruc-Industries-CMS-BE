// Express app entry for Vercel
import express from 'express'
import cors from 'cors'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

// keep ONE PrismaClient (avoid new on each invocation)
const globalForPrisma = globalThis; 
export const prisma =
  globalForPrisma.prisma ?? new PrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

const app = express()

// CORS: allow your Nuxt apps and localhost for development
const origins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3000',
  'https://sirucindustries.com',
  'https://www.sirucindustries.com',
  'https://cms.sirucindustries.com',
]

app.use(cors({ 
  origin: origins, 
  credentials: true 
}))

app.use(express.json())

// Health check endpoint
app.get('/healthz', (_req, res) => res.status(200).send('ok'))

// Articles routes
app.get('/api/articles', async (_req, res) => {
  try {
    const articles = await prisma.article.findMany()
    res.json(articles)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching articles')
  }
})

app.get('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params
    const article = await prisma.article.findUnique({ 
      where: { id: parseInt(id, 10) } 
    })
    if (!article) return res.status(404).json({ message: 'Article not found' })
    res.json(article)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching article')
  }
})

app.post('/api/articles', async (req, res) => {
  try {
    const { title, text, author, tabs } = req.body
    
    // Safely parse tabs if it exists
    let parsedTabs = null
    if (tabs && tabs !== 'undefined') {
      try {
        parsedTabs = JSON.parse(tabs)
      } catch (parseError) {
        console.error('Error parsing tabs:', parseError)
        parsedTabs = null
      }
    }
    
    const newArticle = await prisma.article.create({
      data: { title, text, author, tabs: parsedTabs }
    })
    res.status(201).json(newArticle)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error creating article')
  }
})

app.put('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, text, author, tabs } = req.body
    
    const updateData = { title, text, author }
    
    // Safely handle tabs if provided
    if (tabs && tabs !== 'undefined') {
      try {
        updateData.tabs = JSON.parse(tabs)
      } catch (parseError) {
        console.error('Error parsing tabs:', parseError)
      }
    }
    
    const updatedArticle = await prisma.article.update({
      where: { id: parseInt(id, 10) },
      data: updateData
    })
    res.status(200).json(updatedArticle)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error updating article')
  }
})

app.delete('/api/articles/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.article.delete({ where: { id: parseInt(id, 10) } })
    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).send('Error deleting article')
  }
})

// Projects routes
app.get('/api/projects', async (_req, res) => {
  try {
    const projects = await prisma.project.findMany()
    res.json(projects)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching projects')
  }
})

app.get('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params
    const project = await prisma.project.findUnique({ 
      where: { id: parseInt(id, 10) } 
    })
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.json(project)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error fetching project')
  }
})

app.post('/api/projects', async (req, res) => {
  try {
    const { title, text, author } = req.body
    
    const newProject = await prisma.project.create({
      data: { title, text, author }
    })
    res.status(201).json(newProject)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error creating project')
  }
})

app.put('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { title, text, author } = req.body
    
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id, 10) },
      data: { title, text, author }
    })
    res.status(200).json(updatedProject)
  } catch (error) {
    console.error(error)
    res.status(500).send('Error updating project')
  }
})

app.delete('/api/projects/:id', async (req, res) => {
  try {
    const { id } = req.params
    await prisma.project.delete({ where: { id: parseInt(id, 10) } })
    res.status(204).send()
  } catch (error) {
    console.error(error)
    res.status(500).send('Error deleting project')
  }
})

// ---- Vercel export: DO NOT app.listen() here ----
export default app
