const router=require('express').Router();const pool=require('../db/pool');
const auth=require('../middleware/auth');const {validarTarea}=require('../middleware/validate');
router.use(auth);
router.get('/',async(req,res,next)=>{try{const {rows}=await pool.query('SELECT id,titulo,materia,nivel,completada,creado_en FROM tareas WHERE usuario_id=$1 ORDER BY creado_en DESC,id DESC',[req.usuarioId]);res.json(rows);}catch(e){next(e);}});
router.post('/',validarTarea,async(req,res,next)=>{try{const t=req.tarea;const {rows}=await pool.query('INSERT INTO tareas(usuario_id,titulo,materia,nivel,completada) VALUES($1,$2,$3,$4,$5) RETURNING *',[req.usuarioId,t.titulo,t.materia,t.nivel,t.completada]);res.status(201).json(rows[0]);}catch(e){next(e);}});
router.put('/:id',validarTarea,async(req,res,next)=>{try{const t=req.tarea;const {rows}=await pool.query('UPDATE tareas SET titulo=$1,materia=$2,nivel=$3,completada=$4 WHERE id=$5 AND usuario_id=$6 RETURNING *',[t.titulo,t.materia,t.nivel,t.completada,req.params.id,req.usuarioId]);if(!rows.length)return res.status(404).json({error:'Tarea no encontrada.'});res.json(rows[0]);}catch(e){next(e);}});
router.delete('/:id',async(req,res,next)=>{try{const {rowCount}=await pool.query('DELETE FROM tareas WHERE id=$1 AND usuario_id=$2',[req.params.id,req.usuarioId]);if(!rowCount)return res.status(404).json({error:'Tarea no encontrada.'});res.status(204).end();}catch(e){next(e);}});
module.exports=router;
