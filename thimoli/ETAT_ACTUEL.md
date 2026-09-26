# Thimoli — référence actuelle, 26 septembre 2026

Ce document prime sur les anciens README et guides Claude, qui décrivent des versions historiques.

## Retours de la sœur — 26 septembre 2026

Lire `RETOURS_TEST_UTILISATEUR.md` : vocabulaire illustré et exemple de famille, associations colorées/numérotées avec corrections, enchaînement « Étape suivante », sens après reconstruction et bilan de reconnaissance des 31 signes de base. Interfaces FR/EN/DE. Modules ajoutés : `vocabulary-visuals.js/.css`, `sister-feedback.css` et `alphabet-review.js/.css`. Source et aperçu `dist/` synchronisés, sans mise à jour du site commercial. Sons et jeux de mémoire audio restent différés ; ne pas présenter ce travail comme une validation phonétique ou professorale.

## Préparation officielle — dernière mise à jour

Traductions villages : i18n-exercises.js ajoute les titres/objectifs/intitulés des 120 étapes, les sens des modèles, les 12 fiches grammaticales, les variantes de lecture et les consignes/indices/corrections des jeux en EN/DE. Chargé après le moteur et avant app.js, inclus dans le paquet de production. Les réponses, identifiants et sons restent inchangés. Corrections mixtes tamoul/traduction séparées ; mémory marqué avec la langue réelle et aide d'assemblage traduite même dans un bloc tamoul. Test test-exercise-i18n.cjs couvre les champs des étapes et de leurs activités, les interpolations, la correction mixte et l'invariance des réponses. Réussite des tests existants learning/Kural/stockage/audio. Navigateur : sept pages à 320/390 px, EN/DE, sans débordement global ; mini-leçon et associations vérifiées. Pas de test physique iOS/Android ni validation enseignante. Maintenir les validations humaines de release-readiness.json à false. Sons toujours reportés.

Confirmation ultérieure : la future structure sera établie en France, avec une diffusion internationale. Mentions FR/EN/DE actualisées ; structure toujours non créée, autres informations d'éditeur manquantes. Cette confirmation remplace la mention « pays non précisé » ci-dessous.

Lire PREPARATION_PUBLICATION.md et AUDIT_V1_LANGUES_ET_CONFORMITE.md. Contact confirmé : contact.thimoli@gmail.com ; structure non créée et pays non précisé. Déblocage progressif approuvé pour la production, prototype encore tout ouvert via release-config.js. Profil sans prénom imposé, écran de récupération de chargement, documents préparatoires FR/EN/DE et contact intégrés. Audit des sentiers étendu aux douze villages. Scripts check-release/build-release empêchent une préparation officielle tant que les validations manquent. Tests release/boot/legal réussis. Sources et dist synchronisés, aucun déploiement commercial, aucun changement de sons. Traductions pédagogiques, droits et validation juridique restent à terminer : ne pas présenter l'app comme prête officiellement.

## Audio Nila intégré au prototype local — mise à jour du 23 septembre

À la demande explicite de l'utilisateur, `index.html` et `dist/index.html` chargent désormais `assets/audio/pedagogical-index.js` après l'index original. Cet ajout remplace 211 associations : 31 signes de base et 180 combinaisons. Les 36 combinaisons des familles ள, ற, ன gardent leurs enregistrements originaux : le lot initial contient 38 segments pour 36 attendus, et la reprise groupée ne donne pas un découpage stable. Ne pas les présenter comme remplacées. De petites reprises ont été générées, mais aucun fichier exploitable de ces trois familles n'a été intégré.

Les 211 WAV sont découpés localement avec consensus sur neuf réglages de détection des silences, sans étirement de la voix. Rapport de correspondance dans `output/audio-private-elevenlabs/integration-report.json`. C'est un contrôle du signal et de l'ordre demandé, pas une validation linguistique humaine de 211 sons. Les mots, le design et la progression ne sont pas modifiés. Les originaux restent disponibles : retrait de la balise `pedagogical-index.js` = retour à la banque précédente.

Tests `test-pedagogical-audio.cjs` et `test-audio.js` réussis : 247 chemins existants, 211 remplacements, 36 anciens sons, index des mots inchangé. Lecture navigateur constatée pour ஆ et ஞா sur leurs nouveaux WAV. Pas de test iPhone physique.

ATTENTION : audios ElevenLabs Free réservés au prototype privé, non publiés sur le site commercial. `site-deploy/dist` n'a pas été mis à jour avec cette banque. Le serveur local utilise `dist`. Ne pas synchroniser automatiquement cette banque dans une publication commerciale sans clarifier les droits. Outil de décodage npm mpg123-decoder installé uniquement sous output/audio-private-elevenlabs/decoder, hors bundle de l'app.

## Résultats des défis — carte flottante

## Contrôle V1 et essai audio privé — 23 septembre

Essai ElevenLabs Free : Nila / Eleven v3, dix voyelles en cinq contrastes, deux variantes produites par une demande ; un fichier conservé dans `output/audio-private-elevenlabs/`, hors site publié. Aucune validation linguistique et aucun remplacement des sons. Aucun achat/abonnement.

Contrôle navigateur des cinq onglets à 390 et 320 px : navigation fonctionnelle et pas de débordement horizontal observé. Progression niveau zéro conservée après rechargement (3 quêtes, 4 étoiles, quête à reprendre). Simulation de largeur dans le navigateur desktop, pas un test Safari iOS réel. Tests smoke, learning, Kural et audio réussis.

`saveState()` signale désormais un échec de stockage au lieu de le masquer ; message FR/EN/DE uniquement en cas d'échec, supprimé quand la sauvegarde réussit. `scripts/test-storage.js` couvre succès, quota refusé et récupération. Pas de synchronisation entre appareils ajoutée. Sources et copies locales synchronisées.

### Carte de résultat

`setupLessonFeedbackSheet()` affiche les résultats des activités villages et niveau zéro dans une carte modale remontant du bas. Mascotte détourée agrandie à gauche, fond flouté, bouton Continuer/Réessayer fixe sous le contenu défilable. Fond inerte, focus clavier dans la carte, animations désactivables. Vérification mobile 390 × 844 et disparition du flou au passage suivant. Pas de changement audio ni de navigation.

## Profil — carnet d’aventure

`profile()` et `profile.css` : carte d’identité illustrée, prochain trophée, six réussites dépliables et liens fonctionnels vers bases, villages, Kural, statistiques et paramètres. Trophées calculés à partir des progrès existants, sans XP ou récompenses fictives ajoutées. Le village n’est terminé qu’à 41 étapes. Récitation Kural auto-déclarée, non évaluée vocalement. Interface FR/EN/DE. Aucun changement audio. Version locale uniquement ; tests `profileAssertions` dans le smoke test.

## Refonte Stats — 23 septembre

- `stats()` dans `app.js`, présentation isolée dans `stats.css` : élan, objectif quotidien, sept jours, progression niveau zéro / villages / Kural, prochaine action et historique repliable.
- Données réelles locales uniquement. Récitation Kural explicitement auto-déclarée. Villages terminés à 41 étapes (évaluation comprise). Réussite calculée sur les premiers essais enregistrés, pas sur les corrections suivantes.
- Historique des séances limité à 100 enregistrements ; aucune promesse de total historique exhaustif. Pas de compteur d’anciennes erreurs présenté comme des erreurs encore non corrigées.
- Textes du nouvel écran disponibles en français, anglais et allemand. Tests de calcul et de rendu ajoutés à `scripts/smoke-curriculum.js`.
- Sources, `dist/` et `site-deploy/dist/` synchronisés ; cela ne constitue pas une publication distante.

## Dossiers

- Sources : fichiers HTML/CSS/JavaScript à la racine et `assets/`.
- `dist/` : copie de prévisualisation locale ; synchroniser après modification des sources.
- `site-deploy/` : dépôt de publication avec son historique Git. Conserver ce dossier ; sa présence ne signifie pas que les changements sont publiés.
- `scripts/` : tests du projet.
- `output/`, `mockups/`, `deck_assets/` : présentations et ressources graphiques.
- `tmp/pdfs/` : ressources pédagogiques à conserver.
- `tmp/incoming-claude-2026-09-13-v1/` : réception historique de Claude, conservée pour référence.

Le dossier du Bureau « projet thimoli/01 - Application » est relié à cette source : pas de deuxième copie à maintenir. Modifier ses fichiers modifie le vrai projet.

## Produit

Villages, 23 septembre : interface `village-adventure.js` / `.css`, mission à reprendre, sentier en cinq lieux et dix quêtes, carte conservée avec accès directs 1–12. Moteur pédagogique version 3 : mémoire et écoute ajoutées dans les 120 quêtes, en complément des activités existantes. Résultats locaux dans `villagePractice`. Lire PEDAGOGIE_VALAR.md : l'adaptation complète des vrais manuels n'est pas réalisée faute de leur contenu.

Kural : atelier de mémorisation ajouté le 23 septembre (`kural-practice.js` et `.css`). Lecture, reconstruction de chacune des deux lignes, puis récitation auto-évaluée. Reprise locale et liste des textes à retravailler. L'historique « lu » reste séparé de « récité ». Tests : `node scripts/test-kural-practice.js` (1 330 textes). Aucun enregistrement microphone ni évaluation orale automatique. Version locale et copie de publication synchronisées, mais publication toujours bloquée.

Navigation : Stats, Villages, Accueil, Kural, Profil. L'accueil correspond à la route technique `?page=review`, les villages à `?page=home`.

Niveau zéro : 18 quêtes, 54 activités. Douze villages avec exercices variés. Données des 1 330 Kurals. Progression conservée dans le navigateur, sans synchronisation de compte.

Les 12 manuels Valar complets ne sont pas présents. Le contenu original s'inspire des ressources disponibles : voir `PEDAGOGIE_VALAR.md`. Voir `QUESTS_HANDOFF.md` pour les corrections des jeux.

Le lecteur référence 247 signes. Les tests techniques passent ; cela ne valide pas la prononciation par un enseignant. Treize enregistrements trop silencieux ont été remplacés ; une vérification linguistique reste nécessaire.

## Exécution

Depuis ce dossier : `python -m http.server 4173 --bind 127.0.0.1 --directory dist`

Accueil PC : http://127.0.0.1:4173/?page=review. Ce lien local n'est pas accessible depuis un téléphone distant.

Tests : `node scripts/test-learning.js`, `node scripts/test-audio.js`, `node scripts/smoke-curriculum.js`.

## Sauvegarde et publication

Sauvegarde du code et des ressources avant rangement : `C:/Users/abinash optrace/Documents/Codex/Thimoli-sauvegardes/Thimoli-version-actuelle-20260923-135955.zip`.

Le lien hébergé est encore une ancienne version : la publication des dernières quêtes n'a pas abouti. Ne pas annoncer une mise en ligne sans confirmation de déploiement.

Ne plus multiplier les ZIP dans le dossier de travail. Conserver une sauvegarde vérifiée avant une étape importante, puis retirer les exports temporaires devenus inutiles. Garder les PDF pédagogiques, originaux graphiques et fichiers reçus non fusionnés.
