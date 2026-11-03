const niveles=['Primaria','Secundaria','Preparatoria'];
const validarTarea=(req,res,next)=>{
 const {titulo,materia,nivel,completada}=req.body||{};
 if(typeof titulo!=='string'||!titulo.trim()||titulo.trim().length>120)return res.status(400).json({error:'El título debe tener entre 1 y 120 caracteres.'});
 if(materia!==undefined&&(typeof materia!=='string'||!materia.trim()||materia.trim().length>80))return res.status(400).json({error:'Materia inválida.'});
 if(nivel!==undefined&&!niveles.includes(nivel))return res.status(400).json({error:'Nivel inválido.'});
 if(completada!==undefined&&typeof completada!=='boolean')return res.status(400).json({error:'El estado debe ser booleano.'});
 req.tarea={titulo:titulo.trim(),materia:materia?.trim()||'General',nivel:nivel||'Secundaria',completada:completada??false};next();
};
module.exports={validarTarea};
