export const calculateRequiredItems = (params) => {
	const { selectedStations, stations, itemsMap, builtStations } = params;

	if (!selectedStations?.length || !stations.length) return {};

	const items = {};
	const processedLevels = new Set();

	const processStationLevel = (stationName, levelNum) => {
		const station = stations.find((s) => s?.name === stationName);
		if (!station) return;

		const levelKey = `${station.id}_${levelNum}`;
		if (processedLevels.has(levelKey)) return;
		processedLevels.add(levelKey);

		const levelData = station.levels.find((l) => l.level === levelNum);
		if (!levelData) return;

		// Skip if station is already built at required level
		const builtLevel = builtStations[station.id] || 0;
		if (builtLevel >= levelNum) return;

		// Process station dependencies first
		levelData.stationLevelRequirements?.forEach((dep) => {
			const depStation = stations.find((s) => s.id === dep.station.id);
			if (!depStation) return;

			const depLevel = dep.level;
			const depBuiltLevel = builtStations[depStation.id] || 0;

			if (depBuiltLevel < depLevel) {
				// Process all levels up to required level
				for (let lvl = depBuiltLevel + 1; lvl <= depLevel; lvl++) {
					processStationLevel(depStation.name, lvl);
				}
			}
		});

		// Process item requirements
		levelData.itemRequirements?.forEach((req) => {
			if (!req?.item?.id || !req?.quantity) return;

			const itemId = req.item.id;
			const itemData = itemsMap[itemId] || {
				id: itemId,
				name: req.item.name,
				imageLink: req.item.imageLink,
				normalizedName: req.item.normalizedName,
			};

			if (!items[itemId]) {
				items[itemId] = { quantity: 0, item: itemData };
			}

			const quantity = parseInt(req.quantity, 10);
			if (!isNaN(quantity) && quantity > 0) {
				// Take the maximum quantity needed among all stations
				items[itemId].quantity = Math.max(items[itemId].quantity, quantity);
			}
		});
	};

	// Process each selected station
	selectedStations.forEach((selected) => {
		const station = stations.find((s) => s.name === selected.stationName);
		if (!station) return;

		// Process the selected level and all levels before it
		for (let level = 1; level <= selected.level; level++) {
			if (!(builtStations[station.id] >= level)) {
				processStationLevel(selected.stationName, level);
			}
		}
	});

	return items;
};
