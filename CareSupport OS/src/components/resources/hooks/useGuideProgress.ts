import { useState } from 'react';

interface GuideProgress {
  status: 'Not Started' | 'In Progress' | 'Completed';
  completedSteps: number[];
  progress: number;
  completeStep: (stepIndex: number) => void;
  isStepCompleted: (stepIndex: number) => void;
  markComplete: () => void;
}

export function useGuideProgress(guideId: string): GuideProgress {
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [status, setStatus] = useState<'Not Started' | 'In Progress' | 'Completed'>('Not Started');

  const completeStep = (stepIndex: number) => {
    if (!completedSteps.includes(stepIndex)) {
      const newSteps = [...completedSteps, stepIndex];
      setCompletedSteps(newSteps);
      setStatus(newSteps.length === 0 ? 'Not Started' : newSteps.length < 3 ? 'In Progress' : 'Completed');
    }
  };

  const isStepCompleted = (stepIndex: number) => {
    return completedSteps.includes(stepIndex);
  };

  const calculateProgress = () => {
    return Math.round((completedSteps.length / 3) * 100);
  };

  const markComplete = () => {
    setCompletedSteps([0, 1, 2]);
    setStatus('Completed');
  };

  return {
    status,
    completedSteps,
    progress: calculateProgress(),
    completeStep,
    isStepCompleted,
    markComplete
  };
}