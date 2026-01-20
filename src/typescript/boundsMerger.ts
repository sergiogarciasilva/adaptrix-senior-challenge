/**
 * Bounds Merger - Senior Challenge
 *
 * Your task: Implement the bounds merging and coordinate conversion
 * for the PDF visualization overlay.
 *
 * Deliverables:
 * 1. Parse matched bounds from Python output
 * 2. Merge overlapping bounding boxes
 * 3. Convert normalized coordinates to pixel coordinates
 * 4. Export data for React component consumption
 */

import type {
  Bounds,
  MatchedEntity,
  MatchResult,
  PixelBounds,
  MergedBounds,
  PDFDimensions,
} from './types';

/**
 * Configuration for bounds merging.
 */
interface MergerConfig {
  overlapThreshold: number; // Minimum overlap percentage to merge (0-1)
  confidenceThreshold: number; // Minimum confidence to include
  colorScheme: Record<string, string>; // Entity type -> color mapping
}

const DEFAULT_CONFIG: MergerConfig = {
  overlapThreshold: 0.3,
  confidenceThreshold: 0.1,
  colorScheme: {
    KPI: '#4CAF50',
    DATE: '#2196F3',
    ORGANIZATION: '#FF9800',
    default: '#9E9E9E',
  },
};

/**
 * BoundsMerger class - processes matched entities for visualization.
 *
 * TODO: Implement the following methods:
 * 1. loadResults()
 * 2. convertToPixels()
 * 3. detectOverlaps()
 * 4. mergeBounds()
 * 5. getVisualizationData()
 */
export class BoundsMerger {
  private results: MatchResult | null = null;
  private config: MergerConfig;
  private pdfDimensions: PDFDimensions | null = null;

  constructor(config: Partial<MergerConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  /**
   * Load match results from JSON.
   */
  loadResults(jsonData: MatchResult): void {
    // TODO: Validate and load results
    this.results = jsonData;
  }

  /**
   * Set the PDF dimensions for coordinate conversion.
   */
  setPDFDimensions(dimensions: PDFDimensions): void {
    this.pdfDimensions = dimensions;
  }

  /**
   * Convert normalized bounds (0-1) to pixel coordinates.
   *
   * @param bounds - Normalized bounds from Python
   * @returns Pixel bounds for SVG rendering
   */
  convertToPixels(bounds: Bounds): PixelBounds {
    // TODO: Implement coordinate conversion
    //
    // Formula:
    // pixel_x = normalized_x * page_width * scale
    // pixel_y = normalized_y * page_height * scale
    // pixel_width = normalized_width * page_width * scale
    // pixel_height = normalized_height * page_height * scale

    if (!this.pdfDimensions) {
      throw new Error('PDF dimensions not set');
    }

    return {
      page: bounds.page,
      x: 0,
      y: 0,
      width: 0,
      height: 0,
    };
  }

  /**
   * Check if two bounds overlap.
   *
   * @param a - First bounds
   * @param b - Second bounds
   * @returns Overlap percentage (0-1)
   */
  calculateOverlap(a: PixelBounds, b: PixelBounds): number {
    // TODO: Implement overlap calculation
    //
    // If on different pages, no overlap
    // Calculate intersection area
    // Return intersection / union ratio

    return 0;
  }

  /**
   * Merge overlapping bounds into a single bounding box.
   *
   * @param boundsArray - Array of bounds to potentially merge
   * @returns Merged bounds
   */
  mergeBounds(boundsArray: PixelBounds[]): PixelBounds {
    // TODO: Implement bounds merging
    //
    // Find the minimum x, minimum y
    // Find the maximum (x + width), maximum (y + height)
    // Return encompassing bounds

    if (boundsArray.length === 0) {
      throw new Error('Cannot merge empty bounds array');
    }

    return boundsArray[0];
  }

  /**
   * Get color for entity type.
   */
  getEntityColor(entityType: string): string {
    return this.config.colorScheme[entityType] || this.config.colorScheme.default;
  }

  /**
   * Process all matched entities and return visualization-ready data.
   *
   * @returns Array of merged bounds ready for SVG rendering
   */
  getVisualizationData(): MergedBounds[] {
    // TODO: Implement full processing pipeline
    //
    // 1. Filter by confidence threshold
    // 2. Convert all bounds to pixels
    // 3. Group by page
    // 4. Detect and merge overlapping bounds
    // 5. Add colors based on entity type
    // 6. Return visualization-ready data

    if (!this.results) {
      throw new Error('No results loaded');
    }

    const visualData: MergedBounds[] = [];

    for (const entity of this.results.matched_entities) {
      if (entity.confidence < this.config.confidenceThreshold) {
        continue;
      }

      if (entity.bounds) {
        const pixelBounds = this.convertToPixels(entity.bounds);
        visualData.push({
          entity_name: entity.entity_name,
          pixel_bounds: pixelBounds,
          confidence: entity.confidence,
          color: this.getEntityColor(entity.entity_type),
        });
      }
    }

    return visualData;
  }
}

/**
 * Utility function to load and process results in one call.
 */
export function processMatchResults(
  jsonData: MatchResult,
  pdfDimensions: PDFDimensions,
  config?: Partial<MergerConfig>
): MergedBounds[] {
  const merger = new BoundsMerger(config);
  merger.loadResults(jsonData);
  merger.setPDFDimensions(pdfDimensions);
  return merger.getVisualizationData();
}

export { DEFAULT_CONFIG };
export type { MergerConfig };
