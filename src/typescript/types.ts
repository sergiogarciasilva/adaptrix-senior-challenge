/**
 * Type definitions for the bounds matching system.
 */

export interface Bounds {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ComponentMatch {
  text: string;
  bounds: Bounds | null;
}

export interface MatchedEntity {
  entity_name: string;
  entity_type: string;
  match_strategy: string;
  confidence: number;
  bounds: Bounds | null;
  component_matches: ComponentMatch[];
}

export interface MatchStatistics {
  total_entities: number;
  matched: number;
  partial_matched: number;
  unmatched: number;
  strategies_used: Record<string, number>;
}

export interface MatchResult {
  matched_entities: MatchedEntity[];
  statistics: MatchStatistics;
}

export interface PixelBounds {
  page: number;
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MergedBounds {
  entity_name: string;
  pixel_bounds: PixelBounds;
  confidence: number;
  color: string;
}

export interface PDFDimensions {
  width: number;
  height: number;
  scale: number;
}
