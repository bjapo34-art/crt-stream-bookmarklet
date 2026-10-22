# CRT Stream Filter Bookmarklet 📺⚡

Un bookmarklet ultraligero escrito en JavaScript puro que superpone un **filtro de monitor CRT clásico** (con líneas de escaneo o *scanlines* y ruido estático animado) en tiempo real sobre cualquier reproductor de video HTML5 en plataformas de streaming como **Netflix, YouTube, Twitch** y más.

---

## ✨ Características Principales

* **Detección Automática:** Encuentra y se acopla dinámicamente al elemento `<video>` activo en la página, adaptándose a cambios de tamaño y modo de pantalla completa (*fullscreen*).
* **Cero Dependencias:** Desarrollado con JavaScript nativo puro, sin librerías externas ni frameworks pesados.
* **Textura de Ruido Procedural:** Genera un patrón de ruido estático gaussiano optimizado mediante un lienzo de canvas interno.
* **Control por Teclado:** Permite alternar capas de forma instantánea sin interrumpir la reproducción.
* **Modo Toggle:** Vuelve a hacer clic en el marcador (o ejecuta el script de nuevo) para apagar y limpiar por completo el DOM.

---

## ⌨️ Atajos de Teclado

Una vez que el filtro esté activo sobre un video, puedes usar las siguientes teclas:

| Tecla | Acción |
| :---: | :--- |
| **`1`** | Activa / Desactiva las líneas de escaneo (*Scanlines*) |
| **`2`** | Activa / Desactiva el ruido estático animado (*Noise*) |

---

## 🚀 Instalación y Uso

1. Crea un nuevo marcador en la barra de favoritos de tu navegador web.
2. Asígnale el nombre que prefieras (por ejemplo: `📺 CRT Filter`).
3. Copia el siguiente código comprimido y pégalo en la sección de **URL** (o destino) del marcador:

```javascript
javascript:(function(){if(window.__fx){window.__fx.stop();return}const T=1,D=0.5,V=false,A=0.08,G=1,FPS=24,S=40,N=512,dpr=window.devicePixelRatio||1,t=T/dpr,a=1-D,on={s:true,n:true},base="position:fixed;left:0;top:0;pointer-events:none;z-index:2147483647;display:none;overflow:hidden;",sc=document.createElement("div"),gr=document.createElement("div"),cv=document.createElement("canvas");sc.style.cssText=base+"background:repeating-linear-gradient("+(V?"to right":"to bottom")+",transparent 0,transparent "+t+"px,rgba(0,0,0,"+a+") "+t+"px,rgba(0,0,0,"+a+") "+2*t+"px)";gr.style.cssText=base+"mix-blend-mode:overlay;opacity:"+A;cv.style.cssText="position:absolute;left:0;top:0;will-change:transform";gr.appendChild(cv);const cx=cv.getContext("2d",{alpha:false}),pat=(()=>{const tc=document.createElement("canvas");tc.width=tc.height=N;const n=N*N,fa=new Float32Array(n),ga=new Float32Array(n);for(let i=0;i<n;i++)fa[i]=Math.random()+Math.random()+Math.random()+Math.random();for(let y=0;y<N;y++)for(let 2d"),im="tx.createImageData(N,N),px=im.data;for(let"" Math.max(0,Math.min(255,128+(fa[i]-m)/q*S));px[4*i]="px[4*i+1]=px[4*i+2]=c;px[4*i+3]=255}tx.putImageData(im,0,0);return"" b="null,mx=0;document.querySelectorAll(" cx.createPattern(tc,"repeat")})();let e="fa[i]-m;q+=e*e}q=Math.sqrt(q/n);const" i="0;i<n;i++){const" id,last="0,lp=-1e9,cur=null,cw=0,ch=0,sw=0,sh=0,sx=NaN,sy=NaN;function" m="0,q=0;for(let" pick(){let tx="tc.getContext(" video").forEach(v=" c=" x="0;x<N;x++){const" y="0;y<N;y++)for(let">{const r=v.getBoundingClientRect(),s=r.width*r.height;if(s>mx&&r.bottom>0&&r.right>0){mx=s;b=v}});return b}function show(e,f){const d=f?"block":"none";if(e.style.display!==d)e.style.display=d}function grow(w,h){const nw=Math.ceil((Math.ceil(w/G)+N)/256)*256,nh=Math.ceil((Math.ceil(h/G)+N)/256)*256;if(nw>cw||nh>ch){cw=Math.max(cw,nw);ch=Math.max(ch,nh);cv.width=cw;cv.height=ch;cv.style.width=cw*G+"px";cv.style.height=ch*G+"px";cx.fillStyle=pat;cx.fillRect(0,0,cw,ch)}}function loop(ts){const f=document.fullscreenElement,p=f&&f.tagName!=="VIDEO"?f:document.body;if(sc.parentNode!==p)p.appendChild(sc);if(gr.parentNode!==p)p.appendChild(gr);if(!cur||!cur.isConnected||ts-lp>500){cur=pick();lp=ts}let vis=false;if(cur){const r=cur.getBoundingClientRect(),w=r.width,h=r.height;if(w>=1&&h>=1){vis=true;const L=Math.round(r.left*dpr)/dpr,Tp=Math.round(r.top*dpr)/dpr;if(L!==sx||Tp!==sy){sx=L;sy=Tp;sc.style.transform=gr.style.transform="translate("+L+"px,"+Tp+"px)"}if(w!==sw||h!==sh){sw=w;sh=h;sc.style.width=gr.style.width=w+"px";sc.style.height=gr.style.height=h+"px";grow(w,h)}}}show(sc,vis&&on.s);show(gr,vis&&on.n);if(vis&&on.n&&!cur.paused&&ts-last>1000/FPS){last=ts;cv.style.transform="translate("+(-(Math.random()*N|0)*G)+"px,"+(-(Math.random()*N|0)*G)+"px)"}id=requestAnimationFrame(loop)}const key=e=>{if(e.ctrlKey||e.altKey||e.metaKey)return;const el=e.target;if(el&&(/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName)||el.isContentEditable))return;if(e.key==="1")on.s=!on.s;else if(e.key==="2")on.n=!on.n;else return;e.preventDefault();e.stopImmediatePropagation()};window.addEventListener("keydown",key,true);window.__fx={stop(){cancelAnimationFrame(id);sc.remove();gr.remove();window.removeEventListener("keydown",key,true);delete window.__fx}};id=requestAnimationFrame(loop)})();