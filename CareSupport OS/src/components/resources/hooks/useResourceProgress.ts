import { useProgress } from '../context/ProgressContext';

export function useResourceProgress() {
  const progress = useProgress();

  const calculateOverallProgress = () => {
    const setupWeight = 0.4;
    const knowledgeWeight = 0.2;
    const resourceWeight = 0.2;
    const communityWeight = 0.2;

    const setupProgress = progress.setupProgress.completedSteps / progress.setupProgress.totalSteps;
    const knowledgeProgress = progress.knowledgeProgress.articlesRead.length / 100; // Assuming 100 articles total
    const resourceProgress = progress.resourceProgress.downloads.length / 50; // Assuming 50 resources total
    const communityProgress = progress.communityProgress.storiesRead.length / 30; // Assuming 30 stories total

    return Math.round(
      (setupProgress * setupWeight +
      knowledgeProgress * knowledgeWeight +
      resourceProgress * resourceWeight +
      communityProgress * communityWeight) * 100
    );
  };

  const getNextRecommendations = () => {
    const recommendations = [];

    // Check setup progress
    if (progress.setupProgress.completedSteps < progress.setupProgress.totalSteps) {
      recommendations.push({
        type: 'setup',
        message: 'Complete your agency setup',
        path: '/resources/getting-started'
      });
    }

    // Check knowledge base progress
    if (progress.knowledgeProgress.articlesRead.length < 5) {
      recommendations.push({
        type: 'knowledge',
        message: 'Read key articles in the Knowledge Base',
        path: '/resources/knowledge-base'
      });
    }

    // Check resource usage
    if (progress.resourceProgress.downloads.length < 3) {
      recommendations.push({
        type: 'resource',
        message: 'Download essential templates',
        path: '/resources/library'
      });
    }

    return recommendations;
  };

  return {
    calculateOverallProgress,
    getNextRecommendations,
    ...progress
  };
}