import api from "@/services/api";

export interface MyProfile {
  id: number;
  name: string;
  email: string;
  is_admin: boolean;
  is_active: boolean;
  email_notifications: boolean;
}

export async function getMyProfile(): Promise<MyProfile> {
  const res = await api.get<MyProfile>("/users/me");
  return res.data;
}

export async function updateNotificationPref(
  email_notifications: boolean
): Promise<MyProfile> {
  const res = await api.patch<MyProfile>("/users/me", { email_notifications });
  return res.data;
}

export async function changePassword(
  current_password: string,
  new_password: string
): Promise<void> {
  await api.post("/users/me/change-password", { current_password, new_password });
}
