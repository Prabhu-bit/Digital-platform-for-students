const express = require('express');
const router = express.Router();
const multer = require('multer');
const { processVoiceQuery, generateContent, analyzeSentiment } = require('../services/aiService');
const { recognizeEntities } = require('../services/nlpService');

// Configure multer for audio file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'), false);
    }
  }
});

// Process voice query endpoint
router.post('/voice-query', upload.single('audio'), async (req, res) => {
  try {
    const { audio } = req.body;
    const audioBuffer = req.file ? req.file.buffer : null;
    
    if (!audioBuffer && !audio) {
      return res.status(400).json({ 
        error: 'No audio data provided',
        message: 'Please provide audio data for processing'
      });
    }

    // Process the voice query
    const result = await processVoiceQuery(audioBuffer || audio);
    
    res.json({
      success: true,
      data: result,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Voice query processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process voice query',
      message: error.message
    });
  }
});

// Text query endpoint (for testing and fallback)
router.post('/text-query', async (req, res) => {
  try {
    const { query, language = 'punjabi' } = req.body;
    
    if (!query) {
      return res.status(400).json({ 
        error: 'No query provided',
        message: 'Please provide a text query'
      });
    }

    // Process text query
    const entities = await recognizeEntities(query, language);
    const sentiment = await analyzeSentiment(query, language);
    const content = await generateContent(query, language, entities, sentiment);
    
    res.json({
      success: true,
      data: {
        query,
        language,
        entities,
        sentiment,
        content,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    console.error('Text query processing error:', error);
    res.status(500).json({ 
      error: 'Failed to process text query',
      message: error.message
    });
  }
});

// Generate personalized content
router.post('/generate-content', async (req, res) => {
  try {
    const { topic, level, language = 'punjabi', studentProfile } = req.body;
    
    if (!topic) {
      return res.status(400).json({ 
        error: 'No topic provided',
        message: 'Please provide a topic for content generation'
      });
    }

    const content = await generateContent(topic, language, null, null, {
      level,
      studentProfile
    });
    
    res.json({
      success: true,
      data: content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Content generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate content',
      message: error.message
    });
  }
});

// Analyze sentiment
router.post('/analyze-sentiment', async (req, res) => {
  try {
    const { text, language = 'punjabi' } = req.body;
    
    if (!text) {
      return res.status(400).json({ 
        error: 'No text provided',
        message: 'Please provide text for sentiment analysis'
      });
    }

    const sentiment = await analyzeSentiment(text, language);
    
    res.json({
      success: true,
      data: sentiment,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Sentiment analysis error:', error);
    res.status(500).json({ 
      error: 'Failed to analyze sentiment',
      message: error.message
    });
  }
});

// Health check for AI services
router.get('/status', (req, res) => {
  res.json({
    status: 'OK',
    services: {
      speechRecognition: 'Available',
      nlp: 'Available',
      contentGeneration: 'Available',
      sentimentAnalysis: 'Available'
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
