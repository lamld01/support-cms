import React, { useEffect, useState, useCallback, useRef } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/widgets';
import { TestApi, TestApiFilter } from '../../model/type';
import { WEB_ROUTER } from '@/utils/web_router';
import { deleteTestApi, getJsonBodyExampleTestApi, getTestApis, requestToTestApi } from '../../service/TestFieldService';
import { useNavigate } from 'react-router-dom';
import JsonViewModal from '@/widgets/LayoutViewJson/ui/page/JsonView';
import TestApiTable from '../../component/TestApiTable';
import { debounce } from 'lodash';

const ListTestApi = () => {
    const modelViewBodyName = 'model_body_view';
    const modelViewRequestName = 'model_request_view';
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [testApiFilter, setTestApiFilter] = useState<TestApiFilter>({
        page: 0,
        size: 20,
        sort: "updatedAt,desc",
        apiName: '',
    });

    const [metadata, setMetadata] = useState({
        page: 0,
        size: 20,
        total: 0,
    });

    const [testApis, setTestApis] = useState<TestApi[]>([]);
    const [loading, setLoading] = useState(false);
    const [loadingJsonView, setLoadingJsonView] = useState({
        [modelViewBodyName]: false,
        [modelViewRequestName]: false,
    });
    const [modalData, setModalData] = useState<any | undefined>(null);

    const fetchTestApis = useCallback(async (filter?: TestApiFilter) => {
        setLoading(true);
        try {
            const response = await getTestApis(filter);
            setTestApis(response.data);
            setMetadata(response.metadata);
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        } finally {
            setLoading(false);
        }
    }, [t]);

    const getJsonBodyExample = useCallback(async (id: number) => {
        setLoadingJsonView((prev) => ({ ...prev, [modelViewBodyName]: true }));
        try {
            const response = await getJsonBodyExampleTestApi(id);
            setModalData(response.data);
            const modal = document.getElementById(modelViewBodyName);
            if (modal instanceof HTMLDialogElement) {
                modal.showModal();
            }
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        } finally {
            setLoadingJsonView((prev) => ({ ...prev, [modelViewBodyName]: false }));
        }
    }, [modelViewBodyName, t]);

    const requestTestApi = useCallback(async (id: number) => {
        setLoadingJsonView((prev) => ({ ...prev, [modelViewRequestName]: true }));
        const modal = document.getElementById(modelViewRequestName);
        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        }
        try {
            const response = await requestToTestApi(id);
            setModalData(response.data);
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        } finally {
            setLoadingJsonView((prev) => ({ ...prev, [modelViewRequestName]: false }));
        }
    }, [modelViewRequestName, t]);

    useEffect(() => {
        fetchTestApis();
    }, [fetchTestApis]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTestApiFilter((prev) => ({ ...prev, [name]: value }));

        // Debounced search function
        if (name === "apiName") {
            debouncedFetchTestFields({ ...testApiFilter, apiName: value, page: 0 }); // Reset page on search
        }
    };

    // Create a debounced search function for the input
    const debouncedFetchTestFields = useRef(debounce((filter) => {
        fetchTestApis(filter); // Gọi hàm fetch với filter mới
    }, 300)).current;

    const handleClearInput = () => {
        setTestApiFilter((prev) => ({ ...prev, apiName: '', page: 0 })); // Clear input and reset to first page
        fetchTestApis({ ...testApiFilter, apiName: '', page: 0 }); // Fetch with cleared apiName
    };

    const handleDeleteTestApi = async (id: number) => {
        const confirmDelete = window.confirm(t('Are you sure you want to delete this test api?'));
        if (confirmDelete) {
            try {
                await deleteTestApi(id);
                toast.success(t('Test api deleted successfully'));
                fetchTestApis();
            } catch (error: any) {
                toast.error(t(`message.${error.message}`));
            }
        }
    };

    return (
        <PageLayout
            breadcrumbs={[{ label: t('breadcrumbs.home'), url: '/' }, { label: t('breadcrumbs.listTestApis'), url: WEB_ROUTER.LIST_TEST_API.ROOT, active: true }]}
            title={t('breadcrumbs.listTestApis')}
        >
            {/* Filter Section */}
            <div className="join-item flex justify-between items-center p-4 rounded-lg mb-4">
                <button className="btn btn-primary btn-xs" onClick={() => navigate(WEB_ROUTER.LIST_TEST_API.CREATE.PATH)}>
                    {t('common.button.create')}
                </button>
                <div className="flex items-center">
                        <div className="relative">
                            <label className="input input-bordered flex items-center input-xs gap-2">
                                <input
                                    type="text"
                                    className="grow bg-inherit"
                                    placeholder={t('text.testField.fieldName')}
                                    name="apiName" // Changed from 'fieldName' to 'apiName'
                                    value={testApiFilter.apiName || ''}
                                    onChange={(e) => {
                                        handleFilterChange(e); // Update state on change
                                    }}
                                />
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                    className="h-4 w-4 opacity-70 cursor-pointer"
                                    onClick={handleClearInput} // Clear input on click
                                >
                                    <path
                                        fillRule="evenodd"
                                        d="M6.293 6.293a1 1 0 011.414 0L10 8.586l2.293-2.293a1 1 0 111.414 1.414L11.414 10l2.293 2.293a1 1 0 01-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 01-1.414-1.414L8.586 10 6.293 7.707a1 1 0 010-1.414z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </label>
                        </div>
                        <button className="btn btn-xs btn-primary" onClick={() => fetchTestApis(testApiFilter)}>
                            {t('common.button.search')}
                        </button>
                    </div>
            </div>

            {/* Table */}
            <TestApiTable
                data={testApis}
                loading={loading}
                onViewJsonBody={getJsonBodyExample}
                onRequestTestApi={requestTestApi}
                onEdit={(id) => navigate(`${WEB_ROUTER.LIST_TEST_API.UPDATE.PATH}/${id}`)}
                onDelete={handleDeleteTestApi}
                page={testApiFilter.page}
                size={testApiFilter.size}
            />

            {/* Pagination and Modals */}
            <JsonViewModal
                viewName={modelViewBodyName}
                loading={loadingJsonView[modelViewBodyName]}
                data={modalData}
            />
            <JsonViewModal
                viewName={modelViewRequestName}
                loading={loadingJsonView[modelViewRequestName]}
                data={modalData}
            />
        </PageLayout>
    );
};

export default ListTestApi;
