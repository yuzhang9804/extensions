import { getPreferenceValues, getSelectedText, Clipboard, showHUD } from "@raycast/api";
import { translateText, TranslateError } from "./chatgpt-translate";
import { Preferences } from "./types";
import { LanguageCode } from "./languages";

export async function getTextToTranslate(): Promise<string> {
  let text = "";

  try {
    text = await getSelectedText();
  } catch {
    // No text selected, try clipboard
    try {
      text = (await Clipboard.readText()) || "";
    } catch {
      // Clipboard empty
    }
  }

  return text.trim();
}

export async function performTranslation(text: string): Promise<string> {
  const preferences = getPreferenceValues<Preferences>();
  
  const result = await translateText(text, {
    langFrom: preferences.lang1 as LanguageCode,
    langTo: [preferences.lang2 as LanguageCode],
  });

  return result.translatedText;
}
