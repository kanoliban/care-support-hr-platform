import React from 'react';
import { CheckCircle, AlertCircle, Clock } from 'lucide-react';

interface ComplianceCheck {
  type: string;
  status: 'Pass' | 'Fail' | 'Warning';
  message: string;
}

interface ShiftComplianceCheckProps {
  checks: ComplianceCheck[];
}

function ShiftComplianceCheck({ checks }: ShiftComplianceCheckProps) {
  const getIcon = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'Pass':
        return <CheckCircle size={16} className="text-green-500" />;
      case 'Fail':
        return <AlertCircle size={16} className="text-red-500" />;
      case 'Warning':
        return <Clock size={16} className="text-yellow-500" />;
    }
  };

  const getStatusColor = (status: ComplianceCheck['status']) => {
    switch (status) {
      case 'Pass':
        return 'bg-green-100 text-green-800';
      case 'Fail':
        return 'bg-red-100 text-red-800';
      case 'Warning':
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <div className="flex items-center gap-2">
      {checks.map((check, index) => (
        <div key={index} className="flex items-center gap-1">
          <span className="text-xs text-gray-500">{check.type}</span>
          <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${getStatusColor(check.status)}`}>
            {getIcon(check.status)}
            <span className="text-xs font-medium">{check.status}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ShiftComplianceCheck;