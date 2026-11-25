/* Royal Frame Interiors: plain vanilla JS, no libraries. */

/* ---------------- Projects ---------------- */
const PROJECTS = [
  {
    title: "The Loft Living Room", cat: "living", label: "Living",
    img: "assets/img/work-loft.jpg",
    sub: "Open plan, tan leather and a sage wall",
    desc: "An open plan room divided into three places to sit without a single partition. The main sofa follows the windows, and the television sits on the green wall so the room is not arranged around a screen.",
    scope: "Layout · Lighting · Furniture · Styling"
  },
  {
    title: "Walnut and Grey", cat: "living", label: "Living",
    img: "assets/img/work-walnut.jpg",
    sub: "A media wall in walnut, seating kept low",
    desc: "A full height walnut wall hides the television, the wiring and two metres of storage. Everything else in the room is low and grey, so the wall does the talking and the seating stays quiet.",
    scope: "Joinery · Lighting · Furniture"
  },
  {
    title: "The Gallery Wall House", cat: "living", label: "Living",
    img: "assets/img/work-gallery.jpg",
    sub: "Twenty frames, one wall, drawn to scale first",
    desc: "The family already owned every picture on this wall. We measured each frame, drew the wall to scale on paper, and only then drilled. The room itself is simple; the wall is the project.",
    scope: "Picture hanging · Layout · Styling"
  },
  {
    title: "Light from Two Sides", cat: "living", label: "Living",
    img: "assets/img/work-penthouse.jpg",
    sub: "A corner flat with glass on two walls",
    desc: "With windows on two sides, the job was to keep the light and lose the glare. Low furniture, no curtains at the glass line, and the dining table placed where the evening sun lands.",
    scope: "Layout · Window treatment · Furniture"
  },
  {
    title: "White Kitchen, Black Lights", cat: "kitchen", label: "Kitchen",
    img: "assets/img/work-kitchen-white.jpg",
    sub: "Handle-less units under three black pendants",
    desc: "A working kitchen planned like a workshop: hob, sink and fridge within two steps of each other, tall units on one wall only, and task light exactly over the counters where knives are used.",
    scope: "Modular layout · Lighting · Appliances"
  },
  {
    title: "An Island for Six", cat: "kitchen", label: "Kitchen",
    img: "assets/img/work-kitchen-island.jpg",
    sub: "Cooking, homework and dinner at one counter",
    desc: "The island is the centre of this house: cooking on one side, stools on the other, drawers underneath for everything that used to live on the counter. The kitchen table was not missed.",
    scope: "Island joinery · Storage · Lighting"
  },
  {
    title: "The Buttoned Bedroom", cat: "bedroom", label: "Bedroom",
    img: "assets/img/work-bedroom.jpg",
    sub: "A tall headboard, and blackout done properly",
    desc: "Sleep first. A tall upholstered headboard, blackout curtains that actually meet in the middle, warm light at both sides of the bed, and a bench that catches the clothes chair habit.",
    scope: "Bed design · Wardrobes · Blackout · Lighting"
  },
  {
    title: "A Lounge for a Small Studio", cat: "office", label: "Workplace",
    img: "assets/img/work-office.jpg",
    sub: "Soft seating where the meetings happen",
    desc: "This studio holds its meetings in armchairs, not around a board table. Desks sit along the windows, the lounge takes the middle, and the whole office reads as one room, not cubicles.",
    scope: "Workplace layout · Lounge · Lighting"
  }
];

const grid = document.getElementById("projectGrid");
const gridNote = document.getElementById("gridNote");
let visibleProjects = PROJECTS.slice();

/* Image sizes: 800px and 1200px variants keep phones fast;
   the full-size file is only loaded where the screen can use it. */
const SMALL_SCREEN = window.matchMedia("(max-width: 820px)");
const sized = src => src.replace("assets/img/", "assets/img/m/");
const med = src => src.replace("assets/img/", "assets/img/l/");

function renderProjects(list) {
  visibleProjects = list;
  grid.innerHTML = list.map((p, i) => `
    <article class="project" data-index="${i}" tabindex="0" role="button" aria-label="View ${p.title}">
      <div class="project-media"><img src="${sized(p.img)}" srcset="${sized(p.img)} 800w, ${med(p.img)} 1200w, ${p.img} 1600w" sizes="(max-width: 820px) 100vw, 600px" width="1600" height="1200" alt="${p.title}. ${p.sub}" loading="lazy" decoding="async"></div>
      <div class="project-caption"><h3>${p.title}</h3><p>${p.label}</p></div>
      <p class="project-sub">${p.sub}</p>
    </article>`).join("");
  gridNote.textContent = `Showing ${list.length} of ${PROJECTS.length} rooms. Demo photography is from Unsplash; the live site carries the studio's own project photographs.`;
  grid.querySelectorAll(".project").forEach(el => {
    const open = () => openLightbox(Number(el.dataset.index));
    el.addEventListener("click", open);
    el.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
}
renderProjects(PROJECTS);

document.querySelectorAll(".filter-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".filter-btn").forEach(b => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    const f = btn.dataset.filter;
    renderProjects(f === "all" ? PROJECTS : PROJECTS.filter(p => p.cat === f));
  });
});

/* ---------------- Lightbox ---------------- */
const lightbox = document.getElementById("lightbox");
const lbImg = document.getElementById("lbImg");
let lbIndex = 0;

function openLightbox(i) {
  lbIndex = i;
  updateLightbox();
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}
function updateLightbox() {
  const p = visibleProjects[lbIndex];
  lbImg.src = SMALL_SCREEN.matches ? med(p.img) : p.img;
  lbImg.alt = `${p.title}. ${p.sub}`;
  document.getElementById("lbTitle").textContent = p.title;
  document.getElementById("lbDesc").textContent = p.desc;
  document.getElementById("lbScope").textContent = p.scope;
}
function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
}
function stepLightbox(d) {
  lbIndex = (lbIndex + d + visibleProjects.length) % visibleProjects.length;
  updateLightbox();
}
/* swipe to move between rooms on touch screens (the arrows are desktop-only) */
let lbTouchX = null;
lightbox.addEventListener("touchstart", e => { lbTouchX = e.changedTouches[0].clientX; }, { passive: true });
lightbox.addEventListener("touchend", e => {
  if (lbTouchX === null) return;
  const dx = e.changedTouches[0].clientX - lbTouchX;
  lbTouchX = null;
  if (Math.abs(dx) > 48) stepLightbox(dx < 0 ? 1 : -1);
}, { passive: true });
document.getElementById("lbClose").addEventListener("click", closeLightbox);
document.getElementById("lbPrev").addEventListener("click", () => stepLightbox(-1));
document.getElementById("lbNext").addEventListener("click", () => stepLightbox(1));
lightbox.addEventListener("click", e => { if (e.target === lightbox) closeLightbox(); });
document.addEventListener("keydown", e => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") stepLightbox(-1);
  if (e.key === "ArrowRight") stepLightbox(1);
});

/* ---------------- Frame tool ---------------- */
const stage = document.getElementById("stage");
const baseImg = document.getElementById("stageBase");
const cropWin = document.getElementById("cropWindow");
const cropImg = document.getElementById("cropImg");
const zoomRange = document.getElementById("zoomRange");
const ratioOut = document.getElementById("frameRatio");

let iw = 0, ih = 0;              // natural image size
let ox = 0, oy = 0;              // photo offset inside stage
let wx = 0, wy = 0, ww = 0, wh = 0;  // frame window

function stageSize() { return { W: stage.clientWidth, H: stage.clientHeight }; }
function dispSize() {
  const { W, H } = stageSize();
  const z = Number(zoomRange.value) / 100;
  const s = Math.max(W / iw, H / ih) * z;
  return { w: iw * s, h: ih * s };
}
function clampPhoto() {
  const { W, H } = stageSize();
  const d = dispSize();
  ox = Math.min(0, Math.max(W - d.w, ox));
  oy = Math.min(0, Math.max(H - d.h, oy));
}
function ratioText(w, h) {
  const commons = [[1,1],[5,4],[4,3],[3,2],[16,10],[16,9],[2,1],[4,5],[3,4],[2,3],[1,2]];
  const r = w / h;
  for (const [a, b] of commons) if (Math.abs(r - a / b) < 0.035) return `${a} : ${b}`;
  return `${r.toFixed(2)} : 1`;
}
function renderFrame() {
  if (!iw) return;
  clampPhoto();
  const d = dispSize();
  Object.assign(baseImg.style, { width: d.w + "px", height: d.h + "px", left: ox + "px", top: oy + "px" });
  Object.assign(cropWin.style, { left: wx + "px", top: wy + "px", width: ww + "px", height: wh + "px" });
  Object.assign(cropImg.style, { width: d.w + "px", height: d.h + "px", left: (ox - wx) + "px", top: (oy - wy) + "px" });
  ratioOut.textContent = ratioText(ww, wh);
}
let currentPhoto = "assets/img/work-gallery.jpg";
function loadStagePhoto(src) {
  currentPhoto = src;
  const displaySrc = SMALL_SCREEN.matches ? med(src) : src;
  const probe = new Image();
  probe.onload = () => {
    iw = probe.naturalWidth; ih = probe.naturalHeight;
    baseImg.src = displaySrc; cropImg.src = displaySrc;
    const { W, H } = stageSize();
    ww = W * 0.62; wh = ww * 2 / 3;
    if (wh > H * 0.8) { wh = H * 0.8; ww = wh * 3 / 2; }
    wx = (W - ww) / 2; wy = (H - wh) / 2;
    const d = dispSize();
    ox = (W - d.w) / 2; oy = (H - d.h) / 2;
    renderFrame();
  };
  probe.src = displaySrc;
}
document.querySelectorAll(".thumb").forEach(t => {
  t.addEventListener("click", () => {
    document.querySelectorAll(".thumb").forEach(x => x.classList.remove("is-active"));
    t.classList.add("is-active");
    loadStagePhoto(t.dataset.photo);
  });
});
zoomRange.addEventListener("input", () => {
  const before = dispSize();
  const { W, H } = stageSize();
  const after = (() => { const z = Number(zoomRange.value) / 100; const s = Math.max(W / iw, H / ih) * z; return { w: iw * s, h: ih * s }; })();
  if (before.w) {
    ox = W / 2 - (W / 2 - ox) * (after.w / before.w);
    oy = H / 2 - (H / 2 - oy) * (after.h / before.h);
  }
  renderFrame();
});

/* dragging: pan photo / move frame / resize frame */
let drag = null;
stage.addEventListener("pointerdown", e => {
  const { W, H } = stageSize();
  const r = stage.getBoundingClientRect();
  const px = e.clientX - r.left, py = e.clientY - r.top;
  const onHandle = e.target.id === "cropHandle";
  const onWindow = px >= wx && px <= wx + ww && py >= wy && py <= wy + wh;
  drag = {
    mode: onHandle ? "resize" : onWindow ? "move" : "pan",
    sx: px, sy: py, ox, oy, wx, wy, ww, wh, W, H
  };
  stage.setPointerCapture(e.pointerId);
  e.preventDefault();
});
stage.addEventListener("pointermove", e => {
  if (!drag) return;
  const r = stage.getBoundingClientRect();
  const dx = (e.clientX - r.left) - drag.sx;
  const dy = (e.clientY - r.top) - drag.sy;
  if (drag.mode === "pan") { ox = drag.ox + dx; oy = drag.oy + dy; }
  if (drag.mode === "move") {
    wx = Math.min(drag.W - ww, Math.max(0, drag.wx + dx));
    wy = Math.min(drag.H - wh, Math.max(0, drag.wy + dy));
  }
  if (drag.mode === "resize") {
    ww = Math.min(drag.W - wx, Math.max(190, drag.ww + dx));
    wh = Math.min(drag.H - wy, Math.max(140, drag.wh + dy));
  }
  renderFrame();
});
["pointerup", "pointercancel"].forEach(ev => stage.addEventListener(ev, () => drag = null));
window.addEventListener("resize", () => { if (iw) loadStagePhoto(currentPhoto); });
loadStagePhoto("assets/img/work-gallery.jpg");

/* ---------------- Services accordion ---------------- */
document.querySelectorAll(".acc-item").forEach(item => {
  const head = item.querySelector(".acc-head");
  const body = item.querySelector(".acc-body");
  const setOpen = open => {
    item.classList.toggle("open", open);
    head.setAttribute("aria-expanded", open);
    body.style.maxHeight = open ? body.scrollHeight + "px" : "0px";
  };
  if (item.classList.contains("open") || head.getAttribute("aria-expanded") === "true") setOpen(true);
  head.addEventListener("click", () => {
    const willOpen = !item.classList.contains("open");
    document.querySelectorAll(".acc-item.open").forEach(o => {
      o.classList.remove("open");
      o.querySelector(".acc-body").style.maxHeight = "0px";
      o.querySelector(".acc-head").setAttribute("aria-expanded", "false");
    });
    if (willOpen) setOpen(true);
  });
});

/* ---------------- Estimate ---------------- */
const areaRange = document.getElementById("areaRange");
const areaOut = document.getElementById("areaOut");
const estFigure = document.getElementById("estimateFigure");
const estDetail = document.getElementById("estimateDetail");
let estMult = 1, estMultName = "full home", estRate = 2100, estFinish = "Premium";

function inr(v) {
  if (v >= 1e7) return "₹" + (v / 1e7).toFixed(2) + " crore";
  return "₹" + (v / 1e5).toFixed(1) + " lakh";
}
function updateEstimate() {
  const area = Number(areaRange.value);
  areaOut.textContent = area.toLocaleString("en-IN") + " sq ft";
  const total = area * estRate * estMult;
  estFigure.textContent = `${inr(total * 0.9)} – ${inr(total * 1.12)}`;
  estDetail.textContent = `${estFinish} finish, ${estMultName}, ${area.toLocaleString("en-IN")} sq ft at ₹${estRate.toLocaleString("en-IN")} per sq ft.`;
}
function optionGroup(id, cb) {
  const box = document.getElementById(id);
  box.querySelectorAll(".option").forEach(o => o.addEventListener("click", () => {
    box.querySelectorAll(".option").forEach(x => x.classList.remove("is-active"));
    o.classList.add("is-active");
    cb(o);
  }));
}
optionGroup("roomOptions", o => { estMult = Number(o.dataset.mult); estMultName = o.textContent.trim().toLowerCase(); updateEstimate(); });
optionGroup("finishOptions", o => { estRate = Number(o.dataset.rate); estFinish = o.childNodes[0].textContent.trim(); updateEstimate(); });
areaRange.addEventListener("input", updateEstimate);
updateEstimate();

/* ---------------- Contact form (demo) ---------------- */
const form = document.getElementById("contactForm");
form.addEventListener("submit", e => {
  e.preventDefault();
  const name = document.getElementById("fName");
  const phone = document.getElementById("fPhone");
  const city = document.getElementById("fCity");
  for (const f of [name, phone, city]) {
    if (!f.value.trim()) { f.focus(); f.reportValidity(); return; }
  }
  document.getElementById("successName").textContent = name.value.trim().split(" ")[0];
  form.hidden = true;
  document.getElementById("formSuccess").hidden = false;
});
document.getElementById("sendAnother").addEventListener("click", () => {
  form.reset();
  form.hidden = false;
  document.getElementById("formSuccess").hidden = true;
});

/* ---------------- Mobile menu ---------------- */
const menuBtn = document.getElementById("menuBtn");
const mobileMenu = document.getElementById("mobileMenu");
menuBtn.addEventListener("click", () => {
  const open = mobileMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", open);
});
mobileMenu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => {
  mobileMenu.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}));
