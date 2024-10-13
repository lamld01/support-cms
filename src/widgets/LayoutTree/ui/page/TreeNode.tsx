import { useState } from "react";
import {
    ChevronDownIcon,
    ChevronUpIcon,
    MinusIcon,
    PlusIcon
} from "@heroicons/react/24/outline";
import { JsonInfo } from "../../model/type";

interface TreeNodeProps {
    node: JsonInfo;
    onSelect: (node: JsonInfo) => void;
    onAddChild: (parentId: string, newChild: JsonInfo) => void;
    onDelete: (nodeId: string) => void;
}

const TreeNode = ({ node, onSelect, onAddChild, onDelete }: TreeNodeProps) => {
    const [isOpen, setIsOpen] = useState<boolean>(node.toggled || false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (event: React.MouseEvent) => {
        event.stopPropagation();
        // Prevent selecting the node with id 'body'
        if (node.id !== 'body') {
            onSelect(node);
        }
    };

    const canToggle = node.type === 'OBJECT' || node.type === 'ARRAY OBJECT' || node.type === 'ARRAY STRING' || node.id === 'body';

    const handleAddChild = () => {
        const newId = `${node.id}.${node.children ? node.children.length + 1 : 1}`;
        const newChild: JsonInfo = {
            id: newId,
            name: 'NoName',
            toggled: false,
            type: 'STRING',
            value: undefined,
            children: [],
        };
        onAddChild(node.id, newChild);
    };

    const handleDelete = () => {
        onDelete(node.id);
    };

    return (
        <div className="ml-4">
            <div className="flex items-center">
                {canToggle && (
                    <button type="button" className="flex items-center space-x-2" onClick={handleToggle}>
                        {isOpen ? (
                            <ChevronDownIcon className="w-4 h-4 text-neutral" />
                        ) : (
                            <ChevronUpIcon className="w-4 h-4 text-neutral" />
                        )}
                    </button>
                )}
                <span className={` ${canToggle ? 'ml-2' : 'hover:text-primary cursor-pointer '}`} onClick={handleSelect}>
                    {node.name}
                </span>

                {(node.type === 'OBJECT' || node.type === 'ARRAY OBJECT' || node.type === 'ARRAY STRING') && (
                    <button type="button" onClick={() => {
                        handleAddChild();
                        setIsOpen(true);
                    }} className="ml-2">
                        <PlusIcon className="w-4 h-4 text-success" />
                    </button>
                )}

                {node.id !== 'body' && (
                    <button type="button" onClick={handleDelete} className="ml-2">
                        <MinusIcon className="w-4 h-4 text-error" />
                    </button>
                )}
            </div>

            {isOpen && canToggle && node.children && (
                <ul className="ml-4 border-l border-gray-300 pl-3 mt-1">
                    {node.children.map((child: JsonInfo) => (
                        <li key={child.id}>
                            <TreeNode node={child} onSelect={onSelect} onAddChild={onAddChild} onDelete={onDelete} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default TreeNode;
