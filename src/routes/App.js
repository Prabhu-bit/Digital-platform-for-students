import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

// Components
import LandingPage from './components/LandingPage';
import AITutorInterface from './components/AITutorInterface';
import AITutorAction from './components/AITutorAction';

// Context
import { AIProvider } from './context/AIContext';

function App() {
  return (
    <AIProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/tutor" element={<AITutorInterface />} />
            <Route path="/tutor/action" element={<AITutorAction />} />
          </Routes>
          <Toaster
            position="top-center"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
                fontFamily: 'Noto Sans Gurmukhi, sans-serif',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#10B981',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#EF4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </div>
      </Router>
    </AIProvider>
  );
}

export default App;
