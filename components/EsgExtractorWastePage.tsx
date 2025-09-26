
import React, { useState, useCallback } from 'react';
import ReportInput from './ReportInput';
import WasteKpiDisplay from './WasteKpiDisplay'; // New display component
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import PerformanceReportDisplay from './PerformanceReportDisplay'; 
import { extractWasteESGMetrics, generatePerformanceReport } from '../services/geminiService'; // New extraction service
import { ExtractedWasteData, PerformanceReportData, ReportFileInput } from '../types'; // New data types
import { DEFAULT_ERROR_MESSAGE } from '../constants';

const InitialStateMessageWaste: React.FC = () => (
  <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl dark:shadow-slate-700/50 text-center">
    <svg className="mx-auto h-20 w-20 text-emerald-500 dark:text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
    </svg>
    <h2 className="text-3xl font-semibold text-slate-700 dark:text-slate-200 mt-6 mb-3">Waste Management ESG Extractor</h2>
    <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-6">
      Provide a sustainability report (paste text or upload .txt, .csv, .md, .pdf - max 50MB).
      The AI will focus on extracting KPIs related to <strong>specific waste reduction and circular economy levers</strong>.
    </p>
    <p className="text-sm text-slate-500 dark:text-slate-400">
      This extractor uses a targeted approach. Use "Load Example Text" for a quick demo.
    </p>
  </div>
);

const EsgExtractorWastePage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportFileInput>({ text: '', images: [] });
  const [extractedWasteKpis, setExtractedWasteKpis] = useState<ExtractedWasteData | null>(null);
  const [isLoadingKpis, setIsLoadingKpis] = useState<boolean>(false);
  const [errorKpis, setErrorKpis] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState<string>('');
  const [industry, setIndustry] = useState<string>('Waste Management'); // Default industry
  const [performanceReportData, setPerformanceReportData] = useState<PerformanceReportData | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [errorReport, setErrorReport] = useState<string | null>(null);

  const handleFileUploadError = useCallback((errorMessage: string | null) => {
    setErrorKpis(errorMessage);
     if (errorMessage) {
        setExtractedWasteKpis(null);
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
    setExtractedWasteKpis(null);
    setPerformanceReportData(null);
    setErrorReport(null);

    try {
      // Waste extractor is text-only for now, consistent with other lever-based extractors
      const kpis = await extractWasteESGMetrics(reportData.text);
      setExtractedWasteKpis(kpis);
    } catch (err) {
      if (err instanceof Error) {
        setErrorKpis(err.message);
      } else {
        setErrorKpis(DEFAULT_ERROR_MESSAGE);
      }
      setExtractedWasteKpis(null);
    } finally {
      setIsLoadingKpis(false);
    }
  }, [reportData]);

  const handleGenerateReport = useCallback(async () => {
    if (!extractedWasteKpis) {
      setErrorReport("Cannot generate report: KPIs not extracted yet or extraction failed.");
      return;
    }
    setIsLoadingReport(true);
    setErrorReport(null);
    setPerformanceReportData(null);

    try {
      const perfReport = await generatePerformanceReport(extractedWasteKpis, industry, companyName);
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
  }, [extractedWasteKpis, industry, companyName]);

  const handleReportDataChange = useCallback((data: ReportFileInput) => {
    setReportData(data);
    if (errorKpis) setErrorKpis(null);
    if (!data.text.trim()) {
        setExtractedWasteKpis(null);
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
      
      {!isLoadingKpis && !errorKpis && !extractedWasteKpis && !performanceReportData && (
        <InitialStateMessageWaste />
      )}

      {!isLoadingKpis && !errorKpis && extractedWasteKpis && (
         <div className="mt-6">
          <WasteKpiDisplay data={extractedWasteKpis} />

          {!performanceReportData && !isLoadingReport && (
            <div className="mt-10 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-slate-700/50 border-t-4 border-emerald-500 dark:border-emerald-500">
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Generate Performance Report</h3>
               <p className="text-slate-600 dark:text-slate-300 mb-6">
                Optionally provide company name (industry is pre-filled as "Waste Management"). The AI will generate a multi-part report based on the extracted Waste Management KPIs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="companyNameWaste" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name (Optional)</label>
                  <input
                    type="text"
                    id="companyNameWaste"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., Circular Solutions Inc."
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                    disabled={isLoadingReport}
                  />
                </div>
                <div>
                  <label htmlFor="industryWaste" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Industry</label>
                  <input
                    type="text"
                    id="industryWaste"
                    value={industry} 
                    onChange={(e) => setIndustry(e.target.value)}
                    readOnly 
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-400 focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400"
                    disabled={isLoadingReport}
                  />
                </div>
              </div>
              <button
                onClick={handleGenerateReport}
                disabled={isLoadingReport}
                className="w-full md:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-semibold rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:ring-opacity-75 disabled:bg-emerald-300 dark:disabled:bg-emerald-700 flex items-center justify-center space-x-2"
                aria-label="Generate detailed Waste Management performance report"
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

export default EsgExtractorWastePage;
