# Thimoli — direction officielle V1

## Direction artistique

- Flat Design moderne
- Soft UI illustrée
- Formes rondes, lisibles et chaleureuses
- Profondeur 2.5D légère, sans rendu réaliste ni texture de jeu 3D
- Fond crème, cartes blanc chaud, ombres diffuses et courtes
- Orange corail `#FF8B5E`, bleu nuit `#173954`, verts et bleus pastel
- `Baloo 2` pour la marque et les grands titres
- `Nunito` pour le français
- `Noto Sans Tamil` pour le tamoul

La planche de référence officielle est `assets/reference-villages-official.jpg`.

## Les 12 villages

| Niveau | Nom | Tamoul | Thème pédagogique |
| --- | --- | --- | --- |
| 1 | Village des Premiers Pas | முதல் படி கிராமம் | Les bases du tamoul |
| 2 | Village de la Mer | கடல் கிராமம் | Les mots du quotidien |
| 3 | Village du Temple | கோவில் கிராமம் | La famille et les proches |
| 4 | Village des Rizières | நெல் வயல் கிராமம் | La nourriture et la nature |
| 5 | Village du Marché | சந்தை கிராமம் | Les achats et les prix |
| 6 | Village du Savoir | அறிவு கிராமம் | L’école et le travail |
| 7 | Village des Fêtes | திருவிழா கிராமம் | La culture et les traditions |
| 8 | Village des Collines | மலை கிராமம் | Les voyages et les lieux |
| 9 | Village de la Ville | நகர கிராமம் | La vie en ville |
| 10 | Village des Horizons | எல்லை கிராமம் | Les projets et le futur |
| 11 | Village de la Sagesse | ஞான கிராமம் | Les idées et les émotions |
| 12 | Village du Maître | ஆசான் கிராமம் | La maîtrise du tamoul |

## Règles de progression

- Les villages représentent des univers pédagogiques différents, pas seulement une montée en richesse.
- Les illustrations verrouillées restent colorées ; seul l’état de la carte est atténué.
- Le niveau actif reçoit un contour corail.
- Chaque carte affiche toujours le niveau, le nom français, le nom tamoul et le thème.
- L’accueil conserve le niveau 3 comme état de démonstration initial.

## Mascotte et accompagnement

- La mascotte est un coach, pas une décoration permanente.
- Cinq états visuels sont utilisés : accueil, indice, réussite, correction douce et célébration.
- Les bulles restent en HTML/CSS : aucun texte n’est incrusté dans les images.
- Une bonne réponse associe encouragement, explication et exemple.
- Une mauvaise réponse utilise un panneau ambre doux, sans rouge punitif ni message culpabilisant.
- La première erreur ne coûte aucun cœur ; la deuxième retire au maximum un cœur pour la question.

## Navigation et pages

- La barre principale contient cinq entrées : Accueil, Villages, Révisions, Stats et Profil.
- Les cibles tactiles mesurent au moins 44 px.
- La page Stats distingue clairement les données de démonstration des données réellement enregistrées.
- Le Profil rassemble progression, XP, objectif quotidien et badges.
- Les Paramètres permettent notamment de réduire les animations.
- La fin de leçon met en avant la célébration, les XP, la précision, l’acquis principal et la progression du village.

## Mouvement

- Les transitions restent rapides et légères, entre 180 et 430 ms.
- La navigation fixe ne dépend d’aucun conteneur transformé.
- `prefers-reduced-motion` et le réglage interne désactivent les animations non essentielles.
