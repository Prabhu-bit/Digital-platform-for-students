const express = require('express');
const router = express.Router();
const { generateContent } = require('../services/aiService');

// Get available topics
router.get('/topics', (req, res) => {
  const topics = [
    {
      id: 'addition',
      name: 'ਜੋੜ',
      nameEn: 'Addition',
      description: 'Basic addition operations',
      level: 'beginner',
      estimatedTime: 15
    },
    {
      id: 'subtraction',
      name: 'ਘਟਾਓ',
      nameEn: 'Subtraction',
      description: 'Basic subtraction operations',
      level: 'beginner',
      estimatedTime: 15
    },
    {
      id: 'multiplication',
      name: 'ਗੁਣਾ',
      nameEn: 'Multiplication',
      description: 'Multiplication tables and operations',
      level: 'intermediate',
      estimatedTime: 20
    },
    {
      id: 'division',
      name: 'ਭਾਗ',
      nameEn: 'Division',
      description: 'Division operations and remainders',
      level: 'intermediate',
      estimatedTime: 20
    },
    {
      id: 'fractions',
      name: 'ਭਿੰਨਾਂ',
      nameEn: 'Fractions',
      description: 'Understanding and working with fractions',
      level: 'advanced',
      estimatedTime: 25
    },
    {
      id: 'geometry',
      name: 'ਜਿਓਮੈਟਰੀ',
      nameEn: 'Geometry',
      description: 'Basic geometric shapes and concepts',
      level: 'intermediate',
      estimatedTime: 20
    }
  ];

  res.json({
    success: true,
    data: topics,
    timestamp: new Date().toISOString()
  });
});

// Get available levels
router.get('/levels', (req, res) => {
  const levels = [
    {
      id: 'beginner',
      name: 'ਸ਼ੁਰੂਆਤੀ',
      nameEn: 'Beginner',
      description: 'Basic concepts and simple problems',
      color: '#10B981'
    },
    {
      id: 'intermediate',
      name: 'ਮੱਧਮ',
      nameEn: 'Intermediate',
      description: 'Moderate complexity problems',
      color: '#F59E0B'
    },
    {
      id: 'advanced',
      name: 'ਉੱਚ',
      nameEn: 'Advanced',
      description: 'Complex problems and advanced concepts',
      color: '#EF4444'
    }
  ];

  res.json({
    success: true,
    data: levels,
    timestamp: new Date().toISOString()
  });
});

// Generate lesson content
router.post('/lesson', async (req, res) => {
  try {
    const { topic, level, language = 'punjabi', studentProfile } = req.body;
    
    if (!topic) {
      return res.status(400).json({ 
        error: 'No topic provided',
        message: 'Please provide a topic for the lesson'
      });
    }

    const content = await generateContent(topic, language, null, null, {
      level: level || 'beginner',
      studentProfile: studentProfile || {}
    });
    
    res.json({
      success: true,
      data: content,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Lesson generation error:', error);
    res.status(500).json({ 
      error: 'Failed to generate lesson content',
      message: error.message
    });
  }
});

// Get lesson by ID
router.get('/lesson/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { level = 'beginner', language = 'punjabi' } = req.query;
    
    // In a real implementation, this would fetch from a database
    // For now, we'll generate content based on the ID
    const topicMap = {
      'addition': 'ਜੋੜ',
      'subtraction': 'ਘਟਾਓ',
      'multiplication': 'ਗੁਣਾ',
      'division': 'ਭਾਗ',
      'fractions': 'ਭਿੰਨਾਂ',
      'geometry': 'ਜਿਓਮੈਟਰੀ'
    };
    
    const topic = topicMap[id];
    if (!topic) {
      return res.status(404).json({ 
        error: 'Topic not found',
        message: 'The requested topic does not exist'
      });
    }
    
    const content = await generateContent(topic, language, null, null, {
      level,
      studentProfile: {}
    });
    
    res.json({
      success: true,
      data: {
        id,
        topic,
        level,
        language,
        content,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Lesson fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch lesson',
      message: error.message
    });
  }
});

// Search content
router.get('/search', async (req, res) => {
  try {
    const { q, level, language = 'punjabi' } = req.query;
    
    if (!q) {
      return res.status(400).json({ 
        error: 'No search query provided',
        message: 'Please provide a search query'
      });
    }
    
    // In a real implementation, this would search through a database
    // For now, we'll return a simple response
    const searchResults = [
      {
        id: 'addition',
        title: 'ਜੋੜ ਦੀ ਸਿੱਖਿਆ',
        description: 'Basic addition operations in Punjabi',
        level: 'beginner',
        relevance: 0.9
      },
      {
        id: 'subtraction',
        title: 'ਘਟਾਓ ਦੀ ਸਿੱਖਿਆ',
        description: 'Basic subtraction operations in Punjabi',
        level: 'beginner',
        relevance: 0.8
      }
    ];
    
    res.json({
      success: true,
      data: {
        query: q,
        results: searchResults,
        total: searchResults.length
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Failed to search content',
      message: error.message
    });
  }
});

// Get user progress
router.get('/progress/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    // In a real implementation, this would fetch from a database
    const progress = {
      userId,
      completedLessons: 5,
      totalLessons: 20,
      currentStreak: 3,
      totalTimeSpent: 120, // minutes
      achievements: [
        {
          id: 'first_lesson',
          name: 'First Lesson',
          description: 'Completed your first lesson',
          earnedAt: new Date().toISOString()
        }
      ],
      lastActivity: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: progress,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Progress fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch progress',
      message: error.message
    });
  }
});

// Update user progress
router.post('/progress/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { lessonId, completed, timeSpent, score } = req.body;
    
    // In a real implementation, this would update the database
    const progress = {
      userId,
      lessonId,
      completed,
      timeSpent,
      score,
      updatedAt: new Date().toISOString()
    };
    
    res.json({
      success: true,
      data: progress,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Progress update error:', error);
    res.status(500).json({ 
      error: 'Failed to update progress',
      message: error.message
    });
  }
});

module.exports = router;
