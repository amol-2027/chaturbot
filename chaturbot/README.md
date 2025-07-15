# ChaturBot

ChaturBot is a smart AI-powered web application built with React and Vite. It allows users to chat with an AI assistant, generate images from text prompts using Stable Diffusion, and upload images for AI-powered responses. The app features a modern UI, dark mode, voice input, and persistent chat history.

## Features

- **Chat with AI**: Converse with an intelligent assistant powered by Google Gemini API.
- **Image Generation**: Generate images from text prompts using HuggingFace's Stable Diffusion model.
- **Image Upload**: Upload your own images and interact with the AI about them.
- **Voice Input**: Use your microphone to input queries via speech recognition.
- **Dark Mode**: Toggle between light and dark themes.
- **Download Chat**: Export your chat history as a `.txt` file.
- **Persistent History**: Chat history is saved in your browser's local storage.

## Demo

![ChaturBot Screenshot](public/vite.svg) <!-- Replace with actual screenshot if available -->

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. Clone the repository:
   ```bash
   git clone <repo-url>
   cd ChaturBot/chaturbot
   ```
2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

### Running the App

Start the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser to use ChaturBot.

### Build for Production

```bash
npm run build
# or
yarn build
```

### Linting

```bash
npm run lint
```

## API Keys & Configuration

ChaturBot uses the following APIs:

- **Google Gemini API** (for chat): The API key is currently hardcoded in `src/gemini.js`.
- **HuggingFace Stable Diffusion** (for image generation): The API key is currently hardcoded in `src/huggingFace.js`.

**For production or public use, you should move these keys to environment variables and never commit secrets to your repository.**

## Project Structure

```
chaturbot/
  ├── public/           # Static assets
  ├── src/
  │   ├── assets/       # Images and icons
  │   ├── context/      # React context for user and app state
  │   ├── pages/        # Main pages (Home, Chat)
  │   ├── App.jsx       # Main app component
  │   ├── gemini.js     # Gemini API integration
  │   ├── huggingFace.js# HuggingFace API integration
  │   └── ...
  ├── App.css           # Main styles
  ├── index.html        # HTML entry point
  └── package.json      # Project metadata and scripts
```

## Credits

- **Author**: Amol Rathod
- Built with [React](https://react.dev/), [Vite](https://vitejs.dev/), [Google Gemini](https://ai.google.dev/), and [HuggingFace](https://huggingface.co/).

## License

This project is for educational and demonstration purposes. Please check API terms of service before public deployment.
