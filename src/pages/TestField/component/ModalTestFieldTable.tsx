import { LockClosedIcon, XMarkIcon } from "@heroicons/react/24/outline";
import ListTestField from "../ui/page/ListTestField";

interface ModalModalTestFieldTable {
    modelName: string;
    apiId?: number;
}

const ModalTestFieldTable = (props: ModalModalTestFieldTable) => {
    const closeModal = () => {
        const modal = document.getElementById(props.modelName);
        if (modal instanceof HTMLDialogElement) {
            modal.close(); // Close the dialog/modal
        }
    };

    return (
        <div className="">
            <dialog id={props.modelName} className="modal">
                <div className="modal-box max-w-5xl">
                    {/* Close Icon */}
                    <button
                        className="absolute top-2 right-2 text-base-400 text-base-800"

                        onClick={closeModal}
                        aria-label="Close"
                    >
                        <XMarkIcon className="w-4 h-4" />
                    </button>

                    <ListTestField apiId={props.apiId} />

                    <div className="modal-action">
                        <form method="dialog">
                            {/* Remove the Close button */}
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
};

export default ModalTestFieldTable;
