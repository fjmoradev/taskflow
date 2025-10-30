const mongoose = require('mongoose');

// Creamos un "esquema" que define cómo será una tarea
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },  // Nombre de la tarea
  completed: { type: Boolean, default: false } // Si está completada
}, { timestamps: true }); // Añade fechas de creación y actualización automáticamente

// Creamos un modelo de MongoDB llamado "Task" usando este esquema
module.exports = mongoose.model('Task', taskSchema);
