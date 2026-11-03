const jwt=require('jsonwebtoken');
module.exports=(req,res,next)=>{
 const header=req.headers.authorization||'';
 const token=header.startsWith('Bearer ')?header.slice(7):null;
 if(!token)return res.status(401).json({error:'Debes iniciar sesión.'});
 try{const payload=jwt.verify(token,process.env.JWT_SECRET,{algorithms:['HS256']});req.usuarioId=payload.sub;return next();}
 catch{return res.status(401).json({error:'Sesión inválida o expirada. Inicia sesión de nuevo.'});}
};
