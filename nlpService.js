const natural = require('natural');
const compromise = require('compromise');

// Punjabi educational vocabulary and patterns
const PUNJABI_VOCABULARY = {
  // Mathematical terms
  numbers: {
    'ਇੱਕ': 1, 'ਦੋ': 2, 'ਤਿੰਨ': 3, 'ਚਾਰ': 4, 'ਪੰਜ': 5,
    'ਛੇ': 6, 'ਸੱਤ': 7, 'ਅੱਠ': 8, 'ਨੌਂ': 9, 'ਦਸ': 10
  },
  
  // Educational subjects
  subjects: {
    'ਗਣਿਤ': 'mathematics',
    'ਵਿਗਿਆਨ': 'science',
    'ਭੂਗੋਲ': 'geography',
    'ਇਤਿਹਾਸ': 'history',
    'ਪੰਜਾਬੀ': 'punjabi',
    'ਅੰਗਰੇਜ਼ੀ': 'english',
    'ਹਿੰਦੀ': 'hindi',
    'ਸਾਹਿਤ': 'literature',
    'ਕਲਾ': 'art',
    'ਸੰਗੀਤ': 'music'
  },
  
  // Mathematical operations
  operations: {
    'ਜੋੜ': 'addition',
    'ਘਟਾਓ': 'subtraction',
    'ਗੁਣਾ': 'multiplication',
    'ਭਾਗ': 'division',
    'ਵਰਗ': 'square',
    'ਜੜ': 'root'
  },
  
  // Question words
  questions: {
    'ਕੀ': 'what',
    'ਕਿਵੇਂ': 'how',
    'ਕਦੋਂ': 'when',
    'ਕਿੱਥੇ': 'where',
    'ਕਿਉਂ': 'why',
    'ਕੌਣ': 'who'
  },
  
  // Learning-related terms
  learning: {
    'ਸਿੱਖਣਾ': 'learn',
    'ਸਮਝਣਾ': 'understand',
    'ਅਭਿਆਸ': 'practice',
    'ਪ੍ਰਸ਼ਨ': 'question',
    'ਜਵਾਬ': 'answer',
    'ਉਦਾਹਰਣ': 'example',
    'ਸਮੱਸਿਆ': 'problem',
    'ਹੱਲ': 'solution'
  }
};

// Initialize tokenizers and stemmers
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmer;

// Named Entity Recognition for Punjabi educational content
async function recognizeEntities(text, language = 'punjabi') {
  try {
    const entities = {
      subjects: [],
      operations: [],
      numbers: [],
      questions: [],
      learning_terms: [],
      concepts: []
    };
    
    // Tokenize the text
    const tokens = tokenizer.tokenize(text.toLowerCase());
    
    // Extract subjects
    for (const [punjabi, english] of Object.entries(PUNJABI_VOCABULARY.subjects)) {
      if (text.includes(punjabi)) {
        entities.subjects.push({
          punjabi,
          english,
          confidence: 0.9,
          position: text.indexOf(punjabi)
        });
      }
    }
    
    // Extract mathematical operations
    for (const [punjabi, english] of Object.entries(PUNJABI_VOCABULARY.operations)) {
      if (text.includes(punjabi)) {
        entities.operations.push({
          punjabi,
          english,
          confidence: 0.9,
          position: text.indexOf(punjabi)
        });
      }
    }
    
    // Extract numbers
    for (const [punjabi, value] of Object.entries(PUNJABI_VOCABULARY.numbers)) {
      if (text.includes(punjabi)) {
        entities.numbers.push({
          punjabi,
          value,
          confidence: 0.9,
          position: text.indexOf(punjabi)
        });
      }
    }
    
    // Extract question words
    for (const [punjabi, english] of Object.entries(PUNJABI_VOCABULARY.questions)) {
      if (text.includes(punjabi)) {
        entities.questions.push({
          punjabi,
          english,
          confidence: 0.9,
          position: text.indexOf(punjabi)
        });
      }
    }
    
    // Extract learning terms
    for (const [punjabi, english] of Object.entries(PUNJABI_VOCABULARY.learning)) {
      if (text.includes(punjabi)) {
        entities.learning_terms.push({
          punjabi,
          english,
          confidence: 0.9,
          position: text.indexOf(punjabi)
        });
      }
    }
    
    // Extract concepts using pattern matching
    const conceptPatterns = [
      /(\d+)\s*\+\s*(\d+)/g, // Addition pattern
      /(\d+)\s*-\s*(\d+)/g,  // Subtraction pattern
      /(\d+)\s*\*\s*(\d+)/g, // Multiplication pattern
      /(\d+)\s*\/\s*(\d+)/g  // Division pattern
    ];
    
    conceptPatterns.forEach((pattern, index) => {
      const matches = text.match(pattern);
      if (matches) {
        entities.concepts.push({
          type: ['addition', 'subtraction', 'multiplication', 'division'][index],
          matches,
          confidence: 0.8
        });
      }
    });
    
    return entities;
  } catch (error) {
    console.error('Error in entity recognition:', error);
    return {
      subjects: [],
      operations: [],
      numbers: [],
      questions: [],
      learning_terms: [],
      concepts: []
    };
  }
}

// Extract key phrases and topics
function extractKeyPhrases(text, language = 'punjabi') {
  try {
    const phrases = [];
    
    // Common educational phrase patterns
    const phrasePatterns = [
      /ਮੈਂ\s+([^।]+)\s+ਸਿੱਖਣਾ\s+ਚਾਹੁੰਦਾ\s+ਹਾਂ/g,
      /([^।]+)\s+ਕਿਵੇਂ\s+ਕਰਦੇ\s+ਹਨ/g,
      /([^।]+)\s+ਦਾ\s+ਮਤਲਬ\s+ਕੀ\s+ਹੈ/g,
      /([^।]+)\s+ਦੀ\s+ਵਿਆਖਿਆ\s+ਕਰੋ/g
    ];
    
    phrasePatterns.forEach(pattern => {
      const matches = text.match(pattern);
      if (matches) {
        matches.forEach(match => {
          phrases.push({
            phrase: match.trim(),
            confidence: 0.7,
            type: 'educational_query'
          });
        });
      }
    });
    
    return phrases;
  } catch (error) {
    console.error('Error extracting key phrases:', error);
    return [];
  }
}

// Determine learning intent
function determineLearningIntent(text, entities) {
  try {
    const intent = {
      type: 'general',
      confidence: 0.5,
      details: {}
    };
    
    // Check for question intent
    if (entities.questions.length > 0) {
      intent.type = 'question';
      intent.confidence = 0.8;
      intent.details.questionType = entities.questions[0].english;
    }
    
    // Check for learning intent
    if (entities.learning_terms.some(term => term.punjabi === 'ਸਿੱਖਣਾ')) {
      intent.type = 'learning_request';
      intent.confidence = 0.9;
    }
    
    // Check for practice intent
    if (entities.learning_terms.some(term => term.punjabi === 'ਅਭਿਆਸ')) {
      intent.type = 'practice_request';
      intent.confidence = 0.8;
    }
    
    // Check for explanation intent
    if (entities.learning_terms.some(term => term.punjabi === 'ਸਮਝਣਾ')) {
      intent.type = 'explanation_request';
      intent.confidence = 0.8;
    }
    
    return intent;
  } catch (error) {
    console.error('Error determining learning intent:', error);
    return {
      type: 'general',
      confidence: 0.5,
      details: {}
    };
  }
}

// Generate response based on entities and intent
function generateResponseContext(entities, intent) {
  try {
    const context = {
      subject: entities.subjects[0] || null,
      operation: entities.operations[0] || null,
      numbers: entities.numbers,
      intent: intent.type,
      complexity: 'beginner'
    };
    
    // Determine complexity based on numbers and operations
    if (entities.numbers.length > 2 || entities.operations.length > 1) {
      context.complexity = 'intermediate';
    }
    
    if (entities.numbers.some(num => num.value > 100) || entities.operations.length > 2) {
      context.complexity = 'advanced';
    }
    
    return context;
  } catch (error) {
    console.error('Error generating response context:', error);
    return {
      subject: null,
      operation: null,
      numbers: [],
      intent: 'general',
      complexity: 'beginner'
    };
  }
}

// Process Punjabi text for educational content
async function processPunjabiText(text) {
  try {
    const entities = await recognizeEntities(text, 'punjabi');
    const phrases = extractKeyPhrases(text, 'punjabi');
    const intent = determineLearningIntent(text, entities);
    const context = generateResponseContext(entities, intent);
    
    return {
      originalText: text,
      entities,
      phrases,
      intent,
      context,
      language: 'punjabi',
      processedAt: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error processing Punjabi text:', error);
    throw new Error('Failed to process Punjabi text');
  }
}

module.exports = {
  recognizeEntities,
  extractKeyPhrases,
  determineLearningIntent,
  generateResponseContext,
  processPunjabiText
};
