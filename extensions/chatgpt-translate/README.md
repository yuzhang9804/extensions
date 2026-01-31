# ChatGPT Translate

AI-powered translation using OpenAI GPT models with natural, context-aware results.

## Features

This extension provides high-quality AI translation powered by OpenAI's GPT models, offering the same translation quality as ChatGPT's web interface.

**Key Features:**
- **50+ Languages**: Support for over 50 languages including Chinese, Japanese, Korean, Spanish, French, German, and more
- **Multiple Translation Modes**: Translate, Translate Form, Quick Translate, and Instant Translate commands
- **Auto-Detect Language**: Automatically detects the source language
- **Natural Translations**: Leverages GPT models for context-aware, natural translations
- **Custom API Endpoint**: Support for OpenAI-compatible APIs (Azure OpenAI, etc.)

## Commands

| Command | Description |
|---------|-------------|
| Translate | Main translation interface with language set switching |
| Translate Form | Form-based translation with text area input |
| Quick Translate | Quickly translate to multiple target languages |
| Instant Translate Copy | Translate selected text and copy to clipboard |
| Instant Translate Paste | Translate selected text and paste to active app |
| Instant Translate View | Translate selected text and show in HUD |

## Configuration

| Preference | Description |
|------------|-------------|
| OpenAI API Key | **Required**. Your OpenAI API key |
| API Endpoint | Optional. Custom API endpoint for OpenAI-compatible services |
| Model | GPT model to use (default: gpt-4o-mini) |
| Primary Language | Default source language (Auto-Detect recommended) |
| Secondary Language | Default target language |
| Auto Input | Automatically input selected text when opening |
| Default Action | Default action on Enter (Copy or Paste) |

## Getting Started

1. Install the extension from Raycast Store
2. Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
3. Open Raycast and search for "ChatGPT Translate"
4. Enter your API key in the extension preferences
5. Start translating!

## Supported Languages

Arabic, Bengali, Bulgarian, Catalan, Chinese (Simplified), Chinese (Traditional), Croatian, Czech, Danish, Dutch, English, Finnish, French, German, Greek, Gujarati, Hebrew, Hindi, Hungarian, Indonesian, Italian, Japanese, Kannada, Korean, Malay, Malayalam, Marathi, Norwegian, Persian, Polish, Portuguese, Punjabi, Romanian, Russian, Serbian, Slovak, Slovenian, Spanish, Swahili, Swedish, Tamil, Telugu, Thai, Turkish, Ukrainian, Urdu, Vietnamese

## Model Selection

| Model | Description |
|-------|-------------|
| GPT-4o Mini | Fast and cost-effective, recommended for most translations |
| GPT-4o | Higher quality, better for complex or nuanced translations |
| GPT-4 Turbo | Advanced model with excellent translation quality |
| GPT-3.5 Turbo | Fastest and most affordable option |

## Custom API Endpoint

If you're using an OpenAI-compatible API service (like Azure OpenAI), you can specify a custom API endpoint in the preferences. Leave it empty to use the default OpenAI API.

## Privacy

All translations are processed through OpenAI's API. Please review [OpenAI's Privacy Policy](https://openai.com/privacy/) for information about data handling.

## Credits

Inspired by the [Google Translate](https://www.raycast.com/gebeto/google-translate) extension for Raycast.
