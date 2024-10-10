import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { ValidateConstrainCreate } from "../model/type";
import { createValidateConstrains } from "../service";

interface ModalCreateProps {
    modalName: string; // Name of the modal (e.g., 'modalCreateProject')
    fetchConstrains: () => void; // Updated fetch function name
}

const ModalCreate = ({ modalName, fetchConstrains }: ModalCreateProps) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<ValidateConstrainCreate>({
        constrainName: "",
        description: "",
        regexValue: "",
        status: 'ACTIVE'
    });
    const [loading, setLoading] = useState(false);

    // Handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to create constrain
    const createConstrain = async () => {
        setLoading(true);
        try {
            await createValidateConstrains(formData); // Assuming the service can handle this
            toast.success(t('message.constrainCreatedSuccessfully')); // Updated success message
            const element = document.getElementById(modalName);
            fetchConstrains(); // Updated function call to fetch constrains
            if (element instanceof HTMLDialogElement) {
                element.close();  // Close modal after successful creation
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

                    {/* Hiển thị biểu tượng loading khi đang tải */}
                    {loading && <span className="loading loading-spinner loading-sm ml-2"></span>}
                </h3>

                {/* Constrain Name Input */}
                <div className="form-control my-4">
                    <label className="label">{t('text.validateConstrain.constrainName')}</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        name="constrainName"
                        value={formData.constrainName}
                        onChange={handleInputChange}
                        placeholder={t('text.validateConstrain.constrainName')}
                    />
                </div>

                {/* Constrain Description Input */}
                <div className="form-control my-4">
                    <label className="label">{t('text.validateConstrain.description')}</label>
                    <textarea
                        className="textarea textarea-bordered"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder={t('text.validateConstrain.description')}
                    />
                </div>

                {/* Regex Value Input */}
                <div className="form-control my-4">
                    <label className="label">{t('text.validateConstrain.regexValue')}</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        name="regexValue"
                        value={formData.regexValue}
                        onChange={handleInputChange}
                        placeholder={t('text.validateConstrain.regexValue')}
                    />
                </div>

                {/* Status Input */}
                <div className="form-control my-4">
                    <label className="label">{t('common.select.status')}</label>
                    <select
                        name="status"
                        value={formData.status}
                        onChange={handleInputChange}
                        className="select select-bordered"
                    >
                        <option value="ACTIVE">{t('common.status.active')}</option>
                        <option value="INACTIVE">{t('common.status.inactive')}</option>
                    </select>
                </div>

                <div className="modal-action">
                    {/* Save Button */}
                    <button
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                        onClick={createConstrain}
                        disabled={loading || !formData.constrainName}
                    >
                        {t('common.button.save')}
                    </button>

                    {/* Close Button */}
                    <form method="dialog">
                        <button className="btn">{t('common.button.cancel')}</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default ModalCreate;
