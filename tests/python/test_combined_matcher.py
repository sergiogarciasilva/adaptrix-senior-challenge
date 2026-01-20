#!/usr/bin/env python3
"""
Tests for the Combined Bounds Matcher.

These tests validate the candidate's implementation.
"""

import json
import pytest
from pathlib import Path

# Import will fail until candidate implements the module
try:
    from src.python.combined_bounds_matcher import CombinedBoundsMatcher
    from src.python.base.types import Bounds, MatchedEntity
    IMPORTS_AVAILABLE = True
except ImportError:
    IMPORTS_AVAILABLE = False


OUTPUT_FILE = Path(__file__).parent.parent.parent / "output" / "matched_bounds.json"


def load_output() -> dict:
    """Load the candidate's output file."""
    if not OUTPUT_FILE.exists():
        pytest.skip("Output file not found - run matcher first")
    
    with open(OUTPUT_FILE) as f:
        return json.load(f)


class TestOutputStructure:
    """Tests for correct output structure."""
    
    def test_has_matched_entities(self):
        """Output must have matched_entities array."""
        output = load_output()
        assert "matched_entities" in output
        assert isinstance(output["matched_entities"], list)
    
    def test_has_statistics(self):
        """Output must have statistics."""
        output = load_output()
        assert "statistics" in output
        assert "total_entities" in output["statistics"]
        assert "matched" in output["statistics"]
    
    def test_entity_structure(self):
        """Each entity must have required fields."""
        output = load_output()
        for entity in output["matched_entities"]:
            assert "entity_name" in entity
            assert "entity_type" in entity
            assert "match_strategy" in entity
            assert "confidence" in entity


class TestMatchingAccuracy:
    """Tests for matching accuracy."""
    
    def test_minimum_matches(self):
        """At least 50% of entities should be matched."""
        output = load_output()
        stats = output["statistics"]
        match_rate = (stats["matched"] + stats["partial_matched"]) / stats["total_entities"]
        assert match_rate >= 0.5, f"Match rate too low: {match_rate:.1%}"
    
    def test_confidence_scores_valid(self):
        """All confidence scores should be between 0 and 1."""
        output = load_output()
        for entity in output["matched_entities"]:
            assert 0 <= entity["confidence"] <= 1, \
                f"Invalid confidence: {entity['confidence']}"
    
    def test_oee_matched(self):
        """OEE entity should be matched with reasonable confidence."""
        output = load_output()
        oee_entities = [
            e for e in output["matched_entities"]
            if "oee" in e["entity_name"].lower()
        ]
        assert len(oee_entities) > 0, "OEE entity not found in results"
        assert oee_entities[0]["confidence"] > 0, "OEE should have some match confidence"


class TestBoundsValidity:
    """Tests for valid bounds."""
    
    def test_bounds_normalized(self):
        """Bounds coordinates should be normalized (0-1)."""
        output = load_output()
        for entity in output["matched_entities"]:
            if entity["bounds"]:
                bounds = entity["bounds"]
                assert 0 <= bounds["x"] <= 1, f"x not normalized: {bounds['x']}"
                assert 0 <= bounds["y"] <= 1, f"y not normalized: {bounds['y']}"
                assert 0 <= bounds["width"] <= 1, f"width not normalized: {bounds['width']}"
                assert 0 <= bounds["height"] <= 1, f"height not normalized: {bounds['height']}"
    
    def test_page_numbers_valid(self):
        """Page numbers should be 1-indexed and positive."""
        output = load_output()
        for entity in output["matched_entities"]:
            if entity["bounds"]:
                assert entity["bounds"]["page"] >= 1, \
                    f"Page should be 1-indexed: {entity['bounds']['page']}"


class TestStrategyUsage:
    """Tests for strategy pattern implementation."""
    
    def test_strategy_recorded(self):
        """Each matched entity should record which strategy was used."""
        output = load_output()
        for entity in output["matched_entities"]:
            if entity["confidence"] > 0:
                assert entity["match_strategy"] != "none", \
                    f"Strategy not recorded for {entity['entity_name']}"
    
    def test_strategies_used_tracked(self):
        """Statistics should track strategy usage."""
        output = load_output()
        stats = output["statistics"]
        assert "strategies_used" in stats
        # At least one strategy should be used
        if stats["matched"] + stats["partial_matched"] > 0:
            assert len(stats["strategies_used"]) > 0


@pytest.mark.skipif(not IMPORTS_AVAILABLE, reason="Implementation not complete")
class TestMatcherClass:
    """Tests for the CombinedBoundsMatcher class."""
    
    def test_initialization(self, tmp_path):
        """Matcher should initialize with valid PDF."""
        # This would require a real PDF file
        pytest.skip("Requires PDF fixture")
    
    def test_match_entity_returns_correct_type(self):
        """match_entity should return MatchedEntity."""
        pytest.skip("Requires PDF fixture")
