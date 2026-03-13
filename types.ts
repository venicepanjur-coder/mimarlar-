export interface FirmInput {
  firma_adi: string;
  kurucular?: string;
  konum?: string;
  odak_alanlari?: string;
  projeler?: string[];
  kaynak_id?: number[] | string[];
}

export interface InputData {
  izmir_mimarlik_firmalari: {
    one_cikan_ve_kurumsal_ofisler: FirmInput[];
    diger_tescilli_burolar_ve_sirketler: string[];
    notlar: string[];
  };
}

export interface AnalyzedFirm {
  id: string;
  name: string;
  location: string;
  digitalMaturityScore: number; // 1-10
  websiteQuality: 'Low' | 'Medium' | 'High';
  socialMediaPresence: 'Low' | 'Medium' | 'High';
  googleVisibility: 'Low' | 'Medium' | 'High';
  lastDigitalActivity?: string;
  keyProjects?: string[];
  reasoning: string; // Brief explanation of the score
}

export interface AnalysisResult {
  analyzedFirms: AnalyzedFirm[];
  top10: AnalyzedFirm[];
  marketingStrategy: {
    title: string;
    targetAudienceAnalysis: string;
    valueProposition: string; // "Venice Panjur" & "Zip Curtain"
    outreachPlan: string[];
    emailTemplateSubject: string;
    emailTemplateBody: string;
  };
}

export enum ViewState {
  IDLE,
  ANALYZING,
  COMPLETE,
  ERROR
}