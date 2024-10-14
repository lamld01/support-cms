import React, { useCallback, useRef, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { KeyValue } from '../../model/type';
import { useTranslation } from 'react-i18next';
import MultiSelect, { Option } from '@/component/share/MultiSelect';
import { debounce } from 'lodash';

interface TreeKeyValueProps {
  items?: KeyValue[];
  onChange: (newItems: KeyValue[]) => void;
  options?: Option[];
  onInputChange: (input: string) => void;
}

const TreeKeyValue: React.FC<TreeKeyValueProps> = ({ items = [], onChange, options = [], onInputChange }) => {
  const { t } = useTranslation();
  const [currentItems, setCurrentItems] = useState<KeyValue[]>(items);
  const currentItemsRef = useRef(currentItems);
  const inputRefs = useRef<HTMLInputElement[]>([]);

  currentItemsRef.current = currentItems;

  const handleInputChange = useCallback(
    (index: number, field: 'key' | 'value', value: string | Option) => {
      const newItems = [...currentItemsRef.current];
      if (field === 'key' && typeof value !== 'string') {
        value = String(value.value); // Extract value from Option object
      }
      if (newItems[index][field] !== value) {
        newItems[index] = {
          ...newItems[index],
          [field]: value,
        };
        setCurrentItems(newItems || null);
        onChange(newItems || null);
      }
    },
    [onChange]
  );

  const handleAddKeyValue = useCallback(() => {
    if (!currentItemsRef.current.some(item => item.key.trim() === '')) {
      const newItems = [...currentItemsRef.current, { key: '', value: undefined }];
      setCurrentItems(newItems);
      onChange(newItems);
      setTimeout(() => {
        const lastIndex = inputRefs.current.length - 1;
        inputRefs.current[lastIndex]?.focus();
      }, 0);
    }
  }, [onChange]);

  const handleRemoveKeyValue = useCallback(
    (index: number) => {
      const newItems = currentItemsRef.current.filter((_, i) => i !== index);
      setCurrentItems(newItems);
      onChange(newItems);
    },
    [onChange]
  );

  const debouncedFetchOnChange = useCallback(
    debounce((input: string) => onInputChange(input), 500),
    [onInputChange]
  );

  return (
    <div className='w-auto'>
      {currentItems.map((item, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          {/* Key Input Field */}
          <input
            type="text"
            value={item.key}
            onChange={(e) => handleInputChange(index, 'key', e.target.value)}
            placeholder={t(`common.text.key`)}
            className="input input-bordered input-md h-[3rem] flex-1"
            ref={(el) => (inputRefs.current[index] = el as HTMLInputElement)} // Store each input ref
          />
          {/* MultiSelect for Value */}
          <MultiSelect
            classname='flex-1'
            isMulti={false}
            value={item.value ? [item.value] : []} // Wrap the value in an array of Option objects
            onChange={(option) => handleInputChange(index, 'value', option[0])}
            placeholder={t(`common.text.value`)}
            options={options} // Provide options for the MultiSelect dropdown
            onInputChange={(input) => debouncedFetchOnChange(input)} // Debounced input change
          />
          {/* Remove Button */}
          <button
            type="button"
            onClick={() => handleRemoveKeyValue(index)}
            className="btn btn-error">
            <TrashIcon className="size-4" />
          </button>
        </div>
      ))}
      {/* Add Key-Value Pair Button */}
      <button type="button" onClick={handleAddKeyValue} className="btn btn-neutral btn-outline">
        {t('common.button.add')}
      </button>
    </div>
  );
};

export default TreeKeyValue;
