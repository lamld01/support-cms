import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
import { ValidateConstrain, ValidateConstrainUpdate } from "../model/type";
import { updateValidateConstrains } from "../service";

interface ModalUpdateProps {
    modalName: string; // Name of the modal (e.g., 'modalUpdateConstrain')
    constrain: ValidateConstrain | null;   // Existing constrain data to update
    fetchConstrains: () => void;
}

const ModalUpdate = ({ modalName, constrain, fetchConstrains }: ModalUpdateProps) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<ValidateConstrainUpdate>({
        constrainName: constrain?.constrainName || "",
        description: constrain?.description || "",
        regexValue: constrain?.regexValue || "",
        status: constrain?.status || 'ACTIVE',
    });
    const [loading, setLoading] = useState(false);

    // Update form data when constrain changes
    useEffect(() => {
        if (constrain) {
            setFormData({
                constrainName: constrain?.constrainName || "",
                description: constrain?.description || "",
                regexValue: constrain?.regexValue || "",
                status: constrain?.status || 'ACTIVE',
            });
        }
    }, [constrain]);

    // Handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to update constrain
    const updateConstrainData = async () => {
        setLoading(true);
        try {
            await updateValidateConstrains(constrain?.id, formData); // Call API to update constrain
            toast.success(t('message.constrainUpdatedSuccessfully'));
            fetchConstrains();
            const element = document.getElementById(modalName);
            if (element instanceof HTMLDialogElement) {
                element.close();  // Close modal after successful update
            }
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        } finally {
            setLoading(false);
        }
    };

    return (
        <dialog id={modalName} className="modal modal-middle sm:modal-middle" >
            <div className="modal-box">
                <h3 className="font-bold text-lg">{t('common.text.update')}</h3>

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
                    {/* Update Button */}
                    <button 
                        className={`btn btn-primary ${loading ? 'loading' : ''}`} 
                        onClick={updateConstrainData}
                        disabled={loading || !formData.constrainName}
                    >
                        {t('common.button.update')}
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

export default ModalUpdate;
