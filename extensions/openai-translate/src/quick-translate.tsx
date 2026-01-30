import React from "react";
import { List, showToast, Toast, ActionPanel, Action, Icon } from "@raycast/api";
import { ReactElement, useState } from "react";
import { usePromise } from "@raycast/utils";
import { useDebouncedValue, useSourceLanguage, useTargetLanguages, useTextState } from "./hooks";
import { LanguageCode, supportedLanguagesByCode, languagesList } from "./languages";
import { translateText } from "./openai-translate";
import { ConfigurableCopyPasteActions, ToggleFullTextAction, CopyOriginalTextAction, CopyBothAction } from "./actions";

const LanguageDropdown: React.FC = () => {
  const [sourceLanguage, setSourceLanguage] = useSourceLanguage();

  return (
    <List.Dropdown
      tooltip="Select Source Language"
      value={sourceLanguage}
      onChange={(value) => setSourceLanguage(value as LanguageCode)}
    >
      <List.Dropdown.Section title="Source Language">
        {languagesList.map((lang) => (
          <List.Dropdown.Item key={lang.code} title={lang.name} value={lang.code} />
        ))}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
};

const QuickTranslateListItem: React.FC<{
  debouncedText: string;
  languageSet: { langFrom: LanguageCode; langTo: LanguageCode[] };
  isShowingDetail: boolean;
  setIsShowingDetail: (value: boolean) => void;
  setIsLoading: (isLoading: boolean) => void;
}> = ({ debouncedText, languageSet, isShowingDetail, setIsShowingDetail, setIsLoading }) => {
  const { data: result, isLoading } = usePromise(
    translateText,
    [debouncedText, languageSet],
    {
      onError(error) {
        showToast({
          style: Toast.Style.Failure,
          title: "Could not translate",
          message: error.toString(),
        });
      },
    }
  );

  // Update parent loading state
  React.useEffect(() => {
    setIsLoading(isLoading);
  }, [isLoading, setIsLoading]);

  const langFrom = supportedLanguagesByCode[languageSet.langFrom];
  const langTo = supportedLanguagesByCode[languageSet.langTo[0]];
  const languages = `${langFrom?.name || languageSet.langFrom} → ${langTo?.name || languageSet.langTo[0]}`;

  return (
    <List.Item
      title={result?.translatedText || ""}
      subtitle={isLoading ? "Translating..." : undefined}
      accessories={[{ text: languages }]}
      detail={<List.Item.Detail markdown={result?.translatedText || ""} />}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <ConfigurableCopyPasteActions
              defaultActionsPrefix="Translation"
              value={result?.translatedText || ""}
            />
            <ToggleFullTextAction onAction={() => setIsShowingDetail(!isShowingDetail)} />
            <CopyOriginalTextAction text={debouncedText} />
            {result && <CopyBothAction original={debouncedText} translated={result.translatedText} />}
          </ActionPanel.Section>
          <ActionPanel.Section title="Languages">
            <Action
              title="Add Target Language"
              icon={Icon.Plus}
              shortcut={{ modifiers: ["cmd"], key: "n" }}
              onAction={() => {
                // This would open a language picker
                showToast({
                  style: Toast.Style.Success,
                  title: "Feature coming soon",
                  message: "Language management will be added",
                });
              }}
            />
          </ActionPanel.Section>
        </ActionPanel>
      }
    />
  );
};

export default function QuickTranslate(): ReactElement {
  const [sourceLanguage] = useSourceLanguage();
  const [targetLanguages] = useTargetLanguages();
  const [isShowingDetail, setIsShowingDetail] = useState(true);
  const [text, setText] = useTextState();
  const debouncedText = useDebouncedValue(text, 500).trim();

  const [loadingStates, setLoadingStates] = useState(
    new Map(targetLanguages.map((lang) => [lang, false]))
  );

  const isAnyLoading = Array.from(loadingStates.values()).some((isLoading) => isLoading);

  function setIsLoading(lang: LanguageCode, isLoading: boolean) {
    setLoadingStates((prev) => new Map(prev).set(lang, isLoading));
  }

  return (
    <List
      searchBarPlaceholder="Enter text to translate"
      searchText={text}
      onSearchTextChange={setText}
      isLoading={isAnyLoading}
      isShowingDetail={isShowingDetail}
      searchBarAccessory={<LanguageDropdown />}
    >
      {debouncedText ? (
        targetLanguages.map((targetLanguage) => (
          <QuickTranslateListItem
            key={targetLanguage}
            debouncedText={debouncedText}
            languageSet={{ langFrom: sourceLanguage, langTo: [targetLanguage] }}
            isShowingDetail={isShowingDetail}
            setIsShowingDetail={setIsShowingDetail}
            setIsLoading={(isLoading) => setIsLoading(targetLanguage, isLoading)}
          />
        ))
      ) : (
        <List.EmptyView
          icon={Icon.TextCursor}
          title="Enter text to translate"
          description="Type or paste text in the search bar above"
        />
      )}
    </List>
  );
}
