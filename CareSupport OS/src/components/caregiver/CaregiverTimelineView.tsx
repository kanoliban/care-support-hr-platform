import React, { useMemo } from 'react';
import { Clock, Award, Book, FileText, CheckCircle, AlertCircle } from 'lucide-react';
import { PersonalTimelineItem } from '../scheduling/types';

interface CaregiverTimelineViewProps {
  caregiverId: string;
}

const mockTimelineItems: PersonalTimelineItem[] = [
  {
    id: 'timeline-1',
    type: 'shift',
    startTime: '2024-04-15T09:00:00',
    endTime: '2024-04-15T17:00:00',
    title: 'Care Visit',
    description: 'Regular care visit including medication administration and vital signs monitoring',
    status: 'upcoming',
    category: 'care',
    metadata: {
      clientName: 'John Smith'
    }
  },
  {
    id: 'timeline-2',
    type: 'credential',
    startTime: '2024-04-15T13:00:00',
    title: 'License Renewal Due',
    description: 'RN License renewal deadline',
    status: 'upcoming',
    category: 'compliance',
    metadata: {
      credentialDetails: {
        type: 'RN License',
        identifier: 'RN123456',
        expirationDate: '2024-06-15',
        renewalRequired: true
      }
    }
  },
  {
    id: 'timeline-3',
    type: 'training',
    startTime: '2024-04-15T14:00:00',
    title: 'Required Training',
    description: 'Medication Administration Protocol Update',
    status: 'upcoming',
    category: 'training',
    metadata: {
      trainingDetails: {
        type: 'Medication Administration',
        provider: 'CareSupport Training',
        credits: 2
      }
    }
  },
  {
    id: 'timeline-4',
    type: 'shift',
    startTime: '2024-04-15T18:00:00',
    endTime: '2024-04-15T22:00:00',
    title: 'Care Visit',
    description: 'Evening care and medication assistance',
    status: 'upcoming',
    category: 'care',
    metadata: {
      clientName: 'Mary Johnson'
    }
  }
];

function getItemIcon(type: TimelineItemType) {
  switch (type) {
    case 'shift':
      return <Clock size={16} className="text-white" />;
    case 'training':
      return <Book size={16} className="text-white" />;
    case 'credential':
      return <Award size={16} className="text-white" />;
    case 'review':
      return <FileText size={16} className="text-white" />;
    default:
      return <FileText size={16} className="text-white" />;
  }
}

function getStatusColor(status: PersonalTimelineItem['status']) {
  switch (status) {
    case 'upcoming':
      return 'bg-purple-500';
    case 'in_progress':
      return 'bg-blue-500';
    case 'completed':
      return 'bg-green-500';
  }
}

function formatTime(time: string) {
  return new Date(time).toLocaleTimeString([], { 
    hour: 'numeric',
    minute: '2-digit'
  });
}

function TimelineItem({ item }: { item: PersonalTimelineItem }) {
  return (
    <div className="relative flex gap-4">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${getStatusColor(item.status)}`}>
        {getItemIcon(item.type)}
      </div>

      <div className="flex-1 bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-medium">{item.title}</h3>
            <p className="text-sm text-gray-500">{item.description}</p>
          </div>
          <time className="text-sm text-gray-500">
            {formatTime(item.startTime)}
            {item.endTime && ` - ${formatTime(item.endTime)}`}
          </time>
        </div>

        {item.type === 'shift' && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-gray-600">Location:</span>
            <span>Client's Home</span>
          </div>
        )}

        {item.type === 'review' && item.metadata?.reviewType === 'care_plan' && (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-gray-600">Type:</span>
            <span>Care Plan Review</span>
          </div>
        )}

        {item.status === 'upcoming' && (
          <div className="mt-3 flex items-center gap-2">
            <button className="px-3 py-1.5 text-sm text-white bg-purple-600 rounded-lg hover:bg-purple-700">
              {item.type === 'shift' ? 'View Details' : 'Complete'}
            </button>
            {item.type === 'shift' && (
              <button className="px-3 py-1.5 text-sm text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50">
                Contact Client
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CaregiverTimelineView({ caregiverId }: CaregiverTimelineViewProps) {
  const [selectedDate, setSelectedDate] = React.useState<'today' | 'week' | 'month'>('today');
  const [selectedCategories, setSelectedCategories] = React.useState<string[]>(['care', 'compliance', 'training']);

  const filteredItems = useMemo(() => {
    return mockTimelineItems.filter(item => selectedCategories.includes(item.category));
  }, [selectedCategories]);

  const toggleCategory = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium">Upcoming Schedule</h2>
        <div className="flex items-center gap-4">
          <div className="flex gap-2">
            {[
              { label: 'Care', value: 'care', color: 'bg-purple-100 text-purple-800' },
              { label: 'Training', value: 'training', color: 'bg-blue-100 text-blue-800' },
              { label: 'Compliance', value: 'compliance', color: 'bg-green-100 text-green-800' }
            ].map(category => (
              <button
                key={category.value}
                onClick={() => toggleCategory(category.value)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium ${
                  selectedCategories.includes(category.value)
                    ? category.color
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
            {[
              { label: 'Today', value: 'today' },
              { label: 'Week', value: 'week' },
              { label: 'Month', value: 'month' }
            ].map(option => (
              <button
                key={option.value}
                onClick={() => setSelectedDate(option.value as any)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  selectedDate === option.value
                    ? 'bg-white text-gray-900 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <div className="absolute left-9 top-0 bottom-0 w-px bg-gray-200" />
        <div className="space-y-6">
          {filteredItems.map(item => (
            <TimelineItem key={item.id} item={item} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CaregiverTimelineView;