import React from 'react';

interface StepIndicatorProps {
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStep }) => {
  const steps = ['Amount', 'Wallet', 'Verify', 'Order'];

  return (
    <div className="step-indicator flex justify-between mb-4 w-full">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`step ${index + 1 === currentStep ? 'active' : ''}`}
        >
          <span>{index + 1}</span>
          <p>{step}</p>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;