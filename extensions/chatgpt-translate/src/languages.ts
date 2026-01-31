export type LanguageCode =
  | "auto"
  | "en"
  | "zh-CN"
  | "zh-TW"
  | "ja"
  | "ko"
  | "es"
  | "fr"
  | "de"
  | "it"
  | "pt"
  | "ru"
  | "ar"
  | "hi"
  | "th"
  | "vi"
  | "id"
  | "ms"
  | "nl"
  | "pl"
  | "tr"
  | "cs"
  | "sv"
  | "da"
  | "fi"
  | "no"
  | "el"
  | "he"
  | "hu"
  | "ro"
  | "uk"
  | "bg"
  | "hr"
  | "sk"
  | "sl"
  | "sr"
  | "ca"
  | "tl"
  | "bn"
  | "ta"
  | "te"
  | "mr"
  | "gu"
  | "kn"
  | "ml"
  | "pa"
  | "ur"
  | "fa"
  | "sw";

export const languages: { code: LanguageCode; name: string }[] = [
  { code: "auto", name: "Auto-Detect" },
  { code: "en", name: "English" },
  { code: "zh-CN", name: "Chinese (Simplified)" },
  { code: "zh-TW", name: "Chinese (Traditional)" },
  { code: "ja", name: "Japanese" },
  { code: "ko", name: "Korean" },
  { code: "es", name: "Spanish" },
  { code: "fr", name: "French" },
  { code: "de", name: "German" },
  { code: "it", name: "Italian" },
  { code: "pt", name: "Portuguese" },
  { code: "ru", name: "Russian" },
  { code: "ar", name: "Arabic" },
  { code: "hi", name: "Hindi" },
  { code: "th", name: "Thai" },
  { code: "vi", name: "Vietnamese" },
  { code: "id", name: "Indonesian" },
  { code: "ms", name: "Malay" },
  { code: "nl", name: "Dutch" },
  { code: "pl", name: "Polish" },
  { code: "tr", name: "Turkish" },
  { code: "cs", name: "Czech" },
  { code: "sv", name: "Swedish" },
  { code: "da", name: "Danish" },
  { code: "fi", name: "Finnish" },
  { code: "no", name: "Norwegian" },
  { code: "el", name: "Greek" },
  { code: "he", name: "Hebrew" },
  { code: "hu", name: "Hungarian" },
  { code: "ro", name: "Romanian" },
  { code: "uk", name: "Ukrainian" },
  { code: "bg", name: "Bulgarian" },
  { code: "hr", name: "Croatian" },
  { code: "sk", name: "Slovak" },
  { code: "sl", name: "Slovenian" },
  { code: "sr", name: "Serbian" },
  { code: "ca", name: "Catalan" },
  { code: "tl", name: "Filipino" },
  { code: "bn", name: "Bengali" },
  { code: "ta", name: "Tamil" },
  { code: "te", name: "Telugu" },
  { code: "mr", name: "Marathi" },
  { code: "gu", name: "Gujarati" },
  { code: "kn", name: "Kannada" },
  { code: "ml", name: "Malayalam" },
  { code: "pa", name: "Punjabi" },
  { code: "ur", name: "Urdu" },
  { code: "fa", name: "Persian" },
  { code: "sw", name: "Swahili" },
];

export const getLanguageName = (code: LanguageCode): string => {
  const lang = languages.find((l) => l.code === code);
  return lang?.name || code;
};

export const getLanguageCode = (name: string): LanguageCode | undefined => {
  const lang = languages.find((l) => l.name.toLowerCase() === name.toLowerCase());
  return lang?.code;
};
