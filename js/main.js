/* Kaizen RP — interactions du site */

// ==== À PERSONNALISER ====================================================
const CONFIG = {
  discord: "https://discord.gg/ton-invitation",     // lien d'invitation Discord
  connect: "play.kaizen-rp.fr",                       // IP/domaine pour « connect » (F8)
  cfxCode: "",                                        // code cfx.re du serveur (ex. "abc123") pour le nombre de joueurs en direct
};
// ========================================================================

const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const $ = (s, root = document) => root.querySelector(s);
const $$ = (s, root = document) => [...root.querySelectorAll(s)];

/* ---------- Liens de configuration ---------- */
$$("[data-discord]").forEach((a) => { a.href = CONFIG.discord; a.target = "_blank"; a.rel = "noopener"; });
$("#connect-cmd").textContent = `connect ${CONFIG.connect}`;
$("#year").textContent = new Date().getFullYear();

/* ---------- Header & menu mobile ---------- */
const header = $(".site-header");
const toggle = $(".nav-toggle");
const menu = $("#nav-menu");

function setMenu(open) {
  toggle.setAttribute("aria-expanded", String(open));
  menu.classList.toggle("open", open);
  $(".sr-only", toggle).textContent = open ? "Fermer le menu" : "Ouvrir le menu";
}
toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
$$("a", menu).forEach((a) => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* ---------- Scroll : header, Log Pose, section active ---------- */
const pose = $(".scroll-pose");
const ring = $(".pose-ring");
const needle = $(".pose-needle");
let ticking = false;

function onScroll() {
  const y = window.scrollY;
  const max = document.documentElement.scrollHeight - innerHeight;
  const p = max > 0 ? y / max : 0;
  header.classList.toggle("scrolled", y > 40);
  pose.classList.toggle("show", y > innerHeight * 0.6);
  ring.style.strokeDashoffset = 100 - p * 100;
  needle.style.transform = `rotate(${p * 720}deg)`;
  ticking = false;
}
addEventListener("scroll", () => { if (!ticking) { requestAnimationFrame(onScroll); ticking = true; } }, { passive: true });
onScroll();

const navLinks = $$('.nav-menu a[href^="#"]:not(.btn)');
const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
  });
}, { rootMargin: "-45% 0px -50% 0px" });
$$("main section[id]").forEach((s) => sectionObserver.observe(s));

/* ---------- Révélations au scroll + compteurs ---------- */
$$("[data-reveal-group]").forEach((g) => $$("[data-reveal]", g).forEach((el, i) => el.style.setProperty("--i", i)));

const fmt = new Intl.NumberFormat("fr-FR");
function countUp(el) {
  const target = Number(el.dataset.count);
  const display = (n) => (el.hasAttribute("data-format") ? fmt.format(n) : n);
  if (reduced) { el.textContent = display(target); return; }
  const start = performance.now();
  const dur = 1800;
  const step = (now) => {
    const t = Math.min(1, (now - start) / dur);
    const eased = 1 - Math.pow(1 - t, 4);
    el.textContent = display(Math.round(target * eased));
    if (t < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

if ("IntersectionObserver" in window && !reduced) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-in");
      $$("[data-count]", entry.target).forEach(countUp);
      if (entry.target.matches("[data-count]")) countUp(entry.target);
      io.unobserve(entry.target);
    });
  }, { rootMargin: "0px 0px -10% 0px", threshold: 0.15 });
  $$("[data-reveal]").forEach((el) => io.observe(el));
} else {
  $$("[data-reveal]").forEach((el) => el.classList.add("is-in"));
  $$("[data-count]").forEach(countUp);
}

/* ---------- Répliques cultes (rotation) ---------- */
const QUOTES = [
  ["Je serai le Roi des Pirates !", "Monkey D. Luffy"],
  ["Rien… il ne s'est rien passé.", "Roronoa Zoro"],
  ["Le One Piece existe !", "Edward Newgate"],
  ["Quand un homme meurt-il ? Quand on l'oublie.", "Dr Hiluluk"],
  ["Je veux vivre !", "Nico Robin"],
  ["Mon trésor ? Cherchez-le, je l'ai laissé quelque part !", "Gol D. Roger"],
  ["Les rêves des hommes ne meurent jamais !", "Marshall D. Teach"],
  ["Un cuisinier ne laisse jamais quelqu'un mourir de faim.", "Sanji"],
  ["Je suis le grand Capitaine Usopp, avec 8 000 hommes sous mes ordres !", "Usopp"],
];
const quoteBox = $(".quote-box");
const quoteText = $("#quote-text");
const quoteAuthor = $("#quote-author");
let qi = 0;
let quoteTimer;

function nextQuote() {
  qi = (qi + 1) % QUOTES.length;
  quoteBox.classList.add("swap");
  setTimeout(() => {
    quoteText.textContent = `« ${QUOTES[qi][0]} »`;
    quoteAuthor.textContent = `— ${QUOTES[qi][1]}`;
    quoteBox.classList.remove("swap");
  }, 350);
}
function startQuotes() { if (!reduced) quoteTimer = setInterval(nextQuote, 5000); }
startQuotes();
// Pause au survol / focus, clic pour passer à la suivante
quoteBox.addEventListener("mouseenter", () => clearInterval(quoteTimer));
quoteBox.addEventListener("mouseleave", startQuotes);
quoteBox.addEventListener("click", nextQuote);

/* ---------- Fruits du Démon (retournement) ---------- */
$$(".fruit").forEach((btn) => {
  btn.addEventListener("click", () => {
    btn.setAttribute("aria-pressed", btn.getAttribute("aria-pressed") === "true" ? "false" : "true");
  });
});

/* ---------- Tilt 3D des cartes de faction ---------- */
if (!reduced && matchMedia("(hover: hover) and (pointer: fine)").matches) {
  $$("[data-tilt]").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(800px) rotateY(${x * 10}deg) rotateX(${-y * 10}deg) translateY(-6px)`;
    });
    card.addEventListener("pointerleave", () => { card.style.transform = ""; });
  });

  $$("[data-magnetic]").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const x = (e.clientX - r.left - r.width / 2) * 0.25;
      const y = (e.clientY - r.top - r.height / 2) * 0.25;
      el.style.translate = `${Math.max(-10, Math.min(10, x))}px ${Math.max(-10, Math.min(10, y))}px`;
    });
    el.addEventListener("pointerleave", () => { el.style.translate = ""; });
  });
}

/* ---------- Effet « DON ! » au clic ---------- */
const DON_WORDS = ["DON !", "ドン!", "BOOM !", "GO !"];
$$("[data-don]").forEach((el) => {
  el.addEventListener("click", (e) => {
    if (reduced) return;
    const span = document.createElement("span");
    span.className = "don";
    span.setAttribute("aria-hidden", "true");
    span.textContent = DON_WORDS[Math.floor(Math.random() * DON_WORDS.length)];
    span.style.left = `${e.clientX || innerWidth / 2}px`;
    span.style.top = `${e.clientY || innerHeight / 2}px`;
    document.body.append(span);
    span.addEventListener("animationend", () => span.remove());
  });
});

/* ---------- Carte interactive ---------- */
const ISLANDS = [
  { name: "Village de Fushia", zone: "East Blue", danger: 1, ctrl: "Neutre",
    desc: "Un petit port paisible où commence chaque légende. Zone de départ des nouveaux joueurs, idéale pour recruter ton premier équipage." },
  { name: "Loguetown", zone: "East Blue", danger: 2, ctrl: "Marine",
    desc: "La ville du commencement et de la fin. Dernière escale avant Grand Line : marché, armurerie et forte présence de la Marine." },
  { name: "Reverse Mountain", zone: "Red Line", danger: 3, ctrl: "Aucun",
    desc: "Les courants remontent la montagne pour plonger dans Grand Line. Seuls les navigateurs aguerris passent sans casse." },
  { name: "Alabasta", zone: "Grand Line", danger: 3, ctrl: "Royaume",
    desc: "Royaume du désert aux intrigues politiques. Contrebande, palais royal et organisations secrètes en sous-sol." },
  { name: "Water Seven", zone: "Grand Line", danger: 2, ctrl: "Neutre",
    desc: "La cité des charpentiers. Construis, répare et améliore ton navire — mais méfie-toi des agents du Gouvernement." },
  { name: "Marineford", zone: "Grand Line", danger: 5, ctrl: "Marine",
    desc: "Quartier général de la Marine. Base des joueurs marins, prison et lieu des grands affrontements scénarisés." },
  { name: "Archipel Sabaody", zone: "Grand Line", danger: 4, ctrl: "Gouvernement",
    desc: "Bulles, maisons de vente aux enchères et Dragons Célestes. Porte d'entrée vers le Nouveau Monde." },
  { name: "Wano", zone: "Nouveau Monde", danger: 5, ctrl: "Shogunat",
    desc: "Pays fermé des samouraïs. Sabres légendaires, honneur et complots — réservé aux équipages les plus redoutés." },
];
const card = $(".island-card");
const pins = $$(".pin");
function showIsland(i) {
  const isl = ISLANDS[i];
  $("#island-name").textContent = isl.name;
  $("#island-zone").textContent = isl.zone;
  $("#island-desc").textContent = isl.desc;
  $("#island-danger").textContent = "★".repeat(isl.danger) + "☆".repeat(5 - isl.danger);
  $("#island-ctrl").textContent = isl.ctrl;
  pins.forEach((p) => p.classList.toggle("active", p.dataset.island === String(i)));
  card.classList.remove("bump");
  void card.offsetWidth;
  card.classList.add("bump");
}
pins.forEach((p) => {
  p.addEventListener("click", () => showIsland(Number(p.dataset.island)));
  p.title = ISLANDS[p.dataset.island].name;
});
pins[0].classList.add("active");

/* ---------- Copier la commande connect ---------- */
const toast = $(".toast");
function showToast(msg) {
  toast.textContent = msg;
  toast.classList.add("show");
  clearTimeout(showToast.t);
  showToast.t = setTimeout(() => toast.classList.remove("show"), 2400);
}
$("[data-copy]").addEventListener("click", async () => {
  const text = $("#connect-cmd").textContent;
  try {
    await navigator.clipboard.writeText(text);
    showToast("Commande copiée ! Colle-la dans F8 ⚓");
  } catch {
    showToast(text);
  }
});

/* ---------- Statut du serveur (FiveM) ---------- */
async function loadStatus() {
  const players = $("#players");
  const status = $(".server-status");
  if (!CONFIG.cfxCode) { $("#status-text").textContent = "Ouverture prochaine · whitelist ouverte"; return; }
  try {
    const res = await fetch(`https://servers-frontend.fivem.net/api/servers/single/${CONFIG.cfxCode}`);
    if (!res.ok) throw new Error(res.status);
    const { Data } = await res.json();
    players.textContent = `${Data.clients}/${Data.sv_maxclients}`;
  } catch {
    status.classList.add("offline");
    $("#status-text").textContent = "Statut du serveur indisponible";
  }
}
loadStatus();
