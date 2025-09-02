export interface ContentData {
  type: string;
  title: string;
  path?: string;
  size?: string;
  description: string;
  content: string;
  metadata?: Record<string, string>;
  features?: string;
  documentContent?: string;
  sampleData?: any[];
  visualizations?: any[];
}

export const getFileContent = async (filePath: string, fileName: string, fileType: string): Promise<ContentData> => {
  // Simulate loading delay
  await new Promise(resolve => setTimeout(resolve, 300));

  if (filePath === 'forgotten-languages/overview.md') {
    return {
      type: 'overview',
      title: '📋 Forgotten Languages Research Overview',
      path: filePath,
      size: '89KB',
      description: 'Comprehensive overview of FL research domains and major topic areas',
      content: 'High-level analysis of the Forgotten Languages corpus, major research themes, and organizational structure.',
      metadata: {
        'Research Domains': '5 major areas',
        'Coverage': 'Comprehensive survey',
        'Confidence Level': 'High (Structural)',
        'Last Updated': '2024-01-15'
      },
      features: 'Domain navigation, topic overviews, research pathways.',
      documentContent: `# Forgotten Languages Research Overview

## Executive Summary
The Forgotten Languages corpus represents a comprehensive collection of linguistic, technical, and philosophical materials organized into five major research domains. This overview provides strategic navigation through the primary topic areas and their interconnections.

## Major Research Domains

### 🛡️ Military & Defense Applications
**Scope**: Advanced positioning systems, defense integration protocols, strategic communications
**Key Systems**: SV17Q System, Cassini Diskus, Defense Integration Protocols
**Confidence**: High (FL Direct) - Extensive documentation and technical specifications
**Applications**: Spatial navigation, strategic positioning, secure communications

### 🔮 Occult & Spirituality Studies  
**Scope**: Mystical traditions, esoteric knowledge systems, spiritual frameworks
**Key Systems**: Giselians, Queltron System, Transformation Protocols
**Confidence**: Medium to Low (Interpretive) - Requires careful analysis
**Applications**: Consciousness exploration, spiritual practices, mystical interpretation

### 🧠 Consciousness & Cognitive Studies
**Scope**: Information processing, awareness states, cognitive architecture
**Key Systems**: NodeSpaces, Consciousness Mapping, Information Theory
**Confidence**: Medium (Theoretical) - Strong conceptual frameworks
**Applications**: Cognitive modeling, consciousness research, information processing

### 🗣️ Linguistic Systems & Translation
**Scope**: Core FL languages, translation methodologies, linguistic analysis
**Key Systems**: Aylid, Yid, Ned, Drizza languages with translation frameworks
**Confidence**: High (FL Direct) - Extensive lexical databases
**Applications**: Translation services, linguistic analysis, pattern recognition

### 📊 Research Data & Analysis
**Scope**: Primary source materials, community research, analytical tools
**Key Systems**: Ana's Index, Community Vault, Research Databases
**Confidence**: Variable (Source-dependent) - Comprehensive documentation
**Applications**: Data mining, research analysis, collaborative investigation

## Navigation Strategy
1. **Start with domain overviews** for broad understanding
2. **Drill down to specific systems** for detailed analysis  
3. **Access implementation details** for practical applications
4. **Cross-reference related topics** for comprehensive coverage

## Research Pathways
- **Technical Focus**: Military-Defense → Consciousness Studies → Linguistic Systems
- **Mystical Focus**: Occult-Spirituality → Consciousness Studies → Research Data
- **Academic Focus**: Linguistic Systems → Research Data → All supporting domains

*This overview provides strategic navigation through FL research domains. Select specific folders to explore detailed topic areas.*`
    };
  }

  if (filePath === 'forgotten-languages/military-defense/overview.md') {
    return {
      type: 'overview',
      title: '🛡️ Military & Defense Applications Overview',
      path: filePath,
      size: '67KB',
      description: 'Strategic overview of FL military and defense applications',
      content: 'Comprehensive analysis of defense-related FL systems, applications, and strategic implementations.',
      metadata: {
        'Systems Covered': 'SV17Q, Cassini Diskus, Defense Integration',
        'Classification': 'RESTRICTED ACCESS',
        'Confidence Level': 'High (FL Direct)',
        'Applications': 'Strategic positioning, secure communications'
      },
      features: 'Strategic analysis, system overviews, implementation guides.',
      documentContent: `# Military & Defense Applications Overview

## Strategic Context
FL military and defense applications represent the most documented and technically sophisticated aspects of the corpus. These systems demonstrate advanced understanding of spatial positioning, secure communications, and strategic coordination.

## Primary Defense Systems

### SV17Q System
**Classification**: RESTRICTED  
**Function**: Advanced strategic positioning and coordination
**Status**: Operational specifications available
**Applications**: Strategic positioning, tactical coordination, secure communications
**Technical Maturity**: High - Comprehensive implementation protocols

### Cassini Diskus
**Classification**: TECHNICAL RESTRICTED
**Function**: Global spatial positioning and navigation framework  
**Status**: Extensive coordinate databases and analysis tools
**Applications**: Geographic positioning, spatial analysis, defense integration
**Technical Maturity**: Very High - 50,000+ coordinate points documented

### Defense Integration Protocols
**Classification**: CLASSIFIED
**Function**: Integration methodologies for FL systems in defense applications
**Status**: Encrypted specifications and access controls
**Applications**: System integration, security protocols, operational deployment
**Technical Maturity**: Advanced - Requires security clearance

## Strategic Advantages

### Spatial Precision
FL positioning systems demonstrate accuracy levels of ±0.001 arc-seconds, providing:
- Strategic positioning advantages
- Enhanced navigation capabilities  
- Precise coordinate referencing
- Global coverage networks

### Secure Communications
Advanced linguistic frameworks enable:
- Encrypted communication protocols
- Strategic information sharing
- Operational security measures
- Inter-system coordination

### Integration Capabilities
Sophisticated integration protocols support:
- Multi-system coordination
- Strategic planning frameworks
- Operational deployment strategies
- Real-time tactical adjustments

*Access to detailed specifications requires appropriate security clearance*`
    };
  }

  if (filePath === 'forgotten-languages/research-data/anas-index.db') {
    return {
      type: 'database',
      title: '🗄️ Ana\'s Index Database',
      path: filePath,
      size: '21.9MB',
      description: 'Primary FL document corpus with comprehensive indexing and search capabilities',
      content: 'Central repository containing 21.9MB of FL research documents, articles, and analysis with full-text search and metadata indexing.',
      metadata: {
        'Total Documents': '2,847 entries',
        'Index Size': '21.9MB',
        'Last Updated': '2024-01-20',
        'Search Capability': 'Full-text + metadata'
      },
      features: 'Full-text search, metadata filtering, document analysis, cross-referencing.',
      sampleData: [
        {
          title: 'SV17Q Positioning Protocol Analysis',
          excerpt: 'Detailed analysis of the SV17Q strategic positioning system reveals advanced coordinate transformation methodologies...',
          category: 'Military Systems',
          date: '2024-01-15',
          contributor: 'Research Team Alpha',
          confidence: 'High (FL Direct)'
        },
        {
          title: 'Drizza Language Mystical Connections',
          excerpt: 'Investigation into Drizza terminology suggests deep connections to Sufi mystical traditions and esoteric knowledge systems...',
          category: 'Linguistic Analysis',
          date: '2024-01-12',
          contributor: 'Dr. Elena Vasquez',
          confidence: 'Medium (Interpretive)'
        },
        {
          title: 'NodeSpaces Consciousness Mapping',
          excerpt: 'The NodeSpaces framework provides a sophisticated model for consciousness state transitions and information processing...',
          category: 'Consciousness Studies',
          date: '2024-01-10',
          contributor: 'Cognitive Research Lab',
          confidence: 'Medium (Theoretical)'
        }
      ]
    };
  }

  if (filePath === 'forgotten-languages/occult-spirituality/giselians/sufism-connections.md') {
    return {
      type: 'markdown',
      title: '🌙 Sufism and FL: Mystical Connections',
      path: filePath,
      size: '178KB',
      description: 'Analysis of connections between FL terminology and Sufi mystical traditions',
      content: 'Detailed examination of Drizza language terms and their potential correlations with Sufi concepts and practices.',
      metadata: {
        'Language Focus': 'Drizza',
        'Research Area': 'Mystical Traditions',
        'Confidence Level': 'Medium (Interpretive)',
        'Cross-References': '47 Sufi concepts'
      },
      features: 'Mystical analysis, spiritual connections, esoteric interpretation.',
      documentContent: `# Sufism and FL: Mystical Connections

## Overview
Analysis of Drizza language terms reveals potential connections to Sufi mystical traditions and esoteric knowledge systems.

## Key Correlations

### Mystical Terminology
Drizza terms showing Sufi parallels:
- **mystara**: "hidden knowledge" → Sufi concept of batin (hidden meaning)
- **sufinek**: "spiritual connection" → Direct reference to Sufi practices
- **alchemor**: "transformation process" → Alchemical and spiritual transformation

### Spiritual Geography
FL coordinate systems may encode:
- Sacred site locations
- Mystical energy points
- Spiritual pathway mappings

## Theoretical Connections

### The Hidden Dimension
Sufi tradition speaks of hidden dimensions of reality. FL may represent:
- Encoded mystical teachings
- Spiritual navigation systems
- Consciousness expansion methodologies

### Transformation Processes
Both Sufism and FL reference transformation through:
- Linguistic pattern recognition
- Consciousness state changes
- Spiritual awakening processes

*Note: These connections remain speculative and require further investigation*`
    };
  }

  if (filePath === 'forgotten-languages/military-defense/cassini-diskus/coordinates.dat') {
    return {
      type: 'data',
      title: '📊 Cassini Diskus Coordinate Database',
      path: filePath,
      size: '3.2MB',
      description: 'Comprehensive coordinate database with 50,000+ global positioning points',
      content: 'High-precision coordinate data with elevation, classification, and strategic significance markers.',
      metadata: {
        'Total Coordinates': '50,247 points',
        'Precision': '±0.001 arc-seconds',
        'Coverage': 'Global',
        'Classification': 'RESTRICTED'
      },
      features: 'Coordinate analysis, spatial visualization, strategic mapping.',
      sampleData: [
        {
          id: 'CD-001847',
          lat: 37.4419,
          lon: -122.1430,
          elevation: 56,
          type: 'Strategic Point',
          confidence: 'High'
        },
        {
          id: 'CD-002156',
          lat: 51.5074,
          lon: -0.1278,
          elevation: 11,
          type: 'Reference Node',
          confidence: 'High'
        },
        {
          id: 'CD-003421',
          lat: 35.6762,
          lon: 139.6503,
          elevation: 40,
          type: 'Navigation Point',
          confidence: 'Medium'
        }
      ],
      visualizations: [
        {
          type: 'ascii_map',
          title: 'Global Distribution',
          content: `
    ╭─────────────────────────────────────────╮
    │  CASSINI DISKUS - GLOBAL COORDINATES    │
    ├─────────────────────────────────────────┤
    │                                         │
    │    ●     ●        ●    ●               │
    │  ●   ●     ●    ●   ●     ●            │
    │     ●   ●     ●       ●     ●          │
    │  ●     ●   ●     ●  ●    ●    ●        │
    │    ●     ●   ●     ●   ●   ●           │
    │  ●   ●     ●    ●     ●      ●         │
    │     ●   ●     ●    ●     ●    ●        │
    │                                         │
    ├─────────────────────────────────────────┤
    │ Total Points: 50,247 | Precision: High │
    ╰─────────────────────────────────────────╯`
        }
      ]
    };
  }

  if (filePath === 'forgotten-languages/consciousness-studies/nodespaces/consciousness-studies.md') {
    return {
      type: 'markdown',
      title: '💭 NodeSpaces Consciousness Framework',
      path: filePath,
      size: '234KB',
      description: 'Advanced consciousness mapping and information processing architecture',
      content: 'Theoretical framework for understanding consciousness states and information flow through NodeSpaces topology.',
      metadata: {
        'Framework': 'NodeSpaces',
        'Research Area': 'Consciousness Studies',
        'Confidence Level': 'Medium (Theoretical)',
        'Applications': 'Cognitive modeling, AI research'
      },
      features: 'Consciousness mapping, topology analysis, information flow modeling.',
      documentContent: `# NodeSpaces Consciousness Framework

## Theoretical Foundation
NodeSpaces represents a sophisticated model for understanding consciousness as a topological information processing system. This framework maps awareness states as interconnected nodes within a multidimensional space.

## Core Concepts

### Information Nodes
Discrete units of conscious experience represented as:
- **Perception Nodes**: Sensory input processing points
- **Memory Nodes**: Information storage and retrieval centers  
- **Processing Nodes**: Analytical and synthetic operations
- **Output Nodes**: Decision and action generation points

### Topological Connections
Consciousness emerges from the dynamic connections between nodes:
- **Direct Links**: Immediate information transfer
- **Indirect Pathways**: Multi-step processing chains
- **Feedback Loops**: Self-referential awareness mechanisms
- **Parallel Processing**: Simultaneous multi-node operations

### State Transitions
Consciousness states change through:
- **Node Activation**: Bringing specific nodes online
- **Connection Strength**: Varying information flow rates
- **Network Topology**: Restructuring node relationships
- **Temporal Dynamics**: Time-dependent state evolution

## Applications

### Cognitive Modeling
- Mapping human consciousness patterns
- Understanding decision-making processes
- Modeling memory formation and retrieval
- Analyzing attention and focus mechanisms

### AI Development
- Designing artificial consciousness architectures
- Creating adaptive learning systems
- Building self-aware AI frameworks
- Developing human-AI interfaces

*This framework provides a foundation for understanding consciousness as an information processing phenomenon*`
    };
  }

  if (filePath === 'forgotten-languages/consciousness-studies/nodespaces/topology.graph') {
    return {
      type: 'graph',
      title: '🕸️ NodeSpaces Topology Graph',
      path: filePath,
      size: '567KB',
      description: 'Visual representation of consciousness node connections and information flow patterns',
      content: 'Graph data showing the topological structure of NodeSpaces with node relationships and connection strengths.',
      metadata: {
        'Nodes': '2,847 consciousness points',
        'Connections': '15,623 information pathways',
        'Complexity': 'High (Multi-dimensional)',
        'Format': 'Graph topology data'
      },
      features: 'Network visualization, path analysis, connection mapping.',
      visualizations: [
        {
          type: 'ascii_graph',
          title: 'NodeSpaces Network Structure',
          content: `
    ╭─────────────────────────────────────────╮
    │       NODESPACES TOPOLOGY GRAPH         │
    ├─────────────────────────────────────────┤
    │                                         │
    │    ●─────●─────●─────●─────●            │
    │    │     │     │     │     │            │
    │    │     ●─────●─────●─────●            │
    │    │     │     │     │     │            │
    │    ●─────●─────●─────●─────●            │
    │    │     │     │     │     │            │
    │    │     ●─────●─────●─────●            │
    │    │     │     │     │     │            │
    │    ●─────●─────●─────●─────●            │
    │                                         │
    ├─────────────────────────────────────────┤
    │ Nodes: 2,847 | Connections: 15,623     │
    ╰─────────────────────────────────────────╯`
        }
      ]
    };
  }

  if (filePath === 'forgotten-languages/linguistic-systems/core-languages/aylid.lexicon') {
    return {
      type: 'lexicon',
      title: '📜 Aylid Language Lexicon',
      path: filePath,
      size: '1.2MB',
      description: 'Comprehensive lexicon of Aylid language terms with translations and confidence scores',
      content: 'Primary FL language database containing 3,247 Aylid terms with English translations and linguistic analysis.',
      metadata: {
        'Language': 'Aylid (Primary FL)',
        'Terms': '3,247 entries',
        'Confidence': 'High (FL Direct)',
        'Coverage': 'Comprehensive vocabulary'
      },
      features: 'Term lookup, translation analysis, linguistic patterns.',
      sampleData: [
        {
          term: 'mystara',
          translation: 'hidden knowledge',
          confidence: 'High',
          category: 'Mystical Concepts'
        },
        {
          term: 'velthara',
          translation: 'spatial coordinate',
          confidence: 'High',
          category: 'Navigation'
        },
        {
          term: 'quintor',
          translation: 'consciousness node',
          confidence: 'Medium',
          category: 'Mental States'
        },
        {
          term: 'drakonis',
          translation: 'transformation process',
          confidence: 'High',
          category: 'Change/Process'
        }
      ]
    };
  }

  if (filePath === 'forgotten-languages/occult-spirituality/overview.md') {
    return {
      type: 'overview',
      title: '🔮 Occult & Spirituality Studies Overview',
      path: filePath,
      size: '78KB',
      description: 'Analysis of mystical and esoteric elements within FL corpus',
      content: 'Examination of spiritual, mystical, and occult themes found throughout FL materials.',
      metadata: {
        'Research Focus': 'Mystical Traditions',
        'Key Systems': 'Giselians, Queltron, Alchemy',
        'Confidence Level': 'Medium (Interpretive)',
        'Cross-References': 'Sufism, Theosophy, Hermeticism'
      },
      features: 'Mystical analysis, spiritual connections, esoteric interpretation.',
      documentContent: `# Occult & Spirituality Studies Overview

## Research Scope
The FL corpus contains extensive references to mystical traditions, esoteric knowledge systems, and spiritual practices. This domain requires careful interpretive analysis due to the symbolic and metaphorical nature of the content.

## Major Research Areas

### Giselians Tradition
**Focus**: Mystical practices and spiritual transformation
**Key Elements**: 
- Sufi connections and parallels
- Consciousness expansion techniques
- Sacred geometry applications
- Spiritual navigation systems

### Queltron System
**Focus**: Alchemical transformation processes
**Key Elements**:
- Symbolic transformation protocols
- Consciousness state changes
- Material-spiritual correspondences
- Hermetic principles

### Esoteric Geography
**Focus**: Sacred sites and spiritual landscapes
**Key Elements**:
- Mystical coordinate systems
- Sacred site mappings
- Energy point locations
- Spiritual pathway networks

## Interpretive Challenges

### Symbolic Language
FL occult materials use:
- Metaphorical descriptions
- Symbolic representations
- Allegorical narratives
- Coded references

### Cultural Context
Understanding requires knowledge of:
- Historical mystical traditions
- Comparative religion
- Esoteric philosophy
- Symbolic systems

*This domain requires careful analysis and should be approached with appropriate scholarly skepticism*`
    };
  }

  // Denebian Probes content - read actual markdown files
  if (filePath.startsWith('fl-knowledge-base/denebian-probes/')) {
    try {
      // In a real implementation, you'd read the file from the filesystem
      // For now, we'll return the structured content with placeholder for markdown
      return {
        type: 'fl-post',
        title: `🛸 ${fileName.replace('.md', '').replace(/tid-\d+-/, '').split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}`,
        path: filePath,
        size: '15KB',
        description: 'Advanced Denebian probe research and analysis from 1oo.uk FL forum archives',
        content: 'Comprehensive analysis of Denebian probe systems, behavior, and strategic implications. This document contains detailed FL research on extraterrestrial probe technology and interaction protocols.',
        metadata: {
          'Category': 'Denebian Probes',
          'Source': '1oo.uk FL Forum',
          'Research Type': 'Probe Analysis',
          'Confidence Level': 'High (FL Direct)',
          'Last Updated': '2025-01-23'
        },
        features: 'Advanced probe analysis, behavioral studies, strategic assessment, interaction protocols.',
        documentContent: `# ${fileName.replace('.md', '').replace(/tid-\d+-/, '').split('-').map(word => 
          word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}

## FL Research Document

This document contains advanced research on Denebian probe systems from the 1oo.uk FL forum archives.

**Note:** The full markdown content with images is available in the actual file at: \`${filePath}\`

### Images Available
This document contains detailed technical diagrams and visual analysis from the original FL research.

### Key Research Areas
- Probe behavioral patterns and communication protocols
- Advanced technological capabilities and limitations  
- Strategic implications for human defense and contact scenarios
- Interaction protocols and communication methodologies

*Click on the file in the explorer to view the complete research document with all images and detailed analysis.*`,
        rawMarkdown: true // Flag to indicate this should load the actual markdown file
      };
    } catch (error) {
      console.error('Error loading Denebian probe content:', error);
    }
  }

  // Default content for other files
  return {
    type: 'generic',
    title: `📄 ${fileName}`,
    path: filePath,
    description: 'FL Research File',
    content: `Analysis and content for ${fileName} will be displayed here. This file contains FL research data and can be explored using the appropriate tools.`,
    metadata: {
      'File Type': fileType?.toUpperCase() || 'Unknown',
      'Status': 'Available',
      'Tools': 'Viewer & Analysis'
    },
    features: 'File analysis, content exploration, research tools, data visualization.'
  };
};
