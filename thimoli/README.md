# Thimoli v1.1

> Document historique. Pour l'état réel et l'organisation actuelle, lire [ETAT_ACTUEL.md](ETAT_ACTUEL.md).

Prototype web mobile fonctionnel de l’application d’apprentissage du tamoul, pensé pour un écran d’iPhone et utilisable directement dans un navigateur.

## Lancer l’application

Depuis ce dossier :

```powershell
python -m http.server 4173
```

Puis ouvrir `http://localhost:4173/`.

Le prototype ne demande ni installation ni compilation. La progression, les réponses, les réglages et les statistiques sont conservés dans le stockage local du navigateur.

Les polices Baloo 2, Nunito et Noto Sans Tamil sont embarquées dans `assets/fonts/` pour garantir le même rendu sur tous les appareils, même sans accès à Google Fonts.

## Parcours disponibles

- Accueil et progression du village
- Galerie des 12 villages, alignés sur les niveaux Valar Tamil 1 à 12
- 120 leçons originales et 360 exercices répartis sur les douze sentiers
- Exercices de lecture, écoute, association, reconnaissance et réponse en contexte
- Un examen blanc de 10 questions et un examen de 12 questions par village, débloqués avec la progression
- Révisions ciblées par compétence et plan express de cinq minutes
- Statistiques sur 7 jours, quatre compétences, XP et progression globale
- Profil, objectifs et badges
- Paramètres d’apprentissage et d’accessibilité
- Mini-leçons interactives en quatre questions et évaluations en douze questions
- Indices, prononciation, correction pédagogique et réessai
- Résumé de fin de leçon avec XP, précision et progression
- Navigation arrière/avant et liens directs via `?page=`

## Mascotte coach

Les cinq poses optimisées sont dans `assets/mascot/` : accueil, indice, réussite, correction douce et célébration. Les bulles sont rendues par l’interface afin de rester lisibles, accessibles et adaptées au contexte.

## Règle des cœurs

Les trois premiers essais sont gratuits. Un cœur est utilisé à partir de la quatrième erreur et il est impossible d’en perdre plus d’un sur la même question. Une explication et un exemple sont toujours proposés avant le nouvel essai.

## Programme pédagogique

Le contenu original est séparé du moteur de l’application dans `curriculum.js`. Chaque village contient dix modules avec un objectif, une notion à retenir et trois familles d’exercices. Cette structure facilite la relecture par un professeur de tamoul et permet de corriger un niveau sans toucher à l’interface.

Les illustrations Flat Design / Soft UI sont regroupées dans `assets/thimoli-villages-flat-v2.png` et suivent la planche officielle des 12 villages.
