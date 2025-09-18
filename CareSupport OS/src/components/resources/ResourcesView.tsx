import React from 'react';
import { BookOpen, Search, Lightbulb, FileText, Users } from 'lucide-react';
import ProgressOverview from './ProgressOverview';

function ResourcesView() {
  return (
    <main className="flex-1 overflow-auto">
      <div className="p-8">
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-semibold">Resources</h1>
            <p className="text-gray-600">Helpful Guides and Shared Knowledge</p>
          </div>
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="search"
              placeholder="Search all resources..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg"
              role="search"
            />
          </div>
        </header>

        <ProgressOverview />

        <div className="grid grid-cols-2 gap-6 mt-8">
          <section 
              className="bg-white p-6 rounded-lg border border-gray-200"
              role="region"
              aria-label="Getting Started"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Lightbulb className="text-purple-600" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-2">Getting Started</h2>
                  <p className="text-gray-600 mb-4">Quick start guides and tutorials to help you set up your agency and start using CareSupport.com effectively.</p>
                  <div className="space-y-2">
                    <a href="/resources/getting-started/agency-setup" className="block text-purple-600 hover:text-purple-700">
                      Agency Setup Guide
                    </a>
                    <a href="/resources/getting-started/first-client" className="block text-purple-600 hover:text-purple-700">
                      Adding Your First Client
                    </a>
                    <a href="/resources/getting-started/scheduling-basics" className="block text-purple-600 hover:text-purple-700">
                      Scheduling Basics
                    </a>
                  </div>
                  <a href="/resources/getting-started" className="inline-flex items-center mt-4 text-sm font-medium text-purple-600 hover:text-purple-700">
                    View all guides
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </section>

            <section 
              className="bg-white p-6 rounded-lg border border-gray-200"
              role="region"
              aria-label="Knowledge Base"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="text-blue-600" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-2">Knowledge Base</h2>
                  <p className="text-gray-600 mb-4">Comprehensive documentation, FAQs, and troubleshooting guides for all CareSupport.com features.</p>
                  <div className="space-y-2">
                    <a href="/resources/knowledge-base/compliance" className="block text-purple-600 hover:text-purple-700">
                      Compliance Guide
                    </a>
                    <a href="/resources/knowledge-base/billing" className="block text-purple-600 hover:text-purple-700">
                      Billing & Claims
                    </a>
                    <a href="/resources/knowledge-base/evv" className="block text-purple-600 hover:text-purple-700">
                      EVV Requirements
                    </a>
                  </div>
                  <a href="/resources/knowledge-base" className="inline-flex items-center mt-4 text-sm font-medium text-purple-600 hover:text-purple-700">
                    Browse all articles
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </section>

            <section 
              className="bg-white p-6 rounded-lg border border-gray-200"
              role="region"
              aria-label="Resource Library"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <FileText className="text-green-600" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-2">Resource Library</h2>
                  <p className="text-gray-600 mb-4">Download ready-to-use templates, forms, and checklists for your agency's daily operations.</p>
                  <div className="space-y-2">
                    <a href="/resources/library/onboarding" className="block text-purple-600 hover:text-purple-700">
                      Onboarding Checklists
                    </a>
                    <a href="/resources/library/care-plans" className="block text-purple-600 hover:text-purple-700">
                      Care Plan Templates
                    </a>
                    <a href="/resources/library/policies" className="block text-purple-600 hover:text-purple-700">
                      Policy Templates
                    </a>
                  </div>
                  <a href="/resources/library" className="inline-flex items-center mt-4 text-sm font-medium text-purple-600 hover:text-purple-700">
                    View all resources
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </section>

            <section 
              className="bg-white p-6 rounded-lg border border-gray-200"
              role="region"
              aria-label="Community Guide"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="text-orange-600" size={24} />
                </div>
                <div>
                  <h2 className="text-lg font-medium mb-2">Community Guide</h2>
                  <p className="text-gray-600 mb-4">Learn from success stories and best practices shared by other agencies using CareSupport.com.</p>
                  <div className="space-y-2">
                    <a href="/resources/community/case-studies" className="block text-purple-600 hover:text-purple-700">
                      Agency Case Studies
                    </a>
                    <a href="/resources/community/best-practices" className="block text-purple-600 hover:text-purple-700">
                      Best Practices
                    </a>
                    <a href="/resources/community/success-stories" className="block text-purple-600 hover:text-purple-700">
                      Success Stories
                    </a>
                  </div>
                  <a href="/resources/community" className="inline-flex items-center mt-4 text-sm font-medium text-purple-600 hover:text-purple-700">
                    Explore community
                    <svg className="ml-1 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </a>
                </div>
              </div>
            </section>
        </div>
      </div>
    </main>
  );
}

export default ResourcesView;