import { useState, useRef } from "react";

const ACCOUNT_TYPES = [
    { value: "standard", label: "Standard", stashLevel: 1 },
    { value: "left_behind", label: "Left Behind", stashLevel: 2 },
    { value: "prepare_for_escape", label: "Prepare for Escape", stashLevel: 3 },
    { value: "edge_of_darkness", label: "Edge of Darkness", stashLevel: 4 },
    { value: "unheard", label: "Unheard", stashLevel: 4 },
    // ...otros tipos
];

const ConfigModal = ({
    open,
    onClose,
    config,
    updateConfig,
    stations,
	builtStations,
	clearBuiltStations,
	handleStationLevelChange,
	obtainedItems,
	clearObtainedItems,
}) => {
    const [accountType, setAccountType] = useState(config.accountType || "");

    const stashStation = stations.find(
        (s) => s.normalizedName === "stash" || s.name.toLowerCase() === "stash"
    );
    const stashId = stashStation?.id;

    // Excluir stash de builtStations para el botón y el reseteo
    const builtStationsWithoutStash = Object.fromEntries(
        Object.entries(builtStations).filter(([id]) => id !== stashId)
    );
    const hasBuiltStations = Object.keys(builtStationsWithoutStash).length > 0;
    const hasObtainedItems = obtainedItems && Object.keys(obtainedItems).length > 0;

    const handleSave = () => {
        const selected = ACCOUNT_TYPES.find((a) => a.value === accountType);
        if (stashStation && selected) {
            handleStationLevelChange(stashStation.id, selected.stashLevel);
        }
        updateConfig({
            accountType,
            initialConfigDone: true,
        });
        onClose();
    };

    const handleResetStations = () => {
        clearBuiltStations();
        onClose();
    };

    const handleResetItems = () => {
        clearObtainedItems();
        onClose();
    };

    // Cierre al hacer click fuera del modal
    const modalRef = useRef(null);
    const handleBackdropClick = (e) => {
        if (modalRef.current && !modalRef.current.contains(e.target)) {
            onClose();
        }
    };

    if (!open) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40"
            onMouseDown={handleBackdropClick}
        >
            <div
                ref={modalRef}
                className="relative w-full max-w-md p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800"
                onMouseDown={e => e.stopPropagation()}
            >
                {/* Botón de cerrar */}
                <button
                    className="absolute text-gray-500 top-3 right-3 hover:text-gray-800 dark:hover:text-gray-200"
                    onClick={onClose}
                    aria-label="Cerrar"
                    type="button"
                >
                    <svg className="w-5 h-5" viewBox="0 0 20 20" fill="none">
                        <path d="M6 6l8 8M6 14L14 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                </button>
                <h2 className="mb-4 text-xl font-bold text-gray-800 dark:text-gray-100">
                    Config
                </h2>
                <label className="block mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                    Account Edition:
                </label>
                <select
                    className="w-full p-2 mb-4 text-gray-800 bg-gray-100 rounded dark:bg-gray-700 dark:text-gray-200"
                    value={accountType}
                    onChange={(e) => setAccountType(e.target.value)}
                >
                    <option value="">Select an option...</option>
                    {ACCOUNT_TYPES.map((type) => (
                        <option key={type.value} value={type.value}>
                            {type.label}
                        </option>
                    ))}
                </select>
                <div className="flex flex-col gap-2 mt-6">
                    {hasBuiltStations && (
                        <button
                            className="px-4 py-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200"
                            onClick={handleResetStations}
                        >
                            Reset built stations
                        </button>
                    )}
                    {hasObtainedItems && (
                        <button
                            className="px-4 py-2 text-gray-800 bg-gray-300 rounded hover:bg-gray-400 dark:bg-gray-700 dark:text-gray-200"
                            onClick={handleResetItems}
                        >
                            Reset obtained items
                        </button>
                    )}
                    <button
                        className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700"
                        onClick={handleSave}
                        disabled={!accountType}
                    >
                        Save
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfigModal;
