import React from 'react';
import Select from 'react-select';

export const StationSelectors = ({ 
    stations, 
    selectedStation, 
    selectedLevel, 
    setSelectedStation, 
    setSelectedLevel 
}) => {
    const stationOptions = stations.length > 0
        ? [...new Set(stations.map(station => station?.name).filter(Boolean))]
            .map(name => ({
                value: name,
                label: name,
            }))
        : [];

    const levelOptions = selectedStation && stations.length > 0
        ? stations
            .filter(station => station?.name === selectedStation.value)
            .flatMap(station => station?.levels || [])
            .map(level => ({
                value: level?.level,
                label: `Level ${level?.level}`,
            }))
            .filter(option => option.value !== undefined)
        : [];

    const selectStyles = {
        control: (baseStyles, state) => ({
            ...baseStyles,
            backgroundColor: 'var(--select-bg)',
            borderColor: state.isFocused ? '#4a90e2' : 'var(--select-border)',
            '&:hover': {
                borderColor: '#4a90e2'
            }
        }),
        menu: (baseStyles) => ({
            ...baseStyles,
            backgroundColor: 'var(--select-bg)',
        }),
        option: (baseStyles, { isFocused, isSelected }) => ({
            ...baseStyles,
            backgroundColor: isSelected 
                ? '#4a90e2' 
                : isFocused 
                    ? 'var(--select-hover)' 
                    : 'var(--select-bg)',
            color: isSelected 
                ? 'white' 
                : 'var(--select-text)',
            '&:hover': {
                backgroundColor: 'var(--select-hover)'
            }
        }),
        singleValue: (baseStyles) => ({
            ...baseStyles,
            color: 'var(--select-text)'
        }),
        input: (baseStyles) => ({
            ...baseStyles,
            color: 'var(--select-text)'
        }),
        placeholder: (baseStyles) => ({
            ...baseStyles,
            color: 'var(--select-placeholder)'
        })
    };

    return (
        <div className='space-y-4'>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Select Station:
                </label>
                <Select
                    options={stationOptions}
                    value={selectedStation}
                    onChange={setSelectedStation}
                    placeholder='Choose a station'
                    isDisabled={stationOptions.length === 0}
                    className='w-full'
                    classNamePrefix='select'
                    styles={selectStyles}
                />
            </div>
            <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'>
                    Select Level:
                </label>
                <Select
                    options={levelOptions}
                    value={selectedLevel}
                    onChange={setSelectedLevel}
                    placeholder='Choose a level'
                    isDisabled={!selectedStation || levelOptions.length === 0}
                    className='w-full'
                    classNamePrefix='select'
                    styles={selectStyles}
                />
            </div>
        </div>
    );
};