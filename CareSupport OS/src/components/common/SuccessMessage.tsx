import React from 'react';
import { CheckCircle } from 'lucide-react';
import { components } from '../../styles/theme';

interface SuccessMessageProps {
  title: string;
  description?: string;
  nextSteps?: {
    text: string;
    action: () => void;
  }[];
}

function SuccessMessage({ title, description, nextSteps }: SuccessMessageProps) {
  return (
    <div className={`${components.statusIndicator.success} p-4 rounded-lg`}>
      <div className="flex">
        <CheckCircle className="h-5 w-5 text-status-success-DEFAULT mr-3" />
        <div>
          <h4 className="text-sm font-medium text-status-success-dark">
            {title}
          </h4>
          {description && (
            <p className="mt-1 text-sm text-status-success-dark">
              {description}
            </p>
          )}
          {nextSteps && nextSteps.length > 0 && (
            <div className="mt-3 flex gap-3">
              {nextSteps.map((step, index) => (
                <button
                  key={index}
                  onClick={step.action}
                  className="text-sm font-medium text-status-success-dark hover:underline"
                >
                  {step.text}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SuccessMessage;