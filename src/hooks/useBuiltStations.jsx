import { useState, useEffect } from 'react';

export const useBuiltStations = (stations) => {
    const [builtStations, setBuiltStations] = useState(() => {
        try {
            const saved = localStorage.getItem("builtStations");
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Error loading built stations from localStorage:", e);
            return {};
        }
    });

    const findStationItems = (stationId, level) => {
        const station = stations.find(s => s.id === stationId);
        if (!station) return [];

        // Obtener todos los items hasta el nivel actual
        return station.levels
            .filter(l => l.level <= level)
            .flatMap(l => l.itemRequirements || [])
            .map(req => ({
                id: req.item.id,
                quantity: req.quantity
            }));
    };

    const syncItemsWithStorage = (stationId, newLevel) => {
        try {
            // Obtener items almacenados
            const savedItems = JSON.parse(localStorage.getItem("obtainedItems") || "{}");
            
            // Obtener items de la estación
            const stationItems = findStationItems(stationId, newLevel);
            
            // Actualizar cantidades
            const updatedItems = { ...savedItems };
            
            stationItems.forEach(({ id, quantity }) => {
                if (updatedItems[id]) {
                    // Si el item existe, actualizamos la cantidad
                    const currentQuantity = updatedItems[id];
                    updatedItems[id] = Math.max(0, currentQuantity - quantity);
                    
                    // Si la cantidad llega a 0, eliminamos el item
                    if (updatedItems[id] === 0) {
                        delete updatedItems[id];
                    }
                }
            });

            // Guardar items actualizados
            localStorage.setItem("obtainedItems", JSON.stringify(updatedItems));
            
            // Disparar evento para notificar cambios
            window.dispatchEvent(new Event('itemsUpdated'));
        } catch (e) {
            console.error("Error syncing items with storage:", e);
        }
    };

    const handleStationLevelChange = (stationId, level) => {
        setBuiltStations(prev => {
            const prevLevel = prev[stationId] || 0;
            const newBuiltStations = { ...prev };
            
            if (level === 0) {
                delete newBuiltStations[stationId];
            } else {
                newBuiltStations[stationId] = level;
            }

            // Sincronizar items después de actualizar la estación
            syncItemsWithStorage(stationId, level, prevLevel);
            
            return newBuiltStations;
        });
    };

    useEffect(() => {
        localStorage.setItem("builtStations", JSON.stringify(builtStations));
    }, [builtStations]);

    return { builtStations, handleStationLevelChange };
};