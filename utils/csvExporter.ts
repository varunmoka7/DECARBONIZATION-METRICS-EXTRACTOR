

import { 
    ExtractedCarbonData, KPI, 
    ExtractedLeverData, LeverKey, SimpleKPI, 
    ExtractedBankingData, BankingLeverCategory,
    ExtractedApparelData, ApparelCategoryKey,
    ExtractedWasteData, EnhancedWasteMetricBase
} from '../types';
import { 
    LEVER_DETAILS, 
    BANKING_LEVER_CATEGORIES,
    APPAREL_CATEGORY_DETAILS,
    ENHANCED_WASTE_FRAMEWORK_DETAILS
} from '../constants';

const escapeCsvCell = (cellData: any): string => {
  const stringValue = String(cellData ?? ''); 
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`; 
  }
  return stringValue;
};

const downloadCsv = (csvString: string, filename: string): void => {
  const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  if (link.download !== undefined) { 
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  } else {
    alert("Your browser doesn't support direct CSV downloads. Please try a different browser.");
  }
};

// --- V1: Carbon Accounting KPI Export ---
export const exportCarbonMetricsToCsv = (data: ExtractedCarbonData | null): void => {
  if (!data || !data.carbon_metrics) return;

  const headers = [
    'KPI Name', 'Value', 'Metric Type', 'Year', 'Reference',
    'Category Detail', 'Target Value', 'Target Year', 'Baseline Value', 'Baseline Year',
    'Policy Name', 'Commitment Description', 'Methodology/Standards', 'Data Assurance',
    'Scope/Boundary Details', 'Qualitative Notes'
  ];
  const rows: string[][] = [];

  data.carbon_metrics.forEach(kpi => {
    rows.push([
      escapeCsvCell(kpi.name),
      escapeCsvCell(kpi.value),
      escapeCsvCell(kpi.metric_type),
      escapeCsvCell(kpi.year),
      escapeCsvCell(kpi.reference),
      escapeCsvCell(kpi.category_detail),
      escapeCsvCell(kpi.target_value),
      escapeCsvCell(kpi.target_year),
      escapeCsvCell(kpi.baseline_value),
      escapeCsvCell(kpi.baseline_year),
      escapeCsvCell(kpi.policy_name),
      escapeCsvCell(kpi.commitment_description),
      escapeCsvCell(kpi.methodology_standards),
      escapeCsvCell(kpi.data_assurance),
      escapeCsvCell(kpi.scope_boundary_details),
      escapeCsvCell(kpi.qualitative_notes)
    ]);
  });
  
  if (rows.length === 0) {
    alert("No data available to export.");
    return;
  }

  const csvString = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  downloadCsv(csvString, 'carbon_accounting_kpis.csv');
};


// --- V2: Carbon Lever KPI Export ---
export const exportV2KpisToCsv = (data: ExtractedLeverData | null): void => {
  if (!data) return;

  const headers = ['Lever Title', 'KPI Name', 'Value', 'Metric Type', 'Year', 'Reference'];
  const rows: string[][] = [];

  (Object.keys(data) as LeverKey[]).forEach(leverKey => {
    const kpis = data[leverKey] as SimpleKPI[] | undefined; // Use SimpleKPI for V2
    const leverDetail = LEVER_DETAILS[leverKey];
    if (kpis && leverDetail) {
      kpis.forEach(kpi => {
        rows.push([
          escapeCsvCell(leverDetail.title),
          escapeCsvCell(kpi.name),
          escapeCsvCell(kpi.value),
          escapeCsvCell(kpi.metric_type),
          escapeCsvCell(kpi.year),
          escapeCsvCell(kpi.reference)
        ]);
      });
    }
  });

  if (rows.length === 0) {
    alert("No data available to export for Carbon Levers.");
    return;
  }

  const csvString = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  downloadCsv(csvString, 'carbon_lever_kpis.csv');
};

// --- V3: Banking Sector KPI Export ---
export const exportV3KpisToCsv = (data: ExtractedBankingData | null): void => {
  if (!data) return;

  const headers = ['Lever Category Title', 'KPI Name', 'Value', 'Metric Type', 'Year', 'Reference'];
  const rows: string[][] = [];

  (Object.keys(data) as BankingLeverCategory[]).forEach(categoryKey => {
    const kpis = data[categoryKey] as SimpleKPI[] | undefined; // Use SimpleKPI for V3
    const categoryDetail = BANKING_LEVER_CATEGORIES[categoryKey];
    if (kpis && categoryDetail) {
      kpis.forEach(kpi => {
        rows.push([
          escapeCsvCell(categoryDetail.title),
          escapeCsvCell(kpi.name),
          escapeCsvCell(kpi.value),
          escapeCsvCell(kpi.metric_type),
          escapeCsvCell(kpi.year),
          escapeCsvCell(kpi.reference)
        ]);
      });
    }
  });

  if (rows.length === 0) {
    alert("No data available to export for Banking Sector KPIs.");
    return;
  }

  const csvString = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  downloadCsv(csvString, 'banking_esg_kpis.csv');
};

// --- V4: Apparel Sector KPI Export (Enhanced) ---
export const exportV4ApparelKpisToCsv = (data: ExtractedApparelData | null): void => {
  if (!data) return;

  const headers = ['Apparel Category Title', 'KPI Name', 'Value', 'Metric Type', 'Year', 'Reference'];
  const rows: string[][] = [];

  (Object.keys(data) as ApparelCategoryKey[]).forEach(categoryKey => { 
    const kpis = data[categoryKey] as SimpleKPI[] | undefined;
    const categoryDetail = APPAREL_CATEGORY_DETAILS[categoryKey]; 
    if (kpis && categoryDetail) {
      kpis.forEach(kpi => {
        rows.push([
          escapeCsvCell(categoryDetail.title),
          escapeCsvCell(kpi.name),
          escapeCsvCell(kpi.value),
          escapeCsvCell(kpi.metric_type),
          escapeCsvCell(kpi.year),
          escapeCsvCell(kpi.reference)
        ]);
      });
    }
  });

  if (rows.length === 0) {
    alert("No data available to export for Apparel Sector KPIs.");
    return;
  }

  const csvString = [headers.join(','), ...rows.map(row => row.join(','))].join('\n');
  downloadCsv(csvString, 'apparel_esg_kpis.csv');
};

// --- V5: Waste Management KPI Export (Self-Review Framework) ---
export const exportV5WasteKpisToCsv = (data: ExtractedWasteData | null): void => {
  if (!data) return;

  let csvString = '';
  const spacer = '\n';

  // Section 1: Extraction Summary
  if (data.extraction_summary) {
    const summary = data.extraction_summary;
    const summaryHeaders = ['Category', 'Detail', 'Value'];
    const summaryRows = [
      ['Extraction Summary', 'Total Metrics Found', summary.total_metrics_found],
      ['Extraction Summary', 'Duplications Eliminated', summary.duplications_eliminated],
      ['Extraction Summary', 'Quality Flags', summary.quality_flags.join('; ')],
      ['Extraction Summary', 'Treatment Methods Covered', summary.treatment_methods_covered.join('; ')],
      ['Extraction Summary', 'Governance Items Prioritized', summary.governance_items_prioritized],
    ];
    csvString += summaryHeaders.join(',') + '\n';
    csvString += summaryRows.map(row => row.map(escapeCsvCell).join(',')).join('\n') + spacer;
  }

  // Section 2: Quality Control Notes
  if (data.quality_control_notes) {
      const notes = data.quality_control_notes;
      const notesHeaders = ['Category', 'Note Type', 'Details'];
      const notesRows: (string|number)[][] = [];
      notes.duplications_resolved.forEach(n => notesRows.push(['Quality Control', 'Duplication Resolved', n]));
      notes.classification_adjustments.forEach(n => notesRows.push(['Quality Control', 'Classification Adjustment', n]));
      notes.missing_data_flags.forEach(n => notesRows.push(['Quality Control', 'Missing Data Flag', n]));
      notes.clarification_needed.forEach(n => notesRows.push(['Quality Control', 'Clarification Needed', n]));
      
      if(notesRows.length > 0) {
          csvString += notesHeaders.join(',') + '\n';
          csvString += notesRows.map(row => row.map(escapeCsvCell).join(',')).join('\n') + spacer;
      }
  }

  // Section 3: Detailed Metrics
  const metricHeaders = ['Framework Part', 'Category', 'Sub-Category', 'Metric', 'Value', 'Unit', 'Year', 'Scope', 'Material Type', 'Carbon Equivalent/Benefit', 'Treatment Method', 'Reference'];
  const metricRows: string[][] = [];

  const processMetrics = (frameworkPart: string, category: string, subCategory: string, metrics: EnhancedWasteMetricBase[] | undefined) => {
    if (!metrics) return;
    metrics.forEach(metric => {
        const metricAny = metric as any;
        metricRows.push([
            escapeCsvCell(frameworkPart),
            escapeCsvCell(category),
            escapeCsvCell(subCategory),
            escapeCsvCell(metricAny.emission_source || metricAny.metric),
            escapeCsvCell(metricAny.value),
            escapeCsvCell(metricAny.unit),
            escapeCsvCell(metricAny.year),
            escapeCsvCell(metricAny.scope),
            escapeCsvCell(metricAny.material_type),
            escapeCsvCell(metricAny.carbon_equivalent || metricAny.carbon_benefit),
            escapeCsvCell(metricAny.treatment_method),
            escapeCsvCell(metricAny.reference),
        ]);
    });
  };

  const frameworkKeys: (keyof ExtractedWasteData)[] = [
      'lever_design_zero_waste', 'lever_material_recovery', 'lever_waste_to_energy',
      'lever_regulatory_compliance', 'carbon_treatment_analysis', 'scope_emissions_waste'
  ];

  frameworkKeys.forEach(sectionKey => {
      const section = data[sectionKey];
      const sectionDetails = ENHANCED_WASTE_FRAMEWORK_DETAILS[sectionKey];
      if (!section || !sectionDetails) return;

      Object.entries(section).forEach(([categoryKey, categoryValue]) => {
          const categoryTitle = categoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

          if (Array.isArray(categoryValue)) {
              processMetrics(sectionDetails.title, categoryTitle, '', categoryValue);
          } else if (typeof categoryValue === 'object' && categoryValue !== null) {
              Object.entries(categoryValue).forEach(([subCategoryKey, subCategoryValue]) => {
                  if (Array.isArray(subCategoryValue)) {
                      const subCategoryTitle = subCategoryKey.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                      processMetrics(sectionDetails.title, categoryTitle, subCategoryTitle, subCategoryValue);
                  }
              });
          }
      });
  });

  if (metricRows.length > 0) {
      csvString += metricHeaders.join(',') + '\n';
      csvString += metricRows.map(row => row.join(',')).join('\n') + spacer;
  }
  
  // Section 4: Governance Intelligence
  if (data.governanceIntelligence) {
      const governanceHeaders = ['Framework Part', 'Category', 'Name / Role', 'Details', 'Value', 'Reference'];
      const governanceRows: string[][] = [];
      const frameworkPart = ENHANCED_WASTE_FRAMEWORK_DETAILS.governanceIntelligence.title;

      data.governanceIntelligence.policyFrameworks?.forEach(policy => {
          governanceRows.push([frameworkPart, 'Policy Framework', policy.policyName || 'Unnamed Policy', 'Scope', escapeCsvCell(policy.scope), escapeCsvCell(policy.reference)]);
          governanceRows.push([frameworkPart, 'Policy Framework', policy.policyName || 'Unnamed Policy', 'Board Approved', escapeCsvCell(policy.boardApproved), escapeCsvCell(policy.reference)]);
          governanceRows.push([frameworkPart, 'Policy Framework', policy.policyName || 'Unnamed Policy', 'Carbon Targets Included', escapeCsvCell(policy.carbonTargetsIncluded), escapeCsvCell(policy.reference)]);
          governanceRows.push([frameworkPart, 'Policy Framework', policy.policyName || 'Unnamed Policy', 'Treatment Methods Covered', escapeCsvCell(policy.treatmentMethodsCovered?.join('; ')), escapeCsvCell(policy.reference)]);
          governanceRows.push([frameworkPart, 'Policy Framework', policy.policyName || 'Unnamed Policy', 'Scope Emissions Addressed', escapeCsvCell(policy.scopeEmissionsAddressed?.join('; ')), escapeCsvCell(policy.reference)]);
          governanceRows.push([frameworkPart, 'Policy Framework', policy.policyName || 'Unnamed Policy', 'Missing Elements', escapeCsvCell(policy.missingElements), escapeCsvCell(policy.reference)]);
      });
      data.governanceIntelligence.governanceStructures?.forEach(structure => {
          governanceRows.push([frameworkPart, 'Governance Structure', structure.roleTitle || 'General', 'Carbon-Waste Integration', escapeCsvCell(structure.carbonWasteIntegration), escapeCsvCell(structure.reference)]);
          governanceRows.push([frameworkPart, 'Governance Structure', structure.roleTitle || 'General', 'Reporting Level', escapeCsvCell(structure.reportingLevel), escapeCsvCell(structure.reference)]);
          governanceRows.push([frameworkPart, 'Governance Structure', structure.roleTitle || 'General', 'Treatment Oversight', escapeCsvCell(structure.treatmentOversight?.join('; ')), escapeCsvCell(structure.reference)]);
          governanceRows.push([frameworkPart, 'Governance Structure', structure.roleTitle || 'General', 'Scope Emissions Accountability', escapeCsvCell(structure.scopeEmissionsAccountability?.join('; ')), escapeCsvCell(structure.reference)]);
          governanceRows.push([frameworkPart, 'Governance Structure', structure.roleTitle || 'General', 'Board Reporting', escapeCsvCell(structure.boardReporting), escapeCsvCell(structure.reference)]);
      });

      if (governanceRows.length > 0) {
          csvString += governanceHeaders.join(',') + '\n';
          csvString += governanceRows.map(row => row.join(',')).join('\n');
      }
  }

  if (csvString.length === 0) {
    alert("No data available to export for Waste Management KPIs.");
    return;
  }

  downloadCsv(csvString, 'enhanced_waste_kpis_with_qc.csv');
};