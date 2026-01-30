import React from "react";
import { Action, Icon, getPreferenceValues } from "@raycast/api";
import { TranslateResult } from "./openai-translate";
import { Preferences } from "./types";

interface ActionsOpts {
  value: string;
  defaultActionsPrefix?: string;
}

export const ConfigurableCopyPasteActions = ({ defaultActionsPrefix, value }: ActionsOpts) => {
  const defaultPreference = getPreferenceValues<Preferences>().defaultAction;

  const pasteAction = (
    <Action.Paste
      title={defaultActionsPrefix ? `Paste ${defaultActionsPrefix}` : `Paste`}
      content={value}
    />
  );
  const copyAction = (
    <Action.CopyToClipboard
      title={defaultActionsPrefix ? `Copy ${defaultActionsPrefix}` : `Copy`}
      content={value}
    />
  );

  if (defaultPreference === "paste") {
    return (
      <>
        {pasteAction}
        {copyAction}
      </>
    );
  }

  return (
    <>
      {copyAction}
      {pasteAction}
    </>
  );
};

export const ToggleFullTextAction: React.FC<{
  onAction: () => void;
}> = ({ onAction }) => {
  return (
    <Action
      title="Toggle Full Text"
      icon={Icon.Text}
      onAction={onAction}
      shortcut={{ modifiers: ["cmd"], key: "f" }}
    />
  );
};

export const OpenOnChatGPTAction: React.FC<{
  translation: Pick<TranslateResult, "langFrom" | "langTo">;
  translationText: string;
}> = ({ translationText, translation }) => {
  // ChatGPT doesn't have a direct URL for translation, so we open the general translate page
  return (
    <Action.OpenInBrowser
      title="Open in ChatGPT"
      icon={Icon.Globe}
      shortcut={{ modifiers: ["opt"], key: "return" }}
      url={`https://chatgpt.com/translate/?text=${encodeURIComponent(translationText)}`}
    />
  );
};

export const CopyOriginalTextAction: React.FC<{
  text: string;
}> = ({ text }) => {
  return (
    <Action.CopyToClipboard
      title="Copy Original Text"
      content={text}
      shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
    />
  );
};

export const CopyBothAction: React.FC<{
  original: string;
  translated: string;
}> = ({ original, translated }) => {
  return (
    <Action.CopyToClipboard
      title="Copy Both (Original + Translation)"
      content={`${original}\n\n${translated}`}
      shortcut={{ modifiers: ["cmd", "opt"], key: "c" }}
    />
  );
};
