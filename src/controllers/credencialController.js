const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// POST: Guardar credencial
const guardarCredencial = (req, res) => {
  const {
    curp,
    clave_elector,
    anio_registro,
    vigencia
  } = req.body;
  
  if (!curp || !clave_elector || !anio_registro || !vigencia) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const id_credencial = uuidv4();

  const query = `
    INSERT INTO credencial (id_credencial, curp, clave_elector, anio_registro, vigencia)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(query, [id_credencial, curp, clave_elector, anio_registro, vigencia], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al guardar la credencial.' });
    }

    res.status(201).json({ message: 'Credencial guardada correctamente.', id_credencial });
  });
};

module.exports = {
  guardarCredencial
};
