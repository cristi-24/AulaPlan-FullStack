
const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const header = req.headers.authorization || '';

  const token = header.startsWith('Bearer ')
    ? header.slice(7)
    : null;

  if (!token) {
    return res.status(401).json({
      error: 'Debes iniciar sesión.'
    });
  }

  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET,
      { algorithms: ['HS256'] }
    );

    const usuarioId = Number(payload.sub);

    if (!Number.isSafeInteger(usuarioId) || usuarioId <= 0) {
      return res.status(401).json({
        error: 'Identificador de usuario inválido. Inicia sesión nuevamente.'
      });
    }

    req.usuarioId = usuarioId;

    console.log('Usuario autenticado:', req.usuarioId);

    return next();
  } catch (error) {
    return res.status(401).json({
      error: 'Sesión inválida o expirada. Inicia sesión nuevamente.'
    });
  }
};
