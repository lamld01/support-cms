import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Nhớ import CSS của react-toastify

const LayoutLogin = () => {
    return (
        <div className='flex justify-center items-center w-screen h-screen'>
            <ToastContainer
                autoClose={5000}           // Tự động tắt sau 5 giây
                closeButton                // Hiển thị nút đóng
                className="text-sm"        // Thay đổi kích thước chữ (tùy chỉnh theo nhu cầu)
                style={{ width: '350px' }} // Điều chỉnh chiều rộng
            />
            <Outlet />
        </div>
    );
}

export default LayoutLogin;
