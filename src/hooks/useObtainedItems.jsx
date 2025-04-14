import { useState, useEffect } from "react";

export const useObtainedItems = () => {
	const [obtainedItems, setObtainedItems] = useState(() => {
		const saved = localStorage.getItem("obtainedItems");
		return saved ? JSON.parse(saved) : {};
	});

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
