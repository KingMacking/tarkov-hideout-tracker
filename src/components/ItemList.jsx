import React, { useState, useEffect, useCallback } from "react";
import { useObtainedItems } from "../hooks/useObtainedItems";

const ItemList = ({ items }) => {
    const [viewMode, setViewMode] = useState("list");
    const [sortBy, setSortBy] = useState("default");
    const [sortedItems, setSortedItems] = useState([]);
    const [updateTimeout, setUpdateTimeout] = useState(null);
    const { obtainedItems, toggleItemObtained } = useObtainedItems();

    // Función para ordenar items
    const sortItems = useCallback((items) => {
        const itemsArray = Object.entries(items);
        switch (sortBy) {
            case "name":
                return itemsArray.sort((a, b) => a[1].item.name.localeCompare(b[1].item.name));
            case "remaining":
                return itemsArray.sort((a, b) => {
                    const aObtained = obtainedItems[a[0]] || 0;
                    const bObtained = obtainedItems[b[0]] || 0;
                    
                    // Calcular porcentajes completados
                    const aPercentage = (aObtained / a[1].quantity) * 100;
                    const bPercentage = (bObtained / b[1].quantity) * 100;
                    
                    if (aPercentage !== bPercentage) {
                        // Primero ordenar por porcentaje completado (menor % primero)
                        return aPercentage - bPercentage;
                    }
                    
                    // Si tienen el mismo porcentaje, ordenar por cantidad total necesaria (mayor cantidad primero)
                    return b[1].quantity - a[1].quantity;
                });
            default:
                return itemsArray;
        }
    }, [sortBy, obtainedItems]);

    // Efecto para actualizar items ordenados
    useEffect(() => {
        setSortedItems(sortItems(items));
    }, [items, sortBy]); // No incluimos obtainedItems aquí

    // Wrapper para toggleItemObtained con delay en el reordenamiento
    const handleToggleItem = (itemId, amount) => {
        // Primero calculamos el nuevo valor de obtainedItems
        const currentObtained = obtainedItems[itemId] || 0;
        const newObtained = currentObtained + amount;
        
        // Actualizamos el estado
        toggleItemObtained(itemId, amount);
        
        if (sortBy === 'remaining') {
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
            
            // Creamos una versión temporal de obtainedItems con el nuevo valor
            const updatedObtainedItems = {
                ...obtainedItems,
                [itemId]: newObtained
            };
            
            // Función de ordenamiento temporal que usa los valores actualizados
            const tempSort = (items) => {
                const itemsArray = Object.entries(items);
                return itemsArray.sort((a, b) => {
                    const aObtained = updatedObtainedItems[a[0]] || 0;
                    const bObtained = updatedObtainedItems[b[0]] || 0;
                    
                    const aPercentage = (aObtained / a[1].quantity) * 100;
                    const bPercentage = (bObtained / b[1].quantity) * 100;
                    
                    if (aPercentage !== bPercentage) {
                        return aPercentage - bPercentage;
                    }
                    
                    return b[1].quantity - a[1].quantity;
                });
            };
            
            const timeoutId = setTimeout(() => {
                setSortedItems(tempSort(items));
            }, 2000);
            
            setUpdateTimeout(timeoutId);
        }
    };

    // Modificar renderQuantityControls para usar handleToggleItem
    const renderQuantityControls = (itemId, totalRequired, inGrid = false) => {
        // Si es Roubles, solo mostrar la cantidad
        if (isRoubles(itemId)) {
            return (
                <div
                    className={`flex items-center justify-center ${
                        inGrid ? "text-white" : "text-gray-700 dark:text-gray-200"
                    }`}
                >
                    <span className={inGrid ? "text-sm font-medium" : "text-base font-medium"}>
                        ₽{totalRequired.toLocaleString()}
                    </span>
                </div>
            );
        }

        const obtained = obtainedItems[itemId] || 0;
        const progress = (obtained / totalRequired) * 100;

        if (inGrid) {
            return (
                <div className='flex flex-col w-full'>
                    {/* Progress bar */}
                    <div className='w-full h-2 overflow-hidden rounded-lg bg-gray-200/30'>
                        <div
                            className='h-2 transition-all bg-blue-600'
                            style={{ width: `${progress}%` }}
                        />
                    </div>

                    {/* Controls - only visible on hover */}
                    <div className='flex items-center justify-between w-full px-2 mt-auto'>
                        <button
                            onClick={() => handleToggleItem(itemId, -1)}
                            className='p-1 text-white transition-colors hover:text-gray-200'
                            disabled={obtained <= 0}
                        >
                            <svg
                                className='w-4 h-4'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M20 12H4'
                                />
                            </svg>
                        </button>
                        <span className='text-sm font-medium text-white'>
                            {obtained}/{totalRequired}
                        </span>
                        <button
                            onClick={() => handleToggleItem(itemId, 1)}
                            className='p-1 text-white transition-colors hover:text-gray-200'
                            disabled={obtained >= totalRequired}
                        >
                            <svg
                                className='w-4 h-4'
                                fill='none'
                                viewBox='0 0 24 24'
                                stroke='currentColor'
                            >
                                <path
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                    strokeWidth={2}
                                    d='M12 4v16m8-8H4'
                                />
                            </svg>
                        </button>
                    </div>
                </div>
            );
        }

        // List view controls remain the same
        return (
            <div
                className={`flex items-center ${
                    inGrid ? "gap-1 w-full justify-between px-2" : "gap-2"
                }`}
            >
                <button
                    onClick={() => handleToggleItem(itemId, -1)}
                    disabled={obtained <= 0}
                    className='text-gray-600 dark:text-gray-200'
                >
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M20 12H4'
                        />
                    </svg>
                </button>
                <div className='flex flex-col items-center min-w-[60px]'>
                    <div
                        className={
                            inGrid
                                ? "text-xs text-white"
                                : "text-sm text-gray-600 dark:text-gray-400"
                        }
                    >
                        {obtained}/{totalRequired}
                    </div>
                    <div className='w-full h-1.5 rounded-full bg-gray-200/30'>
                        <div
                            className='h-1.5 transition-all bg-blue-600 rounded-full'
                            style={{ width: `${progress}%`, maxWidth: "100%" }}
                        />
                    </div>
                </div>
                <button
                    onClick={() => handleToggleItem(itemId, 1)}
                    disabled={obtained >= totalRequired}
                    className='text-gray-600 dark:text-gray-200'
                >
                    <svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                        <path
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeWidth={2}
                            d='M12 4v16m8-8H4'
                        />
                    </svg>
                </button>
            </div>
        );
    };

    // Cleanup al desmontar
    useEffect(() => {
        return () => {
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
        };
    }, []);

    const isRoubles = (itemId) => itemId === "5449016a4bdc2d6f028b456f";

    const renderRoubleCard = () => {
        const roubleItem = Object.entries(items).find(([id]) => isRoubles(id));
        
        if (!roubleItem) return null;
        
        // eslint-disable-next-line no-unused-vars
        const [itemId, { quantity, item }] = roubleItem;
        
        return (
            <div className="p-2 mb-4 rounded-lg bg-gray-50 dark:bg-gray-700">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        {item.imageLink && (
                            <img
                                src={item.imageLink}
                                alt={item.name}
                                className="object-cover w-[60px] h-[60px] rounded"
                            />
                        )}
                        <div>
                            <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                                Required Roubles
                            </h3>
                            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                                ₽{quantity.toLocaleString()}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    // const itemsWithoutRoubles = Object.entries(items).filter(([id]) => !isRoubles(id));

    if (!items || Object.keys(items).length === 0) {
        return <p className='italic text-gray-500 dark:text-gray-400'>No items required.</p>;
    }

    const toggleView = () => {
        setViewMode((prev) => (prev === "list" ? "grid" : "list"));
    };

    return (
        <div className='space-y-4'>
            <div className='flex items-center justify-between gap-4'>
                <h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
                    Required Items:
                </h2>
                <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className='px-2 py-1 ml-auto text-sm bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300'
                >
                    <option value='default'>Default</option>
                    <option value='name'>Name A-Z</option>
                    <option value='remaining'>Most needed</option>
                </select>
                <button
                    onClick={toggleView}
                    className='flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 rounded-md dark:bg-gray-700 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-600'
                >
                    {viewMode === "list" ? (
                        <>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='w-4 h-4'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                            >
                                <path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z' />
                            </svg>
                            Grid View
                        </>
                    ) : (
                        <>
                            <svg
                                xmlns='http://www.w3.org/2000/svg'
                                className='w-4 h-4'
                                viewBox='0 0 20 20'
                                fill='currentColor'
                            >
                                <path
                                    fillRule='evenodd'
                                    d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
                                    clipRule='evenodd'
                                />
                            </svg>
                            List View
                        </>
                    )}
                </button>
            </div>

            {/* Roubles Card */}
            {renderRoubleCard()}

            {viewMode === 'list' ? (
                <ul className='space-y-3'>
                    {sortedItems
                        .filter(([id]) => !isRoubles(id))
                        .map(([itemId, { quantity, item }]) => (
                            <li
                                key={itemId}
                                className='flex items-center p-2 rounded-lg shadow-sm bg-gray-50 dark:bg-gray-700'
                            >
                                {item.imageLink && (
                                    <img
                                        src={item.imageLink}
                                        alt={item.name}
                                        className='object-cover w-12 h-12 mr-4 rounded'
                                    />
                                )}
                                <div className='flex items-center justify-between flex-1'>
                                    <span className='text-gray-700 dark:text-gray-200'>
                                        {item.name}
                                    </span>
                                    {renderQuantityControls(itemId, quantity, false)}
                                </div>
                            </li>
                        ))}
                </ul>
            ) : (
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
                    {sortedItems
                        .filter(([id]) => !isRoubles(id))
                        .map(([itemId, { quantity, item }]) => (
                            <div key={itemId} className='relative group'>
                                <div className='relative mb-2 overflow-hidden rounded-lg aspect-square bg-gray-50 dark:bg-gray-700'>
                                    {item.imageLink && (
                                        <img
                                            src={item.imageLink}
                                            alt={item.name}
                                            className='absolute inset-0 object-cover w-full h-full'
                                        />
                                    )}

                                    {/* Hover overlay */}
                                    <div className='absolute inset-0 flex flex-col transition-opacity duration-200 opacity-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent group-hover:opacity-100'>
                                        {/* Item name in middle */}
                                        <span className='flex items-center justify-center flex-1 px-2 text-sm font-bold text-center text-white'>
                                            {item.name}
                                        </span>

                                        {/* Progress bar at top */}
                                    </div>
                                </div>
                                {renderQuantityControls(itemId, quantity, true)}
                            </div>
                        ))}
                </div>
            )}
        </div>
    );
};

export default ItemList;
