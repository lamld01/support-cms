import React from 'react';
import { JsonView, defaultStyles } from 'react-json-view-lite';
import { PencilIcon, TrashIcon, EyeIcon } from '@heroicons/react/24/outline';
import { BiRightArrow } from 'react-icons/bi';
import { TestApi } from '../model/type';
import { useTranslation } from 'react-i18next';

interface TestApiTableProps {
    data: TestApi[];
    loading: boolean;
    onViewJsonBody: (id: number) => void;
    onRequestTestApi: (id: number) => void;
    onEdit: (id: number) => void;
    onDelete: (id: number) => void;
    page: number;
    size: number;
}

const TestApiTable: React.FC<TestApiTableProps> = ({
    data,
    loading,
    onViewJsonBody,
    onRequestTestApi,
    onEdit,
    onDelete,
    page,
    size
}) => {
    // const modalTestFieldTable = 'modal_test_field_table';
    const { t } = useTranslation();
    // const [selectedApi, setSelectedApi] = useState<number>();

    // const handleOpenTestFieldModal = (id: number) => {
    //     setSelectedApi(id)
    //     const modal = document.getElementById(modalTestFieldTable);
    //     if (modal instanceof HTMLDialogElement) {
    //         modal.showModal();
    //     }
    // }
    return (
        <div>
            <table className="table table-zebra">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('common.text.ID')}</th>
                        <th>{t('text.testApi.apiName')}</th>
                        <th>{t('text.testApi.project')}</th>
                        <th>{t('text.testApi.description')}</th>
                        <th>{t('text.testApi.param')}</th>
                        <th>{t('text.testApi.header')}</th>
                        <th>{t('text.testApi.body')}</th>
                        <th>{t('common.text.action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr>
                            <td colSpan={9} className="text-center py-4">
                                <span className="loading loading-spinner"></span>
                                <p>{t('common.text.loading...')}</p>
                            </td>
                        </tr>
                    ) : data.length > 0 ? (
                        data.map((api, index) => (
                            <tr key={api.id}>
                                <th>{index + 1 + page * size}</th>
                                <td>{api.id || 'N/A'}</td>
                                <td>{api.apiName || 'N/A'}</td>
                                <td>{api.project?.projectName || 'N/A'}</td>
                                <td>{api.description || 'N/A'}</td>
                                <td>
                                    <JsonView style={defaultStyles} data={api.param} />
                                </td>
                                <td>
                                    <JsonView style={defaultStyles} data={api.header} />
                                </td>
                                <td>
                                    <button
                                        className="btn btn-icon btn-sm"
                                        onClick={() => onViewJsonBody(api.id)}
                                        title="View JSON Body"
                                    >
                                        <EyeIcon className="h-4 w-4" aria-hidden="true" />
                                    </button>
                                </td>
                                <td>
                                    <div className="flex justify-start items-center gap-2">
                                        <button
                                            className="btn btn-accent btn-xs"
                                            onClick={() => onRequestTestApi(api.id)}
                                            title="Run Test"
                                        >
                                            <BiRightArrow className="h-4 w-4" aria-hidden="true" />
                                        </button>
                                        <button
                                            className="btn btn-warning btn-xs"
                                            onClick={() => onEdit(api.id)}
                                            title="Edit"
                                        >
                                            <PencilIcon className="h-4 w-4" aria-hidden="true" />
                                        </button>


                                        <button
                                            className="btn btn-error btn-xs"
                                            onClick={() => onDelete(api.id)}
                                            title="Delete"
                                        >
                                            <TrashIcon className="h-4 w-4" aria-hidden="true" />
                                        </button>

                                        {/* <div className="dropdown dropdown-end ">
                                            <button tabIndex={0} className="btn btn-info btn-xs"><BiDownArrow className="h-4 w-4" aria-hidden="true" /></button>
                                            <ul
                                                tabIndex={0}
                                                className="menu dropdown-content rounded-box z-[1] mt-4 w-52 p-2 shadow">
                                                <li>
                                                    <a onClick={() => handleOpenTestFieldModal(api.id)}>
                                                        {t('text.testApi.viewTestField')}
                                                    </a>
                                                </li>
                                            </ul>
                                        </div> */}
                                    </div>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={9} className="text-center">{t('common.text.noContent')}</td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default TestApiTable;
