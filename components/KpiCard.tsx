
import React, { useState } from 'react';
import { KPI, SimpleKPI } from '../types';

// Helper to check if an item is a full KPI or SimpleKPI
const isFullKpi = (item: KPI | SimpleKPI): item is KPI => {
  return 'category_detail' in item || 'target_value' in item || 'baseline_value' in item;
};

interface KpiTableRowProps {
  item: KPI | SimpleKPI;
}

const KpiTableRow: React.FC<KpiTableRowProps> = ({ item }) => {
  const [showDetails, setShowDetails] = useState(false);
  const fullKpi = isFullKpi(item) ? item : null;
  const referenceContent = item.reference?.trim();

  const hasAdditionalDetails = 
    fullKpi && (
      fullKpi.qualitative_notes || 
      fullKpi.methodology_standards || 
      fullKpi.data_assurance || 
      fullKpi.commitment_description || 
      fullKpi.policy_name || 
      fullKpi.scope_boundary_details
    );

  return (
    <>
      <tr className="border-b border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
        <td className="py-3 px-4 text-sm text-slate-700 dark:text-slate-300">{item.year || 'N/A'}</td>
        <td className="py-3 px-4 text-sm font-semibold text-slate-800 dark:text-slate-100 break-words">{String(item.value)}</td>
        <td className="py-3 px-4 text-xs text-slate-600 dark:text-slate-400 break-words">{item.metric_type}</td>
        <td className="py-3 px-4 text-center">
          {(referenceContent || hasAdditionalDetails) && (
            <button
              onClick={() => setShowDetails(prev => !prev)}
              className="text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium py-1 px-2 rounded hover:bg-sky-100 dark:hover:bg-sky-700/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400"
              aria-expanded={showDetails}
              aria-controls={`details-${item.id}`}
            >
              {showDetails ? 'Hide Details' : 'Show Details'}
            </button>
          )}
        </td>
      </tr>
      {showDetails && (referenceContent || hasAdditionalDetails) && (
        <tr className="bg-slate-50 dark:bg-slate-700/40">
          <td colSpan={4} className="p-0">
            <div id={`details-${item.id}`} className="p-4 space-y-3">
              {referenceContent && (
                <div className="p-2.5 bg-slate-100 dark:bg-slate-700/70 border-l-2 border-sky-300 dark:border-sky-500 text-slate-600 dark:text-slate-300 rounded-r-md italic text-xs leading-relaxed shadow-inner">
                  <strong>Reference:</strong> "{referenceContent}"
                </div>
              )}
              {fullKpi && (
                <div className="space-y-2 text-xs">
                  {fullKpi.target_value && (
                    <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md">
                      <p className="text-emerald-700 dark:text-emerald-400 font-medium">
                        Target{fullKpi.target_year ? ` (${fullKpi.target_year})` : ''}: {String(fullKpi.target_value)}
                        {fullKpi.baseline_value && (
                          <span className="text-slate-500 dark:text-slate-400 font-normal">
                            {' '} (Baseline: {String(fullKpi.baseline_value)}{fullKpi.baseline_year ? ` in ${fullKpi.baseline_year}` : ''})
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  {fullKpi.category_detail && <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md"><strong>Sub-category:</strong> {fullKpi.category_detail}</div>}
                  {fullKpi.qualitative_notes && <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md"><strong>Notes:</strong> {fullKpi.qualitative_notes}</div>}
                  {fullKpi.scope_boundary_details && <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md"><strong>Scope/Boundary:</strong> {fullKpi.scope_boundary_details}</div>}
                  {fullKpi.methodology_standards && <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md"><strong>Methodology/Standard:</strong> {fullKpi.methodology_standards}</div>}
                  {fullKpi.data_assurance && <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md"><strong>Data Assurance:</strong> {fullKpi.data_assurance}</div>}
                  {fullKpi.policy_name && <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md"><strong>Related Policy:</strong> {fullKpi.policy_name}</div>}
                  {fullKpi.commitment_description && <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md"><strong>Commitment:</strong> {fullKpi.commitment_description}</div>}
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

interface GroupedKpiCardProps {
  metricName: string;
  kpiItems: (KPI | SimpleKPI)[];
}

const KpiCard: React.FC<GroupedKpiCardProps> = ({ metricName, kpiItems }) => {
  if (!kpiItems || kpiItems.length === 0) {
    return null;
  }

  // Sort items by year, most recent first. Handle cases where year might be string or number or undefined.
  const sortedKpiItems = [...kpiItems].sort((a, b) => {
    const yearA = a.year ? parseInt(String(a.year), 10) : 0;
    const yearB = b.year ? parseInt(String(b.year), 10) : 0;
    if (isNaN(yearA) && isNaN(yearB)) return 0;
    if (isNaN(yearA)) return 1; // Put items without a valid year (or NaN) last
    if (isNaN(yearB)) return -1;
    return yearB - yearA; // Sort descending
  });

  return (
    <div className="bg-white dark:bg-slate-800 p-5 rounded-lg shadow-lg hover:shadow-xl dark:shadow-slate-700/50 dark:hover:shadow-sky-600/30 transition-all duration-300 border border-slate-200 dark:border-slate-700 flex flex-col h-full">
      <h4 className="text-lg font-semibold text-sky-700 dark:text-sky-400 break-words mb-3 leading-tight border-b border-slate-200 dark:border-slate-700 pb-2">
        {metricName}
      </h4>
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="bg-slate-50 dark:bg-slate-700/50">
            <tr>
              <th className="py-2 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Year</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Value</th>
              <th className="py-2 px-4 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Metric Type</th>
              <th className="py-2 px-4 text-center text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">Details</th>
            </tr>
          </thead>
          <tbody>
            {sortedKpiItems.map((item) => (
              <KpiTableRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KpiCard;
