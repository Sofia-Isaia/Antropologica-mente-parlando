(function(){
"use strict";
var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* Posts shown if the blog API is not reachable (for example, opening the file locally).
   On Netlify, the real list comes from /api/posts and is edited in /admin. */
var SEED = [
 {"id":"fragmentos-que-hacen-reflexionar","title":"Fragmentos que hacen reflexionar 🌞","date":"2026-08","cat":"Reflexiones","img":"img/rien.jpg","body":["Es en el momento en que el mundo que hemos conocido parece escapársenos de las manos cuando se multiplican los intentos de aprehenderlo.","Esta sugestiva reflexión de la antropóloga Anna Tsing nos invita a reflexionar no solo sobre la condición de inestabilidad en la que vivimos, sino también sobre la densidad de los encuentros que esta genera.","Anna Tsing desarrolla esta idea describiendo la sociedad-mundo no como una entidad unitaria, sino más bien como un «mosaico infinito de fragmentos».","Por ello, para captar la multiplicidad de las representaciones de los modos de vida contemporáneos, resulta fundamental renunciar a la búsqueda de un orden preestablecido.","Abrirse, con una observación curiosa, hacia la precariedad de nuestros días a nivel global es la única manera de comprender las verdaderas condiciones en las que vivimos. Según la visión de Tsing, en efecto, no somos más que ensamblajes de modos de vida enredados entre sí, donde cada pieza responde a arcos espaciales y ritmos temporales diferentes.","Desde esta perspectiva, la precariedad se entrelaza abiertamente con la interdependencia, poniendo de relieve que los recorridos humanos no son rectas paralelas, sino más bien una serie de trayectorias interconectadas.","Es precisamente a través del tejido de estas nuevas conexiones como los espacios de la movilidad, a menudo considerados vacíos o transitorios, se llenan y dan lugar al nacimiento de nuevos sistemas de significado.","En definitiva, si la supervivencia involucra siempre a los demás, esta también se encuentra necesariamente sujeta a la indeterminación de las transformaciones entre el yo y el otro.","Se puede observar así cómo la fragmentación pasa de representar un estado de precariedad limitante a convertirse en terreno fértil para nuevas formas de socialidad."]},
 {"id":"mas-que-un-titulo","title":"Más que un título","date":"2026-07","cat":"Diario","img":"img/grad.jpg","body":["En este mes de julio he tenido la oportunidad de celebrar lo que ha sido mucho más que la obtención de un título. Estudiar Antropología me ha enseñado a observar con más atención, a escuchar con más cuidado y a comprender la diversidad de formas en las que las personas construimos significado, comunidad y cultura.","Este camino ha estado lleno de preguntas, aprendizajes y experiencias que han transformado mi manera de entender el mundo y mi lugar en él. Especialmente, mi Trabajo de Fin de Grado me ha permitido cuestionar y reflexionar sobre algunos de los fenómenos que atraviesan el entorno en el que vivo. En Metamorfosis de la fricción: subjetividades nómadas y nuevas formas de gentrificación en la Barcelona del siglo XXI, he explorado cómo las transformaciones urbanas reconfiguran las formas de habitar, pertenecer y relacionarse con la ciudad.","La graduación no es un punto final, sino el comienzo de una nueva etapa en la que espero seguir aprendiendo, investigando y contribuyendo, desde la curiosidad y el compromiso, a comprender mejor las realidades que nos rodean."]}
];
var MONTHS=['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
function fmtMonth(d){ var m=/^(\d{4})-(\d{2})/.exec(d||''); if(!m) return d||''; var s=MONTHS[+m[2]-1]; return s.charAt(0).toUpperCase()+s.slice(1)+' '+m[1]; }
function fmtDay(iso){ try{ return new Date(iso).toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'}); }catch(e){ return ''; } }
function sortPosts(a){ return a.slice().sort(function(x,y){ return (y.date||'').localeCompare(x.date||'') || (y.created||0)-(x.created||0); }); }
function esc(t){ return String(t==null?'':t).replace(/[&<>"']/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c];}); }

/* ---------- speech bubble: one question, five languages ---------- */
var LANGS=[['¿El sentido de la vida?','castellano'],['Il senso della vita?','italiano'],['Le sens de la vie?','français'],['El sentit de la vida?','català'],['The meaning of life?','english']];
var bub=document.querySelector('.bubble'), bt=bub.querySelector('.t'), bl=bub.querySelector('.lang'), li=0;
if(!reduce){ setInterval(function(){ bt.classList.add('out'); setTimeout(function(){ li=(li+1)%LANGS.length; bt.textContent=LANGS[li][0]; bl.textContent=LANGS[li][1]; bt.classList.remove('out'); },300); },2600); }

/* ---------- hero parallax ---------- */
var layers=[].slice.call(document.querySelectorAll('.collage [data-depth]'));
var mx=0,my=0,cx=0,cy=0;
function rotOf(el){ return el.classList.contains('bubble')?'-6deg':(getComputedStyle(el).getPropertyValue('--r').trim()||'0deg'); }
function place(){ cx+=(mx-cx)*.08; cy+=(my-cy)*.08; var sy=window.scrollY;
  layers.forEach(function(el){ var d=+el.getAttribute('data-depth');
    el.style.transform='translate3d('+(cx*d).toFixed(2)+'px,'+(cy*d - sy*d/180).toFixed(2)+'px,0) rotate('+rotOf(el)+')'; });
  requestAnimationFrame(place); }
if(!reduce){ window.addEventListener('pointermove',function(e){ mx=e.clientX/innerWidth-.5; my=e.clientY/innerHeight-.5; },{passive:true}); requestAnimationFrame(place); }
else layers.forEach(function(el){ el.style.transform='rotate('+rotOf(el)+')'; });

/* ---------- headings: letters gather as you scroll ---------- */
var splits=[].slice.call(document.querySelectorAll('.split')).map(function(h){
  var txt=h.textContent; h.setAttribute('aria-label',txt); h.textContent='';
  var chs=[]; txt.split('').forEach(function(c){ var s=document.createElement('span'); s.className='ch'; s.setAttribute('aria-hidden','true'); s.textContent=c===' '?'\u00a0':c;
    s._dx=(Math.random()-.5)*160; s._dy=(Math.random()-.5)*120; s._r=(Math.random()-.5)*40; h.appendChild(s); chs.push(s); });
  return {h:h,chs:chs};
});
function gather(){ splits.forEach(function(o){ var r=o.h.getBoundingClientRect(); var p=1-Math.min(1,Math.max(0,(r.top-innerHeight*.25)/(innerHeight*.6))); var k=1-p;
  o.chs.forEach(function(s){ s.style.transform=k<.002?'none':'translate('+(s._dx*k).toFixed(1)+'px,'+(s._dy*k).toFixed(1)+'px) rotate('+(s._r*k).toFixed(1)+'deg)'; s.style.opacity=(0.25+0.75*p).toFixed(2); }); }); }
if(!reduce){ var ticking=false; window.addEventListener('scroll',function(){ if(!ticking){ ticking=true; requestAnimationFrame(function(){ gather(); ticking=false; }); } },{passive:true}); gather(); }

/* ---------- image reveal ---------- */
(function(){ var els=document.querySelectorAll('.reveal');
  if(reduce||!('IntersectionObserver' in window)){ els.forEach(function(e){e.classList.add('in');}); return; }
  var io=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} }); },{threshold:.2});
  els.forEach(function(e){ io.observe(e); }); })();

/* ---------- nav highlight ---------- */
var navlinks=[].slice.call(document.querySelectorAll('.nav ul a'));
if('IntersectionObserver' in window){ var nio=new IntersectionObserver(function(es){ es.forEach(function(e){ if(e.isIntersecting){ navlinks.forEach(function(a){ a.classList.toggle('on',a.getAttribute('href')==='#'+e.target.id); }); } }); },{rootMargin:'-45% 0px -50% 0px'});
  ['sobre','proyectos','blog','trayectoria','contacto'].forEach(function(id){ var el=document.getElementById(id); if(el) nio.observe(el); }); }

/* ---------- trayectoria accordion ---------- */
document.querySelectorAll('.xp button').forEach(function(b){ b.addEventListener('click',function(){ var o=b.parentNode.classList.toggle('open'); b.setAttribute('aria-expanded',o); }); });

/* ---------- big contact word ---------- */
(function(){ var a=document.getElementById('bigword'); var t=a.textContent; a.textContent=''; var cols=['var(--rose)','var(--sun)','var(--leaf)','var(--orange-soft)','var(--mint)'];
  t.split('').forEach(function(c,i){ var s=document.createElement('span'); s.className='ch'; s.textContent=c; s.setAttribute('aria-hidden','true'); s.style.setProperty('--rot',(i%2?7:-7)+'deg');
    s.addEventListener('mouseenter',function(){ s.style.color=cols[i%cols.length]; }); s.addEventListener('mouseleave',function(){ setTimeout(function(){ s.style.color=''; },500); }); a.appendChild(s); }); })();

/* ---------- blog ---------- */
var POSTS=sortPosts(SEED), API=true;
var list=document.getElementById('posts');
function excerpt(p){ var t=(p.body&&p.body[0])||''; return t.length>170? t.slice(0,168).replace(/\s+\S*$/,'')+'…' : t; }
function renderPosts(){
  if(!POSTS.length){ list.innerHTML='<li class="empty">Pronto habrá nuevas entradas.</li>'; return; }
  list.innerHTML=POSTS.map(function(p,i){
    return '<li class="post"><button data-i="'+i+'"><span><span class="pill">'+esc([p.cat,fmtMonth(p.date)].filter(Boolean).join(', '))+'</span><h3>'+esc(p.title)+'</h3><p class="ex">'+esc(excerpt(p))+'</p></span>'
      +(p.img?'<span class="th"><img src="'+esc(p.img)+'" alt="" loading="lazy"></span>':'<span></span>')+'</button></li>';
  }).join('');
}
renderPosts();
fetch('/api/posts',{headers:{'Accept':'application/json'}}).then(function(r){ if(!r.ok) throw 0; return r.json(); })
  .then(function(d){ if(Array.isArray(d.posts)){ POSTS=sortPosts(d.posts); renderPosts(); openFromHash(); } })
  .catch(function(){ API=false; openFromHash(); });

var reader=document.getElementById('reader'), art=document.getElementById('art'), lastFocus=null, current=null;
list.addEventListener('click',function(e){ var b=e.target.closest('button[data-i]'); if(b) openPost(+b.getAttribute('data-i')); });
function openPost(i){ var p=POSTS[i]; if(!p) return; current=p; lastFocus=document.activeElement;
  art.innerHTML='<span class="pill">'+esc([p.cat,fmtMonth(p.date)].filter(Boolean).join(', '))+'</span><h1>'+esc(p.title)+'</h1>'
    +(p.img?'<figure class="cover"><img src="'+esc(p.img)+'" alt=""></figure>':'')
    +'<div class="body">'+(p.body||[]).map(function(t,k){ return '<p'+(k===0?' class="lead"':'')+'>'+esc(t)+'</p>'; }).join('')+'</div>'
    +'<section class="comments" aria-labelledby="ctitle"><h2 id="ctitle">Comentarios</h2><ul class="clist" id="clist"></ul>'
    +'<form class="cform" id="cform" novalidate>'
    +'<div><label for="c-name">Nombre</label><input class="field" id="c-name" name="name" maxlength="60" required autocomplete="name"></div>'
    +'<div><label for="c-mail">Correo</label><input class="field" id="c-mail" name="email" type="email" maxlength="120" required autocomplete="email"></div>'
    +'<div class="full"><label for="c-text">Comentario</label><textarea class="field" id="c-text" name="text" maxlength="2000" required></textarea></div>'
    +'<div class="hp" aria-hidden="true"><label>No rellenar<input name="website" tabindex="-1" autocomplete="off"></label></div>'
    +'<div class="row-end"><p class="note">Tu correo no se publica.</p><button class="btn solid" type="submit">Publicar comentario</button></div>'
    +'<p class="status full" id="c-status" role="status"></p></form></section>';
  reader.classList.add('on'); reader.scrollTop=0; document.body.style.overflow='hidden'; document.getElementById('closer').focus();
  try{ history.replaceState(null,'','#entrada-'+p.id); }catch(e){}
  loadComments(p.id);
  document.getElementById('cform').addEventListener('submit',sendComment);
}
function closePost(){ reader.classList.remove('on'); document.body.style.overflow=''; current=null; try{ history.replaceState(null,'','#blog'); }catch(e){} if(lastFocus) lastFocus.focus(); }
document.getElementById('closer').addEventListener('click',closePost);
document.addEventListener('keydown',function(e){ if(e.key==='Escape'&&reader.classList.contains('on')) closePost(); });
function openFromHash(){ var m=/^#entrada-(.+)$/.exec(location.hash); if(!m||reader.classList.contains('on')) return; for(var i=0;i<POSTS.length;i++){ if(POSTS[i].id===m[1]){ openPost(i); break; } } }

function renderComments(cs){ var ul=document.getElementById('clist'); if(!ul) return;
  if(!cs.length){ ul.innerHTML='<li>Todavía no hay comentarios. Puedes escribir el primero.</li>'; return; }
  ul.innerHTML=cs.map(function(c){ return '<li><span class="who">'+esc(c.name)+'</span><span class="when">'+esc(fmtDay(c.at))+'</span><p>'+esc(c.text)+'</p></li>'; }).join(''); }
function loadComments(id){ var ul=document.getElementById('clist');
  if(!API){ ul.innerHTML='<li>Los comentarios funcionan en la web publicada.</li>'; return; }
  fetch('/api/comments?post='+encodeURIComponent(id)).then(function(r){ if(!r.ok) throw 0; return r.json(); })
   .then(function(d){ if(current&&current.id===id) renderComments(d.comments||[]); })
   .catch(function(){ ul.innerHTML='<li>No se pudieron cargar los comentarios. Vuelve a abrir la entrada en unos segundos.</li>'; }); }
function sendComment(e){ e.preventDefault(); var f=e.target, st=document.getElementById('c-status'), btn=f.querySelector('button[type=submit]');
  var E=f.elements; var data={post:current.id,name:E.namedItem('name').value.trim(),email:E.namedItem('email').value.trim(),text:E.namedItem('text').value.trim(),website:E.namedItem('website').value};
  if(!data.name||!data.text){ st.textContent='Escribe tu nombre y tu comentario.'; return; }
  if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)){ st.textContent='Revisa el correo: parece incompleto.'; return; }
  if(!API){ st.textContent='Los comentarios funcionan en la web publicada.'; return; }
  btn.disabled=true; st.textContent='Publicando…';
  fetch('/api/comments',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)})
   .then(function(r){ return r.json().then(function(j){ if(!r.ok) throw j; return j; }); })
   .then(function(d){ renderComments(d.comments||[]); f.reset(); st.textContent='Comentario publicado.'; })
   .catch(function(err){ st.textContent=(err&&err.error)||'No se pudo publicar. Inténtalo de nuevo.'; })
   .then(function(){ btn.disabled=false; }); }
})();
