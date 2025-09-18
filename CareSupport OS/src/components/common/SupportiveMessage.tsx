import React from 'react';
import { AlertCircle, ChevronRight } from 'lucide-react';
import { components } from '../../styles/theme';

interface SupportiveMessageProps {
  title: string;
  description: string;
  steps?: string[];
  primaryAction?: {
    text: string;
    onClick: () => void;
  };
  secondaryAction?: {
    text: string;
    onClick: () => void;
  };
}

function SupportiveMessage({
  title,
  description,
  steps,
  primaryAction,
  secondaryAction
}: SupportiveMessageProps) {
  return (
    <div className="bg-white rounded-lg border border-neutral-200 p-4">
      <div className="flex items-start gap-3">
        <div className="mt-1">
          <AlertCircle className="h-5 w-5 text-brand-primary" />
        </div>
        <div className="flex-1">
          <h4 className="text-sm font-medium text-neutral-900">{title}</h4>
          <p className="mt-1 text-sm text-neutral-600">{description}</p>
          
          {steps && steps.length > 0 && (
            <ul className="mt-3 space-y-2">
              {steps.map((step, index) => (
                <li key={index} className="flex items-center gap-2 text-sm text-neutral-600">
                  <span className="w-5 h-5 rounded-full bg-brand-primary bg-opacity-10 flex items-center justify-center flex-shrink-0 text-brand-primary font-medium">
                    {index + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ul>
          )}
          
          {(primaryAction || secondaryAction) && (
            <div className="mt-4 flex items-center gap-3">
              {primaryAction && (
                <button
                  onClick={primaryAction.onClick}
                  className={`${components.button.base} ${components.button.primary} inline-flex items-center gap-1`}
                >
                  {primaryAction.text}
                  <ChevronRight size={16} />
                </button>
              )}
              {secondaryAction && (
                <button
                  onClick={secondaryAction.onClick}
                  className={`${components.button.base} ${components.button.secondary}`}
                >
                  {secondaryAction.text}
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SupportiveMessage;