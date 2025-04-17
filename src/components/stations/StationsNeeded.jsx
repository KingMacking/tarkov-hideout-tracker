import React from 'react';
import { getRequiredStations } from '../../utils/getRequiredStations';

const StationsNeeded = ({ 
    stations, 
    selectedStation, 
    selectedLevel, 
    builtStations,
    setSelectedStation,
    setSelectedLevel 
}) => {
    if (!selectedStation || !selectedLevel) return null;

    const requiredStations = getRequiredStations(stations, selectedStation, selectedLevel);

    if (requiredStations.length === 0) return null;

    const isStationBuilt = (stationId, requiredLevel) => {
        const builtLevel = builtStations[stationId] || 0;
        return builtLevel >= requiredLevel;
    };

    const handleStationClick = (stationName, level) => {
        setSelectedStation({ value: stationName, label: stationName });
        setSelectedLevel({ value: level, label: `Level ${level}` });
    };

    return (
        <div className="p-4 mb-6 rounded-lg bg-gray-50 dark:bg-gray-700">
            <h3 className="mb-3 text-lg font-medium text-gray-800 dark:text-gray-200">
                Required Stations
            </h3>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {requiredStations.map((req) => (
                    <div 
                        key={`${req.id}-${req.level}`}
                        className="relative flex items-center p-3 space-x-3 transition-colors bg-white rounded-lg cursor-pointer dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-900"
                        onClick={() => handleStationClick(req.station, req.level)}
                        role="button"
                        tabIndex={0}
                    >
                        {/* Check mark for built stations */}
                        {isStationBuilt(req.id, req.level) && (
                            <div className="absolute right-0 z-10 flex items-center justify-center w-4 h-4 text-white bg-gray-800 rounded-full dark:text-gray-800 dark:bg-white top-2">
                                <svg 
                                    className="w-4 h-4" 
                                    fill="none" 
                                    viewBox="0 0 24 24" 
                                    stroke="currentColor"
                                >
                                    <path 
                                        strokeLinecap="round" 
                                        strokeLinejoin="round" 
                                        strokeWidth={2} 
                                        d="M5 13l4 4L19 7" 
                                    />
                                </svg>
                            </div>
                        )}

                        {/* Existing station content */}
                        {req.imageLink && (
                            <img 
                                src={req.imageLink} 
                                alt={req.station}
                                className="object-cover w-12 h-12 rounded"
                            />
                        )}
                        <div>
                            <p className="font-medium text-gray-900 dark:text-gray-100">
                                {req.station}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Level {req.level}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default StationsNeeded;