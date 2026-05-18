const express = require('express');
const router = express.Router();
const tagController = require('../controllers/tag.controller');
const { verificarToken } = require('../middleware/auth.middleware'); 


router.get('/', tagController.getAllTags);

module.exports = router;

