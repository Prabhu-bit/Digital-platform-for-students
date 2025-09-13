const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');

// Mock user database (in production, use a real database)
const users = new Map();

// Create a new user
router.post('/register', (req, res) => {
  try {
    const { name, email, language = 'punjabi', level = 'beginner' } = req.body;
    
    if (!name || !email) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        message: 'Name and email are required'
      });
    }
    
    // Check if user already exists
    const existingUser = Array.from(users.values()).find(user => user.email === email);
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists',
        message: 'A user with this email already exists'
      });
    }
    
    const userId = uuidv4();
    const user = {
      id: userId,
      name,
      email,
      language,
      level,
      preferences: {
        voiceEnabled: true,
        audioEnabled: true,
        offlineMode: true
      },
      progress: {
        completedLessons: 0,
        totalTimeSpent: 0,
        currentStreak: 0,
        achievements: []
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    users.set(userId, user);
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          language: user.language,
          level: user.level,
          preferences: user.preferences
        },
        token: `mock-token-${userId}` // In production, use JWT
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User registration error:', error);
    res.status(500).json({ 
      error: 'Failed to register user',
      message: error.message
    });
  }
});

// Get user profile
router.get('/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }
    
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        language: user.language,
        level: user.level,
        preferences: user.preferences,
        progress: user.progress,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User profile fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user profile',
      message: error.message
    });
  }
});

// Update user profile
router.put('/profile/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { name, language, level, preferences } = req.body;
    
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }
    
    // Update user data
    if (name) user.name = name;
    if (language) user.language = language;
    if (level) user.level = level;
    if (preferences) user.preferences = { ...user.preferences, ...preferences };
    
    user.updatedAt = new Date().toISOString();
    users.set(userId, user);
    
    res.json({
      success: true,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        language: user.language,
        level: user.level,
        preferences: user.preferences,
        progress: user.progress,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      },
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User profile update error:', error);
    res.status(500).json({ 
      error: 'Failed to update user profile',
      message: error.message
    });
  }
});

// Get user progress
router.get('/progress/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }
    
    res.json({
      success: true,
      data: user.progress,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User progress fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user progress',
      message: error.message
    });
  }
});

// Update user progress
router.post('/progress/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { lessonId, completed, timeSpent, score, achievements } = req.body;
    
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }
    
    // Update progress
    if (completed) {
      user.progress.completedLessons += 1;
    }
    if (timeSpent) {
      user.progress.totalTimeSpent += timeSpent;
    }
    if (achievements && achievements.length > 0) {
      user.progress.achievements.push(...achievements);
    }
    
    user.updatedAt = new Date().toISOString();
    users.set(userId, user);
    
    res.json({
      success: true,
      data: user.progress,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User progress update error:', error);
    res.status(500).json({ 
      error: 'Failed to update user progress',
      message: error.message
    });
  }
});

// Get user settings
router.get('/settings/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }
    
    res.json({
      success: true,
      data: user.preferences,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User settings fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch user settings',
      message: error.message
    });
  }
});

// Update user settings
router.put('/settings/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    const { voiceEnabled, audioEnabled, offlineMode, language, level } = req.body;
    
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }
    
    // Update settings
    if (voiceEnabled !== undefined) user.preferences.voiceEnabled = voiceEnabled;
    if (audioEnabled !== undefined) user.preferences.audioEnabled = audioEnabled;
    if (offlineMode !== undefined) user.preferences.offlineMode = offlineMode;
    if (language) user.language = language;
    if (level) user.level = level;
    
    user.updatedAt = new Date().toISOString();
    users.set(userId, user);
    
    res.json({
      success: true,
      data: user.preferences,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User settings update error:', error);
    res.status(500).json({ 
      error: 'Failed to update user settings',
      message: error.message
    });
  }
});

// Delete user account
router.delete('/account/:userId', (req, res) => {
  try {
    const { userId } = req.params;
    
    const user = users.get(userId);
    if (!user) {
      return res.status(404).json({ 
        error: 'User not found',
        message: 'The requested user does not exist'
      });
    }
    
    users.delete(userId);
    
    res.json({
      success: true,
      message: 'User account deleted successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('User account deletion error:', error);
    res.status(500).json({ 
      error: 'Failed to delete user account',
      message: error.message
    });
  }
});

// Get all users (admin only - in production, add authentication)
router.get('/all', (req, res) => {
  try {
    const allUsers = Array.from(users.values()).map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      language: user.language,
      level: user.level,
      createdAt: user.createdAt,
      lastActivity: user.updatedAt
    }));
    
    res.json({
      success: true,
      data: allUsers,
      total: allUsers.length,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Users fetch error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch users',
      message: error.message
    });
  }
});

module.exports = router;
