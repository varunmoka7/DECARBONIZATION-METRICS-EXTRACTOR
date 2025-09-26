
import React from 'react';
import { ExtractedLeverData, LeverKey, LeverKPI } from '../types';
import KpiCard from './KpiCard'; // Uses the refactored KpiCard
import { LEVER_DETAILS } from '../constants';
import { exportV2KpisToCsv } from '../utils/csvExporter';

// Icons (retained)
const BarChartIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
  </svg>
);

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className || "w-5 h-5"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);


interface LeverSectionProps {
  leverKey: LeverKey;
  kpis: LeverKPI[] | undefined;
}

const LeverSection: React.FC<LeverSectionProps> = ({ leverKey, kpis }) => {
  const { title, description } = LEVER_DETAILS[leverKey];
  
  const groupedKpis = kpis?.reduce((acc, kpi) => {
    if (!acc[kpi.name]) {
      acc[kpi.name] = [];
    }
    acc[kpi.name].push(kpi);
    return acc;
  }, {} as Record<string, LeverKPI[]>);

  const hasGroupedKpis = groupedKpis && Object.keys(groupedKpis).length > 0;

  return (
    <section className="mb-12 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-700/50 border-l-4 border-blue-500 dark:border-blue-500">
      <div className="flex items-start text-2xl font-semibold mb-2 text-blue-700 dark:text-blue-400">
        <BarChartIcon className="w-7 h-7 mr-3 mt-1 text-blue-600 dark:text-blue-400 flex-shrink-0" />
        <div>
          <h2 className="leading-tight">{title}</h2>
          <p className="text-sm font-normal text-slate-600 dark:text-slate-300 mt-1">{description}</p>
        </div>
      </div>
      
      {!hasGroupedKpis ? (
        <p className="text-slate-500 dark:text-slate-400 mt-4">No specific KPIs extracted for this lever from the provided text.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 mt-5"> {/* Adjusted grid for wider cards */}
          {Object.entries(groupedKpis!)
            .sort(([nameA], [nameB]) => nameA.localeCompare(nameB))
            .map(([metricName, kpiItems]) => (
              <KpiCard key={metricName} metricName={metricName} kpiItems={kpiItems} />
          ))}
        </div>
      )}
    </section>
  );
};

interface LeverKpiDisplayProps {
  data: ExtractedLeverData | null;
}

const LeverKpiDisplay: React.FC<LeverKpiDisplayProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  const allLeverKeys = Object.values(LeverKey);
  const hasAnyData = allLeverKeys.some(key => data[key] && data[key]!.length > 0);

  const handleDownloadCsv = () => {
    exportV2KpisToCsv(data);
  };

  if (!hasAnyData) {
    return (
      <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl dark:shadow-slate-700/50 text-center">
        <svg className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
           <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">No Specific Carbon Lever KPIs Found</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          The AI analyzed the report but could not identify KPIs matching the predefined carbon reduction levers, or the relevant sections might be missing. 
          Consider revising the input text or ensure it contains clear, quantifiable data related to the 10 carbon levers.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleDownloadCsv}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-500 dark:hover:bg-blue-400 text-white font-medium rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 focus:ring-opacity-75 flex items-center space-x-2"
          aria-label="Download carbon lever KPIs as CSV"
        >
          <DownloadIcon />
          <span>Download CSV</span>
        </button>
      </div>
      <div className="space-y-10">
        {allLeverKeys.map(leverKey => (
          <LeverSection 
            key={leverKey}
            leverKey={leverKey}
            kpis={data[leverKey]}
          />
        ))}
      </div>
    </div>
  );
};

export default LeverKpiDisplay;
