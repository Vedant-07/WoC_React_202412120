# 🚀 CodeRunner - Online Code Editor & Execution Platform

A modern, feature-rich online code editor and execution platform built with React, supporting 50+ programming languages with real-time code execution, file management, and cloud storage.

![CodeRunner Demo](https://img.shields.io/badge/Live%20Demo-Available-brightgreen)
![React](https://img.shields.io/badge/React-18.3.1-blue)
![Firebase](https://img.shields.io/badge/Firebase-11.1.0-orange)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.17-cyan)

## ✨ Features

### 🎨 **Modern UI/UX**
- Beautiful, responsive design with dark/light themes
- Intuitive interface with smooth animations
- Mobile-friendly responsive layout
- Professional color scheme and typography

### 💻 **Code Editor**
- **Monaco Editor** integration (VS Code editor)
- Syntax highlighting for 50+ languages
- Auto-completion and IntelliSense
- Multiple themes (Dark, Light, High Contrast)
- Real-time code editing with live preview

### 🏃‍♂️ **Code Execution**
- **Real-time code execution** with instant results
- Support for **50+ programming languages**
- Input/output handling with file upload support
- Error handling and debugging information
- Execution status indicators

### 📁 **File Management**
- **Cloud-based file storage** with Firebase
- Create, edit, delete, and organize files
- File explorer with drag-and-drop support
- Auto-save functionality
- File download in native format

### 👤 **User Management**
- **Google OAuth** authentication
- Guest mode for quick testing
- User profiles with persistent settings
- Secure cloud storage per user

## 🛠️ Tech Stack

### Frontend
- **React 18.3.1** - Modern UI library
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **Redux Toolkit** - State management
- **React Router** - Client-side routing

### Backend & Services
- **Firebase** - Authentication, Firestore database, hosting
- **Monaco Editor** - Code editor component
- **Axios** - HTTP client for API calls
- **React Split** - Resizable panels

### Development Tools
- **ESLint** - Code linting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixing

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase project setup

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/coderunner.git
   cd coderunner
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   VITE_FIREBASE_API_KEY=your_firebase_api_key
   VITE_API_KEY=your_rapidapi_key
   VITE_API_URL=your_api_url
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ide/             # IDE-specific components
│   │   ├── Ide.jsx      # Main IDE component
│   │   ├── Input.jsx    # Input panel
│   │   ├── Output.jsx   # Output panel
│   │   ├── FileExplorer.jsx
│   │   └── FileEditModal.jsx
│   ├── chat/            # Chat functionality
│   ├── HomePage.jsx     # Landing page
│   ├── LoginPage.jsx    # Authentication
│   ├── Navbar.jsx       # Navigation
│   └── Footer.jsx       # Footer
├── constants/           # Configuration files
│   ├── contentType.js   # MIME types
│   ├── defaultLanguages.js
│   └── getApiOptions.js
├── store/              # Redux store
├── utils/              # Utility functions
│   ├── firebase.js     # Firebase config
│   ├── apiHelpers.js   # API utilities
│   ├── ideSlice.js     # IDE state
│   ├── userSlice.js    # User state
│   └── fileSlice.js    # File state
└── styles.css          # Global styles
```

## 🎯 Usage

### For Users
1. **Guest Mode**: Start coding immediately without registration
2. **Sign Up**: Create an account for cloud storage and file management
3. **Code Editor**: Write code in your preferred language
4. **Execute**: Run code with custom input/output
5. **Save**: Store files in the cloud for later access
6. **Download**: Export your code in native file formats

### For Developers
1. **Fork** the repository
2. **Create** a feature branch
3. **Make** your changes
4. **Test** thoroughly
5. **Submit** a pull request

## 🔧 Configuration

### Firebase Setup
1. Create a Firebase project
2. Enable Authentication (Google provider)
3. Create a Firestore database
4. Update Firebase config in `src/utils/firebase.js`

### API Configuration
- Set up RapidAPI account for code execution
- Configure API endpoints in `src/constants/getApiOptions.js`
- Add API keys to environment variables

## 📱 Responsive Design

The application is fully responsive and works seamlessly across:
- **Desktop** (1920px+)
- **Laptop** (1024px - 1919px)
- **Tablet** (768px - 1023px)
- **Mobile** (320px - 767px)

## 🎨 Themes

- **Dark Theme** (Default) - Easy on the eyes for long coding sessions
- **Light Theme** - Clean and bright interface
- **High Contrast** - Enhanced accessibility

## 🔒 Security

- **Firebase Authentication** for secure user management
- **Environment variables** for sensitive data
- **Input validation** and sanitization
- **Secure API endpoints** with proper authentication

## 🚀 Deployment

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Other Platforms
The app can be deployed to any static hosting service:
- Vercel
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Workflow
1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monaco Editor** - Microsoft's code editor
- **Firebase** - Google's backend platform
- **Tailwind CSS** - Utility-first CSS framework
- **React** - Facebook's UI library
- **Vite** - Modern build tool

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/coderunner/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/coderunner/discussions)
- **Email**: support@coderunner.dev

## 🌟 Live Demo

Check out the live application: [https://coderunner-ide.firebaseapp.com](https://coderunner-ide.firebaseapp.com)

---

<div align="center">
  <p>Made with ❤️ by the CodeRunner Team</p>
  <p>
    <a href="#top">⬆️ Back to Top</a>
  </p>
</div>