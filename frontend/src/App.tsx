import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import ArticlesPage from './pages/ArticlesPage';
import ArticleDetailPage from './pages/ArticleDetailPage';
import SubmitArticlePage from './pages/SubmitArticlePage';
import AboutPage from './pages/AboutPage';
import NotFoundPage from './pages/NotFoundPage';
import ProfilePage from './pages/ProfilePage';
import TestingModePanel from './components/TestingModePanel';
import TestingModeBanner from './components/TestingModeBanner';
import { BlockchainProvider } from './contexts/BlockchainContext';
import './App.css';

// Check if we're in testing mode
const IS_TESTING_MODE = process.env.REACT_APP_TESTING_MODE === 'true' || !process.env.REACT_APP_CONTRACT_ADDRESS;

function App() {
  return (
    <BlockchainProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          {IS_TESTING_MODE && <TestingModeBanner />}
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/home" element={<HomePage />} />
              <Route path="/articles" element={<ArticlesPage />} />
              <Route path="/articles/:id" element={<ArticleDetailPage />} />
              <Route path="/submit" element={<SubmitArticlePage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          {IS_TESTING_MODE && <TestingModePanel />}
        </div>
      </Router>
    </BlockchainProvider>
  );
}

export default App;
