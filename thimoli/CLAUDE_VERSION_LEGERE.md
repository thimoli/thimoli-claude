# Thimoli — version légère pour Claude

Instantané du 26 septembre 2026, après les améliorations proposées par la sœur de l’utilisateur.

## Ce qui est dans ce ZIP

Le code source actuel (HTML, CSS, JavaScript), les contenus et index JSON/JavaScript, les tests, les utilitaires et les documents de reprise. Les fichiers sources sont complets, pas abrégés. `MANIFEST-SHA256.json` répertorie leurs empreintes.

**Les images, polices et enregistrements audio sont volontairement absents pour réduire la taille.** Leurs références dans le code sont conservées. Ils restent dans le projet original et dans l’archive complète ; aucun original n’a été supprimé. Cette version sert à lire et modifier le code, pas à obtenir toute seule un aperçu graphique et sonore complet.

Pour restituer des modifications : renvoyer les fichiers modifiés ou un patch, puis les intégrer au projet complet en conservant son dossier `assets/`. Ne pas supprimer les références aux ressources absentes, ne pas fabriquer de faux sons et ne pas restaurer une ancienne interface.

## Reprise

Commencer par `ETAT_ACTUEL.md`, puis `RETOURS_TEST_UTILISATEUR.md`. Les passages historiques de ces documents ne priment pas sur leur section la plus récente. La demande suivante de l’utilisateur détermine le travail à effectuer ; cette archive n’autorise aucune publication.

- Application web statique HTML/CSS/JS, sans framework, sans dépendance npm de runtime. L’ordre des scripts se trouve dans `index.html`.
- Barre du bas : **Stats · Villages · Accueil · Kural · Profil**.
- L’Accueil central, niveau 0, est la route `?page=review`. La page principale des Villages est `?page=home`. Ne pas inverser les écrans d’après le nom technique des routes.
- Niveau 0 : 18 quêtes, outils alphabet/prononciation/écriture/vocabulaire et nouveau bilan des 31 signes de base.
- Villages : 12 niveaux, leçons et mini-jeux. Préserver la mascotte, les illustrations existantes et la progression locale.
- Tirukkural : 1 330 textes. Les données texte sont incluses, mais les MP3 ne le sont pas.
- Français, anglais et allemand ; modes clair, sombre et système.
- Nouveautés : famille illustrée autour de « Moi », vocabulaire SVG intégré au code, associations colorées/numérotées avec correction, bouton Étape suivante, sens après reconstruction, bilan alphabet. Les SVG écrits dans les fichiers JS restent inclus ; seuls les médias binaires sont omis.

## Fichiers principaux

- `app.js` : écrans, navigation, état, événements, progression.
- `curriculum.js`, `learning-engine.js`, `learning-ui.js` : contenus, génération/correction et affichage des activités.
- `foundations.js`, `village-adventure.js` : quêtes de bases et parcours des villages.
- `alphabet-review.js`, `vocabulary-visuals.js`, `sister-feedback.css` : derniers ajouts.
- `kural-practice.js` : mémorisation.
- `i18n-updates.js`, `i18n-exercises.js` : traductions.
- `styles.css` et CSS spécialisés : rendu responsive et thèmes.

Les tests logiques (par exemple `node scripts/test-alphabet-review.cjs`) peuvent servir à vérifier les changements. Les tests qui contrôlent les images, polices, fichiers audio, `dist/` ou les rapports privés sous `output/` nécessitent le projet complet et peuvent échouer dans cet export réduit. C’est notamment le cas de `test-learning.js`, `test-audio.js`, `test-pedagogical-audio.cjs` et `test-static-package.cjs`. Ne pas « réparer » ces absences intentionnelles en affaiblissant les tests.

## Limites à conserver

Aucun son n’a changé dans la dernière mise à jour. La vérification linguistique des sons et le mémory avec écoute restent différés. La banque ElevenLabs Free est réservée au prototype privé ; ne pas la publier commercialement sans régler les droits. Aucune validation professorale complète ni accès garanti aux douze manuels Valar complets.

Structure française envisagée mais pas encore créée ; contact `contact.thimoli@gmail.com`. Les documents légaux restent préparatoires. `release-readiness.json` conserve ses blocages. Les douze villages sont ouverts pour tester le prototype ; le déblocage progressif est prévu pour la sortie officielle. Ne pas effacer la progression de l’utilisateur.

Exclus aussi : copies `dist/` et `site-deploy/`, anciens exports, journaux, caches, dossiers privés d’outils et historique Git. Le lien temporaire du PC n’est pas un hébergement permanent. Modifier cette archive n’actualise pas automatiquement l’app sur le PC de l’utilisateur.
