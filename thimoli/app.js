const villages = [
  { name: "Village des Premiers Pas", ta: "முதல் படி கிராமம்", theme: "Les bases du tamoul" },
  { name: "Village de la Mer", ta: "கடல் கிராமம்", theme: "Les mots du quotidien" },
  { name: "Village du Temple", ta: "கோவில் கிராமம்", theme: "La famille et les proches" },
  { name: "Village des Rizières", ta: "நெல் வயல் கிராமம்", theme: "La nourriture et la nature" },
  { name: "Village du Marché", ta: "சந்தை கிராமம்", theme: "Les achats et les prix" },
  { name: "Village du Savoir", ta: "அறிவு கிராமம்", theme: "L’école et le travail" },
  { name: "Village des Fêtes", ta: "திருவிழா கிராமம்", theme: "La culture et les traditions" },
  { name: "Village des Collines", ta: "மலை கிராமம்", theme: "Les voyages et les lieux" },
  { name: "Village de la Ville", ta: "நகர கிராமம்", theme: "La vie en ville" },
  { name: "Village des Horizons", ta: "எல்லை கிராமம்", theme: "Les projets et le futur" },
  { name: "Village de la Sagesse", ta: "ஞான கிராமம்", theme: "Les idées et les émotions" },
  { name: "Village du Maître", ta: "ஆசான் கிராமம்", theme: "La maîtrise du tamoul" }
]

const lessonQuestions = [
  {
    id: "long-aa", letter: "ஆ", prompt: "Quel son correspond à cette lettre ?", answers: ["aa", "i", "ou"], correct: 0,
    hint: "C’est un « a » que l’on laisse durer un peu plus longtemps.",
    explanation: "ஆ correspond au son long « aa ». La durée du son peut changer le sens d’un mot.", example: "ஆடு (ādu) · chèvre"
  },
  {
    id: "long-ii", letter: "ஈ", prompt: "Choisis la bonne prononciation.", answers: ["é", "ii", "an"], correct: 1,
    hint: "Étire le son « i », comme dans « ici », mais plus long.",
    explanation: "ஈ se prononce « ii » : c’est la version longue du son இ (i).", example: "ஈ (ī) · mouche"
  },
  {
    id: "long-uu", letter: "ஊ", prompt: "Quelle voyelle entends-tu ?", answers: ["uu", "aï", "o"], correct: 0,
    hint: "Le son ressemble à « ou », mais il est tenu plus longtemps.",
    explanation: "ஊ correspond au son long « uu ». Il s’oppose au son court உ (u).", example: "ஊர் (ūr) · village"
  },
  {
    id: "short-a", letter: "அ", prompt: "Cette lettre produit quel son court ?", answers: ["a", "ee", "oo"], correct: 0,
    hint: "C’est le premier son de « amma ».", explanation: "அ se prononce « a », brièvement et sans l’étirer.", example: "அம்மா (ammā) · maman"
  }
]

const matchingPairs = [
  { letter: "அ", sound: "a", example: "அம்மா · maman" },
  { letter: "ஆ", sound: "aa", example: "ஆடு · chèvre" },
  { letter: "இ", sound: "i", example: "இலை · feuille" },
  { letter: "ஈ", sound: "ii", example: "ஈ · mouche" }
]

const levelOneStages = [
  { title: "Reconnaître les voyelles", lesson: "Découvrir et prononcer les voyelles tamoules", exercises: ["Toucher la lettre entendue", "Relier deux lettres identiques", "Retrouver la lettre cachée"], reward: "L’entrée du village" },
  { title: "Lettres et sons", lesson: "Associer chaque lettre à son son", exercises: ["Écouter puis choisir", "Classer les sons initiaux", "Compléter le mot"], reward: "L’entrée du village" },
  { title: "Image et mot", lesson: "Apprendre les objets familiers", exercises: ["Relier l’image au mot", "Choisir le bon mot", "Placer l’étiquette"], reward: "La maison des mots" },
  { title: "Lettres manquantes", lesson: "Observer la construction d’un mot", exercises: ["Insérer une lettre", "Insérer deux lettres", "Reconstruire avec des tuiles"], reward: "La maison des mots" },
  { title: "Former des mots", lesson: "Combiner consonnes et voyelles", exercises: ["Fusionner deux tuiles", "Choisir la combinaison", "Remettre les syllabes en ordre"], reward: "Le jardin et la bibliothèque" },
  { title: "Trouver et classer", lesson: "Reconnaître les mots et les catégories", exercises: ["Trouver les mots cachés", "Classer les images", "Classer les mots"], reward: "Le jardin et la bibliothèque" },
  { title: "Morceaux de phrase", lesson: "Comprendre une phrase très courte", exercises: ["Relier sujet et action", "Relier image et phrase", "Choisir la fin de phrase"], reward: "Les habitants" },
  { title: "Singulier et pluriel", lesson: "Observer les deux formes d’un nom", exercises: ["Associer les deux formes", "Choisir la forme adaptée", "Transformer le mot"], reward: "Les habitants" },
  { title: "Écouter et comprendre", lesson: "Reconnaître des mots et phrases à l’oral", exercises: ["Toucher l’image entendue", "Choisir entre trois mots", "Répondre vrai ou faux"], reward: "L’école du village" },
  { title: "Décrire une scène", lesson: "Produire de petites phrases", exercises: ["Repérer les mots présents", "Compléter deux phrases", "Décrire l’image"], reward: "L’école du village" }
]

const villagePathNodes = levelOneStages.flatMap((stage, stageIndex) => [
  { type: "lesson", stage: stageIndex, title: stage.lesson },
  ...stage.exercises.map((title, exerciseIndex) => ({ type: "exercise", stage: stageIndex, exercise: exerciseIndex, title }))
]).concat({ type: "evaluation", stage: 10, title: "Évaluation finale · 12 questions" })
const PATH_NODE_COUNT = villagePathNodes.length
const curriculum = Array.isArray(window.THIMOLI_CURRICULUM) ? window.THIMOLI_CURRICULUM : []
const MAX_QUESTION_COUNT = 12

function villageStages(index = state?.currentVillage || 0) {
  return curriculum[index]?.stages?.length === 10 ? curriculum[index].stages : levelOneStages
}
function pathNodesFor(index = state?.currentVillage || 0) {
  return villageStages(index).flatMap((stage, stageIndex) => [
    { type: "lesson", stage: stageIndex, title: stage.lesson },
    ...stage.exercises.map((title, exerciseIndex) => ({ type: "exercise", stage: stageIndex, exercise: exerciseIndex, title }))
  ]).concat({ type: "evaluation", stage: 10, title: "Évaluation finale · 12 questions" })
}
function activePathNodes() { return pathNodesFor(state.currentVillage) }

const reviewItems = [
  { icon: "அ", name: "Alphabet", detail: "12 voyelles · 18 consonnes", priority: "Lire et reconnaître", accent: "orange" },
  { icon: "◉", name: "Prononciation", detail: "6 contrastes essentiels", priority: "Écouter et répéter", accent: "blue" },
  { icon: "✎", name: "Écriture", detail: "12 niveaux progressifs", priority: "Avec ou sans modèle", accent: "green" },
  { icon: "Aa", name: "Vocabulaire", detail: "4 thèmes disponibles", priority: "Mémoriser les mots utiles", accent: "violet" }
]

const kuralNavIcon = `<svg class="nav-svg nav-svg-kural" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M4.75 5.25c2.7-.8 5.1-.25 7.25 1.65v12.35c-2.15-1.9-4.55-2.45-7.25-1.65V5.25Z"/><path d="M19.25 5.25c-2.7-.8-5.1-.25-7.25 1.65v12.35c2.15-1.9 4.55-2.45 7.25-1.65V5.25Z"/><path d="M7.25 9.25c.95-.08 1.8.12 2.55.58M14.2 9.83c.75-.46 1.6-.66 2.55-.58"/></svg>`
const statsNavIcon = `<svg class="nav-svg nav-svg-stats" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M4.5 18.5h15"/><path d="m5.5 15.5 3.7-4 3.1 2.3 5.9-7"/><circle cx="5.5" cy="15.5" r="1"/><circle cx="9.2" cy="11.5" r="1"/><circle cx="12.3" cy="13.8" r="1"/><circle cx="18.2" cy="6.8" r="1"/></svg>`
const profileNavIcon = `<svg class="nav-svg nav-svg-profile" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><circle cx="12" cy="8" r="3.25"/><path d="M5.5 19c.55-3.5 2.72-5.25 6.5-5.25S17.95 15.5 18.5 19"/></svg>`
const homeNavIcon = `<svg class="nav-svg nav-svg-home" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="m4 11.25 8-6.5 8 6.5"/><path d="M6.5 10.25V19h11v-8.75M9.5 19v-5.5h5V19"/></svg>`
const reviewNavIcon = `<svg class="nav-svg nav-svg-review" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="4.25"/><path d="m9.8 12.15 1.45 1.45 3.25-3.35"/></svg>`
const speakerIcon = `<svg class="sound-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M5 10v4h3.1l4.4 3.5v-11L8.1 10H5Z"/><path d="M15.4 9.2c1.45 1.55 1.45 4.05 0 5.6M17.9 6.9c2.7 2.8 2.7 7.4 0 10.2"/></svg>`
const villageMiniIcon = `<svg class="village-mini-svg" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false"><path d="M3.75 14.5 8 10.75l3.1 2.55 4.2-5.05 4.95 6.25"/><path d="M5.25 14v5h13.5v-5M8.75 19v-3.75h3V19"/><path d="M15.25 6.75v4.15"/><path d="M15.25 6.75c1.7-.05 2.65-.8 2.85-2.25-1.7.05-2.65.8-2.85 2.25Z"/></svg>`
const navItems = [
  { page: "stats", icon: statsNavIcon, label: "Stats" },
  { page: "home", icon: villageMiniIcon, label: "Villages" },
  { page: "review", icon: homeNavIcon, label: "Accueil" },
  { page: "kural", icon: kuralNavIcon, label: "Kural" },
  { page: "profile", icon: profileNavIcon, label: "Profil" }
]

const pageTitles = { home: "Villages", levels: "Villages", path: "Sentier du village", kural: "Tirukkural", review: "Accueil", stats: "Stats", profile: "Profil", settings: "Paramètres", lesson: "Leçon" }

const validPages = ["home", "levels", "path", "kural", "review", "stats", "profile", "settings", "lesson"]
const validLessonModes = ["parcours", "Examen blanc", "Examen du village", "Quêtes", "Bilan alphabet", ...reviewItems.map((item) => item.name)]
const STORAGE_KEY = "thimoli-v1.1-premium-state"
const defaultProgress = Array(12).fill(0)
const mascotSources = Object.fromEntries(["welcome", "hint", "success", "correction", "celebrate"].map((name) => [name, `assets/mascot/mascot-${name}.webp`]))
const kuralParts = [
  { id: "aram", ta: "அறத்துப்பால்", name: "Livre de la Sagesse", shortName: "Sagesse", detail: "Apprendre à vivre avec justesse", description: "Ce premier livre rassemble 380 Kurals sur la conduite personnelle : famille, hospitalité, maîtrise de soi, générosité et non-violence.", themes: ["Vertu", "Famille", "Maîtrise de soi"], start: 0, end: 379, chapterStart: 0, chapterEnd: 37, accent: "green" },
  { id: "porul", ta: "பொருட்பால்", name: "Livre de la Fortune", shortName: "Fortune", detail: "Comprendre la société et l’action", description: "Le plus vaste des trois livres réunit 700 Kurals. Il parle d’éducation, de justice, de gouvernance, d’agriculture, d’amitié et de vie en société.", themes: ["Société", "Justice", "Éducation"], start: 380, end: 1079, chapterStart: 38, chapterEnd: 107, accent: "blue" },
  { id: "inbam", ta: "இன்பத்துப்பால்", name: "Livre de l’Amour", shortName: "Amour", detail: "Explorer les sentiments amoureux", description: "Ce dernier livre contient 250 Kurals de forme plus poétique. Il suit l’amour, l’attente, la séparation et les retrouvailles.", themes: ["Rencontre", "Absence", "Retrouvailles"], start: 1080, end: 1329, chapterStart: 108, chapterEnd: 132, accent: "coral" }
]
const kuralChapterTitlesFr = [
  "Louange à Dieu", "Grandeur de la pluie", "Grandeur des ascètes", "Force de la vertu", "Vie familiale", "Valeur du conjoint", "Bonheur d’avoir des enfants", "Bienveillance", "Hospitalité", "Paroles agréables",
  "Reconnaissance", "Équité", "Maîtrise de soi", "Bonne conduite", "Ne pas convoiter le conjoint d’autrui", "Patience", "Absence d’envie", "Ne pas convoiter les biens d’autrui", "Ne pas médire", "Éviter les paroles inutiles",
  "Crainte des mauvaises actions", "Sens de l’entraide", "Générosité", "Renommée", "Compassion", "Refus de la viande", "Ascèse", "Conduite hypocrite", "Ne pas voler", "Vérité",
  "Maîtrise de la colère", "Ne pas faire de mal", "Non-violence", "Impermanence", "Renoncement", "Connaissance de la vérité", "Extinction du désir", "Destin", "Grandeur du souverain", "Éducation",
  "Ignorance", "Écoute", "Sagesse", "Corriger ses défauts", "S’entourer des grands", "Éviter les mauvaises fréquentations", "Agir après réflexion", "Connaître ses forces", "Choisir le bon moment", "Choisir le bon lieu",
  "Choisir ses collaborateurs", "Confier les tâches avec discernement", "Protéger ses proches", "Vigilance", "Gouvernement juste", "Tyrannie", "Éviter les actes qui terrorisent", "Bienveillance du regard", "Service de renseignement", "Énergie",
  "Ne pas être paresseux", "Persévérance dans l’action", "Courage dans l’adversité", "Le ministre", "Éloquence", "Pureté de l’action", "Fermeté dans l’action", "Méthode dans l’action", "L’ambassadeur", "Conduite auprès du souverain",
  "Comprendre les signes", "Connaître l’assemblée", "Assurance devant l’assemblée", "Le pays", "La forteresse", "Créer la richesse", "Valeur d’une armée", "Fierté militaire", "Amitié", "Examiner l’amitié",
  "Amitié ancienne", "Amitié nuisible", "Fausse amitié", "Folie", "Ignorance bornée", "Discorde", "Force de l’ennemi", "Connaître la stratégie ennemie", "Ennemi intérieur", "Ne pas offenser les grands",
  "Dépendance au désir", "Relations intéressées", "S’abstenir d’alcool", "Jeu d’argent", "Médecine", "Noblesse de la lignée", "Honneur", "Grandeur", "Excellence humaine", "Courtoisie",
  "Richesse inutile", "Sens de la honte", "Élever sa communauté", "Agriculture", "Pauvreté", "Mendicité", "Crainte de mendier", "Bassesse", "Trouble devant la beauté", "Comprendre les signes amoureux",
  "Joie de l’union", "Louange de sa beauté", "Grandeur de l’amour", "Abandon de la réserve", "Rumeurs sur l’amour", "Ne pas supporter la séparation", "Lamentation dans le dépérissement", "Reproches aux yeux", "Pâleur du chagrin", "Intensité de la solitude",
  "Se lamenter sur l’absent", "Rêves de l’être aimé", "Chagrin du soir", "Beauté qui s’altère", "Dialogue avec le cœur", "Perte de retenue", "Désir de l’être aimé", "Faire comprendre les signes", "Impatience de l’union", "Querelle avec son cœur",
  "Bouderie amoureuse", "Subtilités de la bouderie", "Joie de la réconciliation"
]

const phoneticLanguages = [
  { id: "fr", label: "Français", short: "FR" },
  { id: "en", label: "English", short: "EN" },
  { id: "de", label: "Deutsch", short: "DE" }
]
const phoneticProfiles = {
  fr: {
    independent: { "அ": "a", "ஆ": "aa", "இ": "i", "ஈ": "ii", "உ": "ou", "ஊ": "ouu", "எ": "é", "ஏ": "ê", "ஐ": "aï", "ஒ": "o", "ஓ": "ô", "ஔ": "aou" },
    consonants: { "க": "k", "ங": "ng", "ச": "tch", "ஞ": "gn", "ட": "t", "ண": "n", "த": "t", "ந": "n", "ப": "p", "ம": "m", "ய": "y", "ர": "r", "ல": "l", "வ": "v", "ழ": "lh", "ள": "l", "ற": "rr", "ன": "n", "ஜ": "dj", "ஷ": "ch", "ஸ": "s", "ஹ": "h" },
    signs: { "ா": "aa", "ி": "i", "ீ": "ii", "ு": "ou", "ூ": "ouu", "ெ": "é", "ே": "ê", "ை": "aï", "ொ": "o", "ோ": "ô", "ௌ": "aou" },
    vowels: "aàâeéêiîïoôuû", affricate: "tch", voicedAffricate: "dj"
  },
  en: {
    independent: { "அ": "a", "ஆ": "aa", "இ": "i", "ஈ": "ee", "உ": "u", "ஊ": "oo", "எ": "e", "ஏ": "ay", "ஐ": "ai", "ஒ": "o", "ஓ": "oh", "ஔ": "ow" },
    consonants: { "க": "k", "ங": "ng", "ச": "ch", "ஞ": "ny", "ட": "t", "ண": "n", "த": "th", "ந": "n", "ப": "p", "ம": "m", "ய": "y", "ர": "r", "ல": "l", "வ": "v", "ழ": "zh", "ள": "l", "ற": "rr", "ன": "n", "ஜ": "j", "ஷ": "sh", "ஸ": "s", "ஹ": "h" },
    signs: { "ா": "aa", "ி": "i", "ீ": "ee", "ு": "u", "ூ": "oo", "ெ": "e", "ே": "ay", "ை": "ai", "ொ": "o", "ோ": "oh", "ௌ": "ow" },
    vowels: "aeiouy", affricate: "ch", voicedAffricate: "j"
  },
  de: {
    independent: { "அ": "a", "ஆ": "aa", "இ": "i", "ஈ": "ii", "உ": "u", "ஊ": "uu", "எ": "e", "ஏ": "ee", "ஐ": "ai", "ஒ": "o", "ஓ": "oo", "ஔ": "au" },
    consonants: { "க": "k", "ங": "ng", "ச": "tsch", "ஞ": "nj", "ட": "t", "ண": "n", "த": "t", "ந": "n", "ப": "p", "ம": "m", "ய": "j", "ர": "r", "ல": "l", "வ": "w", "ழ": "lh", "ள": "l", "ற": "rr", "ன": "n", "ஜ": "dsch", "ஷ": "sch", "ஸ": "s", "ஹ": "h" },
    signs: { "ா": "aa", "ி": "i", "ீ": "ii", "ு": "u", "ூ": "uu", "ெ": "e", "ே": "ee", "ை": "ai", "ொ": "o", "ோ": "oo", "ௌ": "au" },
    vowels: "aeiouäöü", affricate: "tsch", voicedAffricate: "dsch"
  }
}
const alphabetGroups = {
  vowels: [
    { letter: "அ", sound: "a", word: "அம்மா", meaning: "maman" },
    { letter: "ஆ", sound: "aa", word: "ஆடு", meaning: "chèvre" },
    { letter: "இ", sound: "i", word: "இலை", meaning: "feuille" },
    { letter: "ஈ", sound: "ii", word: "ஈ", meaning: "mouche" },
    { letter: "உ", sound: "ou", word: "உடல்", meaning: "corps" },
    { letter: "ஊ", sound: "ouu", word: "ஊர்", meaning: "village" },
    { letter: "எ", sound: "é", word: "எலி", meaning: "souris" },
    { letter: "ஏ", sound: "ê", word: "ஏணி", meaning: "échelle" },
    { letter: "ஐ", sound: "aï", word: "ஐந்து", meaning: "cinq" },
    { letter: "ஒ", sound: "o", word: "ஒன்று", meaning: "un" },
    { letter: "ஓ", sound: "ô", word: "ஓடு", meaning: "courir" },
    { letter: "ஔ", sound: "aou", word: "ஔவை", meaning: "Avvai" }
  ],
  consonants: [
    { letter: "க்", sound: "k", hint: "comme k dans kilo" }, { letter: "ங்", sound: "ng", hint: "comme ng dans parking" },
    { letter: "ச்", sound: "tch", hint: "comme tch dans match" }, { letter: "ஞ்", sound: "gn", hint: "comme gn dans montagne" },
    { letter: "ட்", sound: "t", hint: "t avec la langue repliée" }, { letter: "ண்", sound: "n", hint: "n avec la langue repliée" },
    { letter: "த்", sound: "t", hint: "t doux, langue près des dents" }, { letter: "ந்", sound: "n", hint: "n dental" },
    { letter: "ப்", sound: "p", hint: "comme p dans papa" }, { letter: "ம்", sound: "m", hint: "comme m dans maman" },
    { letter: "ய்", sound: "y", hint: "comme y dans yoga" }, { letter: "ர்", sound: "r", hint: "r bref" },
    { letter: "ல்", sound: "l", hint: "l léger" }, { letter: "வ்", sound: "v", hint: "entre v et w" },
    { letter: "ழ்", sound: "lh", hint: "son tamoul avec la langue repliée, différent du l français" }, { letter: "ள்", sound: "l", hint: "l avec la langue repliée" },
    { letter: "ற்", sound: "rr", hint: "r fort et rapide" }, { letter: "ன்", sound: "n", hint: "n avec la langue derrière les dents du haut" }
  ],
  special: [{ letter: "ஃ", sound: "akh", hint: "signe spécial : āytam" }]
}

const uyirmeiVowelSigns = ["", "ா", "ி", "ீ", "ு", "ூ", "ெ", "ே", "ை", "ொ", "ோ", "ௌ"]
function uyirmeiCombo(consonantLetter, vowelIndex) {
  const base = consonantLetter.replace("்", "")
  return base + uyirmeiVowelSigns[vowelIndex]
}

const pronunciationPairs = [
  { short: "அ", shortSound: "a", shortAudio: "assets/audio/snippets/0003.mp3", shortWord: "அம்மா", shortWordAudio: "assets/audio/snippets/0019.mp3", shortMeaning: "maman", long: "ஆ", longSound: "aa", longAudio: "assets/audio/snippets/0043.mp3", longWord: "ஆடு", longWordAudio: "assets/audio/snippets/0048.mp3", longMeaning: "chèvre", cue: "Le son long dure environ deux temps." },
  { short: "இ", shortSound: "i", shortAudio: "assets/audio/snippets/0055.mp3", shortWord: "இலை", shortWordAudio: "assets/audio/snippets/0080.mp3", shortMeaning: "feuille", long: "ஈ", longSound: "ii", longAudio: "assets/audio/snippets/0084.mp3", longWord: "ஈ", longWordAudio: "assets/audio/snippets/0084.mp3", longMeaning: "mouche", cue: "Garde la bouche étirée un peu plus longtemps." },
  { short: "உ", shortSound: "ou", shortAudio: "assets/audio/snippets/0088.mp3", shortWord: "உடல்", shortWordAudio: "assets/audio/snippets/0093.mp3", shortMeaning: "corps", long: "ஊ", longSound: "ouu", longAudio: "assets/audio/snippets/0103.mp3", longWord: "ஊர்", longWordAudio: "assets/audio/snippets/0105.mp3", longMeaning: "village", cue: "Le deuxième son se prolonge sans changer de hauteur." },
  { short: "எ", shortSound: "é", shortAudio: "assets/audio/snippets/0107.mp3", shortWord: "எலி", shortWordAudio: "assets/audio/snippets/0133.mp3", shortMeaning: "souris", long: "ஏ", longSound: "ê", longAudio: "assets/audio/snippets/0139.mp3", longWord: "ஏணி", longWordAudio: "assets/audio/snippets/0140.mp3", longMeaning: "échelle", cue: "Écoute surtout la durée et l’ouverture de la bouche." },
  { short: "ஒ", shortSound: "o", shortAudio: "assets/audio/snippets/0146.mp3", shortWord: "ஒன்று", shortWordAudio: "assets/audio/snippets/0147.mp3", shortMeaning: "un", long: "ஓ", longSound: "ô", longAudio: "assets/audio/snippets/0159.mp3", longWord: "ஓடு", longWordAudio: "assets/audio/snippets/0161.mp3", longMeaning: "courir", cue: "Le son long reste rond et régulier." },
  { short: "ஐ", shortSound: "aï", shortAudio: "assets/audio/snippets/0142.mp3", shortWord: "ஐந்து", shortWordAudio: "assets/audio/snippets/0143.mp3", shortMeaning: "cinq", long: "ஔ", longSound: "aou", longAudio: "assets/audio/snippets/0163.mp3", longWord: "ஔவை", longWordAudio: "assets/audio/snippets/0164.mp3", longMeaning: "Avvai", cue: "Deux sons glissent l’un vers l’autre." }
]

const vocabularySets = [
  { id: "family", name: "Famille", icon: "⌂", color: "coral", words: [
    ["அம்மா", "maman"], ["அப்பா", "papa"], ["அண்ணன்", "grand frère"], ["அக்கா", "grande sœur"],
    ["தம்பி", "petit frère"], ["தங்கை", "petite sœur"], ["குடும்பம்", "famille"], ["வீடு", "maison"]
  ] },
  { id: "body", name: "Le corps", icon: "●", color: "green", words: [
    ["தலை", "tête"], ["கண்", "œil"], ["காது", "oreille"], ["மூக்கு", "nez"],
    ["வாய்", "bouche"], ["கை", "main"], ["கால்", "jambe / pied"], ["முடி", "cheveux"]
  ] },
  { id: "colors", name: "Couleurs", icon: "◒", color: "violet", words: [
    ["சிவப்பு", "rouge"], ["நீலம்", "bleu"], ["பச்சை", "vert"], ["மஞ்சள்", "jaune"],
    ["வெள்ளை", "blanc"], ["கருப்பு", "noir"]
  ] },
  { id: "school", name: "À l’école", icon: "▤", color: "blue", words: [
    ["பள்ளி", "école"], ["புத்தகம்", "livre"], ["பேனா", "stylo"], ["ஆசிரியர்", "professeur"],
    ["மாணவர்", "élève"], ["பாடம்", "leçon"], ["எழுது", "écrire"], ["படி", "lire / étudier"]
  ] }
]

const writingCurriculum = [
  { title: "Alphabet", focus: "31 signes", items: [...alphabetGroups.vowels.map((item) => ({ text: item.letter, label: "Voyelle" })), ...alphabetGroups.consonants.map((item) => ({ text: item.letter, label: "Consonne" })), { text: "ஃ", label: "Signe spécial" }] },
  { title: "Syllabes", focus: "216 combinaisons", items: alphabetGroups.consonants.flatMap((consonant) => alphabetGroups.vowels.map((vowel,index) => ({ text: uyirmeiCombo(consonant.letter,index), label: `${consonant.letter} + ${vowel.letter}` }))) },
  { title: "Mots simples", focus: "Famille et maison", items: [["அம்மா", "maman"], ["அப்பா", "papa"], ["வீடு", "maison"], ["கை", "main"], ["கண்", "œil"], ["பால்", "lait"]].map(([text, label]) => ({ text, label })) },
  { title: "Quotidien", focus: "Objets familiers", items: [["புத்தகம்", "livre"], ["பேனா", "stylo"], ["பள்ளி", "école"], ["தண்ணீர்", "eau"], ["உணவு", "repas"], ["நாற்காலி", "chaise"]].map(([text, label]) => ({ text, label })) },
  { title: "Nature", focus: "Monde vivant", items: [["மரம்", "arbre"], ["மலர்", "fleur"], ["மழை", "pluie"], ["கடல்", "mer"], ["மலை", "montagne"], ["பறவை", "oiseau"]].map(([text, label]) => ({ text, label })) },
  { title: "Vie scolaire", focus: "Apprendre et travailler", items: [["ஆசிரியர்", "professeur"], ["மாணவர்", "élève"], ["பாடம்", "leçon"], ["எழுது", "écrire"], ["படிப்பு", "études"], ["வேலை", "travail"]].map(([text, label]) => ({ text, label })) },
  { title: "Culture", focus: "Fêtes et traditions", items: [["திருவிழா", "fête"], ["கோவில்", "temple"], ["இசை", "musique"], ["நடனம்", "danse"], ["பொங்கல்", "Pongal"], ["பாரம்பரியம்", "tradition"]].map(([text, label]) => ({ text, label })) },
  { title: "Voyages", focus: "Lieux et directions", items: [["பயணம்", "voyage"], ["நிலையம்", "gare"], ["விமானம்", "avion"], ["வடக்கு", "nord"], ["தெற்கு", "sud"], ["முகவரி", "adresse"]].map(([text, label]) => ({ text, label })) },
  { title: "La ville", focus: "Mots plus développés", items: [["மருத்துவமனை", "hôpital"], ["நூலகம்", "bibliothèque"], ["பல்கலைக்கழகம்", "université"], ["போக்குவரத்து", "transport"], ["கடைத்தெரு", "rue commerçante"]].map(([text, label]) => ({ text, label })) },
  { title: "Mes projets", focus: "Courtes expressions", items: [["என் கனவு", "mon rêve"], ["நாளை வருவேன்", "je viendrai demain"], ["நான் படிப்பேன்", "j’étudierai"], ["புதிய வேலை", "nouveau travail"]].map(([text, label]) => ({ text, label })) },
  { title: "Mes idées", focus: "Émotions et réflexion", items: [["எனக்கு மகிழ்ச்சி", "je suis heureux"], ["நல்ல எண்ணம்", "bonne pensée"], ["அமைதியான மனம்", "esprit calme"], ["உண்மையான நட்பு", "amitié sincère"]].map(([text, label]) => ({ text, label })) },
  { title: "Maîtrise", focus: "Phrases complètes", items: [["தமிழ் மொழி அழகானது", "La langue tamoule est belle"], ["நான் தினமும் தமிழ் படிக்கிறேன்", "J’étudie le tamoul chaque jour"], ["அறிவே மிகப் பெரிய செல்வம்", "Le savoir est la plus grande richesse"], ["முயற்சி வெற்றியைத் தரும்", "L’effort mène à la réussite"]].map(([text, label]) => ({ text, label })) }
]

const tourSteps = [
  { icon: "👋", title: "Bienvenue dans Thimoli", copy: "Je suis Thimoli, ton guide. Nous allons apprendre un peu chaque jour, sans pression." },
  { icon: "♥", title: "Les cœurs t’aident à ralentir", copy: "Ils ne punissent pas une petite erreur : je t’explique et tu peux recommencer plusieurs fois." },
  { icon: "🏡", title: "Douze villages à explorer", copy: "Touche directement le village de l’accueil pour voir le monde entier et choisir ton niveau." },
  { icon: "▤", title: "La sagesse du Tirukkural", copy: "Parcours les 1 330 distiques, regroupés en 133 chapitres et trois grandes parties." },
  { icon: statsNavIcon, title: "Tes progrès restent visibles", copy: "Les révisions, les XP et les statistiques te montrent ce que tu maîtrises et ce qu’il faut revoir." }
]

const interfaceTranslations = {
  en: {
    "Accueil": "Home", "Révisions": "Review", "Stats": "Progress", "Profil": "Profile", "Paramètres": "Settings", "Villages": "Villages", "Sentier du village": "Village path", "Leçon": "Lesson",
    "Apprendre le tamoul, un jour à la fois": "Learn Tamil, one day at a time", "Ouvrir mon profil": "Open my profile", "Ton parcours aujourd’hui": "Your journey today", "Série": "Streak", "Pourquoi ?": "How does it work?", "Changer de village": "Change village",
    "Progression du village": "Village progress", "Réviser ce village": "Review this village", "Continuer mon parcours": "Continue my journey", "Contenu du village": "Village content",
    "Les 12 villages": "The 12 villages", "Un parcours vivant, du premier mot à la maîtrise.": "A living journey from your first word to fluency.", "Ton prochain objectif": "Your next goal", "Explore chaque monde et découvre un nouveau thème du tamoul.": "Explore every world and discover a new Tamil theme.",
    "Chaque village te rapproche d’une nouvelle version de toi.": "Each village brings you closer to a new version of yourself.", "Sentier du village": "Village path", "LE VILLAGE ÉVOLUE": "THE VILLAGE GROWS", "Mini-leçon": "Mini lesson", "ÉVALUATION DU VILLAGE": "VILLAGE ASSESSMENT", "La clé du prochain niveau": "The key to the next level", "Commencer l’évaluation": "Start assessment", "Rejouer l’évaluation": "Retake assessment",
    "Tout le village est restauré. Tu peux rejouer chaque étape pour consolider tes acquis.": "The whole village has been restored. Replay any step to strengthen your skills.", "Avance étape par étape : une leçon débloque ses exercices, puis le village se transforme.": "Move forward step by step: each lesson unlocks practice, and the village gradually comes to life.", "Ton sentier d’apprentissage": "Your learning path",
    "Le Tirukkural": "The Tirukkural", "CLASSIQUE TAMOUL · TIRUVALLUVAR": "TAMIL CLASSIC · TIRUVALLUVAR", "Une sagesse en sept mots": "Wisdom in seven words", "Le Tirukkural rassemble 1 330 courts poèmes attribués au poète et philosophe Tiruvalluvar. Chacun transmet une idée pour mener une vie plus juste et harmonieuse.": "The Tirukkural brings together 1,330 short poems attributed to the poet and philosopher Tiruvalluvar. Each one conveys an idea for living a fairer, more harmonious life.",
    "Chaque chapitre réunit dix Kurals. La date exacte de l’œuvre reste incertaine, mais ses conseils sur la conduite, la société et les sentiments ont traversé les siècles.": "Each chapter contains ten Kurals. The work's exact date remains uncertain, but its reflections on conduct, society and emotions have endured for centuries.", "Réduire": "Show less", "Lire la suite…": "Read more…", "LES TROIS LIVRES": "THE THREE BOOKS", "Choisis une partie pour découvrir ses chapitres.": "Choose a book to explore its chapters.", "Structure du Tirukkural": "Structure of the Tirukkural", "chapitres": "chapters", "livres": "books",
    "Livre de la Sagesse": "Book of Virtue", "Sagesse": "Virtue", "Apprendre à vivre avec justesse": "Learning to live with integrity", "Ce premier livre rassemble 380 Kurals sur la conduite personnelle : famille, hospitalité, maîtrise de soi, générosité et non-violence.": "The first book contains 380 Kurals on personal conduct: family, hospitality, self-control, generosity and non-violence.", "Vertu": "Virtue", "Famille": "Family", "Maîtrise de soi": "Self-control",
    "Livre de la Fortune": "Book of Society", "Fortune": "Society", "Comprendre la société et l’action": "Understanding society and action", "Le plus vaste des trois livres réunit 700 Kurals. Il parle d’éducation, de justice, de gouvernance, d’agriculture, d’amitié et de vie en société.": "The largest of the three books contains 700 Kurals. It explores education, justice, governance, agriculture, friendship and life in society.", "Société": "Society", "Justice": "Justice", "Éducation": "Education",
    "Livre de l’Amour": "Book of Love", "Amour": "Love", "Explorer les sentiments amoureux": "Exploring love and emotion", "Ce dernier livre contient 250 Kurals de forme plus poétique. Il suit l’amour, l’attente, la séparation et les retrouvailles.": "The final book contains 250 more lyrical Kurals. It follows love, longing, separation and reunion.", "Rencontre": "Meeting", "Absence": "Separation", "Retrouvailles": "Reunion",
    "Choisis l’un des dix Kurals de ce chapitre.": "Choose one of the ten Kurals in this chapter.", "Texte tamoul et prononciation simplifiée": "Tamil text and simplified pronunciation", "Écouter en tamoul": "Listen in Tamil", "Chargement du Kural…": "Loading Kural…", "Précédent": "Previous", "Suivant": "Next", "Retour aux 10 Kurals": "Back to the 10 Kurals", "Texte tamoul : édition électronique de Project Madurai.": "Tamil text: Project Madurai electronic edition.",
    "Réviser intelligemment": "Review with purpose", "Un plan court aujourd’hui, des examens quand tu es prêt.": "A short plan for today, and assessments when you are ready.", "PLAN EXPRESS · 5 MIN": "QUICK PLAN · 5 MIN", "Consolider tes acquis": "Strengthen your skills", "Lancer mon plan": "Start my plan", "ATELIERS LIBRES": "PRACTICE WORKSHOPS", "Choisis une compétence": "Choose a skill", "CENTRE D’EXAMENS": "ASSESSMENT CENTRE", "Teste-toi niveau par niveau": "Test yourself level by level", "Examen blanc": "Practice test", "Examen du village": "Village assessment", "sans pression": "no pressure", "niveau complet": "full level", "Verrouillé": "Locked", "Après les 40 étapes": "After all 40 steps", "Les examens de révision n’effacent jamais ta progression.": "Practice assessments never erase your progress.",
    "Alphabet": "Alphabet", "Prononciation": "Pronunciation", "Écriture": "Writing", "Vocabulaire": "Vocabulary", "Lire et reconnaître": "Read and recognise", "Écouter et répéter": "Listen and repeat", "Avec ou sans modèle": "With or without a guide", "4 thèmes du quotidien": "4 everyday themes", "31 signes essentiels": "31 essential characters", "6 familles de sons": "6 sound families", "Traçage au doigt": "Finger tracing", "30 mots illustrés": "30 illustrated words",
    "L’alphabet tamoul": "The Tamil alphabet", "Reconnais les signes, puis écoute leur son.": "Recognise each character, then listen to its sound.", "Voyelles": "Vowels", "Consonnes": "Consonants", "toucher pour écouter": "tap to listen", "SON": "SOUND", "Le signe spécial · āytam": "The special sign · āytam", "Il complète l’alphabet et apparaît dans certains mots ou sons empruntés.": "It completes the alphabet and appears in some words and borrowed sounds.", "Astuce : apprends d’abord les 12 voyelles, puis ajoute 3 consonnes à la fois.": "Tip: learn the 12 vowels first, then add three consonants at a time.",
    "Entends la différence entre un son court et un son long.": "Hear the difference between a short and a long sound.", "ÉCOUTE ET RÉPÈTE": "LISTEN AND REPEAT", "son court": "short sound", "son long": "long sound", "Son suivant": "Next sound", "Répète chaque paire trois fois : lentement, normalement, puis sans regarder.": "Repeat each pair three times: slowly, at normal speed, then without looking.",
    "Trace la lettre directement avec ton doigt.": "Trace the character directly with your finger.", "Niveau d’aide": "Guidance level", "Avec modèle": "With guide", "Sans aide": "Without help", "Lettre précédente": "Previous character", "Lettre suivante": "Next character", "SUIS LE MODÈLE": "FOLLOW THE GUIDE", "À TOI DE JOUER": "YOUR TURN", "Repasse doucement sur la lettre claire.": "Slowly trace over the pale character.", "Commence à tracer dans la zone.": "Start tracing inside the area.", "Effacer": "Clear", "Valider mon tracé": "Check my tracing", "La validation regarde la forme générale. Tu peux recommencer autant de fois que nécessaire.": "The check looks at the overall shape. You can try again as often as you need.",
    "Des mots utiles, classés par thème.": "Useful words organised by theme.", "Thèmes de vocabulaire": "Vocabulary themes", "THÈME": "THEME", "cartes": "cards", "Touche une carte pour écouter le mot, puis répète-le sans regarder la phonétique.": "Tap a card to hear the word, then repeat it without looking at the pronunciation guide.",
    "Mon bilan": "My progress", "Tout ce qui avance, en un seul regard.": "See all your progress at a glance.", "min aujourd’hui": "min today", "OBJECTIF DU JOUR": "TODAY’S GOAL", "Objectif atteint !": "Goal reached!", "Tu peux t’arrêter fier de toi, ou consolider un point difficile.": "You can stop feeling proud, or strengthen a difficult point.", "Une petite session régulière vaut mieux qu’une longue session rare.": "A short, regular session is better than a rare, long one.", "Aperçu démo · les chiffres évolueront avec tes vraies sessions.": "Demo preview · these figures will change with your real sessions.", "RYTHME DES 7 DERNIERS JOURS": "LAST 7 DAYS", "jours actifs": "active days", "MES 4 COMPÉTENCES": "MY 4 SKILLS", "Une progression équilibrée": "Balanced progress", "Lecture": "Reading", "Écoute": "Listening", "Reconnaître les signes et le sens": "Recognise characters and meaning", "Comprendre sans regarder": "Understand without looking", "Former les lettres et les phrases": "Form characters and sentences", "Réutiliser les mots appris": "Use learned words again", "PROCHAINE PRIORITÉ": "NEXT PRIORITY", "Ouvrir mes révisions": "Open my review", "PARCOURS COMPLET": "FULL JOURNEY", "Chaque cercle correspond à un niveau Valar Tamil.": "Each circle represents one Valar Tamil level.",
    "MON PROFIL": "MY PROFILE", "Mon aventure": "My journey", "Ouvrir les paramètres": "Open settings", "jours": "days", "jour": "day", "leçons": "lessons", "villages": "villages", "village": "village", "OBJECTIF QUOTIDIEN": "DAILY GOAL", "minutes par jour": "minutes a day", "Tu avances mieux avec de petites sessions régulières.": "You make better progress with short, regular sessions.", "MA COLLECTION": "MY COLLECTION", "Badges récents": "Recent badges", "Voir mes stats": "View my progress", "Paramètres": "Settings", "Mes villages": "My villages", "Régularité": "Consistency", "Premiers sons": "First sounds", "Exploration": "Exploration",
    "Personnalise une expérience qui te ressemble.": "Personalise the experience to suit you.", "APPARENCE ET LANGUE": "APPEARANCE & LANGUAGE", "Langue de l’application": "App language", "Traduit toute l’interface et adapte la phonétique": "Translates the full interface and adapts pronunciation guides", "Langue des aides": "App language", "Adapte les indications et la phonétique du Kural": "Translates the full interface and adapts Kural pronunciation guides", "Apparence": "Appearance", "Choisis l’ambiance qui repose le mieux tes yeux": "Choose the appearance that feels most comfortable", "Clair": "Light", "Sombre": "Dark", "APPRENTISSAGE": "LEARNING", "Objectif quotidien": "Daily goal", "Une durée réaliste que tu peux tenir": "A realistic duration you can maintain", "Prononciation automatique": "Automatic pronunciation", "Joue le son au début de chaque question": "Plays the sound at the start of each question", "Effets sonores": "Sound effects", "Sons doux de réussite et de correction": "Gentle sounds for success and correction", "CONFORT": "COMFORT", "Rappel quotidien": "Daily reminder", "Chaque jour à 19:00": "Every day at 7:00 pm", "Réduire les animations": "Reduce motion", "Limite les mouvements et les célébrations": "Reduces movement and celebrations", "Taille du texte": "Text size", "Standard": "Standard", "AIDE": "HELP", "Revoir la visite guidée": "Replay the guided tour", "Thimoli te présente chaque espace": "Thimoli introduces every area", "COMPTE": "ACCOUNT", "Compte et confidentialité": "Account and privacy", "Aide et retours": "Help and feedback", "Prototype interactif": "Interactive prototype", "Retour au profil": "Back to profile", "Thème de l’application": "App theme", "Navigation principale": "Main navigation",
    "Conseil de Thimoli": "Thimoli’s tip", "Bien joué": "Well done", "Bonne réponse": "Correct answer", "Exact !": "Exactly!", "Correction utile": "Helpful correction", "Ton indice": "Your hint", "Objectif :": "Goal:", "Prends ton temps : écoute le son, puis choisis ta réponse.": "Take your time: listen to the sound, then choose your answer.", "Réponds sans te presser. À la fin, tu verras exactement où tu en es.": "Take your time. At the end, you will see exactly where you stand.", "Lis et écoute en tamoul": "Read and listen in Tamil", "Lis le mot ou la phrase en tamoul": "Read the Tamil word or phrase", "Lis le sens, puis retrouve le tamoul": "Read the meaning, then find the Tamil", "Que signifie cet élément ?": "What does this mean?", "Quel mot ou expression tamoule correspond ?": "Which Tamil word or phrase matches?", "Qu’as-tu entendu ?": "What did you hear?", "Choisis une réponse": "Choose an answer", "Indice": "Hint", "Indice affiché": "Hint shown", "Voir un indice": "Show a hint", "Vérifier": "Check", "À retenir": "Key point", "CE QU’IL FAUT RETENIR": "KEY POINT", "Exemple :": "Example:", "Continuer": "Continue", "On apprend de chaque essai": "Every try helps you learn", "Réécouter et réessayer": "Listen again and retry", "Un seul cœur a été utilisé pour cette question.": "Only one heart was used for this question.",
    "Les cœurs protègent ton rythme": "Hearts protect your pace", "Ils t’encouragent à prendre le temps de comprendre, sans te punir.": "They encourage you to take time to understand without punishing you.", "Les trois premiers essais incorrects ne coûtent rien.": "Your first three incorrect attempts cost nothing.", "Un cœur est utilisé seulement à partir de la quatrième erreur.": "A heart is used only from the fourth error onwards.", "Tu ne peux perdre qu’un cœur par question.": "You can lose only one heart per question.", "Dans ce prototype, tu peux continuer à apprendre même à 0 cœur.": "In this prototype, you can keep learning even with 0 hearts.", "J’ai compris": "Got it", "Comment le débloquer ?": "How do I unlock it?", "Passer": "Skip", "VISITE GUIDÉE": "GUIDED TOUR", "Commencer l’aventure": "Start the adventure", "Suivant": "Next",
    "Village des Premiers Pas": "First Steps Village", "Les bases du tamoul": "Tamil foundations", "Village de la Mer": "Sea Village", "Les mots du quotidien": "Everyday words", "Village du Temple": "Temple Village", "La famille et les proches": "Family and relatives", "Village des Rizières": "Rice Fields Village", "La nourriture et la nature": "Food and nature", "Village du Marché": "Market Village", "Les achats et les prix": "Shopping and prices", "Village du Savoir": "Knowledge Village", "L’école et le travail": "School and work", "Village des Fêtes": "Festival Village", "La culture et les traditions": "Culture and traditions", "Village des Collines": "Hill Village", "Les voyages et les lieux": "Travel and places", "Village de la Ville": "City Village", "La vie en ville": "Life in the city", "Village des Horizons": "Horizons Village", "Les projets et le futur": "Plans and the future", "Village de la Sagesse": "Wisdom Village", "Les idées et les émotions": "Ideas and emotions", "Village du Maître": "Mastery Village", "La maîtrise du tamoul": "Tamil mastery",
    "maman": "mum", "papa": "dad", "grand frère": "older brother", "grande sœur": "older sister", "petit frère": "younger brother", "petite sœur": "younger sister", "famille": "family", "maison": "house", "tête": "head", "œil": "eye", "oreille": "ear", "nez": "nose", "bouche": "mouth", "main": "hand", "jambe / pied": "leg / foot", "cheveux": "hair", "rouge": "red", "bleu": "blue", "vert": "green", "jaune": "yellow", "blanc": "white", "noir": "black", "école": "school", "livre": "book", "stylo": "pen", "professeur": "teacher", "élève": "student", "leçon": "lesson", "écrire": "write", "lire / étudier": "read / study"
  },
  de: {
    "Accueil": "Start", "Révisions": "Üben", "Stats": "Fortschritt", "Profil": "Profil", "Paramètres": "Einstellungen", "Villages": "Dörfer", "Sentier du village": "Dorfpfad", "Leçon": "Lektion",
    "Apprendre le tamoul, un jour à la fois": "Tamil lernen – jeden Tag ein Stück", "Ouvrir mon profil": "Mein Profil öffnen", "Ton parcours aujourd’hui": "Dein Weg heute", "Série": "Serie", "Pourquoi ?": "Wie funktioniert das?", "Changer de village": "Dorf wechseln", "Progression du village": "Fortschritt im Dorf", "Réviser ce village": "Dieses Dorf wiederholen", "Continuer mon parcours": "Meinen Weg fortsetzen", "Contenu du village": "Inhalt des Dorfes",
    "Les 12 villages": "Die 12 Dörfer", "Un parcours vivant, du premier mot à la maîtrise.": "Ein lebendiger Weg vom ersten Wort bis zur sicheren Beherrschung.", "Ton prochain objectif": "Dein nächstes Ziel", "Explore chaque monde et découvre un nouveau thème du tamoul.": "Erkunde jede Welt und entdecke ein neues Thema der tamilischen Sprache.", "Chaque village te rapproche d’une nouvelle version de toi.": "Jedes Dorf bringt dich einer neuen Version deiner selbst näher.", "LE VILLAGE ÉVOLUE": "DAS DORF WÄCHST", "Mini-leçon": "Mini-Lektion", "ÉVALUATION DU VILLAGE": "DORFPRÜFUNG", "La clé du prochain niveau": "Der Schlüssel zur nächsten Stufe", "Commencer l’évaluation": "Prüfung starten", "Rejouer l’évaluation": "Prüfung wiederholen", "Tout le village est restauré. Tu peux rejouer chaque étape pour consolider tes acquis.": "Das ganze Dorf ist wiederhergestellt. Wiederhole einzelne Schritte, um dein Wissen zu festigen.", "Avance étape par étape : une leçon débloque ses exercices, puis le village se transforme.": "Gehe Schritt für Schritt vor: Jede Lektion schaltet Übungen frei und das Dorf entwickelt sich weiter.", "Ton sentier d’apprentissage": "Dein Lernpfad",
    "Le Tirukkural": "Der Tirukkural", "CLASSIQUE TAMOUL · TIRUVALLUVAR": "TAMILISCHER KLASSIKER · TIRUVALLUVAR", "Une sagesse en sept mots": "Weisheit in sieben Worten", "Le Tirukkural rassemble 1 330 courts poèmes attribués au poète et philosophe Tiruvalluvar. Chacun transmet une idée pour mener une vie plus juste et harmonieuse.": "Der Tirukkural umfasst 1.330 kurze Gedichte, die dem Dichter und Philosophen Tiruvalluvar zugeschrieben werden. Jedes vermittelt einen Gedanken für ein gerechteres und harmonischeres Leben.", "Chaque chapitre réunit dix Kurals. La date exacte de l’œuvre reste incertaine, mais ses conseils sur la conduite, la société et les sentiments ont traversé les siècles.": "Jedes Kapitel enthält zehn Kurals. Die genaue Entstehungszeit ist ungewiss, doch die Gedanken zu Lebensführung, Gesellschaft und Gefühlen haben die Jahrhunderte überdauert.", "Réduire": "Weniger anzeigen", "Lire la suite…": "Weiterlesen…", "LES TROIS LIVRES": "DIE DREI BÜCHER", "Choisis une partie pour découvrir ses chapitres.": "Wähle ein Buch, um seine Kapitel zu entdecken.", "Structure du Tirukkural": "Aufbau des Tirukkural", "chapitres": "Kapitel", "livres": "Bücher",
    "Livre de la Sagesse": "Buch der Tugend", "Sagesse": "Tugend", "Apprendre à vivre avec justesse": "Lernen, aufrichtig zu leben", "Ce premier livre rassemble 380 Kurals sur la conduite personnelle : famille, hospitalité, maîtrise de soi, générosité et non-violence.": "Das erste Buch enthält 380 Kurals über persönliche Lebensführung: Familie, Gastfreundschaft, Selbstbeherrschung, Großzügigkeit und Gewaltlosigkeit.", "Vertu": "Tugend", "Famille": "Familie", "Maîtrise de soi": "Selbstbeherrschung", "Livre de la Fortune": "Buch der Gesellschaft", "Fortune": "Gesellschaft", "Comprendre la société et l’action": "Gesellschaft und Handeln verstehen", "Le plus vaste des trois livres réunit 700 Kurals. Il parle d’éducation, de justice, de gouvernance, d’agriculture, d’amitié et de vie en société.": "Das umfangreichste der drei Bücher enthält 700 Kurals. Es behandelt Bildung, Gerechtigkeit, Staatsführung, Landwirtschaft, Freundschaft und das gesellschaftliche Leben.", "Société": "Gesellschaft", "Justice": "Gerechtigkeit", "Éducation": "Bildung", "Livre de l’Amour": "Buch der Liebe", "Amour": "Liebe", "Explorer les sentiments amoureux": "Liebe und Gefühle erkunden", "Ce dernier livre contient 250 Kurals de forme plus poétique. Il suit l’amour, l’attente, la séparation et les retrouvailles.": "Das letzte Buch enthält 250 besonders lyrische Kurals. Es begleitet Liebe, Sehnsucht, Trennung und Wiedervereinigung.", "Rencontre": "Begegnung", "Absence": "Trennung", "Retrouvailles": "Wiedervereinigung",
    "Choisis l’un des dix Kurals de ce chapitre.": "Wähle einen der zehn Kurals dieses Kapitels.", "Texte tamoul et prononciation simplifiée": "Tamilischer Text und vereinfachte Aussprache", "Écouter en tamoul": "Auf Tamil anhören", "Chargement du Kural…": "Kural wird geladen…", "Précédent": "Zurück", "Suivant": "Weiter", "Retour aux 10 Kurals": "Zurück zu den 10 Kurals", "Texte tamoul : édition électronique de Project Madurai.": "Tamilischer Text: elektronische Ausgabe von Project Madurai.",
    "Réviser intelligemment": "Gezielt üben", "Un plan court aujourd’hui, des examens quand tu es prêt.": "Heute eine kurze Einheit, Prüfungen sobald du bereit bist.", "PLAN EXPRESS · 5 MIN": "KURZPROGRAMM · 5 MIN", "Consolider tes acquis": "Wissen festigen", "Lancer mon plan": "Programm starten", "ATELIERS LIBRES": "FREIE ÜBUNGEN", "Choisis une compétence": "Wähle eine Fähigkeit", "CENTRE D’EXAMENS": "PRÜFUNGSZENTRUM", "Teste-toi niveau par niveau": "Teste dich Stufe für Stufe", "Examen blanc": "Probeprüfung", "Examen du village": "Dorfprüfung", "sans pression": "ohne Druck", "niveau complet": "gesamte Stufe", "Verrouillé": "Gesperrt", "Après les 40 étapes": "Nach allen 40 Schritten", "Les examens de révision n’effacent jamais ta progression.": "Übungsprüfungen löschen deinen Fortschritt niemals.",
    "Alphabet": "Alphabet", "Prononciation": "Aussprache", "Écriture": "Schreiben", "Vocabulaire": "Wortschatz", "Lire et reconnaître": "Lesen und erkennen", "Écouter et répéter": "Anhören und nachsprechen", "Avec ou sans modèle": "Mit oder ohne Vorlage", "4 thèmes du quotidien": "4 Alltagsthemen", "31 signes essentiels": "31 wichtige Zeichen", "6 familles de sons": "6 Lautgruppen", "Traçage au doigt": "Mit dem Finger nachfahren", "30 mots illustrés": "30 bebilderte Wörter",
    "L’alphabet tamoul": "Das tamilische Alphabet", "Reconnais les signes, puis écoute leur son.": "Erkenne die Zeichen und höre anschließend ihren Laut.", "Voyelles": "Vokale", "Consonnes": "Konsonanten", "toucher pour écouter": "zum Anhören tippen", "SON": "LAUT", "Le signe spécial · āytam": "Das Sonderzeichen · āytam", "Il complète l’alphabet et apparaît dans certains mots ou sons empruntés.": "Es ergänzt das Alphabet und erscheint in einigen Wörtern und entlehnten Lauten.", "Astuce : apprends d’abord les 12 voyelles, puis ajoute 3 consonnes à la fois.": "Tipp: Lerne zuerst die 12 Vokale und nimm dann jeweils drei Konsonanten hinzu.",
    "Entends la différence entre un son court et un son long.": "Höre den Unterschied zwischen einem kurzen und einem langen Laut.", "ÉCOUTE ET RÉPÈTE": "ANHÖREN UND NACHSPRECHEN", "son court": "kurzer Laut", "son long": "langer Laut", "Son suivant": "Nächster Laut", "Répète chaque paire trois fois : lentement, normalement, puis sans regarder.": "Sprich jedes Paar dreimal nach: langsam, normal und dann ohne hinzusehen.",
    "Trace la lettre directement avec ton doigt.": "Zeichne das Zeichen direkt mit deinem Finger nach.", "Niveau d’aide": "Hilfestufe", "Avec modèle": "Mit Vorlage", "Sans aide": "Ohne Hilfe", "Lettre précédente": "Vorheriges Zeichen", "Lettre suivante": "Nächstes Zeichen", "SUIS LE MODÈLE": "FOLGE DER VORLAGE", "À TOI DE JOUER": "DU BIST DRAN", "Repasse doucement sur la lettre claire.": "Fahre das helle Zeichen langsam nach.", "Commence à tracer dans la zone.": "Beginne im Feld zu zeichnen.", "Effacer": "Löschen", "Valider mon tracé": "Zeichnung prüfen", "La validation regarde la forme générale. Tu peux recommencer autant de fois que nécessaire.": "Geprüft wird die Gesamtform. Du kannst es beliebig oft erneut versuchen.",
    "Des mots utiles, classés par thème.": "Nützliche Wörter, nach Themen geordnet.", "Thèmes de vocabulaire": "Wortschatzthemen", "THÈME": "THEMA", "cartes": "Karten", "Touche une carte pour écouter le mot, puis répète-le sans regarder la phonétique.": "Tippe auf eine Karte, höre das Wort an und sprich es anschließend ohne Aussprachehilfe nach.",
    "Mon bilan": "Mein Fortschritt", "Tout ce qui avance, en un seul regard.": "Dein gesamter Fortschritt auf einen Blick.", "min aujourd’hui": "Min. heute", "OBJECTIF DU JOUR": "TAGESZIEL", "Objectif atteint !": "Ziel erreicht!", "Tu peux t’arrêter fier de toi, ou consolider un point difficile.": "Du kannst stolz aufhören oder noch einen schwierigen Punkt festigen.", "Une petite session régulière vaut mieux qu’une longue session rare.": "Eine kurze, regelmäßige Einheit ist besser als eine seltene, lange.", "Aperçu démo · les chiffres évolueront avec tes vraies sessions.": "Demoansicht · Die Werte ändern sich mit deinen echten Einheiten.", "RYTHME DES 7 DERNIERS JOURS": "LETZTE 7 TAGE", "jours actifs": "aktive Tage", "MES 4 COMPÉTENCES": "MEINE 4 FÄHIGKEITEN", "Une progression équilibrée": "Ausgewogener Fortschritt", "Lecture": "Lesen", "Écoute": "Hören", "Reconnaître les signes et le sens": "Zeichen und Bedeutung erkennen", "Comprendre sans regarder": "Ohne Hinsehen verstehen", "Former les lettres et les phrases": "Zeichen und Sätze bilden", "Réutiliser les mots appris": "Gelernte Wörter wiederverwenden", "PROCHAINE PRIORITÉ": "NÄCHSTER SCHWERPUNKT", "Ouvrir mes révisions": "Meine Übungen öffnen", "PARCOURS COMPLET": "GESAMTER LERNWEG", "Chaque cercle correspond à un niveau Valar Tamil.": "Jeder Kreis steht für eine Valar-Tamil-Stufe.",
    "MON PROFIL": "MEIN PROFIL", "Mon aventure": "Mein Lernweg", "Ouvrir les paramètres": "Einstellungen öffnen", "jours": "Tage", "jour": "Tag", "leçons": "Lektionen", "villages": "Dörfer", "village": "Dorf", "OBJECTIF QUOTIDIEN": "TAGESZIEL", "minutes par jour": "Minuten pro Tag", "Tu avances mieux avec de petites sessions régulières.": "Mit kurzen, regelmäßigen Einheiten kommst du besser voran.", "MA COLLECTION": "MEINE SAMMLUNG", "Badges récents": "Neue Abzeichen", "Voir mes stats": "Fortschritt ansehen", "Mes villages": "Meine Dörfer", "Régularité": "Regelmäßigkeit", "Premiers sons": "Erste Laute", "Exploration": "Entdeckung",
    "Personnalise une expérience qui te ressemble.": "Passe die Lernerfahrung an dich an.", "APPARENCE ET LANGUE": "DARSTELLUNG & SPRACHE", "Langue de l’application": "App-Sprache", "Traduit toute l’interface et adapte la phonétique": "Übersetzt die gesamte Oberfläche und passt die Aussprachehilfe an", "Langue des aides": "App-Sprache", "Adapte les indications et la phonétique du Kural": "Übersetzt die gesamte Oberfläche und passt die Kural-Aussprachehilfe an", "Apparence": "Darstellung", "Choisis l’ambiance qui repose le mieux tes yeux": "Wähle die für deine Augen angenehmste Darstellung", "Clair": "Hell", "Sombre": "Dunkel", "APPRENTISSAGE": "LERNEN", "Objectif quotidien": "Tagesziel", "Une durée réaliste que tu peux tenir": "Eine realistische Dauer, die du einhalten kannst", "Prononciation automatique": "Automatische Aussprache", "Joue le son au début de chaque question": "Spielt den Laut zu Beginn jeder Frage ab", "Effets sonores": "Soundeffekte", "Sons doux de réussite et de correction": "Sanfte Klänge bei Erfolg und Korrektur", "CONFORT": "KOMFORT", "Rappel quotidien": "Tägliche Erinnerung", "Chaque jour à 19:00": "Jeden Tag um 19:00 Uhr", "Réduire les animations": "Bewegung reduzieren", "Limite les mouvements et les célébrations": "Reduziert Bewegungen und Feieranimationen", "Taille du texte": "Textgröße", "Standard": "Standard", "AIDE": "HILFE", "Revoir la visite guidée": "Einführung erneut ansehen", "Thimoli te présente chaque espace": "Thimoli zeigt dir jeden Bereich", "COMPTE": "KONTO", "Compte et confidentialité": "Konto und Datenschutz", "Aide et retours": "Hilfe und Feedback", "Prototype interactif": "Interaktiver Prototyp", "Retour au profil": "Zurück zum Profil", "Thème de l’application": "App-Design", "Navigation principale": "Hauptnavigation",
    "Conseil de Thimoli": "Thimolis Tipp", "Bien joué": "Gut gemacht", "Bonne réponse": "Richtige Antwort", "Exact !": "Genau!", "Correction utile": "Hilfreiche Korrektur", "Ton indice": "Dein Hinweis", "Objectif :": "Ziel:", "Prends ton temps : écoute le son, puis choisis ta réponse.": "Lass dir Zeit: Höre den Laut an und wähle dann deine Antwort.", "Réponds sans te presser. À la fin, tu verras genau, wo du stehst.": "Antworte in Ruhe. Am Ende siehst du genau, wo du stehst.", "Lis et écoute en tamoul": "Auf Tamil lesen und anhören", "Lis le mot ou la phrase en tamoul": "Lies das tamilische Wort oder den Satz", "Lis le sens, puis retrouve le tamoul": "Lies die Bedeutung und finde das Tamilische", "Que signifie cet élément ?": "Was bedeutet das?", "Quel mot ou expression tamoule correspond ?": "Welches tamilische Wort passt?", "Qu’as-tu entendu ?": "Was hast du gehört?", "Choisis une réponse": "Wähle eine Antwort", "Indice": "Hinweis", "Indice affiché": "Hinweis angezeigt", "Voir un indice": "Hinweis anzeigen", "Vérifier": "Prüfen", "À retenir": "Merksatz", "CE QU’IL FAUT RETENIR": "DAS SOLLTEST DU DIR MERKEN", "Exemple :": "Beispiel:", "Continuer": "Weiter", "On apprend de chaque essai": "Jeder Versuch hilft dir beim Lernen", "Réécouter et réessayer": "Noch einmal anhören", "Un seul cœur a été utilisé pour cette question.": "Für diese Frage wurde nur ein Herz verwendet.",
    "Les cœurs protègent ton rythme": "Herzen schützen dein Lerntempo", "Ils t’encouragent à prendre le temps de comprendre, sans te punir.": "Sie helfen dir, dir Zeit zum Verstehen zu nehmen, ohne dich zu bestrafen.", "Les trois premiers essais incorrects ne coûtent rien.": "Die ersten drei falschen Versuche kosten nichts.", "Un cœur est utilisé seulement à partir de la quatrième erreur.": "Erst ab dem vierten Fehler wird ein Herz verbraucht.", "Tu ne peux perdre qu’un cœur par question.": "Du kannst pro Frage nur ein Herz verlieren.", "Dans ce prototype, tu peux continuer à apprendre même à 0 cœur.": "In diesem Prototyp kannst du auch mit 0 Herzen weiterlernen.", "J’ai compris": "Verstanden", "Comment le débloquer ?": "Wie wird es freigeschaltet?", "Passer": "Überspringen", "VISITE GUIDÉE": "EINFÜHRUNG", "Commencer l’aventure": "Lernreise starten", "Suivant": "Weiter",
    "Village des Premiers Pas": "Dorf der ersten Schritte", "Les bases du tamoul": "Grundlagen des Tamilischen", "Village de la Mer": "Meeresdorf", "Les mots du quotidien": "Wörter für den Alltag", "Village du Temple": "Tempeldorf", "La famille et les proches": "Familie und Verwandte", "Village des Rizières": "Reisfelddorf", "La nourriture et la nature": "Essen und Natur", "Village du Marché": "Marktdorf", "Les achats et les prix": "Einkaufen und Preise", "Village du Savoir": "Dorf des Wissens", "L’école et le travail": "Schule und Arbeit", "Village des Fêtes": "Festdorf", "La culture et les traditions": "Kultur und Traditionen", "Village des Collines": "Hügeldorf", "Les voyages et les lieux": "Reisen und Orte", "Village de la Ville": "Stadtdorf", "La vie en ville": "Leben in der Stadt", "Village des Horizons": "Dorf der Horizonte", "Les projets et le futur": "Pläne und Zukunft", "Village de la Sagesse": "Dorf der Weisheit", "Les idées et les émotions": "Gedanken und Gefühle", "Village du Maître": "Dorf der Meisterschaft", "La maîtrise du tamoul": "Sichere Tamilkenntnisse",
    "maman": "Mutter", "papa": "Vater", "grand frère": "älterer Bruder", "grande sœur": "ältere Schwester", "petit frère": "jüngerer Bruder", "petite sœur": "jüngere Schwester", "famille": "Familie", "maison": "Haus", "tête": "Kopf", "œil": "Auge", "oreille": "Ohr", "nez": "Nase", "bouche": "Mund", "main": "Hand", "jambe / pied": "Bein / Fuß", "cheveux": "Haare", "rouge": "Rot", "bleu": "Blau", "vert": "Grün", "jaune": "Gelb", "blanc": "Weiß", "noir": "Schwarz", "école": "Schule", "livre": "Buch", "stylo": "Stift", "professeur": "Lehrkraft", "élève": "Schüler/in", "leçon": "Lektion", "écrire": "schreiben", "lire / étudier": "lesen / lernen", "Réponds sans te presser. À la fin, tu verras exactement où tu en es.": "Antworte in Ruhe. Am Ende siehst du genau, wo du stehst."
  }
}

Object.assign(interfaceTranslations.en, {
  "Thimoli, ton guide": "Thimoli, your guide",
  "Série et cœurs": "Streak and hearts",
  "Contenu du village": "Village content",
  "Progression dans les douze villages": "Progress across the twelve villages",
  "Retour aux révisions": "Back to review",
  "Fermer la leçon": "Close lesson",
  "Fermer l’exercice": "Close exercise",
  "cœurs restants": "hearts left",
  "LECTURE": "READING",
  "Quel son correspond à cette lettre ?": "Which sound matches this letter?",
  "Choisis la bonne prononciation.": "Choose the correct pronunciation.",
  "Quelle voyelle entends-tu ?": "Which vowel do you hear?",
  "Cette lettre produit quel son court ?": "Which short sound does this letter make?",
  "LANGUE DE L’APPLICATION": "APP LANGUAGE",
  "Écouter la voix naturelle": "Listen to the natural voice"
})

Object.assign(interfaceTranslations.de, {
  "Thimoli, ton guide": "Thimoli, dein Lernbegleiter",
  "Série et cœurs": "Serie und Herzen",
  "Contenu du village": "Inhalt des Dorfes",
  "Progression dans les douze villages": "Fortschritt in den zwölf Dörfern",
  "Retour aux révisions": "Zurück zu den Übungen",
  "Fermer la leçon": "Lektion schließen",
  "Fermer l’exercice": "Übung schließen",
  "cœurs restants": "Herzen übrig",
  "LECTURE": "LESEN",
  "Quel son correspond à cette lettre ?": "Welcher Laut gehört zu diesem Zeichen?",
  "Choisis la bonne prononciation.": "Wähle die richtige Aussprache.",
  "Quelle voyelle entends-tu ?": "Welchen Vokal hörst du?",
  "Cette lettre produit quel son court ?": "Welchen kurzen Laut bildet dieses Zeichen?",
  "LANGUE DE L’APPLICATION": "APP-SPRACHE",
  "Écouter la voix naturelle": "Natürliche Stimme anhören"
})

Object.assign(interfaceTranslations.en, {
  "Écouter le Kural": "Listen to the Kural", "Dix pensées à lire, écouter et mémoriser.": "Ten reflections to read, hear and memorise.", "LECTURE": "READ", "Choisis un Kural": "Choose a Kural", "Lu": "Read", "lus": "read",
  "Entraîne tes compétences et prépare tes examens.": "Practise your skills and prepare for your assessments.", "ATELIERS": "PRACTICE", "Que veux-tu travailler ?": "What would you like to practise?", "Écouter et parler": "Listen and speak",
  "Reprends l’essentiel, puis teste-toi.": "Review the essentials, then test yourself.", "CONSEIL DE THIMOLI": "THIMOLI’S TIP", "Commence par l’essentiel": "Start with the essentials", "L’alphabet est le meilleur point de départ pour une révision courte et utile.": "The alphabet is the best place to start a short, useful review.", "Choisis une compétence": "Choose a skill", "EXAMENS": "ASSESSMENTS", "Teste ton niveau": "Test your level", "Niveau précédent": "Previous level", "Niveau suivant": "Next level", "Un examen de révision ne modifie jamais ta progression.": "A practice assessment never changes your progress.", "12 voyelles · 18 consonnes": "12 vowels · 18 consonants", "6 contrastes essentiels": "6 essential contrasts", "12 niveaux progressifs": "12 progressive levels", "4 thèmes disponibles": "4 available themes", "Mémoriser les mots utiles": "Memorise useful words",
  "Je te propose un atelier ciblé pour renforcer ce qui a été difficile.": "Here is a focused activity to strengthen what felt difficult.", "Ouvrir Alphabet": "Open Alphabet", "Ouvrir Prononciation": "Open Pronunciation", "Ouvrir Écriture": "Open Writing", "Ouvrir Vocabulaire": "Open Vocabulary",
  "Mode aperçu : toutes les étapes sont ouvertes pour te permettre de tester le village.": "Preview mode: every step is open so you can test the village.", "Mode aperçu : tous les examens sont temporairement ouverts.": "Preview mode: every assessment is temporarily open.",
  "Observe et mémorise les signes essentiels.": "Observe and memorise the essential characters.", "Voyelle": "Vowel", "Consonne": "Consonant", "EXEMPLE": "EXAMPLE", "REPÈRE": "GUIDE", "Il complète les 12 voyelles et les 18 consonnes de base.": "It completes the 12 vowels and 18 basic consonants.", "Commence par reconnaître la forme. La prononciation se travaille dans l’atelier vocal.": "Start by recognising the shape. Practise pronunciation in the speaking activity.",
  "Écoute, compare et entraîne chaque son.": "Listen, compare and practise each sound.", "ÉCOUTE LA DIFFÉRENCE": "HEAR THE DIFFERENCE", "MODÈLE À RÉPÉTER": "MODEL TO REPEAT", "Écoute le mot": "Listen to the word", "Son à travailler": "Sound to practise", "Court": "Short", "Long": "Long", "Écoute le modèle, puis répète trois fois : lentement, normalement et sans regarder.": "Listen to the model, then repeat it three times: slowly, normally and without looking.",
  "Des lettres aux phrases, village après village.": "From characters to sentences, village by village.", "Niveaux d’écriture": "Writing levels", "Premières combinaisons": "First combinations", "Mots simples": "Simple words", "Famille et maison": "Family and home", "Objets familiers": "Everyday objects", "Monde vivant": "The living world", "Vie scolaire": "School life", "Apprendre et travailler": "Learning and work", "Fêtes et traditions": "Festivals and traditions", "Lieux et directions": "Places and directions", "Mots plus développés": "Longer words", "Mes projets": "My plans", "Courtes expressions": "Short expressions", "Mes idées": "My thoughts", "Émotions et réflexion": "Emotions and reflection", "Phrases complètes": "Complete sentences", "Élément précédent": "Previous item", "Élément suivant": "Next item", "Le niveau 1 couvre tout l’alphabet. Les niveaux suivants ajoutent syllabes, mots et phrases.": "Level 1 covers the full alphabet. Later levels add syllables, words and sentences."
})

Object.assign(interfaceTranslations.de, {
  "Écouter le Kural": "Kural anhören", "Dix pensées à lire, écouter et mémoriser.": "Zehn Gedanken zum Lesen, Anhören und Auswendiglernen.", "LECTURE": "LESEN", "Choisis un Kural": "Wähle einen Kural", "Lu": "Gelesen", "lus": "gelesen",
  "Entraîne tes compétences et prépare tes examens.": "Trainiere deine Fähigkeiten und bereite dich auf Prüfungen vor.", "ATELIERS": "ÜBUNGEN", "Que veux-tu travailler ?": "Was möchtest du üben?", "Écouter et parler": "Hören und sprechen",
  "Reprends l’essentiel, puis teste-toi.": "Wiederhole das Wichtigste und teste dich danach.", "CONSEIL DE THIMOLI": "THIMOLIS TIPP", "Commence par l’essentiel": "Beginne mit den Grundlagen", "L’alphabet est le meilleur point de départ pour une révision courte et utile.": "Das Alphabet ist der beste Einstieg für eine kurze, sinnvolle Wiederholung.", "Choisis une compétence": "Wähle eine Fähigkeit", "EXAMENS": "PRÜFUNGEN", "Teste ton niveau": "Teste deine Stufe", "Niveau précédent": "Vorherige Stufe", "Niveau suivant": "Nächste Stufe", "Un examen de révision ne modifie jamais ta progression.": "Eine Übungsprüfung verändert deinen Lernfortschritt nicht.", "12 voyelles · 18 consonnes": "12 Vokale · 18 Konsonanten", "6 contrastes essentiels": "6 wichtige Lautpaare", "12 niveaux progressifs": "12 aufeinander aufbauende Stufen", "4 thèmes disponibles": "4 verfügbare Themen", "Mémoriser les mots utiles": "Nützliche Wörter einprägen",
  "Je te propose un atelier ciblé pour renforcer ce qui a été difficile.": "Hier ist eine gezielte Übung für das, was dir noch schwerfällt.", "Ouvrir Alphabet": "Alphabet öffnen", "Ouvrir Prononciation": "Aussprache öffnen", "Ouvrir Écriture": "Schreiben öffnen", "Ouvrir Vocabulaire": "Wortschatz öffnen",
  "Mode aperçu : toutes les étapes sont ouvertes pour te permettre de tester le village.": "Vorschaumodus: Alle Schritte sind geöffnet, damit du das Dorf testen kannst.", "Mode aperçu : tous les examens sont temporairement ouverts.": "Vorschaumodus: Alle Prüfungen sind vorübergehend geöffnet.",
  "Observe et mémorise les signes essentiels.": "Betrachte und merke dir die wichtigsten Zeichen.", "Voyelle": "Vokal", "Consonne": "Konsonant", "EXEMPLE": "BEISPIEL", "REPÈRE": "HINWEIS", "Il complète les 12 voyelles et les 18 consonnes de base.": "Es ergänzt die 12 Vokale und 18 Grundkonsonanten.", "Commence par reconnaître la forme. La prononciation se travaille dans l’atelier vocal.": "Erkenne zuerst die Form. Die Aussprache übst du im Sprechtraining.",
  "Écoute, compare et entraîne chaque son.": "Höre zu, vergleiche und übe jeden Laut.", "ÉCOUTE LA DIFFÉRENCE": "HÖRE DEN UNTERSCHIED", "MODÈLE À RÉPÉTER": "MODELL ZUM NACHSPRECHEN", "Écoute le mot": "Höre das Wort", "Son à travailler": "Laut zum Üben", "Court": "Kurz", "Long": "Lang", "Écoute le modèle, puis répète trois fois : lentement, normalement et sans regarder.": "Höre das Beispiel an und sprich es dreimal nach: langsam, normal und ohne hinzusehen.",
  "Des lettres aux phrases, village après village.": "Von Zeichen zu Sätzen, Dorf für Dorf.", "Niveaux d’écriture": "Schreibstufen", "Premières combinaisons": "Erste Kombinationen", "Mots simples": "Einfache Wörter", "Famille et maison": "Familie und Zuhause", "Objets familiers": "Alltagsgegenstände", "Monde vivant": "Lebendige Welt", "Vie scolaire": "Schulalltag", "Apprendre et travailler": "Lernen und Arbeiten", "Fêtes et traditions": "Feste und Traditionen", "Lieux et directions": "Orte und Richtungen", "Mots plus développés": "Längere Wörter", "Mes projets": "Meine Pläne", "Courtes expressions": "Kurze Ausdrücke", "Mes idées": "Meine Gedanken", "Émotions et réflexion": "Gefühle und Reflexion", "Phrases complètes": "Vollständige Sätze", "Élément précédent": "Vorheriges Element", "Élément suivant": "Nächstes Element", "Le niveau 1 couvre tout l’alphabet. Les niveaux suivants ajoutent syllabes, mots et phrases.": "Stufe 1 umfasst das gesamte Alphabet. Danach folgen Silben, Wörter und Sätze."
})

Object.assign(interfaceTranslations.en, {
  "PROCHAINE MINI-LEÇON": "NEXT MINI LESSON", "PROCHAIN EXERCICE": "NEXT EXERCISE", "ÉVALUATION FINALE": "FINAL ASSESSMENT", "VILLAGE TERMINÉ": "VILLAGE COMPLETED", "Revoir le parcours": "Review the path", "Rejoue l’évaluation ou choisis librement une étape.": "Retake the assessment or choose any step.", "Rejouer": "Retake",
  "Lire": "Read", "Lu ✓": "Read ✓", "Texte en cours de chargement…": "Text is loading…",
  "Tes progrès réels, sans chiffres inventés.": "Your real progress, with no made-up figures.", "Ton objectif est atteint. Tu peux maintenant consolider un point difficile.": "You reached today’s goal. You can now strengthen a difficult point.", "Une courte session suffit pour garder ton rythme.": "A short session is enough to keep your momentum.", "TON HISTOIRE COMMENCE ICI": "YOUR STORY STARTS HERE", "Aucune statistique pour l’instant": "No statistics yet", "Termine une première leçon : ton temps, tes réponses et tes progrès apparaîtront ici.": "Complete your first lesson and your time, answers and progress will appear here.", "Commencer une leçon": "Start a lesson", "Chiffres clés": "Key figures", "7 derniers jours": "Last 7 days", "minutes apprises": "minutes learned", "Réponses": "Answers", "précision à venir": "accuracy coming soon", "Sessions": "Sessions", "À CONSOLIDER": "TO REVIEW", "PROCHAINE ÉTAPE": "NEXT STEP", "Garde ton rythme": "Keep your momentum", "Retrouve les ateliers et les examens sans perdre ta progression.": "Use the workshops and assessments without losing your progress.", "Choisis un atelier court pour continuer à progresser.": "Choose a short activity to keep progressing.",
  "VILLAGE EN COURS": "CURRENT VILLAGE", "MA COLLECTION": "MY COLLECTION", "Mes réussites": "My achievements", "Ton premier badge t’attend": "Your first badge is waiting", "Termine une session pour commencer ta collection.": "Complete a session to start your collection.", "Premier pas": "First step", "1 session terminée": "1 completed session", "Premiers signes": "First characters", "Village exploré": "Village explored",
  "Cette V1 conserve uniquement les réglages réellement fonctionnels.": "This V1 only includes settings that actually work.", "POUR ALLER PLUS LOIN": "GO A LITTLE FURTHER", "LA BONNE RÉPONSE": "THE CORRECT ANSWER", "Exact !": "Exactly!", "Tu construis de bons réflexes. Regarde maintenant pourquoi cette réponse fonctionne.": "You are building strong habits. Now see why this answer works.", "On reprend calmement.": "Let’s take it calmly.", "Relis l’explication, puis essaie une nouvelle fois.": "Read the explanation, then try again.", "Pas encore.": "Not yet.", "Compare ta réponse avec la correction avant de réessayer.": "Compare your answer with the correction before trying again."
})

Object.assign(interfaceTranslations.de, {
  "PROCHAINE MINI-LEÇON": "NÄCHSTE MINI-LEKTION", "PROCHAIN EXERCICE": "NÄCHSTE ÜBUNG", "ÉVALUATION FINALE": "ABSCHLUSSPRÜFUNG", "VILLAGE TERMINÉ": "DORF ABGESCHLOSSEN", "Revoir le parcours": "Lernweg wiederholen", "Rejoue l’évaluation ou choisis librement une étape.": "Wiederhole die Prüfung oder wähle einen beliebigen Schritt.", "Rejouer": "Wiederholen",
  "Lire": "Lesen", "Lu ✓": "Gelesen ✓", "Texte en cours de chargement…": "Text wird geladen…",
  "Tes progrès réels, sans chiffres inventés.": "Dein echter Fortschritt, ohne erfundene Werte.", "Ton objectif est atteint. Tu peux maintenant consolider un point difficile.": "Du hast dein Tagesziel erreicht und kannst jetzt einen schwierigen Punkt festigen.", "Une courte session suffit pour garder ton rythme.": "Eine kurze Einheit reicht, um im Rhythmus zu bleiben.", "TON HISTOIRE COMMENCE ICI": "DEINE GESCHICHTE BEGINNT HIER", "Aucune statistique pour l’instant": "Noch keine Statistiken", "Termine une première leçon : ton temps, tes réponses et tes progrès apparaîtront ici.": "Schließe deine erste Lektion ab; dann erscheinen hier Lernzeit, Antworten und Fortschritt.", "Commencer une leçon": "Lektion beginnen", "Chiffres clés": "Kennzahlen", "7 derniers jours": "Letzte 7 Tage", "minutes apprises": "Lernminuten", "Réponses": "Antworten", "précision à venir": "Genauigkeit folgt", "Sessions": "Einheiten", "À CONSOLIDER": "ZU FESTIGEN", "PROCHAINE ÉTAPE": "NÄCHSTER SCHRITT", "Garde ton rythme": "Bleib im Rhythmus", "Retrouve les ateliers et les examens sans perdre ta progression.": "Nutze Übungen und Prüfungen, ohne deinen Fortschritt zu verlieren.", "Choisis un atelier court pour continuer à progresser.": "Wähle eine kurze Übung, um weiterzukommen.",
  "VILLAGE EN COURS": "AKTUELLES DORF", "MA COLLECTION": "MEINE SAMMLUNG", "Mes réussites": "Meine Erfolge", "Ton premier badge t’attend": "Dein erstes Abzeichen wartet", "Termine une session pour commencer ta collection.": "Schließe eine Einheit ab, um deine Sammlung zu beginnen.", "Premier pas": "Erster Schritt", "1 session terminée": "1 abgeschlossene Einheit", "Premiers signes": "Erste Zeichen", "Village exploré": "Dorf erkundet",
  "Cette V1 conserve uniquement les réglages réellement fonctionnels.": "Diese V1 enthält nur Einstellungen, die tatsächlich funktionieren.", "POUR ALLER PLUS LOIN": "NOCH EIN SCHRITT WEITER", "LA BONNE RÉPONSE": "DIE RICHTIGE ANTWORT", "Exact !": "Genau!", "Tu construis de bons réflexes. Regarde maintenant pourquoi cette réponse fonctionne.": "Du entwickelst gute Lerngewohnheiten. Sieh dir nun an, warum diese Antwort stimmt.", "On reprend calmement.": "Wir gehen es in Ruhe an.", "Relis l’explication, puis essaie une nouvelle fois.": "Lies die Erklärung und versuche es erneut.", "Pas encore.": "Noch nicht.", "Compare ta réponse avec la correction avant de réessayer.": "Vergleiche deine Antwort mit der Korrektur und versuche es erneut."
})

const translationPatterns = {
  en: [
    [/^(\d+) réponses à consolider$/, "$1 answers to review"], [/^(\d+) réponses à retravailler$/, "$1 answers to review"], [/^(\d+)% du parcours terminé$/, "$1% of the path completed"], [/^(\d+) min pour le réussir$/, "$1 min to reach it"], [/^(\d+) minutes d’apprentissage$/, "$1 minutes of learning"], [/^(\d+)% correctes$/, "$1% correct"], [/^Étape (\d+) sur (\d+)$/, "Step $1 of $2"], [/^(\d+)\/12 terminé(?:s)?$/, "$1/12 completed"],
    [/^NIVEAU (\d+) SUR (\d+)$/, "LEVEL $1 OF $2"], [/^NIVEAU (\d+)$/, "LEVEL $1"], [/^ÉTAPE (\d+)$/, "STEP $1"], [/^CHAPITRE (\d+)$/, "CHAPTER $1"], [/^Chapitre (\d+)$/, "Chapter $1"], [/^QUESTION (\d+)\/(\d+)$/, "QUESTION $1/$2"], [/^Tu as choisi « (.+) »\. Voici le point clé à garder en mémoire\.$/, "You chose “$1”. Here is the key point to remember."], [/^(.+) signifie « (.+) »\.$/, "$1 means “$2”."], [/^(.+) correspond à « (.+) »\.$/, "$1 means “$2”."], [/^Prononciation simplifiée : « (.+) »\.$/, "Simple pronunciation: “$1”."], [/^(\d+) jours?$/, (_, n) => `${n} ${n === "1" ? "day" : "days"}`], [/^(\d+) leçons?$/, (_, n) => `${n} ${n === "1" ? "lesson" : "lessons"}`], [/^(\d+) exercices$/, "$1 exercises"], [/^(\d+) évaluation$/, "$1 assessment"], [/^(\d+) étapes? restantes?$/, (_, n) => `${n} ${n === "1" ? "step" : "steps"} left`], [/^(\d+)% terminé$/, "$1% complete"], [/^(\d+) minutes par jour$/, "$1 minutes a day"], [/^(\d+) minutes$/, "$1 minutes"], [/^(\d+) jours? actifs?$/, (_, n) => `${n} ${n === "1" ? "active day" : "active days"}`], [/^(\d+) villages terminés$/, "$1 villages completed"], [/^(\d+) niveaux$/, "$1 levels"], [/^(\d+) outils$/, "$1 tools"], [/^(\d+) voyelles$/, "$1 vowels"], [/^(\d+) consonnes$/, "$1 consonants"], [/^(\d+) mots$/, "$1 words"], [/^(\d+) cartes$/, "$1 cards"], [/^(\d+) questions$/, "$1 questions"], [/^Encore (\d+) leçons$/, "$1 lessons left"], [/^Question (\d+) sur (\d+)$/, "Question $1 of $2"], [/^(\d+) % du village terminé$/, "$1% of the village completed"], [/^(\d+) % du sentier terminé$/, "$1% of the path completed"]
  ],
  de: [
    [/^(\d+) réponses à consolider$/, "$1 Antworten zum Wiederholen"], [/^(\d+) réponses à retravailler$/, "$1 Antworten zum Wiederholen"], [/^(\d+)% du parcours terminé$/, "$1% des Lernwegs abgeschlossen"], [/^(\d+) min pour le réussir$/, "Noch $1 Min. bis zum Ziel"], [/^(\d+) minutes d’apprentissage$/, "$1 Lernminuten"], [/^(\d+)% correctes$/, "$1% richtig"], [/^Étape (\d+) sur (\d+)$/, "Schritt $1 von $2"], [/^(\d+)\/12 terminé(?:s)?$/, "$1/12 abgeschlossen"],
    [/^NIVEAU (\d+) SUR (\d+)$/, "STUFE $1 VON $2"], [/^NIVEAU (\d+)$/, "STUFE $1"], [/^ÉTAPE (\d+)$/, "SCHRITT $1"], [/^CHAPITRE (\d+)$/, "KAPITEL $1"], [/^Chapitre (\d+)$/, "Kapitel $1"], [/^QUESTION (\d+)\/(\d+)$/, "FRAGE $1/$2"], [/^Tu as choisi « (.+) »\. Voici le point clé à garder en mémoire\.$/, "Du hast „$1“ gewählt. Diesen Punkt solltest du dir merken."], [/^(.+) signifie « (.+) »\.$/, "$1 bedeutet „$2“."], [/^(.+) correspond à « (.+) »\.$/, "$1 bedeutet „$2“."], [/^Prononciation simplifiée : « (.+) »\.$/, "Einfache Aussprache: „$1“."], [/^(\d+) jours?$/, (_, n) => `${n} ${n === "1" ? "Tag" : "Tage"}`], [/^(\d+) leçons?$/, (_, n) => `${n} ${n === "1" ? "Lektion" : "Lektionen"}`], [/^(\d+) exercices$/, "$1 Übungen"], [/^(\d+) évaluation$/, "$1 Prüfung"], [/^(\d+) étapes? restantes?$/, (_, n) => `${n} ${n === "1" ? "Schritt" : "Schritte"} übrig`], [/^(\d+)% terminé$/, "$1% abgeschlossen"], [/^(\d+) minutes par jour$/, "$1 Minuten pro Tag"], [/^(\d+) minutes$/, "$1 Minuten"], [/^(\d+) jours? actifs?$/, (_, n) => `${n} ${n === "1" ? "aktiver Tag" : "aktive Tage"}`], [/^(\d+) villages terminés$/, "$1 Dörfer abgeschlossen"], [/^(\d+) niveaux$/, "$1 Stufen"], [/^(\d+) outils$/, "$1 Werkzeuge"], [/^(\d+) voyelles$/, "$1 Vokale"], [/^(\d+) consonnes$/, "$1 Konsonanten"], [/^(\d+) mots$/, "$1 Wörter"], [/^(\d+) cartes$/, "$1 Karten"], [/^(\d+) questions$/, "$1 Fragen"], [/^Encore (\d+) leçons$/, "Noch $1 Lektionen"], [/^Question (\d+) sur (\d+)$/, "Frage $1 von $2"], [/^(\d+) % du village terminé$/, "$1% des Dorfes abgeschlossen"], [/^(\d+) % du sentier terminé$/, "$1% des Pfades abgeschlossen"]
  ]
}

for (const [fr, en, de] of [...(window.THIMOLI_UI_UPDATES || []), ...(window.THIMOLI_EXERCISE_TRANSLATIONS || [])]) {
  interfaceTranslations.en[fr] = en
  interfaceTranslations.de[fr] = de
}
translationPatterns.en.push(
  [/^VILLAGE (\d+)(.*)$/, 'VILLAGE $1$2'], [/^QUÊTE (\d+)$/, 'QUEST $1'],
  [/^Quête (\d+) sur (\d+)$/, 'Quest $1 of $2'], [/^(\d+)\/(\d+) quêtes parcourues$/, '$1/$2 quests completed'],
  [/^(\d+)\/(\d+) étapes parcourues$/, '$1/$2 steps completed'], [/^(\d+)% du village parcouru$/, '$1% of the village completed'],
  [/^LEÇON (\d+)\/(\d+)$/, 'LESSON $1/$2'], [/^(\d+)\/(\d+) ACTIVITÉS$/, '$1/$2 ACTIVITIES'],
  [/^Activité (\d+) sur (\d+)$/, 'Activity $1 of $2'], [/^(\d+) cœurs restants$/, '$1 hearts remaining'],
  [/^(\d+)\/(\d+) liens créés\. Les mêmes numéros indiquent tes associations\.$/, '$1/$2 matches made. Matching numbers show your pairs.'],
  [/^Carte (\d+), face cachée$/, 'Card $1, face down']
)
translationPatterns.de.push(
  [/^VILLAGE (\d+)(.*)$/, 'DORF $1$2'], [/^QUÊTE (\d+)$/, 'MISSION $1'],
  [/^Quête (\d+) sur (\d+)$/, 'Mission $1 von $2'], [/^(\d+)\/(\d+) quêtes parcourues$/, '$1/$2 Missionen abgeschlossen'],
  [/^(\d+)\/(\d+) étapes parcourues$/, '$1/$2 Schritte abgeschlossen'], [/^(\d+)% du village parcouru$/, '$1% des Dorfes abgeschlossen'],
  [/^LEÇON (\d+)\/(\d+)$/, 'LEKTION $1/$2'], [/^(\d+)\/(\d+) ACTIVITÉS$/, '$1/$2 AUFGABEN'],
  [/^Activité (\d+) sur (\d+)$/, 'Aufgabe $1 von $2'], [/^(\d+) cœurs restants$/, '$1 Herzen übrig'],
  [/^(\d+)\/(\d+) liens créés\. Les mêmes numéros indiquent tes associations\.$/, '$1/$2 Paare zugeordnet. Gleiche Zahlen zeigen deine Zuordnungen.'],
  [/^Carte (\d+), face cachée$/, 'Karte $1, verdeckt']
)
for (const language of ['en','de']) {
  const tr = text => translateUiText(text, language);
  translationPatterns[language].unshift(
    [/^Retrouve (la phrase|le mot) étudié : « (.+) »\.$/, (_,kind,meaning) => language==='en' ? `Recreate the ${kind==='la phrase'?'sentence':'word'} you studied: “${tr(meaning)}”.` : `Bilde ${kind==='la phrase'?'den gelernten Satz':'das gelernte Wort'}: „${tr(meaning)}“.`],
    [/^Quel signe correspond à « (.+) » \?$/, (_,meaning) => language==='en' ? `Which character represents “${tr(meaning)}”?` : `Welches Schriftzeichen steht für „${tr(meaning)}“?`],
    [/^Complète le modèle étudié : « (.+) »\.$/, (_,meaning) => language==='en' ? `Complete the example you studied: “${tr(meaning)}”.` : `Vervollständige das gelernte Beispiel: „${tr(meaning)}“.`],
    [/^Le modèle commence par « (.+) »\.$/, (_,text) => language==='en' ? `The example starts with “${text}”.` : `Das Beispiel beginnt mit „${text}“.`],
    [/^([\u0B80-\u0BFF\s]+) : (.+)\.$/, (_,ta,meaning) => `${ta}: ${tr(meaning)}.`]
  );
}
function translateUiText(value, language = state?.settings?.language || "fr") {
  if (!value || language === "fr" || !interfaceTranslations[language]) return value
  const leading = value.match(/^\s*/)?.[0] || ""
  const trailing = value.match(/\s*$/)?.[0] || ""
  const source = value.trim()
  if (!source) return value
  let translated = interfaceTranslations[language][source]
  if (!translated) {
    for (const [pattern, replacement] of translationPatterns[language] || []) {
      if (pattern.test(source)) { translated = source.replace(pattern, replacement); break }
    }
  }
  if (!translated) {
    translated = source
    const fragments = Object.entries(interfaceTranslations[language]).filter(([from]) => from.length >= 8).sort((a, b) => b[0].length - a[0].length)
    for (const [from, to] of fragments) translated = translated.split(from).join(to)
  }
  return `${leading}${translated}${trailing}`
}

function translateRenderedInterface(root = app) {
  const language = state.settings.language
  if (language === "fr") return
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT)
  const textNodes = []
  while (walker.nextNode()) {
    const node = walker.currentNode
    const parent = node.parentElement
    if (!parent || parent.closest('[lang="ta"], script, style')) continue
    textNodes.push(node)
  }
  textNodes.forEach((node) => { node.nodeValue = translateUiText(node.nodeValue, language) })
  root.querySelectorAll("[aria-label], [title], [placeholder], [alt]").forEach((element) => {
    for (const attribute of ["aria-label", "title", "placeholder", "alt"]) {
      if (element.hasAttribute(attribute)) element.setAttribute(attribute, translateUiText(element.getAttribute(attribute), language))
    }
  })
}
let storageSaveFailed = false
let kuralVerses = []
let kuralChapters = []
let naturalAudioItems = {...(window.THIMOLI_SPEECH_AUDIO || {}), ...(window.THIMOLI_ALPHABET_AUDIO || {})}
let audioNoticeText = ""
let audioRequestId = 0
let audioLoadTimer = null
let audioPlayback = {status:'idle', text:'', source:''}
let kuralLoadState = "loading"
let activeTamilAudio = null
let kuralPhonetics = []

function loadSavedState() {
  try {
    const value = JSON.parse(localStorage.getItem(STORAGE_KEY))
    return value && typeof value === "object" ? value : {}
  } catch (error) { return {} }
}
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)) }
function safeArray(value) { return Array.isArray(value) ? value : [] }

const saved = loadSavedState()
const initialParams = new URLSearchParams(location.search)
// Mode de démonstration temporaire demandé pour parcourir l'intégralité du prototype.
const PREVIEW_UNLOCK_ALL = window.THIMOLI_RELEASE?.unlockAll === true
const requestedPage = initialParams.get("page")
const requestedKuralView = ["home", "list", "chapter", "detail"].includes(initialParams.get("view")) ? initialParams.get("view") : "home"
const requestedKuralPart = kuralParts.some((part) => part.id === initialParams.get("part")) ? initialParams.get("part") : null
const requestedKuralNumber = Number(initialParams.get("kural"))
const requestedKuralChapter = Number(initialParams.get("chapter"))
const initialPage = validPages.includes(requestedPage) ? requestedPage : validPages.includes(saved.page) ? saved.page : "review"
const savedProgress = villages.map((village, index) => {
  const value = safeArray(saved.lessonProgress)[index]
  return Number.isFinite(value) ? clamp(Math.round(value), 0, 10) : defaultProgress[index]
})
const savedPathProgress = villages.map((village, index) => {
  const value = safeArray(saved.pathProgress)[index]
  if (Number.isFinite(value)) return clamp(Math.round(value), 0, PATH_NODE_COUNT)
  return savedProgress[index] >= 10 ? PATH_NODE_COUNT : Math.min(PATH_NODE_COUNT - 1, savedProgress[index] * 4)
})
const prefersReducedMotion = Boolean(window.matchMedia?.("(prefers-reduced-motion: reduce)").matches)
const state = {
  page: initialPage,
  currentVillage: Number.isInteger(saved.currentVillage) ? clamp(saved.currentVillage, 0, 11) : 0,
  lesson: saved.learningVersion === learning.version && Number.isInteger(saved.lesson) ? clamp(saved.lesson, 0, MAX_QUESTION_COUNT) : 0,
  lessonMode: validLessonModes.includes(saved.lessonMode) ? saved.lessonMode : "parcours",
  lessonProgress: savedProgress,
  pathProgress: savedPathProgress,
  activePathNode: Number.isInteger(saved.activePathNode) ? clamp(saved.activePathNode, 0, PATH_NODE_COUNT - 1) : null,
  examKind: ["mock", "final"].includes(saved.examKind) ? saved.examKind : null,
  examVillage: Number.isInteger(saved.examVillage) ? clamp(saved.examVillage, 0, 11) : null,
  kuralIndex: requestedPage === "kural" && Number.isInteger(requestedKuralNumber) && requestedKuralNumber >= 1 && requestedKuralNumber <= 1330 ? requestedKuralNumber - 1 : Number.isInteger(saved.kuralIndex) ? clamp(saved.kuralIndex, 0, 1329) : 0,
  kuralChapter: requestedPage === "kural" && Number.isInteger(requestedKuralChapter) && requestedKuralChapter >= 1 && requestedKuralChapter <= 133 ? requestedKuralChapter - 1 : Number.isInteger(saved.kuralChapter) ? clamp(saved.kuralChapter, 0, 132) : 0,
  kuralPart: requestedKuralPart || (kuralParts.some((part) => part.id === saved.kuralPart) ? saved.kuralPart : "aram"),
  kuralView: requestedPage === "kural" ? requestedKuralView : "home",
  kuralIntroExpanded: false,
  villagePractice: Object.fromEntries(Object.entries(saved.villagePractice || {}).filter(([key,value]) => /^\d+:\d+$/.test(key) && value && Number.isFinite(value.best) && Number.isFinite(value.last))),
  kuralPractice: restoreKuralPractice(saved.kuralPractice),
  kuralRecall: Object.fromEntries(Object.entries(saved.kuralRecall || {}).filter(([key, value]) => /^\d+$/.test(key) && Number(key) < 1330 && ['recited', 'review'].includes(value))),
  kuralStudyStep: Number.isInteger(saved.kuralStudyStep) ? clamp(saved.kuralStudyStep, 0, 4) : 0,
  kuralMastered: safeArray(saved.kuralMastered).filter((index) => Number.isInteger(index) && index >= 0 && index < 1330),
  onboardingSeen: saved.onboardingSeen === true,
  tourStep: 0,
  completedSessions: Number.isInteger(saved.completedSessions) && saved.completedSessions >= 0 ? saved.completedSessions : 0,
  streak: Number.isInteger(saved.streak) && saved.streak >= 0 ? saved.streak : 0,
  lives: Number.isInteger(saved.lives) ? clamp(saved.lives, 0, 5) : 4,
  selected: null, feedback: saved.learningVersion === learning.version ? saved.activityState?.feedback || null : null, showHint: false, questionAttempts: saved.learningVersion === learning.version ? saved.activityState?.attempts || 0 : 0, heartLostThisQuestion: saved.learningVersion === learning.version && saved.activityState?.heartLost === true, modal: null,
  activityResponse: saved.learningVersion === learning.version ? restoreVillageResponse(saved.activityState?.response) : null,
  studyStarted: saved.learningVersion === learning.version && saved.activityState?.studyStarted === true,
  writingDrafts: saved.writingDrafts && typeof saved.writingDrafts === "object" ? saved.writingDrafts : {},
  foundationVisits: [...new Set(safeArray(saved.foundationVisits).filter((name) => reviewItems.some((item) => item.name === name)))],
  foundationProgress: Object.fromEntries(Object.entries(saved.foundationProgress || {}).filter(([id,value]) => /^q([1-9]|1[0-8])$/.test(id) && value && [1,2,3].includes(value.stars))),
  foundationRun: restoreFoundationRun(saved.foundationRun),
  matchLeft: null, matchRight: null, matchedPairs: [], matchMistake: null,
  alphabetGroup: ["vowels", "consonants", "syllables"].includes(saved.alphabetGroup) ? saved.alphabetGroup : "vowels",
  alphabetLetter: typeof saved.alphabetLetter === "string" ? saved.alphabetLetter : "அ",
  syllableConsonant: typeof saved.syllableConsonant === "string" ? saved.syllableConsonant : "க்",
  pronunciationIndex: Number.isInteger(saved.pronunciationIndex) ? clamp(saved.pronunciationIndex, 0, pronunciationPairs.length - 1) : 0,
  pronunciationTarget: ["short", "long"].includes(saved.pronunciationTarget) ? saved.pronunciationTarget : "short",
  writingLevel: Number.isInteger(saved.writingLevel) ? clamp(saved.writingLevel, 0, writingCurriculum.length - 1) : 0,
  writingLetterIndex: Number.isInteger(saved.writingLetterIndex) ? Math.max(0, saved.writingLetterIndex) : 0,
  writingGuided: typeof saved.writingGuided === "boolean" ? saved.writingGuided : true,
  writingResult: null,
  writingTraced: safeArray(saved.writingTraced).filter(text => typeof text === 'string').slice(-400),
  vocabularyCategory: vocabularySets.some((set) => set.id === saved.vocabularyCategory) ? saved.vocabularyCategory : "family",
  reviewExamVillage: Number.isInteger(saved.reviewExamVillage) ? clamp(saved.reviewExamVillage, 0, 11) : Number.isInteger(saved.currentVillage) ? clamp(saved.currentVillage, 0, 11) : 2,
  answerHistory: safeArray(saved.answerHistory).filter((entry) => entry && Number.isFinite(entry.timestamp)).slice(-300),
  sessions: safeArray(saved.sessions).filter((entry) => entry && Number.isFinite(entry.timestamp)).slice(-100),
  lessonRun: saved.learningVersion === learning.version && saved.lessonRun && typeof saved.lessonRun === "object" ? saved.lessonRun : null,
  settings: {
    soundEffects: typeof saved.settings?.soundEffects === "boolean" ? saved.settings.soundEffects : true,
    autoPronunciation: typeof saved.settings?.autoPronunciation === "boolean" ? saved.settings.autoPronunciation : true,
    reminders: typeof saved.settings?.reminders === "boolean" ? saved.settings.reminders : true,
    reducedMotion: typeof saved.settings?.reducedMotion === "boolean" ? saved.settings.reducedMotion : prefersReducedMotion,
    dailyGoal: [5, 10, 15, 20].includes(saved.settings?.dailyGoal) ? saved.settings.dailyGoal : 10,
    language: phoneticLanguages.some((language) => language.id === saved.settings?.language) ? saved.settings.language : "fr",
    theme: ["light", "dark", "system"].includes(saved.settings?.theme) ? saved.settings.theme : "light"
  }
}

state.writingLevel = Math.min(state.writingLevel, PREVIEW_UNLOCK_ALL ? writingCurriculum.length - 1 : state.currentVillage)
state.writingLetterIndex = clamp(state.writingLetterIndex, 0, (writingCurriculum[state.writingLevel]?.items.length || 1) - 1)

function isVillageUnlocked(index) { return Number.isInteger(index) && index >= 0 && index < villages.length && (PREVIEW_UNLOCK_ALL || index === 0 || state.pathProgress[index - 1] >= PATH_NODE_COUNT) }
if (!isVillageUnlocked(state.currentVillage)) state.currentVillage = 0
if (state.kuralView === "detail") {
  state.kuralChapter = Math.floor(state.kuralIndex / 10)
  state.kuralPart = kuralPartFor(state.kuralIndex).id
} else if (state.kuralView === "chapter") {
  state.kuralPart = kuralPartFor(state.kuralChapter * 10).id
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      page: state.page, currentVillage: state.currentVillage, lesson: state.lesson, lessonMode: state.lessonMode,
      lessonProgress: state.lessonProgress, pathProgress: state.pathProgress, activePathNode: state.activePathNode,
      examKind: state.examKind, examVillage: state.examVillage,
      learningVersion: learning.version, writingDrafts: state.writingDrafts, foundationVisits: state.foundationVisits,
      foundationProgress: state.foundationProgress, foundationRun: state.foundationRun,
      activityState: { response: state.activityResponse, studyStarted: state.studyStarted, feedback: state.feedback, attempts: state.questionAttempts, heartLost: state.heartLostThisQuestion },
      kuralIndex: state.kuralIndex, kuralChapter: state.kuralChapter, kuralPart: state.kuralPart, kuralView: state.kuralView,
      kuralStudyStep: state.kuralStudyStep, kuralMastered: state.kuralMastered,
      villagePractice: state.villagePractice,
      kuralPractice: state.kuralPractice, kuralRecall: state.kuralRecall,
      alphabetGroup: state.alphabetGroup, alphabetLetter: state.alphabetLetter, syllableConsonant: state.syllableConsonant, pronunciationIndex: state.pronunciationIndex, pronunciationTarget: state.pronunciationTarget,
      writingLevel: state.writingLevel, writingLetterIndex: state.writingLetterIndex, writingGuided: state.writingGuided, vocabularyCategory: state.vocabularyCategory,
      writingTraced: state.writingTraced,
      reviewExamVillage: state.reviewExamVillage,
      onboardingSeen: state.onboardingSeen,
      completedSessions: state.completedSessions, streak: state.streak, lives: state.lives,
      answerHistory: state.answerHistory, sessions: state.sessions, lessonRun: state.lessonRun, settings: state.settings
    }))
    storageSaveFailed = false
  } catch (error) {
    storageSaveFailed = true
  }
  const storageNotice = document.querySelector('#storage-notice')
  if (storageNotice) {
    storageNotice.hidden = !storageSaveFailed
    storageNotice.textContent = fq('Ta progression ne peut pas être sauvegardée dans ce navigateur. Garde cet onglet ouvert pour ne pas perdre cette session.','Your progress cannot be saved in this browser. Keep this tab open to avoid losing this session.','Dein Fortschritt kann in diesem Browser nicht gespeichert werden. Lass diesen Tab geöffnet, damit diese Sitzung nicht verloren geht.')
  }
}

function applyMotionPreference() {
  document.documentElement.dataset.reducedMotion = String(state.settings.reducedMotion)
  document.documentElement.classList.toggle("reduce-motion", state.settings.reducedMotion)
}

function applyVisualPreferences() {
  const theme = state.settings.theme === "system" ? (window.matchMedia?.('(prefers-color-scheme: dark)').matches ? "dark" : "light") : state.settings.theme
  document.documentElement.dataset.theme = theme
  document.documentElement.lang = state.settings.language
  const themeColor = document.querySelector('meta[name="theme-color"]')
  const colorScheme = document.querySelector('meta[name="color-scheme"]')
  if (themeColor) themeColor.content = theme === "dark" ? "#111c23" : "#fff9f2"
  if (colorScheme) colorScheme.content = theme
}

const app = document.querySelector("#app")
const statusBar = () => `<div class="status" aria-hidden="true"><span>9:41</span><span>▮▮ &nbsp; ◉ &nbsp; 100%</span></div>`
function mascot(kind = "welcome", extraClass = "", alt = "Mascotte Thimoli") {
  return `<img class="mascot-image mascot-${kind} ${extraClass}" src="${mascotSources[kind] || mascotSources.welcome}" alt="${alt}" loading="eager">`
}
function villageImage(index, extraClass = "", alt = "") {
  const number = String(index + 1).padStart(2, "0")
  const isHero = extraClass.includes("hero")
  const src = isHero ? `assets/villages/optimized/village-${number}.webp` : `assets/villages/thumbs/village-${number}.webp`
  const size = isHero ? 512 : 300
  return `<img class="village-png ${extraClass}" src="${src}" width="${size}" height="${size}" alt="${alt}" decoding="async" ${isHero ? 'loading="eager" fetchpriority="high"' : 'loading="lazy" fetchpriority="low"'}>`
}
function coach(kind, message, options = {}) {
  const label = options.label || "Conseil de Thimoli"
  return `<section class="coach coach-${kind}${options.compact ? " coach-compact" : ""}" aria-label="${label}"><div class="coach-character">${mascot(kind, "", "Thimoli, ton guide")}</div><div class="coach-bubble" role="status" aria-live="polite"><span class="coach-kicker">${label}</span><p>${message}</p>${options.action || ""}</div></section>`
}
function logoBar() {
  return `<header class="brandbar"><div><div class="logo" aria-label="Thimoli">Thimoli<span class="leaf" aria-hidden="true">◆</span></div><div class="tagline">Apprendre le tamoul, un jour à la fois</div></div><button class="avatar avatar-mascot" type="button" data-go="profile" aria-label="Ouvrir mon profil">${mascot("welcome", "avatar-image", "")}</button></header>`
}
function bottomNav() {
  return `<nav class="bottom-nav" aria-label="Navigation principale">${navItems.map((item) => {
    const active = state.page === item.page || (["path", "levels"].includes(state.page) && item.page === "home")
    return `<button class="nav-btn ${active ? "active" : ""}" type="button" data-go="${item.page}" ${active ? 'aria-current="page"' : ""}><b aria-hidden="true">${item.icon}</b><span>${item.label}</span></button>`
  }).join("")}</nav>`
}
function heartsMarkup() {
  return Array.from({ length: 5 }, (_, index) => `<span class="heart ${index < state.lives ? "heart-full" : "heart-empty"}" aria-hidden="true">${index < state.lives ? "♥" : "♡"}</span>`).join("")
}
function dailyStats() {
  const realStreak = getStats().streak
  const heartsLabel = state.settings.language === "en" ? `${state.lives} of 5 hearts. Learn how hearts work.` : state.settings.language === "de" ? `${state.lives} von 5 Herzen. Erfahre, wie Herzen funktionieren.` : `${state.lives} cœurs sur 5. Comprendre les cœurs.`
  return `<section class="stats home-stats" aria-label="Série et cœurs"><article class="stat"><span class="stat-icon" aria-hidden="true">🔥</span><div><small>Série</small><strong>${realStreak} ${realStreak === 1 ? "jour" : "jours"}</strong></div></article><button class="stat stat-button" type="button" data-modal="hearts" aria-label="${heartsLabel}"><div><div class="hearts">${heartsMarkup()}</div><strong>${state.lives}/5 <small>Pourquoi ?</small></strong></div><span class="info-mark" aria-hidden="true">i</span></button></section>`
}
function progressBar(value, label, extraClass = "") {
  const percent = clamp(Math.round(value), 0, 100)
  return `<div class="bar ${extraClass}" role="progressbar" aria-label="${label}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${percent}"><span style="width:${percent}%"></span></div>`
}
function pageHeader(title, subtitle, action = "") {
  return `<header class="page-head"><div><h1>${title}</h1><p>${subtitle}</p></div>${action || `<button class="avatar avatar-mascot" type="button" data-go="profile" aria-label="Ouvrir mon profil">${mascot("welcome", "avatar-image", "")}</button>`}</header>`
}

function home() { return villageAdventureHome() }

function villageState(index) {
  if (!isVillageUnlocked(index)) return "VERROUILLÉ"
  if (state.lessonProgress[index] >= 10) return "TERMINÉ"
  if (state.lessonProgress[index] > 0) return "EN COURS"
  return "DÉBLOQUÉ"
}
const VMAP_X_PATTERN = [50, 76, 50, 24]
const VMAP_ROW_HEIGHT = 260
const VMAP_TOP_PAD = 78
function vmapPoint(index) {
  return { x: VMAP_X_PATTERN[index % VMAP_X_PATTERN.length], y: VMAP_TOP_PAD + index * VMAP_ROW_HEIGHT }
}
function vmapSegmentPath(p0, p1) {
  const dy = (p1.y - p0.y) / 2
  return `M${p0.x},${p0.y} C${p0.x},${p0.y + dy} ${p1.x},${p1.y - dy} ${p1.x},${p1.y}`
}
function vmapLockIcon() {
  return `<svg class="vmap-lock-icon" viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="3" fill="currentColor"/><path d="M8 11V8a4 4 0 0 1 8 0v3" fill="none" stroke="currentColor" stroke-width="2.3" stroke-linecap="round"/><circle cx="12" cy="15.5" r="1.6" fill="#fff"/></svg>`
}
function levels() {
  const nextLocked = villages.findIndex((village, index) => !isVillageUnlocked(index))
  const guideText = nextLocked > 0 ? `Encore <strong>${Math.max(0, 10 - state.lessonProgress[nextLocked - 1])} leçons</strong> et ${villages[nextLocked].name.replace("Village ", "")} s’ouvrira à toi.` : "Explore chaque monde et découvre un nouveau thème du tamoul."
  const points = villages.map((village, index) => vmapPoint(index))
  const trailHeight = points[points.length - 1].y + 200
  const segments = points.slice(0, -1).map((point, index) => {
    const unlocked = state.pathProgress[index] >= PATH_NODE_COUNT
    return `<path class="vmap-seg ${unlocked ? "vmap-seg-done" : "vmap-seg-todo"}" d="${vmapSegmentPath(point, points[index + 1])}" vector-effect="non-scaling-stroke" />`
  }).join("")
  const nodes = villages.map((village, index) => {
    const locked = !isVillageUnlocked(index)
    const progress = Math.round((state.pathProgress[index] / PATH_NODE_COUNT) * 100)
    const stateLabel = villageState(index)
    const isCurrent = index === state.currentVillage
    const done = progress >= 100
    const point = points[index]
    const style = `--vx:${point.x}%;--vy:${point.y}px;`
    return `<button id="village-map-${index}" class="vmap-node ${locked ? "locked" : "unlocked"} ${isCurrent && !locked ? "current" : ""} ${done ? "done" : ""}" style="${style}" type="button" ${locked ? `data-locked="${index}"` : `data-village="${index}"`} aria-label="Niveau ${index + 1}, ${village.name}, ${stateLabel.toLowerCase()}">${isCurrent && !locked ? `<span class="vmap-current-badge">${done ? "Rejouer" : "Continuer"}</span>` : ""}<span class="vmap-node-halo" aria-hidden="true"></span><span class="vmap-node-ring" aria-hidden="true"></span><span class="vmap-node-thumb" aria-hidden="true">${villageImage(index)}</span><span class="vmap-node-number" aria-hidden="true">${index + 1}</span>${locked ? `<span class="vmap-lock" aria-hidden="true"><span class="vmap-lock-scrim"></span>${vmapLockIcon()}</span>` : done ? '<span class="vmap-check" aria-hidden="true">✓</span>' : ""}</button><div class="vmap-label" style="${style}"><strong>${village.name}</strong><span lang="ta">${village.ta}</span><small>${progress}% parcouru${isCurrent ? " · Ton village" : ""}</small></div>`
  }).join("")
  return `<div class="app-view page-levels">${statusBar()}${pageHeader("Les 12 villages", "Un parcours vivant, du premier mot à la maîtrise.")}${coach("hint", guideText, { compact: true, label: "Ton prochain objectif" })}<button class="secondary va-map-current" type="button" data-village="${state.currentVillage}">Revenir à mon village · ${state.currentVillage + 1}</button>${PREVIEW_UNLOCK_ALL?'<p class="va-map-note">Mode exploration : les 12 villages sont ouverts pour les tester. Ta progression reste séparée.</p>':""}<div class="vmap-trail" style="--trail-h:${trailHeight}px"><svg class="vmap-svg" viewBox="0 0 100 ${trailHeight}" preserveAspectRatio="none" aria-hidden="true">${segments}</svg>${nodes}</div><p class="village-quote">“Chaque village te rapproche d’une nouvelle version de toi.”</p>${bottomNav()}</div>`
}

function pathNodeState(index) {
  const progress = state.pathProgress[state.currentVillage]
  if (index < progress) return "complete"
  if (PREVIEW_UNLOCK_ALL) return "available"
  if (index === progress) return "current"
  return "locked"
}

function pathPage() { return villageAdventurePath() }

function uniqueLearningItems(items) {
  const seen = new Set()
  return items.filter((item) => {
    const key = `${item?.ta || ""}|${item?.fr || ""}`
    if (!item?.ta || !item?.fr || seen.has(key)) return false
    seen.add(key)
    return true
  })
}
function villageItemPool(villageIndex = state.currentVillage) {
  return uniqueLearningItems(villageStages(villageIndex).flatMap((stage) => stage.items || []))
}
function stageItems(villageIndex, stageIndex, count = 4) {
  return uniqueLearningItems(villageStages(villageIndex)[stageIndex]?.items || []).slice(0, count)
}
function makeAnswers(item, pool, direction, seed) {
  const key = direction === "reverse" ? "ta" : "fr"
  const correct = item[key]
  const distractors = pool.filter((candidate) => candidate.ta !== item.ta).map((candidate) => candidate[key]).filter(Boolean)
  const start = distractors.length ? seed % distractors.length : 0
  const choices = [correct]
  for (let offset = 0; choices.length < 3 && offset < distractors.length * 2; offset += 1) {
    const value = distractors[(start + offset) % distractors.length]
    if (!choices.includes(value)) choices.push(value)
  }
  while (choices.length < 3) choices.push(`Option ${choices.length + 1}`)
  const correctIndex = seed % 3
  choices.splice(choices.indexOf(correct), 1)
  choices.splice(correctIndex, 0, correct)
  return { answers: choices, correct: correctIndex }
}
function makeQuestion(item, pool, variant, seed, idPrefix) {
  const direction = variant === "reverse" ? "reverse" : "forward"
  const choice = makeAnswers(item, pool, direction, seed)
  const phonetic = tamilToPhonetic(item.ta)
  if (direction === "reverse") {
    return {
      id: `${idPrefix}-reverse-${seed}`,
      letter: item.fr,
      displayLang: "fr",
      speak: item.ta,
      cardLabel: "Lis le sens, puis retrouve le tamoul",
      prompt: "Quel mot ou expression tamoule correspond ?",
      ...choice,
      hint: `Écoute la réponse : sa prononciation commence par « ${phonetic.slice(0, Math.max(2, Math.min(5, phonetic.length)))} ».`,
      explanation: `${item.ta} correspond à « ${item.fr} ».`,
      example: `${item.ta} · ${phonetic} · ${item.fr}`
    }
  }
  return {
    id: `${idPrefix}-forward-${seed}`,
    letter: item.ta,
    displayLang: "ta",
    speak: item.ta,
    cardLabel: variant === "audio" ? "Écoute, puis choisis le bon sens" : "Lis le mot ou la phrase en tamoul",
    prompt: variant === "audio" ? "Qu’as-tu entendu ?" : "Que signifie cet élément ?",
    ...choice,
    hint: `Prononciation simplifiée : « ${phonetic} ».`,
    explanation: `${item.ta} signifie « ${item.fr} ».`,
    example: `${phonetic} · ${item.fr}`
  }
}
function questionsForStage(villageIndex, stageIndex, variant = "forward", count = 4) {
  const items = stageItems(villageIndex, stageIndex, count)
  const pool = villageItemPool(villageIndex)
  return items.map((item, index) => makeQuestion(item, pool, variant, villageIndex * 41 + stageIndex * 4 + index, `v${villageIndex + 1}-s${stageIndex + 1}`))
}
function evaluationQuestions(villageIndex, kind = "path") {
  return learning.examQuestions(villageStages(villageIndex), villageIndex, kind)
}
function currentLearningContext() {
  if (state.examKind && Number.isInteger(state.examVillage)) {
    return { villageIndex: state.examVillage, node: null, stage: null, exam: state.examKind }
  }
  const nodes = activePathNodes()
  const node = Number.isInteger(state.activePathNode) ? nodes[state.activePathNode] : null
  return { villageIndex: state.currentVillage, node, stage: node && node.stage < 10 ? villageStages(state.currentVillage)[node.stage] : null, exam: null }
}
function currentLessonQuestions() {
  const context = currentLearningContext()
  if (context.exam) return evaluationQuestions(context.villageIndex, context.exam)
  if (!context.node) return lessonQuestions
  if (context.node.type === "evaluation") return evaluationQuestions(context.villageIndex, "path")
  return context.node.type === "lesson"
    ? learning.lessonQuestions(context.stage, context.villageIndex, context.node.stage)
    : learning.exerciseQuestions(context.stage, context.villageIndex, context.node.stage, context.node.exercise, state.lessonRun?.shuffleSeed || 0)
}
function currentMatchingPairs() {
  const context = currentLearningContext()
  if (!context.node || context.node.type !== "exercise") return matchingPairs
  return stageItems(context.villageIndex, context.node.stage, 4).map((item) => ({ letter: item.ta, sound: item.fr, example: `${tamilToPhonetic(item.ta)} · ${item.fr}` }))
}
function examAccess(villageIndex) {
  if (PREVIEW_UNLOCK_ALL) return { mock: true, final: true }
  const progress = state.pathProgress[villageIndex]
  const unlocked = isVillageUnlocked(villageIndex)
  return {
    mock: unlocked && progress >= 8,
    final: unlocked && (progress >= PATH_NODE_COUNT - 1 || state.lessonProgress[villageIndex] >= 10)
  }
}

function kuralPartFor(index) {
  return kuralParts.find((part) => index >= part.start && index <= part.end) || kuralParts[0]
}

function kuralFrenchTitle(chapterIndex) {
  return kuralChapterTitlesFr[chapterIndex] || `Chapitre ${chapterIndex + 1}`
}

function tamilToPhonetic(text, language = state.settings.language) {
  const profile = phoneticProfiles[language] || phoneticProfiles.fr
  const characters = Array.from((text || "").normalize("NFC"))
  let phonetic = ""
  for (let index = 0; index < characters.length; index += 1) {
    const character = characters[index]
    if (profile.independent[character]) {
      phonetic += profile.independent[character]
      continue
    }
    if (profile.consonants[character]) {
      const next = characters[index + 1]
      if (next === "்") {
        phonetic += profile.consonants[character]
        index += 1
      } else if (profile.signs[next]) {
        phonetic += profile.consonants[character] + profile.signs[next]
        index += 1
      } else {
        phonetic += profile.consonants[character] + "a"
      }
      continue
    }
    if (character === "ஃ") phonetic += "h"
    else if (!profile.signs[character] && character !== "்") phonetic += character
  }
  const escapedAffricate = profile.affricate.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  return phonetic
    .replace(/rrrr/g, "tr")
    .replace(new RegExp(`${escapedAffricate}${escapedAffricate}`, "g"), profile.affricate)
    .replace(new RegExp(`([${profile.vowels}])k(?=[${profile.vowels}])`, "g"), "$1g")
    .replace(new RegExp(`([${profile.vowels}])t(?=[${profile.vowels}])`, "g"), "$1d")
    .replace(new RegExp(`([${profile.vowels}])p(?=[${profile.vowels}])`, "g"), "$1b")
    .replace(new RegExp(`([${profile.vowels}])${escapedAffricate}(?=[${profile.vowels}])`, "g"), `$1${profile.voicedAffricate}`)
    .replace(/\s+/g, " ")
    .trim()
}

function kuralPhoneticFor(index, rawVerse) {
  const sourced = kuralPhonetics[index]
  if (state.settings.language === "fr" && Array.isArray(sourced) && sourced.length) return sourced.map((line) => line.replace(/zh/g, "lh"))
  if (state.settings.language === "fr" && typeof sourced === "string" && sourced.trim()) return sourced.split("$").map((line) => line.replace(/zh/g, "lh"))
  return rawVerse.split("$").map((line) => tamilToPhonetic(line))
}

function kuralHeader(title, tamilTitle, backView = "") {
  return `<header class="page-head kural-page-head">${backView ? `<button class="icon-button" type="button" data-kural-back="${backView}" aria-label="Retour">←</button>` : ""}<div><h1>${title}</h1><small lang="ta">${tamilTitle}</small></div>${backView ? "" : `<button class="avatar avatar-mascot" type="button" data-go="profile" aria-label="Ouvrir mon profil">${mascot("welcome", "avatar-image", "")}</button>`}</header>`
}

function kuralHome() {
  return `<div class="app-view page-kural page-kural-home">${statusBar()}${kuralHeader("Le Tirukkural", "திருக்குறள்")}
    ${kuralPracticeHero()}
    <div class="kural-section-title"><span>CHOISIR MON TEXTE</span><p>Un Kural demandé à l’école ? Retrouve-le dans son livre.</p></div>
    <main class="kural-parts kural-parts-clean" aria-label="Les trois livres du Tirukkural">${kuralParts.map((part, index) => `<button class="kural-part kural-${part.accent}" type="button" data-kural-part="${part.id}"><span class="kural-part-index" aria-hidden="true">0${index + 1}</span><span class="kural-part-copy"><strong>${part.name}</strong><small lang="ta">${part.ta}</small><span>${part.detail}</span></span><b aria-hidden="true">›</b></button>`).join("")}</main>
    <details class="kural-history"><summary>D’où viennent ces poèmes ?</summary><p>Le Tirukkural rassemble 1 330 courts poèmes attribués à Tiruvalluvar. En deux lignes, chacun invite à réfléchir à la conduite, à la société ou aux sentiments.</p><p>Ses 133 chapitres sont répartis en trois livres. La date exacte de l’œuvre reste incertaine. Tu peux découvrir les textes librement, ou travailler ceux choisis par ton école.</p></details>${bottomNav()}</div>`
}

function kuralList() {
  const part = kuralParts.find((item) => item.id === state.kuralPart) || kuralParts[0]
  const chapterIndexes = Array.from({ length: part.chapterEnd - part.chapterStart + 1 }, (_, index) => part.chapterStart + index)
  const groups = []
  for (let start = 0; start < chapterIndexes.length; start += 10) {
    groups.push(chapterIndexes.slice(start, start + 10))
  }
  const jumpChips = groups.map((group) => {
    const groupId = `kgroup-${group[0]}`
    return `<a class="kural-jump-chip" href="#${groupId}">${String(group[0] + 1).padStart(3, "0")}–${String(group[group.length - 1] + 1).padStart(3, "0")}</a>`
  }).join("")
  const groupsMarkup = groups.map((group) => {
    const groupId = `kgroup-${group[0]}`
    const rows = group.map((chapterIndex) => {
      const firstNumber = chapterIndex * 10 + 1
      const tamilTitle = kuralChapters[chapterIndex] || `அதிகாரம் ${chapterIndex + 1}`
      const mastered = Array.from({ length: 10 }, (_, offset) => chapterIndex * 10 + offset).filter((index) => state.kuralMastered.includes(index)).length
      return `<button class="kural-chapter-row" type="button" data-kural-chapter-index="${chapterIndex}" aria-label="Ouvrir le chapitre ${chapterIndex + 1}, ${kuralFrenchTitle(chapterIndex)}"><span class="kural-chapter-number">${String(chapterIndex + 1).padStart(3, "0")}</span><span class="kural-chapter-copy"><strong>${kuralFrenchTitle(chapterIndex)}</strong><small lang="ta">${tamilTitle}</small><span>Kurals ${firstNumber}–${firstNumber + 9}${mastered ? ` · ${mastered}/10 lus` : ""}</span></span><b aria-hidden="true">›</b></button>`
    }).join("")
    return `<section class="kural-chapter-group" aria-label="Chapitres ${group[0] + 1} à ${group[group.length - 1] + 1}"><h3 class="kural-group-heading" id="${groupId}">Chapitres ${String(group[0] + 1).padStart(3, "0")}–${String(group[group.length - 1] + 1).padStart(3, "0")}</h3>${rows}</section>`
  }).join("")
  return `<div class="app-view page-kural page-kural-list kural-${part.accent}">${statusBar()}${kuralHeader(part.name, part.ta, "home")}
    <section class="kural-book-intro"><span class="eyebrow">${part.shortName.toUpperCase()}</span><p>${part.description}</p><div class="kural-theme-tags">${part.themes.map((theme) => `<span>${theme}</span>`).join("")}</div><footer><strong>${part.end - part.start + 1} Kurals</strong><span>${chapterIndexes.length} chapitres</span></footer></section>
    <nav class="kural-jump-row" aria-label="Aller directement à un groupe de chapitres">${jumpChips}</nav>
    <main class="kural-chapter-list" aria-label="Chapitres de la catégorie ${part.name}">${groupsMarkup}</main>${bottomNav()}</div>`
}

function kuralChapterPage() {
  const chapterIndex = clamp(state.kuralChapter, 0, 132)
  const firstIndex = chapterIndex * 10
  const part = kuralPartFor(firstIndex)
  const tamilTitle = kuralChapters[chapterIndex] || `அதிகாரம் ${chapterIndex + 1}`
  return `<div class="app-view page-kural page-kural-chapter kural-${part.accent}">${statusBar()}${kuralHeader(kuralFrenchTitle(chapterIndex), tamilTitle, "list")}
    <section class="kural-chapter-summary"><span>CHAPITRE ${String(chapterIndex + 1).padStart(3, "0")}</span><p>Dix pensées à lire, écouter et mémoriser.</p></section>
    <main class="kural-chapter-picker" aria-label="Les dix Kurals du chapitre ${chapterIndex + 1}"><header><span>LECTURE</span><strong>Choisis un Kural</strong><small>${Array.from({ length: 10 }, (_, offset) => state.kuralMastered.includes(firstIndex + offset)).filter(Boolean).length}/10 lus</small></header><div class="kural-reading-list">${Array.from({ length: 10 }, (_, offset) => {
      const index = firstIndex + offset
      const mastered = state.kuralMastered.includes(index)
      const rawVerse = kuralVerses[index] || ""
      const firstLine = rawVerse.split("$")[0].trim()
      const firstLinePhonetic = firstLine ? kuralPhoneticFor(index, rawVerse)[0] : ""
      return `<button type="button" data-kural-index="${index}" class="${mastered ? "mastered" : ""}" aria-label="Kural ${index + 1}${mastered ? ", lu" : ""}"><span class="kural-reading-number">${index + 1}</span><span class="kural-reading-copy"><strong lang="ta">${firstLine || "Texte en cours de chargement…"}</strong>${firstLinePhonetic ? `<small>${firstLinePhonetic}</small>` : ""}<small>Kural ${index + 1} · ${state.kuralRecall[index] === "recited" ? "Récité · auto-évaluation" : state.kuralRecall[index] === "review" ? "À retravailler" : mastered ? "Déjà lu" : "Découvrir"}</small></span><span class="kural-reading-action" aria-hidden="true">${mastered ? "✓" : "›"}</span></button>`
    }).join("")}</div></main>${bottomNav()}</div>`
}

function kuralDetail() {
  const part = kuralPartFor(state.kuralIndex)
  const chapterIndex = Math.floor(state.kuralIndex / 10)
  const rawVerse = kuralVerses[state.kuralIndex] || ""
  const lines = rawVerse ? rawVerse.split("$") : []
  const phoneticLines = rawVerse ? kuralPhoneticFor(state.kuralIndex, rawVerse) : []
  const tamilChapter = kuralChapters[chapterIndex] || `அதிகாரம் ${chapterIndex + 1}`
  const chapterStart = chapterIndex * 10
  const chapterEnd = chapterStart + 9
  return `<div class="app-view page-kural page-kural-detail ${rawVerse && state.kuralPractice?.index === state.kuralIndex && state.kuralPractice.step > 0 ? "kural-is-practicing" : ""} kural-${part.accent}">${statusBar()}${kuralHeader(`Kural ${state.kuralIndex + 1}`, `குறள் ${state.kuralIndex + 1}`, "chapter")}
    <section class="kural-detail-chapter"><span>Chapitre ${chapterIndex + 1}</span><h2>${kuralFrenchTitle(chapterIndex)}</h2><small lang="ta">${tamilChapter}</small></section>
    <main class="kural-detail-reader">${rawVerse ? `<section class="kural-original" aria-label="Texte tamoul et prononciation simplifiée"><div class="kural-line-pairs">${lines.map((line, index) => `<div class="kural-line-pair"><span class="kural-line-tamil" lang="ta">${line}</span><span class="kural-line-phonetic" lang="${state.settings.language}">${phoneticLines[index] || ""}</span></div>`).join("")}</div><button class="listen-button listen-button-natural" type="button" data-speak="${rawVerse.replace("$", " ")}" data-natural-audio="assets/audio/kural/${String(state.kuralIndex + 1).padStart(4, "0")}.mp3"><span aria-hidden="true">◖</span><span>Écouter le Kural</span></button></section>` : kuralLoadState === "error" ? `<div class="kural-loading kural-load-error" role="alert"><p>Le texte n’a pas pu se charger.</p><button class="secondary" type="button" data-reload-kural>Réessayer</button></div>` : `<div class="kural-loading" role="status"><span></span><p>Chargement du Kural…</p></div>`}</main>
    ${rawVerse ? kuralPracticePanel(rawVerse) : ''}
    <div class="kural-controls"><button class="secondary" type="button" data-kural-nav="-1" ${state.kuralIndex <= chapterStart ? "disabled" : ""}>← Précédent</button><button class="primary" type="button" data-kural-nav="1" ${state.kuralIndex >= chapterEnd ? "disabled" : ""}>Suivant →</button></div><button class="text-button kural-back-list" type="button" data-kural-back="chapter">Retour aux 10 Kurals</button><p class="kural-source">Texte tamoul : édition électronique de Project Madurai.</p>${bottomNav()}</div>`
}

function kuralPage() {
  if (state.kuralView === "detail") return kuralDetail()
  if (state.kuralView === "chapter") return kuralChapterPage()
  if (state.kuralView === "list") return kuralList()
  return kuralHome()
}

function review() { return foundationsHome() }

function villageExams(villageIndex) {
  const item = villages[villageIndex]
  const access = examAccess(villageIndex)
  const progress = Math.round((state.pathProgress[villageIndex] / PATH_NODE_COUNT) * 100)
  const language = state.settings.language
  const title = language === "en" ? "Village exams" : language === "de" ? "Prüfungen zum Dorf" : "Examens du village"
  const intro = language === "en" ? "Practise this village without changing your progress." : language === "de" ? "Übe für dieses Dorf, ohne deinen Fortschritt zu verändern." : "Entraîne-toi sur ce village, sans modifier ta progression."
  const examCard = `<article class="exam-village-card ${!isVillageUnlocked(villageIndex) ? "is-locked" : ""}"><header><div><span>NIVEAU ${String(villageIndex + 1).padStart(2, "0")}</span><strong>${item.name}</strong></div><b class="availability-pill ${isVillageUnlocked(villageIndex) ? "is-available" : "is-locked"}">${isVillageUnlocked(villageIndex) ? "Disponible" : "À débloquer"}</b><small>${curriculum[villageIndex]?.book || `Valar Tamil ${villageIndex + 1}`} · ${progress}% terminé</small></header><div class="exam-actions"><button type="button" data-start-exam="mock" data-exam-village="${villageIndex}" ${access.mock ? "" : "disabled"}><span>Examen blanc</span><small>${access.mock ? "10 questions · entraînement libre" : "Se débloque à 20% du village"}</small><b aria-hidden="true">${access.mock ? "→" : "⌑"}</b></button><button type="button" data-start-exam="final" data-exam-village="${villageIndex}" ${access.final ? "" : "disabled"}><span>Examen final</span><small>${access.final ? "12 questions · niveau complet" : "Se débloque après les 40 étapes"}</small><b aria-hidden="true">${access.final ? "→" : "⌑"}</b></button></div></article>`
  return `<section class="exam-center village-exams"><div class="review-section-heading"><div><h2>${title}</h2></div></div><p class="exam-center-intro">${intro}</p>${examCard}</section>`
}

function practiceHeader(title, subtitle, progress = "") {
  return `<header class="practice-head"><button class="icon-button" type="button" data-go="review" aria-label="${fq('Retour à mon aventure','Back to my adventure','Zurück zum Abenteuer')}">←</button><div><span class="eyebrow">${fq('MON SAC À OUTILS','MY TOOLKIT','MEINE LERNHILFEN')}</span><h1>${title}</h1><p>${subtitle}</p></div>${progress ? `<span class="practice-progress">${progress}</span>` : ""}</header>`
}

function alphabetPractice() {
  const group = ["consonants", "syllables"].includes(state.alphabetGroup) ? state.alphabetGroup : "vowels"
  const tabs = `<div class="practice-tabs" role="tablist" aria-label="Groupes de lettres"><button type="button" role="tab" data-alphabet-group="vowels" aria-selected="${group === "vowels"}" class="${group === "vowels" ? "active" : ""}">Voyelles <small lang="ta">உயிர்</small></button><button type="button" role="tab" data-alphabet-group="consonants" aria-selected="${group === "consonants"}" class="${group === "consonants" ? "active" : ""}">Consonnes <small lang="ta">மெய்</small></button><button type="button" role="tab" data-alphabet-group="syllables" aria-selected="${group === "syllables"}" class="${group === "syllables" ? "active" : ""}">Syllabes <small lang="ta">உயிர்மெய்</small></button></div>`
  if (group === "syllables") {
    const consonant = alphabetGroups.consonants.find((item) => item.letter === state.syllableConsonant) || alphabetGroups.consonants[0]
    const cells = alphabetGroups.vowels.map((vowel, index) => {
      const combo = uyirmeiCombo(consonant.letter, index)
      return `<button type="button" class="syllable-cell" data-speak="${combo}" aria-label="${combo}"><strong lang="ta">${combo}</strong><small>${consonant.sound}${vowel.sound}</small></button>`
    }).join("")
    return `<div class="app-view page-practice page-alphabet">${statusBar()}${practiceHeader("L’alphabet tamoul", "Combine chaque consonne avec les 12 voyelles.", "18 × 12 combinaisons")}
    ${tabs}
    <section class="alphabet-focus"><div class="alphabet-focus-letter"><span lang="ta">${consonant.letter}</span><small>Consonne</small></div><div><span class="eyebrow">REPÈRE</span><h2>${consonant.sound}</h2><p>${consonant.hint}</p></div></section>
    <div class="alphabet-grid alphabet-grid-clean" role="list" aria-label="Consonnes tamoules">${alphabetGroups.consonants.map((item) => `<button type="button" role="listitem" class="${item.letter === consonant.letter ? "active" : ""}" data-syllable-consonant="${item.letter}" data-speak="${item.letter}" aria-label="${fq('Écouter','Listen','Anhören')} ${item.letter}"><strong lang="ta">${item.letter}</strong></button>`).join("")}</div>
    <div class="syllable-grid" role="list" aria-label="Combinaisons உயிர்மெய் pour ${consonant.sound}">${cells}</div>
    <p class="practice-tip">Touche une combinaison pour l’écouter. Chaque consonne se combine avec les 12 voyelles pour former une nouvelle syllabe.</p></div>`
  }
  const letters = alphabetGroups[group]
  const selected = letters.find((item) => item.letter === state.alphabetLetter) || letters[0]
  return `<div class="app-view page-practice page-alphabet">${statusBar()}${practiceHeader("L’alphabet tamoul", "Observe et mémorise les signes essentiels.", group === "vowels" ? "12 voyelles" : "18 consonnes")}
    ${tabs}
    <section class="alphabet-focus"><div class="alphabet-focus-letter"><span lang="ta">${selected.letter}</span><small>${group === "vowels" ? "Voyelle" : "Consonne"}</small></div><div><span class="eyebrow">${selected.word ? "EXEMPLE" : "REPÈRE"}</span><h2 ${selected.word ? 'lang="ta"' : ""}>${selected.word || selected.letter}</h2><p>${selected.word ? selected.meaning : selected.hint}</p></div></section>
    <div class="alphabet-grid alphabet-grid-clean" role="list" aria-label="${group === "vowels" ? "Voyelles" : "Consonnes"} tamoules">${letters.map((item) => `<button type="button" role="listitem" class="${item.letter === selected.letter ? "active" : ""}" data-alphabet-letter="${item.letter}" data-speak="${item.letter}" aria-label="${fq('Écouter','Listen','Anhören')} ${item.letter}"><strong lang="ta">${item.letter}</strong></button>`).join("")}</div>
    <aside class="alphabet-special"><span lang="ta">ஃ</span><div><strong>Le signe spécial · āytam</strong><p>Il complète les 12 voyelles et les 18 consonnes de base.</p></div><button class="letter-speaker" type="button" data-speak="ஃ" aria-label="${audioLabel('ஃ')}">${speakerIcon}</button></aside><p class="practice-tip">${fq('Touche une lettre pour écouter son son, puis répète à ton rythme.','Tap a letter to hear its sound, then repeat at your own pace.','Tippe auf einen Buchstaben, höre zu und sprich in deinem Tempo nach.')}</p></div>`
}

function pronunciationPractice() {
  const pair = pronunciationPairs[state.pronunciationIndex] || pronunciationPairs[0]
  const diphthongs = state.pronunciationIndex === pronunciationPairs.length - 1
  const shortLabel = diphthongs ? fq('aï · diphtongue','ai · diphthong','ai · Diphthong') : translateUiText('son court')
  const longLabel = diphthongs ? fq('aou · diphtongue','ow · diphthong','au · Diphthong') : translateUiText('son long')
  const targetKind = state.pronunciationTarget === "long" ? "long" : "short"
  const targetWord = pair[`${targetKind}Word`]
  const targetWordAudio = pair[`${targetKind}WordAudio`]
  const targetMeaning = pair[`${targetKind}Meaning`]
  return `<div class="app-view page-practice page-pronunciation">${statusBar()}${practiceHeader("Prononciation", "Écoute, compare et entraîne chaque son.", `${state.pronunciationIndex + 1}/${pronunciationPairs.length}`)}
    <section class="sound-stage"><span class="eyebrow">ÉCOUTE LA DIFFÉRENCE</span><div class="sound-comparison"><button type="button" data-speak="${pair.short}" data-natural-audio="${pair.shortAudio}" aria-label="Écouter ${pair.short}"><span lang="ta">${pair.short}</span><strong>${tamilToPhonetic(pair.short)}</strong><small>${shortLabel}</small><b aria-hidden="true">${speakerIcon}</b></button><i aria-hidden="true">→</i><button type="button" data-speak="${pair.long}" data-natural-audio="${pair.longAudio}" aria-label="Écouter ${pair.long}"><span lang="ta">${pair.long}</span><strong>${tamilToPhonetic(pair.long)}</strong><small>${longLabel}</small><b aria-hidden="true">${speakerIcon}</b></button></div><p>${pair.cue}</p></section>
    <section class="voice-practice-card pronunciation-model-card"><header><div><span class="eyebrow">MODÈLE À RÉPÉTER</span><h2>Écoute le mot</h2></div><div class="voice-target-tabs" role="group" aria-label="Son à travailler"><button type="button" data-pronunciation-target="short" class="${targetKind === "short" ? "active" : ""}">${diphthongs ? "ஐ" : translateUiText("Court")}</button><button type="button" data-pronunciation-target="long" class="${targetKind === "long" ? "active" : ""}">${diphthongs ? "ஔ" : translateUiText("Long")}</button></div></header><div class="voice-target"><button type="button" class="voice-replay" data-speak="${targetWord}" data-natural-audio="${targetWordAudio}" aria-label="Écouter le modèle ${targetWord}">${speakerIcon}</button><div><strong lang="ta">${targetWord}</strong><span>${tamilToPhonetic(targetWord)} · ${targetMeaning}</span></div></div><div class="pronunciation-coach-note"><span aria-hidden="true">1 · 2 · 3</span><p>Écoute le modèle, puis répète trois fois : lentement, normalement et sans regarder.</p></div></section>
    <div class="sound-family-list" role="list" aria-label="Familles de sons">${pronunciationPairs.map((item, index) => `<button type="button" role="listitem" class="${index === state.pronunciationIndex ? "active" : ""}" data-pronunciation-index="${index}"><span lang="ta">${item.short} · ${item.long}</span><strong>${item.shortSound} / ${item.longSound}</strong><b aria-hidden="true">${index === state.pronunciationIndex ? "●" : "○"}</b></button>`).join("")}</div>
    <button class="primary practice-next" type="button" data-pronunciation-next><span>Son suivant</span><span aria-hidden="true">→</span></button>${pronunciationLibrary()}</div>`
}

function writingPractice() {
  const level = writingCurriculum[state.writingLevel] || writingCurriculum[0]
  const items = level.items
  const item = items[state.writingLetterIndex] || items[0]
  const result = state.writingResult
  const groupStart = state.writingLevel === 1 ? Math.floor(state.writingLetterIndex / 12) * 12 : 0
  const choices = state.writingLevel === 1 ? items.slice(groupStart, groupStart + 12) : items
  const picker = `<details class="writing-choose"><summary>${fq('Choisir ma lettre ou mon mot','Choose a letter or word','Buchstaben oder Wort wählen')} · ${items.length}</summary>${state.writingLevel === 1 ? `<label class="writing-family-select">${fq('Famille de consonne','Consonant family','Konsonantenfamilie')}<select data-writing-family>${alphabetGroups.consonants.map((letter,index)=>`<option value="${index}" ${index===groupStart/12?'selected':''}>${letter.letter} · ${fq('12 combinaisons','12 combinations','12 Kombinationen')}</option>`).join('')}</select></label>`:''}<div class="writing-picker">${choices.map((entry,offset)=>`<button type="button" data-writing-pick="${groupStart+offset}" class="${groupStart+offset===state.writingLetterIndex?'active':''}" aria-label="${entry.text}"><strong lang="ta">${entry.text}</strong></button>`).join('')}</div></details>`
  const unlockedThrough = PREVIEW_UNLOCK_ALL ? writingCurriculum.length - 1 : Math.max(0, state.currentVillage)
  return `<div class="app-view page-practice page-writing">${statusBar()}${practiceHeader("Écriture", "Des lettres aux phrases, village après village.", `${state.writingLetterIndex + 1}/${items.length}`)}
    <div class="writing-level-strip" role="tablist" aria-label="Niveaux d’écriture">${writingCurriculum.map((entry, index) => { const unlocked = index <= unlockedThrough; return `<button type="button" role="tab" data-writing-level="${index}" class="${index === state.writingLevel ? "active" : ""} ${!unlocked ? "locked" : ""}" aria-selected="${index === state.writingLevel}" ${unlocked ? "" : "disabled"}><strong>${index + 1}</strong><span>${entry.title}</span>${unlocked ? "" : '<small aria-hidden="true">⌑</small>'}</button>` }).join("")}</div>
    <section class="writing-level-heading"><div><span class="eyebrow">NIVEAU ${state.writingLevel + 1}</span><h2>${level.title}</h2></div><span>${level.focus}</span></section>${picker}<p class="writing-practice-note">${fq('Ton défi : trace avec le modèle, puis essaie sans le regarder.','Your challenge: trace with the guide, then try without it.','Deine Aufgabe: Schreibe mit Vorlage und versuche es dann ohne sie.')} <strong>${state.writingTraced.filter(text=>items.some(entry=>entry.text===text)).length}/${items.length} ${fq('tracés guidés réussis','guided traces completed','geführte Zeichen geschafft')}</strong></p><div class="writing-toolbar"><div class="writing-mode" role="group" aria-label="Niveau d’aide"><button type="button" data-writing-guide="true" class="${state.writingGuided ? "active" : ""}">Avec modèle</button><button type="button" data-writing-guide="false" class="${!state.writingGuided ? "active" : ""}">Sans aide</button></div><div class="writing-letter-nav"><button type="button" data-writing-nav="-1" aria-label="Élément précédent">‹</button><span lang="ta">${item.text}</span><button type="button" data-writing-nav="1" aria-label="Élément suivant">›</button></div></div>
    <section class="writing-board-card"><div class="writing-instruction"><span class="eyebrow">${state.writingGuided ? "SUIS LE MODÈLE" : "À TOI DE JOUER"}</span><p>${item.label}</p></div><canvas id="writing-canvas" class="writing-canvas" data-letter="${item.text}" data-guided="${state.writingGuided}" aria-label="Zone de dessin pour ${item.text}"></canvas><div id="writing-feedback" class="writing-feedback ${result ? `is-${result.kind}` : ""}" aria-live="polite">${result ? `<strong>${result.title}</strong><span>${result.copy}</span>` : `<span>Commence à tracer dans la zone.</span>`}</div></section>
    <div class="writing-actions"><button class="secondary" type="button" data-writing-clear>Effacer</button><button class="primary" type="button" data-writing-validate>Valider mon tracé</button></div><button class="secondary writing-next" type="button" data-writing-nav="1">${fq('Lettre ou mot suivant','Next letter or word','Nächster Buchstabe oder nächstes Wort')} →</button><p class="writing-practice-note">${fq('31 signes de base + 216 combinaisons, puis des mots et des phrases. La vérification compare ton dessin au modèle : ce n’est pas une reconnaissance d’écriture par IA.','31 basic signs + 216 combinations, then words and sentences. The check compares your drawing with the guide; it is not AI handwriting recognition.','31 Grundzeichen + 216 Kombinationen, danach Wörter und Sätze. Die Prüfung vergleicht deine Zeichnung mit der Vorlage; sie ist keine KI-Handschrifterkennung.')}</p></div>`
}

function vocabularyPractice() {
  const activeSet = vocabularySets.find((set) => set.id === state.vocabularyCategory) || vocabularySets[0]
  return `<div class="app-view page-practice page-vocabulary">${statusBar()}${practiceHeader("Vocabulaire", "Des mots utiles, classés par thème.", `${activeSet.words.length} mots`)}
    <div class="vocabulary-tabs" role="tablist" aria-label="Thèmes de vocabulaire">${vocabularySets.map((set) => `<button type="button" role="tab" class="vocab-${set.color} ${set.id === activeSet.id ? "active" : ""}" data-vocabulary-category="${set.id}" aria-selected="${set.id === activeSet.id}"><span aria-hidden="true">${set.icon}</span>${set.name}</button>`).join("")}</div>
${activeSet.id==='family'&&typeof familyLearningDiagram==='function'?familyLearningDiagram():''}<section class="vocabulary-title"><div><span class="eyebrow">THÈME</span><h2>${activeSet.name}</h2></div><span>${activeSet.words.length} cartes</span></section><div class="vocabulary-grid" role="list">${activeSet.words.map(([word, meaning]) => `<button type="button" role="listitem" data-speak="${word}" aria-label="${word}, ${meaning}. Écouter">${typeof vocabularyPicture==='function'?vocabularyPicture(word):''}<span lang="ta">${word}</span><small>${tamilToPhonetic(word)}</small><strong>${meaning}</strong><b aria-hidden="true">◖</b></button>`).join("")}</div><p class="practice-tip">Touche une carte pour écouter le mot, puis répète-le sans regarder la phonétique.</p></div>`
}

function dateKey(timestamp) {
  const date = new Date(timestamp)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}
function getStats() {
  const today = new Date()
  const dateLocale = { fr: "fr-FR", en: "en-GB", de: "de-DE" }[state.settings.language] || "fr-FR"
  today.setHours(12, 0, 0, 0)
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today)
    date.setDate(today.getDate() - (6 - index))
    return { key: dateKey(date.getTime()), label: new Intl.DateTimeFormat(dateLocale, { weekday: "short" }).format(date).replace(".", ""), minutes: 0 }
  })
  const hasRealHistory = state.answerHistory.length > 0 || state.sessions.length > 0
  const activeKeys = new Set()
  state.sessions.forEach((session) => {
    const day = days.find((item) => item.key === dateKey(session.timestamp))
    if (day) day.minutes += Number.isFinite(session.duration) ? session.duration : 0
    activeKeys.add(dateKey(session.timestamp))
  })
  state.answerHistory.forEach((entry) => activeKeys.add(dateKey(entry.timestamp)))
  days.forEach((day) => { day.active = activeKeys.has(day.key) })
  let streakCursor = new Date(today)
  if (!activeKeys.has(dateKey(streakCursor.getTime()))) streakCursor.setDate(streakCursor.getDate() - 1)
  let streak = 0
  while (activeKeys.has(dateKey(streakCursor.getTime()))) {
    streak += 1
    streakCursor.setDate(streakCursor.getDate() - 1)
  }
  const correct = state.answerHistory.filter((entry) => entry.correct).length
  const wrongAnswers = state.answerHistory.filter((entry) => entry.correct === false).length
  const accuracy = state.answerHistory.length ? Math.round((correct / state.answerHistory.length) * 100) : null
  const weeklyMinutes = days.reduce((sum, day) => sum + day.minutes, 0)
  const activeDays = days.filter((day) => day.active).length
  const completedLessons = state.lessonProgress.reduce((sum, value) => sum + value, 0)
  const xp = state.sessions.reduce((sum, session) => sum + (session.xp || 0), 0)
  return { days, hasRealHistory, accuracy, weeklyMinutes, activeDays, completedLessons, xp, streak, wrongAnswers, questionsAnswered: state.answerHistory.length, sessions: state.sessions.length }
}
function stats() {
  const data = getStats()
  const t = fq
  const number = n => new Intl.NumberFormat({fr:"fr-FR",en:"en-GB",de:"de-DE"}[state.settings.language] || "fr-FR", {maximumFractionDigits:1}).format(n)
  const quests = foundationQuests()
  const questDone = quests.filter(q => state.foundationProgress[q.id]).length
  const stars = quests.reduce((sum,q) => sum + (state.foundationProgress[q.id]?.stars || 0), 0)
  const villageDone = state.pathProgress.filter(n => n >= PATH_NODE_COUNT).length
  const steps = state.pathProgress.reduce((sum,n) => sum + n, 0)
  const read = state.kuralMastered.length
  const recited = Object.values(state.kuralRecall).filter(value => value === "recited").length
  const toReview = Object.values(state.kuralRecall).filter(value => value === "review").length
  const hasProgress = data.hasRealHistory || questDone || steps || read || recited
  const today = data.days[6].minutes
  const goal = Math.max(1, state.settings.dailyGoal)
  const percent = Math.min(100, Math.round(today / goal * 100))
  const max = Math.max(1, ...data.days.map(day => day.minutes))
  const firstAnswers = state.answerHistory.filter(entry => entry.attempt === 1)
  const precision = firstAnswers.length ? Math.round(firstAnswers.filter(entry => entry.correct).length / firstAnswers.length * 100) : null
  const recent = [...state.sessions].sort((a,b) => b.timestamp-a.timestamp).slice(0,5)
  const nextQuest = quests.find(q => !state.foundationProgress[q.id])
  const action = nextQuest ? 'data-go="review"' : 'data-go="home"'
  const locale = {fr:"fr-FR",en:"en-GB",de:"de-DE"}[state.settings.language] || "fr-FR"
  return `<div class="app-view page-stats stats-renewed">${statusBar()}${pageHeader(t("Tes petits pas comptent","Every step counts","Jeder Schritt zählt"),t("Ton aventure, à ton rythme.","Your journey, at your pace.","Deine Reise, dein Tempo."))}
    <section class="sp-hero">
      <div class="sp-hero-copy"><span class="eyebrow">${t("TON ÉLAN","YOUR MOMENTUM","DEIN SCHWUNG")}</span><h2>${data.streak ? `${data.streak} ${t(data.streak===1?"jour de suite":"jours de suite",data.streak===1?"day in a row":"days in a row",data.streak===1?"Tag in Folge":"Tage in Folge")}` : t("Un petit pas aujourd’hui ?","One small step today?","Heute ein kleiner Schritt?")}</h2><p>${hasProgress ? t("Chaque séance construit la suite. Pas besoin d’aller vite pour avancer.","Every session builds on the last. Progress does not need to be fast.","Jede Einheit bringt dich weiter. Fortschritt braucht kein hohes Tempo.") : t("Aucune statistique pour l’instant : termine ta première quête pour commencer ton histoire.","No statistics yet: finish your first quest to begin your story.","Noch keine Statistik: Schließe deine erste Quest ab und beginne deine Geschichte.")}</p></div>${mascot("celebrate","sp-mascot","")}
      <div class="sp-goal"><div><strong>${t("Aujourd’hui","Today","Heute")}</strong><span>${number(today)} / ${goal} min</span></div>${progressBar(percent,t("Objectif quotidien","Daily goal","Tagesziel"))}<small>${percent>=100?t("Objectif atteint. Bravo pour ce moment à toi !","Goal reached. Well done for making time for yourself!","Ziel erreicht. Schön, dass du dir Zeit genommen hast!"):t("Le temps des séances terminées est comptabilisé.","Time is counted when a session is completed.","Die Zeit wird nach Abschluss einer Einheit gezählt.")}</small></div>
    </section>
    <section class="sp-week sp-card"><header><div><span class="eyebrow">${t("LA RÉGULARITÉ AVANT LA VITESSE","CONSISTENCY OVER SPEED","REGELMÄSSIG STATT SCHNELL")}</span><h2>${t("Tes 7 derniers jours","Your last 7 days","Deine letzten 7 Tage")}</h2></div><span class="sp-tag">${data.activeDays}/7 ${t("actifs","active","aktiv")}</span></header>
      <div class="sp-bars" aria-label="${t("Minutes par jour","Minutes per day","Minuten pro Tag")}">${data.days.map((day,i)=>`<div class="sp-day ${i===6?'today':''}"><span class="sp-minutes">${number(day.minutes)}</span><div class="sp-bar-track"><i style="height:${day.minutes>0?Math.max(5,day.minutes/max*100):0}%"></i></div><strong>${day.label}</strong><span class="sp-day-dot" aria-label="${day.active?t("Jour actif","Active day","Aktiver Tag"):t("Jour sans activité enregistrée","No recorded activity","Keine Aktivität erfasst")}">${day.active?'✓':'·'}</span></div>`).join("")}</div><p class="sp-week-total"><strong>${number(data.weeklyMinutes)} min</strong> ${t("cette semaine glissante","over these seven days","in diesen sieben Tagen")}</p>
    </section>
    <section class="sp-learning"><div class="sp-section-heading"><span class="eyebrow">${t("CE QUE TU CONSTRUIS","WHAT YOU ARE BUILDING","WAS DU AUFBAUST")}</span><h2>${t("Trois chemins, tes progrès","Three paths, your progress","Drei Wege, dein Fortschritt")}</h2></div>
      <button class="sp-learning-row sp-foundations" type="button" data-go="review"><span class="sp-symbol" lang="ta" aria-hidden="true">அ</span><span class="sp-learning-copy"><strong>${t("Les fondations","Foundations","Die Grundlagen")}</strong><small>${questDone}/${quests.length} ${t("quêtes terminées","quests completed","Quests abgeschlossen")} · ${stars} ★</small>${progressBar(questDone/quests.length*100,t("Quêtes terminées","Completed quests","Abgeschlossene Quests"))}</span><b aria-hidden="true">›</b></button>
      <button class="sp-learning-row sp-villages" type="button" data-go="home"><span class="sp-symbol" aria-hidden="true">${villageMiniIcon}</span><span class="sp-learning-copy"><strong>${t("Les villages","The villages","Die Dörfer")}</strong><small>${villageDone}/12 ${t("terminés","completed","abgeschlossen")} · ${steps}/${PATH_NODE_COUNT*12} ${t("étapes","steps","Schritte")}</small>${progressBar(steps/(PATH_NODE_COUNT*12)*100,t("Étapes terminées","Completed steps","Abgeschlossene Schritte"))}</span><b aria-hidden="true">›</b></button>
      <button class="sp-learning-row sp-kural" type="button" data-go="kural"><span class="sp-symbol" aria-hidden="true">${kuralNavIcon}</span><span class="sp-learning-copy"><strong>${t("Le Tirukkural","Tirukkural","Tirukkural")}</strong><small>${read} ${t("lus","read","gelesen")} · ${recited} ${t("récités","recited","rezitiert")}</small><span class="sp-kural-note">${t("Récitation déclarée par toi, sans évaluation vocale.","Recitation is self-reported, without a voice assessment.","Rezitation nach eigener Einschätzung, ohne Sprachbewertung.")}</span></span><b aria-hidden="true">›</b></button>
    </section>
    <section class="sp-next"><span class="eyebrow">${t("ET MAINTENANT ?","WHAT NEXT?","UND JETZT?")}</span><h2>${toReview ? t("Un Kural à retrouver","Return to a Kural","Zurück zu einem Kural") : nextQuest ? t("Une quête pour avancer","A quest to move forward","Eine Quest als nächster Schritt") : t("La suite t’attend au village","Your village adventure continues","Dein Dorfabenteuer geht weiter")}</h2><p>${toReview ? t("Tu as marqué des textes à retravailler. Reprends-les tranquillement dans Kural.","You marked some texts for review. Return to them at your pace in Kural.","Du hast Texte zum Wiederholen markiert. Nimm sie dir in Kural in Ruhe vor.") : t("Une courte séance, un peu de jeu, et un nouveau pas dans ton apprentissage.","A short session, a little play, and another step in your learning.","Eine kurze Einheit, ein bisschen Spielen und ein weiterer Lernschritt.")}</p><button class="primary" type="button" ${toReview?'data-go="kural"':action}>${t("C’est parti","Let’s go","Los geht’s")} <span aria-hidden="true">→</span></button></section>
    <details class="sp-details"><summary>${t("Mes séances en détail","My sessions in detail","Meine Einheiten im Detail")}</summary><div class="sp-detail-metrics"><p><strong>${data.sessions}</strong> ${t("séances enregistrées","recorded sessions","gespeicherte Einheiten")}</p><p><strong>${precision===null?'—':precision+'%'}</strong> ${t("réussite au premier essai","first-attempt success","Erfolg beim ersten Versuch")}</p></div><p class="sp-disclaimer">${t("Calcul sur les réponses enregistrées au premier essai ; tous les jeux ne produisent pas cette mesure. Ce n’est pas une note de niveau.","Based on recorded first attempts; not all games provide this measure. This is not a proficiency grade.","Berechnet aus erfassten Erstversuchen; nicht alle Spiele liefern diesen Wert. Dies ist keine Einstufungsnote.")}</p>
    <ol class="sp-session-list">${recent.map(session=>`<li><span><strong>${session.mode==="Quêtes"?t("Quête · niveau 0","Quest · level 0","Quest · Stufe 0"):Number.isInteger(session.village)?t("Village","Village","Dorf")+" "+(session.village+1):t("Séance","Session","Einheit")}</strong><small>${new Intl.DateTimeFormat(locale,{day:"numeric",month:"short",hour:"2-digit",minute:"2-digit"}).format(new Date(session.timestamp))}</small></span><b>${number(Number.isFinite(session.duration)?Math.max(0,session.duration):0)} min</b></li>`).join("") || `<li>${t("Ta première séance apparaîtra ici.","Your first session will appear here.","Deine erste Einheit erscheint hier.")}</li>`}</ol></details>
    <p class="sp-local-note">${t("Données enregistrées dans ce navigateur. Historique limité aux 100 dernières séances ; les progrès des parcours sont conservés séparément.","Data saved in this browser. History is limited to the latest 100 sessions; path progress is stored separately.","Daten werden in diesem Browser gespeichert. Der Verlauf umfasst die letzten 100 Einheiten; der Lernfortschritt wird separat gespeichert.")}</p>${bottomNav()}</div>`
}

function profile() {
  const t=fq
  const quests=foundationQuests()
  const done=quests.filter(q=>state.foundationProgress[q.id]).length
  const completed=state.pathProgress.filter(value=>value>=PATH_NODE_COUNT).length
  const read=state.kuralMastered.length
  const recited=Object.values(state.kuralRecall).filter(value=>value==='recited').length
  const badges=[
    {icon:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 27V15M12 21C3 21 3 12 3 12c9 0 9 9 9 9ZM12 16s0-10 12-10c0 0 0 10-12 10Z"/><path d="M6 28h15"/></svg>',title:t('Le premier pas','First step','Der erste Schritt'),detail:t('Terminer une quête des bases','Complete a foundation quest','Eine Grundlagen-Quest abschließen'),value:done,target:1,page:'review'},
    {icon:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 7h18v21H5zM9 3h18v21"/><text x="14" y="22" text-anchor="middle" stroke="none" fill="currentColor" font-size="13">அ</text></svg>',title:t('Gardien des voyelles','Vowel guardian','Wächter der Vokale'),detail:t('Terminer les 4 quêtes des voyelles','Complete all 4 vowel quests','Alle 4 Vokal-Quests abschließen'),value:quests.slice(0,4).filter(q=>state.foundationProgress[q.id]).length,target:4,page:'review'},
    {icon:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 19v9m0-4-6 5m6-5 6 5"/><path d="M8 20a6 6 0 0 1-2-11 7 7 0 0 1 13-4 6 6 0 0 1 7 8 4 4 0 0 1-3 7Z"/></svg>',title:t('De solides racines','Strong roots','Starke Wurzeln'),detail:t('Terminer les 18 quêtes des bases','Complete all 18 foundation quests','Alle 18 Grundlagen-Quests abschließen'),value:done,target:18,page:'review'},
    {icon:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m3 15 8-7 8 7M5 14v13h12V14m-7 13v-7h3v7M20 10l5-5 5 5m-8 0v13h6V10"/><path d="M3 29h26"/></svg>',title:t('Un monde découvert','A world discovered','Eine Welt entdeckt'),detail:t('Terminer un village, évaluation comprise','Complete a village, including its assessment','Ein Dorf einschließlich Prüfung abschließen'),value:completed,target:1,page:'home'},
    {icon:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 9C11 5 5 5 2 7v19c5-2 9-2 14 1 5-3 9-3 14-1V7c-3-2-9-2-14 2Zm0 0v18M6 12l6 1m-6 5 6 1m8-6 6-1m-6 7 6-1"/></svg>',title:t('Les mots de sagesse','Words of wisdom','Worte der Weisheit'),detail:t('Lire 5 Kurals','Read 5 Kurals','5 Kurals lesen'),value:read,target:5,page:'kural'},
    {icon:'<svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M7 5h18a4 4 0 0 1 4 4v11a4 4 0 0 1-4 4h-9l-7 5v-5H7a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4Z"/><path d="M10 13v4m6-8v12m6-8v4"/></svg>',title:t('Une voix, un poème','A voice, a poem','Eine Stimme, ein Gedicht'),detail:t('Déclarer un Kural récité sans aide','Mark one Kural as recited without help','Einen Kural als ohne Hilfe rezitiert markieren'),value:recited,target:1,page:'kural'}
  ]
  const earned=badges.filter(b=>b.value>=b.target)
  const next=badges.find(b=>b.value<b.target)
  const nextPercent=next?Math.min(100,Math.round(next.value/next.target*100)):100
  const chapter=done<4?t('À la découverte des sons','Discovering sounds','Klänge entdecken'):done<quests.length?t('Les racines prennent forme','Your roots are growing','Deine Wurzeln wachsen'):t('Prêt pour de nouveaux mondes','Ready for new worlds','Bereit für neue Welten')
  return `<div class="app-view page-profile profile-renewed">${statusBar()}<header class="pf-top"><div><span class="eyebrow">${t('TON COIN À TOI','YOUR OWN SPACE','DEIN EIGENER PLATZ')}</span><h1>${t('Mon aventure','My adventure','Mein Abenteuer')}</h1></div><button class="icon-button" type="button" data-go="settings" aria-label="${t('Ouvrir les paramètres','Open settings','Einstellungen öffnen')}"><svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M4 7h16M4 17h16"/><circle cx="9" cy="7" r="3" fill="#fffaf4"/><circle cx="15" cy="17" r="3" fill="#fffaf4"/></svg></button></header>
    <section class="pf-passport"><div class="pf-portrait">${mascot('welcome','','')}<span aria-hidden="true">✦</span></div><div class="pf-identity"><span class="pf-label">${t('CARNET D’EXPLORATION','EXPLORER’S JOURNAL','ENTDECKER-TAGEBUCH')}</span><h2>${t('Mon aventure','My adventure','Mein Abenteuer')}</h2><p>${chapter}</p><span class="pf-seal">${earned.length} / ${badges.length} ${t('trophées gagnés','trophies earned','Trophäen verdient')}</span></div><p class="pf-motto">${t('Pas besoin d’être parfait. Juste curieux.','You don’t have to be perfect. Just curious.','Du musst nicht perfekt sein. Nur neugierig.')}</p></section>
    <div class="pf-small-wins"><span><b>${done}</b> ${t('quêtes des bases','foundation quests','Grundlagen-Quests')}</span><span><b>${completed}</b> ${t('villages terminés','villages completed','Dörfer abgeschlossen')}</span><button type="button" data-go="stats">${t('Mon bilan','My progress','Mein Fortschritt')} <span aria-hidden="true">↗</span></button></div>
    <section class="pf-next"><div class="pf-next-head"><span class="eyebrow">${next?t('LE PROCHAIN TROPHÉE','YOUR NEXT TROPHY','DEINE NÄCHSTE TROPHÄE'):t('TA COLLECTION EST COMPLÈTE','YOUR COLLECTION IS COMPLETE','DEINE SAMMLUNG IST VOLLSTÄNDIG')}</span><span class="pf-badge-symbol" aria-hidden="true">${next?.icon||'✦'}</span></div><h2>${next?.title||t('De belles bases pour la suite','A strong start for what comes next','Eine gute Grundlage für die Zukunft')}</h2><p>${next?.detail||t('Continue à explorer les villages et à retrouver tes poèmes préférés.','Keep exploring villages and revisiting your favourite poems.','Entdecke weitere Dörfer und kehre zu deinen Lieblingsgedichten zurück.')}</p>${next?`<div class="pf-next-progress"><strong>${Math.min(next.value,next.target)} / ${next.target}</strong><span>${t('Chaque étape compte','Every step counts','Jeder Schritt zählt')}</span></div>${progressBar(nextPercent,t('Prochain trophée','Next trophy','Nächste Trophäe'))}`:''}<button class="primary" type="button" data-go="${next?.page||'home'}">${t('Continuer mon aventure','Continue my adventure','Mein Abenteuer fortsetzen')} <span aria-hidden="true">→</span></button></section>
    <section class="pf-collection"><header><span class="eyebrow">${t('DES TRACES DE TON CHEMIN','MARKS OF YOUR JOURNEY','SPUREN DEINES WEGES')}</span><h2>${t('Mes petits trophées','My little trophies','Meine kleinen Trophäen')}</h2><p>${t('Touche un trophée pour voir comment le gagner.','Tap a trophy to see how to earn it.','Tippe auf eine Trophäe, um zu sehen, wie du es verdienst.')}</p></header><div class="pf-badge-grid">${badges.map(b=>`<details class="pf-badge ${b.value>=b.target?'earned':'waiting'}"><summary><span class="pf-badge-symbol" aria-hidden="true">${b.icon}</span><strong>${b.title}</strong><small>${b.value>=b.target?t('✓ Gagné','✓ Earned','✓ Verdient'):t('À découvrir','To discover','Zu entdecken')}</small></summary><div class="pf-badge-detail"><p>${b.detail}</p><span>${Math.min(b.value,b.target)} / ${b.target}</span><button type="button" data-go="${b.page}">${b.value>=b.target?t('Y retourner','Go back','Zurückkehren'):t('Je me lance','Let’s begin','Loslegen')} →</button></div></details>`).join('')}</div></section>
    <section class="pf-links"><button type="button" data-go="kural"><span class="pf-link-icon" aria-hidden="true">${kuralNavIcon}</span><span><strong>${t('Mes moments Kural','My Kural moments','Meine Kural-Momente')}</strong><small>${read} ${t('lus','read','gelesen')} · ${recited} ${t('récités selon toi','self-reported recitations','selbst bestätigte Rezitationen')}</small></span><b aria-hidden="true">›</b></button><button type="button" data-go="settings"><span class="pf-link-icon" aria-hidden="true">☷</span><span><strong>${t('À mon rythme','At my pace','In meinem Tempo')}</strong><small>${t('Mon objectif','My goal','Mein Ziel')} · ${state.settings.dailyGoal} min / ${t('jour','day','Tag')}</small></span><b aria-hidden="true">›</b></button></section>
    <p class="pf-footer">${t('Ce carnet est enregistré sur ce navigateur. Tes trophées restent là quand tu reviens.','This journal is saved in this browser. Your trophies are here when you return.','Dieses Tagebuch wird in diesem Browser gespeichert. Deine Trophäen warten hier auf dich.')}</p>${bottomNav()}</div>`
}

function toggle(name, label, detail = "") {
  const active = state.settings[name]
  return `<div class="setting setting-toggle"><div><strong>${label}</strong>${detail ? `<small>${detail}</small>` : ""}</div><button class="toggle ${active ? "" : "off"}" type="button" data-setting="${name}" role="switch" aria-checked="${active}" aria-label="${label}"><span></span></button></div>`
}
function settings() {
  const backAction = '<button class="icon-button" type="button" data-go="profile" aria-label="Retour au profil">←</button>'
  return `<div class="app-view page-settings">${statusBar()}${pageHeader("Paramètres", "Personnalise une expérience qui te ressemble.", backAction)}
    <section class="settings-group"><span class="settings-label">${fq('APPARENCE','APPEARANCE','DARSTELLUNG')}</span><div class="settings-card appearance-card"><p>${fq('Une ambiance qui te ressemble.','Make yourself at home.','So fühlst du dich wohl.')}</p><div class="appearance-choice" role="group" aria-label="${fq('Apparence','Appearance','Darstellung')}">${[['light',fq('Clair','Light','Hell'),'☀'],['dark',fq('Sombre','Dark','Dunkel'),'☾'],['system',fq('Appareil','Device','Gerät'),'◐']].map(([id,label,icon])=>`<button type="button" data-theme="${id}" aria-pressed="${state.settings.theme===id}"><span aria-hidden="true">${icon}</span>${label}</button>`).join('')}</div></div></section>
    <section class="settings-group settings-personalization"><span class="settings-label">LANGUE DE L’APPLICATION</span><div class="settings-card settings-choice-card"><div class="setting-choice"><div><strong>Langue de l’application</strong><small>Langue des menus et des aides</small></div><div class="language-choice" role="group" aria-label="Langue de l’application">${phoneticLanguages.map((language) => `<button type="button" class="choice-chip ${state.settings.language === language.id ? "active" : ""}" data-language="${language.id}" aria-pressed="${state.settings.language === language.id}"><span>${language.short}</span>${language.label}</button>`).join("")}</div></div></div></section>
    <section class="settings-group settings-learning"><span class="settings-label">APPRENTISSAGE</span><div class="settings-card"><label class="setting" for="daily-goal"><div><strong>Objectif quotidien</strong><small>Une durée réaliste que tu peux tenir</small></div><select id="daily-goal" data-daily-goal aria-label="Objectif quotidien">${[5, 10, 15, 20].map((value) => `<option value="${value}" ${state.settings.dailyGoal === value ? "selected" : ""}>${value} min</option>`).join("")}</select></label>${toggle("autoPronunciation", "Prononciation automatique", "Joue le son au début de chaque question")}${toggle("soundEffects", "Effets sonores", "Sons doux de réussite et de correction")}</div></section>
    <section class="settings-group settings-comfort"><span class="settings-label">CONFORT</span><div class="settings-card">${toggle("reducedMotion", "Réduire les animations", "Limite les mouvements et les célébrations")}</div></section>
    <section class="settings-group"><span class="settings-label">AIDE</span><div class="settings-card"><button class="setting" type="button" data-tour-replay><span><strong>Revoir la visite guidée</strong><small>Thimoli te présente chaque espace</small></span><span aria-hidden="true">›</span></button></div></section>
    <section class="settings-group"><span class="settings-label">Confidentialité et informations légales</span><div class="settings-card">${[['privacy','Confidentialité'],['terms','Conditions d’utilisation'],['notice','Mentions légales et crédits']].map(([id,label])=>`<a class="setting" href="legal.html?view=${id}&lang=${state.settings.language}"><strong>${label}</strong><span aria-hidden="true">›</span></a>`).join('')}</div></section>
    <p class="settings-honesty-note">${fq('Interface et aides disponibles en français, anglais et allemand. Certains contenus pédagogiques restent en français.','Interface and guidance are available in French, English and German. Some learning content is still in French.','Oberfläche und Hilfen sind auf Französisch, Englisch und Deutsch verfügbar. Einige Lerninhalte sind noch auf Französisch.')}</p>
    ${window.THIMOLI_ALPHABET_AUDIO?.['அ']?.includes('pedagogical-local')?`<p class="settings-honesty-note">${fq('Sons du prototype non commercial :','Non-commercial prototype audio:','Audios des nichtkommerziellen Prototyps:')} <a href="https://elevenlabs.io" target="_blank" rel="noopener noreferrer">elevenlabs.io</a></p>`:''}
    <p class="settings-honesty-note">Cette V1 conserve uniquement les réglages réellement fonctionnels.</p><p class="version-note">Thimoli v1.1 · Prototype interactif</p>${bottomNav()}</div>`
}

function ensureLessonRun() {
  const contextKey = `${state.examKind || "path"}:${state.examVillage ?? state.currentVillage}:${state.activePathNode ?? "practice"}:${state.lessonMode}`
  if (state.lessonRun && state.lessonRun.contextKey === contextKey) return
  const villageIndex = state.examKind && Number.isInteger(state.examVillage) ? state.examVillage : state.currentVillage
  state.lessonRun = { contextKey, shuffleSeed: Math.floor(Math.random() * 0x7fffffff), startedAt: Date.now(), totalChecks: 0, correctAnswers: 0, firstTryCorrect: 0, wrongAnswers: 0, progressBefore: state.lessonProgress[villageIndex], pathBefore: state.pathProgress[villageIndex], finalized: false, summary: null }
}
function finalizeLesson() {
  ensureLessonRun()
  if (state.lessonRun.finalized) return state.lessonRun.summary
  const duration = Math.max(1, Math.ceil((Date.now() - state.lessonRun.startedAt) / 60000))
  const gradedTotal = currentLessonQuestions().filter(q => q.type !== "write").length
  const exam = Boolean(state.examKind || currentLearningContext().node?.type === "evaluation")
  const accuracy = gradedTotal ? Math.round((state.lessonRun.firstTryCorrect / gradedTotal) * 100) : 0
  const passed = !exam || state.lessonRun.firstTryCorrect >= Math.ceil(gradedTotal * 2 / 3)
  const xp = 10 + state.lessonRun.firstTryCorrect * 2
  const before = state.lessonRun.progressBefore
  const pathBefore = Number.isFinite(state.lessonRun.pathBefore) ? state.lessonRun.pathBefore : state.pathProgress[state.currentVillage]
  let after = before
  let pathAfter = pathBefore
  let pathAdvanced = false
  if (Number.isInteger(state.activePathNode)) {
    if (state.activePathNode === pathBefore && passed) {
      pathAfter = Math.min(PATH_NODE_COUNT, pathBefore + 1)
      state.pathProgress[state.currentVillage] = pathAfter
      pathAdvanced = true
    }
    after = pathAfter >= PATH_NODE_COUNT ? 10 : Math.min(9, Math.floor(pathAfter / 4))
    state.lessonProgress[state.currentVillage] = after
  } else if (state.lessonMode === "parcours") {
    after = Math.min(10, before + 1)
    state.lessonProgress[state.currentVillage] = after
    state.pathProgress[state.currentVillage] = after >= 10 ? PATH_NODE_COUNT : Math.min(PATH_NODE_COUNT - 1, after * 4)
    pathAfter = state.pathProgress[state.currentVillage]
  }
  const summary = { duration, accuracy, xp, before, after, pathBefore, pathAfter, pathAdvanced, passed, selfReviewed: state.lessonRun.selfReviewed || 0, correct: state.lessonRun.firstTryCorrect, total: gradedTotal }
  state.lessonRun.finalized = true
  if (Number.isInteger(state.activePathNode) && !state.examKind) {
    const key = `${state.currentVillage}:${state.activePathNode}`
    state.villagePractice[key] = { best: Math.max(state.villagePractice[key]?.best || 0, accuracy), last: Date.now() }
  }
  state.lessonRun.summary = summary
  state.completedSessions += 1
  state.sessions.push({ timestamp: Date.now(), duration, accuracy, xp, village: state.examKind && Number.isInteger(state.examVillage) ? state.examVillage : state.currentVillage, mode: state.lessonMode })
  state.sessions = state.sessions.slice(-100)
  saveState()
  return summary
}
function lessonComplete() {
  const summary = finalizeLesson()
  const examPractice = Boolean(state.examKind && Number.isInteger(state.examVillage))
  const villageIndex = examPractice ? state.examVillage : state.currentVillage
  const village = villages[villageIndex]
  const fromPath = Number.isInteger(state.activePathNode)
  const completedNode = fromPath ? activePathNodes()[state.activePathNode] : null
  const context = currentLearningContext()
  const learnedItem = context.stage?.items?.[0] || villageStages(villageIndex)[0]?.items?.[0] || { ta: "தமிழ்", fr: "tamoul" }
  const beforePercent = examPractice ? Math.round((state.pathProgress[villageIndex] / PATH_NODE_COUNT) * 100) : fromPath ? Math.round((summary.pathBefore / PATH_NODE_COUNT) * 100) : summary.before * 10
  const afterPercent = examPractice ? beforePercent : fromPath ? Math.round((summary.pathAfter / PATH_NODE_COUNT) * 100) : summary.after * 10
  const resultCopy = summary.passed === false ? `${summary.correct}/${summary.total} réussies du premier coup. Il faut ${Math.ceil(summary.total * 2/3)} réponses justes pour valider. Revois les points difficiles puis retente l’épreuve.` : examPractice ? `${summary.correct}/${summary.total} réussies du premier coup. Objectif atteint pour cet entraînement ; ce résultat n’est pas un diplôme Valar.` : fromPath ? (summary.pathAdvanced ? `Étape ${summary.pathAfter} sur ${PATH_NODE_COUNT} terminée.` : "Étape rejouée : tes acquis sont renforcés.") : `${beforePercent}% → ${afterPercent}% · Encore ${Math.max(0, 10 - summary.after)} leçons avant le prochain village.`
  const nextStage = nextLessonStage()
  const replayLabel = examPractice || completedNode?.type === "evaluation" ? fq("Rejouer cet examen", "Retry this exam", "Prüfung wiederholen") : fromPath ? fq("Rejouer cette étape", "Replay this step", "Diesen Schritt wiederholen") : fq("Rejouer la séance", "Replay this session", "Diese Einheit wiederholen")
  const primaryAction = nextStage ? `<button class="primary" type="button" data-next-lesson-stage><span>${fq("Étape suivante", "Next step", "Nächster Schritt")}</span><span aria-hidden="true">→</span></button>` : `<button class="primary" type="button" data-restart-lesson><span>${replayLabel}</span><span aria-hidden="true">↻</span></button>`
  const returnToPath = fromPath || examPractice ? `<button class="secondary secondary-full" type="button" data-return-path>${fq("Retour au parcours", "Back to the path", "Zurück zum Lernpfad")}</button>` : ""
  const completionTitle = summary.passed === false ? "Encore un entraînement" : examPractice ? (state.examKind === "mock" ? "Examen blanc terminé" : "Examen du village terminé") : completedNode?.type === "evaluation" ? "Objectif atteint !" : "Séance terminée !"
  return `<div class="app-view page-lesson page-complete">${statusBar()}<div class="celebration-burst" aria-hidden="true"><span>✦</span><span>·</span><span>✦</span></div>${mascot(summary.accuracy >= 67 ? "celebrate" : "success", "completion-mascot", "Thimoli accompagne ta réussite")}<header class="completion-title"><span class="eyebrow">${summary.accuracy >= 67 ? "BRAVO ABINASH" : "ON CONTINUE ENSEMBLE"}</span><h1>${completionTitle}</h1><p>${examPractice ? `Bilan du ${village.name}.` : "Tu viens de renforcer ton tamoul."}</p></header>
    <div class="completion-metrics"><article><strong>${summary.correct}/${summary.total}</strong><span>sans aide</span></article><article><strong>+${summary.xp}</strong><span>XP gagnés</span></article><article><strong>${summary.accuracy}%</strong><span>au premier essai</span></article></div>${summary.selfReviewed ? '<p class="learning-note">Ton atelier d’écriture a été relu par toi-même. Il n’entre pas dans le score automatique.</p>' : ""}
    <section class="learned-card"><span class="learned-letter" lang="ta">${learnedItem.ta}</span><div><span class="eyebrow">${examPractice ? "POINT CLÉ DU NIVEAU" : completedNode ? (completedNode.type === "lesson" ? "MINI-LEÇON VALIDÉE" : completedNode.type === "evaluation" ? "ÉVALUATION TERMINÉE" : "EXERCICE VALIDÉ") : "AUJOURD’HUI, TU AS APPRIS"}</span><h2>${completedNode ? completedNode.title : learnedItem.fr}</h2><p>${learnedItem.ta} · ${tamilToPhonetic(learnedItem.ta)} · ${learnedItem.fr}</p></div></section>
    <section class="village-result"><div class="section-heading"><div><span class="eyebrow">${village.name.toUpperCase()}</span><h2>Ta progression avance</h2></div><strong>${afterPercent}%</strong></div>${progressBar(afterPercent, `${afterPercent} % du village terminé`)}<p>${resultCopy}</p></section>
    ${primaryAction}${returnToPath}<button class="secondary secondary-full" type="button" data-go="home">${fq("Retour au village", "Back to the village", "Zurück zum Dorf")}</button></div>`
}

function matchingLesson(activeNode) {
  const pairs = currentMatchingPairs()
  const done = state.matchedPairs.length
  const percent = Math.round((done / pairs.length) * 100)
  const rightOrder = pairs.map((_, index) => index).sort((a, b) => ((a * 3 + 1) % pairs.length) - ((b * 3 + 1) % pairs.length))
  const mistake = state.matchMistake
  const stage = villageStages(state.currentVillage)[activeNode.stage]
  const coachMessage = mistake ? `<strong>Presque !</strong> ${pairs[mistake.left].letter} correspond à « ${pairs[mistake.left].sound} ». Observe la paire, puis essaie encore.` : done ? `<strong>Bien joué !</strong> ${done} association${done > 1 ? "s" : ""} correcte${done > 1 ? "s" : ""}. Continue jusqu’à relier les quatre éléments.` : "Choisis un élément en tamoul, puis touche le sens qui lui correspond."
  return `<div class="app-view page-lesson page-matching">${statusBar()}<header class="lesson-top"><button class="icon-button lesson-close" type="button" data-go="path" aria-label="Fermer l’exercice">×</button>${progressBar(percent, `${done} association${done > 1 ? "s" : ""} sur ${pairs.length}`, "lesson-progress")}<button class="lesson-hearts" type="button" data-modal="hearts" aria-label="${state.lives} cœurs restants"><span class="lesson-heart-symbol" aria-hidden="true">♥</span><span class="lesson-heart-count">${state.lives}</span></button></header>
    <div class="lesson-section"><span class="eyebrow">RELIER · ${stage?.title || "ENTRAÎNEMENT"}</span><span>${done}/${pairs.length} RÉUSSIES</span></div>${coach(mistake ? "correction" : done ? "success" : "hint", coachMessage, { compact: true, label: mistake ? "Correction utile" : done ? "Bonne association" : "Conseil de Thimoli" })}
    <section class="matching-card"><div class="matching-title"><span class="matching-icon" aria-hidden="true">⌁</span><div><h1>Relie le tamoul au bon sens</h1><p>Touche un élément dans chaque colonne</p></div></div><div class="matching-headings"><span>TAMOUL</span><span>SENS</span></div><div class="matching-board"><div class="matching-column">${pairs.map((pair, index) => { const matched = state.matchedPairs.includes(index); return `<button class="match-tile match-letter ${state.matchLeft === index ? "selected" : ""} ${matched ? "matched match-${index}" : ""}" type="button" data-match-left="${index}" ${matched ? "disabled" : ""} aria-pressed="${state.matchLeft === index}" aria-label="${pair.letter}"><span lang="ta">${pair.letter}</span>${matched ? '<b aria-hidden="true">✓</b>' : ""}</button>` }).join("")}</div><div class="matching-river" aria-hidden="true">${pairs.map((_, index) => `<span class="${state.matchedPairs.includes(index) ? `linked match-${index}` : ""}"></span>`).join("")}</div><div class="matching-column">${rightOrder.map((index) => { const pair = pairs[index]; const matched = state.matchedPairs.includes(index); return `<button class="match-tile match-sound ${state.matchRight === index ? "selected" : ""} ${matched ? `matched match-${index}` : ""}" type="button" data-match-right="${index}" ${matched ? "disabled" : ""} aria-pressed="${state.matchRight === index}" aria-label="${pair.sound}"><span>${pair.sound}</span>${matched ? '<b aria-hidden="true">✓</b>' : ""}</button>` }).join("")}</div></div><p class="matching-tip">Lis chaque paire à voix haute une fois avant de continuer.</p></section>
    <div class="matching-footer"><span>${mistake ? "Tu peux réessayer immédiatement." : done === 0 ? "Commence par l’élément que tu reconnais." : `${pairs.length - done} association${pairs.length - done > 1 ? "s" : ""} restante${pairs.length - done > 1 ? "s" : ""}.`}</span></div></div>`
}

function lesson() {
  if (state.lessonMode === "Bilan alphabet") return alphabetReviewView()
  if (state.lessonMode === "Quêtes") return foundationQuestView()
  if (!Number.isInteger(state.activePathNode)) {
    if (state.lessonMode === "Alphabet") return alphabetPractice()
    if (state.lessonMode === "Prononciation") return pronunciationPractice()
    if (state.lessonMode === "Écriture") return writingPractice()
    if (state.lessonMode === "Vocabulaire") return vocabularyPractice()
  }
  const questions = currentLessonQuestions()
  if (state.lesson >= questions.length) return lessonComplete()
  ensureLessonRun()
  const question = questions[state.lesson]
  const context = currentLearningContext()
  const activeNode = context.node
  if (activeNode?.type === "lesson" && !state.studyStarted) return villageStudy(context)
  if (question.type) return interactiveLesson(question, context, questions.length)
  const section = context.exam ? `${context.exam === "mock" ? "EXAMEN BLANC" : "EXAMEN DU VILLAGE"} · NIVEAU ${context.villageIndex + 1}` : activeNode ? `${activeNode.type === "lesson" ? "MINI-LEÇON" : activeNode.type === "evaluation" ? "ÉVALUATION" : "EXERCICE"} · ${context.stage?.title || `ÉTAPE ${state.activePathNode + 1}`}` : state.lessonMode === "parcours" ? "LECTURE" : `RÉVISION · ${state.lessonMode.toUpperCase()}`
  const isCorrect = state.feedback === "correct"
  const isWrong = state.feedback === "wrong"
  const coachKind = isCorrect ? "success" : isWrong ? "correction" : "hint"
  const neutralCoachMessage = activeNode?.type === "lesson" && context.stage ? `<strong>Objectif :</strong> ${context.stage.objective}` : context.exam ? "Réponds sans te presser. À la fin, tu verras exactement où tu en es." : "Prends ton temps : écoute le son, puis choisis ta réponse."
  const coachMessage = isCorrect ? `<strong>Bonne réponse.</strong> Tu as bien reconnu « ${question.answers[question.correct]} ».` : isWrong ? state.questionAttempts >= 2 ? "<strong>On reprend calmement.</strong> Observe la bonne réponse et son exemple, puis retente." : "<strong>Presque.</strong> La correction ci-dessous t’explique le point précis à retenir." : state.showHint ? question.hint : neutralCoachMessage
  const coachLabel = isCorrect ? "Bravo !" : isWrong ? "Thimoli t’aide" : state.showHint ? "Ton indice" : "Conseil de Thimoli"
  const closePage = context.exam ? "home" : activeNode ? "path" : "review"
  const phraseClass = Array.from(question.letter).length > 5 ? "letter-phrase" : ""
  return `<div class="app-view page-lesson ${isCorrect ? "lesson-is-correct" : isWrong ? "lesson-is-wrong" : ""}">${statusBar()}<header class="lesson-top"><button class="icon-button lesson-close" type="button" data-go="${closePage}" aria-label="Fermer la leçon">×</button>${progressBar(((state.lesson + 1) / questions.length) * 100, `Question ${state.lesson + 1} sur ${questions.length}`, "lesson-progress")}<button class="lesson-hearts" type="button" data-modal="hearts" aria-label="${state.lives} cœurs restants"><span class="lesson-heart-symbol" aria-hidden="true">♥</span><span class="lesson-heart-count">${state.lives}</span></button></header>
    <div class="lesson-section"><span class="eyebrow">${section}</span><span>QUESTION ${state.lesson + 1}/${questions.length}</span></div>${coach(coachKind, coachMessage, { compact: true, label: coachLabel })}${activeNode?.type === "lesson" && context.stage?.note ? `<aside class="lesson-objective"><span>À RETENIR</span><p>${context.stage.note}</p></aside>` : ""}
    <section class="lesson-card"><p>${question.cardLabel || "Lis et écoute en tamoul"}</p><div class="letter ${phraseClass}" lang="${question.displayLang || "ta"}">${question.letter}</div><button class="listen-button" type="button" data-speak="${question.speak || question.letter}"><span aria-hidden="true">◖</span><span>Écouter en tamoul</span></button><p class="question-prompt">${question.prompt}</p></section>
    <div class="answers" role="group" aria-label="Choisis une réponse">${question.answers.map((answer, index) => {
      const selected = state.selected === index
      const correctState = isCorrect && index === question.correct
      const wrongState = isWrong && selected
      return `<button class="answer ${selected ? "selected" : ""} ${correctState ? "answer-correct" : ""} ${wrongState ? "answer-wrong" : ""}" type="button" data-answer="${index}" aria-pressed="${selected}" ${state.feedback ? "disabled" : ""}><span class="answer-key">${String.fromCharCode(65 + index)}</span><span>${answer}</span>${correctState ? '<b aria-hidden="true">✓</b>' : wrongState ? '<b aria-hidden="true">×</b>' : ""}</button>`
    }).join("")}</div>
    ${state.showHint && !state.feedback ? `<aside class="hint-card"><span>Indice</span><p>${question.hint}</p></aside>` : ""}
    ${isCorrect ? `<section class="feedback-panel feedback-success"><span class="feedback-label">POURQUOI C’EST JUSTE</span><h2>${question.answers[question.correct]}</h2><p>${question.explanation}</p><p class="feedback-example"><strong>Dans un exemple :</strong> ${question.example}</p><button class="primary" type="button" data-next-question><span>Continuer</span><span aria-hidden="true">→</span></button></section>` : ""}
    ${isWrong ? `<section class="feedback-panel feedback-correction"><span class="feedback-label">À COMPRENDRE</span><h2>La bonne réponse : ${question.answers[question.correct]}</h2><p>${question.explanation}</p><p class="feedback-example"><strong>Dans un exemple :</strong> ${question.example}</p>${state.questionAttempts >= 4 && state.heartLostThisQuestion ? '<p class="heart-message">Un seul cœur a été utilisé pour cette question.</p>' : ""}<button class="primary" type="button" data-retry><span>Réessayer maintenant</span><span aria-hidden="true">↻</span></button></section>` : ""}
    ${!state.feedback ? `<div class="lesson-actions"><button class="secondary" type="button" data-hint ${state.showHint ? "disabled" : ""}>${state.showHint ? "Indice affiché" : "Voir un indice"}</button><button class="primary check-answer" type="button" data-check-answer ${state.selected === null ? "disabled" : ""}>Vérifier</button></div>` : ""}</div>`
}

function modalView() {
  if (!state.modal) return ""
  if (state.modal.type === "hearts") return `<div class="modal-backdrop" data-close-modal role="presentation"><section class="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" type="button" data-close-modal aria-label="Fermer">×</button><div class="modal-icon hearts-large" aria-hidden="true">♥</div><h2 id="modal-title">Les cœurs protègent ton rythme</h2><p>Ils t’encouragent à prendre le temps de comprendre, sans te punir.</p><ul><li>Les trois premiers essais incorrects ne coûtent rien.</li><li>Un cœur est utilisé seulement à partir de la quatrième erreur.</li><li>Tu ne peux perdre qu’un cœur par question.</li></ul><p class="modal-note">Dans ce prototype, tu peux continuer à apprendre même à 0 cœur.</p><button class="primary" type="button" data-close-modal>J’ai compris</button></section></div>`
  const index = state.modal.index
  const village = villages[index]
  const previous = villages[Math.max(0, index - 1)]
  const remaining = Math.max(0, 10 - state.lessonProgress[Math.max(0, index - 1)])
  return `<div class="modal-backdrop" data-close-modal role="presentation"><section class="modal-card locked-modal" role="dialog" aria-modal="true" aria-labelledby="modal-title"><button class="modal-close" type="button" data-close-modal aria-label="Fermer">×</button><div class="modal-village" aria-hidden="true">${villageImage(index)}</div><span class="level-badge">Niveau ${index + 1}</span><h2 id="modal-title">${village.name}</h2><p class="tamil" lang="ta">${village.ta}</p><p>${village.theme}</p><div class="unlock-rule"><strong>Comment le débloquer ?</strong><span>Termine ${previous.name}. Il te reste ${remaining} leçon${remaining > 1 ? "s" : ""}.</span></div><button class="primary" type="button" data-close-modal>Continuer mon parcours</button></section></div>`
}

function tourView() {
  if (state.onboardingSeen || state.page !== "home") return ""
  const step = tourSteps[state.tourStep]
  const last = state.tourStep === tourSteps.length - 1
  return `<div class="tour-backdrop" role="dialog" aria-modal="true" aria-labelledby="tour-title"><section class="tour-card"><button class="tour-skip" type="button" data-tour-skip>Passer</button><div class="tour-mascot">${mascot(state.tourStep === 0 ? "welcome" : state.tourStep === 1 ? "hint" : "success", "", "Thimoli présente l’application")}</div><div class="tour-step-icon" aria-hidden="true">${step.icon}</div><span class="eyebrow">VISITE GUIDÉE · ${state.tourStep + 1}/${tourSteps.length}</span><h2 id="tour-title">${step.title}</h2><p>${step.copy}</p><div class="tour-dots" aria-hidden="true">${tourSteps.map((_, index) => `<span class="${index <= state.tourStep ? "active" : ""}"></span>`).join("")}</div><button class="primary" type="button" data-tour-next>${last ? "Commencer l’aventure" : "Suivant"}<span aria-hidden="true">→</span></button></section></div>`
}

function currentView() {
  const views = { home, levels, path: pathPage, kural: kuralPage, review, stats, profile, settings, lesson }
  return (views[state.page] || home)()
}
function updateUrl(page, replace = false) {
  const url = new URL(location.href)
  url.searchParams.set("page", page)
  if (page === "kural" && state.kuralView !== "home") {
    url.searchParams.set("view", state.kuralView)
    url.searchParams.set("part", state.kuralPart)
    if (state.kuralView === "detail") url.searchParams.set("kural", String(state.kuralIndex + 1))
    else url.searchParams.delete("kural")
    if (["chapter", "detail"].includes(state.kuralView)) url.searchParams.set("chapter", String(state.kuralChapter + 1))
    else url.searchParams.delete("chapter")
  } else {
    url.searchParams.delete("view")
    url.searchParams.delete("part")
    url.searchParams.delete("kural")
    url.searchParams.delete("chapter")
  }
  history[replace ? "replaceState" : "pushState"]({ page }, "", url)
}
function openKuralView(view, options = {}) {
  if (!["home", "list", "chapter", "detail"].includes(view)) return
  if (options.part && kuralParts.some((part) => part.id === options.part)) state.kuralPart = options.part
  if (Number.isInteger(options.chapter) && options.chapter >= 0 && options.chapter < 133) {
    state.kuralChapter = options.chapter
    state.kuralPart = kuralPartFor(options.chapter * 10).id
  }
  if (Number.isInteger(options.index) && options.index >= 0 && options.index < 1330) {
    state.kuralIndex = options.index
    state.kuralChapter = Math.floor(options.index / 10)
    state.kuralPart = kuralPartFor(options.index).id
    if (view === "detail" && !state.kuralMastered.includes(options.index)) state.kuralMastered.push(options.index)
  }
  state.page = "kural"
  state.kuralView = view
  state.kuralStudyStep = 0
  saveState()
  updateUrl("kural", Boolean(options.replace))
  render()
  window.scrollTo({ top: 0, behavior: state.settings.reducedMotion ? "auto" : "smooth" })
}
function applyKuralRoute(params) {
  const view = ["list", "chapter", "detail"].includes(params.get("view")) ? params.get("view") : "home"
  const partId = params.get("part")
  const number = Number(params.get("kural"))
  const chapter = Number(params.get("chapter"))
  state.page = "kural"
  state.kuralView = view
  if (kuralParts.some((part) => part.id === partId)) state.kuralPart = partId
  if (["chapter", "detail"].includes(view) && Number.isInteger(chapter) && chapter >= 1 && chapter <= 133) {
    state.kuralChapter = chapter - 1
    state.kuralPart = kuralPartFor(state.kuralChapter * 10).id
  }
  if (view === "detail" && Number.isInteger(number) && number >= 1 && number <= 1330) {
    state.kuralIndex = number - 1
    state.kuralChapter = Math.floor(state.kuralIndex / 10)
    state.kuralPart = kuralPartFor(state.kuralIndex).id
  }
  saveState()
}
function setupLessonFeedbackSheet() {
  const feedback = app.querySelector('.learning-feedback, .quest-feedback')
  document.documentElement.classList.toggle('lesson-feedback-open', Boolean(feedback))
  if (!feedback) return
  const page = feedback.closest('.app-view')
  const action = feedback.querySelector('button.primary') || (feedback.nextElementSibling?.matches('button.primary') ? feedback.nextElementSibling : null)
  if (!action) return
  const layer = document.createElement('div')
  layer.className = 'lesson-feedback-layer'
  const sheet = document.createElement('section')
  sheet.className = 'lesson-feedback-sheet'
  sheet.setAttribute('role', 'dialog')
  sheet.setAttribute('aria-modal', 'true')
  sheet.setAttribute('aria-label', translateUiText('Résultat de ton défi'))
  if (feedback.matches('.is-wrong, .wrong')) sheet.classList.add('is-wrong')
  const content = document.createElement('div')
  content.className = 'lesson-feedback-content'
  const footer = document.createElement('div')
  footer.className = 'lesson-feedback-footer'
  footer.append(action)
  content.append(feedback)
  sheet.append(content, footer)
  layer.append(sheet)
  app.append(layer)
  if (page) page.inert = true
  layer.addEventListener('keydown', event => {
    if (event.key === 'Tab') { event.preventDefault(); action.focus() }
  })
  action.focus({preventScroll:true})
}
function render() {
  applyMotionPreference()
  applyVisualPreferences()
  const tourOpen = !state.onboardingSeen && state.page === "home"
  app.classList.toggle("tour-active", tourOpen)
  const storageMarkup = `<div id="storage-notice" class="storage-notice" role="alert" ${storageSaveFailed?'':'hidden'}>${fq('Ta progression ne peut pas être sauvegardée dans ce navigateur. Garde cet onglet ouvert pour ne pas perdre cette session.','Your progress cannot be saved in this browser. Keep this tab open to avoid losing this session.','Dein Fortschritt kann in diesem Browser nicht gespeichert werden. Lass diesen Tab geöffnet, damit diese Sitzung nicht verloren geht.')}</div>`
  app.innerHTML = `${currentView()}${modalView()}${tourView()}<div id="audio-notice" class="audio-notice" role="status" aria-live="polite">${audioNoticeText}</div>${storageMarkup}`
  translateRenderedInterface(app)
  setupLessonFeedbackSheet()
  document.title = `Thimoli — ${translateUiText(pageTitles[state.page] || "Accueil")}${window.THIMOLI_ALPHABET_AUDIO?.['அ']?.includes('pedagogical-local')?' · elevenlabs.io':''}`
  const modalClose = app.querySelector(".modal-close")
  if (modalClose) window.setTimeout(() => modalClose.focus(), 0)
  maybeSpeakCurrentLetter()
  setupWritingCanvas()
  fitTamilTiles()
}
function goTo(page, options = {}) {
  if (!validPages.includes(page)) return
  stopTamilAudio()
  if (page === "kural" && !options.fromPop) state.kuralView = "home"
  // Routing away and Back must not turn a running exam into a different lesson.
  // Only starting a new activity or selecting another village resets its context.
  state.page = page
  state.modal = null
  saveState()
  if (!options.fromPop) updateUrl(page, Boolean(options.replace))
  render()
  window.scrollTo({ top: 0, behavior: state.settings.reducedMotion ? "auto" : "smooth" })
}
function startPathNode(nodeIndex, villageIndex = state.currentVillage) {
  if (!isVillageUnlocked(villageIndex) || !Number.isInteger(nodeIndex) || nodeIndex < 0 || nodeIndex >= PATH_NODE_COUNT) return false
  if (!PREVIEW_UNLOCK_ALL && nodeIndex > state.pathProgress[villageIndex]) return false
  const node = pathNodesFor(villageIndex)[nodeIndex]
  if (!node) return false
  if (villageIndex !== state.currentVillage) state.reviewExamVillage = villageIndex
  state.currentVillage = villageIndex
  startLesson(node.type === "lesson" ? "parcours" : "Alphabet", nodeIndex)
  return true
}
function nextLessonStage() {
  const run = state.lessonRun
  if (state.page !== "lesson" || !run?.finalized || run.summary?.passed !== true || state.lesson < currentLessonQuestions().length) return null
  const contextKey = `${state.examKind || "path"}:${state.examVillage ?? state.currentVillage}:${state.activePathNode ?? "practice"}:${state.lessonMode}`
  if (run.contextKey !== contextKey) return null
  const context = currentLearningContext()
  if (!context.node && !context.exam && state.lessonMode !== "parcours") return null
  let villageIndex = context.villageIndex
  if (!isVillageUnlocked(villageIndex)) return null
  const progress = state.pathProgress[villageIndex]
  if (!Number.isInteger(progress) || progress < 0 || progress > PATH_NODE_COUNT) return null
  // A replay continues in order; exploration never jumps past an unfinished prerequisite.
  const nodeIndex = context.node ? Math.min(state.activePathNode + 1, progress) : progress
  if (nodeIndex < PATH_NODE_COUNT) return { villageIndex, nodeIndex }
  // Completing an exam practice alone does not earn any village or path progress.
  while (++villageIndex < villages.length) {
    if (!isVillageUnlocked(villageIndex)) return null
    const nextProgress = state.pathProgress[villageIndex]
    if (!Number.isInteger(nextProgress) || nextProgress < 0 || nextProgress > PATH_NODE_COUNT) return null
    if (nextProgress < PATH_NODE_COUNT) return { villageIndex, nodeIndex: nextProgress }
  }
  return null
}
function continueLessonStage() {
  const next = nextLessonStage()
  return next ? startPathNode(next.nodeIndex, next.villageIndex) : false
}
function startLesson(mode, pathNode = null) {
  stopTamilAudio()
  activityReset()
  state.examKind = null
  state.examVillage = null
  state.lessonMode = validLessonModes.includes(mode) ? mode : "parcours"
  state.activePathNode = Number.isInteger(pathNode) ? clamp(pathNode, 0, PATH_NODE_COUNT - 1) : null
  if (state.activePathNode === null && reviewItems.some((item) => item.name === state.lessonMode)) {
    state.foundationVisits = state.foundationVisits.filter((name) => name !== state.lessonMode).concat(state.lessonMode)
  }
  state.lesson = 0
  state.selected = null
  state.feedback = null
  state.showHint = false
  state.questionAttempts = 0
  state.heartLostThisQuestion = false
  state.matchLeft = null
  state.matchRight = null
  state.matchedPairs = []
  state.matchMistake = null
  state.writingResult = null
  state.lessonRun = null
  state.page = "lesson"
  lastAutoSpeechKey = ""
  ensureLessonRun()
  saveState()
  updateUrl("lesson")
  render()
  window.scrollTo(0, 0)
}
function startExam(kind, villageIndex) {
  if (!["mock", "final"].includes(kind) || !Number.isInteger(villageIndex)) return
  const access = examAccess(villageIndex)
  if (!access[kind]) return
  activityReset()
  state.examKind = kind
  state.examVillage = villageIndex
  state.lessonMode = kind === "mock" ? "Examen blanc" : "Examen du village"
  state.activePathNode = null
  state.lesson = 0
  state.selected = null
  state.feedback = null
  state.showHint = false
  state.questionAttempts = 0
  state.heartLostThisQuestion = false
  state.matchLeft = null
  state.matchRight = null
  state.matchedPairs = []
  state.matchMistake = null
  state.lessonRun = null
  state.page = "lesson"
  lastAutoSpeechKey = ""
  ensureLessonRun()
  saveState()
  updateUrl("lesson")
  render()
  window.scrollTo(0, 0)
}
function restartLesson() {
  activityReset()
  state.lesson = 0
  state.selected = null
  state.feedback = null
  state.showHint = false
  state.questionAttempts = 0
  state.heartLostThisQuestion = false
  state.matchLeft = null
  state.matchRight = null
  state.matchedPairs = []
  state.matchMistake = null
  state.lessonRun = null
  lastAutoSpeechKey = ""
  ensureLessonRun()
  saveState()
  render()
  window.scrollTo(0, 0)
}

let preferredTamilVoice = null
function selectTamilVoice() {
  const voices = window.speechSynthesis?.getVoices?.() || []
  const femaleNames = ["female", "vani", "veena", "lekha", "meena", "siri", "google தமிழ்", "tamil"]
  const maleNames = ["male", "ravi", "thomas"]
  const scored = voices.map((voice) => {
    const name = `${voice.name} ${voice.voiceURI}`.toLowerCase()
    const language = (voice.lang || "").toLowerCase()
    let score = language === "ta-in" ? 120 : language.startsWith("ta") ? 100 : 0
    if (!score) return { voice, score: -1 }
    if (voice.localService) score += 12
    if (femaleNames.some((item) => name.includes(item))) score += 24
    if (maleNames.some((item) => name.includes(item))) score -= 18
    if (/premium|enhanced|natural|neural/.test(name)) score += 20
    return { voice, score }
  }).filter((item) => item.score >= 0).sort((a, b) => b.score - a.score)
  preferredTamilVoice = scored[0]?.voice || null
  return preferredTamilVoice
}
function speakTamilWithDeviceVoice(cleanText) {
  if (!("speechSynthesis" in window) || typeof window.SpeechSynthesisUtterance !== "function") return
  const utterance = new window.SpeechSynthesisUtterance(cleanText)
  utterance.lang = "ta-IN"
  utterance.rate = cleanText.length > 42 ? 0.86 : 0.91
  utterance.pitch = 1.06
  utterance.volume = 0.96
  const tamilVoice = preferredTamilVoice || selectTamilVoice()
  if (tamilVoice) utterance.voice = tamilVoice
  utterance.onstart = () => document.documentElement.classList.add("voice-is-playing")
  utterance.onend = utterance.onerror = () => document.documentElement.classList.remove("voice-is-playing")
  window.speechSynthesis.cancel()
  window.speechSynthesis.resume()
  window.speechSynthesis.speak(utterance)
}
function audioNotice(message = "") {
  audioNoticeText = message
  const notice = app.querySelector("#audio-notice")
  if (notice) notice.textContent = message
}
function updateAudioPlayback(status, text = audioPlayback.text, source = audioPlayback.source) {
  audioPlayback = {status, text, source}
  const player = document.querySelector('#tamil-audio')
  if (player) { player.dataset.status = status; player.dataset.text = text; player.dataset.source = source }
  document.documentElement.classList.toggle('voice-is-playing', status === 'playing')
  app.querySelectorAll?.('[data-speak]').forEach(button => {
    const selected = String(button.dataset.speak).normalize('NFC').replace(/\$/g,'. ').replace(/\s+/g,' ').trim() === text
    const current = selected && ['loading','playing'].includes(status)
    button.classList.toggle('audio-is-active', current)
    button.setAttribute('aria-busy', String(current && status === 'loading'))
    button.dataset.audioStatus = selected ? status : 'idle'
  })
}
function stopTamilAudio() {
  audioRequestId++
  window.clearTimeout?.(audioLoadTimer)
  if (activeTamilAudio) {
    activeTamilAudio.onended = activeTamilAudio.onerror = activeTamilAudio.onplaying = activeTamilAudio.onwaiting = null
    activeTamilAudio.pause(); activeTamilAudio = null
  }
  window.speechSynthesis?.cancel?.()
  updateAudioPlayback('idle', '', '')
  audioNotice()
}
function speakTamil(text, naturalSourceOverride = "") {
  if (!text) return
  stopTamilAudio()
  const request = audioRequestId
  const cleanText = String(text).normalize("NFC").replace(/\$/g, ". ").replace(/\s+/g, " ").trim()
  // The checked index takes precedence over older hard-coded snippet references.
  const source = naturalAudioItems[cleanText] || naturalSourceOverride
  if (!source) {
    updateAudioPlayback('unavailable', cleanText, '')
    return audioNotice(fq("L’enregistrement de ce texte n’est pas disponible. Tu peux continuer sans écouter.", "This recording is not available. You can continue without audio.", "Diese Aufnahme ist nicht verfügbar. Du kannst ohne Ton fortfahren."))
  }
  try {
    // Reuse the same media element, synchronously in the tap, including on iOS.
    const audio = document.querySelector('#tamil-audio') || new Audio()
    activeTamilAudio = audio
    audio.src = window.__audioBundle?.[source] || source
    audio.preload = "auto"
    audio.playsInline = true
    audio.volume = 1
    audio.muted = false
    audio.playbackRate = 1
    updateAudioPlayback('loading', cleanText, source)
    const failure = (error) => {
      if (request !== audioRequestId || error?.name === "AbortError") return
      window.clearTimeout?.(audioLoadTimer)
      audio.pause()
      updateAudioPlayback('error')
      audioNotice(error?.name === 'NotAllowedError'
        ? fq("Touche à nouveau le haut-parleur pour autoriser l’écoute.", "Tap the speaker again to allow playback.", "Tippe erneut auf den Lautsprecher, um die Wiedergabe zu starten.")
        : fq("Le son n’a pas pu se charger. Vérifie ta connexion, puis touche le haut-parleur pour réessayer.", "Audio could not load. Check your connection, then tap the speaker to retry.", "Der Ton konnte nicht geladen werden. Prüfe die Verbindung und tippe erneut auf den Lautsprecher."))
    }
    audio.onplaying = () => { if(request === audioRequestId) { window.clearTimeout?.(audioLoadTimer); updateAudioPlayback('playing') } }
    audio.onwaiting = () => { if(request === audioRequestId) {
      updateAudioPlayback('loading')
      window.clearTimeout?.(audioLoadTimer)
      audioLoadTimer = window.setTimeout(() => { if(request === audioRequestId) failure() }, 12000)
    } }
    audio.onended = () => { if(request === audioRequestId) { window.clearTimeout?.(audioLoadTimer); updateAudioPlayback('ended'); activeTamilAudio = null } }
    audio.onerror = failure
    audioLoadTimer = window.setTimeout(() => { if(request === audioRequestId && audioPlayback.status==='loading') failure() }, 12000)
    const playback = audio.play()
    playback?.catch(failure)
  } catch (error) {
    updateAudioPlayback('error', cleanText, source)
    audioNotice(fq("La lecture audio est indisponible dans ce navigateur.", "Audio playback is unavailable in this browser.", "In diesem Browser ist keine Audiowiedergabe verfügbar."))
  }
}

if ("speechSynthesis" in window) {
  selectTamilVoice()
  window.speechSynthesis.addEventListener?.("voiceschanged", selectTamilVoice)
}
function playFeedbackTone(correct) {
  if (!state.settings.soundEffects) return
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext
    if (!AudioContext) return
    const context = new AudioContext()
    const oscillator = context.createOscillator()
    const gain = context.createGain()
    oscillator.frequency.value = correct ? 660 : 240
    gain.gain.setValueAtTime(0.045, context.currentTime)
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.14)
    oscillator.connect(gain)
    gain.connect(context.destination)
    oscillator.start()
    oscillator.stop(context.currentTime + 0.14)
    oscillator.addEventListener("ended", () => context.close())
  } catch (error) { /* Le retour visuel reste disponible sans Web Audio. */ }
}
function recordAnswer(question, answer, correct) {
  state.answerHistory.push({ timestamp: Date.now(), questionId: question.id, answer, correct, attempt: state.questionAttempts, village: state.examKind && Number.isInteger(state.examVillage) ? state.examVillage : state.currentVillage, mode: state.lessonMode })
  state.answerHistory = state.answerHistory.slice(-300)
}
function checkAnswer() {
  const question = currentLessonQuestions()[state.lesson]
  if (!question || state.selected === null || state.feedback) return
  const correct = state.selected === question.correct
  state.questionAttempts += 1
  state.lessonRun.totalChecks += 1
  if (correct) {
    state.feedback = "correct"
    state.lessonRun.correctAnswers += 1
    if (state.questionAttempts === 1) state.lessonRun.firstTryCorrect += 1
  } else {
    state.feedback = "wrong"
    state.lessonRun.wrongAnswers += 1
    if (state.questionAttempts >= 4 && !state.heartLostThisQuestion) {
      state.lives = Math.max(0, state.lives - 1)
      state.heartLostThisQuestion = true
    }
  }
  recordAnswer(question, state.selected, correct)
  playFeedbackTone(correct)
  saveState()
  render()
}
function retryQuestion() {
  const question = currentLessonQuestions()[state.lesson]
  state.selected = null
  state.feedback = null
  state.showHint = true
  lastAutoSpeechKey = ""
  saveState()
  render()
  if (question) window.setTimeout(() => speakTamil(question.speak || question.letter), 80)
}
function nextQuestion() {
  if (state.feedback !== "correct") return
  state.lesson += 1
  state.selected = null
  state.feedback = null
  state.showHint = false
  state.questionAttempts = 0
  state.heartLostThisQuestion = false
  lastAutoSpeechKey = ""
  saveState()
  render()
  window.scrollTo({ top: 0, behavior: state.settings.reducedMotion ? "auto" : "smooth" })
}

let lastAutoSpeechKey = ""
function maybeSpeakCurrentLetter() {
  if (state.lessonMode === 'Quêtes') return
  const questions = currentLessonQuestions()
  if (questions[state.lesson]?.type) return
  if (state.page !== "lesson" || state.feedback || !state.settings.autoPronunciation || state.lesson >= questions.length) return
  if (!Number.isInteger(state.activePathNode) && state.lessonMode !== "parcours" && !state.examKind) return
  const key = `${state.lessonMode}:${state.lesson}:${state.questionAttempts}`
  if (lastAutoSpeechKey === key) return
  lastAutoSpeechKey = key
  window.setTimeout(() => {
    if (state.page === "lesson" && state.lesson < questions.length) speakTamil(questions[state.lesson].speak || questions[state.lesson].letter)
  }, 120)
}
function openModal(type, index = null) {
  state.modal = type === "hearts" ? { type: "hearts" } : { type: "locked", index }
  render()
}
function closeModal() { state.modal = null; render() }

function selectMatch(side, index) {
  const pairs = currentMatchingPairs()
  if (!Number.isInteger(index) || !pairs[index] || state.matchedPairs.includes(index)) return
  if (state.matchMistake) {
    state.matchMistake = null
    state.matchLeft = null
    state.matchRight = null
  }
  state[side === "left" ? "matchLeft" : "matchRight"] = index
  if (state.matchLeft === null || state.matchRight === null) { saveState(); return render() }
  ensureLessonRun()
  state.lessonRun.totalChecks += 1
  const correct = state.matchLeft === state.matchRight
  const leftIndex = state.matchLeft
  const rightIndex = state.matchRight
  if (correct) {
    state.lessonRun.correctAnswers += 1
    state.lessonRun.firstTryCorrect += 1
    state.matchedPairs.push(leftIndex)
    state.matchLeft = null
    state.matchRight = null
  } else {
    state.lessonRun.wrongAnswers += 1
    state.matchMistake = { left: leftIndex, right: rightIndex }
  }
  state.answerHistory.push({ timestamp: Date.now(), questionId: `match-${state.currentVillage}-${leftIndex}`, answer: pairs[rightIndex].sound, correct, attempt: 1, village: state.currentVillage, mode: "Relier" })
  state.answerHistory = state.answerHistory.slice(-300)
  playFeedbackTone(correct)
  if (state.matchedPairs.length === pairs.length) state.lesson = currentLessonQuestions().length
  saveState()
  render()
}

function setupWritingCanvas() {
  const canvas = app.querySelector("#writing-canvas")
  if (!canvas) return
  const rect = canvas.getBoundingClientRect()
  const width = Math.max(260, Math.round(rect.width))
  const height = Math.max(260, Math.round(rect.height))
  const dpr = Math.min(2, window.devicePixelRatio || 1)
  canvas.width = Math.round(width * dpr)
  canvas.height = Math.round(height * dpr)
  const visible = canvas.getContext("2d", { willReadFrequently: true })
  const inkCanvas = document.createElement("canvas")
  inkCanvas.width = canvas.width
  inkCanvas.height = canvas.height
  const ink = inkCanvas.getContext("2d", { willReadFrequently: true })
  visible.setTransform(dpr, 0, 0, dpr, 0, 0)
  ink.setTransform(dpr, 0, 0, dpr, 0, 0)
  const targetLetter = canvas.dataset.letter || "அ"
  const guided = canvas.dataset.guided === "true"
  let fontSize = Math.round(width * 0.6)
  const fitFont = () => {
    fontSize = Math.round(width * 0.6)
    visible.font = `700 ${fontSize}px "Noto Sans Tamil", "Nirmala UI", sans-serif`
    const measuredWidth = visible.measureText(targetLetter).width
    if (measuredWidth > width * 0.8) fontSize = Math.max(18, Math.floor(fontSize * ((width * 0.8) / measuredWidth)))
    if(canvas.__drawingMeta) canvas.__drawingMeta.fontSize = fontSize
  }
  fitFont()
  const preparePen = (context) => {
    context.lineWidth = Math.max(5, Math.min(width * 0.033, fontSize * 0.13))
    context.lineCap = "round"
    context.lineJoin = "round"
    context.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--orange").trim() || "#ff6737"
  }
  preparePen(visible)
  preparePen(ink)
  const redraw = () => {
    visible.clearRect(0, 0, width, height)
    if (guided) {
      visible.save()
      visible.font = `700 ${fontSize}px "Noto Sans Tamil", "Nirmala UI", sans-serif`
      visible.textAlign = "center"
      visible.textBaseline = "middle"
      visible.fillStyle = "rgba(75, 145, 189, 0.10)"
      visible.strokeStyle = "rgba(75, 145, 189, 0.24)"
      visible.lineWidth = 2
      visible.fillText(targetLetter, width / 2, height * 0.54)
      visible.strokeText(targetLetter, width / 2, height * 0.54)
      visible.restore()
    } else {
      visible.save()
      visible.strokeStyle = "rgba(126, 140, 150, 0.16)"
      visible.setLineDash([5, 7])
      visible.lineWidth = 1
      visible.beginPath()
      visible.moveTo(width * 0.16, height * 0.78)
      visible.lineTo(width * 0.84, height * 0.78)
      visible.stroke()
      visible.restore()
    }
    visible.save()
    visible.setTransform(1, 0, 0, 1, 0, 0)
    visible.drawImage(inkCanvas, 0, 0)
    visible.restore()
    preparePen(visible)
  }
  canvas.__inkCanvas = inkCanvas
  canvas.__inkCount = 0
  canvas.__drawingMeta = { width, height, dpr, fontSize, targetLetter }
  canvas.__redraw = redraw
  let drawing = false
  let lastPoint = null
  const pointFor = (event) => {
    const bounds = canvas.getBoundingClientRect()
    return { x: event.clientX - bounds.left, y: event.clientY - bounds.top }
  }
  canvas.addEventListener("pointerdown", (event) => {
    event.preventDefault()
    drawing = true
    lastPoint = pointFor(event)
    canvas.setPointerCapture?.(event.pointerId)
    ink.beginPath()
    ink.moveTo(lastPoint.x, lastPoint.y)
    ink.lineTo(lastPoint.x + 0.01, lastPoint.y + 0.01)
    ink.stroke()
    canvas.__inkCount += 1
    redraw()
  })
  canvas.addEventListener("pointermove", (event) => {
    if (!drawing) return
    event.preventDefault()
    const point = pointFor(event)
    ink.beginPath()
    ink.moveTo(lastPoint.x, lastPoint.y)
    ink.lineTo(point.x, point.y)
    ink.stroke()
    lastPoint = point
    canvas.__inkCount += 1
    redraw()
  })
  const stopDrawing = () => { drawing = false; lastPoint = null }
  canvas.addEventListener("pointerup", stopDrawing)
  canvas.addEventListener("pointercancel", stopDrawing)
  canvas.addEventListener("pointerleave", stopDrawing)
  const ready = document.fonts?.ready || Promise.resolve()
  ready.then(() => { fitFont(); preparePen(ink); redraw() }).catch(redraw)
}

function clearWritingCanvas() {
  const canvas = app.querySelector("#writing-canvas")
  if (!canvas?.__inkCanvas) return
  const context = canvas.__inkCanvas.getContext("2d")
  context.setTransform(1, 0, 0, 1, 0, 0)
  context.clearRect(0, 0, canvas.__inkCanvas.width, canvas.__inkCanvas.height)
  const dpr = canvas.__drawingMeta?.dpr || 1
  context.setTransform(dpr, 0, 0, dpr, 0, 0)
  canvas.__inkCount = 0
  canvas.classList.remove("is-success", "is-almost", "is-retry")
  state.writingResult = null
  canvas.__redraw?.()
  const feedback = app.querySelector("#writing-feedback")
  if (feedback) { feedback.className = "writing-feedback"; feedback.innerHTML = "<span>Commence à tracer dans la zone.</span>" }
}

function validateWritingCanvas() {
  const canvas = app.querySelector("#writing-canvas")
  const feedback = app.querySelector("#writing-feedback")
  if (!canvas?.__inkCanvas || !feedback) return
  if (canvas.__inkCount < 8) {
    state.writingResult = { kind: "retry", title: "Continue ton tracé", copy: "La lettre n’est pas encore complète." }
  } else {
    const { width, height, dpr, fontSize, targetLetter } = canvas.__drawingMeta
    const makeMask = () => {
      const mask = document.createElement("canvas")
      mask.width = canvas.width
      mask.height = canvas.height
      return mask
    }
    const drawTarget = (mask, tolerance = 0) => {
      const context = mask.getContext("2d", { willReadFrequently: true })
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      context.font = `700 ${fontSize}px "Noto Sans Tamil", "Nirmala UI", sans-serif`
      context.textAlign = "center"
      context.textBaseline = "middle"
      context.fillStyle = "#000"
      context.strokeStyle = "#000"
      context.lineJoin = "round"
      if (tolerance > 0) {
        context.lineWidth = tolerance * 2
        context.strokeText(targetLetter, width / 2, height * 0.54)
      }
      context.fillText(targetLetter, width / 2, height * 0.54)
      return context
    }
    const targetCoreCanvas = makeMask()
    const targetToleranceCanvas = makeMask()
    const toleranceCss = Math.max(4, Math.min(width * 0.018, fontSize * 0.07))
    const targetCore = drawTarget(targetCoreCanvas)
    const targetTolerance = drawTarget(targetToleranceCanvas, toleranceCss)
    const userToleranceCanvas = makeMask()
    const userToleranceContext = userToleranceCanvas.getContext("2d", { willReadFrequently: true })
    const tolerancePixels = Math.max(5, Math.round(toleranceCss * dpr))
    const offsetStep = Math.max(3, Math.round(tolerancePixels / 2))
    for (let x = -tolerancePixels; x <= tolerancePixels; x += offsetStep) {
      for (let y = -tolerancePixels; y <= tolerancePixels; y += offsetStep) {
        if ((x * x) + (y * y) <= tolerancePixels * tolerancePixels * 1.2) userToleranceContext.drawImage(canvas.__inkCanvas, x, y)
      }
    }
    const userPixels = canvas.__inkCanvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height).data
    const userTolerancePixels = userToleranceContext.getImageData(0, 0, canvas.width, canvas.height).data
    const targetCorePixels = targetCore.getImageData(0, 0, canvas.width, canvas.height).data
    const targetTolerancePixels = targetTolerance.getImageData(0, 0, canvas.width, canvas.height).data
    let userCount = 0
    let targetCount = 0
    let userOnTarget = 0
    let targetCovered = 0
    let minX = canvas.width
    let maxX = 0
    let minY = canvas.height
    let maxY = 0
    let targetMinX = canvas.width
    let targetMaxX = 0
    let targetMinY = canvas.height
    let targetMaxY = 0
    for (let index = 3; index < userPixels.length; index += 4) {
      const pixel = (index - 3) / 4
      const x = pixel % canvas.width
      const y = Math.floor(pixel / canvas.width)
      if (userPixels[index] >= 24) {
        userCount += 1
        if (targetTolerancePixels[index] >= 12) userOnTarget += 1
        minX = Math.min(minX, x); maxX = Math.max(maxX, x); minY = Math.min(minY, y); maxY = Math.max(maxY, y)
      }
      if (targetCorePixels[index] >= 24) {
        targetCount += 1
        if (userTolerancePixels[index] >= 12) targetCovered += 1
        targetMinX = Math.min(targetMinX, x); targetMaxX = Math.max(targetMaxX, x); targetMinY = Math.min(targetMinY, y); targetMaxY = Math.max(targetMaxY, y)
      }
    }
    const precision = userCount ? userOnTarget / userCount : 0
    const coverage = targetCount ? targetCovered / targetCount : 0
    const shapeScore = precision + coverage ? (2 * precision * coverage) / (precision + coverage) : 0
    const userWidth = Math.max(1, maxX - minX)
    const userHeight = Math.max(1, maxY - minY)
    const targetWidth = Math.max(1, targetMaxX - targetMinX)
    const targetHeight = Math.max(1, targetMaxY - targetMinY)
    const widthMatch = Math.min(userWidth, targetWidth) / Math.max(userWidth, targetWidth)
    const heightMatch = Math.min(userHeight, targetHeight) / Math.max(userHeight, targetHeight)
    const centerDistance = Math.hypot((minX + maxX - targetMinX - targetMaxX) / 2, (minY + maxY - targetMinY - targetMaxY) / 2)
    const centerMatch = Math.max(0, 1 - centerDistance / Math.max(targetWidth, targetHeight, canvas.width * 0.2))
    const boundsScore = widthMatch * 0.34 + heightMatch * 0.34 + centerMatch * 0.32
    const inkRatio = targetCount ? userCount / targetCount : 0
    const score = Math.round((shapeScore * 0.68 + precision * 0.2 + boundsScore * 0.12) * 100)
    const success = score >= 74 && precision >= 0.62 && coverage >= 0.56 && boundsScore >= 0.62 && inkRatio >= 0.4 && inkRatio <= 1.85
    const almost = score >= 62 && precision >= 0.5 && coverage >= 0.44 && boundsScore >= 0.52 && inkRatio >= 0.3 && inkRatio <= 2.1
    state.writingResult = success
      ? { kind: "success", title: `Très bien · ${score}%`, copy: "La forme et les proportions sont bien reconnues." }
      : almost
        ? { kind: "almost", title: `Presque · ${score}%`, copy: "La forme est proche. Corrige les courbes et les proportions." }
        : { kind: "retry", title: `À reprendre · ${score}%`, copy: "Ce tracé ne correspond pas encore au modèle. Observe sa forme puis réessaie." }
  }
  const result = state.writingResult
  if (result.kind === 'success' && canvas.dataset.guided === 'true') {
    const text = canvas.__drawingMeta.targetLetter
    if (!state.writingTraced.includes(text)) state.writingTraced.push(text)
    saveState()
  }
  feedback.className = `writing-feedback is-${result.kind}`
  feedback.innerHTML = `<strong>${result.title}</strong><span>${result.copy}</span>`
  canvas.classList.remove("is-success", "is-almost", "is-retry")
  canvas.classList.add(`is-${result.kind}`)
  playFeedbackTone(result.kind === "success")
}

app.addEventListener("click", (event) => {
  const target = event.target.closest("button, [data-close-modal]")
  if (!target) return
  if (alphabetReviewHandle(target)) return
  if (foundationHandle(target)) return
  if (target.hasAttribute('data-village-resume')) {
    if (villageHasRunningMission()) return goTo('lesson')
    return
  }
  if (kuralPracticeHandle(target)) return
  if (activityHandle(target)) return
  if (target.classList.contains("modal-backdrop") && event.target !== target) return
  if (target.hasAttribute("data-close-modal")) return closeModal()
  if (target.hasAttribute("data-tour-skip")) { state.onboardingSeen = true; state.tourStep = 0; saveState(); return render() }
  if (target.hasAttribute("data-tour-next")) {
    if (state.tourStep < tourSteps.length - 1) state.tourStep += 1
    else { state.onboardingSeen = true; state.tourStep = 0 }
    saveState()
    return render()
  }
  if (target.hasAttribute("data-tour-replay")) {
    state.onboardingSeen = false
    state.tourStep = 0
    saveState()
    return goTo("home")
  }
  if (target.dataset.matchLeft !== undefined) return selectMatch("left", Number(target.dataset.matchLeft))
  if (target.dataset.matchRight !== undefined) return selectMatch("right", Number(target.dataset.matchRight))
  if (target.dataset.alphabetGroup) {
    if (!["vowels", "consonants", "syllables"].includes(target.dataset.alphabetGroup)) return
    state.alphabetGroup = target.dataset.alphabetGroup
    if (state.alphabetGroup !== "syllables") state.alphabetLetter = alphabetGroups[state.alphabetGroup][0].letter
    saveState()
    return render()
  }
  if (target.dataset.alphabetLetter) {
    state.alphabetLetter = target.dataset.alphabetLetter
    saveState()
    render()
    return speakTamil(target.dataset.alphabetLetter)
  }
  if (target.dataset.syllableConsonant) {
    state.syllableConsonant = target.dataset.syllableConsonant
    saveState()
    render()
    return speakTamil(target.dataset.syllableConsonant)
  }
  if (target.dataset.pronunciationIndex !== undefined) {
    const index = Number(target.dataset.pronunciationIndex)
    if (!Number.isInteger(index) || index < 0 || index >= pronunciationPairs.length) return
    state.pronunciationIndex = index
    state.pronunciationTarget = "short"
    saveState()
    return render()
  }
  if (target.dataset.pronunciationTarget) {
    if (!["short", "long"].includes(target.dataset.pronunciationTarget)) return
    state.pronunciationTarget = target.dataset.pronunciationTarget
    saveState()
    return render()
  }
  if (target.hasAttribute("data-pronunciation-next")) {
    state.pronunciationIndex = (state.pronunciationIndex + 1) % pronunciationPairs.length
    state.pronunciationTarget = "short"
    saveState()
    return render()
  }
  if (target.dataset.writingGuide !== undefined) {
    state.writingGuided = target.dataset.writingGuide === "true"
    state.writingResult = null
    saveState()
    return render()
  }
  if (target.dataset.writingPick !== undefined) {
    const index = Number(target.dataset.writingPick)
    if (!Number.isInteger(index) || !writingCurriculum[state.writingLevel]?.items[index]) return
    state.writingLetterIndex = index
    state.writingResult = null
    saveState();return render()
  }
  if (target.dataset.writingLevel !== undefined) {
    const level = Number(target.dataset.writingLevel)
    if (!Number.isInteger(level) || level < 0 || level >= writingCurriculum.length || (!PREVIEW_UNLOCK_ALL && level > state.currentVillage)) return
    state.writingLevel = level
    state.writingLetterIndex = 0
    state.writingResult = null
    saveState()
    return render()
  }
  if (target.dataset.writingNav !== undefined) {
    const direction = Number(target.dataset.writingNav)
    const items = writingCurriculum[state.writingLevel]?.items || writingCurriculum[0].items
    state.writingLetterIndex = (state.writingLetterIndex + direction + items.length) % items.length
    state.writingResult = null
    saveState()
    return render()
  }
  if (target.hasAttribute("data-writing-clear")) return clearWritingCanvas()
  if (target.hasAttribute("data-writing-validate")) return validateWritingCanvas()
  if (target.dataset.vocabularyCategory) {
    if (!vocabularySets.some((set) => set.id === target.dataset.vocabularyCategory)) return
    state.vocabularyCategory = target.dataset.vocabularyCategory
    saveState()
    return render()
  }
  if (target.hasAttribute("data-reload-kural")) return loadKuralResources()
  if (target.hasAttribute("data-kural-more")) {
    state.kuralIntroExpanded = !state.kuralIntroExpanded
    return render()
  }
  if (target.dataset.kuralBack) {
    if (target.dataset.kuralBack === "home") return openKuralView("home", { replace: true })
    if (target.dataset.kuralBack === "list") return openKuralView("list", { part: state.kuralPart, replace: true })
    if (target.dataset.kuralBack === "chapter") return openKuralView("chapter", { chapter: state.kuralChapter, replace: true })
    return
  }
  if (target.dataset.kuralPart) {
    const part = kuralParts.find((item) => item.id === target.dataset.kuralPart)
    if (!part) return
    return openKuralView("list", { part: part.id, index: part.start })
  }
  if (target.dataset.kuralChapterIndex !== undefined) {
    const chapter = Number(target.dataset.kuralChapterIndex)
    if (!Number.isInteger(chapter) || chapter < 0 || chapter >= 133) return
    return openKuralView("chapter", { chapter })
  }
  if (target.dataset.kuralIndex !== undefined) {
    const index = Number(target.dataset.kuralIndex)
    if (!Number.isInteger(index) || index < 0 || index >= 1330) return
    return openKuralView("detail", { index })
  }
  if (target.dataset.kuralNav !== undefined) {
    const chapterStart = Math.floor(state.kuralIndex / 10) * 10
    const nextIndex = clamp(state.kuralIndex + Number(target.dataset.kuralNav), chapterStart, chapterStart + 9)
    return openKuralView("detail", { index: nextIndex })
  }
  if (target.hasAttribute("data-open-path")) return goTo("path")
  if (target.dataset.reviewExamNav !== undefined) {
    const direction = Number(target.dataset.reviewExamNav)
    if (![1, -1].includes(direction)) return
    state.reviewExamVillage = clamp(state.reviewExamVillage + direction, 0, villages.length - 1)
    saveState()
    return render()
  }
  if (target.dataset.startExam) {
    const villageIndex = Number(target.dataset.examVillage)
    return startExam(target.dataset.startExam, villageIndex)
  }
  if (target.dataset.pathNode !== undefined) {
    return startPathNode(Number(target.dataset.pathNode))
  }
  if (target.hasAttribute("data-next-lesson-stage")) return continueLessonStage()
  if (target.hasAttribute("data-return-path")) {
    state.activePathNode = null
    state.lessonRun = null
    return goTo("path")
  }
  if (target.dataset.go) return goTo(target.dataset.go)
  if (target.dataset.startLesson) return startLesson(target.dataset.startLesson)
  if (target.dataset.review) return startLesson(target.dataset.review)
  if (target.hasAttribute("data-restart-lesson")) return restartLesson()
  if (target.dataset.village !== undefined) {
    const index = Number(target.dataset.village)
    if (!Number.isInteger(index) || !isVillageUnlocked(index)) return
    state.currentVillage = index
    state.examKind = null
    state.examVillage = null
    state.feedback = null
    state.questionAttempts = 0
    activityReset()
    state.reviewExamVillage = index
    state.lesson = 0
    state.lessonRun = null
    state.activePathNode = null
    saveState()
    return goTo("home")
  }
  if (target.dataset.locked !== undefined) {
    const index = Number(target.dataset.locked)
    if (Number.isInteger(index) && villages[index]) openModal("locked", index)
    return
  }
  if (target.dataset.modal === "hearts") return openModal("hearts")
  if (target.dataset.language) {
    if (!phoneticLanguages.some((language) => language.id === target.dataset.language)) return
    state.settings.language = target.dataset.language
    saveState()
    return render()
  }
  if (["light", "dark", "system"].includes(target.dataset.theme)) {
    state.settings.theme = target.dataset.theme
    saveState()
    return render()
  }
  if (target.dataset.setting) {
    const name = target.dataset.setting
    if (!Object.prototype.hasOwnProperty.call(state.settings, name)) return
    state.settings[name] = !state.settings[name]
    saveState()
    return render()
  }
  if (target.dataset.speak) return speakTamil(target.dataset.speak, target.dataset.naturalAudio)
  if (target.dataset.answer !== undefined) {
    if (state.feedback) return
    const answer = Number(target.dataset.answer)
    if (!Number.isInteger(answer)) return
    state.selected = answer
    saveState()
    return render()
  }
  if (target.hasAttribute("data-hint")) { state.showHint = true; const q = currentLessonQuestions()[state.lesson]; if (q?.type) activityResponse(q).helpUsed = true; saveState(); return render() }
  if (target.hasAttribute("data-check-answer")) return checkAnswer()
  if (target.hasAttribute("data-retry")) return retryQuestion()
  if (target.hasAttribute("data-next-question")) nextQuestion()
})

app.addEventListener("input", activityInput)
app.addEventListener("toggle", (event) => {
  if(event.target.open && event.target.classList?.contains('quest-help') && state.foundationRun && state.lessonMode==='Quêtes') { state.foundationRun.assisted=true; saveState(); return }
  if (!event.target.open || !event.target.classList?.contains("study-more") || state.page !== "lesson" || !state.studyStarted && currentLearningContext().node?.type === "lesson") return
  const question = currentLessonQuestions()[state.lesson]
  if (question?.type && !state.feedback) { activityResponse(question).helpUsed = true; saveState() }
}, true)
app.addEventListener("change", (event) => {
  if(event.target.matches('[data-writing-family]')) {
    const index = Number(event.target.value)
    if(!Number.isInteger(index) || !alphabetGroups.consonants[index])return
    state.writingLetterIndex=index*12;state.writingResult=null;saveState();return render()
  }
  if(event.target.matches('[data-sound-family]')) {
    if(!alphabetGroups.consonants.some(item=>item.letter===event.target.value))return
    state.syllableConsonant=event.target.value;saveState();return render()
  }
  if (!event.target.matches("[data-daily-goal]")) return
  const value = Number(event.target.value)
  if (![5, 10, 15, 20].includes(value)) return
  state.settings.dailyGoal = value
  saveState()
  render()
})
window.addEventListener("popstate", () => {
  const params = new URLSearchParams(location.search)
  const page = params.get("page")
  if (page === "kural") {
    applyKuralRoute(params)
    render()
    return window.scrollTo({ top: 0, behavior: "auto" })
  }
  goTo(validPages.includes(page) ? page : "home", { fromPop: true })
})
window.addEventListener("keydown", (event) => { if (event.key === "Escape" && state.modal) closeModal() })

applyMotionPreference()
applyVisualPreferences()
updateUrl(state.page, true)
saveState()
render()

async function loadKuralResources() {
  kuralLoadState = "loading"
  if (state.page === "kural" && state.kuralView === "detail") render()
  const loadText = (url) => fetch(url).then((response) => {
    if (!response.ok) throw new Error(`Chargement impossible : ${url}`)
    return response.text()
  })
  const [versesResult, chaptersResult] = await Promise.allSettled([
    loadText("assets/data/thirukkural.txt"),
    loadText("assets/data/thirukkural-chapters.txt")
  ])
  if (versesResult.status === "fulfilled") kuralVerses = versesResult.value.split(/\r?\n/).filter(Boolean)
  if (chaptersResult.status === "fulfilled") kuralChapters = chaptersResult.value.split(/\r?\n/).filter(Boolean)
  kuralLoadState = kuralVerses.length === 1330 ? "ready" : "error"
  if (state.page === "kural") render()
}

fetch("assets/audio/manifest.json").then(response => { if(!response.ok)throw new Error('audio manifest'); return response.json() }).then(data => { naturalAudioItems = {...data.items, ...(window.THIMOLI_SPEECH_AUDIO || {}), ...(window.THIMOLI_ALPHABET_AUDIO || {})} }).catch(() => { /* Checked letters and lesson words remain available from the preloaded indexes. */ })
loadKuralResources()
