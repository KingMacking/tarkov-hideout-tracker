import React, { useState, useMemo } from "react";
import Select from "react-select";

const StationsList = ({ stations, builtStations, onStationLevelChange }) => {
	const [isOpen, setIsOpen] = useState(false);
	const [searchFilter, setSearchFilter] = useState("");
	const [sortBy, setSortBy] = useState("alphabetical");

	const getLevelOptions = (maxLevel) => {
		return Array.from({ length: maxLevel }, (_, i) => ({
			value: i + 1,
			label: `Level ${i + 1}`,
		}));
	};

	const totalBuilt = Object.values(builtStations).filter((level) => level > 0).length;

	// Filtrar y ordenar estaciones
	const filteredAndSortedStations = useMemo(() => {
		let filtered = stations.filter((station) =>
			station.name.toLowerCase().includes(searchFilter.toLowerCase())
		);

		// Ordenar según el criterio seleccionado
		switch (sortBy) {
			case "highest-level":
				return filtered.sort((a, b) => {
					const levelA = builtStations[a.id] || 0;
					const levelB = builtStations[b.id] || 0;
					return levelB - levelA;
				});
			case "lowest-level":
				return filtered.sort((a, b) => {
					const levelA = builtStations[a.id] || 0;
					const levelB = builtStations[b.id] || 0;
					return levelA - levelB;
				});
			case "alphabetical":
			default:
				return filtered.sort((a, b) => a.name.localeCompare(b.name));
		}
	}, [stations, searchFilter, sortBy, builtStations]);

	const sortOptions = [
		{ value: "alphabetical", label: "Alphabetical" },
		{ value: "highest-level", label: "Highest Level" },
		{ value: "lowest-level", label: "Lowest Level" },
	];

	const customSelectStyles = {
		control: (styles) => ({
			...styles,
			backgroundColor: "var(--select-bg)",
			borderColor: "var(--select-border)",
		}),
		option: (styles, { isFocused }) => ({
			...styles,
			backgroundColor: isFocused ? "var(--select-hover)" : "var(--select-bg)",
			color: "var(--select-text)",
		}),
		singleValue: (styles) => ({
			...styles,
			color: "var(--select-text)",
		}),
		menu: (styles) => ({
			...styles,
			backgroundColor: "var(--select-bg)",
		}),
	};

	return (
		<details
			className='bg-white rounded-lg dark:bg-gray-800'
			open={isOpen}
			onToggle={(e) => setIsOpen(e.target.open)}
		>
			<summary className='flex items-center justify-between p-2 border-b border-gray-200 cursor-pointer dark:border-gray-700'>
				<h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
					Built Stations ({totalBuilt}/{stations.length})
				</h2>
				<span className='text-sm text-gray-500 dark:text-gray-400'>
					{isOpen ? "Click to close" : "Click to configure"}
				</span>
			</summary>

			<div className='p-4'>
				{/* Filtros */}
				<div className='flex flex-col gap-4 mb-6 sm:flex-row sm:items-center sm:justify-between'>
					<div className='flex-1 max-w-md'>
						<input
							type='text'
							placeholder='Search stations...'
							value={searchFilter}
							onChange={(e) => setSearchFilter(e.target.value)}
							className='w-full px-3 py-2 text-gray-800 bg-white border border-gray-300 rounded-lg dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500'
						/>
					</div>
					<div className='min-w-[200px]'>
						<Select
							options={sortOptions}
							value={sortOptions.find((option) => option.value === sortBy)}
							onChange={(selected) => setSortBy(selected.value)}
							placeholder='Sort by...'
							className='w-full'
							classNamePrefix='select'
							styles={customSelectStyles}
						/>
					</div>
				</div>

				{/* Grid de estaciones */}
				<div className='grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3'>
					{filteredAndSortedStations.map((station) => {
						const maxLevel = station.levels?.length || 0;
						return (
							<div
								key={station.id}
								className='flex items-center gap-2 p-3 rounded-lg bg-gray-50 dark:bg-gray-700'
							>
								<div className='flex-1'>
									<label className='block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300'>
										{station.name}:
									</label>
									<Select
										options={[
											{ value: 0, label: "Not Built" },
											...getLevelOptions(maxLevel),
										]}
										value={
											builtStations[station.id]
												? {
														value: builtStations[station.id],
														label: `Level ${builtStations[station.id]}`,
												  }
												: { value: 0, label: "Not Built" }
										}
										onChange={(selected) =>
											onStationLevelChange(station.id, selected.value)
										}
										className='w-full'
										classNamePrefix='select'
										styles={customSelectStyles}
									/>
								</div>
							</div>
						);
					})}
				</div>

				{/* Mensaje cuando no hay resultados */}
				{filteredAndSortedStations.length === 0 && (
					<p className='py-8 text-center text-gray-500 dark:text-gray-400'>
						No stations found matching "{searchFilter}"
					</p>
				)}
			</div>
		</details>
	);
};

export default StationsList;
