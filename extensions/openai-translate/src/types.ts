import { LanguageCode } from "./languages";

export type LanguageCodeSet = {
  langFrom: LanguageCode;
  langTo: LanguageCode[];
};

export type TranslationStyle = "natural" | "formal" | "casual" | "literal";

export type TranslateResult = {
  originalText: string;
  translatedText: string;
  langFrom: LanguageCode;
  langTo: LanguageCode;
  detectedLanguage?: string;
};

export type Preferences = {
  apiKey: string;
  apiEndpoint: string;
  model: string;
  lang1: LanguageCode;
  lang2: LanguageCode;
  autoInput: boolean;
  defaultAction: "copy" | "paste";
  translationStyle: TranslationStyle;
};
