# AulaPlan — Avance del reto Full Stack

Proyecto académico de gestión de tareas por nivel educativo y materia. Incluye registro e inicio de sesión, JWT, contraseñas con bcryptjs, API CRUD protegida, PostgreSQL y frontend responsivo.

## Requisitos
Node.js 20+, PostgreSQL, npm, Git, Postman opcional.

## Inicio local
1. `npm install`
2. Crear base de datos PostgreSQL llamada `aulaplan` (por ejemplo `createdb -U postgres aulaplan`).
3. Ejecutar `psql -U postgres -d aulaplan -f src/db/schema.sql` (o ejecutar el SQL desde pgAdmin).
4. Copiar `.env.example` como `.env` y cambiar `DATABASE_URL` y `JWT_SECRET` por valores reales. Generar secreto: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.
5. `npm start`
6. Abrir `http://localhost:3000` (NO abrir el HTML con doble clic: necesita el servidor).

## API
- `GET /api/salud` comprueba servidor y base de datos.
- `POST /api/auth/registro` body `{ "nombre":"Ana", "correo":"ana@example.com", "password":"ClaveSegura123" }`.
- `POST /api/auth/login` body `{ "correo":"ana@example.com", "password":"ClaveSegura123" }`.
- `GET /api/tareas` lista solo tareas del usuario autenticado.
- `POST /api/tareas` crea tarea. Body `{ "titulo":"Estudiar química", "materia":"Química", "nivel":"Secundaria", "completada":false }`.
- `PUT /api/tareas/:id` reemplaza datos de tarea (enviar titulo, materia, nivel, completada).
- `DELETE /api/tareas/:id` elimina tarea.
- Las rutas de tareas requieren `Authorization: Bearer TU_TOKEN`.

## Seguridad y alcance
- Nunca publicar `.env`; `.env.example` contiene solo marcadores de posición.
- SQL parametrizado, contraseñas hasheadas, JWT de 2 horas, rutas CRUD protegidas y aisladas por usuario.
- Token guardado en `sessionStorage` solo para demostración académica. Para producción: cookies HttpOnly/Secure/SameSite, HTTPS, rate limiting, CSRF cuando aplique, auditoría y rotación de secretos.
- No se recopilan datos reales de menores; usar cuentas ficticias durante las pruebas.

## GitHub y nube
Crear repositorio, subir archivos sin `.env` ni `node_modules`. Para Render: servicio Web con build `npm install`, start `npm start`, y variables `DATABASE_URL`, `JWT_SECRET`, `NODE_ENV=production`. Configurar PostgreSQL administrado y ejecutar `schema.sql` antes de probar. La URL pública se obtiene **después** de desplegar, no está incluida en este repositorio.

## Evidencias pendientes
Agregar URL real de GitHub, URL de Render, capturas reales, video demostrativo y resultados de pruebas Postman al documento de entrega. El código no equivale a un despliegue realizado.
