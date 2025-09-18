import React from 'react';
import { AlertCircle, CheckCircle, AlertTriangle, Info } from 'lucide-react';
import { components } from '../../styles/theme';

export type ValidationSeverity = 'success' | 'warning' | 'error' | 'info';

interface ValidationMessageProps {
  severity: ValidationSeverity;
  message: string;
  solution?: string;
  onAction?: () => void;
  actionLabel?: string;
}

const icons = {
  success: CheckCircle,
  warning: AlertTriangle,
  error: AlertCircle,
  info: Info,
};

function ValidationMessage({ 
  severity, 
  message, 
  solution, 
  onAction, 
  actionLabel 
}: ValidationMessageProps) {
  const Icon = icons[severity];
  
  return (
    <div className={`p-4 rounded-lg ${components.statusIndicator[severity]}`}>
      <div className="flex">
        <Icon className="h-5 w-5 mr-3" aria-hidden="true" />
        <div className="flex-1">
          <p className="text-sm font-medium">
            {message}
          </p>
          {solution && (
            <p className="mt-1 text-sm">
              {solution}
            </p>
          )}
          {onAction && actionLabel && (
            <button
              onClick={onAction}
              className="mt-2 text-sm font-medium hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary"
            >
              {actionLabel}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ValidationMessage;