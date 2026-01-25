/**
 * Type definitions for Fortune Telling application
 */

export interface SajuPillar {
    year: string;
    month: string;
    day: string;
    hour: string;
}

export interface DayMaster {
    name: string;
    element: string;
}

export interface ElementsAnalysis {
    Wood: number;
    Fire: number;
    Earth: number;
    Metal: number;
    Water: number;
    [key: string]: number; // Index signature for compatibility
}

export interface FortuneAnalysis {
    summary_for_llm: string;
    day_master: DayMaster;
    elements: ElementsAnalysis;
}

export interface FortuneResult {
    saju: SajuPillar;
    analysis: FortuneAnalysis;
    interpretation: string;
}
