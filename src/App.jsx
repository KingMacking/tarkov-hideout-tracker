import React, { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import ItemList from "./components/ItemList";
import StationsList from "./components/StationsList";
import { StationSelectors } from "./components/StationSelectors";
import hideoutData from "./data/hideoutData.json";
import { useHideoutData } from "./hooks/useHideoutData";
import { useBuiltStations } from "./hooks/useBuiltStations";
import { calculateRequiredItems } from "./utils/hideoutCalculator";

const ThemeToggle = () => {
    const { darkMode, toggleDarkMode } = useTheme();
    
    return (
        <button
            onClick={toggleDarkMode}
            className="fixed top-4 right-4 p-2 rounded-lg bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            aria-label={darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
            {darkMode ? (
                <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                </svg>
            ) : (
                <svg className="w-6 h-6 text-gray-800 dark:text-gray-200" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
            )}
        </button>
    );
};

const AppContent = () => {
    const { stations, itemsMap, isLoading, error } = useHideoutData(hideoutData);
    const { builtStations, handleStationLevelChange } = useBuiltStations();
    const [selectedStation, setSelectedStation] = useState(null);
    const [selectedLevel, setSelectedLevel] = useState(null);
    const [requiredItems, setRequiredItems] = useState({});

    useEffect(() => {
        const items = calculateRequiredItems({
            station: selectedStation,
            level: selectedLevel,
            stations,
            itemsMap,
            builtStations
        });
        setRequiredItems(items);
    }, [selectedStation, selectedLevel, stations, itemsMap, builtStations]);

    return (
        <div className='min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col items-center py-8'>
            <ThemeToggle />
            <h1 className='text-4xl font-bold text-gray-800 dark:text-gray-100 mb-6'>
                Tarkov Hideout Item Calculator
            </h1>

            {isLoading && <p className='text-lg text-gray-600 dark:text-gray-400'>Loading...</p>}
            {error && (
                <p className='text-lg text-red-600 bg-red-100 dark:bg-red-900 dark:text-red-200 p-4 rounded-lg mb-4'>{error}</p>
            )}

            {!isLoading && !error && (
                <div className='w-full max-w-4xl space-y-6'>
                    <div className='bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6'>
                        <StationsList
                            stations={stations}
                            builtStations={builtStations}
                            onStationLevelChange={handleStationLevelChange}
                        />
                    </div>

                    <div className='bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6'>
                        <StationSelectors
                            stations={stations}
                            selectedStation={selectedStation}
                            selectedLevel={selectedLevel}
                            setSelectedStation={setSelectedStation}
                            setSelectedLevel={setSelectedLevel}
                        />
                    </div>

                    <div className='mt-6'>
                        <ItemList items={requiredItems} />
                    </div>
                </div>
            )}
        </div>
    );
};

const App = () => {
    return (
        <ThemeProvider>
            <AppContent />
        </ThemeProvider>
    );
};

export default App;
