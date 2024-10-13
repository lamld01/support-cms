import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/widgets';
import { TestApi, TestApiFilter } from '../../model/type';
import { WEB_ROUTER } from '@/utils/web_router';
import { deleteTestApi, getJsonBodyExampleTestApi, getTestApis, requestToTestApi } from '../../service/TestFieldService';
import { useNavigate } from 'react-router-dom';
import JsonViewModal from '@/widgets/LayoutViewJson/ui/page/JsonView';
import TestApiTable from '../../component/TestApiTable';

const ListTestApi = () => {
    const modelViewBodyName = 'model_body_view';
    const modelViewRequestName = 'model_request_view';
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [testApiFilter, setTestApiFilter] = useState<TestApiFilter>({
        page: 0,
        size: 20,
        sort: []
    });
    const [metadata, setMetadata] = useState({
        page: 0,
        size: 20,
        total: 0,
    });
    const [testApis, setTestApis] = useState<TestApi[]>([]);
    const [loading, setLoading] = useState(false);
    // Updated loadingJsonView to be an object
    const [loadingJsonView, setLoadingJsonView] = useState({
        [modelViewBodyName]: false,
        [modelViewRequestName]: false,
    });
    const [modalData, setModalData] = useState<any | undefined>(null);

    // const fetchProjects = async (name?: string) => {
    //     try {
    //         const filter = {
    //             projectName: name,
    //             page: 0,
    //             size: 10,
    //             sort: "createdAt,desc"
    //         };
    //         const response = await getProjects(filter);
    //         setProjects(response.data);
    //     } catch (error: any) {
    //         toast.error(t(`message.${error.message}`));
    //     }
    // };

    const fetchTestApis = async (filter?: TestApiFilter) => {
        setLoading(true);
        try {
            const response = await getTestApis(filter || testApiFilter);
            setTestApis(response.data);
            setMetadata({ ...metadata, total: response.metadata.total });
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        } finally {
            setLoading(false);
        }
    };

    const getJsonBodyExample = async (id: number) => {
        setLoadingJsonView((prev) => ({ ...prev, [modelViewBodyName]: true })); // Set loading for body view
        try {
            const response = await getJsonBodyExampleTestApi(id);
            setModalData(response.data); // Set the data for modal
            const modal = document.getElementById(modelViewBodyName);
            if (modal instanceof HTMLDialogElement) {
                modal.showModal();
            }
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        } finally {
            setLoadingJsonView((prev) => ({ ...prev, [modelViewBodyName]: false })); // Reset loading for body view
        }
    };

    const requestTestApi = async (id: number) => {
        setLoadingJsonView((prev) => ({ ...prev, [modelViewRequestName]: true })); // Set loading for request view
        const modal = document.getElementById(modelViewRequestName);
        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        }
        try {
            const response = await requestToTestApi(id);
            setModalData(response.data); // Set the data for modal
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        } finally {
            setLoadingJsonView((prev) => ({ ...prev, [modelViewRequestName]: false })); // Reset loading for request view
        }
    };

    useEffect(() => {
        fetchTestApis();
    }, [testApiFilter.page, testApiFilter.projectId]);

    useEffect(() => {
        // fetchProjects();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTestApiFilter({ ...testApiFilter, [name]: value });
    };

    const handleSearch = () => {
        setTestApiFilter({ ...testApiFilter, page: 0 });
        fetchTestApis({ ...testApiFilter, page: 0 });
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
                                className="grow"
                                placeholder={t('text.testApi.apiName')}
                                name="fieldName"
                                value={testApiFilter.apiName || ''}
                                onChange={handleFilterChange}
                                onBlur={handleSearch}
                            />
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70 cursor-pointer"
                                onClick={handleSearch}
                            >
                                <path
                                    fillRule="evenodd"
                                    d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
                                    clipRule="evenodd"
                                />
                            </svg>
                        </label>
                    </div>
                    <button className="btn btn-xs btn-primary" onClick={handleSearch}>
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
