(function () {
    // Si ya está activo, lo detenemos y removemos
    if (window.__fx) {
        window.__fx.stop();
        return;
    }

    // Configuración general del efecto CRT
    const T = 1;              // Grosor base de las scanlines
    const D = 0.5;            // Intensidad de oscurecimiento (Darkness)
    const V = false;          // Orientación: false = horizontal, true = vertical
    const A = 0.08;           // Opacidad de la capa de ruido estático
    const G = 1;              // Escala de píxeles
    const FPS = 24;           // Cuadros por segundo de la animación de ruido
    const S = 40;             // Fuerza/contraste del ruido
    const N = 512;            // Resolución de la textura de ruido (512x512)

    const dpr = window.devicePixelRatio || 1;
    const t = T / dpr;
    const a = 1 - D;
    const on = { s: true, n: true }; // Estados iniciales: Scanlines (s), Noise (n)

    const baseStyle = "position:fixed;left:0;top:0;pointer-events:none;z-index:2147483647;display:none;overflow:hidden;";
    
    // Creación de elementos DOM para el filtro
    const sc = document.createElement("div"); // Contenedor de Scanlines
    const gr = document.createElement("div"); // Contenedor de Ruido
    const cv = document.createElement("canvas"); // Lienzo para la textura de ruido

    // Aplicar estilos iniciales
    sc.style.cssText = baseStyle + "background:repeating-linear-gradient(" + (V ? "to right" : "to bottom") + ",transparent 0,transparent " + t + "px,rgba(0,0,0," + a + ") " + t + "px,rgba(0,0,0," + a + ") " + (2 * t) + "px)";
    gr.style.cssText = baseStyle + "mix-blend-mode:overlay;opacity:" + A;
    cv.style.cssText = "position:absolute;left:0;top:0;will-change:transform";
    gr.appendChild(cv);

    const cx = cv.getContext("2d", { alpha: false });

    // Generador de textura de ruido procedural estilo Gaussiano
    const pat = (() => {
        const tc = document.createElement("canvas");
        tc.width = tc.height = N;
        const n = N * N, fa = new Float32Array(n), ga = new Float32Array(n);
        
        for (let i = 0; i < n; i++) fa[i] = Math.random() + Math.random() + Math.random() + Math.random();
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
            const i = y * N + x;
            ga[i] = fa[i + (x ? -1 : N - 1)] + 2 * fa[i] + fa[i + (x < N - 1 ? 1 : 1 - N)];
        }
        for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) {
            const i = y * N + x;
            fa[i] = ga[i + (y ? -N : n - N)] + 2 * ga[i] + ga[i + (y < N - 1 ? N : N - n)];
        }
        
        let m = 0, q = 0;
        for (let i = 0; i < n; i++) m += fa[i];
        m /= n;
        for (let i = 0; i < n; i++) {
            const e = fa[i] - m;
            q += e * e;
        }
        q = Math.sqrt(q / n);

        const tx = tc.getContext("2d"), im = tx.createImageData(N, N), px = im.data;
        for (let i = 0; i < n; i++) {
            const c = Math.max(0, Math.min(255, 128 + (fa[i] - m) / q * S));
            px[4 * i] = px[4 * i + 1] = px[4 * i + 2] = c;
            px[4 * i + 3] = 255;
        }
        tx.putImageData(im, 0, 0);
        return cx.createPattern(tc, "repeat");
    })();

    let id, last = 0, lp = -1e9, cur = null, cw = 0, ch = 0, sw = 0, sh = 0, sx = NaN, sy = NaN;

    // Detectar el reproductor de video activo en la página
    function pick() {
        let b = null, mx = 0;
        document.querySelectorAll("video").forEach(v => {
            const r = v.getBoundingClientRect(), s = r.width * r.height;
            if (s > mx && r.bottom > 0 && r.right > 0) { mx = s; b = v; }
        });
        return b;
    }

    function show(e, f) {
        const d = f ? "block" : "none";
        if (e.style.display !== d) e.style.display = d;
    }

    function grow(w, h) {
        const nw = Math.ceil((Math.ceil(w / G) + N) / 256) * 256;
        const nh = Math.ceil((Math.ceil(h / G) + N) / 256) * 256;
        if (nw > cw || nh > ch) {
            cw = Math.max(cw, nw); ch = Math.max(ch, nh);
            cv.width = cw; cv.height = ch;
            cv.style.width = (cw * G) + "px"; cv.style.height = (ch * G) + "px";
            cx.fillStyle = pat; cx.fillRect(0, 0, cw, ch);
        }
    }

    // Bucle de renderizado sincronizado al reproductor
    function loop(ts) {
        const f = document.fullscreenElement, p = f && f.tagName !== "VIDEO" ? f : document.body;
        if (sc.parentNode !== p) p.appendChild(sc);
        if (gr.parentNode !== p) p.appendChild(gr);

        if (!cur || !cur.isConnected || ts - lp > 500) {
            cur = pick();
            lp = ts;
        }

        let vis = false;
        if (cur) {
            const r = cur.getBoundingClientRect(), w = r.width, h = r.height;
            if (w >= 1 && h >= 1) {
                vis = true;
                const L = Math.round(r.left * dpr) / dpr, Tp = Math.round(r.top * dpr) / dpr;
                if (L !== sx || Tp !== sy) {
                    sx = L; sy = Tp;
                    sc.style.transform = gr.style.transform = "translate(" + L + "px," + Tp + "px)";
                }
                if (w !== sw || h !== sh) {
                    sw = w; sh = h;
                    sc.style.width = gr.style.width = w + "px";
                    sc.style.height = gr.style.height = h + "px";
                    grow(w, h);
                }
            }
        }

        show(sc, vis && on.s);
        show(gr, vis && on.n);

        if (vis && on.n && !cur.paused && ts - last > 1000 / FPS) {
            last = ts;
            cv.style.transform = "translate(" + (-(Math.random() * N | 0) * G) + "px," + (-(Math.random() * N | 0) * G) + "px)";
        }

        id = requestAnimationFrame(loop);
    }

    // Atajos de teclado: [1] Alterna Scanlines, [2] Alterna Ruido
    const key = e => {
        if (e.ctrlKey || e.altKey || e.metaKey) return;
        const el = e.target;
        if (el && (/^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName) || el.isContentEditable)) return;
        if (e.key === "1") on.s = !on.s;
        else if (e.key === "2") on.n = !on.n;
        else return;
        e.preventDefault();
        e.stopImmediatePropagation();
    };

    window.addEventListener("keydown", key, true);

    // Método para limpiar y apagar el efecto
    window.__fx = {
        stop() {
            cancelAnimationFrame(id);
            sc.remove();
            gr.remove();
            window.removeEventListener("keydown", key, true);
            delete window.__fx;
        }
    };

    id = requestAnimationFrame(loop);
})();