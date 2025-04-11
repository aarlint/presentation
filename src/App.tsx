import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import PresentationsPage from './pages/PresentationsPage';
import { ThemeProvider } from './context/ThemeContext';
import './styles/App.css';
import './styles/neoglass.css';

function App() {
  return (
    <ThemeProvider>
      <div className="app-container">
        <Header />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/presentations" element={<PresentationsPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </ThemeProvider>
  );
}

export default App;