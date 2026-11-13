import apiClient from './apiClient';
import { USE_MOCK } from './config';
import { mockBorrowings } from './mockStore';
import { mapBorrowing } from './mappers';

/**
 * Lưu ý bảo mật: frontend KHÔNG gửi userId. Backend lấy danh tính từ JWT.
 * payload tạo phiếu: { items: [{ bookId, quantity }], borrowDays, note }
 */
export const borrowingService = {
  async create(payload) {
    if (USE_MOCK) return mockBorrowings.create(payload);
    const { data } = await apiClient.post('/borrowings', payload);
    return mapBorrowing(data);
  },
  async my() {
    if (USE_MOCK) return mockBorrowings.my();
    const { data } = await apiClient.get('/borrowings/my');
    return (data.content ?? data).map(mapBorrowing);
  },
  async all(params = {}) {
    if (USE_MOCK) return mockBorrowings.all(params);
    const { data } = await apiClient.get('/borrowings', { params: { status: params.status || undefined } });
    return (data.content ?? data).map(mapBorrowing);
  },
  async approve(id) {
    if (USE_MOCK) return mockBorrowings.approve(id);
    const { data } = await apiClient.put(`/borrowings/${id}/approve`);
    return mapBorrowing(data);
  },
  async reject(id) {
    if (USE_MOCK) return mockBorrowings.reject(id);
    const { data } = await apiClient.put(`/borrowings/${id}/reject`);
    return mapBorrowing(data);
  },
  async markReturned(id) {
    if (USE_MOCK) return mockBorrowings.markReturned(id);
    const { data } = await apiClient.put(`/borrowings/${id}/return`);
    return mapBorrowing(data);
  },
};
