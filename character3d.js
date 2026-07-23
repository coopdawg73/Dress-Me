/* character-3d — a stylized 3D fashion mannequin rendered with three.js.
   Self-registers as <character-3d>. Reads garment flags/colors from attributes
   and rebuilds clothing meshes on change. Drag to spin (true 3D). */
(function () {
  const ATTRS = ['data-look'];

  function whenTHREE(cb) {
    if (window.THREE) return cb(window.THREE);
    const t = setInterval(() => { if (window.THREE) { clearInterval(t); cb(window.THREE); } }, 40);
  }

  class Character3D extends HTMLElement {
    static get observedAttributes() { return ATTRS; }
    constructor() { super(); this._ready = false; this._pending = false; }

    connectedCallback() {
      this.style.display = 'block';
      if (!this.style.height) this.style.height = '100%';
      whenTHREE((THREE) => this._init(THREE));
    }
    disconnectedCallback() {
      cancelAnimationFrame(this._raf);
      if (this._ro) this._ro.disconnect();
      if (this._renderer) this._renderer.dispose();
    }
    attributeChangedCallback() { if (this._ready) this._scheduleRebuild(); }

    _bool(name, def) { const v = this.getAttribute(name); if (v == null) return def; return v === 'true' || v === '1'; }
    _col(name, def) { const v = this.getAttribute(name); return v && v[0] === '#' ? v : def; }
    _look() { try { return JSON.parse(this.getAttribute('data-look') || '{}'); } catch (e) { return {}; } }

    _init(THREE) {
      this.THREE = THREE;
      const scene = new THREE.Scene();
      this.scene = scene;

      const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
      camera.position.set(0, 1.02, 4.35);
      camera.lookAt(0, 0.96, 0);
      this.camera = camera;

      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
      renderer.setClearColor(0x000000, 0);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.outputEncoding = THREE.sRGBEncoding;
      this._renderer = renderer;
      this.appendChild(renderer.domElement);
      renderer.domElement.style.cssText = 'width:100%;height:100%;display:block;cursor:grab;touch-action:none';

      // lighting — warm key + soft fill + cool rim
      scene.add(new THREE.AmbientLight(0xfff4ec, 0.55));
      const key = new THREE.DirectionalLight(0xffffff, 0.95); key.position.set(2.2, 3.2, 2.6); scene.add(key);
      const fill = new THREE.DirectionalLight(0xffd9c2, 0.38); fill.position.set(-2.6, 1.4, 1.8); scene.add(fill);
      const rim = new THREE.DirectionalLight(0xffe4d0, 0.4); rim.position.set(-1.2, 2.2, -2.8); scene.add(rim);

      const figure = new THREE.Group();
      figure.rotation.y = -0.32;
      scene.add(figure);
      this.figure = figure;

      this._buildBody(THREE, figure);
      this.garmentGroup = new THREE.Group();
      figure.add(this.garmentGroup);
      this._ready = true;
      this._rebuild();

      this._setupDrag(renderer.domElement);

      const resize = () => {
        const w = this.clientWidth || 200, h = this.clientHeight || 260;
        renderer.setSize(w, h, false);
        camera.aspect = w / h; camera.updateProjectionMatrix();
      };
      resize();
      this._ro = new ResizeObserver(resize); this._ro.observe(this);

      let last = performance.now();
      const tick = (now) => {
        const dt = Math.min(0.05, (now - last) / 1000); last = now;
        if (!this._dragging) {
          this._idle = (this._idle || 0) + dt;
          figure.rotation.y += dt * 0.22; // gentle turntable
        }
        // subtle breathing bob
        figure.position.y = Math.sin(now / 900) * 0.012;
        renderer.render(scene, camera);
        this._raf = requestAnimationFrame(tick);
      };
      this._raf = requestAnimationFrame(tick);
    }

    _mat(THREE, hex, opts) {
      return new THREE.MeshStandardMaterial(Object.assign({ color: new THREE.Color(hex), roughness: 0.5, metalness: 0.04 }, opts || {}));
    }

    // procedural woven-cloth bump map so garments read as fabric, not plastic
    _fabricTex() {
      if (this._fabric) return this._fabric;
      const THREE = this.THREE;
      const c = document.createElement('canvas'); c.width = c.height = 128;
      const x = c.getContext('2d');
      x.fillStyle = '#808080'; x.fillRect(0, 0, 128, 128);
      for (let i = 0; i < 128; i += 3) {
        x.strokeStyle = 'rgba(255,255,255,0.16)'; x.beginPath(); x.moveTo(i + 0.5, 0); x.lineTo(i + 0.5, 128); x.stroke();
        x.strokeStyle = 'rgba(0,0,0,0.14)'; x.beginPath(); x.moveTo(0, i + 0.5); x.lineTo(128, i + 0.5); x.stroke();
      }
      for (let i = 0; i < 3500; i++) { x.fillStyle = 'rgba(0,0,0,' + (Math.random() * 0.16) + ')'; x.fillRect(Math.random() * 128, Math.random() * 128, 1, 1); }
      const t = new THREE.CanvasTexture(c);
      t.wrapS = t.wrapT = THREE.RepeatWrapping; t.repeat.set(5, 5);
      this._fabric = t; return t;
    }

    _buildBody(THREE, figure) {
      const skin = this._mat(THREE, '#E7B085', { roughness: 0.74, metalness: 0 });
      const hair = this._mat(THREE, '#3A2C22', { roughness: 0.46, metalness: 0.06 });
      const dark = this._mat(THREE, '#241812', { roughness: 0.4 });
      const lip = this._mat(THREE, '#BF8272', { roughness: 0.5 });
      const white = this._mat(THREE, '#FAF5EC', { roughness: 0.45 });
      this._skin = skin;

      const lp = (r, y) => new THREE.Vector2(r, y);
      // torso as a lathe (dress-form)
      const torsoPts = [lp(0.001, 0.95), lp(0.15, 0.98), lp(0.163, 1.02), lp(0.12, 1.13), lp(0.108, 1.19),
        lp(0.132, 1.30), lp(0.16, 1.40), lp(0.135, 1.45), lp(0.001, 1.46)];
      const torso = new THREE.Mesh(new THREE.LatheGeometry(torsoPts, 48), skin);
      figure.add(torso);

      // neck + head
      const neck = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.062, 0.1, 24), skin);
      neck.position.y = 1.495; figure.add(neck);
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.14, 44, 44), skin);
      head.scale.set(0.92, 1.05, 0.95); head.position.y = 1.63; figure.add(head);
      // fuller cheeks + tapered jaw/chin
      const jaw = new THREE.Mesh(new THREE.SphereGeometry(0.108, 32, 32), skin);
      jaw.scale.set(0.84, 0.72, 0.9); jaw.position.set(0, 1.566, 0.008); figure.add(jaw);
      // ears
      [-1, 1].forEach((s) => { const ear = new THREE.Mesh(new THREE.SphereGeometry(0.03, 18, 18), skin); ear.scale.set(0.42, 1, 0.68); ear.position.set(s * 0.126, 1.628, 0.006); figure.add(ear); });

      // nose — small defined bridge + tip
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.02, 18, 18), skin); nose.scale.set(0.62, 1.15, 0.8); nose.position.set(0, 1.607, 0.126); figure.add(nose);
      const noseTip = new THREE.Mesh(new THREE.SphereGeometry(0.014, 16, 16), skin); noseTip.position.set(0, 1.597, 0.132); figure.add(noseTip);

      // eyes — white sclera + brown iris + pupil + shine + upper-lid line
      const scleraMat = this._mat(THREE, '#F6F1E8', { roughness: 0.32 });
      const irisMat = this._mat(THREE, '#6E4A30', { roughness: 0.28 });
      const pupilMat = this._mat(THREE, '#1F140D', { roughness: 0.3 });
      const mkEye = (s) => {
        const g = new THREE.Group();
        const sc = new THREE.Mesh(new THREE.SphereGeometry(0.03, 26, 26), scleraMat); sc.scale.set(1.28, 1.02, 0.72); g.add(sc);
        const ir = new THREE.Mesh(new THREE.SphereGeometry(0.017, 22, 22), irisMat); ir.scale.set(1, 1, 0.55); ir.position.set(0, -0.001, 0.019); g.add(ir);
        const pu = new THREE.Mesh(new THREE.SphereGeometry(0.0085, 16, 16), pupilMat); pu.position.set(0, -0.001, 0.026); g.add(pu);
        const sh = new THREE.Mesh(new THREE.SphereGeometry(0.0045, 10, 10), white); sh.position.set(-0.007 * s, 0.007, 0.03); g.add(sh);
        const lid = new THREE.Mesh(new THREE.TorusGeometry(0.031, 0.0045, 8, 22, Math.PI), dark);
        lid.scale.set(1.28, 1.02, 0.72); lid.position.set(0, 0.002, 0.012); g.add(lid);
        g.position.set(s * 0.053, 1.632, 0.098); g.rotation.y = s * -0.16;
        figure.add(g);
      };
      mkEye(-1); mkEye(1);

      // eyebrows — thick dark brows, slight arch
      [-1, 1].forEach((s) => {
        const br = new THREE.Mesh(new THREE.BoxGeometry(0.052, 0.012, 0.016), dark);
        br.position.set(s * 0.055, 1.673, 0.112); br.rotation.z = s * 0.14; br.rotation.y = s * -0.22; figure.add(br);
      });

      // lips — full natural nude
      const lipU = new THREE.Mesh(new THREE.SphereGeometry(0.02, 20, 12), lip); lipU.scale.set(1.55, 0.42, 0.42); lipU.position.set(0, 1.567, 0.116); figure.add(lipU);
      const lipL = new THREE.Mesh(new THREE.SphereGeometry(0.02, 20, 12), lip); lipL.scale.set(1.4, 0.52, 0.42); lipL.position.set(0, 1.557, 0.115); figure.add(lipL);

      // blush + freckles across nose/cheeks
      const blushMat = this._mat(THREE, '#E28C79', { roughness: 0.7, transparent: true, opacity: 0.38 });
      [-0.082, 0.082].forEach((x) => { const b = new THREE.Mesh(new THREE.SphereGeometry(0.027, 16, 12), blushMat); b.scale.set(1, 0.72, 0.3); b.position.set(x, 1.598, 0.104); figure.add(b); });
      const freckMat = this._mat(THREE, '#AF7350', { roughness: 0.6, transparent: true, opacity: 0.55 });
      const freckG = new THREE.SphereGeometry(0.0028, 6, 6);
      for (let i = 0; i < 11; i++) { const fx = (Math.random() - 0.5) * 0.12; const fy = 1.6 + (Math.random() - 0.5) * 0.028; const f = new THREE.Mesh(freckG, freckMat); f.position.set(fx, fy, 0.121); figure.add(f); }

      // hair — dark cool-brown bob w/ center part
      const crown = new THREE.Mesh(new THREE.SphereGeometry(0.152, 40, 30, 0, Math.PI * 2, 0, Math.PI * 0.56), hair);
      crown.position.set(0, 1.666, -0.006); crown.scale.set(1.05, 1.05, 1.07); figure.add(crown);
      // back mass falling to bob length
      const hairBackPts = [lp(0.03, 1.30), lp(0.15, 1.40), lp(0.168, 1.52), lp(0.152, 1.62), lp(0.092, 1.665), lp(0.02, 1.69)];
      const hairBack = new THREE.Mesh(new THREE.LatheGeometry(hairBackPts, 36, -Math.PI / 2, Math.PI), hair);
      hairBack.position.z = -0.045; figure.add(hairBack);
      // face-framing side curtains curving in at the jaw (bob)
      [-1, 1].forEach((s) => {
        const cur = new THREE.Mesh(new THREE.SphereGeometry(0.06, 22, 26), hair);
        cur.scale.set(0.42, 2.0, 0.62); cur.position.set(s * 0.122, 1.525, 0.028); cur.rotation.z = s * 0.05; figure.add(cur);
        const tip = new THREE.Mesh(new THREE.SphereGeometry(0.042, 18, 18), hair);
        tip.scale.set(0.5, 1.05, 0.62); tip.position.set(s * 0.1, 1.402, 0.058); figure.add(tip);
      });
      // front fringe lobes w/ suggested center part
      [-1, 1].forEach((s) => {
        const fr = new THREE.Mesh(new THREE.SphereGeometry(0.072, 24, 20), hair);
        fr.scale.set(0.82, 0.5, 0.66); fr.position.set(s * 0.046, 1.708, 0.07); fr.rotation.z = s * -0.1; figure.add(fr);
      });

      // arms (upper + fore + hand) both sides
      const mkArm = (side) => {
        const g = new THREE.Group();
        const up = new THREE.Mesh(new THREE.CylinderGeometry(0.043, 0.038, 0.32, 20), skin);
        up.position.y = -0.16; g.add(up);
        const sh = new THREE.Mesh(new THREE.SphereGeometry(0.05, 20, 20), skin); sh.position.y = 0; g.add(sh);
        const fore = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.03, 0.30, 20), skin); fore.position.y = -0.47; g.add(fore);
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 18, 18), skin); hand.scale.set(1, 1.2, 0.7); hand.position.y = -0.63; g.add(hand);
        g.position.set(side * 0.16, 1.4, 0);
        g.rotation.z = side * 0.12;
        figure.add(g);
        return g;
      };
      this._armL = mkArm(-1); this._armR = mkArm(1);

      // legs + feet
      const mkLeg = (side) => {
        const thigh = new THREE.Mesh(new THREE.CylinderGeometry(0.062, 0.05, 0.5, 22), skin);
        thigh.position.set(side * 0.07, 0.72, 0); figure.add(thigh);
        const calf = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.035, 0.48, 22), skin);
        calf.position.set(side * 0.075, 0.28, 0); figure.add(calf);
        const foot = new THREE.Mesh(new THREE.SphereGeometry(0.05, 18, 14), skin);
        foot.scale.set(1, 0.55, 1.8); foot.position.set(side * 0.075, 0.035, 0.05); figure.add(foot);
        return { foot, side };
      };
      this._legL = mkLeg(-1); this._legR = mkLeg(1);

      // neutral base layer (so she's never nude before styling)
      const baseMat = this._mat(THREE, '#EFE7DA', { roughness: 0.7 });
      const camiPts = [lp(0.116, 0.98), lp(0.126, 1.12), lp(0.108, 1.19), lp(0.136, 1.31), lp(0.156, 1.41), lp(0.132, 1.44), lp(0.001, 1.445)];
      figure.add(new THREE.Mesh(new THREE.LatheGeometry(camiPts, 44), baseMat));
      [-1, 1].forEach((s) => {
        const short = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.062, 0.28, 22), baseMat);
        short.position.set(s * 0.072, 0.86, 0); figure.add(short);
      });
    }

    _scheduleRebuild() {
      if (this._pending) return; this._pending = true;
      requestAnimationFrame(() => { this._pending = false; this._rebuild(); });
    }

    _rebuild() {
      const THREE = this.THREE; if (!THREE) return;
      const grp = this.garmentGroup;
      for (let i = grp.children.length - 1; i >= 0; i--) {
        const c = grp.children[i]; grp.remove(c);
        if (c.geometry) c.geometry.dispose(); if (c.material) c.material.dispose();
      }
      const lp = (r, y) => new THREE.Vector2(r, y);
      const add = (mesh) => grp.add(mesh);
      const fab = this._fabricTex();

      const L = this._look();
      const hasDress = !!L.hasDress;
      const hasTop = !!L.hasTop;
      const hasBottom = !!L.hasBottom;
      const hasOuter = !!L.hasOuter;
      const hasShoes = !!L.hasShoes;
      const hasBag = !!L.hasBag;
      const hasJewel = !!L.hasJewel;

      // BOTTOM (under dress logic never co-occurs w/ dress via game rules)
      if (hasBottom) {
        const col = L.bottomColor || '#2A2620';
        const mat = this._mat(THREE, col, { roughness: 0.82, metalness: 0, bumpMap: fab, bumpScale: 0.012 });
        if (L.bottomSkirt) {
          const pts = [lp(0.001, 0.55), lp(0.27, 0.56), lp(0.2, 0.82), lp(0.135, 1.18), lp(0.001, 1.19)];
          add(new THREE.Mesh(new THREE.LatheGeometry(pts, 40), mat));
        } else {
          [-1, 1].forEach((s) => {
            const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.06, 1.0, 24), mat);
            leg.position.set(s * 0.072, 0.55, 0); add(leg);
          });
        }
      }

      // TOP
      if (hasTop) {
        const col = L.topColor || '#EAE1CF';
        const mat = this._mat(THREE, col, { roughness: 0.8, metalness: 0, bumpMap: fab, bumpScale: 0.012 });
        const pts = [lp(0.12, 1.14), lp(0.125, 1.19), lp(0.15, 1.30), lp(0.172, 1.40), lp(0.15, 1.46), lp(0.001, 1.47)];
        add(new THREE.Mesh(new THREE.LatheGeometry(pts, 44), mat));
        [-1, 1].forEach((s) => { const sl = new THREE.Mesh(new THREE.SphereGeometry(0.07, 18, 16), mat); sl.scale.set(1, 0.8, 1); sl.position.set(s * 0.17, 1.37, 0); add(sl); });
      }

      // DRESS
      if (hasDress) {
        const col = L.dressColor || '#6E2436';
        const mat = this._mat(THREE, col, { roughness: 0.6, metalness: 0.02, bumpMap: fab, bumpScale: 0.009 });
        const long = L.dressLong !== false;
        const hemY = long ? 0.14 : 0.62;
        const hemR = long ? 0.36 : 0.26;
        const pts = [lp(0.001, hemY), lp(hemR, hemY + 0.01), lp(0.2, 0.95), lp(0.135, 1.18),
          lp(0.128, 1.24), lp(0.152, 1.32), lp(0.174, 1.41), lp(0.15, 1.46), lp(0.001, 1.47)];
        add(new THREE.Mesh(new THREE.LatheGeometry(pts, 52), mat));
      }

      // OUTERWEAR — open coat: back-and-sides shell + collar
      if (hasOuter) {
        const col = L.outerColor || '#B98B5E';
        const mat = this._mat(THREE, col, { roughness: 0.82, metalness: 0, side: THREE.DoubleSide, bumpMap: fab, bumpScale: 0.014 });
        const pts = [lp(0.19, 0.5), lp(0.2, 0.72), lp(0.185, 1.0), lp(0.165, 1.2), lp(0.19, 1.35), lp(0.2, 1.43), lp(0.17, 1.47)];
        const gap = 0.45;
        const coat = new THREE.Mesh(new THREE.LatheGeometry(pts, 40, gap / 2 + Math.PI / 2, Math.PI * 2 - gap), mat);
        add(coat);
        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.12, 0.03, 12, 32, Math.PI * 1.4), mat);
        collar.rotation.set(Math.PI / 2.1, 0, Math.PI / 2 + 0.7); collar.position.set(0, 1.44, 0.02); add(collar);
      }

      // SHOES
      if (hasShoes) {
        const col = L.shoesColor || '#C9A24B';
        const mat = this._mat(THREE, col, { roughness: 0.35, metalness: 0.15 });
        [-1, 1].forEach((s) => {
          const shoe = new THREE.Mesh(new THREE.SphereGeometry(0.055, 20, 16), mat);
          shoe.scale.set(1, 0.5, 1.9); shoe.position.set(s * 0.075, 0.03, 0.06); add(shoe);
          const heel = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.09, 10), mat);
          heel.position.set(s * 0.075, 0.02, -0.05); add(heel);
        });
      }

      // BAG (right hand)
      if (hasBag) {
        const col = L.bagColor || '#2A2620';
        const mat = this._mat(THREE, col, { roughness: 0.4, metalness: 0.1 });
        const bag = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.11, 0.05), mat);
        bag.position.set(0.24, 0.78, 0.02); bag.rotation.z = 0.1; add(bag);
        const strap = new THREE.Mesh(new THREE.TorusGeometry(0.05, 0.008, 8, 24, Math.PI), mat);
        strap.position.set(0.24, 0.85, 0.02); add(strap);
      }

      // JEWELRY (necklace)
      if (hasJewel) {
        const col = L.jewelColor || '#EAE1CF';
        const mat = this._mat(THREE, col, { roughness: 0.2, metalness: 0.5 });
        const chain = new THREE.Mesh(new THREE.TorusGeometry(0.085, 0.008, 10, 40), mat);
        chain.rotation.x = Math.PI / 2 - 0.35; chain.position.set(0, 1.44, 0.03); add(chain);
        const pend = new THREE.Mesh(new THREE.SphereGeometry(0.018, 16, 16), mat);
        pend.position.set(0, 1.37, 0.11); add(pend);
      }
    }

    _setupDrag(dom) {
      let px = 0, active = false;
      const down = (e) => { active = true; this._dragging = true; px = e.clientX; dom.style.cursor = 'grabbing'; try { dom.setPointerCapture(e.pointerId); } catch (_) {} };
      const move = (e) => { if (!active) return; const dx = e.clientX - px; px = e.clientX; this.figure.rotation.y += dx * 0.012; };
      const up = () => { active = false; dom.style.cursor = 'grab'; clearTimeout(this._resume); this._resume = setTimeout(() => { this._dragging = false; }, 2600); };
      dom.addEventListener('pointerdown', down);
      dom.addEventListener('pointermove', move);
      dom.addEventListener('pointerup', up);
      dom.addEventListener('pointerleave', up);
    }
  }

  if (!customElements.get('character-3d')) customElements.define('character-3d', Character3D);
})();
