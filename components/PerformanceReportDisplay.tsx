
import React from 'react';
import { PerformanceReportData, PerformanceCategoryRating, KPIAnalysis } from '../types';

// PrintIcon remains the same as it's used for the download button
const PrintIcon: React.FC<{className?: string}> = ({className}) => (
    <svg className={className || "w-5 h-5"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0c1.253 1.464 2.405 3.06 2.405 4.874A1.125 1.125 0 0118.75 24H5.25A1.125 1.125 0 014.125 22.874c0-1.814 1.152-3.41 2.405-4.874m11.318 0a48.133 48.133 0 00-5.36-2.476l-.556.556c-.36.36-.83.556-1.332.556H11.25c-.503 0-.972-.2-1.332-.556l-.556-.556a48.132 48.132 0 00-5.36 2.476m14.247-2.618a46.04 46.04 0 012.713 4.352C20.186 17.69 19.29 19.356 18 20.25c-1.29.894-2.944.308-4.096-1.032a48.13 48.13 0 00-2.624-3.065M6 14.25c1.152-1.34 2.806-1.926 4.096-1.032 1.29.894 2.186 2.56 1.957 4.352a46.04 46.04 0 01-2.713-4.352M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
);

// These components are part of the hidden report structure for printing
const KpiAnalysisCard: React.FC<{ analysis: KPIAnalysis }> = ({ analysis }) => (
  <div className="bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg shadow print:shadow-none border border-slate-200 dark:border-slate-600 print:border-slate-300">
    <h5 className="text-sm font-semibold text-sky-700 dark:text-sky-400 print:text-sm">{analysis.kpiName}</h5>
    <p className="text-slate-800 dark:text-slate-100 font-bold my-1 text-lg print:text-base">{String(analysis.kpiValue)}</p>
    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 print:text-xs leading-relaxed">{analysis.explanation}</p>
    {analysis.rating && (
      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 print:text-xs">
        <span className="font-medium">Assessment:</span> {analysis.rating}
      </p>
    )}
  </div>
);

const CategoryRatingSection: React.FC<{ ratingItem: PerformanceCategoryRating, isFirst: boolean }> = ({ ratingItem, isFirst }) => (
  <div className={`pt-6 pb-8 mb-8 bg-white dark:bg-slate-800 print:bg-transparent print:shadow-none ${isFirst ? '' : 'page-break-before'}`}>
    <h3 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-1 print:text-lg">{ratingItem.categoryName}</h3>
    <div className="flex items-baseline mb-3">
      <p className="text-lg font-bold text-sky-600 dark:text-sky-400 print:text-base">{ratingItem.rating}</p>
    </div>
    <p className="text-sm text-slate-700 dark:text-slate-300 mb-5 print:text-sm leading-relaxed whitespace-pre-line">{ratingItem.explanation}</p>
    
    {ratingItem.keyKpiAnalyses && ratingItem.keyKpiAnalyses.length > 0 && (
      <div>
        <h4 className="text-md font-semibold text-slate-700 dark:text-slate-200 mb-3 print:text-base">Key KPI Highlights:</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 print:grid-cols-2">
          {ratingItem.keyKpiAnalyses.map((kpiAnalysis, index) => (
            <KpiAnalysisCard key={index} analysis={kpiAnalysis} />
          ))}
        </div>
      </div>
    )}
  </div>
);

interface PerformanceReportDisplayProps {
  reportData: PerformanceReportData;
}

function PerformanceReportDisplay({ reportData }: PerformanceReportDisplayProps): JSX.Element {
  if (!reportData) {
    return <></>; 
  }

  const handlePrint = () => {
    window.print();
  };
  
  const categoryRatingsPage1 = reportData.categoryRatings.slice(0, 1);
  const categoryRatingsPage2 = reportData.categoryRatings.slice(1, 2);
  const categoryRatingsPage3 = reportData.categoryRatings.slice(2);

  return (
    <div className="mt-10 printable-report"> {/* Root container */}
      
      {/* Screen-only content: Download button and title */}
      <div className="p-4 sm:p-6 lg:p-8 bg-slate-50 dark:bg-slate-800 rounded-xl shadow-2xl dark:shadow-slate-700/50 screen-only-container">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
          <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-3 sm:mb-0">Performance Report Ready</h2>
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-medium rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-600 focus:ring-opacity-75 flex items-center justify-center space-x-2"
            aria-label="Download Report as PDF"
          >
            <PrintIcon />
            <span>Download Report as PDF</span>
          </button>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-300">
          Click the button to open the print dialog, where you can save your professionally formatted ESG performance report as a PDF.
        </p>
      </div>

      {/* Print-only content: The actual report structure */}
      {/* Dark mode styling for print-only content is mainly for debugging if it accidentally shows on screen in dark mode. True print styles are in index.css */}
      <div className="report-print-area">
        <div className="report-content bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-lg shadow-inner dark:shadow-none print:shadow-none print:p-2">
          <section className="report-page page-1 pb-8">
            <div className="text-center mb-8 pb-4 border-b border-slate-300 dark:border-slate-700 print:border-slate-400">
              <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-slate-50 print:text-2xl">{reportData.reportTitle}</h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 print:text-xs mt-1">Generated on: {reportData.generatedDate}</p>
            </div>

            <div className="mb-8 p-6 bg-sky-50 dark:bg-sky-800/30 border-l-4 border-sky-500 dark:border-sky-500 rounded-r-lg shadow print:shadow-none print:border-l-2 print:p-4">
              <h2 className="text-xl font-semibold text-sky-800 dark:text-sky-300 mb-2 print:text-lg">Overall ESG Performance</h2>
              <p className="text-2xl font-bold text-sky-700 dark:text-sky-400 mb-2 print:text-xl">{reportData.overallESGRating.rating}</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 print:text-sm leading-relaxed whitespace-pre-line">{reportData.overallESGRating.summary}</p>
            </div>
            
            {categoryRatingsPage1.map((catRating, index) => (
              <CategoryRatingSection key={index} ratingItem={catRating} isFirst={true} />
            ))}
          </section>

          {categoryRatingsPage2.length > 0 && (
            <section className="report-page page-2 page-break-before">
               {categoryRatingsPage2.map((catRating, index) => (
                <CategoryRatingSection key={index} ratingItem={catRating} isFirst={false} />
              ))}
            </section>
          )}

          {categoryRatingsPage3.length > 0 && (
            <section className="report-page page-3 page-break-before">
               {categoryRatingsPage3.map((catRating, index) => (
                <CategoryRatingSection key={index} ratingItem={catRating} isFirst={false} />
              ))}
            </section>
          )}
          
          <section className="report-page page-4 page-break-before pt-6 pb-8">
            <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 mb-4 print:text-lg border-b border-slate-300 dark:border-slate-700 print:border-slate-400 pb-2">Overall Analysis & Recommendations</h2>
            <div 
              className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line print:text-sm prose prose-sm dark:prose-invert max-w-none print:prose-xs"
              dangerouslySetInnerHTML={{ __html: reportData.overallAnalysis.replace(/\n/g, '<br />') }}
            />
          </section>
          
           <p className="text-xs text-slate-400 dark:text-slate-500 mt-8 text-center print:text-xs print:mt-4">
              Disclaimer: This report is AI-generated based on the provided text and should be used as a preliminary analysis. Always verify critical information with source documents.
            </p>
        </div>
      </div>
    </div>
  );
}

export default PerformanceReportDisplay;