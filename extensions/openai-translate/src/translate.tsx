import React, { ReactElement, useState } from "react";
import { List, showToast, Toast, Action, Icon, ActionPanel, Keyboard } from "@raycast/api";
import { usePromise } from "@raycast/utils";
import {
  useAllLanguageSets,
  useDebouncedValue,
  usePreferencesLanguageSet,
  useSelectedLanguagesSet,
  useTextState,
} from "./hooks";
import { supportedLanguagesByCode } from "./languages";
import { LanguageManagerListDropdown } from "./LanguagesManager";
import { doubleWayTranslate, translateText } from "./openai-translate";
import { ConfigurableCopyPasteActions, ToggleFullTextAction, CopyOriginalTextAction, CopyBothAction } from "./actions";
import { LanguageCodeSet } from "./types";

const QuickLanguageSetShifterActions = () => {
  const [selectedLanguageSet, setSelectedLanguageSet] = useSelectedLanguagesSet();
  const preferencesLanguageSet = usePreferencesLanguageSet();
  const [languages] = useAllLanguageSets();
  const allLanguages = React.useMemo(
    () => [preferencesLanguageSet, ...languages],
    [preferencesLanguageSet, languages]
  );
  const selectedLanguageSetIndex = React.useMemo(
    () =>
      allLanguages.findIndex(
        (langSet) => JSON.stringify(langSet) === JSON.stringify(selectedLanguageSet)
      ),
    [allLanguages, selectedLanguageSet]
  );

  return (
    <ActionPanel.Section title="Language Set">
      <Action
        title="Go to Previous Language Set"
        icon={Icon.ArrowUp}
        shortcut={Keyboard.Shortcut.Common.MoveUp}
        onAction={() => {
          if (selectedLanguageSetIndex <= 0) {
            setSelectedLanguageSet(allLanguages[allLanguages.length - 1]);
          } else {
            setSelectedLanguageSet(allLanguages[selectedLanguageSetIndex - 1]);
          }
        }}
      />
      <Action
        title="Go to Next Language Set"
        icon={Icon.ArrowDown}
        shortcut={Keyboard.Shortcut.Common.MoveDown}
        onAction={() => {
          if (selectedLanguageSetIndex >= allLanguages.length - 1) {
            setSelectedLanguageSet(allLanguages[0]);
          } else {
            setSelectedLanguageSet(allLanguages[selectedLanguageSetIndex + 1]);
          }
        }}
      />
    </ActionPanel.Section>
  );
};

const DoubleWayTranslateItem: React.FC<{
  value: string;
  selectedLanguageSet: LanguageCodeSet;
  toggleShowingDetail: () => void;
}> = ({ toggleShowingDetail, value, selectedLanguageSet }) => {
  const { data: results, isLoading } = usePromise(doubleWayTranslate, [value, selectedLanguageSet], {
    onError(error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Could not translate",
        message: error.toString(),
      });
    },
  });

  if (isLoading) {
    return <List.EmptyView icon={Icon.Hourglass} title="Translating with AI..." />;
  }

  return (
    <>
      {results?.map((r, index) => {
        const langFrom = supportedLanguagesByCode[r.langFrom];
        const langTo = supportedLanguagesByCode[r.langTo];
        const languages = `${langFrom?.name || r.langFrom} → ${langTo?.name || r.langTo}`;
        const tooltip = `${langFrom?.name || r.langFrom} → ${langTo?.name || r.langTo}`;
        return (
          <React.Fragment key={index}>
            <List.Item
              title={r.translatedText}
              accessories={[{ text: languages, tooltip: tooltip }]}
              detail={<List.Item.Detail markdown={r.translatedText} />}
              actions={
                <ActionPanel>
                  <ActionPanel.Section>
                    <ConfigurableCopyPasteActions defaultActionsPrefix="Translation" value={r.translatedText} />
                    <ToggleFullTextAction onAction={() => toggleShowingDetail()} />
                    <CopyOriginalTextAction text={value} />
                    <CopyBothAction original={value} translated={r.translatedText} />
                  </ActionPanel.Section>
                  <QuickLanguageSetShifterActions />
                </ActionPanel>
              }
            />
          </React.Fragment>
        );
      })}
    </>
  );
};

const TranslateItem: React.FC<{
  value: string;
  selectedLanguageSet: LanguageCodeSet;
  toggleShowingDetail: () => void;
}> = ({ toggleShowingDetail, value, selectedLanguageSet }) => {
  const { data: result, isLoading } = usePromise(translateText, [value, selectedLanguageSet], {
    onError(error) {
      showToast({
        style: Toast.Style.Failure,
        title: "Could not translate",
        message: error.toString(),
      });
    },
  });

  const langFromCode = result?.langFrom ?? selectedLanguageSet.langFrom;
  const langToCode = result?.langTo ?? selectedLanguageSet.langTo[0];

  const langFrom = supportedLanguagesByCode[langFromCode];
  const langTo = supportedLanguagesByCode[langToCode];
  const languages = `${langFrom?.name || langFromCode} → ${langTo?.name || langToCode}`;
  const tooltip = `${langFrom?.name || langFromCode} → ${langTo?.name || langToCode}`;

  return (
    <List.Item
      title={result?.translatedText ?? ""}
      subtitle={isLoading ? "Translating with AI..." : undefined}
      accessories={[{ text: languages, tooltip: tooltip }]}
      detail={<List.Item.Detail markdown={result?.translatedText ?? ""} />}
      actions={
        <ActionPanel>
          <ActionPanel.Section>
            <ConfigurableCopyPasteActions defaultActionsPrefix="Translation" value={result?.translatedText ?? ""} />
            <ToggleFullTextAction onAction={() => toggleShowingDetail()} />
            {result && <CopyOriginalTextAction text={value} />}
            {result && <CopyBothAction original={value} translated={result.translatedText} />}
          </ActionPanel.Section>
          <QuickLanguageSetShifterActions />
        </ActionPanel>
      }
    />
  );
};

export default function Translate(): ReactElement {
  const [selectedLanguageSet] = useSelectedLanguagesSet();
  const [isShowingDetail, setIsShowingDetail] = useState(false);
  const [text, setText] = useTextState();
  const debouncedValue = useDebouncedValue(text, 500);

  return (
    <List
      searchBarPlaceholder="Enter text to translate"
      searchText={text}
      onSearchTextChange={setText}
      isShowingDetail={isShowingDetail}
      searchBarAccessory={<LanguageManagerListDropdown />}
      actions={
        <ActionPanel>
          <QuickLanguageSetShifterActions />
        </ActionPanel>
      }
    >
      {debouncedValue ? (
        selectedLanguageSet.langTo.length === 1 ? (
          <DoubleWayTranslateItem
            value={debouncedValue}
            selectedLanguageSet={{
              langFrom: selectedLanguageSet.langFrom,
              langTo: selectedLanguageSet.langTo,
            }}
            toggleShowingDetail={() => setIsShowingDetail(!isShowingDetail)}
          />
        ) : (
          selectedLanguageSet.langTo.map((langTo, index) => (
            <TranslateItem
              key={`${index} ${langTo}`}
              value={debouncedValue}
              selectedLanguageSet={{
                langFrom: selectedLanguageSet.langFrom,
                langTo: [langTo],
              }}
              toggleShowingDetail={() => setIsShowingDetail(!isShowingDetail)}
            />
          ))
        )
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
