// client/src/api/user.ts
import { API } from '@domo/config';
import type { GetUsersData, Role, User } from '@domo/types';
import type { QueryFunctionContext } from '@tanstack/react-query';

export const getUser = async () => API.get('/user');

type UserUpdateData = Partial<User> & {
  password?: string;
  confirmPassword?: string;
};

export const update = async (id: string, data: UserUpdateData): Promise<User> => {
  const { password, confirmPassword, ...updateFields } = data;

  if (password && confirmPassword) {
    if (password !== confirmPassword) {
      throw new Error('Passwords do not match');
    }
    (updateFields as any).password = password;
  }

  const response = await API.patch(`/user/update/${id}`, updateFields);
  return response.data;
};

export const deleteAccount = async (userId: string, data: Record<string, unknown>) => {
  const response = await API.delete<User>(`/user/delete/${userId}`, data);
  return response.data;
};

export async function fetchUserByRole(role: Role) {
  const response = await API.get<{ role: Role }>(`/user/role/${role}`);
  return response.data;
}

export async function fetchCurrentUser(): Promise<User> {
  const response = await API.get<User>('/user', { withCredentials: true }).catch((err) => {
    if (err.response?.status === 401) {
      const e: any = new Error('Unauthorized');
      e.status = 401;
      throw e;
    }
    throw err;
  });

  if (!response.data) throw new Error('Server returned no user data');
  return response.data;
}

export async function fetchUserById({
  queryKey,
}: QueryFunctionContext<['userById', string]>): Promise<User> {
  // Destructure your key tuple
  const [userId] = queryKey;
  const response = await API.get<User>(`/user/${userId}`);
  return response.data;
}

export async function toggleUserStatus(userId: string, active: boolean): Promise<User> {
  const response = await API.patch<User>(`/user/update/${userId}`, { active });
  return response.data;
}

export const getUsers = async (data?: GetUsersData) => {
  return API.get('/user/users', { params: data });
};

export const getCurrentUser = async (): Promise<User> => {
  return API.get('/user/current');
};
