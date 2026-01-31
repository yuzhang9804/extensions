import { LanguageCode } from "./languages";

export type LanguageCodeSet = {
  langFrom: LanguageCode;
  langTo: LanguageCode[];
};

export type TranslateResult = {
  originalText: string;
  translatedText: string;
  langFrom: LanguageCode;
  langTo: LanguageCode;
  detectedLanguage?: string;
};

export type Preferences = {
  lang1: LanguageCode;
  lang2: LanguageCode;
  autoInput: boolean;
  defaultAction: "copy" | "paste";
};
