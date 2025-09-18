import React, { useState } from 'react';
import { X, Download, Share2, Printer, History, Link as LinkIcon, Eye, MessageSquare, Star, StarOff } from 'lucide-react';

interface Resource {
  id: string;
  name: string;
  description: string;
  category: string;
  format: string;
  lastUpdated: string;
  size: string;
  relatedArticle: string;
  downloadUrl: string;
  version?: string;
  versions?: {
    version: string;
    date: string;
    changes: string;
  }[];
  metadata?: {
    author?: string;
    lastModifiedBy?: string;
    tags?: string[];
    views?: number;
    downloads?: number;
    rating?: number;
    comments?: number;
  };
}

interface ResourcePreviewModalProps {
  resource: Resource;
  onClose: () => void;
  onDownload: () => void;
}

function ResourcePreviewModal({ resource, onClose, onDownload }: ResourcePreviewModalProps) {
  const [activeTab, setActiveTab] = useState<'preview' | 'details' | 'versions'>('preview');
  const [isFavorite, setIsFavorite] = useState(false);

  const handleShare = () => {
    // In a real app, this would open a sharing dialog
    console.log('Share resource:', resource.id);
  };

  const handlePrint = () => {
    // In a real app, this would trigger printing
    console.log('Print resource:', resource.id);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-6xl h-[90vh] flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-semibold">{resource.name}</h2>
              <p className="text-gray-600 mt-1">{resource.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsFavorite(!isFavorite)}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                {isFavorite ? <Star className="text-yellow-400" /> : <StarOff />}
              </button>
              <button
                onClick={handleShare}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title="Share"
              >
                <Share2 size={20} />
              </button>
              <button
                onClick={handlePrint}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title="Print"
              >
                <Printer size={20} />
              </button>
              <button
                onClick={onDownload}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
              >
                <Download size={16} />
                Download
              </button>
              <button
                onClick={onClose}
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
                title="Close"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <button
              onClick={() => setActiveTab('preview')}
              className={`pb-4 text-sm font-medium border-b-2 ${
                activeTab === 'preview'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Preview
            </button>
            <button
              onClick={() => setActiveTab('details')}
              className={`pb-4 text-sm font-medium border-b-2 ${
                activeTab === 'details'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Details
            </button>
            <button
              onClick={() => setActiveTab('versions')}
              className={`pb-4 text-sm font-medium border-b-2 ${
                activeTab === 'versions'
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              Version History
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden">
          {activeTab === 'preview' && (
            <div className="h-full flex">
              <div className="flex-1 bg-gray-100 p-8 overflow-auto">
                <div className="bg-white rounded-lg shadow-lg p-8 max-w-4xl mx-auto">
                  {/* This would be replaced with an actual document preview */}
                  <div className="aspect-[8.5/11] bg-gray-50 rounded-lg flex items-center justify-center">
                    <Eye size={48} className="text-gray-300" />
                  </div>
                </div>
              </div>
              <div className="w-80 border-l border-gray-200 p-6 overflow-auto">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900 mb-2">Resource Info</h3>
                    <dl className="space-y-2 text-sm">
                      <div>
                        <dt className="text-gray-500">Format</dt>
                        <dd className="font-medium">{resource.format}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Size</dt>
                        <dd className="font-medium">{resource.size}</dd>
                      </div>
                      <div>
                        <dt className="text-gray-500">Last Updated</dt>
                        <dd className="font-medium">{resource.lastUpdated}</dd>
                      </div>
                    </dl>
                  </div>

                  {resource.metadata && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Usage Statistics</h3>
                      <dl className="space-y-2 text-sm">
                        <div className="flex items-center justify-between">
                          <dt className="text-gray-500">Views</dt>
                          <dd className="font-medium">{resource.metadata.views}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-gray-500">Downloads</dt>
                          <dd className="font-medium">{resource.metadata.downloads}</dd>
                        </div>
                        <div className="flex items-center justify-between">
                          <dt className="text-gray-500">Comments</dt>
                          <dd className="font-medium">{resource.metadata.comments}</dd>
                        </div>
                      </dl>
                    </div>
                  )}

                  {resource.metadata?.tags && resource.metadata.tags.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-900 mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {resource.metadata.tags.map((tag, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'details' && (
            <div className="p-6 overflow-auto">
              <div className="max-w-3xl space-y-8">
                <div>
                  <h3 className="text-lg font-medium mb-4">Resource Details</h3>
                  <dl className="grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Category</dt>
                      <dd className="mt-1">{resource.category}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Format</dt>
                      <dd className="mt-1">{resource.format}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Size</dt>
                      <dd className="mt-1">{resource.size}</dd>
                    </div>
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                      <dd className="mt-1">{resource.lastUpdated}</dd>
                    </div>
                    {resource.metadata?.author && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Author</dt>
                        <dd className="mt-1">{resource.metadata.author}</dd>
                      </div>
                    )}
                    {resource.metadata?.lastModifiedBy && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Last Modified By</dt>
                        <dd className="mt-1">{resource.metadata.lastModifiedBy}</dd>
                      </div>
                    )}
                  </dl>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-4">Related Resources</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <a
                      href={resource.relatedArticle}
                      className="flex items-start gap-3 p-4 rounded-lg border border-gray-200 hover:border-purple-200"
                    >
                      <LinkIcon size={20} className="text-purple-600" />
                      <div>
                        <div className="font-medium">Usage Guide</div>
                        <div className="text-sm text-gray-500">Learn how to use this resource</div>
                      </div>
                    </a>
                  </div>
                </div>

                {resource.metadata?.comments && resource.metadata.comments > 0 && (
                  <div>
                    <h3 className="text-lg font-medium mb-4">Comments</h3>
                    <div className="space-y-4">
                      <div className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg">
                        <MessageSquare size={20} className="text-gray-400" />
                        <div>
                          <div className="font-medium">John Doe</div>
                          <div className="text-sm text-gray-500">2 days ago</div>
                          <div className="mt-2">This template has been very helpful!</div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'versions' && (
            <div className="p-6 overflow-auto">
              <div className="max-w-3xl">
                <h3 className="text-lg font-medium mb-4">Version History</h3>
                <div className="space-y-6">
                  {resource.versions?.map((version, index) => (
                    <div key={index} className="flex items-start gap-3">
                      <div className="relative">
                        <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center">
                          <History size={14} className="text-purple-600" />
                        </div>
                        {index < (resource.versions?.length || 0) - 1 && (
                          <div className="absolute top-6 left-3 w-px h-8 bg-gray-200" />
                        )}
                      </div>
                      <div>
                        <div className="text-sm font-medium">{version.version}</div>
                        <div className="text-sm text-gray-500">{version.date}</div>
                        <div className="text-sm text-gray-600 mt-1">{version.changes}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ResourcePreviewModal;