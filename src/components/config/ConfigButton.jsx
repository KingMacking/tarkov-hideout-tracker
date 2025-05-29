import React from "react";
import { Settings } from "lucide-react";

const ConfigButton = ({ onClick }) => (
	<button
		onClick={onClick}
		className='fixed p-2 transition-colors bg-gray-200 rounded-lg top-4 right-16 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600'
		aria-label='Configuración'
	>
		<Settings className='w-6 h-6 text-gray-800 dark:text-gray-200' />
	</button>
);

export default ConfigButton;
