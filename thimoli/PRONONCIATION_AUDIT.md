# Audio : audit du 23 septembre 2026

## Second contrôle — contrastes courts/longs signalés par l’utilisateur

`scripts/check-letter-contrasts.py` vérifie les 247 fichiers courants et les 95 paires (5 voyelles seules + 5 pour chacune des 18 consonnes). Le décodeur étant inaccessible dans cette session malgré une permission accordée, les mesures précédentes sont réutilisées UNIQUEMENT après vérification SHA256 actuelle de chaque fichier : 247 correspondances exactes. Ce n’est pas une nouvelle écoute ni un nouveau décodage.

Résultat : les cinq paires vocaliques ont des durées actives proches : அ/ஆ 0,14/0,17 s ; இ/ஈ 0,20/0,22 s ; உ/ஊ 0,22/0,23 s ; எ/ஏ 0,28/0,21 s ; ஒ/ஓ 0,22/0,25 s. 78/95 paires déclenchent le seuil de triage (rapport long/court inférieur à 1,35). Ce seuil est un indicateur technique pour prioriser l’écoute, PAS une règle de validation linguistique ni un décompte de 78 erreurs. Quatre groupes identiques confirmés. Test du contrôleur 247/247 réussi, ne valide pas l’articulation.

Rapport : `output/pronunciation-review/contrast-audit.json`. Page comparative : `/pronunciation-review/contrasts.html`, paires puis les 247 signes et anciens candidats contextualisés non validés. AUCUN remplacement audio appliqué. La banque actuelle ne peut pas être présentée comme pédagogiquement validée. Ne pas corriger aveuglément par ralentissement global ou duplication du son court ; faire valider d’abord les cinq paires de voyelles, puis chaque famille consonantique.

Référence pédagogique : https://www.tamilvu.org/courses/teacher_training/tt02/tt0201/tt0102012.htm (durée des lettres, மாத்திரை). Les durées actives mesurées ici ne sont pas un alignement phonétique.

## Revue complète : 247 signes

`scripts/review-letter-audio.py` décode les 247 sons actuels et génère une banque comparative féminine ta-LK-SaranyaNeural (débit et hauteur neutres), chaque signe dans la phrase entière `இது [signe] என்னும் எழுத்து.`. Aucun découpage de phonème.

Résultat : 247/247 fichiers actuels et candidats passent les contrôles de signal. Quatre groupes de fichiers actuels sont identiques ; aucun candidat n’est identique octet par octet. Cela ne garantit ni que chaque lettre est effectivement prononcée dans la phrase ni que son articulation est correcte.

Rapport : `output/pronunciation-review/audit.json`. Comparaison locale : `/pronunciation-review/index.html`, copie servie dans `dist/`. Ces 247 candidats ne sont PAS intégrés au lecteur des exercices et ne sont pas publiés. Une validation d’écoute reste nécessaire ; seul ஔ avait déjà été approuvé et intégré. Aucun enregistrement précédent supprimé.

## Préférence confirmée et essai ciblé

### Validation utilisateur et intégration

L’utilisateur a approuvé l’essai contextualisé de ஔ. L’index de cette lettre référence maintenant `assets/audio/letters-checked/au-sri-lanka-context.mp3` : il s’agit de la phrase entière « இது ஔ என்னும் எழுத்து. », pas d’un phonème isolé. Original conservé. Cette validation ne s’étend pas aux autres sons. Essai de voix masculine reporté à la demande de l’utilisateur ; aucune modification des autres voix.

L’utilisateur demande le tamoul scolaire du Sri Lanka et signale « aou », interprété comme ஔ. Essais non déployés dans `output/audio-pilot-sri-lanka/`, générés avec ta-LK-SaranyaNeural, débit et hauteur neutres. La lettre seule et répétée produit un signal presque silencieux (RMS inférieur à 0,0003) : candidats rejetés. La phrase `இது ஔ என்னும் எழுத்து.` produit 2,04 secondes de son (RMS 0,0866), mais la présence et la justesse de la lettre dans la phrase restent à valider à l’écoute. Fichier proposé à l’utilisateur, sans remplacement de l’audio actuel.

Le test du lecteur passe pour les 247 signes. Ce résultat ne valide pas leur prononciation.

`node scripts/audit-pronunciation.js` repère quatre groupes de fichiers identiques octet par octet :

- எ / யெ
- ஒ / வொ
- ந் / ன்
- ந / ன

Ce sont des candidats à une écoute comparative, pas quatre verdicts linguistiques automatiques. Les deux premiers groupes sont particulièrement prioritaires pour vérifier la consonne initiale.

Le générateur historique utilise ta-IN-PallaviNeural, débit -8 %, hauteur +2 Hz. L’index actuel mélange 13 fichiers WAV de remplacement, 46 anciens extraits et 188 fichiers d’alphabet. Le nom « letters-checked » ne constitue pas une validation par un enseignant.

Pour corriger les enregistrements : préciser la variété de tamoul scolaire souhaitée, obtenir des exemples signalés et faire valider un lot pilote par un locuteur compétent avant de remplacer toute la banque. Conserver les anciens fichiers jusqu’à validation. Aucun remplacement sonore n’a été effectué lors de cet audit ; ne pas présenter ces sons comme corrigés.

Référence pédagogique à consulter : https://www.tamilvu.org/en/node/752 (tableau audio des 247 lettres). La consultation n’accorde pas automatiquement le droit de redistribuer leurs enregistrements.
