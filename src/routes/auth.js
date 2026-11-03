
const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db/pool');

function crearToken(usuario) {
  return jwt.sign(
    { sub: String(usuario.id) },
    process.env.JWT_SECRET,
    { algorithm: 'HS256', expiresIn: '8h' }
  );
}

// Registrar un usuario
router.post('/registro', async (req, res, next) => {
  try {
    const { nombre, correo, password } = req.body || {};

    if (
      typeof nombre !== 'string' ||
      !nombre.trim() ||
      nombre.trim().length > 100 ||
      typeof correo !== 'string' ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim()) ||
      correo.trim().length > 254 ||
      typeof password !== 'string' ||
      password.length < 8 ||
      password.length > 72
    ) {
      return res.status(400).json({
        error: 'Ingresa nombre, correo válido y contraseña de 8 a 72 caracteres.'
      });
    }

    const correoNormalizado = correo.trim().toLowerCase();
    const passwordHash = await bcrypt.hash(password, 12);

    const { rows } = await pool.query(
      `INSERT INTO usuarios (nombre, correo, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, nombre, correo`,
      [nombre.trim(), correoNormalizado, passwordHash]
    );

    const usuario = rows[0];

    res.status(201).json({
      usuario,
      token: crearToken(usuario)
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({
        error: 'Este correo ya está registrado.'
      });
    }
    next(error);
  }
});

// Iniciar sesión
router.post('/login', async (req, res, next) => {
  try {
    const { correo, password } = req.body || {};

    if (
      typeof correo !== 'string' ||
      typeof password !== 'string' ||
      !correo.trim() ||
      !password
    ) {
      return res.status(400).json({
        error: 'Ingresa tu correo y contraseña.'
      });
    }

    const { rows } = await pool.query(
      `SELECT id, nombre, correo, password_hash
       FROM usuarios
       WHERE correo = $1`,
      [correo.trim().toLowerCase()]
    );

    const usuario = rows[0];

    if (
      !usuario ||
      !(await bcrypt.compare(password, usuario.password_hash))
    ) {
      return res.status(401).json({
        error: 'Correo o contraseña incorrectos.'
      });
    }

    res.json({
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        correo: usuario.correo
      },
      token: crearToken(usuario)
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
