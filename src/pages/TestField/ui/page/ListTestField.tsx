import React, { useCallback, useEffect, useState, useRef } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/widgets';
import { TestField, TestFieldFilter } from '../../model/type';
import { WEB_ROUTER } from '@/utils/web_router';
import ModalCreate from '../../component/ModalCreate';
import ModalUpdate from '../../component/ModalUpdate';
import { getTestFields } from '../../service/TestFieldService';
import { Project } from '@/pages/Project';
import { getProjects } from '@/config/service';
import { getValidateConstrains } from '@/pages/ValidateConstrain/service';
import { ValidateConstrain } from '@/pages/ValidateConstrain/model/type';
import { Autocomplete } from '@/component';
import TestFieldTable from '../../component/TestFieldTable';
import { getTestApis } from '@/pages/TestApi/service/TestFieldService';
import { TestApi } from '@/pages/TestApi/model/type';
import debounce from 'lodash/debounce';

const ListTestField = () => {
    const modalCreateName = 'modal_test_field_create_project';
    const modalUpdateName = 'modal_test_field_update_project';
    const { t } = useTranslation();

    const [projects, setProjects] = useState<Project[]>([]);
    const [apis, setApis] = useState<TestApi[]>([]);
    const [validateConstrains, setValidateConstrains] = useState<ValidateConstrain[]>([]);
    const [testFieldFilter, setTestFieldFilter] = useState<TestFieldFilter>({
        fieldName: '',
        projectId: undefined,
        apiId: undefined,
        page: 0,
        size: 20,
        sort: "updatedAt,desc"
    });
    const [selectedTestField, setSelectedTestField] = useState<TestField | null>(null);
    const [metadata, setMetadata] = useState({ page: 0, size: 20, total: 0 });
    const [testFields, setTestFields] = useState<TestField[]>([]);
    const [loading, setLoading] = useState(false);

    // Create a debounced function outside the component to avoid redefining it on each render
    const debouncedFetchTestFields = useRef(debounce((filter: TestFieldFilter) => {
        fetchTestFields(filter);
    }, 300)).current;

    // Fetch projects
    const fetchProjects = useCallback(async (name?: string) => {
        try {
            const filter = {
                projectName: name,
                page: 0,
                size: 10,
                sort: "updatedAt,desc"
            };
            const response = await getProjects(filter);
            setProjects(response.data);
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        }
    }, [t]);

    // Fetch APIs
    const fetchApis = useCallback(async (name?: string) => {
        try {
            const filter = {
                apiName: name,
                projectId: testFieldFilter.projectId,
                page: 0,
                size: 10,
                sort: "updatedAt,desc"
            };
            const response = await getTestApis(filter);
            setApis(response.data);
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        }
    }, [t, testFieldFilter.projectId, testFieldFilter.apiId]);

    // Fetch test fields
    const fetchTestFields = useCallback(async (filter?: TestFieldFilter) => {
        setLoading(true);
        try {
            const response = await getTestFields(filter);
            setTestFields(response.data);
            setMetadata(prev => ({ ...prev, total: response.metadata.total })); // Update total without changing metadata
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        } finally {
            setLoading(false);
        }
    }, [t]);

    // Fetch validate constraints
    const fetchValidateConstrains = useCallback(async (name?: string) => {
        try {
            const filter = {
                validateConstrainName: name,
                page: 0,
                size: 10,
                sort: "updatedAt,desc"
            };
            const response = await getValidateConstrains(filter);
            setValidateConstrains(response.data);
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        }
    }, [t]);

    // Initial data fetch
    useEffect(() => {
        const fetchData = async () => {
            await fetchProjects();
            await fetchValidateConstrains();
        };
        fetchData();
    }, [fetchProjects, fetchValidateConstrains, fetchApis]);

    // Fetch test fields when filters change
    useEffect(() => {
        fetchTestFields(testFieldFilter);
    }, [fetchTestFields, testFieldFilter.projectId, testFieldFilter.apiId]);

    // Fetch APIs when projectId changes
    useEffect(() => {
        fetchApis();
    }, [fetchApis, testFieldFilter.projectId]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTestFieldFilter((prev) => ({ ...prev, [name]: value }));

        // Debounced search function
        if (name === "fieldName") {
            debouncedFetchTestFields({ ...testFieldFilter, fieldName: value, page: 0 }); // Reset page on search
        }
    };

    const handleSearch = () => {
        setTestFieldFilter((prev) => ({ ...prev, page: 0 })); // Reset to first page on search
        fetchTestFields({ ...testFieldFilter, page: 0 });
    };

    const handleClearInput = () => {
        setTestFieldFilter((prev) => ({ ...prev, fieldName: '', page: 0 })); // Clear input and reset to first page
        fetchTestFields({ ...testFieldFilter, fieldName: '', page: 0 }); // Fetch with cleared fieldName
    };

    const handlePageChange = (newPage: number) => {
        setTestFieldFilter((prev) => ({ ...prev, page: newPage }));
    };

    // Open update modal with selected test field
    const handleOpenUpdateModal = (testField: TestField) => {
        setSelectedTestField(testField);
        const modal = document.getElementById(modalUpdateName);
        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        }
    };

    return (
        <PageLayout
            breadcrumbs={[
                { label: t('breadcrumbs.home'), url: '/' },
                { label: t('breadcrumbs.listTestFields'), url: WEB_ROUTER.LIST_TEST_FIELD.ROOT, active: true },
            ]}
            title={t('breadcrumbs.listTestFields')}
        >
            {/* Filter Section */}
            <div className="join-item flex justify-between items-center p-4 rounded-lg mb-4">
                <button className="btn btn-primary btn-xs" onClick={() => {
                    const modal = document.getElementById(modalCreateName);
                    if (modal instanceof HTMLDialogElement) {
                        modal.showModal();
                    }
                }}>
                    {t("common.button.create")}
                </button>
                <form
                    className="join join-horizontal gap-1"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
                    {/* api */}
                    <div className="relative z-10">
                        <Autocomplete
                            options={apis.map((api) => ({
                                label: api.apiName,
                                value: api.id,
                            }))}
                            value={apis.find((api) => api.id === testFieldFilter.apiId)?.apiName}
                            onChange={(value) => setTestFieldFilter({ ...testFieldFilter, apiId: value ? Number(value) : undefined })}
                            onInputChange={(value) => fetchApis(value)}
                            placeholder={t('text.testField.selectApi')}
                        />
                    </div>

                    {/* project */}
                    <div className="relative z-10">
                        <Autocomplete
                            options={projects.map((project) => ({
                                label: project.projectName,
                                value: project.id,
                            }))}
                            onChange={(value) => setTestFieldFilter({ ...testFieldFilter, projectId: value ? Number(value) : undefined })}
                            placeholder={t('text.testField.selectProject')}
                        />
                    </div>

                    {/* Test Field Name input */}
                    <div className="relative">
                        <label className="input input-bordered flex items-center input-xs gap-2">
                            <input
                                type="text"
                                className="grow bg-inherit"
                                placeholder={t('text.testField.fieldName')}
                                name="fieldName"
                                value={testFieldFilter.fieldName || ''}
                                onChange={handleFilterChange}
                                onBlur={handleSearch}
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


                    <button className="btn btn-primary btn-xs">{t('common.button.search')}</button>
                </form>
            </div>

            {/* Table Section */}
            <TestFieldTable
                testFields={testFields}
                loading={loading}
                fetchTestFields={fetchTestFields}
                handleOpenUpdateModal={handleOpenUpdateModal}
            />

            {/* Pagination Section */}
            <div className="flex justify-center p-4">
                <div className="btn-group">
                    <button
                        className={`btn ${testFieldFilter.page === 0 ? 'btn-disabled' : ''}`}
                        onClick={() => handlePageChange(testFieldFilter.page - 1)}
                        disabled={testFieldFilter.page === 0}
                    >
                        «
                    </button>
                    <button className="btn">{testFieldFilter.page + 1}</button>
                    <button
                        className={`btn ${testFieldFilter.page + 1 >= Math.ceil(metadata.total / testFieldFilter.size) ? 'btn-disabled' : ''}`}
                        onClick={() => handlePageChange(testFieldFilter.page + 1)}
                        disabled={testFieldFilter.page + 1 >= Math.ceil(metadata.total / testFieldFilter.size)}
                    >
                        »
                    </button>
                </div>
            </div>
            {/* Create and Update Modals */}
            <ModalCreate
                modalName={modalCreateName}
                fetchTestFields={fetchTestFields}
                projects={projects}
                validateConstrains={validateConstrains}
                fetchValidateConstrains={fetchValidateConstrains} />
            <ModalUpdate
                modalName={modalUpdateName}
                fetchTestFields={fetchTestFields}
                testField={selectedTestField}
                projects={projects}
                validateConstrains={validateConstrains}
                fetchValidateConstrains={fetchValidateConstrains} />
        </PageLayout>
    );
};

export default ListTestField;
