import { z } from 'zod';

// Define search result types
export const SearchResultSchema = z.object({
  id: z.string(),
  type: z.enum(['guide', 'article', 'template', 'story']),
  title: z.string(),
  description: z.string(),
  category: z.string(),
  url: z.string(),
  lastUpdated: z.string().optional(),
  metadata: z.record(z.string(), z.any()).optional()
});

export type SearchResult = z.infer<typeof SearchResultSchema>;

export type SearchFilters = {
  types?: string[];
  categories?: string[];
  dateRange?: {
    start: Date;
    end: Date;
  };
};

export class SearchService {
  private static searchIndex: Map<string, SearchResult> = new Map();
  private static initialized = false;

  /**
   * Initialize the search index
   */
  static async initialize() {
    if (this.initialized) return;

    // In a real app, this would load data from an API
    // For now, we'll use mock data
    const mockResults: SearchResult[] = [
      {
        id: 'guide-1',
        type: 'guide',
        title: 'Agency Setup Guide',
        description: 'Complete guide to setting up your agency in CareSupport.com',
        category: 'Getting Started',
        url: '/resources/getting-started/agency-setup',
        lastUpdated: '2024-04-15',
        metadata: {
          estimatedTime: '30 min',
          progress: 0
        }
      },
      {
        id: 'article-1',
        type: 'article',
        title: 'Understanding EVV Requirements',
        description: 'Comprehensive overview of Electronic Visit Verification requirements',
        category: 'Knowledge Base',
        url: '/resources/knowledge-base/evv-requirements',
        lastUpdated: '2024-04-14',
        metadata: {
          readTime: '10 min',
          views: 156
        }
      },
      {
        id: 'template-1',
        type: 'template',
        title: 'Care Plan Template',
        description: 'Standardized template for creating client care plans',
        category: 'Resource Library',
        url: '/resources/library/care-plan-template',
        lastUpdated: '2024-04-13',
        metadata: {
          format: 'DOCX',
          downloads: 89
        }
      }
    ];

    // Index the mock results
    mockResults.forEach(result => {
      this.searchIndex.set(result.id, result);
    });

    this.initialized = true;
  }

  /**
   * Search for resources
   */
  static async search(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
    await this.initialize();

    if (!query && !filters) {
      return Array.from(this.searchIndex.values());
    }

    const results = Array.from(this.searchIndex.values()).filter(result => {
      // Apply text search
      if (query) {
        const searchText = `${result.title} ${result.description} ${result.category}`.toLowerCase();
        if (!searchText.includes(query.toLowerCase())) {
          return false;
        }
      }

      // Apply filters
      if (filters) {
        // Filter by type
        if (filters.types?.length && !filters.types.includes(result.type)) {
          return false;
        }

        // Filter by category
        if (filters.categories?.length && !filters.categories.includes(result.category)) {
          return false;
        }

        // Filter by date range
        if (filters.dateRange && result.lastUpdated) {
          const date = new Date(result.lastUpdated);
          if (
            date < filters.dateRange.start ||
            date > filters.dateRange.end
          ) {
            return false;
          }
        }
      }

      return true;
    });

    // Sort results by relevance (in a real app, this would be more sophisticated)
    return results.sort((a, b) => {
      if (query) {
        const aTitle = a.title.toLowerCase();
        const bTitle = b.title.toLowerCase();
        const queryLower = query.toLowerCase();

        // Exact matches in title come first
        if (aTitle === queryLower && bTitle !== queryLower) return -1;
        if (bTitle === queryLower && aTitle !== queryLower) return 1;

        // Then partial matches in title
        if (aTitle.includes(queryLower) && !bTitle.includes(queryLower)) return -1;
        if (bTitle.includes(queryLower) && !aTitle.includes(queryLower)) return 1;
      }

      // Finally sort by last updated date
      return new Date(b.lastUpdated || 0).getTime() - new Date(a.lastUpdated || 0).getTime();
    });
  }

  /**
   * Get search suggestions based on partial query
   */
  static async getSuggestions(query: string): Promise<string[]> {
    await this.initialize();

    if (!query) return [];

    const results = Array.from(this.searchIndex.values())
      .filter(result => {
        const searchText = `${result.title} ${result.category}`.toLowerCase();
        return searchText.includes(query.toLowerCase());
      })
      .slice(0, 5);

    return results.map(result => result.title);
  }

  /**
   * Track search analytics
   */
  static async trackSearch(query: string, resultCount: number) {
    // In a real app, this would send analytics data to the backend
    console.log('Search tracked:', { query, resultCount });
  }
}