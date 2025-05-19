const express = require('express');
const router = express.Router();
const ineController = require('../controllers/ineControllers');

router.post('/guardarPersona', ineController.guardarPersona);

module.exports = router;
