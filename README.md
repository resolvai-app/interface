# ResolvAI Web Interface

A modern, responsive web application for AI-powered voice and text conversations, built with Next.js and featuring real-time communication capabilities.

## 🚀 Features

### Core Functionality
- **AI-Powered Conversations**: Real-time text and voice chat with advanced AI models
- **Voice Interaction**: High-quality voice recording and playback with WebRTC
- **Real-time Communication**: WebSocket-based live messaging and audio streaming
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Modern UI/UX**: Beautiful animations and intuitive user interface
- **Chat Management**: Create, organize, and manage conversation sessions

### User Experience
- **Interactive Animations**: Smooth transitions and micro-interactions with Framer Motion
- **Dynamic Backgrounds**: Galaxy and neural network visual effects
- **Dark Theme**: Modern dark interface with accent colors
- **Accessibility**: Keyboard navigation and screen reader support
- **Progressive Web App**: Installable web application

### AI Integration
- **Google Gemini AI**: Advanced language model integration
- **Real-time Processing**: Live audio and text processing
- **Context Awareness**: Maintains conversation context
- **Multi-modal Support**: Text and voice input/output

## 🛠️ Technology Stack

### Core Framework
- **Next.js 15.3.2**: React framework with App Router
- **React 18.3.1**: UI library with hooks
- **TypeScript**: Type-safe development
- **Turbopack**: Fast development bundler

### UI & Styling
- **Tailwind CSS v4**: Utility-first CSS framework
- **Framer Motion**: Animation library for React
- **React Icons**: Comprehensive icon library
- **Classnames**: Conditional CSS class utility

### State Management & Data
- **Zustand**: Lightweight state management
- **TanStack React Query**: Server state management
- **EventEmitter3**: Event-driven architecture

### Audio & Communication
- **WebRTC**: Real-time audio communication
- **WebSocket**: Real-time messaging
- **Audio Worklets**: Advanced audio processing
- **Wavefile**: Audio format handling

### Development Tools
- **ESLint**: Code linting and quality
- **Prettier**: Code formatting
- **TypeScript**: Static type checking

## 📱 Platform Support

- **Desktop**: Chrome, Firefox, Safari, Edge
- **Mobile**: iOS Safari, Android Chrome
- **Tablet**: iPad, Android tablets
- **Progressive Web App**: Installable on all platforms

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher)
- **pnpm** (recommended package manager)
- **Modern web browser** with WebRTC support

### Installation

1. **Clone the repository**:
```bash
git clone git@github.com:app-resolvai/interface.git
cd interface
```

2. **Install dependencies**:
```bash
pnpm install
```

3. **Set up environment variables**:
```bash
# Create .env.local file with your configuration
cp .env.example .env.local
```

4. **Start development server**:
```bash
# Start with Turbopack for faster development
pnpm dev
```

5. **Open your browser**:
Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Environment Variables
```env
# WebSocket Server
NEXT_PUBLIC_WS_URL=wss://your-websocket-server.com

# Google AI Configuration
NEXT_PUBLIC_GOOGLE_AI_API_KEY=your_google_ai_api_key

# Application Settings
NEXT_PUBLIC_APP_NAME=ResolvAI
NEXT_PUBLIC_APP_VERSION=1.0.0
```

### Development Scripts
```bash
# Development
pnpm dev              # Start development server with Turbopack
pnpm build            # Build for production
pnpm start            # Start production server
pnpm lint             # Run ESLint
pnpm format           # Format code with Prettier
```

## 📁 Project Structure

```
interface/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── page.tsx           # Home page with landing
│   │   ├── chat/              # Chat application
│   │   │   └── page.tsx       # Main chat interface
│   │   ├── layout.tsx         # Root layout
│   │   ├── providers.tsx      # Context providers
│   │   └── globals.css        # Global styles
│   ├── components/            # Reusable components
│   │   ├── chatbox/           # Chat interface components
│   │   │   ├── ChatBox.tsx    # Main chat container
│   │   │   ├── ChatInput.tsx  # Message input
│   │   │   ├── ChatList.tsx   # Conversation list
│   │   │   ├── MessageList.tsx # Message display
│   │   │   └── CallModal.tsx  # Voice call modal
│   │   ├── audio-pulse/       # Audio visualization
│   │   ├── settings-dialog/   # Settings interface
│   │   ├── providers/         # Context providers
│   │   ├── GalaxyBackground.tsx # Animated background
│   │   └── NeuralBackground.tsx # Neural network effect
│   ├── contexts/              # React contexts
│   │   ├── ChatStateContext.tsx # Chat state management
│   │   └── LiveAPIContext.tsx   # Live API integration
│   ├── hooks/                 # Custom React hooks
│   │   ├── store/             # State management hooks
│   │   │   └── useChatStore.ts # Chat state store
│   │   └── use-ws-api.ts      # WebSocket API hook
│   ├── lib/                   # Utilities and services
│   │   ├── worklets/          # Audio worklets
│   │   │   ├── audio-processing.ts # Audio processing
│   │   │   └── vol-meter.ts   # Volume meter
│   │   ├── audio-recorder.ts  # Audio recording service
│   │   ├── audio-streamer.ts  # Audio streaming service
│   │   ├── ws-live-client.ts  # WebSocket client
│   │   ├── fetch-interceptor.ts # HTTP interceptor
│   │   └── utils.ts           # Utility functions
│   └── types/                 # TypeScript type definitions
├── public/                    # Static assets
│   └── favicon.svg           # App icon
└── tailwind.config.ts        # Tailwind configuration
```

## 🎯 Key Features

### Landing Page
- **Hero Section**: Compelling introduction with animated elements
- **Feature Showcase**: Core capabilities presentation
- **Interactive Demo**: Live demonstration of AI capabilities
- **Responsive Design**: Optimized for all screen sizes

### Chat Interface
- **Real-time Messaging**: Instant message delivery
- **Voice Recording**: High-quality audio input
- **Message History**: Persistent conversation storage
- **Chat Organization**: Multiple conversation management
- **Markdown Support**: Rich text formatting

### Audio Features
- **WebRTC Integration**: Real-time audio communication
- **Audio Processing**: Advanced audio filtering and enhancement
- **Volume Visualization**: Real-time audio level display
- **Multi-format Support**: Various audio format handling

### Visual Effects
- **Galaxy Background**: Animated space-themed background
- **Neural Network**: Dynamic neural network visualization
- **Particle Systems**: Interactive particle effects
- **Smooth Animations**: Framer Motion-powered transitions

## 🔌 API Integration

### WebSocket Communication
- Real-time message streaming
- Audio data transmission
- Connection state management
- Automatic reconnection handling

### Audio Processing
- **Web Audio API**: Browser-based audio processing
- **Audio Worklets**: Background audio processing
- **MediaRecorder**: Audio recording capabilities
- **WebRTC**: Real-time communication

### External Services
- **Google AI**: Gemini model integration
- **WebSocket Server**: Real-time backend communication

## 🚀 Development

### Development Workflow
1. Start development server with `pnpm dev`
2. Use hot reload for instant updates
3. Debug with browser developer tools
4. Test responsive design across devices

### Code Quality
- **TypeScript**: Strict type checking
- **ESLint**: Code quality enforcement
- **Prettier**: Consistent code formatting
- **Component Testing**: Unit and integration tests

### Performance Optimization
- **Turbopack**: Fast development bundling
- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js image optimization
- **Bundle Analysis**: Performance monitoring

## 📦 Building for Production

### Build Process
```bash
# Create production build
pnpm build

# Start production server
pnpm start

# Analyze bundle size
pnpm analyze
```

### Deployment Options
- **Vercel**: Recommended for Next.js applications
- **Netlify**: Static site hosting
- **AWS Amplify**: Full-stack deployment
- **Docker**: Containerized deployment

## 🧪 Testing

### Testing Strategy
- **Unit Tests**: Component and utility testing
- **Integration Tests**: API and service testing
- **E2E Tests**: User workflow testing
- **Performance Tests**: Load and stress testing

### Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Playwright**: End-to-end testing
- **Lighthouse**: Performance auditing

## 📱 Progressive Web App

### PWA Features
- **Installable**: Add to home screen
- **Offline Support**: Basic functionality without internet
- **Push Notifications**: Real-time updates
- **Background Sync**: Data synchronization

### PWA Configuration
- Service worker for caching
- Web app manifest
- Offline fallback pages
- Background sync capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes following the coding standards
4. Add tests if applicable
5. Submit a pull request

### Coding Standards
- Use TypeScript for all new code
- Follow ESLint configuration
- Use Prettier for formatting
- Write meaningful commit messages

## 📄 License

MIT License - see LICENSE file for details

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Contact the development team
- Check documentation in `/docs` folder
- Review troubleshooting guide
