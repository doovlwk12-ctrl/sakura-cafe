import { useApi } from "./useApi"

export function useUsers() {
  const { request, loading, error } = useApi("/api/users")

  return {
    loading,
    error,
    getUsers: () => request<any[]>("/"),
    addUser: (user: any) => request("/", { method: "POST", body: JSON.stringify(user) }),
    updateUser: (id: string, user: any) =>
      request(`/${id}`, { method: "PUT", body: JSON.stringify(user) }),
    deleteUser: (id: string) => request(`/${id}`, { method: "DELETE" }),
  }
}
