import { useState, useEffect } from "react"

export function useProducts() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const getProducts = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/products')
      if (!response.ok) throw new Error('فشل في جلب المنتجات')
      const data = await response.json()
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (product: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })
      if (!response.ok) throw new Error('فشل في إضافة المنتج')
      const data = await response.json()
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const updateProduct = async (id: string, product: any) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(product)
      })
      if (!response.ok) throw new Error('فشل في تحديث المنتج')
      const data = await response.json()
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  const deleteProduct = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: 'DELETE'
      })
      if (!response.ok) throw new Error('فشل في حذف المنتج')
      const data = await response.json()
      return data
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return {
    loading,
    error,
    getProducts,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}
