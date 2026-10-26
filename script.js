/* ============================================================
   CONFIG — every editable link and flag lives here.
   Any link left as "#" shows as a disabled "Coming soon" button.
   ============================================================ */
const CONFIG = {
  resumePdf: "assets/pdf/Abbas_Saleh_Resume.pdf",
  portfolioPdf: "assets/pdf/Abbas_Saleh_Portfolio.pdf",
  briefPdf: "assets/pdf/AS-P1-RPT-001_R1_Technical-Brief.pdf",
  drawingsPdf: "assets/pdf/AS-P1_Drawings_S-101_S-201_R3_S-301_R0.pdf",
  calcsPdf: "assets/pdf/AS-P1_Calculations_CAL-001-004_MTO-001_R1.pdf",
  p2DrawingsPdf: "assets/pdf/AS-P2_Drawing_S-301.pdf",
  p2CalcsPdf: "assets/pdf/AS-P2_Calculations_CAL-001_CAL-002_MTO-001.pdf",
  p3ReportPdf: "assets/pdf/AS-P3-RPT-001_R0_Literature-Review.pdf",
  linkedin: "https://www.linkedin.com/in/abbas-saleh-0a9540368",
  email: "abbas.k.saleh@gmail.com",
  showNextProject: false
};

(function () {
  "use strict";

  const DOWNLOAD_ICON =
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 3v12"/><path d="M7 10l5 5 5-5"/><path d="M5 21h14"/></svg>';

  const ICONS = {
    download: DOWNLOAD_ICON,
    doc: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z"/><path d="M14 3v6h6"/><path d="M8 13h8M8 17h5"/></svg>',
    linkedin: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM9 9h3.8v1.7h.1c.5-1 1.8-2 3.7-2 4 0 4.7 2.6 4.7 6V21h-4v-5.6c0-1.3 0-3-1.9-3s-2.1 1.4-2.1 2.9V21H9z"/></svg>'
  };

  /* ---------- Wire links from CONFIG ---------- */
  document.querySelectorAll("[data-link]").forEach((el) => {
    const key = el.getAttribute("data-link");
    const url = CONFIG[key];
    const ic = ICONS[el.getAttribute("data-icon")];
    if (ic) el.insertAdjacentHTML("afterbegin", ic);
    if (!url || url === "#") {
      if (el.id === "float-resume") { el.remove(); return; }
      el.classList.add("is-disabled");
      el.setAttribute("aria-disabled", "true");
      el.setAttribute("title", "Coming soon");
      el.removeAttribute("href");
      el.removeAttribute("target");
      el.setAttribute("tabindex", "0");
      el.setAttribute("role", "link");
      el.addEventListener("click", (e) => e.preventDefault());
    } else {
      el.setAttribute("href", url);
    }
  });

  const emailLink = document.getElementById("email-link");
  const emailText = document.getElementById("email-text");
  if (emailLink) { emailLink.href = "mailto:" + CONFIG.email; if (emailText) emailText.textContent = CONFIG.email; }

  /* Optional images (e.g. site photo): hide on 404 so the blueprint panel shows */
  document.querySelectorAll("img[data-optional]").forEach((img) => {
    const hide = () => { img.hidden = true; };
    img.addEventListener("error", hide);
    if (img.complete && img.naturalWidth === 0) hide();
  });

  /* Technical details toggles */
  document.querySelectorAll(".details-toggle").forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute("aria-controls"));
    if (!panel) return;
    btn.addEventListener("click", () => {
      const open = btn.getAttribute("aria-expanded") !== "true";
      btn.setAttribute("aria-expanded", String(open));
      panel.hidden = !open;
    });
  });

  /* ---------- Next project card ---------- */
  if (CONFIG.showNextProject) {
    const tpl = document.getElementById("next-project-tpl");
    if (tpl) tpl.replaceWith(tpl.content.cloneNode(true));
  }

  /* ---------- Nav: shadow, mobile menu, active link ---------- */
  const nav = document.getElementById("nav");
  const menuBtn = document.getElementById("menu-btn");
  const navLinks = document.getElementById("nav-links");
  const floatResume = document.getElementById("float-resume");
  const hero = document.getElementById("top");

  function setMenu(open) {
    navLinks.setAttribute("data-open", String(open));
    menuBtn.setAttribute("aria-expanded", String(open));
    menuBtn.textContent = open ? "Close" : "Menu";
    nav.classList.toggle("menu-open", open);
    updateFloat();
  }
  menuBtn.addEventListener("click", () => setMenu(navLinks.getAttribute("data-open") !== "true"));
  navLinks.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => { if (window.innerWidth <= 920) setMenu(false); }));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && navLinks.getAttribute("data-open") === "true") { setMenu(false); menuBtn.focus(); }
  });
  window.addEventListener("resize", () => { if (window.innerWidth > 920) setMenu(false); });

  let pastHero = false;
  function updateFloat() {
    if (!floatResume || !floatResume.isConnected) return;
    const blocked = navLinks.getAttribute("data-open") === "true" || !lightbox.hidden;
    floatResume.classList.toggle("is-visible", pastHero && !blocked);
  }
  function onScroll() {
    const solid = window.scrollY > 40;
    nav.classList.toggle("is-solid", solid);
    document.body.classList.toggle("nav-solid", solid);
    pastHero = hero.getBoundingClientRect().bottom < 80;
    updateFloat();
  }
  window.addEventListener("scroll", onScroll, { passive: true });

  const linkMap = {};
  navLinks.querySelectorAll('a[href^="#"]').forEach((a) => { linkMap[a.getAttribute("href").slice(1)] = a; });
  const watched = ["about", "projects", "experience", "skills", "education", "contact"]
    .map((id) => document.getElementById(id)).filter(Boolean);
  if ("IntersectionObserver" in window) {
    const visible = new Map();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => visible.set(en.target.id, en.isIntersecting ? en.intersectionRatio : 0));
      let best = null, bestRatio = 0;
      watched.forEach((s) => { const r = visible.get(s.id) || 0; if (r > bestRatio) { bestRatio = r; best = s.id; } });
      if (best === "education") best = "skills";
      Object.values(linkMap).forEach((a) => a.classList.remove("is-active"));
      if (best && linkMap[best]) linkMap[best].classList.add("is-active");
    }, { rootMargin: "-72px 0px -45% 0px", threshold: [0, 0.1, 0.25, 0.5, 0.75, 1] });
    watched.forEach((s) => io.observe(s));
  }

  /* ---------- Galleries (one per project) + shared lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCaption = document.getElementById("lb-caption");
  const lbCount = document.getElementById("lb-count");
  let lastFocus = null;
  let activeGallery = null;

  function slotHtml(caption) { return '<div class="slot">' + caption + "</div>"; }

  function addSwipe(el, onLeft, onRight) {
    let x0 = null, y0 = null;
    el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) (dx < 0 ? onLeft : onRight)();
      x0 = y0 = null;
    }, { passive: true });
  }

  function makeGallery(root) {
    const thumbs = Array.from(root.querySelectorAll(".thumbs .thumb"));
    const items = thumbs.map((t) => ({ src: t.dataset.src, w: t.dataset.w, h: t.dataset.h, caption: t.dataset.caption, alt: t.dataset.alt || t.dataset.caption }));
    const img = root.querySelector(".viewer-img");
    const viewer = img.parentElement;
    const cap = root.querySelector('[data-role="caption"]');
    const count = root.querySelector('[data-role="count"]');
    const missing = new Set();
    const g = { index: 0, items, missing };

    function render() {
      const it = items[g.index];
      const oldSlot = viewer.querySelector(".slot");
      if (missing.has(g.index)) {
        img.hidden = true;
        if (oldSlot) oldSlot.textContent = it.caption; else viewer.insertAdjacentHTML("afterbegin", slotHtml(it.caption));
      } else {
        if (oldSlot) oldSlot.remove();
        img.hidden = false;
        img.src = it.src; img.alt = it.alt; img.width = it.w; img.height = it.h;
      }
      cap.textContent = it.caption;
      count.textContent = (g.index + 1) + " of " + items.length + " " + (root.dataset.unit || "images");
      thumbs.forEach((t, i) => t.setAttribute("aria-current", i === g.index ? "true" : "false"));
      const active = thumbs[g.index];
      if (active && active.parentElement.scrollWidth > active.parentElement.clientWidth) {
        active.parentElement.scrollTo({ left: active.offsetLeft - 8, behavior: "smooth" });
      }
      if (!lightbox.hidden && activeGallery === g) renderLightbox();
    }
    g.go = (n) => { g.index = (n + items.length) % items.length; render(); };

    thumbs.forEach((t, i) => {
      t.querySelector("img").addEventListener("error", () => { missing.add(i); t.innerHTML = slotHtml(items[i].caption); if (i === g.index) render(); });
      t.addEventListener("click", () => g.go(i));
    });
    img.addEventListener("error", () => { missing.add(g.index); render(); });
    root.querySelector(".viewer-arrow.prev").addEventListener("click", () => g.go(g.index - 1));
    root.querySelector(".viewer-arrow.next").addEventListener("click", () => g.go(g.index + 1));
    root.addEventListener("keydown", (e) => {
      if (e.key === "ArrowLeft") { e.preventDefault(); g.go(g.index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); g.go(g.index + 1); }
    });
    addSwipe(viewer, () => g.go(g.index + 1), () => g.go(g.index - 1));
    img.addEventListener("click", () => openLightbox(g));
    render();
    return g;
  }

  function renderLightbox() {
    const g = activeGallery, it = g.items[g.index];
    lbImg.src = it.src; lbImg.alt = it.alt;
    lbCaption.textContent = it.caption;
    lbCount.textContent = (g.index + 1) + " of " + g.items.length;
  }
  function openLightbox(g) {
    if (g.missing.has(g.index)) return;
    activeGallery = g;
    lastFocus = document.activeElement;
    renderLightbox();
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    updateFloat();
    document.getElementById("lb-close").focus();
  }
  function closeLightbox() {
    lightbox.hidden = true;
    document.body.style.overflow = "";
    updateFloat();
    if (lastFocus) lastFocus.focus();
  }
  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", (e) => { e.stopPropagation(); activeGallery.go(activeGallery.index - 1); });
  document.getElementById("lb-next").addEventListener("click", (e) => { e.stopPropagation(); activeGallery.go(activeGallery.index + 1); });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lb-stage")) closeLightbox();
  });
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.preventDefault(); closeLightbox(); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); activeGallery.go(activeGallery.index - 1); return; }
    if (e.key === "ArrowRight") { e.preventDefault(); activeGallery.go(activeGallery.index + 1); return; }
    if (e.key === "Tab") {
      const f = Array.from(lightbox.querySelectorAll("button"));
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  addSwipe(lightbox.querySelector(".lb-stage"), () => activeGallery.go(activeGallery.index + 1), () => activeGallery.go(activeGallery.index - 1));

  document.querySelectorAll(".gallery").forEach(makeGallery);

  /* ---------- Copy email ---------- */
  const copyBtn = document.getElementById("copy-email");
  copyBtn.addEventListener("click", () => {
    const done = () => { copyBtn.textContent = "Copied"; setTimeout(() => { copyBtn.textContent = "Copy"; }, 2000); };
    const fallback = () => {
      const r = document.createRange(); r.selectNodeContents(emailText || emailLink);
      const s = window.getSelection(); s.removeAllRanges(); s.addRange(r);
      copyBtn.textContent = "Selected";
      setTimeout(() => { copyBtn.textContent = "Copy"; }, 2000);
    };
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(CONFIG.email).then(done, fallback);
      else fallback();
    } catch (err) { fallback(); }
  });

  onScroll();
})();
