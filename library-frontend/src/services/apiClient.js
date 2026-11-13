import axios from 'axios';
import { API_BASE_URL } from './config';
import { supabase } from './supabaseClient';

/**
 * Axios instance dùng chung cho mọi request tới Spring Boot.
 * - Tự gắn "Authorization: Bearer <access_token>" lấy từ phiên Supabase.
 * - Chuẩn hoá lỗi thành Error có message tiếng Việt dễ hiển thị.
 */
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use(async (config) => {
  if (supabase) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(toApiError(error)),
);

export function toApiError(error) {
  if (error?.isApiError) return error;
  const status = error?.response?.status;
  const serverMessage = error?.response?.data?.message;
  let message = serverMessage;
  if (!message) {
    if (!error?.response) message = 'Không kết nối được máy chủ. Vui lòng kiểm tra backend hoặc mạng.';
    else if (status === 401) message = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
    else if (status === 403) message = 'Bạn không có quyền thực hiện thao tác này.';
    else if (status === 404) message = 'Không tìm thấy dữ liệu yêu cầu.';
    else message = 'Đã có lỗi xảy ra. Vui lòng thử lại.';
  }
  const apiError = new Error(message);
  apiError.isApiError = true;
  apiError.status = status;
  apiError.details = error?.response?.data?.errors;
  return apiError;
}

export default apiClient;
