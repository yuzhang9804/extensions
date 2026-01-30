# OpenAI Translate

AI-powered translation using OpenAI GPT models with natural, context-aware results.

![OpenAI Translate](./metadata/openai-translate-1.png)

## Features

- **Quick Translation**: Translate text quickly and easily with AI-powered accuracy
- **Language Sets**: Create your own translation language sets for quick switching
- **Multiple Translation Styles**: Choose from natural, formal, casual, or literal translation styles
- **Instant Translate**: Instantly translate selected text with keyboard shortcuts
- **Auto-Detect Language**: Automatically detect the source language
- **50+ Languages**: Support for over 50 languages including Chinese, Japanese, Korean, Spanish, French, German, and more

## Commands

| Command | Description |
|---------|-------------|
| Translate | Main translation interface with language set support |
| Translate Form | Form-based translation with text area input |
| Quick Translate | Quickly translate to multiple target languages |
| Instant Translate Copy | Translate selected text and copy to clipboard |
| Instant Translate Paste | Translate selected text and paste to active app |
| Instant Translate View | Translate selected text and show in HUD |

## Configuration

### Required Settings

- **OpenAI API Key**: Your OpenAI API key for translation (get one at [platform.openai.com](https://platform.openai.com))

### Optional Settings

- **API Endpoint**: Custom OpenAI API endpoint (for compatible APIs like Azure OpenAI)
- **Model**: Choose the GPT model (gpt-4o-mini recommended for best balance of speed and quality)
- **Primary Language**: Default source language (or Auto-Detect)
- **Secondary Language**: Default target language
- **Auto Input**: Automatically input selected text when opening
- **Default Action**: Copy or Paste as the default action
- **Translation Style**: Natural, Formal, Casual, or Literal

## Translation Styles

- **Natural & Fluent**: Ensures the translation sounds natural to native speakers
- **Formal & Professional**: Uses formal language suitable for business or academic contexts
- **Casual & Friendly**: Uses casual language suitable for everyday conversation
- **Literal & Precise**: Provides word-for-word translation while maintaining grammatical correctness

## Supported Languages

The extension supports 50+ languages including:

- **Asian**: Chinese (Simplified/Traditional), Japanese, Korean, Thai, Vietnamese, Indonesian, Malay
- **European**: English, Spanish, French, German, Italian, Portuguese, Russian, Dutch, Polish, Swedish, Danish, Finnish, Norwegian, Greek, Czech, Hungarian, Romanian, Ukrainian, Bulgarian, Croatian, Slovak, Slovenian, Serbian, Catalan
- **Middle Eastern**: Arabic, Hebrew, Turkish, Persian
- **South Asian**: Hindi, Bengali, Tamil, Telugu, Marathi, Gujarati, Kannada, Malayalam, Punjabi, Urdu
- **African**: Swahili

## Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| ⌘ + C | Copy translation |
| ⌘ + ⇧ + V | Paste translation |
| ⌘ + F | Toggle full text view |
| ⌘ + ↑/↓ | Switch language sets |
| ⌥ + ↵ | Open in ChatGPT |

## Tips

1. **Use Language Sets**: Create custom language sets for frequently used translation pairs
2. **Keyboard Shortcuts**: Use instant translate commands with global shortcuts for quick translations
3. **Translation Style**: Choose the appropriate style based on your context (formal for business, casual for chat)
4. **Model Selection**: GPT-4o-mini offers the best balance of speed and quality for most translations

## Privacy

- Your text is sent to OpenAI's API for translation
- No translation history is stored on external servers
- API key is stored securely in Raycast preferences

## Troubleshooting

### "Invalid API key" error
- Verify your API key at [platform.openai.com](https://platform.openai.com)
- Make sure the key has not expired or been revoked

### "Rate limit exceeded" error
- Wait a few moments and try again
- Consider upgrading your OpenAI plan for higher rate limits

### "Insufficient quota" error
- Check your OpenAI account billing and usage
- Add credits to your account if needed

## Credits

Inspired by the [Google Translate](https://www.raycast.com/gebeto/translate) extension for Raycast.

## License

MIT License
