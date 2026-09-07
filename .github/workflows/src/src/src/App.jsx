import "./storageShim";
import React, { useState, useRef, useEffect } from "react";
import {
  Home, BookOpen, Mic, User, Flame, Trophy, ChevronRight, ChevronLeft,
  Volume2, Check, X, Send, Sparkles, Award, Moon, Sun, Globe,
  RotateCcw, Loader2, Star, Coins as CoinsIcon, Heart
} from "lucide-react";

const FONT_IMPORT = "@import url('https://fonts.googleapis.com/css2?family=Baloo+2:wght@500;600;700;800&family=Nunito:wght@400;600;700;800&family=IBM+Plex+Mono:wght@500&display=swap');";

const LIGHT = {
  bg: "#F7F7F5",
  surface: "#FFFFFF",
  surfaceAlt: "#F0F0EE",
  ink: "#3C3C3C",
  inkSoft: "#6B6B6B",
  border: "#E5E5E5",
  marigold: "#FFC800",
  marigoldText: "#8A6A00",
  marigoldShadow: "#E6B400",
  coral: "#FF4B4B",
  coralText: "#8A1414",
  coralShadow: "#E63E3E",
  sage: "#58CC02",
  sageText: "#FFFFFF",
  sageShadow: "#46A302",
  blue: "#1CB0F6",
  blueText: "#FFFFFF",
  blueShadow: "#1899D6",
};

const DARK = {
  bg: "#131F24",
  surface: "#1B2B32",
  surfaceAlt: "#233842",
  ink: "#F3F3F3",
  inkSoft: "#AFC3CA",
  border: "#2C4049",
  marigold: "#FFC800",
  marigoldText: "#3A2C00",
  marigoldShadow: "#DDAF00",
  coral: "#FF5A5A",
  coralText: "#3A0E0E",
  coralShadow: "#E64848",
  sage: "#58CC02",
  sageText: "#0C1F00",
  sageShadow: "#3E9102",
  blue: "#1CB0F6",
  blueText: "#04222D",
  blueShadow: "#1690C9",
};

const LANGUAGES = ["English", "Urdu", "Arabic", "Hindi", "Spanish", "French", "German", "Turkish", "Chinese", "Japanese"];

// App-interface languages: the chrome (nav, buttons, labels) translates.
// Lesson content stays in English since that's what's being taught.
const UI_LANGUAGES = ["English", "Urdu", "Arabic", "Spanish", "French"];
const RTL_LANGUAGES = new Set(["Urdu", "Arabic"]);

const UI_STRINGS = {
  English: {
    nav_home: "Home", nav_learn: "Learn", nav_speak: "Speak", nav_profile: "Profile",
    section_flashcards: "Vocabulary flashcards", section_lessons: "Grammar lessons",
    section_speaking: "Speaking practice", section_tutor: "AI tutor",
    section_languages: "Languages", section_achievements: "Achievements", section_preferences: "Preferences",
    section_plan: "7-day plan", section_wotd: "Word of the day", section_tip: "Grammar tip", section_skilltree: "Today's skill tree", section_leaderboard: "Leaderboard", section_focus: "Focus areas",
    btn_review_again: "Review again", btn_i_know: "I know this",
    btn_continue: "Continue", btn_get_started: "Get started",
    btn_start_trial: "Start free trial", btn_cancel_premium: "Cancel Premium",
    btn_check: "Check", btn_back_to_lessons: "Back to lessons", btn_new_sentence: "New sentence",
    placeholder_listen: "Type what you hear…", placeholder_chat: "Ask Lingo anything…",
    tap_reveal: "Tap to reveal meaning", listen_prompt: "Listen & type what you hear",
    onboard1_title: "Speak with confidence", onboard1_body: "Practice real conversations with an AI tutor that listens, corrects, and encourages.",
    onboard2_title: "Learn your way", onboard2_body: "Vocabulary, grammar, listening, and writing — one path, shaped around your goals.",
    onboard3_title: "Track every step", onboard3_body: "Streaks, XP, and badges turn daily practice into a habit that sticks.",
    premium_title: "Lingo Premium", app_language: "App language",
  },
  Urdu: {
    nav_home: "ہوم", nav_learn: "سیکھیں", nav_speak: "بولیں", nav_profile: "پروفائل",
    section_flashcards: "الفاظ کے کارڈز", section_lessons: "گرامر کے سبق",
    section_speaking: "بولنے کی مشق", section_tutor: "اے آئی ٹیوٹر",
    section_languages: "زبانیں", section_achievements: "کامیابیاں", section_preferences: "ترجیحات",
    section_plan: "7 دن کا پلان", section_wotd: "آج کا لفظ", section_tip: "گرامر ٹِپ", section_skilltree: "آج کا سبق نقشہ", section_leaderboard: "لیڈر بورڈ", section_focus: "توجہ درکار",
    btn_review_again: "دوبارہ دیکھیں", btn_i_know: "مجھے آتا ہے",
    btn_continue: "جاری رکھیں", btn_get_started: "شروع کریں",
    btn_start_trial: "فری ٹرائل شروع کریں", btn_cancel_premium: "پریمیم منسوخ کریں",
    btn_check: "چیک کریں", btn_back_to_lessons: "سبق کی فہرست", btn_new_sentence: "نیا جملہ",
    placeholder_listen: "جو سنا وہ لکھیں…", placeholder_chat: "لنگو سے کچھ بھی پوچھیں…",
    tap_reveal: "معنی دیکھنے کے لیے ٹیپ کریں", listen_prompt: "سنیں اور لکھیں",
    onboard1_title: "اعتماد کے ساتھ بولیں", onboard1_body: "ایک AI ٹیوٹر کے ساتھ اصل گفتگو کی مشق کریں جو سنتا، درست کرتا اور حوصلہ بڑھاتا ہے۔",
    onboard2_title: "اپنے انداز میں سیکھیں", onboard2_body: "الفاظ، گرامر، سننا اور لکھنا — ایک راستہ، آپ کے مقاصد کے مطابق۔",
    onboard3_title: "ہر قدم ٹریک کریں", onboard3_body: "اسٹریک، XP اور بیجز روزانہ کی مشق کو عادت بنا دیتے ہیں۔",
    premium_title: "لنگو پریمیم", app_language: "ایپ کی زبان",
  },
  Arabic: {
    nav_home: "الرئيسية", nav_learn: "تعلّم", nav_speak: "تحدّث", nav_profile: "الملف الشخصي",
    section_flashcards: "بطاقات المفردات", section_lessons: "دروس القواعد",
    section_speaking: "تمرين المحادثة", section_tutor: "المعلّم الذكي",
    section_languages: "اللغات", section_achievements: "الإنجازات", section_preferences: "التفضيلات",
    section_plan: "خطة 7 أيام", section_wotd: "كلمة اليوم", section_tip: "نصيحة نحوية", section_skilltree: "شجرة مهارات اليوم", section_leaderboard: "لوحة المتصدرين", section_focus: "مجالات التركيز",
    btn_review_again: "مراجعة مرة أخرى", btn_i_know: "أعرف هذا",
    btn_continue: "متابعة", btn_get_started: "ابدأ الآن",
    btn_start_trial: "ابدأ التجربة المجانية", btn_cancel_premium: "إلغاء الاشتراك",
    btn_check: "تحقّق", btn_back_to_lessons: "العودة للدروس", btn_new_sentence: "جملة جديدة",
    placeholder_listen: "اكتب ما سمعته…", placeholder_chat: "اسأل لينغو أي شيء…",
    tap_reveal: "اضغط لعرض المعنى", listen_prompt: "استمع واكتب ما تسمعه",
    onboard1_title: "تحدّث بثقة", onboard1_body: "تدرّب على محادثات حقيقية مع معلّم ذكي يستمع ويصحّح ويشجّع.",
    onboard2_title: "تعلّم بطريقتك", onboard2_body: "مفردات، قواعد، استماع، وكتابة — مسار واحد يناسب أهدافك.",
    onboard3_title: "تابع كل خطوة", onboard3_body: "السلاسل ونقاط الخبرة والأوسمة تحوّل التمرين اليومي إلى عادة.",
    premium_title: "لينغو بريميوم", app_language: "لغة التطبيق",
  },
  Spanish: {
    nav_home: "Inicio", nav_learn: "Aprender", nav_speak: "Hablar", nav_profile: "Perfil",
    section_flashcards: "Tarjetas de vocabulario", section_lessons: "Lecciones de gramática",
    section_speaking: "Práctica de conversación", section_tutor: "Tutor IA",
    section_languages: "Idiomas", section_achievements: "Logros", section_preferences: "Preferencias",
    section_plan: "Plan de 7 días", section_wotd: "Palabra del día", section_tip: "Consejo de gramática", section_skilltree: "Árbol de habilidades de hoy", section_leaderboard: "Clasificación", section_focus: "Áreas de enfoque",
    btn_review_again: "Repasar de nuevo", btn_i_know: "Ya lo sé",
    btn_continue: "Continuar", btn_get_started: "Empezar",
    btn_start_trial: "Iniciar prueba gratis", btn_cancel_premium: "Cancelar Premium",
    btn_check: "Comprobar", btn_back_to_lessons: "Volver a lecciones", btn_new_sentence: "Nueva frase",
    placeholder_listen: "Escribe lo que oyes…", placeholder_chat: "Pregúntale algo a Lingo…",
    tap_reveal: "Toca para ver el significado", listen_prompt: "Escucha y escribe lo que oigas",
    onboard1_title: "Habla con confianza", onboard1_body: "Practica conversaciones reales con un tutor de IA que escucha, corrige y anima.",
    onboard2_title: "Aprende a tu manera", onboard2_body: "Vocabulario, gramática, escucha y escritura — un camino, según tus metas.",
    onboard3_title: "Sigue cada paso", onboard3_body: "Rachas, XP e insignias convierten la práctica diaria en un hábito.",
    premium_title: "Lingo Premium", app_language: "Idioma de la app",
  },
  French: {
    nav_home: "Accueil", nav_learn: "Apprendre", nav_speak: "Parler", nav_profile: "Profil",
    section_flashcards: "Cartes de vocabulaire", section_lessons: "Leçons de grammaire",
    section_speaking: "Entraînement à l'oral", section_tutor: "Tuteur IA",
    section_languages: "Langues", section_achievements: "Succès", section_preferences: "Préférences",
    section_plan: "Plan de 7 jours", section_wotd: "Mot du jour", section_tip: "Astuce de grammaire", section_skilltree: "Arbre de compétences du jour", section_leaderboard: "Classement", section_focus: "Points à travailler",
    btn_review_again: "Revoir", btn_i_know: "Je le sais",
    btn_continue: "Continuer", btn_get_started: "Commencer",
    btn_start_trial: "Essai gratuit", btn_cancel_premium: "Annuler Premium",
    btn_check: "Vérifier", btn_back_to_lessons: "Retour aux leçons", btn_new_sentence: "Nouvelle phrase",
    placeholder_listen: "Écrivez ce que vous entendez…", placeholder_chat: "Demandez quelque chose à Lingo…",
    tap_reveal: "Touchez pour voir le sens", listen_prompt: "Écoutez et écrivez ce que vous entendez",
    onboard1_title: "Parlez avec confiance", onboard1_body: "Pratiquez de vraies conversations avec un tuteur IA qui écoute, corrige et encourage.",
    onboard2_title: "Apprenez à votre façon", onboard2_body: "Vocabulaire, grammaire, écoute et écriture — un parcours selon vos objectifs.",
    onboard3_title: "Suivez chaque étape", onboard3_body: "Séries, XP et badges transforment la pratique quotidienne en habitude.",
    premium_title: "Lingo Premium", app_language: "Langue de l'application",
  },
};

function tr(uiLang, key) {
  return (UI_STRINGS[uiLang] && UI_STRINGS[uiLang][key]) || UI_STRINGS.English[key] || key;
}

const VOCAB = [
  { word: "Wanderlust", ipa: "/ˈwɒn.də.lʌst/", meaning: "a strong desire to travel and explore", example: "Her wanderlust took her across three continents." },
  { word: "Ephemeral", ipa: "/ɪˈfem.ər.əl/", meaning: "lasting for a very short time", example: "The cherry blossoms are ephemeral, gone within a week." },
  { word: "Resilient", ipa: "/rɪˈzɪl.i.ənt/", meaning: "able to recover quickly from difficulty", example: "She stayed resilient after the setback." },
  { word: "Serendipity", ipa: "/ˌser.ənˈdɪp.ə.ti/", meaning: "a pleasant surprise found by chance", example: "Meeting him at the airport was pure serendipity." },
  { word: "Meticulous", ipa: "/məˈtɪk.jə.ləs/", meaning: "very careful and precise about details", example: "He's meticulous about grammar and spelling." },
];

const QUIZ_LEVELS = ["Beginner", "Intermediate", "Advanced"];

const READING_PASSAGES = [
  {
    title: "A Morning Routine",
    text: "Amina wakes up at six every morning. She drinks a cup of tea and reads the news for twenty minutes. Then she walks to the bus stop and takes the 7:15 bus to work.",
    questions: [
      { q: "What time does Amina wake up?", options: ["Six", "Seven", "Eight", "Nine"], answer: 0 },
      { q: "How does Amina get to work?", options: ["She drives", "She walks the whole way", "She takes the bus", "She rides a bike"], answer: 2 },
    ],
  },
  {
    title: "The Weekend Trip",
    text: "Last weekend, Omar and his friends drove to the mountains. The weather was cold, but the view was beautiful. They stayed in a small cabin and cooked dinner together every night.",
    questions: [
      { q: "Where did Omar and his friends go?", options: ["The beach", "The mountains", "The city", "Another country"], answer: 1 },
      { q: "What was the weather like?", options: ["Hot", "Rainy", "Cold", "Windy"], answer: 2 },
    ],
  },
  {
    title: "Starting a New Job",
    text: "Sara starts her new job on Monday. She feels excited but a little nervous. Her manager sent her an email explaining what to bring on the first day and what time to arrive.",
    questions: [
      { q: "When does Sara start her new job?", options: ["Friday", "Sunday", "Monday", "Wednesday"], answer: 2 },
      { q: "How does Sara feel?", options: ["Angry and tired", "Excited but nervous", "Bored", "Confident and calm"], answer: 1 },
    ],
  },
  {
    title: "A Trip to the Market",
    text: "Every Saturday, Layla visits the local market to buy fresh vegetables and fruit. She likes to arrive early because the best produce sells out quickly. Afterward, she has coffee with her sister.",
    questions: [
      { q: "Why does Layla arrive early?", options: ["To meet friends", "Because the best produce sells out", "Because the market closes early", "To avoid traffic"], answer: 1 },
      { q: "What does Layla do after shopping?", options: ["She goes home immediately", "She has coffee with her sister", "She cooks lunch", "She takes a nap"], answer: 1 },
    ],
  },
];

const GEN_SUBJECTS = ["I", "You", "He", "She", "We", "They", "The teacher", "My friend", "The children", "Ali", "Sara", "The manager", "My sister", "The students"];

const IRREGULAR_VERBS = {
  go: ["went", "gone"], eat: ["ate", "eaten"], see: ["saw", "seen"], take: ["took", "taken"],
  do: ["did", "done"], have: ["had", "had"], give: ["gave", "given"], break: ["broke", "broken"],
  speak: ["spoke", "spoken"], drive: ["drove", "driven"], drink: ["drank", "drunk"], sing: ["sang", "sung"],
  swim: ["swam", "swum"], run: ["ran", "run"], write: ["wrote", "written"], buy: ["bought", "bought"],
  catch: ["caught", "caught"], teach: ["taught", "taught"], think: ["thought", "thought"], bring: ["brought", "brought"],
  find: ["found", "found"], keep: ["kept", "kept"], leave: ["left", "left"], tell: ["told", "told"], wear: ["wore", "worn"],
};
const REGULAR_VERBS = [
  "walk", "talk", "play", "watch", "cook", "clean", "study", "work", "listen", "jump",
  "help", "wash", "paint", "dance", "laugh", "smile", "arrive", "visit", "travel", "finish",
  "start", "open", "close", "wait", "ask", "call", "answer", "explain", "practice", "prepare",
];
const GEN_VERBS = [...REGULAR_VERBS, ...Object.keys(IRREGULAR_VERBS)];
const PRESENT3S_OVERRIDE = { do: "does", have: "has" };
const ING_OVERRIDE = { swim: "swimming", run: "running" };

function presentThirdPerson(v) {
  if (PRESENT3S_OVERRIDE[v]) return PRESENT3S_OVERRIDE[v];
  if (/[sxz]$|[cs]h$/.test(v)) return v + "es";
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + "ies";
  return v + "s";
}
function ingForm(v) {
  if (ING_OVERRIDE[v]) return ING_OVERRIDE[v];
  if (v.endsWith("ie")) return v.slice(0, -2) + "ying";
  if (v.endsWith("e") && !v.endsWith("ee")) return v.slice(0, -1) + "ing";
  return v + "ing";
}
function pastForm(v) {
  if (IRREGULAR_VERBS[v]) return IRREGULAR_VERBS[v][0];
  if (/[^aeiou]y$/.test(v)) return v.slice(0, -1) + "ied";
  if (v.endsWith("e")) return v + "d";
  return v + "ed";
}
function ppForm(v) {
  if (IRREGULAR_VERBS[v]) return IRREGULAR_VERBS[v][1];
  return pastForm(v);
}
function isSingular3rd(subj) {
  return !["I", "You", "We", "They", "The children", "The students"].includes(subj);
}
function verbForms(v) {
  return { base: v, s3: presentThirdPerson(v), ing: ingForm(v), past: pastForm(v), pp: ppForm(v) };
}

const TENSE_TEMPLATES = {
  presentSimple: {
    label: "Present Simple",
    text: (s, f) => `${s} ___ (${f.base}) every morning.`,
    answer: (s, f) => (isSingular3rd(s) ? f.s3 : f.base),
  },
  presentContinuous: {
    label: "Present Continuous",
    text: (s, f) => `Look! ${s} ___ (${f.base}) right now.`,
    answer: (s, f) => (s === "I" ? "am" : isSingular3rd(s) ? "is" : "are") + " " + f.ing,
  },
  pastSimple: {
    label: "Past Simple",
    text: (s, f) => `Yesterday, ${s} ___ (${f.base}).`,
    answer: (s, f) => f.past,
  },
  futureSimple: {
    label: "Future Simple",
    text: (s, f) => `Tomorrow, ${s} ___ (${f.base}) again.`,
    answer: (s, f) => "will " + f.base,
  },
  presentPerfect: {
    label: "Present Perfect",
    text: (s, f) => `${s} already ___ (${f.base}) today.`,
    answer: (s, f) => (s === "I" || !isSingular3rd(s) ? "have" : "has") + " " + f.pp,
  },
  pastPerfect: {
    label: "Past Perfect",
    text: (s, f) => `By the time we arrived, ${s} already ___ (${f.base}).`,
    answer: (s, f) => "had " + f.pp,
  },
  presentPerfectContinuous: {
    label: "Present Perfect Continuous",
    text: (s, f) => `${s} ___ (${f.base}) for five years now.`,
    answer: (s, f) => (s === "I" || !isSingular3rd(s) ? "have" : "has") + " been " + f.ing,
  },
  futurePerfect: {
    label: "Future Perfect",
    text: (s, f) => `By next year, ${s} ___ (${f.base}) the course.`,
    answer: (s, f) => "will have " + f.pp,
  },
};

const LEVEL_TENSES = {
  Beginner: ["presentSimple", "presentContinuous"],
  Intermediate: ["pastSimple", "futureSimple", "presentPerfect"],
  Advanced: ["pastPerfect", "presentPerfectContinuous", "futurePerfect"],
};

function splitIntoChunks(arr, n) {
  const chunks = Array.from({ length: n }, () => []);
  arr.forEach((item, i) => chunks[i % n].push(item));
  return chunks;
}

// Breaks a question pool into small fixed-size lesson units, Duolingo-style.
const LESSON_SIZE = 6;
const MAX_LESSONS_PER_SET = 27; // caps how many lesson circles show per day/level
// Builds lessons that mix multiple-choice, "listen & type", "word bank",
// and "matching pairs" questions, Duolingo-style, for variety.
function buildMixedLessons(mcqPool, listenPool, wordBankPool, matchingPool, maxLessons = MAX_LESSONS_PER_SET, mcqPerLesson = LESSON_SIZE - 3, listenPerLesson = 1, wordBankPerLesson = 1, matchingPerLesson = 1) {
  const lessons = [];
  let mi = 0, li = 0, wi = 0, ki = 0;
  while (lessons.length < maxLessons) {
    const group = [];
    for (let k = 0; k < mcqPerLesson && mi < mcqPool.length; k++) group.push(mcqPool[mi++]);
    for (let k = 0; k < listenPerLesson && li < listenPool.length; k++) group.push(listenPool[li++]);
    for (let k = 0; k < wordBankPerLesson && wi < wordBankPool.length; k++) group.push(wordBankPool[wi++]);
    for (let k = 0; k < matchingPerLesson && ki < matchingPool.length; k++) group.push(matchingPool[ki++]);
    if (group.length === 0) break;
    lessons.push(shuffle(group));
  }
  return lessons;
}

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function generateGrammarBank(level) {
  const tenses = LEVEL_TENSES[level];
  const bank = [];
  GEN_SUBJECTS.forEach((subj) => {
    GEN_VERBS.forEach((verb) => {
      const f = verbForms(verb);
      tenses.forEach((tKey) => {
        const tpl = TENSE_TEMPLATES[tKey];
        const correct = tpl.answer(subj, f);
        const pool = new Set([
          f.base, f.s3, f.ing, f.past, f.pp,
          "will " + f.base, "have " + f.pp, "has " + f.pp, "had " + f.pp,
          "will have " + f.pp, "have been " + f.ing, "has been " + f.ing,
        ]);
        pool.delete(correct);
        const distractors = shuffle([...pool]).slice(0, 3);
        const options = shuffle([correct, ...distractors]);
        bank.push({ type: "mcq", q: tpl.text(subj, f), options, answer: options.indexOf(correct), tense: tpl.label });
      });
    });
  });
  return shuffle(bank);
}

// Builds the natural, fully-formed sentence for a tense template by
// substituting the "___ (verb)" blank with the resolved answer text.
function buildFullSentence(tpl, subj, f) {
  const answer = tpl.answer(subj, f);
  const raw = tpl.text(subj, f);
  return raw.replace(/___\s*\([^)]*\)/, answer);
}

// "Listen & type" bank: the app speaks a full sentence aloud (Web Speech API)
// and the learner types what they heard.
function generateListenBank(level) {
  const tenses = LEVEL_TENSES[level];
  const bank = [];
  GEN_SUBJECTS.forEach((subj) => {
    GEN_VERBS.forEach((verb) => {
      const f = verbForms(verb);
      tenses.forEach((tKey) => {
        const tpl = TENSE_TEMPLATES[tKey];
        const sentence = buildFullSentence(tpl, subj, f);
        bank.push({ type: "listen", sentence, answer: sentence, tense: tpl.label });
      });
    });
  });
  return shuffle(bank);
}

// "Word bank" bank: tap the shuffled word chips in order to rebuild the
// sentence, Duolingo-style. A couple of decoy chips are mixed in.
const WORDBANK_DECOYS = ["quickly", "yesterday", "always", "never", "soon", "already", "again", "here", "there", "carefully"];
function generateWordBankBank(level) {
  const tenses = LEVEL_TENSES[level];
  const bank = [];
  GEN_SUBJECTS.forEach((subj) => {
    GEN_VERBS.forEach((verb) => {
      const f = verbForms(verb);
      tenses.forEach((tKey) => {
        const tpl = TENSE_TEMPLATES[tKey];
        const sentence = buildFullSentence(tpl, subj, f);
        const tokens = sentence.replace(/[.!?]+$/, "").split(" ").filter(Boolean);
        const decoys = shuffle(WORDBANK_DECOYS.filter((d) => !tokens.includes(d))).slice(0, 2);
        const chips = shuffle([...tokens, ...decoys]);
        bank.push({ type: "wordbank", sentence, tokens, chips, tense: tpl.label });
      });
    });
  });
  return shuffle(bank);
}

// "Matching pairs" bank: groups of 4 (subject+verb) prompts matched against
// their correctly conjugated forms, Duolingo-style tap-to-match.
function generateMatchingBank(level) {
  const tenses = LEVEL_TENSES[level];
  const candidates = [];
  GEN_SUBJECTS.forEach((subj) => {
    GEN_VERBS.forEach((verb) => {
      const f = verbForms(verb);
      tenses.forEach((tKey) => {
        const tpl = TENSE_TEMPLATES[tKey];
        candidates.push({ left: `${subj} (${f.base})`, right: tpl.answer(subj, f), tense: tpl.label });
      });
    });
  });
  const pool = shuffle(candidates);
  const bank = [];
  let group = [];
  const usedRights = new Set();
  for (const c of pool) {
    if (usedRights.has(c.right)) continue;
    group.push(c);
    usedRights.add(c.right);
    if (group.length === 4) {
      bank.push({ type: "matching", pairs: group, tense: group[0].tense });
      group = [];
      usedRights.clear();
    }
  }
  return shuffle(bank);
}

const SPEAK_PROMPTS = [
  { text: "Could you recommend a good place for breakfast nearby?", tag: "Travel" },
  { text: "I'd like to book a table for two this evening.", tag: "Dining" },
  { text: "Can you tell me how to get to the train station?", tag: "Travel" },
  { text: "I'm calling to follow up on my job application.", tag: "Work" },
  { text: "Would you mind repeating that a little slower?", tag: "Daily life" },
  { text: "What are your biggest strengths and weaknesses?", tag: "Interview" },
  { text: "I think we should postpone the meeting until Friday.", tag: "Business" },
  { text: "How long have you been learning English?", tag: "Conversation" },
  { text: "Excuse me, is this seat taken?", tag: "Daily life" },
  { text: "Could you help me carry these bags upstairs?", tag: "Daily life" },
  { text: "I really appreciate you taking the time to meet me.", tag: "Business" },
  { text: "What time does the museum open on weekends?", tag: "Travel" },
  { text: "I'm afraid I won't be able to make it tomorrow.", tag: "Daily life" },
  { text: "Let's schedule a follow-up call for next week.", tag: "Business" },
  { text: "Can you recommend a good book for beginners?", tag: "Conversation" },
  { text: "I've been living here for almost three years.", tag: "Conversation" },
  { text: "Sorry, could you say that again, please?", tag: "Daily life" },
  { text: "We should compare prices before we decide.", tag: "Business" },
  { text: "What do you usually do on the weekends?", tag: "Conversation" },
  { text: "I'd like to exchange this shirt for a smaller size.", tag: "Shopping" },
  { text: "The flight was delayed because of bad weather.", tag: "Travel" },
  { text: "Could you email me the details by tomorrow?", tag: "Work" },
  { text: "I'm really looking forward to the weekend.", tag: "Conversation" },
  { text: "Do you have any vegetarian options on the menu?", tag: "Dining" },
  { text: "I was wondering if you could give me some feedback.", tag: "Work" },
  { text: "It's a pleasure to finally meet you in person.", tag: "Interview" },
  { text: "Traffic was terrible, so I arrived a bit late.", tag: "Daily life" },
  { text: "Let's go over the numbers one more time.", tag: "Business" },
  { text: "I'm trying to improve my pronunciation this month.", tag: "Conversation" },
  { text: "Could you turn down the music a little?", tag: "Daily life" },
  { text: "Would it be possible to reschedule for next Tuesday?", tag: "Business" },
  { text: "I'd like a window seat if that's available.", tag: "Travel" },
  { text: "Can you show me how this works?", tag: "Daily life" },
  { text: "I think there might be a mistake on this bill.", tag: "Shopping" },
  { text: "What's your opinion on this proposal?", tag: "Business" },
  { text: "I really enjoyed working with your team.", tag: "Work" },
  { text: "Could you recommend something similar but cheaper?", tag: "Shopping" },
  { text: "How was your weekend?", tag: "Conversation" },
  { text: "I'm not sure I understood that correctly.", tag: "Daily life" },
  { text: "Let me know if you need anything else.", tag: "Work" },
  { text: "The presentation went better than I expected.", tag: "Business" },
  { text: "Could you validate my parking ticket?", tag: "Travel" },
  { text: "I'd love to hear more about your project.", tag: "Interview" },
  { text: "Sorry for the late reply — it's been a busy week.", tag: "Work" },
  { text: "Is breakfast included in the room price?", tag: "Travel" },
  { text: "I'll follow up with you by email tomorrow.", tag: "Business" },
  { text: "That's a great point — I hadn't thought of it that way.", tag: "Conversation" },
  { text: "Could you walk me through the process step by step?", tag: "Work" },
];
const FREE_SPEAK_LIMIT = 15;

const DAY_THEMES = [
  { day: 1, title: "Greetings & basics", focus: "Simple present, everyday vocabulary" },
  { day: 2, title: "Travel talk", focus: "Directions, asking questions" },
  { day: 3, title: "Food & dining", focus: "Ordering, describing preferences" },
  { day: 4, title: "Work & business", focus: "Emails, meetings, small talk" },
  { day: 5, title: "Grammar boost", focus: "Perfect tenses, sentence structure" },
  { day: 6, title: "Listening lab", focus: "Conversations, note-taking" },
  { day: 7, title: "Weekly review", focus: "Mixed quiz, speaking challenge" },
];

const BADGE_DEFS = [
  { Icon: Flame, label: "7-day streak", check: (s) => s.streak >= 7 },
  { Icon: Trophy, label: "Quiz master", check: (s) => s.lessonsCompleted >= 10 },
  { Icon: BookOpen, label: "500 XP", check: (s) => s.xp >= 500 },
  { Icon: Mic, label: "First chat", check: (s) => s.chatCount >= 1 },
  { Icon: Award, label: "Grammar pro", check: (s) => s.lessonsCompleted >= 25 },
  { Icon: Globe, label: "Polyglot", check: (s) => s.uiLangChanged },
];

const SPEAKING_TIPS = [
  "Round your lips a touch more on the 'oo' sound — it sharpens the vowel.",
  "Nice rhythm. Try landing a little harder on the stressed syllable.",
  "Good clarity. Slow the final word slightly so it doesn't trail off.",
  "Strong pace. Watch the 'th' sound — tongue just behind the teeth.",
];

const ONBOARDING = [
  { title: "Speak with confidence", body: "Practice real conversations with an AI tutor that listens, corrects, and encourages." },
  { title: "Learn your way", body: "Vocabulary, grammar, listening, and writing — one path, shaped around your goals." },
  { title: "Track every step", body: "Streaks, XP, and badges turn daily practice into a habit that sticks." },
];

function Waveform({ bars = 5, active = false, color = "currentColor", height = 16 }) {
  const heights = Array.from({ length: bars }, (_, i) => 4 + ((i * 37) % 12));
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: 2, height }}>
      {heights.map((h, i) => (
        <div
          key={i}
          style={{
            width: 3,
            height: h,
            background: color,
            borderRadius: 2,
            animation: active ? `barPulse 0.9s ease-in-out ${i * 0.09}s infinite` : "none",
            opacity: active ? 1 : 0.55,
          }}
        />
      ))}
    </div>
  );
}

function StreakRing({ pct, size = 56, color, track }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
      <circle cx={size / 2} cy={size / 2} r={r} stroke={track} strokeWidth="6" fill="none" />
      <circle
        cx={size / 2} cy={size / 2} r={r}
        stroke={color} strokeWidth="6" fill="none"
        strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c}
        strokeLinecap="round"
        style={{ transition: "stroke-dashoffset 0.6s ease" }}
      />
    </svg>
  );
}

function Pill({ children, bg, fg }) {
  return (
    <span style={{ background: bg, color: fg, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, fontWeight: 500, padding: "4px 10px", borderRadius: 999, display: "inline-flex", alignItems: "center", gap: 4 }}>
      {children}
    </span>
  );
}

function levenshteinWordDistance(a, b) {
  const dp = Array.from({ length: a.length + 1 }, () => Array(b.length + 1).fill(0));
  for (let i = 0; i <= a.length; i++) dp[i][0] = i;
  for (let j = 0; j <= b.length; j++) dp[0][j] = j;
  for (let i = 1; i <= a.length; i++) {
    for (let j = 1; j <= b.length; j++) {
      dp[i][j] = a[i - 1] === b[j - 1] ? dp[i - 1][j - 1] : 1 + Math.min(dp[i - 1][j - 1], dp[i - 1][j], dp[i][j - 1]);
    }
  }
  return dp[a.length][b.length];
}

// Scores a real recognized transcript against the target sentence — word-level
// alignment for accuracy, recognizer confidence for pronunciation, and
// speaking rate vs. an expected pace for fluency.
function computeSpeechScore(transcript, target, confidence, durationMs) {
  const normalize = (s) => s.toLowerCase().replace(/[^\w\s']/g, "").split(/\s+/).filter(Boolean);
  const tWords = normalize(target);
  const sWords = normalize(transcript);
  const dist = levenshteinWordDistance(tWords, sWords);
  const maxLen = Math.max(tWords.length, sWords.length, 1);
  const acc = Math.max(0, Math.round((1 - dist / maxLen) * 100));
  const pron = Math.round(Math.min(100, Math.max(30, (confidence || 0.75) * 100)));
  const expectedMs = tWords.length * 400;
  const ratio = durationMs > 0 ? expectedMs / durationMs : 1;
  const flu = Math.round(Math.min(100, Math.max(40, 100 - Math.abs(1 - ratio) * 60)));
  return { pron, flu, acc };
}

export default function LingoApp() {
  const [dark, setDark] = useState(false);
  const t = dark ? DARK : LIGHT;
  const [booted, setBooted] = useState(false);
  const [obStep, setObStep] = useState(0);
  const [screen, setScreen] = useState("home");

  const [profile, setProfile] = useState({ name: "Amina", native: "Urdu", target: "English" });
  const [uiLang, setUiLang] = useState("English");
  const [xp, setXp] = useState(1240);
  const [coins, setCoins] = useState(86);
  const [streak, setStreak] = useState(0);
  const [toast, setToast] = useState(null);
  const [premium, setPremium] = useState(false);

  const [flashIdx, setFlashIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [known, setKnown] = useState({});

  const [quizLevel, setQuizLevel] = useState("Beginner");
  const [quizIdx, setQuizIdx] = useState(0);
  const [quizPicked, setQuizPicked] = useState(null);
  const [quizScore, setQuizScore] = useState(0);

  // Lesson-unit mode (Duolingo-style): each level's question pool is broken
  // into small lessons of LESSON_SIZE questions, mixing multiple-choice with
  // "listen & type" questions. Beginner also stays scoped to the current
  // day's pool so the two systems combine.
  const [activeLesson, setActiveLesson] = useState(null); // null = show lesson path
  const [completedLessons, setCompletedLessons] = useState({}); // { [levelKey]: boolean[] }

  const HEART_MAX = 5;
  const HEART_REFILL_COST = 50;
  const [hearts, setHearts] = useState(HEART_MAX);
  const loseHeart = () => { if (!premium) setHearts((h) => Math.max(0, h - 1)); };
  const refillHearts = () => {
    if (coins < HEART_REFILL_COST) { showToast("Not enough coins"); return; }
    setCoins((c) => c - HEART_REFILL_COST);
    setHearts(HEART_MAX);
    showToast("Hearts refilled!");
  };

  const togglePremium = () => {
    const next = !premium;
    setPremium(next);
    showToast(next ? "Premium unlocked!" : "Premium cancelled");
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 1800);
  };

  const todayKey = () => new Date().toISOString().slice(0, 10); // YYYY-MM-DD

  // --- Real streak tracking ---
  // lastStreakDate is the last calendar day the person completed a lesson.
  // Completing a lesson on a new consecutive day bumps the streak; skipping
  // a day resets it back to 1.
  const [lastStreakDate, setLastStreakDate] = useState(null);
  const recordStreakActivity = () => {
    const today = todayKey();
    if (lastStreakDate === today) return; // already counted today
    if (lastStreakDate) {
      const prev = new Date(lastStreakDate);
      const diffDays = Math.round((new Date(today) - prev) / 86400000);
      setStreak((s) => (diffDays === 1 ? s + 1 : 1));
    } else {
      setStreak(1);
    }
    setLastStreakDate(today);
  };

  // --- Daily goal & reminders ---
  const DAILY_GOAL_OPTIONS = [10, 20, 30, 50];
  const [dailyGoal, setDailyGoal] = useState(30);
  const [dailyXp, setDailyXp] = useState(0);
  const [lastActiveDate, setLastActiveDate] = useState(todayKey());
  const [remindersOn, setRemindersOn] = useState(true);
  const [soundOn, setSoundOn] = useState(true);

  // --- Weak-area tracking: tallies mistakes per grammar tense so the AI
  // tutor (and the profile screen) can point out what to focus on. ---
  const [weakAreas, setWeakAreas] = useState({}); // { [tenseLabel]: mistakeCount }
  const recordMistake = (tense) => {
    if (!tense) return;
    setWeakAreas((w) => ({ ...w, [tense]: (w[tense] || 0) + 1 }));
  };
  const topWeakAreas = React.useMemo(() => {
    return Object.entries(weakAreas).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([tense]) => tense);
  }, [weakAreas]);
  const reminderShownRef = useRef(false);

  const addXp = (n) => {
    setXp((x) => x + n);
    setDailyXp((d) => d + n);
    showToast(`+${n} XP`);
  };

  // --- Persistent storage: real cross-session save/load, no server needed ---
  const [progressLoaded, setProgressLoaded] = useState(false);
  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("user-progress", false);
        if (res && res.value) {
          const data = JSON.parse(res.value);
          if (data.profile) setProfile(data.profile);
          if (typeof data.xp === "number") setXp(data.xp);
          if (typeof data.coins === "number") setCoins(data.coins);
          if (typeof data.streak === "number") setStreak(data.streak);
          if (typeof data.premium === "boolean") setPremium(data.premium);
          if (typeof data.hearts === "number") setHearts(data.hearts);
          if (data.known) setKnown(data.known);
          if (data.completedLessons) setCompletedLessons(data.completedLessons);
          if (data.dark !== undefined) setDark(data.dark);
          if (data.uiLang) setUiLang(data.uiLang);
          if (typeof data.dailyGoal === "number") setDailyGoal(data.dailyGoal);
          if (typeof data.dailyXp === "number") setDailyXp(data.dailyXp);
          if (data.lastActiveDate) setLastActiveDate(data.lastActiveDate);
          if (typeof data.remindersOn === "boolean") setRemindersOn(data.remindersOn);
          if (typeof data.soundOn === "boolean") setSoundOn(data.soundOn);
          if (data.weakAreas) setWeakAreas(data.weakAreas);
          if (data.lastStreakDate) setLastStreakDate(data.lastStreakDate);
        }
      } catch (e) {
        // no saved progress yet (first-time user) — safe to ignore
      }
      setProgressLoaded(true);
    })();
  }, []);

  useEffect(() => {
    if (!progressLoaded) return; // don't overwrite saved data with defaults before load finishes
    const data = { profile, xp, coins, streak, premium, hearts, known, completedLessons, dark, uiLang, dailyGoal, dailyXp, lastActiveDate, remindersOn, soundOn, weakAreas, lastStreakDate };
    window.storage.set("user-progress", JSON.stringify(data), false).catch(() => {
      // storage write failed silently — progress just won't persist this time
    });
  }, [progressLoaded, profile, xp, coins, streak, premium, hearts, known, completedLessons, dark, uiLang, dailyGoal, dailyXp, lastActiveDate, remindersOn, soundOn, weakAreas, lastStreakDate]);

  // --- Real multi-user leaderboard (shared storage) ---
  // Each person gets a stable random id (kept personal/private) used as their
  // shared leaderboard record key. Their display name + XP become visible to
  // everyone else using this app — that's disclosed in the UI.
  const [userId, setUserId] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [leaderboardLoading, setLeaderboardLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await window.storage.get("my-user-id", false);
        if (res && res.value) { setUserId(res.value); return; }
      } catch (e) { /* not set yet */ }
      const newId = "u_" + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
      try { await window.storage.set("my-user-id", newId, false); } catch (e) { /* ignore */ }
      setUserId(newId);
    })();
  }, []);

  useEffect(() => {
    if (!progressLoaded || !userId) return;
    const timer = setTimeout(() => {
      window.storage.set(`leaderboard:${userId}`, JSON.stringify({ name: profile.name || "Learner", xp }), true).catch(() => {});
    }, 1500);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressLoaded, userId, xp, profile.name]);

  const refreshLeaderboard = async () => {
    setLeaderboardLoading(true);
    try {
      const listRes = await window.storage.list("leaderboard:", true);
      const keys = (listRes && listRes.keys) || [];
      const entries = await Promise.all(
        keys.map(async (k) => {
          try {
            const r = await window.storage.get(k, true);
            const val = r && r.value ? JSON.parse(r.value) : null;
            return val ? { id: k, name: val.name || "Learner", xp: val.xp || 0 } : null;
          } catch (e) { return null; }
        })
      );
      const sorted = entries.filter(Boolean).sort((a, b) => b.xp - a.xp).slice(0, 10);
      setLeaderboard(sorted);
    } catch (e) {
      showToast("Couldn't load leaderboard");
    } finally {
      setLeaderboardLoading(false);
    }
  };
  useEffect(() => {
    if (screen === "profile") refreshLeaderboard();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [screen]);

  // Reset today's XP when the real calendar date rolls over, and give a
  // one-time gentle nudge if the daily goal hasn't been hit yet.
  useEffect(() => {
    if (!progressLoaded) return;
    const today = todayKey();
    if (lastActiveDate !== today) {
      setDailyXp(0);
      setLastActiveDate(today);
    } else if (remindersOn && !reminderShownRef.current && dailyXp < dailyGoal) {
      reminderShownRef.current = true;
      const remaining = dailyGoal - dailyXp;
      setTimeout(() => showToast(`🔥 ${remaining} XP to go for today's goal`), 900);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progressLoaded]);

  const currentDay = ((Math.max(streak, 1) - 1) % 7) + 1;
  const lastDayRef = useRef(null);
  useEffect(() => {
    if (!progressLoaded) return; // wait until saved hearts are restored first
    if (lastDayRef.current !== null && lastDayRef.current !== currentDay) {
      setHearts(HEART_MAX); // a new day started — refill hearts
    }
    lastDayRef.current = currentDay;
  }, [currentDay, progressLoaded]);

  const grammarBanks = React.useMemo(() => ({
    Beginner: generateGrammarBank("Beginner"),
    Intermediate: generateGrammarBank("Intermediate"),
    Advanced: generateGrammarBank("Advanced"),
  }), []);
  const totalQuestions = grammarBanks.Beginner.length + grammarBanks.Intermediate.length + grammarBanks.Advanced.length;

  const listenBanks = React.useMemo(() => ({
    Beginner: generateListenBank("Beginner"),
    Intermediate: generateListenBank("Intermediate"),
    Advanced: generateListenBank("Advanced"),
  }), []);

  const wordBankBanks = React.useMemo(() => ({
    Beginner: generateWordBankBank("Beginner"),
    Intermediate: generateWordBankBank("Intermediate"),
    Advanced: generateWordBankBank("Advanced"),
  }), []);

  const matchingBanks = React.useMemo(() => ({
    Beginner: generateMatchingBank("Beginner"),
    Intermediate: generateMatchingBank("Intermediate"),
    Advanced: generateMatchingBank("Advanced"),
  }), []);

  // Beginner questions are split into 7 chunks, one per day of the weekly plan.
  const beginnerByDay = React.useMemo(() => splitIntoChunks(grammarBanks.Beginner, 7), [grammarBanks]);
  const beginnerListenByDay = React.useMemo(() => splitIntoChunks(listenBanks.Beginner, 7), [listenBanks]);
  const beginnerWordBankByDay = React.useMemo(() => splitIntoChunks(wordBankBanks.Beginner, 7), [wordBankBanks]);
  const beginnerMatchingByDay = React.useMemo(() => splitIntoChunks(matchingBanks.Beginner, 7), [matchingBanks]);

  // Today's Beginner lessons are computed once and shared between the Learn
  // tab and the Home-screen skill-tree preview, so tapping either lands on
  // the exact same lesson content.
  const beginnerLessonsToday = React.useMemo(
    () => buildMixedLessons(beginnerByDay[currentDay - 1], beginnerListenByDay[currentDay - 1], beginnerWordBankByDay[currentDay - 1], beginnerMatchingByDay[currentDay - 1]),
    [currentDay, beginnerByDay, beginnerListenByDay, beginnerWordBankByDay, beginnerMatchingByDay]
  );
  const todayLevelKey = `Beginner-day${currentDay}`;
  const lessonsToday = beginnerLessonsToday;
  const lessonProgressToday = completedLessons[todayLevelKey] || Array(lessonsToday.length).fill(false);
  const unlockedCountToday = (() => {
    let i = 0;
    while (i < lessonProgressToday.length && lessonProgressToday[i]) i++;
    return i;
  })();
  const goToTodayLesson = (idx) => {
    if (!premium && hearts <= 0) { showToast("Out of hearts — refill to continue"); return; }
    setQuizLevel("Beginner");
    setActiveLesson(idx);
    setQuizIdx(0);
    setQuizPicked(null);
    setQuizScore(0);
    setScreen("learn");
  };

  const levelKey = quizLevel === "Beginner" ? todayLevelKey : quizLevel;
  const lessons = React.useMemo(() => {
    if (quizLevel === "Beginner") return beginnerLessonsToday;
    const mcqPool = grammarBanks[quizLevel];
    const listenPool = listenBanks[quizLevel];
    const wordBankPool = wordBankBanks[quizLevel];
    const matchingPool = matchingBanks[quizLevel];
    return buildMixedLessons(mcqPool, listenPool, wordBankPool, matchingPool);
  }, [quizLevel, beginnerLessonsToday, grammarBanks, listenBanks, wordBankBanks, matchingBanks]);
  const lessonProgress = completedLessons[levelKey] || Array(lessons.length).fill(false);

  const unlockedCount = (() => {
    let i = 0;
    while (i < lessonProgress.length && lessonProgress[i]) i++;
    return i;
  })();

  const markLessonComplete = (idx) => {
    setCompletedLessons((prev) => {
      const arr = [...(prev[levelKey] || Array(lessons.length).fill(false))];
      const firstTime = !arr[idx];
      arr[idx] = true;
      if (firstTime) {
        setCoins((c) => c + 8);
        showToast("+8 coins");
        recordStreakActivity();
      }
      return { ...prev, [levelKey]: arr };
    });
  };

  const openLesson = (idx) => {
    if (!premium && hearts <= 0) { showToast("Out of hearts — refill to continue"); return; }
    setActiveLesson(idx);
    setQuizIdx(0);
    setQuizPicked(null);
    setQuizScore(0);
  };
  const closeLesson = () => {
    setActiveLesson(null);
    setQuizIdx(0);
    setQuizPicked(null);
    setQuizScore(0);
  };
  const changeQuizLevel = (level) => {
    setQuizLevel(level);
    closeLesson();
  };

  const [chat, setChat] = useState([
    { role: "assistant", text: "Hi! I'm Lingo, your AI tutor. Ask me to explain a grammar rule, correct a sentence, or just practice a conversation." },
  ]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, chatLoading]);

  const [recState, setRecState] = useState("idle");
  const [speakScore, setSpeakScore] = useState(null);
  const [usedSpeakIds, setUsedSpeakIds] = useState([]);
  const [speakIdx, setSpeakIdx] = useState(0);
  const recognitionRef = useRef(null);

  useEffect(() => {
    pickNextPrompt([]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Stop any active microphone session if the person navigates away mid-recording.
  useEffect(() => {
    if (screen !== "speak" && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { /* already stopped */ }
    }
  }, [screen]);
  useEffect(() => {
    return () => { try { recognitionRef.current?.stop(); } catch (e) { /* unmounting */ } };
  }, []);

  function pickNextPrompt(used) {
    const pool = premium ? SPEAK_PROMPTS : SPEAK_PROMPTS.slice(0, FREE_SPEAK_LIMIT);
    let available = pool.map((_, i) => i).filter((i) => !used.includes(i));
    if (available.length === 0) available = pool.map((_, i) => i);
    const next = available[Math.floor(Math.random() * available.length)];
    setSpeakIdx(next);
  }

  const nextSpeakPrompt = () => {
    const nextUsed = [...usedSpeakIds, speakIdx];
    setUsedSpeakIds(nextUsed);
    pickNextPrompt(nextUsed);
    setRecState("idle");
    setSpeakScore(null);
  };

  const startRecording = () => {
    const SpeechRecognitionCtor = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognitionCtor) {
      showToast("Speech recognition isn't supported in this browser");
      return;
    }
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (e) { /* ignore */ }
    }
    setRecState("recording");
    setSpeakScore(null);
    const target = SPEAK_PROMPTS[speakIdx]?.text || "";
    const startTime = Date.now();
    const recognition = new SpeechRecognitionCtor();
    recognitionRef.current = recognition;
    recognition.lang = "en-US";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      const result = event.results[0][0];
      const transcript = result.transcript || "";
      const durationMs = Date.now() - startTime;
      const scoreObj = computeSpeechScore(transcript, target, result.confidence, durationMs);
      setRecState("scored");
      setSpeakScore({ ...scoreObj, transcript, tip: SPEAKING_TIPS[Math.floor(Math.random() * SPEAKING_TIPS.length)] });
      addXp(12);
    };
    recognition.onerror = (event) => {
      setRecState("idle");
      if (event.error === "not-allowed" || event.error === "permission-denied") showToast("Microphone permission denied");
      else if (event.error === "no-speech") showToast("Didn't catch that — try again");
      else showToast("Speech recognition error");
    };
    recognition.onend = () => {
      recognitionRef.current = null;
      setRecState((s) => (s === "recording" ? "idle" : s));
    };
    try {
      recognition.start();
    } catch (e) {
      setRecState("idle");
      showToast("Couldn't start the microphone");
    }
  };

  async function sendChat() {
    const text = chatInput.trim();
    if (!text || chatLoading) return;
    const nextHistory = [...chat, { role: "user", text }];
    setChat(nextHistory);
    setChatInput("");
    setChatLoading(true);

    const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL;
    if (!CHAT_API_URL) {
      // No backend configured yet — see README.md "AI tutor chat" section.
      // Calling Anthropic's API directly from the browser needs a secret API
      // key, which can never be safely embedded in a published app.
      setChat((h) => [...h, {
        role: "assistant",
        text: "The AI tutor needs a small backend to talk to Claude securely (an API key can't live in the app itself). Set VITE_CHAT_API_URL to your backend's endpoint — see README.md for a 10-line example server.",
      }]);
      setChatLoading(false);
      return;
    }

    try {
      const response = await fetch(CHAT_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          system: `You are Lingo, a warm, encouraging AI language tutor inside a language-learning app. The learner's native language is ${profile.native} and they are learning ${profile.target}. Keep replies short (2-4 sentences), gently correct mistakes, explain grammar simply, and occasionally ask a follow-up question to keep the conversation going.${topWeakAreas.length ? ` Based on their practice history, this learner particularly struggles with: ${topWeakAreas.join(", ")}. When relevant, gently work in extra help or examples on these specific areas without being asked.` : ""}`,
          messages: nextHistory.map((m) => ({ role: m.role, content: m.text })),
        }),
      });
      const data = await response.json();
      const reply = (data.content || []).map((b) => b.text || "").filter(Boolean).join("\n") || "Sorry, I couldn't quite catch that — try asking again.";
      setChat((h) => [...h, { role: "assistant", text: reply }]);
      addXp(5);
    } catch (e) {
      setChat((h) => [...h, { role: "assistant", text: "I couldn't reach the tutor service just now. Please try again in a moment." }]);
    } finally {
      setChatLoading(false);
    }
  }

  const card = { background: t.surface, border: `0.5px solid ${t.border}`, borderRadius: 16 };

  if (!booted) {
    return (
      <div style={{ maxWidth: 380, margin: "0 auto", fontFamily: "'Nunito', sans-serif" }} dir={RTL_LANGUAGES.has(uiLang) ? "rtl" : "ltr"}>
        <style>{`${FONT_IMPORT}
          @keyframes barPulse { 0%,100%{ transform: scaleY(0.5);} 50%{ transform: scaleY(1);} }
          @keyframes screenFade { from{ opacity:0; transform: translateY(6px);} to{ opacity:1; transform: translateY(0);} }
          .duo-btn { transition: transform 0.08s ease, box-shadow 0.08s ease; }
          .duo-btn:active:not(:disabled) { transform: translateY(4px); box-shadow: none !important; }
        `}</style>
        <div style={{ background: t.ink, borderRadius: 28, padding: "48px 28px 32px", minHeight: 640, display: "flex", flexDirection: "column", color: t.bg }}>
          <div style={{ display: "flex", justifyContent: "center", gap: 6, marginBottom: 40 }}>
            {ONBOARDING.map((_, i) => (
              <div key={i} style={{ width: i === obStep ? 20 : 6, height: 6, borderRadius: 3, background: i === obStep ? t.marigold : `${t.bg}44`, transition: "width 0.25s ease" }} />
            ))}
          </div>
          <div key={obStep} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", animation: "screenFade 0.25s ease-out" }}>
            <div style={{ marginBottom: 28 }}>
              <Waveform bars={7} active color={t.marigold} height={22} />
            </div>
            <h1 style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 26, fontWeight: 700, margin: "0 0 12px" }}>{tr(uiLang, `onboard${obStep + 1}_title`)}</h1>
            <p style={{ color: `${t.bg}B0`, fontSize: 15, lineHeight: 1.6, margin: 0, maxWidth: 280 }}>{tr(uiLang, `onboard${obStep + 1}_body`)}</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            {obStep > 0 && (
              <button className="duo-btn" onClick={() => setObStep((s) => s - 1)} style={{ flex: "0 0 48px", height: 48, borderRadius: 14, border: `1px solid ${t.bg}33`, background: "transparent", color: t.bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <ChevronLeft size={18} />
              </button>
            )}
            <button
              className="duo-btn"
              onClick={() => (obStep < ONBOARDING.length - 1 ? setObStep((s) => s + 1) : setBooted(true))}
              style={{ flex: 1, height: 52, borderRadius: 16, border: "none", background: t.sage, color: t.sageText, fontWeight: 800, fontSize: 15, letterSpacing: 0.4, textTransform: "uppercase", display: "flex", alignItems: "center", justifyContent: "center", gap: 6, boxShadow: `0 4px 0 ${t.sageShadow}` }}
            >
              {obStep < ONBOARDING.length - 1 ? tr(uiLang, "btn_continue") : tr(uiLang, "btn_get_started")} <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const NavBtn = ({ id, Icon, label }) => {
    const activeTab = screen === id;
    return (
      <button
        onClick={() => setScreen(id)}
        style={{ flex: 1, background: "none", border: "none", display: "flex", flexDirection: "column", alignItems: "center", gap: 4, padding: "10px 0", color: activeTab ? t.marigold : t.inkSoft }}
      >
        <Icon size={20} strokeWidth={activeTab ? 2.4 : 1.8} />
        <span style={{ fontSize: 11, fontWeight: activeTab ? 600 : 400 }}>{label}</span>
      </button>
    );
  };

  return (
    <div style={{ maxWidth: 380, margin: "0 auto", fontFamily: "'Nunito', sans-serif" }} dir={RTL_LANGUAGES.has(uiLang) ? "rtl" : "ltr"}>
      <style>{`${FONT_IMPORT}
        @keyframes barPulse { 0%,100%{ transform: scaleY(0.5);} 50%{ transform: scaleY(1);} }
        @keyframes toastIn { from{ opacity:0; transform: translate(-50%,8px);} to{ opacity:1; transform: translate(-50%,0);} }
        @keyframes screenFade { from{ opacity:0; transform: translateY(6px);} to{ opacity:1; transform: translateY(0);} }
        @keyframes popIn { from{ opacity:0; transform: scale(0.6);} to{ opacity:1; transform: scale(1);} }
        @keyframes shakeX { 0%,100%{ transform: translateX(0);} 20%{ transform: translateX(-6px);} 40%{ transform: translateX(6px);} 60%{ transform: translateX(-4px);} 80%{ transform: translateX(4px);} }
        @keyframes ringPop { 0%{ transform: scale(1);} 40%{ transform: scale(1.12);} 100%{ transform: scale(1);} }
        .duo-btn { transition: transform 0.08s ease, box-shadow 0.08s ease, filter 0.15s ease; }
        .duo-btn:active:not(:disabled) { transform: translateY(4px); box-shadow: none !important; }
        .duo-btn:hover:not(:disabled) { filter: brightness(1.04); }
        .tap-scale { transition: transform 0.1s ease; }
        .tap-scale:active { transform: scale(0.94); }
        .screen-fade { animation: screenFade 0.22s ease-out; }
      `}</style>
      <div style={{ background: t.bg, borderRadius: 28, border: `0.5px solid ${t.border}`, minHeight: 700, display: "flex", flexDirection: "column", position: "relative", overflow: "hidden" }}>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "18px 18px 10px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 9, background: t.marigold, display: "flex", alignItems: "center", justifyContent: "center" }}>
              <Waveform bars={4} color={t.marigoldText} height={14} />
            </div>
            <span style={{ fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 17, color: t.ink }}>Lingo</span>
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <Pill bg={t.surfaceAlt} fg={t.coralText}><Flame size={13} color={t.coral} />{streak}</Pill>
            <Pill bg={t.surfaceAlt} fg={t.coralText}><Heart size={13} color={t.coral} fill={t.coral} />{premium ? "∞" : hearts}</Pill>
            <Pill bg={t.surfaceAlt} fg={t.marigoldText}><CoinsIcon size={13} color={t.marigold} />{coins}</Pill>
            <button className="tap-scale" aria-label={dark ? "Switch to light mode" : "Switch to dark mode"} onClick={() => setDark((d) => !d)} style={{ width: 30, height: 30, borderRadius: 9, border: `0.5px solid ${t.border}`, background: t.surface, display: "flex", alignItems: "center", justifyContent: "center", color: t.ink }}>
              {dark ? <Sun size={14} /> : <Moon size={14} />}
            </button>
          </div>
        </div>

        <div key={screen} className="screen-fade" style={{ flex: 1, overflowY: "auto", padding: "6px 18px 18px" }}>
          {screen === "home" && (
            <HomeScreen t={t} card={card} profile={profile} xp={xp} streak={streak} setScreen={setScreen} currentDay={currentDay} premium={premium} totalQuestions={totalQuestions} uiLang={uiLang} dailyGoal={dailyGoal} dailyXp={dailyXp} lessonsToday={lessonsToday} lessonProgressToday={lessonProgressToday} unlockedCountToday={unlockedCountToday} goToTodayLesson={goToTodayLesson} />
          )}
          {screen === "learn" && (
            <LearnScreen
              t={t} card={card}
              vocab={VOCAB} flashIdx={flashIdx} setFlashIdx={setFlashIdx}
              flipped={flipped} setFlipped={setFlipped}
              known={known} setKnown={setKnown}
              quizLevel={quizLevel} setQuizLevel={changeQuizLevel}
              currentDay={currentDay}
              lessons={lessons} lessonProgress={lessonProgress} unlockedCount={unlockedCount}
              activeLesson={activeLesson} openLesson={openLesson} closeLesson={closeLesson}
              markLessonComplete={markLessonComplete}
              quizIdx={quizIdx} setQuizIdx={setQuizIdx}
              quizPicked={quizPicked} setQuizPicked={setQuizPicked}
              quizScore={quizScore} setQuizScore={setQuizScore}
              addXp={addXp} premium={premium} setScreen={setScreen}
              hearts={hearts} loseHeart={loseHeart} refillHearts={refillHearts} heartMax={HEART_MAX} refillCost={HEART_REFILL_COST}
              uiLang={uiLang} recordMistake={recordMistake} soundOn={soundOn}
            />
          )}
          {screen === "speak" && (
            <SpeakScreen
              t={t} card={card}
              chat={chat} chatInput={chatInput} setChatInput={setChatInput}
              chatLoading={chatLoading} sendChat={sendChat} chatEndRef={chatEndRef}
              recState={recState} startRecording={startRecording} speakScore={speakScore}
              setRecState={setRecState}
              prompt={SPEAK_PROMPTS[speakIdx]} nextSpeakPrompt={nextSpeakPrompt}
              premium={premium} usedCount={usedSpeakIds.length} poolSize={premium ? SPEAK_PROMPTS.length : FREE_SPEAK_LIMIT}
              uiLang={uiLang}
            />
          )}
          {screen === "profile" && (
            <ProfileScreen t={t} card={card} profile={profile} setProfile={setProfile} xp={xp} streak={streak} coins={coins} dark={dark} setDark={setDark} premium={premium} togglePremium={togglePremium} totalQuestions={totalQuestions} uiLang={uiLang} setUiLang={setUiLang} dailyGoal={dailyGoal} setDailyGoal={setDailyGoal} dailyGoalOptions={DAILY_GOAL_OPTIONS} remindersOn={remindersOn} setRemindersOn={setRemindersOn} soundOn={soundOn} setSoundOn={setSoundOn} topWeakAreas={topWeakAreas} leaderboard={leaderboard} leaderboardLoading={leaderboardLoading} refreshLeaderboard={refreshLeaderboard} userId={userId}
              badgeStats={{
                streak,
                xp,
                uiLangChanged: uiLang !== "English",
                chatCount: chat.filter((m) => m.role === "user").length,
                lessonsCompleted: Object.values(completedLessons).reduce((sum, arr) => sum + arr.filter(Boolean).length, 0),
              }}
            />
          )}
        </div>

        <div style={{ display: "flex", borderTop: `0.5px solid ${t.border}`, background: t.surface }}>
          <NavBtn id="home" Icon={Home} label={tr(uiLang, "nav_home")} />
          <NavBtn id="learn" Icon={BookOpen} label={tr(uiLang, "nav_learn")} />
          <NavBtn id="speak" Icon={Mic} label={tr(uiLang, "nav_speak")} />
          <NavBtn id="profile" Icon={User} label={tr(uiLang, "nav_profile")} />
        </div>

        {toast && (
          <div role="status" aria-live="polite" style={{
            position: "absolute", bottom: 74, left: "50%", transform: "translateX(-50%)",
            background: t.ink, color: t.bg, padding: "8px 16px", borderRadius: 999,
            fontSize: 13, fontWeight: 500, animation: "toastIn 0.2s ease-out", display: "flex", alignItems: "center", gap: 6,
          }}>
            <Sparkles size={14} color={t.marigold} /> {toast}
          </div>
        )}
      </div>
    </div>
  );
}

function SectionLabel({ children, t }) {
  return <p style={{ fontFamily: "'Baloo 2', sans-serif", fontSize: 13, fontWeight: 700, color: t.inkSoft, textTransform: "uppercase", letterSpacing: 0.6, margin: "20px 0 10px" }}>{children}</p>;
}

function HomeScreen({ t, card, profile, xp, streak, setScreen, currentDay, premium, uiLang, dailyGoal, dailyXp, lessonsToday, lessonProgressToday, unlockedCountToday, goToTodayLesson }) {
  const level = Math.floor(xp / 500) + 1;
  const levelPct = Math.round(((xp % 500) / 500) * 100);
  const wotd = VOCAB[0];
  const goalPct = Math.min(100, Math.round((dailyXp / dailyGoal) * 100));
  const goalMet = dailyXp >= dailyGoal;
  return (
    <div>
      <div style={{ ...card, padding: 16, display: "flex", alignItems: "center", gap: 14, marginTop: 6 }}>
        <StreakRing pct={levelPct} color={t.marigold} track={t.surfaceAlt} />
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, fontSize: 15, fontWeight: 600, color: t.ink }}>Hey {profile.name} 👋</p>
          <p style={{ margin: "2px 0 0", fontSize: 13, color: t.inkSoft }}>Level {level} · {xp} XP · {500 - (xp % 500)} to next level</p>
        </div>
      </div>

      <div style={{ ...card, padding: 14, marginTop: 10 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, fontWeight: 700, color: t.ink }}>
            <Flame size={15} color={goalMet ? t.sage : t.marigold} /> Daily goal
          </span>
          <span style={{ fontSize: 12, color: t.inkSoft, fontFamily: "'IBM Plex Mono', monospace" }}>{Math.min(dailyXp, dailyGoal)}/{dailyGoal} XP</span>
        </div>
        <div style={{ height: 10, borderRadius: 5, background: t.surfaceAlt, overflow: "hidden" }}>
          <div style={{ height: 10, borderRadius: 5, width: `${goalPct}%`, background: goalMet ? t.sage : t.marigold, transition: "width 0.5s ease" }} />
        </div>
        {goalMet && (
          <p style={{ margin: "8px 0 0", fontSize: 11, color: t.sageShadow, fontWeight: 700, display: "flex", alignItems: "center", gap: 4 }}>
            <Check size={12} /> Goal complete for today!
          </p>
        )}
      </div>

      <SectionLabel t={t}>{tr(uiLang, "section_plan")} · Day {currentDay}</SectionLabel>
      <div style={{ ...card, padding: 14 }}>
        <div style={{ display: "flex", gap: 6, marginBottom: 12 }}>
          {DAY_THEMES.map(({ day }) => {
            const isToday = day === currentDay;
            const locked = !premium && day > 1;
            return (
              <div key={day} style={{
                flex: 1, height: 34, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                background: isToday ? t.marigold : t.surfaceAlt,
                color: isToday ? t.marigoldText : locked ? t.inkSoft : t.ink,
                opacity: locked && !isToday ? 0.5 : 1,
                fontSize: 12, fontWeight: 600, position: "relative",
                transition: "background 0.2s ease, opacity 0.2s ease",
              }}>
                {locked && !isToday ? <Award size={12} /> : day}
              </div>
            );
          })}
        </div>
        <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: t.ink }}>{DAY_THEMES[currentDay - 1].title}</p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: t.inkSoft }}>{DAY_THEMES[currentDay - 1].focus}</p>
        <p style={{ margin: "10px 0 0", fontSize: 11, color: t.inkSoft }}>Plan repeats every 7 days · {premium ? "all days unlocked" : "days 2–7 need Premium"}</p>
      </div>

      <SectionLabel t={t}>{tr(uiLang, "section_skilltree")}</SectionLabel>
      <div style={{ ...card, padding: 14 }}>
        <div style={{ display: "flex", gap: 10, overflowX: "auto", paddingBottom: 4 }}>
          {lessonsToday.map((_, i) => {
            const done = lessonProgressToday[i];
            const locked = i > unlockedCountToday;
            const isNext = i === unlockedCountToday && !done;
            return (
              <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", flexShrink: 0, animation: `popIn 0.25s ease-out ${Math.min(i, 8) * 0.03}s both` }}>
                <button
                  className="duo-btn"
                  onClick={() => !locked && goToTodayLesson(i)}
                  disabled={locked}
                  style={{
                    width: 40, height: 40, borderRadius: "50%", border: "none",
                    background: done ? t.sage : isNext ? t.marigold : t.surfaceAlt,
                    color: done ? t.sageText : isNext ? t.marigoldText : t.inkSoft,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    boxShadow: done ? `0 3px 0 ${t.sageShadow}` : isNext ? `0 3px 0 ${t.marigoldShadow}` : "none",
                    opacity: locked ? 0.45 : 1, cursor: locked ? "default" : "pointer",
                    fontWeight: 800, fontSize: 13,
                  }}
                >
                  {done ? <Check size={16} /> : locked ? <Award size={13} /> : i + 1}
                </button>
                <span style={{ fontSize: 9, color: t.inkSoft, marginTop: 3, whiteSpace: "nowrap" }}>L{i + 1}</span>
              </div>
            );
          })}
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 11, color: t.inkSoft }}>{unlockedCountToday}/{lessonsToday.length} lessons done today · tap to jump in</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 10 }}>
        <button className="tap-scale" onClick={() => setScreen("speak")} style={{ ...card, padding: 14, textAlign: "left" }}>
          <Mic size={18} color={t.coral} />
          <p style={{ margin: "8px 0 2px", fontSize: 13, fontWeight: 600, color: t.ink }}>Speaking practice</p>
          <p style={{ margin: 0, fontSize: 11, color: t.inkSoft }}>10 min challenge</p>
        </button>
        <button className="tap-scale" onClick={() => setScreen("learn")} style={{ ...card, padding: 14, textAlign: "left" }}>
          <Sparkles size={18} color={t.sage} />
          <p style={{ margin: "8px 0 2px", fontSize: 13, fontWeight: 600, color: t.ink }}>Daily challenge</p>
          <p style={{ margin: 0, fontSize: 11, color: t.inkSoft }}>Learn 10 new words</p>
        </button>
      </div>

      <SectionLabel t={t}>{tr(uiLang, "section_wotd")}</SectionLabel>
      <div style={{ ...card, padding: 16 }}>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <p style={{ margin: 0, fontFamily: "'Baloo 2', sans-serif", fontSize: 18, fontWeight: 700, color: t.ink }}>{wotd.word}</p>
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, color: t.inkSoft }}>{wotd.ipa}</span>
          <Volume2 size={14} color={t.marigold} />
        </div>
        <p style={{ margin: "6px 0 0", fontSize: 13, color: t.inkSoft }}>{wotd.meaning}</p>
      </div>

      <SectionLabel t={t}>{tr(uiLang, "section_tip")}</SectionLabel>
      <div style={{ ...card, padding: 16 }}>
        <p style={{ margin: 0, fontSize: 13, color: t.ink, lineHeight: 1.6 }}>
          Use the present perfect ("I have finished") for actions with a result that matters now — not just to describe the past.
        </p>
      </div>
    </div>
  );
}

function LearnScreen({
  t, card, vocab, flashIdx, setFlashIdx, flipped, setFlipped, known, setKnown,
  quizLevel, setQuizLevel, currentDay,
  lessons, lessonProgress, unlockedCount, activeLesson, openLesson, closeLesson, markLessonComplete,
  quizIdx, setQuizIdx, quizPicked, setQuizPicked, quizScore, setQuizScore,
  addXp, premium, setScreen,
  hearts, loseHeart, refillHearts, heartMax, refillCost,
  uiLang, recordMistake, soundOn,
}) {
  const word = vocab[flashIdx];

  const nextCard = (mark) => {
    setKnown((k) => ({ ...k, [flashIdx]: mark }));
    setFlipped(false);
    if (mark) addXp(3);
    setFlashIdx((i) => (i + 1) % vocab.length);
  };

  const [showUpsell, setShowUpsell] = useState(false);

  const changeLevel = (level) => {
    if (level !== "Beginner" && !premium) { setShowUpsell(true); return; }
    setShowUpsell(false);
    if (level === quizLevel) return;
    setQuizLevel(level);
  };

  const levelTextColor = quizLevel === "Beginner" ? t.sageText : quizLevel === "Intermediate" ? t.marigoldText : t.coralText;
  const levelColor = quizLevel === "Beginner" ? t.sage : quizLevel === "Intermediate" ? t.marigold : t.coral;
  const levelShadow = quizLevel === "Beginner" ? t.sageShadow : quizLevel === "Intermediate" ? t.marigoldShadow : t.coralShadow;

  return (
    <div>
      <SectionLabel t={t}>{tr(uiLang, "section_flashcards")}</SectionLabel>
      <div onClick={() => setFlipped((f) => !f)} className="tap-scale" style={{ ...card, padding: 20, minHeight: 150, display: "flex", flexDirection: "column", justifyContent: "center", cursor: "pointer" }}>
        {!flipped ? (
          <div style={{ textAlign: "center" }}>
            <p style={{ margin: 0, fontFamily: "'Baloo 2', sans-serif", fontSize: 22, fontWeight: 700, color: t.ink }}>{word.word}</p>
            <p style={{ margin: "6px 0 0", fontFamily: "'IBM Plex Mono', monospace", fontSize: 13, color: t.inkSoft }}>{word.ipa}</p>
            <p style={{ margin: "14px 0 0", fontSize: 11, color: t.inkSoft }}>{tr(uiLang, "tap_reveal")}</p>
          </div>
        ) : (
          <div>
            <p style={{ margin: 0, fontSize: 13, color: t.ink, fontWeight: 600 }}>{word.meaning}</p>
            <p style={{ margin: "8px 0 0", fontSize: 12, color: t.inkSoft, fontStyle: "italic" }}>"{word.example}"</p>
          </div>
        )}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        <button className="duo-btn" onClick={() => nextCard(false)} style={{ flex: 1, ...card, padding: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: t.coralText }}>
          <RotateCcw size={15} /> {tr(uiLang, "btn_review_again")}
        </button>
        <button className="duo-btn" onClick={() => nextCard(true)} style={{ flex: 1, background: t.sage, border: "none", borderRadius: 16, padding: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, color: t.sageText, fontWeight: 800, boxShadow: `0 4px 0 ${t.sageShadow}` }}>
          <Check size={15} /> {tr(uiLang, "btn_i_know")}
        </button>
      </div>

      <SectionLabel t={t}>{tr(uiLang, "section_lessons")}</SectionLabel>
      <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
        {QUIZ_LEVELS.map((lvl) => {
          const activeLvl = lvl === quizLevel && !showUpsell;
          const locked = lvl !== "Beginner" && !premium;
          const c = lvl === "Beginner" ? t.sage : lvl === "Intermediate" ? t.marigold : t.coral;
          const cText = lvl === "Beginner" ? t.sageText : lvl === "Intermediate" ? t.marigoldText : t.coralText;
          return (
            <button
              key={lvl}
              className="tap-scale"
              onClick={() => changeLevel(lvl)}
              style={{
                flex: 1, padding: "8px 0", borderRadius: 12, fontSize: 12, fontWeight: 600,
                border: `1.5px solid ${activeLvl ? c : t.border}`,
                background: activeLvl ? c : t.surface,
                color: activeLvl ? cText : t.inkSoft,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 4,
                transition: "background 0.15s ease, border-color 0.15s ease",
              }}
            >
              {locked && <Award size={11} />} {lvl}
            </button>
          );
        })}
      </div>

      {showUpsell ? (
        <div style={{ ...card, padding: 18, textAlign: "center", background: t.surfaceAlt, border: "none", animation: "screenFade 0.2s ease-out" }}>
          <Award size={22} color={t.marigold} style={{ marginBottom: 8 }} />
          <p style={{ margin: 0, fontWeight: 700, color: t.ink, fontSize: 14 }}>Intermediate & Advanced are Premium</p>
          <p style={{ margin: "6px 0 12px", fontSize: 12, color: t.inkSoft }}>Unlock 4,000+ more questions across every level.</p>
          <button className="duo-btn" onClick={() => setScreen("profile")} style={{ padding: "9px 18px", borderRadius: 12, border: "none", background: t.marigold, color: t.marigoldText, fontWeight: 600, fontSize: 13 }}>
            Go to Premium
          </button>
        </div>
      ) : activeLesson === null ? (
        <LessonPath
          t={t} card={card}
          lessons={lessons} lessonProgress={lessonProgress} unlockedCount={unlockedCount}
          openLesson={openLesson} levelColor={levelColor} levelTextColor={levelTextColor} levelShadow={levelShadow}
          quizLevel={quizLevel} currentDay={currentDay}
          hearts={hearts} premium={premium} refillHearts={refillHearts} heartMax={heartMax} refillCost={refillCost}
        />
      ) : (
        <LessonQuiz
          t={t} card={card}
          questions={lessons[activeLesson]} lessonNumber={activeLesson + 1}
          quizIdx={quizIdx} setQuizIdx={setQuizIdx}
          quizPicked={quizPicked} setQuizPicked={setQuizPicked}
          quizScore={quizScore} setQuizScore={setQuizScore}
          addXp={addXp} closeLesson={closeLesson}
          onLessonComplete={() => markLessonComplete(activeLesson)}
          levelTextColor={levelTextColor}
          hearts={hearts} loseHeart={loseHeart} refillHearts={refillHearts} heartMax={heartMax} refillCost={refillCost} premium={premium}
          uiLang={uiLang} recordMistake={recordMistake} soundOn={soundOn}
        />
      )}

      <SectionLabel t={t}>Reading practice</SectionLabel>
      <ReadingPractice t={t} card={card} addXp={addXp} />
    </div>
  );
}

function ReadingPractice({ t, card, addXp }) {
  const [passageIdx, setPassageIdx] = useState(0);
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const passage = READING_PASSAGES[passageIdx];
  const q = passage.questions[qIdx];

  const pick = (i) => {
    if (picked !== null) return;
    setPicked(i);
    const correct = i === q.answer;
    if (correct) setScore((s) => s + 1);
    setTimeout(() => {
      setPicked(null);
      if (qIdx + 1 < passage.questions.length) {
        setQIdx((n) => n + 1);
      } else {
        setDone(true);
        addXp(15);
      }
    }, 900);
  };

  const nextPassage = () => {
    setPassageIdx((p) => (p + 1) % READING_PASSAGES.length);
    setQIdx(0);
    setPicked(null);
    setScore(0);
    setDone(false);
  };

  return (
    <div style={{ ...card, padding: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <p style={{ margin: 0, fontFamily: "'Baloo 2', sans-serif", fontSize: 15, fontWeight: 700, color: t.ink }}>{passage.title}</p>
        <button className="tap-scale" aria-label="Listen to the passage" onClick={() => speakText(passage.text)} style={{ width: 30, height: 30, borderRadius: 9, border: `0.5px solid ${t.border}`, background: t.surfaceAlt, display: "flex", alignItems: "center", justifyContent: "center", color: t.marigold }}>
          <Volume2 size={14} />
        </button>
      </div>
      <p style={{ margin: "0 0 14px", fontSize: 13, color: t.inkSoft, lineHeight: 1.6 }}>{passage.text}</p>

      {!done ? (
        <div>
          <Pill bg={t.surfaceAlt} fg={t.inkSoft}>Question {qIdx + 1} of {passage.questions.length}</Pill>
          <p style={{ margin: "10px 0 10px", fontSize: 14, fontWeight: 600, color: t.ink }}>{q.q}</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {q.options.map((opt, i) => {
              let bg = t.surfaceAlt, fg = t.ink, border = t.border;
              if (picked !== null) {
                if (i === q.answer) { bg = t.sage; fg = t.sageText; }
                else if (i === picked) { bg = t.coral; fg = t.coralText; }
              }
              return (
                <button key={i} className="tap-scale" onClick={() => pick(i)} style={{ textAlign: "left", padding: "10px 12px", borderRadius: 12, border: `1px solid ${border}`, background: bg, color: fg, fontSize: 13 }}>
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div style={{ textAlign: "center", padding: "8px 0", animation: "popIn 0.25s ease-out" }}>
          <p style={{ margin: 0, fontSize: 13, fontWeight: 700, color: t.ink }}>Nice reading — {score}/{passage.questions.length} correct</p>
          <button className="duo-btn" onClick={nextPassage} style={{ marginTop: 10, padding: "8px 18px", borderRadius: 12, border: "none", background: t.blue, color: t.blueText, fontWeight: 800, fontSize: 12, boxShadow: `0 3px 0 ${t.blueShadow}` }}>
            Next passage
          </button>
        </div>
      )}
    </div>
  );
}

function LessonPath({ t, card, lessons, lessonProgress, unlockedCount, openLesson, levelColor, levelTextColor, levelShadow, quizLevel, currentDay, hearts, premium, refillHearts, heartMax, refillCost }) {
  if (lessons.length === 0) {
    return (
      <div style={{ ...card, padding: 18, textAlign: "center" }}>
        <p style={{ margin: 0, fontSize: 13, color: t.inkSoft }}>No lessons available yet.</p>
      </div>
    );
  }
  const outOfHearts = !premium && hearts <= 0;
  return (
    <div style={{ ...card, padding: "20px 16px" }}>
      {outOfHearts && (
        <div style={{ background: t.surfaceAlt, borderRadius: 12, padding: 12, marginBottom: 16, textAlign: "center" }}>
          <p style={{ margin: "0 0 8px", fontSize: 12, color: t.coralText, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", gap: 4 }}>
            <Heart size={13} color={t.coral} fill={t.coral} /> Out of hearts
          </p>
          <button
            className="duo-btn"
            onClick={refillHearts}
            style={{ padding: "8px 16px", borderRadius: 12, border: "none", background: t.coral, color: t.coralText, fontWeight: 800, fontSize: 12, boxShadow: `0 3px 0 ${t.coralShadow}` }}
          >
            Refill {heartMax} hearts — {refillCost} coins
          </button>
        </div>
      )}
      <p style={{ margin: "0 0 16px", fontSize: 12, color: t.inkSoft, textAlign: "center" }}>
        {quizLevel === "Beginner" ? `Day ${currentDay} · ` : ""}{lessons.length} short lessons · {LESSON_SIZE_LABEL} questions each
      </p>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
        {lessons.map((_, i) => {
          const done = lessonProgress[i];
          const locked = i > unlockedCount;
          const isNext = i === unlockedCount && !done;
          const offset = [0, 34, 54, 34, 0, -34, -54, -34][i % 8];
          return (
            <div key={i} style={{ display: "flex", flexDirection: "column", alignItems: "center", transform: `translateX(${offset}px)`, animation: `popIn 0.3s ease-out ${Math.min(i, 10) * 0.03}s both` }}>
              <button
                className="duo-btn"
                onClick={() => !locked && openLesson(i)}
                disabled={locked}
                style={{
                  width: 52, height: 52, borderRadius: "50%", border: "none",
                  background: done ? t.sage : isNext ? levelColor : t.surfaceAlt,
                  color: done ? t.sageText : isNext ? levelTextColor : t.inkSoft,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  boxShadow: done ? `0 4px 0 ${t.sageShadow}` : isNext ? `0 4px 0 ${levelShadow}` : "none",
                  opacity: locked ? 0.5 : 1, cursor: locked ? "default" : "pointer",
                  fontWeight: 800, fontSize: 15,
                }}
              >
                {done ? <Check size={20} /> : locked ? <Award size={16} /> : i + 1}
              </button>
              <span style={{ fontSize: 10, color: t.inkSoft, marginTop: 4 }}>Lesson {i + 1}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const LESSON_SIZE_LABEL = LESSON_SIZE;

function speakText(text) {
  try {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.rate = 0.85;
    utter.lang = "en-US";
    window.speechSynthesis.speak(utter);
  } catch (e) { /* speech synthesis unavailable */ }
}

// Tiny synthesized sound effects via Web Audio API — no audio files needed.
let _audioCtx = null;
function getAudioCtx() {
  try {
    if (!_audioCtx) {
      const Ctor = window.AudioContext || window.webkitAudioContext;
      if (!Ctor) return null;
      _audioCtx = new Ctor();
    }
    if (_audioCtx.state === "suspended") _audioCtx.resume();
    return _audioCtx;
  } catch (e) { return null; }
}
function playTone(freq, startOffset, duration, ctx, type = "sine", gainPeak = 0.09) {
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  const t0 = ctx.currentTime + startOffset;
  gain.gain.setValueAtTime(0, t0);
  gain.gain.linearRampToValueAtTime(gainPeak, t0 + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.001, t0 + duration);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.02);
}
function playSound(kind) {
  const ctx = getAudioCtx();
  if (!ctx) return;
  try {
    if (kind === "correct") {
      playTone(660, 0, 0.12, ctx);
      playTone(880, 0.08, 0.16, ctx);
    } else if (kind === "wrong") {
      playTone(220, 0, 0.18, ctx, "triangle", 0.08);
    } else if (kind === "complete") {
      playTone(523, 0, 0.12, ctx);
      playTone(659, 0.1, 0.12, ctx);
      playTone(784, 0.2, 0.22, ctx);
    } else if (kind === "tap") {
      playTone(440, 0, 0.05, ctx, "sine", 0.05);
    }
  } catch (e) { /* audio blocked (needs a user gesture first) — silently skip */ }
}

function LessonQuiz({ t, card, questions, lessonNumber, quizIdx, setQuizIdx, quizPicked, setQuizPicked, quizScore, setQuizScore, addXp, closeLesson, onLessonComplete, levelTextColor, hearts, loseHeart, refillHearts, heartMax, refillCost, premium, uiLang, recordMistake, soundOn }) {
  const q = questions[quizIdx];
  const quizDone = quizIdx >= questions.length;
  const [outOfHearts, setOutOfHearts] = useState(false);
  const [shake, setShake] = useState(false);
  const [combo, setCombo] = useState(0);
  const [comboPop, setComboPop] = useState(false);
  const [xpThisLesson, setXpThisLesson] = useState(0);
  const [bestCombo, setBestCombo] = useState(0);
  const [heartsLostThisLesson, setHeartsLostThisLesson] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const ping = (kind) => { if (soundOn) playSound(kind); };

  const comboMultiplier = (c) => (c >= 5 ? 2 : c >= 3 ? 1.5 : 1);

  const registerCorrect = () => {
    ping("correct");
    setQuizScore((s) => s + 1);
    const nextCombo = combo + 1;
    setCombo(nextCombo);
    setBestCombo((b) => Math.max(b, nextCombo));
    const gained = Math.round(10 * comboMultiplier(nextCombo));
    addXp(gained);
    setXpThisLesson((x) => x + gained);
    if (nextCombo === 3 || nextCombo === 5) {
      setComboPop(true);
      setTimeout(() => setComboPop(false), 700);
    }
  };
  const registerWrong = () => {
    ping("wrong");
    loseHeart();
    setHeartsLostThisLesson((n) => n + 1);
    setCombo(0);
    recordMistake(q.tense);
  };

  const advanceOrFail = (wasWrong) => {
    if (wasWrong && !premium && hearts <= 1) {
      setOutOfHearts(true);
    } else {
      setQuizIdx((i) => i + 1);
    }
  };

  const pickAnswer = (idx) => {
    if (quizPicked !== null || outOfHearts) return;
    setQuizPicked(idx);
    const wrong = idx !== q.answer;
    if (!wrong) registerCorrect();
    else { registerWrong(); setShake(true); setTimeout(() => setShake(false), 400); }
    timerRef.current = setTimeout(() => { setQuizPicked(null); advanceOrFail(wrong); }, 900);
  };

  const registerListenResult = (correct) => {
    if (correct) registerCorrect();
    else registerWrong();
    timerRef.current = setTimeout(() => { advanceOrFail(!correct); }, 1300);
  };

  useEffect(() => {
    if (quizDone) { onLessonComplete(); ping("complete"); }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizDone]);

  if (outOfHearts) {
    return (
      <div style={{ ...card, padding: 20, textAlign: "center" }}>
        <Heart size={30} color={t.coral} fill={t.coral} style={{ marginBottom: 8 }} />
        <p style={{ margin: 0, fontWeight: 800, fontSize: 15, color: t.ink }}>Out of hearts!</p>
        <p style={{ margin: "6px 0 16px", fontSize: 12, color: t.inkSoft }}>Refill your hearts with coins to keep going, or come back later.</p>
        <button
          className="duo-btn"
          onClick={() => { refillHearts(); setOutOfHearts(false); }}
          style={{ width: "100%", padding: 12, borderRadius: 14, border: "none", background: t.coral, color: t.coralText, fontWeight: 800, fontSize: 13, boxShadow: `0 4px 0 ${t.coralShadow}`, marginBottom: 8, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}
        >
          <CoinsIcon size={14} /> Refill {heartMax} hearts — {refillCost} coins
        </button>
        <button className="tap-scale" onClick={closeLesson} style={{ width: "100%", padding: 10, borderRadius: 12, border: `1px solid ${t.border}`, background: "transparent", color: t.inkSoft, fontWeight: 600, fontSize: 12 }}>
          Exit lesson
        </button>
      </div>
    );
  }

  return (
    <div style={{ ...card, padding: 16, animation: shake ? "shakeX 0.4s ease" : "none", position: "relative" }}>
      {comboPop && (
        <div style={{
          position: "absolute", top: -14, left: "50%", transform: "translateX(-50%)",
          background: t.marigold, color: t.marigoldText, fontWeight: 800, fontSize: 12,
          padding: "4px 12px", borderRadius: 999, animation: "popIn 0.3s ease-out", display: "flex", alignItems: "center", gap: 4,
          boxShadow: `0 3px 0 ${t.marigoldShadow}`,
        }}>
          <Flame size={13} /> {combo}x combo — {comboMultiplier(combo)}x XP
        </div>
      )}
      {!quizDone ? (
        <>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <button className="tap-scale" onClick={closeLesson} style={{ background: "none", border: "none", display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: t.inkSoft, padding: 0 }}>
              <ChevronLeft size={14} /> Lessons
            </button>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              {combo >= 2 && (
                <Pill bg={t.surfaceAlt} fg={t.marigoldText}><Flame size={11} color={t.marigold} />{combo}</Pill>
              )}
              <Pill bg={t.surfaceAlt} fg={t.coralText}><Heart size={11} color={t.coral} fill={t.coral} />{premium ? "∞" : hearts}</Pill>
              <Pill bg={t.surfaceAlt} fg={levelTextColor}>Lesson {lessonNumber} · {quizIdx + 1}/{questions.length}</Pill>
            </div>
          </div>

          {q.type === "listen" ? (
            <ListenTypeQuestion t={t} q={q} quizIdx={quizIdx} onResult={registerListenResult} uiLang={uiLang} />
          ) : q.type === "wordbank" ? (
            <WordBankQuestion t={t} q={q} quizIdx={quizIdx} onResult={registerListenResult} />
          ) : q.type === "matching" ? (
            <MatchingQuestion t={t} q={q} quizIdx={quizIdx} onResult={registerListenResult} />
          ) : (
            <>
              <p style={{ margin: "0 0 14px", fontSize: 15, fontWeight: 600, color: t.ink }}>{q.q}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {q.options.map((opt, i) => {
                  let bg = t.surfaceAlt, fg = t.ink, border = t.border;
                  if (quizPicked !== null) {
                    if (i === q.answer) { bg = t.sage; fg = t.sageText; }
                    else if (i === quizPicked) { bg = t.coral; fg = t.coralText; }
                  }
                  return (
                    <button key={i} className="tap-scale" onClick={() => pickAnswer(i)} style={{ textAlign: "left", padding: "10px 12px", borderRadius: 12, border: `1px solid ${border}`, background: bg, color: fg, fontSize: 13, display: "flex", justifyContent: "space-between", alignItems: "center", transition: "background 0.15s ease, border-color 0.15s ease" }}>
                      {opt}
                      {quizPicked !== null && i === q.answer && <Check size={14} />}
                      {quizPicked !== null && i === quizPicked && i !== q.answer && <X size={14} />}
                    </button>
                  );
                })}
              </div>
            </>
          )}
        </>
      ) : (
        <div style={{ textAlign: "center", padding: "14px 4px", animation: "popIn 0.3s ease-out" }}>
          <Trophy size={30} color={t.marigold} style={{ marginBottom: 8 }} />
          <p style={{ margin: 0, fontWeight: 800, fontSize: 16, color: t.ink }}>Lesson {lessonNumber} complete!</p>
          <p style={{ margin: "4px 0 16px", fontSize: 12, color: t.inkSoft }}>{quizScore}/{questions.length} correct</p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 16 }}>
            <div style={{ background: t.surfaceAlt, borderRadius: 12, padding: "10px 6px" }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: t.marigoldText, fontFamily: "'IBM Plex Mono', monospace" }}>+{xpThisLesson}</p>
              <p style={{ margin: "2px 0 0", fontSize: 10, color: t.inkSoft }}>XP earned</p>
            </div>
            <div style={{ background: t.surfaceAlt, borderRadius: 12, padding: "10px 6px" }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: t.sageShadow, fontFamily: "'IBM Plex Mono', monospace" }}>{bestCombo}x</p>
              <p style={{ margin: "2px 0 0", fontSize: 10, color: t.inkSoft }}>Best combo</p>
            </div>
            <div style={{ background: t.surfaceAlt, borderRadius: 12, padding: "10px 6px" }}>
              <p style={{ margin: 0, fontSize: 15, fontWeight: 800, color: t.coralText, fontFamily: "'IBM Plex Mono', monospace" }}>{heartsLostThisLesson}</p>
              <p style={{ margin: "2px 0 0", fontSize: 10, color: t.inkSoft }}>Hearts lost</p>
            </div>
          </div>

          <button className="duo-btn" onClick={closeLesson} style={{ width: "100%", padding: "10px 16px", borderRadius: 12, border: "none", background: t.sage, color: t.sageText, fontWeight: 800, fontSize: 13, boxShadow: `0 4px 0 ${t.sageShadow}` }}>
            {tr(uiLang, "btn_back_to_lessons")}
          </button>
        </div>
      )}
    </div>
  );
}

function normalizeSentence(s) {
  return s.trim().toLowerCase().replace(/[.!?]+$/g, "").replace(/\s+/g, " ");
}

function ListenTypeQuestion({ t, q, quizIdx, onResult, uiLang }) {
  const [typed, setTyped] = useState("");
  const [checked, setChecked] = useState(null); // null | "correct" | "wrong"

  useEffect(() => {
    setTyped("");
    setChecked(null);
    speakText(q.sentence);
    return () => { try { window.speechSynthesis && window.speechSynthesis.cancel(); } catch (e) {} };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quizIdx]);

  const submit = () => {
    if (checked || !typed.trim()) return;
    const correct = normalizeSentence(typed) === normalizeSentence(q.answer);
    setChecked(correct ? "correct" : "wrong");
    onResult(correct);
  };

  return (
    <div>
      <p style={{ margin: "0 0 12px", fontSize: 12, color: t.inkSoft, textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 700 }}>
        {tr(uiLang, "listen_prompt")}
      </p>
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 16 }}>
        <button
          className="duo-btn"
          onClick={() => speakText(q.sentence)}
          aria-label="Play sentence audio"
          style={{
            width: 64, height: 64, borderRadius: "50%", border: "none",
            background: t.blue, color: t.blueText,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: `0 4px 0 ${t.blueShadow}`,
          }}
        >
          <Volume2 size={26} />
        </button>
      </div>
      <input
        value={typed}
        onChange={(e) => setTyped(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        disabled={!!checked}
        placeholder={tr(uiLang, "placeholder_listen")}
        style={{
          width: "100%", boxSizing: "border-box", border: `1.5px solid ${checked === "correct" ? t.sage : checked === "wrong" ? t.coral : t.border}`,
          background: t.bg, color: t.ink, borderRadius: 12, padding: "12px 14px", fontSize: 14, outline: "none", marginBottom: 10,
          transition: "border-color 0.2s ease",
        }}
      />
      {checked && (
        <p style={{ margin: "0 0 10px", fontSize: 12, color: checked === "correct" ? t.sageShadow : t.coralText, animation: "popIn 0.2s ease-out" }}>
          {checked === "correct" ? "Nice — that's it!" : `Correct answer: "${q.answer}"`}
        </p>
      )}
      <button
        className="duo-btn"
        onClick={submit}
        disabled={!!checked || !typed.trim()}
        style={{
          width: "100%", padding: 12, borderRadius: 14, border: "none",
          background: checked ? t.surfaceAlt : t.sage,
          color: checked ? t.inkSoft : t.sageText,
          fontWeight: 800, fontSize: 13,
          boxShadow: checked ? "none" : `0 4px 0 ${t.sageShadow}`,
          opacity: !typed.trim() && !checked ? 0.6 : 1,
        }}
      >
        {tr(uiLang, "btn_check")}
      </button>
    </div>
  );
}

function WordBankQuestion({ t, q, quizIdx, onResult }) {
  const [built, setBuilt] = useState([]); // array of {word, chipIdx}
  const [usedIdx, setUsedIdx] = useState([]); // indices from q.chips already placed
  const [checked, setChecked] = useState(null); // null | "correct" | "wrong"

  useEffect(() => {
    setBuilt([]);
    setUsedIdx([]);
    setChecked(null);
  }, [quizIdx]);

  const addWord = (word, idx) => {
    if (checked) return;
    setBuilt((b) => [...b, { word, idx }]);
    setUsedIdx((u) => [...u, idx]);
  };
  const removeWord = (posInBuilt) => {
    if (checked) return;
    const item = built[posInBuilt];
    setBuilt((b) => b.filter((_, i) => i !== posInBuilt));
    setUsedIdx((u) => u.filter((i) => i !== item.idx));
  };

  const submit = () => {
    if (checked || built.length === 0) return;
    const attempt = built.map((b) => b.word).join(" ");
    const correct = normalizeSentence(attempt) === normalizeSentence(q.sentence);
    setChecked(correct ? "correct" : "wrong");
    onResult(correct);
  };

  return (
    <div>
      <p style={{ margin: "0 0 12px", fontSize: 12, color: t.inkSoft, textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 700 }}>
        Tap the words to build the sentence
      </p>

      <div style={{
        minHeight: 56, borderRadius: 12, border: `1.5px dashed ${checked === "correct" ? t.sage : checked === "wrong" ? t.coral : t.border}`,
        padding: 10, display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 16, alignItems: "flex-start",
      }}>
        {built.length === 0 && <span style={{ fontSize: 12, color: t.inkSoft, padding: "6px 0" }}>Tap words below…</span>}
        {built.map((b, i) => (
          <button
            key={i}
            className="tap-scale"
            onClick={() => removeWord(i)}
            disabled={!!checked}
            style={{ padding: "6px 12px", borderRadius: 10, border: `1px solid ${t.border}`, background: t.surface, color: t.ink, fontSize: 13, fontWeight: 600 }}
          >
            {b.word}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 16 }}>
        {q.chips.map((word, idx) => (
          <button
            key={idx}
            className="tap-scale"
            onClick={() => addWord(word, idx)}
            disabled={usedIdx.includes(idx) || !!checked}
            style={{
              padding: "8px 14px", borderRadius: 12, border: `1px solid ${t.border}`,
              background: usedIdx.includes(idx) ? t.surfaceAlt : t.surface,
              color: usedIdx.includes(idx) ? t.inkSoft : t.ink,
              opacity: usedIdx.includes(idx) ? 0.4 : 1,
              fontSize: 13, fontWeight: 600,
              boxShadow: usedIdx.includes(idx) ? "none" : `0 2px 0 ${t.border}`,
            }}
          >
            {word}
          </button>
        ))}
      </div>

      {checked && (
        <p style={{ margin: "0 0 10px", fontSize: 12, color: checked === "correct" ? t.sageShadow : t.coralText, animation: "popIn 0.2s ease-out" }}>
          {checked === "correct" ? "Nice — that's it!" : `Correct answer: "${q.sentence}"`}
        </p>
      )}
      <button
        className="duo-btn"
        onClick={submit}
        disabled={!!checked || built.length === 0}
        style={{
          width: "100%", padding: 12, borderRadius: 14, border: "none",
          background: checked ? t.surfaceAlt : t.sage,
          color: checked ? t.inkSoft : t.sageText,
          fontWeight: 800, fontSize: 13,
          boxShadow: checked ? "none" : `0 4px 0 ${t.sageShadow}`,
          opacity: built.length === 0 && !checked ? 0.6 : 1,
        }}
      >
        Check
      </button>
    </div>
  );
}

function MatchingQuestion({ t, q, quizIdx, onResult }) {
  const [shuffledRights, setShuffledRights] = useState([]);
  const [selectedLeft, setSelectedLeft] = useState(null);
  const [matched, setMatched] = useState([]); // right indices matched
  const [matchedLefts, setMatchedLefts] = useState([]); // left indices matched
  const [wrongFlash, setWrongFlash] = useState(null); // { leftIdx, rightIdx }
  const [hadMistake, setHadMistake] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    setShuffledRights(shuffle(q.pairs.map((p, i) => ({ text: p.right, origIdx: i }))));
    setSelectedLeft(null);
    setMatched([]);
    setMatchedLefts([]);
    setWrongFlash(null);
    setHadMistake(false);
    setDone(false);
  }, [quizIdx]);

  const pickLeft = (idx) => {
    if (done || matchedLefts.includes(idx)) return;
    setSelectedLeft(idx);
  };

  const pickRight = (rightIdx, origIdx) => {
    if (done || selectedLeft === null || matched.includes(rightIdx)) return;
    if (origIdx === selectedLeft) {
      const nextMatched = [...matched, rightIdx];
      const nextMatchedLefts = [...matchedLefts, selectedLeft];
      setMatched(nextMatched);
      setMatchedLefts(nextMatchedLefts);
      setSelectedLeft(null);
      if (nextMatchedLefts.length === q.pairs.length) {
        setDone(true);
        setTimeout(() => onResult(!hadMistake), 500);
      }
    } else {
      setHadMistake(true);
      setWrongFlash({ leftIdx: selectedLeft, rightIdx });
      setTimeout(() => { setWrongFlash(null); setSelectedLeft(null); }, 450);
    }
  };

  return (
    <div>
      <p style={{ margin: "0 0 12px", fontSize: 12, color: t.inkSoft, textTransform: "uppercase", letterSpacing: 0.4, fontWeight: 700 }}>
        Tap matching pairs
      </p>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {q.pairs.map((p, i) => {
            const isMatched = matchedLefts.includes(i);
            const isSelected = selectedLeft === i;
            const isWrong = wrongFlash?.leftIdx === i;
            return (
              <button
                key={i}
                className="tap-scale"
                onClick={() => pickLeft(i)}
                disabled={isMatched}
                style={{
                  padding: "10px 10px", borderRadius: 10, fontSize: 12, fontWeight: 600, textAlign: "left",
                  border: `1.5px solid ${isWrong ? t.coral : isSelected ? t.marigold : isMatched ? t.sage : t.border}`,
                  background: isWrong ? `${t.coral}22` : isSelected ? `${t.marigold}22` : isMatched ? t.sage : t.surface,
                  color: isMatched ? t.sageText : t.ink,
                  opacity: isMatched ? 0.7 : 1,
                }}
              >
                {p.left}
              </button>
            );
          })}
        </div>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
          {shuffledRights.map(({ text, origIdx }, i) => {
            const isMatched = matched.includes(i);
            const isWrong = wrongFlash?.rightIdx === i;
            return (
              <button
                key={i}
                className="tap-scale"
                onClick={() => pickRight(i, origIdx)}
                disabled={isMatched}
                style={{
                  padding: "10px 10px", borderRadius: 10, fontSize: 12, fontWeight: 600, textAlign: "left",
                  border: `1.5px solid ${isWrong ? t.coral : isMatched ? t.sage : t.border}`,
                  background: isWrong ? `${t.coral}22` : isMatched ? t.sage : t.surface,
                  color: isMatched ? t.sageText : t.ink,
                  opacity: isMatched ? 0.7 : 1,
                }}
              >
                {text}
              </button>
            );
          })}
        </div>
      </div>
      {done && (
        <p style={{ margin: "12px 0 0", fontSize: 12, color: hadMistake ? t.coralText : t.sageShadow, textAlign: "center", animation: "popIn 0.2s ease-out" }}>
          {hadMistake ? "All matched — with a slip along the way." : "Perfect match!"}
        </p>
      )}
    </div>
  );
}

function SpeakScreen({ t, card, chat, chatInput, setChatInput, chatLoading, sendChat, chatEndRef, recState, startRecording, speakScore, setRecState, prompt, nextSpeakPrompt, premium, usedCount, poolSize, uiLang }) {
  return (
    <div>
      <SectionLabel t={t}>{tr(uiLang, "section_speaking")}</SectionLabel>
      <div style={{ ...card, padding: 18, textAlign: "center" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <Pill bg={t.surfaceAlt} fg={t.inkSoft}>{prompt?.tag || "Practice"}</Pill>
          <button className="tap-scale" onClick={nextSpeakPrompt} style={{ background: "none", border: "none", color: t.marigold, fontSize: 12, fontWeight: 600, display: "flex", alignItems: "center", gap: 4 }}>
            <RotateCcw size={12} /> {tr(uiLang, "btn_new_sentence")}
          </button>
        </div>
        <p style={{ margin: "0 0 6px", fontSize: 13, color: t.inkSoft }}>Read this sentence aloud:</p>
        <p style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 600, color: t.ink, fontStyle: "italic" }}>"{prompt?.text}"</p>
        <p style={{ margin: "0 0 14px", fontSize: 11, color: t.inkSoft }}>
          {premium ? `Full pool: ${poolSize} sentences` : `Free pool: ${poolSize} sentences · Premium unlocks 30+`}
        </p>
        <button
          className="duo-btn"
          onClick={startRecording}
          disabled={recState === "recording"}
          aria-label={recState === "recording" ? "Recording…" : "Start recording"}
          style={{
            width: 64, height: 64, borderRadius: "50%", border: "none", margin: "0 auto",
            background: recState === "recording" ? t.coral : t.marigold,
            color: recState === "recording" ? t.coralText : t.marigoldText,
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: recState === "recording" ? `0 4px 0 ${t.coralShadow}` : `0 4px 0 ${t.marigoldShadow}`,
          }}
        >
          {recState === "recording" ? <Waveform bars={4} active color={t.coralText} height={20} /> : <Mic size={24} />}
        </button>
        <p style={{ marginTop: 10, fontSize: 12, color: t.inkSoft }}>
          {recState === "recording" ? "Listening…" : recState === "scored" ? "Tap to try again" : "Tap to record"}
        </p>

        {speakScore && (
          <div style={{ marginTop: 16, textAlign: "left", animation: "popIn 0.3s ease-out" }}>
            {speakScore.transcript && (
              <p style={{ margin: "0 0 10px", fontSize: 12, color: t.inkSoft, background: t.bg, padding: 8, borderRadius: 8, border: `1px solid ${t.border}` }}>
                Heard: <span style={{ color: t.ink, fontWeight: 600 }}>"{speakScore.transcript}"</span>
              </p>
            )}
            {[["Pronunciation", speakScore.pron], ["Fluency", speakScore.flu], ["Accuracy", speakScore.acc]].map(([label, val]) => (
              <div key={label} style={{ marginBottom: 8 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: t.inkSoft, marginBottom: 4 }}>
                  <span>{label}</span><span style={{ fontFamily: "'IBM Plex Mono', monospace" }}>{val}%</span>
                </div>
                <div style={{ height: 6, borderRadius: 3, background: t.surfaceAlt }}>
                  <div style={{ height: 6, borderRadius: 3, width: `${val}%`, background: t.sage, transition: "width 0.6s ease" }} />
                </div>
              </div>
            ))}
            <p style={{ marginTop: 10, fontSize: 12, color: t.ink, background: t.surfaceAlt, padding: 10, borderRadius: 10 }}>
              <Sparkles size={12} color={t.marigold} style={{ verticalAlign: -2, marginRight: 4 }} />
              {speakScore.tip}
            </p>
          </div>
        )}
      </div>

      <SectionLabel t={t}>{tr(uiLang, "section_tutor")}</SectionLabel>
      <div style={{ ...card, padding: 12, display: "flex", flexDirection: "column", height: 320 }}>
        <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 8, paddingRight: 4 }}>
          {chat.map((m, i) => (
            <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "82%", animation: "popIn 0.2s ease-out" }}>
              <div style={{
                background: m.role === "user" ? t.marigold : t.surfaceAlt,
                color: m.role === "user" ? t.marigoldText : t.ink,
                padding: "8px 12px", borderRadius: 14, fontSize: 13, lineHeight: 1.5,
              }}>
                {m.text}
              </div>
            </div>
          ))}
          {chatLoading && (
            <div style={{ alignSelf: "flex-start" }}>
              <div style={{ background: t.surfaceAlt, padding: "8px 12px", borderRadius: 14, display: "flex", alignItems: "center", gap: 6 }}>
                <Loader2 size={13} className="spin" color={t.inkSoft} style={{ animation: "spin 0.8s linear infinite" }} />
                <span style={{ fontSize: 12, color: t.inkSoft }}>Lingo is typing…</span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
          <input
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendChat()}
            placeholder={tr(uiLang, "placeholder_chat")}
            style={{ flex: 1, border: `0.5px solid ${t.border}`, background: t.bg, color: t.ink, borderRadius: 12, padding: "9px 12px", fontSize: 13, outline: "none" }}
          />
          <button className="tap-scale" aria-label="Send message" onClick={sendChat} disabled={chatLoading} style={{ width: 38, height: 38, borderRadius: 12, border: "none", background: t.marigold, color: t.marigoldText, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Send size={15} />
          </button>
        </div>
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function ProfileScreen({ t, card, profile, setProfile, xp, streak, coins, dark, setDark, premium, togglePremium, totalQuestions, uiLang, setUiLang, dailyGoal, setDailyGoal, dailyGoalOptions, remindersOn, setRemindersOn, soundOn, setSoundOn, topWeakAreas, leaderboard, leaderboardLoading, refreshLeaderboard, userId, badgeStats }) {
  const level = Math.floor(xp / 500) + 1;
  return (
    <div>
      <div style={{ ...card, padding: 18, textAlign: "center", marginTop: 6 }}>
        <div style={{ width: 60, height: 60, borderRadius: "50%", background: t.marigold, color: t.marigoldText, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Baloo 2', sans-serif", fontWeight: 700, fontSize: 22, margin: "0 auto 10px" }}>
          {profile.name[0]}
        </div>
        <p style={{ margin: 0, fontWeight: 700, fontSize: 16, color: t.ink }}>{profile.name}</p>
        <p style={{ margin: "2px 0 0", fontSize: 12, color: t.inkSoft }}>Level {level} · Learning {profile.target}</p>
        <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 14 }}>
          {[["XP", xp], ["Streak", streak], ["Coins", coins]].map(([label, val]) => (
            <div key={label}>
              <p style={{ margin: 0, fontFamily: "'IBM Plex Mono', monospace", fontWeight: 500, fontSize: 16, color: t.ink }}>{val}</p>
              <p style={{ margin: 0, fontSize: 11, color: t.inkSoft }}>{label}</p>
            </div>
          ))}
        </div>
      </div>

      <SectionLabel t={t}>{tr(uiLang, "section_languages")}</SectionLabel>
      <div style={{ ...card, padding: 16 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: t.inkSoft }}>{tr(uiLang, "app_language")}</span>
          <select value={uiLang} onChange={(e) => setUiLang(e.target.value)} style={{ border: `0.5px solid ${t.border}`, borderRadius: 10, padding: "6px 10px", background: t.bg, color: t.ink, fontSize: 13 }}>
            {UI_LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
          <span style={{ fontSize: 13, color: t.inkSoft }}>Native</span>
          <select value={profile.native} onChange={(e) => setProfile((p) => ({ ...p, native: e.target.value }))} style={{ border: `0.5px solid ${t.border}`, borderRadius: 10, padding: "6px 10px", background: t.bg, color: t.ink, fontSize: 13 }}>
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: 13, color: t.inkSoft }}>Learning</span>
          <select value={profile.target} onChange={(e) => setProfile((p) => ({ ...p, target: e.target.value }))} style={{ border: `0.5px solid ${t.border}`, borderRadius: 10, padding: "6px 10px", background: t.bg, color: t.ink, fontSize: 13 }}>
            {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
          </select>
        </div>
      </div>

      <SectionLabel t={t}>{tr(uiLang, "section_leaderboard")}</SectionLabel>
      <div style={{ ...card, padding: 16 }}>
        <p style={{ margin: "0 0 10px", fontSize: 11, color: t.inkSoft, lineHeight: 1.4 }}>
          Real-time ranking shared across everyone using this app. Your name and XP are visible to other users here.
        </p>
        {leaderboardLoading ? (
          <p style={{ margin: 0, fontSize: 12, color: t.inkSoft, textAlign: "center", padding: "8px 0" }}>Loading…</p>
        ) : leaderboard.length === 0 ? (
          <p style={{ margin: 0, fontSize: 12, color: t.inkSoft, textAlign: "center", padding: "8px 0" }}>No one on the board yet — be the first!</p>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {leaderboard.map((entry, i) => {
              const isMe = entry.id === `leaderboard:${userId}`;
              return (
                <div key={entry.id} style={{
                  display: "flex", alignItems: "center", gap: 10, padding: "8px 10px", borderRadius: 10,
                  background: isMe ? t.surfaceAlt : "transparent", border: isMe ? `1px solid ${t.marigold}` : "1px solid transparent",
                }}>
                  <span style={{ width: 18, fontSize: 12, fontWeight: 700, color: i < 3 ? t.marigoldText : t.inkSoft, textAlign: "center" }}>{i + 1}</span>
                  <span style={{ flex: 1, fontSize: 13, fontWeight: isMe ? 700 : 500, color: t.ink }}>{entry.name}{isMe ? " (you)" : ""}</span>
                  <span style={{ fontSize: 12, fontFamily: "'IBM Plex Mono', monospace", color: t.inkSoft }}>{entry.xp} XP</span>
                </div>
              );
            })}
          </div>
        )}
        <button className="tap-scale" onClick={refreshLeaderboard} style={{ marginTop: 10, width: "100%", padding: 8, borderRadius: 10, border: `1px solid ${t.border}`, background: "transparent", color: t.inkSoft, fontSize: 11, fontWeight: 600 }}>
          Refresh
        </button>
      </div>

      {topWeakAreas.length > 0 && (
        <>
          <SectionLabel t={t}>{tr(uiLang, "section_focus")}</SectionLabel>
          <div style={{ ...card, padding: 16 }}>
            <p style={{ margin: "0 0 10px", fontSize: 12, color: t.inkSoft }}>
              Based on your mistakes, Lingo's AI tutor will lean into these when you chat:
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {topWeakAreas.map((tense) => (
                <Pill key={tense} bg={t.surfaceAlt} fg={t.coralText}><Flame size={11} color={t.coral} />{tense}</Pill>
              ))}
            </div>
          </div>
        </>
      )}

      <SectionLabel t={t}>{tr(uiLang, "section_achievements")}</SectionLabel>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10 }}>
        {BADGE_DEFS.map(({ Icon, label, check }, i) => {
          const earned = check(badgeStats);
          return (
            <div key={label} style={{ ...card, padding: 12, textAlign: "center", opacity: earned ? 1 : 0.4, animation: `popIn 0.25s ease-out ${i * 0.03}s both` }}>
              <Icon size={20} color={earned ? t.marigold : t.inkSoft} style={{ margin: "0 auto" }} />
              <p style={{ margin: "6px 0 0", fontSize: 10.5, color: t.ink, lineHeight: 1.3 }}>{label}</p>
            </div>
          );
        })}
      </div>

      <SectionLabel t={t}>{tr(uiLang, "section_preferences")}</SectionLabel>

      <div style={{ ...card, padding: 14, marginBottom: 10 }}>
        <p style={{ margin: "0 0 10px", fontSize: 13, fontWeight: 700, color: t.ink, display: "flex", alignItems: "center", gap: 6 }}>
          <Flame size={14} color={t.marigold} /> Daily goal
        </p>
        <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
          {dailyGoalOptions.map((g) => {
            const active = g === dailyGoal;
            return (
              <button
                key={g}
                className="tap-scale"
                onClick={() => setDailyGoal(g)}
                style={{
                  flex: 1, padding: "8px 0", borderRadius: 10, fontSize: 12, fontWeight: 700,
                  border: `1.5px solid ${active ? t.marigold : t.border}`,
                  background: active ? t.marigold : t.surface,
                  color: active ? t.marigoldText : t.inkSoft,
                }}
              >
                {g} XP
              </button>
            );
          })}
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontSize: 13, color: t.ink }}>Daily reminders</span>
          <button className="tap-scale" onClick={() => setRemindersOn((r) => !r)} style={{ background: "none", border: "none", padding: 0 }}>
            <div style={{ width: 38, height: 22, borderRadius: 11, background: remindersOn ? t.marigold : t.surfaceAlt, position: "relative", transition: "background 0.2s ease" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: t.surface, position: "absolute", top: 2, left: remindersOn ? 18 : 2, transition: "left 0.2s ease" }} />
            </div>
          </button>
        </div>
        <p style={{ margin: "8px 0 0", fontSize: 10.5, color: t.inkSoft, lineHeight: 1.4 }}>
          Shows a nudge in-app if you haven't hit your goal yet. This app can't send push notifications when it's closed.
        </p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
          <span style={{ fontSize: 13, color: t.ink }}>Sound effects</span>
          <button className="tap-scale" onClick={() => setSoundOn((s) => !s)} style={{ background: "none", border: "none", padding: 0 }}>
            <div style={{ width: 38, height: 22, borderRadius: 11, background: soundOn ? t.marigold : t.surfaceAlt, position: "relative", transition: "background 0.2s ease" }}>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: t.surface, position: "absolute", top: 2, left: soundOn ? 18 : 2, transition: "left 0.2s ease" }} />
            </div>
          </button>
        </div>
      </div>

      <button className="tap-scale" onClick={() => setDark((d) => !d)} style={{ ...card, width: "100%", padding: 14, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <span style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 13, color: t.ink }}>
          {dark ? <Moon size={16} /> : <Sun size={16} />} {dark ? "Dark mode" : "Light mode"}
        </span>
        <div style={{ width: 38, height: 22, borderRadius: 11, background: dark ? t.marigold : t.surfaceAlt, position: "relative", transition: "background 0.2s ease" }}>
          <div style={{ width: 18, height: 18, borderRadius: "50%", background: t.surface, position: "absolute", top: 2, left: dark ? 18 : 2, transition: "left 0.2s ease" }} />
        </div>
      </button>

      <div style={{ ...card, padding: 16, marginTop: 10, background: t.surfaceAlt, border: "none" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
          <Star size={16} color={t.marigold} />
          <p style={{ margin: 0, fontWeight: 700, color: t.ink, fontSize: 14 }}>{tr(uiLang, "premium_title")}</p>
          {premium && <Pill bg={t.marigold} fg={t.marigoldText}>Active</Pill>}
        </div>
        <p style={{ margin: "0 0 10px", fontSize: 12, color: t.inkSoft }}>
          {totalQuestions.toLocaleString()}+ grammar questions, all 7 days of the weekly plan, unlimited AI conversations, and no ads.
        </p>
        <button className="duo-btn" onClick={togglePremium} style={{ width: "100%", padding: 12, borderRadius: 14, border: premium ? `1px solid ${t.border}` : "none", background: premium ? t.surface : t.sage, color: premium ? t.coralText : t.sageText, fontWeight: 800, fontSize: 13, boxShadow: premium ? "none" : `0 4px 0 ${t.sageShadow}` }}>
          {premium ? tr(uiLang, "btn_cancel_premium") : `${tr(uiLang, "btn_start_trial")} — $4.99/mo`}
        </button>
      </div>
    </div>
  );
}
