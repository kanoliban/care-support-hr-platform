import React from 'react';

interface WizardStep {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ size: number; className?: string }>;
}

interface WizardProgressProps {
  steps: WizardStep[];
  currentStep: string;
  onStepClick?: (stepId: string) => void;
}

function WizardProgress({ steps, currentStep, onStepClick }: WizardProgressProps) {
  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="mb-8">
      {/* Step Progress */}
      <div className="flex items-center gap-2 mb-6">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <button
              onClick={() => onStepClick?.(step.id)}
              className={`group flex items-center gap-2 ${
                onStepClick ? 'cursor-pointer' : 'cursor-default'
              }`}
            >
              <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                currentStep === step.id
                  ? 'bg-purple-600 text-white'
                  : index < currentStepIndex
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-100 text-gray-400'
              }`}>
                {index < currentStepIndex ? (
                  <CheckCircle size={16} />
                ) : (
                  <step.icon size={16} />
                )}
              </div>
              <div className={`hidden md:block transition-colors ${
                currentStep === step.id
                  ? 'text-gray-900'
                  : index < currentStepIndex
                  ? 'text-gray-700'
                  : 'text-gray-400'
              }`}>
                <div className="text-sm font-medium">{step.title}</div>
                <div className="text-xs">{step.description}</div>
              </div>
            </button>
            {index < steps.length - 1 && (
              <div className={`flex-1 h-0.5 transition-colors ${
                index < currentStepIndex ? 'bg-green-100' : 'bg-gray-100'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>

      {/* Current Step Context */}
      <div className="md:hidden">
        <h3 className="text-lg font-medium">{steps[currentStepIndex].title}</h3>
        <p className="text-sm text-gray-500">{steps[currentStepIndex].description}</p>
      </div>
    </div>
  );
}

export default WizardProgress;