import React, { useState, useEffect } from "react";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import ItemList from "./components/items/ItemList";
import StationsList from "./components/stations/StationsList";
import { StationSelectors } from "./components/stations/StationSelectors";
import hideoutData from "./data/hideoutData.json";
import { useHideoutData } from "./hooks/useHideoutData";
import { useBuiltStations } from "./hooks/useBuiltStations";
import { calculateRequiredItems } from "./utils/hideoutCalculator";
import Footer from "./components/layout/Footer";
import StationsNeeded from "./components/stations/StationsNeeded";

const ThemeToggle = () => {
	const { darkMode, toggleDarkMode } = useTheme();

	return (
		<button
			onClick={toggleDarkMode}
			className='fixed p-2 transition-colors bg-gray-200 rounded-lg top-4 right-4 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
			aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
		>
			{darkMode ? (
				<svg
					className='w-6 h-6 text-gray-800 dark:text-gray-200'
					fill='currentColor'
					viewBox='0 0 20 20'
				>
					<path d='M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z' />
				</svg>
			) : (
				<svg
					className='w-6 h-6 text-gray-800 dark:text-gray-200'
					fill='currentColor'
					viewBox='0 0 20 20'
				>
					<path d='M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z' />
				</svg>
			)}
		</button>
	);
};

const AppContent = () => {
	const { stations, itemsMap, isLoading, error } = useHideoutData(hideoutData);
    const { builtStations, handleStationLevelChange } = useBuiltStations(stations);
    const [selectedStations, setSelectedStations] = useState([]);
	const [requiredItems, setRequiredItems] = useState({});

	useEffect(() => {
        const items = calculateRequiredItems({
            selectedStations,
            stations,
            itemsMap,
            builtStations,
        });
        setRequiredItems(items);
    }, [selectedStations, stations, itemsMap, builtStations]);

	return (
		<div className='flex flex-col items-center min-h-screen py-8 bg-gray-100 dark:bg-gray-900'>
			<ThemeToggle />
			<h1 className='mb-6 text-4xl font-bold text-gray-800 dark:text-gray-100'>
				Tarkov Hideout Items Calculator
			</h1>

			{isLoading && <p className='text-lg text-gray-600 dark:text-gray-400'>Loading...</p>}
			{error && (
				<p className='p-4 mb-4 text-lg text-red-600 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200'>
					{error}
				</p>
			)}

			{!isLoading && !error && (
                <div className='w-full max-w-4xl space-y-6'>
                    <div className='p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800'>
                        <StationsList
                            stations={stations}
                            builtStations={builtStations}
                            onStationLevelChange={handleStationLevelChange}
                        />
                    </div>

                    <div className='p-6 bg-white rounded-lg shadow-lg dark:bg-gray-800'>
                        <StationSelectors
                            stations={stations}
                            selectedStations={selectedStations}
                            setSelectedStations={setSelectedStations}
							builtStations={builtStations}
                        />
                    </div>

                    <div className='mt-6'>
                        <StationsNeeded
                            stations={stations}
                            selectedStations={selectedStations}
                            builtStations={builtStations}
                            setSelectedStations={setSelectedStations}
                        />
                    </div>

                    <div className='mt-6'>
                        <ItemList
                            items={requiredItems}
                            stations={stations}
                            selectedStations={selectedStations}
                            builtStations={builtStations}
                        />
                    </div>
                </div>
            )}

			<Footer />
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
