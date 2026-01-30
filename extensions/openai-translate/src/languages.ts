export const languages = {
  auto: "Auto-Detect",
  en: "English",
  "zh-CN": "Chinese (Simplified)",
  "zh-TW": "Chinese (Traditional)",
  ja: "Japanese",
  ko: "Korean",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ar: "Arabic",
  hi: "Hindi",
  th: "Thai",
  vi: "Vietnamese",
  id: "Indonesian",
  ms: "Malay",
  nl: "Dutch",
  pl: "Polish",
  tr: "Turkish",
  cs: "Czech",
  sv: "Swedish",
  da: "Danish",
  fi: "Finnish",
  no: "Norwegian",
  el: "Greek",
  he: "Hebrew",
  hu: "Hungarian",
  ro: "Romanian",
  uk: "Ukrainian",
  bg: "Bulgarian",
  hr: "Croatian",
  sk: "Slovak",
  sl: "Slovenian",
  sr: "Serbian",
  ca: "Catalan",
  tl: "Filipino",
  bn: "Bengali",
  ta: "Tamil",
  te: "Telugu",
  mr: "Marathi",
  gu: "Gujarati",
  kn: "Kannada",
  ml: "Malayalam",
  pa: "Punjabi",
  ur: "Urdu",
  fa: "Persian",
  sw: "Swahili",
} as const;

export type LanguageCode = keyof typeof languages;
export type LanguageName = (typeof languages)[LanguageCode];

export type LanguagesItem = {
  code: LanguageCode;
  name: LanguageName;
};

export const english: LanguagesItem = { code: "en", name: languages.en };
export const autoDetect: LanguagesItem = { code: "auto", name: languages.auto };

export const languagesList: LanguagesItem[] = (Object.keys(languages) as LanguageCode[]).map((code) => ({
  code,
  name: languages[code],
}));

export const supportedLanguagesByCode = languagesList.reduce(
  (acc, lang) => ({
    ...acc,
    [lang.code]: lang,
  }),
  {} as Record<LanguageCode, LanguagesItem>
);

export const supportedLanguagesByName = languagesList.reduce(
  (acc, lang) => ({
    ...acc,
    [lang.name]: lang,
  }),
  {} as Record<LanguageName, LanguagesItem>
);

// Get language name for display
export function getLanguageName(code: LanguageCode): string {
  return languages[code] || code;
}

// Get language code from name
export function getLanguageCode(name: string): LanguageCode | undefined {
  const entry = Object.entries(languages).find(([, value]) => value === name);
  return entry ? (entry[0] as LanguageCode) : undefined;
}
