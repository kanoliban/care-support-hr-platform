import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Building2, Users, Lightbulb, Trophy, ChevronRight, 
  ExternalLink, Filter, Star, TrendingUp, Clock, Plus, ChevronDown 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type ContentType = 'case-study' | 'best-practice' | 'success-story';
type Industry = 'Home Health' | 'Private Duty' | 'Hospice' | 'All';
type Topic = 'EVV' | 'Credentialing' | 'Plan-of-Care' | 'Billing' | 'All';

interface ContentItem {
  id: string;
  type: ContentType;
  title: string;
  excerpt: string;
  agency?: string;
  date: string;
  readTime: string;
  topic: Topic;
  industry: Industry;
  views: number;
  likes?: number;
  shares?: number;
  isFeatured?: boolean;
  challenge?: string;
  approach?: string;
  outcome?: string;
  takeaways?: string[];
  relatedLinks?: {
    type: 'knowledge-base' | 'resource-library';
    title: string;
    path: string;
  }[];
}

type SortOption = 'recent' | 'popular' | 'trending';

const communityContent: ContentItem[] = [
  {
    id: 'cs-001',
    type: 'case-study',
    title: 'Reducing Denied Claims by 60% with Consistent EVV Usage',
    excerpt: 'Learn how Sunshine Home Care implemented a systematic approach to EVV compliance that dramatically reduced their claim denials.',
    agency: 'Sunshine Home Care',
    date: '2024-04-15',
    readTime: '5 min',
    topic: 'EVV',
    industry: 'Home Health',
    views: 156,
    challenge: 'High rate of claim denials due to inconsistent EVV data',
    approach: 'Implemented mandatory EVV verification checks before shift completion',
    outcome: '60% reduction in denied claims within 3 months',
    takeaways: [
      'Train caregivers on EVV importance during onboarding',
      'Set up automated reminders for clock-in/out',
      'Regular audits of EVV compliance'
    ],
    relatedLinks: [
      {
        type: 'knowledge-base',
        title: 'EVV Requirements Guide',
        path: '/resources/knowledge-base/evv-requirements'
      },
      {
        type: 'resource-library',
        title: 'EVV Troubleshooting Flowchart',
        path: '/resources/library/evv-troubleshooting'
      }
    ]
  },
  {
    id: 'bp-001',
    type: 'best-practice',
    title: 'Managing Caregiver Credentials Across Multiple States',
    excerpt: 'Best practices for tracking and maintaining caregiver licenses and certifications when operating in multiple jurisdictions.',
    agency: 'Regional Care Services',
    date: '2024-04-10',
    readTime: '4 min',
    topic: 'Credentialing',
    industry: 'Private Duty',
    views: 234,
    takeaways: [
      'Centralize credential tracking in one system',
      'Set up automated renewal reminders',
      'Maintain state-specific requirement checklists'
    ],
    relatedLinks: [
      {
        type: 'resource-library',
        title: 'Multi-State Compliance Checklist',
        path: '/resources/library/compliance-checklist'
      }
    ]
  },
  {
    id: 'ss-001',
    type: 'success-story',
    title: 'From Paper to Digital: Our 90-Day Transformation',
    excerpt: 'How we successfully transitioned from paper-based care plans to digital documentation while maintaining quality of care.',
    agency: 'Comfort Care at Home',
    date: '2024-04-05',
    readTime: '6 min',
    topic: 'Plan-of-Care',
    industry: 'Home Health',
    views: 189,
    challenge: 'Paper-based system causing delays and compliance risks',
    approach: 'Phased rollout of digital care plans with extensive training',
    outcome: 'Reduced documentation time by 45% and improved compliance scores',
    takeaways: [
      'Start with a pilot group of tech-savvy caregivers',
      'Create detailed transition timeline',
      'Provide multiple training options'
    ]
  }
];

function CommunityGuideView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<ContentType | 'all'>('all');
  const [selectedTopic, setSelectedTopic] = useState<Topic>('All');
  const [selectedIndustry, setSelectedIndustry] = useState<Industry>('All');
  const [expandedContent, setExpandedContent] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>('recent');

  const featuredContent = communityContent.find(content => 
    content.id === 'cs-001'
  );

  const filteredContent = communityContent
    .filter(content => {
      const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          content.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = selectedType === 'all' || content.type === selectedType;
      const matchesTopic = selectedTopic === 'All' || content.topic === selectedTopic;
      const matchesIndustry = selectedIndustry === 'All' || content.industry === selectedIndustry;
      return matchesSearch && matchesType && matchesTopic && matchesIndustry;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'popular':
          return b.views - a.views;
        case 'trending':
          return (b.views + (b.likes || 0)) - (a.views + (a.likes || 0));
        case 'recent':
        default:
          return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
    });

  const getTypeIcon = (type: ContentType) => {
    switch (type) {
      case 'case-study':
        return Building2;
      case 'best-practice':
        return Lightbulb;
      case 'success-story':
        return Trophy;
      default:
        return Building2;
    }
  };

  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/resources')}
            className="flex items-center gap-2 text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft size={16} />
            Back to Resources
          </button>
        </div>

        <header className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Community Guide</h1>
            <p className="text-gray-600 mt-2">
              Explore real-world insights from fellow home care agencies, sharing tips, stories, and strategies for success.
            </p>
          </div>
          <button 
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
          >
            <Plus size={16} />
            Submit Your Story
          </button>
        </header>

        {featuredContent && (
          <div className="mb-8 bg-gradient-to-r from-purple-50 to-white rounded-lg border border-purple-200 p-6">
            <div className="flex items-center gap-2 text-purple-600 mb-4">
              <Star size={16} />
              <span className="text-sm font-medium">Featured Story</span>
            </div>
            <div className="flex gap-6">
              <div className="flex-1">
                <h2 className="text-xl font-medium mb-2">{featuredContent.title}</h2>
                <p className="text-gray-600">{featuredContent.excerpt}</p>
                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Building2 size={14} />
                    <span>{featuredContent.agency}</span>
                  </div>
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Clock size={14} />
                    <span>{featuredContent.readTime} read</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center">
                <button 
                  onClick={() => setExpandedContent(featuredContent.id)}
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                >
                  Read Story
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="flex gap-6">
          <div className="w-64 flex-shrink-0 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">Content Type</h2>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                    selectedType === 'all'
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>All Content</span>
                  <span className="text-gray-400">{communityContent.length}</span>
                </button>
                <button
                  onClick={() => setSelectedType('case-study')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                    selectedType === 'case-study'
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>Case Studies</span>
                  <span className="text-gray-400">
                    {communityContent.filter(c => c.type === 'case-study').length}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedType('best-practice')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                    selectedType === 'best-practice'
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>Best Practices</span>
                  <span className="text-gray-400">
                    {communityContent.filter(c => c.type === 'best-practice').length}
                  </span>
                </button>
                <button
                  onClick={() => setSelectedType('success-story')}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm ${
                    selectedType === 'success-story'
                      ? 'bg-purple-50 text-purple-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span>Success Stories</span>
                  <span className="text-gray-400">
                    {communityContent.filter(c => c.type === 'success-story').length}
                  </span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">Topic</h2>
              </div>
              <div className="p-2">
                {['All', 'EVV', 'Credentialing', 'Plan-of-Care', 'Billing'].map((topic) => (
                  <button
                    key={topic}
                    onClick={() => setSelectedTopic(topic as Topic)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      selectedTopic === topic
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">Industry</h2>
              </div>
              <div className="p-2">
                {['All', 'Home Health', 'Private Duty', 'Hospice'].map((industry) => (
                  <button
                    key={industry}
                    onClick={() => setSelectedIndustry(industry as Industry)}
                    className={`w-full text-left px-3 py-2 rounded-lg text-sm ${
                      selectedIndustry === industry
                        ? 'bg-purple-50 text-purple-700'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex-1">
            <div className="bg-white rounded-lg border border-gray-200">
              <div className="p-4 border-b border-gray-200">
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                    <input
                      type="search"
                      placeholder="Search community content..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">Sort by:</span>
                    <button 
                      className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 flex items-center gap-2"
                    >
                      {sortBy === 'recent' && 'Most Recent'}
                      {sortBy === 'popular' && 'Most Popular'}
                      {sortBy === 'trending' && 'Trending'}
                      <ChevronDown size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-4">
                <div className="space-y-4">
                  {filteredContent.map((content) => {
                    const Icon = getTypeIcon(content.type);
                    const isExpanded = expandedContent === content.id;

                    return (
                      <div
                        key={content.id}
                        className="bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors"
                      >
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <Icon size={20} className="text-purple-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className="text-sm text-purple-600">
                                    {content.type === 'case-study' 
                                      ? 'Case Study'
                                      : content.type === 'best-practice'
                                      ? 'Best Practice'
                                      : 'Success Story'}
                                  </span>
                                  <span className="text-gray-300">·</span>
                                  <span className="text-sm text-gray-500">{content.topic}</span>
                                </div>
                                <h3 className="font-medium mb-2">{content.title}</h3>
                                <p className="text-gray-600 text-sm">{content.excerpt}</p>
                              </div>
                              <button
                                onClick={() => setExpandedContent(isExpanded ? null : content.id)}
                                className="ml-4 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-50"
                              >
                                <ChevronRight
                                  size={20}
                                  className={`transform transition-transform ${isExpanded ? 'rotate-90' : ''}`}
                                />
                              </button>
                            </div>

                            <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                              {content.agency && (
                                <div className="flex items-center gap-1">
                                  <Building2 size={14} />
                                  <span>{content.agency}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-1">
                                <Users size={14} />
                                <span>{content.views} views</span>
                              </div>
                              <div>{content.readTime} read</div>
                              <div>{content.date}</div>
                            </div>

                            {isExpanded && (
                              <div className="mt-6 space-y-6 border-t border-gray-100 pt-6">
                                {content.challenge && (
                                  <div>
                                    <h4 className="font-medium mb-2">Challenge</h4>
                                    <p className="text-gray-600">{content.challenge}</p>
                                  </div>
                                )}

                                {content.approach && (
                                  <div>
                                    <h4 className="font-medium mb-2">Approach</h4>
                                    <p className="text-gray-600">{content.approach}</p>
                                  </div>
                                )}

                                {content.outcome && (
                                  <div>
                                    <h4 className="font-medium mb-2">Outcome</h4>
                                    <p className="text-gray-600">{content.outcome}</p>
                                  </div>
                                )}

                                {content.takeaways && content.takeaways.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-2">Key Takeaways</h4>
                                    <ul className="list-disc list-inside space-y-1 text-gray-600">
                                      {content.takeaways.map((takeaway, index) => (
                                        <li key={index}>{takeaway}</li>
                                      ))}
                                    </ul>
                                  </div>
                                )}

                                {content.relatedLinks && content.relatedLinks.length > 0 && (
                                  <div>
                                    <h4 className="font-medium mb-2">Related Resources</h4>
                                    <div className="space-y-2">
                                      {content.relatedLinks.map((link, index) => (
                                        <a
                                          key={index}
                                          href={link.path}
                                          className="flex items-center gap-2 text-purple-600 hover:text-purple-700"
                                        >
                                          <ExternalLink size={14} />
                                          <span>{link.title}</span>
                                        </a>
                                      ))}
                                    </div>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default CommunityGuideView;