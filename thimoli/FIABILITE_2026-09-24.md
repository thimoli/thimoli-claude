# Fiabilité — préparation hors audio

Ajout de connectivity.js/css : avertissement discret quand le navigateur signale une perte de réseau, traduit FR/EN/DE, mis à jour avec la langue. Aucun rechargement automatique, changement de réponse ou écriture dans la progression. Ne constitue pas un mode hors ligne ni une détection de panne serveur ; les ressources non chargées peuvent manquer.

Ajout de test-static-package.cjs : contrôle de présence des fichiers HTML référencés, références CSS locales, égalité binaire des 33 ressources de démarrage entre sources et dist. Intégré au constructeur de paquet avec les tests de thème et de connectivité.

11 suites réussies : smoke, learning, Kural, stockage, juridique technique, progression production, récupération du démarrage, traductions exercices, thème, connectivité simulée et paquet statique. Accueil vérifié dans le navigateur en ligne : affiché, avertissement masqué.

Ni audio modifié, ni paiement, ni publication officielle. Les validations humaines de prononciation et de pédagogie, les droits, la structure et l'hébergement définitif restent nécessaires. Voir PREPARATION_PUBLICATION.md et release-readiness.json.
