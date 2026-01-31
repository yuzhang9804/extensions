import { showHUD } from "@raycast/api";
import { getTextToTranslate, performTranslation } from "./instant-translate";

export default async function InstantTranslateView() {
  const text = await getTextToTranslate();

  if (!text) {
    await showHUD("❌ No text to translate");
    return;
  }

  try {
    await showHUD("🔄 Translating...");
    const translatedText = await performTranslation(text);
    
    // Show the translation in HUD (truncate if too long)
    const displayText = translatedText.length > 100 
      ? translatedText.substring(0, 100) + "..." 
      : translatedText;
    
    await showHUD(`✅ ${displayText}`);
  } catch (error) {
    await showHUD(`❌ ${error instanceof Error ? error.message : "Translation failed"}`);
  }
}
