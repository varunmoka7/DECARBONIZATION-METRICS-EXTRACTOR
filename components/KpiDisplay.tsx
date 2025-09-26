
import React, { useMemo, useState } from 'react';
import { ExtractedCarbonData, KPI } from '../types';
import { exportCarbonMetricsToCsv } from '../utils/csvExporter';

// --- ICONS ---
const DownloadIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg className={className || "w-5 h-5"} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
    </svg>
);

const ChevronDownIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className={className || 'h-4 w-4 shrink-0 transition-transform duration-200'}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
    </svg>
);

// --- Shadcn-UI like components (self-contained & styled with Tailwind) ---

const Card: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-50 rounded-xl border bg-card text-card-foreground shadow-sm ${className || ''}`}>
        {children}
    </div>
);

const CardHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className || ''}`}>{children}</div>
);

const CardTitle: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className || ''}`}>{children}</h3>
);

const CardDescription: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <p className={`text-sm text-slate-500 dark:text-slate-400 ${className || ''}`}>{children}</p>
);

const CardContent: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => (
    <div className={`p-6 pt-0 ${className || ''}`}>{children}</div>
);

const AccordionContext = React.createContext<{ selected: string[], toggle: (value: string) => void }>({ selected: [], toggle: () => {} });

const Accordion: React.FC<{ children: React.ReactNode, type?: 'single' | 'multiple', defaultValue?: string | string[], className?: string }> = ({ children, defaultValue, type = 'single', className }) => {
    const [selected, setSelected] = useState<string[]>(Array.isArray(defaultValue) ? defaultValue : (defaultValue ? [defaultValue] : []));
    const toggle = (value: string) => {
        setSelected(currentSelected => {
            if (type === 'multiple') {
                return currentSelected.includes(value) ? currentSelected.filter(item => item !== value) : [...currentSelected, value];
            }
            return currentSelected.includes(value) ? [] : [value];
        });
    };
    return <AccordionContext.Provider value={{ selected, toggle }}><div className={`w-full ${className || ''}`}>{children}</div></AccordionContext.Provider>;
};

const AccordionItem: React.FC<{ children: React.ReactNode, value: string, className?: string }> = ({ children, value, className }) => (
    <div className={`border-b dark:border-slate-700 ${className || ''}`}>{React.Children.map(children, child => React.isValidElement(child) ? React.cloneElement(child, { value } as any) : child)}</div>
);

const AccordionTrigger: React.FC<{ children: React.ReactNode, value?: string, className?: string }> = ({ children, value = '', className }) => {
    const { selected, toggle } = React.useContext(AccordionContext);
    const isOpen = selected.includes(value);
    return (
        <button onClick={() => toggle(value)} className={`flex w-full flex-1 items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180 ${className || ''}`} data-state={isOpen ? 'open' : 'closed'}>
            {children}
            <ChevronDownIcon />
        </button>
    );
};

const AccordionContent: React.FC<{ children: React.ReactNode, value?: string, className?: string }> = ({ children, value = '', className }) => {
    const { selected } = React.useContext(AccordionContext);
    const isOpen = selected.includes(value);
    if (!isOpen) return null;
    return <div className={`overflow-hidden text-sm transition-all pb-4 ${className || ''}`} data-state={isOpen ? 'open' : 'closed'}>{children}</div>;
};

const Table: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <div className="relative w-full overflow-auto"><table className={`w-full caption-bottom text-sm ${className || ''}`}>{children}</table></div>;
const TableHeader: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <thead className={`[&_tr]:border-b dark:[&_tr]:border-slate-700 ${className || ''}`}>{children}</thead>;
const TableBody: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <tbody className={`[&_tr:last-child]:border-0 ${className || ''}`}>{children}</tbody>;
const TableRow: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <tr className={`border-b transition-colors hover:bg-slate-100/50 dark:hover:bg-slate-800/50 ${className || ''}`}>{children}</tr>;
const TableHead: React.FC<{ children: React.ReactNode, className?: string }> = ({ children, className }) => <th className={`h-12 px-4 text-left align-middle font-medium text-slate-500 dark:text-slate-400 [&:has([role=checkbox])]:pr-0 ${className || ''}`}>{children}</th>;
const TableCell: React.FC<{ children: React.ReactNode, className?: string, colSpan?: number }> = ({ children, className, colSpan }) => <td colSpan={colSpan} className={`p-4 align-middle [&:has([role=checkbox])]:pr-0 ${className || ''}`}>{children}</td>;


// --- KPI Table Component ---

const KpiTableRowWithDetails: React.FC<{ kpi: KPI }> = ({ kpi }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const hasDetails = kpi.reference || kpi.qualitative_notes || kpi.methodology_standards || kpi.data_assurance || kpi.policy_name;

    return (
        <>
            <TableRow>
                <TableCell className="font-medium break-words pr-2">{kpi.name}</TableCell>
                <TableCell className="break-words pr-2">{String(kpi.value)}</TableCell>
                <TableCell className="text-slate-600 dark:text-slate-400 break-words pr-2">{kpi.metric_type}</TableCell>
                <TableCell className="text-center">{kpi.year || 'N/A'}</TableCell>
                <TableCell className="text-center">
                    <button onClick={() => setIsExpanded(p => !p)} className="text-xs text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 font-medium py-1 px-2 rounded-md hover:bg-sky-100 dark:hover:bg-sky-900/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-400">
                        {isExpanded ? 'Hide' : 'Details'}
                    </button>
                </TableCell>
            </TableRow>
            {isExpanded && hasDetails && (
                <TableRow className="bg-slate-50 dark:bg-slate-800/60">
                    <TableCell colSpan={5}>
                        <div className="p-2 space-y-3 text-xs">
                            {kpi.reference && (
                                <div className="p-2 bg-slate-100 dark:bg-slate-700/70 border-l-2 border-sky-300 dark:border-sky-500 rounded-r-md">
                                    <strong>Reference:</strong> <em className="italic text-slate-600 dark:text-slate-300">"{kpi.reference}"</em>
                                </div>
                            )}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {kpi.qualitative_notes && <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md"><strong>Notes:</strong> {kpi.qualitative_notes}</div>}
                                {kpi.methodology_standards && <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md"><strong>Methodology:</strong> {kpi.methodology_standards}</div>}
                                {kpi.data_assurance && <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md"><strong>Assurance:</strong> {kpi.data_assurance}</div>}
                                {kpi.policy_name && <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md"><strong>Policy:</strong> {kpi.policy_name}</div>}
                                {kpi.commitment_description && <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md"><strong>Commitment:</strong> {kpi.commitment_description}</div>}
                                {kpi.scope_boundary_details && <div className="p-2 bg-slate-100 dark:bg-slate-700/70 rounded-md"><strong>Scope/Boundary:</strong> {kpi.scope_boundary_details}</div>}
                            </div>
                        </div>
                    </TableCell>
                </TableRow>
            )}
        </>
    );
};

const KpiTable: React.FC<{ kpis: KPI[] }> = ({ kpis }) => {
    if (kpis.length === 0) {
        return <p className="text-sm text-slate-500 dark:text-slate-400 p-4">No KPIs extracted for this category.</p>;
    }
    return (
        <Table>
            <TableHeader>
                <TableRow className="hover:bg-transparent dark:hover:bg-transparent">
                    <TableHead className="w-[40%] pr-2">KPI Name</TableHead>
                    <TableHead className="w-[20%] pr-2">Value</TableHead>
                    <TableHead className="w-[20%] pr-2">Metric Type</TableHead>
                    <TableHead className="w-[10%] text-center">Year</TableHead>
                    <TableHead className="w-[10%] text-center">Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {kpis.map(kpi => <KpiTableRowWithDetails key={kpi.id} kpi={kpi} />)}
            </TableBody>
        </Table>
    );
};


// --- Main Display Component ---

const KpiDisplay: React.FC<{ data: ExtractedCarbonData | null }> = ({ data }) => {
    const { scopeEmissions, ghgMetrics, otherMetrics } = useMemo(() => {
        if (!data?.carbon_metrics) return { scopeEmissions: {}, ghgMetrics: [], otherMetrics: [] };

        const allKpis = data.carbon_metrics;
        const scopeEmissions: Record<string, KPI[]> = {};
        const ghgMetrics: KPI[] = [];
        const otherMetrics: KPI[] = [];

        const scopeRegex = /scope\s*(\d{1,2}(?:\.\d{1,2})?)/i;
        const intensityRegex = /intensity/i;
        const ghgRegex = /ghg|carbon/i;

        allKpis.forEach(kpi => {
            const name = kpi.name.toLowerCase();
            const category = kpi.category_detail?.toLowerCase() || '';
            const combinedText = `${name} ${category}`;

            const scopeMatch = combinedText.match(scopeRegex);

            if (scopeMatch) {
                const scopeKey = `Scope ${scopeMatch[1]}`;
                if (!scopeEmissions[scopeKey]) {
                    scopeEmissions[scopeKey] = [];
                }
                scopeEmissions[scopeKey].push(kpi);
            } else if (intensityRegex.test(combinedText) || ghgRegex.test(combinedText)) {
                ghgMetrics.push(kpi);
            } else {
                otherMetrics.push(kpi);
            }
        });
        
        // Sort keys for consistent order: Scope 1, Scope 2, Scope 3, etc.
        const sortedScopeKeys = Object.keys(scopeEmissions).sort((a, b) => {
             const numA = parseFloat(a.replace('Scope ', ''));
             const numB = parseFloat(b.replace('Scope ', ''));
             return numA - numB;
        });

        const sortedScopeEmissions: Record<string, KPI[]> = {};
        sortedScopeKeys.forEach(key => {
            sortedScopeEmissions[key] = scopeEmissions[key];
        });

        return { scopeEmissions: sortedScopeEmissions, ghgMetrics, otherMetrics };
    }, [data]);

    const handleDownloadCsv = () => {
        exportCarbonMetricsToCsv(data);
    };

    const hasScopeData = Object.keys(scopeEmissions).length > 0;
    const hasGhgData = ghgMetrics.length > 0;
    const hasOtherData = otherMetrics.length > 0;
    const hasAnyData = hasScopeData || hasGhgData || hasOtherData;

    if (!hasAnyData) {
        return (
            <div className="mt-8 bg-white dark:bg-slate-800 p-8 rounded-xl shadow-xl dark:shadow-slate-700/50 text-center">
                <svg className="mx-auto h-16 w-16 text-slate-400 dark:text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z" />
                </svg>
                <h2 className="text-2xl font-semibold text-slate-700 dark:text-slate-200 mt-4 mb-2">No Specific Carbon Accounting KPIs Found</h2>
                <p className="text-slate-500 dark:text-slate-400 max-w-lg mx-auto">
                    The AI analyzed the report but could not identify specific Carbon Accounting Key Performance Indicators.
                    Consider revising the input text or ensure it contains clear, quantifiable carbon data.
                </p>
            </div>
        );
    }

    return (
        <div className="mt-10">
            <Card>
                <CardHeader className="flex-row justify-between items-center">
                    <div>
                        <CardTitle>Extracted Carbon Metrics</CardTitle>
                        <CardDescription>Review the categorized KPIs extracted from the document.</CardDescription>
                    </div>
                    <button
                        onClick={handleDownloadCsv}
                        className="px-4 py-2 bg-sky-600 hover:bg-sky-700 dark:bg-sky-500 dark:hover:bg-sky-400 text-white font-medium rounded-lg transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-sky-600 focus:ring-opacity-75 flex items-center space-x-2 shrink-0"
                        aria-label="Download carbon accounting KPIs as CSV"
                    >
                        <DownloadIcon />
                        <span>Download CSV</span>
                    </button>
                </CardHeader>
                <CardContent>
                    <Accordion type="multiple" defaultValue={['scope-emissions', 'ghg-metrics']}>
                        {hasScopeData && (
                            <AccordionItem value="scope-emissions">
                                <AccordionTrigger>
                                    <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">Scope Emissions</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <Accordion type="multiple" defaultValue={Object.keys(scopeEmissions).slice(0,1)} className="pl-4 border-l-2 border-slate-200 dark:border-slate-700">
                                        {Object.entries(scopeEmissions).map(([scope, kpis]) => (
                                            <AccordionItem key={scope} value={scope}>
                                                <AccordionTrigger>
                                                    <span className="font-medium">{scope}</span>
                                                </AccordionTrigger>
                                                <AccordionContent>
                                                    <KpiTable kpis={kpis} />
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))}
                                    </Accordion>
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {hasGhgData && (
                             <AccordionItem value="ghg-metrics">
                                <AccordionTrigger>
                                    <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">GHG & Carbon Intensity Metrics</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <KpiTable kpis={ghgMetrics} />
                                </AccordionContent>
                            </AccordionItem>
                        )}
                        {hasOtherData && (
                            <AccordionItem value="other-metrics">
                                <AccordionTrigger>
                                    <span className="text-lg font-semibold text-slate-700 dark:text-slate-200">Other Extracted Metrics</span>
                                </AccordionTrigger>
                                <AccordionContent>
                                     <KpiTable kpis={otherMetrics} />
                                </AccordionContent>
                            </AccordionItem>
                        )}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    );
};

export default KpiDisplay;
