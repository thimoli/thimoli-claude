# Recette des langues et du format mobile — 23 septembre 2026

## Livré

- Dictionnaire i18n-exercises.js : textes pédagogiques des villages en anglais et allemand, fondés sur les textes français existants. Ce travail traduit le programme actuel ; il ne le transforme pas en reproduction des manuels Valar.
- Titres, objectifs, intitulés de mini-leçons et notes des 120 étapes ; significations des modèles ; 12 fiches de grammaire partagées, questions et variantes de lecture, rédaction guidée, consignes, indices et explications des jeux.
- Interpolation traduite des significations dans les questions générées, pas seulement des mots du menu.
- Corrections d'associations et de classement : seules les portions tamoules portent lang=ta. Les explications courtes peuvent maintenant être traduites.
- Cartes mémory : langue et annonces accessibles suivent FR/EN/DE, texte tamoul préservé.
- Aide de reconstruction traduite explicitement, même dans le conteneur de réponse tamoule.

## Tests

test-exercise-i18n.cjs contrôle la présence des traductions pour les champs des étapes et les titres/consignes/indices/explications de leurs activités en EN/DE. Il contrôle les questions interpolées et le retour de correction, ainsi que les réponses et le programme inchangés. Une présence de traduction ne vaut pas une certification linguistique.

test-learning.js : 1330 activités générées sur 12 niveaux ; bonnes réponses, réponses absurdes et vides, mauvais liens, mauvais classements, assemblage, marques tamoules et auto-évaluation testés. smoke-curriculum.js : 1474 rendus, reprises et nouvelles tentatives des jeux, niveau zéro et statistiques. Tests Kural, stockage, pages légales et audio également exécutés sans régression constatée.

Navigateur desktop en largeurs 320 et 390 px, anglais puis allemand : accueil, villages, parcours, statistiques, profil, Kural et exercice. Les 28 mesures n'ont pas montré de débordement horizontal global. Mini-leçon du village 5 et associations contrôlées visuellement ; le vocabulaire affiché change bien de langue. Ces mesures ne prouvent pas que chaque élément de chaque exercice est parfait.

## Limites et recette finale requise

- Pas de vraie session Safari iPhone ni Chrome Android dans cette vérification.
- Une relecture par enseignant tamoul reste nécessaire, notamment pour l'adéquation niveau scolaire/contenu et les nuances lexicales, grammaticales et phonétiques. Les versions EN/DE doivent aussi être relues par des locuteurs compétents.
- Le contrôle couvre les contenus villages actuels, pas la traduction exhaustive de tous les textes historiques ou de toutes les aides du niveau zéro/Kural. Le message prudent des réglages est conservé.
- Aucun fichier audio modifié. Les tests audio vérifient le fonctionnement et les chemins, pas l'articulation ni les droits.
- Aucun déploiement officiel ni changement de licence. Sources synchronisées vers dist pour le prototype courant.

## À essayer sur téléphone

1. Choisir anglais puis allemand dans Profil → Paramètres ; ouvrir une leçon de village.
2. Comparer les significations et consignes, en vérifiant que les caractères tamouls sont conservés.
3. Faire une mauvaise association, corriger les liens, puis valider et continuer.
4. Retourner deux cartes différentes, attendre leur fermeture, puis reprendre.
5. Tester une phrase longue, le clavier, les corrections et la reprise après rechargement.
6. Repasser en français et vérifier la progression. Ne pas effacer les données pour effectuer ces essais.
