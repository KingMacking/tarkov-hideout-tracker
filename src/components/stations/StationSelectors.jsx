import React, { useMemo, useEffect } from "react";
import Select from "react-select";

export const StationSelectors = ({
	stations,
	selectedStations,
	setSelectedStations,
	builtStations,
}) => {
	// Leer estaciones seleccionadas de localStorage al montar
	useEffect(() => {
		const saved = localStorage.getItem("selectedStations");
		if (saved) {
			try {
				const parsed = JSON.parse(saved);
				if (Array.isArray(parsed) && parsed.length > 0) {
					setSelectedStations(parsed);
				}
			} catch (e) {
				console.log(e);
			}
		}
		// Solo en el primer render
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Guardar estaciones seleccionadas en localStorage cada vez que cambian
	useEffect(() => {
		localStorage.setItem("selectedStations", JSON.stringify(selectedStations));
	}, [selectedStations]);

	const stationOptions = useMemo(() => {
		const options = [];
		stations.forEach((station) => {
			station.levels.forEach((level) => {
				options.push({
					value: `${station.name}-${level.level}`,
					label: `${station.name} Lv.${level.level}`,
					stationName: station.name,
					level: level.level,
					imageLink: station.imageLink,
				});
			});
		});
		return options;
	}, [stations]);

	// Filter out selected options
	const availableOptions = useMemo(() => {
		return stationOptions.filter((option) => {
			// Check if option is already selected
			const isSelected = selectedStations.some((selected) => selected.value === option.value);

			// Find the station and check if it's built
			const station = stations.find((s) => s.name === option.stationName);
			const isBuilt = station && builtStations[station.id] >= option.level;

			return !isSelected && !isBuilt;
		});
	}, [stationOptions, selectedStations, builtStations, stations]);

	const handleStationSelect = (selected) => {
		if (!selected) return;

		setSelectedStations((prev) => [
			...prev,
			{
				value: selected.value,
				label: selected.label,
				stationName: selected.stationName,
				level: selected.level,
				imageLink: selected.imageLink,
			},
		]);
	};

	const handleRemoveStation = (stationToRemove) => {
		setSelectedStations((prev) =>
			prev.filter((station) => station.value !== stationToRemove.value)
		);
	};

	const selectStyles = {
		control: (baseStyles, state) => ({
			...baseStyles,
			backgroundColor: "var(--select-bg)",
			borderColor: state.isFocused ? "#4a90e2" : "var(--select-border)",
			"&:hover": {
				borderColor: "#4a90e2",
			},
		}),
		menu: (baseStyles) => ({
			...baseStyles,
			backgroundColor: "var(--select-bg)",
			zIndex: "15",
		}),
		option: (baseStyles, { isFocused, isSelected }) => ({
			...baseStyles,
			backgroundColor: isSelected
				? "#4a90e2"
				: isFocused
				? "var(--select-hover)"
				: "var(--select-bg)",
			color: isSelected ? "white" : "var(--select-text)",
			"&:hover": {
				backgroundColor: "var(--select-hover)",
			},
		}),
		singleValue: (baseStyles) => ({
			...baseStyles,
			color: "var(--select-text)",
		}),
		input: (baseStyles) => ({
			...baseStyles,
			color: "var(--select-text)",
		}),
		placeholder: (baseStyles) => ({
			...baseStyles,
			color: "var(--select-placeholder)",
		}),
	};

	return (
		<div className='space-y-4'>
			<div>
				<label className='block mb-1 text-sm font-medium text-gray-700 dark:text-gray-300'>
					Select Stations:
				</label>
				<Select
					options={availableOptions}
					onChange={handleStationSelect}
					placeholder='Choose stations and levels'
					value={null}
					className='w-full'
					classNamePrefix='select'
					styles={selectStyles}
				/>
			</div>

			{/* Selected Stations List */}
			{selectedStations.length > 0 && (
				<div className='mt-4 space-y-2'>
					<h3 className='text-sm font-medium text-gray-700 dark:text-gray-300'>
						Selected Stations:
					</h3>
					<div className='grid grid-cols-2 gap-2 sm:grid-cols-3'>
						{selectedStations.map((station) => (
							<div
								key={station.value}
								className='flex items-center justify-between p-2 bg-gray-100 rounded-lg dark:bg-gray-700'
							>
								<div className='flex items-center space-x-2'>
									{station.imageLink && (
										<img
											src={station.imageLink}
											alt={station.stationName}
											className='w-8 h-8 rounded'
										/>
									)}
									<span className='text-sm text-gray-700 dark:text-gray-300'>
										{station.label}
									</span>
								</div>
								<button
									onClick={() => handleRemoveStation(station)}
									className='p-1 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400'
								>
									<svg
										className='w-4 h-4'
										fill='none'
										stroke='currentColor'
										viewBox='0 0 24 24'
									>
										<path
											strokeLinecap='round'
											strokeLinejoin='round'
											strokeWidth='2'
											d='M6 18L18 6M6 6l12 12'
										/>
									</svg>
								</button>
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
