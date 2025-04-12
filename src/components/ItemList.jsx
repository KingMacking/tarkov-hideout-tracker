import React, { useState } from "react";

const ItemList = ({ items }) => {
    const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'

    if (!items || Object.keys(items).length === 0) {
        return <p className='text-gray-500 italic'>No items required.</p>;
    }

    const toggleView = () => {
        setViewMode(prev => prev === 'list' ? 'grid' : 'list');
    };

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h2 className='text-xl font-semibold text-gray-800'>Required Items:</h2>
                <button
                    onClick={toggleView}
                    className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-md text-sm flex items-center gap-2"
                >
                    {viewMode === 'list' ? (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z" />
                            </svg>
                            Grid View
                        </>
                    ) : (
                        <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                            </svg>
                            List View
                        </>
                    )}
                </button>
            </div>

            {viewMode === 'list' ? (
                // Vista de lista existente
                <ul className='space-y-3'>
                    {Object.entries(items).map(([itemId, { quantity, item }]) => (
                        <li
                            key={itemId}
                            className='flex items-center p-3 bg-gray-50 rounded-lg shadow-sm'
                        >
                            {item.imageLink && (
                                <img
                                    src={item.imageLink}
                                    alt={item.name}
                                    className='w-12 h-12 object-contain mr-4 rounded'
                                />
                            )}
                            <div className='flex-1 flex justify-between items-center'>
                                <span className='text-gray-700'>{item.name}</span>
                                <span className='text-gray-900 font-medium'>x{quantity}</span>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                // Vista de grid
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {Object.entries(items).map(([itemId, { quantity, item }]) => (
                        <div
                            key={itemId}
                            className="relative group"
                        >
                            <div className="aspect-square bg-gray-50 rounded-lg flex flex-col items-center justify-center shadow-sm overflow-hidden">
                                {item.imageLink && (
                                    <img
                                        src={item.imageLink}
                                        alt={item.name}
                                        className='w-full h-full object-cover'
                                    />
                                )}
                                <span className='absolute bottom-1 right-1 bg-white text-black px-2 py-1 rounded-full text-sm'>
                                    x{quantity}
                                </span>
                                {/* Tooltip con el nombre */}
                                <div className="absolute inset-0 flex items-center justify-center bg-[rgba(0,0,0,0.5)] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <span className="text-center px-2 text-sm">{item.name}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ItemList;
