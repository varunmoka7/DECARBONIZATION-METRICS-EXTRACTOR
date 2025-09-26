


import React from 'react';
import { 
    LEVER_DETAILS, 
    BANKING_LEVER_CATEGORIES, 
    APPAREL_CATEGORY_DETAILS,
    ENHANCED_WASTE_FRAMEWORK_DETAILS
} from '../constants';

interface MethodologySectionProps {
  title: string;
  id?: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

const MethodologySection: React.FC<MethodologySectionProps> = ({ title, id, icon, children, className }) => (
  <section id={id} className={`mb-12 ${className || ''}`}>
    <div className="flex items-center text-2xl font-bold text-sky-700 dark:text-sky-500 mb-6 pb-2 border-b border-sky-300 dark:border-sky-700">
      {icon && <span className="mr-3">{icon}</span>}
      <h2 className="leading-tight">{title}</h2>
    </div>
    <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out border border-slate-200 dark:border-slate-700">
      <div className="text-sm text-slate-600 dark:text-slate-300 space-y-3 leading-relaxed">
        {children}
      </div>
    </div>
  </section>
);

const SubSection: React.FC<{ title: string; children: React.ReactNode;}> = ({ title, children }) => (
    <div className="mt-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-md shadow-inner">
        <h4 className="text-md font-semibold text-slate-700 dark:text-slate-200 mb-2">{title}</h4>
        <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
         {children}
        </div>
    </div>
);


// Simple SVG Icons
const AiChipIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || "w-7 h-7"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 3v1.5M4.5 8.25H3m18 0h-1.5M4.5 12H3m18 0h-1.5m-15 3.75H3m18 0h-1.5M8.25 21v-1.5M15.75 3v1.5m0 16.5v-1.5" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75V21m0-18v2.25m0 13.5v2.25m0-13.5V6M12 6H4.5M12 6h7.5M12 18.75H4.5M12 18.75h7.5M12 12.75a.75.75 0 000-1.5.75.75 0 000 1.5z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 7.5h9v9h-9z" />
  </svg>
);

const LayersIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || "w-7 h-7"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6.115 5.19l.319 1.913A6 6 0 008.11 10.36L9.75 12l-.387.775c-.217.433-.132.956.21 1.298l1.348 1.348a2.25 2.25 0 012.12-.142l.236-.061a6 6 0 003.626-3.115l.319-1.913m-16.473 0a6.002 6.002 0 013.626-3.115l.319-1.913a2.25 2.25 0 012.12-.142l1.348 1.348a2.25 2.25 0 01.21 1.298L9.75 12l1.64.325a6 6 0 003.626 3.115l.319 1.913a2.25 2.25 0 01-2.12.142l-1.348-1.348a2.25 2.25 0 01-.21-1.298L14.25 12l-1.64-.325a6 6 0 00-3.626-3.115L8.682 6.75a2.25 2.25 0 01-2.12-.142L5.214 5.26z" />
  </svg>
);

const DocumentTextIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className || "w-7 h-7"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
  </svg>
);

const ChartBarIcon: React.FC<{ className?: string }> = ({ className }) => (
 <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const MethodologyPage: React.FC = () => {
  return (
    <div className="animate-fadeInPage">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6 pb-3 border-b-2 border-sky-500 dark:border-sky-600">
        Extractor Methodology & Frameworks
      </h1>
      <p className="mb-8 text-slate-600 dark:text-slate-300 leading-relaxed">
        This page details the core methodology behind the ESG Metrics Extractor application and explains the conceptual frameworks and "levers" guiding each specialized extractor. Our approach combines advanced AI with targeted instructions to deliver structured ESG data from unstructured reports.
      </p>

      <MethodologySection title="Core Extraction Methodology" icon={<AiChipIcon />}>
        <p>At the heart of the ESG Metrics Extractor is Google's Gemini large language model (LLM). The methodology leverages the advanced natural language understanding and generation capabilities of this AI to parse and interpret sustainability report texts.</p>
        <SubSection title="1. AI-Powered Analysis (Gemini)">
            <p>We utilize the <strong><code>gemini-2.5-flash</code></strong> model. This model is chosen for its balance of strong reasoning capabilities, fast response times, and ability to understand complex instructions, making it suitable for analyzing dense report texts and extracting specific data points.</p>
        </SubSection>
        <SubSection title="2. Prompt Engineering">
            <p>The accuracy and relevance of the extracted data heavily depend on carefully crafted "system prompts." For each extractor type (Standard, Carbon Levers, Banking, Apparel, Waste Management), a unique system prompt is designed. These prompts instruct the AI on:</p>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                <li>Its role (e.g., "You are a highly specialized ESG data extraction AI").</li>
                <li>The specific types of KPIs or information to look for.</li>
                <li>The exact JSON structure required for the output, including field names and expected data types.</li>
                <li>Guidelines on how to handle missing data, infer years, and select reference text.</li>
                <li>Specific keywords or concepts relevant to that extractor's domain (e.g., "PCAF methodology" for banking, "ZDHC MRSL" for apparel).</li>
            </ul>
            <p className="mt-2">This process is iterative; prompts are refined based on testing with diverse report samples to improve extraction quality and adherence to the desired schema.</p>
        </SubSection>
        <SubSection title="3. Structured JSON Output">
            <p>The AI is explicitly instructed to return its findings in a structured JSON format. This is crucial for several reasons:</p>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                <li><strong>Machine Readability:</strong> JSON is easily parsed and processed by the frontend application for display and further operations (like CSV export or performance report generation).</li>
                <li><strong>Consistency:</strong> Ensures that data is returned in a predictable format, regardless of the variations in the input report text.</li>
                <li><strong>Data Integrity:</strong> Predefined schemas help in maintaining the integrity of the extracted data fields.</li>
            </ul>
            <p className="mt-2">The application includes robust JSON parsing logic, including handling potential markdown fences (e.g., ```json ... ```) that the AI might occasionally include in its response.</p>
        </SubSection>
         <SubSection title="4. Data Post-Processing">
            <p>After receiving the JSON response from the AI, the application performs minimal post-processing:</p>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                <li><strong>ID Generation:</strong> Unique identifiers (UUIDs) are added to each extracted KPI or data item. This is essential for React list rendering and potential future data management tasks.</li>
                <li><strong>Error Handling:</strong> The system includes checks for API errors, empty responses, or malformed JSON, providing informative error messages to the user.</li>
            </ul>
        </SubSection>
         <SubSection title="5. Document Input & Pre-Processing">
            <p>Users can input data by pasting text directly or uploading files (.txt, .csv, .md, .pdf). For PDF files, the application uses the `pdf.js` library to extract raw text content from all pages. Currently, image-based data extraction from PDFs (e.g., from charts or scanned-only pages) is a planned enhancement rather than a fully implemented feature in the text extraction pipeline sent to Gemini, though the system prompts are designed to be compatible with future image inputs for the Standard (V1) extractor.</p>
        </SubSection>
      </MethodologySection>

      <MethodologySection title="Extractor-Specific Frameworks & Levers" icon={<LayersIcon />}>
        <p>Beyond the core AI methodology, each extractor is tailored to focus on specific ESG aspects, often guided by predefined "levers" or conceptual frameworks relevant to a particular domain or reporting need.</p>

        <SubSection title="V1: Standard ESG Extractor">
            <p><strong>Goal:</strong> To extract a broad range of general Environmental, Social, and Governance (ESG) KPIs from sustainability reports.</p>
            <p><strong>Framework:</strong> This extractor is designed to identify common ESG metrics that are frequently reported and align with the principles of major frameworks like GRI, TCFD, SASB (now part of ISSB), etc., although it doesn't enforce a strict mapping to a single framework's detailed codes. The focus is on capturing quantitative and qualitative data points across the three ESG pillars.</p>
            <p><strong>Methodology:</strong> The system prompt guides the AI to look for KPIs such as GHG emissions, water usage, employee turnover, board diversity, safety incidents, etc. A key feature is the "enhanced KPI" structure, where the AI attempts to extract not just the core metric (name, value, year) but also contextual details like targets, baselines, related policies, methodologies, and qualitative notes, if explicitly mentioned in the text.</p>
        </SubSection>

        <SubSection title="V2: Carbon Levers Extractor">
            <p><strong>Goal:</strong> To provide a focused analysis of a company's carbon reduction efforts by targeting specific decarbonization levers.</p>
            <p><strong>Framework/Levers:</strong> This extractor is based on <strong>10 predefined carbon reduction levers</strong>, covering key areas of Scope 1, 2, and 3 emissions. These levers are:</p>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-xs sm:text-sm">
                {Object.values(LEVER_DETAILS).map(lever => <li key={lever.title}><strong>{lever.title}:</strong> {lever.description}</li>)}
            </ul>
            <p className="mt-2"><strong>Methodology:</strong> The AI is instructed to find KPIs specifically related to each of these 10 levers, looking for metrics like total emissions for that lever, intensity improvements, or adoption of related technologies/practices.</p>
        </SubSection>

        <SubSection title="V3: Banking Sector Extractor">
            <p><strong>Goal:</strong> To extract ESG KPIs particularly relevant to the financial services industry, with a strong emphasis on climate-related aspects of lending and investment portfolios.</p>
            <p><strong>Framework/Levers:</strong> The extractor targets KPIs within three main categories derived from common banking sector ESG considerations and frameworks like PCAF (Partnership for Carbon Accounting Financials):</p>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-xs sm:text-sm">
                {Object.values(BANKING_LEVER_CATEGORIES).map(cat => <li key={cat.title}><strong>{cat.title}:</strong> {cat.description}</li>)}
            </ul>
            <p className="mt-2"><strong>Methodology:</strong> The prompt details numerous specific KPIs under these categories, suchas Portfolio Carbon Intensity, Climate-Aligned Lending Percentage, Green Mortgage Penetration, Investment Portfolio Carbon Footprint, and metrics related to the bank's operational Scope 3 emissions and client influence activities.</p>
        </SubSection>

        <SubSection title="V4: Apparel Sector Extractor">
            <p><strong>Goal:</strong> To extract environmental performance metrics specific to the apparel and fashion industry's value chain.</p>
            <p><strong>Framework/Levers:</strong> This extractor focuses on <strong>8 key environmental categories</strong> tailored to the apparel sector:</p>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-xs sm:text-sm">
                 {Object.values(APPAREL_CATEGORY_DETAILS).map(cat => <li key={cat.title}><strong>{cat.title}:</strong> {cat.description}</li>)}
            </ul>
            <p className="mt-2"><strong>Methodology:</strong> The system prompt lists numerous specific metrics under each category, ranging from detailed GHG emissions (all Scopes, including biogenic/fossil carbon), water management (intensity, ZDHC compliance), chemical management (MRSL, safer alternatives), waste & circularity (diversion rates, circular models), biodiversity (sustainable fibers, deforestation), supply chain transparency, future planning (SBTi, R&D), and integrated performance data points.</p>
        </SubSection>

        <SubSection title="V5: Waste Management Extractor (Enhanced Framework)">
             <p><strong>Goal:</strong> To perform a deep-dive extraction of waste and circular economy data, integrating performance metrics with carbon accounting and governance analysis.</p>
            <p><strong>Framework/Levers:</strong> This extractor uses a sophisticated, multi-part framework:</p>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1 text-xs sm:text-sm">
                {Object.values(ENHANCED_WASTE_FRAMEWORK_DETAILS).map(detail => <li key={detail.title}><strong>{detail.title}:</strong> {detail.description}</li>)}
            </ul>
            <p className="mt-2"><strong>Methodology:</strong> The AI is guided by an extensive prompt to dissect waste data from multiple angles. It extracts quantitative performance metrics (like total waste generated, recycling rates, energy recovery) and integrates them with their carbon impacts (e.g., Scope 3 emissions from waste, avoided emissions from recycling). It performs a carbon analysis for specific treatment methods and attributes emissions to GHG Protocol Scopes. A key enhancement is the "Governance Intelligence" module, which extracts details on waste-related policies, board oversight, and organizational accountability, providing a holistic view of both performance and strategy.</p>
        </SubSection>
      </MethodologySection>

      <MethodologySection title="Performance Report Generation" icon={<ChartBarIcon />}>
        <p>All extractors (Standard, Carbon Levers, Banking, Apparel, Waste Management) offer the capability to generate an AI-driven Performance Report based on the extracted KPIs.</p>
        <SubSection title="Methodology">
            <p>A dedicated system prompt instructs the Gemini AI to act as an ESG analyst. The prompt provides the extracted KPIs (in their respective JSON structures), an optional company name, and an optional industry context.</p>
            <p>The AI is tasked to generate a structured JSON report including:</p>
            <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
                <li>A `reportTitle`.</li>
                <li>An `overallESGRating` (rating and summary).</li>
                <li>An array of `categoryRatings`, where each category from the input KPIs gets its own rating, explanation, and 2-3 `keyKpiAnalyses` (name, value, explanation, optional rating). The category names are mapped to human-readable titles.</li>
                <li>A comprehensive `overallAnalysis` (250-350 words) synthesizing findings, discussing interconnections, identifying risks/opportunities, and providing strategic recommendations.</li>
                <li>The `generatedDate`.</li>
            </ul>
            <p className="mt-2">The AI is guided to tailor its analysis to the provided industry context and to leverage detailed KPI fields (like targets or qualitative notes from the Standard V1 extractor, or governance intelligence from the Waste V5 extractor) for deeper insights.</p>
        </SubSection>
      </MethodologySection>

      <MethodologySection title="Data Quality & Continuous Improvement" icon={<DocumentTextIcon />}>
        <p>Ensuring data quality is an ongoing process. Current measures include:</p>
        <ul className="list-disc list-inside pl-4 mt-2 space-y-1">
            <li><strong>Strict JSON Parsing:</strong> The application validates that the AI's response conforms to the expected JSON structure.</li>
            <li><strong>Clear Error Messaging:</strong> Users are informed of issues during file processing, API communication, or data parsing.</li>
            <li><strong>Example Data:</strong> The included example sustainability report text (`EXAMPLE_SUSTAINABILITY_REPORT_TEXT`) provides a baseline for users to test and understand the extractors' capabilities.</li>
        </ul>
        <p className="mt-2">Future enhancements could involve more sophisticated validation rules, confidence scoring from the AI, and mechanisms for user feedback to further refine prompts and improve extraction accuracy over time.</p>
      </MethodologySection>
    </div>
  );
};

export default MethodologyPage;