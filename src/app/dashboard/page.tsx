'use client'

import { useState, useEffect } from 'react'
import PropertyForm from '@/components/Dashboard/PropertyForm'
import PropertyList from '@/components/Dashboard/PropertyList'
import { Property } from '@/types/property'

export default function DashboardPage() {
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editingProperty, setEditingProperty] = useState<Property | undefined>()

  useEffect(() => {
    fetchProperties()
  }, [])

  const fetchProperties = async () => {
    try {
      const response = await fetch('/api/properties')
      if (response.ok) {
        const data = await response.json()
        setProperties(data)
      }
    } catch (error) {
      console.error('Error fetching properties:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCreate = async (data: Partial<Property>) => {
    try {
      const response = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        await fetchProperties()
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error creating property:', error)
    }
  }

  const handleUpdate = async (data: Partial<Property>) => {
    if (!editingProperty) return
    
    try {
      const response = await fetch(`/api/properties/${editingProperty.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      
      if (response.ok) {
        await fetchProperties()
        setEditingProperty(undefined)
        setShowForm(false)
      }
    } catch (error) {
      console.error('Error updating property:', error)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este imóvel?')) return
    
    try {
      const response = await fetch(`/api/properties/${id}`, {
        method: 'DELETE',
      })
      
      if (response.ok) {
        await fetchProperties()
      }
    } catch (error) {
      console.error('Error deleting property:', error)
    }
  }

  const handleEdit = (property: Property) => {
    setEditingProperty(property)
    setShowForm(true)
  }

  const handleCancel = () => {
    setShowForm(false)
    setEditingProperty(undefined)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Painel de Imóveis</h1>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Novo Imóvel
          </button>
        )}
      </div>

      {showForm ? (
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {editingProperty ? 'Editar Imóvel' : 'Novo Imóvel'}
          </h2>
          <PropertyForm
            property={editingProperty}
            onSubmit={editingProperty ? handleUpdate : handleCreate}
            onCancel={handleCancel}
          />
        </div>
      ) : (
        <PropertyList
          properties={properties}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}
