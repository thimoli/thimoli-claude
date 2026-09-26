# Retours du test utilisateur — 26 septembre 2026

Application des deux feuilles manuscrites transmises par l’utilisateur. Le parcours, le style et les fichiers audio existants sont conservés.

## Intégré dans le prototype local

- Associations numérotées et colorées : la couleur indique le lien choisi, jamais une validation anticipée. Après validation, chaque paire porte un verdict écrit et un symbole. Une erreur affiche aussi la bonne association ; « Réessayer » réinitialise le jeu.
- Vocabulaire visuel : illustrations SVG locales pour les premiers mots de famille, corps, couleurs et école ; elles sont réutilisées dans les modèles et les associations. Les mots non illustrés conservent leur texte.
- Famille : un exemple d’arbre avec une référence « Moi » et des âges pour distinguer grand frère et grande sœur. Il s’agit d’une famille d’exemple, pas de la famille réelle de l’apprenant.
- Après une quête réussie : bouton « Étape suivante » lorsqu’une suite autorisée existe. Dans les villages, le bouton respecte les prérequis et n’ouvre pas un niveau non acquis ; les retours au parcours et au village restent secondaires.
- Consignes : les noms des premiers sons sont entre guillemets pour distinguer le son et sa longueur.
- Reconstruction de mots et phrases : sens affiché après une réponse correcte quand la question comporte cette information, dans la langue de l’interface.
- « Mon sac à outils » contient un bilan de reconnaissance des 31 signes de base : 12 voyelles, 18 consonnes et āytam. Correction après chaque réponse, score de premier essai et liste à revoir. Ce bilan n’évalue pas la prononciation et n’attribue ni XP ni progression. Une session en cours de bilan n’est pas conservée après rechargement.

## Pas présenté comme terminé

- Aucune modification, génération ou certification des enregistrements audio. Les jeux de mémoire fondés sur l’écoute restent différés jusqu’au contrôle des sons concernés.
- Les ambiguïtés phonétiques et les annotations tamoules difficiles à déchiffrer sur les photos ne sont pas corrigées au hasard.
- Cette mise à jour n’est pas une validation par un professeur ni une reproduction certifiée des douze manuels Valar.
- Pas de publication officielle ni de copie vers `site-deploy/dist`. Les conditions de sortie, dont les droits commerciaux des enregistrements, restent à régler.

## Vérification

- Régressions : `test-next-stage.cjs`, `test-foundation-flow.cjs`, `test-sister-feedback.cjs`, `test-alphabet-review.cjs`, tests de langues, progression, stockage, thème et démarrage.
- `smoke-curriculum.js` : 1 474 rendus d’activités, 18 quêtes et 54 activités de fondations.
- Rendu navigateur vérifié à 320 et 390 px : arbre de famille, bilan/correction, associations, message d’erreur et retour au jeu. Pas de simulation de reconnaissance vocale et pas de validation acoustique.
- Les fichiers du prototype sont synchronisés avec `dist/`, le dossier servi sur le port 4173 ; `test-static-package.cjs` contrôle leur identité avec les sources.
