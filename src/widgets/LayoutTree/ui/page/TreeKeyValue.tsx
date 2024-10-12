import React, { useCallback, useRef, useState } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { KeyValue } from '../../model/type';


interface TreeKeyValueProps {
  items?: KeyValue[];
  onChange: (newItems: KeyValue[]) => void;
}

const TreeKeyValue: React.FC<TreeKeyValueProps> = ({ items = [], onChange }) => {
  const [currentItems, setCurrentItems] = useState<KeyValue[]>(items);
  const currentItemsRef = useRef(currentItems); // Reference to avoid re-renders
  const inputRefs = useRef<HTMLInputElement[]>([]); // Use ref to store input fields

  currentItemsRef.current = currentItems;

  const handleInputChange = useCallback(
    (index: number, field: 'key' | 'value', value: string) => {
      const newItems = [...currentItemsRef.current];
      if (newItems[index][field] !== value) { // Only update if there's a change
        newItems[index] = {
          ...newItems[index],
          [field]: value,
        };
        setCurrentItems(newItems);
        onChange(newItems);
      }
    },
    [onChange] // Dependency onChange only
  );

  const handleAddKeyValue = useCallback(() => {
    if (!currentItemsRef.current.some(item => item.key.trim() === '')) {
      const newItems = [...currentItemsRef.current, { key: '', value: '' }];
      setCurrentItems(newItems);
      onChange(newItems);
      // Set focus to the newly added input field
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

  return (
    <div className='w-auto'>
      {currentItems.map((item, index) => (
        <div key={index} className="flex space-x-2 mb-2">
          <input
            type="text"
            value={item.key}
            onChange={(e) => handleInputChange(index, 'key', e.target.value)}
            placeholder="Key"
            className="input input-bordered flex-1"
            ref={(el) => (inputRefs.current[index] = el as HTMLInputElement)} // Store each input ref
          />
          <input
            type="text"
            value={item.value}
            onChange={(e) => handleInputChange(index, 'value', e.target.value)}
            placeholder="Value"
            className="input input-bordered flex-1"
          />
          <button type="button"
            onClick={() => handleRemoveKeyValue(index)}
            className="btn btn-error">
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      ))}
      <button type="button" onClick={handleAddKeyValue} className="btn btn-primary">
        Add Key-Value
      </button>
    </div>
  );
};

export default TreeKeyValue;
