const express = require('express');   // Framework para servidor
const mongoose = require('mongoose'); // Conectar con MongoDB
const cors = require('cors');         // Permite comunicación frontend-backend
const Task = require('./models/Task'); // Nuestro modelo de tareas
const app = express();
const PORT = 3000;

// Middleware: funciones que procesan todas las peticiones
app.use(cors());            // Permite comunicación desde frontend
app.use(express.json());    // Permite recibir datos JSON del frontend

// Conectar con MongoDB local
mongoose.connect(mongodb+srv:fjmoradev_db_user:<db_password>@cluster0.ruqawbh.mongodb.net/?appName=Cluster0, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB conectado'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// ----------------- RUTAS -------------------

// GET: obtener todas las tareas
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await Task.find(); // Buscar todas las tareas en MongoDB
    res.json(tasks);                 // Devolverlas en JSON
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST: agregar nueva tarea
app.post('/tasks', async (req, res) => {
  try {
    const newTask = new Task({ title: req.body.title }); // Crear tarea
    const savedTask = await newTask.save();             // Guardar en MongoDB
    res.status(201).json(savedTask);                   // Devolver tarea creada
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: actualizar tarea (marcar completada)
app.put('/tasks/:id', async (req, res) => {
  try {
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,                   // Buscar por id
      { title: req.body.title, completed: req.body.completed }, // Actualizar campos
      { new: true }                     // Devuelve la tarea actualizada
    );
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE: eliminar tarea
app.delete('/tasks/:id', async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.params.id); // Borra tarea por id
    res.json({ message: 'Tarea eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Iniciar servidor
app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
