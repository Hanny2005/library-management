import apiClient from './apiClient';
import { USE_MOCK } from './config';
import { mockCategories } from './mockStore';
import { mapCategory } from './mappers';

export const categoryService = {
  async list() {
    if (USE_MOCK) return mockCategories.list();
    const { data } = await apiClient.get('/categories');
    return data.map(mapCategory);
  },
  async create(payload) {
    if (USE_MOCK) return mockCategories.create(payload);
    const { data } = await apiClient.post('/categories', payload);
    return mapCategory(data);
  },
  async update(id, payload) {
    if (USE_MOCK) return mockCategories.update(id, payload);
    const { data } = await apiClient.put(`/categories/${id}`, payload);
    return mapCategory(data);
  },
  async remove(id) {
    if (USE_MOCK) return mockCategories.remove(id);
    await apiClient.delete(`/categories/${id}`);
  },
};
