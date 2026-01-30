import React from "react";
import { List, Icon, Color, ActionPanel, Action } from "@raycast/api";
import { useAllLanguageSets, usePreferencesLanguageSet, useSelectedLanguagesSet } from "../hooks";
import { languagesList, supportedLanguagesByCode, LanguageCode } from "../languages";
import { LanguageCodeSet } from "../types";

const formatLanguageSet = (langSet: LanguageCodeSet): string => {
  const from = supportedLanguagesByCode[langSet.langFrom]?.name || langSet.langFrom;
  const to = langSet.langTo.map((code) => supportedLanguagesByCode[code]?.name || code).join(", ");
  return `${from} → ${to}`;
};

export const LanguageManagerListDropdown: React.FC = () => {
  const [selectedLanguageSet, setSelectedLanguageSet] = useSelectedLanguagesSet();
  const preferencesLanguageSet = usePreferencesLanguageSet();
  const [allLanguageSets] = useAllLanguageSets();

  const allSets = React.useMemo(
    () => [preferencesLanguageSet, ...allLanguageSets],
    [preferencesLanguageSet, allLanguageSets]
  );

  const selectedValue = React.useMemo(
    () => JSON.stringify(selectedLanguageSet),
    [selectedLanguageSet]
  );

  return (
    <List.Dropdown
      tooltip="Select Language Set"
      value={selectedValue}
      onChange={(newValue) => {
        try {
          const parsed = JSON.parse(newValue) as LanguageCodeSet;
          setSelectedLanguageSet(parsed);
        } catch {
          // Handle invalid JSON
        }
      }}
    >
      <List.Dropdown.Section title="Language Sets">
        {allSets.map((langSet, index) => (
          <List.Dropdown.Item
            key={index}
            title={formatLanguageSet(langSet)}
            value={JSON.stringify(langSet)}
            icon={
              JSON.stringify(langSet) === selectedValue
                ? { source: Icon.CheckCircle, tintColor: Color.Green }
                : Icon.Circle
            }
          />
        ))}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
};

export const LanguageDropdown: React.FC<{
  value: LanguageCode;
  onChange: (value: LanguageCode) => void;
  title?: string;
  includeAuto?: boolean;
}> = ({ value, onChange, title = "Language", includeAuto = true }) => {
  const filteredLanguages = React.useMemo(
    () => (includeAuto ? languagesList : languagesList.filter((lang) => lang.code !== "auto")),
    [includeAuto]
  );

  return (
    <List.Dropdown
      tooltip={`Select ${title}`}
      value={value}
      onChange={(newValue) => onChange(newValue as LanguageCode)}
    >
      <List.Dropdown.Section title={title}>
        {filteredLanguages.map((lang) => (
          <List.Dropdown.Item
            key={lang.code}
            title={lang.name}
            value={lang.code}
            icon={value === lang.code ? { source: Icon.CheckCircle, tintColor: Color.Green } : Icon.Circle}
          />
        ))}
      </List.Dropdown.Section>
    </List.Dropdown>
  );
};

export const LanguageSetManager: React.FC = () => {
  const [allLanguageSets, setAllLanguageSets] = useAllLanguageSets();
  const preferencesLanguageSet = usePreferencesLanguageSet();

  const addLanguageSet = (langSet: LanguageCodeSet) => {
    const exists = allLanguageSets.some(
      (existing) => JSON.stringify(existing) === JSON.stringify(langSet)
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
    <List navigationTitle="Manage Language Sets">
      <List.Section title="Default Language Set">
        <List.Item
          title={formatLanguageSet(preferencesLanguageSet)}
          icon={Icon.Star}
          accessories={[{ text: "Default" }]}
        />
      </List.Section>
      <List.Section title="Custom Language Sets">
        {allLanguageSets.map((langSet, index) => (
          <List.Item
            key={index}
            title={formatLanguageSet(langSet)}
            icon={Icon.Globe}
            actions={
              <ActionPanel>
                <Action
                  title="Remove Language Set"
                  icon={Icon.Trash}
                  style={Action.Style.Destructive}
                  onAction={() => removeLanguageSet(index)}
                />
              </ActionPanel>
            }
          />
        ))}
      </List.Section>
    </List>
  );
};
