import { useState, useEffect } from 'react';

export const useHideoutData = (hideoutData) => {
    const [stations, setStations] = useState([]);
    const [itemsMap, setItemsMap] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadData = () => {
            setIsLoading(true);
            setError(null);
            try {
                // Cargar estaciones
                if (hideoutData?.hideoutStations && Array.isArray(hideoutData.hideoutStations)) {
                    setStations(hideoutData.hideoutStations);
                } else if (Array.isArray(hideoutData)) {
                    setStations(hideoutData);
                } else {
                    console.error("El archivo JSON no contiene un array válido de estaciones:", hideoutData);
                    setStations([]);
                    setError("El archivo de datos no tiene el formato esperado.");
                    return;
                }

                // Cargar ítems
                if (hideoutData?.items && Array.isArray(hideoutData.items)) {
                    const map = hideoutData.items.reduce((acc, item) => {
                        acc[item.id] = item;
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
    }, [hideoutData]);

    return { stations, itemsMap, isLoading, error };
};