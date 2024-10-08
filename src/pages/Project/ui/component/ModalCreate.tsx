import { useEffect, useState } from "react";
import { Project, ProjectCreate } from "../../model/type";
import { createProjects } from "@/config/service";
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';
interface ModalCreateProps {
    modalName: string; // Name of the modal (e.g., 'modalCreateProject')
    project?: Project | null;
    fetchProjects: () => void;
}

const ModalCreate = ({ modalName, project, fetchProjects }: ModalCreateProps) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<ProjectCreate>({
        projectName: "",
        description: "",
        apiBaseUrl: "",
        token: ""
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setFormData({ ...formData, parentProjectId: project?.id });
    }, [project])
    // Handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to create project
    const createProject = async () => {
        setLoading(true);
        try {
            await createProjects(formData);
            toast.success(t('message.projectCreatedSuccessfully'));
            const element = document.getElementById(modalName);
            fetchProjects()
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
                <h3 className="font-bold text-lg">{t('text.create')}</h3>

                {/* Project Name Input */}
                <div className="form-control my-4">
                    <label className="label">{t('text.project.projectName')}</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        name="projectName"
                        value={formData.projectName}
                        onChange={handleInputChange}
                        placeholder={t('text.project.projectName')}
                    />
                </div>

                {/* Project Description Input */}
                <div className="form-control my-4">
                    <label className="label">{t('text.project.description')}</label>
                    <textarea
                        className="textarea textarea-bordered"
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder={t('text.project.description')}
                    />
                </div>

                {/* API Base URL Input */}
                <div className="form-control my-4">
                    <label className="label">{t('text.project.apiBaseUrl')}</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        name="apiBaseUrl"
                        value={formData.apiBaseUrl}
                        onChange={handleInputChange}
                        placeholder={t('text.project.apiBaseUrl')}
                    />
                </div>

                {/* Token Input */}
                <div className="form-control my-4">
                    <label className="label">{t('text.project.token')}</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        name="token"
                        value={formData.token}
                        onChange={handleInputChange}
                        placeholder={t('text.project.token')}
                    />
                </div>

                <div className="modal-action">
                    {/* Save Button */}
                    <button
                        className={`btn btn-primary ${loading ? 'loading' : ''}`}
                        onClick={createProject}
                        disabled={loading || !formData.projectName}
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