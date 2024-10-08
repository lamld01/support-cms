import { useEffect, useState } from "react";
import { Project, ProjectUpdate } from "../../model/type";
import { updateProjects } from "@/config/service"; // Assume this is your update API
import { toast } from "react-toastify";
import { useTranslation } from 'react-i18next';

interface ModalUpdateProps {
    modalName: string; // Name of the modal (e.g., 'modalUpdateProject')
    project: Project | null;   // Existing project data to update
    fetchProjects: () => void;
}

const ModalUpdate = ({ modalName, project, fetchProjects }: ModalUpdateProps) => {
    const { t } = useTranslation();
    const [formData, setFormData] = useState<ProjectUpdate>({
        parentProjectId: project?.parentProjectId || undefined,
        projectName: project?.projectName || "",
        description: project?.description || "",
        apiBaseUrl: project?.apiBaseUrl || "",
        token: project?.token || ""
    });
    const [loading, setLoading] = useState(false);

    // Update form data when project changes
    useEffect(() => {
        if (project) {
            setFormData({
                parentProjectId: project?.parentProjectId || undefined,
                projectName: project?.projectName || "",
                description: project?.description || "",
                apiBaseUrl: project?.apiBaseUrl || "",
                token: project?.token || ""
            });
        }
    }, [project]);

    // Handle form input change
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    // Function to update project
    const updateProject = async () => {
        setLoading(true);
        try {
            await updateProjects(project?.id, formData); // Call API to update project
            toast.success(t('message.projectUpdatedSuccessfully'));
            fetchProjects();
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
                <h3 className="font-bold text-lg">{t('text.update')}</h3>

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
                    {/* Update Button */}
                    <button 
                        className={`btn btn-primary ${loading ? 'loading' : ''}`} 
                        onClick={updateProject}
                        disabled={loading || !formData.projectName}
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
