

import React, { useState, useCallback } from 'react';
import ReportInput from './ReportInput';
import LeverKpiDisplay from './LeverKpiDisplay';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import PerformanceReportDisplay from './PerformanceReportDisplay'; 
import { extractLeverBasedESGMetrics, generatePerformanceReport } from '../services/geminiService';
import { ExtractedLeverData, PerformanceReportData, ReportFileInput } from '../types';
import { DEFAULT_ERROR_MESSAGE } from '../constants';

const InitialStateMessageV2: React.FC = () => (
  <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl dark:shadow-slate-700/50 text-center">
     <svg className="mx-auto h-20 w-20 text-blue-500 dark:text-blue-400" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" /> {/* Lightning bolt icon */}
    </svg>
    <h2 className="text-3xl font-semibold text-slate-700 dark:text-slate-200 mt-6 mb-3">Carbon Levers ESG Extractor</h2>
    <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-6">
      Provide a sustainability report (paste text or upload a file: .txt, .csv, .md, .pdf - max 50MB).
      The AI will focus on extracting KPIs related to <strong>10 specific carbon reduction levers</strong>.
    </p>
    <p className="text-sm text-slate-500 dark:text-slate-400">
      This extractor uses a targeted approach. Use "Load Example Text" for a quick demo.
    </p>
  </div>
);

const EsgExtractorV2Page: React.FC = () => {
  const [reportData, setReportData] = useState<ReportFileInput>({ text: '', images: [] });
  const [extractedLeverKpis, setExtractedLeverKpis] = useState<ExtractedLeverData | null>(null);
  const [isLoadingKpis, setIsLoadingKpis] = useState<boolean>(false);
  const [errorKpis, setErrorKpis] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState<string>('');
  const [industry, setIndustry] = useState<string>('');
  const [performanceReportData, setPerformanceReportData] = useState<PerformanceReportData | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [errorReport, setErrorReport] = useState<string | null>(null);


  const handleFileUploadError = useCallback((errorMessage: string | null) => {
    setErrorKpis(errorMessage);
     if (errorMessage) {
        setExtractedLeverKpis(null);
        setPerformanceReportData(null);
    }
  }, []);

  const handleExtractLeverMetrics = useCallback(async () => {
    if (!reportData.text.trim()) {
      setErrorKpis("Report text cannot be empty. Please paste content, upload a file, or use the example.");
      return;
    }
    setIsLoadingKpis(true);
    setErrorKpis(null);
    setExtractedLeverKpis(null);
    setPerformanceReportData(null);
    setErrorReport(null);

    try {
      // V2 extractor is text-only for now, so we pass reportData.text
      const kpis = await extractLeverBasedESGMetrics(reportData.text);
      setExtractedLeverKpis(kpis);
    } catch (err) {
      if (err instanceof Error) {
        setErrorKpis(err.message);
      } else {
        setErrorKpis(DEFAULT_ERROR_MESSAGE);
      }
      setExtractedLeverKpis(null);
    } finally {
      setIsLoadingKpis(false);
    }
  }, [reportData]);

  const handleGenerateReport = useCallback(async () => {
    if (!extractedLeverKpis) {
      setErrorReport("Cannot generate report: KPIs not extracted yet or extraction failed.");
      return;
    }
    setIsLoadingReport(true);
    setErrorReport(null);
    setPerformanceReportData(null);

    try {
      const perfReport = await generatePerformanceReport(extractedLeverKpis, industry, companyName);
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
  }, [extractedLeverKpis, industry, companyName]);

  const handleReportDataChange = useCallback((data: ReportFileInput) => {
    setReportData(data);
    if (errorKpis) setErrorKpis(null);
    if (!data.text.trim()) {
        setExtractedLeverKpis(null);
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
        onSubmit={handleExtractLeverMetrics}
        isLoading={currentLoadingState}
        onFileUploadError={handleFileUploadError}
      />
      
      {isLoadingKpis && <LoadingSpinner />}
      {errorKpis && !isLoadingKpis && <ErrorMessage message={errorKpis} />}
      
      {!isLoadingKpis && !errorKpis && !extractedLeverKpis && !performanceReportData && (
        <InitialStateMessageV2 />
      )}

      {!isLoadingKpis && !errorKpis && extractedLeverKpis && (
         <div className="mt-6">
          <LeverKpiDisplay data={extractedLeverKpis} />

          {!performanceReportData && !isLoadingReport && (
            <div className="mt-10 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-slate-700/50 border-t-4 border-blue-500 dark:border-blue-500">
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Generate Performance Report</h3>
               <p className="text-slate-600 dark:text-slate-300 mb-6">
                Optionally provide company name and industry for a more tailored analysis. The AI will generate a multi-part report based on the extracted Carbon Lever KPIs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="companyNameV2" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name (Optional)</label>
                  <input
                    type="text"
                    id="companyNameV2"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., GreenFuture Corp"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                    disabled={isLoadingReport}
                  />
                </div>
                <div>
                  <label htmlFor="industryV2" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Industry (Optional)</label>
                  <input
                    type="text"
                    id="industryV2"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Manufacturing, Energy"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-blue-500 dark:focus:border-blue-400 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                    disabled={isLoadingReport}
                  />
                </div>
              </div>
              <button
                onClick={handleGenerateReport}
                disabled={isLoadingReport}
                className="w-full md:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-semibold rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-opacity-75 disabled:bg-blue-300 dark:disabled:bg-blue-700 flex items-center justify-center space-x-2"
                aria-label="Generate detailed Carbon Levers performance report"
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

export default EsgExtractorV2Page;