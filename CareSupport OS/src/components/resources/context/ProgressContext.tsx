import React, { createContext, useContext, useState, useEffect } from 'react';

interface ProgressContextType {
  setupProgress: {
    totalSteps: number;
    completedSteps: number;
    guides: Record<string, {
      status: 'Not Started' | 'In Progress' | 'Completed';
      completedSteps: number[];
    }>;
  };
  knowledgeProgress: {
    articlesRead: string[];
    bookmarks: string[];
    lastRead: string | null;
  };
  resourceProgress: {
    downloads: string[];
    recentlyViewed: string[];
    favorites: string[];
  };
  communityProgress: {
    contributionsCount: number;
    storiesRead: string[];
    bookmarks: string[];
  };
  updateSetupProgress: (guideId: string, stepIndex: number) => void;
  markGuideComplete: (guideId: string) => void;
  trackArticleRead: (articleId: string) => void;
  trackResourceDownload: (resourceId: string) => void;
  trackStoryRead: (storyId: string) => void;
  addBookmark: (itemId: string, type: 'article' | 'story') => void;
  addFavorite: (resourceId: string) => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

const TOTAL_SETUP_STEPS = 10; // Total number of steps across all guides

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState(() => {
    const savedProgress = localStorage.getItem('resourcesProgress');
    return savedProgress ? JSON.parse(savedProgress) : {
      setupProgress: {
        totalSteps: TOTAL_SETUP_STEPS,
        completedSteps: 0,
        guides: {}
      },
      knowledgeProgress: {
        articlesRead: [],
        bookmarks: [],
        lastRead: null
      },
      resourceProgress: {
        downloads: [],
        recentlyViewed: [],
        favorites: []
      },
      communityProgress: {
        contributionsCount: 0,
        storiesRead: [],
        bookmarks: []
      }
    };
  });

  // Save progress to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('resourcesProgress', JSON.stringify(progress));
  }, [progress]);

  const updateSetupProgress = (guideId: string, stepIndex: number) => {
    setProgress(prev => {
      const guide = prev.setupProgress.guides[guideId] || {
        status: 'Not Started',
        completedSteps: []
      };

      const updatedSteps = guide.completedSteps.includes(stepIndex)
        ? guide.completedSteps
        : [...guide.completedSteps, stepIndex];

      const updatedGuide = {
        ...guide,
        status: updatedSteps.length === 0 
          ? 'Not Started' 
          : updatedSteps.length === TOTAL_SETUP_STEPS 
          ? 'Completed' 
          : 'In Progress',
        completedSteps: updatedSteps
      };

      // Calculate total completed steps across all guides
      const totalCompleted = Object.values({
        ...prev.setupProgress.guides,
        [guideId]: updatedGuide
      }).reduce((sum, g) => sum + g.completedSteps.length, 0);

      return {
        ...prev,
        setupProgress: {
          ...prev.setupProgress,
          guides: {
            ...prev.setupProgress.guides,
            [guideId]: updatedGuide
          },
          completedSteps: totalCompleted
        }
      };
    });
  };

  const markGuideComplete = (guideId: string) => {
    setProgress(prev => {
      const allSteps = Array.from({ length: TOTAL_SETUP_STEPS }, (_, i) => i);
      
      return {
        ...prev,
        setupProgress: {
          ...prev.setupProgress,
          guides: {
            ...prev.setupProgress.guides,
            [guideId]: {
              status: 'Completed',
              completedSteps: allSteps
            }
          },
          completedSteps: prev.setupProgress.completedSteps + TOTAL_SETUP_STEPS
        }
      };
    });
  };

  const trackArticleRead = (articleId: string) => {
    setProgress(prev => ({
      ...prev,
      knowledgeProgress: {
        ...prev.knowledgeProgress,
        articlesRead: [...new Set([...prev.knowledgeProgress.articlesRead, articleId])],
        lastRead: articleId
      }
    }));
  };

  const trackResourceDownload = (resourceId: string) => {
    setProgress(prev => ({
      ...prev,
      resourceProgress: {
        ...prev.resourceProgress,
        downloads: [...new Set([...prev.resourceProgress.downloads, resourceId])],
        recentlyViewed: [
          resourceId,
          ...prev.resourceProgress.recentlyViewed.filter(id => id !== resourceId)
        ].slice(0, 10)
      }
    }));
  };

  const trackStoryRead = (storyId: string) => {
    setProgress(prev => ({
      ...prev,
      communityProgress: {
        ...prev.communityProgress,
        storiesRead: [...new Set([...prev.communityProgress.storiesRead, storyId])]
      }
    }));
  };

  const addBookmark = (itemId: string, type: 'article' | 'story') => {
    setProgress(prev => ({
      ...prev,
      [type === 'article' ? 'knowledgeProgress' : 'communityProgress']: {
        ...prev[type === 'article' ? 'knowledgeProgress' : 'communityProgress'],
        bookmarks: [...new Set([
          ...prev[type === 'article' ? 'knowledgeProgress' : 'communityProgress'].bookmarks,
          itemId
        ])]
      }
    }));
  };

  const addFavorite = (resourceId: string) => {
    setProgress(prev => ({
      ...prev,
      resourceProgress: {
        ...prev.resourceProgress,
        favorites: [...new Set([...prev.resourceProgress.favorites, resourceId])]
      }
    }));
  };

  return (
    <ProgressContext.Provider
      value={{
        ...progress,
        updateSetupProgress,
        markGuideComplete,
        trackArticleRead,
        trackResourceDownload,
        trackStoryRead,
        addBookmark,
        addFavorite
      }}
    >
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (context === undefined) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
}