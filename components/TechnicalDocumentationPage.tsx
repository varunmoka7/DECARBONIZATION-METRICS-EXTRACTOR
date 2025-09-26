import React from 'react';

interface DocItemProps {
  title: string;
  children: React.ReactNode;
}

const DocItem: React.FC<DocItemProps> = ({ title, children }) => (
  <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 ease-in-out border border-slate-200 dark:border-slate-700">
    <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-3">{title}</h3>
    <div className="text-sm text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed">
      {children}
    </div>
  </div>
);

const TechnicalDocumentationPage: React.FC = () => {
  return (
    <div className="animate-fadeInPage">
      <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 dark:text-slate-100 mb-6 pb-3 border-b-2 border-sky-500 dark:border-sky-600">
        Technical Documentation & Specifications
      </h1>

      <p className="mb-10 text-slate-600 dark:text-slate-300 leading-relaxed">
        This page outlines the key technical documentation areas for the ESG Metrics Extractor. In a full production system, each section 
        would link to detailed documents, diagrams, system specifications, and operational guides. The descriptions below provide a high-level overview
        of the intended scope for each documentation category, crucial for understanding, maintaining, and scaling the system.
      </p>

      {/* Section 1: Framework Mapping Documentation */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-500 mb-6 pb-2 border-b border-sky-300 dark:border-sky-700">
          1. Framework Mapping Documentation
        </h2>
        <div className="space-y-6">
          <DocItem title="Comprehensive ESG Metric-to-Framework Mapping">
            <p>This document provides detailed relational models and explicit mappings illustrating how specific ESG metrics (e.g., Scope 1 GHG Emissions, Water Withdrawal, Employee Training Hours, Financed Emissions Intensity, Circularity Rate) align with disclosure requirements, recommendations, or data points across major sustainability frameworks and standards. The scope includes, but is not limited to:</p>
            <ul className="list-disc list-inside pl-4">
              <li>Task Force on Climate-related Financial Disclosures (TCFD): Recommendations and supporting disclosures.</li>
              <li>Global Reporting Initiative (GRI) Standards: Specific disclosures from GRI Topic Standards.</li>
              <li>International Sustainability Standards Board (ISSB) - IFRS S1 & S2: Disclosure requirements for general sustainability-related and climate-related financial information.</li>
              <li>Corporate Sustainability Reporting Directive (CSRD) - European Sustainability Reporting Standards (ESRS): Data points required under cross-cutting and topical ESRS.</li>
              <li>Sustainable Finance Disclosure Regulation (SFDR): Principal Adverse Impact (PAI) indicators and product-level disclosures.</li>
              <li>EU Taxonomy Regulation: Technical screening criteria and DNSH (Do No Significant Harm) considerations for economic activities.</li>
            </ul>
            <p>Each mapping specifies the framework, standard/topic, disclosure ID/number, and the exact data point or metric being addressed.</p>
          </DocItem>
          <DocItem title="Metric Definitions and Granularity per Framework">
            <p>A meticulous glossary defines each supported ESG metric, detailing its precise calculation methodology, required scope (e.g., organizational boundaries, operational control), boundary conditions, mandated units of measurement, and specific reporting nuances or interpretations as stipulated by each individual framework. This ensures that data extraction aligns with the precise requirements for compliance and comparability. For example, the definition of "employee turnover" might vary slightly between frameworks or require different breakdowns.</p>
          </DocItem>
          <DocItem title="Cross-Framework Metric Alignment and Reconciliation Tables">
            <p>Comparative tables that meticulously analyze and document similarities, differences, and overlaps between metrics across the various supported frameworks. This documentation aids in understanding data reusability for multi-framework reporting, identifying potential data gaps, and developing strategies for reconciling definitional differences when a single underlying data point might serve multiple reporting needs with slight adjustments.</p>
          </DocItem>
        </div>
      </section>

      {/* Section 2: Computer Vision Processing Specifications */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-500 mb-6 pb-2 border-b border-sky-300 dark:border-sky-700">
          2. Document Intelligence & Computer Vision (CV) Processing Specifications
        </h2>
        <div className="space-y-6">
          <DocItem title="Multi-Format Document Ingestion and Conversion Algorithms">
            <p>Defines the algorithms, libraries (e.g., pdf.js), and processes for ingesting various input file formats (PDF, TXT, CSV, MD). This includes specifications for converting these diverse formats into a uniform internal representation, such as structured text streams, identified tables, and lists of embedded images (for PDF). Details on handling text encoding, layout preservation, and extraction of document metadata (e.g., page numbers) are included.</p>
          </DocItem>
          <DocItem title="Image-Based Data Extraction (for PDFs and Future Enhancements)">
            <p>Specifies the methodology for extracting and processing embedded images from PDF documents, which may contain charts, graphs, or scanned text. Includes details on Optical Character Recognition (OCR) engines (e.g., Tesseract, cloud-based OCR), image pre-processing techniques (deskewing, noise reduction, binarization), and post-processing (spell correction, layout analysis of OCR'd text). This also covers potential future capabilities for analyzing non-textual image content relevant to ESG (e.g., recognizing logos of assurance providers, interpreting simple chart types).</p>
          </DocItem>
          <DocItem title="Table Structure Recognition and Data Extraction Methods">
            <p>Describes the algorithms and models used for detecting, delineating, and extracting data from tables found within document text and images (if OCR'd). This includes identifying table boundaries, rows, columns, header cells, and cell content. Specifies the transformation of this visual/structural information into a machine-readable format (e.g., arrays of objects, CSV-like structures) suitable for KPI extraction.</p>
          </DocItem>
        </div>
      </section>

      {/* Section 3: NLP Curation Algorithms */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-500 mb-6 pb-2 border-b border-sky-300 dark:border-sky-700">
          3. Natural Language Processing (NLP) & AI Curation Algorithms
        </h2>
        <div className="space-y-6">
          <DocItem title="Gemini Model Integration and Prompt Engineering">
            <p>Detailed specifications for integrating with the Gemini API, including model versions used (e.g., 'gemini-2.5-flash'), API request/response structures, and error handling mechanisms. Crucially, this section documents the comprehensive system prompts designed for each extractor type (Standard, Carbon Levers, Banking, Apparel, Waste Management). It outlines the prompt engineering strategies, including role-setting, JSON output schema definition within the prompt, instruction clarity, and few-shot examples (if used) to guide the AI in accurately identifying and structuring ESG KPIs.</p>
          </DocItem>
          <DocItem title="ESG Terminology Standardization and Entity Recognition">
            <p>Describes the system for normalizing variations in ESG terminology to a standard lexicon, potentially using a combination of rule-based approaches, synonym lists, and AI-driven entity recognition. This includes identifying key entities like company names, locations, dates, specific metric names (e.g., "tCO2e", "Scope 1 emissions"), units, and ESG-specific concepts (e.g., "Net Zero", "Circular Economy").</p>
          </DocItem>
          <DocItem title="Content Segmentation, Ranking, and Relevance Scoring">
            <p>Outlines methods used to segment large documents into manageable chunks for AI processing (if necessary). Details algorithms for scoring the relevance of text snippets or document sections to specific ESG topics or KPIs, which can help in focusing the AI's attention or in post-processing validation. This might involve keyword analysis, semantic similarity measures, or fine-tuned classification models.</p>
          </DocItem>
        </div>
      </section>

      {/* Section 4: Quality Assessment Criteria */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-500 mb-6 pb-2 border-b border-sky-300 dark:border-sky-700">
          4. Quality Assessment Criteria & Validation
        </h2>
        <div className="space-y-6">
          <DocItem title="JSON Schema Validation and Heuristic Rules">
            <p>Specifies the JSON schemas against which the AI's output is validated for each extractor type. Details a comprehensive set of heuristic rules and thresholds for post-extraction validation of KPI data. Examples include: checking for plausible numeric ranges for common metrics, unit consistency, valid date formats, presence of mandatory fields (name, value, metric_type), and expected relationships between different KPIs (e.g., Scope 1 + Scope 2 often compared to Total Scope 1 & 2).</p>
          </DocItem>
          <DocItem title="AI-Assisted Anomaly Detection and Confidence Scoring">
            <p>Describes potential for machine learning models or statistical methods to identify anomalous or potentially incorrect data extractions. This includes how confidence scores from the Gemini API (if available and relevant) or custom-trained models could be used. Outlines how these signals contribute to an overall quality assessment of extracted KPIs.</p>
          </DocItem>
          <DocItem title="Reference Text Verification">
            <p>Procedures for ensuring the 'reference' text provided by the AI accurately supports the extracted KPI value. While largely reliant on AI's capability, this section would outline any automated checks (e.g., ensuring the value appears in the reference) or sampling methods for manual verification.</p>
          </DocItem>
        </div>
      </section>

      {/* Section 5: Data Structure Specifications */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-500 mb-6 pb-2 border-b border-sky-300 dark:border-sky-700">
          5. Data Structure & Output Specifications
        </h2>
        <div className="space-y-6">
          <DocItem title="Detailed Output JSON Schemas">
            <p>Provides the canonical JSON schemas for the output of each extractor (Standard ESG, Carbon Levers, Banking, Apparel, Waste Management). This includes definitions for all fields within KPI objects (e.g., `id`, `name`, `value`, `metric_type`, `year`, `reference`, and enhanced fields like `category_detail`, `target_value`, etc., for the Standard Extractor, or specific governance fields for the Waste Extractor). These schemas are critical for consumers of the extracted data.</p>
          </DocItem>
          <DocItem title="CSV Export Formats">
            <p>Specifications for the CSV file formats generated by the "Download CSV" functionality for each extractor type. This includes header rows and the mapping of JSON KPI fields to CSV columns, ensuring consistency and usability for end-users.</p>
          </DocItem>
          <DocItem title="Performance Report Data Structure">
             <p>The JSON schema for the AI-generated Performance Report. This details the structure for `reportTitle`, `overallESGRating`, `categoryRatings` (including `keyKpiAnalyses`), `overallAnalysis`, and `generatedDate`, ensuring consistent report generation.</p>
          </DocItem>
        </div>
      </section>

      {/* Section 6: Processing Pipeline & Architecture */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-500 mb-6 pb-2 border-b border-sky-300 dark:border-sky-700">
          6. Processing Pipeline & System Architecture
        </h2>
        <div className="space-y-6">
          <DocItem title="End-to-End Data Flow Diagram">
            <p>A visual representation (e.g., flowchart or sequence diagram) of the entire data processing pipeline. This illustrates the journey of data from initial document ingestion (text input/file upload), through parsing, AI model inference (Gemini API call), response parsing, data structuring (adding UUIDs, etc.), and finally to display or export. Highlights key components like `ReportInput`, `geminiService`, and specific extractor pages.</p>
          </DocItem>
          <DocItem title="Error Handling, Retry Logic, and Timeout Management">
            <p>A comprehensive strategy for error handling at each critical stage of the pipeline (file processing, API calls, data parsing). Details on retry mechanisms (e.g., for API calls, though not explicitly implemented yet), timeout configurations for external API calls, and user-facing error messaging. This includes handling API-specific errors (key issues, quota limits) and data parsing errors.</p>
          </DocItem>
          <DocItem title="Frontend Architecture Overview">
            <p>Description of the React-based frontend architecture. Covers component structure (e.g., `Header`, `ReportInput`, `KpiDisplay` variants, specific Page components), state management (React `useState`, `useCallback`), context (ThemeContext), and service integration (`geminiService`). Explains the navigation flow and how different extractor types are managed within the single-page application.</p>
          </DocItem>
        </div>
      </section>

      {/* Section 7: Reference Materials Needed */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-sky-700 dark:text-sky-500 mb-6 pb-2 border-b border-sky-300 dark:border-sky-700">
          7. Reference Materials & Datasets (for Development & Validation)
        </h2>
        <p className="mb-4 text-slate-600 dark:text-slate-300">
            The following materials are conceptual inputs essential for the iterative development, prompt refinement, and ongoing validation of the ESG Metrics Extractor:
        </p>
        <div className="space-y-6">
          <DocItem title="Curated Sample Reports and Target Outputs">
            <p>A diverse collection of sample sustainability reports (various industries, lengths, styles, and data densities). For each sample, a corresponding "golden set" of accurately extracted ESG KPIs in the target JSON format for each relevant extractor. This is crucial for refining prompts and evaluating AI performance. The `EXAMPLE_SUSTAINABILITY_REPORT_TEXT` in `constants.ts` serves as a miniature version of this for demonstration.</p>
          </DocItem>
          <DocItem title="Framework-Specific Reporting Examples">
            <p>Examples of corporate reports that are known to comply well with specific ESG frameworks (e.g., a report with excellent TCFD alignment, a GRI-compliant report). These help in understanding how companies present data relevant to those frameworks and inform prompt design for extracting such information.</p>
          </DocItem>
          <DocItem title="Glossary of ESG Terms and Synonyms">
            <p>A comprehensive glossary of common ESG terms, metrics, units, and their typical synonyms or variations as found in corporate reports. This aids in designing prompts that are robust to linguistic variations.</p>
          </DocItem>
          <DocItem title="Validation Rule Sets & Edge Cases">
            <p>Lists of heuristic rules, logical checks, and domain-specific constraints used to validate the plausibility and consistency of extracted ESG data. Also, a collection of known edge cases or challenging examples from reports that test the limits of the extraction logic.</p>
          </DocItem>
        </div>
      </section>
    </div>
  );
};

export default TechnicalDocumentationPage;