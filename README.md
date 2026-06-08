# AlphaTerminal

AlphaTerminal est une PWA mobile-first de suivi multi-portefeuilles PEA/CTO, conçue pour GitHub Pages sans étape de build. L'application est une SPA en vanilla JavaScript ES modules, Tailwind CSS CDN et Chart.js CDN.

## Fonctionnalités

- Tableau de bord global ou par compte avec solde, plafond PEA, top performances et alertes de stops.
- Analyse interactive par profil investisseur avec score de cohérence, allocation actuelle vs cible, rééquilibrage et simulation d'objectif.
- Signaux techniques calculés côté client : RSI(14), MACD simplifié, moyennes mobiles, ATR(14), bandes de Bollinger et impact macro/géopolitique.
- Inventaire complet avec filtres, recherche, tri, édition des stops, ajout de position, timeline des versements et export CSV.
- PWA installable avec manifest, service worker, cache statique, cache dynamique des données financières et fallback offline via LocalStorage.
- Notifications Web API avec historique persistant dans `alphaTerm_alerts`.
- Mode sombre manuel persistant dans `alphaTerm_darkMode`.

## Structure

```text
/
├── index.html
├── 404.html
├── manifest.json
├── sw.js
├── icons/
├── css/app.css
├── js/app.js
├── js/store.js
├── js/data.js
├── js/notifications.js
├── js/charts.js
└── pages/
    ├── dashboard.html
    ├── analyse.html
    ├── signaux.html
    └── inventaire.html
```

## Données

Les portefeuilles sont stockés dans LocalStorage sous la clé `alphaTerm_portfolios`. Au premier lancement, l'application précharge des données de démonstration réalistes. Les cours peuvent être actualisés via Yahoo Finance en passant par le proxy AllOrigins :

```text
https://api.allorigins.win/raw?url=https://query1.finance.yahoo.com/v8/finance/chart/TICKER
```

## Déploiement GitHub Pages

```bash
# Cloner le repo
git clone https://github.com/sicho96/AlphaTerminal
cd AlphaTerminal

# Pas de build nécessaire — vanilla JS + Tailwind CDN
# Activer GitHub Pages dans Settings > Pages > Source: main branch / root

# Vérifier que manifest.json et sw.js sont à la racine
# URL finale : https://sicho96.github.io/AlphaTerminal/
```

## Notes GitHub Pages

- Tous les chemins d'assets sont relatifs (`./css/`, `./js/`, `./pages/`).
- `404.html` est une copie du shell SPA `index.html` pour préserver les routes hash-based.
- `sw.js` est placé à la racine pour le scope maximal.
- Aucun backend, aucun Node.js et aucun SSR ne sont nécessaires.

## Développement local

Servez le dossier avec un serveur statique afin de tester les modules ES et le service worker :

```bash
python3 -m http.server 8080
# puis ouvrir http://localhost:8080
```
