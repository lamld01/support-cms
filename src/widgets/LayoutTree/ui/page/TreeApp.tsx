import { useState } from "react";
import TreeNode from "./TreeNode";
import NodeDetails from "./NodeDetails";
import { useTranslation } from "react-i18next";
import { TestField } from "@/pages/TestField";
import { JsonInfo } from "../../model/type";

interface TreeAppProps {
    body?: JsonInfo;
    setBody: (body?: JsonInfo) => void;
    testFields: TestField[];
    fetchTestFeilds: (name?: string) => void;
}

const TreeApp = (props: TreeAppProps) => {
    const { t } = useTranslation();
    const [selectedNode, setSelectedNode] = useState<JsonInfo | undefined>();
    const [hasBody, setHasBody] = useState<boolean>(!!props.body); // State to track if body exists

    const handleNodeSelect = (node: JsonInfo) => {
        setSelectedNode(node);
    };

    const createNewBody = () => {
        const newBody: JsonInfo = {
            id: 'body',
            name: 'Body',
            toggled: false,
            type: 'OBJECT',
            value: undefined,
            children: [],
        };
        props.setBody(newBody);
        setHasBody(true); // Set hasBody to true when a new body is created
    };

    const handleAddChild = (parentId: string, newChild: JsonInfo) => {
        const addChildToNode = (nodes: JsonInfo[], parentId: string): JsonInfo[] => {
            return nodes.map((node) => {
                if (node.id === parentId) {
                    return {
                        ...node,
                        children: [...(node.children || []), newChild]
                    };
                }
                if (node.children) {
                    return {
                        ...node,
                        children: addChildToNode(node.children, parentId)
                    };
                }
                return node;
            });
        };

        if (parentId === 'body') {
            if (props.body) {
                const updatedBody: JsonInfo = {
                    ...props.body,
                    children: [...(props.body.children || []), newChild],
                };
                props.setBody(updatedBody);
            }
        } else {
            if (props.body) {
                const updatedBody: JsonInfo = {
                    ...props.body,
                    children: addChildToNode(props.body.children || [], parentId),
                };
                props.setBody(updatedBody);
            }
        }
    };

    const handleDeleteNode = (nodeId: string) => {
        const deleteNode = (nodes: JsonInfo[], id: string): JsonInfo[] => {
            return nodes.filter((node) => {
                if (node.id === id) {
                    return false; // Skip this node
                }
                if (node.children) {
                    return {
                        ...node,
                        children: deleteNode(node.children, id),
                    };
                }
                return node;
            });
        };

        if (props.body) {
            const updatedBody: JsonInfo = {
                ...props.body,
                children: deleteNode(props.body.children || [], nodeId),
            };
            props.setBody(updatedBody);
        }
    };

    const handleUpdateNode = (updatedNode: JsonInfo) => {
        const updateNodeInTree = (nodes: JsonInfo[], updatedNode: JsonInfo): JsonInfo[] => {
            return nodes.map((node) => {
                if (node.id === updatedNode.id) {
                    return { ...node, ...updatedNode };
                }
                if (node.children) {
                    return {
                        ...node,
                        children: updateNodeInTree(node.children, updatedNode),
                    };
                }
                return node;
            });
        };

        if (props.body) {
            const updatedBody: JsonInfo = {
                ...props.body,
                children: updateNodeInTree(props.body.children || [], updatedNode),
            };
            props.setBody(updatedBody);
        }
    };

    const deleteBody = () => {
        props.setBody(undefined);
        setSelectedNode(undefined);
        setHasBody(false);
    };

    return (
        <div>
            <div className="flex items-center mb-2">
                <label className="label">
                    <span className="label-text">{t('text.testApi.body')}</span>
                    <input
                        type="checkbox"
                        checked={hasBody}
                        onChange={() => {
                            if (hasBody) {
                                deleteBody();
                            } else {
                                createNewBody();
                            }
                        }}
                        className="toggle toggle-primary ml-2"
                    />
                </label>
            </div>

            <div className="flex flex-row">
                <div className="flex-1 overflow-auto p-4">
                    {props.body && (
                        <TreeNode
                            node={props.body}
                            onSelect={handleNodeSelect}
                            onAddChild={handleAddChild}
                            onDelete={handleDeleteNode}
                        />
                    )}
                </div>

                <div className="w-2/3 p-4">
                    {props.body && (
                        <div className="border-l pl-4">
                            <NodeDetails selectedNode={selectedNode} onUpdate={handleUpdateNode} testFields={props.testFields} fetchTestField={props.fetchTestFeilds}/>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default TreeApp;
