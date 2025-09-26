
import React, { useState, useCallback } from 'react';
import Header, { PageView } from './components/Header';
import LandingPage from './components/LandingPage'; 
import EsgExtractorV1Page from './components/EsgExtractorV1Page';
import EsgExtractorV2Page from './components/EsgExtractorV2Page';
import EsgExtractorBankingPage from './components/EsgExtractorBankingPage';
import EsgExtractorApparelPage from './components/EsgExtractorApparelPage';
import EsgExtractorWastePage from './components/EsgExtractorWastePage'; 
import MethodologyPage from './components/MethodologyPage'; // New import
import TechnicalDocumentationPage from './components/TechnicalDocumentationPage'; 

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageView>('landing'); 

  const handleNavigate = useCallback((page: PageView) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); 
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-800 dark:text-slate-200">
      <Header currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-grow w-full"> 
        {currentPage === 'landing' && <LandingPage onNavigate={handleNavigate} />}
        
        {currentPage === 'v1' && <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl"><EsgExtractorV1Page /></div>}
        {currentPage === 'v2' && <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl"><EsgExtractorV2Page /></div>}
        {currentPage === 'v3' && <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl"><EsgExtractorBankingPage /></div>}
        {currentPage === 'apparel' && <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl"><EsgExtractorApparelPage /></div>}
        {currentPage === 'waste' && <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl"><EsgExtractorWastePage /></div>}
        {currentPage === 'methodology' && <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl"><MethodologyPage /></div>}
        {currentPage === 'tech_docs' && <div className="container mx-auto p-4 sm:p-6 lg:p-8 max-w-7xl"><TechnicalDocumentationPage /></div>}
      </main>
      <footer className="bg-slate-900 dark:bg-black/50 text-slate-300 dark:text-slate-400 text-center p-5 text-sm border-t border-slate-700 dark:border-slate-800">
        <p>&copy; {new Date().getFullYear()} ESG Metrics Extractor. AI-driven insights.</p>
        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">This is a demo application. Always verify extracted data with source documents. PDF text extraction quality may vary.</p>
      </footer>
    </div>
  );
};

export default App;
