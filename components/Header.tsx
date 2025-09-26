
import React from 'react';
import { useTheme } from '../contexts/ThemeContext'; // Import useTheme

export type PageView = 'landing' | 'v1' | 'v2' | 'v3' | 'apparel' | 'waste' | 'methodology' | 'tech_docs'; 

interface HeaderProps {
  currentPage: PageView;
  onNavigate: (page: PageView) => void;
}

const SunIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.364l-1.591 1.591M21 12h-2.25m-.364 6.364l-1.591-1.591M12 18.75V21m-6.364-.364l1.591-1.591M3 12H.75m.364-6.364l1.591 1.591M12 12a2.25 2.25 0 00-2.25 2.25c0 1.357.675 2.508 1.683 3.116M12 12a2.25 2.25 0 012.25 2.25c0 1.357-.675 2.508-1.683 3.116M12 12a2.25 2.25 0 00-2.25-2.25M12 12a2.25 2.25 0 012.25-2.25M12 12a4.5 4.5 0 00-4.5 4.5c0 1.773.816 3.325 2.067 4.291m5.866-4.291A4.502 4.502 0 0112 16.5c-1.773 0-3.325-.816-4.291-2.067m0 0A4.502 4.502 0 0112 7.5c1.773 0 3.325.816 4.291 2.067" />
  </svg>
);

const MoonIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25c0 5.385 4.365 9.75 9.75 9.75 2.138 0 4.127-.69 5.752-1.848z" />
  </svg>
);


const Header: React.FC<HeaderProps> = ({ currentPage, onNavigate }) => {
  const { theme, toggleTheme } = useTheme();

  const navLinkClasses = (page: PageView) => 
    `px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-600
     ${currentPage === page 
       ? 'bg-sky-500 dark:bg-sky-600 text-white shadow-md' 
       : 'text-slate-300 dark:text-slate-400 hover:bg-slate-700 dark:hover:bg-slate-600 hover:text-white dark:hover:text-slate-100'
     }`;

  return (
    <header className="bg-gradient-to-r from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black/80 text-white p-4 sm:p-6 shadow-xl sticky top-0 z-50">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
        <button 
          onClick={() => onNavigate('landing')}
          className="flex items-center space-x-3 mb-3 sm:mb-0 focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 dark:focus-visible:ring-sky-600 rounded-md p-1 -ml-1"
          aria-label="Go to landing page"
        >
          <svg className="h-10 w-10 text-sky-400 dark:text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white dark:text-slate-100">ESG Metrics Extractor</h1>
        </button>
        
        <div className="flex items-center space-x-2 sm:space-x-3">
          <nav className="flex flex-wrap justify-center space-x-2 sm:space-x-3" aria-label="Main navigation">
            <button
              onClick={() => onNavigate('v1')}
              className={navLinkClasses('v1')}
              aria-current={currentPage === 'v1' ? 'page' : undefined}
            >
              Standard Extractor
            </button>
            <button
              onClick={() => onNavigate('v2')}
              className={navLinkClasses('v2')}
              aria-current={currentPage === 'v2' ? 'page' : undefined}
            >
              Carbon Levers Extractor
            </button>
            <button
              onClick={() => onNavigate('v3')}
              className={navLinkClasses('v3')}
              aria-current={currentPage === 'v3' ? 'page' : undefined}
            >
              Banking Extractor
            </button>
            <button
              onClick={() => onNavigate('apparel')}
              className={navLinkClasses('apparel')}
              aria-current={currentPage === 'apparel' ? 'page' : undefined}
            >
              Apparel Extractor
            </button>
            <button
              onClick={() => onNavigate('waste')}
              className={navLinkClasses('waste')}
              aria-current={currentPage === 'waste' ? 'page' : undefined}
            >
              Waste Management
            </button>
            <button
              onClick={() => onNavigate('methodology')}
              className={navLinkClasses('methodology')}
              aria-current={currentPage === 'methodology' ? 'page' : undefined}
            >
              Methodology
            </button>
             <button
              onClick={() => onNavigate('tech_docs')}
              className={navLinkClasses('tech_docs')}
              aria-current={currentPage === 'tech_docs' ? 'page' : undefined}
            >
              Tech Docs
            </button>
          </nav>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full text-slate-300 dark:text-slate-400 hover:bg-slate-700 dark:hover:bg-slate-600 hover:text-white dark:hover:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-300 dark:focus:ring-sky-600 transition-colors"
            aria-label={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
            title={theme === 'light' ? 'Switch to dark theme' : 'Switch to light theme'}
          >
            {theme === 'light' ? <MoonIcon className="h-5 w-5" /> : <SunIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;
