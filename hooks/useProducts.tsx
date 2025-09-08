import { useApi } from "./useApi"

export function useProducts() {
  const { request, loading, error } = useApi("/api/products")

  return {
    loading,
    error,
    getProducts: () => request<any[]>("/"),
    addProduct: (product: any) =>
      request("/", { method: "POST", body: JSON.stringify(product) }),
    updateProduct: (id: string, product: any) =>
      request(`/${id}`, { method: "PUT", body: JSON.stringify(product) }),
    deleteProduct: (id: string) => request(`/${id}`, { method: "DELETE" }),
  }
}
