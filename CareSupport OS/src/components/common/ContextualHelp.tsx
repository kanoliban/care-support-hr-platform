import React from 'react';
import { BookOpen } from 'lucide-react';
import { components } from '../../styles/theme';

interface ContextualHelpProps {
  title: string;
  description: string;
  resourceUrl: string;
  resourceType?: 'article' | 'guide' | 'template';
}

function ContextualHelp({ 
  title, 
  description, 
  resourceUrl, 
  resourceType = 'article' 
}: ContextualHelpProps) {
  return (
    <div className={`${components.card.base} p-4`}>
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 bg-brand-primary bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen size={16} className="text-brand-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-neutral-900">{title}</h4>
          <p className="mt-1 text-sm text-neutral-600">{description}</p>
          <a
            href={resourceUrl}
            className="mt-2 text-sm text-brand-primary hover:underline inline-flex items-center gap-1"
          >
            View {resourceType} →
          </a>
        </div>
      </div>
    </div>
  );
}

export default ContextualHelp;