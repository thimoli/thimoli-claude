# Première revue pédagogique — 24 septembre 2026

## Portée et statut

Revue documentaire et logique du niveau zéro, des données des dix mini-leçons du village 1 et de leur moteur. Ce document n’est pas une validation enseignante, un audit linguistique intégral des traductions ou une équivalence Valar. Aucun audio écouté, modifié ou validé pendant cette revue. Ne pas passer curriculumReviewed à true.

## Vérifié par confrontation aux références

Inventaire : 12 voyelles dans l’ordre, 18 consonnes portant le pulli, un signe spécial et 216 combinaisons uniques. Les quêtes du niveau zéro couvrent toutes les voyelles et consonnes de cet inventaire. Les signes Grantha supplémentaires ne font pas partie de ces 247 signes et ne sont pas couverts par ce contrôle.

Le pulli retire la voyelle inhérente. Les cinq oppositions simples courte/longue sont cohérentes. ஐ et ஔ sont des diphtongues ; dans le classement scolaire traditionnel elles appartiennent aux நெடில். Le tri actuel les exclut expressément : ne pas présenter « cinq longues » comme la totalité de la catégorie scolaire des நெடில்.

Sources consultées le 24 septembre :
- Open University, cours débutant, tableau de l’écriture et valeurs consonantiques : https://www.open.edu/openlearn/languages/beginners-tamil-taster-course/content-section-2
- Tamil Virtual Academy, classement scolaire குற்றெழுத்து / நெட்டெழுத்து : https://www.tamilvu.org/slet/lA100/lA100pd3.jsp?bookid=171&pno=41

## Corrections effectuées

- Indice ன் : remplacer « n bref » par une indication de placement derrière les dents supérieures. La différence avec ந் et ண் n’est pas seulement une durée.
- Indice ழ் : préciser que ce son avec langue repliée diffère du l français. « lh » reste une aide de lecture approximative, non une transcription phonétique exacte.
- Jeux à trou : supprimer le commentaire automatique sur courte/longue quand le trou peut concerner une consonne ou un autre signe. La nouvelle correction demande de revoir le signe, une éventuelle marque vocalique et le pulli. Versions EN/DE ajoutées.

## Limites et points à faire relire

- Les dix mini-leçons du village 1 passent des signes aux mots puis à trois phrases : progression globalement cohérente selon notre revue, mais vocabulaire dense et prérequis de lecture non exhaustifs. Ce n’est pas une preuve d’alignement au manuel Valar 1.
- Les glosses de vocabulaire et les phrases ont été inspectées, sans validation lexicographique exhaustive. படிக்கிறேன் peut exprimer lire ou étudier selon le contexte ; la glose « je lis » ne doit pas devenir une définition exclusive.
- Le passage « இது என் அம்மா » du pack débutant mérite une relecture du registre attendu pour présenter une personne ; aucun changement conjectural effectué.
- Les repères français et anglais ne codent pas toutes les oppositions tamoules. Les réalisations sri-lankaises, les consonnes selon leur position et la durée des enregistrements restent à contrôler avec un locuteur compétent.
- Rédaction et tracé restent auto-évalués : pas de promesse de correction automatique linguistique.

## Contrôles reproductibles

`node scripts/test-pedagogy-foundations.cjs` : inventaire, couverture des quêtes, unicité des combinaisons, maintien des distinctions de voyelles et pulli dans la comparaison, pertinence du retour de correction.

`node scripts/test-learning.js` : 1 330 activités générées, solutions et mauvaises réponses. Test technique, pas preuve de justesse linguistique.

`node scripts/test-exercise-i18n.cjs` : couverture EN/DE et conservation des réponses tamoules.
