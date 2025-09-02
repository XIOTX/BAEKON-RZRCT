'use client';

import React from 'react';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, className = "" }) => {
  // Simple markdown renderer for FL articles
  const renderMarkdown = (text: string) => {
    // Split content into lines
    const lines = text.split('\n');
    const elements: JSX.Element[] = [];
    let currentIndex = 0;
    


    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Skip images - they're handled in the gallery section above
      const imageMatch = line.match(/!\[([^\]]*)\]\(([^)]+)\)/);
      if (imageMatch) {
        console.log('MarkdownRenderer skipping image:', imageMatch[0]);
        // Skip image lines entirely - they're shown in the gallery
        continue;
      }

      // Handle headers
      if (line.startsWith('# ')) {
        elements.push(
          <h1 key={currentIndex++} className="text-2xl font-bold text-cyan-400 mt-6 mb-4">
            {line.substring(2)}
          </h1>
        );
        continue;
      }

      if (line.startsWith('## ')) {
        elements.push(
          <h2 key={currentIndex++} className="text-xl font-semibold text-purple-400 mt-5 mb-3">
            {line.substring(3)}
          </h2>
        );
        continue;
      }

      if (line.startsWith('### ')) {
        elements.push(
          <h3 key={currentIndex++} className="text-lg font-medium text-green-400 mt-4 mb-2">
            {line.substring(4)}
          </h3>
        );
        continue;
      }

      // Handle bold text
      const boldText = line.replace(/\*\*([^*]+)\*\*/g, '<strong class="text-cyan-300 font-semibold">$1</strong>');
      
      // Handle links
      const linkedText = boldText.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-400 hover:text-blue-300 underline" target="_blank" rel="noopener noreferrer">$1</a>');

      // Handle empty lines
      if (line.trim() === '') {
        elements.push(<br key={currentIndex++} />);
        continue;
      }

      // Handle list items (but skip if it's an image list item)
      if (line.startsWith('- ') && !line.match(/!\[([^\]]*)\]\(([^)]+)\)/)) {
        elements.push(
          <li key={currentIndex++} className="text-gray-300 ml-4 mb-1">
            <span dangerouslySetInnerHTML={{ __html: linkedText.substring(2) }} />
          </li>
        );
        continue;
      }

      // Handle regular paragraphs
      elements.push(
        <p key={currentIndex++} className="text-gray-300 mb-3 leading-relaxed">
          <span dangerouslySetInnerHTML={{ __html: linkedText }} />
        </p>
      );
    }

    return elements;
  };

  return (
    <div className={`markdown-content ${className}`}>
      {renderMarkdown(content)}
    </div>
  );
};
