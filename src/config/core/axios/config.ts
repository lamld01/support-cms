import { store } from '@/app/store';
import { clearToken, TokenState } from '@/config/slice/token/slice';
import { WEB_ROUTER } from '@/utils/web_router';
import axios from 'axios';

// Tạo một instance của Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8100',
  timeout: 1000,
});

// Thêm interceptor cho yêu cầu để thêm token vào headers
axiosInstance.interceptors.request.use(
  (config) => {
    const tokenState: TokenState = store.getState().token as TokenState;
    if (tokenState.accessToken) {
      config.headers['Authorization'] = `Bearer ${tokenState.accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho phản hồi để xử lý lỗi
axiosInstance.interceptors.response.use(
  (response) => {
    return response; // Trả lại phản hồi thành công
  },
  (error) => {
    
    // Kiểm tra mã lỗi
    if (error.response && error.response.status === 400) {
      const message = error.response.data.message; // Lấy thông báo từ phản hồi
      throw Error(message);
    } else if (error.response && (error.response.status === 401 || error.response.status === 403)) {     
      store.dispatch(clearToken());
      window.location.href = WEB_ROUTER.AUTH_LOGIN
    } else {
      throw Error("InternalServerError"); // Gọi hàm showError
    }
  }
);

export default axiosInstance;
