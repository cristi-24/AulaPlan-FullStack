"use strict";
const $=selector=>document.querySelector(selector);
let token=sessionStorage.getItem('aulaplan-token')||'';
let usuario=JSON.parse(sessionStorage.getItem('aulaplan-usuario')||'null');
let registro=false;let tareas=[];
const mensaje=(texto,error=false)=>{const nodo=$('#message');nodo.textContent=texto;nodo.classList.toggle('error',error);};
const api=async(ruta,opciones={})=>{
 const respuesta=await fetch(`/api${ruta}`,{...opciones,headers:{'Content-Type':'application/json',...(token?{Authorization:`Bearer ${token}`}:{})}});
 const datos=respuesta.status===204?null:await respuesta.json().catch(()=>({error:'Respuesta inválida del servidor.'}));
 if(!respuesta.ok)throw new Error(datos?.error||'Error de conexión.');return datos;
};
const pantalla=()=>{$('#auth-panel').hidden=!!token;$('#tasks-panel').hidden=!token;if(token){$('#welcome').textContent=`¡Hola, ${usuario?.nombre||'estudiante'}!`;cargar();}};
$('#toggle-auth').addEventListener('click',()=>{registro=!registro;$('#name-field').hidden=!registro;$('#auth-title').textContent=registro?'Crea tu cuenta':'Inicia sesión';$('#auth-submit').textContent=registro?'Registrarme':'Entrar a mi espacio';$('#toggle-auth').textContent=registro?'¿Ya tienes cuenta? Inicia sesión':'¿No tienes cuenta? Regístrate';$('#password').autocomplete=registro?'new-password':'current-password';mensaje('');});
$('#auth-form').addEventListener('submit',async e=>{e.preventDefault();try{
 const cuerpo={correo:$('#email').value.trim(),password:$('#password').value};if(registro)cuerpo.nombre=$('#name').value.trim();
 const datos=await api(registro?'/auth/registro':'/auth/login',{method:'POST',body:JSON.stringify(cuerpo)});
 token=datos.token;usuario=datos.usuario;sessionStorage.setItem('aulaplan-token',token);sessionStorage.setItem('aulaplan-usuario',JSON.stringify(usuario));mensaje('¡Sesión iniciada!');pantalla();
 }catch(error){mensaje(error.message,true);}});
$('#logout').addEventListener('click',()=>{token='';usuario=null;tareas=[];sessionStorage.removeItem('aulaplan-token');sessionStorage.removeItem('aulaplan-usuario');mensaje('Sesión cerrada.');pantalla();});
const cargar=async()=>{try{tareas=await api('/tareas');render();}catch(e){mensaje(e.message,true);if(e.message.includes('Sesión'))$('#logout').click();}};
const render=()=>{
 const lista=$('#tasks');lista.replaceChildren();const completadas=tareas.filter(t=>t.completada).length;
 $('#total').textContent=tareas.length;$('#pending').textContent=tareas.length-completadas;$('#done').textContent=completadas;$('#task-count').textContent=`${tareas.length} actividades`;$('#empty').hidden=tareas.length>0;
 tareas.forEach(t=>{const li=document.createElement('li');li.className=`task ${t.completada?'completed':''}`;
 const check=document.createElement('input');check.type='checkbox';check.checked=t.completada;check.setAttribute('aria-label',`Completar ${t.titulo}`);check.addEventListener('change',()=>actualizar(t,{...t,completada:check.checked}));
 const info=document.createElement('div');info.className='task-info';const titulo=document.createElement('strong');titulo.textContent=t.titulo;const meta=document.createElement('small');meta.textContent=`${t.materia} · ${t.nivel}`;info.append(titulo,meta);
 const editar=document.createElement('button');editar.textContent='Editar';editar.addEventListener('click',()=>editarTarea(t));const borrar=document.createElement('button');borrar.className='danger';borrar.textContent='Eliminar';borrar.addEventListener('click',()=>eliminar(t));li.append(check,info,editar,borrar);lista.append(li);});
};
$('#task-form').addEventListener('submit',async e=>{e.preventDefault();try{await api('/tareas',{method:'POST',body:JSON.stringify({titulo:$('#task-title').value.trim(),materia:$('#subject').value,nivel:$('#level').value})});$('#task-title').value='';mensaje('Tarea agregada correctamente.');await cargar();}catch(error){mensaje(error.message,true);}});
const actualizar=async(t,datos)=>{try{await api(`/tareas/${t.id}`,{method:'PUT',body:JSON.stringify({titulo:datos.titulo,materia:datos.materia,nivel:datos.nivel,completada:datos.completada})});mensaje('Tarea actualizada.');await cargar();}catch(e){mensaje(e.message,true);await cargar();}};
const editarTarea=t=>{const nuevo=prompt('Nuevo nombre de la tarea:',t.titulo);if(nuevo===null)return;if(!nuevo.trim()){mensaje('El nombre no puede estar vacío.',true);return;}actualizar(t,{...t,titulo:nuevo.trim()});};
const eliminar=async t=>{if(!confirm(`¿Eliminar "${t.titulo}"?`))return;try{await api(`/tareas/${t.id}`,{method:'DELETE'});mensaje('Tarea eliminada.');await cargar();}catch(e){mensaje(e.message,true);}};
pantalla();
