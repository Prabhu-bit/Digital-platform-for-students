import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, VolumeX, BookOpen, History, Settings, ArrowLeft, Wifi, WifiOff } from 'lucide-react';
import { useAI } from '../context/AIContext';
import toast from 'react-hot-toast';

const AITutorInterface = () => {
  const navigate = useNavigate();
  const { 
    isListening, 
    isProcessing, 
    error, 
    transcription, 
    response, 
    conversationHistory,
    startListening, 
    stopListening, 
    processVoiceQuery,
    clearError 
  } = useAI();

  const [isRecording, setIsRecording] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const audioRef = useRef(null);

  // Check online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Handle voice recording
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          sampleRate: 44100
        } 
      });
      
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/webm;codecs=opus'
      });
      
      audioChunksRef.current = [];
      
      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await processVoiceQuery(audioBlob);
        setIsRecording(false);
      };
      
      mediaRecorderRef.current.start();
      setIsRecording(true);
      startListening();
      
      toast.success('Recording started... Speak now!');
    } catch (error) {
      console.error('Error starting recording:', error);
      toast.error('Failed to start recording. Please check microphone permissions.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      stopListening();
      toast.success('Processing your voice...');
    }
  };

  // Handle voice playback
  const playResponse = () => {
    if (response?.content?.audioResponse?.text) {
      // In a real implementation, this would use TTS to generate audio
      // For now, we'll just show a message
      toast.success('Playing audio response...');
      setIsPlaying(true);
      
      // Simulate audio playback
      setTimeout(() => {
        setIsPlaying(false);
      }, 3000);
    }
  };

  // Handle error display
  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const getButtonState = () => {
    if (isRecording) return 'recording';
    if (isProcessing) return 'processing';
    if (isListening) return 'listening';
    return 'idle';
  };

  const getButtonIcon = () => {
    const state = getButtonState();
    switch (state) {
      case 'recording':
      case 'listening':
        return <MicOff className="w-8 h-8" />;
      case 'processing':
        return <div className="loading" />;
      default:
        return <Mic className="w-8 h-8" />;
    }
  };

  const getButtonText = () => {
    const state = getButtonState();
    switch (state) {
      case 'recording':
        return 'Recording... Tap to stop';
      case 'listening':
        return 'Listening... Tap to stop';
      case 'processing':
        return 'Processing...';
      default:
        return 'Tap to speak';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      {/* Header */}
      <header className="p-4">
        <div className="container mx-auto flex justify-between items-center">
          <motion.button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="punjabi-text">ਵਾਪਸ</span>
          </motion.button>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Wifi className="w-5 h-5 text-green-400" />
              ) : (
                <WifiOff className="w-5 h-5 text-red-400" />
              )}
              <span className="text-sm text-white">
                {isOnline ? 'Online' : 'Offline'}
              </span>
            </div>

            <motion.button
              onClick={() => setShowHistory(!showHistory)}
              className="p-2 text-white hover:text-blue-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <History className="w-6 h-6" />
            </motion.button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="container mx-auto max-w-2xl">
          {/* Welcome Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="punjabi-text">AI ਟਿਊਟਰ</span>
              <br />
              <span className="text-2xl text-blue-200">AI Tutor</span>
            </h1>
            <p className="text-blue-100 text-lg">
              <span className="punjabi-text">ਆਪਣੇ ਪ੍ਰਸ਼ਨ ਪੁੱਛੋ ਅਤੇ ਸਿੱਖੋ</span>
              <br />
              <span className="text-base">Ask your questions and learn</span>
            </p>
          </motion.div>

          {/* Voice Interface */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="card text-center mb-8"
          >
            <div className="mb-6">
              <motion.button
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isProcessing}
                className={`voice-button ${getButtonState()}`}
                whileHover={{ scale: isProcessing ? 1 : 1.05 }}
                whileTap={{ scale: isProcessing ? 1 : 0.95 }}
              >
                {getButtonIcon()}
              </motion.button>
            </div>

            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                <span className="punjabi-text">{getButtonText()}</span>
              </h3>
              <p className="text-gray-600 text-sm">
                <span className="punjabi-text">ਆਪਣੇ ਪ੍ਰਸ਼ਨ ਨੂੰ ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ</span>
                <br />
                <span className="text-xs">Speak your question in Punjabi</span>
              </p>
            </div>

            {/* Transcription Display */}
            {transcription && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-gray-50 rounded-lg p-4 mb-4"
              >
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  <span className="punjabi-text">ਤੁਹਾਡਾ ਪ੍ਰਸ਼ਨ:</span>
                  <span className="text-xs ml-2">Your Question:</span>
                </h4>
                <p className="punjabi-text text-gray-800">{transcription}</p>
              </motion.div>
            )}

            {/* Response Display */}
            {response && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 rounded-lg p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-medium text-gray-700">
                    <span className="punjabi-text">AI ਦਾ ਜਵਾਬ:</span>
                    <span className="text-xs ml-2">AI Response:</span>
                  </h4>
                  <motion.button
                    onClick={playResponse}
                    disabled={isPlaying}
                    className="p-2 text-blue-600 hover:text-blue-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {isPlaying ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                  </motion.button>
                </div>
                
                {response.content && (
                  <div className="text-left">
                    <h5 className="font-semibold text-gray-800 mb-2 punjabi-text">
                      {response.content.title}
                    </h5>
                    <p className="text-gray-700 mb-3 punjabi-text">
                      {response.content.explanation}
                    </p>
                    
                    {response.content.examples && response.content.examples.length > 0 && (
                      <div className="mb-3">
                        <h6 className="text-sm font-medium text-gray-700 mb-2">
                          <span className="punjabi-text">ਉਦਾਹਰਣਾਂ:</span>
                          <span className="text-xs ml-2">Examples:</span>
                        </h6>
                        {response.content.examples.map((example, index) => (
                          <div key={index} className="bg-white rounded p-2 mb-2">
                            <p className="text-sm text-gray-800">
                              <span className="font-medium">{example.problem}</span> = {example.solution}
                            </p>
                            <p className="text-xs text-gray-600 punjabi-text">{example.explanation}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-2 gap-4"
          >
            <motion.button
              onClick={() => navigate('/tutor/action')}
              className="btn btn-secondary flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <BookOpen className="w-5 h-5" />
              <span className="punjabi-text">ਪਾਠ ਦੇਖੋ</span>
            </motion.button>

            <motion.button
              onClick={() => setShowHistory(!showHistory)}
              className="btn btn-secondary flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <History className="w-5 h-5" />
              <span className="punjabi-text">ਇਤਿਹਾਸ</span>
            </motion.button>
          </motion.div>
        </div>
      </main>

      {/* History Sidebar */}
      <AnimatePresence>
        {showHistory && (
          <motion.div
            initial={{ opacity: 0, x: 300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 300 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-y-0 right-0 w-80 bg-white shadow-xl z-50 overflow-y-auto"
          >
            <div className="p-4 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-800">
                  <span className="punjabi-text">ਬਾਤਚੀਤ ਇਤਿਹਾਸ</span>
                  <br />
                  <span className="text-sm text-gray-600">Conversation History</span>
                </h3>
                <button
                  onClick={() => setShowHistory(false)}
                  className="p-2 text-gray-500 hover:text-gray-700"
                >
                  ×
                </button>
              </div>
            </div>

            <div className="p-4">
              {conversationHistory.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  <span className="punjabi-text">ਕੋਈ ਇਤਿਹਾਸ ਨਹੀਂ</span>
                  <br />
                  <span className="text-sm">No history yet</span>
                </p>
              ) : (
                <div className="space-y-4">
                  {conversationHistory.map((conversation) => (
                    <div key={conversation.id} className="bg-gray-50 rounded-lg p-3">
                      <p className="text-sm text-gray-800 punjabi-text mb-2">
                        {conversation.transcription}
                      </p>
                      <p className="text-xs text-gray-600">
                        {new Date(conversation.timestamp).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AITutorInterface;
