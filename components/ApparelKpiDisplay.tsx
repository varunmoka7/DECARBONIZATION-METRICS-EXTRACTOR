
import React from 'react';
import { ExtractedApparelData, ApparelCategoryKey, ApparelKPI } from '../types';
import KpiCard from './KpiCard'; // Uses the refactored KpiCard
import { APPAREL_CATEGORY_DETAILS } from '../constants';
import { exportV4ApparelKpisToCsv } from '../utils/csvExporter';

// Icons (retained)
const ShirtIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12.75 3.03v.568c0 .334.148.65.405.864l1.068.89c.442.369.535 1.01.216 1.49l-.51.766a2.25 2.25 0 01-1.161.886l-.143.048a1.107 1.107 0 00-.57 1.664c.369.555.169 1.307-.427 1.605L9 13.125l.423 1.059a.956.956 0 01-1.652.928l-.679-.906a1.125 1.125 0 00-1.906.172L4.5 15.75l-.612.153M12.75 3.031a9 9 0 00-8.862 12.872M12.75 3.031a9 9 0 016.69 14.036m0 0l-.177.177a2.25 2.25 0 01-3.183 0l-1.178-1.178a2.25 2.25 0 01-3.183 0L9.423 15.65c-.832.092-1.647.319-2.399.664l-.498.166a2.25 2.25 0 00-1.766 1.973V21a1.125 1.125 0 001.125 1.125h10.5A1.125 1.125 0 0021 21v-1.756a2.25 2.25 0 00-1.766-1.973l-.498-.166c-.752-.345-1.567-.572-2.399-.664l-.214-.031a2.25 2.25 0 01-2.228 0l-.214.031c-.832.092-1.647.319-2.399-.664M18 11.25a2.25 2.25 0 00-2.25-2.25H8.25A2.25 2.25 0 006 11.25v2.625c0 .621.504 1.125 1.125 1.125h9.750c.621 0 1.125-.504 1.125-1.125V11.25z" />
  </svg>
);

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className || "w-5 h-5"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

interface ApparelCategorySectionProps {
  categoryKey: ApparelCategoryKey;
  kpis: ApparelKPI[] | undefined;
}

const ApparelCategorySection: React.FC<ApparelCategorySectionProps> = ({ categoryKey, kpis }) => {
  const { title, description } = APPAREL_CATEGORY_DETAILS[categoryKey];
  
  const groupedKpis = kpis?.reduce((acc, kpi) => {
    if (!acc[kpi.name]) {
      acc[kpi.name] = [];
    }
    acc[kpi.name].push(kpi);
    return acc;
  }, {} as Record<string, ApparelKPI[]>);

  const hasGroupedKpis = groupedKpis && Object.keys(groupedKpis).length > 0;

  const themeColorClass = "purple"; 
  const textColorClass = `text-${themeColorClass}-700 dark:text-${themeColorClass}-400`;
  const borderColorClass = `border-${themeColorClass}-500 dark:border-${themeColorClass}-500`;
  const iconColorClass = `text-${themeColorClass}-600 dark:text-${themeColorClass}-400`;

  return (
    <section className={`mb-12 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-700/50 border-l-4 ${borderColorClass}`}>
      <div className={`flex items-start text-2xl font-semibold mb-2 ${textColorClass}`}>
        <ShirtIcon className={`w-7 h-7 mr-3 mt-1 ${iconColorClass} flex-shrink-0`} />
        <div>
          <h2 className="leading-tight">{title}</h2>
          <p className="text-sm font-normal text-slate-600 dark:text-slate-300 mt-1">{description}</p>
        </div>
      </div>
      
      {!hasGroupedKpis ? (
        <p className="text-slate-500 dark:text-slate-400 mt-4">No specific KPIs extracted for this category from the provided text.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-2 gap-5 mt-5"> {/* Adjusted grid */}
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

interface ApparelKpiDisplayProps {
  data: ExtractedApparelData | null;
}

const ApparelKpiDisplay: React.FC<ApparelKpiDisplayProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  const allCategoryKeys = Object.values(ApparelCategoryKey);
  const hasAnyData = allCategoryKeys.some(key => data[key] && data[key]!.length > 0);

  const handleDownloadCsv = () => {
    exportV4ApparelKpisToCsv(data);
  };

  if (!hasAnyData) {
    return (
      <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl dark:shadow-slate-700/50 text-center">
        <svg className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
           <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">No Specific Apparel Sector KPIs Found</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          The AI analyzed the report but could not identify KPIs matching the predefined apparel sector environmental categories.
          Consider revising the input text or ensure it contains clear, quantifiable data relevant to the apparel categories.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
      <div className="mb-6 flex justify-end">
        <button
          onClick={handleDownloadCsv}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-400 text-white font-medium rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-600 focus:ring-opacity-75 flex items-center space-x-2"
          aria-label="Download apparel sector KPIs as CSV"
        >
          <DownloadIcon />
          <span>Download CSV</span>
        </button>
      </div>
      <div className="space-y-10">
        {allCategoryKeys.map(categoryKey => (
          <ApparelCategorySection 
            key={categoryKey}
            categoryKey={categoryKey}
            kpis={data[categoryKey]}
          />
        ))}
      </div>
    </div>
  );
};

export default ApparelKpiDisplay;
