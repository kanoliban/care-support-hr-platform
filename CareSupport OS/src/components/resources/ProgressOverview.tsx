import React from 'react';
import { Trophy, Star, Book, Download, Users } from 'lucide-react';
import { useResourceProgress } from './hooks/useResourceProgress';

function ProgressOverview() {
  const { 
    calculateOverallProgress,
    getNextRecommendations,
    setupProgress,
    knowledgeProgress,
    resourceProgress,
    communityProgress
  } = useResourceProgress();

  const overallProgress = calculateOverallProgress();
  const recommendations = getNextRecommendations();

  // Calculate the circle's circumference and offset
  const radius = 45;
  const circumference = Math.round(2 * Math.PI * radius);
  // Ensure offset is a valid number and convert to string for the SVG attribute
  const offset = Math.round(circumference - (overallProgress / 100) * circumference).toString();

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-start gap-8">
        {/* Progress Overview */}
        <div className="flex-1">
          <h2 className="text-lg font-medium mb-4">Setup Progress</h2>
          <div className="flex items-center gap-6 mb-6">
            <div className="relative w-24 h-24">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  className="text-gray-100"
                  strokeWidth="6"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
                <circle
                  className="text-purple-600"
                  strokeWidth="6"
                  strokeDasharray={circumference}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r={radius}
                  cx="48"
                  cy="48"
                />
              </svg>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                <span className="text-2xl font-semibold">{overallProgress}%</span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-gray-500">Setup Guides</div>
                <div className="font-medium">
                  {setupProgress.completedSteps}/{setupProgress.totalSteps} completed
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Articles Read</div>
                <div className="font-medium">
                  {knowledgeProgress.articlesRead.length}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Resources Used</div>
                <div className="font-medium">
                  {resourceProgress.downloads.length}
                </div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Stories Read</div>
                <div className="font-medium">
                  {communityProgress.storiesRead.length}
                </div>
              </div>
            </div>
          </div>

          {/* Achievements */}
          <h3 className="text-sm font-medium text-gray-900 mb-3">Achievements</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              overallProgress >= 25 ? 'bg-purple-50' : 'bg-gray-50'
            }`}>
              <Trophy size={16} className={overallProgress >= 25 ? 'text-purple-600' : 'text-gray-400'} />
              <div>
                <div className="text-sm font-medium">Getting Started</div>
                <div className="text-xs text-gray-500">Complete 25% of setup</div>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              knowledgeProgress.articlesRead.length >= 5 ? 'bg-purple-50' : 'bg-gray-50'
            }`}>
              <Book size={16} className={knowledgeProgress.articlesRead.length >= 5 ? 'text-purple-600' : 'text-gray-400'} />
              <div>
                <div className="text-sm font-medium">Knowledge Seeker</div>
                <div className="text-xs text-gray-500">Read 5 articles</div>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              resourceProgress.downloads.length >= 3 ? 'bg-purple-50' : 'bg-gray-50'
            }`}>
              <Download size={16} className={resourceProgress.downloads.length >= 3 ? 'text-purple-600' : 'text-gray-400'} />
              <div>
                <div className="text-sm font-medium">Resource Master</div>
                <div className="text-xs text-gray-500">Download 3 templates</div>
              </div>
            </div>
            <div className={`flex items-center gap-3 p-3 rounded-lg ${
              communityProgress.storiesRead.length >= 3 ? 'bg-purple-50' : 'bg-gray-50'
            }`}>
              <Users size={16} className={communityProgress.storiesRead.length >= 3 ? 'text-purple-600' : 'text-gray-400'} />
              <div>
                <div className="text-sm font-medium">Community Member</div>
                <div className="text-xs text-gray-500">Read 3 success stories</div>
              </div>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="w-80 border-l border-gray-200 pl-8">
          <h2 className="text-lg font-medium mb-4">Next Steps</h2>
          <div className="space-y-4">
            {recommendations.map((rec, index) => (
              <a
                key={index}
                href={rec.path}
                className="block p-4 rounded-lg border border-gray-200 hover:border-purple-200 group"
              >
                <div className="flex items-center gap-3">
                  {rec.type === 'setup' && <Trophy size={20} className="text-purple-600" />}
                  {rec.type === 'knowledge' && <Book size={20} className="text-purple-600" />}
                  {rec.type === 'resource' && <Download size={20} className="text-purple-600" />}
                  <div>
                    <div className="font-medium group-hover:text-purple-600">
                      {rec.message}
                    </div>
                    <div className="text-sm text-gray-500">
                      Continue your progress
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProgressOverview;