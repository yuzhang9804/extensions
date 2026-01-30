import React, { useState } from "react";
import {
  Form,
  ActionPanel,
  Action,
  showToast,
  Toast,
  Clipboard,
  Icon,
  popToRoot,
} from "@raycast/api";
import { translateText } from "./openai-translate";
import { languagesList, LanguageCode } from "./languages";
import { usePreferences, useTextState } from "./hooks";

export default function TranslateForm() {
  const preferences = usePreferences();
  const [initialText] = useTextState();
  const [text, setText] = useState(initialText);
  const [langFrom, setLangFrom] = useState<LanguageCode>(preferences.lang1);
  const [langTo, setLangTo] = useState<LanguageCode>(preferences.lang2);
  const [result, setResult] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const handleTranslate = async () => {
    if (!text.trim()) {
      showToast({
        style: Toast.Style.Failure,
        title: "No text to translate",
        message: "Please enter some text",
      });
      return;
    }

    setIsLoading(true);
    try {
      const translated = await translateText(text, {
        langFrom,
        langTo: [langTo],
      });
      setResult(translated.translatedText);
      showToast({
        style: Toast.Style.Success,
        title: "Translation complete",
      });
    } catch (error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Translation failed",
        message: error instanceof Error ? error.message : "Unknown error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (result) {
      await Clipboard.copy(result);
      showToast({
        style: Toast.Style.Success,
        title: "Copied to clipboard",
      });
    }
  };

  const handlePaste = async () => {
    if (result) {
      await Clipboard.paste(result);
      await popToRoot();
    }
  };

  const handleSwapLanguages = () => {
    if (langFrom !== "auto") {
      const temp = langFrom;
      setLangFrom(langTo);
      setLangTo(temp);
    }
  };

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action
            title="Translate"
            icon={Icon.Globe}
            onAction={handleTranslate}
          />
          {result && (
            <>
              <Action
                title="Copy Translation"
                icon={Icon.Clipboard}
                shortcut={{ modifiers: ["cmd"], key: "c" }}
                onAction={handleCopy}
              />
              <Action
                title="Paste Translation"
                icon={Icon.Document}
                shortcut={{ modifiers: ["cmd", "shift"], key: "v" }}
                onAction={handlePaste}
              />
            </>
          )}
          <Action
            title="Swap Languages"
            icon={Icon.Switch}
            shortcut={{ modifiers: ["cmd"], key: "s" }}
            onAction={handleSwapLanguages}
          />
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="text"
        title="Text to Translate"
        placeholder="Enter or paste text here..."
        value={text}
        onChange={setText}
      />

      <Form.Dropdown
        id="langFrom"
        title="From"
        value={langFrom}
        onChange={(value) => setLangFrom(value as LanguageCode)}
      >
        {languagesList.map((lang) => (
          <Form.Dropdown.Item key={lang.code} value={lang.code} title={lang.name} />
        ))}
      </Form.Dropdown>

      <Form.Dropdown
        id="langTo"
        title="To"
        value={langTo}
        onChange={(value) => setLangTo(value as LanguageCode)}
      >
        {languagesList
          .filter((lang) => lang.code !== "auto")
          .map((lang) => (
            <Form.Dropdown.Item key={lang.code} value={lang.code} title={lang.name} />
          ))}
      </Form.Dropdown>

      {result && (
        <>
          <Form.Separator />
          <Form.Description title="Translation Result" text={result} />
        </>
      )}
    </Form>
  );
}
