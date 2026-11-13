import apiClient from './apiClient';
import { USE_MOCK } from './config';
import { mockAdmin } from './mockStore';
import { mapUser } from './mappers';

/**
 * Các endpoint quản trị bổ sung (sẽ xây ở Giai đoạn 7):
 *   GET /api/admin/stats
 *   GET /api/admin/users
 *   PUT /api/admin/users/{id}/role
 */
export const adminService = {
  async stats() {
    if (USE_MOCK) return mockAdmin.stats();
    const { data } = await apiClient.get('/admin/stats');
    return data;
  },
  async users() {
    if (USE_MOCK) return mockAdmin.users();
    const { data } = await apiClient.get('/admin/users');
    return (data.content ?? data).map(mapUser);
  },
  async updateUserRole(id, role) {
    if (USE_MOCK) return mockAdmin.updateUserRole(id, role);
    const { data } = await apiClient.put(`/admin/users/${id}/role`, { role });
    return mapUser(data);
  },
};
