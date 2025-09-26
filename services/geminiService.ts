

import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { 
    GEMINI_MODEL_NAME, 
    CARBON_ACCOUNTING_PROMPT_SYSTEM_INSTRUCTION, 
    ESG_LEVERS_PROMPT_SYSTEM_INSTRUCTION,
    BANKING_ESG_PROMPT_SYSTEM_INSTRUCTION,
    APPAREL_ESG_PROMPT_SYSTEM_INSTRUCTION,
    WASTE_ESG_PROMPT_SYSTEM_INSTRUCTION,
    PERFORMANCE_REPORT_SYSTEM_INSTRUCTION,
    LEVER_DETAILS, 
    BANKING_LEVER_CATEGORIES, 
    APPAREL_CATEGORY_DETAILS,
    ENHANCED_WASTE_FRAMEWORK_DETAILS
} from '../constants';
import { 
    ExtractedCarbonData,
    GeminiCarbonResponse,
    GeminiKPI, 
    KPI,
    ExtractedLeverData,
    GeminiLeverResponse,
    GeminiLeverKPI,
    LeverKPI,
    LeverKey,
    ExtractedBankingData,
    GeminiBankingResponse,
    GeminiBankingKPI,
    BankingKPI,
    BankingLeverCategory,
    ExtractedApparelData, 
    GeminiApparelResponse, 
    GeminiApparelKPI, 
    ApparelKPI, 
    ApparelCategoryKey,
    ExtractedWasteData,
    GeminiWasteResponse,
    EnhancedWasteMetric,
    EnhancedWasteCoreCDPMetric,
    EnhancedWasteCarbonIntegratedMetric,
    EnhancedWasteScopeEmissionMetric,
    EnhancedPolicyFramework,
    EnhancedGovernanceStructure,
    PerformanceReportData
} from '../types';
import { v4 as uuidv4 } from 'uuid';

// Initialize the client ONCE at the module level using process.env.API_KEY
// Assume process.env.API_KEY is available and valid as per guidelines.
const geminiAISDK = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to add unique IDs to KPIs
const addIdsToKPIs = (kpis: GeminiKPI[] = []): KPI[] => 
  kpis.map((kpi): KPI => ({ ...kpi, id: uuidv4() }));

const addIdsToLeverKPIs = (kpis: GeminiLeverKPI[] = []): LeverKPI[] =>
  kpis.map((kpi): LeverKPI => ({ ...kpi, id: uuidv4() }));

const addIdsToBankingKPIs = (kpis: GeminiBankingKPI[] = []): BankingKPI[] =>
  kpis.map((kpi): BankingKPI => ({ ...kpi, id: uuidv4() }));

const addIdsToApparelKPIs = (kpis: GeminiApparelKPI[] = []): ApparelKPI[] =>
  kpis.map((kpi): ApparelKPI => ({ ...kpi, id: uuidv4() }));

// --- V5 Enhanced Waste ID Helpers ---
const addIdsToEnhancedWasteMetrics = <T extends { id: string }>(items: any[] = []): T[] =>
  items.map((item): T => ({ ...item, id: uuidv4() } as T));


function parseCarbonMetricsResponse(responseText: string): ExtractedCarbonData {
  let jsonStr = responseText.trim();
  
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }

  try {
    const parsed = JSON.parse(jsonStr) as GeminiCarbonResponse;
    if (!parsed.carbon_metrics) {
        throw new Error("AI response is missing the mandatory 'carbon_metrics' key.");
    }
    return {
      carbon_metrics: addIdsToKPIs(parsed.carbon_metrics),
    };
  } catch (error) {
    console.error("Failed to parse JSON response from Gemini (Carbon Extractor):", error);
    console.error("Raw response text for Carbon Extractor debugging:", responseText);
    if (jsonStr.toLowerCase().includes("error") || jsonStr.toLowerCase().includes("api key")) {
        throw new Error(`Gemini API Error: ${jsonStr.substring(0, 500)}... Potentially an issue with the API Key or request.`);
    }
    throw new Error("Invalid JSON format received from AI for Carbon Extractor. The AI may have deviated from the expected JSON structure. Check console for raw response.");
  }
}

function parseLeverBasedGeminiResponse(responseText: string): ExtractedLeverData {
  let jsonStr = responseText.trim();
  
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }

  try {
    const parsed = JSON.parse(jsonStr) as GeminiLeverResponse;
    const processedData: ExtractedLeverData = {};

    for (const key in parsed) {
      if (Object.values(LeverKey).includes(key as LeverKey)) {
        const leverKey = key as LeverKey;
        processedData[leverKey] = addIdsToLeverKPIs(parsed[leverKey]);
      }
    }
    return processedData;
  } catch (error) {
    console.error("Failed to parse JSON response from Gemini (V2 Levers):", error);
    console.error("Raw response text for V2 Levers debugging:", responseText);
     if (jsonStr.toLowerCase().includes("error") || jsonStr.toLowerCase().includes("api key")) {
        throw new Error(`Gemini API Error: ${jsonStr.substring(0, 500)}... Potentially an issue with the API Key or request.`);
    }
    throw new Error("Invalid JSON format received from AI for V2 Levers. The AI may have deviated from the expected JSON structure. Check console for raw response.");
  }
}

function parseBankingGeminiResponse(responseText: string): ExtractedBankingData {
  let jsonStr = responseText.trim();
  
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }

  try {
    const parsed = JSON.parse(jsonStr) as GeminiBankingResponse;
    const processedData: ExtractedBankingData = {};

    for (const key in parsed) {
      if (Object.values(BankingLeverCategory).includes(key as BankingLeverCategory)) {
        const categoryKey = key as BankingLeverCategory;
        processedData[categoryKey] = addIdsToBankingKPIs(parsed[categoryKey]);
      }
    }
    return processedData;
  } catch (error) {
    console.error("Failed to parse JSON response from Gemini (V3 Banking):", error);
    console.error("Raw response text for V3 Banking debugging:", responseText);
     if (jsonStr.toLowerCase().includes("error") || jsonStr.toLowerCase().includes("api key")) {
        throw new Error(`Gemini API Error: ${jsonStr.substring(0, 500)}... Potentially an issue with the API Key or request.`);
    }
    throw new Error("Invalid JSON format received from AI for V3 Banking. The AI may have deviated from the expected JSON structure. Check console for raw response.");
  }
}

function parseApparelGeminiResponse(responseText: string): ExtractedApparelData {
  let jsonStr = responseText.trim();
  
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }

  try {
    const parsed = JSON.parse(jsonStr) as GeminiApparelResponse;
    const processedData: ExtractedApparelData = {};

    for (const key in parsed) {
      if (Object.values(ApparelCategoryKey).includes(key as ApparelCategoryKey)) {
        const categoryKey = key as ApparelCategoryKey;
        processedData[categoryKey] = addIdsToApparelKPIs(parsed[categoryKey]);
      }
    }
    return processedData;
  } catch (error) {
    console.error("Failed to parse JSON response from Gemini (V4 Apparel):", error);
    console.error("Raw response text for V4 Apparel debugging:", responseText);
     if (jsonStr.toLowerCase().includes("error") || jsonStr.toLowerCase().includes("api key")) {
        throw new Error(`Gemini API Error: ${jsonStr.substring(0, 500)}... Potentially an issue with the API Key or request.`);
    }
    throw new Error("Invalid JSON format received from AI for V4 Apparel. The AI may have deviated from the expected JSON structure. Check console for raw response.");
  }
}

function parseWasteGeminiResponse(responseText: string): ExtractedWasteData {
  let jsonStr = responseText.trim();
  
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }

  try {
    const parsed = JSON.parse(jsonStr) as GeminiWasteResponse;

    if (!parsed.extraction_summary || !parsed.quality_control_notes) {
        throw new Error("AI response is missing the mandatory 'extraction_summary' or 'quality_control_notes' sections.");
    }

    const processedData: ExtractedWasteData = {
        extraction_summary: parsed.extraction_summary,
        quality_control_notes: parsed.quality_control_notes,
    };

    if (parsed.lever_design_zero_waste) {
        processedData.lever_design_zero_waste = {
            core_cdp_metrics: addIdsToEnhancedWasteMetrics<EnhancedWasteCoreCDPMetric>(parsed.lever_design_zero_waste.core_cdp_metrics),
            carbon_integrated_metrics: addIdsToEnhancedWasteMetrics<EnhancedWasteCarbonIntegratedMetric>(parsed.lever_design_zero_waste.carbon_integrated_metrics),
            prevention_metrics: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.lever_design_zero_waste.prevention_metrics),
        };
    }
    if (parsed.lever_material_recovery) {
        processedData.lever_material_recovery = {
            core_cdp_metrics: addIdsToEnhancedWasteMetrics<EnhancedWasteCoreCDPMetric>(parsed.lever_material_recovery.core_cdp_metrics),
            treatment_specific: {
                recycling: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.lever_material_recovery.treatment_specific?.recycling),
                composting: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.lever_material_recovery.treatment_specific?.composting),
                wastewater_treatment: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.lever_material_recovery.treatment_specific?.wastewater_treatment),
            },
            circular_economy_metrics: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.lever_material_recovery.circular_economy_metrics),
        };
    }
    if (parsed.lever_waste_to_energy) {
        processedData.lever_waste_to_energy = {
            landfill_gas_to_energy: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.lever_waste_to_energy.landfill_gas_to_energy),
            waste_to_energy_incineration: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.lever_waste_to_energy.waste_to_energy_incineration),
            incineration_without_recovery: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.lever_waste_to_energy.incineration_without_recovery),
            energy_recovery_metrics: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.lever_waste_to_energy.energy_recovery_metrics),
        };
    }
     if (parsed.lever_regulatory_compliance) {
        processedData.lever_regulatory_compliance = {
            zero_waste_metrics: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.lever_regulatory_compliance.zero_waste_metrics),
            compliance_metrics: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.lever_regulatory_compliance.compliance_metrics),
            stewardship_metrics: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.lever_regulatory_compliance.stewardship_metrics),
        };
    }
    if (parsed.carbon_treatment_analysis) {
        processedData.carbon_treatment_analysis = {
            landfill_carbon: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.carbon_treatment_analysis.landfill_carbon),
            incineration_carbon: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.carbon_treatment_analysis.incineration_carbon),
            recycling_carbon: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.carbon_treatment_analysis.recycling_carbon),
            composting_carbon: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.carbon_treatment_analysis.composting_carbon),
            wastewater_carbon: addIdsToEnhancedWasteMetrics<EnhancedWasteMetric>(parsed.carbon_treatment_analysis.wastewater_carbon),
        };
    }
    if (parsed.scope_emissions_waste) {
        processedData.scope_emissions_waste = {
            scope_1: addIdsToEnhancedWasteMetrics<EnhancedWasteScopeEmissionMetric>(parsed.scope_emissions_waste.scope_1),
            scope_2: addIdsToEnhancedWasteMetrics<EnhancedWasteScopeEmissionMetric>(parsed.scope_emissions_waste.scope_2),
            scope_3: addIdsToEnhancedWasteMetrics<EnhancedWasteScopeEmissionMetric>(parsed.scope_emissions_waste.scope_3),
        };
    }
    if (parsed.governanceIntelligence) {
        // Enforce governance item limits defensively
        processedData.governanceIntelligence = {
            policyFrameworks: addIdsToEnhancedWasteMetrics<EnhancedPolicyFramework>(parsed.governanceIntelligence.policyFrameworks?.slice(0, 3)),
            governanceStructures: addIdsToEnhancedWasteMetrics<EnhancedGovernanceStructure>(parsed.governanceIntelligence.governanceStructures?.slice(0, 2)),
        };
    }

    return processedData;
  } catch (error) {
    console.error("Failed to parse JSON response from Gemini (V5 Enhanced Waste):", error);
    console.error("Raw response text for V5 Enhanced Waste debugging:", responseText);
     if (jsonStr.toLowerCase().includes("error") || jsonStr.toLowerCase().includes("api key")) {
        throw new Error(`Gemini API Error: ${jsonStr.substring(0, 500)}... Potentially an issue with the API Key or request.`);
    }
    throw new Error(`Invalid JSON format received from AI for V5 Waste. The AI may have deviated from the expected JSON structure. Error: ${error instanceof Error ? error.message : String(error)}. Check console for raw response.`);
  }
}


function parsePerformanceReportResponse(responseText: string): PerformanceReportData {
  let jsonStr = responseText.trim();
  
  const fenceRegex = /^```(?:json)?\s*\n?(.*?)\n?\s*```$/s;
  const match = jsonStr.match(fenceRegex);
  if (match && match[1]) {
    jsonStr = match[1].trim();
  }

  try {
    const parsed = JSON.parse(jsonStr) as PerformanceReportData;
    if (!parsed.reportTitle || !parsed.overallESGRating || !parsed.categoryRatings || !parsed.overallAnalysis || !parsed.generatedDate) {
      throw new Error("Parsed performance report JSON is missing one or more root fields.");
    }
    return parsed;
  } catch (error) {
    console.error("Failed to parse JSON response from Gemini (Performance Report):", error);
    console.error("Raw response text for Performance Report debugging:", responseText);
    if (jsonStr.toLowerCase().includes("error") || jsonStr.toLowerCase().includes("api key")) {
        throw new Error(`Gemini API Error: ${jsonStr.substring(0, 500)}... Potentially an issue with the API Key or request.`);
    }
    throw new Error("Invalid JSON format received from AI for Performance Report. The AI may have deviated from the expected JSON structure. Check console for raw response.");
  }
}


const generateContentWithRetry = async (
    modelName: string, 
    promptText: string, 
    systemInstruction: string,
    images?: string[], 
    timeoutMs: number = 180000 
): Promise<GenerateContentResponse> => {
    try {
        const contentParts: any[] = [{ text: promptText }];
        if (images && images.length > 0) {
          images.forEach(base64ImageData => {
            // Ensure base64 string does not have data URI prefix
            const cleanBase64 = base64ImageData.startsWith('data:') 
              ? base64ImageData.substring(base64ImageData.indexOf(',') + 1)
              : base64ImageData;

            contentParts.push({
              inlineData: {
                mimeType: 'image/png', 
                data: cleanBase64,
              },
            });
          });
        }
        
        const requestPayload: any = {
            model: modelName,
            contents: { parts: contentParts }, // Always use parts structure
            config: {
                systemInstruction: systemInstruction,
                responseMimeType: "application/json",
                temperature: 0.2, 
                topK: 32,
                topP: 0.9,
            }
        };
        
        const apiCallPromise = geminiAISDK.models.generateContent(requestPayload);

        const timeoutPromise = new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error(`API call timed out after ${timeoutMs / 1000} seconds`)), timeoutMs)
        );
        
        const response = await Promise.race([apiCallPromise, timeoutPromise]) as GenerateContentResponse;

        if (!response.text) {
            console.error("Empty response text from Gemini API. Full response object:", JSON.stringify(response, null, 2));
            if (response.promptFeedback) {
                console.error("Prompt Feedback:", JSON.stringify(response.promptFeedback, null, 2));
            }
            if (response.candidates && response.candidates.length > 0) {
                response.candidates.forEach((candidate, index) => {
                    console.error(`Candidate ${index} Finish Reason:`, candidate.finishReason);
                    if (candidate.content && candidate.content.parts && candidate.content.parts.length === 0){
                        console.error(`Candidate ${index} Content Parts: Empty`);
                    } else if (candidate.content && candidate.content.parts) {
                        console.error(`Candidate ${index} Content Parts:`, JSON.stringify(candidate.content.parts, null, 2));
                    }
                    if (candidate.safetyRatings) {
                        console.error(`Candidate ${index} Safety Ratings:`, JSON.stringify(candidate.safetyRatings, null, 2));
                    }
                });
            }
            throw new Error("Received an empty response from the AI. The prompt might be too short, unclear, or an API issue occurred. Check console for details like safety feedback or finish reasons.");
        }
        return response;

    } catch (error) {
        console.error("Error calling Gemini API:", error);
        if (error instanceof Error) {
            if (error.message.includes("timed out")) { 
                throw error; 
            }
            if (error.message.toLowerCase().includes("api key not valid") || 
                error.message.toLowerCase().includes("permission denied") ||
                error.message.toLowerCase().includes("api_key_invalid") ||
                error.message.toLowerCase().includes("invalid api key") ||
                (error.constructor.name === 'GoogleGenerativeAIError' && error.message.toLowerCase().includes("api key")) // More specific check for GoogleGenAIError
              ) {
                throw new Error("Invalid Gemini API Key in environment (process.env.API_KEY). Please check the server configuration. Ensure the key is correct, billing is enabled, and the Generative Language API is enabled for this project and key.");
            }
            if (error.message.includes("quota")) {
                throw new Error("API quota exceeded. Please check your Gemini project limits and billing status.");
            }
             if (error.message.includes("must be a string") && error.message.toLowerCase().includes("contents")) {
                 console.error("Gemini API content structure error hint: 'contents' might be in an unexpected format. If sending images, ensure it's { parts: [...] }.", error);
                 throw new Error("AI content structure error. Check logs.");
             }
            // Re-throw the specific error if it's already one of our custom messages
            if (error.message.startsWith("Received an empty response from the AI") ||
                error.message.startsWith("Invalid Gemini API Key") ||
                error.message.startsWith("API quota exceeded") ||
                error.message.startsWith("AI content structure error")) {
                throw error;
            }
            throw new Error(`Failed to get response from AI: ${error.message}`);
        }
        throw new Error("An unknown error occurred while communicating with the AI.");
    }
};


export const extractCarbonMetrics = async (reportText: string, pageImages?: string[]): Promise<ExtractedCarbonData> => {
  const response = await generateContentWithRetry(
    GEMINI_MODEL_NAME, 
    reportText, 
    CARBON_ACCOUNTING_PROMPT_SYSTEM_INSTRUCTION,
    pageImages 
  );
  return parseCarbonMetricsResponse(response.text);
};

export const extractLeverBasedESGMetrics = async (reportText: string): Promise<ExtractedLeverData> => {
  const response = await generateContentWithRetry(GEMINI_MODEL_NAME, reportText, ESG_LEVERS_PROMPT_SYSTEM_INSTRUCTION);
  return parseLeverBasedGeminiResponse(response.text);
};

export const extractBankingESGMetrics = async (reportText: string): Promise<ExtractedBankingData> => {
  const response = await generateContentWithRetry(GEMINI_MODEL_NAME, reportText, BANKING_ESG_PROMPT_SYSTEM_INSTRUCTION);
  return parseBankingGeminiResponse(response.text);
};

export const extractApparelESGMetrics = async (reportText: string): Promise<ExtractedApparelData> => {
  const response = await generateContentWithRetry(GEMINI_MODEL_NAME, reportText, APPAREL_ESG_PROMPT_SYSTEM_INSTRUCTION);
  return parseApparelGeminiResponse(response.text);
};

export const extractWasteESGMetrics = async (reportText: string): Promise<ExtractedWasteData> => {
  const response = await generateContentWithRetry(GEMINI_MODEL_NAME, reportText, WASTE_ESG_PROMPT_SYSTEM_INSTRUCTION);
  return parseWasteGeminiResponse(response.text);
};

export const generatePerformanceReport = async (
  kpis: ExtractedCarbonData | ExtractedLeverData | ExtractedBankingData | ExtractedApparelData | ExtractedWasteData,
  industry: string,
  companyName: string
): Promise<PerformanceReportData> => {
  
  const promptPayload = {
    kpis: kpis,
    industry: industry || "Generic", 
    companyName: companyName || "The Company" 
  };

  const promptContent = JSON.stringify(promptPayload);

  const response = await generateContentWithRetry(
    GEMINI_MODEL_NAME,
    promptContent,
    PERFORMANCE_REPORT_SYSTEM_INSTRUCTION 
  );
  return parsePerformanceReportResponse(response.text);
};