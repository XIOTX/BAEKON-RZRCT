// FL Text Analysis Service - Enhanced with Giselians + Nodespaces Intelligence
import { FL_KNOWLEDGE_BASE, getRelevantKnowledge, type DecryptionStrategy } from './fl-knowledge';

export interface FLAnalysisResult {
  strategies: DecryptionStrategy[];
  patterns: string[];
  insights: string[];
  nodespacesGuidance?: string;
  giseliansContext?: string;
  sources: string[];
}

export class FLAnalyzer {
  
  static analyzeText(text: string): FLAnalysisResult {
    const patterns = this.identifyPatterns(text);
    const strategies = getRelevantKnowledge(text);
    const insights = this.generateInsights(text, patterns);
    
    return {
      strategies,
      patterns,
      insights,
      nodespacesGuidance: this.getNodespacesGuidance(patterns),
      giseliansContext: this.getGiseliansContext(patterns),
      sources: this.getSources(strategies)
    };
  }
  
  private static identifyPatterns(text: string): string[] {
    const patterns: string[] = [];
    
    // Statistical mechanical patterns
    if (this.hasRepeatingStructures(text)) {
      patterns.push('repetitive structures');
    }
    
    if (this.hasSymmetryBreaking(text)) {
      patterns.push('symmetry breaking');
    }
    
    // Biosemiotic patterns
    if (this.hasSymbolicClusters(text)) {
      patterns.push('symbolic clusters');
    }
    
    if (this.hasMultiLayeredSemantics(text)) {
      patterns.push('multi-layered semantics');
    }
    
    // Quantum consciousness patterns
    if (this.hasConsciousnessStates(text)) {
      patterns.push('consciousness states');
    }
    
    if (this.hasRealityShifts(text)) {
      patterns.push('reality shifts');
    }
    
    // Fractal linguistic patterns
    if (this.hasNestedHierarchies(text)) {
      patterns.push('nested hierarchies');
    }
    
    if (this.hasScaleInvariance(text)) {
      patterns.push('scale invariance');
    }
    
    // Adaptive response patterns
    if (this.hasDynamicEncoding(text)) {
      patterns.push('dynamic encoding');
    }
    
    // Multi-dimensional patterns
    if (this.hasDimensionalReferences(text)) {
      patterns.push('dimensional references');
    }
    
    return patterns;
  }
  
  private static getSources(strategies: DecryptionStrategy[]): string[] {
    return strategies
      .map(s => s.internalRef)
      .filter((ref): ref is string => !!ref)
      .filter((ref, index, arr) => arr.indexOf(ref) === index); // Remove duplicates
  }
  
  private static generateInsights(text: string, patterns: string[]): string[] {
    const insights: string[] = [];
    
    if (patterns.includes('repetitive structures')) {
      insights.push('Text shows statistical mechanical properties - may respond to Ising model analysis');
    }
    
    if (patterns.includes('symbolic clusters')) {
      insights.push('Biosemiotic analysis recommended - cultural sign dimensions detected');
    }
    
    if (patterns.includes('consciousness states')) {
      insights.push('Quantum consciousness patterns suggest external thought integration');
    }
    
    if (patterns.includes('nested hierarchies')) {
      insights.push('Fractal structure detected - self-similar patterns across scales');
    }
    
    if (patterns.includes('dynamic encoding')) {
      insights.push('Adaptive response detected - text may change based on analysis attempts');
    }
    
    if (patterns.includes('dimensional references')) {
      insights.push('Multi-dimensional communication patterns - possible braneworld encoding');
    }
    
    // Nodespaces-specific insights
    if (this.hasNodespacesMarkers(text)) {
      insights.push('Nodespaces framework applicable - check for critical exponents and attractors');
    }
    
    // Giselians-specific insights
    if (this.hasGiseliansMarkers(text)) {
      insights.push('Giselians context detected - interspecies communication protocols may apply');
    }
    
    return insights;
  }
  
  private static getNodespacesGuidance(patterns: string[]): string | undefined {
    if (patterns.includes('repetitive structures') || patterns.includes('scale invariance')) {
      return 'Apply Vectorial system analysis: Look for manifold M states, time evolution patterns f:M→M, and convergence to attractor states. Check for critical exponent signatures (beta values 1.240, 2.2, 2.075).';
    }
    
    if (patterns.includes('nested hierarchies')) {
      return 'Fractal linguistics approach: Analyze self-similar patterns across multiple scales. This is not a constructed language but an evolved system following statistical mechanical principles.';
    }
    
    return undefined;
  }
  
  private static getGiseliansContext(patterns: string[]): string | undefined {
    if (patterns.includes('consciousness states') || patterns.includes('reality shifts')) {
      return 'Quantum consciousness framework: Text may contain external thought patterns or parallel reality references. Giselians exist in "realm of eternity" - different temporal/spatial context.';
    }
    
    if (patterns.includes('symbolic clusters')) {
      return 'Postbiological communication: Higher-level correlation of signals detected. Giselians use unique information entanglement methods - instant symbolic meaning transfer vs. time-consuming language.';
    }
    
    if (patterns.includes('dynamic encoding')) {
      return 'Adaptive response system: Giselians show increased effectiveness after being attacked. Text may be defensively adapting to analysis attempts - consider strategic retreat approach.';
    }
    
    return undefined;
  }
  
  // Pattern detection methods
  private static hasRepeatingStructures(text: string): boolean {
    // Look for repeated word patterns, phrase structures
    const words = text.toLowerCase().split(/\s+/);
    const wordFreq = new Map<string, number>();
    
    words.forEach(word => {
      wordFreq.set(word, (wordFreq.get(word) || 0) + 1);
    });
    
    const repeatedWords = Array.from(wordFreq.values()).filter(count => count > 2);
    return repeatedWords.length > words.length * 0.1; // 10% threshold
  }
  
  private static hasSymmetryBreaking(text: string): boolean {
    // Look for sudden pattern changes, structural breaks
    const sentences = text.split(/[.!?]+/);
    if (sentences.length < 3) return false;
    
    const lengths = sentences.map(s => s.trim().length);
    const avgLength = lengths.reduce((a, b) => a + b, 0) / lengths.length;
    const variance = lengths.reduce((acc, len) => acc + Math.pow(len - avgLength, 2), 0) / lengths.length;
    
    return Math.sqrt(variance) > avgLength * 0.5; // High variance indicates breaks
  }
  
  private static hasSymbolicClusters(text: string): boolean {
    // Look for groups of unusual characters, symbols, or formatting
    const symbolPattern = /[^\w\s.,!?;:()]/g;
    const symbols = text.match(symbolPattern);
    return symbols ? symbols.length > text.length * 0.05 : false; // 5% threshold
  }
  
  private static hasMultiLayeredSemantics(text: string): boolean {
    // Look for nested meanings, parenthetical expressions, multiple interpretations
    const nestedPattern = /\([^)]*\)|\[[^\]]*\]|\{[^}]*\}/g;
    const nested = text.match(nestedPattern);
    return nested ? nested.length > 2 : false;
  }
  
  private static hasConsciousnessStates(text: string): boolean {
    // Look for consciousness-related terms, state changes, awareness levels
    const consciousnessTerms = /\b(conscious|awareness|thought|mind|dream|reality|perception|experience)\b/gi;
    const matches = text.match(consciousnessTerms);
    return matches ? matches.length > 3 : false;
  }
  
  private static hasRealityShifts(text: string): boolean {
    // Look for reality transition markers, dimensional references
    const realityTerms = /\b(reality|dimension|world|universe|parallel|quantum|shift|transition)\b/gi;
    const matches = text.match(realityTerms);
    return matches ? matches.length > 2 : false;
  }
  
  private static hasNestedHierarchies(text: string): boolean {
    // Look for hierarchical structures, nested lists, recursive patterns
    const hierarchyPattern = /^\s*[-*+]\s+/gm;
    const indentPattern = /^\s{2,}/gm;
    const hierarchyMatches = text.match(hierarchyPattern);
    const indentMatches = text.match(indentPattern);
    
    return (hierarchyMatches && hierarchyMatches.length > 2) || (indentMatches && indentMatches.length > 2);
  }
  
  private static hasScaleInvariance(text: string): boolean {
    // Look for patterns that repeat at different scales
    const words = text.toLowerCase().split(/\s+/);
    const trigrams = [];
    
    for (let i = 0; i < words.length - 2; i++) {
      trigrams.push(words.slice(i, i + 3).join(' '));
    }
    
    const trigramFreq = new Map<string, number>();
    trigrams.forEach(trigram => {
      trigramFreq.set(trigram, (trigramFreq.get(trigram) || 0) + 1);
    });
    
    const repeatedTrigrams = Array.from(trigramFreq.values()).filter(count => count > 1);
    return repeatedTrigrams.length > trigrams.length * 0.1;
  }
  
  private static hasDynamicEncoding(text: string): boolean {
    // Look for encoding markers, variable structures, adaptive patterns
    const encodingMarkers = /\b(encode|decode|cipher|key|transform|adapt|modify|change)\b/gi;
    const matches = text.match(encodingMarkers);
    return matches ? matches.length > 1 : false;
  }
  
  private static hasDimensionalReferences(text: string): boolean {
    // Look for multi-dimensional concepts, spatial references
    const dimensionalTerms = /\b(dimension|space|time|brane|manifold|vector|matrix|coordinate)\b/gi;
    const matches = text.match(dimensionalTerms);
    return matches ? matches.length > 2 : false;
  }
  
  private static hasNodespacesMarkers(text: string): boolean {
    // Look for Nodespaces-specific terminology
    const nodespacesTerms = /\b(ising|vectorial|manifold|attractor|exponent|beta|lyapunov|statistical|mechanical)\b/gi;
    const matches = text.match(nodespacesTerms);
    return matches ? matches.length > 1 : false;
  }
  
  private static hasGiseliansMarkers(text: string): boolean {
    // Look for Giselians-specific terminology
    const giseliansTerms = /\b(giselian|postbiological|quantum|consciousness|simulation|beacon|artifact|biosemiosphere)\b/gi;
    const matches = text.match(giseliansTerms);
    return matches ? matches.length > 1 : false;
  }
}

export default FLAnalyzer;
