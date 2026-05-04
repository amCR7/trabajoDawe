const express = require('express')
const router = express.Router()
const Producto = require('../models/Producto')

// GET todos productos
router.get('/', async (req, res) => {
  const productos = await Producto.find()
  res.json(productos)
})

module.exports = router