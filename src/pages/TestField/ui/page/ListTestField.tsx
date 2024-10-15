import React, { useEffect, useState } from 'react';
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

interface ListTestFieldProps {
    apiId?: number
    className?: string
}
const ListTestField = (props?: ListTestFieldProps) => {
    const modalCreateName = 'modal_test_field_create_project'; // Updated modal names
    const modalUpdateName = 'modal_test_field_update_project';
    const { t } = useTranslation();

    const [projects, setProjects] = useState<Project[]>([]);
    const [apis, setApis] = useState<TestApi[]>([]);
    const [validateConstrains, setValidateConstrains] = useState<ValidateConstrain[]>([]);
    const [testFieldFilter, setTestFieldFilter] = useState<TestFieldFilter>({
        fieldName: '',
        projectId: undefined,
        page: 0,
        size: 20,
        sort: "createdAt,desc"
    });
    const [selectedTestField, setSelectedTestField] = useState<TestField | null>(null); // for the update modal
    const [metadata, setMetadata] = useState({
        page: 0,
        size: 20,
        total: 0,
    });
    const [testFields, setTestFields] = useState<TestField[]>([]); // Updated state type
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

    const fetchApis = async (name?: string) => {
        try {
            const filter = {
                apiName: name,
                projectId: testFieldFilter.projectId,
                page: 0,
                size: 10,
                sort: "createdAt,desc"
            };
            const response = await getTestApis(filter);
            setApis(response.data);
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        }
    };

    const fetchTestFields = async (filter?: TestFieldFilter) => {
        setLoading(true);
        try {
            const response = await getTestFields(filter || testFieldFilter);
            setTestFields(response.data);
            setMetadata({ ...metadata, total: response.metadata.total });
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        } finally {
            setLoading(false);
        }
    };

    const fetchValidateConstrains = async (name?: string) => {
        try {
            const filter = {
                validateConstrainName: name,
                page: 0,
                size: 10,
                sort: "createdAt,desc"
            };
            const response = await getValidateConstrains(filter);
            setValidateConstrains(response.data);
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        }
    };

    // API change handler
    const hanldeApiChange = (apiId?: number) => {
        setTestFieldFilter((prev) => ({ ...prev, apiId }));
        fetchTestFields({ ...testFieldFilter, apiId });
    };

    // Combine all initial data fetches in a single useEffect
    useEffect(() => {
        const fetchData = async () => {
            await fetchProjects();
            await fetchValidateConstrains();
        };
        fetchData();
    }, []);

    // Fetch test fields when filters change
    useEffect(() => {
        fetchTestFields();
    }, [testFieldFilter.page, testFieldFilter.projectId, testFieldFilter.apiId]);

    // Fetch APIs when projectId changes
    useEffect(() => {
        fetchApis();
    }, [testFieldFilter.projectId]);

    // Initialize test fields if apiId is passed via props
    useEffect(() => {
        if (props?.apiId) {
            setTestFieldFilter((prev) => ({ ...prev, apiId: props.apiId }));
            fetchTestFields();
        }
    }, [props?.apiId]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setTestFieldFilter({ ...testFieldFilter, [name]: value });
    };

    const handleSearch = () => {
        setTestFieldFilter({ ...testFieldFilter, page: 0 }); // Reset to first page on search
        fetchTestFields({ ...testFieldFilter, page: 0 });
    };

    const handlePageChange = (newPage: number) => {
        setTestFieldFilter({ ...testFieldFilter, page: newPage });
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
            className={props?.className}
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
                        e.preventDefault()
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
                            onChange={(value) => hanldeApiChange(value ? Number(value) : undefined)}
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
                                className="grow"
                                placeholder={t('text.testField.fieldName')}
                                name="fieldName"
                                value={testFieldFilter.fieldName || ''}
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
