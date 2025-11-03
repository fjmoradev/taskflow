// ---------------------------
// DEPENDENCIAS
// ---------------------------
const express = require('express');   // Framework para servidor
const cors = require('cors');         // Comunicación frontend-backend
const mongoose = require('mongoose'); // Conexión con MongoDB
const path = require('path');         // Manejo de rutas
require('dotenv').config();           // Variables de entorno
const Task = require('./models/Task');// Modelo de tareas

const app = express();
const PORT = process.env.PORT || 3000;

// ---------------------------
// MIDDLEWARES
// ---------------------------
app.use(cors());
app.use(express.json());

// ---------------------------
// CONEXIÓN A MONGODB ATLAS
// ---------------------------
const mongoURI =
  process.env.MONGO_URI ||
  'mongodb+srv://fjmoradev_db_user:Mariyalo9@cluster0.ruqawbh.mongodb.net/sample_mflix?retryWrites=true&w=majority';

mongoose
  .connect(mongoURI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

// ---------------------------
// RUTAS API
// ---------------------------

// GET: obtener todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: agregar nueva tarea
app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({ title: req.body.title });
    const savedTask = await newTask.save();
    res.status(201).json(savedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: actualizar tarea
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
// SERVIR FRONTEND
// ---------------------------

// Carpeta frontend al mismo nivel que backend
const frontendPath = path.join(__dirname, '../frontend');
app.use(express.static(frontendPath));

// Para cualquier ruta que no sea API, enviar index.html
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(frontendPath, 'index.html'));
});

// ---------------------------
// INICIAR SERVIDOR
// ---------------------------
app.listen(PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`)
);
