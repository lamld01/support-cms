import { store } from '@/app/store';
import { clearToken, TokenState } from '@/config/slice/token/slice';
import axios from 'axios';

// Tạo một instance của Axios
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8200/v1/manual-test',
  // baseURL: 'https://dev-tools-api.luckypresent.com.vn/v1/manual-test',
  timeout: 10000,
});

// Thêm interceptor cho yêu cầu để thêm token vào headers
axiosInstance.interceptors.request.use(
  (config : any) => {
    const tokenState: TokenState = store.getState().token as TokenState;
    if (tokenState.accessToken) {
      config.headers['Authorization'] = `Bearer ${tokenState.accessToken}`;
    }
    return config;
  },
  (error  : any) => {
    return Promise.reject(error);
  }
);

// Thêm interceptor cho phản hồi để xử lý lỗi
axiosInstance.interceptors.response.use(
  (response  : any) => {
    return response; // Trả lại phản hồi thành công
  },
  (error  : any) => {
    
    // Kiểm tra mã lỗi
    if (error.response && error.response.status === 400) {
      const message = error.response.data.message; // Lấy thông báo từ phản hồi
      throw Error(message);
    } else if (error.response && (error.response.status === 401 || error.response.status === 403)) {     
      store.dispatch(clearToken());
    } else {
      throw Error("InternalServerError");
    }
  }
);

export default axiosInstance;
