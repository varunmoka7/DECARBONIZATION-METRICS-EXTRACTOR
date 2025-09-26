

import React, { useEffect, useState, useCallback } from 'react';
import { PageView } from './Header';

interface LandingPageProps {
  onNavigate: (page: PageView) => void;
}

const scrollToSection = (sectionId: string) => {
  document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
};

// Simple SVG Icons to avoid new dependencies
const IconDocumentText: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const IconCpuChip: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
  </svg>
);

const IconTableCells: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.375 19.5h17.25m-17.25 0a1.125 1.125 0 01-1.125-1.125M3.375 19.5V7.5M10.5 19.5V7.5m0 12V4.5m5.625-.375h1.5m-17.25 0h1.5M3.375 7.5h17.25M3.375 7.5a1.125 1.125 0 00-1.125-1.125M20.625 7.5a1.125 1.125 0 011.125-1.125m0 0H3.375m17.25 0a1.125 1.125 0 001.125-1.125M20.625 4.5V19.5m0-15a1.125 1.125 0 011.125 1.125" />
  </svg>
);

const IconShirt: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177.177a2.25 2.25 0 01-3.183 0l-1.178-1.178a2.25 2.25 0 01-3.183 0L9.423 15.65c-.832.092-1.647.319-2.399.664l-.498.166a2.25 2.25 0 00-1.766 1.973V21a1.125 1.125 0 001.125 1.125h10.5A1.125 1.125 0 0021 21v-1.756a2.25 2.25 0 00-1.766-1.973l-.498-.166c-.752-.345-1.567-.572-2.399-.664l-.214-.031a2.25 2.25 0 01-2.228 0l-.214.031c-.832.092-1.647.319-2.399-.664M18 11.25a2.25 2.25 0 00-2.25-2.25H8.25A2.25 2.25 0 006 11.25v2.625c0 .621.504 1.125 1.125 1.125h9.750c.621 0 1.125-.504 1.125-1.125V11.25z" />
  </svg>
);

const IconRecycle: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-7 h-7"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);


const LandingPage: React.FC<LandingPageProps> = ({ onNavigate }) => {
  const [mainHeadlineText, setMainHeadlineText] = useState('');
  const fullMainHeadline = "Unlock ESG Insights Instantly.";

  useEffect(() => {
    let charIndex = 0;
    const typeEffect = () => {
      if (charIndex < fullMainHeadline.length) {
        setMainHeadlineText(fullMainHeadline.substring(0, charIndex + 1));
        charIndex++;
        setTimeout(typeEffect, 70); 
      }
    };
    const initialDelayTimer = setTimeout(typeEffect, 300); 
    return () => {
      clearTimeout(initialDelayTimer);
    };
  }, [fullMainHeadline]); 

  const FeatureCard: React.FC<{ icon: React.ReactNode; title: string; description: string; delay?: string }> = ({ icon, title, description, delay = '0s' }) => (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg hover:shadow-2xl dark:hover:shadow-sky-700/30 transition-shadow duration-300 transform hover:-translate-y-1 animate-fadeIn" style={{ animationDelay: delay}}>
      <div className="flex items-center justify-center w-16 h-16 bg-sky-100 dark:bg-sky-700 text-sky-600 dark:text-sky-300 rounded-full mx-auto mb-6">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-3 text-center">{title}</h3>
      <p className="text-slate-600 dark:text-slate-300 text-center text-sm leading-relaxed">{description}</p>
    </div>
  );

  const ExtractorCard: React.FC<{ title: string; description: string; pageView: PageView; buttonText: string; icon: React.ReactNode, delay?: string, buttonStyle?: React.CSSProperties, buttonClassName?: string }> = 
  ({ title, description, pageView, buttonText, icon, delay = '0s', buttonStyle, buttonClassName }) => (
    <div className="flex flex-col bg-white dark:bg-slate-800 rounded-xl shadow-xl hover:shadow-2xl dark:hover:shadow-lg dark:hover:shadow-sky-700/20 transition-all duration-300 overflow-hidden transform hover:scale-105 animate-fadeIn" style={{ animationDelay: delay}}>
      <div className="p-8 flex-grow">
        <div className="flex items-center text-sky-600 dark:text-sky-400 mb-4">
          {icon}
          <h3 className="text-2xl font-semibold text-slate-800 dark:text-slate-100 ml-3">{title}</h3>
        </div>
        <p className="text-slate-600 dark:text-slate-300 mb-6 text-sm leading-relaxed">{description}</p>
      </div>
      <button
        onClick={() => onNavigate(pageView)}
        className={buttonClassName || `w-full text-white font-semibold py-4 px-6 transition-colors duration-200 mt-auto`}
        style={buttonStyle}
        aria-label={`Launch ${title}`}
      >
        {buttonText}
      </button>
    </div>
  );

  return (
    <div className="animate-fadeInPage">
      {/* Hero Section */}
      <section className="relative pt-24 pb-20 md:pt-40 md:pb-32 bg-gradient-to-br from-slate-800 via-slate-900 to-sky-900 dark:from-slate-900 dark:via-black/80 dark:to-sky-900/70 text-white text-center overflow-hidden">
        <div className="absolute inset-0 opacity-10 dark:opacity-[0.07]">
          <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg"><defs><pattern id="smallGrid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(203, 213, 225, 0.2)" strokeWidth="0.5"/></pattern></defs><rect width="100%" height="100%" fill="url(#smallGrid)" /></svg>
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 tracking-tight min-h-[3em] md:min-h-[2em] text-slate-50 dark:text-slate-100">
            {mainHeadlineText}
            <span className="inline-block animate-cursorBlink">|</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 dark:text-slate-300 mb-10 max-w-2xl mx-auto leading-relaxed">
            Automatically extract Environmental, Social, and Governance (ESG) Key Performance Indicators from sustainability reports using cutting-edge AI.
          </p>
          <button
            onClick={() => scrollToSection('extractors')}
            className="bg-sky-500 hover:bg-sky-400 dark:bg-sky-600 dark:hover:bg-sky-500 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg focus:outline-none focus:ring-4 focus:ring-sky-300 dark:focus:ring-sky-700 focus:ring-opacity-50"
          >
            Explore Extractors
          </button>
        </div>
      </section>

      {/* "The Challenge & Our Solution" Section */}
      <section id="challenge-solution" className="py-16 md:py-24 bg-white dark:bg-slate-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-4">The ESG Data Maze</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Navigating dense sustainability reports for crucial ESG metrics is time-consuming and prone to errors. Our AI solution streamlines this process, delivering accurate data swiftly.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 items-center text-center">
            <FeatureCard 
              icon={<IconDocumentText className="w-8 h-8" />} 
              title="Complex Reports" 
              description="Sustainability reports are lengthy and unstructured, making manual data extraction a significant hurdle."
              delay="0.1s"
            />
            <div className="flex justify-center items-center my-8 md:my-0 animate-fadeIn" style={{animationDelay: '0.3s'}}>
               <IconCpuChip className="w-20 h-20 text-sky-500 dark:text-sky-400 transform transition-transform duration-500 hover:rotate-12" />
            </div>
            <FeatureCard 
              icon={<IconTableCells className="w-8 h-8" />} 
              title="Actionable KPIs" 
              description="Instantly convert report text into structured, ready-to-use ESG Key Performance Indicators."
              delay="0.5s"
            />
          </div>
        </div>
      </section>

      {/* "Meet Our Extractors" Section */}
      <section id="extractors" className="py-16 md:py-24 bg-slate-100 dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12 md:mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-3">Choose Your Extractor</h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
              Tailored AI models to fit your specific ESG data extraction needs.
            </p>
          </div>
          <div className="grid md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-2 gap-6 items-stretch"> {/* Updated grid for 5 items, allowing flexible wrapping */}
            <ExtractorCard
              icon={<IconDocumentText className="w-7 h-7 text-sky-600 dark:text-sky-400" />}
              title="Standard Extractor"
              description="Extracts a broad range of Environmental, Social, and Governance KPIs from general sustainability reports."
              pageView="v1"
              buttonText="Launch Standard"
              delay="0.1s"
              buttonClassName="w-full text-white font-semibold py-4 px-6 transition-colors duration-200 mt-auto bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400"
            />
            <ExtractorCard
              icon={<svg className="w-7 h-7 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /></svg>}
              title="Carbon Levers Extractor"
              description="Focuses on 10 specific carbon reduction levers, providing detailed insights into decarbonization efforts."
              pageView="v2"
              buttonText="Launch Carbon Levers"
              delay="0.2s"
              buttonClassName="w-full text-white font-semibold py-4 px-6 transition-colors duration-200 mt-auto bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400"
            />
            <ExtractorCard
               icon={<svg className="w-7 h-7 text-emerald-600 dark:text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" /></svg>}
              title="Banking Sector Extractor"
              description="Specialized for financial institutions, extracting KPIs related to financed emissions and banking operations."
              pageView="v3"
              buttonText="Launch Banking"
              delay="0.3s"
              buttonClassName="w-full text-white font-semibold py-4 px-6 transition-colors duration-200 mt-auto bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400"
            />
             <ExtractorCard
              icon={<IconShirt className="w-7 h-7 text-purple-600 dark:text-purple-400" />}
              title="Apparel Extractor"
              description="Targets KPIs for the apparel industry, focusing on its unique carbon reduction levers across the value chain."
              pageView="apparel"
              buttonText="Launch Apparel"
              delay="0.4s"
              buttonClassName="w-full text-white font-semibold py-4 px-6 transition-colors duration-200 mt-auto bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400"
            />
            <ExtractorCard
              icon={<IconRecycle className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />}
              title="Waste Management Extractor"
              description="A comprehensive extractor for waste management, analyzing performance levers, carbon impacts, and governance based on an enhanced, carbon-integrated framework."
              pageView="waste"
              buttonText="Launch Waste Management"
              delay="0.5s"
              buttonStyle={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
              buttonClassName="w-full text-white font-semibold py-4 px-6 transition-colors duration-200 mt-auto hover:opacity-90"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
