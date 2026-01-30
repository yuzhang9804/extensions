import OpenAI from "openai";
import { getPreferenceValues } from "@raycast/api";
import { LanguageCode, getLanguageName } from "./languages";
import { LanguageCodeSet, TranslateResult, TranslationStyle, Preferences } from "./types";

export const AUTO_DETECT = "auto";

export class TranslateError extends Error {
  constructor(message: string, name?: string) {
    super(message);
    this.name = name || "TranslateError";
  }
}

function getOpenAIClient(): OpenAI {
  const preferences = getPreferenceValues<Preferences>();
  return new OpenAI({
    apiKey: preferences.apiKey,
    baseURL: preferences.apiEndpoint || "https://api.openai.com/v1",
  });
}

function getTranslationStylePrompt(style: TranslationStyle): string {
  switch (style) {
    case "formal":
      return "Use formal, professional language suitable for business or academic contexts.";
    case "casual":
      return "Use casual, friendly language suitable for everyday conversation.";
    case "literal":
      return "Provide a literal, word-for-word translation while maintaining grammatical correctness.";
    case "natural":
    default:
      return "Ensure the translation sounds natural and fluent to native speakers.";
  }
}

function buildSystemPrompt(langFrom: LanguageCode, langTo: LanguageCode, style: TranslationStyle): string {
  const targetLanguage = getLanguageName(langTo);
  const stylePrompt = getTranslationStylePrompt(style);

  if (langFrom === AUTO_DETECT) {
    return `You are a professional translation assistant. Your task is to:
1. Detect the source language of the input text automatically.
2. Translate the text into ${targetLanguage}.
3. ${stylePrompt}
4. Preserve the original tone, meaning, punctuation, emoji, and inline formatting.
5. Return ONLY the translated text without any commentary, labels, explanations, or quotes.
6. If the input is already in ${targetLanguage}, return it unchanged.

Important: Output only the translation, nothing else.`;
  }

  const sourceLanguage = getLanguageName(langFrom);
  return `You are a professional translation assistant. Your task is to:
1. Translate the text from ${sourceLanguage} to ${targetLanguage}.
2. ${stylePrompt}
3. Preserve the original tone, meaning, punctuation, emoji, and inline formatting.
4. Return ONLY the translated text without any commentary, labels, explanations, or quotes.

Important: Output only the translation, nothing else.`;
}

export async function translateText(
  text: string,
  options: LanguageCodeSet
): Promise<TranslateResult> {
  const preferences = getPreferenceValues<Preferences>();

  if (!text || text.trim() === "") {
    return {
      originalText: text,
      translatedText: "",
      langFrom: options.langFrom,
      langTo: options.langTo[0],
    };
  }

  try {
    const client = getOpenAIClient();
    const systemPrompt = buildSystemPrompt(
      options.langFrom,
      options.langTo[0],
      preferences.translationStyle
    );

    const response = await client.chat.completions.create({
      model: preferences.model,
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: text },
      ],
      temperature: 0.3,
      max_tokens: 4096,
    });

    const translatedText = response.choices[0]?.message?.content?.trim() || "";

    return {
      originalText: text,
      translatedText,
      langFrom: options.langFrom,
      langTo: options.langTo[0],
    };
  } catch (err) {
    if (err instanceof Error) {
      if (err.message.includes("401") || err.message.includes("Unauthorized")) {
        throw new TranslateError("Invalid API key. Please check your OpenAI API key in preferences.", "AuthenticationError");
      }
      if (err.message.includes("429") || err.message.includes("rate limit")) {
        throw new TranslateError("Rate limit exceeded. Please try again later.", "RateLimitError");
      }
      if (err.message.includes("insufficient_quota")) {
        throw new TranslateError("Insufficient API quota. Please check your OpenAI account.", "QuotaError");
      }
      throw new TranslateError(err.message, err.name);
    }
    throw new TranslateError("An unknown error occurred during translation.");
  }
}

export async function doubleWayTranslate(
  text: string,
  options: LanguageCodeSet
): Promise<TranslateResult[]> {
  if (!text || text.trim() === "") {
    return [];
  }

  if (options.langFrom === AUTO_DETECT) {
    // First, translate to target language
    const translated1 = await translateText(text, {
      langFrom: options.langFrom,
      langTo: options.langTo,
    });

    if (translated1.translatedText) {
      // Then translate back from target to detect the original language
      // For simplicity, we assume the detected language and translate back
      const translated2 = await translateText(translated1.translatedText, {
        langFrom: options.langTo[0],
        langTo: [options.langTo[0] === "en" ? "zh-CN" : "en"], // Default reverse translation
      });

      return [translated1, translated2];
    }

    return [];
  } else {
    // Translate both ways in parallel
    const [forward, backward] = await Promise.all([
      translateText(text, {
        langFrom: options.langFrom,
        langTo: options.langTo,
      }),
      translateText(text, {
        langFrom: options.langTo[0],
        langTo: [options.langFrom],
      }),
    ]);

    return [forward, backward];
  }
}

export async function detectLanguage(text: string): Promise<string> {
  if (!text || text.trim() === "") {
    return "unknown";
  }

  try {
    const client = getOpenAIClient();
    const preferences = getPreferenceValues<Preferences>();

    const response = await client.chat.completions.create({
      model: preferences.model,
      messages: [
        {
          role: "system",
          content:
            "You are a language detection assistant. Detect the language of the given text and respond with only the ISO 639-1 language code (e.g., 'en' for English, 'zh-CN' for Simplified Chinese, 'ja' for Japanese). If you cannot determine the language, respond with 'unknown'.",
        },
        { role: "user", content: text },
      ],
      temperature: 0,
      max_tokens: 10,
    });

    return response.choices[0]?.message?.content?.trim().toLowerCase() || "unknown";
  } catch {
    return "unknown";
  }
}
