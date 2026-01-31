import { showHUD, Clipboard } from "@raycast/api";
import { getTextToTranslate, performTranslation } from "./instant-translate";

export default async function InstantTranslateCopy() {
  const text = await getTextToTranslate();

  if (!text) {
    await showHUD("❌ No text to translate");
    return;
  }

  try {
    await showHUD("🔄 Translating...");
    const translatedText = await performTranslation(text);
    await Clipboard.copy(translatedText);
    await showHUD("✅ Translation copied to clipboard");
  } catch (error) {
    await showHUD(`❌ ${error instanceof Error ? error.message : "Translation failed"}`);
  }
}
