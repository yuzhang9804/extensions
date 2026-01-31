import { showHUD, Clipboard } from "@raycast/api";
import { getTextToTranslate, performTranslation } from "./instant-translate";

export default async function InstantTranslatePaste() {
  const text = await getTextToTranslate();

  if (!text) {
    await showHUD("❌ No text to translate");
    return;
  }

  try {
    await showHUD("🔄 Translating...");
    const translatedText = await performTranslation(text);
    await Clipboard.paste(translatedText);
    await showHUD("✅ Translation pasted");
  } catch (error) {
    await showHUD(`❌ ${error instanceof Error ? error.message : "Translation failed"}`);
  }
}
