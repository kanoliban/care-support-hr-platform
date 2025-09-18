import React from 'react';
import { Building2, ChevronRight } from 'lucide-react';

interface AuditTimelineEvent {
  event: string;
  date: string;
}

interface AuditProgress {
  notReady: number;
  ready: number;
  flagged: number;
  accepted: number;
  notApplicable: number;
}

interface AuditCardProps {
  title: string;
  status: string;
  firm: string;
  teamMembers: string[];
  timeline: AuditTimelineEvent[];
  progress: AuditProgress;
  frameworks: string[];
  onOpen: () => void;
}

function AuditCard({ 
  title, 
  status, 
  firm, 
  teamMembers, 
  timeline, 
  progress, 
  frameworks,
  onOpen 
}: AuditCardProps) {
  const totalItems = progress.notReady + progress.ready + progress.flagged + 
                    progress.accepted + progress.notApplicable;
  
  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6 mb-4">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <Building2 className="text-purple-600" size={24} />
          </div>
          <div>
            <h3 className="text-lg font-medium">{title}</h3>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-sm text-gray-500">{firm}</span>
              <div className="flex -space-x-1">
                {teamMembers.map((member, index) => (
                  <span 
                    key={index} 
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-gray-600 text-xs border-2 border-white"
                  >
                    {member}
                  </span>
                ))}
              </div>
            </div>
            <div className="flex gap-2 mt-2">
              {frameworks.map((framework, index) => (
                <span 
                  key={index} 
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
                >
                  {framework}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
          <button 
            onClick={onOpen}
            className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50"
          >
            Open audit
          </button>
          <button className="p-2 text-gray-400 hover:text-gray-600">
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8">
        <div className="space-y-4">
          {timeline.map((item, index) => (
            <div key={index} className="flex items-start gap-3">
              <div className="relative">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-purple-600" />
                </div>
                {index < timeline.length - 1 && (
                  <div className="absolute top-6 left-3 w-px h-8 bg-gray-200" />
                )}
              </div>
              <div>
                <div className="text-sm font-medium">{item.event}</div>
                <div className="text-sm text-gray-500">{item.date}</div>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h4 className="text-sm font-medium mb-3">Audit progress</h4>
          <div className="h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
            <div className="flex h-full">
              {progress.notReady > 0 && (
                <div 
                  className="h-full bg-red-500" 
                  style={{ width: `${(progress.notReady / totalItems) * 100}%` }} 
                />
              )}
              {progress.ready > 0 && (
                <div 
                  className="h-full bg-blue-500" 
                  style={{ width: `${(progress.ready / totalItems) * 100}%` }} 
                />
              )}
              {progress.flagged > 0 && (
                <div 
                  className="h-full bg-yellow-500" 
                  style={{ width: `${(progress.flagged / totalItems) * 100}%` }} 
                />
              )}
              {progress.accepted > 0 && (
                <div 
                  className="h-full bg-green-500" 
                  style={{ width: `${(progress.accepted / totalItems) * 100}%` }} 
                />
              )}
              {progress.notApplicable > 0 && (
                <div 
                  className="h-full bg-gray-300" 
                  style={{ width: `${(progress.notApplicable / totalItems) * 100}%` }} 
                />
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Not ready for audit</span>
                <span>{progress.notReady}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Ready for audit</span>
                <span>{progress.ready}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Not applicable</span>
                <span>{progress.notApplicable}</span>
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Flagged by auditor</span>
                <span>{progress.flagged}</span>
              </div>
              <div className="flex items-center justify-between text-gray-600">
                <span>Accepted</span>
                <span>{progress.accepted}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuditCard;