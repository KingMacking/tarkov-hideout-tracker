import fs from 'fs';

// Cargar el JSON desde el archivo
const data = JSON.parse(fs.readFileSync('taskData.json', 'utf8'));
console.log(data);


// Filtrar las tasks que tengan al menos un objective con type "giveItem"
const filteredTasks = data.tasks.filter(task =>
  Array.isArray(task.objectives) &&
  task.objectives.some(obj => obj.type === 'giveItem')
);

// Mostrar el resultado
console.log(filteredTasks);
fs.writeFileSync('filteredTasks.json', JSON.stringify({ tasks: filteredTasks }, null, 2), 'utf8');
console.log(`Archivo filteredTasks.json creado con ${filteredTasks.length} tasks filtradas.`);