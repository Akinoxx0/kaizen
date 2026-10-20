# Kaizen RP — site du serveur One Piece RolePlay (FiveM)

Site vitrine statique (HTML / CSS / JS sans dépendance) : accueil animé (mer, navire, mouettes, répliques cultes),
factions, Fruits du Démon & Haki, carte interactive des îles, avis de recherche, étapes pour rejoindre, règlement et FAQ.

## Lancer en local
Ouvre simplement `index.html` dans ton navigateur, ou :
```bash
npx serve .
```

## À personnaliser
Dans `js/main.js`, en haut du fichier :
```js
const CONFIG = {
  discord: "https://discord.gg/ton-invitation", // ton lien Discord
  connect: "play.kaizen-rp.fr",                 // adresse pour « connect » dans F8
  cfxCode: "",                                  // code cfx.re → affiche le nombre de joueurs en direct
};
```
- Îles de la carte : tableau `ISLANDS` dans `js/main.js` (+ positions des `.pin` dans `index.html`).
- Répliques du hero : tableau `QUOTES` dans `js/main.js`.
- Avis de recherche : section `#primes` dans `index.html`.
- Couleurs / polices : variables `:root` en haut de `css/style.css`.

## Mettre en ligne
Site 100 % statique : GitHub Pages (Settings → Pages → branche), Netlify ou Vercel fonctionnent sans configuration.

## Mention
Projet de fans non officiel. *One Piece* © Eiichirō Oda / Shūeisha / Toei Animation.
Tous les visuels du site (pavillon, navire, fruits, carte…) sont des SVG originaux.
