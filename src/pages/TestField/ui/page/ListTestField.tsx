import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/widgets';
import { TestField, TestFieldFilter } from '../../model/type';
import { WEB_ROUTER } from '@/utils/web_router';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalCreate from '../../component/ModalCreate';
import ModalUpdate from '../../component/ModalUpdate';
import { deleteTestField, getTestFields } from '../../service/TestFieldService';

const ListTestField = () => {
    const modalCreateName = 'modal_test_field_create_project'; // Updated modal names
    const modalUpdateName = 'modal_test_field_update_project';
    const { t } = useTranslation();
    const [testFieldFilter, setTestFieldFilter] = useState<TestFieldFilter>({
        page: 0,
        size: 20,
        sort: []
    });
    const [selectedTestField, setSelectedTestField] = useState<TestField | null>(null); // for the update modal
    const [metadata, setMetadata] = useState({
        page: 0,
        size: 20,
        total: 0,
    });
    const [testFields, setTestFields] = useState<TestField[]>([]); // Updated state type
    const [loading, setLoading] = useState(false);

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

    useEffect(() => {
        fetchTestFields();
    }, [testFieldFilter.page]);

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

    // Delete test field
    const handleDeleteTestField = async (id: number) => {
        const confirmDelete = window.confirm(t('Are you sure you want to delete this test field?'));
        if (confirmDelete) {
            try {
                await deleteTestField(id);
                toast.success(t('Test field deleted successfully'));
                fetchTestFields(); // Refresh test field list after deletion
            } catch (error: any) {
                toast.error(t(`message.${error.message}`));
            }
        }
    };

    return (
        <PageLayout
            breadcrumbs={[
                { label: t('breadcrumbs.home'), url: '/' },
                { label: t('breadcrumbs.listTestFields'), url: WEB_ROUTER.LIST_TEST_FIELD, active: true },
            ]}
            loading={loading}
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
            <div className="overflow-x-auto">
                <table className="table table-zebra text-center">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('common.text.ID')}</th>
                            <th>{t('text.testField.fieldName')}</th>
                            <th>{t('text.testField.projectId')}</th>
                            <th>{t('text.testField.description')}</th>
                            <th>{t('text.testField.fieldCode')}</th>
                            <th>{t('text.testField.validateConstrainIds')}</th>
                            <th>{t('common.text.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {testFields.length > 0 ? (
                            testFields.map((field, index) => (
                                <tr key={field.id}>
                                    <th>{index + 1 + testFieldFilter.page * testFieldFilter.size}</th>
                                    <td>{field.id || 'N/A'}</td>
                                    <td>{field.fieldName || 'N/A'}</td>
                                    <td>{field.project.projectName || 'N/A'}</td>
                                    <td>{field.description || 'N/A'}</td>
                                    <td>{field.fieldCode || 'N/A'}</td>
                                    <td>
                                        {field.validateConstrains && field.validateConstrains.length > 0 ? (
                                            <ul className="list-disc list-inside">
                                                {field.validateConstrains.map((constraint, idx) => (
                                                    <li key={idx}>{constraint.constrainName}</li>
                                                ))}
                                            </ul>
                                        ) : (
                                            'N/A'
                                        )}
                                    </td>
                                    <td className="flex justify-center">
                                        <button
                                            className="btn btn-sm btn-warning mx-2"
                                            onClick={() => handleOpenUpdateModal(field)}
                                            title={t(`common.button.edit`)}
                                        >
                                            <PencilIcon className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-error mx-2"
                                            onClick={() => handleDeleteTestField(field.id)}
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
            <ModalCreate modalName={modalCreateName} fetchTestFields={fetchTestFields} />
            <ModalUpdate modalName={modalUpdateName} fetchTestFields={fetchTestFields} testField={selectedTestField} />
        </PageLayout>
    );
};

export default ListTestField;
