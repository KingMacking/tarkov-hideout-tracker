import { useState, useEffect } from 'react';

export const useBuiltStations = () => {
    const initialBuiltStations = (() => {
        try {
            const saved = localStorage.getItem("builtStations");
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Error loading built stations from localStorage:", e);
            return {};
        }
    })();

    const [builtStations, setBuiltStations] = useState(initialBuiltStations);

    useEffect(() => {
        localStorage.setItem("builtStations", JSON.stringify(builtStations));
    }, [builtStations]);

    const handleStationLevelChange = (stationId, level) => {
        setBuiltStations((prev) => {
            const newBuiltStations = { ...prev };
            if (level === 0) {
                delete newBuiltStations[stationId];
            } else {
                newBuiltStations[stationId] = level;
            }
            return newBuiltStations;
        });
    };

    return { builtStations, handleStationLevelChange };
};