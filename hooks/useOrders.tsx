import { useApi } from "./useApi"

export function useOrders() {
  const { request, loading, error } = useApi("/api/orders")

  return {
    loading,
    error,
    getOrders: () => request<any[]>("/"),
    addOrder: (order: any) =>
      request("/", { method: "POST", body: JSON.stringify(order) }),
    updateOrder: (id: string, order: any) =>
      request(`/${id}`, { method: "PUT", body: JSON.stringify(order) }),
    deleteOrder: (id: string) => request(`/${id}`, { method: "DELETE" }),
  }
}