import React from 'react';
import { Breadcrumb } from '../model/type';

type Props = {
    loading?: boolean;
    children: React.ReactNode;
    className?: string;
    title?: string
    breadcrumbs?: Breadcrumb[];
};

const PageLayout = ({ loading, children, className = '',title, breadcrumbs }: Props) => {
    return (
        <div
            className={`min-h-screen bg-base-100 p-5 ${className} md:w-[calc(100vw-256px)]`} 
        >
            {/* Breadcrumbs */}
            <div className="breadcrumbs max-w-xs text-sm ">
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <ul>
                        {breadcrumbs.map((breadcrumb, index) => (
                            <li key={index} className={`breadcrumb-item ${breadcrumb.active ? 'text-primary' : ''}`}>
                                {breadcrumb.url ? (
                                    <a href={breadcrumb.url} className="link">
                                        {breadcrumb.icon && <span className={`mr-2 ${breadcrumb.icon}`}></span>}
                                        {breadcrumb.label}
                                    </a>
                                ) : (
                                    <span>
                                        {breadcrumb.icon && <span className={`mr-2 ${breadcrumb.icon}`}></span>}
                                        {breadcrumb.label}
                                    </span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
                
            </div>
            <div className="divider">{title}</div>
            {/* Page Content */}
            <div className={`p-4 ${loading ? 'opacity-50 pointer-events-none' : ''}`}>
                {loading ? (
                    <div className="flex justify-center items-center h-48">
                        <div className="loading loading-spinner text-primary"></div>
                    </div>
                ) : (
                    children
                )}
            </div>
        </div>
    );
};

export default PageLayout;
