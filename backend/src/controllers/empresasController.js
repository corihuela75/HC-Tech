import * as model from '../models/empresasModel.js';

// Helper: render HTML o JSON
const responder = (req, res, data, extra = {}) => {
  if (req.accepts('html')) return res.render('empresas', { ...data, ...extra });
  return res.json(data.items || data.item || []);
};

// Listar + formulario (modo crear por defecto)
export const listarEmpresas = async (req, res) => {
  try {
    const empresas = await model.listarEmpresas();
    return responder(req, res, { items: empresas }, {
      title: 'Empresas',
      formTitle: 'Agregar Empresa',
      formAction: '/empresas',
      submitText: 'Crear',
      baseUrl: '/empresas',
      columns: ['Nombre', 'Direccion', 'Telefono', 'Email'],
      fields: [
        { name: 'nombre', label: 'Nombre', type: 'text', value: '', required: true },
        { name: 'direccion', label: 'Dirección', type: 'text', value: '' },
        { name: 'telefono', label: 'Teléfono', type: 'text', value: '' },
        { name: 'email', label: 'Email', type: 'text', value: '' }
      ]
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al listar empresas');
  }
};

// Formulario editar (reusa la misma vista con campos cargados)
export const formularioEditar = async (req, res) => {
  try {
    const empresas = await model.listarEmpresas(); // Para mostrar tabla igual
    const empresa = await model.obtenerEmpresaPorId(req.params.id);
    if (!empresa) return res.status(404).send('Empresa no encontrada');

    return responder(req, res, { items: empresas, item: empresa }, {
      title: 'Empresas',
      formTitle: 'Editar Empresa',
      formAction: `/empresas/${empresa.id}?_method=PUT`,
      submitText: 'Guardar',
      baseUrl: '/empresas',
      columns: ['Nombre', 'Direccion', 'Telefono', 'Email'],
      fields: [
        { name: 'nombre', label: 'Nombre', type: 'text', value: empresa.nombre, required: true },
        { name: 'direccion', label: 'Dirección', type: 'text', value: empresa.direccion },
        { name: 'telefono', label: 'Teléfono', type: 'text', value: empresa.telefono },
        { name: 'email', label: 'Email', type: 'text', value: empresa.email }
      ]
    });
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al cargar formulario');
  }
};

// Crear empresa
export const crearEmpresa = async (req, res) => {
  try {
    await model.crearEmpresa(req.body);
    res.redirect('/empresas');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al crear empresa');
  }
};

// Actualizar empresa
export const actualizarEmpresa = async (req, res) => {
  try {
    await model.actualizarEmpresa(req.params.id, req.body);
    res.redirect('/empresas');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al actualizar empresa');
  }
};

// Borrar empresa
export const borrarEmpresa = async (req, res) => {
  try {
    await model.eliminarEmpresa(req.params.id);
    res.redirect('/empresas');
  } catch (e) {
    console.error(e);
    res.status(500).send('Error al eliminar empresa');
  }
};
