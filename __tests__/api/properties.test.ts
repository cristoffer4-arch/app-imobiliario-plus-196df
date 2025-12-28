import { NextRequest } from 'next/server'
import { GET, POST } from '@/app/api/properties/route'
import { GET as GETById, PUT, DELETE } from '@/app/api/properties/[id]/route'

// Mock Supabase
jest.mock('@/lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn(() => Promise.resolve({ data: [], error: null })),
      insert: jest.fn(() => Promise.resolve({ data: [], error: null })),
      update: jest.fn(() => Promise.resolve({ data: [], error: null })),
      delete: jest.fn(() => Promise.resolve({ error: null })),
      eq: jest.fn(() => ({
        select: jest.fn(() => Promise.resolve({ data: [], error: null })),
        update: jest.fn(() => Promise.resolve({ data: [], error: null })),
        delete: jest.fn(() => Promise.resolve({ error: null })),
      })),
    })),
  },
}))

describe('Properties API', () => {
  describe('GET /api/properties', () => {
    it('should return properties list', async () => {
      const request = new NextRequest('http://localhost:3000/api/properties')
      const response = await GET(request)
      
      expect(response.status).toBe(200)
      const data = await response.json()
      expect(Array.isArray(data)).toBe(true)
    })
  })

  describe('POST /api/properties', () => {
    it('should create a new property', async () => {
      const propertyData = {
        title: 'Test Property',
        description: 'A test property',
        price: 500000,
        location: 'Test Location',
        bedrooms: 3,
        bathrooms: 2,
        area: 150,
        type: 'apartment',
        status: 'available',
      }
      
      const request = new NextRequest('http://localhost:3000/api/properties', {
        method: 'POST',
        body: JSON.stringify(propertyData),
      })
      
      const response = await POST(request)
      expect(response.status).toBe(201)
    })
  })

  describe('GET /api/properties/[id]', () => {
    it('should return a single property', async () => {
      const request = new NextRequest('http://localhost:3000/api/properties/1')
      const response = await GETById(request, { params: { id: '1' } })
      
      expect(response.status).toBe(200)
    })
  })

  describe('PUT /api/properties/[id]', () => {
    it('should update a property', async () => {
      const updateData = { price: 550000 }
      
      const request = new NextRequest('http://localhost:3000/api/properties/1', {
        method: 'PUT',
        body: JSON.stringify(updateData),
      })
      
      const response = await PUT(request, { params: { id: '1' } })
      expect(response.status).toBe(200)
    })
  })

  describe('DELETE /api/properties/[id]', () => {
    it('should delete a property', async () => {
      const request = new NextRequest('http://localhost:3000/api/properties/1', {
        method: 'DELETE',
      })
      
      const response = await DELETE(request, { params: { id: '1' } })
      expect(response.status).toBe(204)
    })
  })
})
