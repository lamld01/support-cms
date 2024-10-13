import { TestField } from "@/pages/TestField";
import { debounce } from "lodash";
import { useCallback, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { JsonInfo } from "../../model/type";
import MultiSelect from "@/component/share/MultiSelect";

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
        console.log(props.selectedNode);
        
    }, [props.selectedNode]);

    const handleChange = (field: keyof JsonInfo, value?: string | number) => {
        if (editedNode) {
            const updatedNode = { ...editedNode, [field]: value };
            console.log(updatedNode);
            
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
        return <div className="text-neutral-content">Select a node to see details</div>;
    }

    return (
        <div className="p-4 bg-base-100 rounded shadow-md">
            <h2 className="text-lg font-bold mb-2">{t('text.treeNode.information')}</h2>
            <div className="mb-2">
                <label className="block text-sm font-medium">{t('text.treeNode.key')}</label>
                <input
                    type="text"
                    className="input input-bordered w-full"
                    value={editedNode?.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                />
            </div>
            {/* Fetch value is testFieldId */}
            <div className="form-control my-4">
                <label className="label">{t('text.treeNode.value')}</label>
                <MultiSelect
                    isMulti={false} // Set to true for multi-select functionality
                    options={props.testFields?.map(field => ({
                        value: field.id, // Ensure this is the correct type (number is expected)
                        label: field.fieldName,
                    })) || []} // Provide a fallback to avoid undefined
                    value={editedNode?.value ? {
                        value: editedNode.value,
                        label: props.testFields.find(field => field.id === editedNode.value)?.fieldName || ''
                    } : null}
                    onChange={(selectedOption) => {
                        handleChange('value', selectedOption ? selectedOption[0]?.value : undefined); // Get the value of the selected option
                    }}
                    onInputChange={(inputValue) => {
                        debouncedFetchValidateConstrains(inputValue);
                    }}
                    placeholder={t(`common.select.field`)} // Example placeholder text
                />
            </div>
            <div className="mb-2">
                <label className="block text-sm font-medium">{t('text.treeNode.type')}</label>
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
            
        </div>
    );
};

export default NodeDetails;
