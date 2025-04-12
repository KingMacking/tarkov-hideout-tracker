import React from "react";

const ItemList = ({ items }) => {
	if (!items || Object.keys(items).length === 0) {
		return <p className='text-gray-500 italic'>No items required.</p>;
	}

	return (
		<div>
			<ul className='space-y-3'>
				{Object.entries(items).map(([itemId, { quantity, item }]) => (
					<li
						key={itemId}
						className='flex items-center p-3 bg-gray-50 rounded-lg shadow-sm'
					>
						{/* Imagen del ítem */}
						{item.imageLink && (
							<img
								src={item.imageLink}
								alt={item.name}
								className='w-12 h-12 object-contain mr-4 rounded'
							/>
						)}
						{/* Nombre y cantidad */}
						<div className='flex-1 flex justify-between items-center'>
							<span className='text-gray-700'>{item.name}</span>
							<span className='text-gray-900 font-medium'>x{quantity}</span>
						</div>
					</li>
				))}
			</ul>
		</div>
	);
};

export default ItemList;
