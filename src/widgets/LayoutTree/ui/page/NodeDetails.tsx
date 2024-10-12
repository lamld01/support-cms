import { TestField } from "@/pages/TestField";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import Select from 'react-select';
import { JsonInfo } from "../../model/type";

interface NodeDetailsProps {
    selectedNode?: JsonInfo;
    onUpdate: (updatedNode: JsonInfo) => void;
    testFields: TestField[] | [];
    fetchTestField: (name: string) => void;
}

const NodeDetails = (props: NodeDetailsProps) => {
    const { t } = useTranslation();
    const [editedNode, setEditedNode] = useState<JsonInfo | undefined>(props.selectedNode);

    useEffect(() => {
        setEditedNode(props.selectedNode);
    }, [props.selectedNode]);

    const handleChange = (field: keyof JsonInfo, value?: string | number) => {
        if (editedNode) {
            const updatedNode = { ...editedNode, [field]: value };
            setEditedNode(updatedNode);
            props.onUpdate(updatedNode);
        }
    };

    const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        handleChange("type", event.target.value);
    };

    // Create a debounced version of fetchValidateConstrains
    const debouncedFetchValidateConstrains = useCallback(
        debounce((name: string) => props.fetchTestField(name), 1000), // 1 second debounce
        []
    );

    if (!props.selectedNode) {
        return <div className="text-gray-500">Select a node to see details</div>;
    }

    return (
        <div className="p-4 bg-gray-100 rounded shadow-md">
            <h2 className="text-lg font-bold mb-2">Node Details</h2>
            <div className="mb-2">
                <label className="block text-sm font-medium">Key:</label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    value={editedNode?.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
            </div>
            {/* Fetch value is testFieldId*/}
            <div className="form-control my-4">
                <label className="label">{t('text.testApi.field')}</label>
                <Select
                    options={props.testFields?.map(field => ({
                        value: field.id, // Ensure this is the correct type (string or number)
                        label: field.fieldName
                    }))}
                    value={editedNode?.value ? {
                        value: editedNode.value,
                        label: props.testFields.find(field => field.id === editedNode.value)?.fieldName || ''
                    } : null} // Set to null if there is no value
                    onChange={(selectedOption) => {
                        handleChange('value', selectedOption ? selectedOption.value : undefined); // Get the value of the selected option
                    }}
                    onInputChange={(inputValue) => {
                        debouncedFetchValidateConstrains(inputValue); // Call the debounced function
                    }}
                    placeholder={t('text.testApi.field')}
                    className="react-select-container"
                    classNamePrefix="react-select"
                    isMulti={false}
                />
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium">Type:</label>
                <select
                    className="input input-bordered w-full"
                    value={editedNode?.type || ""}
                    onChange={handleTypeChange}
                >
                    <option value="STRING">STRING</option>
                    <option value="NUMBER">NUMBER</option>
                    <option value="BOOLEAN">BOOLEAN</option>
                    <option value="OBJECT">OBJECT</option>
                    <option value="ARRAY_STRING">ARRAY STRING</option>
                    <option value="ARRAY_OBJECT">ARRAY OBJECT</option>
                </select>
            </div>
            <p><strong>ID:</strong> {props.selectedNode.id}</p>
        </div>
    );
};

export default NodeDetails;
