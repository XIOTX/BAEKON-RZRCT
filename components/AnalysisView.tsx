'use client';

import { useState, useEffect } from 'react';
import { FLKnowledgeNode } from '@/lib/fl-knowledge';

interface AnalysisViewProps {
  node: FLKnowledgeNode;
}

export function AnalysisView({ node }: AnalysisViewProps) {
  const [analysisData, setAnalysisData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading analysis data
    const timer = setTimeout(() => {
      setAnalysisData({
        documentCount: getDocumentCount(node.id),
        keyTerms: getKeyTerms(node.id),
        relatedTopics: getRelatedTopics(node.id),
        insights: getInsights(node.id)
      });
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [node.id]);

  const getDocumentCount = (nodeId: string): number => {
    const counts: Record<string, number> = {
      'cassini-diskus': 50,
      'defense-applications': 50,
      'religion': 37,
      'philosophy-of-language': 23,
      'nodespaces': 21,
      'millangivm': 21,
      'sufism': 19,
      'theosophy': 18,
      'alchemy': 15,
      'de-altero-genere': 11,
      'dreams': 10,
      'poetry': 8
    };
    return counts[nodeId] || 5;
  };

  const getKeyTerms = (nodeId: string): string[] => {
    const terms: Record<string, string[]> = {
      'cassini-diskus': ['coordinates', 'spatial', 'navigation', 'orbital', 'positioning'],
      'defense-applications': ['security', 'classified', 'military', 'strategic', 'operational'],
      'religion': ['sacred', 'divine', 'spiritual', 'ritual', 'transcendent'],
      'philosophy-of-language': ['meaning', 'semantics', 'syntax', 'consciousness', 'communication'],
      'nodespaces': ['information', 'architecture', 'networks', 'topology', 'connectivity']
    };
    return terms[nodeId] || ['analysis', 'research', 'study', 'investigation', 'exploration'];
  };

  const getRelatedTopics = (nodeId: string): Array<{id: string, title: string, relevance: number}> => {
    const relations: Record<string, Array<{id: string, title: string, relevance: number}>> = {
      'cassini-diskus': [
        { id: 'defense-applications', title: 'Defense Applications', relevance: 0.8 },
        { id: 'nodespaces', title: 'NodeSpaces', relevance: 0.6 },
        { id: 'philosophy-of-language', title: 'Philosophy of Language', relevance: 0.4 }
      ],
      'defense-applications': [
        { id: 'cassini-diskus', title: 'Cassini Diskus', relevance: 0.8 },
        { id: 'nodespaces', title: 'NodeSpaces', relevance: 0.5 }
      ],
      'religion': [
        { id: 'sufism', title: 'Sufism', relevance: 0.7 },
        { id: 'theosophy', title: 'Theosophy', relevance: 0.6 },
        { id: 'alchemy', title: 'Alchemy', relevance: 0.5 }
      ]
    };
    return relations[nodeId] || [];
  };

  const getInsights = (nodeId: string): string[] => {
    const insights: Record<string, string[]> = {
      'cassini-diskus': [
        'Most documented topic in FL corpus (50 documents)',
        'Strong correlation with defense applications',
        'Coordinate systems appear to follow specific patterns',
        'Geographic references span multiple continents'
      ],
      'defense-applications': [
        'Equal documentation level with Cassini Diskus',
        'Technical specifications often classified',
        'Cross-references with spatial coordinate systems',
        'Military context suggests operational significance'
      ],
      'religion': [
        'Second-highest document count (37 documents)',
        'Strong connections to mystical traditions',
        'Cross-cultural religious references',
        'Symbolic language patterns emerge'
      ]
    };
    return insights[nodeId] || [
      'Analysis in progress',
      'Document patterns being identified',
      'Cross-references being mapped',
      'Insights will be updated as analysis completes'
    ];
  };

  if (loading) {
    return (
      <div className="p-6 h-full flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⚙️</div>
          <p className="text-gray-400">Analyzing FL corpus...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Analysis Header */}
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
        <h3 className="text-purple-400 font-semibold mb-2">FL Corpus Analysis</h3>
        <p className="text-gray-300 text-sm">
          Automated analysis of {node.title} across the FL document corpus
        </p>
      </div>

      {/* Document Count */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-black/20 border border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-cyan-400 mb-1">
            {analysisData.documentCount}
          </div>
          <div className="text-sm text-gray-400">Documents Found</div>
        </div>
        
        <div className="bg-black/20 border border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-green-400 mb-1">
            {analysisData.keyTerms.length}
          </div>
          <div className="text-sm text-gray-400">Key Terms</div>
        </div>
        
        <div className="bg-black/20 border border-gray-700 rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-400 mb-1">
            {analysisData.relatedTopics.length}
          </div>
          <div className="text-sm text-gray-400">Related Topics</div>
        </div>
      </div>

      {/* Key Terms */}
      <div className="bg-black/20 border border-gray-700 rounded-lg p-4">
        <h4 className="text-cyan-400 font-semibold mb-3">Key Terms</h4>
        <div className="flex flex-wrap gap-2">
          {analysisData.keyTerms.map((term: string, index: number) => (
            <span
              key={index}
              className="px-3 py-1 bg-cyan-500/20 text-cyan-300 text-sm rounded-full"
            >
              {term}
            </span>
          ))}
        </div>
      </div>

      {/* Related Topics */}
      {analysisData.relatedTopics.length > 0 && (
        <div className="bg-black/20 border border-gray-700 rounded-lg p-4">
          <h4 className="text-green-400 font-semibold mb-3">Related Topics</h4>
          <div className="space-y-2">
            {analysisData.relatedTopics.map((topic: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-2 bg-black/30 rounded">
                <span className="text-gray-300">{topic.title}</span>
                <div className="flex items-center">
                  <div className="w-16 bg-gray-700 rounded-full h-2 mr-2">
                    <div
                      className="bg-green-400 h-2 rounded-full"
                      style={{ width: `${topic.relevance * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs text-gray-400">
                    {Math.round(topic.relevance * 100)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Insights */}
      <div className="bg-black/20 border border-gray-700 rounded-lg p-4">
        <h4 className="text-purple-400 font-semibold mb-3">Analysis Insights</h4>
        <div className="space-y-2">
          {analysisData.insights.map((insight: string, index: number) => (
            <div key={index} className="flex items-start p-2 bg-black/30 rounded">
              <span className="text-purple-400 mr-2 mt-1">•</span>
              <span className="text-gray-300 text-sm">{insight}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Search Integration */}
      <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
        <h4 className="text-blue-400 font-semibold mb-2">Explore Further</h4>
        <p className="text-gray-300 text-sm mb-3">
          Use Ana's Index search to dive deeper into specific aspects of {node.title}
        </p>
        <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg text-sm font-medium transition-colors">
          Search Documents
        </button>
      </div>
    </div>
  );
}
