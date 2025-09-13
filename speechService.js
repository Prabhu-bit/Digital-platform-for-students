// Offline Speech-to-Text Service for Punjabi Language
// This service provides offline speech recognition capabilities optimized for mobile devices

class OfflineSpeechService {
  constructor() {
    this.recognition = null;
    this.isSupported = false;
    this.isListening = false;
    this.callbacks = {
      onResult: null,
      onError: null,
      onStart: null,
      onEnd: null
    };
    
    this.initializeRecognition();
  }

  // Initialize speech recognition
  initializeRecognition() {
    try {
      // Check if speech recognition is supported
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      
      if (!SpeechRecognition) {
        console.warn('Speech recognition not supported in this browser');
        return;
      }

      this.recognition = new SpeechRecognition();
      this.isSupported = true;
      
      // Configure recognition settings
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'pa-IN'; // Punjabi (India)
      this.recognition.maxAlternatives = 3;
      
      // Set up event listeners
      this.setupEventListeners();
      
    } catch (error) {
      console.error('Failed to initialize speech recognition:', error);
      this.isSupported = false;
    }
  }

  // Set up event listeners for speech recognition
  setupEventListeners() {
    if (!this.recognition) return;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.callbacks.onStart) {
        this.callbacks.onStart();
      }
    };

    this.recognition.onresult = (event) => {
      const results = Array.from(event.results);
      const transcript = results
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');

      const confidence = results[0] && results[0][0] ? results[0][0].confidence : 0;

      if (this.callbacks.onResult) {
        this.callbacks.onResult({
          transcript,
          confidence,
          isFinal: results[results.length - 1].isFinal
        });
      }
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (this.callbacks.onError) {
        this.callbacks.onError(event.error);
      }
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.callbacks.onEnd) {
        this.callbacks.onEnd();
      }
    };
  }

  // Start listening for speech
  startListening() {
    if (!this.isSupported || !this.recognition) {
      throw new Error('Speech recognition not supported');
    }

    if (this.isListening) {
      this.stopListening();
    }

    try {
      this.recognition.start();
    } catch (error) {
      console.error('Failed to start speech recognition:', error);
      throw error;
    }
  }

  // Stop listening for speech
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Set callbacks for speech recognition events
  setCallbacks(callbacks) {
    this.callbacks = { ...this.callbacks, ...callbacks };
  }

  // Check if speech recognition is supported
  isSpeechRecognitionSupported() {
    return this.isSupported;
  }

  // Get available languages
  getAvailableLanguages() {
    return [
      { code: 'pa-IN', name: 'Punjabi (India)', nativeName: 'ਪੰਜਾਬੀ (ਭਾਰਤ)' },
      { code: 'en-US', name: 'English (US)', nativeName: 'English (United States)' },
      { code: 'hi-IN', name: 'Hindi (India)', nativeName: 'हिन्दी (भारत)' }
    ];
  }

  // Set language for recognition
  setLanguage(languageCode) {
    if (this.recognition) {
      this.recognition.lang = languageCode;
    }
  }

  // Get current language
  getCurrentLanguage() {
    return this.recognition ? this.recognition.lang : 'pa-IN';
  }

  // Check if currently listening
  isCurrentlyListening() {
    return this.isListening;
  }

  // Process audio file (for offline processing)
  async processAudioFile(audioFile) {
    try {
      // In a real implementation, this would use a local ML model
      // For now, we'll simulate the process
      
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const arrayBuffer = await audioFile.arrayBuffer();
      const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock transcription result
      const mockTranscription = "ਮੈਂ ਗਣਿਤ ਦੇ ਬਾਰੇ ਸਿੱਖਣਾ ਚਾਹੁੰਦਾ ਹਾਂ";
      
      return {
        transcript: mockTranscription,
        confidence: 0.85,
        language: 'pa-IN',
        duration: audioBuffer.duration
      };
      
    } catch (error) {
      console.error('Error processing audio file:', error);
      throw new Error('Failed to process audio file');
    }
  }

  // Convert text to speech (TTS)
  async speakText(text, language = 'pa-IN') {
    try {
      if (!('speechSynthesis' in window)) {
        throw new Error('Text-to-speech not supported');
      }

      // Cancel any ongoing speech
      window.speechSynthesis.cancel();

      return new Promise((resolve, reject) => {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = language;
        utterance.rate = 0.8;
        utterance.pitch = 1;
        utterance.volume = 0.8;

        utterance.onend = () => resolve();
        utterance.onerror = (event) => reject(event.error);

        window.speechSynthesis.speak(utterance);
      });
      
    } catch (error) {
      console.error('Error with text-to-speech:', error);
      throw error;
    }
  }

  // Get available voices for TTS
  getAvailableVoices() {
    if (!('speechSynthesis' in window)) {
      return [];
    }

    return window.speechSynthesis.getVoices().filter(voice => 
      voice.lang.startsWith('pa') || voice.lang.startsWith('hi') || voice.lang.startsWith('en')
    );
  }

  // Set voice for TTS
  setVoice(voiceName) {
    this.selectedVoice = voiceName;
  }

  // Get current voice
  getCurrentVoice() {
    return this.selectedVoice || null;
  }

  // Clean up resources
  destroy() {
    if (this.recognition) {
      this.recognition.stop();
      this.recognition = null;
    }
    this.isListening = false;
    this.callbacks = {
      onResult: null,
      onError: null,
      onStart: null,
      onEnd: null
    };
  }
}

// Create singleton instance
const speechService = new OfflineSpeechService();

export default speechService;
