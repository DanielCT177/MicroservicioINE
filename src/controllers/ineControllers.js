const db = require('../config/db');

const guardarPersona = (req, res) => {
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    fecha_nacimiento,
    sexo,
    curp,
    clave_elector,
    anio_registro,
    vigencia,
    calle,
    numero_exterior,
    numero_interior,
    colonia,
    municipio,
    estado,
    cp,
    seccion
  } = req.body;

  // 1️⃣ Insertar en credencial
  const credencialQuery = `
    INSERT INTO credencial (curp, clave_elector, anio_registro, vigencia)
    VALUES (?, ?, ?, ?)
  `;

  const credencialValues = [curp, clave_elector, anio_registro, vigencia];

  db.query(credencialQuery, credencialValues, (err, credencialResult) => {
    if (err) {
      console.error('Error al insertar en credencial:', err);
      return res.status(500).json({ error: 'Error al guardar credencial' });
    }

    const credencialId = credencialResult.insertId;

    // 2️⃣ Insertar en domicilios
    const domicilioQuery = `
      INSERT INTO domicilios (calle, numero_exterior, numero_interior, colonia, municipio, estado, cp, seccion)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const domicilioValues = [calle, numero_exterior, numero_interior, colonia, municipio, estado, cp, seccion];

    db.query(domicilioQuery, domicilioValues, (err, domicilioResult) => {
      if (err) {
        console.error('Error al insertar en domicilios:', err);
        return res.status(500).json({ error: 'Error al guardar domicilio' });
      }

      const domicilioId = domicilioResult.insertId;

      // 3️⃣ Insertar en personas
      const personaQuery = `
        INSERT INTO personas (nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, credencial_id, domicilio_id)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

      const personaValues = [
        nombre,
        apellido_paterno,
        apellido_materno,
        fecha_nacimiento,
        sexo,
        credencialId,
        domicilioId
      ];

      db.query(personaQuery, personaValues, (err, personaResult) => {
        if (err) {
          console.error('Error al insertar en personas:', err);
          return res.status(500).json({ error: 'Error al guardar persona' });
        }

        res.status(201).json({
          message: 'Persona registrada correctamente',
          personaId: personaResult.insertId,
          credencialId: credencialId,
          domicilioId: domicilioId
        });
      });
    });
  });
};

const obtenerPersonasCompletas = (req, res) => {
  const query = `
    SELECT 
      p.id AS persona_id,
      p.nombre,
      p.apellido_paterno,
      p.apellido_materno,
      p.fecha_nacimiento,
      p.sexo,
      c.curp,
      c.clave_elector,
      c.anio_registro,
      c.vigencia,
      d.seccion,
      d.calle,
      d.numero_exterior,
      d.numero_interior,
      d.colonia,
      d.municipio,
      d.estado,
      d.cp
    FROM personas p
    JOIN credencial c ON p.credencial_id = c.id
    JOIN domicilios d ON p.domicilio_id = d.id;
  `;

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error al obtener los datos:', err);
      return res.status(500).json({ error: 'Error al consultar los datos' });
    }

    res.status(200).json(results);
  });
};

const obtenerPersonaPorId = (req, res) => {
  const { id } = req.params;

  const query = `
    SELECT 
      p.id AS id,
      p.nombre,
      p.apellido_paterno,
      p.apellido_materno,
      p.fecha_nacimiento,
      p.sexo,
      c.curp,
      c.clave_elector,
      c.anio_registro,
      c.vigencia,
      d.seccion,
      d.calle,
      d.numero_exterior,
      d.numero_interior,
      d.colonia,
      d.municipio,
      d.estado,
      d.cp
    FROM personas p
    JOIN credencial c ON p.credencial_id = c.id
    JOIN domicilios d ON p.domicilio_id = d.id
    WHERE p.id = ?
  `;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error al obtener persona:', err);
      return res.status(500).json({ error: 'Error al obtener los datos' });
    }

    if (result.length === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.status(200).json(result[0]);
  });
};

const obtenerPersonaPorCurp = (req, res) => {
  const { curp } = req.params;

  const query = `
    SELECT 
      p.id AS id,
      p.nombre,
      p.apellido_paterno,
      p.apellido_materno,
      p.fecha_nacimiento,
      p.sexo,
      c.curp,
      c.clave_elector,
      c.anio_registro,
      c.vigencia,
      d.seccion,
      d.calle,
      d.numero_exterior,
      d.numero_interior,
      d.colonia,
      d.municipio,
      d.estado,
      d.cp
    FROM personas p
    JOIN credencial c ON p.credencial_id = c.id
    JOIN domicilios d ON p.domicilio_id = d.id
    WHERE c.curp = ?
  `;

  db.query(query, [curp], (err, results) => {
    if (err) {
      console.error('Error al obtener persona:', err);
      return res.status(500).json({ error: 'Error al obtener los datos' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'Persona no encontrada' });
    }

    res.status(200).json(results[0]);
  });
};

// Eliminar persona por CURP
const eliminarPersonaPorCurp = (req, res) => {
  const { curp } = req.params;

  // Buscar la credencial por curp
  const buscarCredencialQuery = 'SELECT id FROM credencial WHERE curp = ?';

  db.query(buscarCredencialQuery, [curp], (err, credencialResult) => {
    if (err) {
      console.error('Error al buscar credencial:', err);
      return res.status(500).json({ error: 'Error al buscar credencial' });
    }

    if (credencialResult.length === 0) {
      return res.status(404).json({ message: 'CURP no encontrada' });
    }

    const credencialId = credencialResult[0].id;

    // Buscar la persona asociada a esa credencial
    const buscarPersonaQuery = 'SELECT id, domicilio_id FROM personas WHERE credencial_id = ?';

    db.query(buscarPersonaQuery, [credencialId], (err, personaResult) => {
      if (err) {
        console.error('Error al buscar persona:', err);
        return res.status(500).json({ error: 'Error al buscar persona' });
      }

      if (personaResult.length === 0) {
        return res.status(404).json({ message: 'Persona no encontrada para esta CURP' });
      }

      const personaId = personaResult[0].id;
      const domicilioId = personaResult[0].domicilio_id;

      // Eliminar persona
      const eliminarPersonaQuery = 'DELETE FROM personas WHERE id = ?';
      db.query(eliminarPersonaQuery, [personaId], (err) => {
        if (err) {
          console.error('Error al eliminar persona:', err);
          return res.status(500).json({ error: 'Error al eliminar persona' });
        }

        // Eliminar domicilio
        const eliminarDomicilioQuery = 'DELETE FROM domicilios WHERE id = ?';
        db.query(eliminarDomicilioQuery, [domicilioId], (err) => {
          if (err) {
            console.error('Error al eliminar domicilio:', err);
            return res.status(500).json({ error: 'Error al eliminar domicilio' });
          }

          // Eliminar credencial
          const eliminarCredencialQuery = 'DELETE FROM credencial WHERE id = ?';
          db.query(eliminarCredencialQuery, [credencialId], (err) => {
            if (err) {
              console.error('Error al eliminar credencial:', err);
              return res.status(500).json({ error: 'Error al eliminar credencial' });
            }

            res.status(200).json({ message: 'Registro eliminado correctamente' });
          });
        });
      });
    });
  });
};

module.exports = {
  guardarPersona,
  obtenerPersonasCompletas,
  obtenerPersonaPorId,
  obtenerPersonaPorCurp,
  eliminarPersonaPorCurp
};
