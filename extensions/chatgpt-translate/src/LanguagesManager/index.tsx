import { Action, ActionPanel, Icon, List } from "@raycast/api";
import React from "react";
import { useAllLanguageSets, usePreferencesLanguageSet } from "../hooks";
import { LanguageCodeSet } from "../types";
import { getLanguageName, languages, LanguageCode } from "../languages";
import { AUTO_DETECT } from "../chatgpt-translate";

type LanguagesManagerListProps = {
  onSelect: (langSet: LanguageCodeSet) => void;
  onBack: () => void;
};

export const LanguagesManagerList: React.FC<LanguagesManagerListProps> = ({ onSelect, onBack }) => {
  const preferencesLanguageSet = usePreferencesLanguageSet();
  const [allLanguageSets, setAllLanguageSets] = useAllLanguageSets();
  const [isAddingNew, setIsAddingNew] = React.useState(false);
  const [newLangFrom, setNewLangFrom] = React.useState<LanguageCode>("auto");
  const [newLangTo, setNewLangTo] = React.useState<LanguageCode>("en");

  const addLanguageSet = (langSet: LanguageCodeSet) => {
    const exists = allLanguageSets.some(
      (set) => set.langFrom === langSet.langFrom && set.langTo[0] === langSet.langTo[0]
    );
    if (!exists) {
      setAllLanguageSets([...allLanguageSets, langSet]);
    }
  };

  const removeLanguageSet = (index: number) => {
    const newSets = [...allLanguageSets];
    newSets.splice(index, 1);
    setAllLanguageSets(newSets);
  };

  return (
    <List>
      <List.Section title="Default Language Set">
        <List.Item
          title={`${getLanguageName(preferencesLanguageSet.langFrom)} → ${getLanguageName(preferencesLanguageSet.langTo[0])}`}
          icon={Icon.Star}
          actions={
            <ActionPanel>
              <Action title="Use This Set" onAction={() => onSelect(preferencesLanguageSet)} />
              <Action title="Go Back" onAction={onBack} shortcut={{ modifiers: ["cmd"], key: "[" }} />
            </ActionPanel>
          }
        />
      </List.Section>

      <List.Section title="Saved Language Sets">
        {allLanguageSets.map((langSet, index) => (
          <List.Item
            key={`${langSet.langFrom}-${langSet.langTo[0]}-${index}`}
            title={`${getLanguageName(langSet.langFrom)} → ${getLanguageName(langSet.langTo[0])}`}
            icon={Icon.Globe}
            actions={
              <ActionPanel>
                <Action title="Use This Set" onAction={() => onSelect(langSet)} />
                <Action
                  title="Remove"
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  onAction={() => removeLanguageSet(index)}
                  shortcut={{ modifiers: ["cmd"], key: "backspace" }}
                />
                <Action title="Go Back" onAction={onBack} shortcut={{ modifiers: ["cmd"], key: "[" }} />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>

      <List.Section title="Add New">
        <List.Item
          title="Add Language Set"
          icon={Icon.Plus}
          actions={
            <ActionPanel>
              <ActionPanel.Submenu title="Select Source Language">
                {languages.map((lang) => (
                  <ActionPanel.Submenu key={lang.code} title={lang.name}>
                    {languages
                      .filter((l) => l.code !== AUTO_DETECT)
                      .map((targetLang) => (
                        <Action
                          key={targetLang.code}
                          title={`→ ${targetLang.name}`}
                          onAction={() =>
                            addLanguageSet({
                              langFrom: lang.code,
                              langTo: [targetLang.code],
                            })
                          }
                        />
                      ))}
                  </ActionPanel.Submenu>
                ))}
              </ActionPanel.Submenu>
              <Action title="Go Back" onAction={onBack} shortcut={{ modifiers: ["cmd"], key: "[" }} />
            </ActionPanel>
          }
        />
      </List.Section>
    </List>
  );
};
