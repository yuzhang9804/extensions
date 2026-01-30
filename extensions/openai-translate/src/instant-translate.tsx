import { getSelectedText, showHUD, Clipboard, showToast, Toast } from "@raycast/api";
import { translateText } from "./openai-translate";
import { usePreferences } from "./hooks";
import { LanguageCode } from "./languages";

export async function getTextToTranslate(): Promise<string> {
  try {
    const selectedText = await getSelectedText();
    if (selectedText && selectedText.trim()) {
      return selectedText.trim();
    }
  } catch {
    // No text selected, try clipboard
  }

  try {
    const clipboardText = await Clipboard.readText();
    if (clipboardText && clipboardText.trim()) {
      return clipboardText.trim();
    }
  } catch {
    // Clipboard empty or inaccessible
  }

  return "";
}

export async function instantTranslate(): Promise<{ original: string; translated: string } | null> {
  const text = await getTextToTranslate();

  if (!text) {
    await showToast({
      style: Toast.Style.Failure,
      title: "No text to translate",
      message: "Select some text or copy text to clipboard",
    });
    return null;
  }

  try {
    const preferences = usePreferences();
    const result = await translateText(text, {
      langFrom: preferences.lang1 as LanguageCode,
      langTo: [preferences.lang2 as LanguageCode],
    });

    return {
      original: text,
      translated: result.translatedText,
    };
  } catch (error) {
    await showToast({
      style: Toast.Style.Failure,
      title: "Translation failed",
      message: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}
