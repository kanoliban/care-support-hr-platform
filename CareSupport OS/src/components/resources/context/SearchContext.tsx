import React, { createContext, useContext, useState, useCallback } from 'react';
import { SearchService, SearchResult, SearchFilters } from '../services/SearchService';

interface SearchContextType {
  query: string;
  results: SearchResult[];
  suggestions: string[];
  filters: SearchFilters;
  isSearching: boolean;
  setQuery: (query: string) => void;
  setFilters: (filters: SearchFilters) => void;
  clearSearch: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({ children }: { children: React.ReactNode }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [isSearching, setIsSearching] = useState(false);

  // Debounced search function
  const debouncedSearch = useCallback(
    async (searchQuery: string, searchFilters: SearchFilters) => {
      setIsSearching(true);
      try {
        const searchResults = await SearchService.search(searchQuery, searchFilters);
        setResults(searchResults);
        
        // Track search analytics
        await SearchService.trackSearch(searchQuery, searchResults.length);
      } catch (error) {
        console.error('Search failed:', error);
        setResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    []
  );

  // Update suggestions when query changes
  const updateSuggestions = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery) {
        setSuggestions([]);
        return;
      }

      try {
        const newSuggestions = await SearchService.getSuggestions(searchQuery);
        setSuggestions(newSuggestions);
      } catch (error) {
        console.error('Failed to get suggestions:', error);
        setSuggestions([]);
      }
    },
    []
  );

  // Handle query changes
  const handleQueryChange = useCallback(
    (newQuery: string) => {
      setQuery(newQuery);
      updateSuggestions(newQuery);
      debouncedSearch(newQuery, filters);
    },
    [filters, debouncedSearch, updateSuggestions]
  );

  // Handle filter changes
  const handleFilterChange = useCallback(
    (newFilters: SearchFilters) => {
      setFilters(newFilters);
      debouncedSearch(query, newFilters);
    },
    [query, debouncedSearch]
  );

  const clearSearch = useCallback(() => {
    setQuery('');
    setResults([]);
    setSuggestions([]);
    setFilters({});
  }, []);

  return (
    <SearchContext.Provider
      value={{
        query,
        results,
        suggestions,
        filters,
        isSearching,
        setQuery: handleQueryChange,
        setFilters: handleFilterChange,
        clearSearch
      }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
}