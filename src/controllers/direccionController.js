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

// GET: Obtener dirección por ID
const obtenerDireccionPorId = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT id_direccion, calle, numero_exterior, numero_interior, colonia, municipio, estado, cp, seccion
    FROM direccion
    WHERE id_direccion = ?
  `;

  db.query(query, [id], (err, results) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al obtener la dirección.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Dirección no encontrada.' });
    }

    res.status(200).json(results[0]);
  });
};

// DELETE: Eliminar dirección por ID
const eliminarDireccionPorId = (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM direccion
    WHERE id_direccion = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: 'Error al eliminar la dirección.' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Dirección no encontrada.' });
    }

    res.status(200).json({ message: 'Dirección eliminada correctamente.' });
  });
};

/*// PUT: Actualizar dirección por ID
const actualizarDireccionPorId = (req, res) => {
  const { id } = req.params;
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

  // Validación básica: puedes ajustar según necesites
  if (!calle || !seccion) {
    return res.status(400).json({ error: 'Calle y sección son obligatorios.' });
  }

  const query = `
    UPDATE direccion
    SET calle = ?, numero_exterior = ?, numero_interior = ?, colonia = ?, municipio = ?, estado = ?, cp = ?, seccion = ?
    WHERE id_direccion = ?
  `;

  db.query(query,
    [calle, numero_exterior, numero_interior, colonia, municipio, estado, cp, seccion, id],
    (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: 'Error al actualizar la dirección.' });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: 'Dirección no encontrada.' });
      }

      res.status(200).json({ message: 'Dirección actualizada correctamente.' });
    }
  );
};
*/

module.exports = {
  guardarDireccion,
  obtenerDirecciones,
  obtenerDireccionPorId,
  eliminarDireccionPorId,
  //actualizarDireccionPorId
};
