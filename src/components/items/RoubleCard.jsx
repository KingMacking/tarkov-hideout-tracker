import React from "react";

const RoubleCard = ({ item, quantity }) => {
	return (
		<div className='p-2 mb-4 rounded-lg bg-gray-50 dark:bg-gray-700'>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-4'>
					{item.imageLink && (
						<img
							src={item.imageLink}
							alt={item.name}
							className='object-cover w-[60px] h-[60px] rounded'
						/>
					)}
					<div>
						<h3 className='text-lg font-medium text-gray-800 dark:text-gray-200'>
							Required Roubles
						</h3>
						<p className='text-2xl font-bold text-gray-900 dark:text-gray-100'>
							₽{quantity.toLocaleString()}
						</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default RoubleCard;
