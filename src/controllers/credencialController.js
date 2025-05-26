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

// GET: Obtener todas las credenciales
const obtenerCredenciales = (req, res) => {
  const query = `
    SELECT id_credencial, curp, clave_elector, anio_registro, vigencia
    FROM credencial
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener las credenciales.' });
    }

    res.status(200).json(results);
  });
};

// GET: Obtener credencial por CURP
const obtenerCredencialPorCurp = (req, res) => {
  const { curp } = req.params;

  const query = `
    SELECT id_credencial, curp, clave_elector, anio_registro, vigencia
    FROM credencial
    WHERE curp = ?
  `;

  db.query(query, [curp], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener la credencial por CURP.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No se encontró una credencial con esa CURP.' });
    }

    res.status(200).json(results[0]);
  });
};

/*// PUT: Actualizar credencial por ID
const actualizarCredencialPorId = (req, res) => {
  const { id } = req.params;
  const { curp, clave_elector, anio_registro, vigencia } = req.body;

  // Validación simple
  if (!curp || !clave_elector || !anio_registro || !vigencia) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  const query = `
    UPDATE credencial
    SET curp = ?, clave_elector = ?, anio_registro = ?, vigencia = ?
    WHERE id_credencial = ?
  `;

  db.query(query, [curp, clave_elector, anio_registro, vigencia, id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al actualizar la credencial.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Credencial no encontrada.' });
    }

    res.status(200).json({ message: 'Credencial actualizada correctamente.' });
  });
};
*/

module.exports = {
  guardarCredencial,
  obtenerCredenciales,
  obtenerCredencialPorCurp,
  //actualizarCredencialPorId
};
