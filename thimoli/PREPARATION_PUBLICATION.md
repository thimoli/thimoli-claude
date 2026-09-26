# Préparation de la sortie officielle — 23 septembre 2026

## Décisions confirmées

- Public international ; future structure prévue en France (confirmation utilisateur), mais pas encore créée. Ne pas inventer raison sociale, adresse, immatriculation ou responsable légal.
- Contact : contact.thimoli@gmail.com, ajouté aux documents FR/EN/DE.
- Déblocage progressif pour la sortie. Le prototype reste ouvert pour les tests.
- Sons reportés à la dernière étape. Aucun audio changé ni crédit consommé lors de cette préparation.

## Préparé dans le code

- Configuration prototype séparée de la configuration de production. En production, seul le premier village est ouvert au départ, puis chaque village après les 41 étapes du précédent. Une configuration manquante ne déverrouille pas tout. Une ancienne sélection de village verrouillé revient au premier village.
- Profil neutre : suppression du prénom Abinash imposé à tous les utilisateurs.
- Écran de récupération si le JavaScript principal ne produit aucun écran ; aucune suppression de données. Aide minimale sans JavaScript.
- Conditions, confidentialité, mentions préparatoires et contact disponibles en trois langues ; export/suppression locale conservés.
- Audit de localisation étendu aux sentiers des douze villages. Il reste de vraies lacunes pédagogiques EN/DE : ne pas confondre menus traduits et programme entièrement traduit.
- Préparation d'un paquet statique à liste de fichiers autorisés. Les dossiers output, documents, tmp, .git et scripts de génération ne sont pas publiés. Les liens symboliques d'assets sont refusés. Les ressources tierces doivent toujours être vérifiées avant validation des droits.

## Commandes

`node scripts/check-release.cjs` : contrôle préalable, affiche les points bloquants et retourne 1 tant qu'ils ne sont pas résolus.

`node scripts/build-release.cjs` : refuse de préparer une version officielle tant que le contrôle précédent bloque. Sinon exécute les tests et construit un nouveau dossier output/release-… sans écraser l'ancien et sans déployer.

`node scripts/test-release.cjs` : teste les modes prototype/production, l'évaluation finale requise et le profil neutre.

`node scripts/test-boot.cjs` : teste la récupération et la préservation d'un écran déjà rendu.

Les indicateurs release-readiness.json ne constituent pas une preuve ni une certification. Ne les passer à true qu'après vérification documentée. La licence des sons et les mentions incomplètes sont également détectées directement dans le code actuel.

## Ce qui empêche encore une sortie officielle

1. Éditeur réel, pays d'établissement, coordonnées et cadre juridique définitifs.
2. Hébergement stable HTTPS, domaine choisi, sauvegarde, information sur les journaux serveur et les prestataires. Le tunnel actuel dépend du PC et peut disparaître.
3. Finalisation des documents juridiques et des traitements de données, notamment pour le public mineur. Les formulations préparatoires ne suffisent pas.
4. Traduction et relecture pédagogique complètes des activités EN/DE et des niveaux avancés. Pas d'affirmation « conforme aux 12 manuels Valar » sans documents et validation correspondants.
5. Provenance/licences des textes et illustrations ; banque audio commerciale puis validation linguistique en dernier, comme demandé.
6. Recette sur de vrais appareils Safari iPhone et Chrome Android : installation/raccourci, gestes, petits écrans, clavier, focus, rotation, changement de langue, reprise, réseau lent, audio interrompu, suppression/export. Les simulations desktop ne remplacent pas ces tests.

## À configurer avec l'hébergement choisi

- HTTPS et redirection HTTP, en-têtes X-Content-Type-Options: nosniff et Referrer-Policy: strict-origin-when-cross-origin.
- Politique de sécurité du contenu adaptée aux scripts locaux, images/audio/fonts et styles utilisés ; tester avant activation. Refuser l'intégration en iframe non autorisée si aucun usage prévu.
- Aucun besoin actuel de caméra/microphone/localisation : en limiter l'accès côté hébergement ; réévaluer si ces fonctions arrivent.
- HTML et index d'assets revalidés pour éviter les anciennes versions ; cache long uniquement pour ressources réellement versionnées. Aucun service worker ajouté qui risquerait de garder une vieille version.
- Ne servir que le paquet statique validé, jamais la racine du projet. Vérifier le contenu réel du paquet et les en-têtes réseau avant ouverture.

## État de vérification

Tests learning, Kural (1330 textes), stockage et rendu des pages/jeux passés. Nouveaux tests release, démarrage et pages légales passés. Profil vérifié dans le navigateur avec la progression existante conservée. Le contrôle de publication retourne volontairement « ready: false ». Aucun déploiement officiel effectué.
