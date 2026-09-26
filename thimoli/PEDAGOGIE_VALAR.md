# Thimoli — ateliers des villages, 21 septembre 2026

## Mise à jour ludique du 23 septembre 2026

Les 120 quêtes (10 par village) conservent chacune une leçon et trois séances. Le moteur version 3 ajoute 120 activités de mémoire (trois paires tamoul/sens) et 120 activités d'écoute avec reconstruction ou reconnaissance. Elles réutilisent les items du curriculum existant : ce ne sont pas 240 contenus scolaires nouveaux. Les 1 330 activités d'entraînement générées comprennent désormais mémoire, écoute, association, assemblage, trous, tri, lecture, reconnaissance et rédaction. Les évaluations gardent 10/12 activités selon leur type.

Les placements changent à chaque nouvelle séance, restent stables à la reprise, et les paires incorrectes se referment après 900 ms. Les erreurs de mémoire ne comptent pas comme réussite sans aide. Les scores de séance sont sauvegardés séparément de la progression du sentier ; le mode exploration ne valide pas les étapes sautées.

L'AFTCLR a été consultée à nouveau le 23 septembre : elle donne accès à des annales Valar Tamil par niveau, pas aux douze manuels complets. Le catalogue TEDC propose des manuels et cahiers : https://tedc.org.uk/shop/. Aucun achat, téléchargement de manuel payant ni reproduction intégrale n'a été effectué. La refonte concerne l'expérience et les formats d'exercices ; l'alignement exhaustif avec les livres reste non réalisé.

Vérification : tests des solutions et mauvaises réponses sur 12 niveaux, rendu de 1 474 activités avec examens, présence des fichiers des 120 activités d'écoute, reprise et réinitialisation après erreur. Cette vérification technique ne remplace pas une validation pédagogique ni une écoute linguistique de chaque enregistrement.

## Périmètre réel

Les 12 villages ont chacun 10 mini-leçons, 30 séances d’entraînement et une évaluation finale. Une séance contient plusieurs activités. Les associations, constructions et textes à trous réutilisent volontairement les mots de la leçon. Ils ne représentent pas autant d’énoncés entièrement distincts.

Cette version est un parcours original Thimoli inspiré des **compétences observées dans des évaluations Valar Tamil**. Elle n’est ni une reproduction des 12 manuels, ni une préparation officiellement homologuée. Les manuels complets ne sont pas présents dans le projet. Une revue par un enseignant tamoul reste nécessaire, en particulier pour l’alignement chapitre par chapitre et les niveaux avancés.

## Sources consultées

- Catalogue de l’éditeur TEDC : https://tedc.org.uk/முகப்பு/பாட-நூல்கள்/
- École AFTCLR, annales et ressources : https://www.aftclr.fr/
- Niveau 1, évaluation 2021 : https://www.aftclr.fr/wp-content/uploads/2023/04/2021_valartamil_01.pdf
- Niveaux 2–12, évaluations 2024 : https://www.aftclr.fr/wp-content/uploads/2025/05/AFTCLR_2024_valartamil_02.pdf ; fichiers liés sur le site de l’école, suffixes 02 à 12.
- Alphabet : Tamil Virtual Academy, https://www.tamilvu.org/coresite/download/Basic_Ebook.pdf

Les PDF historiques ont parfois des polices tamoules anciennes rendant l’extraction peu fiable. Les structures d’activité ont servi de référence ; les phrases Unicode de `learning-engine.js` sont des créations originales. Aucun questionnaire complet d’annales n’a été copié.

## Correspondance prudente des formats

| Niveaux | Compétences rencontrées dans les évaluations | Mise en pratique dans cette version |
| --- | --- | --- |
| 1–2 | Associations, mots désordonnés, lettres manquantes, phrases à compléter | Relier, reconstruire un mot, compléter un signe, ordonner une phrase modèle |
| 3–5 | Pronoms, formes verbales, flexions, compréhension | Tri de formes explicites, phrases à compléter, réponse prélevée dans un court texte |
| 6–9 | Temps verbaux, identification grammaticale, compréhension et rédaction | Tris grammaticaux préparés, lecture active et rédaction guidée avec auto-évaluation |
| 10–12 | Analyse de formes, argumentation et production écrite plus longue | Ateliers préparatoires, lecture et rédaction longue ; **couverture avancée partielle**, pas d’équivalence au programme complet |

## Règles de validation

- Associations : toute la série doit être correctement reliée ; une série = un point.
- Construction : chaque bloc possède un identifiant, même lorsque deux blocs portent le même texte. Les voyelles liées et le pulli restent attachés à leur base. La consigne précise qu’il faut reconstituer le modèle étudié, sans prétendre interdire les autres ordres grammaticaux.
- Texte à trous : la solution est une partie du modèle enseigné.
- Tri : catégories écrites explicitement dans les données, jamais déduites automatiquement d’une traduction.
- Lecture : réponse exacte extraite du texte, ponctuation et espaces superflus tolérés. Les oppositions entre voyelles courtes/longues sont conservées.
- Rédaction : brouillon sauvegardé localement, début de modèle et checklist. **Aucune note linguistique automatique.** Elle est exclue du score.
- Score : réponses justes au premier essai, sans indice, divisées par le nombre d’activités corrigées automatiquement. Les essais suivants servent à apprendre, pas à gonfler le résultat.
- Évaluation finale : 8/12 minimum. Un échec ne valide pas le village. En mode aperçu demandé par le propriétaire, les autres étapes restent consultables.

## Vérification et suite

`node scripts/test-learning.js` vérifie toutes les activités générées (solutions, mauvaises réponses, Unicode, champs vides, examens). `node scripts/smoke-curriculum.js` vérifie le rendu des écrans et les transitions.

À compléter avant un lancement pédagogique public : validation humaine du tamoul et des traductions, acquisition/licence des manuels pour un vrai alignement des 12 niveaux, enrichissement du corpus avancé (poésie, morphologie, traduction), variantes de textes plus nombreuses, relecture enseignante des rédactions. Les exercices libres restent sauvegardés uniquement dans le navigateur : pas de synchronisation de compte.
