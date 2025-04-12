import React, { useState, useEffect } from "react";
import Select from "react-select";
import ItemList from "./components/ItemList";
import hideoutData from "./data/hideoutData.json";
import StationsList from "./components/StationsList";

const App = () => {
	// Inicializar builtStations con los datos del localStorage
	const initialBuiltStations = (() => {
		try {
			const saved = localStorage.getItem("builtStations");
			return saved ? JSON.parse(saved) : {};
		} catch (e) {
			console.error("Error loading built stations from localStorage:", e);
			return {};
		}
	})();

	const [stations, setStations] = useState([]);
	const [itemsMap, setItemsMap] = useState({});
	const [selectedStation, setSelectedStation] = useState(null);
	const [selectedLevel, setSelectedLevel] = useState(null);
	const [requiredItems, setRequiredItems] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);
	const [builtStations, setBuiltStations] = useState(initialBuiltStations);

	// Solo mantener el useEffect para guardar cambios
	useEffect(() => {
		localStorage.setItem("builtStations", JSON.stringify(builtStations));
	}, [builtStations]);

	// Cargar los datos del JSON cuando el componente se monta
	useEffect(() => {
		const loadData = () => {
			setIsLoading(true);
			setError(null);
			try {
				console.log("Datos cargados del JSON:", hideoutData);

				// Cargar estaciones
				if (hideoutData?.hideoutStations && Array.isArray(hideoutData.hideoutStations)) {
					setStations(hideoutData.hideoutStations);
				} else if (Array.isArray(hideoutData)) {
					setStations(hideoutData);
				} else {
					console.error(
						"El archivo JSON no contiene un array válido de estaciones:",
						hideoutData
					);
					setStations([]);
					setError("El archivo de datos no tiene el formato esperado.");
					return;
				}

				// Cargar ítems y crear un mapa de itemId a datos del ítem
				// Asumimos que hideoutData.items contiene la lista de ítems
				if (hideoutData?.items && Array.isArray(hideoutData.items)) {
					const map = hideoutData.items.reduce((acc, item) => {
						acc[item.id] = item; // Mapa: itemId -> { id, name, imageLink, ... }
						return acc;
					}, {});
					setItemsMap(map);
				} else {
					console.warn("No se encontraron ítems en el JSON. Usando placeholders.");
					setItemsMap({});
				}
			} catch (err) {
				console.error("Error al cargar los datos del JSON:", err);
				setError("Failed to load data from JSON.");
				setStations([]);
				setItemsMap({});
			} finally {
				setIsLoading(false);
			}
		};
		loadData();
	}, []);

	// Options para el dropdown de estaciones (nombres únicos)
	const stationOptions =
		stations.length > 0
			? [...new Set(stations.map((station) => station?.name).filter(Boolean))].map(
					(name) => ({
						value: name,
						label: name,
					})
			  )
			: [];

	// Options para el dropdown de niveles (basado en la estación seleccionada)
	const levelOptions =
		selectedStation && stations.length > 0
			? stations
					.filter((station) => station?.name === selectedStation.value)
					.flatMap((station) => station?.levels || [])
					.map((level) => ({
						value: level?.level,
						label: `Level ${level?.level}`,
					}))
					.filter((option) => option.value !== undefined)
			: [];

	// Función para calcular los ítems requeridos, incluyendo dependencias
	const calculateRequiredItems = (station, level) => {
		if (!station || !level || !stations.length) return {};

		const targetStation = stations.find((s) => s?.name === station.value);
		const targetLevel = targetStation?.levels?.find((l) => l?.level === level.value);
		if (!targetStation || !targetLevel) return {};

		// Mapa para acumular ítems: { itemId: { quantity, item } }
		const items = {};

		const processStationLevel = (stationName, levelNum) => {
			const station = stations.find((s) => s?.name === stationName);
			const levelData = station?.levels?.find((l) => l?.level === levelNum);
			if (!station || !levelData) return;

			// Verificar si ya tenemos la estación construida al nivel requerido
			const builtLevel = builtStations[station.id] || 0;
			if (builtLevel >= levelNum) {
				return; // Skip si ya tenemos la estación construida al nivel necesario
			}

			if (levelData.itemRequirements && Array.isArray(levelData.itemRequirements)) {
				levelData.itemRequirements.forEach((req) => {
					if (req?.item?.id && req?.quantity) {
						const itemId = req.item.id;
						const itemName = req.item.name;
						const itemImageLink = req.item.imageLink;
						const itemData = itemsMap[itemId] || {
							id: itemId,
							name: itemName,
							imageLink: itemImageLink,
						}; // Fallback si no se encuentra el ítem
						if (!items[itemId]) {
							items[itemId] = { quantity: 0, item: itemData };
						}
						items[itemId].quantity += req.quantity;
					}
				});
			}

			if (
				levelData.stationLevelRequirements &&
				Array.isArray(levelData.stationLevelRequirements)
			) {
				levelData.stationLevelRequirements.forEach((dep) => {
					const depStationName = dep?.station?.normalizedName;
					const depLevel = dep?.level;

					if (!depStationName || !depLevel) return;

					const depStation = stations.find((s) => s?.normalizedName === depStationName);
					if (!depStation) return;

					// Verificar si ya tenemos la estación dependiente construida
					const builtLevel = builtStations[depStation.id] || 0;
					if (builtLevel < depLevel) {
						for (let lvl = builtLevel + 1; lvl <= depLevel; lvl++) {
							processStationLevel(depStation.name, lvl);
						}
					}
				});
			}
		};

		processStationLevel(targetStation.name, targetLevel.level);

		return items;
	};

	// Actualizar ítems requeridos cuando cambian las selecciones
	useEffect(() => {
		const items = calculateRequiredItems(selectedStation, selectedLevel);
		setRequiredItems(items);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [selectedStation, selectedLevel, stations, itemsMap, builtStations]);

	// Modificar la función handleStationLevelChange para que limpie el nivel si es 0
	const handleStationLevelChange = (stationId, level) => {
		setBuiltStations((prev) => {
			const newBuiltStations = { ...prev };
			if (level === 0) {
				delete newBuiltStations[stationId]; // Eliminar la estación si no está construida
			} else {
				newBuiltStations[stationId] = level;
			}
			return newBuiltStations;
		});
	};

	return (
		<div className='min-h-screen bg-gray-100 flex flex-col items-center py-8'>
			<h1 className='text-4xl font-bold text-gray-800 mb-6'>
				Tarkov Hideout Item Calculator
			</h1>

			{isLoading && <p className='text-lg text-gray-600'>Loading...</p>}
			{error && (
				<p className='text-lg text-red-600 bg-red-100 p-4 rounded-lg mb-4'>{error}</p>
			)}

			{!isLoading && !error && (
				<div className='w-full max-w-4xl space-y-6'>
					{/* Agregar el componente StationsList */}
					<div className='bg-white shadow-lg rounded-lg p-6'>
						<StationsList
							stations={stations}
							builtStations={builtStations}
							onStationLevelChange={handleStationLevelChange}
						/>
					</div>

					{/* Selector de estación y nivel existente */}
					<div className='bg-white shadow-lg rounded-lg p-6'>
						<div className='space-y-4'>
							<div></div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Select Station:
							</label>
							<Select
								options={stationOptions}
								value={selectedStation}
								onChange={setSelectedStation}
								placeholder='Choose a station'
								isDisabled={stationOptions.length === 0}
								className='w-full'
								classNamePrefix='select'
							/>
						</div>
						<div>
							<label className='block text-sm font-medium text-gray-700 mb-1'>
								Select Level:
							</label>
							<Select
								options={levelOptions}
								value={selectedLevel}
								onChange={setSelectedLevel}
								placeholder='Choose a level'
								isDisabled={!selectedStation || levelOptions.length === 0}
								className='w-full'
								classNamePrefix='select'
							/>
						</div>
					</div>

					<div className='mt-6'>
						{!selectedStation || !selectedLevel && (
							<h2 className='text-2xl font-semibold text-gray-800 mb-4'>
								Required Items
							</h2>
						)}
						<ItemList items={requiredItems} />
					</div>
				</div>
			)}
		</div>
	);
};

export default App;
