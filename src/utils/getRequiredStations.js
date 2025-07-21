export const getRequiredStations = (stations, selectedStations) => {
	const requiredStations = new Map();

	const processStationRequirements = (stationName, levelValue) => {
		const station = stations.find((s) => s.name === stationName);
		if (!station) return;

		const level = station.levels.find((l) => l.level === levelValue);
		if (!level) return;

		level.stationLevelRequirements?.forEach((requirement) => {
			const requiredStation = stations.find((s) => s.id === requirement.station.id);
			if (!requiredStation) return;

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

			// 🔄 Procesar dependencias recursivamente
			processStationRequirements(requiredStation.name, requirement.level);
		});
	};

	selectedStations.forEach((selected) => {
		for (let level = 1; level <= selected.level; level++) {
			processStationRequirements(selected.stationName, level);
		}
	});

	return Array.from(requiredStations.values());
};
