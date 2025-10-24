// dashboardController.js
export const mostrarDashboard = (req, res) => {
  const usuario = req.user || {}
  res.render('dashboard', {
    titulo: 'Panel Principal',
    nombre: usuario.nombre || 'Usuario',
    rol: usuario.rol || 'sin rol',
  })
}
