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

module.exports = {
  guardarPersona
};
