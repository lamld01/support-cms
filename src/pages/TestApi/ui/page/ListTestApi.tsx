import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/widgets';
import { TestApi, TestApiFilter } from '../../model/type';
import { WEB_ROUTER } from '@/utils/web_router';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Project } from '@/pages/Project';
import { getProjects } from '@/config/service';
import { deleteTestApi, getTestApis } from '../../service/TestFieldService';
import { useNavigate } from 'react-router-dom';
import JSONPretty from 'react-json-pretty';

const ListTestApi = () => {

    const { t } = useTranslation();
    const navigate = useNavigate();
    const [projects, setProjects] = useState<Project[]>([]);
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
    const [testApis, setTestApis] = useState<TestApi[]>([]); // Updated state type
    const [loading, setLoading] = useState(false);

    const fetchProjects = async (name?: string) => {
        try {
            const filter = {
                projectName: name,
                page: 0,
                size: 10,
                sort: "createdAt,desc"
            };
            const response = await getProjects(filter);
            setProjects(response.data);
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        }
    };

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

    useEffect(() => {
        fetchTestApis();
    }, [testApiFilter.page]);

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTestApiFilter({ ...testApiFilter, [name]: value });
    };

    const handleSearch = () => {
        setTestApiFilter({ ...testApiFilter, page: 0 }); // Reset to first page on search
        fetchTestApis({ ...testApiFilter, page: 0 });
    };

    const handlePageChange = (newPage: number) => {
        setTestApiFilter({ ...testApiFilter, page: newPage });
    };


    // Delete test api
    const handleDeleteTestApi = async (id: number) => {
        const confirmDelete = window.confirm(t('Are you sure you want to delete this test api?'));
        if (confirmDelete) {
            try {
                await deleteTestApi(id);
                toast.success(t('Test api deleted successfully'));
                fetchTestApis(); // Refresh test api list after deletion
            } catch (error: any) {
                toast.error(t(`message.${error.message}`));
            }
        }
    };

    return (
        <PageLayout
            breadcrumbs={[
                { label: t('breadcrumbs.home'), url: '/' },
                { label: t('breadcrumbs.listTestApis'), url: WEB_ROUTER.LIST_TEST_API.ROOT, active: true },
            ]}
            loading={loading}
            title={t('breadcrumbs.listTestApis')}
        >
            {/* Filter Section */}
            <div className="join-item flex justify-between items-center p-4 rounded-lg mb-4">
                <button className="btn btn-primary btn-xs" onClick={() => navigate(WEB_ROUTER.LIST_TEST_API.CREATE.PATH)}>
                    {t("common.button.create")}
                </button>
                <form
                    className="join join-horizontal gap-1"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
                    {/* Test Api Name input */}
                    <div className="relative">
                        <label className="input input-bordered flex items-center input-xs gap-2">
                            <input
                                type="text"
                                className="grow"
                                placeholder={t('text.testApi.apiName')}
                                name="apiName"
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

                    <button className="btn btn-primary btn-xs">{t('common.button.search')}</button>
                </form>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="table table-zebra text-center">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('common.text.ID')}</th>
                            <th>{t('text.testApi.apiName')}</th>
                            <th>{t('text.testApi.project')}</th>
                            <th>{t('text.testApi.description')}</th>
                            <th>{t('text.testApi.header')}</th>
                            <th>{t('text.testApi.param')}</th>
                            <th>{t('text.testApi.body')}</th>
                            <th>{t('common.text.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testApis.length > 0 ? (
                            testApis.map((api, index) => (
                                <tr key={api.id}>
                                    <th>{index + 1 + testApiFilter.page * testApiFilter.size}</th>
                                    <td>{api.id || 'N/A'}</td>
                                    <td>{api.apiName || 'N/A'}</td>
                                    <td>{api.project?.projectName || 'N/A'}</td>
                                    <td>{api.description || 'N/A'}</td>
                                    <td>
                                        <div>
                                            <JSONPretty
                                                className="json-display"
                                                id="testApi_param_value"
                                                data={api.param}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                        <div>
                                            <JSONPretty
                                                className="json-display"
                                                id="testApi_header_value"
                                                data={api.header}
                                            />
                                        </div>
                                    </td>
                                    <td>
                                            <JSONPretty
                                                className="json-display"
                                                id="testApi_body_value"
                                                data={JSON.parse(api.body)}
                                            />
                                    </td>
                                    <td className="justify-center items-center h-full">
                                        <button
                                            className="btn btn-sm btn-warning mx-2 "
                                            onClick={() => navigate(`${WEB_ROUTER.LIST_TEST_API.UPDATE.PATH}/${api.id}`)}
                                            title={t(`common.button.edit`)}
                                        >
                                            <PencilIcon className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-error mx-2"
                                            onClick={() => handleDeleteTestApi(api.id)}
                                            title={t(`common.button.delete`)}
                                        >
                                            <TrashIcon className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={9} className="text-center">
                                    {t('No data available')}
                                </td>
                            </tr>
                        )}
                    </tbody>

                </table>
            </div>

            {/* Pagination Section */}
            <div className="flex justify-center p-4">
                <div className="btn-group">
                    <button
                        className={`btn ${testApiFilter.page === 0 ? 'btn-disabled' : ''}`}
                        onClick={() => handlePageChange(testApiFilter.page - 1)}
                        disabled={testApiFilter.page === 0}
                    >
                        «
                    </button>
                    <button className="btn">{testApiFilter.page + 1}</button>
                    <button
                        className={`btn ${testApiFilter.page + 1 >= Math.ceil(metadata.total / testApiFilter.size) ? 'btn-disabled' : ''}`}
                        onClick={() => handlePageChange(testApiFilter.page + 1)}
                        disabled={testApiFilter.page + 1 >= Math.ceil(metadata.total / testApiFilter.size)}
                    >
                        »
                    </button>
                </div>
            </div>
        </PageLayout>
    );
};

export default ListTestApi;
