const db = require('../config/db');

const guardarPersona = (req, res) => {
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    curp,
    clave_elector,
    anio_registro,
    fecha_nacimiento,
    sexo,
    domicilio,
    colonia,
    numero_exterior,
    codigo_postal,
    seccion,
    vigencia
  } = req.body;

  const query = `
    INSERT INTO ine_personas
    (nombre, apellido_paterno, apellido_materno, curp, clave_elector, anio_registro, fecha_nacimiento,
     sexo, domicilio, colonia, numero_exterior, codigo_postal, seccion, vigencia)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    nombre,
    apellido_paterno,
    apellido_materno,
    curp,
    clave_elector,
    anio_registro,
    fecha_nacimiento,
    sexo,
    domicilio,
    colonia,
    numero_exterior,
    codigo_postal,
    seccion,
    vigencia
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.error('Error al insertar:', err);
      return res.status(500).json({ error: 'Error al guardar los datos' });
    }
    res.status(201).json({ message: 'Datos guardados correctamente', id: result.insertId });
  });
};

module.exports = {
  guardarPersona
};
