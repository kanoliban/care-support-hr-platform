import React from 'react';
import { Lock } from 'lucide-react';

interface FrameworkCardProps {
  title: string;
  description: string;
  progress: number;
  icon: string;
  isLocked?: boolean;
  isHighlighted?: boolean;
  onSnooze?: () => void;
}

function FrameworkCard({ 
  title, 
  description, 
  progress, 
  icon, 
  isLocked = false,
  isHighlighted = false,
  onSnooze
}: FrameworkCardProps) {
  return (
    <div className={`relative p-6 rounded-lg ${isHighlighted ? 'bg-purple-50' : 'bg-gray-100'}`}>
      {isLocked && (
        <Lock className="absolute top-4 right-4 text-gray-400" size={16} />
      )}
      
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-semibold">{title}</h3>
        <img src={icon} alt={`${title} icon`} className="w-12 h-12" />
      </div>
      
      <p className="text-gray-600 mb-6 min-h-[80px]">{description}</p>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="relative w-12 h-12">
            <svg className="w-12 h-12 transform -rotate-90">
              <circle
                className="text-gray-200"
                strokeWidth="4"
                stroke="currentColor"
                fill="transparent"
                r="20"
                cx="24"
                cy="24"
              />
              <circle
                className={`${progress >= 95 ? 'text-green-500' : 'text-purple-500'}`}
                strokeWidth="4"
                strokeDasharray={125.6}
                strokeDashoffset={125.6 * ((100 - progress) / 100)}
                strokeLinecap="round"
                stroke="currentColor"
                fill="transparent"
                r="20"
                cx="24"
                cy="24"
              />
            </svg>
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm font-semibold">
              {progress}%
            </span>
          </div>
        </div>
        
        {onSnooze ? (
          <button
            onClick={onSnooze}
            className="text-gray-500 hover:text-gray-700 flex items-center gap-1"
          >
            <span className="text-sm">Snooze</span>
          </button>
        ) : (
          <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors">
            Schedule a call
          </button>
        )}
      </div>
    </div>
  );
}

export default FrameworkCard;