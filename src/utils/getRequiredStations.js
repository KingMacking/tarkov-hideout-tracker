export const getRequiredStations = (stations, selectedStation, selectedLevel) => {
    const station = stations.find(s => s.name === selectedStation.value);
    if (!station) return [];
    
    const level = station.levels.find(l => l.level === selectedLevel.value);
    if (!level) return [];
    
    return level.stationLevelRequirements?.map(requirement => {
        const requiredStation = stations.find(
            s => s.id === requirement.station.id
        );
        return requiredStation ? {
            station: requiredStation.name,
            level: requirement.level,
            imageLink: requiredStation.imageLink,
            id: requirement.station.id
        } : null;
    }).filter(Boolean) || [];
};