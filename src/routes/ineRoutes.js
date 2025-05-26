const express = require('express');
const router = express.Router();
const ineController = require('../controllers/ineControllers');

router.post('/guardarPersona', ineController.guardarPersona);
router.get('/personasAll', ineController.obtenerPersonasCompletas);
router.get('/personaId/:id', ineController.obtenerPersonaPorId);
router.get('/personaCurp/:curp', ineController.obtenerPersonaPorCurp);
router.delete('/deletePersonaCurp/:curp', ineController.eliminarPersonaPorCurp);


router.post('/guardarCredencial', ineController.guardarCredencial);


module.exports = router;
