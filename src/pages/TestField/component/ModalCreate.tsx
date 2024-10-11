import { useState, useCallback, useEffect } from "react"; // Import useCallback
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { TestFieldCreate } from "../model/type";
import { createTestField } from "../service/TestFieldService";
import { getValidateConstrains } from "@/pages/ValidateConstrain/service";
import { ValidateConstrain } from "@/pages/ValidateConstrain/model/type";
import Select from 'react-select';
import debounce from 'lodash/debounce'; // Import debounce from Lodash
import { Project } from "@/pages/Project";
import { getProjects } from "@/config/service";

interface ModalCreateTestFieldProps {
    modalName: string;
    fetchTestFields: () => void;
    projects : Project[];
    validateConstrains: ValidateConstrain[];
    fetchValidateConstrains: (name: string) => void;
}

const ModalCreateTestField = ({ modalName, fetchTestFields, projects, validateConstrains, fetchValidateConstrains }: ModalCreateTestFieldProps) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<TestFieldCreate>({
        fieldName: "",
        projectId: 0,
        description: "",
        fieldCode: "",
        defaultRegexValue: "",
        validateConstrainIds: [],
    });
    const [loading, setLoading] = useState(false);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };


    // Create a debounced version of fetchValidateConstrains
    const debouncedFetchValidateConstrains = useCallback(
        debounce((name: string) => fetchValidateConstrains(name), 1000), // 1 second debounce
        []
    );

    const createTestFieldData = async () => {
        setLoading(true);
        try {
            await createTestField(formData);
            toast.success(t('message.testFieldCreatedSuccessfully'));
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
                    {t('common.text.create')}
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
                    <label className="label">{t('text.testField.project')}</label>
                    <select
                        className="select select-bordered"
                        name="projectId"
                        value={formData.projectId}
                        onChange={(e) => setFormData({ ...formData, projectId: Number(e.target.value) })}
                    >
                        <option value="">{t('common.select.project')}</option>
                        {projects.map(project => (
                            <option key={project.id} value={project.id}>
                                {project.projectName}
                            </option>
                        ))}
                    </select>
                </div>


                {/* Field default regex Input */}
                <div className="form-control my-4">
                    <label className="label">{t('text.testField.defaultRegex')}</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        name="defaultRegexValue"
                        value={formData.defaultRegexValue}
                        onChange={handleInputChange}
                        placeholder={t('text.testField.defaultRegex')}
                    />
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

                {/* Validate Constrain IDs Input - using react-select */}
                <div className="form-control my-4">
                    <label className="label">{t('text.testField.validateConstrain')}</label>
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
                            debouncedFetchValidateConstrains(inputValue); // Call the debounced function
                        }}
                        placeholder={t('text.testField.validateConstrainIds')}
                        className="react-select-container"
                        classNamePrefix="react-select"
                    />
                </div>

                <div className="modal-action">
                    <button
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                        onClick={createTestFieldData}
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

export default ModalCreateTestField;
