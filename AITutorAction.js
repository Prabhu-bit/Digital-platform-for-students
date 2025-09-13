import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Play, Pause, RotateCcw, Volume2, VolumeX, CheckCircle, XCircle } from 'lucide-react';
import { useAI } from '../context/AIContext';
import toast from 'react-hot-toast';

const AITutorAction = () => {
  const navigate = useNavigate();
  const { generateContent, isLoading, error } = useAI();
  
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState('');

  const topics = [
    { id: 'addition', name: 'ਜੋੜ', nameEn: 'Addition', level: 'beginner' },
    { id: 'subtraction', name: 'ਘਟਾਓ', nameEn: 'Subtraction', level: 'beginner' },
    { id: 'multiplication', name: 'ਗੁਣਾ', nameEn: 'Multiplication', level: 'intermediate' },
    { id: 'division', name: 'ਭਾਗ', nameEn: 'Division', level: 'intermediate' },
    { id: 'fractions', name: 'ਭਿੰਨਾਂ', nameEn: 'Fractions', level: 'advanced' },
    { id: 'geometry', name: 'ਜਿਓਮੈਟਰੀ', nameEn: 'Geometry', level: 'intermediate' }
  ];

  const levels = [
    { id: 'beginner', name: 'ਸ਼ੁਰੂਆਤੀ', nameEn: 'Beginner' },
    { id: 'intermediate', name: 'ਮੱਧਮ', nameEn: 'Intermediate' },
    { id: 'advanced', name: 'ਉੱਚ', nameEn: 'Advanced' }
  ];

  const [selectedLevel, setSelectedLevel] = useState('beginner');

  // Load lesson when topic is selected
  const loadLesson = async (topicId, level) => {
    try {
      const topic = topics.find(t => t.id === topicId);
      if (!topic) return;

      const content = await generateContent(topic.name, level, 'punjabi');
      if (content) {
        setCurrentLesson({
          ...content,
          topic: topic.name,
          topicEn: topic.nameEn,
          level: level
        });
        setCurrentStep(0);
        setUserAnswers({});
        setShowResults(false);
        toast.success('Lesson loaded successfully!');
      }
    } catch (error) {
      console.error('Error loading lesson:', error);
      toast.error('Failed to load lesson');
    }
  };

  // Handle topic selection
  const handleTopicSelect = (topicId) => {
    setSelectedTopic(topicId);
    loadLesson(topicId, selectedLevel);
  };

  // Handle level change
  const handleLevelChange = (level) => {
    setSelectedLevel(level);
    if (selectedTopic) {
      loadLesson(selectedTopic, level);
    }
  };

  // Handle exercise answer
  const handleAnswerSelect = (exerciseIndex, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [exerciseIndex]: answerIndex
    }));
  };

  // Check answers
  const checkAnswers = () => {
    if (!currentLesson?.exercises) return;

    let correct = 0;
    const total = currentLesson.exercises.length;

    currentLesson.exercises.forEach((exercise, index) => {
      if (userAnswers[index] === exercise.correct) {
        correct++;
      }
    });

    setShowResults(true);
    toast.success(`You got ${correct} out of ${total} correct!`);
  };

  // Reset lesson
  const resetLesson = () => {
    setCurrentStep(0);
    setUserAnswers({});
    setShowResults(false);
  };

  // Play audio response
  const playAudio = () => {
    setIsPlaying(true);
    // Simulate audio playback
    setTimeout(() => {
      setIsPlaying(false);
    }, 3000);
  };

  const getStepContent = () => {
    if (!currentLesson) return null;

    switch (currentStep) {
      case 0:
        return (
          <div className="text-center">
            <h3 className="text-2xl font-bold text-gray-800 mb-4 punjabi-text">
              {currentLesson.title}
            </h3>
            <p className="text-gray-600 mb-6 punjabi-text">
              {currentLesson.explanation}
            </p>
            <div className="flex justify-center gap-4">
              <motion.button
                onClick={playAudio}
                disabled={isPlaying}
                className="btn btn-primary flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isPlaying ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                <span className="punjabi-text">ਸੁਣੋ</span>
              </motion.button>
              <motion.button
                onClick={() => setCurrentStep(1)}
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="punjabi-text">ਅਗਲਾ</span>
              </motion.button>
            </div>
          </div>
        );

      case 1:
        return (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 punjabi-text">
              ਉਦਾਹਰਣਾਂ
            </h3>
            <div className="space-y-4">
              {currentLesson.examples?.map((example, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-lg">{example.problem}</span>
                    <span className="text-2xl font-bold text-indigo-600">= {example.solution}</span>
                  </div>
                  <p className="text-gray-600 punjabi-text">{example.explanation}</p>
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <motion.button
                onClick={() => setCurrentStep(0)}
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="punjabi-text">ਪਿਛਲਾ</span>
              </motion.button>
              <motion.button
                onClick={() => setCurrentStep(2)}
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="punjabi-text">ਅਭਿਆਸ ਕਰੋ</span>
              </motion.button>
            </div>
          </div>
        );

      case 2:
        return (
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-4 punjabi-text">
              ਅਭਿਆਸ
            </h3>
            <div className="space-y-4">
              {currentLesson.exercises?.map((exercise, index) => (
                <div key={index} className="bg-gray-50 rounded-lg p-4">
                  <div className="mb-3">
                    <span className="font-medium text-lg">{exercise.problem}</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {exercise.options.map((option, optionIndex) => (
                      <motion.button
                        key={optionIndex}
                        onClick={() => handleAnswerSelect(index, optionIndex)}
                        className={`p-3 rounded-lg border-2 transition-colors ${
                          userAnswers[index] === optionIndex
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-gray-300 hover:border-gray-400'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        {option}
                      </motion.button>
                    ))}
                  </div>
                  {showResults && (
                    <div className="mt-2 flex items-center gap-2">
                      {userAnswers[index] === exercise.correct ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <span className="text-sm text-gray-600">
                        {userAnswers[index] === exercise.correct ? 'Correct!' : 'Incorrect'}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-center gap-4 mt-6">
              <motion.button
                onClick={() => setCurrentStep(1)}
                className="btn btn-secondary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="punjabi-text">ਪਿਛਲਾ</span>
              </motion.button>
              <motion.button
                onClick={checkAnswers}
                className="btn btn-primary"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="punjabi-text">ਜਵਾਬ ਚੈਕ ਕਰੋ</span>
              </motion.button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      {/* Header */}
      <header className="p-4">
        <div className="container mx-auto flex justify-between items-center">
          <motion.button
            onClick={() => navigate('/tutor')}
            className="flex items-center gap-2 text-white hover:text-blue-200 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <ArrowLeft className="w-6 h-6" />
            <span className="punjabi-text">ਵਾਪਸ</span>
          </motion.button>

          <div className="flex items-center gap-4">
            <div className="text-white">
              <span className="punjabi-text">ਪਾਠ</span>
              <br />
              <span className="text-sm">Lesson</span>
            </div>
            {currentLesson && (
              <motion.button
                onClick={resetLesson}
                className="p-2 text-white hover:text-blue-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RotateCcw className="w-5 h-5" />
              </motion.button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="px-4 py-8">
        <div className="container mx-auto max-w-4xl">
          {!currentLesson ? (
            // Topic Selection
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="text-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                  <span className="punjabi-text">ਪਾਠ ਚੁਣੋ</span>
                  <br />
                  <span className="text-2xl text-blue-200">Choose a Lesson</span>
                </h1>
              </div>

              {/* Level Selection */}
              <div className="card mb-8">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  <span className="punjabi-text">ਪੱਧਰ ਚੁਣੋ</span>
                  <br />
                  <span className="text-sm text-gray-600">Choose Level</span>
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  {levels.map((level) => (
                    <motion.button
                      key={level.id}
                      onClick={() => handleLevelChange(level.id)}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        selectedLevel === level.id
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="punjabi-text font-medium">{level.name}</div>
                      <div className="text-sm text-gray-600">{level.nameEn}</div>
                    </motion.button>
                  ))}
                </div>
              </div>

              {/* Topic Selection */}
              <div className="card">
                <h3 className="text-lg font-semibold text-gray-800 mb-4 text-center">
                  <span className="punjabi-text">ਵਿਸ਼ਾ ਚੁਣੋ</span>
                  <br />
                  <span className="text-sm text-gray-600">Choose Topic</span>
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {topics.map((topic) => (
                    <motion.button
                      key={topic.id}
                      onClick={() => handleTopicSelect(topic.id)}
                      className="p-4 rounded-lg border-2 border-gray-300 hover:border-indigo-500 hover:bg-indigo-50 transition-colors text-center"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <BookOpen className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
                      <div className="punjabi-text font-medium">{topic.name}</div>
                      <div className="text-sm text-gray-600">{topic.nameEn}</div>
                      <div className="text-xs text-gray-500 mt-1">{topic.level}</div>
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            // Lesson Content
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-white punjabi-text">
                    {currentStep === 0 && 'ਸਮਝਾਓ'}
                    {currentStep === 1 && 'ਉਦਾਹਰਣਾਂ'}
                    {currentStep === 2 && 'ਅਭਿਆਸ'}
                  </span>
                  <span className="text-white text-sm">
                    {currentStep + 1} / 3
                  </span>
                </div>
                <div className="w-full bg-gray-300 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / 3) * 100}%` }}
                  />
                </div>
              </div>

              {/* Lesson Content */}
              <div className="card">
                {getStepContent()}
              </div>

              {/* Lesson Info */}
              <div className="mt-4 text-center text-white">
                <p className="punjabi-text">
                  <span className="font-medium">{currentLesson.topic}</span> - 
                  <span className="text-sm ml-2">{currentLesson.topicEn}</span>
                </p>
                <p className="text-sm text-blue-200">
                  Level: {currentLesson.level} | 
                  Estimated Time: {currentLesson.estimatedTime} minutes
                </p>
              </div>
            </motion.div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AITutorAction;
