import React, { useEffect, useState, useCallback } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/widgets';
import { Project, ProjectFilter } from '../../model/type';
import { getProjects, deleteProject, getChildProjectByParentId } from '@/config/service'; // Import deleteProject
import ModalUpdate from '../component/ModalUpdate';
import ProjectRow from '../component/ProjectRow';
import ModalCreate from '../component/ModalCreate';

const ListProject = () => {
    const modalCreateName = 'modal_create_project';
    const modalUpdateName = 'modal_update_project';
    const { t } = useTranslation();

    const [projectFilter, setProjectFilter] = useState<ProjectFilter>({
        page: 0,
        size: 20,
        sort: "",
        projectName: undefined,
    });
    const [expandedProjectIds, setExpandedProjectIds] = useState<number[]>([]);
    const [childProjects, setChildProjects] = useState<Record<number, Project[]>>({});
    const [selectedProject, setSelectedProject] = useState<Project | null>(null); // for the update modal
    const [metadata, setMetadata] = useState({
        page: 0,
        size: 20,
        total: 0,
    });
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(false);

    // Fetch projects based on filter
    const fetchProjects = useCallback(async (filter?: ProjectFilter) => {
        setLoading(true);
        try {
            const response = await getProjects(filter || projectFilter);
            setProjects(response.data);
            setExpandedProjectIds([]);
            setChildProjects([])
            setMetadata({ ...metadata, total: response.metadata.total });
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        } finally {
            setLoading(false);
        }
    }, [projectFilter]);

    useEffect(() => {
        fetchProjects();
    }, [fetchProjects, projectFilter.page]);

    const toggleChildProjects = async (projectId: number) => {
        if (expandedProjectIds.includes(projectId)) {
            // If the project is already expanded, remove it from the array
            setExpandedProjectIds(expandedProjectIds.filter(id => id !== projectId));
        } else {
            // Collapse all other projects first
            const newExpandedProjectIds = [projectId]; // Only keep the clicked project expanded
            // Fetch child projects and add it to the new array
            const childProjectsData = await getChildProjectByParentId(projectId);
            setChildProjects({ ...childProjects, [projectId]: childProjectsData }); // Store child projects
            setExpandedProjectIds(newExpandedProjectIds); // Set only the clicked project to expanded
        }
    };


    // Handle filter input change
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setProjectFilter({ ...projectFilter, [name]: value });
    };

    // Trigger search
    const handleSearch = () => {
        setProjectFilter({ ...projectFilter, page: 0 }); // Reset to first page on search
        fetchProjects({ ...projectFilter, page: 0 });
    };

    // Handle page change
    const handlePageChange = (newPage: number) => {
        setProjectFilter({ ...projectFilter, page: newPage });
    };

    // Open update modal with selected project
    const handleOpenUpdateModal = (project: Project) => {
        setSelectedProject(project);
        const modal = document.getElementById(modalUpdateName);
        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        }
    };

    // Delete project
    const handleDeleteProject = async (projectId: number) => {
        const confirmDelete = window.confirm(t('Are you sure you want to delete this project?'));
        if (confirmDelete) {
            try {
                await deleteProject(projectId);
                toast.success(t('Project deleted successfully'));
                fetchProjects(); // Refresh project list after deletion
            } catch (error: any) {
                toast.error(t(`message.${error.message}`));
            }
        }
    };

    // Open create child project modal
    const handleOpenCreateChildProjectModal = (project: Project) => {
        setSelectedProject(project);
        // Pass the parent project ID to the create modal
        const modal = document.getElementById(modalCreateName);
        if (modal instanceof HTMLDialogElement) {
            modal.showModal();
        }
    };

    return (
        <PageLayout
            breadcrumbs={[
                { label: t('breadcrumbs.home'), url: '/' },
                { label: t('breadcrumbs.listProject'), url: '/projects', active: true },
            ]}
            loading={loading}
            title={t(`breadcrumbs.listProject`)}
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
                    {/* Project Name Input */}
                    <div className="join-item relative">
                        <label className="input input-bordered flex items-center input-xs gap-2">
                            <input
                                type="text"
                                className="grow"
                                placeholder={t('text.project.projectName')}
                                name="projectName"
                                value={projectFilter.projectName || ''}
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
                    <button className="btn btn-accent btn-xs join-item">{t('common.button.search')}</button>
                </form>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="table table-zebra text-center">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('text.project.projectId')}</th>
                            <th>{t('text.project.projectName')}</th>
                            <th>{t('text.project.description')}</th>
                            <th>{t('text.project.action')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {projects.length > 0 ? (
                            projects.map((project, index) => (
                                <ProjectRow
                                    key={project.id}
                                    project={project}
                                    index={index}
                                    page={projectFilter.page}
                                    handleOpenCreateChildProjectModal={handleOpenCreateChildProjectModal}
                                    handleOpenUpdateModal={handleOpenUpdateModal}
                                    handleDeleteProject={handleDeleteProject}
                                    handleToggleChildProjects={() => toggleChildProjects(project.id)}
                                    isExpanded={expandedProjectIds.includes(project.id)} // Check if expanded
                                    childProjects={childProjects[project.id] || []} // Pass child projects
                                />
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
                        className={`btn ${projectFilter.page === 0 ? 'btn-disabled' : ''}`}
                        onClick={() => handlePageChange(projectFilter.page - 1)}
                        disabled={projectFilter.page === 0}
                    >
                        «
                    </button>

                    <button className="btn">{projectFilter.page + 1}</button>
                    <button
                        className={`btn ${projectFilter.page + 1 >= Math.ceil(metadata.total / projectFilter.size) ? 'btn-disabled' : ''}`}
                        onClick={() => handlePageChange(projectFilter.page + 1)}
                        disabled={projectFilter.page + 1 >= Math.ceil(metadata.total / projectFilter.size)}
                    >
                        »
                    </button>
                </div>
            </div>

            {/* Create and Update Modals */}
            <ModalCreate modalName={modalCreateName} project={selectedProject} fetchProjects={fetchProjects} />
            <ModalUpdate modalName={modalUpdateName} project={selectedProject} fetchProjects={fetchProjects} />

        </PageLayout>
    );
};

export default ListProject;
