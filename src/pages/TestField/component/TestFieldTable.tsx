// TestFieldTable.tsx
import React from 'react';
import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { TestFieldTableProps } from '../model/type';
import { useTranslation } from 'react-i18next';
import { deleteTestField } from '../service/TestFieldService';
import { toast } from 'react-toastify';

const TestFieldTable: React.FC<TestFieldTableProps> = ({
    testFields,
    loading,
    fetchTestFields,
    handleOpenUpdateModal,
    
}) => {

    
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


    const {t} = useTranslation();
    const TableBody = () => (
        <tbody>
            {loading ? (
                <tr>
                    <td colSpan={9} className="text-center py-4">
                        <span className="loading loading-spinner"></span>
                        <p>Loading...</p>
                    </td>
                </tr>
            ) : (
                testFields.length > 0 ? (
                    testFields.map((field, index) => (
                        <tr key={field.id}>
                            <th>{index + 1}</th>
                            <td>{field.id}</td>
                            <td>{field.fieldName}</td>
                            <td>{field.project?.projectName}</td>
                            <td>{field.defaultRegexValue}</td>
                            <td>{field.description}</td>
                            <td>{field.fieldCode}</td>
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
                            <td>
                                <div className="flex justify-center items-center">
                                    <button
                                        className="btn btn-warning btn-xs"
                                        onClick={() => handleOpenUpdateModal(field)}
                                    >
                                        <PencilIcon className="h-4 w-4" />
                                    </button>
                                    <button
                                        className="btn btn-error btn-xs ml-2"
                                        onClick={() => handleDeleteTestField(field.id)}
                                    >
                                        <TrashIcon className="h-4 w-4" />
                                    </button>
                                </div>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan={9}> ound.</td>
                    </tr>
                )
            )}
        </tbody>
    );

    return (
        <div className="no-scrollbar">
            <table className="table table-zebra text-center">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>{t('common.text.ID')}</th>
                        <th>{t('text.testField.fieldName')}</th>
                        <th>{t('text.testField.project')}</th>
                        <th>{t('text.testField.defaultRegexValue')}</th>
                        <th>{t('text.testField.description')}</th>
                        <th>{t('text.testField.fieldCode')}</th>
                        <th>{t('text.testField.validateConstrain')}</th>
                        <th>{t('common.text.action')}</th>
                    </tr>
                </thead>
                <TableBody />
            </table>
        </div>
    );
};

export default TestFieldTable;
