import React, { useState, useEffect } from 'react'
import { inventoryAPI } from '../utils/api'
import './InventoryPage.css'

const InventoryPage = () => {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [filter, setFilter] = useState('all') // all, lowStock, available, damaged, maintenance

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    quantity: '',
    minimumStock: '',
    status: 'Available',
    description: ''
  })

  useEffect(() => {
    fetchItems()
  }, [])

  const fetchItems = async () => {
    try {
      const response = await inventoryAPI.getAll()
      setItems(response.data)
    } catch (error) {
      console.error('Error fetching inventory:', error)
      // Mock data for development
      setItems([
        {
          id: 1,
          name: '10k Resistor',
          category: 'Resistor',
          quantity: 5,
          minimumStock: 20,
          status: 'Available',
          description: '10k ohm resistor'
        },
        {
          id: 2,
          name: 'Arduino Uno',
          category: 'IC',
          quantity: 15,
          minimumStock: 10,
          status: 'Available',
          description: 'Arduino Uno microcontroller'
        },
        {
          id: 3,
          name: 'Temperature Sensor',
          category: 'Sensor',
          quantity: 3,
          minimumStock: 10,
          status: 'Available',
          description: 'DS18B20 temperature sensor'
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({
      name: '',
      category: '',
      quantity: '',
      minimumStock: '',
      status: 'Available',
      description: ''
    })
    setShowAddModal(true)
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({
      name: item.name,
      category: item.category,
      quantity: item.quantity.toString(),
      minimumStock: item.minimumStock.toString(),
      status: item.status,
      description: item.description || ''
    })
    setShowAddModal(true)
  }

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this item?')) {
      try {
        await inventoryAPI.delete(id)
        fetchItems()
      } catch (error) {
        console.error('Error deleting item:', error)
        alert('Error deleting item. Please try again.')
      }
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const payload = {
        ...formData,
        quantity: parseInt(formData.quantity),
        minimumStock: parseInt(formData.minimumStock)
      }

      if (editingItem) {
        await inventoryAPI.update(editingItem.id, payload)
      } else {
        await inventoryAPI.create(payload)
      }

      setShowAddModal(false)
      fetchItems()
    } catch (error) {
      console.error('Error saving item:', error)
      alert('Error saving item. Please try again.')
    }
  }

  const filteredItems = items.filter(item => {
    if (filter === 'lowStock') {
      return item.quantity < item.minimumStock
    }
    if (filter === 'all') return true
    return item.status === filter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case 'Available': return '#10b981'
      case 'Damaged': return '#ef4444'
      case 'Under Maintenance': return '#f59e0b'
      default: return '#6b7280'
    }
  }

  if (loading) {
    return <div className="page-loading">Loading inventory...</div>
  }

  return (
    <div className="inventory-page">
      <div className="page-header">
        <div>
          <h1>Inventory Management</h1>
          <p>Manage all lab components and items</p>
        </div>
        <button className="btn-primary" onClick={handleAdd}>
          + Add New Item
        </button>
      </div>

      <div className="filter-bar">
        <button
          className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          All Items
        </button>
        <button
          className={`filter-btn ${filter === 'lowStock' ? 'active' : ''}`}
          onClick={() => setFilter('lowStock')}
        >
          ⚠️ Low Stock ({items.filter(i => i.quantity < i.minimumStock).length})
        </button>
        <button
          className={`filter-btn ${filter === 'Available' ? 'active' : ''}`}
          onClick={() => setFilter('Available')}
        >
          Available
        </button>
        <button
          className={`filter-btn ${filter === 'Damaged' ? 'active' : ''}`}
          onClick={() => setFilter('Damaged')}
        >
          Damaged
        </button>
        <button
          className={`filter-btn ${filter === 'Under Maintenance' ? 'active' : ''}`}
          onClick={() => setFilter('Under Maintenance')}
        >
          Under Maintenance
        </button>
      </div>

      <div className="inventory-table-container">
        <table className="inventory-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Min Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="empty-state">
                  No items found
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className={item.quantity < item.minimumStock ? 'low-stock-row' : ''}
                >
                  <td>
                    <strong>{item.name}</strong>
                    {item.description && (
                      <div className="item-description">{item.description}</div>
                    )}
                  </td>
                  <td>
                    <span className="category-badge">{item.category}</span>
                  </td>
                  <td>
                    <span className={item.quantity < item.minimumStock ? 'low-stock' : ''}>
                      {item.quantity}
                    </span>
                  </td>
                  <td>{item.minimumStock}</td>
                  <td>
                    <span
                      className="status-badge"
                      style={{ backgroundColor: `${getStatusColor(item.status)}20`, color: getStatusColor(item.status) }}
                    >
                      {item.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn-edit"
                        onClick={() => handleEdit(item)}
                      >
                        ✏️ Edit
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleDelete(item.id)}
                      >
                        🗑️ Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingItem ? 'Edit Item' : 'Add New Item'}</h2>
              <button
                className="modal-close"
                onClick={() => setShowAddModal(false)}
              >
                ×
              </button>
            </div>
            <form onSubmit={handleSubmit} className="inventory-form">
              <div className="form-group">
                <label>Item Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label>Category *</label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="">Select Category</option>
                  <option value="Resistor">Resistor</option>
                  <option value="IC">IC</option>
                  <option value="Sensor">Sensor</option>
                  <option value="Tool">Tool</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Quantity *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.quantity}
                    onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
                  />
                </div>

                <div className="form-group">
                  <label>Minimum Stock *</label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.minimumStock}
                    onChange={(e) => setFormData({ ...formData, minimumStock: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Status *</label>
                <select
                  required
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                >
                  <option value="Available">Available</option>
                  <option value="Damaged">Damaged</option>
                  <option value="Under Maintenance">Under Maintenance</option>
                </select>
              </div>

              <div className="form-group">
                <label>Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows="3"
                />
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowAddModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Update' : 'Add'} Item
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default InventoryPage


