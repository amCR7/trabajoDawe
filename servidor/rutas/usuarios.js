const express = require('express')
const router = express.Router()
const Usuario = require('../models/Usuario')

// GET todos usuarios
router.get('/', async (req, res) => {
  const usuarios = await Usuario.find()
  res.json(usuarios)
})

module.exports = router