# Thimoli — audit préparatoire du 23 septembre 2026

Ce contrôle du code et du prototype n'est ni une certification juridique ni un audit exhaustif de sécurité. Ne pas présenter la version comme prête à une exploitation commerciale.

## Corrections livrées

- Compléments anglais/allemand des nouveaux parcours, consignes, retours d'exercice et réglages : i18n-updates.js.
- Suppression de la promesse « toute l'interface » ; les réglages signalent les contenus pédagogiques encore français.
- Confidentialité, conditions d'utilisation et mentions/crédits en français, anglais et allemand, accessibles depuis les réglages. Documents explicitement préparatoires, sans identité inventée.
- Export des données locales et effacement avec confirmation, limité à la clé Thimoli. Ne pas effacer les données utilisateur pendant les tests.
- Attribution ElevenLabs dans le titre du prototype qui utilise la banque pédagogique gratuite et dans les réglages. Aucune nouvelle génération audio ni changement du design ou de la progression.
- Copie dans dist pour le serveur local ; aucune publication vers site-deploy/dist.

## Langues : travail restant

Les nouveaux menus ne sont pas équivalents à un programme scolaire entièrement traduit. Il reste notamment des textes de leçons, du vocabulaire français dans les réponses et des contenus des niveaux avancés à adapter en anglais/allemand. Les textes tamouls doivent rester inchangés. Les zones lang=ta peuvent aussi contenir des aides françaises et nécessitent une séparation sémantique.

Le fichier output/compliance-audit/untranslated-candidates.json liste les chaînes inchangées des pages inspectées : il contient aussi des noms propres et du texte déjà traduit, donc ce n'est pas un décompte fiable des erreurs. Il faut encore relire humainement chaque activité dans les deux langues et valider les aides phonétiques avec un enseignant.

## Points bloquants avant lancement public

1. Identifier l'éditeur : personne/association/entreprise, pays, coordonnées légales pertinentes, contact utilisateur ; ne pas déduire ces informations du compte Windows.
2. Choisir l'hébergement définitif et documenter prestataires, journaux, durées de conservation, sécurité et transferts éventuels. Un tunnel sur PC n'est pas un hébergement de production.
3. Finaliser les finalités et bases légales des traitements, la minimisation/conservation des historiques et les modalités d'exercice des droits. Adapter l'information aux enfants et déterminer si des consentements parentaux sont nécessaires selon les traitements ; ne pas imposer une règle universelle arbitraire.
4. Vérifier les licences des sons, illustrations, mascotte, éditions du Tirukkural et ressources scolaires. Les activités ne reproduisent pas les douze manuels Valar complets. Les licences de polices sont conservées dans assets/fonts.
5. Banque Nila générée sur le forfait gratuit ElevenLabs : pas d'usage commercial. Une souscription payante ultérieure ne rend pas rétroactivement ces générations commerciales. Attribution requise pour leur partage non commercial. Une future monétisation exige de résoudre ce point.
6. Vérifier pédagogiquement les niveaux avancés et les prononciations : contrôles techniques de fichiers ne signifient pas validation linguistique.

## Données observées dans le code

La progression, les tentatives, les brouillons et les réglages sont sauvegardés dans le navigateur, sans expiration automatique. Chaque origine a son stockage ; changer de lien peut donner l'impression de perdre sa progression. Le serveur reçoit nécessairement des requêtes réseau. Aucun SDK publicitaire, analytique externe ou demande de microphone/caméra/localisation n'a été identifié dans le code principal contrôlé ; ce constat ne prouve pas l'absence de journaux côté hébergeur.

Ne pas ajouter un bandeau de consentement factice : inventorier les traceurs réels et leur finalité. Les traceurs strictement nécessaires peuvent être exemptés de consentement ; de futures publicités/mesures d'audience changeraient l'analyse. Les conditions de vente devront être étudiées si une offre payante est ajoutée ; elles ne remplacent pas les conditions d'utilisation et la confidentialité.

## Vérifications effectuées

- smoke-curriculum : rendu des pages, 1474 activités, parcours des 12 villages, mémoire/associations, statistiques et profil : succès.
- test-pedagogical-audio : 211 nouveaux fichiers + 36 fichiers de repli ; 247 chemins présents ; index des mots inchangé. Pas de nouvelle validation humaine de l'articulation.
- test-legal : neuf combinaisons langue/document ; annulation de suppression et suppression ciblée sur stockage simulé : succès.
- audit-localization : traductions ajoutées testées en anglais et allemand : succès.
- Navigateur : réglages anglais, lien confidentialité anglais et page allemande vérifiés ; réglage français restauré. Aucun effacement de progression réelle.

## Références officielles consultées

- CNIL : https://www.cnil.fr/fr/recommandations-applications-mobiles
- Traceurs : https://www.cnil.fr/fr/cookies-et-autres-traceurs/que-dit-la-loi
- Information des mineurs : https://www.cnil.fr/fr/recommandation-6-renforcer-linformation-et-les-droits-des-mineurs-par-le-design
- Consentement des mineurs : https://www.cnil.fr/fr/recommandation-4-rechercher-le-consentement-dun-parent-pour-les-mineurs-de-moins-de-15-ans
- Mentions d'un site professionnel (à adapter au statut réel) : https://entreprendre.service-public.gouv.fr/vosdroits/F37351
- Licence de publication ElevenLabs : https://help.elevenlabs.io/hc/en-us/articles/13313564601361-Can-I-publish-the-content-I-generate-on-the-platform
