const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// POST: Guardar dirección
const guardarDireccion = (req, res) => {
  const {
    calle,
    numero_exterior,
    numero_interior,
    colonia,
    municipio,
    estado,
    cp,
    seccion
  } = req.body;

  // Validación rápida
  if (!calle || !seccion) {
    return res.status(400).json({ error: 'Calle y sección son obligatorios.' });
  }

  const id_direccion = uuidv4();

  const query = `
    INSERT INTO direccion 
    (id_direccion, calle, numero_exterior, numero_interior, colonia, municipio, estado, cp, seccion)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    query,
    [id_direccion, calle, numero_exterior, numero_interior, colonia, municipio, estado, cp, seccion],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al guardar la dirección.' });
      }

      res.status(201).json({ message: 'Dirección guardada correctamente.', id_direccion });
    }
  );
};

// GET: Obtener todas las direcciones
const obtenerDirecciones = (req, res) => {
  const query = `
    SELECT id_direccion, calle, numero_exterior, numero_interior, colonia, municipio, estado, cp, seccion
    FROM direccion
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener las direcciones.' });
    }

    res.status(200).json(results);
  });
};


module.exports = {
  guardarDireccion,
  obtenerDirecciones
};
