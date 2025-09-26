

import React, { useState, useCallback } from 'react';
import ReportInput from './ReportInput';
import KpiDisplay from './KpiDisplay';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import PerformanceReportDisplay from './PerformanceReportDisplay';
import { extractCarbonMetrics, generatePerformanceReport } from '../services/geminiService';
import { ExtractedCarbonData, PerformanceReportData, ReportFileInput } from '../types';
import { DEFAULT_ERROR_MESSAGE } from '../constants';

const InitialStateMessageV1: React.FC = () => (
  <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl dark:shadow-slate-700/50 text-center">
    <svg className="mx-auto h-20 w-20 text-sky-500 dark:text-sky-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
    <h2 className="text-3xl font-semibold text-slate-700 dark:text-slate-200 mt-6 mb-3">Carbon Accounting Extractor</h2>
    <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-6">
      This extractor is now focused specifically on **Carbon Accounting**.
      Paste text from a sustainability report or upload a file (.txt, .csv, .md, .pdf - max 50MB). The AI will extract GHG emissions, targets, intensity metrics, and other carbon-related KPIs.
    </p>
    <p className="text-sm text-slate-500 dark:text-slate-400">
      Use "Load Example Text" for a quick demo.
    </p>
  </div>
);

const EsgExtractorV1Page: React.FC = () => {
  const [reportData, setReportData] = useState<ReportFileInput>({ text: '', images: [] });
  const [extractedKpis, setExtractedKpis] = useState<ExtractedCarbonData | null>(null);
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
        setExtractedKpis(null);
        setPerformanceReportData(null); 
    }
  }, []);

  const handleExtractMetrics = useCallback(async () => {
    if (!reportData.text.trim()) {
      setErrorKpis("Report text cannot be empty. Please paste content, upload a file, or use the example.");
      return;
    }
    setIsLoadingKpis(true);
    setErrorKpis(null);
    setExtractedKpis(null);
    setPerformanceReportData(null); 
    setErrorReport(null);

    try {
      // Pass both text and images to the extraction service
      const kpis = await extractCarbonMetrics(reportData.text, reportData.images);
      setExtractedKpis(kpis);
    } catch (err) {
      if (err instanceof Error) {
        setErrorKpis(err.message);
      } else {
        setErrorKpis(DEFAULT_ERROR_MESSAGE);
      }
      setExtractedKpis(null);
    } finally {
      setIsLoadingKpis(false);
    }
  }, [reportData]);

  const handleGenerateReport = useCallback(async () => {
    if (!extractedKpis) {
      setErrorReport("Cannot generate report: KPIs not extracted yet or extraction failed.");
      return;
    }
    setIsLoadingReport(true);
    setErrorReport(null);
    setPerformanceReportData(null);

    try {
      const reportData = await generatePerformanceReport(extractedKpis, industry, companyName);
      setPerformanceReportData(reportData);
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
  }, [extractedKpis, industry, companyName]);

  const handleReportDataChange = useCallback((data: ReportFileInput) => {
    setReportData(data);
    if (errorKpis) setErrorKpis(null);
    if (!data.text.trim()) {
        setExtractedKpis(null);
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
        onSubmit={handleExtractMetrics}
        isLoading={currentLoadingState} 
        onFileUploadError={handleFileUploadError}
      />
      
      {isLoadingKpis && <LoadingSpinner />}
      {errorKpis && !isLoadingKpis && <ErrorMessage message={errorKpis} />}
      
      {!isLoadingKpis && !errorKpis && !extractedKpis && !performanceReportData && (
        <InitialStateMessageV1 />
      )}

      {!isLoadingKpis && !errorKpis && extractedKpis && (
        <div className="mt-6">
          <KpiDisplay data={extractedKpis} />

          {!performanceReportData && !isLoadingReport && (
            <div className="mt-10 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-slate-700/50 border-t-4 border-sky-500 dark:border-sky-500">
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Generate Performance Report</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Optionally provide company name and industry for a more tailored analysis. The AI will generate a multi-part report based on the extracted Carbon Accounting KPIs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="companyNameV1" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name (Optional)</label>
                  <input
                    type="text"
                    id="companyNameV1"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., GreenFuture Corp"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                    disabled={isLoadingReport}
                  />
                </div>
                <div>
                  <label htmlFor="industryV1" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Industry (Optional)</label>
                  <input
                    type="text"
                    id="industryV1"
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                    placeholder="e.g., Technology, Manufacturing"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                    disabled={isLoadingReport}
                  />
                </div>
              </div>
              <button
                onClick={handleGenerateReport}
                disabled={isLoadingReport}
                className="w-full md:w-auto px-6 py-3 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-semibold rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-600 focus:ring-opacity-75 disabled:bg-sky-300 dark:disabled:bg-sky-700 flex items-center justify-center space-x-2"
                aria-label="Generate detailed ESG performance report"
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
      
      {isLoadingReport &&  (
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

export default EsgExtractorV1Page;