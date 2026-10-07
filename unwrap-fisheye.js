/* unwrap-fisheye.js
   Same unwrap as https://rayony.github.io/unwrap-fisheye-image/
   CC BY 4.0 — credit rayony and unwrap-fisheye-image.
   No dependencies. Runs in the browser. Nothing is uploaded.
*/
const UnwrapFisheye = (function () {
  "use strict";

  function capFraction(phiMax) {
    const N = 140;
    let inside = 0, cap = 0;
    for (let iy = 0; iy < N; iy++) {
      const y = ((iy + 0.5) / N) * 2 - 1;
      for (let ix = 0; ix < N; ix++) {
        const x = ((ix + 0.5) / N) * 2 - 1;
        const r = Math.hypot(x, y);
        if (r > 1) continue;
        inside++;
        const theta = r * Math.PI / 2;
        const phi = Math.asin(Math.max(-1, Math.min(1, Math.sin(theta) * (y / Math.max(r, 1e-9)))));
        if (phi > phiMax) cap++;
      }
    }
    return cap / inside;
  }

  function phiMaxForCrop(pct) {
    const target = pct / 100;
    let lo = 45 * Math.PI / 180, hi = 89.2 * Math.PI / 180;
    for (let i = 0; i < 22; i++) {
      const mid = (lo + hi) / 2;
      if (capFraction(mid) > target) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  function aspectOf(a) {
    return (2 * a * Math.tan(Math.PI / (2 * a))) / Math.PI;
  }

  function aForAspect(aspect) {
    let lo = 1.02, hi = 24;
    for (let i = 0; i < 36; i++) {
      const mid = (lo + hi) / 2;
      if (aspectOf(mid) > aspect) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  function aForYMax(ymax) {
    if (ymax <= Math.PI / 2 + 0.015) return Infinity;
    let lo = 1.02, hi = 48;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      const y = mid * Math.tan(Math.PI / (2 * mid));
      if (y > ymax) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  function aForTopSpan(span, emax) {
    if (span <= emax + Math.PI / 2 + 0.015) return Infinity;
    let lo = 1.02, hi = 48;
    for (let i = 0; i < 40; i++) {
      const mid = (lo + hi) / 2;
      const y = mid * Math.tan(emax / mid) + mid * Math.tan(Math.PI / (2 * mid));
      if (y > span) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  function normalize(params) {
    const src = params || {};
    const trim = Object.assign({ left: 0, top: 0, right: 0, bottom: 0 }, src.trim || {});
    return {
      view: src.view || "side",
      crop: Number(src.crop || 0),
      aspect: Number(src.aspect == null ? 1.58 : src.aspect),
      start: Number(src.start || 0),
      cx: Number(src.cx || 0),
      cy: Number(src.cy || 0),
      radius: Number(src.radius == null ? 100 : src.radius),
      mirror: !!src.mirror,
      maxSide: Number(src.maxSide == null ? 1800 : src.maxSide),
      locale: src.locale === "zh" ? "zh" : "en",
      trim,
    };
  }

  function disk(width, height, params) {
    const p = normalize(params);
    const cx = width * (0.5 + p.cx / 100);
    const cy = height * (0.5 + p.cy / 100);
    const r = Math.min(width, height) / 2 * p.radius / 100;
    return { cx, cy, r: Math.max(8, r) };
  }

  function clampTrim(trim) {
    const keep = 0.08;
    const c = (v) => Math.min(0.92, Math.max(0, Number(v) / 100));
    let l = c(trim.left), t = c(trim.top), r = c(trim.right), b = c(trim.bottom);
    if (l + r > 1 - keep) {
      const s = (1 - keep) / (l + r);
      l *= s; r *= s;
    }
    if (t + b > 1 - keep) {
      const s = (1 - keep) / (t + b);
      t *= s; b *= s;
    }
    return { l, t, r, b };
  }

  function toSource(image, maxSide) {
    if (typeof ImageData !== "undefined" && image instanceof ImageData) {
      const sc = Math.min(1, maxSide / Math.max(image.width, image.height));
      if (sc >= 1) return { data: image.data, width: image.width, height: image.height };
      const w = Math.max(2, Math.round(image.width * sc));
      const h = Math.max(2, Math.round(image.height * sc));
      const c = document.createElement("canvas");
      c.width = image.width; c.height = image.height;
      c.getContext("2d").putImageData(image, 0, 0);
      const o = document.createElement("canvas");
      o.width = w; o.height = h;
      o.getContext("2d").drawImage(c, 0, 0, w, h);
      const px = o.getContext("2d").getImageData(0, 0, w, h);
      return { data: px.data, width: w, height: h };
    }
    const sw = image.naturalWidth || image.videoWidth || image.width;
    const sh = image.naturalHeight || image.videoHeight || image.height;
    const sc = Math.min(1, maxSide / Math.max(sw, sh));
    const w = Math.max(2, Math.round(sw * sc));
    const h = Math.max(2, Math.round(sh * sc));
    const c = document.createElement("canvas");
    c.width = w; c.height = h;
    c.getContext("2d").drawImage(image, 0, 0, w, h);
    const px = c.getContext("2d").getImageData(0, 0, w, h);
    return { data: px.data, width: w, height: h };
  }

  function prepare(image, params) {
    const p = normalize(params);
    const src = toSource(image, p.maxSide);
    const srcW = src.width, srcH = src.height, srcData = src.data;
    const zh = p.locale === "zh";
    const view = p.view, crop = p.crop, aspect = p.aspect, mirror = p.mirror;
    const start = p.start * Math.PI / 180;
    const az = (x, width) => {
      const lam0 = ((x + 0.5) / width) * Math.PI * 2 + start;
      return mirror ? lam0 : -lam0;
    };
    const { cx, cy, r } = disk(srcW, srcH, p);
    let W, H, summary, ray;

    if (view === "side") {
      W = Math.max(720, Math.min(1100, Math.round(r * 2)));
      if (crop > 0) {
        const phiMax = phiMaxForCrop(crop);
        H = Math.max(2, Math.round(W * 2 * Math.tan(phiMax) / Math.PI));
        const t = Math.tan(phiMax);
        ray = (x, y) => {
          const lam = (mirror ? -1 : 1) * ((x + 0.5) / W - 0.5) * Math.PI;
          const phi = Math.atan((0.5 - (y + 0.5) / H) * 2 * t);
          return fishRay(lam, phi);
        };
        summary = zh
          ? `側面，上下各裁 ${crop}%（約 ±${(phiMax * 180 / Math.PI).toFixed(1)}°）。高÷寬 ${(H / W).toFixed(2)}。`
          : `Side view, ${crop}% cropped from the top and the bottom (about ±${(phiMax * 180 / Math.PI).toFixed(1)}°). Height÷width ${(H / W).toFixed(2)}.`;
      } else {
        const a = aForAspect(aspect);
        H = Math.max(2, Math.round(W * aspect));
        const tmax = Math.tan(Math.PI / (2 * a));
        ray = (x, y) => {
          const lam = (mirror ? -1 : 1) * ((x + 0.5) / W - 0.5) * Math.PI;
          const n = 1 - 2 * (y + 0.5) / H;
          const phi = a * Math.atan(n * tmax);
          return fishRay(lam, phi);
        };
        summary = zh
          ? `側面，0% 裁切，成個圓留低。高÷寬 ${aspect.toFixed(2)}。`
          : `Side view, 0% crop, whole circle kept. Height÷width ${aspect.toFixed(2)}.`;
      }
      function fishRay(lam, phi) {
        const cphi = Math.cos(phi);
        const dx = Math.sin(lam) * cphi;
        const dy = Math.sin(phi);
        const dz = Math.cos(lam) * cphi;
        const rad = Math.hypot(dx, dy) || 1e-8;
        const theta = Math.atan2(rad, dz);
        const rf = theta / (Math.PI / 2) * r;
        if (rf > r + 1.2) return null;
        return { sx: cx + rf * dx / rad, sy: cy - rf * dy / rad };
      }
    } else if (view === "bottom") {
      W = 1200;
      if (crop > 0) {
        const elevMax = (Math.PI / 2) * (1 - Math.sqrt(crop / 100));
        H = Math.max(2, Math.round(W * Math.tan(elevMax) / (2 * Math.PI)));
        const t = Math.tan(elevMax);
        ray = (x, y) => {
          const lam = az(x, W);
          const elev = Math.atan((1 - (y + 0.5) / H) * t);
          const rr = r * (Math.PI / 2 - elev) / (Math.PI / 2);
          return { sx: cx + rr * Math.cos(lam), sy: cy + rr * Math.sin(lam) };
        };
        summary = zh
          ? `底視，圓心裁 ${crop}%（向上約 ${(elevMax * 180 / Math.PI).toFixed(0)}°）。寬÷高 ${(W / H).toFixed(2)}。`
          : `Bottom view, ${crop}% of the centre cropped (up to about ${(elevMax * 180 / Math.PI).toFixed(0)}°). Width÷height ${(W / H).toFixed(2)}.`;
      } else {
        const ymax = (2 * Math.PI) / aspect;
        const a = aForYMax(ymax);
        H = Math.max(2, Math.round(W / aspect));
        ray = (x, y) => {
          const lam = az(x, W);
          const n = 1 - (y + 0.5) / H;
          const elev = Number.isFinite(a) ? a * Math.atan(n * Math.tan(Math.PI / (2 * a))) : n * Math.PI / 2;
          const rr = r * (Math.PI / 2 - elev) / (Math.PI / 2);
          return { sx: cx + rr * Math.cos(lam), sy: cy + rr * Math.sin(lam) };
        };
        summary = zh
          ? `底視，0% 裁切，圓心留低。寬÷高 ${aspect.toFixed(2)}。頂邊係正上方拉成一條線。`
          : `Bottom view, 0% crop, centre kept. Width÷height ${aspect.toFixed(2)}. The top edge is straight up, stretched into a line.`;
      }
    } else {
      W = 1400;
      const emax = 18 * Math.PI / 180;
      if (crop > 0) {
        const emin = 2 * Math.atan(Math.sqrt(crop / 100)) - Math.PI / 2;
        const span = Math.tan(emax) - Math.tan(emin);
        H = Math.max(2, Math.round(W * span / (2 * Math.PI)));
        ray = (x, y) => {
          const lam = az(x, W);
          const tv = Math.tan(emax) + (Math.tan(emin) - Math.tan(emax)) * (y + 0.5) / H;
          const elev = Math.atan(tv);
          const psi = elev + Math.PI / 2;
          const rr = r * Math.tan(psi / 2);
          return { sx: cx + rr * Math.cos(lam), sy: cy + rr * Math.sin(lam) };
        };
        summary = zh
          ? `頂視，行星圓心裁 ${crop}%（向下約 ${(-emin * 180 / Math.PI).toFixed(0)}°）。寬÷高 ${(W / H).toFixed(2)}。圓外高過 18° 嘅天空唔包。`
          : `Top view, ${crop}% of the planet centre cropped (down to about ${(-emin * 180 / Math.PI).toFixed(0)}°). Width÷height ${(W / H).toFixed(2)}. Sky more than 18° outside the circle is not included.`;
      } else {
        const ehi = 20 * Math.PI / 180;
        const spanWant = (2 * Math.PI) / aspect;
        const a = aForTopSpan(spanWant, ehi);
        H = Math.max(2, Math.round(W / aspect));
        const tTop = Number.isFinite(a) ? a * Math.tan(ehi / a) : ehi;
        const tBot = Number.isFinite(a) ? -a * Math.tan(Math.PI / (2 * a)) : -Math.PI / 2;
        ray = (x, y) => {
          const lam = az(x, W);
          const tv = tTop + (tBot - tTop) * (y + 0.5) / H;
          const elev = Number.isFinite(a) ? a * Math.atan(tv / a) : tv;
          const psi = elev + Math.PI / 2;
          const rr = r * Math.tan(Math.max(0, psi) / 2);
          return { sx: cx + rr * Math.cos(lam), sy: cy + rr * Math.sin(lam) };
        };
        summary = zh
          ? `頂視，0% 裁切，行星圓心留低。寬÷高 ${aspect.toFixed(2)}。底邊係正下方拉成一條線。`
          : `Top view, 0% crop, planet centre kept. Width÷height ${aspect.toFixed(2)}. The bottom edge is straight down, stretched into a line.`;
      }
    }

    const scale = Math.min(1, 4200000 / (W * H));
    if (scale < 1) {
      const W2 = Math.max(2, Math.round(W * scale));
      const H2 = Math.max(2, Math.round(H * scale));
      const ox = ray;
      ray = (x, y) => ox(x * (W - 1) / (W2 - 1), y * (H - 1) / (H2 - 1));
      W = W2; H = H2;
    }
    if (mirror) summary += zh ? " 已左右反轉。" : " Flipped left–right.";

    function sample(x, y) {
      if (x < 0 || y < 0 || x >= srcW - 1 || y >= srcH - 1) return null;
      const x0 = x | 0, y0 = y | 0, tx = x - x0, ty = y - y0;
      const i00 = (y0 * srcW + x0) * 4;
      const i10 = i00 + 4, i01 = i00 + srcW * 4, i11 = i01 + 4;
      const rgb = [0, 0, 0];
      for (let c = 0; c < 3; c++) {
        const a = srcData[i00 + c] * (1 - tx) + srcData[i10 + c] * tx;
        const b = srcData[i01 + c] * (1 - tx) + srcData[i11 + c] * tx;
        rgb[c] = a * (1 - ty) + b * ty;
      }
      return rgb;
    }

    return { width: W, height: H, W, H, ray, sample, summary, params: p, srcW, srcH };
  }

  function renderImageData(state) {
    const W = state.width, H = state.height;
    const img = new ImageData(W, H);
    const od = img.data;
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        const hit = state.ray(x, y);
        const rgb = hit ? state.sample(hit.sx, hit.sy) : null;
        od[i] = rgb ? rgb[0] : 255;
        od[i + 1] = rgb ? rgb[1] : 255;
        od[i + 2] = rgb ? rgb[2] : 255;
        od[i + 3] = 255;
      }
    }
    return img;
  }

  function crop(imageData, trim) {
    const box = clampTrim(trim || {});
    const W = imageData.width, H = imageData.height;
    const x = box.l * W, y = box.t * H;
    const w = (1 - box.l - box.r) * W, h = (1 - box.t - box.b) * H;
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(w));
    c.height = Math.max(1, Math.round(h));
    c.getContext("2d").putImageData(imageData, -Math.round(x), -Math.round(y));
    return c;
  }

  function loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("Could not load image: " + src));
      img.src = src;
    });
  }

  async function unwrap(image, params) {
    if (typeof image === "string") image = await loadImage(image);
    const state = prepare(image, params);
    const full = renderImageData(state);
    const canvas = crop(full, state.params.trim);
    return {
      canvas,
      full,
      summary: state.summary,
      width: canvas.width,
      height: canvas.height,
      params: state.params,
    };
  }

  return { unwrap, prepare, renderImageData, crop, disk, phiMaxForCrop, clampTrim, normalize };
})();

if (typeof module === "object" && module && module.exports) module.exports = UnwrapFisheye;
if (typeof globalThis !== "undefined") globalThis.UnwrapFisheye = UnwrapFisheye;
