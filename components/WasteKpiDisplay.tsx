
import React, { useState } from 'react';
import { 
    ExtractedWasteData, 
    EnhancedWasteMetricBase,
    EnhancedPolicyFramework, 
    EnhancedGovernanceStructure,
    ExtractionSummary,
    QualityControlNotes
} from '../types';
import { ENHANCED_WASTE_FRAMEWORK_DETAILS } from '../constants';
import { exportV5WasteKpisToCsv } from '../utils/csvExporter';

// --- ICONS ---
const RecycleIcon: React.FC<{className?: string}> = ({className}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
  </svg>
);

const DownloadIcon: React.FC<{className?: string}> = ({className}) => (
  <svg className={className || "w-5 h-5"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" >
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
  </svg>
);

const ChevronDownIcon: React.FC<{className?: string, isRotated?: boolean}> = ({className, isRotated}) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className={`${className || "w-5 h-5"} transition-transform duration-200 ${isRotated ? 'rotate-180' : ''}`}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
  </svg>
);

const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

const ExclamationTriangleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
);

const InfoCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
  </svg>
);

const BuildingLibraryIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V5.25A2.25 2.25 0 0019.5 3h-15A2.25 2.25 0 002.25 5.25V21" />
  </svg>
);

// Reusable Collapsible Container
const Collapsible: React.FC<{ title: string, children: React.ReactNode, defaultOpen?: boolean, badge?: string }> = ({ title, children, defaultOpen = false, badge }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
        <div className="bg-slate-50 dark:bg-slate-700/50 rounded-lg overflow-hidden shadow-inner">
            <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center p-3 text-left font-semibold text-slate-700 dark:text-slate-200">
                <div className="flex items-center">
                    <span>{title}</span>
                    {badge && <span className="ml-2 text-xs font-bold bg-sky-200 dark:bg-sky-700 text-sky-800 dark:text-sky-200 py-0.5 px-2 rounded-full">{badge}</span>}
                </div>
                <ChevronDownIcon isRotated={isOpen} />
            </button>
            {isOpen && <div className="p-3 border-t border-slate-200 dark:border-slate-600">{children}</div>}
        </div>
    );
};


// Summary & QC Card
const SummaryAndQCCard: React.FC<{ summary?: ExtractionSummary, notes?: QualityControlNotes }> = ({ summary, notes }) => {
    if (!summary && !notes) return null;
    const { title, description } = ENHANCED_WASTE_FRAMEWORK_DETAILS.extraction_summary;
    const { title: qcTitle } = ENHANCED_WASTE_FRAMEWORK_DETAILS.quality_control_notes;

    const summaryItems = summary ? [
        { label: 'Total Metrics Found', value: summary.total_metrics_found },
        { label: 'Duplications Eliminated', value: summary.duplications_eliminated, icon: <CheckCircleIcon className="w-4 h-4 text-green-500" /> },
        { label: 'Governance Items Prioritized', value: summary.governance_items_prioritized },
        { label: 'Treatment Methods Covered', value: summary.treatment_methods_covered.join(', ') || 'None' },
        { label: 'Quality Flags', value: summary.quality_flags.length > 0 ? summary.quality_flags.join('; ') : 'None', icon: summary.quality_flags.length > 0 ? <ExclamationTriangleIcon className="w-4 h-4 text-yellow-500" /> : <CheckCircleIcon className="w-4 h-4 text-green-500" /> },
    ] : [];

    const qcItems = notes ? [
        { label: 'Duplications Resolved', items: notes.duplications_resolved },
        { label: 'Classification Adjustments', items: notes.classification_adjustments },
        { label: 'Missing Data Flags', items: notes.missing_data_flags },
        { label: 'Clarification Needed', items: notes.clarification_needed },
    ].filter(i => i.items && i.items.length > 0) : [];

    return (
        <FrameworkSection title={title} description={description} icon={<InfoCircleIcon className="w-7 h-7 text-sky-600 dark:text-sky-400" />} colorClass="sky">
            {summary && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {summaryItems.map(item => (
                        <div key={item.label} className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg flex items-start">
                            {item.icon && <span className="mr-2 mt-0.5 flex-shrink-0">{item.icon}</span>}
                            <div>
                                <strong className="block text-slate-800 dark:text-slate-100">{item.label}:</strong>
                                <span className="text-slate-600 dark:text-slate-300 break-words">{String(item.value)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {qcItems.length > 0 && (
                <div className="mt-4">
                     <Collapsible title={qcTitle} badge={`${qcItems.reduce((acc, i) => acc + (i.items?.length || 0), 0)} items`}>
                        <div className="space-y-3 text-xs">
                            {qcItems.map(item => (
                                <div key={item.label}>
                                    <p className="font-semibold text-slate-700 dark:text-slate-200">{item.label}:</p>
                                    <ul className="list-disc list-inside pl-2 mt-1 text-slate-600 dark:text-slate-300 space-y-1">
                                        {item.items.map((note, idx) => <li key={idx}>{note}</li>)}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </Collapsible>
                </div>
            )}
        </FrameworkSection>
    );
};

// Governance Display
const GovernanceDisplay: React.FC<{ policies?: EnhancedPolicyFramework[], structures?: EnhancedGovernanceStructure[] }> = ({ policies, structures }) => {
    if ((!policies || policies.length === 0) && (!structures || structures.length === 0)) return null;
    
    const { title, description } = ENHANCED_WASTE_FRAMEWORK_DETAILS.governanceIntelligence;

    return (
        <FrameworkSection title={title} description={description} icon={<BuildingLibraryIcon className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />} colorClass="indigo">
            <div className="space-y-4">
                {policies && policies.length > 0 && (
                    <Collapsible title="Policy Frameworks" defaultOpen badge={`${policies.length}`}>
                        <div className="space-y-4">
                            {policies.map(p => (
                                <div key={p.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md">
                                    <p className="font-semibold text-indigo-800 dark:text-indigo-300">{p.policyName || 'Unnamed Policy'}</p>
                                    <ul className="text-xs mt-2 space-y-1">
                                        {p.scope && <li><strong>Scope:</strong> {p.scope}</li>}
                                        {p.boardApproved !== undefined && <li><strong>Board Approved:</strong> {p.boardApproved ? 'Yes' : 'No'}</li>}
                                        {p.carbonTargetsIncluded !== undefined && <li><strong>Carbon Targets Included:</strong> {p.carbonTargetsIncluded ? 'Yes' : 'No'}</li>}
                                        {p.treatmentMethodsCovered && <li><strong>Treatments Covered:</strong> {p.treatmentMethodsCovered.join(', ')}</li>}
                                        {p.scopeEmissionsAddressed && <li><strong>Scopes Addressed:</strong> {p.scopeEmissionsAddressed.join(', ')}</li>}
                                        {p.missingElements && <li className="text-yellow-700 dark:text-yellow-400"><strong>Missing Elements:</strong> {p.missingElements}</li>}
                                        {p.reference && <li className="italic text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-600 mt-2">"{p.reference}"</li>}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </Collapsible>
                )}
                 {structures && structures.length > 0 && (
                    <Collapsible title="Governance Structures" defaultOpen badge={`${structures.length}`}>
                       <div className="space-y-4">
                            {structures.map(s => (
                                <div key={s.id} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-md">
                                    <p className="font-semibold text-indigo-800 dark:text-indigo-300">{s.roleTitle || 'General Structure'}</p>
                                     <ul className="text-xs mt-2 space-y-1">
                                        {s.reportingLevel && <li><strong>Reporting Level:</strong> {s.reportingLevel}</li>}
                                        {s.carbonWasteIntegration !== undefined && <li><strong>Carbon-Waste Integration:</strong> {s.carbonWasteIntegration ? 'Yes' : 'No'}</li>}
                                        {s.boardReporting !== undefined && <li><strong>Reports to Board:</strong> {s.boardReporting ? 'Yes' : 'No'}</li>}
                                        {s.treatmentOversight && <li><strong>Treatment Oversight:</strong> {s.treatmentOversight.join(', ')}</li>}
                                        {s.scopeEmissionsAccountability && <li><strong>Scope Accountability:</strong> {s.scopeEmissionsAccountability.join(', ')}</li>}
                                        {s.reference && <li className="italic text-slate-500 dark:text-slate-400 pt-1 border-t border-slate-200 dark:border-slate-600 mt-2">"{s.reference}"</li>}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </Collapsible>
                )}
            </div>
        </FrameworkSection>
    );
}

// Metric Table
const MetricDisplayTable: React.FC<{ metrics: EnhancedWasteMetricBase[] | undefined }> = ({ metrics }) => {
    const [expanded, setExpanded] = useState<Record<string, boolean>>({});
    if (!metrics || metrics.length === 0) {
        return <p className="text-xs text-slate-500 dark:text-slate-400 italic">No metrics in this category.</p>;
    }

    const hasColumn = (key: string) => metrics.some(m => (m as any)[key] !== undefined && (m as any)[key] !== null && String((m as any)[key]).trim() !== '');
    const showYear = hasColumn('year');
    const showScope = hasColumn('scope');
    const showEmissionSource = hasColumn('emission_source');
    const showTreatmentMethod = hasColumn('treatment_method');
    
    return (
        <div className="overflow-x-auto text-xs">
            <table className="min-w-full table-fixed">
                <thead className="bg-slate-100 dark:bg-slate-700/70">
                    <tr>
                        <th className="p-2 w-1/4 text-left font-medium">Metric</th>
                        <th className="p-2 w-1/6 text-left font-medium">Value</th>
                        <th className="p-2 w-1/6 text-left font-medium">Unit</th>
                        {showYear && <th className="p-2 w-1/12 text-left font-medium">Year</th>}
                        {showScope && <th className="p-2 w-1/12 text-left font-medium">Scope</th>}
                        {showEmissionSource && <th className="p-2 w-1/6 text-left font-medium">Source</th>}
                        {showTreatmentMethod && <th className="p-2 w-1/6 text-left font-medium">Treatment</th>}
                        <th className="p-2 w-[10%] text-center font-medium">Details</th>
                    </tr>
                </thead>
                <tbody>
                    {metrics.map(metric => {
                        const m = metric as any;
                        const hasDetails = m.reference || m.material_type || m.carbon_equivalent || m.carbon_benefit;
                        const isExpanded = expanded[m.id] || false;
                        return (
                            <React.Fragment key={m.id}>
                                <tr className="border-b border-slate-200 dark:border-slate-600">
                                    <td className="p-2 font-semibold break-words">{m.metric || m.emission_source}</td>
                                    <td className="p-2 break-words">{String(m.value)}</td>
                                    <td className="p-2 break-words">{m.unit}</td>
                                    {showYear && <td className="p-2">{m.year || 'N/A'}</td>}
                                    {showScope && <td className="p-2">{m.scope || 'N/A'}</td>}
                                    {showEmissionSource && <td className="p-2 break-words">{m.emission_source || 'N/A'}</td>}
                                    {showTreatmentMethod && <td className="p-2 break-words">{m.treatment_method || 'N/A'}</td>}
                                    <td className="p-2 text-center">
                                        {hasDetails && <button onClick={() => setExpanded(prev => ({...prev, [m.id]: !prev[m.id]}))} className="text-sky-600 dark:text-sky-400 hover:underline font-medium">{isExpanded ? 'Hide' : 'Show'}</button>}
                                    </td>
                                </tr>
                                {isExpanded && hasDetails && (
                                     <tr className="bg-slate-100 dark:bg-slate-700/50">
                                        <td colSpan={10} className="p-3">
                                            <div className="space-y-1">
                                                {m.reference && <p><strong>Reference:</strong> <em className="italic">"{m.reference}"</em></p>}
                                                {m.material_type && <p><strong>Material Type:</strong> {m.material_type}</p>}
                                                {m.carbon_equivalent && <p><strong>Carbon Equivalent:</strong> {m.carbon_equivalent}</p>}
                                                {m.carbon_benefit && <p><strong>Carbon Benefit:</strong> {m.carbon_benefit}</p>}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

// Section Wrapper
const FrameworkSection: React.FC<{ title: string, description: string, children: React.ReactNode, icon?: React.ReactNode, colorClass?: string }> = ({ title, description, children, icon, colorClass = 'green' }) => (
    <section className={`mb-12 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-700/50 border-l-4 border-${colorClass}-500 dark:border-${colorClass}-500`}>
      <div className={`flex items-start text-2xl font-semibold mb-2 text-${colorClass}-700 dark:text-${colorClass}-400`}>
        {icon && <span className="mr-3 mt-1 flex-shrink-0">{icon}</span>}
        <div>
          <h2 className="leading-tight">{title}</h2>
          <p className="text-sm font-normal text-slate-600 dark:text-slate-300 mt-1">{description}</p>
        </div>
      </div>
      <div className="mt-4 space-y-4">{children}</div>
    </section>
);


// --- MAIN DISPLAY COMPONENT ---
const WasteKpiDisplay: React.FC<{ data: ExtractedWasteData | null }> = ({ data }) => {
    if (!data) return null;

    const handleDownloadCsv = () => {
        exportV5WasteKpisToCsv(data);
    };

    const hasData = data && Object.keys(data).length > 0 && Object.values(data).some(v => v && (Array.isArray(v) ? v.length > 0 : (typeof v === 'object' && Object.keys(v).length > 0) ));
    
    if (!hasData) {
        return (
             <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl dark:shadow-slate-700/50 text-center">
                <RecycleIcon className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" />
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">No Specific Waste Management KPIs Found</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                    The AI analyzed the report but could not identify KPIs matching the Waste Management framework.
                </p>
            </div>
        );
    }
    
    const { extraction_summary, quality_control_notes, governanceIntelligence, ...metricSections } = data;

    return (
        <div className="mt-10">
            <div className="mb-6 flex justify-end">
                <button onClick={handleDownloadCsv} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-400 text-white font-medium rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 dark:focus:ring-emerald-600 focus:ring-opacity-75 flex items-center space-x-2">
                    <DownloadIcon />
                    <span>Download CSV</span>
                </button>
            </div>
            
            <SummaryAndQCCard summary={extraction_summary} notes={quality_control_notes} />
            
            <GovernanceDisplay policies={governanceIntelligence?.policyFrameworks} structures={governanceIntelligence?.governanceStructures} />

            {Object.entries(metricSections).map(([sectionKey, sectionData]) => {
                if (!sectionData) return null;
                const details = ENHANCED_WASTE_FRAMEWORK_DETAILS[sectionKey];
                if (!details) return null;

                const subSections = Object.entries(sectionData);
                 if(subSections.length === 0) return null;
                
                return (
                    <FrameworkSection key={sectionKey} title={details.title} description={details.description} icon={<RecycleIcon className="w-7 h-7 text-emerald-600 dark:text-emerald-400" />} colorClass="emerald">
                        {subSections.map(([subKey, subData]) => {
                             if (!subData) return null;
                             const subSectionTitle = subKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                             if (Array.isArray(subData) && subData.length > 0) {
                                 return <Collapsible key={subKey} title={subSectionTitle} defaultOpen badge={`${subData.length}`}><MetricDisplayTable metrics={subData} /></Collapsible>
                             }
                             if (typeof subData === 'object' && subData !== null && Object.values(subData).some(v => Array.isArray(v) && v.length > 0)) {
                                 return (
                                     <Collapsible key={subKey} title={subSectionTitle} defaultOpen>
                                         <div className="space-y-3">
                                             {Object.entries(subData).map(([childKey, childData]) => {
                                                 if (Array.isArray(childData) && childData.length > 0) {
                                                      const childTitle = childKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                                                      return <Collapsible key={childKey} title={childTitle} defaultOpen badge={`${childData.length}`}><MetricDisplayTable metrics={childData} /></Collapsible>
                                                 }
                                                 return null;
                                             })}
                                         </div>
                                     </Collapsible>
                                 )
                             }
                             return null;
                        })}
                    </FrameworkSection>
                );
            })}
        </div>
    );
};

export default WasteKpiDisplay;
