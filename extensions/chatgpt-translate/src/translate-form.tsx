import {
  Action,
  ActionPanel,
  Clipboard,
  Form,
  showHUD,
  showToast,
  Toast,
} from "@raycast/api";
import React from "react";
import { usePreferences, useSelectedLanguagesSet, useTextState } from "./hooks";
import { translateText, TranslateError, AUTO_DETECT } from "./chatgpt-translate";
import { TranslateResult } from "./types";
import { getLanguageName, languages } from "./languages";

export default function TranslateForm() {
  const preferences = usePreferences();
  const [text, setText] = useTextState();
  const [selectedLanguageSet, setSelectedLanguageSet] = useSelectedLanguagesSet();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<TranslateResult | null>(null);

  const handleSubmit = async () => {
    if (!text || text.trim() === "") {
      showToast({
        style: Toast.Style.Failure,
        title: "No Text",
        message: "Please enter text to translate",
      });
      return;
    }

    setIsLoading(true);
    try {
      const translationResult = await translateText(text, selectedLanguageSet);
      setResult(translationResult);
      showToast({
        style: Toast.Style.Success,
        title: "Translation Complete",
      });
    } catch (err) {
      if (err instanceof TranslateError) {
        showToast({
          style: Toast.Style.Failure,
          title: "Translation Failed",
          message: err.message,
        });
      } else {
        showToast({
          style: Toast.Style.Failure,
          title: "Translation Failed",
          message: "An unexpected error occurred",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const copyResult = async () => {
    if (result?.translatedText) {
      await Clipboard.copy(result.translatedText);
      await showHUD("Copied to clipboard");
    }
  };

  const pasteResult = async () => {
    if (result?.translatedText) {
      await Clipboard.paste(result.translatedText);
      await showHUD("Pasted to active app");
    }
  };

  return (
    <Form
      isLoading={isLoading}
      actions={
        <ActionPanel>
          <Action.SubmitForm title="Translate" onSubmit={handleSubmit} />
          {result?.translatedText && (
            <>
              <Action title="Copy Translation" onAction={copyResult} shortcut={{ modifiers: ["cmd"], key: "c" }} />
              <Action title="Paste Translation" onAction={pasteResult} shortcut={{ modifiers: ["cmd", "shift"], key: "v" }} />
            </>
          )}
        </ActionPanel>
      }
    >
      <Form.TextArea
        id="text"
        title="Text to Translate"
        placeholder="Enter text to translate..."
        value={text}
        onChange={setText}
      />
      <Form.Dropdown
        id="langFrom"
        title="From"
        value={selectedLanguageSet.langFrom}
        onChange={(value) =>
          setSelectedLanguageSet({
            ...selectedLanguageSet,
            langFrom: value as typeof selectedLanguageSet.langFrom,
          })
        }
      >
        {languages.map((lang) => (
          <Form.Dropdown.Item key={lang.code} value={lang.code} title={lang.name} />
        ))}
      </Form.Dropdown>
      <Form.Dropdown
        id="langTo"
        title="To"
        value={selectedLanguageSet.langTo[0]}
        onChange={(value) =>
          setSelectedLanguageSet({
            ...selectedLanguageSet,
            langTo: [value as typeof selectedLanguageSet.langTo[0]],
          })
        }
      >
        {languages
          .filter((lang) => lang.code !== AUTO_DETECT)
          .map((lang) => (
            <Form.Dropdown.Item key={lang.code} value={lang.code} title={lang.name} />
          ))}
      </Form.Dropdown>
      {result?.translatedText && (
        <Form.TextArea
          id="result"
          title="Translation"
          value={result.translatedText}
          onChange={() => {}}
        />
      )}
    </Form>
  );
}
