

import React, { useState, useCallback } from 'react';
import ReportInput from './ReportInput';
import BankingKpiDisplay from './BankingKpiDisplay';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';
import PerformanceReportDisplay from './PerformanceReportDisplay'; 
import { extractBankingESGMetrics, generatePerformanceReport } from '../services/geminiService';
import { ExtractedBankingData, PerformanceReportData, ReportFileInput } from '../types';
import { DEFAULT_ERROR_MESSAGE } from '../constants';

const InitialStateMessageV3: React.FC = () => (
  <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl dark:shadow-slate-700/50 text-center">
    <svg className="mx-auto h-20 w-20 text-emerald-500 dark:text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0115.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 013 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 00-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 01-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 003 15h-.75M15 10.5a3 3 0 11-6 0 3 3 0 016 0zm3 0h.008v.008H18V10.5zm-12 0h.008v.008H6V10.5z" />
    </svg>
    <h2 className="text-3xl font-semibold text-slate-700 dark:text-slate-200 mt-6 mb-3">Banking Sector ESG Extractor</h2>
    <p className="text-slate-600 dark:text-slate-300 max-w-xl mx-auto mb-6">
      Provide a sustainability report from a financial institution (paste text or upload a file: .txt, .csv, .md, .pdf - max 50MB).
      The AI will extract KPIs based on a specialized <strong>Banking Sector ESG Framework</strong> focusing on financed emissions, operational Scope 3, and client influence.
    </p>
    <p className="text-sm text-slate-500 dark:text-slate-400">
      Ensure the report contains data relevant to banking operations and financed/investment portfolios. Use "Load Example Text" for a demo which now includes banking-specific data.
    </p>
  </div>
);

const EsgExtractorBankingPage: React.FC = () => {
  const [reportData, setReportData] = useState<ReportFileInput>({ text: '', images: [] });
  const [extractedBankingKpis, setExtractedBankingKpis] = useState<ExtractedBankingData | null>(null);
  const [isLoadingKpis, setIsLoadingKpis] = useState<boolean>(false);
  const [errorKpis, setErrorKpis] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState<string>('');
  const [industry, setIndustry] = useState<string>('Banking'); // Default industry for this page
  const [performanceReportData, setPerformanceReportData] = useState<PerformanceReportData | null>(null);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [errorReport, setErrorReport] = useState<string | null>(null);

  const handleFileUploadError = useCallback((errorMessage: string | null) => {
    setErrorKpis(errorMessage);
    if (errorMessage) {
        setExtractedBankingKpis(null);
        setPerformanceReportData(null);
    }
  }, []);

  const handleExtractBankingMetrics = useCallback(async () => {
    if (!reportData.text.trim()) {
      setErrorKpis("Report text cannot be empty. Please paste content, upload a file, or use the example.");
      return;
    }
    setIsLoadingKpis(true);
    setErrorKpis(null);
    setExtractedBankingKpis(null);
    setPerformanceReportData(null);
    setErrorReport(null);

    try {
      // V3 extractor is text-only for now, so we pass reportData.text
      const kpis = await extractBankingESGMetrics(reportData.text);
      setExtractedBankingKpis(kpis);
    } catch (err) {
      if (err instanceof Error) {
        setErrorKpis(err.message);
      } else {
        setErrorKpis(DEFAULT_ERROR_MESSAGE);
      }
      setExtractedBankingKpis(null);
    } finally {
      setIsLoadingKpis(false);
    }
  }, [reportData]);

  const handleGenerateReport = useCallback(async () => {
    if (!extractedBankingKpis) {
      setErrorReport("Cannot generate report: KPIs not extracted yet or extraction failed.");
      return;
    }
    setIsLoadingReport(true);
    setErrorReport(null);
    setPerformanceReportData(null);

    try {
      const perfReport = await generatePerformanceReport(extractedBankingKpis, industry, companyName);
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
  }, [extractedBankingKpis, industry, companyName]);

  const handleReportDataChange = useCallback((data: ReportFileInput) => {
    setReportData(data);
    if (errorKpis) setErrorKpis(null);
    if (!data.text.trim()) {
        setExtractedBankingKpis(null);
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
        onSubmit={handleExtractBankingMetrics}
        isLoading={currentLoadingState}
        onFileUploadError={handleFileUploadError}
      />
      
      {isLoadingKpis && <LoadingSpinner />}
      {errorKpis && !isLoadingKpis && <ErrorMessage message={errorKpis} />}
      
      {!isLoadingKpis && !errorKpis && !extractedBankingKpis && !performanceReportData && (
        <InitialStateMessageV3 />
      )}

      {!isLoadingKpis && !errorKpis && extractedBankingKpis && (
         <div className="mt-6">
          <BankingKpiDisplay data={extractedBankingKpis} />

          {!performanceReportData && !isLoadingReport && (
            <div className="mt-10 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-xl dark:shadow-slate-700/50 border-t-4 border-emerald-500 dark:border-emerald-500">
              <h3 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mb-4">Generate Performance Report</h3>
              <p className="text-slate-600 dark:text-slate-300 mb-6">
                Optionally provide company name (industry is pre-filled as "Banking"). The AI will generate a multi-part report based on the extracted Banking Sector KPIs.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label htmlFor="companyNameV3" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Company Name (Optional)</label>
                  <input
                    type="text"
                    id="companyNameV3"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g., GreenBank PLC"
                    className="w-full p-2 border border-slate-300 dark:border-slate-600 rounded-md focus:ring-emerald-500 dark:focus:ring-emerald-400 focus:border-emerald-500 dark:focus:border-emerald-400 bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
                    disabled={isLoadingReport}
                  />
                </div>
                <div>
                  <label htmlFor="industryV3" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Industry</label>
                  <input
                    type="text"
                    id="industryV3"
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
                aria-label="Generate detailed Banking Sector ESG performance report"
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

export default EsgExtractorBankingPage;