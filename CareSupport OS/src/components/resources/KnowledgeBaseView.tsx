import React, { useState } from 'react';
import { ArrowLeft, Search, BookOpen, Clock, AlertCircle, Calendar, CreditCard, Shield, Users, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Mock data for articles
const articles = [
  {
    id: 'evv-requirements',
    category: 'EVV & Scheduling',
    title: 'EVV Requirements by State',
    description: 'Learn about Electronic Visit Verification requirements and compliance standards for each state.',
    lastUpdated: '2024-04-15',
    readTime: '5 min'
  },
  {
    id: 'billing-denials',
    category: 'Billing & Claims',
    title: 'Common Claim Denials and Prevention',
    description: 'Understanding frequent claim denials and steps to prevent them.',
    lastUpdated: '2024-04-14',
    readTime: '8 min'
  },
  {
    id: 'compliance-controls',
    category: 'Compliance & Audits',
    title: 'Compliance Controls 101',
    description: 'A comprehensive guide to understanding and implementing compliance controls.',
    lastUpdated: '2024-04-13',
    readTime: '10 min'
  }
];

const categories = [
  {
    name: 'EVV & Scheduling',
    icon: Calendar,
    description: 'Visit verification and scheduling management',
    articleCount: 12
  },
  {
    name: 'Billing & Claims',
    icon: CreditCard,
    description: 'Claims processing and payment management',
    articleCount: 15
  },
  {
    name: 'Compliance & Audits',
    icon: Shield,
    description: 'Regulatory compliance and audit preparation',
    articleCount: 18
  },
  {
    name: 'Caregiver Management',
    icon: Users,
    description: 'Caregiver onboarding and credential tracking',
    articleCount: 10
  }
];

function KnowledgeBaseView() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredArticles = articles.filter(article => {
    const matchesSearch = article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         article.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || article.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

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

        <header className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-semibold">Knowledge Base</h1>
              <p className="text-gray-600 mt-2">Detailed documentation and guides for CareSupport.com</p>
            </div>
            <div className="relative w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="search"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
                role="search"
              />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-4 gap-6">
          <div className="col-span-1 space-y-6">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="p-4 border-b border-gray-200">
                <h2 className="font-medium">Categories</h2>
              </div>
              <div className="p-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`w-full text-left px-2 py-2 rounded-lg text-sm ${
                    !selectedCategory ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  All Articles
                </button>
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className={`w-full text-left px-2 py-2 rounded-lg text-sm ${
                      selectedCategory === category.name ? 'bg-purple-50 text-purple-700' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                    <span className="float-right text-gray-400">{category.articleCount}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg border border-purple-200 p-4">
              <h3 className="font-medium mb-2">Need More Help?</h3>
              <p className="text-sm text-gray-600 mb-4">Can't find what you're looking for?</p>
              <button className="w-full px-4 py-2 bg-white text-purple-600 rounded-lg border border-purple-200 hover:border-purple-300 text-sm">
                Contact Support
              </button>
            </div>
          </div>

          <div className="col-span-3">
            {!selectedCategory && !searchQuery && (
              <div className="grid grid-cols-2 gap-6 mb-8">
                {categories.map((category) => (
                  <button
                    key={category.name}
                    onClick={() => setSelectedCategory(category.name)}
                    className="bg-white p-6 rounded-lg border border-gray-200 text-left hover:border-purple-200 transition-colors"
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                        <category.icon className="text-purple-600" size={20} />
                      </div>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-sm text-gray-500">
                      <span>{category.articleCount} articles</span>
                      <ChevronRight size={16} />
                    </div>
                  </button>
                ))}
              </div>
            )}

            <div className="space-y-4">
              {selectedCategory && (
                <h2 className="text-lg font-medium mb-4">{selectedCategory}</h2>
              )}
              {searchQuery && (
                <p className="text-sm text-gray-500 mb-4">
                  {filteredArticles.length} results for "{searchQuery}"
                </p>
              )}
              {filteredArticles.map((article) => (
                <a
                  key={article.id}
                  href={`/resources/knowledge-base/${article.id}`}
                  className="block bg-white p-6 rounded-lg border border-gray-200 hover:border-purple-200 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-sm text-purple-600 mb-1">{article.category}</div>
                      <h3 className="font-medium mb-2">{article.title}</h3>
                      <p className="text-gray-600 text-sm">{article.description}</p>
                    </div>
                    <ChevronRight size={16} className="text-gray-400 mt-1" />
                  </div>
                  <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      <span>{article.readTime} read</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <AlertCircle size={14} />
                      <span>Updated {article.lastUpdated}</span>
                    </div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default KnowledgeBaseView;