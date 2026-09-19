import api from "@/services/api";

export interface AdminUser {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  created_at: string;
}

export interface AdminStats {
  total_users: number;
  total_searches: number;
  total_wishlist_items: number;
  admin_count: number;
}

export interface AdminSearch {
  id: number;
  user_id: number;
  user_email: string;
  query: string;
  result_count: number;
  created_at: string;
}

export async function getAdminUsers(): Promise<AdminUser[]> {
  const res = await api.get<AdminUser[]>("/admin/users");
  return res.data;
}

export async function updateAdminUser(
  id: number,
  payload: { is_admin?: boolean; is_active?: boolean }
): Promise<AdminUser> {
  const res = await api.patch<AdminUser>(`/admin/users/${id}`, payload);
  return res.data;
}

export async function getAdminStats(): Promise<AdminStats> {
  const res = await api.get<AdminStats>("/admin/stats");
  return res.data;
}

export async function getAdminSearches(): Promise<AdminSearch[]> {
  const res = await api.get<AdminSearch[]>("/admin/searches");
  return res.data;
}
