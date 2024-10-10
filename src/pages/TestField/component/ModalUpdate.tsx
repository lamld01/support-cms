import { useCallback, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { TestField, TestFieldUpdate } from "../model/type";
import { updateTestField } from "../service/TestFieldService";
import { getValidateConstrains } from "@/pages/ValidateConstrain/service";
import { ValidateConstrain } from "@/pages/ValidateConstrain/model/type";
import Select from 'react-select';
import debounce from 'lodash/debounce';
import { getProjects } from "@/config/service";
import { Project } from "@/pages/Project";

interface ModalUpdateTestFieldProps {
    modalName: string;
    testField: TestField | null;
    fetchTestFields: () => void;
}

const ModalUpdateTestField = ({ modalName, testField, fetchTestFields }: ModalUpdateTestFieldProps) => {
    const { t } = useTranslation();
    const [validateConstrains, setValidateConstrains] = useState<ValidateConstrain[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [formData, setFormData] = useState<TestFieldUpdate>({
        fieldName: testField?.fieldName || "",
        projectId: testField?.project.id || 0,
        description: testField?.description || "",
        fieldCode: testField?.fieldCode || "",
        validateConstrainIds: testField?.validateConstrains?.map(v => v.id) || [],
    });
    const [loading, setLoading] = useState(false);

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

    const debouncedFetchValidateConstrains = useCallback(
        debounce((name: string) => fetchValidateConstrains(name), 1000),
        []
    );

    useEffect(() => {
        if (testField) {
            setFormData({
                fieldName: testField.fieldName || "",
                projectId: testField.project.id || 0,
                description: testField.description || "",
                fieldCode: testField.fieldCode || "",
                validateConstrainIds: testField.validateConstrains?.map(v => v.id) || [],
            });
        }
    }, [testField]);

    useEffect(() => {
        fetchProjects();
        fetchValidateConstrains();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const updateTestFieldData = async () => {
        setLoading(true);
        try {
            await updateTestField(testField!.id, formData);
            toast.success(t('message.testFieldUpdatedSuccessfully'));
            fetchTestFields();
            const element = document.getElementById(modalName);
            if (element instanceof HTMLDialogElement) {
                element.close();
            }
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog id={modalName} className="modal modal-middle sm:modal-middle">
            <div className="modal-box">
                <h3 className="font-bold text-lg">
                    {t('common.text.update')}
                    {loading && <span className="loading loading-spinner loading-sm ml-2"></span>}
                </h3>

                {/* Field Name Input */}
                <div className="form-control my-4">
                    <label className="label">{t('text.testField.fieldName')}</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        name="fieldName"
                        value={formData.fieldName}
                        onChange={handleInputChange}
                        placeholder={t('text.testField.fieldName')}
                    />
                </div>

                {/* Project Select Dropdown */}
                <div className="form-control my-4">
                    <label className="label">{t('text.testField.projectId')}</label>
                    <select
                        className="select select-bordered"
                        name="projectId"
                        value={formData.projectId}
                        onChange={(e) => setFormData({ ...formData, projectId: Number(e.target.value) })}
                    >
                        <option value="">{t('text.select.project')}</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.projectName}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Description Input */}
                <div className="form-control my-4">
                    <label className="label">{t('text.testField.description')}</label>
                    <textarea
                        className="textarea textarea-bordered"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder={t('text.testField.description')}
                    />
                </div>

                {/* Field Code Input */}
                <div className="form-control my-4">
                    <label className="label">{t('text.testField.fieldCode')}</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        name="fieldCode"
                        value={formData.fieldCode}
                        onChange={handleInputChange}
                        placeholder={t('text.testField.fieldCode')}
                    />
                </div>

                {/* Validate Constrain IDs Input */}
                <div className="form-control my-4">
                    <label className="label">{t('text.testField.validateConstrainIds')}</label>
                    <Select
                        isMulti
                        options={validateConstrains.map(constrain => ({
                            value: constrain.id,
                            label: constrain.constrainName
                        }))}
                        value={formData.validateConstrainIds.map(id => ({
                            value: id,
                            label: validateConstrains.find(constrain => constrain.id === id)?.constrainName || ''
                        }))}
                        onChange={(selectedOptions) => {
                            const selectedIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
                            setFormData({ ...formData, validateConstrainIds: selectedIds });
                        }}
                        onInputChange={(inputValue) => {
                            debouncedFetchValidateConstrains(inputValue);
                        }}
                        placeholder={t('text.testField.validateConstrainIds')}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>

                <div className="modal-action">
                    <button
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                        onClick={updateTestFieldData}
                        disabled={loading || !formData.fieldName}
                    >
                        {t('common.button.save')}
                    </button>
                    <form method="dialog">
                        <button className="btn">{t('common.button.cancel')}</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default ModalUpdateTestField;
