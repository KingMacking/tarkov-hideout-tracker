import { useState, useEffect, useCallback } from 'react';

export const useSortedItems = (items, obtainedItems) => {
    const [sortBy, setSortBy] = useState("default");
    const [sortedItems, setSortedItems] = useState([]);
    const [updateTimeout, setUpdateTimeout] = useState(null);

    const sortItems = useCallback((items, tempObtainedItems = obtainedItems) => {
        const itemsArray = Object.entries(items);
        switch (sortBy) {
            case "name":
                return itemsArray.sort((a, b) => 
                    a[1].item.name.localeCompare(b[1].item.name)
                );
            case "remaining":
                return itemsArray.sort((a, b) => {
                    const aObtained = tempObtainedItems[a[0]] || 0;
                    const bObtained = tempObtainedItems[b[0]] || 0;

                    const aPercentage = (aObtained / a[1].quantity) * 100;
                    const bPercentage = (bObtained / b[1].quantity) * 100;

                    if (aPercentage !== bPercentage) {
                        return aPercentage - bPercentage;
                    }

                    return b[1].quantity - a[1].quantity;
                });
            default:
                return itemsArray;
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortBy]);

    const handleItemUpdate = (itemId, newObtained) => {
        if (sortBy === "remaining") {
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }

            const updatedObtainedItems = {
                ...obtainedItems,
                [itemId]: newObtained,
            };

            const timeoutId = setTimeout(() => {
                setSortedItems(sortItems(items, updatedObtainedItems));
            }, 2000);

            setUpdateTimeout(timeoutId);
        }
    };

    useEffect(() => {
        setSortedItems(sortItems(items));
    }, [items, sortBy, sortItems]);

    useEffect(() => {
        return () => {
            if (updateTimeout) {
                clearTimeout(updateTimeout);
            }
        };
    }, [updateTimeout]);

    return {
        sortedItems,
        sortBy,
        setSortBy,
        handleItemUpdate
    };
};