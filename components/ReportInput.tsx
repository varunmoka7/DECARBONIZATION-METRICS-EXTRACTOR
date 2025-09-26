

import React, { useRef, useState, useCallback } from 'react';
import { EXAMPLE_SUSTAINABILITY_REPORT_TEXT } from '../constants';
import { ReportFileInput } from '../types';

interface ReportInputProps {
  reportData: ReportFileInput;
  onReportDataChange: (data: ReportFileInput) => void;
  onSubmit: () => void;
  isLoading: boolean; // Reflects KPI extraction/report generation or PDF parsing
  onFileUploadError: (errorMessage: string | null) => void; 
}

const MAX_FILE_SIZE_MB = 50;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
// PDF_PAGE_RENDER_SCALE and MAX_PDF_PAGE_IMAGES_TO_SEND are no longer needed.

const ReportInput: React.FC<ReportInputProps> = ({ reportData, onReportDataChange, onSubmit, isLoading, onFileUploadError }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isParsingFile, setIsParsingFile] = useState<boolean>(false);

  const handleUseExample = useCallback(() => {
    onReportDataChange({ text: EXAMPLE_SUSTAINABILITY_REPORT_TEXT, images: [] });
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileUploadError(null);
  }, [onReportDataChange, onFileUploadError]);

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    onFileUploadError(null);
    const file = event.target.files?.[0];

    if (file) {
      if (file.size > MAX_FILE_SIZE_BYTES) {
        const errorMessage = `File exceeds ${MAX_FILE_SIZE_MB}MB limit. Please upload a smaller file.`;
        onFileUploadError(errorMessage);
        setSelectedFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      const validTextTypes = ['text/plain', 'text/csv', 'text/markdown'];
      const isTextFile = validTextTypes.includes(file.type) || file.name.endsWith('.txt') || file.name.endsWith('.csv') || file.name.endsWith('.md');
      const isPdfFile = file.type === 'application/pdf' || file.name.endsWith('.pdf');

      if (!isTextFile && !isPdfFile) {
        const errorMessage = `Invalid file type: ${file.name}. Please upload a .txt, .csv, .md, or .pdf file.`;
        onFileUploadError(errorMessage);
        setSelectedFileName(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }

      setSelectedFileName(file.name);
      setIsParsingFile(true);
      onReportDataChange({ text: '', images: [] }); 

      if (isPdfFile) {
        try {
          if (typeof pdfjsLib === 'undefined') {
            throw new Error("PDF library (pdf.js) is not loaded. Please check your internet connection or browser console.");
          }
          if (!pdfjsLib.GlobalWorkerOptions.workerSrc) {
            pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
          }

          const arrayBuffer = await file.arrayBuffer();
          const pdfDoc = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
          
          let fullText = '';
          // Removed pageImagePromises and image rendering logic
          
          for (let i = 1; i <= pdfDoc.numPages; i++) {
            const page = await pdfDoc.getPage(i);
            
            // Extract text from all pages
            const textContent = await page.getTextContent();
            const pageText = textContent.items.map((item: any) => item.str).join(' ');
            fullText += pageText + '\n\n';

            // Image rendering logic removed
          }
          
          onReportDataChange({ text: fullText.trim(), images: [] }); // Always empty images array

        } catch (err) {
          console.error("Error processing PDF:", err);
          const errorMessage = err instanceof Error && err.message.includes("Password") ? "Cannot process password-protected PDF." : "Error processing PDF file. It might be corrupted, password-protected, or in an unsupported format.";
          onFileUploadError(errorMessage);
          setSelectedFileName(null);
          onReportDataChange({ text: '', images: [] });
          if (fileInputRef.current) fileInputRef.current.value = "";
        } finally {
          setIsParsingFile(false);
        }
      } else { // Plain text file
        const reader = new FileReader();
        reader.onload = (e) => {
          const text = e.target?.result as string;
          onReportDataChange({ text: text, images: [] }); // Empty images array
          setIsParsingFile(false);
        };
        reader.onerror = () => {
          const errorMessage = "Error reading file. Please try again or ensure the file is not corrupted.";
          onFileUploadError(errorMessage);
          setSelectedFileName(null);
          onReportDataChange({ text: '', images: [] });
          if (fileInputRef.current) fileInputRef.current.value = "";
          setIsParsingFile(false);
        };
        reader.readAsText(file);
      }
    } else {
      setSelectedFileName(null);
      setIsParsingFile(false);
    }
  }, [onReportDataChange, onFileUploadError]);

  const clearSelectedFile = useCallback(() => {
    setSelectedFileName(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onFileUploadError(null);
  }, [onFileUploadError]);

  const currentOverallLoading = isLoading || isParsingFile;

  return (
    <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-xl shadow-xl dark:shadow-slate-700/50">
      <label htmlFor="reportTextArea" className="block text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3">
        Paste Report Text or Upload File (.txt, .csv, .md, .pdf)
      </label>
      <textarea
        id="reportTextArea"
        className="w-full h-72 p-4 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-400 focus:border-sky-500 dark:focus:border-sky-400 transition-shadow duration-150 resize-y text-sm sm:text-base leading-relaxed bg-white dark:bg-slate-700 text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
        placeholder="Paste report text here, or use 'Upload Report File' for .txt, .csv, .md, or .pdf (up to 50MB). For PDFs, text from all pages will be processed. Ensure the application environment is configured with a valid Gemini API Key."
        value={reportData.text}
        onChange={(e) => {
          onReportDataChange({ text: e.target.value, images: [] }); // Clear images if text is manually changed
          if(selectedFileName) setSelectedFileName(null);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }}
        disabled={currentOverallLoading}
        aria-label="Sustainability Report Text Input"
        aria-describedby="fileUploadStatus"
      />
      
      {selectedFileName && (
        <div id="fileUploadStatus" className="mt-3 text-sm text-slate-600 dark:text-slate-400 flex items-center justify-between bg-slate-50 dark:bg-slate-700/50 p-2 rounded-md">
          <span>Selected file: <strong className="font-medium text-sky-700 dark:text-sky-400">{selectedFileName}</strong>
            {/* Removed image extraction count message */}
          </span>
          <button
            onClick={clearSelectedFile}
            type="button"
            className="ml-2 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-semibold text-xs p-1 rounded-full hover:bg-red-100 dark:hover:bg-red-700/50 transition-colors"
            aria-label="Clear selected file"
            title="Clear selected file"
            disabled={currentOverallLoading}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {isParsingFile && (
        <div className="mt-3 text-sm text-sky-700 dark:text-sky-400 flex items-center">
          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-sky-700 dark:text-sky-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Processing file text, please wait...
        </div>
      )}


      <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="flex flex-col sm:flex-row w-full sm:w-auto space-y-3 sm:space-y-0 sm:space-x-3">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept=".txt,.csv,.md,text/plain,text/csv,text/markdown,application/pdf"
            aria-hidden="true"
            tabIndex={-1} 
          />
          <button
            onClick={handleUploadClick}
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 text-white font-medium rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 dark:focus:ring-blue-500 focus:ring-opacity-50 disabled:opacity-60 flex items-center justify-center space-x-2"
            disabled={currentOverallLoading}
            aria-label="Upload a report file in .txt, .csv, .md, or .pdf format (max 50MB)"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.338-2.32 5.75 5.75 0 011.344 11.098" />
            </svg>
            <span>Upload Report File</span>
          </button>
          <button
            onClick={handleUseExample}
            type="button"
            className="w-full sm:w-auto px-5 py-2.5 bg-slate-200 hover:bg-slate-300 dark:bg-slate-600 dark:hover:bg-slate-500 text-slate-700 dark:text-slate-200 font-medium rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-slate-400 dark:focus:ring-slate-500 focus:ring-opacity-50 disabled:opacity-60"
            disabled={currentOverallLoading}
            aria-label="Load example sustainability report text into the text area"
          >
            Load Example Text
          </button>
        </div>
        
        <button
          onClick={onSubmit}
          type="button"
          className="w-full sm:w-auto px-8 py-3 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-semibold rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-600 focus:ring-opacity-75 disabled:bg-sky-300 dark:disabled:bg-sky-700 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          disabled={currentOverallLoading || !reportData.text.trim()}
          aria-label="Extract ESG metrics from the provided text"
        >
          {isLoading && !isParsingFile ? ( 
            <>
              <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Loading...</span>
            </>
          ) : isParsingFile ? ( 
            <>
             <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Processing File...</span>
            </>
          ) : (
            <span>Extract ESG Metrics</span>
          )}
        </button>
      </div>
    </div>
  );
};

export default ReportInput;