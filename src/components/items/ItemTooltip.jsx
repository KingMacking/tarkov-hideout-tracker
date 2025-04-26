import React from 'react';

const ItemTooltip = ({ stations, itemId, selectedStation, selectedLevel, builtStations, isGrid }) => {
    const isStationBuilt = (stationId, requiredLevel) => {
        const builtLevel = builtStations[stationId] || 0;
        return builtLevel >= requiredLevel;
    };

    const getItemRequirements = () => {
        if (!selectedStation || !selectedLevel) return [];

        const station = stations.find(s => s.name === selectedStation.value);
        if (!station) return [];

        const allRequirements = new Map(); // Usar Map para manejar duplicados
        
        const level = station.levels.find(l => l.level === selectedLevel.value);
        if (!level) return [];

        // Función helper para agregar requerimientos
        const addRequirement = (stationName, stationId, level, quantity) => {
            const key = `${stationId}-${level}`;
            if (!allRequirements.has(key)) {
                allRequirements.set(key, {
                    stationName,
                    level,
                    quantity,
                    stationId
                });
            }
        };

        // Agregar requerimientos del nivel actual
        if (!isStationBuilt(station.id, level.level)) {
            const currentLevelReq = level.itemRequirements?.find(req => req.item.id === itemId);
            if (currentLevelReq) {
                addRequirement(
                    station.name,
                    station.id,
                    level.level,
                    currentLevelReq.quantity
                );
            }
        }

        // Procesar estaciones dependientes
        const processStationRequirements = (stationReq) => {
            if (isStationBuilt(stationReq.station.id, stationReq.level)) return;

            const requiredStation = stations.find(s => s.id === stationReq.station.id);
            if (!requiredStation) return;

            // Procesar cada nivel hasta el requerido
            for (let i = 1; i <= stationReq.level; i++) {
                if (isStationBuilt(stationReq.station.id, i)) continue;

                const reqLevel = requiredStation.levels.find(l => l.level === i);
                if (!reqLevel) continue;

                // Buscar el item en los requerimientos del nivel
                const itemReq = reqLevel.itemRequirements?.find(req => req.item.id === itemId);
                if (itemReq) {
                    addRequirement(
                        requiredStation.name,
                        requiredStation.id,
                        i,
                        itemReq.quantity
                    );
                }

                // Procesar recursivamente las dependencias de esta estación
                reqLevel.stationLevelRequirements?.forEach(processStationRequirements);
            }
        };

        // Procesar las dependencias iniciales
        level.stationLevelRequirements?.forEach(processStationRequirements);

        // Convertir el Map a array y ordenar
        return Array.from(allRequirements.values())
            .sort((a, b) => b.quantity - a.quantity);
    };

    const requirements = getItemRequirements();

    if (requirements.length === 0) return null;

    return (
        <div className={`
            absolute z-20 p-2 text-xs transform bg-gray-500 rounded-lg shadow-lg min-w-30 dark:bg-gray-800
            ${isGrid 
                ? '-translate-y-full left-[50%] top-0 -translate-x-[50%]' 
                : '-translate-y-1/2 -translate-x-full -left-3 top-1/2'
            }
        `}>
            <div className="text-white">
                {requirements.map((req) => (
                    <div 
                        key={`${req.stationId}-${req.level}`} 
                        className="flex items-center gap-1 py-1 whitespace-nowrap"
                    >
                        <span className="font-medium">{req.quantity}x</span>
                        <span className="text-gray-400">for</span>
                        <span className="font-medium truncate">{req.stationName}</span>
                        <span className="text-gray-400 shrink-0">Lv. {req.level}</span>
                    </div>
                ))}
            </div>
            <div className={`
                absolute w-3 h-3 transform rotate-45 bg-gray-500 dark:bg-gray-800
                ${isGrid 
                    ? '-bottom-1.5 -translate-x-1/2 left-1/2' 
                    : 'top-1/2 -right-1.5 -translate-y-1/2'
                }
            `} />
        </div>
    );
};

export default ItemTooltip;