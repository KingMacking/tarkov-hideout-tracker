import { useState, useEffect } from 'react';

export const useObtainedItems = () => {
    const [obtainedItems, setObtainedItems] = useState(() => {
        try {
            const saved = localStorage.getItem("obtainedItems");
            return saved ? JSON.parse(saved) : {};
        } catch (e) {
            console.error("Error loading obtained items from localStorage:", e);
            return {};
        }
    });

    useEffect(() => {
        const handleStorageUpdate = () => {
            const saved = localStorage.getItem("obtainedItems");
            if (saved) {
                setObtainedItems(JSON.parse(saved));
            }
        };

        window.addEventListener('itemsUpdated', handleStorageUpdate);
        return () => window.removeEventListener('itemsUpdated', handleStorageUpdate);
    }, []);

    useEffect(() => {
        localStorage.setItem("obtainedItems", JSON.stringify(obtainedItems));
    }, [obtainedItems]);

    const toggleItemObtained = (itemId, quantity = 1) => {
        setObtainedItems((prev) => {
            const currentQuantity = prev[itemId] || 0;
            const newObtainedItems = { ...prev };

            if (currentQuantity + quantity <= 0) {
                delete newObtainedItems[itemId];
            } else {
                newObtainedItems[itemId] = currentQuantity + quantity;
            }

            return newObtainedItems;
        });
    };

    return { obtainedItems, toggleItemObtained };
};
