// Sistema de analisis de grafos - Bloque A UPEA
// Algoritmos: DFS, BFS, Dijkstra, Kruskal y Prim

const $=s=>document.querySelector(s),K=(a,b)=>a<b?a+'|'+b:b+'|'+a;
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
// Datos del grafo del Bloque A (mapa levantado en campo)
// Vertices: [codigo, nombre, posicion x, posicion y]
// Aristas:  [origen, destino, distancia en metros]
const GRAFO_BASE = {
    V: [
        ["A", "Emblemático", 50, 260],
        ["B", "Sistemas", 140, 390],
        ["C", "Edificio Electrónica", 140, 130],
        ["D", "Lingüística", 200, 390],
        ["E", "Arquitectura", 210, 130],
        ["F", "C. Educación", 250, 390],
        ["G", "Derecho", 320, 130],
        ["H", "Ing. Civil", 320, 390],
        ["I", "Bloque antiguo (carreras varias)", 390, 390],
        ["J", "Comercio Internacional y otras carreras", 480, 390],
        ["K", "Medicina", 590, 390],
        ["L", "Enfermería", 590, 130],
        ["M", "Odontología", 700, 130],
        ["N", "Veterinaria", 700, 390]
    ],
    E: [
        ["A", "B", 170],
        ["A", "C", 165],
        ["B", "D", 60],
        ["D", "F", 20],
        ["F", "H", 50],
        ["H", "I", 70],
        ["I", "J", 90],
        ["J", "K", 180],
        ["K", "N", 50],
        ["N", "M", 550],
        ["C", "E", 70],
        ["E", "G", 40],
        ["G", "H", 100],
        ["G", "L", 350],
        ["L", "M", 45],
        ["K", "L", 150]
    ]
};

let V=[],E=[],hl={e:new Set(),n:new Map()},last={},evI=-1,eeI=-1;
function base()
{
    V=GRAFO_BASE.V.map(([id,name,x,y])=>({id,name,desc:"Bloque A – UPEA",x,y}));
    E=GRAFO_BASE.E.map(([a,b,w])=>({a,b,w}))
}

const nm=id=>
{
    const v=V.find(v=>v.id===id);
    return v?id+' ('+esc(v.name)+')':id
};
const ei=(a,b)=>E.findIndex(e=>K(e.a,e.b)===K(a,b)),en=i=>E[i].a+'–'+E[i].b+' ('+E[i].w+' m)';
const tbl=(h,r)=>'<table><tr>'+h.map(x=>'<th>'+x+'</th>').join('')+'</tr>'+r.map(x=>'<tr>'+x.map(y=>'<td>'
    +y+'</td>').join('')+'</tr>').join('')+'</table>';
function msg(t,k=0)
{
    const m=$('#msg');
    m.textContent=t;
    m.className='m'+k;
    m.style.display='block';
    clearTimeout(msg.t);
    msg.t=setTimeout(()=>m.style.display='none',60000)
}

function adj()
{
    const m={};
    V.forEach(v=>m[v.id]=[]);
    E.forEach((e,i)=>
    {
        if(m[e.a]&&m[e.b])
        {
            m[e.a].push({t:e.b,w:e.w,i});
            m[e.b].push({t:e.a,w:e.w,i})
        }
    });
    for(const k in m)
        m[k].sort((x,y)=>x.t<y.t?-1:x.t>y.t?1:0);
    return m
}

function comps()
{
    const m=adj(),sn=new Set(),r=[];
    V.forEach(v=>
    {
        if(!sn.has(v.id))
        {
            const c=[],st=[v.id];
            sn.add(v.id);
            while(st.length)
            {
                const u=st.pop();
                c.push(u);
                m[u].forEach(x=>
                {
                    if(!sn.has(x.t))
                    {
                        sn.add(x.t);
                        st.push(x.t)
                    }
                })
            }
            r.push(c.sort())
        }
    });
    return r
}

/* ---------- Algoritmos ---------- */
function dfs(s)
{
    const m=adj(),seen=new Set(),order=[],tree=[],back=new Set();
    (function go(u,pe)
    {
        seen.add(u);
        order.push(u);
        for(const x of m[u])
        {
            if(x.i===pe)
                continue;
            if(!seen.has(x.t))
            {
                tree.push(x.i);
                go(x.t,x.i)
            }
            else
                back.add(x.i)
        }
    })(s,-1);
    return{order,tree,back:[...back]}
}

function bfs(s,d)
{
    const m=adj(),lv={[s]:0},par={[s]:null},q=[s],order=[],tr=[];
    while(q.length)
    {
        const u=q.shift();
        order.push(u);
        for(const x of m[u])
            if(!(x.t in lv))
            {
                lv[x.t]=lv[u]+1;
                par[x.t]=u;
                q.push(x.t)
            }
        tr.push('Sale <b>'+u+'</b> (nivel '+lv[u]+') → cola: ['+(q.join(', ')||'vacía')+']')
    }
    const path=[];
    if(d in lv)
        for(let c=d;c!=null;c=par[c])
            path.unshift(c);
    return{lv,order,tr,path}
}

function pathE(p)
{
    const r=[];
    for(let i=0;i<p.length-1;i++)
        r.push(ei(p[i],p[i+1]));
    return r
}

function dij(s,d)
{
    const m=adj(),D={},P={},done=[];
    V.forEach(v=>D[v.id]=Infinity);
    D[s]=0;
    for(;;)
    {
        let u=null;
        for(const v of V)
            if(!done.includes(v.id)&&D[v.id]<Infinity&&(u===null||D[v.id]<D[u]))
                u=v.id;
        if(u===null)
            break;
        done.push(u);
        for(const x of m[u])
            if(D[u]+x.w<D[x.t])
            {
                D[x.t]=D[u]+x.w;
                P[x.t]=u
            }
    }
    const path=[];
    if(D[d]<Infinity)
        for(let c=d;c!=null;c=P[c])
            path.unshift(c);
    return{D,P,done,path}
}

function kru()
{
    const p={};
    V.forEach(v=>p[v.id]=v.id);
    const f=x=>p[x]===x?x:(p[x]=f(p[x]));
    const so=E.map((e,i)=>({...e,i})).sort((x,y)=>x.w-y.w||x.i-y.i),acc=[],st=[];
    let c=0;
    for(const e of so)
    {
        const a=f(e.a),b=f(e.b);
        if(a!==b)
        {
            p[a]=b;
            acc.push(e);
            c+=e.w;
            st.push(1)
        }
        else
            st.push(0)
    }
    return{so,st,acc,c}
}

function pri(s)
{
    const T=new Set([s]),acc=[],steps=[];
    let c=0;
    for(;;)
    {
        let b=null;
        E.forEach((e,i)=>
        {
            if(T.has(e.a)!==T.has(e.b)&&(!b||e.w<b.w))
                b={...e,i}
        });
        if(!b)
            break;
        const n=T.has(b.a)?b.b:b.a;
        T.add(n);
        acc.push(b);
        c+=b.w;
        steps.push({b,n,set:[...T].sort()})
    }
    return{acc,c,steps,T}
}

const tm=f=>
{
    const t=performance.now();
    for(let i=0;i<300;i++)
        f();
    return((performance.now()-t)/300).toFixed(4)
};

/* ---------- Ejecución ---------- */
function run(k)
{
    if(!V.length)
        return msg('No hay vértices en el grafo.',1);
    const s=$('#so').value,d=$('#sd').value,cc=comps(),neg=E.filter(e=>e.w<0);
    let h='';
    hl={e:new Set(),n:new Map()};
    const conn=cc.length===1,warn=conn?'':'<p class="no">⚠ Grafo no conexo ('+cc.length+' componentes): '
        +cc.map(c=>'{'+c.join(', ')+'}').join(' ')+'</p>';
    if(k==='dfs')
    {
        const r=dfs(s);
        r.order.forEach((v,i)=>hl.n.set(v,i+1));
        r.tree.forEach(i=>hl.e.add(i));
        h='<h4>DFS desde '+nm(s)+'</h4><p><b>Orden de visita:</b> '+r.order.join(' → ')+'</p><p><b>Aristas utilizadas:</b> '
            +(r.tree.map(en).join(', ')||'—')+'</p><p><b>Nodos alcanzables ('+r.order.length+'/'+V.length
            +'):</b> '+r.order.join(', ')+'</p><p><b>Componentes conexos ('+cc.length+'):</b> '+cc.map(c=>'{'
            +c.join(', ')+'}').join(' ')+'</p><p><b>Ciclos / caminos alternativos:</b> '+(r.back.length?r.back.length
            +' arista(s) fuera del árbol DFS: '+r.back.map(en).join(', '):'no se detectaron ciclos')+'</p>'
            +warn
    }
    else if(k==='bfs')
    {
        const r=bfs(s,d);
        r.order.forEach((v,i)=>hl.n.set(v,i+1));
        pathE(r.path).forEach(i=>hl.e.add(i));
        const L={};
        r.order.forEach(v=>(L[r.lv[v]]=L[r.lv[v]]||[]).push(v));
        h='<h4>BFS desde '+nm(s)+'</h4><p><b>Recorrido por niveles:</b><br>'+Object.keys(L).map(l=>'Nivel '
            +l+': '+L[l].join(', ')).join('<br>')+'</p><p><b>Nodos visitados:</b> '+r.order.join(' → ')
            +'</p>'+ (r.path.length?'<p><b>Mínimo de aristas '+s+' → '+d+':</b> '+(r.path.length-1)+'<br><b>Camino:</b> '
            +r.path.join(' → ')+' <small>(mínimo en nº de aristas, no en metros)</small></p>':'<p class="no">No existe camino entre '
            +s+' y '+d+'.</p>')+'<p><b>Estructura de la cola:</b><br>'+r.tr.join('<br>')+'</p>'+warn
    }
    else if(k==='dij')
    {
        if(neg.length)
        {
            h='<h4>Dijkstra</h4><p class="no">⚠ Dijkstra no es aplicable: existen pesos negativos ('+neg.map(e=>e.a
                +'–'+e.b+': '+e.w).join(', ')+').</p>';
            msg('Dijkstra no aplicable por pesos negativos.',2)
        }
        else
        {
            const r=dij(s,d);
            r.path.forEach(v=>hl.n.set(v,''));
            pathE(r.path).forEach(i=>hl.e.add(i));
            h='<h4>Dijkstra: '+nm(s)+' → '+nm(d)+'</h4>'+(r.path.length?'<p><b>Costo mínimo:</b> '+r.D[d]
                +' m<br><b>Camino:</b> '+r.path.join(' → ')+'</p>':'<p class="no">No existe camino entre '+s
                +' y '+d+'.</p>')+ tbl(['Nodo','Distancia desde '+s,'Predecesor','Orden'],V.map(v=>[v.id,r.D[v.id]===Infinity?'∞':r.D[v.id],
                r.P[v.id]||'—',r.done.indexOf(v.id)+1||'—']))+warn
        }
    }
    else if(k==='kru')
    {
        const r=kru();
        r.acc.forEach(e=>hl.e.add(e.i));
        h='<h4>Kruskal</h4>'+(conn?'<p class="ok">✔ Verificado: grafo no dirigido, ponderado y conexo.</p>':warn
            +'<p class="no">Se obtiene un bosque de expansión mínima.</p>')+tbl(['#','Arista','Peso (m)',
            'Estado'],r.so.map((e,i)=>[i+1,e.a+'–'+e.b,e.w,r.st[i]?'<span class="ok">Aceptada</span>':'<span class="no">Rechazada (ciclo)</span>']))
            +'<p><b>Árbol resultante:</b> '+r.acc.map(e=>e.a+'–'+e.b+' ('+e.w+')').join(', ')+'</p><p><b>Costo total:</b> '
            +r.c+' m · <b>Aristas:</b> '+r.acc.length+'</p>'
    }
    else if(k==='pri')
    {
        const r=pri(s);
        r.acc.forEach(e=>hl.e.add(e.i));
        r.T.forEach(v=>hl.n.set(v,''));
        h='<h4>Prim desde '+nm(s)+'</h4>'+(r.T.size<V.length?warn+'<p class="no">Solo se alcanzan '
            +r.T.size+' de '+V.length+' nodos.</p>':'')+tbl(['Iter.','Arista elegida','Peso (m)','Nodo incorporado',
            'Conjunto de nodos'],r.steps.map((x,i)=>[i+1,x.b.a+'–'+x.b.b,x.b.w,x.n,x.set.join(', ')]))+'<p><b>Costo total:</b> '
            +r.c+' m · <b>Aristas:</b> '+r.acc.length+'</p>'
    }
    else
    {
        const a=kru(),b=pri(s);
        a.acc.forEach(e=>hl.e.add(e.i));
        const same=a.acc.map(e=>e.i).sort((x,y)=>x-y).join()===b.acc.map(e=>e.i).sort((x,y)=>x-y).join();
        h='<h4>Comparación Kruskal vs Prim (Prim desde '+s+')</h4>'+tbl(['Criterio','Kruskal','Prim'],
            [['Costo total',a.c+' m',b.c+' m'],['Número de aristas',a.acc.length,b.acc.length],['Orden de selección',
            a.acc.map(e=>e.a+e.b).join(', '),b.acc.map(e=>e.a+e.b).join(', ')],['Tiempo de ejecución',tm(kru)
            +' ms',tm(()=>pri(s))+' ms'],['Ventajas','Sencillo; opera sobre la lista de aristas; eficiente en grafos dispersos',
            'Crece desde un nodo elegido; útil si hay un punto de partida'],['Limitaciones','Requiere ordenar aristas y Union-Find',
            'Depende del nodo inicial; revisa aristas frontera en cada paso']])+ '<p><b>¿Costos iguales?</b> '
            +(a.c===b.c?'<span class="ok">Sí</span>':'<span class="no">No: revisar datos o justificar</span>')
            +' · <b>¿Mismo árbol?</b> '+(same?'Sí':'No (posibles árboles distintos con igual costo)')+'</p>'
            +warn
    }
    last[k]=h;
    $('#out').innerHTML=h;
    draw()
}

function clr()
{
    hl={e:new Set(),n:new Map()};
    $('#out').innerHTML='<small>Análisis reiniciado.</small>';
    draw()
}

/* ---------- Dibujo ---------- */
function draw()
{
    const P=id=>V.find(v=>v.id===id);
    let s='';
    E.forEach((e,i)=>
    {
        const a=P(e.a),b=P(e.b);
        if(!a||!b)
            return;
        const h=hl.e.has(i);
        s+='<line x1="'+a.x+'" y1="'+a.y+'" x2="'+b.x+'" y2="'+b.y+'" stroke="'+(h?'#c8102e':e.w<0?'#e08a00':'#9aa8ba')
            +'" stroke-width="'+(h?5:2.5)+'"/><text x="'+(a.x+b.x)/2+'" y="'+((a.y+b.y)/2-4)+'" font-size="11" text-anchor="middle" fill="#1c2733" stroke="#fafcff" stroke-width="3" paint-order="stroke">'
            +e.w+'</text>'
    });
    V.forEach(v=>
    {
        const on=hl.n.has(v.id),o=hl.n.get(v.id);
        s+='<g data-id="'+esc(v.id)+'" style="cursor:grab"><title>'+esc(v.id+' – '+v.name+(v.desc?' · '
            +v.desc:''))+'</title><circle cx="'+v.x+'" cy="'+v.y+'" r="17" fill="'+(on?'#c8102e':'#12355b')
            +'" stroke="#fff" stroke-width="2"/><text x="'+v.x+'" y="'+(v.y+5)+'" text-anchor="middle" font-size="13" font-weight="700" fill="#fff">'
            +esc(v.id)+'</text>'+ '<text x="'+v.x+'" y="'+(v.y+34)+'" text-anchor="middle" font-size="10" fill="#33475b">'
            +esc(v.name.length>16?v.name.slice(0,15)+'…':v.name)+'</text>'+(on&&o!==''?'<circle cx="'+(v.x
            +14)+'" cy="'+(v.y-14)+'" r="9" fill="#f59e0b"/><text x="'+(v.x+14)+'" y="'+(v.y-10)+'" text-anchor="middle" font-size="11" font-weight="700">'
            +o+'</text>':'')+'</g>'
    });
    $('#g').innerHTML=s
}

let drag=null;
const svg=$('#g');
svg.addEventListener('pointerdown',e=>
{
    const g=e.target.closest('g[data-id]');
    if(g)
    {
        drag=V.find(v=>v.id===g.dataset.id);
        svg.setPointerCapture(e.pointerId)
    }
});
svg.addEventListener('pointermove',e=>
{
    if(!drag)
        return;
    const p=svg.createSVGPoint();
    p.x=e.clientX;
    p.y=e.clientY;
    const q=p.matrixTransform(svg.getScreenCTM().inverse());
    drag.x=Math.round(q.x);
    drag.y=Math.round(q.y);
    draw()
});
svg.addEventListener('pointerup',()=>drag=null);

/* ---------- Datos: vértices y aristas ---------- */
function rd()
{
    const o=V.map(v=>'<option value="'+esc(v.id)+'">'+esc(v.id)+' – '+esc(v.name)+'</option>').join('');
    ['so','sd','ea','eb'].forEach(i=>
    {
        const s=$('#'+i),c=s.value;
        s.innerHTML=o;
        if(V.some(v=>v.id===c))
            s.value=c
    });
    if(!V.some(v=>v.id===$('#sd').value)&&V.length)
        $('#sd').value=V[V.length-1].id;
    $('#vt').innerHTML=tbl(['Código','Nombre','Descripción',''],V.map((v,i)=>[esc(v.id),esc(v.name),
        esc(v.desc||''),'<button class="x s" onclick="ev('+i+')">Editar</button> <button class="x d" onclick="vdel('
        +i+')">Eliminar</button>']));
    $('#et').innerHTML=tbl(['Origen','Destino','Peso (m)',''],E.map((e,i)=>[esc(e.a),esc(e.b),e.w,
        '<button class="x s" onclick="ee('+i+')">Editar</button> <button class="x d" onclick="edel('
        +i+')">Eliminar</button>']));
    const m=adj(),ids=V.map(v=>v.id);
    $('#t2').innerHTML='<h3>Matriz de pesos (0 = sin arista)</h3><div class="sc">'+tbl([''].concat(ids),
        ids.map(a=>['<b>'+esc(a)+'</b>'].concat(ids.map(b=>
    {
        const i=ei(a,b);
        return i<0?0:E[i].w
    }))))+'</div><h3>Lista de adyacencia</h3><div class="sc">'+ids.map(a=>'<b>'+esc(a)+'</b> → '
        +(m[a].map(x=>esc(x.t)+'('+x.w+')').join(', ')||'—')).join('<br>')+'</div><h3>Grado de cada vértice</h3>'
        +tbl(ids.map(esc),[ids.map(a=>m[a].length)])+'<p><b>|V| = '+V.length+' · |E| = '+E.length+'</b> · Componentes conexos: '
        +comps().length+'</p>'
}

function upd()
{
    hl={e:new Set(),n:new Map()};
    rd();
    draw()
}

function ev(i)
{
    evI=i;
    const v=V[i];
    $('#vi').value=v.id;
    $('#vi').disabled=true;
    $('#vn').value=v.name;
    $('#vd').value=v.desc||'';
    $('#vb').textContent='Guardar cambios'
}

function vclr()
{
    evI=-1;
    ['vi','vn','vd'].forEach(i=>$('#'+i).value='');
    $('#vi').disabled=false;
    $('#vb').textContent='Agregar vértice'
}

function vsave()
{
    const id=$('#vi').value.trim(),n=$('#vn').value.trim(),d=$('#vd').value.trim();
    if(!id||!n)
        return msg('Datos incompletos: código y nombre son obligatorios.',1);
    if(!/^[\w.-]+$/.test(id))
        return msg('Código inválido: use letras, números, punto o guion.',1);
    if(evI<0)
    {
        if(V.some(v=>v.id===id))
            return msg('Vértice duplicado: '+id,1);
        const k=V.length;
        V.push({id,name:n,desc:d,x:380+150*Math.cos(k),y:260+120*Math.sin(k)});
        msg('Vértice agregado.')
    }
    else
    {
        Object.assign(V[evI],{name:n,desc:d});
        msg('Vértice modificado.')
    }
    vclr();
    upd()
}

function vdel(i)
{
    const id=V[i].id;
    if(!confirm('¿Eliminar '+id+' y sus aristas?'))
        return;
    V.splice(i,1);
    E=E.filter(e=>e.a!==id&&e.b!==id);
    upd()
}

function ee(i)
{
    eeI=i;
    const e=E[i];
    $('#ea').value=e.a;
    $('#eb').value=e.b;
    $('#ew').value=e.w;
    $('#eb2').textContent='Guardar cambios'
}

function eclr()
{
    eeI=-1;
    $('#ew').value='';
    $('#eb2').textContent='Agregar arista'
}

function esave()
{
    const a=$('#ea').value,b=$('#eb').value,ws=$('#ew').value.trim(),w=Number(ws);
    if(!a||!b||ws==='')
        return msg('Datos incompletos: origen, destino y peso.',1);
    if(!isFinite(w))
        return msg('Peso no numérico.',1);
    if(a===b)
        return msg('No se permiten lazos (origen = destino).',1);
    const d=E.findIndex((e,i)=>i!==eeI&&K(e.a,e.b)===K(a,b));
    if(d>=0)
        return msg('Arista duplicada: '+a+'–'+b+' ya existe ('+E[d].w+' m).',1);
    if(eeI<0)
        E.push({a,b,w});
    else
        E[eeI]={a,b,w};
    msg(w<0?'Arista guardada. Aviso: peso negativo, Dijkstra no será aplicable.':'Arista guardada.',
        w<0?2:0);
    eclr();
    upd()
}

function edel(i)
{
    E.splice(i,1);
    upd()
}

/* ---------- Archivos ---------- */
const dl=(n,t,ty)=>
{
    const a=document.createElement('a');
    a.href=URL.createObjectURL(new Blob([t],{type:ty}));
    a.download=n;
    a.click()
};
const exp=()=>({vertices:V.map(v=>({id:v.id,nombre:v.name,descripcion:v.desc,x:v.x,y:v.y})),
    aristas:E.map(e=>({origen:e.a,destino:e.b,peso:e.w,unidad:'metros'}))});
const csvV=()=>'id,nombre,descripcion\n'+V.map(v=>[v.id,v.name,v.desc||''].join(',')).join('\n'),
    csvE=()=>'origen,destino,peso,unidad\n'+E.map(e=>[e.a,e.b,e.w,'metros'].join(',')).join('\n');
$('#ff').onchange=async e=>
{
    const f=e.target.files[0];
    if(!f)
        return;
    e.target.value='';
    let vs=null,es=null,errs=[];
    try
    {
        const t=(await f.text()).replace(/^\uFEFF/,'');
        if(/\.json$/i.test(f.name))
        {
            const j=JSON.parse(t);
            vs=j.vertices||j.vértices||null;
            es=j.aristas||null
        }
        else
        {
            const r=t.split(/\r?\n/).map(l=>l.trim()).filter(Boolean).map(l=>l.split(/[,;]/).map(x=>x.trim())),
                h=r[0].map(x=>x.toLowerCase()),rows=r.slice(1).map(c=>Object.fromEntries(h.map((k,i)=>[k,c[i]||''])));
            if(h.includes('nombre'))
                vs=rows;
            else if(h.includes('destino'))
                es=rows;
            else
                throw Error('encabezados no reconocidos')
        }
    }
    catch(x)
    {
        return msg('Archivo inválido: '+x.message,1)
    }
    if(vs)
    {
        const nv=[];
        vs.forEach((r,n)=>
        {
            const id=String(r.id||'').trim(),nb=String(r.nombre||'').trim();
            if(!id||!nb)
                errs.push('vértice fila '+(n+1)+' incompleto');
            else if(nv.some(v=>v.id===id))
                errs.push('vértice duplicado '+id);
            else
                nv.push({id,name:nb,desc:r.descripcion||'',x:isFinite(r.x)&&r.x!==''?+r.x:null,y:isFinite(r.y)&&r.y!==''?
                    +r.y:null})
        });
        if(!nv.length)
            return msg('No se cargó ningún vértice válido. '+errs.slice(0,3).join('; '),1);
        nv.forEach((v,k)=>
        {
            if(v.x===null||v.y===null)
            {
                v.x=Math.round(380+300*Math.cos(2*Math.PI*k/nv.length));
                v.y=Math.round(260+150*Math.sin(2*Math.PI*k/nv.length))
            }
        });
        V=nv;
        E=[]
    }
    if(es)
    {
        const ne=[];
        es.forEach((r,n)=>
        {
            const a=String(r.origen||'').trim(),b=String(r.destino||'').trim(),ps=String(r.peso===undefined?'':r.peso).trim(),
                w=Number(ps);
            if(!a||!b||ps==='')
                errs.push('arista fila '+(n+1)+' incompleta');
            else if(!isFinite(w))
                errs.push('peso no numérico en '+a+'–'+b);
            else if(a===b)
                errs.push('lazo '+a);
            else if(!V.some(v=>v.id===a)||!V.some(v=>v.id===b))
                errs.push('vértice inexistente en '+a+'–'+b);
            else if(ne.some(x=>K(x.a,x.b)===K(a,b)))
                errs.push('arista duplicada '+a+'–'+b);
            else
                ne.push({a,b,w})
        });
        E=ne
    }
    upd();
    msg('Cargado: '+V.length+' vértices, '+E.length+' aristas.'+(errs.length?' Se omitieron '+errs.length
        +' registros: '+errs.slice(0,3).join('; '):''),errs.length?2:0)
};
function sample(k)
{
    base();
    if(k===1)
        V.push({id:'Z',name:'Nodo aislado',desc:'Sin conexiones',x:380,y:90});
    if(k===2)
        E=E.filter(e=>!['A|C','G|H','K|L','M|N'].includes(K(e.a,e.b)));
    if(k===3)
        E.forEach(e=>e.w=100);
    if(k===4)
        E[0].w=-170;
    upd();
    msg('Caso cargado.')
}

/* ---------- Reporte ---------- */
function strip(h)
{
    const d=document.createElement('div');
    d.innerHTML=h.replace(/<\/(p|h4|tr)>|<br>/g,'\n').replace(/<\/t[dh]>/g,' | ');
    return d.textContent.trim()
}

function rep()
{
    const s=$('#so').value,t=['REPORTE DE ANÁLISIS – GRAFO DEL BLOQUE A (UPEA)','Fecha: '+new Date().toLocaleString('es-BO'),
        '','Grafo no dirigido y ponderado (metros). |V|='+V.length+', |E|='+E.length+'. Componentes conexos: '
        +comps().length+'.'];
    for(const k in last)
        t.push('','----------',strip(last[k]));
    t.push('','RECOMENDACIONES (generadas a partir de los datos)');
    if(V.length&&!E.some(e=>e.w<0))
    {
        const r=dij(s,s);
        let f=s;
        V.forEach(v=>
        {
            if(r.D[v.id]<Infinity&&r.D[v.id]>r.D[f])
                f=v.id
        });
        const p=dij(s,f).path;
        t.push('- Desde '+s+', el destino más lejano es '+f+' a '+r.D[f]+' m (camino '+p.join(' → ')
            +'): priorizar señalética en ese trayecto.');
        const k=kru(),tot=E.reduce((a,e)=>a+e.w,0);
        t.push('- La red mínima que conecta los nodos alcanzables cuesta '+k.c+' m frente a '+tot+' m de la red completa (ahorro de '
            +(tot?((1-k.c/tot)*100).toFixed(1):0)+' %).')
    }
    const m=adj();
    let mx=null;
    V.forEach(v=>
    {
        if(!mx||m[v.id].length>m[mx].length)
            mx=v.id
    });
    if(mx)
        t.push('- El vértice con más conexiones es '+mx+' (grado '+m[mx].length+'): buen punto para un mapa o letrero principal.');
    $('#rp').textContent=t.join('\n')
}

function tab(n)
{
    document.querySelectorAll('.tab').forEach(x=>x.hidden=x.id!=='t'+n);
    [1,2,3].forEach(i=>$('#b'+i).className=i===n?'on':'');
    if(n===2)
        rd()
}

base();
rd();
$('#so').value='A';
$('#sd').value='B';
draw();
tab(1);