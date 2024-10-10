import React, { useEffect, useState, useCallback } from 'react';
import { getSellerAccount } from '@/config/service';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { PageLayout } from '@/widgets';
import { SellerAccount, SellerAccountFilter } from '../model/SellerAccount';
import { SellerAccountStatus } from '@/model/enum';

const ListAccount = () => {
    const { t } = useTranslation();
    const [accountFilter, setAccountFilter] = useState<SellerAccountFilter>({
        page: 0,
        size: 20,
        sort: [],
        username: undefined,
        status: undefined,
    });
    const [metadata, setMetadata] = useState<any>({
        page: 0,
        size: 20,
        total: 0,
    });
    const [accounts, setAccounts] = useState<SellerAccount[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchAccounts = useCallback(async (filter?: SellerAccountFilter) => {
        setLoading(true);
        try {
            const response = await getSellerAccount(filter || accountFilter);
            setAccounts(response.data);
            setMetadata({ ...metadata, total: response.metadata.total });
        } catch (error: any) {
            toast.error(t(`message.${error.message}`));
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts, accountFilter.page]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setAccountFilter({ ...accountFilter, [name]: value });
    };

    const handleSearch = () => {
        setAccountFilter({ ...accountFilter, page: 0 }); // Reset to first page on search
        fetchAccounts({ ...accountFilter, page: 0 });
    };

    const handlePageChange = (newPage: number) => {
        setAccountFilter({ ...accountFilter, page: newPage });
    };

    return (
        <PageLayout
            breadcrumbs={[
                { label: t('breadcrumbs.home'), url: '/' },
                { label: t('breadcrumbs.listAccount'), url: '/accounts', active: true },
            ]}
            loading={loading}
            title={t(`breadcrumbs.listAccount`)}
        >
            {/* Filter Section */}
            <div className="flex justify-between p-4 rounded-lg mb-4">
                <div className="flex-grow" /> 
                <form
                    className="join join-horizontal gap-1"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSearch();
                    }}
                >
                    {/* Username Input with Custom Search Icon */}
                    <div className="join-item relative">
                        <label className="input input-bordered flex items-center input-xs gap-2">
                            <input
                                type="text"
                                className="grow"
                                placeholder={t('text.Username')}
                                name="username"
                                value={accountFilter.username || ''}
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

                    {/* Status Filter */}
                    <div className="join-item relative">
                        <select
                            name="status"
                            className="input input-bordered w-full select-xs"
                            onChange={handleFilterChange}
                            value={accountFilter.status || ''}
                        >
                            <option value="">{t('common.select.status')}</option>
                            <option value={SellerAccountStatus.ACTIVE}>{t('Active')}</option>
                            <option value={SellerAccountStatus.INACTIVE}>{t('Inactive')}</option>
                        </select>
                    </div>

                    <button className="btn btn-primary btn-xs join-item">{t(`common.button.search`)}</button>
                </form>
            </div>

            {/* Table Section */}
            <div className="overflow-x-auto">
                <table className="table table-zebra text-center">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>{t('id')}</th>
                            <th>{t('Username')}</th>
                            <th>{t('Status')}</th>
                            <th>{t('Role')}</th>
                        </tr>
                    </thead>
                    <tbody>
                        {accounts.length > 0 ? (
                            accounts.map((account, index) => (
                                <tr key={account.id}>
                                    <th>{index + 1 + accountFilter.page * accountFilter.size}</th>
                                    <th>{account?.id || 'N/A'}</th>
                                    <td>{account?.username || 'N/A'}</td>
                                    <td>{account?.status || 'N/A'}</td>
                                    <td>{account?.role || 'N/A'}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={7} className="text-center">
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
                        className={`btn ${accountFilter.page === 0 ? 'btn-disabled' : ''}`}
                        onClick={() => handlePageChange(accountFilter.page - 1)}
                        disabled={accountFilter.page === 0}
                    >
                        «
                    </button>
                    <button className="btn">{accountFilter.page + 1}</button>
                    <button
                        className={`btn ${accountFilter.page + 1 >= Math.ceil(metadata.total / accountFilter.size) ? 'btn-disabled' : ''}`}
                        onClick={() => handlePageChange(accountFilter.page + 1)}
                        disabled={accountFilter.page + 1 >= Math.ceil(metadata.total / accountFilter.size)}
                    >
                        »
                    </button>
                </div>
            </div>
        </PageLayout>
    );
};

export default ListAccount;
