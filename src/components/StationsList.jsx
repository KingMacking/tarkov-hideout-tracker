import React, { useState } from "react";
import Select from "react-select";

const StationsList = ({ stations, builtStations, onStationLevelChange }) => {
	const [isOpen, setIsOpen] = useState(false);

	const getLevelOptions = (maxLevel) => {
		return Array.from({ length: maxLevel }, (_, i) => ({
			value: i + 1,
			label: `Level ${i + 1}`,
		}));
	};

	const totalBuilt = Object.values(builtStations).filter((level) => level > 0).length;

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
			className='bg-white dark:bg-gray-800 rounded-lg'
			open={isOpen}
			onToggle={(e) => setIsOpen(e.target.open)}
		>
			<summary className='cursor-pointer p-4 flex justify-between items-center border-b border-gray-200 dark:border-gray-700'>
				<h2 className='text-xl font-semibold text-gray-800 dark:text-gray-100'>
					Built Stations ({totalBuilt}/{stations.length})
				</h2>
				<span className='text-sm text-gray-500 dark:text-gray-400'>
					{isOpen ? "Click to close" : "Click to configure"}
				</span>
			</summary>

			<div className='p-4'>
				<div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
					{stations.map((station) => {
						const maxLevel = station.levels?.length || 0;
						return (
							<div
								key={station.id}
								className='flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg'
							>
								<div className='flex-1'>
									<label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
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
			</div>
		</details>
	);
};

export default StationsList;
