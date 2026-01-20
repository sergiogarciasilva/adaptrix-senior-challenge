/**
 * PDF Bounds Overlay Component
 *
 * Renders SVG overlays on top of a PDF viewer to highlight matched entities.
 *
 * WARNING: This component contains intentional bugs for the challenge.
 * Review carefully before using.
 */

import React, { useMemo } from 'react';
import type { MergedBounds, PDFDimensions } from '../types';

// BUG: Missing optional marker on several props
interface PDFBoundsOverlayProps {
  bounds: MergedBounds[];
  pdfDimensions: PDFDimensions;
  currentPage: number;
  onEntityClick: (entityName: string) => void; // BUG: Should be optional with ?
  selectedEntity: string; // BUG: Should be optional with ?
  showConfidence: boolean; // BUG: Should be optional with ?
}

interface BoundsRectProps {
  bounds: MergedBounds;
  isSelected: boolean;
  showConfidence: boolean;
  onClick: (entityName: string) => void;
}

const BoundsRect: React.FC<BoundsRectProps> = ({
  bounds,
  isSelected,
  showConfidence,
  onClick,
}) => {
  const { pixel_bounds, entity_name, confidence, color } = bounds;

  const handleClick = () => {
    onClick(entity_name);
  };

  return (
    <g>
      <rect
        x={pixel_bounds.x}
        y={pixel_bounds.y}
        width={pixel_bounds.width}
        height={pixel_bounds.height}
        fill={color}
        fillOpacity={isSelected ? 0.4 : 0.2}
        stroke={color}
        strokeWidth={isSelected ? 2 : 1}
        // BUG: Using onClick but should be onMouseDown for better UX
        onClick={handleClick}
        style={{ cursor: 'pointer' }}
      />
      {showConfidence && (
        <text
          x={pixel_bounds.x + 2}
          y={pixel_bounds.y + 12}
          fontSize={10}
          fill="#333"
        >
          {(confidence * 100).toFixed(0)}%
        </text>
      )}
    </g>
  );
};

export const PDFBoundsOverlay: React.FC<PDFBoundsOverlayProps> = ({
  bounds,
  pdfDimensions,
  currentPage,
  onEntityClick,
  selectedEntity,
  showConfidence,
}) => {
  // Filter bounds for current page
  const pageBounds = useMemo(
    () => bounds.filter((b) => b.pixel_bounds.page === currentPage),
    [bounds, currentPage]
  );

  // BUG: Missing default handler when onEntityClick is undefined
  const handleEntityClick = (entityName: string) => {
    onEntityClick(entityName);
  };

  const svgWidth = pdfDimensions.width * pdfDimensions.scale;
  const svgHeight = pdfDimensions.height * pdfDimensions.scale;

  return (
    <svg
      width={svgWidth}
      height={svgHeight}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'none',
      }}
    >
      <g style={{ pointerEvents: 'auto' }}>
        {pageBounds.map((bound, index) => (
          <BoundsRect
            key={`${bound.entity_name}-${index}`}
            bounds={bound}
            isSelected={selectedEntity === bound.entity_name}
            showConfidence={showConfidence}
            onClick={handleEntityClick}
          />
        ))}
      </g>
    </svg>
  );
};

export default PDFBoundsOverlay;
