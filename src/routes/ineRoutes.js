const express = require('express');
const router = express.Router();
const ineController = require('../controllers/ineControllers');
const credencialController = require('../controllers/credencialController');
const direccionController = require('../controllers/direccionController');

router.post('/guardarPersona', ineController.guardarPersona);
router.get('/personasAll', ineController.obtenerPersonasCompletas);
router.get('/personaId/:id', ineController.obtenerPersonaPorId);
router.get('/personaCurp/:curp', ineController.obtenerPersonaPorCurp);
router.delete('/deletePersonaCurp/:curp', ineController.eliminarPersonaPorCurp);

//TABLA CREDENCIAL
router.post('/guardarCredencial', credencialController.guardarCredencial);
router.get('/obtenerCredencial', credencialController.obtenerCredenciales);
router.get('/obtenerCredencialPorCurp/:curp', credencialController.obtenerCredencialPorCurp);

//TABLA DIRECCION
router.post('/guardarDireccion', direccionController.guardarDireccion);


module.exports = router;
