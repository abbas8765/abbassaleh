/* ============================================================
   CONFIG — every editable link and flag lives here.
   Any link left as "#" shows as a disabled "Coming soon" button.
   ============================================================ */
const CONFIG = {
  resumePdf: "#",                                                     // e.g. "assets/pdf/Abbas_Saleh_Resume.pdf"
  portfolioPdf: "#",                                                  // e.g. "assets/pdf/Abbas_Saleh_Portfolio.pdf"
  briefPdf: "assets/pdf/AS-P1-RPT-001_R0_Technical-Brief.pdf",
  drawingsPdf: "assets/pdf/AS-P1_Drawings_S-101_S-201_S-301.pdf",
  calcsPdf: "assets/pdf/AS-P1_Calculations_CAL-001_CAL-002_MTO-001.pdf",
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

  /* Technical details toggle */
  const dToggle = document.getElementById("details-toggle");
  const dPanel = document.getElementById("details-panel");
  if (dToggle && dPanel) dToggle.addEventListener("click", () => {
    const open = dToggle.getAttribute("aria-expanded") !== "true";
    dToggle.setAttribute("aria-expanded", String(open));
    dPanel.hidden = !open;
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

  /* ---------- Gallery ---------- */
  const thumbs = Array.from(document.querySelectorAll("#thumbs .thumb"));
  const items = thumbs.map((t) => ({
    src: t.dataset.src, w: t.dataset.w, h: t.dataset.h, caption: t.dataset.caption, alt: t.dataset.alt || t.dataset.caption
  }));
  const viewerImg = document.getElementById("viewer-img");
  const viewerCaption = document.getElementById("viewer-caption");
  const viewerCount = document.getElementById("viewer-count");
  const gallery = document.getElementById("gallery");
  const missing = new Set();
  let index = 0;

  function slotHtml(caption) { return '<div class="slot">' + caption + "</div>"; }

  // Missing file → grey placeholder slot instead of a broken image
  thumbs.forEach((t, i) => {
    const img = t.querySelector("img");
    img.addEventListener("error", () => { missing.add(i); t.innerHTML = slotHtml(items[i].caption); if (i === index) render(); });
  });

  function render() {
    const it = items[index];
    const viewer = viewerImg.parentElement;
    const oldSlot = viewer.querySelector(".slot");
    if (missing.has(index)) {
      viewerImg.hidden = true;
      if (oldSlot) oldSlot.textContent = it.caption; else viewer.insertAdjacentHTML("afterbegin", slotHtml(it.caption));
    } else {
      if (oldSlot) oldSlot.remove();
      viewerImg.hidden = false;
      viewerImg.src = it.src; viewerImg.alt = it.alt; viewerImg.width = it.w; viewerImg.height = it.h;
    }
    viewerCaption.textContent = it.caption;
    viewerCount.textContent = (index + 1) + " of " + items.length + " drawings";
    thumbs.forEach((t, i) => t.setAttribute("aria-current", i === index ? "true" : "false"));
    const active = thumbs[index];
    if (active && active.parentElement.scrollWidth > active.parentElement.clientWidth) {
      active.parentElement.scrollTo({ left: active.offsetLeft - 8, behavior: "smooth" });
    }
    if (!lightbox.hidden) renderLightbox();
  }
  function go(n) { index = (n + items.length) % items.length; render(); }

  viewerImg.addEventListener("error", () => { missing.add(index); render(); });
  thumbs.forEach((t, i) => t.addEventListener("click", () => go(i)));
  document.getElementById("prev").addEventListener("click", () => go(index - 1));
  document.getElementById("next").addEventListener("click", () => go(index + 1));
  gallery.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); }
  });

  function addSwipe(el) {
    let x0 = null, y0 = null;
    el.addEventListener("touchstart", (e) => { x0 = e.touches[0].clientX; y0 = e.touches[0].clientY; }, { passive: true });
    el.addEventListener("touchend", (e) => {
      if (x0 === null) return;
      const dx = e.changedTouches[0].clientX - x0, dy = e.changedTouches[0].clientY - y0;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? index + 1 : index - 1);
      x0 = y0 = null;
    }, { passive: true });
  }
  addSwipe(viewerImg.parentElement);

  /* ---------- Lightbox ---------- */
  const lightbox = document.getElementById("lightbox");
  const lbImg = document.getElementById("lb-img");
  const lbCaption = document.getElementById("lb-caption");
  const lbCount = document.getElementById("lb-count");
  let lastFocus = null;

  function renderLightbox() {
    const it = items[index];
    lbImg.src = it.src; lbImg.alt = it.alt;
    lbCaption.textContent = it.caption;
    lbCount.textContent = (index + 1) + " of " + items.length;
  }
  function openLightbox() {
    if (missing.has(index)) return;
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
  viewerImg.addEventListener("click", openLightbox);
  document.getElementById("lb-close").addEventListener("click", closeLightbox);
  document.getElementById("lb-prev").addEventListener("click", (e) => { e.stopPropagation(); go(index - 1); });
  document.getElementById("lb-next").addEventListener("click", (e) => { e.stopPropagation(); go(index + 1); });
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox || e.target.classList.contains("lb-stage")) closeLightbox();
  });
  lightbox.addEventListener("keydown", (e) => {
    if (e.key === "Escape") { e.preventDefault(); closeLightbox(); return; }
    if (e.key === "ArrowLeft") { e.preventDefault(); go(index - 1); return; }
    if (e.key === "ArrowRight") { e.preventDefault(); go(index + 1); return; }
    if (e.key === "Tab") {
      const f = Array.from(lightbox.querySelectorAll("button"));
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  addSwipe(lightbox.querySelector(".lb-stage"));

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

  render();
  onScroll();
})();
