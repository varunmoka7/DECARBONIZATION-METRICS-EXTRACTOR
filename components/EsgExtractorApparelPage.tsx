

import React, { useState, useCallback } from 'react';
import ReportInput from './ReportInput';
import ApparelKpiDisplay from './ApparelKpiDisplay';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import PerformanceReportDisplay from './PerformanceReportDisplay';
import { extractApparelESGMetrics, generatePerformanceReport } from '../services/geminiService';
import { ExtractedApparelData, PerformanceReportData, ReportFileInput } from '../types';
import { DEFAULT_ERROR_MESSAGE }
from '../constants';

const InitialStateMessageApparel: React.FC = () => (
  <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl dark:shadow-slate-700/50 text-center">
    <svg className="mx-auto h-20 w-20 text-purple-500 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177.177a2.25 2.25 0 01-3.183 0l-1.178-1.178a2.25 2.25 0 01-3.183 0L9.423 15.65c-.832.092-1.647.319-2.399.664l-.498.166a2.25 2.25 0 00-1.766 1.973V21a1.125 1.125 0 001.125 1.125h10.5A1.125 1.125 0 0021 21v-1.756a2.25 2.25 0 00-1.766-1.973l-.498-.166c-.752-.345-1.567-.572-2.399-.664l-.214-.031a2.25 2.25 0 01-2.228 0l-.214.031c-.832.092-1.647.319-2.399-.664M18 11.25a2.25 2.25 0 00-2.25-2.25H8.25A2.25 2.25 0 006 11.25v2.625c0 .621.504 1.125 1.125 1.125h9.750c.621 0 1.125-.504 1.125-1.125V11.25z" />
    </svg>
    <h2 className="text-3xl font-semibold text-slate-700 dark:text-slate-200 mt-6 mb-3">Apparel Sector ESG Extractor</h2>
    <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-6">
      Upload or paste text from an apparel industry sustainability report (max 50MB: .txt, .csv, .md, .pdf).
      The AI will extract KPIs based on a specialized <strong>Apparel Sector Environmental Framework</strong>.
    </p>
    <p className="text-sm text-slate-500 dark:text-slate-400">
      Use "Load Example Text" for a quick demo with apparel-relevant data.
    </p>
  </div>
);

const EsgExtractorApparelPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportFileInput>({ text: '', images: [] });
  const [extractedApparelKpis, setExtractedApparelKpis] = useState<ExtractedApparelData | null>(null);
  const [isLoadingKpis, setIsLoadingKpis] = useState<boolean>(false);
  const [errorKpis, setErrorKpis] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState<string>('');
  const [industry, setIndustry] = useState<string>('Apparel'); // Default industry
  const [performanceReportData, setPerformanceReportData] = useState<PerformanceReportData | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [errorReport, setErrorReport] = useState<string | null>(null);

  const handleFileUploadError = useCallback((errorMessage: string | null) => {
    setErrorKpis(errorMessage);
    if (errorMessage) {
        setExtractedApparelKpis(null);
        setPerformanceReportData(null);
    }
  }, []);

  const handleExtractApparelMetrics = useCallback(async () => {
    if (!reportData.text.trim()) {
      setErrorKpis("Report text cannot be empty. Please paste content, upload a file, or use the example.");
      return;
    }
    setIsLoadingKpis(true);
    setErrorKpis(null);
    setExtractedApparelKpis(null);
    setPerformanceReportData(null);
    setErrorReport(null);

    try {
      // Apparel extractor is text-only for now, so we pass reportData.text
      const kpis = await extractApparelESGMetrics(reportData.text);
      setExtractedApparelKpis(kpis);
    } catch (err) {
      if (err instanceof Error) {
        setErrorKpis(err.message);
      } else {
        setErrorKpis(DEFAULT_ERROR_MESSAGE);
      }
      setExtractedApparelKpis(null);
    } finally {
      setIsLoadingKpis(false);
    }
  }, [reportData]);

  const handleGenerateReport = useCallback(async () => {
    if (!extractedApparelKpis) {
      setErrorReport("Cannot generate report: KPIs not extracted yet or extraction failed.");
      return;
    }
    setIsLoadingReport(true);
    setErrorReport(null);
    setPerformanceReportData(null);

    try {
      const perfReport = await generatePerformanceReport(extractedApparelKpis, industry, companyName);
      setPerformanceReportData(perfReport);
    } catch (err) {
      if (err instanceof Error) {
        setErrorReport(err.message);
      } else {
        setErrorReport(DEFAULT_ERROR_MESSAGE);
      }
      setPerformanceReportData(null);
    } finally {
      setIsLoadingReport(false);
    }
  }, [extractedApparelKpis, industry, companyName]);

  const handleReportDataChange = useCallback((data: ReportFileInput) => {
    setReportData(data);
    if (errorKpis) setErrorKpis(null);
    if (!data.text.trim()) {
        setExtractedApparelKpis(null);
        setPerformanceReportData(null);
        setErrorReport(null);
    }
  }, [errorKpis]);

  const currentLoadingState = isLoadingKpis || isLoadingReport;

  return (
    <>
      <ReportInput
        reportData={reportData}
        onReportDataChange={handleReportDataChange}
        onSubmit={handleExtractApparelMetrics}
        isLoading={currentLoadingState}
        onFileUploadError={handleFileUploadError}
      />
      
      {isLoadingKpis && <LoadingSpinner />}
      {errorKpis && !isLoadingKpis && <ErrorMessage message={errorKpis} />}
      
      {!isLoadingKpis && !errorKpis && !extractedApparelKpis && !performanceReportData && (
        <InitialStateMessageApparel />
      )}

      {!isLoadingKpis && !errorKpis && extractedApparelKpis && (
         <div className="mt-6">
          <ApparelKpiDisplay data={extractedApparelKpis} />

          {!performanceReportData && !isLoadingReport && (
            <div className="mt-10 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-slate-700/50 border-t-4 border-purple-500 dark:border-purple-500">
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Generate Performance Report</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Optionally provide company name (industry is pre-filled as "Apparel"). The AI will generate a multi-part report based on the extracted Apparel Sector KPIs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="companyNameApparel" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name (Optional)</label>
                  <input
                    type="text"
                    id="companyNameApparel"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., StyleSphere Inc."
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                    disabled={isLoadingReport}
                  />
                </div>
                <div>
                  <label htmlFor="industryApparel" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Industry</label>
                  <input
                    type="text"
                    id="industryApparel"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    readOnly 
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-400 focus:ring-purple-500 dark:focus:ring-purple-400 focus:border-purple-500 dark:focus:border-purple-400"
                    disabled={isLoadingReport}
                  />
                </div>
              </div>
              <button
                onClick={handleGenerateReport}
                disabled={isLoadingReport}
                className="w-full md:w-auto px-6 py-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white font-semibold rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:ring-opacity-75 disabled:bg-purple-300 dark:disabled:bg-purple-700 flex items-center justify-center space-x-2"
                aria-label="Generate detailed Apparel Sector ESG performance report"
              >
                 {isLoadingReport ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Generating Report...</span>
                    </>
                  ) : (
                    <span>Generate Performance Report</span>
                  )}
              </button>
            </div>
          )}
        </div>
      )}

      {isLoadingReport && (
         <div className="mt-8">
            <LoadingSpinner />
            <p className="text-center text-slate-600 dark:text-slate-400 -mt-4">Generating detailed performance report...</p>
        </div>
      )}
      {errorReport && !isLoadingReport && <ErrorMessage message={errorReport} />}

      {!isLoadingReport && !errorReport && performanceReportData && (
        <PerformanceReportDisplay reportData={performanceReportData} />
      )}
    </>
  );
};

export default EsgExtractorApparelPage;