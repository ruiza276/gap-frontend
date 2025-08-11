import React from 'react';
import './App.css';
import Header from './components/Header';
import ContentDisplay from './components/ContentDisplay';
import ContactSection from './components/ContactSection';
import Footer from './components/Footer';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="App">
        <Header />
        <main>
          <ContentDisplay />
          <ContactSection />
        </main>
        <Footer />
      </div>
    </ErrorBoundary>
  );
}

export default App;