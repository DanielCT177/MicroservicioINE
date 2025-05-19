const express = require('express');
const cors = require('cors');
require('dotenv').config();
const ineRoutes = require('./routes/ineRoutes');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rutas
app.use('/api/ine', ineRoutes);

// Levantar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT} 🚀`);
});
