/* Original Thimoli activities. Historical Valar assessments inform formats,
   not an asserted reproduction of the twelve textbooks. See PEDAGOGIE_VALAR.md. */
(function (root, factory) {
  const api = factory()
  if (typeof module === "object" && module.exports) module.exports = api
  else root.THIMOLI_LEARNING = api
})(typeof window === "object" ? window : globalThis, function () {
  "use strict"
  const version = 3
  const normalize = (text) => String(text || "").normalize("NFC").replace(/[.,!?;:…।]/g, "").replace(/\s+/g, " ").trim()
  // Keep Tamil vowel signs and pulli attached to their base; never split code units.
  const letters = (text) => Array.from(String(text).normalize("NFC")).reduce((out, char) => {
    if (/\p{M}/u.test(char) && out.length) out[out.length - 1] += char
    else out.push(char)
    return out
  }, [])
  const units = (text) => normalize(text).includes(" ") ? normalize(text).split(" ") : letters(normalize(text))
  function shuffle(values, seed = 1) {
    const result = values.slice()
    let n = (seed + 17) >>> 0
    for (let i = result.length - 1; i > 0; i--) {
      n = (Math.imul(n, 1664525) + 1013904223) >>> 0
      const j = Math.floor(n / 4294967296 * (i + 1))
      ;[result[i], result[j]] = [result[j], result[i]]
    }
    if (result.length > 1 && result.every((v, i) => v === values[i])) result.push(result.shift())
    return result
  }
  const packs = [
    {
      title: "Voyelles courtes et longues", rule: "அ, இ, உ, எ, ஒ sont des voyelles brèves. ஆ, ஈ, ஊ, ஏ, ஓ sont longues. ஐ et ஔ sont des diphtongues : elles ne figurent pas dans ce tri.",
      categories: ["Courte", "Longue"], groups: [["அ",0],["ஆ",1],["இ",0],["ஈ",1]],
      sentence: ["இது என் வீடு", "c’est ma maison"],
      text: "இது என் வீடு. இது என் அம்மா.", question: "Recopie le mot qui désigne la maison.", answer: "வீடு", reason: "வீடு désigne la maison ; அம்மா désigne maman."
    },
    {
      title: "Des noms et des actions", rule: "Un nom sert à nommer, un verbe exprime ici une action. Dans ces exemples, les formes en -கிறேன் décrivent ce que je fais au présent.",
      categories: ["Nom", "Verbe"], groups: [["பள்ளி",0],["புத்தகம்",0],["படிக்கிறேன்",1],["எழுதுகிறேன்",1]],
      sentence: ["நான் புத்தகம் படிக்கிறேன்", "je lis un livre"],
      text: "இது என் பள்ளி. நான் புத்தகம் படிக்கிறேன். நான் தமிழ் எழுதுகிறேன்.", question: "Quelle langue est écrite ? Recopie son nom.", answer: "தமிழ்", reason: "La dernière phrase indique : j’écris en tamoul."
    },
    {
      title: "Le sujet et le verbe", rule: "Dans ces phrases, la fin du verbe permet de retrouver le sujet : -கிறேன் avec நான் (je), -கிறாள் avec அவள் (elle).",
      categories: ["Je · நான்", "Elle · அவள்"], groups: [["படிக்கிறேன்",0],["பாடுகிறாள்",1],["எழுதுகிறேன்",0],["வருகிறாள்",1]],
      sentence: ["அவள் வீட்டில் பாடுகிறாள்", "elle chante à la maison"],
      text: "அக்கா வீட்டில் இருக்கிறாள். அவள் பாடுகிறாள். தம்பி பள்ளியில் இருக்கிறான்.", question: "Qui chante ? Recopie le nom de cette personne dans le texte.", answer: "அக்கா", reason: "அவள் reprend அக்கா, la grande sœur."
    },
    {
      title: "Présent et passé", rule: "Compare les formes entières : சாப்பிடுகிறேன் (je mange) / சாப்பிட்டேன் (j’ai mangé), வருகிறாள் (elle vient) / வந்தாள் (elle est venue).",
      categories: ["Présent", "Passé"], groups: [["சாப்பிடுகிறேன்",0],["சாப்பிட்டேன்",1],["வருகிறாள்",0],["வந்தாள்",1]],
      sentence: ["நேற்று அவள் மாம்பழம் சாப்பிட்டாள்", "hier, elle a mangé une mangue"],
      text: "நேற்று மழை பெய்தது. இன்று வெயில் அடிக்கிறது. தோட்டத்தில் ஒரு மரம் இருக்கிறது.", question: "Quel mot situe la pluie dans le passé ? Recopie-le.", answer: "நேற்று", reason: "நேற்று signifie hier ; இன்று signifie aujourd’hui."
    },
    {
      title: "Quantité et prix", rule: "Une quantité répond à « combien d’objets ? ». Un prix indique combien payer. கிலோ mesure une masse ; யூரோ nomme ici la monnaie.",
      categories: ["Quantité", "Prix"], groups: [["ஒரு கிலோ",0],["இரண்டு கிலோ",0],["ஐந்து யூரோ",1],["பத்து யூரோ",1]],
      sentence: ["எனக்கு ஒரு கிலோ அரிசி வேண்டும்", "je voudrais un kilo de riz"],
      text: "அம்மா சந்தைக்குச் சென்றாள். அவள் இரண்டு கிலோ அரிசி வாங்கினாள். பிறகு வீட்டிற்கு வந்தாள்.", question: "Quelle quantité de riz a-t-elle achetée ? Recopie les deux mots.", answer: "இரண்டு கிலோ", reason: "இரண்டு கிலோ signifie deux kilos. L’information est dans la deuxième phrase."
    },
    {
      title: "Passé et futur", rule: "Ne transforme pas un temps par un simple échange de lettres. Compare les formes entières : படித்தேன் (j’ai lu), எழுதினேன் (j’ai écrit), படிப்பேன் (je lirai), எழுதுவேன் (j’écrirai).",
      categories: ["Passé", "Futur"], groups: [["படித்தேன்",0],["எழுதினேன்",0],["படிப்பேன்",1],["எழுதுவேன்",1]],
      sentence: ["நாளை நான் ஒரு கடிதம் எழுதுவேன்", "demain, j’écrirai une lettre"],
      text: "நேற்று நான் ஒரு புத்தகம் படித்தேன். அதில் மரங்களைப் பற்றிய தகவல்கள் இருந்தன. நாளை அதைப் பற்றி எழுதுவேன்.", question: "De quoi parlait le livre ? Recopie la forme du nom utilisée dans le texte.", answer: "மரங்களைப்", reason: "மரங்களைப் பற்றிய signifie à propos des arbres. Le texte indique le sujet du livre.",
      writing: "Présente ta journée d’école en 3 à 5 phrases tamoules : un cours, une activité passée et ce que tu feras demain.", model: "நான் பள்ளியில் தமிழ் படிக்கிறேன். நேற்று ஒரு கதை படித்தேன். நாளை ஒரு கடிதம் எழுதுவேன்."
    },
    {
      title: "Une personne ou plusieurs", rule: "Observe le sujet et la terminaison ensemble. Ici, அவன் désigne un garçon ; அவர்கள் désigne plusieurs personnes. Hors de ces exemples, அவர்கள் peut aussi être une forme de respect.",
      categories: ["Une personne", "Plusieurs personnes"], groups: [["அவன் வந்தான்",0],["அவர்கள் வந்தார்கள்",1],["அவன் பாடினான்",0],["அவர்கள் பாடினார்கள்",1]],
      sentence: ["நாங்கள் பொங்கல் விழாவில் பாடினோம்", "nous avons chanté à la fête de Pongal"],
      text: "பொங்கல் விழாவில் குழந்தைகள் பாடினார்கள். பெற்றோர் கைதட்டினார்கள். அனைவரும் மகிழ்ந்தார்கள்.", question: "Qui a chanté ? Recopie le sujet du premier verbe.", answer: "குழந்தைகள்", reason: "குழந்தைகள் (les enfants) est le sujet de பாடினார்கள் (ont chanté).",
      writing: "Raconte une fête en 4 à 6 phrases au passé. Indique qui était présent, deux actions et ton impression.", model: "நாங்கள் பொங்கல் விழாவிற்குச் சென்றோம். குழந்தைகள் பாடினார்கள். பெற்றோர் கைதட்டினார்கள். அனைவரும் மகிழ்ந்தார்கள்."
    },
    {
      title: "Condition et conséquence", rule: "Une forme en -ஆல் peut introduire une condition. Compare மழை பெய்தால் (s’il pleut) avec வீட்டில் இருப்போம் (nous resterons à la maison).",
      categories: ["Condition", "Résultat possible"], groups: [["மழை பெய்தால்",0],["நேரம் இருந்தால்",0],["வீட்டில் இருப்போம்",1],["பயணம் செய்வோம்",1]],
      sentence: ["மழை பெய்தால் நாங்கள் வீட்டில் இருப்போம்", "s’il pleut, nous resterons à la maison"],
      text: "மழை பெய்தால் நாங்கள் வீட்டில் இருப்போம். வெயில் அடித்தால் கடற்கரைக்குச் செல்வோம்.", question: "Où irons-nous s’il fait soleil ? Recopie la forme du lieu dans le texte.", answer: "கடற்கரைக்குச்", reason: "கடற்கரைக்குச் செல்வோம் signifie nous irons à la plage.",
      writing: "Décris un lieu en 5 à 7 phrases. Situe-le, donne deux détails précis et ajoute une phrase avec une condition.", model: "எங்கள் ஊரில் ஒரு பூங்கா இருக்கிறது. அங்கு பல மரங்கள் உள்ளன. வெயில் அடித்தால் நாங்கள் பூங்காவிற்குச் செல்வோம்."
    },
    {
      title: "Cause et opposition", rule: "ஏனெனில் annonce une raison ; ஆனால் et இருந்தாலும் marquent une opposition ou une concession. இதனால் annonce une conséquence.",
      categories: ["Cause / conséquence", "Opposition"], groups: [["ஏனெனில்",0],["இதனால்",0],["ஆனால்",1],["இருந்தாலும்",1]],
      sentence: ["மழை பெய்தது ஆனால் நாங்கள் சென்றோம்", "il a plu, mais nous y sommes allés"],
      text: "நூலகம் சிறியது. ஆனால் அங்கு பல நல்ல புத்தகங்கள் உள்ளன. மாணவர்கள் தினமும் அங்கு வருகிறார்கள்.", question: "Quel mot oppose la petite taille du lieu à sa richesse ?", answer: "ஆனால்", reason: "ஆனால் signifie mais et relie les deux idées en les opposant.",
      writing: "Donne ton avis sur la bibliothèque en 6 à 8 phrases : une opinion, deux raisons, un exemple et une limite.", model: "என் கருத்தில் நூலகம் மிகவும் பயனுள்ளது. அங்கு பல புத்தகங்கள் உள்ளன. ஆனால் அது சிறியது. பெரிய நூலகம் வேண்டும்."
    },
    {
      title: "Projet ou action achevée", rule: "Distingue la valeur temporelle de toute la forme verbale : கற்றேன் / கற்பேன், செய்தோம் / செய்வோம். Le futur n’a pas une seule terminaison valable pour tous les verbes.",
      categories: ["Action achevée", "Projet futur"], groups: [["கற்றேன்",0],["செய்தோம்",0],["கற்பேன்",1],["செய்வோம்",1]],
      sentence: ["நான் தமிழ் கற்பேன் ஏனெனில் அது எனக்குப் பிடிக்கும்", "j’apprendrai le tamoul parce que j’aime cette langue"],
      text: "எங்கள் பள்ளியில் மரங்களை நடத் திட்டமிட்டோம். முதலில் இடத்தைத் தேர்ந்தெடுத்தோம். பிறகு மரக்கன்றுகளை வாங்கினோம்.", question: "Quel mot introduit la première étape du projet ?", answer: "முதலில்", reason: "முதலில் signifie d’abord. பிறகு introduit l’étape suivante.",
      writing: "Prépare un texte de 100 à 150 mots en tamoul sur un projet utile à ton école. Présente le besoin, les étapes, une difficulté et une solution.", model: "எங்கள் பள்ளியில் ஒரு தோட்டம் அமைக்க விரும்புகிறோம். முதலில் இடத்தைத் தேர்ந்தெடுப்போம். பிறகு செடிகளை நடுவோம். தண்ணீரைச் சேமிப்பதும் முக்கியம்."
    },
    {
      title: "Sentiment et qualité", rule: "Ces mots ne décrivent pas tous la même chose : மகிழ்ச்சி et துக்கம் nomment des sentiments ; நேர்மை et பொறுமை nomment ici des qualités.",
      categories: ["Sentiment", "Qualité"], groups: [["மகிழ்ச்சி",0],["துக்கம்",0],["நேர்மை",1],["பொறுமை",1]],
      sentence: ["அவள் அமைதியாகக் கேட்டாள் பிறகு பதில் கூறினாள்", "elle a écouté calmement, puis elle a répondu"],
      text: "அவன் தவறு செய்தான். ஆனால் உண்மையைச் சொன்னான். ஆசிரியர் அவனுடைய நேர்மையைப் பாராட்டினார்.", question: "Quelle qualité le professeur félicite-t-il ? Recopie sa forme dans le texte.", answer: "நேர்மையைப்", reason: "நேர்மை désigne l’honnêteté ; நேர்மையைப் est la forme employée ici comme complément.",
      writing: "Écris 150 à 200 mots en tamoul sur l’honnêteté. Défends une idée, illustre-la par une situation et discute une difficulté.", model: "நேர்மை ஒரு நல்ல பண்பு. தவறு செய்தாலும் உண்மையைச் சொல்ல வேண்டும். அது சில நேரங்களில் கடினமாக இருக்கலாம். ஆனால் அது நம்பிக்கையை வளர்க்கும்."
    },
    {
      title: "Formes complètes et participes", rule: "வந்தான் / படித்தாள் peuvent terminer une proposition. வந்து / படித்து relient ici une action à une autre : வந்து பார்த்தான் (il est venu et a regardé).",
      categories: ["Verbe conjugué", "Participe verbal"], groups: [["வந்தான்",0],["படித்தாள்",0],["வந்து",1],["படித்து",1]],
      sentence: ["அவள் நூலைப் படித்து கருத்தை விளக்கினாள்", "elle a lu le livre et en a expliqué l’idée"],
      text: "மாணவர்கள் நூலைப் படித்து விவாதித்தார்கள். சிலர் ஆசிரியரின் கருத்தை ஆதரித்தார்கள். மற்றவர்கள் வேறு கருத்துகளை முன்வைத்தார்கள்.", question: "Recopie le participe qui relie la lecture à la discussion.", answer: "படித்து", reason: "படித்து (ayant lu) relie les actions ; விவாதித்தார்கள் est le verbe conjugué (ont discuté).",
      writing: "Rédige environ 200 mots en tamoul : l’école doit-elle donner plus de place à la lecture ? Organise une introduction, deux arguments, une objection et une conclusion.", model: "பள்ளியில் வாசிப்பிற்கு அதிக நேரம் கொடுக்க வேண்டும். நூல்கள் புதிய கருத்துகளை அறிய உதவுகின்றன. ஆனால் விளையாட்டிற்கும் நேரம் தேவை. இரண்டிற்கும் இடம் கொடுப்பது நல்லது."
    }
  ]
  // Revisit a text with a different reading objective, not the same answer.
  const readingVariants = [
    [["Recopie le mot qui désigne maman.","அம்மா","அம்மா désigne maman dans la deuxième phrase."],["Recopie le mot qui signifie mon ou ma.","என்","என் marque ici la possession : ma maison, ma maman."]],
    [["Recopie le mot qui désigne l’école.","பள்ளி","பள்ளி est le lieu présenté dans la première phrase."],["Quel objet est lu ? Recopie son nom.","புத்தகம்","புத்தகம் désigne le livre ; படிக்கிறேன் signifie je lis."]],
    [["Qui est à l’école ? Recopie le nom de cette personne.","தம்பி","La dernière phrase situe le petit frère à l’école."],["Recopie le verbe qui décrit ce que fait la grande sœur.","பாடுகிறாள்","பாடுகிறாள் signifie elle chante ; le sujet est repris par அவள்."]],
    [["Quel mot situe le soleil dans le présent ? Recopie-le.","இன்று","இன்று signifie aujourd’hui, par opposition à நேற்று, hier."],["Qu’y a-t-il dans le jardin ? Recopie le nom.","மரம்","மரம் désigne l’arbre de la dernière phrase."]],
    [["Qui a fait les achats ? Recopie le nom de cette personne.","அம்மா","அம்மா est le sujet de la première phrase, repris ensuite par அவள்."],["Quel aliment a été acheté ? Recopie son nom.","அரிசி","அரிசி désigne le riz, acheté ici en quantité de deux kilos."]],
    [["Quel mot annonce quand le narrateur écrira ? Recopie-le.","நாளை","நாளை signifie demain. Le texte distingue hier et demain."],["Recopie le verbe qui signifie j’ai lu.","படித்தேன்","படித்தேன் situe la lecture dans le passé, avec நேற்று."]],
    [["Qui a applaudi ? Recopie le sujet de cette action.","பெற்றோர்","பெற்றோர் désigne les parents ; கைதட்டினார்கள் signifie ont applaudi."],["Recopie le verbe qui exprime la joie de tout le monde.","மகிழ்ந்தார்கள்","அனைவரும் மகிழ்ந்தார்கள் : tout le monde s’est réjoui."]],
    [["Quel phénomène peut nous faire rester à la maison ? Recopie son nom.","மழை","மழை désigne la pluie, dans la condition மழை பெய்தால்."],["Où resterons-nous s’il pleut ? Recopie la forme du lieu.","வீட்டில்","வீட்டில் signifie à la maison, résultat de la première condition."]],
    [["Qui vient à la bibliothèque ? Recopie le nom du groupe.","மாணவர்கள்","மாணவர்கள் désigne les élèves qui fréquentent le lieu."],["À quelle fréquence viennent-ils ? Recopie le mot du texte.","தினமும்","தினமும் signifie chaque jour et précise la fréquence."]],
    [["Recopie le mot qui introduit l’étape suivante.","பிறகு","பிறகு signifie ensuite, après le choix du lieu."],["Que veut-on planter ? Recopie la forme du nom dans la première phrase.","மரங்களை","மரங்களை est la forme plurielle de மரம், arbre, employée comme complément."]],
    [["Qui félicite le personnage ? Recopie le nom de cette personne.","ஆசிரியர்","ஆசிரியர் désigne le professeur, sujet de la dernière phrase."],["Qu’a-t-il dit malgré son erreur ? Recopie la forme du nom.","உண்மையைச்","உண்மையைச் சொன்னான் signifie il a dit la vérité."]],
    [["Recopie le verbe conjugué de la première phrase.","விவாதித்தார்கள்","விவாதித்தார்கள் (ont discuté) termine la proposition, après le participe படித்து."],["De qui est l’idée soutenue par certains élèves ? Recopie la forme possessive.","ஆசிரியரின்","ஆசிரியரின் கருத்து signifie l’idée de l’auteur dans ce contexte."]]
  ]
  // All examples above are original; free writing is NOT machine-graded.
  function pack(level) { return packs[Math.max(0, Math.min(11, level))] }
  function matching(items, id, seed) {
    const pairs = items.map((item, index) => ({ ...item, id: String(index) }))
    return { type: "match", id, title: "Relie les bonnes paires", prompt: "Touche un mot en tamoul, puis son sens. Tu peux modifier tes liens avant de vérifier.", pairs, order: shuffle(pairs.map(p => p.id), seed), hint: "Commence par la paire que tu reconnais le mieux.", explanation: "Relis les associations dans la correction, puis essaie de retrouver leur sens sans regarder." }
  }
  function build(item, id, seed, pool) {
    const parts = units(item.ta)
    if (parts.length < 2) return choice(item, id, seed, pool)
    const words = normalize(item.ta).includes(" ")
    return { type: "build", id, title: words ? "Remets la phrase en ordre" : "Reconstruis le mot", prompt: `Retrouve ${words ? "la phrase" : "le mot"} étudié : « ${item.fr} ».`, target: normalize(item.ta), words, tokens: shuffle(parts.map((text, index) => ({ id: String(index), text })), seed), hint: `Le modèle commence par « ${parts[0]} ».`, explanation: words ? "Lis la phrase obtenue d’un seul trait. Ici, on reconstitue le modèle étudié ; d’autres formulations peuvent exister." : "Le signe vocalique et sa consonne restent ensemble : observe chaque bloc sans le couper.", meaning: item.fr }
  }
  function choice(item, id, seed, pool) {
    const options = [item.ta, ...pool.filter(p => p.ta !== item.ta).map(p => p.ta)].slice(0, 4)
    return { type: "select", id, title: "Retrouve le signe", prompt: `Quel signe correspond à « ${item.fr} » ?`, target: item.ta, options: shuffle(options, seed), hint: "Revois le modèle de la mini-leçon si nécessaire.", explanation: `${item.ta} : ${item.fr}.`, meaning: item.fr }
  }
  function gap(item, id, seed, pool) {
    const parts = units(item.ta)
    if (parts.length < 2) return choice(item, id, seed, pool)
const index = seed % parts.length
    const candidates = Array.from(new Set([parts[index], ...pool.flatMap(p => units(p.ta))])).filter(Boolean).slice(0, 5)
    const words = normalize(item.ta).includes(" ")
return { type: "gap", id, title: words ? "Complète la phrase" : "Trouve le signe manquant", prompt: `Complète le modèle étudié : « ${item.fr} ».`, parts, hole: index, words, options: shuffle(candidates, seed), target: parts[index], fullAnswer: normalize(item.ta), hint: words ? "Lis les mots avant et après le trou." : "Compare la forme de la consonne et les marques de voyelle.", explanation: words ? "Relis la phrase complète : chaque mot doit garder sa place dans ce modèle." : "Relis le mot complété. Vérifie le signe ajouté, sa voyelle éventuelle et le point pulli : chaque détail compte.", meaning: item.fr }
  }
  function sorting(level, id, seed) {
    const p = pack(level)
    return { type: "sort", id, title: "Range dans la bonne famille", prompt: p.title, categories: p.categories, cards: shuffle(p.groups.map(([text, category], index) => ({ text, category, id: String(index) })), seed), hint: p.rule, explanation: p.rule }
  }
  function reading(level, id, variant = 0) {
    const p = pack(level)
    const [prompt, target, explanation] = variant % 3 ? readingVariants[level][(variant % 3)-1] : [p.question,p.answer,p.reason]
    return { type: "read", id, title: "Lis et mène l’enquête", prompt, passage: p.text, target, tokens: Array.from(new Set(p.text.split(/\s+/).map(normalize).filter(Boolean))), hint: "La réponse se trouve dans le texte. Touche les mots pour composer ta réponse, ou saisis-la au clavier tamoul.", explanation }
  }
  function writing(level, id) {
    const p = pack(level)
    return { type: "write", id, title: "À toi d’écrire", prompt: p.writing, model: p.model, hint: "Prépare tes idées, puis rédige. Utilise ton clavier tamoul ; le brouillon reste sur cet appareil.", checklist: ["J’ai répondu au sujet avec mes propres idées.", "J’ai vérifié les sujets, les verbes et les temps.", "J’ai relu les signes tamouls et la ponctuation."], explanation: "Cet atelier est une auto-évaluation, pas une correction automatique. Le modèle est une piste, pas l’unique bonne réponse. Fais relire ton texte par un professeur pour un avis linguistique." }
  }
  function lessonQuestions(stage, level, stageIndex) {
    const seed = level * 113 + stageIndex * 17
    return [matching(stage.items, `l${level}-${stageIndex}-match`, seed), ...stage.items.slice(0,2).map((item,i) => gap(item, `l${level}-${stageIndex}-gap${i}`, seed+i, stage.items))]
  }
  function memory(items, id, seed) {
    const pairs = items.slice(0,3).map((item,i) => ({...item,id:String(i)}))
    const cards = shuffle(pairs.flatMap(pair => [
      {id:pair.id+'-ta',pair:pair.id,side:'ta',text:pair.ta},
      {id:pair.id+'-fr',pair:pair.id,side:'fr',text:pair.fr}
    ]),seed)
    return {type:'memory',id,title:'Les paires cachées',prompt:'Retourne deux cartes : associe le tamoul à son sens. Une erreur ? Observe, puis retente.',pairs,cards,
      hint:'Lis le mot et son sens à voix haute quand tu retrouves une paire.',explanation:'Les paires sont réunies. Essaie maintenant de redire leur sens sans les regarder.'}
  }
  function listening(item,id,seed,pool) {
    const q = build(item,id,seed,pool)
    return {...q,type:'listen',audio:item.ta,title:'Le message à retrouver',prompt:q.tokens?'Écoute, puis assemble les blocs pour retrouver ce que tu entends.':'Écoute, puis retrouve le signe que tu entends.',hint:'Réécoute aussi souvent que nécessaire, puis observe les signes proposés.',explanation:'Compare le son avec la réponse. Observe en particulier les voyelles courtes et longues.'}
  }
  function exerciseQuestions(stage, level, stageIndex, exercise, runSeed = 0) {
    const seed = level * 113 + stageIndex * 17 + exercise + runSeed
    const id = `v${level+1}-s${stageIndex+1}-e${exercise+1}`
    const items = stage.items
    if (exercise === 0) return [memory(items,id+'-memory',seed), matching(items, id+"-match", seed+1), build(items[stageIndex % items.length],id+'-build',seed+2,items)]
    if (exercise === 1) return items.map((item,i) => i===0 ? listening(item,id+'-listen',seed,items) : i % 2 ? gap(item,id+"-gap"+i,seed+i,items) : build(item,id+"-build"+i,seed+i,items))
    const p = pack(level)
    const challenge = stageIndex % 3 === 0 ? sorting(level, id+"-sort", seed) : stageIndex % 3 === 1 ? reading(level,id+"-read",Math.floor(stageIndex/3)) : build({ta:p.sentence[0],fr:p.sentence[1]},id+"-sentence",seed,items)
    const result = [gap(items[stageIndex % items.length],id+"-gap",seed,items), challenge]
    if (stageIndex === 9 && p.writing) result.push(writing(level,id+"-write"))
    return result
  }
  function examQuestions(stages, level, kind) {
    const result = stages.map((stage,index) => {
      const seed = level * 37 + index + (kind === "mock" ? 41 : 0)
      const id = `exam-${kind}-${level}-${index}`
      const item = stage.items[(kind === "mock" ? 0 : 1) % stage.items.length]
      return index % 3 === 0 ? matching(stage.items,id,seed) : index % 3 === 1 ? build(item,id,seed,stage.items) : gap(item,id,seed,stage.items)
    })
    if (kind !== "mock") result.push(sorting(level,`exam-${kind}-${level}-sort`,level),reading(level,`exam-${kind}-${level}-read`))
    return result
  }
  function answerText(question, response) {
    if (question.type === "build" || question.type === 'listen' && question.tokens) return (response.order || []).map(id => question.tokens.find(t => t.id === id)?.text || "").join(question.words ? " " : "")
    return response.text || response.value || ""
  }
  function ready(q, r) {
    if (q.type === 'memory') return q.pairs.every(p => r.matched?.includes(p.id))
    if (q.type === "match") return q.pairs.every(p => r.links?.[p.id] !== undefined) && new Set(Object.values(r.links || {})).size === q.pairs.length
    if (q.type === "sort") return q.cards.every(p => Number.isInteger(r.groups?.[p.id]))
    if (q.type === "build" || q.type === 'listen' && q.tokens) return r.order?.length === q.tokens.length && new Set(r.order).size === q.tokens.length
    if (q.type === "write") return /[\u0b85-\u0b94\u0b95-\u0bb9]/u.test(r.text || "") && q.checklist.every((_,i) => r.checks?.includes(i))
    return Boolean(normalize(answerText(q,r)))
  }
  function check(q, r) {
    if (!ready(q,r)) return false
    if (q.type === 'memory') return true
    if (q.type === "write") return null // Deliberately no claim that free writing is correct.
    if (q.type === "match") return q.pairs.every(p => r.links[p.id] === p.id)
    if (q.type === "sort") return q.cards.every(p => r.groups[p.id] === p.category)
    return normalize(answerText(q,r)) === normalize(q.target)
  }
  function solution(q) {
    if (q.type === "match" || q.type === 'memory') return q.pairs.map(p => `${p.ta} → ${p.fr}`).join("\n")
    if (q.type === "sort") return q.cards.map(p => `${p.text} → ${q.categories[p.category]}`).join("\n")
    return q.fullAnswer || q.target || q.model
  }
  return { version, normalize, letters, units, shuffle, pack, lessonQuestions, exerciseQuestions, examQuestions, ready, check, answerText, solution }
})
