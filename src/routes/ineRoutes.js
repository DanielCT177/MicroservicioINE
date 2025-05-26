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
router.delete('/eliminarCredencialPorCurp/:curp', credencialController.eliminarCredencialPorCurp);
//router.put('/actualizarCredencial/:id', credencialController.actualizarCredencialPorId);

//TABLA DIRECCION
router.post('/guardarDireccion', direccionController.guardarDireccion);
router.get('/obtenerDirecciones', direccionController.obtenerDirecciones);
router.get('/obtenerDireccionPorId/:id', direccionController.obtenerDireccionPorId);
router.delete('/eliminarDireccionPorId/:id', direccionController.eliminarDireccionPorId);
//router.put('/actualizarDireccion/:id', direccionController.actualizarDireccionPorId);

module.exports = router;
