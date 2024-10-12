import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import JsonView from 'react-json-view';

interface JsonViewModalProps {
    data: any; // Replace with the appropriate type for your JSON data
    id: string; // Add an id prop
}

const JsonViewModal: React.FC<JsonViewModalProps> = ({ data, id }) => {
    const { t } = useTranslation();

    const [filter, setFilter] = useState('');

    // Function to filter the data based on the input
    const filterData = (data: any, filter: string) => {
        if (!filter) return data; // Return original data if filter is empty
        const regex = new RegExp(filter, 'i'); // Case insensitive regex for filtering
        return Object.keys(data)
            .filter(key => regex.test(key)) // Filter keys based on input
            .reduce((acc, key) => {
                acc[key] = data[key]; // Build new object with filtered keys
                return acc;
            }, {} as any);
    };

    const filteredData = filterData(data, filter);

    return (
        <dialog id={id} className="modal">
            <div className="modal-box">
                <h3 className="font-bold text-lg">{t('common.text.result')}</h3>
                <input
                    type="text"
                    placeholder={t('common.text.filter')}
                    value={filter}
                    onChange={(e) => setFilter(e.target.value)}
                    className="input input-bordered mb-4"
                />
                <div className="py-4">
                    <JsonView src={filteredData} name={null} />
                </div>
                <div className="modal-action">
                    <form method="dialog">
                        <button className='btn'>{t('common.button.close')}</button>
                    </form>
                </div>
            </div>
        </dialog>
    );
};

export default JsonViewModal;
