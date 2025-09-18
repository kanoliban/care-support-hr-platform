import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { components, zIndex } from '../../styles/theme';

interface HelpTooltipProps {
  content: string;
  link?: {
    text: string;
    url: string;
  };
}

function HelpTooltip({ content, link }: HelpTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipId = React.useId();

  return (
    <div className="relative inline-block">
      <button
        className="text-neutral-400 hover:text-neutral-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-primary rounded-full"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
        aria-describedby={tooltipId}
      >
        <HelpCircle size={16} />
      </button>

      {isVisible && (
        <div
          id={tooltipId}
          role="tooltip"
          className={`
            absolute z-${zIndex.tooltip} w-64 p-3 mt-2 -translate-x-1/2 left-1/2
            bg-white rounded-lg shadow-lg border border-neutral-200
          `}
        >
          <div className="text-sm text-neutral-600">{content}</div>
          {link && (
            <a
              href={link.url}
              className="mt-2 text-sm text-brand-primary hover:underline inline-block"
              target="_blank"
              rel="noopener noreferrer"
            >
              {link.text} →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default HelpTooltip;