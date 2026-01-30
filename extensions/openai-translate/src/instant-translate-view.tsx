import { showHUD, Clipboard, getPreferenceValues, getSelectedText } from "@raycast/api";
import { translateText } from "./openai-translate";
import { Preferences } from "./types";
import { LanguageCode, getLanguageName } from "./languages";

export default async function InstantTranslateView() {
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

  if (!text || !text.trim()) {
    await showHUD("❌ No text to translate");
    return;
  }

  try {
    await showHUD("🔄 Translating...");

    const preferences = getPreferenceValues<Preferences>();
    const langTo = preferences.lang2 as LanguageCode;
    const result = await translateText(text.trim(), {
      langFrom: preferences.lang1 as LanguageCode,
      langTo: [langTo],
    });

    // Show the translation in HUD with language info
    const langName = getLanguageName(langTo);
    const displayText = result.translatedText.length > 100
      ? result.translatedText.substring(0, 100) + "..."
      : result.translatedText;

    await showHUD(`${langName}: ${displayText}`);
  } catch (error) {
    await showHUD(`❌ ${error instanceof Error ? error.message : "Translation failed"}`);
  }
}
