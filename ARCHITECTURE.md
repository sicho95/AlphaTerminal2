# Architecture cible — AlphaTerminal2

AlphaTerminal2 doit être une PWA structurée autour d’un shell applicatif, de plusieurs applications métier et d’une page Paramètres centralisée.

Le projet ne doit pas mélanger les vues fonctionnelles, les paramètres globaux, la configuration des applications et la configuration ESP32.

## Principe général

```text
AlphaTerminal2
├── Shell PWA
├── Applications
└── Paramètres
```

## Shell PWA

Le shell est la couche commune à toute l’application.

Il gère :

- layout global ;
- navigation ;
- thème clair / sombre / auto ;
- notifications ;
- état offline ;
- accès aux apps ;
- accès aux paramètres ;
- persistance locale des préférences.

## Applications

Une application est un module métier.

Exemples :

```text
Applications
├── Portefeuilles PEA / CTO
├── Nouvelles / Macro / Géopolitique
└── Futures apps
```

Chaque application peut avoir ses propres vues internes.

Exemple pour Portefeuilles PEA / CTO :

```text
Portefeuilles PEA / CTO
├── Dashboard
├── Positions
├── Historique
├── Analyse
├── Signaux
└── Rapports
```

## Paramètres

La page Paramètres centralise la configuration durable.

Elle doit être séparée des vues métier.

Structure cible :

```text
Paramètres
├── Général
├── Apparence
├── Données
├── Portefeuilles
├── AlphaTerminal2
├── ESP32
├── Notifications
├── Sauvegarde / import / export
└── À propos
```

## Règle de séparation

- Les applications servent à consulter, analyser et agir.
- Les paramètres servent à configurer.
- Le dashboard synthétise.
- Les rapports expliquent.
- Les données JSON transportent la donnée.
- Le Markdown conserve le raisonnement.
- SichoBrain reste la mémoire durable officielle.
- AlphaTerminal2 reste l’interface applicative.

## Apparence

L’UI / UX cible doit être moderne, claire, professionnelle et sobre, dans l’esprit de CHART.

Modes obligatoires :

- clair ;
- sombre ;
- automatique selon le système.

Le choix utilisateur doit être conservé localement.

## ESP32

La configuration ESP32 ne doit pas être placée dans les vues financières.

Elle doit vivre dans :

```text
Paramètres > ESP32
```

Cette section peut contenir :

- état de connexion ;
- adresse ou découverte ;
- pairing ;
- test de communication ;
- commandes disponibles ;
- diagnostic ;
- reset de configuration.

## Navigation recommandée

Mobile : barre inférieure avec accès rapide aux sections principales.

Desktop : sidebar ou topbar claire.

Sections principales recommandées :

1. Accueil
2. Apps
3. Portefeuilles
4. Rapports
5. Paramètres

## Objectif de refactor

AlphaTerminal2 doit évoluer vers :

```text
/
├── index.html
├── manifest.json
├── sw.js
├── css/
│   └── app.css
├── js/
│   ├── app.js
│   ├── router.js
│   ├── shell.js
│   ├── store.js
│   ├── theme.js
│   ├── settings.js
│   └── registry.js
├── apps/
│   ├── portfolios/
│   └── news/
├── pages/
│   ├── home.html
│   ├── apps.html
│   ├── reports.html
│   └── settings.html
└── docs/
```

Le refactor doit préserver le fonctionnement offline-first.
