import { Action, ActionPanel, Clipboard, showHUD, showToast, Toast } from "@raycast/api";
import React from "react";
import { TranslateResult } from "./types";
import { usePreferences } from "./hooks";

type TranslationActionsProps = {
  result: TranslateResult;
  isLoading?: boolean;
};

export const TranslationActions: React.FC<TranslationActionsProps> = ({ result, isLoading }) => {
  const preferences = usePreferences();
  const defaultAction = preferences.defaultAction || "copy";

  const copyAction = (
    <Action
      title="Copy Translation"
      icon={{ source: "doc.on.doc" }}
      shortcut={{ modifiers: ["cmd"], key: "c" }}
      onAction={async () => {
        await Clipboard.copy(result.translatedText);
        await showHUD("Copied to clipboard");
      }}
    />
  );

  const pasteAction = (
    <Action
      title="Paste Translation"
      icon={{ source: "doc.on.clipboard" }}
      shortcut={{ modifiers: ["cmd", "shift"], key: "v" }}
      onAction={async () => {
        await Clipboard.paste(result.translatedText);
        await showHUD("Pasted to active app");
      }}
    />
  );

  const copyOriginalAction = (
    <Action
      title="Copy Original"
      icon={{ source: "doc.on.doc" }}
      shortcut={{ modifiers: ["cmd", "shift"], key: "c" }}
      onAction={async () => {
        await Clipboard.copy(result.originalText);
        await showHUD("Original text copied");
      }}
    />
  );

  return (
    <ActionPanel>
      <ActionPanel.Section>
        {defaultAction === "copy" ? (
          <>
            {copyAction}
            {pasteAction}
          </>
        ) : (
          <>
            {pasteAction}
            {copyAction}
          </>
        )}
        {copyOriginalAction}
      </ActionPanel.Section>
    </ActionPanel>
  );
};
