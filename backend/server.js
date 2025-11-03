// ---------------------------
// DEPENDENCIAS
// ---------------------------
const express = require('express');   // Framework para servidor
const cors = require('cors');         // Permite comunicación frontend-backend
const mongoose = require('mongoose'); // Conexión con MongoDB
require('dotenv').config();           // Variables de entorno
const Task = require('./models/Task');// Modelo de tareas

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------
// MIDDLEWARES
// ---------------------------
app.use(cors());            // Permite comunicación desde frontend
app.use(express.json());    // Permite recibir datos JSON del frontend

// ---------------------------
// CONEXIÓN A MONGODB ATLAS
// ---------------------------

// Usa la variable de entorno MONGO_URI si existe (Render), o la de respaldo local
const mongoURI =
  process.env.MONGO_URI ||
  'mongodb+srv://fjmoradev_db_user:Mariyalo9%2E@cluster0.ruqawbh.mongodb.net/sample_mflix?retryWrites=true&w=majority';

mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ---------------------------
// RUTAS
// ---------------------------

// GET: obtener todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find(); // Buscar todas las tareas
    res.json(tasks);                 // Devolver en JSON
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: agregar nueva tarea
app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({ title: req.body.title });
    const savedTask = await newTask.save();   // 👈 ESTA LÍNEA CORRECTA
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: actualizar tarea (marcar completada)
app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { title: req.body.title, completed: req.body.completed },
      { new: true }
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: eliminar tarea
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ---------------------------
// INICIAR SERVIDOR
// ---------------------------
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
