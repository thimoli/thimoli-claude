# Mode sombre — 23 septembre 2026

## Correctifs du 24 septembre

- Cartes `.quest-models article` corrigées : fond sombre, caractères clairs et sous-titres contrastés.
- Consignes sans fond orangé ; aide repliable sur surface neutre.
- Filtre SVG de rendu sur les villages en sombre : érosion alpha de 0,8 pixel et adoucissement de 0,2 pixel. Les fichiers source et les parties blanches internes restent inchangés ; ce n’est pas une vectorisation.
- Vérification à 390 × 844 : introduction « Les premières voix », consigne de jeu et village du Temple. Safari réel reste à confirmer sur téléphone.

- Paramètres : Clair, Sombre, Appareil ; préférence conservée dans le stockage existant.
- Initialisation avant affichage pour éviter le flash clair ; suivi des changements système.
- Palette nocturne étendue aux nouvelles quêtes, villages, Kural, profil, statistiques, exercices et informations légales.
- Illustrations originales conservées transparentes, non vectorisées. Aucun fichier audio modifié.
- Vérification visuelle navigateur à 390 × 844 : accueil, village, Kural, profil, stats, exercice d'association, paramètres. Le lien temporaire sert bien les nouveaux réglages ; choix sombre conservé après rechargement.
- Tests passés : smoke-curriculum (1 474 activités rendues), stockage, verrouillage production, traductions exercices, initialisation des thèmes.
- Reste à valider sur un vrai iPhone, notamment chaque illustration et tous les états des jeux. Pas de certification de tous les contours des 12 images.
- Sources et dist synchronisés. Aucune publication commerciale ; site-deploy inchangé.
