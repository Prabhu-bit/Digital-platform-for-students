import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mic, BookOpen, Users, Globe, Smartphone, Wifi, WifiOff } from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [currentLanguage, setCurrentLanguage] = useState('punjabi');

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

  const handleStartLearning = () => {
    navigate('/tutor');
  };

  const features = [
    {
      icon: <Mic className="w-8 h-8" />,
      title: 'ਵਾਇਸ ਇੰਟਰਐਕਸ਼ਨ',
      titleEn: 'Voice Interaction',
      description: 'ਆਪਣੀ ਆਵਾਜ਼ ਨਾਲ ਸਿੱਖੋ',
      descriptionEn: 'Learn with your voice'
    },
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: 'ਪਰਸਨਲਾਈਜ਼ਡ ਸਿੱਖਿਆ',
      titleEn: 'Personalized Learning',
      description: 'ਤੁਹਾਡੇ ਲਈ ਤਿਆਰ ਕੀਤੇ ਗਏ ਪਾਠ',
      descriptionEn: 'Lessons tailored for you'
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: 'ਆਫਲਾਈਨ ਫਸਟ',
      titleEn: 'Offline First',
      description: 'ਇੰਟਰਨੈੱਟ ਬਿਨਾਂ ਵੀ ਸਿੱਖੋ',
      descriptionEn: 'Learn without internet'
    },
    {
      icon: <Smartphone className="w-8 h-8" />,
      title: 'ਮੋਬਾਈਲ ਫਰੈਂਡਲੀ',
      titleEn: 'Mobile Friendly',
      description: 'ਹਰ ਡਿਵਾਈਸ 'ਤੇ ਕੰਮ ਕਰਦਾ ਹੈ',
      descriptionEn: 'Works on every device'
    }
  ];

  const stats = [
    { number: '1000+', label: 'ਵਿਦਿਆਰਥੀ', labelEn: 'Students' },
    { number: '50+', label: 'ਪਾਠ', labelEn: 'Lessons' },
    { number: '10+', label: 'ਵਿਸ਼ੇ', labelEn: 'Subjects' },
    { number: '24/7', label: 'ਸਹਾਇਤਾ', labelEn: 'Support' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800">
      {/* Header */}
      <header className="p-4">
        <div className="container mx-auto flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white punjabi-text">ਨਭਾ ਸਿੱਖਿਆ-ਏਆਈ</h1>
              <p className="text-sm text-blue-100">Nabha Shiksha-AI</p>
            </div>
          </motion.div>

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
        </div>
      </header>

      {/* Hero Section */}
      <section className="px-4 py-12">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              <span className="punjabi-text">ਆਓ ਸਿੱਖੀਏ</span>
              <br />
              <span className="text-3xl md:text-5xl text-blue-200">Let's Learn Together</span>
            </h1>
            
            <p className="text-lg md:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              <span className="punjabi-text">AI ਦੀ ਮਦਦ ਨਾਲ ਪੰਜਾਬੀ ਵਿੱਚ ਸਿੱਖੋ। ਆਪਣੀ ਆਵਾਜ਼ ਨਾਲ ਪ੍ਰਸ਼ਨ ਪੁੱਛੋ ਅਤੇ ਤੁਰੰਤ ਜਵਾਬ ਪਾਓ।</span>
              <br />
              <span className="text-base">Learn in Punjabi with AI assistance. Ask questions with your voice and get instant answers.</span>
            </p>

            <motion.button
              onClick={handleStartLearning}
              className="btn btn-primary text-lg px-8 py-4 rounded-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Mic className="w-6 h-6 mr-2" />
              <span className="punjabi-text">ਸਿੱਖਣਾ ਸ਼ੁਰੂ ਕਰੋ</span>
              <br />
              <span className="text-sm">Start Learning</span>
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="px-4 py-12 bg-white bg-opacity-10 backdrop-blur-sm">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="punjabi-text">ਵਿਸ਼ੇਸ਼ਤਾਵਾਂ</span>
              <br />
              <span className="text-2xl text-blue-200">Features</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="card text-center"
              >
                <div className="text-indigo-600 mb-4 flex justify-center">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  <span className="punjabi-text">{feature.title}</span>
                  <br />
                  <span className="text-sm text-gray-600">{feature.titleEn}</span>
                </h3>
                <p className="text-gray-600 text-sm">
                  <span className="punjabi-text">{feature.description}</span>
                  <br />
                  <span className="text-xs">{feature.descriptionEn}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-4 py-12">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {stat.number}
                </div>
                <div className="text-blue-200">
                  <span className="punjabi-text">{stat.label}</span>
                  <br />
                  <span className="text-sm">{stat.labelEn}</span>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="px-4 py-12 bg-white bg-opacity-10 backdrop-blur-sm">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              <span className="punjabi-text">ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ</span>
              <br />
              <span className="text-2xl text-blue-200">How It Works</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: '1',
                title: 'ਆਵਾਜ਼ ਰਿਕਾਰਡ ਕਰੋ',
                titleEn: 'Record Your Voice',
                description: 'ਆਪਣੇ ਪ੍ਰਸ਼ਨ ਨੂੰ ਪੰਜਾਬੀ ਵਿੱਚ ਬੋਲੋ',
                descriptionEn: 'Speak your question in Punjabi'
              },
              {
                step: '2',
                title: 'AI ਪ੍ਰੋਸੈਸ ਕਰਦਾ ਹੈ',
                titleEn: 'AI Processes',
                description: 'AI ਤੁਹਾਡੇ ਪ੍ਰਸ਼ਨ ਨੂੰ ਸਮਝਦਾ ਹੈ',
                descriptionEn: 'AI understands your question'
              },
              {
                step: '3',
                title: 'ਜਵਾਬ ਪ੍ਰਾਪਤ ਕਰੋ',
                titleEn: 'Get Answer',
                description: 'ਤੁਰੰਤ ਜਵਾਬ ਅਤੇ ਸਿੱਖਿਆ ਪ੍ਰਾਪਤ ਕਰੋ',
                descriptionEn: 'Get instant answer and learning'
              }
            ].map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center text-2xl font-bold text-indigo-600 mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  <span className="punjabi-text">{step.title}</span>
                  <br />
                  <span className="text-lg text-blue-200">{step.titleEn}</span>
                </h3>
                <p className="text-blue-100">
                  <span className="punjabi-text">{step.description}</span>
                  <br />
                  <span className="text-sm">{step.descriptionEn}</span>
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-8 bg-black bg-opacity-20">
        <div className="container mx-auto text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <h3 className="text-2xl font-bold text-white mb-4">
              <span className="punjabi-text">ਨਭਾ ਸਿੱਖਿਆ-ਏਆਈ</span>
              <br />
              <span className="text-lg text-blue-200">Nabha Shiksha-AI</span>
            </h3>
            <p className="text-blue-100 mb-4">
              <span className="punjabi-text">ਪੇਂਡੂ ਵਿਦਿਆਰਥੀਆਂ ਲਈ AI-ਆਧਾਰਿਤ ਡਿਜੀਟਲ ਸਿੱਖਿਆ ਪਲੇਟਫਾਰਮ</span>
              <br />
              <span className="text-sm">AI-powered digital learning platform for rural students</span>
            </p>
            <div className="flex justify-center gap-4 text-sm text-blue-200">
              <span>© 2024 Nabha Shiksha-AI</span>
              <span>•</span>
              <span>Made with ❤️ for Education</span>
            </div>
          </motion.div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
