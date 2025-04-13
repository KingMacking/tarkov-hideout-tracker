export const calculateRequiredItems = (params) => {
	const { station, level, stations, itemsMap, builtStations } = params;

	if (!station || !level || !stations.length) return {};

	const targetStation = stations.find((s) => s?.name === station.value);
	const targetLevel = targetStation?.levels?.find((l) => l?.level === level.value);
	if (!targetStation || !targetLevel) return {};

	const items = {};
	const processedLevels = new Set();

	const processStationLevel = (stationName, levelNum) => {
		const station = stations.find((s) => s?.name === stationName);
		if (!station) return;

		// Crear una clave única para este nivel de estación
		const levelKey = `${station.id}_${levelNum}`;
		if (processedLevels.has(levelKey)) return; // Evitar procesar el mismo nivel múltiples veces
		processedLevels.add(levelKey);

		const levelData = station?.levels?.find((l) => l?.level === levelNum);
		if (!levelData) return;

		// Verificar si ya tenemos la estación construida al nivel requerido
		const builtLevel = builtStations[station.id] || 0;
		if (builtLevel >= levelNum) return;

		// Procesar primero las dependencias de otras estaciones
		if (levelData.stationLevelRequirements?.length > 0) {
			levelData.stationLevelRequirements.forEach((dep) => {
				const depStationName = dep?.station?.normalizedName;
				const depLevel = dep?.level;

				if (!depStationName || !depLevel) return;

				const depStation = stations.find((s) => s?.normalizedName === depStationName);
				if (!depStation) return;

				const depBuiltLevel = builtStations[depStation.id] || 0;
				if (depBuiltLevel < depLevel) {
					// Procesar solo los niveles que faltan
					for (let lvl = depBuiltLevel + 1; lvl <= depLevel; lvl++) {
						processStationLevel(depStation.name, lvl);
					}
				}
			});
		}

		// Procesar los requerimientos de items de este nivel
		if (levelData.itemRequirements?.length > 0) {
			levelData.itemRequirements.forEach((req) => {
				if (!req?.item?.id || !req?.quantity) return;

				const itemId = req.item.id;
				const itemData = itemsMap[itemId] || {
					id: itemId,
					name: req.item.name,
					imageLink: req.item.imageLink,
				};

				if (!items[itemId]) {
					items[itemId] = { quantity: 0, item: itemData };
				}

				// Asegurarse de que la cantidad sea un número válido
				const quantity = parseInt(req.quantity, 10);
				if (!isNaN(quantity) && quantity > 0) {
					items[itemId].quantity += quantity;
				}
			});
		}
	};

	processStationLevel(targetStation.name, targetLevel.level);
	return items;
};
