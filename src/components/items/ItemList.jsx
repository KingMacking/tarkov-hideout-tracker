import { useSortedItems } from "../../hooks/useSortedItems";
import RoubleCard from "./RoubleCard";
import ItemTooltip from "./ItemTooltip";
import { useAppConfig } from "../../hooks/useAppConfig";

const ItemList = ({
	items,
	stations,
	selectedStations,
	builtStations,
	obtainedItems,
	toggleItemObtained,
}) => {
	const { sortedItems, sortBy, setSortBy, handleItemUpdate } = useSortedItems(
		items,
		obtainedItems
	);

	const { config, updateConfig } = useAppConfig();
	const viewMode = config.viewMode || "list";

	const handleToggleItem = (itemId, amount) => {
		const currentObtained = obtainedItems[itemId] || 0;
		const newObtained = currentObtained + amount;

		toggleItemObtained(itemId, amount);
		handleItemUpdate(itemId, newObtained);
	};

	const renderQuantityControls = (itemId, totalRequired, inGrid = false) => {
		const obtained = obtainedItems[itemId] || 0;
		const progress = (obtained / totalRequired) * 100;

		if (inGrid) {
			return (
				<div className='flex flex-col w-full'>
					<div className='w-full h-2 overflow-hidden rounded-lg bg-gray-200/30'>
						<div
							className='h-2 transition-all bg-blue-600'
							style={{ width: `${progress}%` }}
						/>
					</div>
					<div className='flex items-center justify-between w-full px-2 mt-auto'>
						<button
							onClick={() => handleToggleItem(itemId, -1)}
							className='p-1 text-white transition-colors hover:text-gray-200'
							disabled={obtained <= 0}
						>
							<svg
								className='w-4 h-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M20 12H4'
								/>
							</svg>
						</button>
						<span className='text-sm font-medium text-white'>
							{obtained}/{totalRequired}
						</span>
						<button
							onClick={() => handleToggleItem(itemId, 1)}
							className='p-1 text-white transition-colors hover:text-gray-200'
							disabled={obtained >= totalRequired}
						>
							<svg
								className='w-4 h-4'
								fill='none'
								viewBox='0 0 24 24'
								stroke='currentColor'
							>
								<path
									strokeLinecap='round'
									strokeLinejoin='round'
									strokeWidth={2}
									d='M12 4v16m8-8H4'
								/>
							</svg>
						</button>
					</div>
				</div>
			);
		}

		return (
			<div
				className={`flex items-center ${
					inGrid ? "gap-1 w-full justify-between px-2" : "gap-2"
				}`}
			>
				<button
					onClick={() => handleToggleItem(itemId, -1)}
					disabled={obtained <= 0}
					className='text-gray-600 dark:text-gray-200'
				>
					<svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M20 12H4'
						/>
					</svg>
				</button>
				<div className='flex flex-col items-center min-w-[60px]'>
					<div
						className={
							inGrid
								? "text-xs text-white"
								: "text-sm text-gray-600 dark:text-gray-400"
						}
					>
						{obtained}/{totalRequired}
					</div>
					<div className='w-full h-1.5 rounded-full bg-gray-200/30'>
						<div
							className='h-1.5 transition-all bg-blue-600 rounded-full'
							style={{ width: `${progress}%`, maxWidth: "100%" }}
						/>
					</div>
				</div>
				<button
					onClick={() => handleToggleItem(itemId, 1)}
					disabled={obtained >= totalRequired}
					className='text-gray-600 dark:text-gray-200'
				>
					<svg className='w-4 h-4' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
						<path
							strokeLinecap='round'
							strokeLinejoin='round'
							strokeWidth={2}
							d='M12 4v16m8-8H4'
						/>
					</svg>
				</button>
			</div>
		);
	};

	const isRoubles = (itemId) => itemId === "5449016a4bdc2d6f028b456f";

	const renderRoubleCard = () => {
		const roubleItem = Object.entries(items).find(([id]) => isRoubles(id));

		if (!roubleItem) return null;

		// eslint-disable-next-line no-unused-vars
		const [itemId, { quantity, item }] = roubleItem;

		return <RoubleCard item={item} quantity={quantity} />;
	};

	if (!items || Object.keys(items).length === 0) {
		return <p className='italic text-gray-500 dark:text-gray-400'>No items required.</p>;
	}

	const toggleView = () => {
		updateConfig({ viewMode: viewMode === "list" ? "grid" : "list" });
	};

	return (
		<div className='space-y-4'>
			<div className='flex items-center justify-between gap-4'>
				<h2 className='text-xl font-semibold text-gray-800 dark:text-gray-200'>
					Required Items:
				</h2>
				<select
					value={sortBy}
					onChange={(e) => setSortBy(e.target.value)}
					className='px-2 py-1 ml-auto text-sm bg-gray-200 rounded-md dark:bg-gray-700 dark:text-gray-300'
				>
					<option value='default'>Default</option>
					<option value='name'>Name A-Z</option>
					<option value='remaining'>Most needed</option>
				</select>
				<button
					onClick={toggleView}
					className='flex items-center gap-2 px-3 py-1 text-sm bg-gray-200 rounded-md dark:bg-gray-700 hover:bg-gray-300 dark:text-gray-300 dark:hover:bg-gray-600'
				>
					{viewMode === "list" ? (
						<>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='w-4 h-4'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path d='M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM13 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2h-2zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM13 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2h-2z' />
							</svg>
							Grid View
						</>
					) : (
						<>
							<svg
								xmlns='http://www.w3.org/2000/svg'
								className='w-4 h-4'
								viewBox='0 0 20 20'
								fill='currentColor'
							>
								<path
									fillRule='evenodd'
									d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
									clipRule='evenodd'
								/>
							</svg>
							List View
						</>
					)}
				</button>
			</div>

			{renderRoubleCard()}

			{viewMode === "list" ? (
				<ul className='space-y-3'>
					{sortedItems
						.filter(([id]) => !isRoubles(id))
						.map(([itemId, { quantity, item }]) => (
							<li
								key={itemId}
								className='relative flex items-center p-2 rounded-lg shadow-sm group bg-gray-50 dark:bg-gray-700'
							>
								<div className='absolute transition-opacity duration-200 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'>
									<ItemTooltip
										stations={stations}
										itemId={itemId}
										selectedStations={selectedStations}
										builtStations={builtStations}
										isGrid={false}
									/>
								</div>
								{item.imageLink && (
									<img
										src={item.imageLink}
										alt={item.name}
										className='object-cover w-12 h-12 mr-4 rounded'
									/>
								)}
								<div className='flex items-center justify-between flex-1'>
									<span className='text-gray-700 dark:text-gray-200'>
										{item.name}
									</span>
									{renderQuantityControls(itemId, quantity, false)}
								</div>
							</li>
						))}
				</ul>
			) : (
				<div className='grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
					{sortedItems
						.filter(([id]) => !isRoubles(id))
						.map(([itemId, { quantity, item }]) => (
							<div key={itemId} className='relative group'>
								<div className='transition-opacity duration-200 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto'>
									<ItemTooltip
										stations={stations}
										itemId={itemId}
										selectedStations={selectedStations}
										builtStations={builtStations}
										isGrid={true}
									/>
								</div>
								<div className='relative mb-2 overflow-hidden rounded-lg aspect-square bg-gray-50 dark:bg-gray-700'>
									{item.imageLink && (
										<img
											src={item.imageLink}
											alt={item.name}
											className='absolute inset-0 object-cover w-full h-full'
										/>
									)}
									<div className='absolute inset-0 flex flex-col transition-opacity duration-200 opacity-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent group-hover:opacity-100'>
										<span className='flex items-center justify-center flex-1 px-2 text-sm font-bold text-center text-white'>
											{item.name}
										</span>
									</div>
								</div>
								{renderQuantityControls(itemId, quantity, true)}
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default ItemList;
