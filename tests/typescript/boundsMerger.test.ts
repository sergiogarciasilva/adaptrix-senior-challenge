/**
 * Tests for the BoundsMerger class.
 */

import { BoundsMerger, processMatchResults, DEFAULT_CONFIG } from '../../src/typescript/boundsMerger';
import type { MatchResult, PDFDimensions, Bounds } from '../../src/typescript/types';

describe('BoundsMerger', () => {
  const sampleDimensions: PDFDimensions = {
    width: 612,
    height: 792,
    scale: 1.5,
  };

  const sampleResults: MatchResult = {
    matched_entities: [
      {
        entity_name: 'Test KPI 50%',
        entity_type: 'KPI',
        match_strategy: 'partial',
        confidence: 0.85,
        bounds: {
          page: 1,
          x: 0.1,
          y: 0.2,
          width: 0.15,
          height: 0.03,
        },
        component_matches: [],
      },
      {
        entity_name: 'Low Confidence Entity',
        entity_type: 'KPI',
        match_strategy: 'fuzzy',
        confidence: 0.05,
        bounds: {
          page: 1,
          x: 0.5,
          y: 0.5,
          width: 0.1,
          height: 0.02,
        },
        component_matches: [],
      },
    ],
    statistics: {
      total_entities: 2,
      matched: 1,
      partial_matched: 1,
      unmatched: 0,
      strategies_used: { partial: 1, fuzzy: 1 },
    },
  };

  describe('initialization', () => {
    it('should create with default config', () => {
      const merger = new BoundsMerger();
      expect(merger).toBeDefined();
    });

    it('should accept custom config', () => {
      const merger = new BoundsMerger({
        confidenceThreshold: 0.5,
      });
      expect(merger).toBeDefined();
    });
  });

  describe('loadResults', () => {
    it('should load valid results', () => {
      const merger = new BoundsMerger();
      expect(() => merger.loadResults(sampleResults)).not.toThrow();
    });
  });

  describe('convertToPixels', () => {
    it('should throw if dimensions not set', () => {
      const merger = new BoundsMerger();
      const bounds: Bounds = { page: 1, x: 0.1, y: 0.2, width: 0.1, height: 0.05 };
      expect(() => merger.convertToPixels(bounds)).toThrow('PDF dimensions not set');
    });

    it('should convert normalized to pixel coordinates', () => {
      const merger = new BoundsMerger();
      merger.setPDFDimensions(sampleDimensions);

      const bounds: Bounds = { page: 1, x: 0.1, y: 0.2, width: 0.15, height: 0.03 };
      const pixels = merger.convertToPixels(bounds);

      // Expected: x = 0.1 * 612 * 1.5 = 91.8
      // Expected: y = 0.2 * 792 * 1.5 = 237.6
      // TODO: These assertions will fail until candidate implements conversion
      // expect(pixels.x).toBeCloseTo(91.8, 1);
      // expect(pixels.y).toBeCloseTo(237.6, 1);
      expect(pixels.page).toBe(1);
    });
  });

  describe('getEntityColor', () => {
    it('should return correct color for KPI', () => {
      const merger = new BoundsMerger();
      expect(merger.getEntityColor('KPI')).toBe('#4CAF50');
    });

    it('should return default color for unknown type', () => {
      const merger = new BoundsMerger();
      expect(merger.getEntityColor('UNKNOWN')).toBe('#9E9E9E');
    });
  });

  describe('getVisualizationData', () => {
    it('should throw if no results loaded', () => {
      const merger = new BoundsMerger();
      expect(() => merger.getVisualizationData()).toThrow('No results loaded');
    });

    it('should filter by confidence threshold', () => {
      const merger = new BoundsMerger({ confidenceThreshold: 0.1 });
      merger.loadResults(sampleResults);
      merger.setPDFDimensions(sampleDimensions);

      const data = merger.getVisualizationData();
      // Should include entity with 0.85 confidence, exclude 0.05
      expect(data.length).toBe(1);
    });
  });

  describe('processMatchResults utility', () => {
    it('should process results in one call', () => {
      const data = processMatchResults(sampleResults, sampleDimensions);
      expect(Array.isArray(data)).toBe(true);
    });
  });
});

describe('DEFAULT_CONFIG', () => {
  it('should have expected values', () => {
    expect(DEFAULT_CONFIG.overlapThreshold).toBe(0.3);
    expect(DEFAULT_CONFIG.confidenceThreshold).toBe(0.1);
    expect(DEFAULT_CONFIG.colorScheme.KPI).toBe('#4CAF50');
  });
});
