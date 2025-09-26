
import React from 'react';
import { ExtractedBankingData, BankingLeverCategory, BankingKPI } from '../types';
import KpiCard from './KpiCard'; // Uses the refactored KpiCard
import { BANKING_LEVER_CATEGORIES } from '../constants';
import { exportV3KpisToCsv } from '../utils/csvExporter';

// Icons (retained)
const BankIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21V3m0 18H3a2 2 0 01-2-2V5a2 2 0 012-2h18a2 2 0 012 2v14a2 2 0 01-2 2H12zM3 10h18M3 14h18M9 7h6" />
  </svg>
);

const CogIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5m-15 0a7.5 7.5 0 1115 0m-15 0H3m18 0h-1.5M12 9.75v1.5m0 0v1.5m0-1.5a1.5 1.5 0 010-3m0 3a1.5 1.5 0 000 3m0-3H9.75m2.25 0H14.25m-4.5 0a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m0 0H6.75m2.25 0H11.25m5.625-4.5a1.125 1.125 0 11-2.25 0 1.125 1.125 0 012.25 0zM12 4.875A2.625 2.625 0 1012 10.125 2.625 2.625 0 0012 4.875z" />
  </svg>
);

const GlobeAltIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className || "w-6 h-6"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.72 9.72 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75S12.615 6 18 6c1.713 0 3.323.454 4.752 1.249m-5.092 7.501A9.724 9.724 0 0018 15.75c-5.385 0-9.75-4.365-9.75-9.75S12.615 6 18 6c1.713 0 3.323.454 4.752 1.249m-5.092 7.501l4.83-4.83" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m4.5 9a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
  </svg>
);

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className || "w-5 h-5"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);


const CATEGORY_ICONS: Record<BankingLeverCategory, React.FC<{className?: string}>> = {
  [BankingLeverCategory.FINANCED_EMISSIONS]: BankIcon,
  [BankingLeverCategory.OPERATIONAL_SCOPE_3]: CogIcon,
  [BankingLeverCategory.CLIENT_MARKET_INFLUENCE]: GlobeAltIcon,
};

const CATEGORY_COLORS: Record<BankingLeverCategory, { text: string; darkText: string; border: string; darkBorder: string }> = {
  [BankingLeverCategory.FINANCED_EMISSIONS]: { text: "text-emerald-700", darkText: "dark:text-emerald-400", border: "border-emerald-500", darkBorder: "dark:border-emerald-500" },
  [BankingLeverCategory.OPERATIONAL_SCOPE_3]: { text: "text-amber-700", darkText: "dark:text-amber-400", border: "border-amber-500", darkBorder: "dark:border-amber-500" },
  [BankingLeverCategory.CLIENT_MARKET_INFLUENCE]: { text: "text-cyan-700", darkText: "dark:text-cyan-400", border: "border-cyan-500", darkBorder: "dark:border-cyan-500" },
};

interface BankingCategorySectionProps {
  categoryKey: BankingLeverCategory;
  kpis: BankingKPI[] | undefined;
}

const BankingCategorySection: React.FC<BankingCategorySectionProps> = ({ categoryKey, kpis }) => {
  const { title, description } = BANKING_LEVER_CATEGORIES[categoryKey];
  const IconComponent = CATEGORY_ICONS[categoryKey];
  const colorClasses = CATEGORY_COLORS[categoryKey];
  
  const groupedKpis = kpis?.reduce((acc, kpi) => {
    if (!acc[kpi.name]) {
      acc[kpi.name] = [];
    }
    acc[kpi.name].push(kpi);
    return acc;
  }, {} as Record<string, BankingKPI[]>);

  const hasGroupedKpis = groupedKpis && Object.keys(groupedKpis).length > 0;

  return (
    <section className={`mb-12 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-700/50 border-l-4 ${colorClasses.border} ${colorClasses.darkBorder}`}>
      <div className={`flex items-start text-2xl font-semibold mb-2 ${colorClasses.text} ${colorClasses.darkText}`}>
        {IconComponent && <IconComponent className={`w-7 h-7 mr-3 mt-1 flex-shrink-0`} />}
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

interface BankingKpiDisplayProps {
  data: ExtractedBankingData | null;
}

const BankingKpiDisplay: React.FC<BankingKpiDisplayProps> = ({ data }) => {
  if (!data) {
    return null;
  }

  const allCategoryKeys = Object.values(BankingLeverCategory);
  const hasAnyData = allCategoryKeys.some(key => data[key] && data[key]!.length > 0);

  const handleDownloadCsv = () => {
    exportV3KpisToCsv(data);
  };

  if (!hasAnyData) {
    return (
      <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl dark:shadow-slate-700/50 text-center">
        <svg className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
           <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
        </svg>
        <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">No Specific Banking KPIs Found</h2>
        <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
          The AI analyzed the report but could not identify KPIs matching the predefined banking sector framework, or the relevant sections might be missing. 
          Consider revising the input text or ensure it contains clear, quantifiable data related to banking ESG levers.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-10">
       <div className="mb-6 flex justify-end">
        <button
          onClick={handleDownloadCsv}
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-medium rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:ring-opacity-75 flex items-center space-x-2"
          aria-label="Download banking sector KPIs as CSV"
        >
          <DownloadIcon />
          <span>Download CSV</span>
        </button>
      </div>
      <div className="space-y-10">
        {allCategoryKeys.map(categoryKey => (
          <BankingCategorySection 
            key={categoryKey}
            categoryKey={categoryKey}
            kpis={data[categoryKey]}
          />
        ))}
      </div>
    </div>
  );
};

export default BankingKpiDisplay;
