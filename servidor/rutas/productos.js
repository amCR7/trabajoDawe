const express = require('express')
const router = express.Router()
const Producto = require('../models/Producto')

// GET todos los productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find()
    res.json(productos)
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    res.status(500).json({ error: 'Error obteniendo productos' })
  }
})

// PUT editar un producto concreto
router.put('/:id', async (req, res) => {
  try {
    console.log('PUT /productos/:id recibido')
    console.log('ID recibido:', req.params.id)
    console.log('BODY recibido:', req.body)

    const { id } = req.params

    const productoActualizado = await Producto.findByIdAndUpdate(
      id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    )

    if (!productoActualizado) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }

    res.json(productoActualizado)
  } catch (error) {
    console.error('Error actualizando producto:', error)
    res.status(500).json({ error: 'Error actualizando producto' })
  }
})

// DELETE borrar varios productos seleccionados
router.delete('/', async (req, res) => {
  try {
    console.log('DELETE /productos recibido')
    console.log('BODY recibido:', req.body)

    const { ids } = req.body

    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'No se han enviado productos para borrar' })
    }

    const resultado = await Producto.deleteMany({
      _id: { $in: ids }
    })

    res.json({
      mensaje: 'Productos eliminados correctamente',
      borrados: resultado.deletedCount,
      ids
    })
  } catch (error) {
    console.error('Error borrando productos:', error)
    res.status(500).json({ error: 'Error borrando productos' })
  }
})

module.exports = router