// src/routes/dashboardRoutes.js
import { Router } from 'express'
import { verificarTokenYRol } from '../middlewares/authMiddleware.js'

const router = Router()

router.get('/', verificarTokenYRol(['admin', 'user']), (req, res) => {
  res.render('dashboard', {
    titulo: 'Panel Principal',
    usuario: req.user, // datos del token (id, nombre, rol, etc.)
  })
})

export default router
