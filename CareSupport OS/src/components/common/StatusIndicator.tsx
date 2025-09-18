import React from 'react';
import { components } from '../../styles/theme';

type StatusType = 'success' | 'warning' | 'error' | 'info';

interface StatusIndicatorProps {
  type: StatusType;
  children: React.ReactNode;
  className?: string;
}

function StatusIndicator({ type, children, className = '' }: StatusIndicatorProps) {
  return (
    <span className={`${components.statusIndicator.base} ${components.statusIndicator[type]} ${className}`}>
      {children}
    </span>
  );
}

export default StatusIndicator;