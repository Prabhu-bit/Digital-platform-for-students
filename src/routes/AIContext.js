import React, { createContext, useContext, useReducer, useEffect } from 'react';
import axios from 'axios';

// AI Context for managing AI interactions and state
const AIContext = createContext();

// Action types
const AI_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_TRANSCRIPTION: 'SET_TRANSCRIPTION',
  SET_RESPONSE: 'SET_RESPONSE',
  SET_LISTENING: 'SET_LISTENING',
  SET_PROCESSING: 'SET_PROCESSING',
  CLEAR_ERROR: 'CLEAR_ERROR',
  RESET_STATE: 'RESET_STATE'
};

// Initial state
const initialState = {
  isLoading: false,
  isListening: false,
  isProcessing: false,
  error: null,
  transcription: '',
  response: null,
  conversationHistory: [],
  offlineMode: false
};

// Reducer function
function aiReducer(state, action) {
  switch (action.type) {
    case AI_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
        error: null
      };
    
    case AI_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        isLoading: false,
        isListening: false,
        isProcessing: false
      };
    
    case AI_ACTIONS.SET_TRANSCRIPTION:
      return {
        ...state,
        transcription: action.payload,
        isListening: false
      };
    
    case AI_ACTIONS.SET_RESPONSE:
      return {
        ...state,
        response: action.payload,
        isProcessing: false,
        conversationHistory: [
          ...state.conversationHistory,
          {
            id: Date.now(),
            timestamp: new Date().toISOString(),
            transcription: state.transcription,
            response: action.payload
          }
        ]
      };
    
    case AI_ACTIONS.SET_LISTENING:
      return {
        ...state,
        isListening: action.payload,
        error: null
      };
    
    case AI_ACTIONS.SET_PROCESSING:
      return {
        ...state,
        isProcessing: action.payload,
        isListening: false
      };
    
    case AI_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };
    
    case AI_ACTIONS.RESET_STATE:
      return {
        ...initialState,
        conversationHistory: state.conversationHistory
      };
    
    default:
      return state;
  }
}

// AI Provider component
export function AIProvider({ children }) {
  const [state, dispatch] = useReducer(aiReducer, initialState);

  // Check online status
  useEffect(() => {
    const handleOnlineStatus = () => {
      dispatch({
        type: AI_ACTIONS.SET_LOADING,
        payload: false
      });
    };

    const handleOfflineStatus = () => {
      dispatch({
        type: AI_ACTIONS.SET_ERROR,
        payload: 'You are offline. Some features may not be available.'
      });
    };

    window.addEventListener('online', handleOnlineStatus);
    window.addEventListener('offline', handleOfflineStatus);

    return () => {
      window.removeEventListener('online', handleOnlineStatus);
      window.removeEventListener('offline', handleOfflineStatus);
    };
  }, []);

  // Process voice query
  const processVoiceQuery = async (audioBlob) => {
    try {
      dispatch({ type: AI_ACTIONS.SET_PROCESSING, payload: true });
      dispatch({ type: AI_ACTIONS.CLEAR_ERROR });

      const formData = new FormData();
      formData.append('audio', audioBlob, 'voice-query.webm');

      const response = await axios.post('/api/ai/voice-query', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000 // 30 second timeout
      });

      if (response.data.success) {
        dispatch({ type: AI_ACTIONS.SET_TRANSCRIPTION, payload: response.data.data.transcription });
        dispatch({ type: AI_ACTIONS.SET_RESPONSE, payload: response.data.data });
      } else {
        throw new Error(response.data.message || 'Failed to process voice query');
      }
    } catch (error) {
      console.error('Voice query error:', error);
      dispatch({
        type: AI_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || error.message || 'Failed to process voice query'
      });
    }
  };

  // Process text query
  const processTextQuery = async (query, language = 'punjabi') => {
    try {
      dispatch({ type: AI_ACTIONS.SET_PROCESSING, payload: true });
      dispatch({ type: AI_ACTIONS.CLEAR_ERROR });

      const response = await axios.post('/api/ai/text-query', {
        query,
        language
      });

      if (response.data.success) {
        dispatch({ type: AI_ACTIONS.SET_TRANSCRIPTION, payload: query });
        dispatch({ type: AI_ACTIONS.SET_RESPONSE, payload: response.data.data });
      } else {
        throw new Error(response.data.message || 'Failed to process text query');
      }
    } catch (error) {
      console.error('Text query error:', error);
      dispatch({
        type: AI_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || error.message || 'Failed to process text query'
      });
    }
  };

  // Start listening
  const startListening = () => {
    dispatch({ type: AI_ACTIONS.SET_LISTENING, payload: true });
    dispatch({ type: AI_ACTIONS.CLEAR_ERROR });
  };

  // Stop listening
  const stopListening = () => {
    dispatch({ type: AI_ACTIONS.SET_LISTENING, payload: false });
  };

  // Clear error
  const clearError = () => {
    dispatch({ type: AI_ACTIONS.CLEAR_ERROR });
  };

  // Reset state
  const resetState = () => {
    dispatch({ type: AI_ACTIONS.RESET_STATE });
  };

  // Generate content
  const generateContent = async (topic, level = 'beginner', language = 'punjabi') => {
    try {
      dispatch({ type: AI_ACTIONS.SET_LOADING, payload: true });
      dispatch({ type: AI_ACTIONS.CLEAR_ERROR });

      const response = await axios.post('/api/ai/generate-content', {
        topic,
        level,
        language,
        studentProfile: {
          preferredLanguage: language,
          learningLevel: level,
          interests: []
        }
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to generate content');
      }
    } catch (error) {
      console.error('Content generation error:', error);
      dispatch({
        type: AI_ACTIONS.SET_ERROR,
        payload: error.response?.data?.message || error.message || 'Failed to generate content'
      });
      return null;
    } finally {
      dispatch({ type: AI_ACTIONS.SET_LOADING, payload: false });
    }
  };

  // Analyze sentiment
  const analyzeSentiment = async (text, language = 'punjabi') => {
    try {
      const response = await axios.post('/api/ai/analyze-sentiment', {
        text,
        language
      });

      if (response.data.success) {
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to analyze sentiment');
      }
    } catch (error) {
      console.error('Sentiment analysis error:', error);
      return null;
    }
  };

  const value = {
    ...state,
    processVoiceQuery,
    processTextQuery,
    startListening,
    stopListening,
    clearError,
    resetState,
    generateContent,
    analyzeSentiment
  };

  return (
    <AIContext.Provider value={value}>
      {children}
    </AIContext.Provider>
  );
}

// Custom hook to use AI context
export function useAI() {
  const context = useContext(AIContext);
  if (!context) {
    throw new Error('useAI must be used within an AIProvider');
  }
  return context;
}

export default AIContext;
