import React from 'react';
import { Project } from '../../model/type';
import { PlusCircleIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';

interface ChildProjectRowProps {
    childProject: Project; // Single child project
    handleOpenUpdateModal: (project: Project) => void; // Function to handle update
    handleDeleteProject: (projectId: number) => void; // Function to handle delete
}

const ChildProjectRow: React.FC<ChildProjectRowProps> = ({
    childProject,
    handleOpenUpdateModal,
    handleDeleteProject,
}) => {
    return (
        <div className="pl-6 flex items-center justify-between">
            <td>{childProject?.id || 'N/A'}</td>
            <td>{childProject?.projectName || 'N/A'}</td>
            <div>
                <button
                    className="btn btn-sm btn-warning mx-2"
                    onClick={() => handleOpenUpdateModal(childProject)}
                    title="Edit"
                >
                    <PencilIcon className="h-4 w-4" aria-hidden="true" />
                </button>
                <button
                    className="btn btn-sm btn-error mx-2"
                    onClick={() => handleDeleteProject(childProject.id)}
                    title="Delete"
                >
                    <TrashIcon className="h-4 w-4" aria-hidden="true" />
                </button>
            </div>
        </div>
    );
};

interface ProjectRowProps {
    project: Project;
    index: number;
    page: number;
    handleOpenCreateChildProjectModal: (project: Project) => void;
    handleOpenUpdateModal: (project: Project) => void;
    handleDeleteProject: (projectId: number) => void;
    handleToggleChildProjects: (projectId: number) => void; // Add this prop
    isExpanded: boolean; // Add this prop
    childProjects: Project[]; // Add this prop for child projects
}

const ProjectRow: React.FC<ProjectRowProps> = ({
    project, index, page,
    handleOpenCreateChildProjectModal,
    handleOpenUpdateModal,
    handleDeleteProject,
    handleToggleChildProjects, // Destructure the new prop
    isExpanded, // Destructure the new prop
    childProjects, // Destructure child projects
}) => {
    return (
        <>
            <tr key={project.id}>
                <th>{index + 1 + page * 20}</th>
                <td>{project?.id || 'N/A'}</td>
                <td>{project?.projectName || 'N/A'}</td>
                <td>{project?.description || 'N/A'}</td>
                <td className="flex justify-center">
                    <button
                        className="btn btn-sm btn-info mx-2"
                        onClick={() => handleOpenCreateChildProjectModal(project)}
                        title="Add"
                    >
                        <PlusCircleIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                        className="btn btn-sm btn-warning mx-2"
                        onClick={() => handleOpenUpdateModal(project)}
                        title="Edit"
                    >
                        <PencilIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    <button
                        className="btn btn-sm btn-error mx-2"
                        onClick={() => handleDeleteProject(project.id)}
                        title="Delete"
                    >
                        <TrashIcon className="h-4 w-4" aria-hidden="true" />
                    </button>
                    {/* Add toggle button */}
                    <button
                        className={`btn btn-sm ${isExpanded ? 'btn-secondary' : 'btn-primary'}`}
                        onClick={() => handleToggleChildProjects(project.id)}
                        title={isExpanded ? "Collapse" : "Expand"}
                    >
                        {isExpanded ? '-' : '+'}
                    </button>
                </td>
            </tr>
            {/* Add child projects display */}
            {isExpanded && (
                <tr>
                    <td colSpan={5}>
                        <div>
                            {childProjects && childProjects.map((childProject) => (
                                <ChildProjectRow
                                    key={childProject.id}
                                    childProject={childProject}
                                    handleOpenUpdateModal={handleOpenUpdateModal}
                                    handleDeleteProject={handleDeleteProject}
                                />
                            ))}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
};

export default ProjectRow;
