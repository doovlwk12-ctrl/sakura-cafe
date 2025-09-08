'use client'
import { useState } from "react"

export function useApi(baseUrl: string) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function request<T>(url: string, options?: RequestInit): Promise<T | null> {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(baseUrl + url, {
        headers: { "Content-Type": "application/json" },
        ...options,
      })

      if (!res.ok) throw new Error("فشل الاتصال بـ API")

      return await res.json()
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  return { request, loading, error }
}
