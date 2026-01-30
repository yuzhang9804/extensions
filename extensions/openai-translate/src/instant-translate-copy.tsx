import { showHUD, Clipboard, getPreferenceValues, getSelectedText, showToast, Toast } from "@raycast/api";
import { translateText } from "./openai-translate";
import { Preferences } from "./types";
import { LanguageCode } from "./languages";

export default async function InstantTranslateCopy() {
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
    const result = await translateText(text.trim(), {
      langFrom: preferences.lang1 as LanguageCode,
      langTo: [preferences.lang2 as LanguageCode],
    });

    await Clipboard.copy(result.translatedText);
    await showHUD("✅ Translation copied to clipboard");
  } catch (error) {
    await showHUD(`❌ ${error instanceof Error ? error.message : "Translation failed"}`);
  }
}
