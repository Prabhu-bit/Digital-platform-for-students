# ਨਭਾ ਸਿੱਖਿਆ-ਏਆਈ | Nabha Shiksha-AI

An AI-powered digital learning platform designed specifically for rural students, featuring offline-first functionality and voice-based interactions in Punjabi.

## 🌟 Features

### Core Features
- **Voice-Based Learning**: Speak questions in Punjabi and get instant AI responses
- **Offline-First Design**: Works without internet connection for core functionality
- **Mobile-Optimized**: Designed for low-end mobile devices
- **Punjabi Language Support**: Full interface and content in Punjabi
- **AI-Powered Content**: Dynamic lesson generation based on student queries
- **Personalized Learning**: Adaptive content based on student level and progress

### Technical Features
- **On-Device Speech Recognition**: Optimized for Punjabi language
- **Offline Data Storage**: IndexedDB for caching lessons and progress
- **Background Sync**: Automatic data synchronization when online
- **Progressive Web App**: Installable on mobile devices
- **Responsive Design**: Works on all screen sizes

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Modern web browser with speech recognition support

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/nabha-shiksha-ai.git
   cd nabha-shiksha-ai
   ```

2. **Install dependencies**
   ```bash
   # Install root dependencies
   npm install
   
   # Install client dependencies
   cd client
   npm install
   cd ..
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file in the root directory
   cp .env.example .env
   
   # Edit .env with your configuration
   nano .env
   ```

4. **Start the development server**
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run server  # Backend only
   npm run client  # Frontend only
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 🏗️ Project Structure

```
nabha-shiksha-ai/
├── client/                 # React frontend
│   ├── public/            # Static assets
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # React context providers
│   │   ├── services/      # API and offline services
│   │   └── index.js       # App entry point
│   └── package.json
├── server/                # Node.js backend
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   └── index.js          # Server entry point
├── package.json          # Root dependencies
└── README.md
```

## 🎯 User Flow

### 1. Landing Page
- Clean, mobile-first design
- Punjabi and English language support
- "Start Learning" call-to-action
- Feature highlights

### 2. AI Tutor Interface
- Voice recording button
- Real-time transcription display
- AI response with audio playback
- Conversation history

### 3. Interactive Lessons
- Topic selection (Mathematics, Science, etc.)
- Level-based content (Beginner, Intermediate, Advanced)
- Step-by-step learning process
- Practice exercises with feedback

## 🤖 AI Integration

### Speech Recognition
- **Technology**: Web Speech API with Punjabi language support
- **Offline Capability**: On-device processing for basic recognition
- **Fallback**: Server-side processing for complex queries

### Natural Language Processing
- **Entity Recognition**: Identifies educational concepts in Punjabi
- **Sentiment Analysis**: Detects student emotional state
- **Intent Classification**: Determines learning goals from queries

### Content Generation
- **Dynamic Lessons**: AI-generated educational content
- **Personalization**: Adapts to student level and preferences
- **Multimodal**: Text, audio, and visual content generation

## 📱 Offline Functionality

### Data Storage
- **IndexedDB**: Local storage for lessons and progress
- **Service Worker**: Caching and background sync
- **Progressive Web App**: Installable on mobile devices

### Sync Strategy
- **Queue-based**: Offline actions queued for sync
- **Conflict Resolution**: Last-write-wins for simple conflicts
- **Retry Logic**: Automatic retry with exponential backoff

## 🌐 API Endpoints

### AI Services
- `POST /api/ai/voice-query` - Process voice queries
- `POST /api/ai/text-query` - Process text queries
- `POST /api/ai/generate-content` - Generate educational content
- `POST /api/ai/analyze-sentiment` - Analyze text sentiment

### Content Management
- `GET /api/content/topics` - Get available topics
- `GET /api/content/levels` - Get difficulty levels
- `POST /api/content/lesson` - Generate lesson content
- `GET /api/content/lesson/:id` - Get specific lesson

### User Management
- `POST /api/user/register` - Register new user
- `GET /api/user/profile/:id` - Get user profile
- `PUT /api/user/profile/:id` - Update user profile
- `GET /api/user/progress/:id` - Get user progress

## 🔧 Configuration

### Environment Variables
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# AI Services
OPENAI_API_KEY=your_openai_api_key
SPEECH_API_KEY=your_speech_api_key

# Database
DATABASE_URL=your_database_url

# Offline Settings
OFFLINE_MODE=true
CACHE_DURATION=86400000
```

### Browser Requirements
- **Speech Recognition**: Chrome, Edge, Safari (iOS 14.5+)
- **IndexedDB**: All modern browsers
- **Service Workers**: Chrome, Firefox, Safari, Edge
- **Web Audio API**: Chrome, Firefox, Safari, Edge

## 🚀 Deployment

### Production Build
```bash
# Build the React app
npm run build

# Start production server
npm start
```

### Docker Deployment
```bash
# Build Docker image
docker build -t nabha-shiksha-ai .

# Run container
docker run -p 5000:5000 nabha-shiksha-ai
```

### Environment-Specific Configuration
- **Development**: Hot reloading, debug logging
- **Staging**: Production-like environment for testing
- **Production**: Optimized build, error monitoring

## 📊 Performance Optimization

### Frontend Optimizations
- **Code Splitting**: Lazy loading of components
- **Image Optimization**: WebP format with fallbacks
- **Bundle Analysis**: Webpack bundle analyzer
- **Caching Strategy**: Aggressive caching for static assets

### Backend Optimizations
- **Compression**: Gzip compression for responses
- **Caching**: Redis for frequently accessed data
- **Database Indexing**: Optimized queries
- **Rate Limiting**: API rate limiting

## 🧪 Testing

### Unit Tests
```bash
# Run frontend tests
cd client
npm test

# Run backend tests
npm test
```

### Integration Tests
```bash
# Run API tests
npm run test:api

# Run end-to-end tests
npm run test:e2e
```

### Performance Tests
```bash
# Run Lighthouse audit
npm run lighthouse

# Run load tests
npm run load-test
```

## 🤝 Contributing

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

### Code Style
- **Frontend**: ESLint + Prettier
- **Backend**: ESLint + Prettier
- **Commits**: Conventional Commits
- **Documentation**: JSDoc for functions

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Punjabi Language Support**: Noto Sans Gurmukhi font
- **AI Models**: OpenAI GPT models for content generation
- **Speech Recognition**: Web Speech API
- **Offline Storage**: IndexedDB and Service Workers
- **UI Framework**: React with Framer Motion animations

## 📞 Support

For support and questions:
- **Email**: support@nabhashiksha.ai
- **Documentation**: [docs.nabhashiksha.ai](https://docs.nabhashiksha.ai)
- **Issues**: [GitHub Issues](https://github.com/your-username/nabha-shiksha-ai/issues)

## 🔮 Roadmap

### Phase 1 (Current)
- ✅ Basic voice interaction
- ✅ Offline functionality
- ✅ Punjabi language support
- ✅ Mobile optimization

### Phase 2 (Next)
- 🔄 Advanced AI models
- 🔄 Multi-language support
- 🔄 Teacher dashboard
- 🔄 Parent monitoring

### Phase 3 (Future)
- 📋 AR/VR integration
- 📋 Advanced analytics
- 📋 Community features
- 📋 Gamification

---

**Made with ❤️ for rural education in India**
