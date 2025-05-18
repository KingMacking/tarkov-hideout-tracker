export const getRequiredStations = (stations, selectedStations) => {
	const requiredStations = new Map();

	// Helper function to process a single station's requirements
	const processStationRequirements = (stationName, levelValue) => {
		const station = stations.find((s) => s.name === stationName);
		if (!station) return;

		const level = station.levels.find((l) => l.level === levelValue);
		if (!level) return;

		// Add station level requirements
		level.stationLevelRequirements?.forEach((requirement) => {
			const requiredStation = stations.find((s) => s.id === requirement.station.id);
			if (!requiredStation) return;

			// Process each level up to the required level
			for (let i = 1; i <= requirement.level; i++) {
				const key = `${requirement.station.id}-${i}`;
				if (!requiredStations.has(key)) {
					requiredStations.set(key, {
						station: requiredStation.name,
						level: i,
						imageLink: requiredStation.imageLink,
						id: requirement.station.id,
					});
				}
			}

			// Process dependencies recursively
			const reqLevel = requiredStation.levels.find((l) => l.level === requirement.level);
			if (reqLevel?.stationLevelRequirements) {
				reqLevel.stationLevelRequirements.forEach((subReq) => {
					processStationRequirements(
						stations.find((s) => s.id === subReq.station.id)?.name,
						subReq.level
					);
				});
			}
		});
	};

	// Process each selected station
	selectedStations.forEach((selected) => {
		// Process all levels up to the selected level
		for (let level = 1; level <= selected.level; level++) {
			processStationRequirements(selected.stationName, level);
		}
	});

	return Array.from(requiredStations.values());
};
