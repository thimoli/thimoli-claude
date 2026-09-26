(() => {
  const exerciseTitles = ["Les paires cachées", "L’atelier des mots", "Le défi du village"]

  const stage = (title, lesson, objective, items, note = "") => ({
    title,
    lesson,
    objective,
    note,
    items: items.map(([ta, fr]) => ({ ta, fr })),
    exercises: exerciseTitles
  })

  const village = (level, title, focus, stages) => ({
    level,
    book: `Parcours Thimoli · niveau ${level}`,
    title,
    focus,
    stages: stages.map((item, index) => ({
      ...item,
      reward: index < 2 ? "La porte des savoirs" : index < 4 ? "La maison des mots" : index < 6 ? "Le jardin des phrases" : index < 8 ? "La place des histoires" : "L’école du village"
    }))
  })

  window.THIMOLI_CURRICULUM = [
    village(1, "Lire ses premiers signes", "Alphabet, sons et phrases très simples", [
      stage("Les voyelles courtes", "Reconnaître les sons courts", "Distinguer trois premières voyelles brèves.", [["அ", "son “a” court"], ["இ", "son “i” court"], ["உ", "son “ou” court"]], "Un son court se prononce sans l’étirer. Tu retrouveras les douze voyelles dans l’atelier Alphabet de l’accueil."),
      stage("Les voyelles longues", "Entendre la durée d’une voyelle", "Comparer les sons courts et longs.", [["ஆ", "son “aa” long"], ["ஈ", "son “ii” long"], ["ஊ", "son “ou” long"]], "La longueur du son peut changer le mot."),
      stage("Les autres voyelles", "Compléter la famille des voyelles", "Distinguer é et o courts ou longs, puis aï et aou.", [["எ", "son “é” court"], ["ஏ", "son “é” long"], ["ஒ", "son “o” court"], ["ஓ", "son “o” long"], ["ஐ", "son “aï”"], ["ஔ", "son “aou”"]]),
      stage("Premières consonnes", "Découvrir les consonnes fréquentes", "Reconnaître les consonnes avec leur point, le pulli.", [["க்", "consonne k"], ["த்", "consonne t dentale"], ["ப்", "consonne p"]], "Le point supprime la voyelle a : க் est la consonne ; க est la syllabe ka."),
      stage("Consonnes de la famille", "Lire des consonnes familières", "Ajouter trois consonnes très utilisées.", [["ம்", "consonne m"], ["ந்", "consonne n dentale"], ["வ்", "consonne v"]]),
      stage("Consonnes particulières", "Découvrir des sons du tamoul", "Différencier trois consonnes.", [["ல்", "consonne l"], ["ழ்", "consonne lh, langue repliée"], ["ற்", "consonne rr"]], "Les repères français sont approximatifs : lh sert de mémo, mais ne remplace pas l’écoute d’un locuteur tamoul."),
      stage("Former une syllabe", "Assembler consonne et voyelle", "Comprendre la construction d’un signe composé.", [["கா", "kaa"], ["மி", "mi"], ["பூ", "pou long"]], "Une consonne change de forme quand on lui ajoute une voyelle."),
      stage("La famille et le corps", "Lire ses premiers mots", "Associer des mots proches du quotidien.", [["அம்மா", "maman"], ["அப்பா", "papa"], ["கை", "main"]]),
      stage("Nombres et couleurs", "Compter et décrire", "Reconnaître des mots courts très utiles.", [["ஒன்று", "un"], ["இரண்டு", "deux"], ["சிவப்பு", "rouge"]]),
      stage("Mes premières phrases", "Comprendre une phrase complète", "Lire sujet, action et information.", [["நான் படிக்கிறேன்", "je lis"], ["இது வீடு", "c’est une maison"], ["அவள் வருகிறாள்", "elle vient"]], "Lis d’abord chaque mot, puis toute la phrase." )
    ]),
    village(2, "Parler du quotidien", "Mots utiles et premières conversations", [
      stage("Dire bonjour", "Saluer selon la situation", "Commencer et terminer un échange.", [["வணக்கம்", "bonjour"], ["நன்றி", "merci"], ["போய் வருகிறேன்", "à bientôt"]]),
      stage("Se présenter", "Dire son nom et son âge", "Produire deux phrases personnelles.", [["என் பெயர்", "mon nom"], ["எனக்கு எட்டு வயது", "j’ai huit ans"], ["நான் மாணவன்", "je suis élève"]]),
      stage("Dans la maison", "Nommer les pièces et objets", "Repérer les mots de la maison.", [["வீடு", "maison"], ["கதவு", "porte"], ["மேசை", "table"]]),
      stage("À l’école", "Comprendre la classe", "Reconnaître le matériel scolaire.", [["பள்ளி", "école"], ["புத்தகம்", "livre"], ["எழுதுகோல்", "crayon"]]),
      stage("Les animaux", "Nommer des animaux familiers", "Lire et écouter trois noms courants.", [["பூனை", "chat"], ["நாய்", "chien"], ["பறவை", "oiseau"]]),
      stage("Manger et boire", "Exprimer un besoin simple", "Utiliser le vocabulaire du repas.", [["தண்ணீர்", "eau"], ["சோறு", "riz cuit"], ["பால்", "lait"]]),
      stage("Les actions du jour", "Reconnaître des verbes fréquents", "Comprendre une action au présent.", [["படிக்கிறேன்", "je lis"], ["எழுதுகிறேன்", "j’écris"], ["சாப்பிடுகிறேன்", "je mange"]]),
      stage("Décrire simplement", "Ajouter une qualité", "Placer un adjectif avec un nom.", [["பெரிய வீடு", "grande maison"], ["சிறிய பூ", "petite fleur"], ["நல்ல நண்பன்", "bon ami"]]),
      stage("Poser une question", "Utiliser les mots interrogatifs", "Demander qui, quoi et où.", [["யார்?", "qui ?"], ["என்ன?", "quoi ?"], ["எங்கே?", "où ?"]]),
      stage("Petit dialogue", "Suivre un échange court", "Répondre avec une phrase adaptée.", [["நீ எப்படி இருக்கிறாய்?", "comment vas-tu ?"], ["நான் நலமாக இருக்கிறேன்", "je vais bien"], ["உன் பெயர் என்ன?", "comment t’appelles-tu ?"]])
    ]),
    village(3, "Parler de ses proches", "Famille, routines et repères", [
      stage("Ma famille", "Nommer les proches", "Présenter les membres de sa famille.", [["அண்ணன்", "grand frère"], ["அக்கா", "grande sœur"], ["தங்கை", "petite sœur"]]),
      stage("Dire à qui c’est", "Exprimer la possession", "Comprendre mon, ton et son.", [["என் புத்தகம்", "mon livre"], ["உன் வீடு", "ta maison"], ["அவனுடைய பை", "son sac à lui"]]),
      stage("Le corps", "Nommer les parties du corps", "Comprendre des consignes simples.", [["தலை", "tête"], ["கண்", "œil"], ["கால்", "jambe"]]),
      stage("La santé", "Dire comment on se sent", "Employer des phrases utiles sur la santé.", [["எனக்கு வலி", "j’ai mal"], ["நான் நலமாக இருக்கிறேன்", "je vais bien"], ["ஓய்வு எடு", "repose-toi"]]),
      stage("Ma journée", "Raconter sa routine", "Ordonner les actions du matin au soir.", [["நான் எழுகிறேன்", "je me lève"], ["நான் குளிக்கிறேன்", "je me lave"], ["நான் தூங்குகிறேன்", "je dors"]]),
      stage("L’heure et les jours", "Se repérer dans le temps", "Dire aujourd’hui, demain et l’heure.", [["இன்று", "aujourd’hui"], ["நாளை", "demain"], ["மணி", "heure"]]),
      stage("Se situer", "Dire où se trouve un objet", "Utiliser dans, sur et près de.", [["வீட்டில்", "dans la maison"], ["மேசையின் மேல்", "sur la table"], ["பள்ளிக்கு அருகில்", "près de l’école"]]),
      stage("Le présent", "Construire une action actuelle", "Repérer la marque du présent.", [["அவன் ஓடுகிறான்", "il court"], ["அவள் பாடுகிறாள்", "elle chante"], ["அவர்கள் விளையாடுகிறார்கள்", "ils jouent"]]),
      stage("Dire non", "Former une phrase négative", "Refuser ou nier simplement.", [["நான் வரவில்லை", "je ne suis pas venu"], ["அது இல்லை", "ce n’est pas là"], ["எனக்குத் தெரியாது", "je ne sais pas"]]),
      stage("Chez mes proches", "Comprendre une visite en famille", "Réutiliser famille, temps et actions.", [["பாட்டி வீட்டில் இருக்கிறார்", "grand-mère est à la maison"], ["நாங்கள் ஒன்றாக சாப்பிடுகிறோம்", "nous mangeons ensemble"], ["தாத்தா கதை சொல்கிறார்", "grand-père raconte une histoire"]])
    ]),
    village(4, "Découvrir la nature", "Alimentation, saisons et descriptions", [
      stage("Fruits et légumes", "Nommer ce que l’on mange", "Classer fruits et légumes.", [["மாம்பழம்", "mangue"], ["வாழைப்பழம்", "banane"], ["கத்தரிக்காய்", "aubergine"]]),
      stage("Les repas", "Parler de son assiette", "Exprimer ce que l’on aime manger.", [["காலை உணவு", "petit-déjeuner"], ["மதிய உணவு", "déjeuner"], ["இரவு உணவு", "dîner"]]),
      stage("Les goûts", "Les mots de la cuisine", "Reconnaître le sucré, le sel et le piquant.", [["இனிப்பு", "sucré"], ["உப்பு", "sel"], ["காரம்", "piquant"]]),
      stage("Plantes et animaux", "Observer le vivant", "Décrire ce qui pousse et vit.", [["மரம்", "arbre"], ["மலர்", "fleur"], ["மாடு", "vache"]]),
      stage("Le temps qu’il fait", "Comprendre la météo", "Dire pluie, soleil et vent.", [["மழை பெய்கிறது", "il pleut"], ["வெயில் அடிக்கிறது", "il fait soleil"], ["காற்று வீசுகிறது", "le vent souffle"]]),
      stage("Les saisons", "Situer les changements de l’année", "Associer climat et saison.", [["கோடை காலம்", "été"], ["மழைக்காலம்", "saison des pluies"], ["குளிர்காலம்", "hiver"]]),
      stage("Mesurer et compter", "Exprimer une quantité", "Employer peu, beaucoup et moitié.", [["கொஞ்சம்", "un peu"], ["நிறைய", "beaucoup"], ["பாதி", "moitié"]]),
      stage("Donner une consigne", "Utiliser l’impératif", "Comprendre une instruction de cuisine.", [["கழுவு", "lave"], ["வெட்டு", "coupe"], ["கலக்கு", "mélange"]]),
      stage("Raconter hier", "Découvrir le passé", "Reconnaître une action terminée.", [["நான் சாப்பிட்டேன்", "j’ai mangé"], ["அவள் வந்தாள்", "elle est venue"], ["மழை பெய்தது", "il a plu"]]),
      stage("Une recette simple", "Lire des étapes dans l’ordre", "Comprendre une courte procédure.", [["முதலில் அரிசியைக் கழுவு", "d’abord lave le riz"], ["பிறகு தண்ணீர் சேர்", "puis ajoute l’eau"], ["இறுதியில் பரிமாறு", "enfin sers"]])
    ]),
    village(5, "Agir au marché", "Prix, quantités et échanges polis", [
      stage("Les grands nombres", "Compter au-delà de dix", "Lire des nombres utiles pour les prix.", [["இருபது", "vingt"], ["ஐம்பது", "cinquante"], ["நூறு", "cent"]]),
      stage("Prix et monnaie", "Demander combien cela coûte", "Comprendre un échange commercial.", [["விலை", "prix"], ["பணம்", "argent"], ["இது எவ்வளவு?", "combien cela coûte ?"]]),
      stage("Poids et mesures", "Acheter la bonne quantité", "Utiliser kilo, litre et paquet.", [["ஒரு கிலோ", "un kilo"], ["ஒரு லிட்டர்", "un litre"], ["ஒரு பொதி", "un paquet"]]),
      stage("Faire un achat", "Construire un dialogue au marché", "Demander et recevoir un produit.", [["எனக்கு இது வேண்டும்", "je voudrais ceci"], ["வேறு ஏதாவது?", "autre chose ?"], ["இதோ உங்கள் பொருள்", "voici votre article"]]),
      stage("Être poli", "Formuler une demande respectueuse", "Employer s’il vous plaît et merci.", [["தயவுசெய்து", "s’il vous plaît"], ["மிக்க நன்றி", "merci beaucoup"], ["கொடுக்க முடியுமா?", "pourriez-vous donner ?"]]),
      stage("Décrire les produits", "Dire grand, bon marché et pareil", "Décrire deux produits sans inventer de comparaison.", [["இது பெரியது", "ceci est grand"], ["அது மலிவானது", "cela est bon marché"], ["இரண்டும் சமம்", "les deux sont égaux"]]),
      stage("Prévoir un achat", "Parler du futur", "Dire ce que l’on achètera.", [["நான் வாங்குவேன்", "j’achèterai"], ["நாங்கள் போவோம்", "nous irons"], ["அவள் தேர்வு செய்வாள்", "elle choisira"]]),
      stage("Venir au marché", "Utiliser les transports", "Expliquer comment on se déplace.", [["பேருந்து", "bus"], ["மிதிவண்டி", "vélo"], ["நடந்து", "à pied"]]),
      stage("Trouver son chemin", "Demander une direction", "Comprendre gauche, droite et tout droit.", [["இடது பக்கம்", "à gauche"], ["வலது பக்கம்", "à droite"], ["நேராக செல்லுங்கள்", "allez tout droit"]]),
      stage("Lire une affiche", "Comprendre les informations d’un commerce", "Repérer prix, heure et promotion.", [["திறக்கும் நேரம்", "heure d’ouverture"], ["இன்றைய விலை", "prix du jour"], ["சலுகை", "promotion"]])
    ]),
    village(6, "Apprendre et travailler", "École, métiers et textes organisés", [
      stage("Les matières", "Parler de son emploi du temps", "Nommer des cours scolaires.", [["தமிழ்", "tamoul"], ["கணிதம்", "mathématiques"], ["அறிவியல்", "sciences"]]),
      stage("Les consignes", "Comprendre le professeur", "Suivre une instruction de classe.", [["கவனமாக கேள்", "écoute attentivement"], ["பதிலை எழுது", "écris la réponse"], ["பக்கத்தைத் திற", "ouvre la page"]]),
      stage("L’emploi du temps", "Lire un horaire", "Situer un cours dans la semaine.", [["திங்கட்கிழமை", "lundi"], ["காலை ஒன்பது மணி", "neuf heures du matin"], ["இடைவேளை", "récréation"]]),
      stage("Les métiers", "Nommer une profession", "Dire le travail d’une personne.", [["ஆசிரியர்", "enseignant"], ["மருத்துவர்", "médecin"], ["பொறியாளர்", "ingénieur"]]),
      stage("Les outils", "Associer métier et objet", "Comprendre à quoi sert un outil.", [["கணினி", "ordinateur"], ["கருவி", "outil"], ["கத்தரிக்கோல்", "ciseaux"]]),
      stage("Pouvoir et devoir", "Exprimer capacité et nécessité", "Dire ce que l’on peut ou doit faire.", [["என்னால் படிக்க முடியும்", "je peux lire"], ["நான் பயிற்சி செய்ய வேண்டும்", "je dois m’entraîner"], ["நீ முயற்சி செய்யலாம்", "tu peux essayer"]]),
      stage("Parler avec respect", "Adapter sa façon de s’adresser", "Choisir une forme polie.", [["நீங்கள்", "vous, forme polie"], ["வாருங்கள்", "venez, forme polie"], ["உட்காருங்கள்", "asseyez-vous"]]),
      stage("Écrire un message", "Organiser un court courrier", "Saluer, informer et conclure.", [["அன்புள்ள ஆசிரியருக்கு", "cher professeur"], ["நான் நலமாக இருக்கிறேன்", "je vais bien"], ["நன்றி, வணக்கம்", "merci et salutations"]]),
      stage("Construire un paragraphe", "Relier plusieurs idées", "Utiliser des connecteurs simples.", [["முதலில்", "d’abord"], ["அதனால்", "donc"], ["இறுதியாக", "finalement"]]),
      stage("Comprendre un texte", "Trouver l’idée principale", "Distinguer sujet, détail et conclusion.", [["முக்கிய கருத்து", "idée principale"], ["விளக்கம்", "explication"], ["முடிவு", "conclusion"]])
    ]),
    village(7, "Vivre la culture", "Fêtes, arts et récits", [
      stage("Les grandes fêtes", "Nommer des fêtes tamoules", "Comprendre leurs symboles principaux.", [["பொங்கல்", "Pongal"], ["தமிழ்ப் புத்தாண்டு", "Nouvel An tamoul"], ["தீபாவளி", "Deepavali"]]),
      stage("Les vêtements", "Décrire une tenue", "Nommer des habits traditionnels.", [["சேலை", "sari"], ["வேட்டி", "vetti"], ["சட்டை", "chemise"]]),
      stage("Musique et danse", "Parler des arts", "Reconnaître des pratiques culturelles.", [["பரதநாட்டியம்", "Bharatanatyam"], ["வீணை", "veena"], ["மிருதங்கம்", "mridangam"]]),
      stage("Au temple", "Comprendre les lieux culturels", "Décrire une visite avec respect.", [["கோவில்", "temple"], ["கோபுரம்", "tour du temple"], ["விளக்கு", "lampe"]]),
      stage("Le calendrier tamoul", "Situer une date traditionnelle", "Reconnaître mois et journée festive.", [["சித்திரை", "mois de Chithirai"], ["தை", "mois de Thai"], ["திருநாள்", "jour de fête"]]),
      stage("Les coutumes", "Expliquer un geste culturel", "Employer le vocabulaire des traditions.", [["கோலம்", "dessin au sol"], ["விருந்தோம்பல்", "hospitalité"], ["வாழ்த்து", "vœu ou salutation"]]),
      stage("Raconter au passé", "Enchaîner des actions terminées", "Construire un récit court.", [["நாங்கள் சென்றோம்", "nous sommes allés"], ["அவர்கள் பாடினர்", "ils ont chanté"], ["விழா முடிந்தது", "la fête s’est terminée"]]),
      stage("Mettre dans l’ordre", "Utiliser des connecteurs temporels", "Clarifier le déroulement d’une histoire.", [["அதற்கு முன்", "avant cela"], ["பின்னர்", "ensuite"], ["அந்த நேரத்தில்", "à ce moment-là"]]),
      stage("Raconter une tradition", "Présenter une pratique familiale", "Donner contexte, étapes et sens.", [["எங்கள் குடும்பத்தில்", "dans notre famille"], ["ஒவ்வொரு ஆண்டும்", "chaque année"], ["இதன் பொருள்", "cela signifie"]]),
      stage("Présenter à l’oral", "Parler une minute clairement", "Introduire, expliquer et conclure.", [["இன்று நான் பேசுவது", "aujourd’hui je parle de"], ["முக்கியமாக", "principalement"], ["கேட்டதற்கு நன்றி", "merci de m’avoir écouté"]])
    ]),
    village(8, "Voyager et se repérer", "Géographie, déplacement et projets", [
      stage("La géographie", "Nommer les paysages", "Distinguer mer, montagne et rivière.", [["கடல்", "mer"], ["மலை", "montagne"], ["ஆறு", "rivière"]]),
      stage("Les transports", "Choisir un moyen de déplacement", "Comparer plusieurs façons de voyager.", [["தொடர்வண்டி", "train"], ["விமானம்", "avion"], ["கப்பல்", "bateau"]]),
      stage("Donner un itinéraire", "Expliquer un trajet", "Utiliser distance et direction.", [["சந்திப்பில் திரும்புங்கள்", "tournez au carrefour"], ["பாலத்தைக் கடக்கவும்", "traversez le pont"], ["அருகில் உள்ளது", "c’est à proximité"]]),
      stage("Se loger", "Comprendre les besoins d’un séjour", "Demander une chambre et des informations.", [["அறை வேண்டும்", "je voudrais une chambre"], ["முன்பதிவு", "réservation"], ["ஒரு இரவு", "une nuit"]]),
      stage("Préparer un voyage", "Organiser départ et arrivée", "Lire une liste de préparation.", [["பயணச்சீட்டு", "billet de voyage"], ["கடவுச்சீட்டு", "passeport"], ["பயணப்பை", "valise"]]),
      stage("Découvrir un lieu", "Décrire un monument", "Exprimer ce que l’on voit.", [["பழமையான கட்டிடம்", "bâtiment ancien"], ["அழகான காட்சி", "beau paysage"], ["வரலாற்றுச் சிறப்பு", "importance historique"]]),
      stage("Les relations de lieu", "Préciser une position", "Employer devant, derrière et entre.", [["முன்னால்", "devant"], ["பின்னால்", "derrière"], ["இடையில்", "entre"]]),
      stage("Dire une condition", "Introduire si et sinon", "Relier une condition à son résultat.", [["மழை பெய்தால்", "s’il pleut"], ["நேரம் இருந்தால்", "si nous avons le temps"], ["இல்லையெனில்", "sinon"]]),
      stage("Carnet de voyage", "Écrire une description vivante", "Associer lieu, impression et détail.", [["நான் கண்ட இடம்", "le lieu que j’ai vu"], ["எனக்கு மிகவும் பிடித்தது", "j’ai beaucoup aimé"], ["நினைவில் நிற்கிறது", "cela reste en mémoire"]]),
      stage("Demander de l’aide", "Gérer une situation de voyage", "Formuler un problème clairement.", [["எனக்கு உதவி வேண்டும்", "j’ai besoin d’aide"], ["வழி தவறிவிட்டேன்", "je me suis perdu"], ["நிலையம் எங்கே?", "où est la gare ?"]])
    ]),
    village(9, "Comprendre la ville", "Services, médias et opinion", [
      stage("Les services publics", "S’orienter dans la ville", "Nommer des lieux importants.", [["நூலகம்", "bibliothèque"], ["மருத்துவமனை", "hôpital"], ["அஞ்சலகம்", "bureau de poste"]]),
      stage("Technologie", "Parler des outils numériques", "Comprendre des consignes courantes.", [["இணையம்", "internet"], ["கடவுச்சொல்", "mot de passe"], ["செய்தி அனுப்பு", "envoie un message"]]),
      stage("Lire l’actualité", "Repérer une information", "Distinguer titre, fait et source.", [["தலைப்புச் செய்தி", "gros titre"], ["நிகழ்வு", "événement"], ["தகவல் மூலம்", "source de l’information"]]),
      stage("Protéger l’environnement", "Comprendre les gestes écologiques", "Exprimer une action responsable.", [["மறுசுழற்சி", "recyclage"], ["தண்ணீரைச் சேமி", "économise l’eau"], ["மரம் நடு", "plante un arbre"]]),
      stage("Accéder aux soins", "Expliquer un besoin médical", "Prendre un rendez-vous et décrire un symptôme.", [["முன்பதிவு செய்ய வேண்டும்", "je dois prendre rendez-vous"], ["காய்ச்சல்", "fièvre"], ["மருந்து", "médicament"]]),
      stage("Démarches utiles", "Comprendre un formulaire", "Identifier nom, adresse et signature.", [["முழுப் பெயர்", "nom complet"], ["முகவரி", "adresse"], ["கையொப்பம்", "signature"]]),
      stage("Phrases complexes", "Relier deux idées", "Employer parce que, mais et pourtant.", [["ஏனெனில்", "parce que"], ["ஆனால்", "mais"], ["இருந்தாலும்", "pourtant"]]),
      stage("Donner son avis", "Exprimer une opinion nuancée", "Dire accord, désaccord et justification.", [["என் கருத்தில்", "à mon avis"], ["நான் ஒப்புக்கொள்கிறேன்", "je suis d’accord"], ["எனக்கு வேறு கருத்து உள்ளது", "j’ai un autre avis"]]),
      stage("Lire un texte formel", "Comprendre une annonce", "Repérer objet, date et action demandée.", [["அறிவிப்பு", "annonce"], ["கடைசி நாள்", "date limite"], ["விண்ணப்பிக்கவும்", "veuillez postuler"]]),
      stage("Faire un résumé", "Restituer l’essentiel", "Réduire un texte à trois idées.", [["முதன்மையான தகவல்", "information principale"], ["முக்கிய விவரம்", "détail important"], ["சுருக்கமாக", "en résumé"]])
    ]),
    village(10, "Construire son avenir", "Projets, hypothèses et argumentation", [
      stage("Mes ambitions", "Parler de ses objectifs", "Présenter un rêve et sa motivation.", [["என் கனவு", "mon rêve"], ["என் இலக்கு", "mon objectif"], ["நான் சாதிக்க விரும்புகிறேன்", "je veux réussir"]]),
      stage("Études et métier", "Relier formation et carrière", "Expliquer un choix d’orientation.", [["உயர் கல்வி", "études supérieures"], ["தொழில் தேர்வு", "choix de carrière"], ["அனுபவம்", "expérience"]]),
      stage("Le futur", "Maîtriser les actions à venir", "Conjuguer plusieurs sujets au futur.", [["நான் கற்பேன்", "j’apprendrai"], ["அவள் உருவாக்குவாள்", "elle créera"], ["நாங்கள் வெல்வோம்", "nous réussirons"]]),
      stage("Faire une hypothèse", "Imaginer une possibilité", "Employer si, peut-être et probablement.", [["ஒருவேளை", "peut-être"], ["நடக்கக்கூடும்", "cela pourrait arriver"], ["வாய்ப்பு உள்ளது", "il y a une possibilité"]]),
      stage("Cause et conséquence", "Expliquer pourquoi", "Relier un choix à son résultat.", [["இதனால்", "à cause de cela"], ["எனவே", "par conséquent"], ["அதன் விளைவாக", "en conséquence"]]),
      stage("Débattre avec respect", "Construire un argument", "Affirmer, justifier et répondre.", [["என் வாதம்", "mon argument"], ["ஒரு எடுத்துக்காட்டு", "un exemple"], ["உங்கள் கருத்தை மதிக்கிறேன்", "je respecte votre avis"]]),
      stage("Lettre de motivation", "Écrire pour convaincre", "Présenter profil, raison et disponibilité.", [["நான் விண்ணப்பிக்கிறேன்", "je présente ma candidature"], ["எனது திறன்கள்", "mes compétences"], ["உங்கள் பதிலை எதிர்பார்க்கிறேன்", "j’attends votre réponse"]]),
      stage("Faire une présentation", "Structurer un exposé", "Annoncer le plan et guider l’écoute.", [["என் உரையின் நோக்கம்", "l’objectif de mon exposé"], ["மூன்று பகுதிகள்", "trois parties"], ["முடிவாக", "pour conclure"]]),
      stage("Planifier un projet", "Passer de l’idée à l’action", "Définir étapes, rôle et échéance.", [["செயல் திட்டம்", "plan d’action"], ["பொறுப்பு", "responsabilité"], ["காலக்கெடு", "échéance"]]),
      stage("Dossier de projet", "Synthétiser plusieurs documents", "Présenter problème, solution et résultat.", [["சிக்கல்", "problème"], ["தீர்வு", "solution"], ["எதிர்பார்க்கும் முடிவு", "résultat attendu"]])
    ]),
    village(11, "Exprimer ses idées", "Émotions, valeurs et littérature", [
      stage("Les émotions", "Nommer ce que l’on ressent", "Nuancer joie, peur et tristesse.", [["மகிழ்ச்சி", "joie"], ["அச்சம்", "peur"], ["துக்கம்", "tristesse"]]),
      stage("Le caractère", "Décrire une personne", "Choisir un trait précis.", [["பொறுமை", "patience"], ["துணிவு", "courage"], ["நேர்மை", "honnêteté"]]),
      stage("Les valeurs", "Réfléchir à la conduite", "Comprendre justice, respect et entraide.", [["அறம்", "vertu"], ["நீதி", "justice"], ["ஒற்றுமை", "solidarité"]]),
      stage("Sagesse du Tirukkural", "Découvrir une œuvre majeure", "Comprendre la forme brève du Kural.", [["திருக்குறள்", "Tirukkural"], ["திருவள்ளுவர்", "Tiruvalluvar"], ["குறள்", "distique bref"]]),
      stage("Nuancer une description", "Employer un vocabulaire précis", "Comparer plusieurs degrés d’une qualité.", [["மிகவும் அமைதியான", "très calme"], ["சற்றே கடினமான", "un peu difficile"], ["ஆழமான சிந்தனை", "réflexion profonde"]]),
      stage("Rapporter des paroles", "Dire ce qu’une personne a expliqué", "Passer du discours direct au récit.", [["அவர் கூறினார்", "il a déclaré"], ["அவள் கேட்டாள்", "elle a demandé"], ["என்று விளக்கினார்", "a expliqué que"]]),
      stage("Défendre une idée", "Argumenter avec équilibre", "Présenter thèse, raison et limite.", [["என் நிலைப்பாடு", "ma position"], ["இதற்கான காரணம்", "la raison en est"], ["மற்றொரு பார்வை", "un autre point de vue"]]),
      stage("Lire un poème", "Observer images et rythme", "Identifier émotion et figure poétique.", [["உவமை", "comparaison poétique"], ["ஓசை", "rythme sonore"], ["உணர்வு", "émotion"]]),
      stage("Analyser un texte", "Justifier son interprétation", "Citer un indice et expliquer son effet.", [["ஆசிரியரின் கருத்து", "idée de l’auteur"], ["உரையின் சான்று", "preuve dans le texte"], ["வாசகரின் புரிதல்", "interprétation du lecteur"]]),
      stage("Écrire un essai", "Développer une réflexion", "Organiser introduction, arguments et conclusion.", [["அறிமுகம்", "introduction"], ["வாதப்பகுதி", "développement argumenté"], ["முடிவுரை", "conclusion"]])
    ]),
    village(12, "Maîtriser et transmettre", "Expression avancée et projet final", [
      stage("Révision grammaticale", "Consolider les structures clés", "Repérer accords, temps et connecteurs.", [["இலக்கணம்", "grammaire"], ["வினைச்சொல்", "verbe"], ["பெயர்ச்சொல்", "nom"]]),
      stage("Langue et littérature", "Reconnaître plusieurs genres", "Distinguer récit, poésie et essai.", [["சிறுகதை", "nouvelle"], ["கவிதை", "poésie"], ["கட்டுரை", "essai"]]),
      stage("Prendre la parole", "Construire un discours formel", "S’adresser clairement à un public.", [["மதிப்பிற்குரியவர்களே", "mesdames et messieurs"], ["எனது கருத்தைப் பகிர்கிறேன்", "je partage mon point de vue"], ["உங்கள் கவனத்திற்கு நன்றி", "merci de votre attention"]]),
      stage("Traduire avec justesse", "Préserver le sens d’un message", "Éviter le mot-à-mot et garder le registre.", [["பொருள்", "sens"], ["சூழல்", "contexte"], ["மொழிபெயர்ப்பு", "traduction"]]),
      stage("Écoute avancée", "Prendre des notes à l’oral", "Repérer thème, arguments et exemples.", [["மையக் கருத்து", "idée centrale"], ["ஆதாரம்", "élément de preuve"], ["குறிப்பெடுத்தல்", "prise de notes"]]),
      stage("Rédaction longue", "Développer un texte cohérent", "Faire progresser les idées sans répétition.", [["தொடர்ச்சி", "cohérence"], ["பத்தி அமைப்பு", "structure des paragraphes"], ["சொல்வளம்", "richesse du vocabulaire"]]),
      stage("Préparer un oral", "Répéter efficacement", "Maîtriser voix, regard et temps.", [["உச்சரிப்பு", "prononciation"], ["கண் தொடர்பு", "contact visuel"], ["நேர மேலாண்மை", "gestion du temps"]]),
      stage("Corriger ses erreurs", "Relire avec méthode", "Identifier, expliquer puis corriger.", [["பிழை", "erreur"], ["திருத்தம்", "correction"], ["மறுபரிசீலனை", "relecture"]]),
      stage("Faire une synthèse", "Croiser plusieurs idées", "Regrouper sans déformer les sources.", [["ஒப்பீடு", "comparaison"], ["ஒருங்கிணைப்பு", "synthèse"], ["தீர்மானம்", "conclusion raisonnée"]]),
      stage("Projet de maîtrise", "Créer et présenter en tamoul", "Mobiliser lecture, écoute, écriture et oral.", [["என் இறுதித் திட்டம்", "mon projet final"], ["நான் கற்றது", "ce que j’ai appris"], ["அடுத்த படி", "la prochaine étape"]], "La maîtrise, c’est savoir utiliser la langue et continuer à apprendre.")
    ])
  ]
})()
