import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoRefreshCircleOutline } from 'react-icons/io5';
import JsonView from 'react18-json-view'; // Đảm bảo rằng bạn đã cài đặt react18-json-view
import 'react18-json-view/src/style.css'
interface JsonViewModalProps {
    data: any; // Thay thế bằng kiểu dữ liệu JSON phù hợp
    viewName: string; // Thêm thuộc tính id
    loading?: boolean; // Thêm trạng thái loading
    refresh?: () => void; // Thêm hàm refresh
}

const JsonViewModal: React.FC<JsonViewModalProps> = ({ data, viewName, loading, refresh }) => {
    const { t } = useTranslation();

    const [filter, setFilter] = useState('');
    const [theme, setTheme] = useState<'default' | 'a11y' | 'github' | 'vscode' | 'atom' | 'winter-is-coming'>('default'); // Default theme

    // Hàm để lọc dữ liệu dựa trên input
    const filterData = (data: any, filter: string) => {
        if (!filter) return data; // Trả lại dữ liệu gốc nếu filter trống
        const regex = new RegExp(filter, 'i'); // Regex không phân biệt chữ hoa chữ thường cho việc lọc
        return Object.keys(data)
            .filter(key => regex.test(key)) // Lọc các key dựa trên input
            .reduce((acc, key) => {
                acc[key] = data[key]; // Xây dựng đối tượng mới với các key đã lọc
                return acc;
            }, {} as any);
    };

    const filteredData = filterData(data, filter);

    return (
        <dialog id={viewName} className="modal">
            <div className="modal-box max-w-5xl max-h-[90vh] overflow-y-auto p-6">
            <h3 className="font-bold text-lg">{t('common.text.result')}</h3>

                {/* Input để lọc dữ liệu */}
                <input
                    type="text"
                    placeholder={t('common.text.filter')}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="input input-bordered mb-4"
                />

                {/* Lựa chọn theme */}
                <div className="mb-4">
                    <label className="block mb-2">{t('common.select.theme')}</label>
                    <select
                        value={theme}
                        onChange={(e) => setTheme(e.target.value as typeof theme)} // Cast thành kiểu phù hợp
                        className="select select-bordered w-full"
                    >
                        <option value="default">Default</option>
                        <option value="a11y">A11y</option>
                        <option value="github">GitHub</option>
                        <option value="vscode">VSCode</option>
                        <option value="atom">Atom</option>
                        <option value="winter-is-coming">Winter Is Coming</option>
                    </select>
                </div>

                <div className="py-4 relative">
                    {/* Icon Refresh */}
                    {refresh && (
                        <button
                            onClick={refresh}
                            className="absolute top-0 right-0 p-2 text-gray-600 hover:text-gray-800"
                            aria-label="Refresh"
                        >
                            <IoRefreshCircleOutline className="h-5 w-5" />
                        </button>
                    )}

                    {loading ? (
                        // Hiện chỉ báo loading khi dữ liệu đang tải
                        <div className="flex justify-center items-center">
                            <span className="loading loading-spinner loading-lg"></span>
                            <span className="ml-2">{t('common.text.loading...')}</span>
                        </div>
                    ) : (
                        <JsonView
                            src={filteredData}
                            theme={theme}
                            enableClipboard={false}
                            collapsed={false}
                            style={{
                                border: '1px solid gray', // Biên quanh JSON view
                                padding: '8px',           // Padding cho JSON view
                                borderRadius: '4px',      // Góc bo tròn
                                overflow: 'auto',          // Thêm cuộn nếu nội dung tràn
                            }}
                        />
                    )}
                </div>

                <div className="modal-action">
                    <form method="dialog">
                        <button className="btn">{t('common.button.close')}</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default JsonViewModal;
