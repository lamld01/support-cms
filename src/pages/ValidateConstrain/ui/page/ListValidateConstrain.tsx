import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/widgets';
import { ValidateConstrain, ValidateConstrainFilter } from '../../model/type';
import { deleteValidateConstrain, getValidateConstrains } from '../../service';
import { WEB_ROUTER } from '@/utils/web_router';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import ModalCreate from '../../component/ModalCreate';
import ModalUpdate from '../../component/ModalUpdate';

const ListValidateConstrain = () => {
    const modalCreateName = 'modal_validate_constrain_create_project';
    const modalUpdateName = 'modal_validate_constrain_update_project';
    const { t } = useTranslation();
    const [validateConstrainFilter, setValidateConstrainFilter] = useState<ValidateConstrainFilter>({
        page: 0,
        size: 20,
        sort: ""
    });
    const [selectedValidateConstrain, setSelectedValidateConstrain] = useState<ValidateConstrain | null>(null); // for the update modal
    const [metadata, setMetadata] = useState({
        page: 0,
        size: 20,
        total: 0,
    });
    const [validateConstrains, setValidateConstrains] = useState<ValidateConstrain[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchValidateConstrain = async (filter?: ValidateConstrainFilter) => {
        setLoading(true);
        try {
            const response = await getValidateConstrains(filter || validateConstrainFilter);
            setValidateConstrains(response.data);
            setMetadata({ ...metadata, total: response.metadata.total });
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchValidateConstrain();
    }, [validateConstrainFilter.page]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setValidateConstrainFilter({ ...validateConstrainFilter, [name]: value });
    };

    const handleSearch = () => {
        setValidateConstrainFilter({ ...validateConstrainFilter, page: 0 }); // Reset to first page on search
        fetchValidateConstrain({ ...validateConstrainFilter, page: 0 });
    };

    const handlePageChange = (newPage: number) => {
        setValidateConstrainFilter({ ...validateConstrainFilter, page: newPage });
    };

    // Open update modal with selected project
    const handleOpenUpdateModal = (validateConstrain: ValidateConstrain) => {
        setSelectedValidateConstrain(validateConstrain);
        const modal = document.getElementById(modalUpdateName);
        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        }
    };

    // Delete project
    const handleDeleteProject = async (id: number) => {
        const confirmDelete = window.confirm(t('Are you sure you want to delete this project?'));
        if (confirmDelete) {
            try {
                await deleteValidateConstrain(id);
                toast.success(t('Project deleted successfully'));
                fetchValidateConstrain(); // Refresh project list after deletion
            } catch (error: any) {
                toast.error(t(`message.${error.message}`));
            }
        }
    };

    return (
        <PageLayout
            breadcrumbs={[
                { label: t('breadcrumbs.home'), url: '/' },
                { label: t('breadcrumbs.listValidateConstrains'), url: WEB_ROUTER.LIST_VALIDATE_CONSTRAIN.ROOT, active: true },
            ]}
            loading={loading}
            title={t('breadcrumbs.listValidateConstrains')}
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
                    {/* Constrain name input */}
                    <div className="relative">
                        <label className="input input-bordered flex items-center input-xs gap-2">
                            <input
                                type="text"
                                className="grow"
                                placeholder={t('text.validateConstrain.constrainName')}
                                name="validateConstrainName"
                                value={validateConstrainFilter.validateConstrainName || ''}
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

                    {/* Regex value input */}
                    <div className="relative">
                        <label className="input input-bordered flex items-center input-xs gap-2">
                            <input
                                type="text"
                                className="grow"
                                placeholder={t('text.validateConstrain.regexValue')}
                                name="regexValue"
                                value={validateConstrainFilter.regexValue || ''}
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

                    {/* Status Filter */}
                    <div className="relative">
                        <select
                            name="status"
                            className="input input-bordered w-full select-xs"
                            onChange={handleFilterChange}
                            value={validateConstrainFilter.status || ''}
                        >
                            <option value="">{t('common.select.status')}</option>
                            <option value='ACTIVE'>{t('common.status.active')}</option>
                            <option value='INACTIVE'>{t('common.status.inactive')}</option>
                        </select>
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
                            <th>{t('text.validateConstrain.constrainName')}</th>
                            <th>{t('common.select.status')}</th>
                            <th>{t('text.validateConstrain.regexValue')}</th>
                            <th>{t('common.text.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {validateConstrains.length > 0 ? (
                            validateConstrains.map((constrain, index) => (
                                <tr key={constrain.id}>
                                    <th>{index + 1 + validateConstrainFilter.page * validateConstrainFilter.size}</th>
                                    <td>{constrain.id || 'N/A'}</td>
                                    <td>{constrain.constrainName || 'N/A'}</td>
                                    <td>{constrain.status || 'N/A'}</td>
                                    <td>{constrain.regexValue || 'N/A'}</td>
                                    <td className="flex justify-center">
                                        <button
                                            className="btn btn-sm btn-warning mx-2"
                                            onClick={() => handleOpenUpdateModal(constrain)}
                                            title={t(`common.button.edit`)}
                                        >
                                            <PencilIcon className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                        <button
                                            className="btn btn-sm btn-error mx-2"
                                            onClick={() => handleDeleteProject(constrain.id)}
                                            title={t(`common.button.delete`)}
                                        >
                                            <TrashIcon className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center">
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
                        className={`btn ${validateConstrainFilter.page === 0 ? 'btn-disabled' : ''}`}
                        onClick={() => handlePageChange(validateConstrainFilter.page - 1)}
                        disabled={validateConstrainFilter.page === 0}
                    >
                        «
                    </button>
                    <button className="btn">{validateConstrainFilter.page + 1}</button>
                    <button
                        className={`btn ${validateConstrainFilter.page + 1 >= Math.ceil(metadata.total / validateConstrainFilter.size) ? 'btn-disabled' : ''}`}
                        onClick={() => handlePageChange(validateConstrainFilter.page + 1)}
                        disabled={validateConstrainFilter.page + 1 >= Math.ceil(metadata.total / validateConstrainFilter.size)}
                    >
                        »
                    </button>
                </div>
            </div>
            {/* Create and Update Modals */}
            <ModalCreate modalName={modalCreateName} fetchConstrains={fetchValidateConstrain} />
            <ModalUpdate modalName={modalUpdateName} constrain={selectedValidateConstrain} fetchConstrains={fetchValidateConstrain} />
        </PageLayout>
    );
};

export default ListValidateConstrain;
