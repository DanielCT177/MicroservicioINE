const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

const guardarPersona = async (req, res) => {
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


  const credencialValues = {curp, clave_elector, anio_registro, vigencia};

  const direccionValues = {calle, numero_exterior, numero_interior, colonia, municipio, estado, cp, seccion};

  try {
    // Enviar credencial
    const responseCredencial = await fetch('http://localhost:3000/api/ine/guardarCredencial', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credencialValues)
    });

    const dataCredencial = await responseCredencial.json();

    if (!responseCredencial.ok) {
      return res.status(500).json({ error: 'Error al insertar credencial.' });
    }

    const id_credencial = dataCredencial.id_credencial;

    // Enviar dirección
    const responseDireccion = await fetch('http://localhost:3000/api/ine/guardarDireccion', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(direccionValues)
    });

    const dataDireccion = await responseDireccion.json();

    if (!responseDireccion.ok) {
      return res.status(500).json({ error: 'Error al insertar dirección.' });
    }

    const id_direccion = dataDireccion.id_direccion;

    // Generar UUID para persona
    const id_persona = uuidv4();

    // Insertar persona
    const queryPersona = `
      INSERT INTO persona (id_persona, nombre, apellido_paterno, apellido_materno, fecha_nacimiento, sexo, credencial_id, direccion_id)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(queryPersona, [
      id_persona,
      nombre,
      apellido_paterno,
      apellido_materno,
      fecha_nacimiento,
      sexo,
      id_credencial,
      id_direccion
    ], (err, resultPersona) => {
      if (err) {
        console.error('Error al insertar persona:', err);
        return res.status(500).json({ error: 'Error al insertar persona.' });
      }

      res.status(201).json({
        message: 'Persona registrada correctamente.',
        id_persona,
        id_credencial,
        id_direccion
      });
    });

  } catch (error) {
    console.error('Error en el proceso:', error);
    res.status(500).json({ error: 'Error al registrar persona.' });
  }
  
};

const obtenerPersonas = async (req, res) => {
  try {
    // Obtener direcciones y credenciales vía fetch
    const [resDirecciones, resCredenciales] = await Promise.all([
      fetch('http://localhost:3000/api/ine/obtenerDirecciones'),
      fetch('http://localhost:3000/api/ine/obtenerCredencial'),
    ]);

    if (!resDirecciones.ok || !resCredenciales.ok) {
      return res.status(500).json({ error: 'Error al obtener datos de dirección o credencial.' });
    }

    const direcciones = await resDirecciones.json();
    const credenciales = await resCredenciales.json();

    // Consulta directa para obtener personas
    db.query('SELECT * FROM persona', (err, personas) => {
      if (err) {
        console.error('Error al obtener personas:', err);
        return res.status(500).json({ error: 'Error al obtener personas.' });
      }

      // Mapas para unión rápida
      const mapaCredenciales = new Map(credenciales.map(c => [c.id_credencial, c]));
      const mapaDirecciones = new Map(direcciones.map(d => [d.id_direccion, d]));

      // Unir datos
      const personasCompletas = personas.map(persona => ({
        ...persona,
        credencial: mapaCredenciales.get(persona.credencial_id) || null,
        direccion: mapaDirecciones.get(persona.direccion_id) || null
      }));

      return res.json(personasCompletas);
    });

  } catch (error) {
    console.error('Error en obtenerPersonasCompletas:', error);
    res.status(500).json({ error: 'Error al obtener personas completas.' });
  }
};

const obtenerPersonaPorCurp = async (req, res) => {
  const { curp } = req.params;

  if (!curp) {
    return res.status(400).json({ error: 'El CURP es obligatorio.' });
  }

  try {
    // Fetch de todas las personas completas
    const response = await fetch('http://localhost:3000/api/ine/obtenerPersonas');

    if (!response.ok) {
      return res.status(500).json({ error: 'Error al obtener personas.' });
    }

    const personas = await response.json();

    // Buscar la persona que coincida con el CURP en su credencial
    const personaEncontrada = personas.find(p => p.credencial && p.credencial.curp === curp);

    if (!personaEncontrada) {
      return res.status(404).json({ error: 'No se encontró ninguna persona con ese CURP.' });
    }

    // Devolver la persona encontrada
    res.json(personaEncontrada);

  } catch (error) {
    console.error('Error en obtenerPersonaPorCurp:', error);
    res.status(500).json({ error: 'Error al obtener la persona por CURP.' });
  }
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
  obtenerPersonas,
  obtenerPersonaPorCurp,
  eliminarPersonaPorCurp
};
