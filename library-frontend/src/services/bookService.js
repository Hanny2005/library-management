import apiClient from './apiClient';
import { USE_MOCK } from './config';
import { mockBooks } from './mockStore';
import { mapBook, mapPage } from './mappers';

// Chuyển kiểu sắp xếp của giao diện sang tham số sort của Spring Data Pageable
const SORT_MAP = {
  newest: 'createdAt,desc',
  title: 'title,asc',
  featured: 'quantity,desc',
};

/** params: { search, categoryId, page, size, sort } */
export const bookService = {
  async list(params = {}) {
    if (USE_MOCK) return mockBooks.list(params);
    const { search, categoryId, page = 0, size = 12, sort } = params;
    const { data } = await apiClient.get('/books', {
      params: { search: search || undefined, categoryId: categoryId || undefined, page, size, sort: SORT_MAP[sort] },
    });
    return mapPage(data, mapBook, page, size);
  },
  async get(id) {
    if (USE_MOCK) return mockBooks.get(id);
    const { data } = await apiClient.get(`/books/${id}`);
    return mapBook(data);
  },
  async create(payload) {
    if (USE_MOCK) return mockBooks.create(payload);
    const { data } = await apiClient.post('/books', payload);
    return mapBook(data);
  },
  async update(id, payload) {
    if (USE_MOCK) return mockBooks.update(id, payload);
    const { data } = await apiClient.put(`/books/${id}`, payload);
    return mapBook(data);
  },
  async remove(id) {
    if (USE_MOCK) return mockBooks.remove(id);
    await apiClient.delete(`/books/${id}`);
  },
};
