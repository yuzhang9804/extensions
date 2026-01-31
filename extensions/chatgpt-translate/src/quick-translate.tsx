import {
  Action,
  ActionPanel,
  Icon,
  List,
  showToast,
  Toast,
} from "@raycast/api";
import React from "react";
import { useDebouncedValue, usePreferences, useSourceLanguage, useTargetLanguages, useTextState } from "./hooks";
import { translateText, TranslateError, AUTO_DETECT } from "./chatgpt-translate";
import { TranslateResult } from "./types";
import { getLanguageName, LanguageCode, languages } from "./languages";
import { TranslationActions } from "./actions";

export default function QuickTranslate() {
  const preferences = usePreferences();
  const [text, setText] = useTextState();
  const [sourceLanguage, setSourceLanguage] = useSourceLanguage();
  const [targetLanguages, setTargetLanguages] = useTargetLanguages();
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<TranslateResult[]>([]);

  const debouncedText = useDebouncedValue(text, 500);

  React.useEffect(() => {
    if (!debouncedText || debouncedText.trim() === "" || targetLanguages.length === 0) {
      setResults([]);
      return;
    }

    const doTranslate = async () => {
      setIsLoading(true);
      const newResults: TranslateResult[] = [];

      for (const targetLang of targetLanguages) {
        try {
          const result = await translateText(debouncedText, {
            langFrom: sourceLanguage,
            langTo: [targetLang],
          });
          newResults.push(result);
        } catch (err) {
          console.error(`Translation to ${targetLang} failed:`, err);
        }
      }

      setResults(newResults);
      setIsLoading(false);
    };

    doTranslate();
  }, [debouncedText, sourceLanguage, targetLanguages]);

  const addTargetLanguage = (lang: LanguageCode) => {
    if (!targetLanguages.includes(lang)) {
      setTargetLanguages([...targetLanguages, lang]);
    }
  };

  const removeTargetLanguage = (lang: LanguageCode) => {
    setTargetLanguages(targetLanguages.filter((l) => l !== lang));
  };

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Enter text to translate..."
      searchText={text}
      onSearchTextChange={setText}
      throttle
    >
      <List.Section title="Translations">
        {results.length > 0 ? (
          results.map((result, index) => (
            <List.Item
              key={`${result.langTo}-${index}`}
              title={result.translatedText}
              subtitle={getLanguageName(result.langTo)}
              icon={Icon.Document}
              accessories={[{ text: getLanguageName(result.langTo) }]}
              actions={<TranslationActions result={result} isLoading={isLoading} />}
            />
          ))
        ) : (
          <List.Item
            title={isLoading ? "Translating..." : "Enter text to translate"}
            icon={isLoading ? Icon.Clock : Icon.Text}
          />
        )}
      </List.Section>

      <List.Section title="Source Language">
        <List.Item
          title={getLanguageName(sourceLanguage)}
          icon={Icon.Globe}
          actions={
            <ActionPanel>
              <ActionPanel.Submenu title="Select Source Language">
                {languages.map((lang) => (
                  <Action
                    key={lang.code}
                    title={lang.name}
                    onAction={() => setSourceLanguage(lang.code)}
                  />
                ))}
              </ActionPanel.Submenu>
            </ActionPanel>
          }
        />
      </List.Section>

      <List.Section title="Target Languages">
        {targetLanguages.map((lang) => (
          <List.Item
            key={lang}
            title={getLanguageName(lang)}
            icon={Icon.Globe}
            actions={
              <ActionPanel>
                <Action
                  title="Remove Language"
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  onAction={() => removeTargetLanguage(lang)}
                />
              </ActionPanel>
            }
          />
        ))}
        <List.Item
          title="Add Target Language"
          icon={Icon.Plus}
          actions={
            <ActionPanel>
              <ActionPanel.Submenu title="Add Target Language">
                {languages
                  .filter((lang) => lang.code !== AUTO_DETECT && !targetLanguages.includes(lang.code))
                  .map((lang) => (
                    <Action
                      key={lang.code}
                      title={lang.name}
                      onAction={() => addTargetLanguage(lang.code)}
                    />
                  ))}
              </ActionPanel.Submenu>
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
}
