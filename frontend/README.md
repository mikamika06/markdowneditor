
# Markdown Editor Frontend

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A modern React-based frontend for creating and editing Markdown documents with real-time preview and cloud synchronization.

## 🌟 Features

- **Interactive Markdown Editor** with syntax highlighting powered by CodeMirror
- **Real-time Preview** - see your Markdown rendered as HTML instantly
- **Note Management** - create, edit, delete, and organize your notes
- **User Authentication** - secure registration and login system
- **Auto-save** - changes are saved automatically as you type
- **Responsive Design** - works seamlessly on desktop and mobile devices
- **Clean UI** - minimalist interface focused on writing

## 🛠️ Tech Stack

- **React 18** + **TypeScript** for type-safe component development
- **Vite** as the fast build tool and dev server
- **Tailwind CSS** for utility-first styling
- **React Query (TanStack Query)** for server state management
- **Zustand** for client state management
- **CodeMirror 6** for the code editor with Markdown support
- **React Markdown** for rendering Markdown to HTML
- **React Hook Form** for form validation

## 🔧 Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0 or yarn >= 1.22.0

## ⚙️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/mikamika06/markdowneditor.git
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:5173`

## 🏗️ Build for Production

```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## 🚀 Deployment

### Vercel (Recommended)

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. Set environment variables in Vercel dashboard:
   - `VITE_API_URL`: Your backend API URL

### Netlify

1. Build the project:
   ```bash
   npm run build
   ```

2. Deploy the `dist` folder to Netlify

3. Set environment variables:
   - `VITE_API_URL`: Your backend API URL

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── auth/           # Authentication forms
│   ├── editor/         # Markdown editor component
│   ├── layout/         # Layout components (Header, Sidebar)
│   ├── notes/          # Note-related components
│   └── ui/             # Basic UI components (Button, Input)
├── hooks/              # Custom React hooks
├── pages/              # Page components
├── services/           # API service functions
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
└── utils/              # Utility functions
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking

## 🔑 Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |

## 🏛️ Architecture

The frontend follows a clean architecture pattern:

- **Components**: Pure UI components with minimal business logic
- **Hooks**: Custom hooks for data fetching and state management
- **Services**: API communication layer
- **Stores**: Global state management with Zustand
- **Types**: Shared TypeScript interfaces and types

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/mikamika06/markdowneditor/issues) page
2. Create a new issue if your problem isn't already reported
3. Provide as much detail as possible about your environment and the issue