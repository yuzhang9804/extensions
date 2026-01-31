import {
  Action,
  ActionPanel,
  Icon,
  List,
  showToast,
  Toast,
} from "@raycast/api";
import React from "react";
import { useDebouncedValue, usePreferences, useSelectedLanguagesSet, useTextState } from "./hooks";
import { translateText, TranslateError, AUTO_DETECT } from "./chatgpt-translate";
import { TranslateResult, LanguageCodeSet } from "./types";
import { getLanguageName, LanguageCode, languages } from "./languages";
import { TranslationActions } from "./actions";
import { LanguagesManagerList } from "./LanguagesManager";

export default function Translate() {
  const preferences = usePreferences();
  const [text, setText] = useTextState();
  const [selectedLanguageSet, setSelectedLanguageSet] = useSelectedLanguagesSet();
  const [isLoading, setIsLoading] = React.useState(false);
  const [result, setResult] = React.useState<TranslateResult | null>(null);
  const [showLanguageManager, setShowLanguageManager] = React.useState(false);

  const debouncedText = useDebouncedValue(text, 500);

  React.useEffect(() => {
    if (!debouncedText || debouncedText.trim() === "") {
      setResult(null);
      return;
    }

    const doTranslate = async () => {
      setIsLoading(true);
      try {
        const translationResult = await translateText(debouncedText, selectedLanguageSet);
        setResult(translationResult);
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
        setResult(null);
      } finally {
        setIsLoading(false);
      }
    };

    doTranslate();
  }, [debouncedText, selectedLanguageSet]);

  const swapLanguages = () => {
    if (selectedLanguageSet.langFrom === AUTO_DETECT) {
      return;
    }
    setSelectedLanguageSet({
      langFrom: selectedLanguageSet.langTo[0],
      langTo: [selectedLanguageSet.langFrom],
    });
  };

  if (showLanguageManager) {
    return (
      <LanguagesManagerList
        onSelect={(langSet) => {
          setSelectedLanguageSet(langSet);
          setShowLanguageManager(false);
        }}
        onBack={() => setShowLanguageManager(false)}
      />
    );
  }

  return (
    <List
      isLoading={isLoading}
      searchBarPlaceholder="Enter text to translate..."
      searchText={text}
      onSearchTextChange={setText}
      throttle
    >
      <List.Section title="Translation">
        {result && result.translatedText ? (
          <List.Item
            title={result.translatedText}
            subtitle={`${getLanguageName(result.langFrom)} → ${getLanguageName(result.langTo)}`}
            icon={Icon.Document}
            actions={<TranslationActions result={result} isLoading={isLoading} />}
          />
        ) : (
          <List.Item
            title={isLoading ? "Translating..." : "Enter text to translate"}
            icon={isLoading ? Icon.Clock : Icon.Text}
          />
        )}
      </List.Section>

      <List.Section title="Settings">
        <List.Item
          title="Source Language"
          subtitle={getLanguageName(selectedLanguageSet.langFrom)}
          icon={Icon.Globe}
          actions={
            <ActionPanel>
              <ActionPanel.Submenu title="Select Source Language">
                {languages.map((lang) => (
                  <Action
                    key={lang.code}
                    title={lang.name}
                    onAction={() =>
                      setSelectedLanguageSet({
                        ...selectedLanguageSet,
                        langFrom: lang.code,
                      })
                    }
                  />
                ))}
              </ActionPanel.Submenu>
            </ActionPanel>
          }
        />
        <List.Item
          title="Target Language"
          subtitle={getLanguageName(selectedLanguageSet.langTo[0])}
          icon={Icon.Globe}
          actions={
            <ActionPanel>
              <ActionPanel.Submenu title="Select Target Language">
                {languages
                  .filter((lang) => lang.code !== AUTO_DETECT)
                  .map((lang) => (
                    <Action
                      key={lang.code}
                      title={lang.name}
                      onAction={() =>
                        setSelectedLanguageSet({
                          ...selectedLanguageSet,
                          langTo: [lang.code],
                        })
                      }
                    />
                  ))}
              </ActionPanel.Submenu>
            </ActionPanel>
          }
        />
        <List.Item
          title="Swap Languages"
          icon={Icon.Switch}
          actions={
            <ActionPanel>
              <Action
                title="Swap Languages"
                onAction={swapLanguages}
                shortcut={{ modifiers: ["cmd"], key: "s" }}
              />
            </ActionPanel>
          }
        />
        <List.Item
          title="Language Sets"
          subtitle="Manage saved language pairs"
          icon={Icon.List}
          actions={
            <ActionPanel>
              <Action
                title="Open Language Manager"
                onAction={() => setShowLanguageManager(true)}
              />
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
}
